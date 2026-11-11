'use client';
import { useState } from 'react';
import { Cloud, LoaderCircle } from 'lucide-react';
import { GITHUB_DATA_REPO, GITHUB_DATA_URL, GITHUB_TOKEN_URL } from '../lib/github-backup';
import type { useGitHubBackup } from './use-github-backup';

export default function GitHubBackup({backup}:{backup:ReturnType<typeof useGitHubBackup>}){
 const [draft,setDraft]=useState(''),[remember,setRemember]=useState(false);
 return <section className="cloud-account"><h3><Cloud size={18}/> Respaldo automático en GitHub</h3>
  <p>Destino privado: <a href={GITHUB_DATA_URL} target="_blank" rel="noreferrer">{GITHUB_DATA_REPO}</a>.</p>
  <p>Guarda estados, fechas, cantidades, responsables y observaciones. Cada equipo conserva su archivo y las versiones anteriores. Las fotos se respaldan con Exportar JSON completo.</p>
  <p role="status"><b>{backup.title}</b>{backup.verified&&backup.last&&<> · {new Date(backup.last).toLocaleString('es-AR',{timeZone:'America/Argentina/Salta'})}</>}</p>
  {!backup.connected?<>
   <ol><li>Abrí <a href={GITHUB_TOKEN_URL} target="_blank" rel="noreferrer">crear autorización en GitHub</a>.</li><li>En <b>Repository access</b>, elegí <b>Only select repositories</b> y únicamente <b>Avances-BD-LMT-Datos</b>. El permiso debe ser <b>Contents: Read and write</b>.</li><li>Generá el token, copialo y pegalo abajo en esta app.</li></ol>
   <form className="drive-config" onSubmit={async e=>{e.preventDefault();if(await backup.connect(draft,remember))setDraft('');}}>
    <label>Token granular de GitHub<input type="password" autoComplete="off" spellCheck={false} value={draft} onChange={e=>setDraft(e.target.value)} placeholder="github_pat_…" required/></label>
    <label className="github-consent"><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Recordar autorización en este navegador para respaldar al volver a abrir la app.</label>
    <p>Al conectar autorizás enviar los registros actuales y sus cambios al repositorio privado indicado. La autorización recordada queda en este navegador; usá esta opción en tu propio dispositivo. No se envía al código público ni se incluye en los respaldos. Sin marcarla, dura mientras esta app siga abierta.</p>
    <button className="primary" disabled={backup.busy}>{backup.busy?<LoaderCircle size={16} className="spin"/>:<Cloud size={16}/>} Conectar y activar respaldo de registros</button>
   </form>
  </>:<><p>Los cambios se guardan después de cargar datos, al recuperar red o volver a la app. Mantenela abierta hasta ver la confirmación. La credencial tiene vencimiento; la app avisará si necesitás renovarla.</p><div className="dialog-actions"><button className="primary" disabled={backup.busy} onClick={()=>void backup.save()}>{backup.busy?<LoaderCircle size={16} className="spin"/>:<Cloud size={16}/>} Comprobar y guardar ahora</button><button className="outline" disabled={backup.busy} onClick={()=>void backup.restore()}>Recuperar registros de GitHub</button><button className="outline" disabled={backup.busy} onClick={backup.disconnect}>Desconectar este navegador</button></div></>}
  {backup.error&&<p className="error-text" role="alert">{backup.error}{backup.blocked&&' Reintentos automáticos detenidos. Revisá la autorización y usá Comprobar y guardar ahora o volvé a conectar.'}</p>}
  {backup.message&&<p role="status">{backup.message}</p>}
 </section>;
}
