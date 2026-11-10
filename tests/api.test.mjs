import test from 'node:test';import assert from 'node:assert/strict';
const base=process.env.LMT_TEST_URL||'http://127.0.0.1:4173';
const headers={'Content-Type':'application/json','oai-authenticated-user-id':'qa-lmt-'+crypto.randomUUID(),'oai-authenticated-user-email':'qa@example.test'};
const e={id:crypto.randomUUID(),spanId:'FP-001-002',status:'ejecucion',date:'2026-11-08',installed:3,notes:'Local API QA',responsible:'Test',photos:[],version:1,baseVersion:0,createdAt:new Date().toISOString()};
test('API requires identity, isolates owners, is idempotent, and rejects stale writes',{skip:!process.env.LMT_TEST_URL},async()=>{
 assert.ok(['127.0.0.1','localhost'].includes(new URL(base).hostname),'Use only a local preview for API fixtures');
 let r=await fetch(base+'/api/sync');assert.equal(r.status,401);
 r=await fetch(base+'/api/sync',{method:'POST',headers,body:JSON.stringify(e)});assert.equal(r.status,200,await r.text());
 r=await fetch(base+'/api/sync',{method:'POST',headers,body:JSON.stringify(e)});assert.equal(r.status,200);
 r=await fetch(base+'/api/sync',{method:'POST',headers,body:JSON.stringify({...e,id:crypto.randomUUID()})});assert.equal(r.status,409);
 r=await fetch(base+'/api/sync',{headers});let data=await r.json();assert.equal(data.events.length,1);assert.equal(data.events[0].installed,3);assert.equal(data.events[0].author,'qa@example.test');
 r=await fetch(base+'/api/sync',{headers:{...headers,'oai-authenticated-user-id':'qa-other-owner'}});data=await r.json();assert.equal(data.events.length,0);
 r=await fetch(base+'/api/sync',{method:'POST',headers,body:JSON.stringify({...e,id:crypto.randomUUID(),version:2,baseVersion:1,status:'terminado',installed:-1})});assert.equal(r.status,400);
 r=await fetch(base+'/api/sync',{method:'POST',headers:{...headers,Origin:'https://other.test'},body:JSON.stringify(e)});assert.equal(r.status,403);
 r=await fetch(base+'/api/sync',{method:'POST',headers,body:JSON.stringify({...e,id:crypto.randomUUID(),version:2,baseVersion:1,status:'terminado',installed:0,date:''})});assert.equal(r.status,200,await r.text());
 r=await fetch(base+'/api/sync',{headers});data=await r.json();assert.equal(data.events.length,2);assert.equal(data.events[1].date,'');assert.equal(data.events[1].installed,0);assert.equal(data.events[1].status,'terminado');
});
