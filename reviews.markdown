---
layout: page
title: "Reviews"
permalink: /reviews
toc: true
---

# Nuestras últimas 5 reviews

{% assign last_reviews = site.categories.reviews | sort: "date" %}
{% for post in site.categories.reviews limit:5 %}
- [{{ post.title }}]({{post.url}}) 
{% endfor %}

# Nuestras reviews agrupadas por marca
{% assign reviews_by_brand = site.categories.reviews | group_by: "car_brand" %}
 {% for brand in reviews_by_brand %}
## {{ brand.name | capitalize}}
 {% for page in brand.items %}
- [{{ page.title }}]({{page.url}}) 
{% endfor %}
{%endfor%}
