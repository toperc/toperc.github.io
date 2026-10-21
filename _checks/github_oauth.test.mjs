import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { once } from 'node:events';
import { GitHubOAuth, GitHubAppSetup, setupPage } from '../_admin/github-oauth.mjs';
import { createAdminServer } from '../_admin/server.mjs';
import { encodeContent } from '../_admin/assets/affiliate-core.mjs';

const origin = 'http://localhost:4174';
const credentials = { clientId: 'Iv1.test', clientSecret: 'test-secret-only', appSlug: 'toperc-test' };
const config = { repository: 'toperc/toperc.github.io', repository_id: 880503063, branch: 'codex/poc-afiliados', allowed_user_ids: [5599011] };
const response = (data, status = 200) => new Response(JSON.stringify(data), { status });
const tokenResponse = () => response({ access_token: 'ghu_test', token_type: 'bearer', expires_in: 28800, refresh_token: 'never-retained' });

test('OAuth usa estado aleatorio, cookie de navegador y PKCE sin enviar secretos a la autorización', async () => {
  const calls = [];
  const oauth = new GitHubOAuth({ ...credentials, origin, repositoryId: config.repository_id, fetchImpl: async (url, init) => { calls.push({ url, init }); return tokenResponse(); } });
  const flow = oauth.start(), url = new URL(flow.url);
  assert.equal(url.origin, 'https://github.com'); assert.equal(url.pathname, '/login/oauth/authorize');
  assert.equal(url.searchParams.get('code_challenge_method'), 'S256'); assert.equal(url.searchParams.get('redirect_uri'), origin + '/auth/github/callback');
  assert.ok(!url.href.includes('test-secret')); assert.equal(url.searchParams.get('scope'), null);
  const result = await oauth.finish({ state: url.searchParams.get('state'), browser: flow.browser, code: 'valid-code' });
  const payload = JSON.parse(calls[0].init.body);
  assert.equal(createHash('sha256').update(payload.code_verifier).digest('base64url'), url.searchParams.get('code_challenge'));
  assert.equal(payload.repository_id, config.repository_id); assert.equal(payload.client_secret, credentials.clientSecret);
  assert.equal(calls[0].url, 'https://github.com/login/oauth/access_token'); assert.equal(calls[0].init.redirect, 'error');
  assert.deepEqual(result, { token: 'ghu_test', ttl: 1800000 }); assert.ok(!JSON.stringify(oauth).includes('test-secret')); assert.ok(!JSON.stringify(result).includes('never-retained'));
  await assert.rejects(oauth.finish({ state: url.searchParams.get('state'), browser: flow.browser, code: 'valid-code' }), /no es válido/);
});
test('rechaza estado ausente, navegador distinto, caducidad y cancelación sin intercambiar códigos', async () => {
  let clock = 0, calls = 0;
  const oauth = new GitHubOAuth({ ...credentials, origin, now: () => clock, fetchImpl: async () => { calls++; return tokenResponse(); } });
  const flow = oauth.start(), state = new URL(flow.url).searchParams.get('state');
  await assert.rejects(oauth.finish({ state: 'other', browser: flow.browser, code: 'x' }), /no es válido/);
  await assert.rejects(oauth.finish({ state, browser: 'other', code: 'x' }), /no es válido/);
  clock = 600001; await assert.rejects(oauth.finish({ state, browser: flow.browser, code: 'x' }), /caducado/);
  const second = oauth.start(); await assert.rejects(oauth.finish({ state: new URL(second.url).searchParams.get('state'), browser: second.browser, error: 'access_denied' }), /cancelado/);
  assert.equal(calls, 0);
});
test('los errores de GitHub no filtran códigos, credenciales ni respuestas internas', async () => {
  const oauth = new GitHubOAuth({ ...credentials, origin, fetchImpl: async () => response({ error: 'incorrect_client_credentials', error_description: 'test-secret-only' }) });
  const flow = oauth.start();
  await assert.rejects(oauth.finish({ state: new URL(flow.url).searchParams.get('state'), browser: flow.browser, code: 'x' }), error => !error.message.includes('test-secret') && /no ha autorizado/.test(error.message));
});
test('el registro pide solo Contents y Metadata y conserva únicamente las credenciales necesarias', async () => {
  const saved = []; let calls = 0;
  const setup = new GitHubAppSetup({ origin, owner: 'toperc', save: async value => saved.push(value), fetchImpl: async () => { calls++; return response({ id: 42, client_id: credentials.clientId, client_secret: credentials.clientSecret, slug: 'toperc-test', owner: { login: 'toperc' }, permissions: { contents: 'write', metadata: 'read' }, pem: 'not-needed-private-key', webhook_secret: 'not-needed-webhook-secret' }); } });
  const flow = setup.start(), state = new URL(flow.action).searchParams.get('state');
  assert.equal(flow.manifest.public, false); assert.deepEqual(flow.manifest.default_permissions, { contents: 'write', metadata: 'read' });
  assert.equal(flow.manifest.hook_attributes.active, false); assert.equal(new URL(flow.manifest.hook_attributes.url).protocol, 'https:'); assert.notEqual(new URL(flow.manifest.hook_attributes.url).hostname, 'localhost');
  assert.equal(flow.manifest.request_oauth_on_install, false); assert.ok(setupPage(flow).includes('toperc.github.io'));
  await assert.rejects(setup.finish({ state, browser: 'wrong', code: 'x' }), /registro no es válido/); assert.equal(calls, 0);
  await setup.finish({ state, browser: flow.browser, code: 'x' });
  assert.deepEqual(saved[0], { ...credentials, appId: 42 });
  assert.ok(!JSON.stringify(saved).includes('not-needed')); assert.equal(calls, 1);
});

async function fixture(t, { outsider = false, setupEnabled = false, oauthConfig = credentials } = {}) {
  const calls = [], saved = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    if (url === 'https://github.com/login/oauth/access_token') return tokenResponse();
    if (url.endsWith('/user')) return response({ id: outsider ? 999 : 5599011, login: outsider ? 'outsider' : 'dgarana' });
    if (url.endsWith('/repos/toperc/toperc.github.io')) return response({ permissions: { push: true } });
    return response({ encoding: 'base64', sha: 'a'.repeat(40), content: encodeContent('{"version":1,"products":[]}') });
  };
  const server = await createAdminServer({ config, origin, fetchImpl, oauthConfig, setupEnabled, saveCredentials: async c => saved.push(c) });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
  const base = `http://127.0.0.1:${server.address().port}`;
  return { request: (path, init) => fetch(base + path, { redirect: 'manual', ...init }), calls, saved };
}
test('el callback HTTP abre una sesión privada y la API nunca devuelve el token OAuth', async t => {
  const { request } = await fixture(t);
  const start = await request('/auth/github/'); assert.equal(start.status, 303);
  const authUrl = new URL(start.headers.get('location')), cookie = start.headers.get('set-cookie').split(';')[0];
  assert.match(start.headers.get('set-cookie'), /SameSite=Lax/);
  const finish = await request(`/auth/github/callback?state=${authUrl.searchParams.get('state')}&code=test`, { headers: { Cookie: cookie, 'Sec-Fetch-Site': 'cross-site' } });
  assert.equal(finish.status, 303); assert.equal(finish.headers.get('location'), '/admin/afiliados/');
  const sessionCookie = finish.headers.get('set-cookie').split(';')[0]; assert.match(sessionCookie, /^toperc_admin_dev=/); assert.ok(!sessionCookie.includes('ghu_'));
  const session = await (await request('/api/session', { headers: { Cookie: sessionCookie } })).json(); assert.equal(session.login, 'dgarana'); assert.equal(session.token, undefined);
  const editor = await request('/admin/afiliados/', { headers: { Cookie: sessionCookie } }); assert.ok((await editor.text()).includes('product-form'));
});
test('otro navegador u otra identidad no reciben sesión aunque conozcan la URL de vuelta', async t => {
  const { request, calls } = await fixture(t, { outsider: true });
  const start = await request('/auth/github/'), state = new URL(start.headers.get('location')).searchParams.get('state');
  const callback = `/auth/github/callback?state=${state}&code=test`;
  const wrongBrowser = await request(callback); assert.match(wrongBrowser.headers.get('location'), /oauth_error=denied/); assert.equal(calls.length, 0);
  const foreign = await request(callback, { headers: { Cookie: start.headers.get('set-cookie').split(';')[0] } }); assert.match(foreign.headers.get('location'), /oauth_error=denied/);
  assert.ok(!foreign.headers.get('set-cookie').includes('toperc_admin_dev=')); assert.equal((await request('/api/session')).status, 401);
});
test('el registro local está desactivado por defecto; las opciones públicas no contienen secretos', async t => {
  const { request } = await fixture(t);
  assert.equal((await request('/setup/github/')).status, 404);
  const options = await (await request('/api/auth-options')).json(); assert.deepEqual(options, { github: true, setup_url: null });
  assert.ok(!JSON.stringify(options).includes('test-secret'));
});
test('sin configuración el registro local ofrece una revisión explícita; no crea aplicaciones al abrirlo', async t => {
  const { request, calls, saved } = await fixture(t, { oauthConfig: null, setupEnabled: true });
  const page = await request('/setup/github/'); assert.equal(page.status, 200);
  assert.match(page.headers.get('content-security-policy'), /form-action https:\/\/github.com/);
  const text = await page.text(); assert.ok(text.includes('Revisar aplicación en GitHub')); assert.equal(calls.length, 0); assert.equal(saved.length, 0);
  assert.equal((await request('/auth/github/')).status, 503);
});
