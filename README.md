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

- `/`: portada editorial basada en las publicaciones.
- `/blog/`: archivo de todas las publicaciones, con búsqueda y filtros por categoría.
- `/categorias/`: índice de todas las categorías de Jekyll.
- `/reviews`, `/guias/`, `/recambios`: secciones temáticas.
- `/tag/…`: archivos de etiquetas existentes.
- `/posts/`: acceso compatible al archivo del blog.

Los artículos existentes no se han reescrito. Las páginas de contacto, equipo y legales se conservan. El formulario mantiene Formspree y la cabecera mantiene la integración existente de Google Tag Manager.

## Publicación e iteraciones

El flujo de `.github/workflows/jekyll.yml` publica en GitHub Pages cuando se suben cambios a `main`. El trabajo actual está en `codex/renovacion-web`.

Esta primera iteración establece la estructura del contenido y las plantillas compartidas. Las siguientes pueden centrarse en la identidad visual, la portada o la lectura de artículos, manteniendo el contenido independiente del diseño.
