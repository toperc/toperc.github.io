# 03 · Marcas, modelos y categorías

## Objetivo

Separar el tipo de publicación, la marca y el modelo para que los filtros encuentren el contenido correcto y las relaciones entre páginas sean consistentes.

## Situación actual

- Las categorías nativas son `reviews`, `manuales`, `recambios`, `wltoys` y `mjx`.
- Las marcas aparecen también en `car_brand`, con diferencias de mayúsculas como `MJX`/`mjx` y `Wltoys`/`wltoys`.
- Las reviews no tienen un identificador común de modelo; los recambios usan nombres como `Hypergo 14210` en `car_model`.
- El permalink actual es `/:categories/:title/`. Cambiar categorías puede cambiar las direcciones de los artículos.
- La review titulada Wltoys 144001 incluye la etiqueta `144010`; debemos revisar ese cruce antes de normalizar datos.

## Propuesta

Mantener las categorías y URLs heredadas. Añadir metadatos independientes para la navegación nueva:

- `content_type`: `review`, `guide` o `parts` cuando sea necesario distinguir el tipo sin depender de todas las categorías históricas.
- `brand_id`: identificador estable de marca, por ejemplo `mjx`.
- `model_id`: identificador estable del coche, por ejemplo `mjx-hyper-go-14210`.

Los nombres visibles y alias de marca se centralizarán en `_data/brands.yml`. Los coches vivirán en la colección del bloque 02. Las categorías históricas seguirán disponibles; no se eliminarán para simplificar el menú.

## Tareas

- [x] Guardar un inventario de las URLs actuales antes de cambiar metadatos.
- [x] Definir los identificadores y alias de marcas y modelos.
- [x] Anotar las inconsistencias encontradas sin corregir datos de producto por suposición.
- [x] Añadir al piloto los metadatos nuevos y comprobar que su URL permanece igual.
- [x] Añadir un filtro de marca que incluya tanto reviews como recambios; no basarlo solo en las categorías de marca actuales.
- [x] Hacer que los enlaces de modelo y marca lleven a sus agrupaciones correspondientes.
- [x] Extender los metadatos al resto del contenido.
- [x] Comprobar que el blog general y los archivos antiguos siguen mostrando todas sus publicaciones.

## Resultado comprobado en local · 21/10/2026

Cuatro marcas, siete modelos y once publicaciones. Wltoys reúne seis publicaciones con `?marca=wltoys`; el antiguo `?categoria=wltoys` conserva sus dos recambios. Los filtros combinan tipo, marca, modelo y búsqueda, mantienen su estado en la URL y permiten limpiarlo. Cambiar de marca elimina un modelo incompatible.

El inventario permanente está en `_checks/fixtures/published-posts.json`; `bundle exec ruby _checks/validate_content.rb` verifica las URLs y relaciones. La comprobación de esta entrega también ha confirmado que los cuerpos de los once artículos no cambian. La etiqueta `144010` de la review del 144001 continúa señalada para revisión editorial, sin corrección automática.

## Entrega y criterio de cierre

El visitante puede encontrar todas las publicaciones de una marca o un coche sin depender de cómo se categorizaron originalmente. Ninguna URL publicada cambia y los nombres de marca se muestran de forma consistente.

## Dependencias

La estructura básica es necesaria para las fichas del bloque 02. La corrección de etiquetas que puedan referirse al modelo equivocado se contrastará con el bloque 01.
