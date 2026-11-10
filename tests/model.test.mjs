import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validSpanId, validProgress, metrics, latestRecords, emptyProgress, csvCell } from '../lib/model.ts';
const inv=JSON.parse(fs.readFileSync(new URL('../public/assets/inventory.json',import.meta.url)));
const ev=(overrides={})=>({...emptyProgress(),id:'a',spanId:'L-001-002',status:'ejecucion',installed:3,version:1,baseVersion:0,createdAt:'2026-11-08T10:00:00Z',author:'Test',sync:'synced',date:'2026-11-07',...overrides});
test('237 CAD poles and 235 unique consecutive spans, both complete lines',()=>{
 assert.equal(inv.piquetes.length,237);assert.equal(inv.vanos.length,235);assert.equal(new Set(inv.vanos.map(s=>s.id)).size,235);
 const byId=Object.fromEntries(inv.piquetes.map(p=>[p.id,p]));
 for(const s of inv.vanos){assert.ok(validSpanId(s.id));const a=byId[s.desde],b=byId[s.hasta];assert.ok(a&&b);assert.ok(a.pixel.every(Number.isFinite));assert.ok(Math.abs(Math.hypot(a.x_este_m-b.x_este_m,a.y_norte_m-b.y_norte_m)-s.longitud_planta_m)<.1);assert.equal(s.posiciones_bd_propuestas_desde_piquete_inicial_m.length,s.bd_propuestos_pendientes_validacion);}
 assert.deepEqual(inv.resumen.map(s=>[s.vanos,s.bd_propuestos_pendientes_validacion]),[[218,1613],[17,130]]);
});
test('rejects invalid span identifiers and impossible progress fields',()=>{for(const id of ['L-000-001','L-001-003','L-219-220','FP-018-019','L-1-2','__proto__'])assert.equal(validSpanId(id),false);assert.ok(validProgress(ev()));for(const p of [{installed:-1},{installed:1.2},{status:'bad'},{date:'2026-02-30'},{status:'pendiente',installed:3},{status:'terminado',installed:0},{notes:'x'.repeat(4001)},{photos:['bad']}])assert.equal(validProgress(ev(p)),false);});
test('empty project never fabricates installed quantities or ETA',()=>{const m=metrics(inv.vanos,[],'2026-11-08');assert.equal(m.installed,0);assert.equal(m.done,0);assert.equal(m.planned,1743);assert.equal(m.eta,null)});
test('revision updates, reopening and corrections do not double-count production',()=>{const a=ev(),b=ev({id:'b',installed:8,status:'terminado',version:2,baseVersion:1,date:'2026-11-08'}),c=ev({id:'c',installed:6,status:'observaciones',version:3,baseVersion:2,date:'2026-11-08'});const m=metrics(inv.vanos,[b,a,c],'2026-11-08');assert.equal(m.installed,6);assert.equal(m.done,0);assert.deepEqual(m.daily,{'2026-11-07':3,'2026-11-08':3});assert.equal(m.average,3);});
test('local conflict preserves the full local draft until a version is selected',()=>{const a=ev(),b=ev({id:'remote',version:2,baseVersion:1,installed:8}),c=ev({id:'local',version:2,baseVersion:1,installed:5,sync:'conflict'}),d=ev({id:'remote3',version:3,baseVersion:2,installed:10});const es=[a,b,c,d];assert.equal(latestRecords(es)['L-001-002'].installed,5);assert.equal(metrics(inv.vanos,es).installed,5);assert.equal(latestRecords(es.map(e=>e.id==='local'?{...e,sync:'discarded'}:e))['L-001-002'].installed,10);});
test('CSV quotes cells and neutralizes spreadsheet formulas',()=>{assert.equal(csvCell('=SUM(A1)'),`"'=SUM(A1)"`);assert.equal(csvCell('a"b'),'"a""b"');assert.equal(csvCell(8),'"8"')});
