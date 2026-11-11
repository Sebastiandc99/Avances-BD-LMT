import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { metrics, emptyProgress } from '../lib/model.ts';
import { progressSlices, progressGradient } from '../lib/progress-pie.ts';
const inv=JSON.parse(fs.readFileSync('public/assets/inventory.json','utf8'));
const event=(spanId,changes={})=>({...emptyProgress(),id:spanId,spanId,status:'terminado',sync:'synced',version:1,baseVersion:0,createdAt:'2026-11-10T12:00:00Z',author:'Prueba',...changes});
test('la torta usa 235 vanos de ambas líneas, incluidos los terminados sin fecha',()=>{
 const es=[event('L-001-002'),event('FP-001-002',{date:'2026-11-09'}),event('L-003-004',{status:'ejecucion'})];
 const stats=metrics(inv.vanos,es,'2026-11-11'),slices=progressSlices(stats);
 assert.deepEqual(slices.map(s=>s.value),[2,1,232]);assert.equal(slices.reduce((a,s)=>a+s.value,0),235);
 assert.equal(slices[0].share,2/235);assert.deepEqual(slices.map(s=>s.color),['#36a66e','#eab645','#8b9299']);
 assert.ok(Math.abs(slices.reduce((a,s)=>a+s.share,0)-1)<1e-12);assert.match(progressGradient(stats),/^conic-gradient\(/);
});
test('sin carga muestra todos pendientes y reabrir un vano cambia la distribución sin duplicarlo',()=>{
 assert.deepEqual(progressSlices(metrics(inv.vanos,[])).map(s=>s.value),[0,0,235]);
 const done=event('L-001-002'),reopened=event('L-001-002',{id:'later',status:'ejecucion',version:2,baseVersion:1});
 assert.deepEqual(progressSlices(metrics(inv.vanos,[done,reopened])).map(s=>s.value),[0,1,234]);
 const all=inv.vanos.map(s=>event(s.id));assert.deepEqual(progressSlices(metrics(inv.vanos,all)).map(s=>s.share),[1,0,0]);
 assert.equal(progressGradient({total:0,done:0,inProgress:0,pending:0}),'#8b9299');
});
