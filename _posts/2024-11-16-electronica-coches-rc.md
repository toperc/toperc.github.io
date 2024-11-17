---
layout: post
title: "¿Cómo funciona la electrónica de un coche RC?"
date: 2024-11-16
categories: manuales
tags: rc electronica tutoriales
---

En el siguiente post, intentaré aclarar todas las dudas que podáis tener en cuanto a la electrónica de un coche

<!--more-->

## ¿Qué necesita un coche para funcionar?

Desde siempre me ha llamado la curiosidad de cómo funciona un coche radiocontrol, desde el momento en el aprietas
alguno de los controles en el mando, hasta que el coche empieza a moverse.

Los coches radiocontrol están generalmente formados por dos grandes conjuntos:

- **Conjunto electrónico:** Todo el conjunto de partes electrónicas, que transmiten las órdenes y acaban transmitiendo las órdenes a las piezas mecánicas, como por ejemplo:
  - Batería.
  - Emisora.
  - Receptor.
  - ESC.
  - Motor.
  - Servo.
- **Conjunto mecánico:** Todas aquellas piezas que no requieren de energía para funcionar, como por ejemplo:
  - Diferenciales.
  - Suspensión.
  - Brazos.
  - CVD.
  - Salva-servos.

En este tutorial nos centramos en la parte electrónica de los vehículos.

## ¿Qué elementos electrónicos nos podemos encontrar?

La variedad de elementos electrónicos que nos podemos encontrar en un vehículo dependerá sobretodo del objetivo para el que
queramos el coche.

No será lo mismo un coche que queramos usar para hacer FPV, un coche para competir, o incluso un coche
para hacer sesiones de bashing.

Pero por lo general, lo básico que necesitaremos serán:

### Batería

La batería es la fuente de energía del coche radiocontrol. De baterías tenemos muchos tipos, potencias y capacidades diferentes.

Lo más común hoy en día son las baterías Li-Po. La potencia de las baterías Li-Po se mide en "celdas" (S). Un celda (S) 
equivale a 3.7v, por lo que una batería de 2S podrá proporcionar 2 x 3.7v = 7,4v, y una de 3s podrá proporcionar 3 x 3,7v = 11,2v.

La capacidad la medimos en miliamperios hora (mah), y esto nos indica cuánta energía puede almacenar la batería y, en consecuencia,
cuanto tiempo de uso puede ofrecer al coche antes de la siguiente carga.

Luego tenemos otro valor muy importante, que es el C rating. El C rating nos indica cuánta energía es capaz de entregar la batería
sin sufrir daños. Por ejemplo, una batería de 2200mah 25C, no debería de sobrepasar un consumo de 2200mah x 25C = 55000mA (55A), como
podemos ver la potencia no forma parte de la ecuación.


### Emisora

La emisora podríamos decir que es el "mando" a distancia de los coches radiocontrol.

De emisoras podemos encontrar muchísimas diferentes en el mundo del radiocontrol, pero por lo general todas tienen 
el mismo propósito y funcionan de la misma manera.

Las emisoras se encargan de enviar la información de las acciones que ejecutas en ella, ya puede ser girar una ruedecita,
apretar un gatillo o accionar un botón, al receptor.

Es importante entender que el receptor y la emisora han de usar el mismo "protocolo". No será lo mismo una emisora y receptor
de un coche RTR Wltoys, que una emisora y receptor de un Rlaarlo por ejemplo.

Las emisoras utilizan canales, que son vías de comunicación, para enviar las acciones al receptor correspondiente, 
esto también puede llegar a ser un elemento clave a la hora de seleccionar una emisora: el número de elementos que queremos
manejar desde la emisora.

Dicho esto, el mínimo número de canales necesario para operar un coche radiocontrol es de 2 canales:
- **Canal 1**: Para operar la dirección (accionar el servo en un sentido u otro)
- **Canal 2**: Para acelerar / frenar (accionar el motor en un sentido u otro)

### Receptor

Como hemos mencionado antes, el receptor es el encargado de recibir las operaciones que envía la emisora, éste recive los datos
a través del canal correspondiente, y los envía al dispositivo conectado a ese canal.

Cada uno de estos canales, en el receptor se traducen como "clavijas" o "conectores".

A cada una de estas "clavijas" o "conectores", veremos que van de 3 cables:
- **Cable blanco**: datos.
- **Cable negro**: negativo.
- **Cable rojo**: positivo.

Los cables rojo y negro proporcionan energía al dispositivo conectado en ese canal, mientras que el cable de datos envía
cual es la operación que se ha de ejecutar.

Todos los receptores trabajan en un rango de voltaje, y a la hora de escoger un receptor u otro, tendremos que tener en cuenta
qué voltaje requieren los elementos conectados, para asegurarnos de que la energía que les enviaremos, será
la correcta o no (suelen rondar los 4-11v).

Pero, si todos los conectores reciven energía desde el receptor, ¿de donde proviene esa energía?

Pues es sencillo, la energía proviene de cualquiera de los canales (puede parecer un poco confuso, pero es así).

Desde cada uno de los canales del receptor, puedes meter voltaje o sacar voltaje (dependerá del dispositivo), pero por lo
general, todos los elementos conectados al receptor consumirán energía a excepción de la ESC; que será la encargada
de suministrar energía al receptor.

### ESC

La ESC o Electronic Speed Controller, más comunmente conocido como "variador", es el "cerebro" detrás de todo coche radiocontrol.

De ESC's o variadores tenemos también a "patadas", pero podemos agruparlas en 2 tipos:
- Brushed.
- Brushless.

Dependiendo del motor que tengamos, necesitaremos una u otra. Un motor brushed (con escobillas) no puede funcionar con una ESC
brushless, ni un motor brushless (sin escobillas) puede funcionar con una ESC brushed.

Una característica clave de **algunas ESC** es que son programables, ¿qué quiere decir eso? pues que podemos ajustar/afinar/modificar
algunos valores/parámetros de dentro del variador, para cambiar el funcionamiento de éstas. Algunos valores que
suelen ser "programables" son:
- Punch: que es la rapideza de entrega de potencia máxima del motor (se podría traducir como "torque")
- Brake force: que es la fuerza de frenado del coche.
- BEC output: el voltaje de salida del BEC.

Es el encargado de 3 operaciones críticas dentro del funcionamiento de todo coche:
1. Recoger la energía de la batería.
2. Repartir la energía de la batería (BEC).
2. Accionar el motor.

#### Recoger la energía de la batería

La ESC, por lo general, es el único elemento directamente conectado a la batería, por lo que uno de los parámetros
a tener en cuenta a la hora de escoger una ESC u otra, será también el voltaje que esta requiere. Normalmente se mide en un rango de celdas (S) de la batería (2/3S, 3/4S ...etc). Dependiendo del motor que queramos
hacer funcionar, necesitaremos una ESC que opere en 3.7v(1S) o quizás en 7.4v(2S).

Pero eso no es todo, no iba a ser tán fácil, porque también tenemos el amperaje (A), hay ESCs pueden parecer
exactamente igual, pero algunas gestionan 45A y otras 60A, por ejemplo. Esto es decisivo cuando seleccionamos
una ESC, ya que si seleccionamos una ESC de 45A que luego está conectada a un motor que puede llegar a consumir 120A,
podemos imaginarnos que acabaremos friendo el cerebro de nuestro coche radiocontrol.

#### Repartir la energía de la batería (BEC).

El BEC o "Battery Eleminator Circuit", es una característica clave de las ESC, y es que como hemos dicho antes, los variadores
electrónicos son los únicos dispositivos conectados a la batería, por lo que han de encargarse también de poder repartir
esa energía a los demás dispositivos (aunque realmente, solo acabe subministrando energía al receptor, y este la reparta a los
demás canales).

Antiguamente, en los coches nitro (gasolina), esto no era necesario, ya que la batería con la contaban, iba directamente conectada
al receptor y éste la repartia a los demás componentes.

#### Accionar el motor

Como hemos dicho, la ESC es la encargada de recibir la orden de mover el motor en un sentido u otro a través de un canal
del receptor.

Las ESC para motores brushed se conectarán al motor mediante 2 cables y las brushless mediante 3 cables.

## Motor

En cuanto a motores, tenemos 2 categorías:
1. Motor brushed (escobillas)
2. Motor brushless (sin escobillas)

La velocidad del motor, dependerá siempre de sus KV; para motores brushless, o Turns (T); para motores brushed.

No creo que sea necesario mencionar que, a mayor capacidad de velocidad de un motor, menor su capacidad de torque o empuje es.



---
