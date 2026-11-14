# Estado del proyecto Avances LMT

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
