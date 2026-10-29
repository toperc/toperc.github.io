---
layout: page
title: "Privacidad de TopeRC Studio"
permalink: /studio/privacidad/
navbar: false
---

Actualización: 29 de octubre de 2026.

Esta página describe la integración local de TopeRC Studio con TikTok. Las prácticas de la web pública se describen por separado en su [política de privacidad](/politica-privacidad/).

## Quién utiliza los datos

Studio es operado por TopeRC en el equipo de su propietario. Contacto para consultas y solicitudes sobre estos datos: [toperc.es@gmail.com](mailto:toperc.es@gmail.com).

## Datos utilizados y finalidad

Al conectar TikTok mediante su autorización oficial, Studio recibe identificadores de cuenta y tokens de acceso y renovación. Consulta el identificador y el nombre de usuario para comprobar que la cuenta de destino es la prevista.

Los permisos solicitados son `user.info.basic`, `user.info.profile` y `video.upload`. Los permisos de perfil permiten solicitar información del perfil; la integración consulta el identificador y nombre de usuario para verificar el destino. `video.upload` permite enviar el vídeo a la bandeja de TikTok para que el creador lo revise y publique.

Studio utiliza el archivo de vídeo seleccionado, su huella de integridad, la fecha prevista y el estado del envío. Conserva el identificador del intento y, si el propietario lo aporta, el enlace de la publicación para hacer seguimiento y evitar envíos duplicados.

## Almacenamiento y destinatarios

Las credenciales, la programación y los registros de los intentos se guardan en archivos locales del equipo. No se incorporan deliberadamente al repositorio ni a esta web. Quien tenga acceso a esos archivos debe tratarlos como información confidencial.

TikTok recibe las solicitudes de autenticación, las consultas de cuenta y estado, y el vídeo cuyo envío ha autorizado el propietario. En esta modalidad, Studio no envía el texto ni una portada independiente: el creador los revisa y establece desde TikTok. El tratamiento posterior que haga TikTok está sujeto a su [política de privacidad](https://www.tiktok.com/legal/page/eea/privacy-policy/es).

Studio no vende estos datos ni los utiliza para publicidad. Esta integración no necesita publicar el vídeo en una dirección web ni abrir un túnel público.

## Conservación, desconexión y eliminación

Los archivos locales se conservan hasta que el propietario los elimina; no hay un plazo automático de borrado implementado para credenciales, manifiestos o registros de intentos. Retirar una tarea del listado no elimina esos registros ni el contenido remoto.

El titular puede revocar la autorización en TikTok. Para retirar también la copia local de las credenciales y los registros, debe cancelar los envíos pendientes y eliminar los archivos correspondientes del equipo. Las publicaciones o vídeos ya recibidos por TikTok se gestionan desde TikTok. Se pueden solicitar instrucciones o la atención de una consulta mediante el correo de contacto indicado.

## Cambios

Esta información se actualizará si cambia el funcionamiento de la integración.
