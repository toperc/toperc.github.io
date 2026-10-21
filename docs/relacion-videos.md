# Vídeos y entradas

El vídeo principal se declara en el front matter del artículo:

```yaml
video_id: TPRoxYSce7I
```

El layout `post` muestra una incrustación adaptable y un enlace directo a YouTube por cada vídeo declarado. No añadas otro iframe en el cuerpo. Las fichas de coche y sus tarjetas toman el vídeo de su review; el campo histórico de la ficha sirve como alternativa y no debe contradecir al artículo.

Para una serie, conserva `video_id` como primera parte y declara las siguientes en orden, con título propio:

```yaml
video_title: "Parte 1: desmontaje"
additional_videos:
  - id: yRPoNjrecJA
    title: "Parte 2: montaje y comprobaciones"
```

Una guía compartida puede declarar `related_model_ids: [wltoys-124017]`, además de su `model_id` principal. Las fichas de ambos coches la muestran como guía, sin convertirla en una review. La zona horaria del sitio es `Europe/Madrid` para que las fechas de publicación correspondan al día local.

Al revisar una entrada existente, conserva su nombre de archivo y su fecha original. Añade `last_modified_at` con la fecha real de la revisión: el artículo muestra ambas fechas. Un artículo nuevo lleva su propia fecha de publicación.

El primer lote relaciona las reviews del Jiabaila 1:43 y del Wltoys 124017, añade la guía de baterías del 124017 y migra el iframe anterior del MJX 14210 al mismo sistema. La migración del MJX no supone una revisión de su texto.

Las transcripciones completas, las notas editoriales y la conexión a YouTube se gestionan en una herramienta local independiente, fuera de este repositorio. Las sugerencias del inventario no se convierten automáticamente en relaciones confirmadas ni en artículos publicados.

Al preparar una entrada, revisa también los enlaces de la descripción y del comentario fijado del canal. Contrasta las listas de enlaces y las correcciones del autor en los comentarios; no confundas enlaces de terceros o respuestas sin contexto con recomendaciones del artículo. Conserva las URLs de afiliación completas, incluidos sus parámetros. Reutiliza o crea productos en `_data/affiliate_links.json`, declara `affiliate_products` en la entrada e incluye `affiliate_products.html` en su sección de compra. Así el gestor permite cambiar un enlace una sola vez para todos los artículos que lo usan. Si una referencia no identifica con claridad el producto, consérvala para revisión y no la presentes como una compra confirmada. La procedencia y las alternativas históricas se guardan en las notas editoriales locales.

Fuentes de este lote: vídeos `TPRoxYSce7I`, `vWmrFqEgpYI` y `TtEF9q7u4mU`, consultados como propietario desde YouTube Studio entre el 21 y el 22/10/2026. Se ha conservado la transcripción automática original, con sus errores, en el archivo local de trabajo. No se modificaron ni publicaron subtítulos en el canal. Las cifras dudosas de las transcripciones no se trasladan como especificaciones confirmadas.

Para comprobar la compilación:

```sh
bundle exec jekyll build
bundle exec ruby _checks/validate_videos.rb
```

El validador comprueba IDs, ausencia de repeticiones dentro de cada entrada, orden de las partes, enlaces directos, títulos accesibles, fechas de actualización visibles y coherencia con las fichas. El segundo lote reúne cinco guías a partir de siete vídeos consultados en Studio el 22/10/2026; sus transcripciones y notas se conservan fuera del repositorio.
