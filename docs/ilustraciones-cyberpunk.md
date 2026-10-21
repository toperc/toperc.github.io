# Ilustraciones cyberpunk de TopeRC

Tres reinterpretaciones de las ilustraciones existentes, generadas con la herramienta integrada de generación de imágenes. Comparten luces cian, magenta y rojo, materiales oscuros y estética de taller futurista. Son ilustraciones conceptuales, no fotografías de productos.

Las versiones WebP conservan la resolución generada y están listas para la web. Los PNG maestros se han copiado a `.local/imagegen/cyberpunk/` para futuras revisiones. Los originales antiguos y el logo se conservan.

La configuración de imágenes y textos alternativos está en `_data/illustrations.yml`. Las categorías que usan cada ilustración se configuran en `_data/categories.yml`; una página puede elegirla con `illustration: workshop`, `illustration: parts` o `illustration: contact` en su front matter.

Las ilustraciones se integran como fondos decorativos de cabecera, con degradados oscuros y sin añadir un bloque de imagen al contenido. El garaje usa el taller; recambios y contacto conservan sus motivos. La portada también integra su ilustración conceptual detrás del artículo destacado. Las fotografías reales mantienen su presentación propia.

En escritorio hay un parallax suave, limitado a 28 px. En móvil y con `prefers-reduced-motion: reduce` el fondo permanece estático; sin JavaScript también es estático. La etiqueta visible identifica la ilustración conceptual y la imagen decorativa no se anuncia a lectores de pantalla.

## Taller RC

Archivo: [taller-rc-cyberpunk.webp](../img/illustrations/taller-rc-cyberpunk.webp).

Prompt final utilizado:

```text
Use case: style-transfer. Asset type: wide 16:9 editorial illustration for the TopeRC radio-controlled car website. Edit the referenced old illustration into a polished cinematic cyberpunk illustration, a coherent high-end set with crisp realistic miniature mechanical details, graphite black environments, cyan and magenta neon accents with restrained racing-red highlights, subtle atmospheric haze and glossy reflections. Strong readable silhouettes and clear composition, tactile metal/carbon-fiber/rubber materials, contemporary concept-art rendering, not pixel art. No branding, no watermark, no captions, no legible text, no typography or website UI. Keep the recognizable subject and topic of the reference but completely modernize its lighting, environment and rendering. Render a single finished landscape asset, not a montage.
Edit target: image 1, the buggy workbench illustration. Preserve one four-wheel RC off-road buggy with rear wing on a workbench, three-quarter view, surrounded by correctly scaled hobby tools and electronics. Reimagine it as a beautiful underground futuristic RC tuning laboratory at night. The compact red-and-graphite RC buggy is the visual hero, with coherent suspension and four substantial knobby tires. A cyan edge-lit cutting mat, small ESC/motor/servo components, fine wiring, neat precision screwdrivers, one task light and wall-mounted diagnostic displays with abstract non-text graphics. A rain-streaked window hints at a neon city beyond. Put the whole car and its key components inside the central 70% so wide website crops retain the subject. Moody but readable lighting, brilliant cyan rimlight balanced by restrained magenta backlight. No people and no driver.
```

## Recambios RC

Archivo: [recambios-rc-cyberpunk.webp](../img/illustrations/recambios-rc-cyberpunk.webp).

Prompt final utilizado:

```text
Use case: style-transfer. Asset type: wide 16:9 editorial illustration for the TopeRC radio-controlled car website. Edit the referenced old illustration into a polished cinematic cyberpunk illustration, a coherent high-end set with crisp realistic miniature mechanical details, graphite black environments, cyan and magenta neon accents with restrained racing-red highlights, subtle atmospheric haze and glossy reflections. Strong readable silhouettes and clear composition, tactile metal/carbon-fiber/rubber materials, contemporary concept-art rendering, not pixel art. No branding, no watermark, no captions, no legible text, no typography or website UI. Keep the recognizable subject and topic of the reference but completely modernize its lighting, environment and rendering. Render a single finished landscape asset, not a montage.
Edit target: image 1, the RC spare-parts shop illustration. Preserve the front-facing organized shop/workbench composition and the unmistakable RC-parts theme. Transform it into a premium cyberpunk hobby-parts garage with tidy illuminated drawers and dark modular pegboards. Feature small RC knobby wheels, coilover dampers, brushless motors, ESCs, servos, pinion gears, chassis arms and a pistol-grip RC radio transmitter. Center a beautiful work counter and a compact RC rolling chassis with exposed components, flanked by organized spares and precision tools. Cyan shelf-edge lights, magenta reflections, subtle red work lights, no cluttered text labels and no humanoid robots. Clear dimensional miniature-hobby scale. Keep the most important items in the central 70% for responsive landscape crops.
```

## Contacto

Archivo: [contacto-rc-cyberpunk.webp](../img/illustrations/contacto-rc-cyberpunk.webp).

Prompt final utilizado:

```text
Use case: style-transfer. Asset type: wide 16:9 editorial illustration for the TopeRC radio-controlled car website. Edit the referenced old illustration into a polished cinematic cyberpunk illustration, a coherent high-end set with crisp realistic miniature mechanical details, graphite black environments, cyan and magenta neon accents with restrained racing-red highlights, subtle atmospheric haze and glossy reflections. Strong readable silhouettes and clear composition, tactile metal/carbon-fiber/rubber materials, contemporary concept-art rendering, not pixel art. No branding, no watermark, no captions, no legible text, no typography or website UI. Keep the recognizable subject and topic of the reference but completely modernize its lighting, environment and rendering. Render a single finished landscape asset, not a montage.
Edit target: image 1, the playful racing-car-and-messages contact illustration. Preserve the idea of a racing car transporting messages through a city, but reinterpret it as a beautifully detailed miniature radio-controlled open-wheel racing car with a small antenna, no driver, towing a small cargo trailer. Three or four luminous stylized envelope symbols hover above its trailer, creating a clean subtle communication metaphor; remove the chaotic shower of hundreds of icons. The car drives through a rain-slick futuristic urban RC street circuit at blue hour/night, with cyberpunk skyscrapers, cyan/magenta neon reflections and restrained red light trails. Low dynamic three-quarter camera, car and trailer fully within central 70% to survive wide website crops. Do not include real-world brands, logos, social-media marks, giant readable signs or people.
```
