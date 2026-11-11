import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import Dashboard from '../app/dashboard';
import { cloudAdapter, supabase } from './cloud';
import { Cloud, LogOut } from 'lucide-react';
function Account({session}:{session:Session|null}){
 const [mode,setMode]=useState<'signin'|'signup'>('signin'),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[confirmLink,setConfirmLink]=useState('');
 async function submit(e:React.FormEvent){
  e.preventDefault();setBusy(true);setMessage('');
  try{
   const result=mode==='signup'?await supabase.auth.signUp({email:email.trim(),password,options:{emailRedirectTo:location.origin+import.meta.env.BASE_URL}}):await supabase.auth.signInWithPassword({email:email.trim(),password});
   if(result.error)throw result.error;
   setPassword('');
   if(mode==='signup'&&!result.data.session){setMessage('Revisá tu correo y confirmá la cuenta. Después volvé a esta app e ingresá con tu correo y contraseña.');setMode('signin');}
  }catch(e){const msg=e instanceof Error?e.message:'No se pudo conectar.';setMessage(msg==='Invalid login credentials'?'Correo o contraseña incorrectos.':msg==='Email not confirmed'?'Confirmá primero el correo recibido al crear tu cuenta.':msg==='Failed to fetch'?'No hay conexión con la nube. Tus avances siguen guardados en este equipo.':msg);}
  finally{setBusy(false);}
 }
 async function confirmEmail(e:React.FormEvent){
  e.preventDefault();setBusy(true);setMessage('');
  try{
   const link=new URL(confirmLink.trim());
   if(link.origin!=='https://ynhvceqjhcydsteyzrpt.supabase.co'||link.pathname!=='/auth/v1/verify'||!['signup','email'].includes(link.searchParams.get('type')||''))throw Error('Copiá el enlace de confirmación del correo de esta app.');
   const token=link.searchParams.get('token_hash')||link.searchParams.get('token');if(!token)throw Error('El enlace está incompleto.');
   const {error}=await supabase.auth.verifyOtp({token_hash:token,type:'signup'});if(error)throw error;setConfirmLink('');
  }catch(e){setMessage(e instanceof Error?e.message:'No se pudo confirmar el correo.');}finally{setBusy(false);}
 }
 return <section className="cloud-account"><h3><Cloud size={18}/> Nube privada</h3>{session?<><p>Cuenta: <b>{session.user.email}</b></p><p>Con esta sesión iniciada, cada guardado activa la sincronización y los pendientes se reintentan al recuperar señal con la app abierta. Esperá el aviso Sincronización comprobada. Usá esta misma cuenta en otro equipo; los avances y fotos son privados.</p><button className="outline" disabled={busy} onClick={async()=>{setBusy(true);const {error}=await supabase.auth.signOut({scope:'local'});if(error)setMessage(error.message);setBusy(false);}}><LogOut size={16}/> Cerrar sesión en este equipo</button></>:<><p>La sincronización requiere una cuenta de esta app. Estar conectado a Chrome o Google no la activa. Creá tu cuenta una vez, confirmá el correo e ingresá. Después, los avances se suben automáticamente con conexión y la app abierta; al recuperar señal se reintenta.</p><div className="dialog-actions"><button className={mode==='signin'?'primary':'outline'} onClick={()=>setMode('signin')}>Ingresar</button><button className={mode==='signup'?'primary':'outline'} onClick={()=>setMode('signup')}>Crear cuenta</button></div><form onSubmit={submit}><label>Correo electrónico<input type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} disabled={busy}/></label><label>Contraseña<input type="password" minLength={mode==='signup'?8:1} autoComplete={mode==='signup'?'new-password':'current-password'} required value={password} onChange={e=>setPassword(e.target.value)} disabled={busy}/></label><button className="primary" disabled={busy}>{busy?'Conectando…':mode==='signup'?'Crear mi cuenta':'Ingresar y sincronizar'}</button></form><details className="spaced"><summary>Confirmar con el enlace del correo</summary><p>También podés copiar el enlace del botón de confirmación del correo y pegarlo acá, sin abrir otra página.</p><form onSubmit={confirmEmail}><label>Enlace de confirmación<input type="url" autoComplete="off" required value={confirmLink} onChange={e=>setConfirmLink(e.target.value)}/></label><button className="outline" disabled={busy}>Confirmar correo e ingresar</button></form></details></>}{message&&<p role="status">{message}</p>}</section>;
}
export default function App(){
 const [session,setSession]=useState<Session|null>(()=>{try{const cached=JSON.parse(localStorage.getItem('avances-bd-lmt-auth-v1')||'null');return typeof cached?.user?.id==='string'?cached:null;}catch{return null;}}),[loaded,setLoaded]=useState(true);
 useEffect(()=>{
  let active=true;
  // The persisted session keeps the same local owner available while offline.
  supabase.auth.getSession().then(({data})=>{if(active){setSession(data.session);setLoaded(true);}}).catch(()=>{if(active)setLoaded(true);});
  const {data}=supabase.auth.onAuthStateChange((_event,value)=>{if(active){setSession(value);setLoaded(true);}});
  return()=>{active=false;data.subscription.unsubscribe();};
 },[]);
 const owner=session?.user.id;
 const adapter=useMemo(()=>owner?cloudAdapter(owner):undefined,[owner]);
 if(!loaded)return <main className="loading"><h1>Avances BD LMT</h1><p>Abriendo los datos del equipo…</p></main>;
 return <Dashboard key={owner||'local-device'} user={session?{id:session.user.id,name:session.user.email||'Mi cuenta'}:null} cloud={adapter} accountPanel={<Account session={session}/>} basePath={import.meta.env.BASE_URL}/>;
}
