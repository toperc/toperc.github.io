---
layout: page
title: "Categorías"
description: "Los mismos temas y categorías de siempre, organizados para que encuentres lo que buscas."
eyebrow: "Explora el contenido"
permalink: /categorias/
section: categories
wide: true
toc: false
---
{% assign sorted_categories = site.categories | sort %}
{% for category in sorted_categories %}{% assign key = category[0] %}{% assign info = site.data.categories[key] %}
<section class="category-block" id="{{ key | slugify }}"><div class="section-heading"><div><p class="eyebrow">{{ category[1].size }} {% if category[1].size == 1 %}publicación{% else %}publicaciones{% endif %}</p><h2>{{ info.title | default: key | escape }}</h2></div><a class="text-link" href="{{ '/blog/' | relative_url }}?categoria={{ key | url_encode }}">Ver la categoría <span aria-hidden="true">↗</span></a></div>{% if info.description %}<p class="listing-intro">{{ info.description | escape }}</p>{% endif %}<div class="article-grid">{% for post in category[1] limit: 3 %}{% include article_summary.html post=post heading='h3' %}{% endfor %}</div></section>
{% endfor %}
