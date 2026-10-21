# Vídeos y entradas

El vídeo principal se declara en el front matter del artículo:

```yaml
video_id: TPRoxYSce7I
```

El layout `post` muestra una sola incrustación adaptable y un enlace directo a YouTube. No añadas otro iframe en el cuerpo. Las fichas de coche y sus tarjetas toman el vídeo de su review; el campo histórico de la ficha sirve como alternativa y no debe contradecir al artículo.

Al revisar una entrada existente, conserva su nombre de archivo y su fecha original. Añade `last_modified_at` con la fecha real de la revisión: el artículo muestra ambas fechas. Un artículo nuevo lleva su propia fecha de publicación.

El primer lote relaciona las reviews del Jiabaila 1:43 y del Wltoys 124017, añade la guía de baterías del 124017 y migra el iframe anterior del MJX 14210 al mismo sistema. La migración del MJX no supone una revisión de su texto.

Las transcripciones completas, las notas editoriales y la conexión a YouTube se gestionan en una herramienta local independiente, fuera de este repositorio. Las sugerencias del inventario no se convierten automáticamente en relaciones confirmadas ni en artículos publicados.

Fuentes de este lote: vídeos `TPRoxYSce7I`, `vWmrFqEgpYI` y `TtEF9q7u4mU`, consultados como propietario desde YouTube Studio entre el 21 y el 22/10/2026. Se ha conservado la transcripción automática original, con sus errores, en el archivo local de trabajo. No se modificaron ni publicaron subtítulos en el canal. Las cifras dudosas de las transcripciones no se trasladan como especificaciones confirmadas.

Para comprobar la compilación:

```sh
bundle exec jekyll build
bundle exec ruby _checks/validate_videos.rb
```

El validador comprueba IDs, vídeos únicos por entrada, enlace directo, título accesible, fechas de actualización visibles y coherencia entre fichas y reviews.
