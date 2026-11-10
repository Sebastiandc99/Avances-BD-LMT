import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validSpanId, validProgress, metrics, latestRecords, emptyProgress, csvCell, plannedDiverters, installedDiverters, diverterBasis } from '../lib/model.ts';
const inv=JSON.parse(fs.readFileSync(new URL('../public/assets/inventory.json',import.meta.url)));
const ev=(overrides={})=>({...emptyProgress(),id:'a',spanId:'L-001-002',status:'ejecucion',installed:3,version:1,baseVersion:0,createdAt:'2026-11-08T10:00:00Z',author:'Test',sync:'synced',date:'2026-11-07',...overrides});
test('237 CAD poles and 235 unique consecutive spans, both complete lines',()=>{
 assert.equal(inv.piquetes.length,237);assert.equal(inv.vanos.length,235);assert.equal(new Set(inv.vanos.map(s=>s.id)).size,235);
 const byId=Object.fromEntries(inv.piquetes.map(p=>[p.id,p]));
 for(const s of inv.vanos){assert.ok(validSpanId(s.id));const a=byId[s.desde],b=byId[s.hasta];assert.ok(a&&b);assert.ok(a.pixel.every(Number.isFinite));assert.ok(Math.abs(Math.hypot(a.x_este_m-b.x_este_m,a.y_norte_m-b.y_norte_m)-s.longitud_planta_m)<.1);assert.equal(s.posiciones_bd_propuestas_desde_piquete_inicial_m.length,s.bd_propuestos_pendientes_validacion);assert.equal(plannedDiverters(s),s.bd_propuestos_pendientes_validacion);const positions=s.posiciones_bd_propuestas_desde_piquete_inicial_m;assert.ok(positions[0]>=.2*s.longitud_planta_m-.001);assert.ok(positions.at(-1)<=.8*s.longitud_planta_m+.001);assert.ok(Math.abs((positions[0]+positions.at(-1))/2-s.longitud_planta_m/2)<.001);for(let i=1;i<positions.length;i++)assert.ok(Math.abs(positions[i]-positions[i-1]-10)<.001);}
 assert.deepEqual(inv.resumen.map(s=>[s.vanos,s.bd_propuestos_pendientes_validacion]),[[218,1613],[17,130]]);
});
test('rejects invalid span identifiers and impossible progress fields',()=>{for(const id of ['L-000-001','L-001-003','L-219-220','FP-018-019','L-1-2','__proto__'])assert.equal(validSpanId(id),false);assert.ok(validProgress(ev()));for(const p of [{installed:-1},{installed:1.2},{status:'bad'},{date:'2026-02-30'},{status:'pendiente',installed:3},{date:undefined},{notes:'x'.repeat(4001)},{photos:['bad']}])assert.equal(validProgress(ev(p)),false);});
test('empty project never fabricates installed quantities or ETA',()=>{const m=metrics(inv.vanos,[],'2026-11-08');assert.equal(m.installed,0);assert.equal(m.done,0);assert.equal(m.planned,1743);assert.equal(m.eta,null)});
test('reopening a completed span reverses production without double-counting BD corrections',()=>{const a=ev(),b=ev({id:'b',installed:8,status:'terminado',version:2,baseVersion:1,date:'2026-11-08'}),c=ev({id:'c',installed:6,status:'observaciones',version:3,baseVersion:2,date:'2026-11-08'});const m=metrics(inv.vanos,[b,a,c],'2026-11-08');assert.equal(m.installed,6);assert.equal(m.done,0);assert.deepEqual(m.daily,{});assert.equal(m.average,0);assert.equal(m.eta,null);});

test('undated completion counts calculated BD and progress but never fabricates a production date',()=>{
 assert.equal(emptyProgress().date,'');assert.equal(emptyProgress().installed,0);
 const e=ev({status:'terminado',installed:0,date:'',createdAt:'2026-11-08T01:00:00Z'});assert.ok(validProgress(e));
 const m=metrics(inv.vanos,[e],'2026-11-08');assert.equal(m.done,1);assert.equal(m.installed,plannedDiverters(inv.vanos[0]));assert.equal(m.planned,1743);assert.equal(m.remaining,234);assert.equal(m.average,0);assert.equal(m.averageBD,0);assert.equal(m.eta,null);assert.equal(m.undatedDone,1);assert.deepEqual(m.daily,{});
});

test('editing measured BD on an already completed span does not add another completed span',()=>{
 const a=ev({status:'terminado',installed:0}),b=ev({id:'b',status:'terminado',installed:8,version:2,baseVersion:1,date:'2026-11-08'});
 const m=metrics(inv.vanos,[b,a],'2026-11-08');assert.equal(m.done,1);assert.equal(m.installed,8);assert.deepEqual(m.daily,{'2026-11-08':1});assert.equal(m.average,1);
});
test('local conflict preserves the full local draft until a version is selected',()=>{const a=ev(),b=ev({id:'remote',version:2,baseVersion:1,installed:8}),c=ev({id:'local',version:2,baseVersion:1,installed:5,sync:'conflict'}),d=ev({id:'remote3',version:3,baseVersion:2,installed:10});const es=[a,b,c,d];assert.equal(latestRecords(es)['L-001-002'].installed,5);assert.equal(metrics(inv.vanos,es).installed,5);assert.equal(latestRecords(es.map(e=>e.id==='local'?{...e,sync:'discarded'}:e))['L-001-002'].installed,10);});
test('CSV quotes cells and neutralizes spreadsheet formulas',()=>{assert.equal(csvCell('=SUM(A1)'),`"'=SUM(A1)"`);assert.equal(csvCell('a"b'),'"a""b"');assert.equal(csvCell(8),'"8"')});


test('80 historical completions without dates produce calculated BD but no 80-span daily rate',()=>{
 const events=inv.vanos.slice(0,80).map((span,i)=>ev({id:'historical-'+i,spanId:span.id,status:'terminado',installed:0,date:''}));
 const m=metrics(inv.vanos,events,'2026-11-10');
 assert.equal(m.done,80);assert.equal(m.installed,inv.vanos.slice(0,80).reduce((n,s)=>n+plannedDiverters(s),0));assert.ok(m.installed>0);
 assert.equal(m.average,0);assert.equal(m.averageBD,0);assert.equal(m.days,0);assert.equal(m.undatedDone,80);assert.equal(m.eta,null);assert.deepEqual(m.daily,{});assert.equal(m.pending,155);
});
test('rate uses only dated completed spans divided by days with recorded execution',()=>{
 const events=inv.vanos.slice(0,85).map((span,i)=>ev({id:'mixed-'+i,spanId:span.id,status:'terminado',installed:0,date:i<80?'':i<83?'2026-11-05':'2026-11-09'}));
 events.push(ev({id:'partial',spanId:inv.vanos[85].id,installed:2}),ev({id:'partial2',spanId:inv.vanos[86].id,status:'observaciones',installed:0}));
 const m=metrics(inv.vanos,events,'2026-11-10');
 assert.equal(m.done,85);assert.equal(m.inProgress,2);assert.equal(m.pending,148);assert.equal(m.remaining,150);assert.equal(m.done+m.inProgress+m.pending,235);
 assert.equal(m.undatedDone,80);assert.equal(m.datedDone,5);assert.equal(m.days,2);assert.equal(m.average,2.5);assert.deepEqual(m.daily,{'2026-11-05':3,'2026-11-09':2});
 const datedBD=inv.vanos.slice(80,85).reduce((n,s)=>n+plannedDiverters(s),0);assert.equal(m.averageBD,datedBD/2);assert.equal(m.datedInstalled,datedBD);assert.equal(m.reportedInstalled,2);assert.equal(m.estimatedDays,60);
});
test('field quantities have priority while unreported completed spans use their calculated quantity',()=>{
 const span=inv.vanos[0],auto=ev({status:'terminado',installed:0}),actual=ev({status:'terminado',installed:9});
 assert.equal(installedDiverters(span,auto),plannedDiverters(span));assert.equal(diverterBasis(auto),'calculated');assert.equal(installedDiverters(span,actual),9);assert.equal(diverterBasis(actual),'reported');
 assert.equal(installedDiverters(span,ev({installed:2})),2);assert.equal(installedDiverters(span,ev({installed:0})),0);assert.equal(installedDiverters(span),0);
});
test('adding a missing completion date later includes that span exactly once in the rate',()=>{
 const a=ev({status:'terminado',installed:0,date:''}),b=ev({id:'dated',status:'terminado',installed:0,version:2,baseVersion:1,date:'2026-11-06'});
 const m=metrics(inv.vanos,[a,b],'2026-11-10');assert.equal(m.done,1);assert.equal(m.datedDone,1);assert.equal(m.undatedDone,0);assert.equal(m.average,1);assert.deepEqual(m.daily,{'2026-11-06':1});
});
test('date corrections, clearing a date, and reopening recompute production without duplicate completions',()=>{
 const a=ev({status:'terminado',installed:0,date:'2026-11-05'}),b=ev({id:'corrected',status:'terminado',installed:0,version:2,baseVersion:1,date:'2026-11-07'});
 assert.deepEqual(metrics(inv.vanos,[a,b],'2026-11-10').daily,{'2026-11-07':1});
 const c=ev({id:'cleared',status:'terminado',installed:0,version:3,baseVersion:2,date:''});
 const cleared=metrics(inv.vanos,[a,b,c],'2026-11-10');assert.equal(cleared.done,1);assert.equal(cleared.average,0);assert.equal(cleared.undatedDone,1);assert.ok(cleared.installed>0);
 const d=ev({id:'reopened',status:'ejecucion',installed:0,version:4,baseVersion:3,date:'2026-11-09'}),reopened=metrics(inv.vanos,[a,b,c,d],'2026-11-10');
 assert.equal(reopened.done,0);assert.equal(reopened.inProgress,1);assert.equal(reopened.installed,0);assert.deepEqual(reopened.daily,{});
});
test('all 235 completed spans sum exactly 1743 BD, even with no manually entered quantities',()=>{
 const events=inv.vanos.map((s,i)=>ev({id:'all-'+i,spanId:s.id,status:'terminado',installed:0,date:''})),m=metrics(inv.vanos,events,'2026-11-10');
 assert.equal(m.done,235);assert.equal(m.pending,0);assert.equal(m.inProgress,0);assert.equal(m.remaining,0);assert.equal(m.pct,100);assert.equal(m.installed,1743);assert.equal(m.calculatedInstalled,1743);assert.equal(m.average,0);
 assert.equal(metrics(inv.vanos.filter(s=>s.linea==='larga'),events,'2026-11-10').installed,1613);assert.equal(metrics(inv.vanos.filter(s=>s.linea==='corta'),events,'2026-11-10').installed,130);
});


test('finish projection rounds remaining spans up to whole days and uses only the dated rate',()=>{
 const spans=inv.vanos.slice(0,8),events=spans.slice(0,3).map((s,i)=>ev({id:'forecast-'+i,spanId:s.id,status:'terminado',date:i<2?'2026-11-08':'2026-11-09',installed:0}));
 const m=metrics(spans,events,'2026-11-10');assert.equal(m.average,1.5);assert.equal(m.remaining,5);assert.equal(m.estimatedDays,4);assert.equal(m.eta,'2026-11-14');
 const undated=metrics(spans,events.map(e=>({...e,date:''})),'2026-11-10');assert.equal(undated.estimatedDays,null);assert.equal(undated.eta,null);
 const finished=metrics(spans,spans.map((s,i)=>ev({id:'done-'+i,spanId:s.id,status:'terminado',date:'',installed:0})),'2026-11-10');assert.equal(finished.estimatedDays,0);assert.equal(finished.remaining,0);
});
