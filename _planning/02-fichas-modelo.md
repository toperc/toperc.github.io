# 02 · Una ficha por modelo

## Objetivo

Reunir el contenido de un coche en una página fácil de encontrar: información básica, review, vídeo, recambios y guías relacionadas.

## Propuesta en Jekyll

Usar una colección nativa `_models`, con un archivo Markdown por coche, un layout `model` y URLs nuevas bajo `/coches/`. Los artículos existentes siguen en `_posts` y conservan sus direcciones.

Identificadores propuestos para el piloto:

```yaml
model_id: mjx-hyper-go-14210
brand_id: mjx
title: MJX Hyper Go 14210
```

La ficha vivirá en `_models/mjx-hyper-go-14210.md`. La review y la página de recambios se relacionarán añadiendo el mismo `model_id` a su front matter. Los datos técnicos y los medios solo se añaden cuando están disponibles y contrastados.

## Tareas

- [x] Definir los identificadores de modelo y marca junto con el bloque 03.
- [x] Configurar la colección y crear el layout compartido de modelo.
- [x] Crear la ficha piloto y relacionar sus dos publicaciones existentes mediante metadatos.
- [x] Mostrar su review y vídeo, con acceso claro al contenido completo.
- [x] Conectar los recambios disponibles. Si el listado sigue vacío, comunicar su estado sin presentar piezas inventadas.
- [x] Preparar la sección de guías específicas; omitirla cuando no existan. La guía general de electrónica permanece sin asociar a un coche.
- [x] Añadir enlaces de vuelta a la ficha desde la review y los recambios.
- [x] Preparar un índice de modelos con filtros básicos por marca.
- [x] Extender el patrón a otros coches después de comprobar el piloto en local.

## Estado de la primera entrega

Siete fichas estructurales implementadas y relacionadas con sus publicaciones. El vídeo del MJX es el enlace que ya existía; no se han añadido especificaciones, fotografías ni compatibilidades sin contrastar. El recorrido ficha → review → ficha y ficha → recambios → ficha está comprobado. La revisión de datos y el material propio siguen pendientes del bloque 01.

## Qué verá el visitante

1. Nombre del coche y su imagen real, si contamos con ella.
2. Descripción breve y datos básicos confirmados.
3. Review y vídeo disponibles.
4. Recambios y mejoras documentados.
5. Otras publicaciones relacionadas con ese modelo.

Las secciones sin contenido se omiten o indican claramente su estado. No aparecerán botones de descarga ni recursos que no existan.

## Entrega y criterio de cierre

La primera entrega es la ficha del MJX y el recorrido entre esta, su review y sus recambios. Debe funcionar sin duplicar el texto de la review, sin romper enlaces antiguos y sin necesitar cambios de código para añadir otro coche con la misma estructura.

## Dependencias

Bloque 03 para los identificadores; bloque 01 para los datos y recursos contrastados; bloque 04 para la presentación. La estructura se puede implementar antes de completar las mediciones.
