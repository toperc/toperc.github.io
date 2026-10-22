# TopeRC · Jekyll

Web de radiocontrol con artículos en Markdown, categorías y etiquetas nativas de Jekyll. El diseño es propio y el despliegue existente continúa en GitHub Pages.

## Trabajar en local

```sh
git clone git@github.com:toperc/toperc.github.io.git
cd toperc.github.io
bundle install
bundle exec jekyll serve
```

La vista previa está en `http://localhost:4000`. Para comprobar la compilación:

```sh
bundle exec jekyll build
```

## Dónde se cambia cada cosa

| Qué quieres cambiar | Archivo o carpeta |
| --- | --- |
| Artículos, reviews y listados de piezas | `_posts/` |
| Menú principal | `_data/navigation.yml` |
| Catálogo de apps y sección Herramientas | `_data/tools.yml`, `herramientas.markdown` y `_layouts/tool.html` |
| Textos y enlaces de la portada | `_data/home.yml` |
| Nombres visibles y descripciones de categorías | `_data/categories.yml` |
| Datos generales, redes y reglas de URLs | `_config.yml` |
| Colores, tipografía y diseño adaptable | `_sass/styles.scss` |
| Estructura de las páginas | `_layouts/` |
| Componentes compartidos | `_includes/` |
| Menú móvil y filtros del blog | `assets/scripts.js` |
| Logo | `img/toperc-logo.png` |

Los filtros necesitan JavaScript; sin él, los archivos muestran todas sus publicaciones y los enlaces siguen funcionando. No se cargan Bootstrap, jQuery ni Clean Blog.

## Añadir una publicación

Crea un archivo `_posts/AAAA-MM-DD-titulo.md` o guárdalo en una de sus subcarpetas. Por ejemplo:

```yaml
---
layout: post
title: "El título de tu artículo"
date: 2026-10-21
categories: manuales
tags: [rc, electronica, tutoriales]
---
```

Escribe el contenido en Markdown. Puedes añadir `<!--more-->` para marcar el final de la introducción que aparecerá en los listados. El blog, la portada, los contadores y el índice de categorías se actualizan al compilar.

Los identificadores de las categorías existentes (`reviews`, `manuales`, `recambios`, `wltoys`, `mjx`) se conservan. Los nombres visibles se pueden cambiar en `_data/categories.yml` sin modificar esos identificadores ni las URLs de los artículos. Una categoría nueva aparece automáticamente en el blog y en su índice aunque todavía no tenga una descripción en YAML.

Al añadir etiquetas, genera sus páginas con Python:

```sh
python _tag_gen.py
python _tag_gen.py --check
```

El generador recorre todas las subcarpetas de artículos y conserva las páginas de etiquetas antiguas.

## Secciones

### Coches, marcas y publicaciones relacionadas

Cada coche se define en un archivo Markdown de `_models/`, con `title`, `model_id` y `brand_id`. Los nombres visibles de las marcas se mantienen en `_data/brands.yml`. El índice está en `/coches/`.

Las publicaciones relacionadas llevan en su front matter el mismo `model_id`, un `brand_id` y un `content_type` (`review`, `guide` o `parts`). Esto conecta automáticamente sus fichas, reviews y recambios, sin cambiar las categorías históricas ni las URLs de los artículos. Las guías generales pueden tener solo `content_type: guide`.

Una página de recambios que todavía no contiene piezas se marca con `resource_status: pending`; el sitio comunica que el listado está en preparación. El campo no indica disponibilidad comercial de productos.

Las fotos propias de un coche se declaran en `_data/model_photos.yml`, bajo su `model_id`, con imagen completa (`src`), vista previa (`preview`), dimensiones, texto alternativo y pie. Se muestran automáticamente en la ficha y sus reviews, con enlaces para ampliarlas. El campo opcional `image` del modelo o artículo añade una miniatura a las tarjetas. Los originales se conservan fuera de la web; las copias WebP publicadas no incluyen metadatos de cámara o ubicación.

El blog admite enlaces con `marca`, `modelo`, `tipo`, `q` y la categoría histórica `categoria` en la URL. Los filtros necesitan JavaScript; las fichas y enlaces entre publicaciones se generan con Jekyll y funcionan también sin él.

Para comprobar las relaciones y las URLs publicadas:

```sh
bundle exec ruby _checks/validate_content.rb
```

La referencia de URLs, categorías y etiquetas originales está en `_checks/fixtures/published-posts.json`. Una modificación deliberada de esos datos requiere actualizar también esa referencia y resolver cualquier cambio de dirección publicado.

### Rutas principales

- `/`: portada editorial basada en las publicaciones.
- `/blog/`: archivo de todas las publicaciones, con búsqueda y filtros por tipo, marca y modelo; admite enlaces históricos por categoría.
- `/categorias/`: índice de todas las categorías de Jekyll.
- `/coches/`: índice de coches, con búsqueda por marca y modelo.
- `/coches/…/`: ficha que reúne las publicaciones relacionadas con cada coche.
- `/reviews`, `/guias/`, `/recambios`: secciones temáticas.
- `/tag/…`: archivos de etiquetas existentes.
- `/posts/`: acceso compatible al archivo del blog.
- `/colaboraciones/`: colaboración activa con HobbyKing y afiliación a modelos de Rlaarlo, con accesos desde portada, menú, pie y artículos relacionados.

Los enlaces externos de colaboración se resuelven desde `_data/affiliate_links.json`, mediante los identificadores de `_data/partners.json`. Se pueden actualizar desde el gestor de afiliados; las ofertas en revisión o desactivadas no generan botones de compra. La configuración de colaboraciones contiene solo textos, código del canal y referencias a artículos/productos, sin duplicar URLs de seguimiento. El gestor muestra también estos usos en la portada y la página de colaboraciones.

Los fondos ilustrados de estas tarjetas se configuran también en `_data/partners.json`; son decorativos y se sirven como WebP locales con carga diferida. Los degradados mantienen el texto legible y el efecto de acercamiento respeta movimiento reducido. Su procedencia, archivos y prompts están en `docs/fondos-colaboraciones.md`.

Los artículos existentes no se han reescrito. Las páginas de contacto, equipo y legales se conservan. El formulario mantiene Formspree y la cabecera mantiene la integración existente de Google Tag Manager.

## Publicación e iteraciones

El flujo de `.github/workflows/jekyll.yml` publica en GitHub Pages cuando se suben cambios a `main`. El trabajo actual está en `codex/renovacion-web`.

Esta primera iteración establece la estructura del contenido y las plantillas compartidas. Las siguientes pueden centrarse en la identidad visual, la portada o la lectura de artículos, manteniendo el contenido independiente del diseño.
