# Estado del proyecto Avances LMT

## 15/11/2026 - Cantidades definitivas y comprobaci�n de publicaci�n

- Cantidades por vano seg�n las planillas y la aclaraci�n del usuario: 1.728 desviadores en la l�nea larga y 143 en la corta; total 1.871. El vano FP17-FP18 incluye 16 unidades, sumando las 8 de la fila terminal FP18.
- Excel: eliminada la fila �Terminados con fecha v�lida� y agregado �Diverters totales� antes de terminados y pendientes.
- GitHub Pages: el commit 41154d7f774c53ca54cf488b474223d2bcbe1e20 est� publicado. GitHub Actions 43760712896 termin� correctamente tanto la compilaci�n y verificaci�n como el despliegue. Las verificaciones incluyen modelo, Excel, Power BI, TypeScript y compilaciones de GitHub Pages y Cloudflare.
- El paquete Avances_LMT_Cloudflare.zip fue comprobado: 235 vanos, total de 1.871, FP17-FP18 con 16, Excel actualizado y cach� v7-fp18-20261115. Se actualiz� tambi�n la copia local de Publicar-en-Cloudflare.
- Pendiente: publicar y comprobar esa revisi�n en Cloudflare. El sitio utiliza carga directa y no se actualiza autom�ticamente desde GitHub. En esta sesi�n no hay autorizaci�n de Wrangler y la conexi�n de control del navegador no funciona; la consulta HTTP del sitio devolvi� 403. No se afirma que la �ltima correcci�n est� desplegada en Cloudflare.

Las validaciones del commit publicado se comprobaron en GitHub Actions; no se repitieron pruebas sin cambios de c�digo.

## 15/11/2026 - Total de diverters y resumen de Excel

- Quitada la fila Terminados con fecha v�lida del Excel. Rendimiento y proyecci�n conservan su c�lculo con las referencias ajustadas.
- Diverters totales aparece encima de terminados y pendientes en Excel, Resumen de la app y Power BI Verde Feb2025 R5. La app y Power BI respetan los filtros seleccionados.
- Compilaci�n compartida para GitHub Pages y Cloudflare. La publicaci�n en la cuenta de Cloudflare contin�a pendiente de completar su acceso.

## 15/11/2026 - Cantidades reales de las planillas

- Tabla de cantidades por los 235 vanos, con 1.728 unidades en la larga y 143 en la corta, con total de 1.871. Extracci�n contrastada entre tablas y texto de los dos PDF.
- El usuario confirm� que las 8 unidades de la fila FP18 corresponden a FP17-FP18. Se suman a las 8 de la fila 17 y ese vano queda con 16. La aclaraci�n est� documentada en los metadatos.
- El Resumen muestra diverters terminados, pendientes y rendimiento diario. Las cantidades reales informadas en campo tienen prioridad. Los pendientes se suman por vano con m�nimo cero.
- Excel, CSV y Power BI usan las cantidades vigentes. Power BI Verde Feb2025 R3 incorpora los tres indicadores y conserva el informe heredado.
- Mapa con dif�cil acceso entre piquetes 40 y 63, correspondiente a 23 vanos.
- Cantidades compiladas y revisi�n de cach� para equipos que conservan el inventario anterior.

## 15/11/2026 - Carga, consulta diaria y resumen interactivo

- Carga simple y m�ltiple con cantidad de cuadrillas, responsable, notas, cantidades reales y fotos. Cada ficha precarga la fecha local vigente.
- Consulta diaria con vanos terminados y en proceso. El indicador Vanos de hoy incluye ambos estados y muestra su desglose.
- C�mara del mapa, filtros de Vanos y fecha guardados en sessionStorage por navegador. Mapa y Vanos tienen filtros de l�nea independientes.
- Resumen inspirado en Power BI verde, con Resumen, Producci�n, Por vano, Detalle, limpiar filtros, filtros por l�nea/estado/responsable/fechas y gr�ficos seleccionables.
- Cuadrillas opcionales en nube, respaldos JSON/GitHub, CSV, Excel y datos de Power BI. Restricci�n aplicada en Supabase mediante crew-count.sql.
- 86 pruebas aprobadas, TypeScript, formatos de publicaci�n y pipeline de GitHub verificados. En la app publicada se comprob� la c�mara al alternar apartados, la fecha de Vanos, el conteo de selecci�n y los campos de ambas fichas. Cloudflare queda preparado para carga directa, pendiente de acceso a su cuenta.

## 15/11/2026 - Acceso dif�cil entre piquetes 40 y 60

El mapa de la l�nea larga marca los 20 vanos comprendidos entre los piquetes 40 y 60 mediante bordes rojos discontinuos a ambos lados de la traza. La leyenda identifica los desniveles pronunciados. La compilaci�n de Cloudflare se distribuye para carga directa.

## 15/11/2026 - Acceso compartido de prueba

Quien abra el enlace puede consultar y editar la misma obra desde una sesi�n autom�tica. La configuraci�n est� activa en Supabase y funciona con la versi�n publicada en Cloudflare. El c�digo que todav�a aparece en el men� de la app es opcional. `supabase/shared-pilot.sql` registra el cambio aplicado despu�s de `device-pairing.sql`. Se probaron la lectura, la carga y la correcci�n entre dos identidades nuevas en una transacci�n revertida.

## 14/11/2026 - Cielo de obra

Se aplica el primer dise�o seleccionado por el usuario, con su fotograf�a de obra como cabecera y una paleta azul y blanca.

- Navegaci�n principal: Mapa, Vanos y Resumen. Acceso visible a Cargar avances y men� Exportar.
- Inicio en Vanos: tarjetas de total, terminados, en proceso y pendientes; filtros por estado, l�nea, piquete y fecha.
- La ficha aparece al seleccionar un vano. Los desviadores quedan como detalle opcional y mantienen su c�lculo.
- Se conservan mapa, selecci�n m�ltiple, carga por tramos, fechas, rendimiento, proyecci�n, historial y exportaciones.
- Las m�tricas superiores y el resumen corresponden al proyecto completo. Los filtros de la tabla permiten consultar cada l�nea.
- Sin cambios en los registros, las claves de almacenamiento o los permisos. Los avisos de guardado conservan su l�gica y reflejan el estado comprobado.
- La fotograf�a es un JPEG independiente y est� incluida en la cach� para uso sin conexi�n.

## Inventario y compatibilidad

- 237 piquetes y 235 vanos: 218 de la l�nea larga y 17 de la corta.
- Se mantiene la exportaci�n Power BI con informe heredado para Desktop 2.140.1454.0, febrero de 2025. Su apertura en esa versi�n exacta contin�a pendiente de comprobar en Power BI Desktop.

## Validaci�n

- 78 pruebas aprobadas, cero fallos.
- TypeScript, compilaci�n, rutas, inventario, presencia del JPEG y control de documentos privados aprobados.
- Revisi�n visual de escritorio y m�vil a 390 px aprobada, sin desbordamiento horizontal.
- Comprobados filtros de estado, b�squeda y fecha; edici�n y guardado; apertura de carga masiva; mapa y resumen; descarga Excel.
- Las pruebas de interfaz se realizaron con registros sint�ticos aislados. Los archivos de prueba y esos registros no forman parte de la publicaci�n.
- Publicado en GitHub Pages tras fusionar el PR #3. GitHub Actions 43604913938: build y deploy completados con �xito; 78 pruebas, tipos, formato Power BI y compilaci�n aprobados.
- Comprobaci�n visual de la app publicada: inicio en Vanos, navegaci�n simplificada y fotograf�a real cargada correctamente.

Este archivo resume el estado vigente. Las etapas anteriores se conservan en el historial de Git.


## 14/11/2026 - Power BI verde R2
- Corregido el identificador del gr�fico apilado: columnChart es el visual nativo; stackedColumnChart hac�a que Desktop solicitara un visual personalizado.
- Dise�o inspirado en las referencias del usuario: cabecera con foto, navegaci�n lateral, verdes, indicadores de vanos, evoluci�n diaria, matrices de estado y tabla de detalle. No se copian las m�tricas ni las actividades de las referencias.
- Se conservan las consultas de datos, las fechas, el c�lculo de rendimiento y el formato heredado para Desktop 2.140.1454.0. Los estados en proceso no reciben un porcentaje supuesto.
- Nueva descarga identificada como Verde_Feb2025_R2 e inclusi�n del JPEG como recurso independiente. El esquema de almacenamiento de la app no cambia.
- Las pruebas ahora verifican el identificador nativo del gr�fico, la distribuci�n de cada vano una sola vez en la matriz y la inclusi�n de la fotograf�a. La apertura final de los nuevos visuales debe comprobarse en Desktop.
- Validaci�n local aprobada: 81 pruebas, TypeScript, esquemas de metadatos, compilaci�n, rutas, inventario y comprobaci�n de documentos privados. PR #4 fusionado y publicado. GitHub Actions 43624614222: build y deploy completados con �xito. El bundle publicado contiene la revisi�n Verde_Feb2025_R2 y no contiene stackedColumnChart.


## 14/11/2026 - Cloudflare y resumen de Excel simplificado
- Preparada la misma app para Cloudflare Pages con rutas en la ra�z, manifiesto y service worker propios del destino. Se mantiene la publicaci�n de GitHub Pages y el backend existente de Supabase.
- Retiradas las nueve filas del resumen de Excel indicadas por el usuario. Conservados el detalle de los 235 vanos, las fechas y el rendimiento. F�rmulas, estilos y posici�n del gr�fico ajustados a la tabla m�s corta; el gr�fico mantiene datos auxiliares en columnas ocultas.
- Validaci�n local: 82 pruebas aprobadas, TypeScript, compilaciones y comprobaciones de recursos/rutas para GitHub Pages y Cloudflare, adem�s del control de documentos privados. La comprobaci�n mediante Excel instalado no pudo iniciarse por un error COM del sistema; no se presenta como una apertura real.
- Excel actualizado y publicado tras fusionar el PR #5. GitHub Actions 43654726335: 82 pruebas, ambos destinos compilados y verificados, y despliegue de GitHub Pages completados con �xito.
- Comprobado el bundle publicado con las nuevas referencias del gr�fico de Excel. Cloudflare publicado por carga directa en https://avances-lmt-seba.pages.dev/. Se comprobaron por HTTP el sitio, sus recursos, el manifiesto ra�z, el inventario, la foto y el service worker, junto con las revisiones actualizadas de Excel y Power BI. La publicaci�n de Cloudflare a�n no tiene despliegue autom�tico desde GitHub; ver docs/CLOUDFLARE.md.
