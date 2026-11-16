import test from 'node:test';
import assert from 'node:assert/strict';
import { resizeMapView } from '../lib/map-view.ts';
test('opening and closing the mobile sheet restores the same zoom and center',()=>{
 const view={x:715.25,y:1234.5,w:820,h:1000},full={w:410,h:500},sheet={w:410,h:310};
 const resized=resizeMapView(view,full,sheet);
 assert.equal(resized.w/sheet.w,view.w/full.w);assert.equal(resized.y+resized.h/2,view.y+view.h/2);
 assert.deepEqual(resizeMapView(resized,sheet,full),view);
});
test('a width change keeps the same screen scale and map center',()=>{
 const view={x:120,y:200,w:800,h:500},next=resizeMapView(view,{w:800,h:500},{w:400,h:300});
 assert.equal(next.w/400,view.w/800);assert.equal(next.x+next.w/2,view.x+view.w/2);assert.equal(next.y+next.h/2,view.y+view.h/2);
});

test('cada apertura comienza en Resumen y conserva fecha, filtros y cámara de la sesión',async()=>{
 const {readViewState,saveViewState}=await import('../lib/view-state.ts');
 const first=new Map();
 globalThis.sessionStorage={getItem:key=>first.get(key)||null,setItem:(key,value)=>first.set(key,value)};
 const view={...readViewState(),tab:'map',mapLine:'larga',listLine:'corta',listDate:'2026-11-15',listFilter:'ejecucion',mapMemory:{line:'larga',view:{x:120,y:340,w:600,h:450},size:{w:800,h:600},spanFocusRequest:8}};
 assert.equal(readViewState().tab,'metrics');
 saveViewState(view);assert.deepEqual(readViewState(),{...view,tab:'metrics'});
 for(const tab of ['list','map','metrics','history']){saveViewState({...view,tab});assert.equal(readViewState().tab,'metrics');}
 globalThis.sessionStorage={getItem:()=>null,setItem:()=>{}};
 assert.equal(readViewState().tab,'metrics');assert.equal(readViewState().listDate,'');assert.equal(readViewState().mapMemory,null);
 delete globalThis.sessionStorage;
});
