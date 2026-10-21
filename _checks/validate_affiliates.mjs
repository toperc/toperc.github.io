import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { validateCatalog } from '../_admin/assets/affiliate-core.mjs';

const root = new URL('../', import.meta.url);
const source = validateCatalog(JSON.parse(await readFile(new URL('_data/affiliate_links.json', root), 'utf8')));
const context = JSON.parse(await readFile(new URL('_admin/generated/context.json', root), 'utf8'));
const ids = new Set(source.products.map(p => p.id));
const models = new Set(context.models.map(m => m.id));
for (const product of source.products) {
  for (const id of product.model_ids) assert.ok(models.has(id), `Modelo desconocido: ${id}`);
}
// Read Jekyll itself to include references even if an unknown product was skipped by the template.
const posts = JSON.parse(await readFile(new URL('_admin/generated/references.json', root), 'utf8'));
const escapeHtml = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll("'", '&#39;');
let usages = 0;
for (const post of posts) {
  const html = await readFile(new URL(`_site${post.path}index.html`, root), 'utf8');
  for (const id of post.products) {
    assert.ok(ids.has(id), `${post.title}: producto inexistente ${id}`);
    const product = source.products.find(p => p.id === id);
    const marker = `data-affiliate-product="${id}"`;
    assert.ok(html.includes(marker), `${id} no se ha renderizado.`);
    const productHtml = html.split(marker)[1].split('class="affiliate-product"')[0];
    for (const offer of product.offers) {
      const href = `href="${escapeHtml(offer.url)}"`;
      assert.equal(productHtml.includes(href), offer.status === 'active', `${id}: estado ${offer.status} no respetado.`);
    }
    assert.ok(context.usages[id].some(usage => usage.url === post.url), `${id}: falta referencia al artículo.`);
    usages++;
  }
}
const admin = await readFile(new URL('_site/admin/afiliados/index.html', root), 'utf8');
assert.ok(!admin.includes('googletagmanager.com'), 'El panel no debe cargar scripts de terceros.');
assert.ok(admin.includes('noindex,nofollow'));
assert.ok(!admin.includes('product-form'), 'El editor no debe incluirse en GitHub Pages.');
assert.ok(!admin.includes('affiliate-admin.mjs'), 'El gestor no debe incluirse en GitHub Pages.');
const files = await readdir(new URL('_site/', root), { recursive: true });
for (const file of files) {
  assert.ok(!/^_admin[\\/]/.test(file), `Archivo privado publicado: ${file}`);
  assert.ok(!/affiliate-(?:catalog|context|references)\.json$/.test(file), `Datos del gestor publicados: ${file}`);
  assert.ok(!/affiliate-(?:admin|core)\.(?:mjs|css)$/.test(file), `Archivo del gestor publicado: ${file}`);
}
const settings = JSON.parse(await readFile(new URL('_data/affiliate_admin.json', root), 'utf8'));
assert.ok(settings.allowed_user_ids.length > 0);
assert.ok(settings.private_url === '' || new URL(settings.private_url).protocol === 'https:', 'El destino privado debe usar HTTPS.');
console.log(`Afiliación validada: ${source.products.length} productos, ${usages} referencias y editor excluido del sitio público.`);
