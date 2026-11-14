# Power BI Desktop de febrero de 2025

La descarga predeterminada está dirigida a **2.140.1454.0 de 64 bits**. Se conserva el informe visual de tres páginas, con filtros y navegación, usando el formato heredado de informe y las tarjetas clásicas.

## Cómo abrirlo

1. Descargar nuevamente Power BI desde la app. El ZIP lleva `PowerBI_Feb2025` en el nombre para distinguirlo de descargas anteriores.
2. Extraer todo el ZIP y abrir `Avances_BD_LMT.pbip`.
3. Si Desktop lo solicita, habilitar **Power BI Project (.pbip) save option** en las características de versión preliminar y reiniciar. No se requiere PBIR mejorado.
4. Pulsar **Inicio → Actualizar** para cargar las tablas incorporadas. Los botones usan **Ctrl + clic** en modo edición.
5. Guardar como `.pbix` desde esa misma versión una vez cargadas las tablas.

## Formato y validación

- El metadato `definition.pbir` usa versión **1.0** y referencia al modelo por ruta relativa. Ese nombre de archivo también se utiliza en el formato heredado; no significa que el diseño sea PBIR mejorado.
- El diseño completo está en `Avances.Report/report.json`. No se incluye `Avances.Report/definition/` ni archivos `visual.json`.
- Se serializan `config`, `layouts`, `singleVisual`, `projections` y `prototypeQuery`, con alias `Source` que resuelven las tablas y medidas.
- Se usa la tarjeta clásica `card`, con rol `Values` y objetos `labels` / `categoryLabels`. Se omiten `cardVisual` y sus opciones nuevas.
- El modelo se mantiene en `model.bim`, formato TMSL con metadato 1.0. La copia de datos está incorporada en las consultas M; no contiene credenciales ni depende de una conexión de Desktop a la nube.
- Las pruebas comprueban la estructura real del ZIP, las referencias del modelo, las tarjetas, los destinos de navegación, los filtros y la geometría. Se validan los metadatos con esquemas oficiales. Microsoft no publica un esquema del diseño heredado equivalente al de PBIR mejorado; sus comprobaciones estructurales no sustituyen una apertura real en Desktop.
- La versión exacta de Desktop de febrero de 2025 no está disponible en este entorno. La apertura y el renderizado final quedan pendientes de comprobar en ese programa.

## Referencias

- [Microsoft: carpeta de informes de proyectos y formato heredado](https://learn.microsoft.com/power-bi/developer/projects/projects-report).
- [Microsoft: proyectos PBIP](https://learn.microsoft.com/power-bi/developer/projects/projects-overview).
- La estructura heredada, el rol de la tarjeta y los tipos numéricos de recursos se contrastaron con el archivo público de Microsoft `Sample Reports/Sales & Returns Sample v201912.pbix` del repositorio [powerbi-desktop-samples](https://github.com/microsoft/powerbi-desktop-samples/tree/91149877e14ddc9098e75c6c12b099b619658647), en una revisión anterior a febrero de 2025. No se incorporaron el archivo ni sus datos al repositorio.
