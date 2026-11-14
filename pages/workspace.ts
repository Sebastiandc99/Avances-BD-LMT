import { cloudAdapter, supabase } from './cloud';
import { copyDeviceRecords, readStore } from '../lib/storage';
import type { Photo } from '../lib/model';

export async function workspaceForDevice(authId:string){
 const {data,error}=await supabase.rpc('lmt_workspace_owner');
 if(error)throw Error('No se pudo comprobar la vinculacion: '+error.message);
 if(typeof data!=='string'||!/^[a-f0-9-]{36}$/i.test(data))throw Error('Supabase no confirmo el proyecto de este equipo.');
 const owner=data;
 if(owner!==authId){
  const migrationKey='lmt-device-import:'+authId+':'+owner;
  if(localStorage.getItem(migrationKey)!=='done'){
   const legacy=cloudAdapter(authId);
   const events=await legacy.listEvents();
   const existing=await readStore<Photo>('photos',authId);
   const ids=[...new Set(events.flatMap(event=>event.photos))].filter(id=>!existing.some(photo=>photo.id===id));
   const photos:Photo[]=[];
   for(const id of ids)photos.push(await legacy.downloadPhoto(id));
   await copyDeviceRecords(authId,owner,events,photos);
   localStorage.setItem(migrationKey,'done');
  }
  await copyDeviceRecords(authId,owner);
 }
 return owner;
}
