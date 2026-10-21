---
layout: page
title: Herramientas
description: Apps de TopeRC para llevar tus datos al vídeo y, poco a poco, ayudarte a preparar y entender tu RC.
eyebrow: Software / El taller digital
permalink: /herramientas/
section: tools
wide: true
toc: false
---
<div class="tools-intro"><p class="eyebrow">HECHAS DESDE LA AFICIÓN</p><p>Un espacio para las aplicaciones que vamos creando en TopeRC. Empezamos con una herramienta para quienes también disfrutan grabando sus sesiones.</p></div>
<section class="tools-catalog" aria-label="Aplicaciones de TopeRC">
{% for tool in site.data.tools %}
  <article class="tool-feature">
    <div class="tool-feature-copy">
      <div class="tool-meta"><span class="eyebrow">{{ tool.category | escape }}</span><span class="tool-kind">{{ tool.type | escape }}</span></div>
      <h2><a href="{{ tool.url | relative_url }}">{{ tool.name | escape }}</a></h2>
      <p class="tool-tagline">{{ tool.tagline | escape }}</p>
      <p class="tool-summary">{{ tool.summary | escape }}</p>
      <ul class="tool-platforms" aria-label="Sistemas compatibles">{% for platform in tool.platforms %}<li>{{ platform | escape }}</li>{% endfor %}</ul>
      <div class="button-group"><a class="button button-primary" href="{{ tool.url | relative_url }}">Conocer la app <span aria-hidden="true">→</span></a><a class="text-link" href="{{ tool.download_url | escape }}" target="_blank" rel="noopener noreferrer">Descargar en GitHub <span aria-hidden="true">↗</span></a></div>
    </div>
    <a class="tool-feature-image" href="{{ tool.url | relative_url }}" tabindex="-1" aria-hidden="true"><img src="{{ tool.image | relative_url }}" width="1344" height="795" alt="" fetchpriority="high"><span>EDITOR VISUAL / MT12OVERLAYSTUDIO</span></a>
  </article>
{% endfor %}
</section>
<aside class="tools-next" aria-labelledby="tools-next-title"><p class="eyebrow">UN TALLER QUE VA CRECIENDO</p><h2 id="tools-next-title">Más ideas en la mesa.</h2><p>Queremos incorporar calculadoras de velocidad a partir de los KV del motor, la batería y la transmisión, y asistentes para orientarte al elegir un ESC o una batería. Por ahora, la aplicación disponible es MT12OverlayStudio.</p><a class="text-link" href="{{ '/contacto/' | relative_url }}">Proponer una herramienta <span aria-hidden="true">→</span></a></aside>
