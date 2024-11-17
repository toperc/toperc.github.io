---
layout: page
title: "Reviews"
permalink: /reviews
toc: false
navbar: true
background: '/img/bg-review-buggy-lab.jpg'
---

# Nuestras últimas 5 reviews

{% assign last_reviews = site.categories.reviews | sort: "date" %}
{% for post in site.categories.reviews limit:5 %}
<div>
{% include article_summary.html post=post %}

</div>
{% endfor %}

# Nuestras reviews agrupadas por marca
{% assign reviews_by_brand = site.categories.reviews | group_by: "car_brand" %}
 {% for brand in reviews_by_brand %}
## {{ brand.name | capitalize}}
 {% for post in brand.items %}

<div>
{% include article_summary.html post=post %}
</div>
 
{% endfor %}
{%endfor%}
