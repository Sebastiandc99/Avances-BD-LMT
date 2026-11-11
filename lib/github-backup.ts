import { validProgress, validSpanId, type Event } from './model.ts';

export const GITHUB_DATA_REPO='Sebastiandc99/Avances-BD-LMT-Datos';
export const GITHUB_DATA_URL='https://github.com/'+GITHUB_DATA_REPO;
export const GITHUB_TOKEN_URL='https://github.com/settings/personal-access-tokens/new?name=Avances-BD-LMT-respaldo&target_name=Sebastiandc99&expires_in=90&contents=write';
const api='https://api.github.com/repos/'+GITHUB_DATA_REPO;
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
const backupPath=/^backups\/(equipo-[a-f0-9-]{36}|recuperado-\d{4}-\d{2}-\d{2})\.json$/i;
const maxBytes=4*1024*1024;
export class GitHubBackupError extends Error {
 status:number;
 constructor(message:string,status=0){super(message);this.status=status;}
}
async function request(token:string,path:string,init:RequestInit={},send:typeof fetch=fetch){
 const r=await send(api+path,{...init,cache:'no-store',redirect:'error',signal:AbortSignal.timeout(45000),headers:{Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28',...init.headers,Authorization:'Bearer '+token}});
 if(!r.ok){const detail=r.status===401?'La autorización venció o fue revocada. Volvé a conectar GitHub.':r.status===403?'GitHub rechazó el permiso de escritura o limitó las solicitudes. Revisá Contents: Read and write.':r.status===404?'No se puede acceder al repositorio privado. Revisá que el token incluya solo Avances-BD-LMT-Datos.':`GitHub respondió ${r.status}. La copia no se confirmó.`;throw new GitHubBackupError(detail,r.status);}
 return r;
}
export async function verifyGitHubRepo(token:string,send:typeof fetch=fetch){
 const repo=await (await request(token,'',{},send)).json() as {full_name:string;private:boolean;visibility:string;default_branch:string;archived?:boolean;permissions?:{push?:boolean}};
 if(repo.full_name!==GITHUB_DATA_REPO||repo.private!==true||repo.visibility!=='private'||repo.default_branch!=='main'||repo.archived)throw new GitHubBackupError('Se detuvo el respaldo: el destino debe ser el repositorio privado esperado, activo y con rama main.',400);
 if(repo.permissions?.push===false)throw new GitHubBackupError('Esta autorización no permite escribir en el repositorio de datos.',403);
}
function checkedEvent(value:unknown):Event{
 const e=value as Event;
 if(!validProgress(e)||!validSpanId(e.spanId)||!uuid.test(e.id)||!Number.isInteger(e.version)||e.version<1||e.baseVersion!==e.version-1||typeof e.author!=='string'||e.author.length>200||typeof e.createdAt!=='string'||!Number.isFinite(Date.parse(e.createdAt))||!['pending','synced','conflict','discarded'].includes(e.sync))throw new GitHubBackupError('El respaldo contiene registros inválidos.',400);
 // Explicit allowlist: never serialize credentials, source documents or photographs.
 return {id:e.id,spanId:e.spanId,status:e.status,date:e.date,installed:e.installed,responsible:e.responsible,notes:e.notes,photos:[],version:e.version,baseVersion:e.baseVersion,createdAt:e.createdAt,author:e.author,sync:e.sync};
}
export function githubRecords(events:Event[]){
 if(events.length>50000)throw new GitHubBackupError('El respaldo supera el límite de registros.',400);
 const list=events.map(checkedEvent).sort((a,b)=>a.id.localeCompare(b.id));
 if(new Set(list.map(e=>e.id)).size!==list.length)throw new GitHubBackupError('Hay registros repetidos en el respaldo.',400);
 return JSON.stringify(list);
}
export function parseGitHubBackup(text:string):Event[]{
 if(new Blob([text]).size>maxBytes)throw new GitHubBackupError('El respaldo supera 4 MB.',400);
 const b=JSON.parse(text);
 if(b.format!=='lmt-backup-v1'||!Array.isArray(b.events)||!Array.isArray(b.photos)||b.photos.length)throw new GitHubBackupError('El archivo no es un respaldo compatible de registros sin fotografías.',400);
 return JSON.parse(githubRecords(b.events));
}
/** Append only by UUID. An existing local event, including its photos, is never replaced. */
export function mergeGitHubRecords(local:Event[],incoming:Event[]){
 const ids=new Set(local.map(e=>e.id));
 return [...local,...incoming.filter(e=>{if(ids.has(e.id))return false;ids.add(e.id);return true;}).map(e=>({...e,sync:e.sync==='discarded'?'discarded' as const:'pending' as const}))];
}
async function readBackup(token:string,path:string,ref:string,send:typeof fetch){
 if(!backupPath.test(path))throw new GitHubBackupError('Ruta de respaldo inválida.',400);
 const r=await request(token,'/contents/'+path+'?ref='+encodeURIComponent(ref),{headers:{Accept:'application/vnd.github.raw+json'}},send);
 const text=await r.text();parseGitHubBackup(text);return text;
}
export async function restoreGitHubBackups(token:string,send:typeof fetch=fetch){
 await verifyGitHubRepo(token,send);
 const head=await (await request(token,'/git/ref/heads/main',{},send)).json() as {object:{sha:string}};
 const entries=await (await request(token,'/contents/backups?ref='+head.object.sha,{},send)).json();
 if(!Array.isArray(entries)||entries.length>=1000)throw new GitHubBackupError('No se pudo enumerar el directorio completo de respaldos.',400);
 let all:Event[]=[];
 for(const f of entries){if(f.type!=='file'||!backupPath.test(f.path))continue;const text=await readBackup(token,f.path,head.object.sha,send);all=mergeGitHubRecords(all,parseGitHubBackup(text));}
 return all;
}
/** Raw UTF-8 Git trees; no image encoding, no blob-creation endpoint, no forced ref update. */
export async function saveGitHubBackup(token:string,events:Event[],device:string,send:typeof fetch=fetch){
 if(!uuid.test(device))throw new GitHubBackupError('Identificador de equipo inválido.',400);
 const signature=githubRecords(events);
 const content=JSON.stringify({format:'lmt-backup-v1',scope:'records-only',createdAt:new Date().toISOString(),events:JSON.parse(signature),photos:[]},null,2);
 if(new Blob([content]).size>maxBytes)throw new GitHubBackupError('El respaldo supera 4 MB. Exportá un JSON completo y revisá el historial.',400);
 await verifyGitHubRepo(token,send);
 const path='backups/equipo-'+device+'.json';
 for(let attempt=0;attempt<2;attempt++){
  const head=await (await request(token,'/git/ref/heads/main',{},send)).json() as {object:{sha:string}};
  let existing:string|null=null;
  try{existing=await readBackup(token,path,head.object.sha,send);}catch(e){if(!(e instanceof GitHubBackupError)||e.status!==404)throw e;}
  if(existing!==null){
   const previous=parseGitHubBackup(existing),current=JSON.parse(signature) as Event[];
   const currentIds=new Set(current.map(e=>e.id));
   if(previous.some(e=>!currentIds.has(e.id)))throw new GitHubBackupError('La copia de este equipo tiene registros que faltan aquí. Usá Recuperar registros antes de volver a guardar.',400);
   if(githubRecords(previous)===signature)return {sha:head.object.sha,at:new Date().toISOString()};
  }
  const parent=await (await request(token,'/git/commits/'+head.object.sha,{},send)).json() as {tree:{sha:string}};
  const tree=await (await request(token,'/git/trees',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({base_tree:parent.tree.sha,tree:[{path,mode:'100644',type:'blob',content}]})},send)).json() as {sha:string};
  const commit=await (await request(token,'/git/commits',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:'Respaldo automático de registros del equipo',tree:tree.sha,parents:[head.object.sha]})},send)).json() as {sha:string};
  try{await request(token,'/git/refs/heads/main',{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({sha:commit.sha,force:false})},send);}catch(e){if(e instanceof GitHubBackupError&&[409,422].includes(e.status)&&attempt===0)continue;throw e;}
  const verified=await readBackup(token,path,'main',send);
  if(verified!==content)throw new GitHubBackupError('GitHub no devolvió la misma copia. El respaldo no se da por confirmado.');
  return {sha:commit.sha,at:new Date().toISOString()};
 }
 throw new GitHubBackupError('Otro equipo actualizó GitHub. La copia quedó pendiente; volvé a intentar.');
}
