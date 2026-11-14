import { useState } from 'react';
import { supabase } from './cloud';

export default function PairDevices({linked,onLinked}:{linked:boolean;onLinked:()=>Promise<void>}){
 const [code,setCode]=useState(''),[expires,setExpires]=useState(''),[input,setInput]=useState('');
 const [busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function generate(){
  if(busy)return;
  setBusy(true);setMessage('');
  try{
   const {data,error}=await supabase.rpc('lmt_create_pairing');
   if(error)throw error;
   if(!data?.code||!data?.expires_at)throw Error('No se recibio el codigo.');
   setCode(data.code.match(/.{1,4}/g).join('-'));setExpires(data.expires_at);
  }catch(e){setMessage(e instanceof Error?e.message:'No se pudo generar el codigo.');}
  finally{setBusy(false);}
 }
 async function join(event:React.FormEvent){
  event.preventDefault();if(busy)return;
  setBusy(true);setMessage('');
  try{
   const {error}=await supabase.rpc('lmt_pair_device',{p_code:input.trim()});
   if(error)throw error;
   await onLinked();setInput('');setCode('');
   setMessage('Equipo vinculado. La app descargara los avances y sincronizara los cambios automaticamente.');
  }catch(e){setMessage(e instanceof Error?e.message:'No se pudo vincular el equipo.');}
  finally{setBusy(false);}
 }
 return <section className="cloud-account"><h3>Conectar celular y PC</h3>
  <p>{linked?'Este equipo comparte los avances con el dispositivo que lo vinculo.':'Cada guardado se envia a Supabase al tener conexion. Conecta tus otros equipos una sola vez para ver y actualizar los mismos avances.'}</p>
  <p><b>En el celular donde ves tus avances</b>, genera un codigo y copialo en el otro equipo.</p>
  <button className="outline" disabled={busy} onClick={()=>void generate()}>{busy?'Procesando…':'Generar codigo para otro equipo'}</button>
  {code&&<div className="spaced"><label>Codigo de vinculacion<output style={{display:'block',fontSize:20,fontWeight:700,overflowWrap:'anywhere'}}>{code}</output></label>
   <p>Valido hasta {new Date(expires).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'})}. Da acceso a tus avances. Usalo solo en tus equipos.</p>
   <button className="outline" onClick={async()=>{try{await navigator.clipboard.writeText(code);setMessage('Codigo copiado. Pegalo en el otro equipo.');}catch{setMessage('Selecciona y copia el codigo que aparece arriba.');}}}>Copiar codigo</button>
  </div>}
  <form className="spaced" onSubmit={join}><label>En la PC u otro celular, pega el codigo aqui<input required value={input} onChange={event=>setInput(event.target.value)} autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={60}/></label>
   <button className="primary" disabled={busy||!input.trim()}>{busy?'Vinculando…':'Vincular este equipo'}</button>
  </form>{message&&<p role="status">{message}</p>}
 </section>;
}
