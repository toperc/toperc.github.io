---
layout: page
title: "Recambios"
permalink: /recambios
navbar: true
toc: false
background: '/img/bg-recambios.jpeg'
---

{% assign recambios_by_brand = site.categories.recambios | group_by: "car_brand" %}
 {% for brand in recambios_by_brand %}
# {{brand.name}}
 {% for page in brand.items %}
  [{{ page.title }}]({{page.url}}) 
 {% endfor %}
{%endfor%}