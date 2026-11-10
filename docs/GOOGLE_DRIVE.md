# Respaldo directo a Google Drive

Estado: integración preparada; falta activar las credenciales de Google de la app y comprobar una operación real autorizada. La conexión de Drive de ChatGPT sirve para acciones dentro del chat y no entrega credenciales reutilizables a una web externa. La consola de Google Cloud devolvió `Site Unavailable` en el navegador de configuración de esta sesión.

## Destino y funcionamiento

Destino fijo verificado: **Doc Worley / App avances**. La carpeta sigue privada y no se cambian permisos. La app no crea destinos alternativos ni guarda en la raíz si la autorización falla.

En **Datos y respaldo → Respaldo en Google Drive**, el botón actualiza `Avances_BD_LMT_<equipo>.json` con historial y fotos del equipo. Las siguientes operaciones actualizan ese mismo archivo; equipos diferentes mantienen archivos distintos para no sobrescribirse. No lee ni modifica PDF/DWG originales. El respaldo usa el mismo formato JSON importable por la app.

Esta función guarda una copia por equipo; no reemplaza la sincronización de eventos entre dispositivos ya existente. No importa ni mezcla automáticamente otros respaldos de Drive. Solo informa éxito cuando Google confirma la carpeta y una lectura posterior coincide con el contenido enviado.

## Activación única

1. Crear o usar un proyecto propio en Google Cloud y habilitar **Google Drive API** y **Google Picker API**.
2. Configurar la pantalla de consentimiento y el permiso limitado `https://www.googleapis.com/auth/drive.file`. Durante pruebas, incluir la cuenta propietaria como usuario de prueba.
3. Crear un cliente OAuth de tipo **Aplicación web**, con origen JavaScript autorizado `https://sebastiandc99.github.io`.
4. Crear una API key pública para Picker en ese mismo proyecto. Restringirla a las APIs de Drive/Picker y a los sitios `https://sebastiandc99.github.io/*` y `https://docs.google.com/*` (Picker se muestra desde ese último origen).
5. En la app, abrir **Configuración de la conexión con Google**, completar el ID público del cliente OAuth, API key pública y número del proyecto. No ingresar ni publicar contraseñas, secretos de cliente, claves de servicio o tokens.
6. Pulsar **Sincronizar copia con Drive** y completar el acceso de Google. Si hace falta conceder acceso a la carpeta, Google muestra el destino para autorizarlo una vez; la app acepta únicamente la carpeta fija. Las siguientes copias no piden dónde guardar. Google puede volver a pedir acceso a la cuenta cuando expire su sesión.

La configuración pública se conserva en ese navegador y los tokens de acceso solo en memoria. El guardado local/offline funciona aunque Drive no esté configurado o no haya conexión.

## Documentación oficial

- https://developers.google.com/identity/oauth2/web/guides/use-token-model
- https://developers.google.com/workspace/drive/picker/guides/web-picker
- https://developers.google.com/workspace/drive/api/guides/api-specific-auth

La escritura real y el consentimiento de Google no se pudieron verificar sin las credenciales propias de la app. Las pruebas de protocolo usan respuestas aisladas y no cargan datos ficticios en la carpeta personal.
