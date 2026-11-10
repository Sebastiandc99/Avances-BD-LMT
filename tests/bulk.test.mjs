import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { completionPlan, completedEvents } from '../lib/bulk-progress.ts';
import { latestRecords, metrics, validProgress } from '../lib/model.ts';
const {vanos}=JSON.parse(fs.readFileSync('public/assets/inventory.json','utf8'));
const options={date:'2026-11-08',responsible:'',author:'Prueba'};
let id=0;const makeId=()=>`00000000-0000-4000-8000-${String(++id).padStart(12,'0')}`;
test('ranges use pole endpoints, deduplicate overlaps and cover exactly 235 existing spans',()=>{
 const plan=completionPlan(vanos,[{line:'larga',from:1,to:18},{line:'larga',from:10,to:20}],{},[]);
 assert.equal(plan.eligible.length,19);assert.equal(plan.eligible[0],'L-001-002');assert.equal(plan.eligible.at(-1),'L-019-020');
 const all=completionPlan(vanos,[{line:'larga',from:1,to:219},{line:'corta',from:1,to:18}],{},[]);assert.equal(all.selected.length,235);
 for(const range of [{line:'corta',from:1,to:19},{line:'larga',from:18,to:18},{line:'larga',from:19,to:2},{line:'larga',from:0,to:10},{line:'larga',from:1.5,to:8}])assert.throws(()=>completionPlan(vanos,[range],{},[]));
});
test('bulk completion keeps measured quantities, photos and notes; completed/conflicted spans are skipped',()=>{
 const old=completedEvents(['L-001-002','L-002-003','L-003-004'],{},options,makeId,'2026-11-10T10:00:00Z');
 old[0]={...old[0],status:'ejecucion',installed:6,notes:'Nota previa',photos:[makeId()],responsible:'Cuadrilla A'};
 old[2]={...old[2],status:'ejecucion',sync:'conflict'};
 const records=latestRecords(old),plan=completionPlan(vanos,[{line:'larga',from:1,to:5}],records,['L-003-004']);
 assert.deepEqual(plan.eligible,['L-001-002','L-004-005']);assert.equal(plan.done.length,1);assert.equal(plan.blocked.length,1);
 const additions=completedEvents(plan.eligible,records,{...options,date:''},makeId,'2026-11-10T11:00:00Z');
 assert.ok(additions.every(validProgress));assert.equal(additions[0].installed,6);assert.equal(additions[0].notes,'Nota previa');assert.deepEqual(additions[0].photos,old[0].photos);assert.equal(additions[0].responsible,'Cuadrilla A');assert.equal(additions[0].date,'');assert.equal(additions[0].version,2);assert.equal(additions[0].baseVersion,1);assert.equal(additions[1].installed,0);
 const next=latestRecords([...old,...additions]);assert.equal(completionPlan(vanos,[{line:'larga',from:1,to:5}],next,['L-003-004']).eligible.length,0);
});
test('a dated historical load counts completed spans and derives BD without inventing measured entries',()=>{
 const plan=completionPlan(vanos,[{line:'corta',from:1,to:18}],{},[]);
 const events=completedEvents(plan.eligible,{},options,makeId,'2026-11-10T10:00:00Z');
 const summary=metrics(vanos,events,'2026-11-10');assert.equal(summary.done,17);assert.equal(summary.daily['2026-11-08'],17);assert.equal(summary.installed,130);assert.ok(events.every(e=>e.installed===0));assert.equal(summary.planned,1743);
});

test('dates mode revises already completed spans without counting them twice or changing field data',()=>{
 const ids=vanos.slice(0,3).map(s=>s.id),old=completedEvents(ids,{},options,makeId,'2026-11-08T10:00:00Z');
 old[0]={...old[0],installed:8,notes:'Conservar',responsible:'A',photos:[makeId()]};old[2]={...old[2],status:'ejecucion',installed:2};
 const current=latestRecords(old),plan=completionPlan(vanos,[{line:'larga',from:1,to:5}],current,[],'dates');
 assert.deepEqual(plan.eligible,ids.slice(0,2));assert.equal(plan.notFinished.length,2);
 const revisions=completedEvents(plan.eligible,current,{date:'2026-11-06',responsible:'No debe pisar',author:'Prueba',mode:'dates'},makeId,'2026-11-10T10:00:00Z');
 const m=metrics(vanos,[...old,...revisions],'2026-11-10');assert.equal(m.done,2);assert.deepEqual(m.daily,{'2026-11-06':2});
 assert.equal(revisions[0].version,2);assert.equal(revisions[0].baseVersion,1);assert.equal(revisions[0].installed,8);assert.equal(revisions[0].notes,'Conservar');assert.equal(revisions[0].responsible,'A');assert.deepEqual(revisions[0].photos,old[0].photos);
});
