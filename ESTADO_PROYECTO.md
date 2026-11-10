# Avances BD LMT — Estado del proyecto

## Privacidad de documentos y repositorio público — 10/11/2026
- RESULTADO FINAL: https://sebastiandc99.github.io/Avances-BD-LMT/ publicada y abierta correctamente. Workflow `42805336484`, resultado `success`, fuente `523a38741d729aa9da976e2ca5d706e2944fb3f8`.
- El guard de privacidad, pruebas de modelo/SQLite, TypeScript, compilación, verificación de inventario/assets y despliegue finalizaron correctamente.
- Verificación visual pública completada: mapa, listado de 235 vanos, ficha con fecha y cantidad opcionales, tres estados, 237 piquetes y 1.743 BD estimados; cero registros ficticios. No se guardaron datos de prueba. Inicio ya conserva la ruta de la aplicación.
- Los PDF originales no están disponibles como archivos ni enlaces de descarga en el repositorio público o en el artefacto de Pages. El historial auditado tampoco los contenía. La geometría y los conteos derivados que usa la app sí forman parte de la versión pública, como requiere su funcionamiento.
- Quedan cumplidos los pendientes anteriores de activación de Pages y publicación. Esta sección reemplaza el estado histórico de bloqueo de acceso.

- Control automático aprobado en el run `42804355989`. Pages se activó con GitHub Actions desde Settings.
- PUBLICACIÓN CONFIRMADA: run manual `42804763819`, resultado `success`, URL https://sebastiandc99.github.io/Avances-BD-LMT/ .
- La app pública abrió correctamente: 237 piquetes, 235 vanos, 1.743 BD estimados, sin avances ficticios y modo sin conexión listo.
- En la comprobación visual se detectó que el enlace Inicio apuntaba a la raíz del dominio. Se ajusta para que respete la base del repositorio y conservar el mismo comportamiento en Sites. El workflow comprobará y publicará esta corrección.

- Confirmado: el usuario cambió el repositorio a público (`private: false`). Pages aún no estaba activado al comenzar esta comprobación.
- Auditoría de los 13 commits alcanzables desde main: ningún PDF, DWG/DXF, archivo comprimido ni raster original en sus árboles. Solo existe la rama main; no hay etiquetas ni releases con adjuntos.
- Se revisaron 32 versiones de documentación y assets, buscando enlaces a PDF, Drive, Library, adjuntos o archivos originales y contenido PDF/raster incrustado. Sin hallazgos.
- Los archivos originales aportados por el usuario no se subieron a este repositorio. La app conserva la geometría y los conteos derivados necesarios para su funcionamiento; eso no equivale a publicar los documentos completos.
- Se añaden exclusiones de PDF, DWG/DXF y comprimidos a .gitignore y un control previo al build de Pages. El workflow descarga el historial completo y detiene la publicación si aparecen esos formatos o un PDF incrustado.
- No fue necesario borrar ni reescribir el historial porque no contenía esos archivos. Los documentos originales privados no se eliminan de las fuentes del usuario.
- Las comprobaciones de app ya aprobadas se conservan. Se verificará el nuevo control de privacidad mediante GitHub Actions.


## Cambio a público solicitado — 10/11/2026
- El usuario autorizó expresamente cambiar `Sebastiandc99/Avances-BD-LMT` a público y publicar GitHub Pages. Esa instrucción sustituye la anterior exigencia de mantenerlo privado.
- Se abrió Settings y se completaron los diálogos preparatorios de Change visibility → Change to public. GitHub exigió reautenticación en Confirm access antes de aplicar el cambio.
- Se solicitó la contraseña mediante el formulario seguro de autenticación, sin leer ni registrar credenciales. La solicitud devolvió `declined`; no se repitió ni se intentó otra vía de autenticación.
- Resultado comprobado nuevamente con el conector: `private: true`, `has_pages: false`. El repositorio todavía no cambió de visibilidad y Pages no se publicó.
- La pestaña de Confirm access se conserva para continuar. Falta completar esa reautenticación; después, verificar visibilidad pública, activar Pages para GitHub Actions y desplegar el artefacto ya compilado. No repetir análisis, imágenes ni las pruebas ya aprobadas.
- El nuevo entorno de ejecución está disponible, pero `gh auth status` confirma que su CLI no está autenticado. No buscar credenciales en archivos ni sustituir la sesión del usuario.


## Adaptación para GitHub Pages — 09/11/2026
- Adaptación guardada: `ad3f5adfd3fdcaa020d49bdc0e63dc248b6441ec`; workflow activo: `8ce41ca825962963c222a05f54c9d8f2804d048d`.
- COMPILACIÓN REMOTA CONFIRMADA: GitHub Actions run `42736883632`, job build `129568163792`, resultado `success`. Pasaron instalación, pruebas de modelo/SQLite, TypeScript, build estático y verificación de rutas/inventario/fondo/manifiesto. Artefacto de Pages subido correctamente.
- Publicación NO realizada: job deploy `129568461714` terminó `skipped` porque Pages no está habilitado para Actions. Verificación independiente posterior: `private: true`, `has_pages: false`.
- Resultado de CI: https://github.com/Sebastiandc99/Avances-BD-LMT/actions/runs/42736883632 .
- Única acción de configuración pendiente: en https://github.com/Sebastiandc99/Avances-BD-LMT/settings/pages elegir GitHub Actions como fuente. Después, volver a ejecutar el job build para comprobar la activación y desplegar.
- No hay herramienta de administración de Pages expuesta por el conector y el navegador/entorno local no está disponible. La búsqueda de capacidades adicionales solo ofreció el mismo conector y navegadores externos no instalados; no se sustituyó la sesión de Chrome ni se pidieron credenciales.
- Errores de lecturas auxiliares: `/actions/workflows` fue rechazado como endpoint no admitido; `/check-runs` devolvió 403 `Resource not accessible by integration`. Los resultados se verificaron con `/actions/runs` y la lectura de jobs, que sí funcionaron.
- La dirección prevista github.io aún no debe presentarse como un enlace publicado. La versión privada de Sites sigue disponible.
- Solicitud actual: servir la aplicación desde GitHub Pages del repositorio privado.
- Repositorio comprobado: `has_pages: false`; Pages aún no está activado.
- Se añade entrada estática Vite que reutiliza el formulario y el mapa, con rutas bajo `/Avances-BD-LMT/`, guardado local en IndexedDB y respaldo JSON. Los valores por defecto de la versión Sites se conservan.
- La versión Pages no ejecuta las API de ChatGPT/D1/R2. La sincronización entre equipos se realiza mediante exportar/importar JSON. No se migra ni borra el contenido del despliegue existente.
- Se prepara build, verificación de artefactos y workflow de Pages. El despliegue se omite si GitHub no tiene Pages configurado para Actions.
- El entorno local dejó de estar disponible: primer error `setup helper exited with status -1073741502`; posteriormente `No usable execution environment is available`. Node REPL y automatización de Chrome tampoco están disponibles en esta sesión. No repetir esos intentos.
- No se declara esta adaptación compilada ni publicada hasta obtener resultados de GitHub Actions. Se conservan las diez pruebas y el despliegue anteriores como evidencia de aquella versión.
- El conector no ofrece administración de Pages ni navegador disponible para activar Settings. Si el plan impide Pages en repositorios privados, no cambiar el repositorio a público sin autorización.
- Guía y limitaciones: `docs/GITHUB_PAGES.md`.

## Terminación y publicación — 09/11/2026
- PUBLICACIÓN CONFIRMADA: `succeeded`, con URL https://avances-bd-lmt.sebastiandc99.chatgpt.site y acceso privado conservado.
- Fuente de ejecución publicada: `753ea5fd5e0cc367b9d7734626484b05df6b9fb8`, subida mediante Git push al repositorio de Sites. Respaldo funcional en GitHub: `fd89816307f0f8bfb7fee2732d4bc76250158fe6`.
- Versión: `appgprj_6af0b2362bbc8191a15c1bf47010c244~appgver_9d11e1c0e0288191b8fe0664de2f7f59`. Despliegue: `appgdep_6af271d80d188191a76523d5d85dab4b`. Confirmación: 09/11/2026 22:22 (Argentina).
- Prueba API local completada: acceso requerido, aislamiento por usuario, idempotencia, rechazo de versiones atrasadas/origen externo y guardado Terminado sin fecha ni BD. Resultado total: 10 pruebas aprobadas, TypeScript y compilación correctos.
- Para ejecutar la API compilada en este entorno se usó Miniflare directo con lista explícita de módulos. El primer intento devolvió `ERR_MODULE_DYNAMIC_SPEC`; se corrigió solo el lanzador de pruebas. No se cambió código de la aplicación para sortear las limitaciones locales.
- La credencial temporal de Sites expiró antes del empaquetado (`Renew the source credential for the same Site before retrying`); se renovó una vez y el empaquetado, Git push y despliegue terminaron correctamente.
- El siguiente paso de empaquetar y desplegar que figura más abajo ya está cumplido. La revisión visual sigue sin poder confirmarse por el bloqueo del navegador del entorno; no afecta la evidencia de pruebas, compilación y despliegue.
- Funcionalidad terminada: fecha opcional; Pendiente, En proceso y Terminado; avance y rendimiento por vanos; cantidades reales de BD opcionales sin autocompletar estimaciones; selección azul y área táctil de 52 px.
- Se conservan los registros anteriores, incluidos los de observaciones (se presentan como En proceso). No se altera la geometría ni el inventario: 237 piquetes, 235 vanos y 1.743 BD estimados.
- Fondo independiente implementado: `public/assets/fondo-esquematico.svg`, 2.715 bytes de texto plano, sin raster ni Base64, con RN 51, salar, relieve y referencias aproximadas. Detalle en `docs/fondo-esquematico.md`. Incluido en la caché offline.
- Verificado: nueve pruebas de modelo/SQLite aprobadas; TypeScript sin errores; compilación final de cinco etapas completada con salida 0. Respuesta HTTP 200 en la vista previa local.
- Acceso del sitio confirmado: solo el propietario. Se conserva el mismo proyecto `appgprj_6af0b2362bbc8191a15c1bf47010c244` y su URL.
- Revisión visual bloqueada por el entorno: `Tab 1 is not part of browser session ...`; después, Computer Use no pudo determinar la URL de Chrome con confianza. Se detuvo la automatización visual, sin reintentar ni cambiar protecciones.
- El primer intento de build del helper no encontró `npm-prefix.js`/`npm-cli.js` por la disposición del npm temporal. Se corrigió el lanzador local y el build terminó correctamente; no se alteraron las dependencias.
- Wrangler local informó `Cannot read directory ...: Acceso denegado` al resolver el Worker compilado dentro del perfil Windows. `--no-bundle` no lo resolvió; no seguir repitiendo ese comando. El directorio alternativo `C:\workspace` también devolvió acceso denegado. Las pruebas SQLite sí pasaron; no se cargaron fixtures en producción.
- Siguiente paso inmediato: respaldar estos cambios, empaquetar la compilación ya comprobada y desplegar la nueva versión privada. Registrar aquí el resultado real del despliegue.

La sección siguiente conserva el historial de recuperación; sus pendientes quedan sustituidos por este estado actual.

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
- Fuente ejecutable final guardada en main: `782f39de1e8cca1ae5546a92e12a3efcfde5408d`.
- Verificación final independiente: 133 archivos de GitHub comparados por SHA de objeto Git con la copia local compilada; cero diferencias. Cero archivos de imagen en el árbol remoto.
- Commits de esta recuperación: `c0f342f` (núcleo), `9bd8a11` (componentes y herramientas), `782f39d` (ejecución sin imágenes y compilación verificada). Este último registro documental conserva esas referencias.
- Objetivo de esta sesión: fuente recuperada, respaldada y compilada. No reconstruir la aplicación ni repetir el análisis CAD/PDF.
- Checkout ejecutable: `Avances-BD-LMT/github-recovery`. La copia original `.sites-checkout` se conserva intacta.
- Mantener el repositorio privado. La publicación existente no se modificó en esta sesión.
- Próximo paso, después de confirmar este commit en main: preparar un fondo esquemático como archivo independiente y ligero, sin mapas online ni imágenes incrustadas; no reutilizar el raster anterior. El fondo se ha dejado fuera de esta recuperación.
- Después: fecha opcional, avance/rendimiento por vanos y simplificación de estados, con sus pruebas específicas y publicación privada. Esas mejoras no se presentan como terminadas.


## 10/11/2026 — sincronización privada: base preparada
- Se creó un proyecto independiente de Supabase, `Avances BD LMT`, en la organización existente Seba Games. Costo informado por el proveedor: USD 0/mes; no se contrató un plan pago.
- Proyecto `ynhvceqjhcydsteyzrpt`: migración `lmt_private_sync` aplicada. Eventos con RLS por usuario, versiones e inserción idempotente; bucket `lmt-photos` privado, limitado a JPG/PNG/WebP, sin PDF ni DWG.
- Comprobado en una transacción revertida: guardar/reintentar sin duplicar, detectar versiones en conflicto, impedir lecturas/escrituras de otra cuenta y rechazar escrituras anónimas. Sin datos de prueba persistidos.
- Asesor de seguridad de Supabase: cero avisos sobre esta base.
- Error previo: dos lecturas SQL de KPFighter terminaron en `Connection terminated due to connection timeout`; el diagnóstico informó `currently hibernated`. Se dejó ese proyecto intacto y se preparó una base independiente.
- Se mantiene el inventario validado: 237 piquetes, 235 vanos y 1.743 BD estimados. No se generan ni cargan recursos gráficos ni documentos originales.
- La interfaz y cola de sincronización están en preparación local; todavía no se presentan como publicadas.

- Intento Git push en esta sesión: `fatal: could not read Username for 'https://github.com': terminal prompts disabled`. No hay sesión Git autenticada; respaldo alternativo por árbol Git UTF-8 y commits del conector, sin create_blob.


## 10/11/2026 — guardado local y sincronización automática
- Base privada respaldada en GitHub: commit cfb4e8dc9c5c8f15d0d4e229f63beaa1fcab9bd8.
- Se incorpora ingreso/alta por correo y contraseña, confirmación por enlace del correo dentro de la app y acceso a los mismos datos con la misma cuenta en otro dispositivo.
- Guardado primero en IndexedDB; cola automática al volver la conexión, al guardar, al volver a la app y cada 45 segundos con la app abierta. Sin promesa de subir con el navegador cerrado.
- Vinculación transaccional de registros anteriores de Chrome a la cuenta, conservando fotos e historial; separación local y remota entre cuentas. La vista puede abrir sin conexión aun con sesión pendiente de renovar.
- Reintentos idempotentes, paginación de historial, versiones en conflicto conservadas para elegir y rechazo de registros con fotos faltantes. Se preserva la versión que se estaba editando para detectar cambios concurrentes.
- 15 pruebas de modelo, SQLite, cola de sincronización y migración local aprobadas; TypeScript, build:pages, verify:pages y control de documentos privados aprobados.
- Dependencias nuevas fijadas con lock: supabase-js 2.119.0 y fake-indexeddb 6.2.5 (solo pruebas). Clave de frontend publicable; ninguna clave administrativa en el repositorio.
- Configuración del panel Auth no modificada: el navegador de administración pide iniciar sesión. Se conserva confirmación de correo y se permite pegar el enlace de confirmación en la propia app.
- La actualización queda guardada para su publicación automática por GitHub Actions. La verificación del despliegue se registra por separado cuando termine.
- Error de transferencia interna: una lectura combinada excedió el límite y no pudo analizarse como JSON. No se enviaron datos en ese intento. Resuelto con lecturas acotadas y transferencia solo de diferencias del lock.


## 10/11/2026 — sincronización publicada y verificada
- Aplicación: https://sebastiandc99.github.io/Avances-BD-LMT/
- Código de sincronización: commit 0fe1878d3d660ade7ad2737cf73b369a58fbac55, presente en main. Verificada la lectura independiente del componente de acceso y los archivos enviados. El lock remoto contiene los mismos datos de dependencias; solo difiere el orden de entradas respecto del archivo local.
- GitHub Actions 42808728152: resultado success. Build 129804425140 y deploy 129805154254 completados; 15 pruebas, TypeScript, compilación, inventario y control de documentos privados aprobados.
- Verificación visual de producción: botón Activar nube; panel Nube privada con Ingresar/Crear cuenta, correo y contraseña, confirmación por enlace, respaldos JSON/CSV y aviso de sincronización al recuperar conexión con la app abierta. Se confirmó el indicador Listo para trabajar sin conexión.
- La cuenta personal debe activarla el usuario desde la app. No se creó una cuenta en su nombre ni se pidió su contraseña. No se probó una sesión personal real en dos dispositivos; las pruebas de cola y la transacción de la base verifican reintentos, conflictos y aislamiento.
- Base final comprobada: cero usuarios y eventos de prueba persistidos; bucket de fotos public=false. Asesor de seguridad sin avisos. Los PDF/DWG originales siguen fuera del repositorio y del sitio.
- Comprobación diff --check: Git interpretó CRLF heredados como espacios al final; con core.whitespace=cr-at-eol la comprobación pasó sin cambiar los finales de línea de origen.
- Conservados 237 piquetes, 235 vanos y 1.743 desviadores estimados. No se generaron, codificaron ni subieron imágenes en esta etapa.


## 10/11/2026 — carga por tramos y conservación de la vista: lógica verificada
- Se preparó la selección por línea y rangos entre piquetes (1 a 18 = 17 vanos). Los rangos superpuestos se deduplican; los vanos ya terminados o con conflictos se omiten.
- La carga conserva BD reales, fotos, notas y datos previos; fecha y responsable se pueden completar sin inventar cantidades. Los eventos usan la cola local y la sincronización existente.
- Cinco pruebas nuevas aprobadas: cobertura exacta de 235 vanos y validación de límites, preservación de datos y repetición sin duplicar, producción histórica con fecha, recuperación de zoom/centro al abrir/cerrar la ficha y conservación de escala al cambiar el ancho.
- TypeScript, compilación Pages, rutas/inventario y control de documentos privados aprobados sobre la actualización completa local.
- Error de vista previa local: Vite preview devolvió ERR_SYSTEM_ERROR, uv_interface_addresses returned Unknown system error 1. Se sirvió el artefacto estático con Python; el navegador remoto devolvió net::ERR_CONNECTION_REFUSED al puerto local. No se insistió: la comprobación visual se realiza sobre Pages después del despliegue.
- No se modifican la base privada ni sus permisos. Se mantienen 237 piquetes, 235 vanos y 1.743 BD estimados. Sin generación/codificación/carga de imágenes ni documentos originales.


### Interfaz lista para publicación
- Lógica y pruebas respaldadas en commit 7acf961f87c635c99645170a46ca2467f991390a.
- Nuevo diálogo Cargar vanos completados: varios tramos, línea larga/corta, piquetes de inicio/fin, fecha y responsable opcionales, vista previa del total y guardado conjunto transaccional.
- Una ficha individual se cierra después de confirmar el guardado local y vuelve al plano. Si el guardado falla, la ficha queda abierta para reintentar.
- Seleccionar directamente en el plano no recentra ni cambia el zoom; el redimensionado conserva escala y centro. La vista queda en memoria al cambiar de pestaña; al guardar desde el plano se recupera la posición de desplazamiento de la página.
- La guía de Pages y el workflow incluyen las nuevas funciones y las cinco pruebas adicionales (20 pruebas en total junto a las anteriores).
- Despliegue automático pendiente de confirmación; todavía no se presenta esta etapa como publicada.


## 10/11/2026 — carga por tramos y vista conservada: publicado
- Versión publicada: 2fbbf15ef261063b227a111fc93c0a89a14b423f, con lógica en 7acf961f87c635c99645170a46ca2467f991390a. GitHub Actions 42823737910 terminó success; build 129855494873 y deploy 129855739891 aprobados. Pasaron 20 pruebas, TypeScript, compilación, inventario y control de documentos privados.
- Verificación independiente de GitHub: siete archivos de aplicación/lógica/pruebas comparados por SHA con el checkout; cero diferencias.
- Verificación visual en https://sebastiandc99.github.io/Avances-BD-LMT/: aparece Cargar vanos completados. Un tramo 1–18 devuelve 17 vanos; al sumar 1–18 de la corta devuelve 34. Los tramos superpuestos se deduplican.
- Se verificó el viewBox exacto antes y después de seleccionar el vano 98–99, cerrar su ficha y alternar Vanos → Mapa: idéntico, sin pérdida de zoom ni posición del plano. Las pruebas matemáticas cubren el redimensionado de la ficha móvil.
- No se cargaron avances ficticios ni se enviaron datos personales para la comprobación visual. El cierre después del guardado local está implementado en la ficha; un error de guardado la mantiene abierta. No se simuló un avance de obra real en producción.
- Una lectura de prueba de DOM con SVG.viewBox.baseVal devolvió TypeError (propiedad no disponible en esa superficie); se leyó el atributo viewBox y se completó la comparación. No fue un error de la aplicación ni se repitió la operación fallida.
- Conservados 237 piquetes, 235 vanos y 1.743 BD estimados. Continúan el guardado offline y la sincronización privada existentes. No se añadieron imágenes, mapas online, PDF ni DWG.


## 10/11/2026 — corrección de cantidades y rendimiento: lógica verificada
- Se revisó nuevamente la página de Criterios Técnicos de Señalización del procedimiento privado: 60 % central del vano, separación de 10 m y cantidades orientativas de 7 a 8 por vano promedio. Se mantiene el redondeo/disposición simétrica ya documentado; no se publica el PDF.
- Se recalcularon las longitudes entre coordenadas de los 237 piquetes extraídos del DWG, los 235 vanos y las cantidades por vano: cero discrepancias con el inventario validado. Resultado: larga 1.613, corta 130, total 1.743 BD estimados; por vano varían de 5 a 8 según su longitud.
- Nuevo criterio solicitado: un terminado sin cantidad real informada contabiliza los BD calculados de ese vano. Una cantidad real mayor a cero tiene prioridad; en proceso solo suma BD reales informados. Se distingue el origen del conteo. Los registros originales no se reescriben.
- Rendimiento: solo terminados con fecha de ejecución explícita / días distintos con ejecución registrada; se calculan vanos/día y BD/día. Sin fecha suman avance y BD, pero no rendimiento. No se usa createdAt como fecha de ejecución.
- Correcciones de fecha se reflejan sin duplicar vanos; reabrir retira el vano de producción terminada. Se separan terminados, en proceso, pendientes de iniciar y faltantes totales (en proceso + pendientes).
- Pruebas afectadas aprobadas: 17 de modelo y carga por tramos, incluidos 80 históricos sin fecha, mezcla con producción fechada, prioridad de cantidades reales, fechas añadidas/corregidas/borradas, reapertura y total completo 1.743. TypeScript, build:pages, verify:pages y control de documentos privados aprobados.
- En la carga por tramos, una fecha de finalización vacía no hereda una fecha de actividad anterior de un vano en proceso. Esa fecha anterior se conserva en el historial.
- La lectura inicial de instrucciones PDF devolvió skill package is not available mientras el entorno iniciaba. Tras quedar disponible se leyó correctamente; no hubo cambios ni pérdida de archivos.
- Estos criterios reemplazan las notas anteriores que usaban fecha de guardado/días calendario o dejaban en cero los BD de un vano terminado sin cantidad manual.
- Interfaz y publicación se confirman en la etapa siguiente. Sin imágenes nuevas ni cargas de documentos originales.


### Interfaz de cantidades y estados lista para publicar
- Lógica respaldada en fd601269fadba4dd86250266d78ae04726a54e8f.
- Seis indicadores visibles también en móvil: avance, terminados, en proceso, pendientes, BD colocados y rendimiento con fecha. Faltantes incluye pendientes + en proceso, sin confundir esos estados.
- Cantidades calculadas/informadas coherentes en tarjetas, listado de vanos, fichas, historial, conflictos y CSV. Cada vano muestra su cómputo; la carga por tramos anticipa los BD calculados para los vanos nuevos.
- Advertencia visible de terminados sin fecha excluidos del rendimiento; resumen de vanos/día y BD/día, días registrados y jornadas estimadas restantes.
- Guías actualizadas al criterio nuevo. Las cantidades y fechas guardadas previamente se conservan; los indicadores se corrigen al abrir la nueva versión.
- Pendiente confirmar el workflow y el despliegue de Pages antes de dar la publicación por terminada.


## 10/11/2026 — cantidades y rendimiento corregidos: publicación confirmada
- Fuente publicada bf300405dc872de3a92ca5e36151d7bb6f59f95f, lógica fd601269fadba4dd86250266d78ae04726a54e8f. GitHub Actions 42830361480 terminó success; build 129878471728 y deploy 129878832491 aprobados.
- Las 26 pruebas del workflow, TypeScript, compilación, inventario y control de documentos privados pasaron. Los nueve archivos modificados de aplicación/lógica/pruebas/guías coinciden por SHA con GitHub.
- Verificación visual tras recargar https://sebastiandc99.github.io/Avances-BD-LMT/: seis indicadores, estados separados, faltantes totales, 1.743 BD calculados y explicación del origen de cantidades. Resumen por línea confirma 1.613 y 130.
- Resumen de producción muestra vanos/día, BD/día, días con ejecución y terminados sin fecha excluidos; el estado sin fechas no inventa un rendimiento.
- La regresión de 80 históricos sin fecha se verificó con datos aislados de prueba; no se cargaron avances ficticios en producción ni se leyeron/modificaron registros personales del navegador del usuario. Los indicadores nuevos se aplican automáticamente a los datos existentes al recargar.
- El navegador de verificación informó Kernel state was reset after inactivity antes de ejecutar la primera lectura; se reinicializó y se completó la comprobación, sin cambios de datos.
- Los PDF/DWG originales continúan fuera del sitio/repositorio. No se generaron ni subieron imágenes. Se mantienen 237 piquetes, 235 vanos y 1.743 desviadores estimados.


## 10/11/2026 — fecha de finalización estimada en el resumen
- Se agrega al Resumen la fecha estimada de finalización y los días restantes, para ambas líneas o la seleccionada.
- Días = ceil(vanos sin terminar / promedio de vanos por día con ejecución fechada); fecha = fecha actual en Argentina + esos días. Se aclara la hipótesis de una jornada por día.
- Sin producción fechada no se inventan días ni fecha. Si todos los vanos están terminados: 0 días y Finalizado, sin presentar la fecha de carga como fecha real de finalización.
- Prueba específica aprobada: 5 vanos faltantes a 1,5 vanos/día dan 4 días; desde 10/11/2026 se estima 14/11/2026. Sin fechas, proyección ausente; todo terminado, 0 días.
- Pasaron las 15 pruebas afectadas del modelo, TypeScript, compilación y verificación de Pages. El workflow completo suma 27 pruebas.
- Fuente guardada para despliegue automático; publicación de esta ampliación pendiente de confirmar.


### Corrección del redondeo de días
- Comprobación adicional encontró un error numérico concreto: con 7 vanos fechados en 5 días y 21 faltantes, ceil(21 / 1,4) daba 16 por representación de coma flotante; el resultado correcto es 15.
- Se usa la razón entera equivalente ceil(faltantes × días registrados / vanos fechados), que elimina el día adicional por redondeo numérico.
- Regresión aprobada: 15 días desde 10/11/2026 → 25/11/2026. Pasaron 16 pruebas del modelo, TypeScript, compilación y verificación de Pages. El workflow completo suma ahora 28 pruebas.
- El cambio conserva el criterio de usar solo producción con fecha y no modifica registros de obra.


## 10/11/2026 — fecha estimada y días restantes: publicados
- Fecha/días incorporados en f3cf76ec7f17f3dbe3afc89864ef42ed56456564; ajuste final del redondeo b4949c3e08dd4117a983f577af704d5be79e730d, presente en main.
- GitHub Actions 42831638307: success; build 129882906175 y deploy 129883252168 aprobados. Pasaron 28 pruebas del modelo/base/cola/almacenamiento/mapa/tramos, TypeScript, compilación, inventario y control de documentos privados.
- Cinco archivos de esta ampliación comparados por SHA con GitHub: cero diferencias.
- Verificación visual en producción: Resumen muestra Días para finalizar y Fecha estimada de finalización; sin datos fechados muestra — días y Sin estimación, con explicación para cargar fechas. No se generaron registros de obra ficticios para la comprobación.
- La proyección usa solo el rendimiento de vanos terminados con fecha. Días = ceil(faltantes × días registrados / vanos fechados); fecha = hoy en Argentina + días. Supone mantener el ritmo con una jornada por día. Con todos los vanos terminados indica 0 días y Finalizado.
- Se conservan los cambios anteriores de BD automáticos por vano y estados separados. No se borran ni reescriben cargas previas; el usuario debe recargar la página para actualizar indicadores y proyección.


## 10/11/2026 — separación de Mapa y Resumen
- Mapa queda dedicado al plano, búsqueda/filtros y carga de datos individual o por tramos. Se retiran sus tarjetas de indicadores, rendimiento, proyección y exportación analítica.
- Resumen concentra indicadores, cantidades de BD, estados de vanos, producción fechada, rendimiento, días restantes, fecha estimada y exportación CSV. El filtro de línea se aplica de forma coherente a sus indicadores.
- Se retira del Resumen y del Historial la ficha/instrucción lateral para cargar en el mapa. Esos apartados usan el ancho completo y muestran títulos propios.
- Vanos conserva su listado y ficha operativa; Historial conserva las revisiones. Los controles de sincronización y respaldo siguen disponibles.
- Cambio solo de organización visual; no se cambian fórmulas, cantidades, fechas ni registros, ni el guardado, la sincronización o la memoria de zoom.
- TypeScript, compilación, verify:pages y diff --check aprobados. No se añadieron pruebas que dupliquen la presentación; el workflow conserva las 28 pruebas funcionales existentes.
- Fuente preparada para despliegue automático; la publicación se confirma después de terminar Pages.


### Separación publicada y verificada
- Fuente 6339f02aba8d70302c7958525c90b1913a594a13 en main. GitHub Actions 42833140176 terminó success; build 129888183194 y deploy 129888534953 aprobados. Pasaron las 28 pruebas, TypeScript, compilación y verificaciones de publicación.
- Tres archivos de interfaz/guía comparados por SHA con GitHub: cero diferencias.
- Comprobación visual en producción tras recargar: Mapa tiene 0 controles/etiquetas de rendimiento, 0 botones de exportación analítica y 1 botón de carga por tramos; mantiene plano, filtros y ficha operativa.
- Resumen tiene sus indicadores y rendimiento, 0 botones de carga por tramos, 0 fichas laterales de edición y 0 búsquedas de carga. Conserva fecha estimada y días restantes. Ningún registro de obra fue modificado para estas comprobaciones.
- Aplicación: https://sebastiandc99.github.io/Avances-BD-LMT/. No se generaron imágenes ni se añadieron PDF/DWG. Inventario y cálculos sin cambios: 237 piquetes, 235 vanos y 1.743 BD estimados.


## 10/11/2026 — búsqueda de piquetes, fechas editables y Drive: lógica verificada
- Búsqueda exacta por número y prefijo (192, P98, FP 3), con resolución de números compartidos entre líneas. La cámara centra el punto del DWG con zoom táctil adecuado; no cambia al listado.
- Se agrega modo Actualizar fechas por tramos: solo vanos ya terminados, nuevas revisiones sin duplicar avance, manteniendo cantidades, responsable, notas y fotos. Las fichas existentes muestran Guardar cambios.
- Resumen usa siempre las dos líneas juntas: porcentaje sobre 235 vanos; sin porcentajes separados ni filtros que cambien ese denominador.
- Drive: carpeta Doc Worley / App avances identificada y verificada privada. No se leyó el contenido ni se modificaron los PDF/DWG originales.
- Integración de respaldo por equipo preparada con destino fijo, OAuth limitado drive.file y autorización de la carpeta por Google Picker. No se almacenan tokens de Google en el repositorio; configuración pública local y tokens solo en memoria, separados por usuario de la app.
- La función de Drive crea/actualiza únicamente el JSON de respaldo del equipo en la carpeta fija y verifica el contenido leyendo lo escrito. No cambia permisos ni guarda en otra carpeta/raíz si falla. No mezcla automáticamente respaldos de otros equipos.
- Bloqueo real de activación: no se dispone del cliente OAuth, API key pública de Picker ni número de proyecto propios. La consola cloud.google.com devolvió Site Unavailable / Unable to access this site en el navegador. La conexión de Drive del chat no proporciona esas credenciales a la app. No se presenta Drive como activado.
- Diez pruebas afectadas aprobadas (tramos, búsqueda/cámara y protocolo Drive), con respuestas aisladas: no hubo escrituras ficticias en Drive. TypeScript, build:pages, verify:pages y control de documentos privados aprobados.
- Error de TypeScript resuelto: Response.json devolvía unknown y había conflicto de tipos de append con Cloudflare. Se tiparon los resultados JSON y se usó appendChild para cargar los SDK oficiales de Google.
- Mantener 237 piquetes, 235 vanos y 1.743 BD estimados. Sin imágenes nuevas, SVG codificados ni carga de PDF/DWG.


### Interfaz lista para publicar
- Lógica/pruebas respaldadas en c85bde2367d2f90261962e875d7b714b38cecea6.
- La lupa del Mapa mantiene la vista de mapa; enfoca y resalta piquetes exactos, permite elegir la línea en resultados ambiguos y busca en la otra línea si el número no existe en el filtro actual.
- Cargar o actualizar tramos incluye Actualizar fechas; una ficha existente muestra Guardar cambios. No se duplican vanos terminados al corregir fechas.
- Resumen siempre usa el proyecto completo de 235 vanos, sin porcentajes por línea.
- Datos y respaldo incorpora el botón Sincronizar copia con Drive y configuración del cliente Google. Destino fijo: Doc Worley / App avances. El botón permanece pendiente/deshabilitado sin las credenciales públicas propias, sin fingir una sincronización.
- Se documentó la activación concreta en docs/GOOGLE_DRIVE.md. La copia por equipo no mezcla automáticamente respaldos de otros equipos ni sustituye la sincronización de eventos existente.
- El workflow incorpora siete pruebas nuevas (35 en total). La publicación se verifica por separado cuando termine Pages.


### Publicación confirmada y comprobación en la aplicación
- Fuente aec837be4dfa118e05382c1e28f9400102474edf guardada en main. GitHub Actions 42862278578 terminó success, con build y deploy aprobados: pruebas del modelo/base de datos, TypeScript, compilación Pages, rutas, inventario y control de documentos privados.
- Ocho archivos principales de lógica e interfaz comparados por SHA entre el código local y GitHub: cero diferencias.
- App publicada verificada en https://sebastiandc99.github.io/Avances-BD-LMT/: buscar 192 conserva Mapa, resalta el piquete y centra la cámara en sus coordenadas (808.6033, 354.37945), con ancho de vista 117.57 unidades. Resultado seleccionable Enfocar presente.
- Modal Actualizar fechas verificado: fecha obligatoria y selección solo de vanos terminados. Los casos de fechas corregidas sin duplicar producción, conservando cantidades, fotos y responsable, se verificaron con pruebas aisladas; no se alteraron registros reales para probar.
- Con el filtro Línea corta activo en Mapa, Resumen continúa mostrando Ambas líneas / Proyecto completo, porcentaje sobre 235 vanos y total de 1.743 BD calculados. Sin porcentajes individuales por línea.
- Datos y respaldo muestra el destino fijo Doc Worley / App avances y el estado Pendiente de activar; el botón está deshabilitado al faltar la configuración pública propia de Google. No se escribió ni se comprobó un respaldo real en Drive: OAuth web, API key de Picker y número de proyecto siguen pendientes. Pasos concretos en docs/GOOGLE_DRIVE.md.
- Incidencia de automatización de la comprobación: setChecked sobre el filtro devolvió no_matches con rol checkbox; el control es un botón con estado aria-pressed. Se seleccionó mediante su botón y se verificó el cambio correctamente. No requirió cambios en la aplicación.
- No se generaron imágenes, no se usó create_blob y no se publicaron PDF/DWG. Se mantienen 237 piquetes, 235 vanos y 1.743 BD estimados.


## 10/11/2026 — fecha visible en la tabla de Vanos
- Se agrega la columna Fecha de ejecución junto al estado de cada vano, en formato día/mes/año. Usa la fecha del último registro vigente, por lo que las correcciones guardadas se reflejan en el listado.
- Los vanos sin fecha cargada muestran Sin fecha. No se asignan fechas automáticas ni se modifican registros de obra.
- TypeScript, compilación para Pages y verificación de recursos/rutas/inventario aprobados. Sin cambios de modelo, fórmulas, sincronización ni documentos privados. Se mantienen 237 piquetes, 235 vanos y 1.743 BD estimados.
- Cambio listo para publicar; despliegue y columna en producción se confirman por separado.
