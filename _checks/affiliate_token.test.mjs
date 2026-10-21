import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { connectWithToken } from '../assets/affiliate-token.mjs';
import { encodeContent } from '../assets/affiliate-core.mjs';

const context = { repository: 'toperc/toperc.github.io', branch: 'codex/poc-afiliados', allowed_user_ids: [5599011] };
const source = { version: 1, products: [{ id: 'bateria', name: 'Batería de prueba', category: 'Baterías', notes: '', model_ids: [], offers: [{ store: 'amazon', url: 'https://amzn.to/ejemplo', status: 'active' }] }] };
const response = (data, status = 200) => new Response(JSON.stringify(data), { status });
function fixture({ userId = 5599011, push = true, status = 200 } = {}) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    if (status !== 200) return response({}, status);
    if (url.endsWith('/user')) return response({ id: userId, login: 'dgarana' });
    if (url.endsWith('/repos/toperc/toperc.github.io')) return response({ permissions: { push } });
    if (init.method === 'PUT') return response({ content: { sha: 'next-sha' }, commit: { sha: 'commit-sha' } });
    return response({ encoding: 'base64', content: encodeContent(JSON.stringify(source)), sha: 'first-sha' });
  };
  return { fetchImpl, calls };
}
test('solo carga el catálogo después de verificar identidad y acceso al repositorio', async () => {
  const { fetchImpl, calls } = fixture();
  const { client, catalog } = await connectWithToken({ token: 'test-token', context, fetchImpl });
  assert.equal(calls.length, 3); assert.equal(calls[0].url, 'https://api.github.com/user');
  assert.equal(calls[1].url, 'https://api.github.com/repos/toperc/toperc.github.io');
  assert.ok(calls[2].url.endsWith('/contents/_data/affiliate_links.json?ref=codex%2Fpoc-afiliados'));
  assert.equal(client.login, 'dgarana'); assert.deepEqual(catalog, source);
  assert.ok(!JSON.stringify(client).includes('test-token'));
});
test('una identidad distinta, permisos insuficientes o un token inválido no cargan el catálogo', async () => {
  for (const options of [{ userId: 999 }, { push: false }, { status: 401 }, { status: 403 }]) {
    const { fetchImpl, calls } = fixture(options);
    await assert.rejects(connectWithToken({ token: 'test-token', context, fetchImpl }));
    assert.ok(!calls.some(call => call.url.includes('/contents/')));
  }
});

test('un token mal copiado no se envía y los errores de red no revelan la credencial', async () => {
  const { fetchImpl, calls } = fixture();
  for (const token of ['github_pat_abc def', 'github_pat_abc\ndef', 'github_pat_ábc']) {
    await assert.rejects(connectWithToken({ token, context, fetchImpl }), /Copia únicamente/);
  }
  assert.equal(calls.length, 0);
  await assert.rejects(connectWithToken({ token: 'test-token', context, fetchImpl: async () => { throw new TypeError('test-token'); } }), error => {
    assert.match(error.message, /El navegador/); assert.ok(!error.message.includes('test-token')); return true;
  });
});

test('invoca fetch sin enlazar el cliente como receptor, como exige el navegador', async () => {
  const { fetchImpl } = fixture();
  await connectWithToken({ token: 'test-token', context, fetchImpl: function (...args) {
    assert.equal(this, undefined);
    return fetchImpl(...args);
  } });
});
test('el navegador envía el token solo en Authorization a GitHub y guarda con el SHA leído', async () => {
  const { fetchImpl, calls } = fixture();
  const { client, catalog } = await connectWithToken({ token: 'test-token', context, fetchImpl });
  catalog.products[0].name = 'Nombre actualizado'; await client.save(catalog);
  for (const { url, init } of calls) {
    assert.equal(new URL(url).origin, 'https://api.github.com'); assert.equal(init.credentials, 'omit'); assert.equal(init.redirect, 'error');
    assert.equal(init.headers.Authorization, 'Bearer test-token'); assert.ok(!url.includes('test-token')); assert.ok(!init.body?.includes('test-token'));
  }
  const payload = JSON.parse(calls.at(-1).init.body); assert.equal(payload.sha, 'first-sha'); assert.equal(payload.branch, context.branch);
  client.disconnect(); const before = calls.length;
  await assert.rejects(client.load(), /desconectada/); await assert.rejects(client.save(catalog)); assert.equal(calls.length, before);
});
test('la versión estática no utiliza almacenamiento persistente, cookies ni API de sesión', async () => {
  const files = ['affiliate-admin.mjs', 'affiliate-token.mjs', 'affiliate-core.mjs'];
  for (const file of files) {
    const text = await readFile(new URL(`../assets/${file}`, import.meta.url), 'utf8');
    assert.ok(!/localStorage|sessionStorage|indexedDB|document\.cookie|\/api\//.test(text), file);
  }
  const page = await readFile(new URL('../admin/afiliados/index.html', import.meta.url), 'utf8');
  assert.ok(page.includes('id="access-token" type="password"')); assert.ok(page.includes('id="manager" hidden')); assert.ok(!page.includes('googletagmanager'));
});
