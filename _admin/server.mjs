import http from 'node:http';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, sep, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GitHubCatalog, validateCatalog } from './assets/affiliate-core.mjs';
import { GitHubOAuth, GitHubAppSetup, loadAppCredentials, saveAppCredentials, setupPage } from './github-oauth.mjs';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const SESSION_MS = 30 * 60 * 1000;
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const LIMIT = 512 * 1024;
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.jpg': 'image/jpeg', '.xml': 'application/xml' };
class HttpError extends Error { constructor(status, message) { super(message); this.status = status; } }
const constantEqual = (a, b) => typeof a === 'string' && typeof b === 'string' && Buffer.byteLength(a) === Buffer.byteLength(b) && timingSafeEqual(Buffer.from(a), Buffer.from(b));
const random = () => randomBytes(32).toString('hex');

async function body(req) {
  if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) throw new HttpError(415, 'Se requiere contenido JSON.');
  let size = 0; const chunks = [];
  for await (const chunk of req) { size += chunk.length; if (size <= LIMIT) chunks.push(chunk); }
  if (size > LIMIT) throw new HttpError(413, 'El catálogo supera el tamaño permitido.');
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); }
  catch { throw new HttpError(400, 'El contenido JSON no es válido.'); }
}

export async function createAdminServer({ root = ROOT, config, origin = 'http://localhost:4174', fetchImpl = globalThis.fetch, now = Date.now, oauthConfig = null, setupEnabled = false, saveCredentials } = {}) {
  const settings = config || JSON.parse(await readFile(resolve(root, '_data/affiliate_admin.json'), 'utf8'));
  if (!Array.isArray(settings.allowed_user_ids) || !settings.allowed_user_ids.length || settings.allowed_user_ids.some(id => !Number.isSafeInteger(id) || id <= 0)) throw new Error('Configura una lista explícita de IDs de GitHub autorizados.');
  const publicOrigin = new URL(origin);
  const loopback = ['localhost', '127.0.0.1', '[::1]'].includes(publicOrigin.hostname);
  if (publicOrigin.origin !== origin || publicOrigin.username || publicOrigin.password || (publicOrigin.protocol !== 'https:' && !(publicOrigin.protocol === 'http:' && loopback))) throw new Error('El gestor remoto requiere un origen HTTPS.');
  // Validate the fixed repository and branch at startup, before accepting credentials.
  new GitHubCatalog({ repository: settings.repository, branch: settings.branch, token: 'configuration-check' });
  const sessions = new Map(); const attempts = new Map();
  const cookieName = publicOrigin.protocol === 'https:' ? '__Host-toperc_admin' : 'toperc_admin_dev';
  const cookie = (value, maxAge) => `${cookieName}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${publicOrigin.protocol === 'https:' ? '; Secure' : ''}`;
  const transientName = kind => publicOrigin.protocol === 'https:' ? `__Host-toperc_${kind}` : `toperc_${kind}_dev`;
  const transientCookie = (kind, value, age = 600) => `${transientName(kind)}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${publicOrigin.protocol === 'https:' ? '; Secure' : ''}`;
  const readCookie = (req, name) => (req.headers.cookie || '').split(';').map(value => value.trim()).find(value => value.startsWith(`${name}=`))?.slice(name.length + 1);
  const makeOAuth = credentials => new GitHubOAuth({ ...credentials, origin, repositoryId: settings.repository_id, fetchImpl, now });
  let oauth = oauthConfig ? makeOAuth(oauthConfig) : null;
  const localSetup = setupEnabled && loopback;
  const setup = localSetup ? new GitHubAppSetup({ origin, owner: settings.repository.split('/')[0], fetchImpl, now, save: saveCredentials || (credentials => saveAppCredentials(root, credentials)) }) : null;
  const client = token => new GitHubCatalog({ repository: settings.repository, branch: settings.branch, token, fetchImpl });
  const github = async (path, token) => {
    let response;
    try { response = await fetchImpl(`https://api.github.com/${path}`, { headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}` }, redirect: 'error', credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(20000) }); }
    catch { throw new HttpError(502, 'No se ha podido verificar el acceso con GitHub.'); }
    if (!response.ok) throw new HttpError(response.status === 401 ? 401 : 403, 'GitHub no ha autorizado el acceso. Comprueba el token y sus permisos.');
    return response.json();
  };
  const json = (res, status, value) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' }); res.end(JSON.stringify(value)); };
  const html = (res, text) => { res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(text); };
  const redirect = (res, url) => { res.writeHead(303, { Location: url }); res.end(); };
  const issueSession = async (token, oldId, ttl = SESSION_MS) => {
    const user = await github('user', token);
    if (!settings.allowed_user_ids.includes(user.id)) throw new HttpError(403, 'Esta cuenta no está autorizada para entrar al gestor.');
    const repo = await github(`repos/${settings.repository}`, token);
    if (!repo.permissions?.push) throw new HttpError(403, 'Esta cuenta no tiene permiso de escritura en el repositorio.');
    await client(token).load();
    if (oldId) sessions.delete(oldId);
    if (sessions.size >= 20) sessions.delete(sessions.keys().next().value);
    const id = random(); sessions.set(id, { token, user: { id: user.id, login: user.login }, csrf: random(), expires: now() + ttl });
    return cookie(id, Math.floor(ttl / 1000));
  };
  const installationPage = credentials => `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aplicación registrada · TopeRC</title><link rel="stylesheet" href="/assets/affiliate-access.css"></head><body><main class="access-card"><p class="eyebrow">CONFIGURACIÓN LOCAL</p><h1>Aplicación registrada.</h1><p>Instala la aplicación en la organización <strong>toperc</strong> y selecciona únicamente <strong>toperc.github.io</strong>.</p><a class="button" href="https://github.com/apps/${credentials.appSlug}/installations/new">Revisar instalación en GitHub ↗</a><a class="back" href="/auth/github/">Ya está instalada: entrar con GitHub</a></main></body></html>`;
  const file = async (res, path) => {
    try { const bytes = await readFile(path); res.writeHead(200, { 'Content-Type': mime[extname(path)] || 'application/octet-stream' }); res.end(bytes); }
    catch (error) { if (error.code === 'ENOENT') throw new HttpError(404, 'No encontrado.'); throw error; }
  };
  const safeStatic = async (res, path) => {
    const siteRoot = await realpath(resolve(root, '_site'));
    let target = resolve(siteRoot, '.' + path);
    if (target !== siteRoot && !target.startsWith(siteRoot + sep)) throw new HttpError(404, 'No encontrado.');
    try { if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html'); target = await realpath(target); }
    catch { throw new HttpError(404, 'No encontrado.'); }
    if (!target.startsWith(siteRoot + sep)) throw new HttpError(404, 'No encontrado.');
    return file(res, target);
  };
  const server = http.createServer(async (req, res) => {
    res.setHeader('Cache-Control', 'no-store, private'); res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff'); res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Referrer-Policy', 'no-referrer'); res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'");
    let sessionId, session;
    try {
      const path = decodeURIComponent(new URL(req.url, origin).pathname);
      for (const [id, item] of sessions) if (item.expires <= now()) sessions.delete(id);
      for (const [ip, item] of attempts) if (item.until <= now()) attempts.delete(ip);
      sessionId = readCookie(req, cookieName);
      session = sessions.get(sessionId);
      const mutation = !['GET', 'HEAD'].includes(req.method);
      if (mutation && req.headers.origin !== origin) throw new HttpError(403, 'Origen no autorizado.');
      if (req.headers['sec-fetch-site'] === 'cross-site' && (mutation || path.startsWith('/api/') || path.startsWith('/admin/afiliados/assets/'))) throw new HttpError(403, 'Petición entre sitios no autorizada.');
      if (req.method === 'GET' && path === '/api/auth-options') return json(res, 200, { github: Boolean(oauth), setup_url: localSetup ? (oauth ? '/setup/github/install' : '/setup/github/') : null });
      if (req.method === 'GET' && path === '/auth/github/') {
        if (!oauth) throw new HttpError(503, 'La GitHub App todavía no está configurada.');
        const flow = oauth.start(); res.setHeader('Set-Cookie', transientCookie('oauth', flow.browser));
        return redirect(res, flow.url);
      }
      if (req.method === 'GET' && path === '/auth/github/callback') {
        res.setHeader('Set-Cookie', transientCookie('oauth', '', 0));
        if (!oauth) throw new HttpError(503, 'La GitHub App todavía no está configurada.');
        const query = new URL(req.url, origin).searchParams;
        try {
          const result = await oauth.finish({ state: query.get('state'), browser: readCookie(req, transientName('oauth')), code: query.get('code'), error: query.get('error') });
          const sessionCookie = await issueSession(result.token, sessionId, result.ttl);
          res.setHeader('Set-Cookie', [sessionCookie, transientCookie('oauth', '', 0)]);
          return redirect(res, '/admin/afiliados/');
        } catch (error) {
          return redirect(res, `/admin/afiliados/acceso/?oauth_error=${error.status === 403 ? 'denied' : 'failed'}`);
        }
      }
      if (path.startsWith('/setup/github')) {
        if (!localSetup || !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress) || req.method !== 'GET') throw new HttpError(404, 'No encontrado.');
        if (path === '/setup/github/' && !oauth) {
          const flow = setup.start();
          res.setHeader('Set-Cookie', transientCookie('setup', flow.browser));
          res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'; form-action https://github.com; frame-ancestors 'none'");
          return html(res, setupPage(flow));
        }
        if (path === '/setup/github/callback' && !oauth) {
          const query = new URL(req.url, origin).searchParams;
          oauthConfig = await setup.finish({ state: query.get('state'), browser: readCookie(req, transientName('setup')), code: query.get('code') });
          oauth = makeOAuth(oauthConfig);
          res.setHeader('Set-Cookie', transientCookie('setup', '', 0));
          return redirect(res, '/setup/github/install');
        }
        if (path === '/setup/github/install' && oauthConfig?.appSlug) return html(res, installationPage(oauthConfig));
        throw new HttpError(404, 'No encontrado.');
      }
      if (path === '/api/login' && req.method === 'POST') {
        const ip = req.socket.remoteAddress;
        const attempt = attempts.get(ip) || { count: 0, until: now() + LOGIN_WINDOW_MS };
        if (attempt.count >= 8) { res.setHeader('Retry-After', Math.ceil((attempt.until - now()) / 1000)); throw new HttpError(429, 'Demasiados intentos. Espera unos minutos antes de volver a entrar.'); }
        attempt.count++; attempts.set(ip, attempt);
        const payload = await body(req); const token = payload?.token;
        if (typeof token !== 'string' || !token || token.length > 255 || /[\s\x00-\x1f\x7f]/.test(token)) throw new HttpError(400, 'Introduce un token de GitHub válido.');
        res.setHeader('Set-Cookie', await issueSession(token, sessionId));
        attempts.delete(ip);
        return json(res, 200, { ok: true });
      }
      if (path.startsWith('/api/')) {
        if (!session) throw new HttpError(401, 'Identifícate para acceder al gestor.');
        if (mutation && !constantEqual(req.headers['x-csrf-token'], session.csrf)) throw new HttpError(403, 'La verificación de la sesión ha fallado. Recarga el gestor.');
        if (path === '/api/session' && req.method === 'GET') return json(res, 200, { login: session.user.login, repository: settings.repository, branch: settings.branch, csrf: session.csrf, expires_at: session.expires });
        if (path === '/api/context' && req.method === 'GET') return await file(res, resolve(root, '_admin/generated/context.json'));
        if (path === '/api/catalog' && req.method === 'GET') {
          const remote = client(session.token); const catalog = await remote.load();
          return json(res, 200, { catalog, sha: remote.sha });
        }
        if (path === '/api/catalog' && req.method === 'PUT') {
          const payload = await body(req);
          if (!payload || typeof payload.sha !== 'string' || !/^[a-f0-9]{40,64}$/.test(payload.sha)) throw new HttpError(400, 'Carga la versión del catálogo antes de guardar.');
          try { validateCatalog(payload.catalog); } catch (error) { throw new HttpError(400, error.message); }
          const remote = client(session.token); remote.sha = payload.sha;
          const result = await remote.save(payload.catalog);
          return json(res, 200, { ...result, sha: remote.sha });
        }
        if (path === '/api/logout' && req.method === 'POST') { sessions.delete(sessionId); res.setHeader('Set-Cookie', cookie('', 0)); return json(res, 200, { ok: true }); }
        throw new HttpError(404, 'No encontrado.');
      }
      if (req.method !== 'GET') throw new HttpError(405, 'Método no permitido.');
      if (path === '/admin/afiliados/acceso/' || path === '/admin/afiliados/acceso/index.html') {
        if (session) { res.writeHead(303, { Location: '/admin/afiliados/' }); return res.end(); }
        return await file(res, resolve(root, '_admin/login.html'));
      }
      if (path === '/admin/afiliados/acceso/login.mjs') return await file(res, resolve(root, '_admin/assets/login.mjs'));
      if (['/admin/afiliados', '/admin/afiliados/', '/admin/afiliados/index.html'].includes(path)) {
        if (!session) { res.writeHead(303, { Location: '/admin/afiliados/acceso/' }); return res.end(); }
        return await file(res, resolve(root, '_admin/index.html'));
      }
      if (path.startsWith('/admin/afiliados/assets/')) {
        if (!session) throw new HttpError(401, 'Identifícate para acceder al gestor.');
        const name = path.slice('/admin/afiliados/assets/'.length);
        if (!['affiliate-admin.mjs', 'affiliate-admin.css', 'affiliate-core.mjs', 'session-client.mjs'].includes(name)) throw new HttpError(404, 'No encontrado.');
        return await file(res, resolve(root, '_admin/assets', name));
      }
      // Deny old URLs too, even when a stale build still contains those files.
      if (/^\/(?:_admin|_data|api|admin|auth|setup)(?:\/|$)/.test(path) || /^\/assets\/affiliate-(?:admin|core|catalog|context|references)(?:[.-])/.test(path)) throw new HttpError(404, 'No encontrado.');
      return await safeStatic(res, path);
    } catch (error) {
      const status = Number.isInteger(error.status) ? error.status : 500;
      if (status === 401 && sessionId) { sessions.delete(sessionId); res.setHeader('Set-Cookie', cookie('', 0)); }
      if (!res.headersSent) json(res, status, { error: status === 500 ? 'No se ha podido completar la operación.' : error.message });
      else res.end();
    }
  });
  server.requestTimeout = 30000; server.headersTimeout = 10000;
  server.on('close', () => { sessions.clear(); attempts.clear(); oauth?.close(); });
  return server;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const origin = process.env.ADMIN_ORIGIN || 'http://localhost:4174';
  const host = process.env.ADMIN_HOST || '127.0.0.1';
  if (!['127.0.0.1', '::1'].includes(host) && new URL(origin).protocol !== 'https:') throw new Error('Para escuchar fuera de localhost debes configurar ADMIN_ORIGIN con HTTPS.');
  const oauthConfig = await loadAppCredentials(ROOT);
  const server = await createAdminServer({ origin, oauthConfig, setupEnabled: process.env.ADMIN_GITHUB_SETUP === '1' });
  server.listen(Number(process.env.ADMIN_PORT || 4174), host, () => console.log(`Gestor protegido disponible en ${origin}/admin/afiliados/`));
}
