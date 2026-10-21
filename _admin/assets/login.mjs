const form = document.getElementById('login-form');
const status = document.getElementById('github-status');
const notice = document.getElementById('login-notice');
const oauthError = new URLSearchParams(window.location.search).get('oauth_error');
if (oauthError) { notice.className = 'notice error'; notice.textContent = oauthError === 'denied' ? 'GitHub no ha autorizado el acceso. Comprueba que has usado dgarana, que la app está instalada en toperc.github.io y que has aceptado la autorización. También puede haber caducado el intento; vuelve a entrar.' : 'No se ha podido completar el acceso con GitHub. Vuelve a intentarlo.'; history.replaceState(null, '', window.location.pathname); }
try {
  const response = await fetch('/api/auth-options', { cache: 'no-store', credentials: 'same-origin' });
  if (!response.ok) throw new Error();
  const options = await response.json();
  document.getElementById('github-login').hidden = !options.github;
  status.textContent = options.github ? 'Entra con tu sesión habitual de GitHub. No necesitas copiar un token.' : 'Falta conectar la aplicación de GitHub para activar el botón de acceso.';
  if (options.setup_url) { const setup = document.getElementById('github-setup'); setup.href = options.setup_url; setup.hidden = false; setup.textContent = options.github ? 'Revisar la instalación de la aplicación' : 'Configurar GitHub para esta prueba'; }
} catch { status.textContent = 'No se ha podido comprobar el acceso con GitHub. Recarga la página.'; }
form.addEventListener('submit', async event => {
  event.preventDefault();
  const input = document.getElementById('login-token');
  const button = document.getElementById('login-button');
  const notice = document.getElementById('login-notice');
  const token = input.value; input.value = ''; button.disabled = true;
  notice.textContent = 'Comprobando tu identidad y tus permisos…'; notice.className = 'notice';
  try {
    const response = await fetch('/api/login', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }), redirect: 'error' });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'No se ha podido iniciar sesión.');
    window.location.replace('/admin/afiliados/');
  } catch (error) { notice.textContent = error.message; notice.className = 'notice error'; }
  finally { button.disabled = false; }
});
