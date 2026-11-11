# Respaldo privado de registros en GitHub

La aplicación pública permanece en GitHub Pages. Los registros se guardan en el repositorio independiente y privado `Sebastiandc99/Avances-BD-LMT-Datos`.

## Activación desde el navegador del usuario

1. Abrir la app → Datos y respaldo → Respaldo automático en GitHub.
2. Seguir Crear autorización en GitHub. Elegir **Only select repositories** y solo **Avances-BD-LMT-Datos**, con **Contents: Read and write**. El enlace prepara propietario, permiso y vencimiento de 90 días; la selección del repositorio se completa en GitHub.
3. Generar el token granular y pegarlo exclusivamente en el campo protegido de la app. No compartirlo en chats ni commits.
4. Marcar **Recordar autorización en este navegador** solo en un dispositivo propio si se desea reanudar el respaldo después de cerrar y abrir la app. Sin marcarlo, el token queda únicamente en memoria hasta cerrar o recargar la app.
5. Pulsar **Conectar y activar respaldo de registros**. Esperar **Respaldo de registros comprobado en GitHub**. La primera comprobación requiere red y un envío o lectura real; la sesión de ChatGPT no activa este permiso en el navegador del usuario.

El token recordado se almacena en localStorage del origen de la app y es accesible para su JavaScript. Nunca se publica ni se exporta. Usar un token granular restringido a este único repositorio. Desconectar elimina la credencial de ese navegador; revocarla en GitHub impide futuros accesos. No se crea una credencial compartida.

## Alcance y garantías

- Copia de estados, fechas, cantidades, responsables, notas e historial de eventos. No contiene fotografías ni archivos fuente. Para fotos usar Exportar JSON completo.
- Un archivo `backups/equipo-<UUID>.json` por navegador; las versiones anteriores se mantienen en commits. No borra archivos de otros equipos.
- Autoguardado después de cambios (2,5 segundos), al recuperar conexión, al volver a la app y comprobación de pendientes cada 45 segundos. La app necesita estar abierta; no se promete ejecutar con Chrome cerrado.
- Antes de escribir verifica que el destino siga siendo privado y el esperado. Envía JSON UTF-8 mediante árboles y commits de Git; no usa el endpoint de creación de blobs, imágenes ni Base64.
- Confirma únicamente al releer el archivo exacto. Cambios nuevos, falta de red y errores retiran la confirmación de copia actual. Reiniciar la app exige una nueva comprobación.
- Una vista vacía no reemplaza un archivo anterior del mismo equipo con registros faltantes. Recuperar registros incorpora UUID nuevos sin reemplazar los existentes ni eliminar fotos locales. La importación es un respaldo, no resolución colaborativa de versiones de vanos.
- Reintentos limitados con espera creciente; errores de autorización/privacidad detienen el automático. Revocación o vencimiento requieren reconectar. No se fuerza la rama y una colisión de commits solo se reintenta una vez.

## Configuración verificada del repositorio

Repositorio privado creado, main inicializado y carpeta backups preparada. No se publicaron documentos originales ni se transfirió la copia de recuperación del usuario: esa transferencia fue rechazada por revisión automática por falta de autorización específica del archivo y destino. El respaldo automático del dispositivo requiere completar la activación anterior y comprobar un guardado real.

Referencias: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens y https://docs.github.com/en/rest/git/trees y https://docs.github.com/en/rest/git/refs.
