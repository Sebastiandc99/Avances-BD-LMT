import test from 'node:test';
import assert from 'node:assert/strict';
import { DRIVE_FOLDER_ID, saveDriveBackup } from '../lib/drive-backup.ts';
const device='00000000-0000-4000-8000-000000000001',name='Avances_BD_LMT_'+device+'.json';
const snapshot=JSON.stringify({format:'lmt-backup-v1',events:[],photos:[],createdAt:'2026-11-10T10:00:00Z'});
function backend({existing=false,wrongContent=false,denied=false,wrongFolder=false}={}){
 const calls=[];return {calls,async send(input,init){const url=new URL(input);calls.push({url:url.href,init});assert.equal(url.origin,'https://www.googleapis.com');assert.equal(new Headers(init.headers).get('Authorization'),'Bearer test-token');assert.equal(url.searchParams.get('access_token'),null);
  if(denied)return Response.json({error:{message:'No autorizado'}},{status:403});
  if(url.pathname==='/drive/v3/files/'+DRIVE_FOLDER_ID)return Response.json({id:DRIVE_FOLDER_ID,mimeType:'application/vnd.google-apps.folder',trashed:false,capabilities:{canAddChildren:true}});
  if(url.pathname==='/drive/v3/files'&&url.searchParams.has('q')){assert.ok(url.searchParams.get('q').includes(DRIVE_FOLDER_ID));return Response.json({files:existing?[{id:'backup-file',name,mimeType:'application/json',parents:[wrongFolder?'other-folder':DRIVE_FOLDER_ID]}]:[]});}
  if(url.pathname.startsWith('/upload/')){assert.equal(init.method,existing?'PATCH':'POST');const body=await init.body.text();assert.ok(body.includes(snapshot));assert.ok(body.includes('"app":"avances-bd-lmt"'));assert.equal(body.includes('"parents"'),!existing);return Response.json({id:'backup-file',name,parents:[DRIVE_FOLDER_ID]});}
  if(url.pathname==='/drive/v3/files/backup-file'&&url.searchParams.get('alt')==='media')return new Response(wrongContent?'incomplete':snapshot);
  throw Error('Unexpected request '+url.pathname);
 }};
}
test('Drive backup creates only in the fixed folder and verifies the exact written content',async()=>{
 const b=backend();const result=await saveDriveBackup('test-token',snapshot,device,b.send);assert.equal(result.id,'backup-file');assert.equal(b.calls.length,4);assert.ok(!b.calls.some(c=>c.url.includes('/permissions')));
});
test('later Drive saves update the same device file and never overwrite a file outside the target folder',async()=>{
 const b=backend({existing:true});await saveDriveBackup('test-token',snapshot,device,b.send);assert.ok(b.calls.some(c=>c.init.method==='PATCH'&&c.url.includes('backup-file')));
 const wrong=backend({existing:true,wrongFolder:true});await assert.rejects(saveDriveBackup('test-token',snapshot,device,wrong.send),/no es un respaldo/);assert.equal(wrong.calls.length,2);
});
test('Drive verification failure is never reported as success',async()=>{
 const b=backend({wrongContent:true});await assert.rejects(saveDriveBackup('test-token',snapshot,device,b.send),/verificar el contenido/);
});
test('Google authorization failure never falls back to another folder or root',async()=>{
 const b=backend({denied:true});await assert.rejects(saveDriveBackup('test-token',snapshot,device,b.send),/No autorizado/);assert.equal(b.calls.length,1);
});
