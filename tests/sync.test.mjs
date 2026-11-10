import assert from 'node:assert/strict';
import test from 'node:test';
import { synchronize } from '../lib/sync-engine.ts';
const event=(id,spanId='L-001-002',version=1)=>({id,spanId,version,baseVersion:version-1,createdAt:'2026-11-10T10:00:00Z',author:'Prueba',sync:'pending',status:'terminado',date:'',installed:0,notes:'',responsible:'',photos:[]});
function local(events=[]){const state={events,photos:{}};return {state,events:()=>state.events,photos:()=>state.photos,async update(fn,photos=[]){state.events=fn(state.events);for(const p of photos)state.photos[p.id]=p;}};}
function server(){const events=[];return {events,async listEvents(){return events.map(e=>({...e}));},async appendEvent(e){if(events.some(v=>v.id===e.id))return 'saved';if(events.some(v=>v.spanId===e.spanId&&v.version===e.version))return 'conflict';events.push({...e,sync:'synced'});return 'saved';},async uploadPhoto(){},async downloadPhoto(){throw Error('No photo fixture');}};}
test('offline edits survive a lost response, then synchronize once and restore on another device',async()=>{
 const a=local([event('a')]),cloud=server(),append=cloud.appendEvent;let fail=true;
 cloud.appendEvent=async(e)=>{const result=await append(e);if(fail){fail=false;throw Error('connection lost after commit');}return result;};
 await assert.rejects(synchronize(cloud,a),/connection lost/);assert.equal(a.events()[0].sync,'pending');
 await synchronize(cloud,a);assert.equal(cloud.events.length,1);assert.equal(a.events()[0].sync,'synced');
 const b=local();await synchronize(cloud,b);assert.deepEqual(b.events(),a.events());
});
test('a concurrent version is retained for review, blocks later edits only on that span, and refreshes cloud',async()=>{
 const cloud=server();await cloud.appendEvent(event('remote'));
 const a=local([event('local'),event('later','L-001-002',2),event('other','FP-001-002')]);
 await synchronize(cloud,a);
 assert.equal(a.events().find(e=>e.id==='local').sync,'conflict');
 assert.equal(a.events().find(e=>e.id==='later').sync,'pending');
 assert.equal(a.events().find(e=>e.id==='other').sync,'synced');
 assert.equal(a.events().find(e=>e.id==='remote').sync,'synced');
 assert.ok(!cloud.events.some(e=>e.id==='later'));
});
test('saving while a cloud download is in flight never drops the new local event',async()=>{
 const a=local(),cloud=server();let release;const waiting=new Promise(r=>{release=r;});let first=true;
 cloud.listEvents=async()=>{if(first){first=false;await waiting;}return [];};
 const task=synchronize(cloud,a);await a.update(es=>[...es,event('new')]);release();await task;
 assert.equal(a.events().length,1);assert.equal(a.events()[0].id,'new');
});
test('a missing attachment prevents a false synced state',async()=>{
 const a=local([{...event('a'),photos:['missing']}]),cloud=server();
 await assert.rejects(synchronize(cloud,a),/Falta una foto/);assert.equal(a.events()[0].sync,'pending');assert.equal(cloud.events.length,0);
});
test('an upload failure retains the event and a retry uploads before the event',async()=>{
 const a=local([{...event('a'),photos:['p']}]),cloud=server(),order=[];a.state.photos.p={id:'p',data:'fixture',name:'test'};
 cloud.uploadPhoto=async()=>{order.push('photo');if(order.length===1)throw Error('offline');};
 const append=cloud.appendEvent;cloud.appendEvent=async e=>{order.push('event');return append(e);};
 await assert.rejects(synchronize(cloud,a),/offline/);assert.equal(a.events()[0].sync,'pending');
 await synchronize(cloud,a);assert.deepEqual(order,['photo','photo','event']);assert.equal(a.photos().p.uploaded,true);
});
