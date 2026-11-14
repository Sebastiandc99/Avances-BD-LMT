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
 assert.equal(visuals,51);
 const measures = model.model.tables[0].measures;
 assert.match(measures.find(m => m.name==='Avance total').expression,/ALL\(Vanos\)/);
 assert.match(measures.find(m => m.name==='Dias registrados').expression,/TerminadoConFecha/);
});

test('las tarjetas usan Data y los botones navegan a páginas existentes o limpian filtros',() => {
 const files=powerBiProject(inventory,[event('L-001-002')],'2026-11-13');
 const pages=JSON.parse(files['Avances.Report/definition/pages/pages.json']).pageOrder;
 assert.deepEqual(pages,['Resumen','Produccion','Vanos']);
 const roles={cardVisual:['Data'],slicer:['Values'],donutChart:['Category','Y'],stackedColumnChart:['Category','Y'],clusteredColumnChart:['Category','Y'],tableEx:['Values'],textbox:[],actionButton:[]};
 let cards=0,buttons=0;
 for(const [path,text] of Object.entries(files)) {
  if(!path.endsWith('/visual.json'))continue;
  const {visual}=JSON.parse(text);
  assert.deepEqual(Object.keys(visual.query.queryState).sort(),[...roles[visual.visualType]].sort(),path);
  if(visual.visualType==='cardVisual') {
   cards++;
   assert.equal(visual.query.queryState.Data.projections.length,1);
   assert.ok(visual.query.queryState.Data.projections[0].field.Measure);
  }
  if(visual.visualType==='actionButton') {
   buttons++;
   const action=visual.visualContainerObjects.visualLink[0].properties;
   assert.equal(action.show.expr.Literal.Value,'true');
   if(action.type.expr.Literal.Value==="'PageNavigation'") {
    assert.ok(pages.includes(action.navigationSection.expr.Literal.Value.slice(1,-1)));
   } else assert.equal(action.type.expr.Literal.Value,"'ClearAllSlicers'");
   assert.ok(visual.objects.text[1].properties.text.expr.Literal.Value.length>2);
  }
  if(visual.visualType==='textbox') {
   assert.ok(Array.isArray(visual.objects.general[0].properties.paragraphs));
  }
 }
 assert.equal(cards,14);
 assert.equal(buttons,12);
 const measures=JSON.parse(files['Avances.SemanticModel/model.bim']).model.tables[0].measures;
 const advance=measures.find(m=>m.name==='Avance de la seleccion').expression;
 assert.match(advance,/REMOVEFILTERS\(Vanos\[Estado\]\)/);
 assert.doesNotMatch(advance,/ALL\(Vanos\)/);
});
test('la composición cabe en cada página y los filtros comunes se conservan al navegar',() => {
 const files=powerBiProject(inventory,[],'2026-11-13');
 const pages={};
 for(const [path,text] of Object.entries(files)) {
  if(!path.endsWith('/visual.json'))continue;
  const v=JSON.parse(text),page=path.split('/')[3],p=v.position;
  assert.ok(p.x>=0&&p.y>=0&&p.x+p.width<=1280&&p.y+p.height<=800,path);
  for(const other of pages[page]||[]) {
   const q=other.position;
   assert.ok(!(p.x<q.x+q.width&&p.x+p.width>q.x&&p.y<q.y+q.height&&p.y+p.height>q.y),path+' overlaps '+other.name);
  }
  (pages[page]||=[]).push(v);
 }
 for(const visuals of Object.values(pages)) {
  for(const name of ['linea','estado','responsable']) {
   const slicer=visuals.find(v=>v.name===name);
   assert.equal(slicer.visual.syncGroup.groupName,'LMT_'+name);
   assert.equal(slicer.visual.syncGroup.filterChanges,true);
   assert.equal(slicer.visual.objects.data[0].properties.mode.expr.Literal.Value,"'Dropdown'");
  }
  const date=visuals.find(v=>v.name.startsWith('fecha'));
  assert.equal(date.visual.objects.data[0].properties.mode.expr.Literal.Value,"'Between'");
  assert.ok(date.position.height>=104);
 }
 const production=pages.Produccion.find(v=>v.name==='diario');
 assert.equal(production.visual.query.sortDefinition.sort[0].direction,'Ascending');
 assert.equal(production.visual.query.queryState.Category.projections[0].field.Column.Property,'FechaFinalizacion');
});
test('la primera apertura explica la carga de datos y el tema está incluido en el ZIP',() => {
 const files=powerBiProject(inventory,[],'2026-11-13','2026-11-13T21:00:00Z');
 assert.match(files['ABRIR_EN_PC.txt'],/Inicio > Actualizar/);
 assert.match(files['ABRIR_EN_PC.txt'],/Ctrl \+ clic/);
 assert.match(files['ABRIR_EN_PC.txt'],/copia de los datos/);
 const report=JSON.parse(files['Avances.Report/definition/report.json']);
 assert.equal(report.settings.defaultFilterActionIsDataFilter,true);
 const theme=report.resourcePackages[0].items[0];
 assert.ok(files['Avances.Report/StaticResources/RegisteredResources/'+theme.path]);
 for(const page of ['Resumen','Produccion','Vanos']) {
  const help=JSON.parse(files['Avances.Report/definition/pages/'+page+'/visuals/ayuda/visual.json']);
  assert.match(JSON.stringify(help),/Primera apertura/);
 }
});
