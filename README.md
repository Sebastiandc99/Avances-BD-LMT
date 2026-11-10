# Avances BD LMT

Aplicación independiente para controlar el montaje de desviadores de vuelo de la LMT del Salar del Rincón. La geometría proviene del DWG suministrado: **237 piquetes, 235 vanos**, 218 en la línea larga y 17 en la corta FP. No incluye avances ficticios.

## Uso

- Acercar y arrastrar el plano; seleccionar un vano con un toque. Si hay varios dentro del área táctil de 52 px, elegir el vano en la lista.
- Registrar Pendiente, En ejecución, Terminado o Con observaciones; fecha, cantidad real, responsable, notas y hasta ocho fotos.
- Confirmar guarda una revisión en IndexedDB. Las revisiones anteriores conservan autoría y fecha. La cancelación no cambia los registros.
- Con sesión iniciada, los cambios se sincronizan con la base D1 y las fotos privadas con R2. Se usa la identidad de ChatGPT del sitio; los registros se separan por usuario. Esta versión es privada y su alcance es el mismo titular en varios dispositivos; no incluye gestión de cuadrillas multiusuario.
- Un conflicto entre dispositivos requiere elegir la versión a conservar. No se sobrescribe silenciosamente otro registro.
- Tras abrir el sitio una vez con conexión, el Service Worker conserva la aplicación, scripts y plano para trabajar sin señal. La primera instalación necesita red. Los registros locales quedan pendientes hasta recuperar conexión y sesión.
- Exportar CSV para planilla; JSON para respaldo completo con fotos. Importar incorpora registros sin borrar existentes y somete los conflictos a revisión. Datos del navegador borrados antes de sincronizar requieren restaurar un respaldo.

## Fuentes y límites del cómputo

`data/inventory.json` conserva el inventario validado y `public/assets/inventory.json` es su copia servida a la aplicación. Esta recuperación muestra la geometría del DWG sobre fondo liso. El fondo esquemático independiente queda pendiente; no se incluyen imágenes ni mapas online.

`docs/calibration.json` contiene hashes, matriz afín y validaciones. RMS del ajuste entre representaciones del mismo plano: **0,656 m**, máximo **1,256 m**. No equivale a exactitud geográfica comprobada contra terreno. Datum declarado: POSGAR / Gauss-Krüger faja 3; validar marco y puntos de control con topografía.

El apartado 6.1.2 del procedimiento L0002-4111-Q-WIT-00047_0 establece un espaciado de 10 m en el 60 % central. Se propone `floor(0.60 × longitud_planta / 10) + 1`, centrado simétricamente, con **1.613 + 130 = 1.743 BD**. Redondeo, extremos y desarrollo del OPGW con flecha requieren validación. El usuario siempre confirma la cantidad real instalada.

El promedio de producción usa días calendario desde el primer incremento. Los cambios de cantidad se imputan a su fecha de actividad; las correcciones pueden restar. La ETA divide el cómputo propuesto restante por el promedio histórico, por lo que es orientativa.

## Desarrollo

Node 22.13 o posterior. React, TypeScript, Vinext/Vite, SVG con zoom/pan/pinch, IndexedDB, D1 y R2. No requiere claves en el cliente. No contiene credenciales.

```sh
npm ci
npm run dev
node --experimental-strip-types --test tests/model.test.mjs
npx tsc --noEmit
npm run build
```

La configuración de despliegue está en `.openai/hosting.json`. La publicación privada conserva el inicio de sesión. Las migraciones Drizzle se aplican al desplegar. Para desarrollo local ver las herramientas de Sites incluidas en `scripts/`; los bindings declarados son DB y BUCKET. La fuente ejecutable recuperada está guardada en el repositorio privado `Sebastiandc99/Avances-BD-LMT`. Ver `ESTADO_PROYECTO.md` para los commits y las comprobaciones. Esta sesión conserva la funcionalidad previa; fecha opcional, simplificación de estados y rendimiento por vanos siguen pendientes.

