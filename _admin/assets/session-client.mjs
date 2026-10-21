import { validateCatalog } from './affiliate-core.mjs';

async function request(path, options = {}) {
  let response;
  try { response = await fetch(path, { ...options, credentials: 'same-origin', cache: 'no-store', redirect: 'error' }); }
  catch { throw new Error('No se ha podido confirmar la operación. Conservamos tu borrador; revisa el historial antes de reintentar un guardado.'); }
  if (response.status === 401) {
    window.dispatchEvent(new Event('admin-session-expired'));
    throw new Error('Tu sesión ha caducado. Vuelve a identificarte.');
  }
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'No se ha podido completar la operación.');
  return data;
}
export class ProtectedCatalog {
  constructor(session) { Object.assign(this, session); this.sha = null; }
  static async connect() { return new ProtectedCatalog(await request('/api/session')); }
  async load() {
    const result = await request('/api/catalog');
    validateCatalog(result.catalog); this.sha = result.sha;
    return result.catalog;
  }
  async save(catalog) {
    validateCatalog(catalog);
    const result = await request('/api/catalog', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': this.csrf }, body: JSON.stringify({ catalog, sha: this.sha }) });
    this.sha = result.sha;
    return result;
  }
  async context() { return request('/api/context'); }
  async logout() { await request('/api/logout', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': this.csrf }, body: '{}' }); }
}
