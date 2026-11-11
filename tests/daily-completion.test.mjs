import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { emptyProgress, latestRecords, metrics, plannedDiverters } from '../lib/model.ts';
import { dailyCompletion } from '../lib/daily-completion.ts';
const inv=JSON.parse(fs.readFileSync('public/assets/inventory.json','utf8'));
const today='2026-11-11',day='2026-11-09';
const event=(spanId,changes={})=>({...emptyProgress(),id:spanId,spanId,status:'terminado',date:day,sync:'synced',version:1,baseVersion:0,createdAt:'2026-11-11T12:00:00Z',author:'Prueba',...changes});

test('el detalle diario coincide con producción: ambas líneas, BD calculados/reales y solo terminados fechados',()=>{
 const events=[event('L-001-002'),event('FP-001-002',{installed:12}),event('L-002-003',{date:''}),event('L-003-004',{date:'2026-11-10'}),event('L-004-005',{status:'ejecucion',installed:3}),event('L-005-006',{status:'observaciones'}),event('L-006-007',{status:'pendiente'})];
 const records=latestRecords(events),result=dailyCompletion(inv.vanos,records,day,today),production=metrics(inv.vanos,events,today);
 assert.deepEqual(result.spans.map(s=>s.id),['L-001-002','FP-001-002']);
 assert.equal(result.total,2);assert.equal(result.installed,plannedDiverters(inv.vanos[0])+12);
 assert.equal(result.total,production.daily[day]);assert.equal(result.installed,production.dailyBD[day]);
 assert.equal(result.spans.filter(s=>s.linea==='larga').length,1); // A table filter cannot change the global daily total.
 assert.equal(dailyCompletion(inv.vanos,records,'2026-11-08',today).total,0);
});

test('corregir una fecha o reabrir retira el vano del día anterior; nunca duplica ni usa la fecha de guardado',()=>{
 const first=event('L-001-002'),corrected=event('L-001-002',{id:'new',version:2,baseVersion:1,date:'2026-11-10'});
 let records=latestRecords([first,corrected,event('FP-001-002')]);
 assert.deepEqual(dailyCompletion(inv.vanos,records,day,today).spans.map(s=>s.id),['FP-001-002']);
 assert.equal(dailyCompletion(inv.vanos,records,'2026-11-10',today).total,1);
 assert.equal(dailyCompletion(inv.vanos,records,today,today).total,0);
 const reopened={...corrected,id:'reopen',version:3,baseVersion:2,status:'ejecucion'};
 records=latestRecords([first,corrected,reopened]);
 assert.equal(dailyCompletion(inv.vanos,records,'2026-11-10',today).total,0);
 const discarded={...corrected,sync:'discarded'};
 assert.equal(dailyCompletion(inv.vanos,latestRecords([first,discarded]),day,today).total,1);
 for(const invalid of ['','2026-02-30','2026-11-12','2019-12-31','2026-1-9'])assert.equal(dailyCompletion(inv.vanos,records,invalid,today).total,0);
});
