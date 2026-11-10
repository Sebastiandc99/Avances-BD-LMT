import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { searchPoles, viewAtPole } from '../lib/pole-search.ts';
const {piquetes,vanos}=JSON.parse(fs.readFileSync('public/assets/inventory.json','utf8'));
test('pole search resolves exact numbers and line prefixes without matching 19 to 190',()=>{
 assert.deepEqual(searchPoles(piquetes,'192').map(p=>p.id),['L-192']);assert.equal(searchPoles(piquetes,'19').length,1);
 assert.equal(searchPoles(piquetes,'1').length,2);assert.deepEqual(searchPoles(piquetes,'FP 003').map(p=>p.id),['FP-003']);
 assert.deepEqual(searchPoles(piquetes,'P98','corta').map(p=>p.id),['L-098']);assert.equal(searchPoles(piquetes,'piquete 17','corta')[0].id,'FP-017');
 for(const q of ['','0','220','FP 19','19-20','hola'])assert.equal(searchPoles(piquetes,q).length,0);
});
test('pole camera centers the exact CAD point with a selectable zoom and preserves screen aspect',()=>{
 const pole=piquetes.find(p=>p.id==='L-192'),view=viewAtPole(piquetes,vanos,pole.id,{w:400,h:500});
 assert.ok(view.w>=100&&view.w<=500);assert.equal(view.h/view.w,500/400);assert.equal(view.x+view.w/2,pole.pixel[0]);assert.equal(view.y+view.h/2,pole.pixel[1]);
 assert.equal(viewAtPole(piquetes,vanos,'L-999',{w:400,h:500}),null);
});
