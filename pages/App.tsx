import { useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import Dashboard from '../app/dashboard';
import { cloudAdapter, supabase } from './cloud';
import { automaticSession } from '../lib/cloud-session';
import DeviceAccount, { SetPassword } from './DeviceAccount';
import PairDevices from './PairDevices';
import { workspaceForDevice } from './workspace';
import { readStore, saveLocal } from '../lib/storage';
import type { Event as LmtEvent, Photo } from '../lib/model';
import { Cloud, LogOut } from 'lucide-react';
const ownerKey='lmt-last-cloud-owner';
const storedOwner=()=>{try{return localStorage.getItem(ownerKey)||'';}catch{return '';}};
const connectAutomatically=automaticSession<Session>(supabase.auth,()=>!!storedOwner());
function Account({session,sourceOwner,existingOnly=false}:{session:Session|null;sourceOwner?:string;existingOnly?:boolean}){
 const [mode,setMode]=useState<'signin'|'signup'>('signin'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[confirmLink,setConfirmLink]=useState('');
 async function submit(e:React.FormEvent){
  e.preventDefault();setBusy(true);setMessage('');
  try{
   const previous=sourceOwner?await Promise.all([readStore<LmtEvent>('events',sourceOwner),readStore<Photo>('photos',sourceOwner)]):null;
   const result=mode==='signup'?await supabase.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:location.origin+import.meta.env.BASE_URL}}):await supabase.auth.signInWithPassword({email:email.trim(),password});
   if(result.error)throw result.error;
   if(result.data.session&&previous){const [es,ps]=previous;await saveLocal(result.data.session.user.id,es.map(e=>({...e,sync:e.sync==='discarded'?'discarded':'pending'})),ps.map(p=>({...p,uploaded:false})));window.dispatchEvent(new Event('lmt-account-records-ready'));}
   setPassword('');
   if(mode==='signup'&&!result.data.session){setMessage('Revisá tu correo y confirmá la cuenta. Después volvé a esta app e ingresá con tu correo y contraseña.');setMode('signin');}
  }catch(e){const msg=e instanceof Error?e.message:'No se pudo conectar.';setMessage(msg==='Invalid login credentials'?'Correo o contraseña incorrectos.':msg==='Email not confirmed'?'Confirmá primero el correo recibido al crear tu cuenta.':msg==='Failed to fetch'?'No hay conexión con la nube. Tus avances siguen guardados en este equipo.':msg);}
  finally{setBusy(false);}
 }
 async function confirmEmail(e:React.FormEvent){
  e.preventDefault();setBusy(true);setMessage('');
  try{
   const link=new URL(confirmLink.trim());
   if(link.origin!=='https://ynhvceqjhcydsteyzrpt.supabase.co'||link.pathname!=='/auth/v1/verify'||!['signup','email','email_change','magiclink'].includes(link.searchParams.get('type')||''))throw Error('Copiá el enlace de confirmación del correo de esta app.');
   const token=link.searchParams.get('token_hash')||link.searchParams.get('token');if(!token)throw Error('El enlace está incompleto.');
   const {error}=await supabase.auth.verifyOtp({token_hash:token,type:(link.searchParams.get('type')||'signup') as 'signup'|'email'|'email_change'|'magiclink'});if(error)throw error;setConfirmLink('');
  }catch(e){setMessage(e instanceof Error?e.message:'No se pudo confirmar el correo.');}finally{setBusy(false);}
 }
 return <section className="cloud-account"><h3><Cloud size={18}/> {existingOnly?'Ingresar con mi cuenta vinculada':'Guardado automático en Supabase'}</h3>{session?.user.is_anonymous?<><DeviceAccount/><details className="spaced" open><summary>Abrir mis avances del celular en esta PC</summary><p>Primero vinculá tu correo y definí una contraseña desde el celular donde ves los avances. Después ingresá aquí con esa misma cuenta.</p><Account session={null} sourceOwner={session.user.id} existingOnly/></details><details className="spaced"><summary>Confirmar correo con su enlace</summary><form onSubmit={confirmEmail}><label>Enlace de confirmación<input type="url" required value={confirmLink} onChange={e=>setConfirmLink(e.target.value)}/></label><button className="outline" disabled={busy}>Confirmar correo</button></form></details></>:session?<><p>Cuenta: <b>{session.user.email}</b></p><p>Con esta sesión iniciada, cada guardado activa la sincronización y los pendientes se reintentan al recuperar señal con la app abierta. Esperá el aviso Sincronización comprobada. Usá esta misma cuenta en otro equipo; los avances y fotos son privados.</p><SetPassword/><button className="outline" disabled={busy} onClick={async()=>{setBusy(true);const {error}=await supabase.auth.signOut({scope:'local'});if(error)setMessage(error.message);else{localStorage.removeItem(ownerKey);window.dispatchEvent(new Event('lmt-account-records-ready'));}setBusy(false);}}><LogOut size={16}/> Cerrar sesión en este equipo</button></>:<><p>{existingOnly?'Usá el correo y la contraseña de la app que vinculaste en el celular.':'La sesión automática pertenece a este navegador. Para compartir tus avances entre equipos, vinculá tu correo en el dispositivo donde ya están cargados.'}</p>{!existingOnly&&<div className="dialog-actions"><button className={mode==='signin'?'primary':'outline'} onClick={()=>setMode('signin')}>Ingresar</button><button className={mode==='signup'?'primary':'outline'} onClick={()=>setMode('signup')}>Crear cuenta</button></div>}<form onSubmit={submit}><label>Correo electrónico<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} disabled={busy}/></label><label>Contraseña<input type="password" minLength={mode==='signup'?8:1} autoComplete={mode==='signup'?'new-password':'current-password'} required value={password} onChange={e=>setPassword(e.target.value)} disabled={busy}/></label><button className="primary" disabled={busy}>{busy?'Conectando…':mode==='signup'?'Crear mi cuenta':'Ingresar y sincronizar'}</button></form><details className="spaced"><summary>Confirmar con el enlace del correo</summary><p>También podés copiar el enlace del botón de confirmación del correo y pegarlo acá, sin abrir otra página.</p><form onSubmit={confirmEmail}><label>Enlace de confirmación<input type="url" autoComplete="off" required value={confirmLink} onChange={e=>setConfirmLink(e.target.value)}/></label><button className="outline" disabled={busy}>Confirmar correo e ingresar</button></form></details></>}{message&&<p role="status">{message}</p>}</section>;
}
const workspaceKey=(id:string)=>'lmt-device-workspace:'+id;
function cachedWorkspace(id:string){
 try{return localStorage.getItem(workspaceKey(id))||id;}catch{return id;}
}
export default function App(){
 const [session,setSession]=useState<Session|null>(()=>{try{const cached=JSON.parse(localStorage.getItem('avances-bd-lmt-auth-v1')||'null');return typeof cached?.user?.id==='string'?cached:null;}catch{return null;}});
 const [localOwner,setLocalOwner]=useState(storedOwner);
 const [workspace,setWorkspace]=useState(()=>session?cachedWorkspace(session.user.id):storedOwner());
 const [resolvedAuth,setResolvedAuth]=useState(''),[connecting,setConnecting]=useState(false),[cloudError,setCloudError]=useState(''),[revision,setRevision]=useState(0);
 const active=useRef(true),busy=useRef(false),sessionRef=useRef(session),workspaceJob=useRef<Promise<void>|null>(null);
 sessionRef.current=session;
 function adopt(value:Session|null){
  if(!active.current)return;
  const previous=sessionRef.current?.user.id;
  setSession(value);sessionRef.current=value;
  if(value){
   localStorage.setItem(ownerKey,value.user.id);setLocalOwner(value.user.id);
   if(previous!==value.user.id){setWorkspace(cachedWorkspace(value.user.id));setResolvedAuth('');}
  }else setResolvedAuth('');
 }
 async function resolveWorkspace(){
  if(workspaceJob.current)return workspaceJob.current;
  const id=sessionRef.current?.user.id;if(!id||!navigator.onLine)return;
  workspaceJob.current=(async()=>{
   setConnecting(true);
   try{
    const {owner,copied}=await workspaceForDevice(id);
    if(!active.current||sessionRef.current?.user.id!==id)return;
    localStorage.setItem(workspaceKey(id),owner);
    setWorkspace(owner);setResolvedAuth(id);setCloudError('');if(copied)setRevision(n=>n+1);
   }catch(e){
    if(active.current&&sessionRef.current?.user.id===id){
     setResolvedAuth('');setCloudError(e instanceof Error?e.message:'No se pudo conectar el equipo.');
    }
    throw e;
   }finally{if(active.current)setConnecting(false);}
  })().finally(()=>{workspaceJob.current=null;});
  return workspaceJob.current;
 }
 async function ensureCloud(){
  if(busy.current||sessionRef.current||!navigator.onLine)return;
  busy.current=true;setConnecting(true);setCloudError('');
  try{adopt(await connectAutomatically());}catch(e){if(active.current)setCloudError(e instanceof Error?e.message:'Conexion con Supabase pendiente.');}finally{busy.current=false;if(active.current)setConnecting(false);}
 }
 async function recoverWithCode(){
  if(busy.current||!navigator.onLine)return;
  busy.current=true;setConnecting(true);
  try{const {data,error}=await supabase.auth.signInAnonymously();if(error)throw error;adopt(data.session);setCloudError('');}
  catch(e){setCloudError(e instanceof Error?e.message:'No se pudo preparar el acceso con codigo.');}
  finally{busy.current=false;setConnecting(false);}
 }
 useEffect(()=>{
  active.current=true;void ensureCloud();
  const {data}=supabase.auth.onAuthStateChange((_event,value)=>adopt(value));
  const resume=()=>void ensureCloud(),reload=()=>{setLocalOwner(storedOwner());setRevision(n=>n+1);};
  window.addEventListener('online',resume);window.addEventListener('lmt-account-records-ready',reload);
  return()=>{active.current=false;data.subscription.unsubscribe();window.removeEventListener('online',resume);window.removeEventListener('lmt-account-records-ready',reload);};
 },[]);
 useEffect(()=>{
  if(!session?.user.id)return;
  const resume=()=>{if(document.visibilityState==='visible')void resolveWorkspace().catch(()=>{});};
  resume();const timer=setInterval(resume,45000);
  window.addEventListener('online',resume);window.addEventListener('focus',resume);document.addEventListener('visibilitychange',resume);
  return()=>{clearInterval(timer);window.removeEventListener('online',resume);window.removeEventListener('focus',resume);document.removeEventListener('visibilitychange',resume);};
 },[session?.user.id]);
 const connected=!!session&&resolvedAuth===session.user.id;
 const adapter=useMemo(()=>connected&&workspace?cloudAdapter(workspace):undefined,[connected,workspace]);
 const accountPanel=<>
  {session?<><section className="cloud-account"><h3>Guardado automatico en Supabase</h3><p>Cada cambio se guarda en el equipo y se sincroniza al recuperar conexion con la app abierta.</p>{!connected&&<><p role="status">{cloudError||'Comprobando la conexion del equipo…'}</p><button className="outline" disabled={connecting} onClick={()=>void resolveWorkspace().catch(()=>{})}>Reintentar conexion</button></>}</section>
   {connected&&<PairDevices linked={workspace!==session.user.id} onLinked={async()=>{setResolvedAuth('');await workspaceJob.current;await resolveWorkspace();}}/>}
   <details className="spaced"><summary>Acceso con correo (opcional)</summary><Account session={session}/></details></>:
   <section className="cloud-account"><p role="status">{cloudError||(connecting?'Conectando Supabase…':'Guardado automatico pendiente de conectar.')}</p>
    <button className="primary" disabled={connecting} onClick={()=>void ensureCloud()}>Reintentar conexion automatica</button>
    <button className="outline" disabled={connecting} onClick={()=>void recoverWithCode()}>Usar codigo de otro equipo</button>
   </section>}
 </>;
 return <Dashboard key={(session&&!session.user.is_anonymous?session.user.id:'device-app')+':'+revision}
  storageOwner={workspace||localOwner||undefined} autoCloud cloudConnecting={connecting} cloudError={cloudError}
  user={connected&&session?{id:workspace,name:session.user.email||'Este dispositivo',deviceOnly:!!session.user.is_anonymous}:null}
  cloud={adapter} accountPanel={accountPanel} basePath={import.meta.env.BASE_URL}/>;
}
