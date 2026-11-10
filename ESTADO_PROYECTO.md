# Avances BD LMT — Estado del proyecto

Actualizado: 09/11/2026 (Argentina).

## Objetivo vigente
Aplicación sencilla y offline para dos líneas. Avance y rendimiento medidos por VANOS. Estados Pendiente, En proceso y Terminado. Fecha opcional. Selección azul, táctil ampliada, zoom y desplazamiento. Diverters como indicador secundario. Fondo esquemático derivado de la imagen suministrada, sin mapas online.

## Respaldo y fuentes
- Repositorio privado: Sebastiandc99/Avances-BD-LMT, main. Al comenzar solo contenía README.md.
- Copia local recuperada: Avances-BD-LMT/.sites-checkout (commit b6d52b0). No eliminar antes de terminar el respaldo.
- DWG local: revision_lmt/Layout Traza LMT33kV rev2.dwg. SHA256 ef80e9b3d71a5d3f613364347a18288a23900c21ef3d79e20c67086cc3bcc97c.
- PDF local: revision_lmt/Traza LMT.pdf. SHA256 8d668aabea9d584bed83125b821123d2e2317063204bc53c701983869dd95f34.
- Procedimiento disponible: L0002-4111-Q-WIT-00047_0, PDF de 22 páginas. Página PDF 8: cobertura del 20 al 80 % del vano, separación de 10 m, alternancia de colores, referencia de 7 a 8 unidades para vano promedio.

## Hallazgos iniciales (pendiente de reproducción independiente)
El inventario recuperado documenta 219 + 18 piquetes, 218 + 17 vanos y 1.743 BD propuestos (1.613 + 130). Su hash de DWG coincide con el archivo local. Incluye coordenadas, IDs y calibración al raster embebido en el PDF. Verificar geometría y conectividad antes de cargar en la nueva aplicación.

## Cambios necesarios
La versión previa exige fecha y mide rendimiento por cantidades instaladas de BD. Ambos criterios deben cambiar. No incorporar avances ficticios.

## Etapas
1. Reproducir conteos y distancias; revisar alineación y criterio BD. Informar diagnóstico antes de programar.
2. Guardar inventario validado, análisis y respaldo de la fuente previa en GitHub.
3. Implementar experiencia sencilla, almacenamiento local y fondo esquemático.
4. Verificar guardado sin fecha, métricas, selección táctil y uso offline.
5. Publicar conservando acceso privado y registrar URL y límites.

## Próximo paso
Recuperar y guardar el código ejecutable antes de cambiar funcionalidades o preparar fondos. La verificación de fuentes ya está guardada en `docs/verificacion-fuentes.json`; no repetir el análisis de DWG/PDF.

## Recuperación del 09/11/2026 — etapa 1
- Revisados los cinco archivos de main y sus tres commits: `c27c527`, `1cdfc73`, `ef38923`. Main contenía documentación y datos; no contenía código ejecutable.
- Confirmado con GitHub: repositorio privado, rama main.
- Encontrada la copia `Avances-BD-LMT/.sites-checkout` en `b6d52b0`, con fuente publicada original `f8cea7a`. Se conserva intacta, incluidos sus archivos pendientes de otra sesión.
- Recuperados 128 archivos de texto de esa referencia en `Avances-BD-LMT/github-recovery`. Conservados los cinco archivos remotos como base; no se sobrescribe el inventario validado ni la calibración.
- En esta etapa se respaldan el núcleo de la aplicación, modelo, API, base de datos y pruebas. La siguiente incorpora los componentes y herramientas de compilación restantes.
- No se generan, codifican ni suben imágenes. Se excluyen seis recursos gráficos previos y el fondo pendiente no versionado. No se usa `create_blob`.
- Datos conservados: 237 piquetes, 235 vanos, 1.743 desviadores estimados (1.613 + 130). No hay avances ficticios.
- Comprobación ejecutada sobre la fuente recuperada: 7 pruebas de modelo/SQLite aprobadas. Compilación pendiente de restaurar dependencias.

### Errores técnicos concretos y vía elegida
1. Git clone con Schannel: `AcquireCredentialsHandle failed: SEC_E_NO_CREDENTIALS (0x8009030e)`.
2. Al usar OpenSSL: `unable to get local issuer certificate (20)`. Se resolvió para el intento siguiente usando el archivo de certificados de confianza ya existente, sin desactivar TLS.
3. Git clone con CA válida y autenticación sin interacción: `Unable to persist credentials with the 'wincredman' credential store` y `unable to get password from user`.
- Git directo no tiene autenticación utilizable en este entorno. No repetir estos intentos. Respaldo alternativo: árbol Git con contenido UTF-8, commit y avance de main con comparación del SHA esperado mediante el conector. Sin llamada a `create_blob` ni carga de imágenes.
- Próximo paso: confirmar los commits y archivos en GitHub; después instalar las dependencias y compilar. El fondo esquemático sigue pendiente hasta completar ese respaldo.

## Recuperación — etapa 2
- Núcleo guardado en GitHub: commit `c0f342f2dd4f51a9a1ae2ae350243ee15e6ebfb5`, main actualizado correctamente. Incluye 27 archivos de código/datos de la fuente anterior y este registro.
- Se incorporan ahora componentes, herramientas, configuración y `package-lock.json` originales. No se cambia el comportamiento de la aplicación en estos dos commits de recuperación.
- Las referencias anteriores a imágenes se retirarán en una etapa separada antes de compilar, porque los recursos gráficos fueron excluidos de este respaldo por instrucción del usuario.
- Los cambios funcionales solicitados anteriormente (fecha opcional, rendimiento por vanos y simplificación de estados) permanecen pendientes; esta sesión prioriza recuperar la aplicación existente.

## Recuperación — etapa 3
- Respaldo de fuente completa confirmado en GitHub: commit `9bd8a1153254ef524bf1338c2d68887608aee14c`, 133 archivos y cero imágenes. Verificado leyendo el árbol de main de forma independiente.
- Confirmada la presencia remota de `app/page.tsx`, `app/dashboard.tsx`, `lib/model.ts`, `package.json`, `package-lock.json`, `scripts/run-framework.mjs` y el inventario servido por la aplicación.
- Se retiran dependencias de imágenes excluidas del mapa, los metadatos, el manifiesto y la precarga del Service Worker. La geometría interactiva permanece visible sobre fondo liso; no se cambian coordenadas ni cantidades.
- Se conserva el inventario de datos validado. No hay mapas online, Base64 dentro de SVG ni cargas de recursos gráficos.
- Instalación: el lanzador pnpm disponible falló con `EPERM: operation not permitted, realpath 'C:\\Users\\sebas'`. No se repite. Se descargó npm 11.6.2 al directorio temporal del checkout y se ejecuta `npm ci` con el lock original y validación TLS activa.
- La primera validación de retirada de referencias encontró el atributo CSS `background` como falso positivo y detuvo la escritura. Se acotó a referencias de imagen y variables del fondo; adaptación completada.
- Instalación terminada: `npm ci`, 686 paquetes, lock original conservado.
- TypeScript: `tsc --noEmit`, código de salida 0.
- Compilación: `npm run build` con Vinext/Vite, cinco etapas completadas, código de salida 0. Generados `dist/server/index.js`, configuración Worker y manifiesto de assets del cliente.
- Pruebas ya verificadas: 7 de modelo/SQLite aprobadas. No se repiten porque la adaptación solo cambia presentación, metadatos y caché. La suite API con servidor no se ejecutó; no se probaron servicios de producción.
- Lectura independiente de GitHub: los SHA de los 128 archivos de fuente respaldados coinciden con los bytes del checkout recuperado; todos están presentes. Las diferencias respecto de objetos Git originales corresponden a los finales de línea de la copia Windows, sin diferencias de contenido funcional.
- Confirmado en la copia compilada: el inventario servido y el inventario validado son idénticos como datos; 237 piquetes, 235 vanos y 1.743 BD estimados.
- Error de transferencia interna: una lectura única del paquete de fuente excedió el límite de salida y devolvió `Warning: truncated output`; el analizador JSON se detuvo antes de enviar datos. Se resolvió leyendo veinte bloques de texto acotados. No se repitió el envío grande ni se usaron imágenes o codificación Base64.

## Estado para retomar sin repetir trabajo
- Objetivo de esta sesión: fuente recuperada, respaldada y compilada. No reconstruir la aplicación ni repetir el análisis CAD/PDF.
- Checkout ejecutable: `Avances-BD-LMT/github-recovery`. La copia original `.sites-checkout` se conserva intacta.
- Mantener el repositorio privado. La publicación existente no se modificó en esta sesión.
- Próximo paso, después de confirmar este commit en main: preparar un fondo esquemático como archivo independiente y ligero, sin mapas online ni imágenes incrustadas; no reutilizar el raster anterior. El fondo se ha dejado fuera de esta recuperación.
- Después: fecha opcional, avance/rendimiento por vanos y simplificación de estados, con sus pruebas específicas y publicación privada. Esas mejoras no se presentan como terminadas.

