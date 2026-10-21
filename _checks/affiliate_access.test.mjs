import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createAdminServer } from '../_admin/server.mjs';
import { encodeContent } from '../_admin/assets/affiliate-core.mjs';

const catalog = { version: 1, products: [{ id: 'prueba', name: 'Producto privado', category: 'Baterías', model_ids: [], notes: '', offers: [{ store: 'amazon', url: 'https://amzn.to/prueba', status: 'active' }] }] };
const sha = 'a'.repeat(40), nextSha = 'b'.repeat(40);
const config = { repository: 'toperc/toperc.github.io', branch: 'codex/poc-afiliados', allowed_user_ids: [5599011] };
const origin = 'http://localhost:4174';
const jsonResponse = (data, status = 200) => new Response(JSON.stringify(data), { status });
async function fixture(t, options = {}) {
  const calls = []; let clock = 1_000_000;
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    const token = init.headers.Authorization;
    if (token === 'Bearer invalid') return jsonResponse({}, 401);
    if (url.endsWith('/user')) return jsonResponse({ id: token === 'Bearer outsider' ? 999 : 5599011, login: 'dgarana' });
    if (url.endsWith('/repos/toperc/toperc.github.io')) return jsonResponse({ permissions: { push: token !== 'Bearer readonly' } });
    if (init.method === 'PUT') {
      const payload = JSON.parse(init.body);
      return payload.sha === sha ? jsonResponse({ content: { sha: nextSha }, commit: { sha: 'c'.repeat(40) } }) : jsonResponse({}, 409);
    }
    return jsonResponse({ content: encodeContent(JSON.stringify(catalog)), encoding: 'base64', sha });
  };
  const server = await createAdminServer({ config, origin, fetchImpl, now: () => clock, ...options });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
  const base = `http://127.0.0.1:${server.address().port}`;
  const request = (path, init = {}) => fetch(base + path, { redirect: 'manual', ...init });
  const login = async (token = 'allowed') => {
    const res = await request('/api/login', { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) });
    return { response: res, cookie: res.headers.get('set-cookie')?.split(';')[0] };
  };
  return { request, login, calls, advance: ms => { clock += ms; } };
}
test('sin sesión solo se entrega la pantalla de acceso, nunca el editor ni su API', async t => {
  const { request } = await fixture(t);
  for (const path of ['/admin/afiliados', '/admin/afiliados/', '/admin/afiliados/index.html']) {
    const res = await request(path); assert.equal(res.status, 303); assert.equal(res.headers.get('location'), '/admin/afiliados/acceso/');
    assert.ok(!(await res.text()).includes('product-form'));
  }
  for (const path of ['/api/session', '/api/catalog', '/api/context', '/admin/afiliados/assets/affiliate-admin.mjs', '/admin/afiliados/assets/affiliate-core.mjs']) {
    const res = await request(path); assert.equal(res.status, 401); assert.ok(!(await res.text()).includes('Producto privado'));
  }
  const login = await request('/admin/afiliados/acceso/', { headers: { 'Sec-Fetch-Site': 'cross-site' } });
  assert.equal(login.status, 200); const text = await login.text(); assert.ok(text.includes('login-form')); assert.ok(!text.includes('product-form'));
});
test('rechaza otras identidades, permisos insuficientes, cookies inventadas y credenciales inválidas', async t => {
  const { request, login } = await fixture(t);
  for (const [token, status] of [['outsider', 403], ['readonly', 403], ['invalid', 401]]) {
    const result = await login(token); assert.equal(result.response.status, status); assert.equal(result.cookie, undefined);
  }
  assert.equal((await request('/api/catalog', { headers: { Cookie: 'toperc_admin_dev=inventado' } })).status, 401);
});
test('la identidad autorizada obtiene una sesión opaca, editor y catálogo; nunca recibe el token', async t => {
  const { request, login } = await fixture(t);
  const { response, cookie } = await login(); assert.equal(response.status, 200);
  const header = response.headers.get('set-cookie');
  assert.match(header, /HttpOnly/); assert.match(header, /SameSite=Strict/); assert.match(header, /Max-Age=1800/); assert.ok(!header.includes('allowed'));
  const sessionRes = await request('/api/session', { headers: { Cookie: cookie } });
  const session = await sessionRes.json(); assert.equal(session.login, 'dgarana'); assert.ok(session.csrf); assert.equal(session.token, undefined);
  const editor = await request('/admin/afiliados/', { headers: { Cookie: cookie } }); assert.equal(editor.status, 200); assert.ok((await editor.text()).includes('product-form'));
  const data = await request('/api/catalog', { headers: { Cookie: cookie } }); assert.equal(data.status, 200); assert.deepEqual(await data.json(), { catalog, sha });
  assert.equal(data.headers.get('cache-control'), 'no-store, private'); assert.match(data.headers.get('content-security-policy'), /frame-ancestors 'none'/);
});
test('guardar y salir exigen origen y token CSRF; la API mantiene el SHA de cada pestaña', async t => {
  const { request, login, calls } = await fixture(t); const { cookie } = await login();
  const session = await (await request('/api/session', { headers: { Cookie: cookie } })).json();
  const options = { method: 'PUT', headers: { Cookie: cookie, Origin: origin, 'Content-Type': 'application/json', 'X-CSRF-Token': session.csrf }, body: JSON.stringify({ catalog, sha }) };
  assert.equal((await request('/api/catalog', { ...options, headers: { ...options.headers, Origin: 'https://evil.example' } })).status, 403);
  assert.equal((await request('/api/catalog', { ...options, headers: { ...options.headers, 'X-CSRF-Token': 'bad' } })).status, 403);
  assert.equal(calls.filter(c => c.init.method === 'PUT').length, 0);
  const saved = await request('/api/catalog', options); assert.equal(saved.status, 200); assert.equal((await saved.json()).sha, nextSha);
  assert.equal(JSON.parse(calls.find(c => c.init.method === 'PUT').init.body).branch, config.branch);
  const stale = await request('/api/catalog', { ...options, body: JSON.stringify({ catalog, sha: 'd'.repeat(40) }) }); assert.equal(stale.status, 409);
  const logout = await request('/api/logout', { method: 'POST', headers: options.headers, body: '{}' }); assert.equal(logout.status, 200); assert.match(logout.headers.get('set-cookie'), /Max-Age=0/);
  assert.equal((await request('/api/catalog', { headers: { Cookie: cookie } })).status, 401);
});
test('la sesión caduca y las rutas antiguas o privadas no permiten saltarse el acceso', async t => {
  const { request, login, advance } = await fixture(t); const { cookie } = await login(); advance(30 * 60 * 1000 + 1);
  assert.equal((await request('/api/catalog', { headers: { Cookie: cookie } })).status, 401);
  for (const path of ['/assets/affiliate-catalog.json', '/assets/affiliate-context.json', '/assets/affiliate-admin.mjs', '/_admin/index.html', '/_data/affiliate_links.json', '/%5fadmin/server.mjs']) assert.equal((await request(path)).status, 404, path);
});
test('limita intentos y no acepta contraseñas enviadas desde otro origen', async t => {
  const { request, login } = await fixture(t);
  const foreign = await request('/api/login', { method: 'POST', headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' }, body: '{"token":"allowed"}' }); assert.equal(foreign.status, 403);
  for (let i = 0; i < 8; i++) assert.equal((await login('invalid')).response.status, 401);
  const blocked = (await login()).response; assert.equal(blocked.status, 429); assert.ok(blocked.headers.get('retry-after'));
});
test('fuera de localhost exige HTTPS y usa cookies Secure sin dominio', async t => {
  await assert.rejects(createAdminServer({ config, origin: 'http://gestor.example.com' }), /HTTPS/);
  await assert.rejects(createAdminServer({ config: { ...config, allowed_user_ids: [] } }), /lista explícita/);
  const { request } = await fixture(t, { origin: 'https://gestor.example.com' });
  const res = await request('/api/login', { method: 'POST', headers: { Origin: 'https://gestor.example.com', 'Content-Type': 'application/json' }, body: '{"token":"allowed"}' });
  assert.equal(res.status, 200); const header = res.headers.get('set-cookie'); assert.match(header, /^__Host-toperc_admin=/); assert.match(header, /; Secure/); assert.ok(!header.includes('Domain='));
});
