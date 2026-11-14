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


### Fecha en Vanos publicada
- Fuente e0a8d88d74009f426f64e3c0b897f51ffd5bec66 en main, Actions 42872944861 success. Columna Fecha de ejecución y texto Sin fecha comprobados en la tabla publicada. El archivo de interfaz guardado coincide con el validado localmente.

## 10/11/2026 — exportación Excel y vista aérea: lógica verificada
- XLSX con cuatro hojas: Resumen global de ambas líneas, Rendimiento por fecha, Vanos (235 registros, fechas numéricas, cantidades, origen, responsable y observaciones) y Vista aérea.
- Usa los registros vigentes y las métricas existentes; excluye terminados sin fecha del rendimiento, conserva avance global sobre 235, BD colocados, días restantes y fecha estimada de finalización. Fórmulas con valores cacheados, filtros y encabezados congelados en tablas.
- Vista aérea: PNG de 4400 × 3400 píxeles generado en el navegador con el fondo local, los 237 piquetes y los 235 vanos según su estado; imagen amplia incrustada en la cuarta hoja. Sin mapas online, SVG con Base64 ni imágenes nuevas publicadas en el repositorio. La nueva solicitud autoriza esta imagen dentro del Excel.
- Plantilla de formato creada con Artifact Tool y guardada como XML en JSON; sin datos de obra ni imágenes. ZIP mediante fflate ya disponible en el lock, declarado como dependencia directa. Sin descargas de bibliotecas durante la exportación.
- Tres pruebas nuevas aprobadas: fechas/revisiones vigentes, resumen global/rendimiento y estructura XLSX con fórmulas, escape de texto, filtros e imagen. TypeScript, compilación Pages y verificación de rutas/inventario aprobados.
- Descarga real en una vista de prueba aislada: cuatro hojas y PNG válido de 4400 × 3400, aproximadamente 1 MB. Importación, recálculo y revisión de fórmulas con Artifact Tool: coincide con la app (1 terminado, 1 en proceso, 12 BD, 1 vano/día, 8 BD/día y 234 jornadas restantes en el ejemplo). Revisión visual de las tablas y plano completada. No se alteraron registros de producción.
- Errores corregidos: TS5097 al importar tipos/cálculos compartidos por extensión .ts, resuelto habilitando allowImportingTsExtensions con noEmit; prueba de porcentaje falló por precisión binaria al dividir por 100, corregido usando directamente terminados/total. La automatización fill de fecha no emitía el cambio nativo; la verificación usó el control de fecha por teclado y confirmó guardado y exportación.
- Advertencia de build: el JS principal ronda 542 kB sin comprimir / 155 kB gzip. Se mantiene incorporado para permitir exportación sin conexión; el build finaliza correctamente.
- Credenciales propias de Google Drive siguen pendientes; esta función descarga el Excel al dispositivo y no presenta Drive como activado.
- Lógica lista para conectar en la interfaz y publicar. Se mantienen 237 piquetes, 235 vanos y 1.743 BD estimados; los PDF/DWG permanecen fuera del repositorio.


### Botón de Excel conectado
- Exportar Excel disponible en Vanos, Resumen y Datos y respaldo. No agrega análisis al Mapa. Conserva la descarga CSV existente.
- La descarga espera los guardados locales pendientes y toma una única copia de los eventos para que tablas, resumen e imagen correspondan al mismo instante.
- Función y pruebas guardadas en 0cb5a32000c2c5e5fc96e522624360dd2da46e88. Publicación y descarga desde Pages pendientes de confirmar al finalizar el workflow.


### Exportación publicada y detalle de trazas superpuestas
- Fuente 573f8398e744b7843fe9fabd2212b1adc6fba3b7 en main. Actions 42875824336 success: build y deploy aprobados. Nueve archivos de interfaz/lógica/dependencias/documentación comparados por SHA: cero diferencias.
- Se comprobó la exportación con el servidor de prueba detenido: XLSX válido con cuatro hojas e imagen, a partir de los recursos previamente almacenados. Prueba aislada, sin conexión ni cambios en registros de producción.
- La revisión del plano identificó superposición de la línea corta con el sector largo P208–P219. Se agrega recuadro amplio que muestra esos sectores por separado y conserva la vista general completa, para que los estados de una línea no oculten los de la otra.
- Descarga real del XLSX con el detalle e inspección visual del recuadro aprobadas; etiquetas legibles y geometría del DWG conservada en cada recuadro. Pruebas afectadas, TypeScript, compilación y verificación Pages aprobados después del ajuste.
- Pendiente confirmar el despliegue de esta mejora final y el botón en producción.


### Excel completo publicado y descarga verificada en producción
- Fuente final 725c366c7ab0e79387aa19c0e0a8466494729d98 en main. GitHub Actions 42876494263 success, build y deploy aprobados: 38 pruebas funcionales, TypeScript, compilación y verificación Pages.
- Código final de exportación leído de GitHub: coincide con el validado. App publicada cargó assets/index-Do7Fh7yE.js, correspondiente al build final.
- Comprobación en https://sebastiandc99.github.io/Avances-BD-LMT/: Vanos muestra Fecha de ejecución y Exportar Excel. Descarga real completada con aviso de éxito, sin alterar registros de producción.
- XLSX descargado de producción validado: cuatro hojas Resumen, Rendimiento, Vanos y Vista aérea; 235 filas de vanos; XML y relaciones válidos; PNG incrustado válido de 4400 × 3400; archivo aproximadamente 1,13 MB en la vista vacía de verificación.
- Importador de hojas reconoce la cuarta hoja como imagen incrustada de 2600 × 2009 píxeles de presentación (fuente 4400 × 3400), sin vínculo externo. Plano general y recuadro separado de Larga P208–P219 / Corta FP1–FP18 revisados visualmente.
- Las fórmulas y tablas ya verificadas coinciden con la aplicación; no se añadieron PDF/DWG, datos reales ni imágenes de avances al repositorio público. Mantener 237 piquetes, 235 vanos y 1.743 BD estimados. Google Drive conserva el pendiente de credenciales registrado anteriormente.


## 10/11/2026 — botón Exportar Excel visible en celular
- Causa concreta del reporte: la regla CSS .export-top{display:none} dentro de @media(max-width:600px) ocultaba el botón en Vanos y Resumen. La función de exportación estaba publicada, pero el botón principal no se mostraba en teléfonos.
- Se reemplaza por display:inline-flex y width:100% dentro del mismo ancho móvil. El botón queda visible y a ancho completo sin modificar la exportación, los datos ni los cálculos.
- Comprobación con viewport de 390 px en una vista aislada: Exportar Excel visible en Vanos (347 × 42 px, posición dentro del ancho disponible) y en Resumen. No se alteraron registros de producción.
- Compilación Pages y verificación de recursos/rutas/inventario aprobadas. Pendiente confirmar el despliegue de la corrección.
- Sin imágenes nuevas ni documentos originales publicados. Se mantienen 237 piquetes, 235 vanos y 1.743 BD estimados.


### Corrección móvil publicada y verificada
- Fuente 2f5700ec56745abadd08d396fbc4018ee8db690c en main. Actions 42884427923 finalizó success con build y deploy aprobados. Hoja de estilos final leída de GitHub: coincide con la compilada.
- Verificado en la aplicación pública dentro de un viewport de 390 px: Exportar Excel aparece en Vanos debajo de Cargar o actualizar tramos, y en Resumen encima de los indicadores. CSS publicada assets/index-CHV7exMd.css.
- Primera comprobación con la dirección sin parámetro todavía recibió estilos anteriores; la consulta del botón dentro del iframe devolvió Runtime.evaluate timed out a los 3000 ms. Se comprobó una vez con la URL versionada y la observación visible confirmó el botón en las dos secciones.
- Enlace comprobado para abrir la actualización sin borrar datos del navegador: https://sebastiandc99.github.io/Avances-BD-LMT/?v=excel-movil-20261110. Misma aplicación y mismo origen de almacenamiento.
- Cambio limitado a visibilidad móvil. Función Excel, datos, fórmulas y documentos privados sin cambios.


## 10/11/2026 — selección múltiple en mapa: lógica y pruebas verificadas
- Se incorporan Selección simple y Selección múltiple, controles operativos exclusivos del Mapa. La múltiple alterna vanos no contiguos, permite ambas líneas, resalta la selección y avisa si el filtro de línea oculta alguno.
- Editar seleccionados permite revisar/quitar vanos y aplicar un estado y fecha común. Sin fecha de ejecución requiere una elección explícita para evitar atribuir la carga histórica al rendimiento.
- Cada cambio crea una revisión por vano en una única transacción local; conserva fotos, notas, responsable y cantidades reales. Pendiente pone la cantidad colocada en cero. Las nuevas revisiones usan la sincronización existente y actualizan resumen, rendimiento y exportación.
- Una versión modificada desde abrir la ventana, un conflicto o una selección/fecha inválida bloquea todo el lote antes de escribir. Los vanos elegidos se conservan para revisar el error; no hay guardados parciales silenciosos.
- Cuatro pruebas nuevas aprobadas: alternar/deduplicar selección de ambas líneas, preservar contenido/revisiones, pendiente/sin fecha y bloquear conflictos/versiones/fechas inválidas. Dos pruebas existentes de cámara también aprobadas. TypeScript, build:pages, verify:pages y control de documentos privados aprobados. Workflow preparado para 42 pruebas en total.
- Prueba real en viewport móvil de 390 px con datos aislados: dos toques seleccionaron 97–98 y 98–99, el modal guardó Terminado con 09/11/2026 en ambos, cerró y limpió marcas. Colores verdes y fecha en ficha individual comprobados. viewBox idéntico antes y después: 1920.2310063686823 2536.40440048089 110.87324726263515 144.61727903821975. Selección simple conservada.
- Incidencias de automatización de QA: selector svg[viewBox] coincidía con 23 SVG (iconos incluidos); se acotó al plano por su etiqueta. La tecla ArrowUp del control de fecha aumentó el mes a diciembre; la validación HTML bloqueó el guardado por fecha futura. Se corrigió con ArrowDown y se comprobó 09/11/2026 antes de guardar. Una lectura de atributo de fecha devolvió selector deadline exceeded; la fecha se verificó por el estado visible y la ficha guardada. No se cambiaron registros de producción.
- Sin imágenes nuevas, create_blob ni publicación de PDF/DWG. Se mantienen 237 piquetes, 235 vanos y 1.743 BD estimados. Fuente lista para conectar y publicar; Google Drive continúa con las credenciales propias pendientes.


### Interfaz de selección lista para desplegar
- Lógica y pruebas guardadas en 96c287f84a77ad5eb2b748149f048d6718e959f7.
- Botones de modo visibles en móvil y escritorio; contador, Editar seleccionados y Limpiar selección en modo múltiple. Seleccionar no abre fichas ni desplaza la cámara. Los vanos también admiten activación por teclado.
- Guardar el lote cierra el modal, vuelve al mapa en la misma posición, limpia las marcas y deja el modo múltiple disponible para continuar. Cambiar de modo con una ficha individual sin guardar usa la confirmación existente de cambios sin confirmar.
- Fuente preparada para Pages; despliegue y controles de producción se verifican al finalizar el workflow.


### Selección simple y múltiple publicadas y verificadas
- Fuente cea00cf9568f5142135c2114777bbc531d16e6ab en main. GitHub Actions 42917010051 completó build y deploy con success: 42 pruebas funcionales, TypeScript, compilación, rutas/inventario y control de documentos privados aprobados.
- Ocho archivos principales de interfaz, lógica, pruebas, workflow y guía comparados por SHA entre código validado y GitHub: cero diferencias.
- Verificación en la aplicación pública en viewport móvil de 390 px: botones de selección presentes, dos toques seleccionaron 97–98 y 98–99, Editar seleccionados abrió el modal con ambos y los controles comunes de estado y fecha. Se canceló sin escribir registros de producción.
- Verificación adicional en escritorio: ambos modos y contador operativo publicados; CSS assets/index-C6VWQmE6.css. App abierta para revisar en https://sebastiandc99.github.io/Avances-BD-LMT/?v=seleccion-multiple-20261110.
- Guardado completo y cámara conservada ya comprobados con datos aislados en la prueba móvil; ficha individual mostró la fecha y estado comunes después del guardado. No se publicaron registros de prueba.
- ESTADO actualizado; se mantienen 237 piquetes, 235 vanos y 1.743 BD estimados. No se generaron imágenes ni se publicaron PDF/DWG originales.


## 11/11/2026 — torta de avance: cálculo y Excel verificados
- Distribución global sobre 235 vanos de ambas líneas: terminados, en proceso (incluye observaciones) y pendientes. Los históricos sin fecha cuentan en el avance; no se cambia el rendimiento ni sus fechas.
- Modelo compartido para la torta de la app y el XLSX, con colores verde, amarillo y gris. No se generan imágenes para este gráfico ni se usa create_blob.
- Excel: gráfico circular nativo y editable debajo de los indicadores de Resumen, enlazado a A8:A10 y B8:B10. Se conservan las cuatro hojas, fórmulas, fechas y la imagen de vista aérea existente. La tabla conserva cantidades y porcentaje; se omiten etiquetas internas que se solapan en sectores pequeños.
- Plantilla actualizada mediante herramienta de planillas, manteniendo su formato y XML textual. La herramienta exportó cachés del gráfico vacías (ptCount=0); se completan con las tres categorías y cantidades reales al descargar, verificadas dentro del XLSX.
- Descarga real en vista de prueba independiente: 3 terminados, 1 en proceso y 231 pendientes coinciden entre app, celdas y gráfico. Los 18 XML/relaciones son válidos y la imagen del mapa permanece presente. Importación/recalculo del XLSX confirma los mismos conteos y un gráfico nativo; una mezcla descartable de 120/40/75 verifica sus tres colores. No se cargaron datos ficticios en producción.
- Pasaron seis pruebas afectadas de Excel/torta, TypeScript, compilación para Pages, verificación de rutas/inventario y control de documentos privados. Se conservan 237 piquetes, 235 vanos y 1.743 BD estimados.
- Errores técnicos acotados: lectura inicial de instrucciones respondió skill package is not available antes de iniciar el entorno; tras iniciarlo se leyó correctamente. La primera ejecución fuera del directorio temporal devolvió ERR_MODULE_NOT_FOUND @oai/artifact-tool; corregido el directorio, se ejecutó sin reinstalar dependencias. La espera de descarga desde el iframe agotó 30.000 ms; la descarga desde la pestaña directa funcionó en menos de dos segundos. No se repitió indefinidamente ninguna operación.
- Fuente preparada; falta confirmar guardado en GitHub y despliegue automático antes de presentar la actualización como publicada.


### Torta en la interfaz lista para desplegar
- Resumen incorpora la torta global con leyenda de los tres estados, cantidades y porcentajes sobre el total de ambas líneas. Diseño verificado a 390 px, sin desbordamiento; el gráfico y las cifras coinciden con los indicadores.
- Accesibilidad: descripción textual del gráfico y leyenda visible, sin depender únicamente del color. La vista Mapa y sus modos de selección permanecen dedicados a la carga.
- Validación final local aprobada: seis pruebas afectadas, TypeScript, build:pages, verify:pages y control de documentos privados. Se conserva la carga offline y no se modifican los registros guardados.
- Publicación pendiente de confirmar en Pages.


### Torta de avance publicada y verificada
- Fuente 38bf3eefd6bb631b7f76394074d99ec4689a8cb6, con lógica y Excel en fef070913c381e962b8844ee268ba4aefd37944c. GitHub Actions 42992773351 terminó correctamente: build 130429411676 y deploy 130429702408 success; pruebas funcionales, TypeScript, compilación y controles de publicación aprobados.
- Doce archivos modificados comparados por SHA entre el código validado y el árbol de GitHub: cero diferencias. El código está realmente guardado y compilado.
- Verificación visual en https://sebastiandc99.github.io/Avances-BD-LMT/?v=torta-avance-20261111: torta y leyenda de tres estados presentes en Resumen, con cantidades y porcentajes globales. La vista móvil de 390 px también fue revisada.
- Descarga real desde la aplicación pública completada: XLSX con gráfico circular nativo, referencias a las celdas de Resumen, cachés coherentes y mapa PNG conservado. ZIP y todos los XML/relaciones válidos. La prueba pública sin datos locales mostró 0/0/235; no representa ni modifica los registros que el usuario conserva en su navegador. La mezcla 3/1/231 y la actualización de fórmulas se verificaron por separado con datos aislados.
- Se evitaron porcentajes interiores superpuestos en los sectores pequeños del Excel; quedan sus tres colores y leyenda, más cantidades y porcentaje global en la tabla superior. La torta de la app muestra explícitamente los porcentajes de los tres estados.
- Captura de comprobación: el primer guardado respondió ENOENT porque no existía /workspace/shared; se creó el directorio y se guardaron los mismos bytes sin volver a capturar. No fue un fallo de la app.
- No se añadieron documentos originales ni recursos de imagen al repositorio. Se mantienen 237 piquetes, 235 vanos y 1.743 BD estimados. ESTADO actualizado; previsualización temporal detenida.


## 11/11/2026 — consulta de vanos montados por día: lógica verificada
- Se agrega un cálculo diario sobre la última revisión vigente de cada vano: estado Terminado y fecha de ejecución explícita igual al día elegido. No usa createdAt ni asigna fechas a cargas históricas sin fecha.
- El total diario reúne ambas líneas e incluye vanos y BD colocados, respetando las cantidades reales prioritarias o el cálculo por vano terminado. Cambiar una fecha mueve el vano de día; reabrirlo lo retira sin duplicaciones.
- Dos regresiones nuevas verifican ambos circuitos, exclusión de otros estados/sin fecha, cantidades reales y calculadas, coincidencia con la producción diaria del modelo, correcciones, reapertura y descarte de revisiones. Las 18 pruebas afectadas (modelo + consulta diaria) pasaron.
- TypeScript, compilación para Pages, verify:pages y control de documentos privados aprobados. El workflow incorpora la prueba diaria y conserva las anteriores.
- Permanecen 237 piquetes, 235 vanos y 1.743 BD estimados. Sin imágenes nuevas ni publicación de PDF/DWG.
- Lógica lista para guardar; interfaz y publicación se confirman por separado.


### Selector diario en Vanos listo para publicar
- Lógica y pruebas guardadas en 9c468c8ddbff5d36bb792470864b0e4795bb7877.
- Vanos incorpora Montados el día, total de vanos/BD de ambas líneas y Ver todas las fechas. El encabezado distingue filas visibles del total del día; la búsqueda y línea siguen operativas. El selector de estado refleja Terminado durante la consulta y recupera el estado previo al quitar la fecha.
- Prueba visual móvil de 390 px sobre datos aislados existentes: 09/11 → vanos 97–98 y 98–99, total 2 vanos/14 BD; 10/11 → 1 vano/8 BD. Filtrar la corta devuelve 0 de 2; buscar 97 devuelve 1 de 2 conservando el total diario. Quitar fecha y búsqueda devuelve 235 resultados. Mapa no muestra el selector diario.
- No se escribieron avances ficticios en producción ni se modificaron datos para verificar. El filtro solo consulta registros. El Excel completo y el Resumen conservan su alcance global.
- Incidencias acotadas de verificación: el tab de prueba anterior ya no existía (Tab not found); se creó uno nuevo. Una asignación a un nombre aún no declarado devolvió dailyQA is not defined después de crear la pestaña; se vinculó su ID observado. El rellenado automático del campo date cambió el valor DOM sin activar el cambio de React; se usaron controles de teclado nativos y se comprobó la actualización correcta. Sin fallos de compilación ni de la aplicación.
- Interfaz lista para despliegue; pendiente confirmar Pages.


### Consulta diaria publicada y verificada
- Fuente d52f9f6e0633fe2c05a07eed45dfd1c0e7777643 en main, con lógica 9c468c8ddbff5d36bb792470864b0e4795bb7877. GitHub Actions 43008212847 terminó con build 130480945157 y deploy 130481195543 success. Los logs confirman 47 pruebas aprobadas y cero fallos, además de TypeScript, compilación, rutas/inventario y privacidad.
- Nueve archivos de esta ampliación comparados por SHA con el árbol publicado: cero diferencias.
- Comprobación en la aplicación pública: Vanos muestra Montados el día y Ver todas las fechas; una fecha seleccionada restringe la tabla a terminados y muestra el total diario de vanos/BD. La prueba pública, sin datos locales de obra en ese navegador, muestra el estado vacío correcto. La prueba móvil con datos aislados confirmó los resultados 2 vanos/14 BD y 1 vano/8 BD, así como búsqueda, filtro de línea y retorno a los 235 resultados.
- URL verificada: https://sebastiandc99.github.io/Avances-BD-LMT/?v=vanos-por-dia-20261111. No se modificaron registros de producción para comprobar el filtro.
- El primer git diff --check contra la base local antigua marcó los CR de finales de línea ya existentes como trailing whitespace; la comprobación con core.whitespace=cr-at-eol pasó sin cambiar finales de línea ni archivos ajenos a la solicitud.
- Se mantiene el alcance global del Resumen y del Excel existente, el guardado offline y la selección del mapa. Inventario conservado: 237 piquetes, 235 vanos y 1.743 BD estimados. Sin imágenes ni documentos originales nuevos. Previsualización temporal detenida.


## 11/11/2026 — formato del Excel mejorado y verificado
- Resumen: cinco bloques de color para alcance, avance, desviadores, rendimiento y proyección; contornos de sección y bordes de tabla, encabezado oscuro, Arial 11 y títulos 17. Avance, BD colocados, promedios y proyección destacados en 13 puntos.
- Vanos: encabezados por grupos de columnas, filas alternadas, formato condicional verde/amarillo/gris según estado, anchos y alturas legibles. Encabezados e identificadores fijos al desplazarse. Rendimiento comparte tipografía, bordes y alternancia. Vista aérea conserva la imagen y mejora el encabezado.
- El generador respeta las alturas definidas en la plantilla y extiende la alternancia a los 235 vanos y a cualquier cantidad de días. Amplía filas con responsable/observaciones extensas, dentro del máximo admitido por Excel.
- Se mantienen las cuatro hojas, fechas numéricas, filtros, fórmulas y referencias de la torta. La plantilla continúa como XML textual, sin binarios/Base64 ni create_blob. No se generaron imágenes de contenido nuevas; las previsualizaciones son comprobaciones locales del formato y se reutilizó el mapa de prueba existente.
- Se importaron y recalcularon exportaciones producidas por el código real, con 3 terminados/1 en proceso y sin producción fechada. Los conteos, 1.743 BD y promedios coinciden con los anteriores. Cero errores de fórmula encontrados. Revisión visual de las cuatro hojas, más torta y estado sin fechas, aprobada. El mapa PNG conservó sus bytes.
- Pasaron las cinco pruebas afectadas de Excel, TypeScript, compilación, verify:pages y control de documentos privados. Nueva regresión verifica alturas, responsables/observaciones largos, alternancia hasta el último vano y conservación del formato condicional/paneles.
- Error concreto encontrado y corregido antes de publicar: la lectura de ht coincidía también con el sufijo de customHeight, generando alturas de 1 punto. Se exigieron límites de atributo en la expresión y se verificó con el XLSX y una regresión. La lectura inicial de instrucciones respondió skill package is not available antes de iniciar el entorno; quedó disponible al iniciarlo.
- No se modifican registros de obra ni cálculos de avance/rendimiento. Permanecen 237 piquetes, 235 vanos y 1.743 desviadores estimados. Fuente lista para guardar y desplegar; publicación pendiente de confirmación.


### Formato de Excel publicado y descarga comprobada
- Fuente 01de3aea8ef58bab893861177ac482f1296f1b0d en main. GitHub Actions 43035933170: build 130574606434 y deploy 130574978188 success. Logs: 48 pruebas aprobadas y cero fallos, TypeScript, compilación, inventario/rutas y control de documentos privados aprobados.
- Cinco archivos de esta ampliación comparados por SHA con GitHub: cero diferencias. Se compararon además todas las fórmulas/referencias y los datos completos de Resumen/Rendimiento con la exportación anterior de prueba: coinciden, al igual que los bytes del mapa reutilizado para esa comprobación.
- Descarga real desde https://sebastiandc99.github.io/Avances-BD-LMT/?v=excel-formato-20261111 completada. El archivo público conserva los estilos y los XML de las cuatro hojas idénticos al XLSX revisado con el mismo estado sin carga: cinco bloques de colores, alturas legibles, alternancia, formato condicional y paneles, torta nativa y mapa PNG presentes. Todos los XML/relaciones son válidos.
- Los casos con datos y sin fechas se revisaron mediante importación, recálculo y render de planillas; no se comprobó una instalación de Microsoft Excel. No se modificaron registros de obra ni se publicaron datos de prueba. La app requiere una nueva descarga para obtener el formato actualizado.
- Se mantienen 237 piquetes, 235 vanos y 1.743 desviadores estimados. No se añadieron PDF/DWG ni imágenes de contenido al repositorio. ESTADO actualizado.


## 11/11/2026 — investigación de una vista sin avances: recuperación pendiente
- Se suspenden cambios funcionales mientras se identifica el almacenamiento original o un respaldo. No se ejecutaron borrados, importaciones ni escrituras en registros de obra durante la investigación.
- Verificado el diff de la última actualización 01de3aea8ef58bab893861177ac482f1296f1b0d: solo exportador/plantilla de Excel, pruebas y documentación. No cambió el guardado, la base IndexedDB, su versión ni la asignación de cuenta.
- La base local continúa siendo avances-bd-lmt-v1, versión 1, con events y photos. La consulta filtra por propietario; el guardado agrega/actualiza y no vacía los almacenes. Vincular una cuenta mueve sus registros locales a esa cuenta, por lo que una sesión diferente puede mostrar otra vista. Esto es una posibilidad técnica, no una causa confirmada del incidente.
- La combinación con una nube vacía conserva los registros locales. Las seis regresiones de almacenamiento/sincronización pasaron. El service worker administra caché de recursos y no borra IndexedDB.
- Las consultas de diagnóstico de solo lectura no encontraron eventos ni cuentas en el proyecto de sincronización de esta app. La búsqueda en la carpeta de Drive configurada no encontró un respaldo JSON/Excel de avances; sus documentos originales permanecen privados y no fueron abiertos ni modificados.
- No se puede inspeccionar desde los conectores disponibles el almacenamiento del Chrome original del usuario. Para la recuperación se necesita volver a ese navegador/dispositivo o leer un Excel/JSON anterior. Un Excel permite reconstruir el estado al momento de su descarga, conservando fechas vacías; no sustituye por sí solo fotos e historial que no contiene.
- Todavía no se confirmó un borrado ni se recuperaron registros reales. No se deben confundir las comprobaciones con datos aislados de pruebas anteriores con los avances reales del usuario. Los datos recuperados no deben publicarse en GitHub.


## 11/11/2026 — revisión del respaldo aportado y estado de sincronización
- Se leyó el Excel aportado solo desde su adjunto privado. Contiene 235 vanos pendientes, sin fechas, cantidades reales, responsables ni observaciones recuperables. No se generó un respaldo de restauración vacío ni se publicaron sus bytes/celdas en el repositorio.
- No se confirmó la causa de la desaparición en el navegador original. La revisión previa comprobó ausencia de cuentas/eventos en la nube y de respaldo de avances en la carpeta de Drive configurada. Cerrar una ventana normal no debe equivaler a borrar IndexedDB; incógnito, perfil/dispositivo distinto o un navegador temporal siguen siendo posibilidades sin confirmar.
- La sincronización automática existente requiere una cuenta de la app iniciada. Se revisaron en la base real la tabla con RLS, las políticas por auth.uid(), el permiso de lectura de authenticated y la existencia/ejecución de lmt_append_event: configurados. No se alteraron permisos, cuentas ni registros para comprobarlo.
- Se añade un estado explícito de respaldo: sin cuenta siempre Solo en este navegador; errores, pendientes, desconexión, conflictos o falta de comprobación impiden mostrar éxito. Solo una verificación exitosa, sin pendientes/conflictos, permite Sincronización comprobada.
- Tres pruebas nuevas cubren la prevención de una confirmación falsa y la transición después de guardar/perder conexión/reintentar. Las nueve pruebas afectadas de estado de respaldo, almacenamiento y sincronización pasaron. TypeScript, compilación, verify:pages, privacidad y diff --check aprobados.
- Ningún dato de obra fue importado, borrado o restaurado durante esta etapa. No se cambiaron el nombre/versión de IndexedDB ni el mecanismo de lectura/guardado. Se mantienen 237 piquetes, 235 vanos y 1.743 BD estimados.
- Incidencia de lectura: una primera ruta relativa del adjunto no existía desde el directorio del repositorio; se utilizó la ruta absoluta provista y se leyó correctamente. No hubo fallos al abrir el Excel.
- Fuente lista para guardar. Recuperación real pendiente del navegador original o de un respaldo anterior que contenga los datos. La activación personal requiere que el usuario cree/ingrese a su cuenta; no se afirma que ya esté activa.


### Aviso de guardado listo para desplegar
- Lógica y regresiones guardadas en 0f55cd3759b989e69d925ef35019972d0b5d14a5.
- Aviso permanente en todas las secciones y botón Activar sincronización. La cabecera sin cuenta dice Solo en este equipo, incluso con cambios pendientes; el panel explica el alta única y la diferencia con estar conectado a Chrome/Google.
- El aviso cambia según el estado real de la sesión, red, cola, errores, conflictos y última comprobación. No se añadieron credenciales, una cuenta automática compartida ni permisos públicos sobre los avances.
- No había una herramienta de navegador habilitada para esta etapa; se omite la revisión visual y no se lanza una previsualización alternativa. Las comprobaciones locales de lógica, tipos y compilación sí quedaron aprobadas. Publicación pendiente de confirmar en Pages.


### Estado de respaldo publicado; recuperación aún pendiente
- Fuente 7df8f392289a0853267d8cdac75777d624fea0a7 en main, lógica 0f55cd3759b989e69d925ef35019972d0b5d14a5. GitHub Actions 43063618573 terminó success: build 130672552396 y deploy 130672827153. Logs: 51 pruebas aprobadas y cero fallos, además de tipos, compilación, inventario y privacidad.
- Diez archivos de esta ampliación comparados por SHA con el árbol remoto: cero diferencias. Lectura HTTP de https://sebastiandc99.github.io/Avances-BD-LMT/ obtuvo el bundle index-DJuoDKkv.js y confirmó los textos de sincronización desactivada y comprobada. No se presenta esa lectura como una prueba visual ni como un guardado real de la cuenta del usuario.
- La cuenta personal continúa siendo una activación que debe completar el usuario desde Activar sincronización; no se creó una cuenta con credenciales elegidas por el agente ni se afirma un respaldo automático activo antes de comprobarlo.
- No se pudo recuperar un avance real del archivo aportado: la tabla contiene únicamente pendientes y campos vacíos. La búsqueda de archivos disponibles no encontró otro Excel de avances. Se indicó buscar una descarga anterior y revisar el dispositivo/perfil original. No se alteró el original aportado ni se generó una restauración que invente registros.
- La causa exacta de la vista vacía sigue sin confirmar. Referencias técnicas revisadas: https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB y https://support.google.com/chrome/answer/95464?hl=es. El almacenamiento persistente normal se distingue de incógnito y de una copia en el servidor.
- Una consulta auxiliar de metadatos /pages no entregó el campo content esperado y su parseo produjo SyntaxError al recibir undefined; se completó la confirmación mediante el workflow y la lectura HTTP del sitio, sin reintentar indefinidamente esa consulta.
- Sin cambios de base, permisos, cantidades técnicas o datos personales. Ningún archivo privado de recuperación fue subido al repositorio público. Recuperación pendiente; las medidas para evitar confundir guardado local con respaldo ya están publicadas.


## 11/11/2026 — respaldo privado de recuperación generado y verificado
- Se recibió un segundo Excel que sí contiene avances. Se leyó y contrastó en privado; no se publican sus celdas, cantidades operativas, identificadores de respaldo ni enlaces privados en el repositorio.
- Se generó un archivo lmt-backup-v1 compatible con Importar JSON a partir de las filas con datos, preservando estados, fechas vacías/explícitas y cantidades reales. Los BD calculados por estado no se convierten en cantidades reales informadas. Los vanos pendientes sin registro mantienen el estado inicial.
- Validación contra los 235 IDs únicos del inventario, validProgress, validSpanId, versiones/UUID y almacenamiento aislado aprobada. Las métricas, estados por vano y resúmenes numéricos coinciden exactamente con el Excel fuente. Importar el mismo archivo dos veces no duplica los registros por ID.
- El respaldo quedó guardado de forma privada y persistente y se subió una copia a la carpeta de Drive ya configurada por el usuario. Se verificaron destino, tamaño y ausencia de compartición; una descarga de esa copia coincide byte por byte con el archivo validado mediante SHA-256. No se cambiaron permisos.
- El archivo reconstruye el estado al corte del Excel; las fotos individuales y el historial anterior no existen en esa fuente y no se inventaron. La fecha de recuperación es trazabilidad del archivo, no fecha de ejecución.
- No se importaron los datos reales en un navegador ajeno al dispositivo del usuario ni se crearon cuentas para sustituir su identidad. Resta que el usuario descargue el JSON y use Datos y respaldo → Importar JSON en su navegador, y active su cuenta para la sincronización automática posterior.
- La primera llamada del ejecutor informó No usable execution environment is available inmediatamente después del estado ready; al quedar disponibles las herramientas se completó la lectura, sin reiniciar la recuperación ni modificar el archivo original.
- La referencia de esta recuperación reemplaza la conclusión limitada al primer Excel vacío. No se cambió código de la app ni la base/versión de almacenamiento en esta etapa. Continúan los 237 piquetes, 235 vanos y 1.743 BD estimados del proyecto.


## 11/11/2026 — repositorio privado y conexión de respaldo GitHub
- Creado y verificado como privado el repositorio independiente Avances-BD-LMT-Datos. Rama main y carpeta backups preparadas; se verificó el commit de configuración. No se habilitó publicación web ni se transfirieron datos operativos.
- La revisión automática rechazó el intento de subir el JSON recuperado porque exige autorización específica para ese archivo y nuevo destino. No se reintentó por otra vía. La copia privada previamente verificada permanece disponible en Drive.
- Implementado servicio de respaldo de registros por equipo, con árbol UTF-8, commits y actualización sin force. Verifica destino privado, relee el contenido, evita commits duplicados y bloquea una vista vacía que omita registros ya guardados por ese equipo. No usa creación de blobs, imágenes ni Base64.
- Recuperación incorpora eventos por UUID conservando registros y fotografías locales existentes. Esta copia contiene registros y no fotografías; Exportar JSON completo mantiene su función.
- Ocho pruebas del servicio aprobadas: permisos/visibilidad, lectura posterior, duplicación, protección de copia previa, colisión de rama, verificación fallida, recuperación y exclusión de adjuntos/credenciales. Suite completa local: 59 pruebas aprobadas, cero fallos. TypeScript, build:pages, verify:pages e inspección de documentos privados aprobados.
- Primer chequeo de tipos informó exportación inexistente Github de lucide-react y Response.json de tipo unknown. Se corrigieron usando el icono existente Cloud y tipos explícitos; chequeo posterior aprobado. Avisos no bloqueantes del compilador: chunk mayor a 500 kB y variable npm http-proxy obsoleta.
- La app presenta un panel de activación con token granular restringido al repositorio de datos. El usuario debe generar y conectar esa autorización desde su dispositivo; no se afirma un guardado automático real hasta comprobarlo. No se crea una credencial compartida ni se registra un token en GitHub.
- Se mantienen 237 piquetes, 235 vanos y 1.743 BD estimados. No se modificó la base IndexedDB, sus claves, ni el acceso existente de Supabase. Publicación de la nueva conexión pendiente de verificar en Pages.

### Panel y autoguardado listos para publicación
- Incorporado Datos y respaldo → Respaldo automático en GitHub, con destino privado fijo, instrucciones de permiso granular y consentimiento visible al conectar. Recordar la credencial es optativo y está desmarcado por defecto; sin esa opción solo permanece en memoria.
- El proceso se monta en el panel principal, no únicamente al abrir configuración: sigue los cambios, red y retorno a la app, con reintentos limitados y pausa por autorización o privacidad. La confirmación se retira ante cambios nuevos, errores o desconexión; vuelve solo después de guardar o leer una copia idéntica.
- Agregada recuperación manual sin reemplazar UUID locales ni fotografías existentes. No cambia los estados de sincronización de Supabase ni presenta el respaldo GitHub como copia de las fotos.
- Controles y build locales aprobados. Código y pruebas del servicio ya guardados en commit 71426fe1e258f627e48e67cb6a394428169ba1d1; panel y workflow se guardan en un segundo commit. Activación con la credencial del usuario y primer envío real aún pendientes.

### Publicación confirmada del respaldo GitHub
- Fuente del panel 1992a5044dc1adae86510156dd1a185e88b54e47 guardada y publicada. GitHub Actions 43080722200: build 130732251764 y deploy 130732508703 completados con success. Logs: 59 pruebas aprobadas, cero fallos, tipos, compilación, privacidad e inventario verificados.
- Diez archivos de la ampliación comparados por SHA Git con main remoto: cero diferencias. Lectura HTTP obtuvo index-6qI5V41i.js e index-mJQP30Aj.css. Se abrió la app publicada y Datos y respaldo: se verificaron el panel GitHub, el destino privado, el campo de token, el permiso Contents: Read and write y la opción Recordar desmarcada. No se ingresaron credenciales ni datos reales en esa sesión de comprobación.
- Repositorio de datos con cuatro entradas esperadas: README, ESTADO_PROYECTO, backups y su archivo de preparación. Visibilidad privada confirmada mediante metadatos. No contiene el JSON recuperado ni fotografías/documentos originales.
- Pendiente que el usuario genere y conecte su autorización granular en la app, y que confirme la transferencia específica del JSON recuperado si quiere esa copia inicial en GitHub. La copia en Drive no se modifica. No se afirma sincronización activa del dispositivo antes del primer envío o lectura comprobados.
- Durante la comprobación visual el navegador informó Kernel state was reset after inactivity antes de ejecutar la apertura; se reabrió una vez y se verificó el resultado. No se repitieron operaciones de escritura ni se reinició el proyecto.


## 14/11/2026 — Exportación Power BI para febrero de 2025
- Objetivo de compatibilidad: Desktop 2.140.1454.0, 64 bits. Se cambia el informe de PBIR mejorado a diseño heredado report.json y metadato definition.pbir 1.0.
- Se conservan las tres páginas, los filtros y la navegación; las tarjetas usan el visual clásico. La descarga se identifica con PowerBI_Feb2025.
- Consultas y enlaces del diseño contrastados con muestras públicas de Microsoft anteriores a la versión objetivo. Se añaden pruebas de estructura del ZIP, alias de consulta, roles clásicos y ausencia de archivos PBIR mejorados.
- Las instrucciones explican cómo abrir PBIP y cargar las tablas, sin exigir PBIR mejorado ni una versión posterior de Desktop. Ver docs/POWERBI_COMPATIBILIDAD.md.
- La apertura real en la versión exacta de Desktop sigue pendiente de verificar. Las comprobaciones de estructura y compilación no se presentan como una prueba de apertura.
- Validación local aprobada: 78 pruebas, TypeScript, tres metadatos contra esquemas oficiales, enlaces de los 51 visuales, compilación, rutas, inventario y control de documentos privados. Publicación pendiente.

### Publicación del formato heredado confirmada
- Corrección autorizada por el usuario y publicada tras fusionar el PR #2. Comprobaciones de GitHub y despliegue de Pages completados correctamente.
- La publicación pasó 78 pruebas, TypeScript, validación de metadatos, enlaces del informe heredado, compilación y comprobación de rutas e inventario.
- La descarga se identifica con PowerBI_Feb2025. La apertura y visualización en Desktop 2.140.1454.0 siguen pendientes de comprobar en ese programa.
