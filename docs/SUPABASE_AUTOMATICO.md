# Supabase como almacenamiento principal

La app usa una sesión privada de Supabase por dispositivo. Al haber conexión, intenta abrirla automáticamente, sin pedir claves del proyecto ni tokens de GitHub. Las políticas existentes restringen registros y fotografías al propietario autenticado.

## Activación del proyecto

En el Dashboard del proyecto, abrir **Authentication → Sign In / Providers** y habilitar **Allow anonymous sign-ins**. Para vincular la misma identidad a un correo, habilitar **Allow manual linking**. Conservar las políticas por propietario y el bucket privado; no abrir las tablas al público.

El acceso al Dashboard es independiente de la conexión del chat. Si esa opción está deshabilitada, la API devuelve `422 anonymous_provider_disabled`. La app informa que el guardado en nube está pendiente y mantiene los registros locales; no lo presenta como sincronización completada. Con una cuenta de correo ya iniciada, continúa usando esa cuenta y no crea otra identidad.

## Flujo

1. Reutiliza la sesión existente o crea una sesión privada para el dispositivo nuevo.
2. Conserva los registros locales existentes y los vincula a su propietario al terminar la inicialización. Mantiene la ficha y el mapa al conectar automáticamente.
3. Cada guardado persiste primero en IndexedDB y dispara el envío. Los pendientes se reintentan al recuperar señal, al volver a la app y cada 45 segundos con la app abierta. Si un guardado coincide con otro envío, reintenta el pendiente al finalizar, evitando bucles rápidos ante errores.
4. La confirmación de copia exige una sincronización correcta, sin pendientes ni conflictos. La conexión o una sesión por sí solas no cuentan como respaldo confirmado.

## Recuperar el acceso

La sesión del dispositivo se recuerda al cerrar y abrir Chrome. Sin vincular correo, borrar el almacenamiento de Chrome o perder el dispositivo puede impedir recuperar el acceso a la copia de esa identidad, aunque los datos sigan en Supabase.

En **Datos y respaldo → Guardado automático en Supabase**, usar **Vincular mi correo** y confirmar el enlace. Después definir la contraseña para ingresar desde otro equipo. La vinculación conserva el mismo propietario. Para ingresar a una cuenta existente, la app incorpora sus registros locales sin borrar los originales; las diferencias de versión se revisan mediante el mecanismo de conflictos.

Si existe constancia de una identidad previa pero falta la sesión, la app no crea silenciosamente otra cuenta vacía. Mantiene visible la copia local asociada y pide recuperar el acceso. La sesión automática nunca se comparte entre visitantes de la app pública.

GitHub y Drive se mantienen como copias adicionales opcionales. No se transfieren automáticamente documentos originales ni la copia de recuperación a una identidad de prueba.

## Verificación de esta entrega

Pruebas de sesión y sincronización verifican reutilización, concurrencia, errores, pérdida de acceso, guardado durante una descarga, adjuntos pendientes y recuperación del modelo de datos. La prueba real de creación de sesión informó `422 anonymous_provider_disabled`; no creó una cuenta ni guardó registros reales. La activación del proveedor en el Dashboard y la primera verificación real de escritura/recuperación quedan pendientes hasta habilitarlo.

Referencias: https://supabase.com/docs/guides/auth/auth-anonymous y https://supabase.com/docs/guides/auth/sessions.
