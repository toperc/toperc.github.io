import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { GitHubCatalog, validateCatalog, serializeCatalog, encodeContent, decodeContent, isHttpsUrl } from '../assets/affiliate-core.mjs';

const actual = JSON.parse(await readFile(new URL('../_data/affiliate_links.json', import.meta.url), 'utf8'));
const source = { version: 1, products: [{ id: 'bateria-de-prueba', name: 'Batería de prueba', category: 'Baterías', model_ids: ['wltoys-144001'], notes: '', offers: [{ store: 'amazon', url: 'https://amzn.to/test-fixture', status: 'active' }] }] };
const clientFor = fetchImpl => new GitHubCatalog({ repository: 'toperc/toperc.github.io', branch: 'codex/poc-afiliados', token: 'test-token-only', fetchImpl });
const response = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });
const fileResponse = () => response({ encoding: 'base64', content: encodeContent(serializeCatalog(source)), sha: 'initial-file-sha' });

test('el catálogo real cumple el contrato de datos', () => {
  validateCatalog(actual);
});
test('conserva Unicode, variantes y parámetros de seguimiento en el viaje a GitHub', () => {
  const data = structuredClone(source);
  data.products[0].name = 'Batería · versión española 🔋';
  data.products[0].offers.push({ store: 'aliexpress', url: 'https://s.click.aliexpress.com/e/ejemplo?aff_fcid=abc&sku_id=123', status: 'review' });
  const text = serializeCatalog(data);
  assert.equal(decodeContent(encodeContent(text)), text);
  assert.deepEqual(JSON.parse(decodeContent(encodeContent(text))), data);
});
test('rechaza duplicados, enlaces ejecutables, estados y tiendas desconocidas', () => {
  const bad = mutate => { const data = structuredClone(source); mutate(data); assert.throws(() => validateCatalog(data)); };
  bad(data => data.products.push(structuredClone(data.products[0])));
  bad(data => data.products[0].offers.push(structuredClone(data.products[0].offers[0])));
  bad(data => data.products[0].offers[0].url = 'javascript:alert(1)');
  bad(data => data.products[0].offers[0].url = 'https://user:password@example.com');
  bad(data => data.products[0].offers[0].status = 'in-stock');
  bad(data => data.products[0].offers[0].store = '__proto__');
  bad(data => data.products[0].model_ids = ['wltoys-144001', 'wltoys-144001']);
  assert.equal(isHttpsUrl('http://amzn.to/example'), false);
});
test('solo serializa campos del catálogo; nunca guarda metadatos de sesión', () => {
  const data = structuredClone(source); data.token = 'secret'; data.products[0].token = 'secret'; data.products[0].offers[0].token = 'secret';
  assert.ok(!serializeCatalog(data).includes('secret'));
});
test('carga y guarda un único archivo con la rama y SHA leídos; la credencial solo viaja en Authorization', async () => {
  const calls = [];
  const client = clientFor(async (url, options) => {
    calls.push({ url, options });
    return options.method === 'GET' ? fileResponse() : response({ content: { sha: 'next-file-sha' }, commit: { sha: 'commit-sha' } });
  });
  const data = await client.load(); data.products[0].offers[0].url = 'https://amzn.to/replacement';
  const result = await client.save(data);
  assert.equal(calls.length, 2);
  assert.ok(calls[0].url.endsWith('?ref=codex%2Fpoc-afiliados'));
  const body = JSON.parse(calls[1].options.body);
  assert.equal(body.sha, 'initial-file-sha'); assert.equal(body.branch, 'codex/poc-afiliados');
  assert.deepEqual(JSON.parse(decodeContent(body.content)), data);
  assert.equal(calls[1].url, 'https://api.github.com/repos/toperc/toperc.github.io/contents/_data/affiliate_links.json');
  assert.equal(calls[1].options.headers.Authorization, 'Bearer test-token-only');
  assert.equal(calls[1].options.redirect, 'error'); assert.equal(calls[1].options.credentials, 'omit');
  assert.ok(!calls[1].options.body.includes('test-token-only')); assert.ok(!calls[1].url.includes('test-token-only'));
  assert.ok(!JSON.stringify(client).includes('test-token-only')); assert.equal(client.sha, 'next-file-sha');
  assert.equal(result.url, 'https://github.com/toperc/toperc.github.io/commit/commit-sha');
  client.disconnect(); await assert.rejects(client.load(), /desconectada/);
});
test('un conflicto no reintenta ni cambia el SHA ni el borrador', async () => {
  let calls = 0;
  const client = clientFor(async (_, options) => { calls++; return options.method === 'GET' ? fileResponse() : response({}, 409); });
  const data = await client.load(); const before = serializeCatalog(data);
  await assert.rejects(client.save(data), /ha cambiado en GitHub/);
  assert.equal(client.sha, 'initial-file-sha'); assert.equal(calls, 2); assert.equal(serializeCatalog(data), before);
});
test('no confunde credenciales inválidas, archivo ausente ni límites de permisos con un guardado correcto', async () => {
  for (const [status, pattern] of [[401, /token/], [403, /permisos/], [404, /Publica primero/], [422, /reglas/]]) {
    const client = clientFor(async () => response({}, status));
    await assert.rejects(client.load(), pattern); assert.equal(client.sha, null);
  }
});
test('no guarda sin cargar ni acepta un catálogo remoto inválido', async () => {
  const client = clientFor(async () => response({ encoding: 'base64', content: encodeContent('{"version":2,"products":[]}'), sha: 'wrong' }));
  await assert.rejects(client.save(source), /Carga el catálogo/);
  await assert.rejects(client.load(), /version: 1/); assert.equal(client.sha, null);
});
test('si la red falla después de enviar, no reintenta una escritura cuyo resultado se desconoce', async () => {
  let writes = 0;
  const client = clientFor(async (_, options) => {
    if (options.method === 'GET') return fileResponse();
    writes++; throw new TypeError('network error');
  });
  await client.load(); await assert.rejects(client.save(source), /revisa el historial/);
  assert.equal(writes, 1); assert.equal(client.sha, 'initial-file-sha');
});
