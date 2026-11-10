import type { Event, Photo } from './model';
let connection:Promise<IDBDatabase>|null=null;
function db() { if(!connection) connection=new Promise((resolve,reject)=>{const r=indexedDB.open('avances-bd-lmt-v1',1);r.onupgradeneeded=()=>{r.result.createObjectStore('events',{keyPath:'key'});r.result.createObjectStore('photos',{keyPath:'key'});};r.onsuccess=()=>resolve(r.result);r.onerror=()=>{connection=null;reject(r.error)};});return connection; }
export async function readStore<T>(store:string,owner:string):Promise<T[]> { const d=await db();return new Promise((resolve,reject)=>{const r=d.transaction(store).objectStore(store).getAll();r.onsuccess=()=>resolve(r.result.filter(v=>v.owner===owner).map(v=>v.value));r.onerror=()=>reject(r.error)}); }
export async function saveLocal(owner:string,events:Event[],photos:Photo[]=[]) { const d=await db();return new Promise<void>((resolve,reject)=>{const t=d.transaction(['events','photos'],'readwrite');for(const e of events)t.objectStore('events').put({key:owner+':'+e.id,owner,value:e});for(const p of photos)t.objectStore('photos').put({key:owner+':'+p.id,owner,value:p});t.oncomplete=()=>resolve();t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error)}); }
export async function photoFile(file:File):Promise<Photo> {
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Usá imágenes JPG, PNG o WebP.');
  if(file.size>20*1024*1024)throw new Error('La foto supera los 20 MB.');
  const bitmap=await createImageBitmap(file); const scale=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));const c=document.createElement('canvas');c.width=Math.round(bitmap.width*scale);c.height=Math.round(bitmap.height*scale);c.getContext('2d')!.drawImage(bitmap,0,0,c.width,c.height);bitmap.close();
  return {id:crypto.randomUUID(),data:c.toDataURL('image/jpeg',.82),name:file.name};
}
