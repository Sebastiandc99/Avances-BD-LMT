import 'fake-indexeddb/auto';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readStore, saveLocal, copyDeviceRecords } from '../lib/storage.ts';

test('vincular copia cargas previas y fotos a la obra compartida conservando el origen',async()=>{
 await saveLocal('device-source',[{id:'record-1',sync:'synced'},{id:'discard',sync:'discarded'}],[{id:'photo-1',data:'foto existente',uploaded:true}]);
 await copyDeviceRecords('device-source','workspace');
 const records=await readStore('events','workspace');
 assert.equal(records.find(r=>r.id==='record-1').sync,'pending');
 assert.equal(records.find(r=>r.id==='discard').sync,'discarded');
 assert.equal((await readStore('events','device-source')).length,2);
 assert.equal((await readStore('photos','workspace'))[0].uploaded,false);
 assert.equal((await readStore('photos','device-source'))[0].uploaded,true);
});
test('reintentar la copia conserva el estado ya sincronizado y recoge escrituras tardias',async()=>{
 await saveLocal('workspace',[{id:'record-1',sync:'synced'}],[{id:'photo-1',data:'foto existente',uploaded:true}]);
 await saveLocal('device-source',[{id:'late-save',sync:'pending'}]);
 await copyDeviceRecords('device-source','workspace');
 const records=await readStore('events','workspace');
 assert.equal(records.find(r=>r.id==='record-1').sync,'synced');
 assert.equal(records.filter(r=>r.id==='record-1').length,1);
 assert.equal(records.find(r=>r.id==='late-save').sync,'pending');
 assert.equal((await readStore('photos','workspace'))[0].uploaded,true);
});
test('incorpora el historial privado anterior de la nube sin reemplazar una carga local',async()=>{
 await saveLocal('other-source',[{id:'same-id',notes:'local',sync:'pending'}]);
 await copyDeviceRecords('other-source','other-workspace',[{id:'same-id',notes:'remote',sync:'synced'},{id:'remote-only',sync:'synced'}],[{id:'remote-photo',data:'foto existente',uploaded:true}]);
 const records=await readStore('events','other-workspace');
 assert.equal(records.find(r=>r.id==='same-id').notes,'local');
 assert.equal(records.find(r=>r.id==='remote-only').sync,'pending');
 assert.equal((await readStore('photos','other-workspace'))[0].uploaded,false);
 await copyDeviceRecords('other-workspace','other-workspace');
 assert.equal((await readStore('events','other-workspace')).length,2);
});
