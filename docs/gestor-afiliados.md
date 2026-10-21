# POC: catálogo de afiliación con guardado en GitHub

El panel está en `/admin/afiliados/`. La web mantiene Jekyll y GitHub Pages. No hay base de datos adicional ni scripts de terceros en el panel. El catálogo de productos y sus enlaces es información pública; no se deben guardar credenciales ni notas privadas en él.

## Probar sin configurar una cuenta

1. Compila y sirve la web con Jekyll, o sirve la carpeta `_site` por HTTP después de compilar.
2. Abre `/admin/afiliados/`. Aparecen las tres baterías del Wltoys 144001 con sus enlaces originales de Amazon.
3. Selecciona una batería, cambia su enlace o añade otra tienda y pulsa **Aplicar al catálogo**.
4. Comprueba la vista previa. Los filtros permiten buscar por nombre, referencia y modelo, tienda y estado.
5. Pulsa **Descargar catálogo** para obtener el JSON modificado. En este modo los cambios solo están en memoria: no se escribe en el repositorio ni en disco al editar.

Para publicar la descarga manualmente, sustituye `_data/affiliate_links.json`, compila y sube el cambio. La prueba no inventa enlaces de otras tiendas ni altera los parámetros de seguimiento existentes.

## Probar el guardado remoto real

La configuración inicial apunta a `toperc/toperc.github.io`, rama `codex/poc-afiliados`. La rama y el catálogo deben estar subidos a GitHub antes de conectar. No es suficiente crear la rama solo en tu ordenador. Puede usarse otra rama o un fork indicándolo en el panel.

1. En GitHub, crea un **fine-grained personal access token**, con caducidad corta, limitado al repositorio elegido y al permiso **Contents: Read and write**. Si el repositorio pertenece a una organización, esta puede requerir aprobar el token. No pegues el token en conversaciones ni en archivos.
2. Abre **Conectar con GitHub**, revisa repositorio y rama e introduce el token. El navegador lo envía solo a `https://api.github.com` en la cabecera de autenticación. El campo se vacía al conectar. El token se mantiene en memoria y desaparece al desconectar o recargar; no se usa localStorage, sessionStorage ni cookies.
3. Pulsa **Conectar y cargar catálogo**. Se carga el archivo desde la rama remota y se recuerda su SHA. Si tenías cambios locales, el panel pregunta antes de sustituirlos.
4. Edita, aplica al catálogo y pulsa **Guardar en GitHub**. El panel actualiza exclusivamente `_data/affiliate_links.json` mediante la API Contents. Solo muestra éxito cuando GitHub confirma el archivo y el commit. Puedes abrir el enlace al cambio.
5. Recarga, vuelve a conectar y comprueba que el cambio persiste. También puedes revisarlo desde otro dispositivo.

En `codex/poc-afiliados` el guardado crea un commit en esa rama y **no publica producción**. Para publicar, integra la rama en `main`. Si eliges `main` como destino en el panel, el commit inicia el flujo de GitHub Pages; la web cambiará cuando termine el despliegue. Las reglas de protección de ramas siguen aplicándose.

Si otra persona guarda antes, GitHub rechaza el SHA antiguo. El panel conserva el borrador y no sobrescribe ni reintenta automáticamente: descarga tu versión, vuelve a cargar la remota y combina los cambios. Si falla la red durante un guardado, revisa el historial antes de reintentar, porque el servidor podría haberlo recibido.

## Conectar productos con artículos

Los productos tienen una referencia estable, nombre, categoría, modelos relacionados, notas públicas y hasta un enlace por tienda. Se admiten Amazon, AliExpress, Rlaarlo y HobbyKing. Cada enlace se marca como **activo**, **para revisar** o **desactivado**. Solo los activos se publican; esos estados no afirman disponibilidad comercial.

Declara las referencias en el front matter del artículo:

```yaml
affiliate_products: [lipo-ovionic-2200, lipo-zeee-2200]
```

Y coloca el componente donde deba aparecer el listado:

```liquid
{% include affiliate_products.html %}
```

Las publicaciones enlazan directamente a la URL de afiliado, con `rel="sponsored noopener noreferrer"`. No se añaden redirecciones propias. Un mismo producto puede reutilizarse en varias publicaciones y tener varias tiendas. Los modelos son etiquetas organizativas: seleccionarlos en el panel no inserta el producto en sus artículos ni acredita compatibilidades.

El apartado **Dónde aparece** refleja la última compilación. Los productos recién creados aparecerán sin usos hasta que se añadan a un artículo y se vuelva a compilar. Las referencias de productos existentes son de solo lectura para evitar romper sus usos.

## Comprobaciones

```sh
node --test _checks/affiliate_core.test.mjs
bundle exec jekyll build
node _checks/validate_affiliates.mjs
bundle exec ruby _checks/validate_content.rb
```

El flujo de publicación ejecuta los tests de afiliación y comprueba el catálogo, los modelos, las referencias de artículos y el resultado HTML antes de desplegar.

## Alcance de esta prueba

La autenticación por token es una solución para validar el guardado remoto sin desplegar un servicio de autenticación. El panel es público, pero GitHub exige una credencial con permiso de escritura para guardar. `noindex` evita solicitar su indexación; no es una medida de acceso. El panel no carga Google Tag Manager ni scripts externos y aplica una política de contenido limitada a sus archivos y a la API de GitHub.

La siguiente iteración puede sustituir el token manual por una GitHub App/OAuth con un servicio de autenticación y revisar el flujo editorial de publicación. La generación automática de enlaces no forma parte de esta POC: se conservan los enlaces oficiales que pegues y se previsualizan. Cualquier integración con las tiendas necesitará comprobar el programa de afiliación y sus credenciales por separado.

Referencias: [API Contents de GitHub](https://docs.github.com/en/rest/repos/contents#create-or-update-file-contents), [CORS de la API](https://docs.github.com/en/rest/using-the-rest-api/using-cors-and-jsonp-to-make-cross-origin-requests) y [tokens con permisos limitados](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens).
