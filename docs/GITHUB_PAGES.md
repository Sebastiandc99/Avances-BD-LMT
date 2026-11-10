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

La fecha de finalización y el responsable son opcionales. Sin fecha de finalización, los nuevos terminados quedan sin fecha y fuera del rendimiento; no se usa la fecha de carga ni la fecha de una actividad previa en proceso. El responsable existente, las cantidades reales, notas y fotos se conservan. Cada terminado sin cantidad real informada suma automáticamente los BD calculados de su vano.

Al confirmar una ficha individual, el guardado local cierra la ficha y vuelve al plano. Tocar un vano en el mapa conserva el acercamiento y el desplazamiento; abrir/cerrar la ficha en el celular mantiene la escala y el centro. La vista también se conserva al alternar entre Mapa y las demás pestañas. Cambiar de línea o pulsar Ver traza completa ajusta la vista deliberadamente.


## Cómputo y rendimiento corregidos (10/11/2026)

El total calculado sigue siendo **1.743 BD**: 1.613 en la larga y 130 en la corta. Se recalcula cada vano con `floor((0,60 × longitud_en_planta + 0,0001) / 10) + 1`, la misma disposición simétrica con separación de 10 m en el 60 % central ya contrastada con el DWG y el procedimiento. Los extremos y el desarrollo real del OPGW siguen sujetos a validación en campo.

Al marcar un vano terminado, su cantidad calculada se contabiliza automáticamente cuando no hay una cantidad real mayor a cero. Si se informa una cantidad real, tiene prioridad; en un vano en proceso solo se suma la cantidad real informada. Listado, historial, resumen y CSV distinguen cantidades calculadas de las informadas. Los indicadores nuevos también se aplican a los registros existentes, sin reescribirlos ni necesitar volver a cargarlos.

El rendimiento es **vanos terminados con fecha / días distintos con ejecución registrada**, y también muestra BD/día para esos mismos vanos. Los terminados sin fecha cuentan en el avance y los BD, pero nunca en el rendimiento. El día del guardado es solo trazabilidad, no una fecha de ejecución. Agregar, corregir o quitar una fecha actualiza el cálculo; los vanos reabiertos se excluyen de la producción terminada.

El resumen separa terminados, en proceso y pendientes de iniciar. Faltan terminar = en proceso + pendientes. El inventario permanece en 237 piquetes y 235 vanos.


### Fecha estimada y días restantes

El Resumen muestra **Días para finalizar** y **Fecha estimada de finalización**, según la línea seleccionada o ambas líneas. Días = redondeo hacia arriba de (vanos sin terminar / promedio de vanos por día con ejecución fechada). La fecha suma esos días a la fecha actual de Argentina. Se supone una jornada por día y continuidad del promedio; no se inventa proyección sin datos fechados. Si todos los vanos están terminados, se muestran 0 días y Finalizado.


## Apartados de la aplicación

- **Mapa:** plano, filtros de búsqueda/línea y controles para seleccionar vanos, editar fichas y cargar tramos completados. No muestra indicadores, rendimiento ni proyecciones.
- **Vanos:** listado para buscar y editar registros.
- **Resumen:** indicadores de avance, terminados/en proceso/pendientes, BD colocados/calculados, producción por fecha, rendimiento, días restantes, fecha estimada y exportación CSV. El filtro de línea se aplica también a los indicadores. No incluye formularios ni instrucciones de carga del mapa.
- **Historial:** revisiones de los registros, sin tarjetas de indicadores ni formulario lateral de carga.

El cambio solo organiza la interfaz; conserva cantidades, fechas, guardado local, sincronización y la vista del mapa.
