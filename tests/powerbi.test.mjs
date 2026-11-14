import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { unzipSync, strFromU8 } from 'fflate';
import { emptyProgress } from '../lib/model.ts';
import { powerBiData, powerBiProject, powerBiFromCloud } from '../lib/powerbi-export.ts';

const inventory = JSON.parse(fs.readFileSync(new URL('../public/assets/inventory.json',import.meta.url)));
const event = (spanId,changes={}) => ({
 ...emptyProgress(),id:spanId,spanId,status:'terminado',version:1,baseVersion:0,
 createdAt:'2026-11-10T12:00:00Z',author:'Prueba',sync:'synced',...changes
});
test('Power BI mantiene las cantidades y las fechas explicitas con la revision vigente',() => {
 const events = [
  event('L-001-002',{date:'2026-11-08'}),
  event('L-001-002',{id:'correction',version:2,baseVersion:1,date:'2026-11-09'}),
  event('L-002-003'),
  event('FP-001-002',{status:'ejecucion',date:'2026-11-09',installed:4})
 ];
 const data = powerBiData(inventory,events,'2026-11-10');
 assert.equal(data.vanos.length,235);
 assert.equal(data.vanos.reduce((n,v) => n+v.BDPrevistos,0),1743);
 assert.equal(data.vanos.filter(v => v.Linea==='Corta').length,17);
 assert.equal(data.vanos[0].Fecha,'2026-11-09');
 assert.equal(data.vanos[1].FechaFinalizacion,null);
 assert.equal(data.historial.length,4);
 assert.equal(data.resumen.done,2);
 assert.equal(data.resumen.inProgress,1);
 assert.equal(data.resumen.datedDone,1);
 assert.equal(data.resumen.average,1);
 assert.equal(data.vanos.reduce((n,v) => n+v.BDColocados,0),data.resumen.installed);
});
test('la descarga consulta la nube y propaga errores sin sustituir datos locales',async() => {
 let reads = 0;
 const bytes = await powerBiFromCloud(inventory,{listEvents:async() => {reads++;return [event('L-001-002')];}},'2026-11-10');
 assert.equal(reads,1);
 const files = unzipSync(bytes);
 assert.ok(files['Avances_BD_LMT.pbip']);
 const model = JSON.parse(strFromU8(files['Avances.SemanticModel/model.bim']));
 assert.equal(model.model.tables[0].partitions[0].source.type,'m');
 assert.ok(strFromU8(files['ABRIR_EN_PC.txt']).includes('copia de los datos'));
 await assert.rejects(powerBiFromCloud(inventory,{listEvents:async() => []}),/todavia no tiene avances/);
 await assert.rejects(powerBiFromCloud(inventory,{listEvents:async() => {throw Error('permiso');}}),/permiso/);
});
test('el texto de obra se trata como datos M y conserva caracteres especiales',() => {
 const notes = 'Texto "citado" #(lf) con salto\n y áéñ';
 const files = powerBiProject(inventory,[event('L-001-002',{notes})],'2026-11-10');
 const model = JSON.parse(files['Avances.SemanticModel/model.bim']);
 const source = model.model.tables[0].partitions[0].source.expression[1];
 const literal = source.match(/Json.Document\("(.*)"\), \{/)[1];
 const rows = JSON.parse(literal.replaceAll('""','"').replaceAll('#(0023)','#'));
 assert.equal(rows[0].Observaciones,notes);
 for(const [path,text] of Object.entries(files)) {
  assert.ok(!/\.(png|jpg|svg|pdf)$/i.test(path));
  assert.ok(!/sb_secret_|service_role|access_token|refresh_token|Bearer |Web.Contents/.test(text));
 }
});
test('los campos de cada visual existen en las tablas y medidas del modelo',() => {
 const files = powerBiProject(inventory,[event('L-001-002')],'2026-11-10');
 const model = JSON.parse(files['Avances.SemanticModel/model.bim']);
 let visuals = 0;
 for(const [path,text] of Object.entries(files)) {
  if(!path.endsWith('/visual.json'))continue;
  visuals++;
  const visual = JSON.parse(text).visual;
  for(const role of Object.values(visual.query.queryState))for(const projection of role.projections) {
   const type = projection.field.Measure ? 'Measure' : 'Column';
   const field = projection.field[type];
   const table = model.model.tables.find(t => t.name===field.Expression.SourceRef.Entity);
   assert.ok(table);
   assert.ok((type==='Measure'?table.measures:table.columns).some(v => v.name===field.Property));
  }
 }
 assert.equal(visuals,19);
 const measures = model.model.tables[0].measures;
 assert.match(measures.find(m => m.name==='Avance total').expression,/ALL\(Vanos\)/);
 assert.match(measures.find(m => m.name==='Dias registrados').expression,/TerminadoConFecha/);
});
