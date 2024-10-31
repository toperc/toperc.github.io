# TopeRC.es - Sitio Web con Jekyll

Bienvenido al repositorio de TopeRC.es, un sitio web dedicado a los apasionados de los coches radiocontrol (RC). Aquí encontrarás reviews, guías, tutoriales y recambios para coches RC de diferentes escalas y marcas. Este proyecto está construido utilizando [Jekyll](https://jekyllrb.com/), un generador de sitios estáticos que facilita la creación de contenido dinámico en un sitio estático.

## Estructura del Proyecto

La estructura del proyecto sigue las mejores prácticas para sitios construidos con Jekyll:

```
.
├── _config.yml          # Archivo de configuración principal de Jekyll
├── _data                # Datos globales en formato YAML/JSON
├── _includes            # Fragmentos de HTML reutilizables
├── _posts               # Entradas de blog o reviews
├── _recambios           # Contenido sobre recambios de coches RC
├── _modificaciones      # Tutoriales y guías de modificación
├── _tutoriales          # Contenido educativo para principiantes y avanzados
├── blog                 # Noticias y artículos de la comunidad RC
├── galeria              # Imágenes y videos de coches RC
├── contacto.html        # Página de contacto
├── acerca.html          # Página "Acerca de Nosotros"\├── index.html           # Página principal del sitio
└── _sass                # Archivos SCSS para estilos
```

## Requisitos

Para contribuir a este proyecto, necesitarás tener instalado lo siguiente:

- [Ruby](https://www.ruby-lang.org/en/)
- [Bundler](https://bundler.io/)
- [Jekyll](https://jekyllrb.com/)

## Instalación Local

1. Clona el repositorio en tu máquina local:
   ```sh
   git clone https://github.com/usuario/TopeRC.es.git
   ```

2. Navega al directorio del proyecto:
   ```sh
   cd TopeRC.es
   ```

3. Instala las dependencias con Bundler:
   ```sh
   bundle install
   ```

4. Inicia el servidor Jekyll en tu máquina local:
   ```sh
   bundle exec jekyll serve
   ```

5. Abre tu navegador y navega a `http://localhost:4000` para ver el sitio.

## Cómo Contribuir

¡Nos encantaría que contribuyeras a este proyecto! Aquí te explicamos cómo hacerlo:

1. **Forkea este repositorio** y clónalo en tu máquina local.
2. Crea una **rama nueva** para tu modificación o nueva funcionalidad:
   ```sh
   git checkout -b mi-rama-nueva
   ```
3. **Realiza tus cambios** y asegúrate de probar el sitio localmente.
4. **Commitea** tus cambios con un mensaje descriptivo:
   ```sh
   git commit -m "Agrega nueva review del coche RC Traxxas Slash 4X4"
   ```
5. Sube tu rama al repositorio remoto:
   ```sh
   git push origin mi-rama-nueva
   ```
6. Abre un **Pull Request** en GitHub y describe los cambios que has hecho.

## Buenas Prácticas

- Usa un lenguaje claro y descriptivo para los commits.
- Sigue la estructura de archivos ya establecida para asegurar la consistencia del sitio.
- Asegúrate de probar el sitio localmente antes de enviar tus cambios.

## Reporte de Problemas

Si encuentras algún problema, por favor abre un **Issue** en GitHub con una descripción detallada del problema. Intentaremos resolverlo lo antes posible.

## Licencia

Este proyecto está bajo la **Licencia MIT**. Consulta el archivo `LICENSE` para más detalles.

## Contacto

Para cualquier duda o consulta, puedes contactarnos a través de la [página de contacto](https://toperC.es/contacto.html) del sitio.

---

¡Gracias por contribuir a TopeRC.es! Estamos entusiasmados de ver cómo podemos mejorar la experiencia para la comunidad de radiocontrol juntos.
