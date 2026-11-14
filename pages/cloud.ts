import { createClient } from '@supabase/supabase-js';
import type { Event, Photo } from '../lib/model';
import { validProgress, validSpanId } from '../lib/model';
import type { SyncAdapter } from '../lib/sync-engine';
// Publishable key: permissions are enforced by Auth and database/storage RLS.
export const supabase=createClient('https://ynhvceqjhcydsteyzrpt.supabase.co','sb_publishable_kYK3QmYF0PCGxlx3xUJhjQ_eqcKfP8D',{
 auth:{storageKey:'avances-bd-lmt-auth-v1',persistSession:true,autoRefreshToken:true,detectSessionInUrl:true},
 global:{fetch:(input,init)=>fetch(input,{...init,signal:init?.signal?AbortSignal.any([init.signal,AbortSignal.timeout(25000)]):AbortSignal.timeout(25000)})}
});
export function cloudAdapter(owner:string):SyncAdapter{
 const bucket=supabase.storage.from('lmt-photos');
 return {
  async listEvents(){
   const events:Event[]=[];
   // Keyset pagination avoids Supabase's 1,000-row response limit.
   let cursor=0;
   for(;;){
    const {data,error}=await supabase.from('lmt_events').select('seq,payload').eq('user_id',owner).gt('seq',cursor).order('seq').limit(500);
    if(error)throw Error('No se pudo leer la nube: '+error.message);
    for(const row of data){if(!validProgress(row.payload)||!validSpanId(row.payload.spanId))throw Error('La nube devolvió un registro inválido.');events.push({...row.payload,sync:'synced'});cursor=row.seq;}
    if(data.length<500)return events;
   }
  },
  async appendEvent(event){
   const {sync:_,...payload}=event;
   const {data,error}=await supabase.rpc('lmt_append_workspace_event',{p_event:payload,p_owner:owner});
   if(error)throw Error('El avance sigue guardado en el equipo: '+error.message);
   if(data!=='saved'&&data!=='conflict')throw Error('Respuesta inesperada al guardar en la nube.');
   return data;
  },
  async uploadPhoto(photo){
   const blob=await fetch(photo.data).then(r=>r.blob());
   const {error}=await bucket.upload(owner+'/'+photo.id,blob,{contentType:blob.type,upsert:false});
   // Immutable UUID paths make retries safe after a lost response.
   if(error&&error.message!=='The resource already exists'&&String(error.statusCode)!=='409')throw Error('Foto pendiente de subir: '+error.message);
  },
  async downloadPhoto(id){
   const {data,error}=await bucket.download(owner+'/'+id);
   if(error)throw Error('Foto pendiente de descargar: '+error.message);
   const value=await new Promise<string>((resolve,reject)=>{const f=new FileReader();f.onload=()=>resolve(f.result as string);f.onerror=()=>reject(Error('No se pudo guardar la foto.'));f.readAsDataURL(data);});
   return {id,data:value,name:'Foto de obra',uploaded:true};
  }
 };
}
