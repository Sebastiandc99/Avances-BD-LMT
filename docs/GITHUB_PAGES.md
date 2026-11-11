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

El Resumen muestra **Días para finalizar** y **Fecha estimada de finalización**, para el proyecto completo (línea larga + corta). Días = redondeo hacia arriba de (vanos sin terminar / promedio de vanos por día con ejecución fechada). La fecha suma esos días a la fecha actual de Argentina. Se supone una jornada por día y continuidad del promedio; no se inventa proyección sin datos fechados. Si todos los vanos están terminados, se muestran 0 días y Finalizado.


## Apartados de la aplicación

- **Mapa:** plano, filtros de búsqueda/línea y controles para seleccionar vanos, editar fichas y cargar tramos completados. No muestra indicadores, rendimiento ni proyecciones.
- **Vanos:** listado para buscar y editar registros.
- **Resumen:** indicadores de avance, terminados/en proceso/pendientes, BD colocados/calculados, producción por fecha, rendimiento, días restantes, fecha estimada y exportación CSV. Siempre muestra el proyecto completo, sin porcentajes separados por línea. No incluye formularios ni instrucciones de carga del mapa.
- **Historial:** revisiones de los registros, sin tarjetas de indicadores ni formulario lateral de carga.

El cambio solo organiza la interfaz; conserva cantidades, fechas, guardado local, sincronización y la vista del mapa.


## Búsqueda y edición de avances completados

En Mapa, la lupa busca piquetes exactos (por ejemplo `192`, `P98`, `FP 3`). Si hay una sola coincidencia se centra y acerca el plano. Si un número existe en ambas líneas, se elige cuál enfocar. La búsqueda del mapa no lleva al listado. Un piquete encontrado se resalta y permite tocar los vanos cercanos.

Una ficha existente permite cambiar la fecha y pulsar **Guardar cambios**. En **Cargar o actualizar tramos → Actualizar fechas** se eligen los tramos y una fecha nueva; solo se actualizan vanos ya terminados, sin sumar vanos duplicados y conservando cantidades, fotos, notas y responsable. El rendimiento y la proyección usan la fecha corregida.

El Resumen usa siempre ambas líneas: porcentaje = terminados / 235 × 100. No divide el avance en porcentajes independientes de la línea larga y corta.

## Google Drive: conexión preparada, pendiente de activación

Se identificó la carpeta privada Doc Worley / App avances. Datos y respaldo incorpora **Sincronizar copia con Drive**, con destino fijo y archivo de respaldo por equipo. El botón requiere configurar OAuth web, API key pública de Picker y número de proyecto de Google, además de autorizar la cuenta. Ver `docs/GOOGLE_DRIVE.md`. Sin esa configuración, la interfaz lo informa como pendiente y no simula un guardado exitoso.


## Exportar Excel
Desde Vanos, Resumen o Datos y respaldo, pulsar Exportar Excel. Se descarga un XLSX con cuatro hojas: Resumen global, Rendimiento por fecha, Vanos (235 registros con fecha y cantidades) y Vista aérea.

La hoja Vista aérea contiene una imagen PNG amplia de 4400 × 3400 píxeles con las dos líneas completas, piquetes y estados, usando el fondo esquemático local. No consulta mapas online ni incluye los PDF/DWG originales.

Los resúmenes usan ambas líneas y los mismos registros vigentes que la aplicación. El rendimiento excluye vanos terminados sin fecha de ejecución válida. Incluye días restantes y fecha estimada de finalización. La exportación representa el momento de descarga; para incorporar nuevos datos o nuevas fechas, generar otro Excel desde la app.

La descarga se prepara en el navegador y funciona sin conexión una vez preparada la app y su fondo local. No modifica datos ni reemplaza el respaldo JSON de eventos y fotos.

La vista general incorpora un recuadro separado para Larga P208–P219 y la línea corta completa, para distinguir sus estados donde las trazas se superponen.


## Selección de vanos en el mapa
Arriba del plano hay dos botones: Selección simple y Selección múltiple.

- Simple: tocar un vano abre su ficha individual.
- Múltiple: tocar varios vanos los marca en azul; tocar uno ya marcado lo quita. Se pueden elegir vanos no contiguos y de ambas líneas. El contador avisa si el filtro oculta alguno de los seleccionados.
- Pulsar Editar seleccionados, revisar los vanos de la lista y elegir el estado y la fecha común. Para una carga histórica sin fecha, marcar Sin fecha de ejecución explícitamente.
- Guardar aplica los datos a todos en una sola transacción local, cierra la ventana, limpia las marcas y mantiene el zoom y la posición del mapa. Los eventos quedan pendientes de sincronizar cuando corresponda.

Cada vano conserva sus notas, fotos, responsable y cantidad real. Al pasar a Pendiente, su cantidad colocada queda en cero. Si existe un conflicto o algún vano cambió desde que se abrió la ventana, se bloquea todo el lote y se conserva la selección para revisarla.


## Gráfico de avance
En Resumen, la torta muestra terminados (verde), en proceso (amarillo) y pendientes (gris), con cantidades y porcentajes sobre los 235 vanos de ambas líneas. Incluye los terminados históricos sin fecha; el rendimiento conserva su criterio de usar solo fechas válidas.

El Excel descargado incorpora la misma torta como gráfico editable en la hoja Resumen, debajo de los indicadores y vinculado a sus tres celdas de estados. Los valores y colores coinciden con la app. La tabla mantiene los conteos y el porcentaje global; se evitan rótulos sobre sectores muy pequeños que se superpongan. Para incorporar cambios de la app, descargar un nuevo Excel.


## Consultar vanos montados por día
En Vanos, elegir una fecha en **Montados el día**. La tabla muestra únicamente los vanos actualmente terminados cuya fecha de ejecución coincide con ese día; no usa la fecha en que se guardó el registro. Las cargas históricas sin fecha quedan fuera de esta consulta.

El recuadro **Total del día (ambas líneas)** indica los vanos montados y los BD colocados, con el mismo criterio automático/real del Resumen. La búsqueda y el filtro de línea pueden reducir las filas visibles; el encabezado muestra cuántas se ven del total diario. Mientras hay una fecha elegida, el estado queda en Terminado. **Ver todas las fechas** recupera el listado y su filtro de estado anterior.

Las correcciones de fecha, cantidades o estado se reflejan según la última revisión vigente de cada vano. No se crean registros nuevos al consultar ni se cambia el Resumen global, el mapa o el Excel completo existente.


## Presentación del Excel
La exportación usa Arial de 11 puntos, títulos más grandes y bordes visibles. Resumen agrupa sus indicadores en bloques de color: alcance, avance, desviadores, rendimiento y proyección. Destaca el avance total, los BD colocados, los promedios y la fecha prevista, manteniendo las mismas fórmulas y referencias de la torta.

Vanos distingue las columnas de identificación, estado/fecha, cantidades y observaciones mediante sus encabezados. Las filas alternan fondo y el estado usa colores que reaccionan a su texto. Se conservan los encabezados y los identificadores visibles al desplazarse. Rendimiento comparte la tipografía y las filas alternadas. Para obtener la presentación nueva se debe descargar otro Excel desde la app.


## Comprobar la sincronización automática
El aviso Estado de guardado y sincronización permanece visible en todas las secciones. Tener Internet o guardar en el navegador no se presenta como una copia confirmada en la nube.

- **Sincronización automática desactivada:** todavía no se ingresó a una cuenta de esta app. Activar sincronización abre Datos y respaldo; crear cuenta, confirmar el correo e ingresar. La sesión de Chrome/Google no activa esta cuenta.
- **Pendientes / sin conexión / error / revisión:** los cambios necesitan completar la sincronización o resolver el problema indicado. Con la app abierta, se intenta después de guardar, al recuperar conexión, al volver a la app y cada 45 segundos.
- **Sincronización comprobada:** hubo una comprobación exitosa y no quedan registros pendientes ni conflictos. Un nuevo guardado pendiente retira esta confirmación hasta terminar la siguiente sincronización.

Cerrar Chrome no mantiene ejecutándose el sincronizador. En una ventana normal, los datos locales confirmados deben continuar al reabrir el mismo navegador/perfil y sitio; no confundir esto con una copia en la nube. En incógnito/invitado o un navegador temporal no se debe depender del almacenamiento local al cerrar la sesión. Google Drive sigue siendo un respaldo separado que necesita su configuración y una escritura verificada; no se presenta como automático ni activado sin confirmación.
