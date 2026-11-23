---
layout: post
content_type: guide
model_id: yikong-4107-pro
brand_id: yikong
title: "Mejoras del Yikong 4107 Pro: piezas 3D, ruedas y accesorios"
subtitle: "Batería delante, electrónica centrada, cierre rápido y los detalles que le he añadido a mi crawler."
date: 2026-11-23
categories: manuales
tags: rc
published: true
video_id: gnqu7tPFOw0
video_title: "Las mejoras del Yikong 4107 Pro en vídeo"
image: /img/guias/mejoras-yikong-4107-pro/miniatura.webp
description: "Las mejoras que he realizado en mi Yikong 4107 Pro: soportes impresos en 3D, distribución de batería y electrónica, ruedas, accesorios y prueba exterior."
affiliate_products: ["yikong-4107pro-cables-parachoques-acero", "yikong-4107pro-cajas-plastico", "yikong-4107pro-bicicleta-1-10", "yikong-4107pro-extintor", "yikong-4107pro-bidon-gasolina", "yikong-4107pro-bolsa-lona", "yikong-4107pro-protectores-bajos", "yikong-4107pro-antena"]
---

Después de varios días midiendo, diseñando, imprimiendo y esperando accesorios, ya tengo el **Yikong 4107 Pro** bastante cerca de cómo me gustaría dejarlo. He trabajado tanto en la distribución del interior como en el aspecto exterior, y he terminado sacándolo a una prueba entre piedras y rampas.

Si vienes de la [review del Yikong 4107 Pro]({% post_url reviews/2026-11-08-yikong-4107-pro %}), aquí continúo con las mejoras que quería hacerle. No he cambiado el servo ni sustituido toda la electrónica: buena parte del trabajo consiste en recolocar lo que ya trae y adaptarlo a mi gusto.

<!--more-->

**El vídeo está actualmente en privado en YouTube.** El reproductor solo estará disponible para las cuentas autorizadas mientras conserve esa visibilidad.

![Yikong 4107 Pro con las ruedas y accesorios montados, junto a las piezas diseñadas en 3D]({{ '/img/guias/mejoras-yikong-4107-pro/miniatura.webp' | relative_url }})

## Las piezas que he diseñado y adaptado

La animación del vídeo permite ver por separado las piezas antes de enseñarlas montadas:

- **Soporte de batería delantero.** He preparado una bandeja y su alzador para colocar la batería delante. Es la distribución que quería probar; no he hecho una comparación medida de reparto de pesos.
- **Bandeja de electrónica.** Reúne la electrónica de origen en la zona central, con espacio para el interruptor y una caja con tapa para recoger el receptor y sus cables. La tapa ayuda a ordenarlo; no he comprobado estanqueidad.
- **Torretas de suspensión.** Buscan ganar aproximadamente medio centímetro y reducir el contacto de las ruedas con la carrocería. El roce disminuye, pero no desaparece en todos los apoyos.
- **Clip delantero con desplazamiento de 5 mm y anclaje separado.** Me permite abrir y cerrar la carrocería con más comodidad que utilizando el tornillo cada vez.

En el proyecto conservo esta [referencia del clip de carrocería en Thingiverse](https://www.thingiverse.com/thing:7284842). Distingo las piezas y adaptaciones propias de los STL de terceros: la escalera y el soporte trasero que enseño proceden de un diseño ajeno; el adaptador para mi rueda y el bidón es un trabajo posterior.

## Batería delante y cables más recogidos

Antes tenía cables de los servos que cruzaban desde un lado del chasis al otro. Al mover la electrónica al centro y ordenar el receptor dentro de su caja, el conjunto queda más recogido y me resulta más cómodo acceder a él.

Es una mejora de distribución y de comodidad para mi montaje. Antes de copiar la posición, conviene comprobar el espacio de la batería, la longitud del cableado y el recorrido de los mecanismos en el coche concreto.

## Ruedas y accesorios a escala

El cambio de llantas y neumáticos es una de las diferencias más visibles. A eso se suman los ganchos, las cajas, la bicicleta, la bolsa, el extintor, el bidón y la antena. Los he ido colocando buscando el aspecto que me apetecía para el coche.

También he añadido **protectores en los bajos**, porque después de unas pocas salidas ya veía marcas de uso. Los cables de acero los he montado a mi manera, aprovechando puntos existentes en lugar de taladrar por ahora la carrocería. Esa colocación es una decisión de este montaje, no una instrucción universal.

## El roce todavía necesitaba un ajuste

Las torretas no resolvieron por completo el contacto con el parachoques. Después de grabar la explicación hice un último recorte del parachoques y de las aletas de lexan; el vídeo lo identifica antes de pasar a la prueba exterior.

Dejo la conducción con su sonido ambiente para ver el coche trabajando sobre piedras, rampas y pasos de cuerdas. También aparece el FMS que acompañó la ruta. Esta salida muestra el resultado del conjunto, pero no es una prueba controlada que permita atribuir una mejora de agarre a una sola pieza.

## Lo que todavía son ideas

Me gustaría montar un winch que pueda controlar desde la emisora y aprovechar mi RadioMaster MT12. En el vídeo planteo un receptor ELRS con más salidas, GPS y un controlador de luces con ESP32. **Son posibilidades para más adelante: no están instaladas ni demostradas en esta entrega.**

Por ahora, lo importante era dejar el coche más ordenado y a mi gusto y volver a disfrutarlo en una ruta.

## Accesorios utilizados y enlaces de compra

Los siguientes enlaces de AliExpress son **de afiliado**: TopeRC puede recibir una comisión por las compras realizadas a través de ellos. Son los enlaces facilitados para este montaje; comprueba las variantes, medidas y fijaciones antes de comprar. No se muestran precios ni se presupone disponibilidad.

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-cables-parachoques-acero' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-cables-parachoques-acero"><strong>Cables de acero para el parachoques</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-cajas-plastico' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-cajas-plastico"><strong>Juego de cajas de plástico</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-bicicleta-1-10' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-bicicleta-1-10"><strong>Bicicleta 1:10</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-extintor' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-extintor"><strong>Extintor</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-bidon-gasolina' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-bidon-gasolina"><strong>Bidón de gasolina</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-bolsa-lona' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-bolsa-lona"><strong>Bolsa de lona</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-protectores-bajos' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-protectores-bajos"><strong>Protectores de bajos</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-antena' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-antena"><strong>Antena</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

## Capítulos del vídeo

- [00:00 — Presentación: así he dejado el Yikong](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=0s)
- [00:44 — Piezas diseñadas en 3D y torretas](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=44s)
- [01:39 — Clip para abrir y cerrar la carrocería](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=99s)
- [01:50 — Batería delantera y electrónica centrada](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=110s)
- [02:37 — Ruedas nuevas y accesorios a escala](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=157s)
- [03:09 — Escalera, rueda trasera y adaptador del bidón](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=189s)
- [03:37 — Protección de bajos y cables del parachoques](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=217s)
- [04:21 — Ideas futuras: winch, MT12, ELRS y luces](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=261s)
- [05:56 — Balance y roces pendientes](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=356s)
- [06:17 — Último ajuste de parachoques y aletas](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=377s)
- [06:38 — Prueba exterior: piedras, rampas y cuerdas](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=398s)
- [09:57 — Cierre TopeRC](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=597s)
