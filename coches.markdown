---
layout: page
title: "El garaje"
description: "Encuentra cada coche y reúne sus reviews, vídeos y páginas de recambios en un mismo sitio."
eyebrow: "Coches / Marcas y modelos"
permalink: /coches/
section: models
illustration: workshop
wide: true
toc: false
---
<div class="search-toolbar"><p data-search-count data-search-unit="model" role="status" aria-live="polite">{{ site.models.size }} modelos</p><label class="search-field" for="model-search" data-search-controls hidden><span>Buscar un coche</span><input id="model-search" type="search" placeholder="Marca o modelo…" data-search-input aria-controls="model-list"></label></div>
<div class="archive-filters" data-search-controls hidden><label class="filter-field" for="model-brand">Marca<select id="model-brand" data-brand-filter><option value="">Todas las marcas</option>{% assign sorted_brands = site.data.brands | sort %}{% for item in sorted_brands %}{% assign key = item[0] %}{% assign brand_models = site.models | where: 'brand_id', key %}{% if brand_models.size > 0 %}<option value="{{ key | escape }}">{{ item[1].name | escape }} ({{ brand_models.size }})</option>{% endif %}{% endfor %}</select></label><button class="filter-reset" type="button" data-search-reset>Limpiar filtros</button></div>
<div class="article-grid" id="model-list">{% assign sorted_models = site.models | sort: 'title' %}{% for car in sorted_models %}{% include model_card.html model=car %}{% endfor %}</div>
<p class="search-empty" data-search-empty role="status" hidden>No hay coches con esos filtros. Prueba con otra marca o nombre.</p>
