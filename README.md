# Avances BD LMT

**Aplicación web:** https://sebastiandc99.github.io/Avances-BD-LMT/

En GitHub Pages los registros y fotos quedan en cada navegador; exportar/importar JSON permite respaldarlos o transferirlos. No hay sincronización automática de nube en esa versión.

Los PDF y DWG originales no se publican. El repositorio conserva la app y sus datos derivados; el workflow comprueba que no se incorporen documentos originales o archivos comprimidos antes de publicar. Ver `scripts/check-public-files.mjs`.


Aplicación independiente para controlar el montaje de desviadores de vuelo de la LMT del Salar del Rincón. La geometría proviene del DWG suministrado: **237 piquetes, 235 vanos**, 218 en la línea larga y 17 en la corta FP. No incluye avances ficticios.

## Uso

- Acercar y arrastrar el plano; seleccionar un vano con un toque. Si hay varios dentro del área táctil de 52 px, elegir el vano en la lista.
- Registrar Pendiente, En proceso o Terminado. Fecha y cantidad real de BD opcionales; responsable, notas y hasta ocho fotos. Terminar un vano no inventa cantidades instaladas.
- Confirmar guarda una revisión en IndexedDB. Las revisiones anteriores conservan autoría y fecha. La cancelación no cambia los registros.
- Con sesión iniciada, los cambios se sincronizan con la base D1 y las fotos privadas con R2. Se usa la identidad de ChatGPT del sitio; los registros se separan por usuario. Esta versión es privada y su alcance es el mismo titular en varios dispositivos; no incluye gestión de cuadrillas multiusuario.
- Un conflicto entre dispositivos requiere elegir la versión a conservar. No se sobrescribe silenciosamente otro registro.
- Tras abrir el sitio una vez con conexión, el Service Worker conserva la aplicación, scripts y plano para trabajar sin señal. La primera instalación necesita red. Los registros locales quedan pendientes hasta recuperar conexión y sesión.
- Exportar CSV para planilla; JSON para respaldo completo con fotos. Importar incorpora registros sin borrar existentes y somete los conflictos a revisión. Datos del navegador borrados antes de sincronizar requieren restaurar un respaldo.

## Fuentes y límites del cómputo

`data/inventory.json` conserva el inventario validado y `public/assets/inventory.json` es su copia servida a la aplicación. La geometría del DWG se muestra sobre `public/assets/fondo-esquematico.svg`, un esquema local de 2,7 KB con la Ruta 51, el salar, relieve y referencias aproximadas. No contiene raster ni Base64 y funciona sin mapas online. Ver `docs/fondo-esquematico.md`.

`docs/calibration.json` contiene hashes, matriz afín y validaciones. RMS del ajuste entre representaciones del mismo plano: **0,656 m**, máximo **1,256 m**. No equivale a exactitud geográfica comprobada contra terreno. Datum declarado: POSGAR / Gauss-Krüger faja 3; validar marco y puntos de control con topografía.

El apartado 6.1.2 del procedimiento L0002-4111-Q-WIT-00047_0 establece un espaciado de 10 m en el 60 % central. Se propone `floor(0.60 × longitud_planta / 10) + 1`, centrado simétricamente, con **1.613 + 130 = 1.743 BD**. Redondeo, extremos y desarrollo del OPGW con flecha requieren validación. El usuario siempre confirma la cantidad real instalada.

El avance, la producción diaria y el rendimiento se miden por vanos terminados. Reabrir un vano resta uno; corregir la cantidad de BD no suma vanos. El promedio usa días calendario desde el primer vano terminado. Si no se indica fecha de actividad, la estadística usa el día del guardado en Argentina. La ETA divide los vanos pendientes por ese promedio; es orientativa. Las cantidades de BD se muestran como indicador secundario.

## Desarrollo

Node 22.13 o posterior. React, TypeScript, Vinext/Vite, SVG con zoom/pan/pinch, IndexedDB, D1 y R2. No requiere claves en el cliente. No contiene credenciales.

```sh
npm ci
npm run dev
node --experimental-strip-types --test tests/model.test.mjs
npx tsc --noEmit
npm run build
```

La configuración de despliegue está en `.openai/hosting.json`. La publicación privada conserva el inicio de sesión. Las migraciones Drizzle se aplican al desplegar. Para desarrollo local ver las herramientas de Sites incluidas en `scripts/`; los bindings declarados son DB y BUCKET. La fuente ejecutable recuperada está guardada en el repositorio privado `Sebastiandc99/Avances-BD-LMT`. Ver `ESTADO_PROYECTO.md` para los commits y las comprobaciones. La versión actual incluye fecha opcional, tres estados, rendimiento por vanos, selección azul y fondo esquemático independiente. Los registros históricos con observaciones se conservan y se muestran como En proceso.

