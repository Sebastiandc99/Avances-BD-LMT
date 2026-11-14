export type BackupStatusInput={signedIn:boolean;online:boolean;syncing:boolean;pending:number;conflicts:number;lastVerified:string;error:string;autoConnect?:boolean;connecting?:boolean;deviceOnly?:boolean;savedRecords?:number};
/** A connection or a local save alone never proves that a cloud backup exists. */
export function backupStatus(s:BackupStatusInput){
 if(!s.signedIn&&s.autoConnect){
  if(!s.online)return {kind:'offline',tone:'warning',title:'Sin red: los registros quedan en este equipo',detail:'La conexión automática con Supabase se reintentará al recuperar señal con la app abierta.'};
  if(s.error)return {kind:'error',tone:'error',title:'Supabase todavía sin conectar',detail:s.error};
  return {kind:'connecting',tone:'pending',title:'Conectando el guardado automático en Supabase',detail:'La app prepara una sesión privada de este dispositivo. Todavía no se confirmó una copia en la nube.'};
 }
 if(!s.signedIn)return {kind:'local',tone:'warning',title:'Sincronización automática desactivada',detail:'Los datos se guardan solo en este navegador. Creá una cuenta o ingresá para activar la copia automática en la nube.'};
 if(s.conflicts)return {kind:'conflict',tone:'warning',title:'Hay cambios que requieren revisión',detail:`${s.conflicts} vano(s) tienen versiones diferentes. Revisalos en Datos y respaldo antes de dar la copia por completa.`};
 if(!s.online)return {kind:'offline',tone:'warning',title:'Sin conexión: trabajando con los datos del equipo',detail:s.pending?`${s.pending} registro(s) pendientes de subir. La app reintentará al recuperar conexión y estar abierta.`:'No se puede comprobar la nube ahora. La app volverá a consultarla al recuperar conexión.'};
 if(s.error)return {kind:'error',tone:'error',title:'No se pudo verificar la copia en la nube',detail:s.error};
 if(s.syncing)return {kind:'syncing',tone:'pending',title:'Comprobando la sincronización',detail:'Mantené la app abierta hasta que se confirme la copia en la nube.'};
 if(s.pending)return {kind:'pending',tone:'warning',title:`${s.pending} registro(s) pendientes de subir`,detail:'Están guardados en este equipo. La sincronización automática reintenta con la app abierta y conexión.'};
 if(!s.lastVerified)return {kind:'unverified',tone:'pending',title:'Copia en la nube todavía sin comprobar',detail:'Tener la sesión iniciada no confirma el respaldo. Esperá la comprobación de sincronización.'};
 if(s.deviceOnly&&s.savedRecords===0)return {kind:'empty-device',tone:'warning',title:'Esta sesión todavía no tiene avances',detail:'Si ya cargaste avances en el celular, vinculá tu correo desde ese celular e ingresá con la misma cuenta en esta PC.'};
 return {kind:'verified',tone:'success',title:`Sincronización comprobada · ${s.lastVerified}`,detail:s.deviceOnly?'Los registros están guardados en Supabase. Vinculá tu correo en Datos y respaldo para recuperar esta copia desde otro equipo.':'No hay registros pendientes de subir. Usá esta misma cuenta para consultar los avances desde otro equipo.'};
}
