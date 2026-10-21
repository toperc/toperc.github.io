---
layout: post
content_type: guide
brand_id: rlaarlo
model_id: rlaarlo-omni-terminator
title: "Rlaarlo Omni Terminator: refuerzo de carrocería y cambio de variador"
subtitle: "Cómo preparo mi unidad para bashing y qué hay que comprobar antes de plantearse 4S."
description: "TopeRC refuerza la carrocería del Rlaarlo Omni Terminator e instala un Hobbywing QuicRun WP 10BL120 G2: montaje, conectores y límites de la prueba."
date: 2026-10-22
categories: manuales
tags: rlaarlo omni-terminator electronica
video_id: EDj72jlW7t0
---

Después de utilizar el **Rlaarlo Omni Terminator** en saltos, vi desgaste en la carrocería alrededor de sus apoyos. También quería cambiar el variador de mi unidad para disponer de más ajustes. En este vídeo reúno ambas tareas: reforzar la carrocería por dentro y montar un Hobbywing QuicRun WP 10BL120 G2.

<!--more-->

La grabación incluye una prueba con una batería 4S LiHV facilitada por HobbyKing. Es una preparación experimental de mi coche; **cambiar el variador no confirma por sí solo que el resto del vehículo sea apto para 4S**.

## Reforzar la carrocería

Utilizo Gorilla Tape por el interior, prestando atención a los apoyos, laterales y pasos de rueda. Antes retiro las molduras y sujeciones que dificultan colocarla.

Limpio la superficie, pego la cinta presionando para que siga las formas y recorto después el sobrante. Si una tira larga resulta difícil de colocar, se puede trabajar con tramos más pequeños solapados, como explico en el vídeo.

La cinta añade grosor. Hay que repasar los agujeros y comprobar que molduras, sujeciones y clips entran sin forzar la carrocería. Con el cúter, trabajo despacio para no cortar el policarbonato ni hacerme daño.

También explico un inconveniente: el adhesivo agarra mucho y, al retirarlo, puede llevarse pintura. No lo trataría como una capa que se pone y se quita sin consecuencias, especialmente en una carrocería pintada por dentro.

## Presentar el variador antes de pegarlo

Retiro el variador y el interruptor antiguos y limpio las zonas de fijación. Antes de pegar el recambio, compruebo su posición con los cables del motor, el receptor y la batería.

El modelo identificado en la grabación es el **Hobbywing QuicRun WP 10BL120 G2**. En mi unidad encuentro sitio sin imprimir un soporte nuevo. Conecto el cable de gas al receptor y compruebo el funcionamiento antes de cerrar y fijar el conjunto.

La [documentación oficial de Hobbywing](https://www.hobbywing.com/en/uploads/file/20230724/9d79e9cb38d4c0b8f98e5359f53515eb.pdf) indica compatibilidad del variador con LiPo de 2S a 4S, funcionamiento sin sensores y límites de motor según el voltaje. Eso pertenece al variador: no valida automáticamente el motor de origen, el desarrollo ni el conjunto del coche. Comprueba también el ajuste del BEC y lo que admiten receptor y servo.

## Los conectores del motor no coinciden

Las balas del motor y del variador nuevo tienen distinto tamaño. En el vídeo enseño una solución provisional abriendo los contactos y advierto que queda juego. **Para un montaje definitivo, utiliza conectores de la medida correcta, bien soldados y aislados**; no bases la conexión en deformar una bala que no corresponde.

En un motor sin sensores, el manual permite intercambiar dos fases para invertir el giro. Haz cualquier cambio con la batería desconectada y comprueba después el sentido con el coche elevado.

## 4S y LiHV requieren comprobar el conjunto

La batería que pruebo lleva XT60. Eso facilita la conexión física, pero no confirma compatibilidad eléctrica. Una **LiHV cargada al máximo puede superar el voltaje de una LiPo convencional con el mismo número de celdas**. La indicación «4S LiPo» no basta para deducir compatibilidad con cualquier 4S LiHV a plena carga: hay que confirmarlo para cada componente.

En la [guía de baterías]({{ '/manuales/baterias-wltoys-124017/#lihv-fíjate-en-el-voltaje-a-plena-carga' | relative_url }}) explico esa diferencia de voltajes. Este vídeo no documenta una comprobación completa de temperatura ni una validación de duración del motor con la configuración nueva. No lo presento como un kit de conversión a 4S garantizado.

## La salida final

La última parte muestra el coche rodando y saltando después del montaje. No aporta velocidad medida, autonomía cronometrada o un ensayo de resistencia a largo plazo.

El refuerzo de carrocería y el cambio de variador son decisiones separadas: puedes valorar el primero por el desgaste de tu coche sin aumentar su potencia. Encontrarás las publicaciones del modelo en la [ficha del Rlaarlo Omni Terminator]({{ '/coches/rlaarlo-omni-terminator/' | relative_url }}).
