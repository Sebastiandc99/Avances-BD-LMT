# Power BI Desktop de febrero de 2025

La descarga predeterminada está dirigida a **2.140.1454.0 de 64 bits**. Se conserva el informe visual de cuatro páginas, con filtros y navegación, usando el formato heredado de informe y las tarjetas clásicas.

## Cómo abrirlo

1. Descargar nuevamente Power BI desde la app. El ZIP lleva `PowerBI_Verde_Feb2025_R2` en el nombre para distinguirlo de descargas anteriores.
2. Extraer todo el ZIP y abrir `Avances_BD_LMT.pbip`.
3. Si Desktop lo solicita, habilitar **Power BI Project (.pbip) save option** en las características de versión preliminar y reiniciar. No se requiere PBIR mejorado.
4. Pulsar **Inicio → Actualizar** para cargar las tablas incorporadas. Los botones usan **Ctrl + clic** en modo edición.
5. Guardar como `.pbix` desde esa misma versión una vez cargadas las tablas.

## Diseño verde de obra y corrección del gráfico

- El gráfico apilado usa el identificador nativo `columnChart`. `stackedColumnChart` no es un identificador válido de este visual y provocaba la solicitud de instalar un visual personalizado. No faltaban los datos.
- Solo se utilizan visuales nativos verificados con el ejemplo público de Microsoft anterior a febrero de 2025: tarjetas, anillo, columnas, línea, tablas, matrices, imágenes y botones.
- Resumen: foto de obra, indicadores de vanos, estados, comparación por línea y evolución diaria.
- Producción: vanos con fecha, promedio diario, días registrados, terminados sin fecha y detalle por día. La proyección usa días calendario al ritmo de los días con producción.
- Por vano: matrices de seis columnas con estado, color y nombre de cada vano; la línea larga tiene desplazamiento interno y la corta una sección propia. No se inventa un porcentaje para los vanos en proceso.
- Detalle: tabla de vanos con fecha, longitud, responsable, cantidades y observaciones.
- La foto se incluye como recurso JPEG independiente; no se codifica en un texto ni requiere una URL externa al abrir el informe.
- Los colores mantienen el mismo significado: verde terminado, ámbar en proceso y gris pendiente. La navegación lateral y los filtros se mantienen en las cuatro páginas.

## Formato y validación

- El metadato `definition.pbir` usa versión **1.0** y referencia al modelo por ruta relativa. Ese nombre de archivo también se utiliza en el formato heredado; no significa que el diseño sea PBIR mejorado.
- El diseño completo está en `Avances.Report/report.json`. No se incluye `Avances.Report/definition/` ni archivos `visual.json`.
- Se serializan `config`, `layouts`, `singleVisual`, `projections` y `prototypeQuery`, con alias `Source` que resuelven las tablas y medidas.
- Se usa la tarjeta clásica `card`, con rol `Values` y objetos `labels` / `categoryLabels`. Se omiten `cardVisual` y sus opciones nuevas.
- El modelo se mantiene en `model.bim`, formato TMSL con metadato 1.0. La copia de datos está incorporada en las consultas M; no contiene credenciales ni depende de una conexión de Desktop a la nube.
- Las pruebas comprueban la estructura real del ZIP, las referencias del modelo, los identificadores nativos, las tarjetas, los destinos de navegación, los filtros, la unicidad de la matriz, la fotografía y la geometría. Se validan los metadatos con esquemas oficiales. Microsoft no publica un esquema del diseño heredado equivalente al de PBIR mejorado; sus comprobaciones estructurales no sustituyen una apertura real en Desktop.
- La versión exacta de Desktop de febrero de 2025 no está disponible en este entorno. La apertura y el renderizado final quedan pendientes de comprobar en ese programa.

## Referencias

- [Microsoft: carpeta de informes de proyectos y formato heredado](https://learn.microsoft.com/power-bi/developer/projects/projects-report).
- [Microsoft: proyectos PBIP](https://learn.microsoft.com/power-bi/developer/projects/projects-overview).
- La estructura heredada, el rol de la tarjeta y los tipos numéricos de recursos se contrastaron con el archivo público de Microsoft `Sample Reports/Sales & Returns Sample v201912.pbix` del repositorio [powerbi-desktop-samples](https://github.com/microsoft/powerbi-desktop-samples/tree/91149877e14ddc9098e75c6c12b099b619658647), en una revisión anterior a febrero de 2025. No se incorporaron el archivo ni sus datos al repositorio.
