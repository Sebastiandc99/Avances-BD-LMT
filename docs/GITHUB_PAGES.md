# Versión de GitHub Pages

Esta versión reutiliza el formulario, el modelo, el mapa y IndexedDB de la aplicación existente. Se compila con `npm ci && npm run build:pages && npm run verify:pages`, con salida en `pages-dist/` y base `/Avances-BD-LMT/`.

Mantiene 237 piquetes, 235 vanos y 1.743 desviadores estimados, la fecha opcional, los tres estados y el esquema local. Los avances y las fotos se guardan en cada navegador. Exportar/importar JSON permite respaldarlos y transferirlos. GitHub Pages no ejecuta las API de D1/R2 ni el inicio de sesión de ChatGPT; esta versión no ofrece sincronización automática entre equipos.

La publicación de Sites continúa en https://avances-bd-lmt.sebastiandc99.chatgpt.site con sus servicios de nube. La migración no modifica ese despliegue ni borra sus registros. Los orígenes web tienen almacenamientos separados: para transferir registros, exportar JSON desde la versión anterior e importarlo en GitHub Pages.

## Activación

En Settings → Pages del repositorio, elegir GitHub Actions como fuente. Luego ejecutar el workflow `Publicar Avances BD LMT en Pages`. Si Pages todavía no está habilitado, el workflow compila y comprueba la aplicación, conserva el artefacto y omite el despliegue con una explicación.

El repositorio puede permanecer privado si el plan de GitHub permite Pages en repositorios privados. La web de Pages es pública en cuentas personales; esto es distinto de la privacidad del código. No cambiar la visibilidad del repositorio para solucionar un límite del plan sin autorización.

Dirección prevista después de un despliegue confirmado: https://sebastiandc99.github.io/Avances-BD-LMT/ . No presentarla como publicada antes de confirmar el despliegue.


## Sincronización privada (10/11/2026)

En **Datos y respaldo → Nube privada**, crear una cuenta con correo y contraseña, confirmar el correo e ingresar. También se puede pegar el enlace de confirmación del correo dentro de la app. Usar la misma cuenta en todos los dispositivos. La primera vinculación incorpora los registros locales ya confirmados, sin perder sus fotos.

El guardado se confirma primero en IndexedDB, aun sin conexión. Con la app abierta, se sincroniza al recuperar señal, al confirmar un avance y cada 45 segundos. El navegador cerrado no garantiza subidas en segundo plano. Esperar **Sincronizado** antes de borrar los datos de Chrome o cambiar de teléfono. Si hay dos versiones del mismo vano, se conservan y se elige una en Datos y respaldo.

Los eventos y las fotos usan el proyecto Supabase independiente `ynhvceqjhcydsteyzrpt`: acceso por cuenta con RLS, bucket privado y clave de frontend publicable. No hay claves administrativas en el cliente. El repositorio contiene únicamente la configuración pública y el esquema reproducible `supabase/lmt-sync.sql`; no contiene los avances ni las fotos de cada cuenta.

Los PDF/DWG originales no están incluidos ni son recursos de la app. El inventario derivado sigue público y mantiene 237 piquetes, 235 vanos y 1.743 BD estimados. Exportar JSON sigue disponible como respaldo adicional.

## Cargar avances anteriores por tramos

Pulsar **Cargar vanos completados**. Elegir la línea, el piquete inicial y el final; por ejemplo 1 a 18 corresponde a los 17 vanos entre esos piquetes. **Agregar otro tramo** permite cargar sectores separados o ambas líneas a la vez. Revisar el conteo y confirmar. Los vanos ya terminados y los que requieren resolver un conflicto se omiten; no se duplican rangos superpuestos.

La fecha de finalización y el responsable son opcionales. Si no se indican, se conservan los valores existentes. Un registro sin fecha usa el día de carga para el resumen diario, por lo que conviene indicar la fecha real si se conoce. Se conservan BD reales, notas y fotos; las cantidades previstas no se convierten en cantidades instaladas.

Al confirmar una ficha individual, el guardado local cierra la ficha y vuelve al plano. Tocar un vano en el mapa conserva el acercamiento y el desplazamiento; abrir/cerrar la ficha en el celular mantiene la escala y el centro. La vista también se conserva al alternar entre Mapa y las demás pestañas. Cambiar de línea o pulsar Ver traza completa ajusta la vista deliberadamente.
