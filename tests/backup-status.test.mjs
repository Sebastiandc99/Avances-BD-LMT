import test from 'node:test';
import assert from 'node:assert/strict';
import {backupStatus} from '../lib/backup-status.ts';
const signed={signedIn:true,online:true,syncing:false,pending:0,conflicts:0,lastVerified:'14:30',error:''};
test('conexión automática distingue arranque, falta de red y proveedor deshabilitado sin mostrar verde',()=>{
 assert.equal(backupStatus({...signed,signedIn:false,autoConnect:true,lastVerified:''}).kind,'connecting');
 assert.equal(backupStatus({...signed,signedIn:false,autoConnect:true,online:false}).kind,'offline');
 assert.equal(backupStatus({...signed,signedIn:false,autoConnect:true,error:'anonymous_provider_disabled'}).kind,'error');
 assert.match(backupStatus({...signed,deviceOnly:true}).detail,/Vinculá tu correo/);
});
test('sin cuenta nunca presenta una copia en la nube aunque haya conexión o una hora anterior',()=>{
 const result=backupStatus({...signed,signedIn:false,pending:80});
 assert.equal(result.kind,'local');assert.equal(result.tone,'warning');assert.match(result.detail,/solo en este navegador/);
});
test('solo confirma una copia tras verificarla, sin pendientes, errores, conflictos ni comprobación en curso',()=>{
 assert.equal(backupStatus(signed).kind,'verified');
 for(const [change,kind] of [[{lastVerified:''},'unverified'],[{pending:2},'pending'],[{error:'La nube no respondió'},'error'],[{conflicts:1},'conflict'],[{syncing:true},'syncing'],[{online:false},'offline']]){
  assert.equal(backupStatus({...signed,...change}).kind,kind);
  assert.notEqual(backupStatus({...signed,...change}).tone,'success');
 }
});
test('un guardado posterior o perder conexión retira la confirmación hasta completar la siguiente sincronización',()=>{
 assert.equal(backupStatus(signed).kind,'verified');
 assert.equal(backupStatus({...signed,pending:1}).kind,'pending');
 assert.equal(backupStatus({...signed,pending:1,online:false}).kind,'offline');
 assert.equal(backupStatus({...signed,pending:1,syncing:true}).kind,'syncing');
 assert.equal(backupStatus({...signed,lastVerified:'14:31'}).kind,'verified');
});

test('la sesión nueva de otro dispositivo muestra cómo recuperar los avances en vez de confirmar una copia vacía',()=>{
 const empty=backupStatus({...signed,deviceOnly:true,savedRecords:0});
 assert.equal(empty.kind,'empty-device');assert.equal(empty.tone,'warning');assert.match(empty.detail,/desde ese celular/);
 assert.equal(backupStatus({...signed,deviceOnly:true,savedRecords:179}).kind,'verified');
 assert.equal(backupStatus({...signed,deviceOnly:false,savedRecords:0}).kind,'verified');
});
