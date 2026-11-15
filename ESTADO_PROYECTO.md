# Estado del proyecto Avances LMT

## 15/11/2026 — Total de diverters y resumen de Excel

- Quitada la fila Terminados con fecha válida del Excel. Rendimiento y proyección conservan su cálculo con las referencias ajustadas.
- Diverters totales aparece encima de terminados y pendientes en Excel, Resumen de la app y Power BI Verde Feb2025 R4. La app y Power BI respetan los filtros seleccionados.
- Compilación compartida para GitHub Pages y Cloudflare. La publicación en la cuenta de Cloudflare continúa pendiente de completar su acceso.

## 15/11/2026 — Cantidades reales de las planillas

- Tabla de cantidades por los 235 vanos, con 1.728 unidades en la larga y 135 en la corta. Extracción contrastada entre tablas y texto de los dos PDF.
- La fila del piquete terminal FP 18 tiene 8 unidades con vano adelante vacío. Se consideran los 17 vanos existentes de esa línea y se documenta la fila terminal en los metadatos.
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
