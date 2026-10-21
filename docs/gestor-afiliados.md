# Gestor de afiliación en GitHub Pages con token

La versión actual funciona con **Jekyll, GitHub Pages y la API de GitHub**. No necesita servidor Node, servicio de autenticación ni alojamiento externo. La vista previa local sirve únicamente los archivos de `_site`.

## Crear el token de prueba

Desde tu cuenta `dgarana`, abre [el formulario preparado de GitHub](https://github.com/settings/personal-access-tokens/new?name=TopeRC%20Afiliados&description=Gestion%20del%20catalogo%20de%20enlaces%20de%20TopeRC&target_name=toperc&expires_in=7&contents=write).

Comprueba estos valores antes de generarlo:

| Campo | Valor |
| --- | --- |
| Tipo | Fine-grained personal access token |
| Propietario / Resource owner | `toperc` |
| Repositorios | Only select repositories → `toperc.github.io` |
| Permiso | Contents: Read and write; Metadata: Read se incluye automáticamente |
| Caducidad | 7 días para esta prueba |

El formulario puede completar propietario, permisos y caducidad, pero debes seleccionar el repositorio. Al ser propietario de la organización, la aprobación del token es automática. GitHub muestra el token al generarlo: cópialo y pégalo directamente en el campo de acceso del gestor, no en el chat ni en archivos del proyecto.

El permiso Contents afecta a los contenidos del repositorio. La aplicación utiliza ese permiso únicamente para leer y actualizar `_data/affiliate_links.json` en la rama configurada.

## Entrar y editar

1. Abre `/admin/afiliados/`.
2. Pega el token y pulsa **Entrar y cargar catálogo**.
3. El navegador comprueba la identidad mediante `/user`, comprueba el acceso de la cuenta al repositorio y carga el catálogo remoto. La cuenta configurada es `dgarana`, ID estable `5599011`.
4. Edita un producto y pulsa **Aplicar al catálogo**. Después pulsa **Guardar en GitHub** o descarga el JSON.
5. **Cerrar sesión** elimina el token de la memoria de la pestaña y vacía el catálogo del editor. Recargar, salir de la página o cerrar la pestaña también obliga a introducirlo de nuevo.

No se usan cookies, localStorage, sessionStorage ni una API local de sesiones. El campo del token se vacía al enviarlo. La credencial viaja solo a `https://api.github.com`, en la cabecera Authorization, sin credenciales de cookies ni redirecciones. El panel no carga Google Tag Manager ni scripts de terceros.

La vida del token es independiente de la pestaña. Mientras siga vigente puedes reutilizarlo al volver a entrar. Cerrar sesión no lo revoca en GitHub; puedes revocarlo desde la configuración de tokens de tu cuenta.

Si GitHub devuelve un token inválido durante el guardado, el gestor lo descarta y conserva el borrador para que puedas descargarlo antes de volver a entrar. Los permisos efectivos del token se comprueban por GitHub en cada operación; un token de solo lectura no podrá guardar.

## Qué es público

La interfaz, su código, los modelos y las referencias de uso son archivos estáticos públicos. La pantalla inicial espera a comprobar la cuenta antes de mostrar el editor y cargar el catálogo, pero esa comprobación del navegador no es una barrera de confidencialidad. La autorización real para escribir la proporciona GitHub.

El repositorio de TopeRC también es público, al igual que los enlaces de afiliado que se muestran en los artículos. No guardes secretos ni notas privadas en el catálogo.

## Rama y publicación

`_data/affiliate_admin.json` fija repositorio, rama y cuentas configuradas. El gestor publicado guarda en **main**. Cada guardado confirmado crea un commit e inicia la compilación y publicación de GitHub Pages; los enlaces públicos cambian cuando ese despliegue termina. La POC se comprobó previamente en `codex/poc-afiliados`.

El catálogo se carga siempre de la rama remota, no de una copia incrustada en el HTML. El SHA leído protege frente a cambios de otras pestañas: un conflicto conserva el borrador y exige combinar los cambios. No se reintentan escrituras automáticamente. Si falla la red durante un guardado, consulta el historial antes de reintentarlo.

## Productos y artículos

Un producto admite una referencia estable, nombre, categoría, modelos relacionados, notas públicas y un enlace por tienda: Amazon, AliExpress, Rlaarlo y HobbyKing. Los enlaces activos se publican; los marcados para revisar o desactivados se ocultan. Los estados no indican disponibilidad comercial.

Para usarlo en un artículo, declara en el front matter:

```yaml
affiliate_products: [lipo-ovionic-2200, lipo-zeee-2200]
```

Y añade donde deba aparecer:

```liquid
{% include affiliate_products.html %}
```

Seleccionar un modelo organiza el catálogo; no introduce automáticamente productos en sus artículos ni acredita compatibilidad. **Dónde aparece** refleja la última compilación. Los enlaces públicos conservan su URL de afiliado y usan `rel="sponsored noopener noreferrer"`.

## Comprobar y previsualizar

```sh
node --test _checks/affiliate_core.test.mjs _checks/affiliate_token.test.mjs
bundle exec jekyll build
node _checks/validate_affiliates.mjs
python -m http.server 4174 --bind 127.0.0.1 --directory _site
```

Abre `http://localhost:4174/admin/afiliados/`. El servidor de Python solo sirve archivos, igual que Pages; la cuenta y el guardado se comprueban directamente contra GitHub. `assets/affiliate-context.json` se genera automáticamente con Jekyll.

Validación de la POC: 15 pruebas automáticas, compilación de Jekyll y comprobación de 50 páginas sin enlaces locales rotos. También se comprobó en el navegador el acceso real de `dgarana`, la carga de los tres productos y el guardado directo con token en la rama de pruebas. La nota temporal usada para comprobar la escritura se retiró en un segundo guardado. Una prueba de regresión cubre la llamada a `fetch` sin enlazar el cliente como receptor, necesaria para evitar el error `Illegal invocation` del navegador.

El prototipo anterior de servidor y OAuth permanece en `_admin/`, fuera de la compilación, y su documentación está en [prototipo-afiliados-oauth.md](prototipo-afiliados-oauth.md). No participa en esta versión. No hace falta borrar ni modificar la GitHub App ya registrada para probar el acceso con token.

Referencias: [tokens de GitHub y campos del formulario](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens), [peticiones desde el navegador](https://docs.github.com/en/rest/using-the-rest-api/using-cors-and-jsonp-to-make-cross-origin-requests) y [API Contents](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents).
