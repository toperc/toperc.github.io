# Miniaturas de YouTube en las tarjetas

Las tarjetas de artículos usan `video_id`. Las tarjetas del garaje usan el vídeo principal de la review del coche, con el mismo criterio que la ficha del modelo. La noticia destacada de portada y las tarjetas de pruebas de colaboraciones también resuelven el vídeo del artículo enlazado.

El componente `_includes/video_card_background.html` carga la miniatura `https://i.ytimg.com/vi/VIDEO_ID/hqdefault.jpg` como imagen decorativa con carga diferida, dimensiones declaradas y sin enviar la cabecera Referer. No requiere clave de API ni incorpora reproductores en los listados. La imagen procede de YouTube y se actualiza con su miniatura; el navegador debe poder acceder a su CDN.

Solo las tarjetas con un vídeo asociado reciben el fondo y la clase `video-card`. Las demás conservan sus imágenes y diseño. Las tarjetas generales de marca siguen usando su imagen de ambiente porque no representan un vídeo concreto. Las miniaturas tienen un degradado para el contraste del texto y una base oscura si no cargan. Los enlaces siguen abriendo los artículos y las fichas, donde está el vídeo.

Al añadir o cambiar `video_id` y recompilar la web, las tarjetas se actualizan sin mantener una segunda lista de miniaturas. En artículos con varios vídeos se utiliza el principal.
