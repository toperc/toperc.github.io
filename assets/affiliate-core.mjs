export const STORES = Object.freeze({ amazon: 'Amazon', aliexpress: 'AliExpress', rlaarlo: 'Rlaarlo', hobbyking: 'HobbyKing' });
export const STATUSES = Object.freeze({ active: 'Activo', review: 'Para revisar', disabled: 'Desactivado' });
export const DATA_PATH = '_data/affiliate_links.json';

export function isHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch { return false; }
}

export function validateCatalog(data) {
  const fail = (message) => { throw new Error(message); };
  if (!data || data.version !== 1 || !Array.isArray(data.products)) fail('El catálogo debe tener version: 1 y una lista de productos.');
  const ids = new Set();
  for (const product of data.products) {
    if (!product || typeof product.id !== 'string' || product.id.length > 80 || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(product.id)) fail('La referencia debe usar letras minúsculas, números y guiones.');
    if (ids.has(product.id)) fail(`Referencia duplicada: ${product.id}.`);
    ids.add(product.id);
    if (typeof product.name !== 'string' || !product.name.trim() || product.name.length > 160) fail(`Nombre inválido: ${product.id}.`);
    if (typeof product.category !== 'string' || product.category.length > 80 || typeof product.notes !== 'string' || product.notes.length > 1000) fail(`Categoría o notas inválidas: ${product.id}.`);
    if (!Array.isArray(product.model_ids) || product.model_ids.some(id => typeof id !== 'string' || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) || new Set(product.model_ids).size !== product.model_ids.length) fail(`Modelos inválidos: ${product.id}.`);
    if (!Array.isArray(product.offers) || product.offers.length < 1 || product.offers.length > 4) fail(`Añade entre una y cuatro tiendas: ${product.id}.`);
    const stores = new Set();
    for (const offer of product.offers) {
      if (!offer || !Object.hasOwn(STORES, offer.store) || !Object.hasOwn(STATUSES, offer.status)) fail(`Tienda o estado inválido: ${product.id}.`);
      if (stores.has(offer.store)) fail(`La tienda ${STORES[offer.store]} está repetida en ${product.id}.`);
      stores.add(offer.store);
      if (typeof offer.url !== 'string' || offer.url.length > 4096 || !isHttpsUrl(offer.url)) fail(`Usa un enlace HTTPS válido para ${STORES[offer.store]} en ${product.id}.`);
    }
  }
  return data;
}

export function serializeCatalog(data) {
  validateCatalog(data);
  // Explicit fields prevent imported metadata (or accidental credentials) entering the file.
  return JSON.stringify({ version: 1, products: data.products.map(p => ({
    id: p.id, name: p.name, category: p.category, model_ids: p.model_ids, notes: p.notes,
    offers: p.offers.map(o => ({ store: o.store, url: o.url, status: o.status }))
  })) }, null, 2) + '\n';
}

export function encodeContent(value) {
  return btoa(Array.from(new TextEncoder().encode(value), byte => String.fromCharCode(byte)).join(''));
}

export function decodeContent(value) {
  return new TextDecoder('utf-8', { fatal: true }).decode(Uint8Array.from(atob(value.replace(/\s/g, '')), char => char.charCodeAt(0)));
}

export class GitHubCatalog {
  #token;
  #fetch;
  constructor({ repository, branch, token, fetchImpl = globalThis.fetch }) {
    if (!/^[a-zA-Z0-9-]+\/[a-zA-Z0-9_.-]+$/.test(repository)) throw new Error('Usa el formato propietario/repositorio.');
    if (!branch.trim() || branch.trim() !== branch || /[\x00-\x20~^:?*\[\\]/.test(branch)) throw new Error('Indica una rama válida.');
    if (!token.trim()) throw new Error('Introduce un token de GitHub.');
    this.repository = repository;
    this.branch = branch;
    this.sha = null;
    this.#token = token.trim();
    this.#fetch = fetchImpl;
  }
  async #request(method, payload) {
    if (!this.#token) throw new Error('La sesión está desconectada.');
    const endpoint = `https://api.github.com/repos/${this.repository}/contents/${DATA_PATH}`;
    const url = method === 'GET' ? `${endpoint}?ref=${encodeURIComponent(this.branch)}` : endpoint;
    let response;
    try {
      response = await this.#fetch(url, {
        method, cache: 'no-store', credentials: 'omit', redirect: 'error',
        headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${this.#token}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(20000),
        ...(payload ? { body: JSON.stringify(payload) } : {})
      });
    } catch { throw new Error('No se ha podido confirmar la operación con GitHub. Conservamos tu borrador. Comprueba la conexión; si estabas guardando, revisa el historial antes de reintentar.'); }
    if (!response.ok) {
      const errors = {
        401: 'GitHub no reconoce el token. Conecta de nuevo con un token válido.',
        403: 'GitHub ha rechazado la operación. Revisa permisos Contents: Read and write, límites de uso o reglas de la rama.',
        404: 'No se encuentra el catálogo. Publica primero la rama de la POC en GitHub y comprueba el repositorio, la rama y los permisos.',
        409: 'El catálogo ha cambiado en GitHub. Descarga tu borrador antes de volver a conectar y combinar los cambios.',
        422: 'GitHub no acepta este cambio. Revisa si otra sesión ha guardado o si la rama tiene reglas de protección.'
      };
      throw new Error(errors[response.status] || `GitHub ha devuelto un error (${response.status}). Conservamos tu borrador.`);
    }
    return response.json();
  }
  async load() {
    const file = await this.#request('GET');
    if (file.encoding !== 'base64' || typeof file.content !== 'string' || !file.sha) throw new Error('GitHub no ha devuelto un catálogo válido.');
    const catalog = validateCatalog(JSON.parse(decodeContent(file.content)));
    this.sha = file.sha;
    return catalog;
  }
  async save(catalog) {
    if (!this.sha) throw new Error('Carga el catálogo remoto antes de guardar.');
    const content = encodeContent(serializeCatalog(catalog));
    const result = await this.#request('PUT', {
      message: 'Actualizar catálogo de afiliación desde TopeRC', content, sha: this.sha, branch: this.branch
    });
    if (!result.content?.sha || !result.commit?.sha) throw new Error('No se ha podido confirmar el guardado. Revisa el historial de GitHub antes de reintentar.');
    this.sha = result.content.sha;
    return { commit: result.commit.sha, url: `https://github.com/${this.repository}/commit/${result.commit.sha}` };
  }
  disconnect() { this.#token = ''; this.sha = null; }
}
