import { STORES, STATUSES, validateCatalog, serializeCatalog } from './affiliate-core.mjs';
import { connectWithToken } from './affiliate-token.mjs';

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
  if (!notice) return;
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
  if (!$('remote-save')) return;
  const dirty = changed();
  $('remote-save').disabled = state.busy || !state.remote || !dirty;
  $('export').disabled = state.busy || !state.catalog;
  $('new-product').disabled = state.busy || !state.catalog;
  $('editor-fields').disabled = state.busy || !state.editorOpen;
  $('logout').disabled = state.busy;
  for (const id of ['search', 'store-filter', 'status-filter']) $(id).disabled = state.busy;
  document.querySelector('.session').classList.toggle('connected', Boolean(state.remote));
  $('mode').textContent = state.remote ? `GitHub · ${state.remote.login} · ${state.remote.branch}` : 'Sin conexión · descarga tu borrador';
  $('form-state').textContent = state.formDirty ? 'Sin aplicar' : 'Sin cambios';
  $('save-help').textContent = state.remote
    ? `${dirty ? 'Hay cambios pendientes.' : 'Catálogo sincronizado.'} Destino: ${state.remote.branch}.${state.remote.branch === 'main' ? ' Guardar inicia la publicación de la web.' : ' Esta rama no publica la web.'}`
    : 'Descarga los cambios antes de cerrar sesión y volver a introducir el token.';
}
function setBusy(value) { state.busy = value; renderControls(); }
function markFormDirty() { state.formDirty = true; renderControls(); }
function renderCatalog() {
  if (!state.catalog) return;
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
$('logout').addEventListener('click', async () => {
  if (unsaved() && !window.confirm('Tienes cambios sin guardar. Descárgalos antes si quieres conservarlos. ¿Cerrar sesión?')) return;
  disconnect('Sesión cerrada. El token se ha eliminado de la memoria de esta pestaña.');
});
$('remote-save').addEventListener('click', async () => {
  if (formHasPendingChanges() || !state.remote || !changed()) return;
  setBusy(true); renderCatalog(); notify('Guardando el catálogo en GitHub…');
  try {
    const result = await state.remote.save(state.catalog); state.saved = serializeCatalog(state.catalog);
    notify(`Guardado confirmado en ${state.remote.branch}.${state.remote.branch === 'main' ? ' GitHub iniciará la publicación; la web cambiará al terminar.' : ' La web pública se actualizará cuando esta rama se integre en main.'}`, 'success', result.url);
  } catch (error) {
    if (error.status === 401) { state.remote?.disconnect(); state.remote = null; }
    notify(error.status === 401 ? 'El token ya no es válido. Descarga tu borrador, cierra sesión y vuelve a entrar con un token vigente.' : error.message, 'error');
  }
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
window.addEventListener('pagehide', () => disconnect('Vuelve a introducir el token para conectar con GitHub.'));
window.addEventListener('pageshow', event => { if (event.persisted) disconnect('Vuelve a introducir el token para conectar con GitHub.'); });

function accessNotice(message, error = false) {
  $('access-notice').textContent = message;
  $('access-notice').className = error ? 'notice error' : 'notice';
}
function disconnect(message) {
  state.remote?.disconnect(); state.remote = null; state.catalog = null; state.saved = ''; state.formDirty = false; state.selected = null; state.editorOpen = false;
  $('product-form').reset(); $('access-token').value = ''; $('session-user').textContent = '';
  for (const id of ['product-list', 'offer-fields', 'usages', 'preview']) $(id).replaceChildren();
  for (const id of ['product-count', 'offer-count', 'review-count']) $(id).textContent = '—';
  $('manager').hidden = true; $('access-screen').hidden = false; document.body.dataset.mode = 'access';
  accessNotice(message); renderControls();
}
$('token-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (!state.context) return;
  $('access-button').disabled = true; $('access-token').disabled = true;
  accessNotice('Comprobando tu cuenta y cargando el catálogo desde GitHub…');
  try {
    const pending = connectWithToken({ token: $('access-token').value.trim(), context: state.context });
    $('access-token').value = '';
    const { client, catalog } = await pending;
    state.remote = client; state.catalog = catalog; state.saved = serializeCatalog(catalog);
    $('session-user').textContent = `${client.login} · ${client.repository} · token solo en esta pestaña`;
    $('search').value = ''; $('store-filter').value = ''; $('status-filter').value = '';
    if (catalog.products.length) openProduct(catalog.products[0]); else openProduct(null);
    $('access-screen').hidden = true; $('manager').hidden = false; document.body.dataset.mode = 'manager';
    notify(`Cuenta comprobada. Los cambios se guardarán en la rama ${client.branch}.`);
  } catch (error) { accessNotice(error.message, true); }
  finally { $('access-token').value = ''; $('access-token').disabled = false; $('access-button').disabled = false; }
});

async function init() {
  try {
    const response = await fetch(document.body.dataset.contextUrl, { cache: 'no-store', credentials: 'omit' });
    if (!response.ok) throw new Error('No se ha podido cargar la configuración. Comprueba que la web está compilada con Jekyll.');
    const context = await response.json();
    if (!context.repository || !context.branch || !Array.isArray(context.allowed_user_ids) || !context.allowed_user_ids.length || !Array.isArray(context.models) || !context.usages) throw new Error('La configuración del gestor no es válida.');
    state.context = context; $('access-button').disabled = false; $('access-button').textContent = 'Entrar y cargar catálogo';
    accessNotice(`Destino: ${context.repository} · rama ${context.branch}.`);
  } catch (error) { accessNotice(error.message, true); }
}
init();
