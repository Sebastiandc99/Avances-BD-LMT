# Estado del proyecto Avances LMT

## 16/11/2026 — Recuperación de pantalla en blanco

- La dirección de Cloudflare abrió y sincronizó los avances en un navegador nuevo. La pantalla en blanco informada por el usuario no se reprodujo en ese equipo.
- Agregada una recuperación independiente de los archivos compilados. Comprueba la publicación antes de restablecer exclusivamente la copia de la pantalla. Conserva IndexedDB, fotos, avances y la sesión local.
- El arranque muestra un mensaje y acceso a recuperación si falla la descarga. Un error al dibujar la app también muestra ese acceso.
- La actualización conserva una versión anterior de los archivos para completar cargas ya iniciadas.

## 16/11/2026 — Reapertura sin conexión

- GitHub Pages y el paquete de Cloudflare instalan juntos la pantalla inicial, los archivos de la aplicación, el inventario y el fondo del mapa. La versión anterior sigue disponible mientras se descarga una actualización.
- La app recupera la obra vinculada al dispositivo incluso si arranca con la sesión de nube pendiente. El botón de cabecera dice «Cargar avances manualmente».
- Se comprobó la reapertura del paquete de Cloudflare en una pestaña nueva con el servidor apagado, con el inventario de 235 vanos, el mapa y el formulario de carga. La prueba de reinicio usa perfiles de Chrome temporales y bloquea la conexión con la nube.
- En GitHub Actions 43864757516, ambas versiones pasaron dos reinicios completos de Chrome sin red. El vano de prueba guardado después del primer reinicio conservó el estado terminado en el segundo. También se verificaron el mapa y los 235 vanos.
- GitHub Pages publicado en 9eac747f13973f78326d6c775aa75de453fbb3e1. Se comprobó el botón actualizado en la web. Avances_LMT_Cloudflare.zip actualizado a la versión 10. La carga al proyecto de Cloudflare sigue pendiente de una sesión autorizada.

## 16/11/2026 — Indicadores en Resumen

- Movido el encabezado de tarjetas a Resumen. Las secciones de carga, incluido Mapa, dejan de mostrarlo.
- Siete indicadores del proyecto completo: Total de vanos, Vanos terminados, Vanos en proceso, Vanos pendientes, Vanos de hoy, Bird diverters totales y Bird diverters instalados.
- Vanos de hoy conserva el criterio vigente: terminados y en proceso con fecha de actividad de hoy. Los Bird diverters instalados incluyen los conteos informados en campo y las cantidades de planilla que corresponden a los vanos terminados sin conteo informado.
- Se conserva el diseño de las tarjetas, la torta, la proyección y el gráfico de rendimiento diario. La tarjeta de hoy ocupa una fila completa en celular; los dos indicadores de Bird Diverters quedan juntos.
- Validación: TypeScript y 22 pruebas de modelo, detalle diario y torta aprobadas. Compilaciones y verificaciones de GitHub Pages y Cloudflare aprobadas. Revisión visual del encabezado completo en escritorio y a 390 px, sin desbordamiento horizontal; comprobada su ausencia en Mapa.
- Las pruebas de interfaz utilizaron registros sintéticos de un equipo aislado. No forman parte del paquete publicado ni se enviaron a Supabase.
- Caché actualizada a v10-indicadores-resumen-20261116.
- Publicado en GitHub Pages con el commit 1c0f658703b49a220e5b82810b66617c5512ffce. GitHub Actions 43836304033 completó compilación y despliegue correctamente; se comprobó el encabezado de siete indicadores en la app publicada y sincronizada.
- Avances_LMT_Cloudflare.zip actualizado a la misma revisión y verificado. La publicación en la cuenta de Cloudflare sigue mediante carga manual: no hay una sesión autorizada de Wrangler en este entorno.

## 15/11/2026 — Resumen anterior con gráfico diario

- Restaurada la presentación de Resumen anterior al informe con aspecto de Power BI: torta de avance, promedio diario, días restantes y fecha estimada, en una vista única con el estilo azul de la aplicación.
- Conservado el gráfico de líneas de vanos terminados por día. Al tocar una fecha muestra los vanos de ese día y permite abrir sus fichas. Los indicadores corresponden siempre al proyecto completo.
- Se mantienen las cantidades corregidas de 1.871 desviadores y el detalle de totales, terminados, pendientes y rendimiento. El rendimiento continúa excluyendo terminados sin fecha.
- Validación local: TypeScript y 22 pruebas de modelo, producción diaria y torta aprobadas. Revisión visual en escritorio y a 390 px, sin desbordamiento horizontal; comprobados el detalle de una fecha, apertura de un vano y estado sin carga, con datos sintéticos aislados.
- Caché actualizada a v9-resumen-clasico-20261115 para recibir la revisión sin conexión. La compilación compartida actualiza GitHub Pages y el paquete de Cloudflare.
- GitHub Pages publicado: commit e34d5094e62e5dc8e283cec51618f91ec990b677 y GitHub Actions 43777573021 correctos. El ZIP Cloudflare actualizado está disponible; su carga directa no se completó porque la extensión de Chrome requiere acceso a URL de archivos. La alternativa con el selector del equipo tampoco pudo abrirse porque la ventana permanecía minimizada.

## 15/11/2026 — Acceso difícil en la vista aérea del Excel

- La imagen exportada identifica los piquetes 40 a 63 de la línea larga con dos bordes rojos discontinuos, círculos y números rojos, siguiendo el tramo marcado en el mapa de la aplicación. Los colores del estado de cada vano siguen visibles.
- La hoja Vista aérea y la imagen incluyen la leyenda «Difícil acceso por desniveles pronunciados». Resumen, Rendimiento y Vanos conservan sus datos, fórmulas, formatos y gráficos.
- Validación local: seis pruebas de Excel y TypeScript aprobados. Se generó la imagen con el exportador real y se comprobó visualmente el tramo y su leyenda, además de verificar que el XLSX incluye exactamente esa imagen y mantiene las cuatro hojas. Compilación y verificación de GitHub Pages y Cloudflare aprobadas.
- Publicado en GitHub Pages: commit ab8ad187d427482799ff807fdd394dab29e4571f y GitHub Actions 43774484555, con compilación y despliegue correctos. Paquete Cloudflare actualizado y comprobado.
- Se actualiza la caché sin conexión para que los equipos reciban el nuevo exportador. La publicación directa en Cloudflare sigue dependiendo de subir el paquete actualizado; no hay sesión de publicación conectada.

## 15/11/2026 — Cantidades definitivas y comprobación de publicación

- Cantidades por vano según las planillas y la aclaración del usuario: 1.728 desviadores en la línea larga y 143 en la corta; total 1.871. El vano FP17–FP18 incluye 16 unidades, sumando las 8 de la fila terminal FP18.
- Excel: eliminada la fila «Terminados con fecha válida» y agregado «Diverters totales» antes de terminados y pendientes.
- GitHub Pages: el commit 41154d7f774c53ca54cf488b474223d2bcbe1e20 está publicado. GitHub Actions 43760712896 terminó correctamente tanto la compilación y verificación como el despliegue. Las verificaciones incluyen modelo, Excel, Power BI, TypeScript y compilaciones de GitHub Pages y Cloudflare.
- El paquete Avances_LMT_Cloudflare.zip fue comprobado: 235 vanos, total de 1.871, FP17–FP18 con 16, Excel actualizado y caché v7-fp18-20261115. Se actualizó también la copia local de Publicar-en-Cloudflare.
- Pendiente: publicar y comprobar esa revisión en Cloudflare. El sitio utiliza carga directa y no se actualiza automáticamente desde GitHub. En esta sesión no hay autorización de Wrangler y la conexión de control del navegador no funciona; la consulta HTTP del sitio devolvió 403. No se afirma que la última corrección esté desplegada en Cloudflare.

Las validaciones del commit publicado se comprobaron en GitHub Actions; no se repitieron pruebas sin cambios de código.

## 15/11/2026 — Total de diverters y resumen de Excel

- Quitada la fila Terminados con fecha válida del Excel. Rendimiento y proyección conservan su cálculo con las referencias ajustadas.
- Diverters totales aparece encima de terminados y pendientes en Excel, Resumen de la app y Power BI Verde Feb2025 R5. La app y Power BI respetan los filtros seleccionados.
- Compilación compartida para GitHub Pages y Cloudflare. La publicación en la cuenta de Cloudflare continúa pendiente de completar su acceso.

## 15/11/2026 — Cantidades reales de las planillas

- Tabla de cantidades por los 235 vanos, con 1.728 unidades en la larga y 143 en la corta, con total de 1.871. Extracción contrastada entre tablas y texto de los dos PDF.
- El usuario confirmó que las 8 unidades de la fila FP18 corresponden a FP17-FP18. Se suman a las 8 de la fila 17 y ese vano queda con 16. La aclaración está documentada en los metadatos.
- El Resumen muestra diverters terminados, pendientes y rendimiento diario. Las cantidades reales informadas en campo tienen prioridad. Los pendientes se suman por vano con mínimo cero.
- Excel, CSV y Power BI usan las cantidades vigentes. Power BI Verde Feb2025 R3 incorpora los tres indicadores y conserva el informe heredado.
- Mapa con difícil acceso entre piquetes 40 y 63, correspondiente a 23 vanos.
- Cantidades compiladas y revisión de caché para equipos que conservan el inventario anterior.

## 15/11/2026 — Carga, consulta diaria y resumen interactivo

- Carga simple y múltiple con cantidad de cuadrillas, responsable, notas, cantidades reales y fotos. Cada ficha precarga la fecha local vigente.
- Consulta diaria con vanos terminados y en proceso. El indicador Vanos de hoy incluye ambos estados y muestra su desglose.
- Cámara del mapa, filtros de Vanos y fecha guardados en sessionStorage por navegador. Mapa y Vanos tienen filtros de línea independientes.
- Resumen inspirado en Power BI verde, con Resumen, Producción, Por vano, Detalle, limpiar filtros, filtros por línea/estado/responsable/fechas y gráficos seleccionables.
- Cuadrillas opcionales en nube, respaldos JSON/GitHub, CSV, Excel y datos de Power BI. Restricción aplicada en Supabase mediante crew-count.sql.
- 86 pruebas aprobadas, TypeScript, formatos de publicación y pipeline de GitHub verificados. En la app publicada se comprobó la cámara al alternar apartados, la fecha de Vanos, el conteo de selección y los campos de ambas fichas. Cloudflare queda preparado para carga directa, pendiente de acceso a su cuenta.

## 15/11/2026 — Acceso difícil entre piquetes 40 y 60

El mapa de la línea larga marca los 20 vanos comprendidos entre los piquetes 40 y 60 mediante bordes rojos discontinuos a ambos lados de la traza. La leyenda identifica los desniveles pronunciados. La compilación de Cloudflare se distribuye para carga directa.

## 15/11/2026 — Acceso compartido de prueba

Quien abra el enlace puede consultar y editar la misma obra desde una sesión automática. La configuración está activa en Supabase y funciona con la versión publicada en Cloudflare. El código que todavía aparece en el menú de la app es opcional. `supabase/shared-pilot.sql` registra el cambio aplicado después de `device-pairing.sql`. Se probaron la lectura, la carga y la corrección entre dos identidades nuevas en una transacción revertida.

## 14/11/2026 — Cielo de obra

Se aplica el primer diseño seleccionado por el usuario, con su fotografía de obra como cabecera y una paleta azul y blanca.

- Navegación principal: Mapa, Vanos y Resumen. Acceso visible a Cargar avances y menú Exportar.
- Inicio en Vanos: tarjetas de total, terminados, en proceso y pendientes; filtros por estado, línea, piquete y fecha.
- La ficha aparece al seleccionar un vano. Los desviadores quedan como detalle opcional y mantienen su cálculo.
- Se conservan mapa, selección múltiple, carga por tramos, fechas, rendimiento, proyección, historial y exportaciones.
- Las métricas superiores y el resumen corresponden al proyecto completo. Los filtros de la tabla permiten consultar cada línea.
- Sin cambios en los registros, las claves de almacenamiento o los permisos. Los avisos de guardado conservan su lógica y reflejan el estado comprobado.
- La fotografía es un JPEG independiente y está incluida en la caché para uso sin conexión.

## Inventario y compatibilidad

- 237 piquetes y 235 vanos: 218 de la línea larga y 17 de la corta.
- Se mantiene la exportación Power BI con informe heredado para Desktop 2.140.1454.0, febrero de 2025. Su apertura en esa versión exacta continúa pendiente de comprobar en Power BI Desktop.

## Validación

- 78 pruebas aprobadas, cero fallos.
- TypeScript, compilación, rutas, inventario, presencia del JPEG y control de documentos privados aprobados.
- Revisión visual de escritorio y móvil a 390 px aprobada, sin desbordamiento horizontal.
- Comprobados filtros de estado, búsqueda y fecha; edición y guardado; apertura de carga masiva; mapa y resumen; descarga Excel.
- Las pruebas de interfaz se realizaron con registros sintéticos aislados. Los archivos de prueba y esos registros no forman parte de la publicación.
- Publicado en GitHub Pages tras fusionar el PR #3. GitHub Actions 43604913938: build y deploy completados con éxito; 78 pruebas, tipos, formato Power BI y compilación aprobados.
- Comprobación visual de la app publicada: inicio en Vanos, navegación simplificada y fotografía real cargada correctamente.

Este archivo resume el estado vigente. Las etapas anteriores se conservan en el historial de Git.


## 14/11/2026 — Power BI verde R2
- Corregido el identificador del gráfico apilado: columnChart es el visual nativo; stackedColumnChart hacía que Desktop solicitara un visual personalizado.
- Diseño inspirado en las referencias del usuario: cabecera con foto, navegación lateral, verdes, indicadores de vanos, evolución diaria, matrices de estado y tabla de detalle. No se copian las métricas ni las actividades de las referencias.
- Se conservan las consultas de datos, las fechas, el cálculo de rendimiento y el formato heredado para Desktop 2.140.1454.0. Los estados en proceso no reciben un porcentaje supuesto.
- Nueva descarga identificada como Verde_Feb2025_R2 e inclusión del JPEG como recurso independiente. El esquema de almacenamiento de la app no cambia.
- Las pruebas ahora verifican el identificador nativo del gráfico, la distribución de cada vano una sola vez en la matriz y la inclusión de la fotografía. La apertura final de los nuevos visuales debe comprobarse en Desktop.
- Validación local aprobada: 81 pruebas, TypeScript, esquemas de metadatos, compilación, rutas, inventario y comprobación de documentos privados. PR #4 fusionado y publicado. GitHub Actions 43624614222: build y deploy completados con éxito. El bundle publicado contiene la revisión Verde_Feb2025_R2 y no contiene stackedColumnChart.


## 14/11/2026 — Cloudflare y resumen de Excel simplificado
- Preparada la misma app para Cloudflare Pages con rutas en la raíz, manifiesto y service worker propios del destino. Se mantiene la publicación de GitHub Pages y el backend existente de Supabase.
- Retiradas las nueve filas del resumen de Excel indicadas por el usuario. Conservados el detalle de los 235 vanos, las fechas y el rendimiento. Fórmulas, estilos y posición del gráfico ajustados a la tabla más corta; el gráfico mantiene datos auxiliares en columnas ocultas.
- Validación local: 82 pruebas aprobadas, TypeScript, compilaciones y comprobaciones de recursos/rutas para GitHub Pages y Cloudflare, además del control de documentos privados. La comprobación mediante Excel instalado no pudo iniciarse por un error COM del sistema; no se presenta como una apertura real.
- Excel actualizado y publicado tras fusionar el PR #5. GitHub Actions 43654726335: 82 pruebas, ambos destinos compilados y verificados, y despliegue de GitHub Pages completados con éxito.
- Comprobado el bundle publicado con las nuevas referencias del gráfico de Excel. Cloudflare publicado por carga directa en https://avances-lmt-seba.pages.dev/. Se comprobaron por HTTP el sitio, sus recursos, el manifiesto raíz, el inventario, la foto y el service worker, junto con las revisiones actualizadas de Excel y Power BI. La publicación de Cloudflare aún no tiene despliegue automático desde GitHub; ver docs/CLOUDFLARE.md.
