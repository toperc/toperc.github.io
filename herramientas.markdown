---
layout: page
title: Herramientas
description: Calculadoras para entender tu RC y aplicaciones para llevar tus datos al vídeo.
eyebrow: Software / El taller digital
permalink: /herramientas/
section: tools
wide: true
toc: false
---
<div class="tools-intro"><p class="eyebrow">HECHAS DESDE LA AFICIÓN</p><p>Aplicaciones y calculadoras para preparar tu RC y trabajar con tus registros de telemetría.</p></div>
<section class="tools-catalog" aria-label="Aplicaciones de TopeRC">
{% for tool in site.data.tools %}
  <article class="tool-feature">
    <div class="tool-feature-copy">
      <div class="tool-meta"><span class="eyebrow">{{ tool.category | escape }}</span><span class="tool-kind">{{ tool.type | escape }}</span></div>
      <h2><a href="{{ tool.url | relative_url }}">{{ tool.name | escape }}</a></h2>
      <p class="tool-tagline">{{ tool.tagline | escape }}</p>
      <p class="tool-summary">{{ tool.summary | escape }}</p>
      <ul class="tool-platforms" aria-label="Sistemas compatibles">{% for platform in tool.platforms %}<li>{{ platform | escape }}</li>{% endfor %}</ul>
      <div class="button-group"><a class="button button-primary" href="{{ tool.url | relative_url }}">{% if tool.browser %}Abrir calculadora{% else %}Conocer la app{% endif %} <span aria-hidden="true">→</span></a>{% if tool.download_url %}<a class="text-link" href="{{ tool.download_url | escape }}" target="_blank" rel="noopener noreferrer">Descargar en GitHub <span aria-hidden="true">↗</span></a>{% endif %}</div>
    </div>
    {% if tool.browser %}<a class="tool-feature-image fdr-preview" href="{{ tool.url | relative_url }}" tabindex="-1" aria-hidden="true">{{ tool.preview | default: 'FDR' | escape }}<span>{{ tool.preview_caption | default: 'FDR / TRANSMISIÓN RC' | escape }}</span></a>{% else %}<a class="tool-feature-image" href="{{ tool.url | relative_url }}" tabindex="-1" aria-hidden="true"><img src="{{ tool.image | relative_url }}" width="1344" height="795" alt="" fetchpriority="high"><span>EDITOR VISUAL / MT12OVERLAYSTUDIO</span></a>{% endif %}
  </article>
{% endfor %}
</section>
<aside class="tools-next" aria-labelledby="tools-next-title"><p class="eyebrow">UN TALLER QUE VA CRECIENDO</p><h2 id="tools-next-title">Más ideas en la mesa.</h2><p>Seguimos ampliando el taller con herramientas prácticas para radiocontrol.</p><a class="text-link" href="{{ '/contacto/' | relative_url }}">Proponer una herramienta <span aria-hidden="true">→</span></a></aside>

<link rel="stylesheet" href="{{ "/assets/fdr.css" | relative_url }}">
