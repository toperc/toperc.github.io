import { readFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { validateCatalog } from '../assets/affiliate-core.mjs';

const root = new URL('../', import.meta.url);
const source = validateCatalog(JSON.parse(await readFile(new URL('_data/affiliate_links.json', root), 'utf8')));
const built = validateCatalog(JSON.parse(await readFile(new URL('_site/assets/affiliate-catalog.json', root), 'utf8')));
assert.deepEqual(built, source, 'El catálogo publicado no coincide con el catálogo fuente.');
const context = JSON.parse(await readFile(new URL('_site/assets/affiliate-context.json', root), 'utf8'));
const ids = new Set(source.products.map(p => p.id));
const models = new Set(context.models.map(m => m.id));
for (const product of source.products) {
  for (const id of product.model_ids) assert.ok(models.has(id), `Modelo desconocido: ${id}`);
}
// Read Jekyll itself to include references even if an unknown product was skipped by the template.
const posts = JSON.parse(await readFile(new URL('_site/assets/affiliate-references.json', root), 'utf8'));
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
assert.ok(admin.includes('connect-src'));
console.log(`Afiliación validada: ${source.products.length} productos, ${usages} referencias publicadas y panel independiente.`);
