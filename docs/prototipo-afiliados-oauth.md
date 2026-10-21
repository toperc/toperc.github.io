# Gestor de afiliación con acceso privado

El editor requiere una sesión que valida el servidor. Solo está autorizada la identidad GitHub **dgarana**, ID estable **5599011**, y debe tener permiso de escritura sobre `toperc/toperc.github.io`. La cuenta se comprobó mediante la API de GitHub el 21 de octubre de 2026.

## Qué se publica

La web mantiene Jekyll y GitHub Pages. El editor, su JavaScript y los JSON de trabajo están en `_admin/`, fuera de la compilación pública. En `/admin/afiliados/`, GitHub Pages solo publica una pantalla de acceso restringido; nunca el editor. La comprobación previa al despliegue falla si se cuela algún archivo privado.

El servidor privado entrega el editor únicamente después de iniciar sesión. También protege sus módulos, la lectura del catálogo, las referencias y el guardado. Los enlaces activos de los artículos siguen siendo públicos y funcionan sin JavaScript.

El repositorio de la web es público: su código y el catálogo fuente pueden consultarse en GitHub. Esta protección restringe el acceso al gestor; no convierte el repositorio ni los enlaces publicados en datos secretos. No guardes credenciales ni notas privadas en el catálogo.

## Arrancar la vista previa protegida

Requiere Node.js 22 o posterior, Ruby y las dependencias Jekyll del proyecto. Desde la raíz:

```sh
bundle exec ruby _admin/build_context.rb
bundle exec jekyll build
node _admin/server.mjs
```

Abre `http://localhost:4174/admin/afiliados/`. Sin sesión te llevará a la pantalla de acceso. El servidor solo escucha en `127.0.0.1` por defecto. La antigua vista previa con `python -m http.server` ya no sirve el editor: los archivos privados no están en `_site`.

## Conectar «Entrar con GitHub» en localhost

El servidor admite el flujo OAuth de una GitHub App, con estado aleatorio, cookie temporal vinculada al navegador y PKCE S256. El callback es `http://localhost:4174/auth/github/callback`. Después de autorizar en GitHub se aplican la misma lista de identidades permitidas y las comprobaciones del catálogo que en el acceso por token.

Para registrar la app de prueba, arranca el servidor con `ADMIN_GITHUB_SETUP=1`. En PowerShell:

```powershell
$env:ADMIN_GITHUB_SETUP = '1'
node _admin/server.mjs
```

1. Abre `http://localhost:4174/setup/github/` y revisa el nombre y los permisos de **TopeRC Afiliados Local**.
2. Pulsa **Revisar aplicación en GitHub**. Entra en GitHub como `dgarana`, revisa el registro en la organización `toperc` y confirma su creación si estás conforme. El webhook está desactivado: no se necesita un receptor para este gestor.
3. GitHub vuelve al servidor local con un código de registro. El servidor intercambia ese código y guarda exclusivamente Client ID, Client Secret, slug e ID de la app en `.local/affiliate-github-app.json`, excluido de Git. No conserva la clave privada ni el secreto de webhook generados por GitHub.
4. Revisa la instalación de la app y elige **Only select repositories → toperc.github.io**. Confirma los permisos **Contents: Read and write** y **Metadata: Read**.
5. Vuelve al acceso y pulsa **Entrar con GitHub**. Acepta la autorización cuando GitHub la solicite. El servidor recibe la credencial automáticamente, verifica tu identidad y abre la sesión privada.

El registro y la instalación requieren confirmación expresa en GitHub: abrir la revisión no crea la aplicación ni le concede acceso. El registro local solo se habilita mediante la variable indicada, solo atiende conexiones loopback, valida su estado y se desactiva al recuperar una app. Los intentos pendientes caducan a los diez minutos. Si el inicio de sesión tarda más, vuelve a empezar desde `/setup/github/`.

En los siguientes arranques el servidor carga la configuración privada y el botón funciona sin activar el registro. Para un servidor remoto, usa `GITHUB_APP_CLIENT_ID` y `GITHUB_APP_CLIENT_SECRET` como secretos del proveedor, configura el callback HTTPS correspondiente en GitHub y mantén deshabilitado `ADMIN_GITHUB_SETUP`. No pegues el Client Secret en conversaciones ni en el código.

El intercambio OAuth solicita además la restricción al ID del repositorio de TopeRC. No se conservan refresh tokens: al terminar la sesión de treinta minutos vuelves a entrar con GitHub. Si GitHub entrega un token con vida inferior, la sesión se acorta para respetarla.

## Entrar y trabajar con el acceso alternativo

1. Crea un **fine-grained personal access token** de GitHub con caducidad corta, limitado al repositorio de TopeRC y permiso **Contents: Read and write**. No lo pegues en el chat ni en archivos del proyecto.
2. Introduce el token en la pantalla de acceso. El servidor comprueba su identidad con `/user`, compara el ID con la lista autorizada, comprueba el permiso de la cuenta y carga el catálogo de la rama configurada.
3. Si el acceso es correcto, se crea una sesión de **30 minutos**. El navegador recibe una cookie opaca `HttpOnly` y `SameSite=Strict`; el token de GitHub se mantiene solo en la memoria del servidor.
4. Edita un producto y pulsa **Aplicar al catálogo**. Después pulsa **Guardar en GitHub** o descarga el JSON. Guardar actualiza únicamente `_data/affiliate_links.json`.
5. **Cerrar sesión** invalida la sesión del servidor y borra la cookie. La caducidad vuelve a bloquear el editor y la API; el panel también comprueba la caducidad al recuperar el foco.

El destino se fija en `_data/affiliate_admin.json`: no se puede cambiar desde el navegador. La configuración actual guarda en **codex/poc-afiliados** y no publica producción. Guardar en `main`, si se configura deliberadamente en el servidor, inicia la publicación de GitHub Pages.

El guardado conserva el SHA leído por cada pestaña. Si otra sesión modifica el catálogo, GitHub rechaza la versión antigua; no se sobrescribe ni se reintenta automáticamente. Descarga el borrador antes de recargar y combinar cambios. Si falla la conexión durante un guardado, revisa el historial antes de reintentar.

## Conectar productos con artículos

Cada producto tiene una referencia estable, nombre, categoría, modelos relacionados, notas públicas y hasta un enlace por tienda. Se admiten Amazon, AliExpress, Rlaarlo y HobbyKing. Los enlaces **activos** se muestran; **para revisar** o **desactivados** se ocultan al publicar. Estos estados no indican disponibilidad comercial.

En el front matter del artículo:

```yaml
affiliate_products: [lipo-ovionic-2200, lipo-zeee-2200]
```

En el punto donde quieras mostrar la lista:

```liquid
{% include affiliate_products.html %}
```

El artículo enlaza directamente a las URLs oficiales y usa `rel="sponsored noopener noreferrer"`. Seleccionar modelos en el panel organiza el catálogo: no inserta productos automáticamente ni acredita compatibilidades. **Dónde aparece** refleja la última generación del contexto privado; vuelve a generarlo cuando cambien las referencias de los artículos.

## Alojar el acceso privado en Internet

GitHub Pages no ejecuta el servidor de sesiones. Para gestionar desde otros dispositivos hay que alojar el proceso Node en un servicio con HTTPS y conectarlo, por ejemplo, a `gestor.toperc.com`. No se ha contratado ni desplegado ese servicio como parte de esta POC.

El servicio necesita el proyecto con `_admin/`, `_data/affiliate_admin.json`, el contexto generado y `_site`. No necesita un token permanente: cada usuario introduce su token para abrir una sesión. No debe publicar la carpeta del proyecto como directorio estático.

Variables del proceso:

```text
ADMIN_ORIGIN=https://gestor.toperc.com
ADMIN_HOST=0.0.0.0
ADMIN_PORT=4174
```

El origen es explícito: no se deduce de cabeceras Host o X-Forwarded-Host enviadas por visitantes. El servicio remoto exige HTTPS en su URL pública, normalmente terminado por el proxy del proveedor, y emite cookies `__Host-` con `Secure`, sin atributo Domain. Solo se acepta HTTP para pruebas en localhost. Cuando esté desplegado, configura `private_url` en `_data/affiliate_admin.json` para que la pantalla de GitHub Pages enlace a su URL HTTPS.

Las sesiones están en memoria: reiniciar el proceso las cierra; para esta POC usa una sola instancia. Las mutaciones exigen el origen configurado y un token CSRF de sesión. No se aceptan peticiones entre sitios ni redirecciones en la comunicación con GitHub. Se limitan los intentos de acceso, y las respuestas privadas usan `no-store`, bloqueo de marcos y una política de contenido sin scripts de terceros.

## Comprobaciones

```sh
node --test _checks/affiliate_core.test.mjs _checks/affiliate_access.test.mjs _checks/github_oauth.test.mjs
bundle exec ruby _admin/build_context.rb
bundle exec jekyll build
node _checks/validate_affiliates.mjs
bundle exec ruby _checks/validate_content.rb
```

Se comprueban identidad autorizada y rechazada, permisos, ausencia de sesión, cookies inventadas, CSRF, origen, cierre, caducidad, límite de intentos, SHA concurrente y HTTPS. También se comprueban estado y PKCE de OAuth, respuesta vinculada al navegador, rechazo de códigos reutilizados, cancelación, registro de la app y exclusión de secretos. El editor y los JSON privados no deben aparecer en `_site` y los artículos deben conservar sus enlaces activos.

Resultado del 21 de octubre de 2026: 24 tests superados. La revisión anterior de acceso privado compiló correctamente y comprobó 50 páginas sin enlaces internos rotos. Se verificó el servidor con la identidad real de `dgarana` usando el transporte ya autenticado de GitHub CLI, sin extraer credenciales: entrada, lectura privada del catálogo, entrega del editor y cierre de sesión. La pantalla de acceso se comprobó en navegador. El formulario alternativo no se probó introduciendo un token personal real.

También se completó la prueba OAuth real en el navegador: el usuario creó **TopeRC Afiliados Local** en `toperc`, la instaló únicamente en `toperc.github.io` y autorizó su cuenta. GitHub devolvió al gestor, que confirmó `dgarana`, abrió una sesión de treinta minutos y cargó los tres productos desde la rama de la POC sin pegar ningún token. Las credenciales quedaron en el archivo local excluido de Git; no están en la documentación ni en el código.

La persistencia en GitHub ya se comprobó en la primera POC con el mismo transporte del catálogo: guardado temporal, lectura en otra sesión, rechazo de una sesión antigua y restauración de los datos originales. La generación automática de enlaces sigue fuera de esta iteración.

Referencias: [GitHub Pages es un servicio estático](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages), [identidad autenticada de GitHub](https://docs.github.com/en/rest/users/users#get-the-authenticated-user) y [API Contents](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents).

OAuth y registro: [tokens de usuario de una GitHub App](https://docs.github.com/en/apps/creating-github-apps/authenticating-with-a-github-app/generating-a-user-access-token-for-a-github-app) y [registro mediante manifiesto](https://docs.github.com/en/apps/sharing-github-apps/registering-a-github-app-from-a-manifest).
