# 04 · Plantillas y diseño

## Objetivo

Crear una presentación propia de TopeRC que ayude a leer, comparar y encontrar recursos, conservando la facilidad de mantenimiento de Jekyll.

## Avance · 21/10/2026

Se ha implementado el layout de modelo, las tarjetas del garaje, enlaces de contexto en reviews y recambios, y filtros de marca/modelo. Comprobados en escritorio y a 390 px; el menú abre y cierra con Escape y el contenido permanece accesible sin JavaScript. El README explica cómo añadir modelos y sus relaciones. Las tareas editoriales y la nueva estructura interna de reviews siguen pendientes.

Las ilustraciones de sección pasan a fondos oscuros de cabecera y dejan de ocupar bloques independientes. Recambios, garaje, reviews, guías y contacto usan el componente compartido; la portada integra su ilustración conceptual detrás del destacado. El parallax es leve y solo se activa en escritorio sin preferencia de movimiento reducido. Comprobados la presentación a 390 px y el fondo estático con movimiento reducido; Jekyll compila y las 49 páginas conservan sus enlaces internos.

## Tareas de la primera entrega

- [ ] Diseñar la ficha y la review del MJX con los datos disponibles.
- [ ] Dar prioridad a título, resumen, modelo y acceso al vídeo frente a imágenes decorativas muy grandes.
- [ ] Presentar los datos técnicos en una ficha legible, con contexto o fuente cuando sea necesario.
- [ ] Separar observaciones, ventajas, inconvenientes y conclusión con contenido concreto.
- [ ] Incorporar imágenes reales del modelo cuando existan. Mantener las ilustraciones cyberpunk para ambientación, identificadas como ilustraciones.
- [ ] Mostrar publicaciones del mismo coche o tema al final del artículo; revisar la utilidad de la navegación cronológica actual.
- [ ] Mostrar una fecha de actualización solo cuando haya habido una revisión real del contenido.
- [ ] Añadir un índice de lectura a los artículos largos donde resulte útil.

## Tareas posteriores

- [ ] Ajustar las tarjetas del blog: título y resumen concretos, marca/modelo y fotografía cuando estén disponibles.
- [ ] Revisar la altura de las cabeceras en reviews, guías, recambios y contacto para que el contenido principal sea fácil de alcanzar en móvil.
- [ ] Preparar una presentación de recambios con referencia y compatibilidad claras; mantener enlaces reales y estados honestos.
- [ ] Revisar espaciado, tamaños de texto, tablas, vídeos, foco de teclado y menú en pantallas pequeñas.
- [ ] Actualizar los ejemplos del README para añadir una review, una ficha y un listado sin tocar sus layouts.

## Entrega y criterio de cierre

Una vista previa del piloto que funcione en móvil y escritorio, permita identificar rápidamente el coche y sus recursos, y no dependa de campos vacíos para mantener el diseño. El texto debe seguir siendo legible sin JavaScript y los componentes compartidos deben servir para otro modelo.

## Dependencias

Los datos y conclusiones proceden del bloque 01. Las fichas y relaciones proceden de 02 y 03. Primero revisaremos el piloto; después aplicaremos la plantilla al resto.
