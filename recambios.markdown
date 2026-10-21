---
layout: page
title: "Recambios"
description: "Encuentra recambios y mejoras para tu coche. Elige el modelo y entra directo a su listado de piezas."
eyebrow: "Recambios / A punto para rodar"
permalink: /recambios
wide: true
illustration: parts
toc: false
---
<div class="parts-list">{% for post in site.categories.recambios %}
<a class="parts-row" href="{{ post.url | relative_url }}"><span class="route-number">0{{ forloop.index }}</span><div><span class="eyebrow">{{ post.car_brand | escape }}</span><h2>{{ post.car_model | default: post.title | escape }}</h2></div><div class="parts-specs">{% if post.car_scale %}<span>Escala {{ post.car_scale | escape }}</span>{% endif %}{% if post.car_type %}<span>{{ post.car_type | escape }}</span>{% endif %}</div><span class="parts-arrow" aria-hidden="true">↗</span></a>
{% endfor %}</div>
<div class="listing-note"><h2>Primero, comprueba tu modelo.</h2><p>Antes de elegir una pieza, revisa la referencia y la compatibilidad con tu coche. En cada listado encontrarás la información disponible para ese modelo.</p><a class="text-link" href="{{ '/contacto/' | relative_url }}">¿Alguna duda? Hablemos ↗</a></div>
