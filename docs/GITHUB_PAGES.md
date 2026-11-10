# Versión de GitHub Pages

Esta versión reutiliza el formulario, el modelo, el mapa y IndexedDB de la aplicación existente. Se compila con `npm ci && npm run build:pages && npm run verify:pages`, con salida en `pages-dist/` y base `/Avances-BD-LMT/`.

Mantiene 237 piquetes, 235 vanos y 1.743 desviadores estimados, la fecha opcional, los tres estados y el esquema local. Los avances y las fotos se guardan en cada navegador. Exportar/importar JSON permite respaldarlos y transferirlos. GitHub Pages no ejecuta las API de D1/R2 ni el inicio de sesión de ChatGPT; esta versión no ofrece sincronización automática entre equipos.

La publicación de Sites continúa en https://avances-bd-lmt.sebastiandc99.chatgpt.site con sus servicios de nube. La migración no modifica ese despliegue ni borra sus registros. Los orígenes web tienen almacenamientos separados: para transferir registros, exportar JSON desde la versión anterior e importarlo en GitHub Pages.

## Activación

En Settings → Pages del repositorio, elegir GitHub Actions como fuente. Luego ejecutar el workflow `Publicar Avances BD LMT en Pages`. Si Pages todavía no está habilitado, el workflow compila y comprueba la aplicación, conserva el artefacto y omite el despliegue con una explicación.

El repositorio puede permanecer privado si el plan de GitHub permite Pages en repositorios privados. La web de Pages es pública en cuentas personales; esto es distinto de la privacidad del código. No cambiar la visibilidad del repositorio para solucionar un límite del plan sin autorización.

Dirección prevista después de un despliegue confirmado: https://sebastiandc99.github.io/Avances-BD-LMT/ . No presentarla como publicada antes de confirmar el despliegue.
