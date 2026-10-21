# Plan de evolución de TopeRC

Fecha: 21 de octubre de 2026. Estado: primera implementación comprobada; publicación autorizada en GitHub Pages.

## Objetivo y alcance

Mejorar la utilidad y la personalidad de la web conservando Jekyll, los artículos existentes y sus direcciones. Trabajaremos con un modelo piloto antes de extender cada cambio al catálogo.

La primera opción es el **MJX Hyper Go 14210**: tiene una review con vídeo enlazado y una página de recambios. Esta última solo contiene una introducción; todavía no es un catálogo de piezas. La elección del piloto se puede cambiar antes de implementar las plantillas.

Este directorio comienza por `_` para mantener el planning separado de las páginas de la web. Crear estos documentos no modifica la versión publicada.

## Los cinco frentes

| ID | Frente | Resultado esperado | Estado |
| --- | --- | --- | --- |
| 01 | [Contenido y revisión editorial](01-contenido.md) | Información contrastada y experiencias propias identificables | Inventario inicial hecho; revisión pendiente |
| 02 | [Fichas por modelo](02-fichas-modelo.md) | Un lugar que conecte review, vídeos, recambios y guías de cada coche | Estructura y siete fichas implementadas; datos técnicos pendientes |
| 03 | [Marcas, modelos y categorías](03-marcas-categorias.md) | Metadatos coherentes y filtros útiles, conservando las URLs | Implementado y comprobado en local |
| 04 | [Plantillas y diseño](04-plantillas-diseno.md) | Reviews y listados claros, adaptables a móvil y fáciles de mantener | Fichas y contexto de modelo implementados; revisión editorial pendiente |
| 05 | [Identidad y publicación](05-identidad-publicacion.md) | Textos coherentes, contacto comprobado y publicación mantenible | Planificado |

## Orden de ejecución

| Iteración | Qué atacamos | Entrega revisable |
| --- | --- | --- |
| 1 | Auditoría editorial del piloto y definición de sus identificadores: 01 + base de 03 | Ficha de información: confirmado, pendiente y material disponible; esquema de metadatos |
| 2 | Ficha y plantilla del piloto: 02 + 04 | Recorrido completo MJX 14210 → review → vídeo → recambios, con contenido disponible |
| 3 | Navegación por marca y modelo: 03 | Filtros y relaciones aplicados al contenido existente, con las mismas URLs |
| 4 | Revisión editorial y adaptación del resto: 01 + 04 | Migración por modelo, empezando por Wltoys 144001 y 144010, que ya tienen páginas de recambios |
| 5 | Cierre de identidad y operación: 05 | Presentación y referencias actualizadas, contacto verificado y revisión de publicación |

La limpieza de identidad del bloque 05 puede adelantarse durante la primera iteración. Los textos que necesiten información del equipo y el envío de prueba del formulario tienen sus dependencias indicadas en ese bloque.

### Primera entrega sin dependencias del equipo

Se ha adelantado el bloque 03 y la estructura del 02: cuatro marcas, siete modelos y once publicaciones relacionadas. El nuevo índice `/coches/` permite buscar y filtrar por marca; el blog combina tipo, marca, modelo y texto. Las fichas reúnen únicamente recursos existentes y señalan los dos listados de recambios todavía en preparación.

Comprobado: compilación Jekyll, 49 páginas y enlaces internos, filtros combinados y enlaces antiguos, recorrido ficha → review/recambios → ficha, menú a 390 px y lectura sin JavaScript. Los once textos, URLs, categorías y etiquetas originales se conservan. Trabajo preparado en `codex/marcas-y-modelos` para su integración en `main` y publicación autorizada en `https://toperc.com/`. La entrega incluye las ilustraciones como fondos discretos de cabecera.

## Reglas para todas las iteraciones

- Mantener Jekyll, Markdown, YAML y componentes Liquid; evitar introducir otro framework para estas mejoras.
- Conservar artículos, fechas originales y URLs. Una reescritura sustituye el texto solo después de revisar sus datos.
- Conservar los identificadores de categorías que forman parte de enlaces publicados. Las marcas y los modelos se relacionarán mediante metadatos adicionales.
- Usar `model_id` y `brand_id` estables, separados del nombre que se muestra en pantalla.
- Diferenciar datos del fabricante, mediciones propias y opiniones. No inventar pruebas, compatibilidades ni cifras para completar una ficha.
- Omitir secciones sin contenido útil. Las páginas vacías no se presentarán como catálogos completos.
- Mantener las ilustraciones cyberpunk como ambientación; usar material real del coche cuando esté disponible.
- Hacer cada cambio en una rama, con una vista previa y una comprobación proporcionada a su alcance. Publicar las iteraciones que acordemos llevar a producción.

## Criterios comunes de cierre

Una iteración está lista cuando cumple su objetivo, mantiene las direcciones existentes, compila con Jekyll y sus enlaces afectados funcionan. Los cambios de interacción o diseño se comprueban en móvil y escritorio. Las nuevas referencias técnicas tienen su fuente o confirmación del equipo.

## Primer paquete de trabajo

- [x] Revisar el contenido y los metadatos actuales del piloto.
- [x] Identificar el vídeo ya enlazado y el estado real de su página de recambios.
- [x] Documentar los cinco planes y sus dependencias.
- [ ] Confirmar qué versión del MJX se ha probado y qué material propio podemos usar.
- [ ] Contrastar las cifras de la review; resolver contradicciones antes de reescribir conclusiones.
- [x] Definir el modelo y la marca en Jekyll y conectar los dos artículos existentes.
- [x] Construir la primera ficha y conectar su review actual en vista previa.

## Información del equipo que necesitaremos

1. Si el MJX 14210 es el piloto adecuado o preferís otro coche.
2. La unidad o versión concreta, configuración probada y conclusiones que queréis destacar.
3. Vídeos, fotos o mediciones propias que podamos utilizar; confirmar la relación del vídeo ya enlazado con esa prueba.
4. Referencias y compatibilidades de recambios que hayáis comprobado.
5. Qué queréis contar de TopeRC y qué canales de contacto siguen activos.

Podemos preparar la estructura y las plantillas mientras reunimos ese material. Las afirmaciones que necesiten pruebas permanecen pendientes hasta disponer de ellas.
