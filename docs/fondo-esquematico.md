# Fondo esquemático

Recurso local independiente: `public/assets/fondo-esquematico.svg`. SVG de texto plano, sin raster, Base64, llamadas externas ni mapas online. Usa el mismo marco de imagen de 4000 × 4442 del inventario para conservar la geometría validada de la LMT.

La Ruta Nacional 51, el borde del salar, el relieve y los sectores de instalaciones se simplificaron visualmente a partir del plano aportado. Son referencias aproximadas, no una cartografía topográfica ni coordenadas nuevas. Los caminos secundarios son accesos esquemáticos. Piquetes y vanos se renderizan por separado, con las coordenadas existentes del DWG sin modificación.

El Service Worker guarda este archivo para el uso sin conexión. Se puede sustituir el fondo conservando el mismo marco. No ejecutar operaciones de imagen codificada ni `create_blob`.
