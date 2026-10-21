import { STORES, STATUSES, GitHubCatalog, validateCatalog, serializeCatalog } from './affiliate-core.mjs';

const $ = id => document.getElementById(id);
const state = { catalog: null, context: null, saved: '', selected: null, editorOpen: false, formDirty: false, busy: false, remote: null };
const clone = value => structuredClone(value);
const changed = () => state.catalog && serializeCatalog(state.catalog) !== state.saved;
const unsaved = () => changed() || state.formDirty;

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}
function notify(message, type = '', link) {
  const notice = $('notice');
  notice.className = `notice ${type}`;
  notice.replaceChildren(document.createTextNode(message));
  if (link) {
    const anchor = element('a', 'Ver cambio en GitHub ↗');
    anchor.href = link; anchor.target = '_blank'; anchor.rel = 'noopener noreferrer'; notice.append(anchor);
  }
}
function canLeaveForm() {
  return !state.formDirty || window.confirm('Hay cambios sin aplicar en este formulario. ¿Quieres descartarlos?');
}
function renderControls() {
  const dirty = changed();
  $('remote-save').disabled = state.busy || !state.remote || !dirty;
  $('export').disabled = state.busy || !state.catalog;
  $('new-product').disabled = state.busy || !state.catalog;
  $('editor-fields').disabled = state.busy || !state.editorOpen;
  $('connect-button').disabled = state.busy || !state.context;
  $('connect-button').hidden = Boolean(state.remote);
  $('disconnect').disabled = state.busy;
  $('disconnect').hidden = !state.remote;
  for (const id of ['repository', 'branch', 'token']) $(id).disabled = state.busy || Boolean(state.remote);
  for (const id of ['search', 'store-filter', 'status-filter']) $(id).disabled = state.busy;
  document.querySelector('.session').classList.toggle('connected', Boolean(state.remote));
  $('mode').textContent = state.remote ? `GitHub · ${state.remote.repository} · ${state.remote.branch}` : 'Modo de prueba · sin conexión';
  $('form-state').textContent = state.formDirty ? 'Sin aplicar' : 'Sin cambios';
  $('save-help').textContent = state.remote
    ? `${dirty ? 'Hay cambios pendientes.' : 'Catálogo sincronizado.'} Destino: ${state.remote.branch}.${state.remote.branch === 'main' ? ' Guardar inicia la publicación de la web.' : ' Esta rama no publica la web.'}`
    : 'Prueba en memoria. Conecta GitHub para guardar en remoto.';
}
function setBusy(value) { state.busy = value; renderControls(); }
function markFormDirty() { state.formDirty = true; renderControls(); }
function renderCatalog() {
  const products = state.catalog.products;
  const offers = products.flatMap(p => p.offers);
  $('product-count').textContent = products.length;
  $('offer-count').textContent = offers.filter(o => o.status === 'active').length;
  $('review-count').textContent = offers.filter(o => o.status === 'review').length;
  const query = $('search').value.trim().toLocaleLowerCase('es');
  const store = $('store-filter').value;
  const status = $('status-filter').value;
  const visible = products.filter(p =>
    `${p.name} ${p.id} ${p.category} ${p.model_ids.join(' ')}`.toLocaleLowerCase('es').includes(query)
    && p.offers.some(o => (!store || o.store === store) && (!status || o.status === status))
  );
  $('results').textContent = `${visible.length} de ${products.length} productos`;
  const list = $('product-list'); list.replaceChildren();
  for (const product of visible) {
    const button = element('button', undefined, 'product-item');
    button.type = 'button'; button.disabled = state.busy;
    button.setAttribute('aria-pressed', String(product.id === state.selected));
    button.append(element('strong', product.name), element('small', `${product.category || 'Sin categoría'} · ${product.id}`));
    button.append(element('span', product.offers.map(o => `${STORES[o.store]}${o.status === 'active' ? '' : ` · ${STATUSES[o.status].toLowerCase()}`}`).join(' / '), 'stores'));
    button.addEventListener('click', () => { if (canLeaveForm()) openProduct(product); });
    list.append(button);
  }
  if (!visible.length) list.append(element('p', 'No hay productos con estos filtros.', 'empty'));
  renderControls();
}
function selectField(label, choices, value, className) {
  const wrapper = element('label', label);
  const select = element('select'); select.className = className;
  for (const [id, name] of Object.entries(choices)) {
    const option = element('option', name); option.value = id; select.append(option);
  }
  select.value = value; wrapper.append(select);
  return wrapper;
}
function updateOfferControls() {
  const rows = [...$('offer-fields').children];
  rows.forEach(row => row.querySelector('.offer-remove').disabled = rows.length === 1);
  $('add-offer').disabled = rows.length >= 4;
}
function addOffer(offer) {
  const row = element('div', undefined, 'offer-row');
  const top = element('div', undefined, 'offer-top');
  top.append(selectField('Tienda', STORES, offer.store, 'offer-store'), selectField('Estado', STATUSES, offer.status, 'offer-status'));
  const remove = element('button', 'Quitar', 'offer-remove'); remove.type = 'button';
  remove.setAttribute('aria-label', 'Quitar esta tienda del producto');
  remove.addEventListener('click', () => { row.remove(); updateOfferControls(); markFormDirty(); });
  top.append(remove);
  const label = element('label', 'Enlace de afiliado');
  const input = element('input'); input.className = 'offer-url'; input.type = 'url'; input.required = true; input.maxLength = 4096; input.placeholder = 'https://…'; input.value = offer.url; input.spellcheck = false;
  label.append(input); row.append(top, label, element('p', 'Activo: se muestra en la web. Para revisar o desactivado: se oculta al publicar.', 'micro'));
  $('offer-fields').append(row); updateOfferControls();
}
function renderUsages(id) {
  const container = $('usages'); container.replaceChildren();
  const usages = state.context.usages[id] || [];
  for (const usage of usages) {
    const link = element('a', `${usage.title} ↗`); link.href = usage.url; link.target = '_blank'; link.rel = 'noopener noreferrer'; container.append(link);
  }
  if (!usages.length) container.append(element('p', 'Todavía no se utiliza en ninguna publicación.', 'micro'));
}
function renderPreview(product) {
  const container = $('preview'); container.replaceChildren();
  if (!product) { container.append(element('p', 'Aplica el producto al catálogo para previsualizarlo.', 'micro')); return; }
  const card = element('div', undefined, 'preview-product'); card.append(element('strong', product.name));
  const links = element('div', undefined, 'preview-links');
  for (const offer of product.offers.filter(o => o.status === 'active')) {
    const pair = element('div', undefined, 'preview-link');
    const anchor = element('a', `Ver en ${STORES[offer.store]} ↗`); anchor.href = offer.url; anchor.target = '_blank'; anchor.rel = 'sponsored noopener noreferrer';
    const copy = element('button', 'Copiar'); copy.type = 'button'; copy.setAttribute('aria-label', `Copiar enlace de ${STORES[offer.store]}`);
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(offer.url); notify(`Enlace de ${STORES[offer.store]} copiado.`, 'success'); }
      catch { notify('El navegador no permite copiar aquí. Puedes abrir el enlace y copiar su dirección.', 'error'); }
    });
    pair.append(anchor, copy); links.append(pair);
  }
  if (!links.children.length) links.append(element('p', 'Enlaces pendientes de revisión.', 'micro'));
  card.append(links); container.append(card);
}
function openProduct(product) {
  state.selected = product?.id || null; state.editorOpen = true; state.formDirty = false;
  $('product-form').reset();
  $('editor-title').textContent = product ? 'Editar producto' : 'Nuevo producto';
  $('product-name').value = product?.name || '';
  $('product-id').value = product?.id || ''; $('product-id').readOnly = Boolean(product);
  $('product-category').value = product?.category || '';
  $('product-notes').value = product?.notes || '';
  const models = $('product-models'); models.replaceChildren();
  const knownModels = [...state.context.models];
  for (const id of product?.model_ids || []) if (!knownModels.some(model => model.id === id)) knownModels.push({ id, name: id });
  for (const model of knownModels) {
    const option = element('option', model.name); option.value = model.id; option.selected = Boolean(product?.model_ids.includes(model.id)); models.append(option);
  }
  $('offer-fields').replaceChildren();
  for (const offer of product?.offers || [{ store: 'amazon', url: '', status: 'active' }]) addOffer(offer);
  renderUsages(product?.id); renderPreview(product); renderCatalog();
}
function formHasPendingChanges() {
  if (!state.formDirty) return false;
  notify('Hay cambios en el formulario sin aplicar. Pulsa «Aplicar al catálogo» antes de guardar o descargar.', 'error');
  $('product-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
  return true;
}

$('product-form').addEventListener('input', markFormDirty);
$('product-form').addEventListener('change', markFormDirty);
$('product-form').addEventListener('submit', event => {
  event.preventDefault();
  const product = {
    id: $('product-id').value.trim(), name: $('product-name').value.trim(), category: $('product-category').value.trim(),
    model_ids: [...$('product-models').selectedOptions].map(option => option.value), notes: $('product-notes').value.trim(),
    offers: [...$('offer-fields').children].map(row => ({ store: row.querySelector('.offer-store').value, url: row.querySelector('.offer-url').value.trim(), status: row.querySelector('.offer-status').value }))
  };
  const draft = clone(state.catalog);
  const index = draft.products.findIndex(p => p.id === state.selected);
  if (index >= 0) draft.products[index] = product; else draft.products.push(product);
  try {
    validateCatalog(draft); state.catalog = draft; openProduct(product);
    notify('Producto aplicado al catálogo. Falta guardar en GitHub o descargar el archivo.', 'success');
  } catch (error) { notify(error.message, 'error'); }
});
$('add-offer').addEventListener('click', () => {
  const used = [...document.querySelectorAll('.offer-store')].map(select => select.value);
  const store = Object.keys(STORES).find(key => !used.includes(key));
  if (store) { addOffer({ store, url: '', status: 'active' }); markFormDirty(); }
});
$('new-product').addEventListener('click', () => {
  if (canLeaveForm()) { openProduct(null); $('product-form').scrollIntoView({ behavior: 'smooth', block: 'start' }); $('product-name').focus({ preventScroll: true }); }
});
for (const id of ['search', 'store-filter', 'status-filter']) $(id).addEventListener(id === 'search' ? 'input' : 'change', renderCatalog);
$('connect-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (unsaved() && !window.confirm('Conectar cargará el catálogo de GitHub y sustituirá tus cambios locales. Descarga antes el borrador si quieres conservarlo. ¿Continuar?')) return;
  let client;
  try {
    client = new GitHubCatalog({ repository: $('repository').value.trim(), branch: $('branch').value.trim(), token: $('token').value });
    $('token').value = ''; setBusy(true); notify('Cargando el catálogo desde GitHub…');
    const catalog = await client.load();
    state.remote?.disconnect(); state.remote = client; state.catalog = catalog; state.saved = serializeCatalog(catalog); state.formDirty = false;
    $('search').value = ''; $('store-filter').value = ''; $('status-filter').value = '';
    if (catalog.products.length) openProduct(catalog.products[0]); else openProduct(null);
    $('connection').open = false;
    notify(`Conectado. Los cambios se guardarán en ${client.repository}, rama ${client.branch}.`, 'success');
  } catch (error) { client?.disconnect(); notify(error.message, 'error'); }
  finally { setBusy(false); renderCatalog(); }
});
$('disconnect').addEventListener('click', () => {
  state.remote?.disconnect(); state.remote = null; $('token').value = ''; renderControls();
  notify('Sesión desconectada. El catálogo y tus cambios siguen en memoria; puedes descargarlos.');
});
$('remote-save').addEventListener('click', async () => {
  if (formHasPendingChanges() || !state.remote || !changed()) return;
  setBusy(true); renderCatalog(); notify('Guardando el catálogo en GitHub…');
  try {
    const result = await state.remote.save(state.catalog); state.saved = serializeCatalog(state.catalog);
    notify(`Guardado confirmado en ${state.remote.branch}.${state.remote.branch === 'main' ? ' GitHub iniciará la publicación; la web cambiará al terminar.' : ' La web pública se actualizará cuando esta rama se integre en main.'}`, 'success', result.url);
  } catch (error) { notify(error.message, 'error'); }
  finally { setBusy(false); renderCatalog(); }
});
$('export').addEventListener('click', () => {
  if (formHasPendingChanges()) return;
  const blob = new Blob([serializeCatalog(state.catalog)], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob); const anchor = element('a'); anchor.href = url; anchor.download = 'affiliate_links.json';
  anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  notify('Catálogo descargado. Para publicarlo manualmente, sustituye _data/affiliate_links.json en el repositorio.');
});
window.addEventListener('beforeunload', event => { if (unsaved()) { event.preventDefault(); event.returnValue = ''; } });

async function init() {
  try {
    const [catalogResponse, contextResponse] = await Promise.all([
      fetch(document.body.dataset.catalogUrl, { cache: 'no-store' }), fetch(document.body.dataset.contextUrl, { cache: 'no-store' })
    ]);
    if (!catalogResponse.ok || !contextResponse.ok) throw new Error('No se ha podido cargar el catálogo. Comprueba que la web está compilada con Jekyll.');
    state.catalog = validateCatalog(await catalogResponse.json()); state.context = await contextResponse.json();
    state.saved = serializeCatalog(state.catalog);
    $('repository').value = state.context.repository; $('branch').value = state.context.branch;
    if (state.catalog.products.length) openProduct(state.catalog.products[0]); else openProduct(null);
    notify('Puedes probar el editor. Los cambios están solo en memoria hasta que conectes GitHub o descargues el catálogo.');
  } catch (error) { notify(error.message, 'error'); }
}
init();
