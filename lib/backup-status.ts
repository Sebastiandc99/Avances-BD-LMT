export type BackupStatusInput={signedIn:boolean;online:boolean;syncing:boolean;pending:number;conflicts:number;lastVerified:string;error:string};
/** A connection or a local save alone never proves that a cloud backup exists. */
export function backupStatus(s:BackupStatusInput){
 if(!s.signedIn)return {kind:'local',tone:'warning',title:'Sincronización automática desactivada',detail:'Los datos se guardan solo en este navegador. Creá una cuenta o ingresá para activar la copia automática en la nube.'};
 if(s.conflicts)return {kind:'conflict',tone:'warning',title:'Hay cambios que requieren revisión',detail:`${s.conflicts} vano(s) tienen versiones diferentes. Revisalos en Datos y respaldo antes de dar la copia por completa.`};
 if(!s.online)return {kind:'offline',tone:'warning',title:'Sin conexión: trabajando con los datos del equipo',detail:s.pending?`${s.pending} registro(s) pendientes de subir. La app reintentará al recuperar conexión y estar abierta.`:'No se puede comprobar la nube ahora. La app volverá a consultarla al recuperar conexión.'};
 if(s.error)return {kind:'error',tone:'error',title:'No se pudo verificar la copia en la nube',detail:s.error};
 if(s.syncing)return {kind:'syncing',tone:'pending',title:'Comprobando la sincronización',detail:'Mantené la app abierta hasta que se confirme la copia en la nube.'};
 if(s.pending)return {kind:'pending',tone:'warning',title:`${s.pending} registro(s) pendientes de subir`,detail:'Están guardados en este equipo. La sincronización automática reintenta con la app abierta y conexión.'};
 if(!s.lastVerified)return {kind:'unverified',tone:'pending',title:'Copia en la nube todavía sin comprobar',detail:'Tener la sesión iniciada no confirma el respaldo. Esperá la comprobación de sincronización.'};
 return {kind:'verified',tone:'success',title:`Sincronización comprobada · ${s.lastVerified}`,detail:'No hay registros pendientes de subir. Usá esta misma cuenta para consultar los avances desde otro equipo.'};
}
