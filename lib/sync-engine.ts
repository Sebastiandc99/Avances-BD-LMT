import type { Event, Photo } from './model';
export interface SyncAdapter {
 listEvents(): Promise<Event[]>;
 appendEvent(event:Event): Promise<'saved'|'conflict'>;
 uploadPhoto(photo:Photo): Promise<void>;
 downloadPhoto(id:string): Promise<Photo>;
}
export interface SyncStore {
 events():Event[];
 photos():Record<string,Photo>;
 update(change:(events:Event[])=>Event[],photos?:Photo[]):Promise<void>;
}
/** Every update reads the latest local state: saving during a slow request stays safe. */
export async function synchronize(adapter:SyncAdapter,store:SyncStore){
 const merge=async()=>{
  const cloud=await adapter.listEvents();
  await store.update(local=>{const map=new Map(local.map(e=>[e.id,e]));for(const e of cloud)map.set(e.id,{...e,sync:'synced'});return [...map.values()];});
  return cloud;
 };
 await merge();
 const blocked=new Set(store.events().filter(e=>e.sync==='conflict').map(e=>e.spanId));
 for(const event of store.events().filter(e=>e.sync==='pending').sort((a,b)=>a.version-b.version)){
  if(blocked.has(event.spanId))continue;
  for(const id of event.photos){
   const photo=store.photos()[id];
   if(!photo)throw Error('Falta una foto del registro. Importá el respaldo completo antes de sincronizar.');
   if(!photo.uploaded){await adapter.uploadPhoto(photo);await store.update(es=>es,[{...photo,uploaded:true}]);}
  }
  const result=await adapter.appendEvent(event);
  if(result==='conflict')blocked.add(event.spanId);
  await store.update(es=>es.map(e=>e.id===event.id?{...e,sync:result==='conflict'?'conflict':'synced'}:e));
 }
 // Refresh after a conflict so its review always shows the current cloud version.
 const cloud=await merge();
 for(const id of new Set(cloud.flatMap(e=>e.photos))){
  if(!store.photos()[id])await store.update(es=>es,[await adapter.downloadPhoto(id)]);
 }
}
