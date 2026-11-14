# Publicación de Avances LMT en Cloudflare Pages

Se publica la misma app estática y se conserva el guardado existente en Supabase. GitHub Pages continúa disponible. No se trasladan ni se incrustan registros operativos en los archivos publicados.

## Compilar y verificar

- npm run build:cloudflare genera cloudflare-dist con rutas desde la raíz, manifiesto y service worker locales.
- npm run verify:cloudflare verifica rutas, recursos, foto, inventario y alcance de la aplicación.
- npm run deploy:cloudflare vuelve a compilar, verifica y sube la carpeta a Cloudflare Pages.
- Configuración explícita: wrangler.pages.jsonc. No utiliza el Worker de servidor ni sus enlaces de base de datos.
- Nombre previsto del proyecto: avances-lmt-seba. El enlace efectivo se registra tras una publicación comprobada.

## Cuenta y acceso

Wrangler requiere la autorización de la cuenta de Cloudflare mediante su flujo OAuth oficial. Para esta publicación se solicitan account:read, user:read y pages:write. No se guardan credenciales en el repositorio.

Un dominio nuevo tiene almacenamiento de navegador independiente. Si este navegador aún no comparte los avances, abrir Datos y respaldo y usar Vincular este equipo con un código del dispositivo que conserva los registros. El guardado y la vinculación existentes de Supabase se mantienen.

La publicación no convierte la exportación de Power BI en una conexión en vivo. Se conserva su comportamiento actual. La conexión directa de Desktop a Supabase es una configuración distinta.

## Estado

Preparación de Cloudflare y comprobación de publicación en curso.
