import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const random = () => randomBytes(32).toString('base64url');
const fail = (status, message) => { throw Object.assign(new Error(message), { status }); };
const equal = (a, b) => typeof a === 'string' && typeof b === 'string' && Buffer.byteLength(a) === Buffer.byteLength(b) && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const credentialPath = root => resolve(root, '.local/affiliate-github-app.json');

export async function loadAppCredentials(root, env = process.env) {
  if (env.GITHUB_APP_CLIENT_ID || env.GITHUB_APP_CLIENT_SECRET) {
    if (!env.GITHUB_APP_CLIENT_ID || !env.GITHUB_APP_CLIENT_SECRET) throw new Error('Configura las dos credenciales de la GitHub App.');
    return { clientId: env.GITHUB_APP_CLIENT_ID, clientSecret: env.GITHUB_APP_CLIENT_SECRET };
  }
  try { return JSON.parse(await readFile(credentialPath(root), 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return null; throw new Error('No se ha podido leer la configuración privada de la GitHub App.'); }
}
export async function saveAppCredentials(root, credentials) {
  await mkdir(resolve(root, '.local'), { recursive: true });
  // Never overwrite an existing app, or write any of these secrets into the repository.
  await writeFile(credentialPath(root), JSON.stringify(credentials, null, 2) + '\n', { flag: 'wx', mode: 0o600 });
}

export class GitHubOAuth {
  #credentials; #pending = new Map(); #fetch; #now;
  constructor({ clientId, clientSecret, origin, repositoryId, fetchImpl = globalThis.fetch, now = Date.now }) {
    if (!clientId || !clientSecret) throw new Error('Faltan las credenciales de la GitHub App.');
    this.#credentials = { clientId, clientSecret }; this.origin = origin; this.repositoryId = repositoryId;
    this.#fetch = fetchImpl; this.#now = now;
  }
  start() {
    for (const [state, flow] of this.#pending) if (flow.expires <= this.#now()) this.#pending.delete(state);
    if (this.#pending.size >= 100) fail(429, 'Hay demasiados intentos de acceso. Espera unos minutos.');
    const state = random(), browser = random(), verifier = random();
    this.#pending.set(state, { browser, verifier, expires: this.#now() + 10 * 60 * 1000 });
    const url = new URL('https://github.com/login/oauth/authorize');
    url.search = new URLSearchParams({ client_id: this.#credentials.clientId, redirect_uri: `${this.origin}/auth/github/callback`, state, code_challenge: createHash('sha256').update(verifier).digest('base64url'), code_challenge_method: 'S256', login: 'dgarana', allow_signup: 'false' });
    return { url: url.href, browser };
  }
  async finish({ state, browser, code, error }) {
    const flow = this.#pending.get(state);
    if (!flow || flow.expires <= this.#now() || !equal(browser, flow.browser)) fail(403, 'El intento de acceso no es válido o ha caducado. Vuelve a pulsar Entrar con GitHub.');
    this.#pending.delete(state);
    if (error) fail(403, 'Has cancelado la autorización en GitHub.');
    if (typeof code !== 'string' || !/^[A-Za-z0-9_-]{1,255}$/.test(code)) fail(400, 'GitHub no ha devuelto un código de acceso válido.');
    let response;
    try {
      response = await this.#fetch('https://github.com/login/oauth/access_token', {
        method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: this.#credentials.clientId, client_secret: this.#credentials.clientSecret, code, redirect_uri: `${this.origin}/auth/github/callback`, code_verifier: flow.verifier, ...(this.repositoryId ? { repository_id: this.repositoryId } : {}) }),
        redirect: 'error', credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(20000)
      });
    } catch { fail(502, 'No se ha podido completar el acceso con GitHub. Vuelve a intentarlo.'); }
    let data;
    try { data = await response.json(); } catch { fail(502, 'GitHub no ha devuelto una respuesta válida.'); }
    if (!response.ok || data.error || typeof data.access_token !== 'string' || !/^ghu_[A-Za-z0-9_]+$/.test(data.access_token) || data.token_type !== 'bearer') fail(403, 'GitHub no ha autorizado el acceso. Vuelve a intentarlo.');
    if (data.expires_in !== undefined && (!Number.isFinite(data.expires_in) || data.expires_in <= 0)) fail(403, 'La credencial de GitHub ha caducado.');
    // No refresh token is retained. The administrator signs in again after the short session.
    return { token: data.access_token, ttl: data.expires_in ? Math.min(1800000, data.expires_in * 1000) : 1800000 };
  }
  close() { this.#pending.clear(); this.#credentials = {}; }
}

export class GitHubAppSetup {
  #pending = new Map(); #fetch; #now;
  constructor({ origin, owner, save, fetchImpl = globalThis.fetch, now = Date.now }) { this.origin = origin; this.owner = owner; this.save = save; this.#fetch = fetchImpl; this.#now = now; }
  start() {
    for (const [state, flow] of this.#pending) if (flow.expires <= this.#now()) this.#pending.delete(state);
    if (this.#pending.size >= 20) fail(429, 'Hay demasiados registros pendientes.');
    const state = random(), browser = random();
    this.#pending.set(state, { browser, expires: this.#now() + 10 * 60 * 1000 });
    return {
      browser, action: `https://github.com/organizations/${this.owner}/settings/apps/new?state=${state}`,
      manifest: { name: 'TopeRC Afiliados Local', url: 'https://toperc.com', description: 'Gestor privado de los enlaces de afiliación de TopeRC. Prueba local.', redirect_url: `${this.origin}/setup/github/callback`, callback_urls: [`${this.origin}/auth/github/callback`], public: false, hook_attributes: { active: false, url: 'https://toperc.com/' }, default_permissions: { contents: 'write', metadata: 'read' }, default_events: [], request_oauth_on_install: false }
    };
  }
  async finish({ state, browser, code }) {
    const flow = this.#pending.get(state);
    if (!flow || flow.expires <= this.#now() || !equal(flow.browser, browser)) fail(403, 'El registro no es válido o ha caducado. Inícialo de nuevo desde localhost.');
    this.#pending.delete(state);
    if (typeof code !== 'string' || !/^[A-Za-z0-9_-]{1,255}$/.test(code)) fail(400, 'Código de registro inválido.');
    let response;
    try { response = await this.#fetch(`https://api.github.com/app-manifests/${code}/conversions`, { method: 'POST', headers: { Accept: 'application/vnd.github+json' }, redirect: 'error', credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(20000) }); }
    catch { fail(502, 'No se ha podido recuperar la configuración de la aplicación.'); }
    let data;
    try { data = await response.json(); } catch { fail(502, 'GitHub no ha devuelto una configuración válida.'); }
    if (!response.ok || typeof data.client_id !== 'string' || typeof data.client_secret !== 'string' || !/^[a-z0-9-]+$/.test(data.slug || '') || data.owner?.login?.toLowerCase() !== this.owner.toLowerCase() || data.permissions?.contents !== 'write' || Object.keys(data.permissions || {}).some(key => !['contents', 'metadata'].includes(key))) fail(403, 'La configuración recibida no coincide con la aplicación de TopeRC.');
    const credentials = { clientId: data.client_id, clientSecret: data.client_secret, appSlug: data.slug, appId: data.id };
    await this.save(credentials);
    this.#pending.clear();
    return credentials;
  }
}

export function setupPage(flow) {
  const escape = text => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Conectar GitHub · TopeRC</title><link rel="stylesheet" href="/assets/affiliate-access.css"></head><body><main class="access-card"><a class="brand" href="/">TOPE<span>RC</span></a><p class="eyebrow">CONFIGURACIÓN LOCAL / GITHUB APP</p><h1>Conecta tu GitHub.</h1><p>Vamos a registrar <strong>TopeRC Afiliados Local</strong> en la organización <strong>toperc</strong>.</p><p>Permisos: leer y escribir contenidos, y leer metadatos. Al instalarla, selecciona únicamente <strong>toperc.github.io</strong>.</p><p class="micro">GitHub te pedirá confirmar el registro y la instalación. El servidor guardará las credenciales en su configuración privada local.</p><form method="post" action="${escape(flow.action)}"><input type="hidden" name="manifest" value="${escape(JSON.stringify(flow.manifest))}"><button type="submit">Revisar aplicación en GitHub ↗</button></form><a class="back" href="/admin/afiliados/acceso/">Volver al acceso</a></main></body></html>`;
}
