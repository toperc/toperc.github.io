---
video_title: "Watch the Yikong 4107 Pro upgrades"
title: "Yikong 4107 Pro upgrades: 3D parts, wheels and scale accessories"
subtitle: "A front battery mount, central electronics, quick body clip and the details I added to my crawler."
description: "The upgrades I made to my Yikong 4107 Pro: 3D printed mounts, battery and electronics layout, wheels, scale accessories and outdoor driving."
---

After several days of measuring, designing, printing and waiting for accessories, my **Yikong 4107 Pro** is much closer to how I want it. I have worked on both the internal layout and the exterior, then taken it out for a run over rocks and ramps.

This follows my [Yikong 4107 Pro review]({% post_url reviews/2026-11-08-yikong-4107-pro %}). I have not replaced the steering servo or all the electronics: much of the work is about repositioning the original components and adapting the truck to my preferences.

<!--more-->

**The video is currently private on YouTube.** Until its visibility changes, playback is available only to authorised accounts.

![Upgraded Yikong 4107 Pro with its wheels and accessories, alongside the custom 3D parts]({{ '/img/guias/mejoras-yikong-4107-pro/miniatura.webp' | relative_url }})

## The parts I designed and adapted

The video animation shows the components separately before I explain their installed positions:

- **Front battery mount.** A tray and riser move the battery forwards. This is the layout I wanted to try; I have not measured the weight distribution before and after.
- **Electronics tray.** This brings the stock electronics towards the centre, with space for the switch and a lidded box for the receiver and its wiring. The lid helps keep things tidy; I have not tested water resistance.
- **Shock towers.** These aim to gain roughly half a centimetre and reduce tyre contact with the body. Rubbing is reduced, but still occurs in some positions.
- **Front clip with a 5 mm offset and separate anchor.** It makes opening and closing the body more convenient than undoing the screw every time.

The project retains this [body clip reference on Thingiverse](https://www.thingiverse.com/thing:7284842). I distinguish my own parts and adaptations from third-party STL designs: the ladder and rear mount shown in the video come from someone else’s design; the adapter for my wheel and fuel can is a later modification.

## Battery forwards and tidier wiring

Previously, servo wires crossed from one side of the chassis to the other. Moving the electronics to the centre and gathering the receiver wiring inside its box makes the installation tidier and easier for me to access.

This is a layout and convenience change for my particular build. Before copying it, check battery clearance, wire lengths and the full travel of the mechanisms on your own truck.

## Wheels and scale accessories

The new wheels and tyres are among the most visible changes. I have also added hooks, boxes, a bicycle, a bag, a fire extinguisher, a fuel can and an antenna, placing them to achieve the look I wanted.

I fitted **underbody protection** after noticing wear marks from the first few outings. For now, I have attached the steel cables using existing mounting points rather than drilling the body. That is a choice for this build, rather than a universal installation method.

## Rubbing still needed a final adjustment

The shock towers did not fully eliminate contact with the bumper. After filming the explanation, I made a final trim to the bumper and lexan fenders; this is identified in the video before the outdoor test.

The driving section keeps its ambient sound so you can watch the truck working over rocks, ramps and rope obstacles. The FMS that joined the outing also appears. This run shows the complete setup in use; it is not a controlled test that isolates the traction benefit of any single component.

## What remains a future idea

I would like a winch operated from the transmitter and to make use of my RadioMaster MT12. In the video I discuss an ELRS receiver with more outputs, GPS and an ESP32 lighting controller. **These are future possibilities: they are not installed or demonstrated in this video.**

For now, the aim was to make the truck tidier, give it the look I wanted and enjoy driving it again.

## Accessories used and purchase links

The following AliExpress links are **affiliate links**: TopeRC may receive a commission on purchases made through them. These are the links supplied for this build; check variants, dimensions and mounting points before purchasing. No prices or availability are assumed.

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-cables-parachoques-acero' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-cables-parachoques-acero"><strong>Steel bumper cables</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-cajas-plastico' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-cajas-plastico"><strong>Plastic storage boxes</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-bicicleta-1-10' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-bicicleta-1-10"><strong>1:10 bicycle</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-extintor' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-extintor"><strong>Fire extinguisher</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-bidon-gasolina' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-bidon-gasolina"><strong>Fuel can</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-bolsa-lona' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-bolsa-lona"><strong>Canvas bag</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-protectores-bajos' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-protectores-bajos"><strong>Underbody protection</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

{% assign upgrade_product = site.data.affiliate_links.products | where: 'id', 'yikong-4107pro-antena' | first %}
{% assign upgrade_offer = upgrade_product.offers | where: 'status', 'active' | first %}
<div class="affiliate-product" data-affiliate-product="yikong-4107pro-antena"><strong>Antenna</strong>{% if upgrade_offer %} · <a href="{{ upgrade_offer.url | escape }}" target="_blank" rel="sponsored noopener noreferrer">AliExpress ↗</a>{% endif %}</div>

## Video chapters

- [00:00 — Introduction: my upgraded Yikong](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=0s)
- [00:44 — Custom 3D parts and shock towers](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=44s)
- [01:39 — Quick body opening clip](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=99s)
- [01:50 — Front battery and central electronics](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=110s)
- [02:37 — New wheels and scale accessories](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=157s)
- [03:09 — Rear ladder, wheel and fuel-can adapter](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=189s)
- [03:37 — Underbody protection and bumper cables](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=217s)
- [04:21 — Future plans: winch, MT12, ELRS and lights](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=261s)
- [05:56 — Overview and remaining rubbing](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=356s)
- [06:17 — Final bumper and fender trimming](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=377s)
- [06:38 — Outdoor driving: rocks, ramps and ropes](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=398s)
- [09:57 — TopeRC outro](https://www.youtube.com/watch?v=gnqu7tPFOw0&t=597s)
