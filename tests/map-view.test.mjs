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
