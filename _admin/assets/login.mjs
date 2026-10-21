const form = document.getElementById('login-form');
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
