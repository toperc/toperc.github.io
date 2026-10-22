---
layout: post
content_type: guide
title: "Elegir batería LiPo y cargador para RC: tamaño, voltaje y capacidad"
subtitle: "Qué revisar antes de comprar y cómo interpretar los números sin prometer más de lo que significan."
description: "Guía de baterías y cargadores RC: compatibilidad, S, mAh, C, equilibrado, storage y potencia del cargador."
date: 2026-10-22
categories: manuales
tags: baterias electronica
video_id: eLo09DeIIp8
affiliate_products: [buscador-baterias-hobbyking, zeee-3s-2200-guia, zeee-3s-5200, dxf-4s-6500-lihv, cargador-imax-b6, cargador-ovonic-x4, cargador-toolkitrc-guia]
---

Elegir una batería no consiste en buscar la etiqueta con más números. En el vídeo enseño las que utilizo y explico cómo relacionarlas con el coche y el cargador. Aquí ordeno los criterios y matizo algunas simplificaciones de aquella explicación.

<!--more-->

## Primero tiene que caber y ser compatible

Mido el hueco del coche y compruebo dimensiones, sujeción, salida de cables y conector. Una batería que sobresale o deja los cables junto a la transmisión no queda bien instalada solo porque permita cerrar la carrocería.

El conector debe corresponder con el equipo y soportar el uso previsto. Cambiarlo exige conocer la polaridad y trabajar correctamente; comprar directamente el formato adecuado evita tener que adaptar un pack nuevo.

## Las S indican las celdas en serie

En una LiPo convencional, 2S son dos celdas en serie: 7,4 V nominales y hasta 8,4 V al terminar la carga. En 3S son 11,1 V nominales y hasta 12,6 V cargada. Hay que respetar la tensión admitida por **todo el conjunto**, incluidos motor y variador.

Una LiHV utiliza otro límite de carga: no basta con que el coche admita el mismo número de S. Deben comprobarse batería, cargador y electrónica. Las tablas del [manual de un cargador multiquímica de Horizon Hobby](https://www.spektrumrc.com/ProdInfo/Files/ONXC4101%20Manual-EN.pdf) distinguen LiPo y LiHV; no son modos intercambiables.

## Los mAh expresan capacidad, no minutos garantizados

Más capacidad puede dar más tiempo de uso, pero también añade peso y cambia el comportamiento. Duplicar los mAh **no garantiza duplicar la autonomía**: influyen conducción, terreno, consumo y estado de las baterías.

Los mAh tampoco son una medida de intensidad de carga. Para pasar a Ah divido entre mil: 5.000 mAh son 5 Ah.

## Cómo interpretar las C

La cuenta teórica es capacidad en Ah multiplicada por C. Por ejemplo, 2,2 Ah × 35 C = 77 A según esa clasificación. Hay que distinguir descarga continua de pico y tomar con cautela las cifras comerciales.

El amperaje nominal del variador no dice que el coche consuma esa intensidad constantemente. Por eso **no basta con igualar las C de la batería a la cifra impresa en el variador**. La carga real depende del conjunto y del uso; importan también caída de tensión, temperatura y las indicaciones del fabricante.

## Carga, equilibrado y almacenamiento

Uso un cargador compatible con la química y el número de celdas. En packs convencionales conecto alimentación y equilibrado según el manual: el puerto de equilibrado permite supervisar y corregir diferencias entre celdas; no significa que toda la carga principal pase por esos hilos finos.

Como referencia, 1C en una batería de 5 Ah equivale a 5 A. La tasa autorizada la determina el fabricante. Para guardar el pack utilizo el programa de almacenamiento correspondiente. La [guía LiPo de Gens Ace](https://gensace.de/pages/lipo-battery-guide) recoge los límites de carga, la conservación y la precaución de no superar 1C sin autorización específica.

## Los vatios también limitan el cargador

La potencia de salida necesaria se calcula con **P = V × I**. Para dimensionarla hay que considerar la tensión máxima de carga, no solo la nominal.

Una LiPo 6S convencional llega a 25,2 V: mantener 10 A hasta esa tensión requiere unos **252 W de salida**, además de que equipo y fuente puedan entregarlos. Un cargador limitado a 200 W reducirá la intensidad antes. En un equipo de varios canales hay que revisar también cómo comparte la potencia.

## Las referencias del vídeo

Los enlaces recogen los productos de la descripción. No convierten esas baterías en compatibles con cualquier coche ni garantizan el contenido actual de los anuncios. Para el caso concreto del 124017 tienes mi [guía de baterías del modelo]({{ '/manuales/baterias-wltoys-124017/' | relative_url }}).

{% include affiliate_products.html %}
