# Revisión e integración de cambios locales · 8 de noviembre de 2026

Se revisaron los 75 archivos pendientes de la copia local frente a `origin/main` (`eb2ecb2`). El trabajo local quedó conservado íntegramente en el commit `ffd5d91` antes de iniciar la fusión.

## Resultado de la revisión

- 46 archivos ya coincidían con producción.
- 6 cambios estaban integrados junto con mejoras posteriores y se reconciliaron sin aportar diferencias.
- 22 archivos requerían resolución manual porque mezclaban versiones anteriores con la historia actual.
- 1 nota de planificación todavía no estaba integrada.

## Resolución

Se conservaron las versiones publicadas de las plantillas, estilos, workflow, plugin de idiomas, validadores y traducciones. Aplicar esas copias locales completas habría eliminado funciones actuales: vídeos incrustados y sus miniaturas, fechas y orden por vídeo original, enlaces de colaboración, la calculadora de descarga C y comprobaciones de idiomas y vídeo.

El diccionario inglés local no aportaba claves ni traducciones nuevas: era un subconjunto del publicado, con 237 claves menos. Las antiguas traducciones de reviews y recambios también habrían reemplazado textos revisados y enlaces actuales; algunas coincidían exactamente con revisiones anteriores del repositorio.

Se integraron las aclaraciones documentales útiles en README y planificación, conservando la documentación de las funciones actuales. La referencia local a antiguas instrucciones de agentes se sustituyó por una nota de planificación histórica, sin imponer reglas de otro contexto.

La fusión conserva ambas historias. Su diferencia de contenido respecto a producción se limita a documentación; las funcionalidades actuales y el artículo del Yikong permanecen intactos.

## Validación

Antes de desplegar se ejecutan las pruebas Node existentes, la compilación Jekyll y los validadores de afiliación, vídeos, cronología e idiomas. El despliegue se verifica con GitHub Pages y consultas HTTP de las páginas principales, herramientas y reviews.

Resultado local: 43 pruebas Node superadas; Jekyll compilado; afiliación validada (82 productos, 118 referencias); vídeos (40 entradas y 42 fechas); cronología (200 listados); 151 pares ES/EN y 58 páginas de etiquetas comprobados.
