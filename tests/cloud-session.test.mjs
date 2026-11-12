import test from 'node:test';
import assert from 'node:assert/strict';
import { automaticSession } from '../lib/cloud-session.ts';
const identity={user:{id:'private-device',is_anonymous:true}};
const result=session=>({data:{session},error:null});
test('una sesión guardada se reutiliza; no crea otra identidad',async()=>{
 let creates=0;const connect=automaticSession({getSession:async()=>result(identity),signInAnonymously:async()=>{creates++;return result(identity);}},()=>true);
 assert.equal(await connect(),identity);assert.equal(creates,0);
});
test('primer acceso crea una sola sesión privada aunque coincidan llamadas',async()=>{
 let creates=0;const connect=automaticSession({getSession:async()=>result(null),signInAnonymously:async()=>{creates++;return result(identity);}},()=>false);
 const [a,b]=await Promise.all([connect(),connect()]);assert.equal(a,identity);assert.equal(b,identity);assert.equal(creates,1);
});
test('perder la sesión de una identidad anterior bloquea la creación de una cuenta vacía',async()=>{
 let creates=0;const connect=automaticSession({getSession:async()=>result(null),signInAnonymously:async()=>{creates++;return result(identity);}},()=>true);
 await assert.rejects(connect(),/no se creó otra cuenta/);assert.equal(creates,0);
});
test('proveedor deshabilitado devuelve un error concreto y no confirma una copia',async()=>{
 const connect=automaticSession({getSession:async()=>result(null),signInAnonymously:async()=>({data:{session:null},error:{code:'anonymous_provider_disabled',message:'disabled'}})},()=>false);
 await assert.rejects(connect(),/falta habilitar/);
});
test('un fallo de conexión conserva la identidad previa; el reintento puede recuperar su sesión',async()=>{
 let first=true,creates=0;const connect=automaticSession({getSession:async()=>{if(first){first=false;return {data:{session:null},error:{message:'offline'}};}return result(identity);},signInAnonymously:async()=>{creates++;return result(identity);}},()=>true);
 await assert.rejects(connect(),/offline/);assert.equal(await connect(),identity);assert.equal(creates,0);
});
test('una respuesta sin sesión nunca cuenta como autenticación correcta',async()=>{
 const connect=automaticSession({getSession:async()=>result(null),signInAnonymously:async()=>result(null)},()=>false);
 await assert.rejects(connect(),/no confirmó/);
});
