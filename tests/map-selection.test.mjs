import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { selectionEvents, toggleSpanSelection } from '../lib/map-selection.ts';
import { emptyProgress, latestRecords, metrics, plannedDiverters, validProgress } from '../lib/model.ts';
const {vanos}=JSON.parse(fs.readFileSync('public/assets/inventory.json','utf8'));
const old=(spanId,values={})=>({...emptyProgress(),id:spanId,spanId,version:2,baseVersion:1,createdAt:'2026-11-08T12:00:00Z',author:'Prueba',sync:'synced',...values});
let id=0;const uuid=()=>`00000000-0000-4000-8000-${String(++id).padStart(12,'0')}`;
const create=(ids,events,expected,values)=>selectionEvents(vanos,ids,events,expected,values,'Prueba',uuid,'2026-11-10T12:00:00Z');
test('seleccionar y deseleccionar conserva vanos no contiguos de ambas líneas sin duplicados',()=>{
 let ids=toggleSpanSelection([],'L-001-002');ids=toggleSpanSelection(ids,'FP-003-004');ids=toggleSpanSelection(ids,'L-008-009');assert.equal(ids.length,3);
 ids=toggleSpanSelection(ids,'FP-003-004');assert.deepEqual(ids,['L-001-002','L-008-009']);
 const selected=create([...ids,...ids],[],Object.fromEntries(ids.map(id=>[id,0])),{status:'terminado',date:'2026-11-09',withoutDate:false});
 assert.equal(selected.length,2);assert.ok(selected.every(validProgress));assert.ok(selected.every(e=>e.date==='2026-11-09'&&e.status==='terminado'&&e.version===1&&e.sync==='pending'));
});
test('un mismo estado y fecha actualizan revisiones sin perder cantidades, notas, fotos ni responsable',()=>{
 const photo='00000000-0000-4000-8000-000000000001';
 const a=old('L-001-002',{status:'terminado',date:'2026-11-08',installed:9,photos:[photo],notes:'Conservar',responsible:'Cuadrilla A'}),b=old('FP-001-002',{status:'ejecucion',date:'',installed:3});
 const before=structuredClone([a,b]);const batch=create([a.spanId,b.spanId],[a,b],{[a.spanId]:2,[b.spanId]:2},{status:'terminado',date:'2026-11-09',withoutDate:false});
 assert.deepEqual([a,b],before);assert.equal(batch[0].installed,9);assert.equal(batch[1].installed,3);assert.deepEqual(batch[0].photos,[photo]);assert.equal(batch[0].notes,'Conservar');assert.equal(batch[0].responsible,'Cuadrilla A');assert.ok(batch.every(e=>e.version===3&&e.baseVersion===2));
 const m=metrics(vanos,[a,b,...batch],'2026-11-10');assert.equal(m.done,2);assert.equal(m.installed,12);assert.deepEqual(m.daily,{'2026-11-09':2});assert.equal(m.average,2);
});
test('Pendiente retira producción y cantidades; sin fecha explícito no inventa rendimiento',()=>{
 const a=old('L-001-002',{status:'terminado',date:'2026-11-08',installed:9,notes:'Se conserva'});
 const pending=create([a.spanId],[a],{[a.spanId]:2},{status:'pendiente',date:'2026-11-09',withoutDate:false})[0];
 assert.equal(pending.installed,0);assert.equal(pending.notes,a.notes);assert.equal(metrics(vanos,[a,pending],'2026-11-10').done,0);
 const undone=create(['L-002-003'],[],{'L-002-003':0},{status:'terminado',date:'2026-11-09',withoutDate:true});
 const m=metrics(vanos,undone,'2026-11-10');assert.equal(m.undatedDone,1);assert.equal(m.days,0);assert.equal(m.installed,plannedDiverters(vanos[1]));
});
test('conflictos, versiones nuevas, selección inválida y fechas inválidas bloquean el lote completo',()=>{
 const a=old('L-001-002'),conflict=old('FP-001-002',{sync:'conflict'}),values={status:'terminado',date:'2026-11-09',withoutDate:false};
 assert.throws(()=>create([a.spanId,conflict.spanId],[a,conflict],{[a.spanId]:2,[conflict.spanId]:2},values),/conflicto/);
 assert.throws(()=>create([a.spanId],[a],{[a.spanId]:1},values),/cambió/);
 assert.throws(()=>create(['L-000-001'],[],{'L-000-001':0},values),/no pertenece/);assert.throws(()=>create([],[],{},values),/al menos/);
 for(const invalid of [{...values,status:'bad'},{...values,date:'2026-02-30'},{...values,date:'2100-01-01'},{...values,date:''}])assert.throws(()=>create([a.spanId],[a],{[a.spanId]:2},invalid));
 assert.equal(latestRecords([a])[a.spanId].version,2);
});
