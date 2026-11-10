import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import { DatabaseSync } from 'node:sqlite';
const source=fs.readFileSync(new URL('../app/api/sync/route.ts',import.meta.url),'utf8');
const insert=source.match(/prepare\('(INSERT INTO lmt_events[^']+)'\)/)[1];
const schema=fs.readFileSync(new URL('../drizzle/0000_clever_natasha_romanoff.sql',import.meta.url),'utf8');
test('actual production SQL applies optimistic locking atomically and separates users',()=>{
 const db=new DatabaseSync(':memory:');db.exec(schema);const q=db.prepare(insert);const write=(id,owner,span,version,base)=>q.run(id,owner,span,version,JSON.stringify({id}),'author','2026-11-08',owner,span,base).changes;
 assert.equal(write('a','one','L-001-002',1,0),1);
 assert.equal(write('b','one','L-001-002',1,0),0);
 assert.equal(write('c','one','L-001-002',3,2),0);
 assert.equal(write('d','two','L-001-002',1,0),1);
 assert.equal(write('e','one','L-002-003',1,0),1);
 assert.equal(write('f','one','L-001-002',2,1),1);
 assert.equal(db.prepare('SELECT count(*) AS n FROM lmt_events WHERE owner=?').get('one').n,3);db.close();
});
