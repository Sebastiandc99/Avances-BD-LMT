import { CheckCircle2, CloudOff, LoaderCircle } from 'lucide-react';
import { backupStatus, type BackupStatusInput } from '../lib/backup-status';

export default function BackupStatus({onOpen,compact=false,...input}:BackupStatusInput&{onOpen:()=>void;compact?:boolean}){
 const state=backupStatus(input);
 if(compact&&state.kind==='verified')return <section className="backup-compact" aria-label="Estado de guardado y sincronización" role="status"><CheckCircle2 size={16}/><span>{state.title}</span><button type="button" onClick={onOpen}>Ver detalle</button></section>;
 return <section className={'backup-banner '+state.tone} aria-label="Estado de guardado y sincronización" role="status">
  {state.kind==='verified'?<CheckCircle2 size={21}/>:state.kind==='syncing'||state.kind==='connecting'?<LoaderCircle size={21} className="spin"/>:<CloudOff size={21}/>}
  <div><b>{state.title}</b><p>{state.detail}</p></div>
  <button type="button" className="outline" onClick={onOpen}>{input.deviceOnly?'Conectar celular y PC':input.signedIn?'Revisar respaldo':input.autoConnect?'Revisar Supabase':'Activar sincronización'}</button>
 </section>;
}
