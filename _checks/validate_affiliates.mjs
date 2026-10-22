import { readFile, readdir } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { validateCatalog } from '../assets/affiliate-core.mjs';

const root = new URL('../', import.meta.url);
const source = validateCatalog(JSON.parse(await readFile(new URL('_data/affiliate_links.json', root), 'utf8')));
const context = JSON.parse(await readFile(new URL('_site/assets/affiliate-context.json', root), 'utf8'));
const ids = new Set(source.products.map(p => p.id));
const models = new Set(context.models.map(m => m.id));
for (const product of source.products) {
  for (const id of product.model_ids) assert.ok(models.has(id), `Modelo desconocido: ${id}`);
}
// Read Jekyll itself to include references even if an unknown product was skipped by the template.
const posts = context.references;
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
assert.ok(admin.includes('id="token-form"'), 'Falta el formulario de acceso por token.');
assert.ok(admin.includes('id="manager" hidden'), 'El gestor debe empezar oculto hasta comprobar la cuenta.');
assert.ok(admin.includes('https://api.github.com'), 'Falta la API de GitHub en la política de contenido.');
assert.ok(!admin.includes('/api/'), 'La versión estática no debe depender del servidor de sesiones.');
for (const product of source.products) assert.ok(!admin.includes(product.offers[0].url), 'No se debe incrustar el catálogo en el formulario de acceso.');
const files = await readdir(new URL('_site/', root), { recursive: true });
for (const file of files) {
  assert.ok(!/^_admin[\\/]/.test(file), `Archivo privado publicado: ${file}`);
  assert.ok(!/affiliate-github-app\.json$/.test(file), `Credenciales del prototipo publicadas: ${file}`);
}
const settings = JSON.parse(await readFile(new URL('_data/affiliate_admin.json', root), 'utf8'));
// Los accesos de colaboración deben conservar exactamente la URL y el estado del catálogo.
const partners = JSON.parse(await readFile(new URL('_data/partners.json', root), 'utf8'));
for (const id of [partners.hobbyking.link_product_id, ...partners.rlaarlo.models.map(model => model.product_id)]) {
  assert.ok(ids.has(id), `Referencia de colaboración inexistente: ${id}`);
  assert.ok(context.usages[id].some(usage => usage.url.includes('/colaboraciones/')), `${id}: la colaboración debe aparecer en el gestor.`);
}
const readPage = path => readFile(new URL(`_site/${path}index.html`, root), 'utf8');
for (const path of ['', 'colaboraciones/', 'reviews/turnigy-rapid-4s-mjx-7303/', 'reviews/rlaarlo-x12s/', 'reviews/jiabaile-rc-mini-drift/']) {
  const html = await readPage(path);
  for (const [tag] of html.matchAll(/<a\b[^>]*data-partner-product="[^"]+"[^>]*>/g)) {
    const attrs = Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, name, value]) => [name, value]));
    const product = source.products.find(product => product.id === attrs['data-partner-product']);
    const offer = product?.offers.find(offer => offer.store === attrs['data-partner-store'] && offer.status === 'active');
    assert.ok(offer, `Acceso de colaboración sin oferta activa: ${attrs['data-partner-product']}`);
    assert.equal(attrs.href, escapeHtml(offer.url), 'La colaboración debe conservar la URL de seguimiento completa.');
    for (const rel of ['sponsored', 'noopener', 'noreferrer']) assert.ok(attrs.rel.split(' ').includes(rel));
    assert.equal(attrs.target, '_blank');
  }
  if (path.startsWith('reviews/')) {
    const post = context.references.find(post => post.path === `/${path}`);
    const expected = post.products.some(id => source.products.find(product => product.id === id).offers.some(offer => offer.status === 'active' && ['hobbyking', 'rlaarlo'].includes(offer.store)));
    assert.equal(html.includes('class="partner-article"'), expected, 'El bloque del artículo debe corresponder a una tienda de sus productos.');
  }
}
const partnerPage = (await readPage('colaboraciones/')).split('<main')[1].split('</main>')[0];
for (const [id, store] of [[partners.hobbyking.link_product_id, 'hobbyking'], ...partners.rlaarlo.models.map(model => [model.product_id, 'rlaarlo'])]) {
  const active = source.products.find(product => product.id === id).offers.some(offer => offer.store === store && offer.status === 'active');
  assert.equal(partnerPage.includes(`data-partner-product="${id}"`), active, `${id}: la página debe respetar el estado de su oferta.`);
}
assert.ok(settings.allowed_user_ids.length > 0);
assert.ok(settings.private_url === '' || new URL(settings.private_url).protocol === 'https:', 'El destino privado debe usar HTTPS.');
assert.equal(context.repository, settings.repository); assert.equal(context.branch, settings.branch); assert.deepEqual(context.allowed_user_ids, settings.allowed_user_ids);
for (const name of ['affiliate-admin.mjs', 'affiliate-core.mjs', 'affiliate-token.mjs', 'affiliate-admin.css', 'affiliate-token.css']) await readFile(new URL(`_site/assets/${name}`, root));
console.log(`Afiliación validada: ${source.products.length} productos, ${usages} referencias y gestor estático con acceso por token.`);
