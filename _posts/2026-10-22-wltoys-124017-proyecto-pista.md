---
layout: post
content_type: guide
brand_id: wltoys
model_id: wltoys-124017
title: "Wltoys 124017 de pista: chasis de carbono, electrónica y pruebas"
subtitle: "Dos etapas del proyecto: fabricar el chasis y conseguir que la mecánica y la electrónica trabajen juntas."
description: "El proyecto de TopeRC para transformar un Wltoys 124017 en un coche de asfalto: chasis propio, transmisión, cambios de motor y primeras pruebas."
date: 2026-10-22
categories: manuales
tags: wltoys 124017 electronica
video_id: c9f1salvsVg
video_title: "Parte 1: fabricar y montar el chasis"
additional_videos:
  - id: Omfk2LbcGy4
    title: "Parte 2: electrónica, correcciones y pruebas en pista"
---

Este proyecto nace después de ver un coche que iba muy bien en pista y darme cuenta de que tenía en casa buena parte de la electrónica para intentar algo parecido. La idea fue **aprovechar la mecánica del Wltoys 124017 y darle una distribución pensada para asfalto**, con un chasis propio y una carrocería diferente.

<!--more-->

No es una conversión que se resuelva comprando una única pieza. En las dos partes hay cortes, adaptaciones, pruebas y cambios de criterio. Aquí reúno lo que funcionó y lo que tuve que corregir.

## Por qué fabricar el chasis

Parto de una placa de carbono de **3 mm**. Aunque existen chasis de recambio para el 124017, quería colocar la batería y la electrónica a mi gusto y ajustar la base a la carrocería que había elegido.

Utilizo el chasis original como referencia para trasladar los puntos de montaje. Antes de taladrar, marco el centro de ambas piezas y presento los trenes delantero y trasero con la carrocería. Eso permite comprobar la posición de las ruedas en los pasos de rueda, tanto a lo ancho como a lo largo.

Las medidas del vídeo corresponden a esta placa y a esta carrocería: **no son un plano universal para cualquier conversión**. Hay que presentar las piezas y comprobar el recorrido de dirección y suspensión antes de dar un corte por definitivo. Para trabajar el carbono, utiliza protección adecuada frente al polvo, extracción y protección ocular; no lo cortes como si fuera un plástico corriente.

## Las adaptaciones que no se ven al comprar las piezas

La placa plana cambia la forma en que apoyan los conjuntos del coche. En el primer montaje encuentro varios problemas:

- Las cajas no apoyan como en el chasis original: preparo una pieza impresa en 3D para completar ese apoyo.
- Hay que hacer espacio en la caja del diferencial para la transmisión adaptada.
- La parte superior también necesita modificaciones para poder montarse.
- Las ruedas rozan al girar y obligan a ampliar los recortes del chasis en la segunda parte.

También corto demasiado la carrocería en la primera prueba. La conservo para seguir ajustando el proyecto, pero ya explico que preferiría hacer otra con el contorno mejor resuelto. Presentar todo varias veces ahorra tener que sustituir una pieza después.

## Transmisión y diferenciales

Conservo el eje primario original y adapto la transmisión a **módulo 1** para tener más opciones de engranajes. En el vídeo explico las limitaciones de espacio y de la bancada que condicionan esa elección.

La relación entre el piñón y la corona queda próxima a 1:1. Eso describe únicamente ese par de engranajes, **no la reducción total del coche**, y tampoco es una relación que recomiende copiar sin calcular la transmisión completa y comprobar temperaturas.

El ajuste del diferencial delantero evoluciona entre los vídeos: primero pruebo silicona de un millón y después paso a dos millones de cSt. Detrás mantengo grasa. Son ajustes de mi unidad, todavía en desarrollo; la propuesta de endurecer más el delantero queda como una posibilidad, no como una modificación ya probada.

## La primera electrónica no fue la definitiva

La combinación inicial de motor, variador y desarrollo producía mucho **cogging**, esos tirones al intentar arrancar despacio. Cambiar solo una cifra de potencia no resolvía el conjunto.

En la segunda parte reutilizo electrónica procedente de mi MJX 10304, con un motor de menos KV que el primero. Con esa configuración consigo rodar, aunque el coche sigue teniendo más velocidad de la que puedo aprovechar cómodamente en esa pista.

No doy una lista cerrada de compra porque la grabación no fija todas las referencias y ajustes finales. Lo útil del proceso es comprobar la combinación de motor, desarrollo, espacio y refrigeración antes de intentar exprimirla.

## Qué enseñan las primeras pruebas

En la segunda parte comento la lectura del GPS después de rodar. La grabación deja claro que el coche modificado corre mucho, pero una velocidad punta no demuestra por sí sola que el proyecto esté bien afinado para circuito.

Las ruedas de espuma se prueban sin aditivo y con la pista fría. El coche resulta muy rápido y reactivo, y no consigo abrir gas a fondo en la recta. Quedan por trabajar el agarre, la carrocería y el equilibrio general antes de pensar solo en más velocidad.

Si quieres partir del coche original, empieza por la [review del Wltoys 124017]({{ '/reviews/wltoys-124017/' | relative_url }}). Para elegir un pack que encaje en tu configuración, tienes la [guía de baterías del 124017]({{ '/manuales/baterias-wltoys-124017/' | relative_url }}). Este proyecto muestra hasta dónde se puede experimentar con su mecánica, pero también cuánto trabajo hay entre montar componentes y conseguir un coche fácil de conducir.
