import { useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import Dashboard from '../app/dashboard';
import { cloudAdapter, supabase } from './cloud';
import { automaticSession } from '../lib/cloud-session';
import DeviceAccount, { SetPassword } from './DeviceAccount';
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
export default function App(){
 const [session,setSession]=useState<Session|null>(()=>{try{const cached=JSON.parse(localStorage.getItem('avances-bd-lmt-auth-v1')||'null');return typeof cached?.user?.id==='string'?cached:null;}catch{return null;}}),[loaded,setLoaded]=useState(true),[localOwner,setLocalOwner]=useState(storedOwner),[connecting,setConnecting]=useState(false),[cloudError,setCloudError]=useState(''),[revision,setRevision]=useState(0);
 const active=useRef(true),busy=useRef(false),sessionRef=useRef(session);sessionRef.current=session;
 function adopt(value:Session|null){if(!active.current)return;setSession(value);sessionRef.current=value;if(value){localStorage.setItem(ownerKey,value.user.id);setLocalOwner(value.user.id);}setLoaded(true);}
 async function ensureCloud(){
  if(busy.current||sessionRef.current||!navigator.onLine)return;
  busy.current=true;setConnecting(true);setCloudError('');
  try{adopt(await connectAutomatically());}catch(e){if(active.current)setCloudError(e instanceof Error?e.message:'Conexión con Supabase pendiente.');}finally{busy.current=false;if(active.current)setConnecting(false);}
 }
 useEffect(()=>{
  active.current=true;void ensureCloud();
  const {data}=supabase.auth.onAuthStateChange((_event,value)=>adopt(value));
  const resume=()=>void ensureCloud(),reload=()=>{setLocalOwner(storedOwner());setRevision(n=>n+1);};
  window.addEventListener('online',resume);window.addEventListener('lmt-account-records-ready',reload);
  return()=>{active.current=false;data.subscription.unsubscribe();window.removeEventListener('online',resume);window.removeEventListener('lmt-account-records-ready',reload);};
 },[]);
 const owner=session?.user.id;
 const adapter=useMemo(()=>owner?cloudAdapter(owner):undefined,[owner]);
 if(!loaded)return <main className="loading"><h1>Avances BD LMT</h1><p>Abriendo los datos del equipo…</p></main>;
 const accountPanel=<>{!session&&<section className="cloud-account"><p role="status">{cloudError||(connecting?'Conectando Supabase…':'Guardado automático pendiente de conectar.')}</p><button className="primary" disabled={connecting} onClick={()=>void ensureCloud()}>{connecting?'Conectando…':'Reintentar conexión automática'}</button></section>}<Account session={session}/></>;
 return <Dashboard key={(session&&!session.user.is_anonymous?owner:'device-app')+':'+revision} storageOwner={localOwner||undefined} autoCloud cloudConnecting={connecting} cloudError={cloudError} user={session?{id:session.user.id,name:session.user.email||'Este dispositivo',deviceOnly:!!session.user.is_anonymous}:null} cloud={adapter} accountPanel={accountPanel} basePath={import.meta.env.BASE_URL}/>;
}
