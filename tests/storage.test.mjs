import 'fake-indexeddb/auto';
import assert from 'node:assert/strict';
import test from 'node:test';
import { readStore, saveLocal, claimLocalRecords } from '../lib/storage.ts';
test('account linking preserves existing offline records/photos and keeps accounts isolated',async()=>{
 const event={id:'local-record',sync:'pending'},photo={id:'local-photo',uploaded:true};
 await saveLocal('local-device',[event],[photo]);
 await claimLocalRecords('account-A');
 assert.deepEqual(await readStore('events','account-A'),[event]);
 assert.deepEqual(await readStore('photos','account-A'),[{...photo,uploaded:false}]);
 assert.deepEqual(await readStore('events','local-device'),[]);
 await claimLocalRecords('account-B');
 assert.deepEqual(await readStore('events','account-B'),[]);
 await claimLocalRecords('account-A');
 assert.equal((await readStore('events','account-A')).length,1);
 await saveLocal('account-B',[{id:'private-B',sync:'pending'}]);
 assert.equal((await readStore('events','account-A'))[0].id,'local-record');
});
