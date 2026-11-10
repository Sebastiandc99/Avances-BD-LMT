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

