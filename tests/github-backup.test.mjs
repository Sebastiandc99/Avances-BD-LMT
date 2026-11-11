import test from 'node:test';
import assert from 'node:assert/strict';
import { GITHUB_DATA_REPO, githubRecords, parseGitHubBackup, mergeGitHubRecords, saveGitHubBackup, restoreGitHubBackups } from '../lib/github-backup.ts';
const device='aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
const path='backups/equipo-'+device+'.json';
const event={id:'11111111-1111-4111-8111-111111111111',spanId:'L-001-002',status:'terminado',date:'',installed:0,responsible:'Cuadrilla de prueba',notes:'Sin fecha histórica',photos:[],version:1,baseVersion:0,createdAt:'2026-11-01T12:00:00Z',author:'Prueba',sync:'pending'};
const text=events=>JSON.stringify({format:'lmt-backup-v1',events,photos:[]});
function server(options={}){
 const calls=[],files={...(options.files||{})},trees=new Map([['t0',{...files}]]),commits=new Map([['c0','t0']]);let head='c0',counter=0,collided=false;
 const json=(x,status=200)=>new Response(JSON.stringify(x),{status,headers:{'Content-Type':'application/json'}});
 const send=async(url,init={})=>{
  assert.ok(url.startsWith('https://api.github.com/repos/'+GITHUB_DATA_REPO));
  assert.equal(init.headers.Authorization,'Bearer test-token');
  const u=new URL(url),p=u.pathname.replace('/repos/'+GITHUB_DATA_REPO,''),method=init.method||'GET',body=init.body?JSON.parse(init.body):null;calls.push({p,method,body});
  if(options.unauthorized)return json({},401);
  if(p==='')return json({full_name:GITHUB_DATA_REPO,private:!options.public,visibility:options.public?'public':'private',default_branch:'main',permissions:{push:true}});
  if(p==='/git/ref/heads/main')return json({object:{sha:head}});
  if(p==='/contents/backups')return json(Object.keys(files).map(path=>({path,type:'file'})));
  if(p.startsWith('/contents/')){const file=p.slice('/contents/'.length);if(!(file in files))return json({},404);return new Response(options.badReadback&&counter?text([]):files[file]);}
  if(p.startsWith('/git/commits/')&&method==='GET')return json({tree:{sha:commits.get(p.split('/').at(-1))}});
  if(p==='/git/trees'){const t='t'+(++counter);trees.set(t,{...trees.get(body.base_tree),...Object.fromEntries(body.tree.map(f=>[f.path,f.content]))});return json({sha:t},201);}
  if(p==='/git/commits'){const c='c'+(++counter);commits.set(c,body.tree);return json({sha:c},201);}
  if(p==='/git/refs/heads/main'){
   assert.equal(body.force,false);
   if(options.collide&&!collided){collided=true;return json({},422);}
   head=body.sha;Object.assign(files,trees.get(commits.get(head)));return json({object:{sha:head}});
  }
  throw Error('Unexpected request '+method+' '+p);
 };
 return {send,calls,files};
}
test('destino público o autorización rechazada: no envía contenido ni hace commits',async()=>{
 for(const options of [{public:true},{unauthorized:true}]){const s=server(options);await assert.rejects(saveGitHubBackup('test-token',[event],device,s.send));assert.equal(s.calls.length,1);assert.ok(s.calls.every(c=>c.method==='GET'));}
});
test('guarda UTF-8, conserva otros equipos y confirma leyendo el archivo',async()=>{
 const other='backups/recuperado-2026-01-01.json',s=server({files:{[other]:text([event])}});
 const result=await saveGitHubBackup('test-token',[event],device,s.send);
 assert.ok(result.sha);assert.deepEqual(parseGitHubBackup(s.files[path]),[event]);assert.equal(s.files[other],text([event]));
 const tree=s.calls.find(c=>c.p==='/git/trees');assert.match(tree.body.tree[0].content,/Sin fecha histórica/);assert.equal(tree.body.tree[0].path,path);
 assert.ok(!s.calls.some(c=>c.p==='/git/blobs'));assert.equal(s.calls.at(-1).p,'/contents/'+path);
});
test('no crea commits repetidos si la copia remota coincide',async()=>{
 const s=server({files:{[path]:text([event])}});await saveGitHubBackup('test-token',[event],device,s.send);assert.ok(s.calls.every(c=>c.method==='GET'));
});
test('una vista vacía no pisa una copia anterior del mismo equipo',async()=>{
 const s=server({files:{[path]:text([event])}});await assert.rejects(saveGitHubBackup('test-token',[],device,s.send),/Recuperar registros/);assert.ok(s.calls.every(c=>c.method==='GET'));assert.equal(s.files[path],text([event]));
});
test('colisión de rama: reintento acotado, siempre sin force',async()=>{
 const s=server({collide:true});await saveGitHubBackup('test-token',[event],device,s.send);assert.equal(s.calls.filter(c=>c.method==='PATCH').length,2);assert.deepEqual(parseGitHubBackup(s.files[path]),[event]);
});
test('contenido no coincidente después de guardar nunca se da por confirmado',async()=>{
 const s=server({badReadback:true});await assert.rejects(saveGitHubBackup('test-token',[event],device,s.send),/misma copia/);
});
test('recupera copias, deduplica UUID, conserva eventos locales y fotos existentes',async()=>{
 const extra={...event,id:'22222222-2222-4222-8222-222222222222',spanId:'L-002-003'};
 const s=server({files:{'backups/recuperado-2026-01-01.json':text([event,extra]),[path]:text([event]),'backups/.gitkeep':''}});
 const incoming=await restoreGitHubBackups('test-token',s.send);assert.equal(incoming.length,2);
 const original={...event,photos:['33333333-3333-4333-8333-333333333333']};const merged=mergeGitHubRecords([original],incoming);
 assert.equal(merged.length,2);assert.equal(merged[0],original);assert.equal(merged[1].sync,'pending');assert.equal(mergeGitHubRecords(merged,incoming).length,2);
});
test('serialización explícita excluye fotos y credenciales, preserva fecha vacía y descarta archivos inválidos',()=>{
 const raw={...event,photos:['33333333-3333-4333-8333-333333333333'],token:'secret-not-for-backup'};
 const encoded=githubRecords([raw]);assert.ok(!encoded.includes('secret-not-for-backup'));assert.deepEqual(JSON.parse(encoded)[0].photos,[]);assert.equal(JSON.parse(encoded)[0].date,'');
 assert.throws(()=>parseGitHubBackup(text([{...event,spanId:'L-219-220'}])));
 assert.throws(()=>parseGitHubBackup(JSON.stringify({format:'lmt-backup-v1',events:[event],photos:[{data:'image'}]})));
 assert.throws(()=>githubRecords([event,event]));
});
