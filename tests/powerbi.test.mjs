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
 assert.equal(JSON.parse(strFromU8(files['Avances.Report/definition.pbir'])).version,'1.0');
 assert.ok(files['Avances.Report/report.json']);
 assert.ok(!Object.keys(files).some(p=>p.startsWith('Avances.Report/definition/')));
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

const readReport = files => JSON.parse(files['Avances.Report/report.json']);
const pageVisuals = page => page.visualContainers.map(container => {
 const config=JSON.parse(container.config);
 return {name:config.name,visual:config.singleVisual,position:config.layouts[0].position,container};
});

test('el paquete selecciona el formato heredado para Desktop 2.140 sin PBIR mejorado',() => {
 const files=powerBiProject(inventory,[event('L-001-002')],'2026-11-14');
 const metadata=JSON.parse(files['Avances.Report/definition.pbir']);
 assert.equal(metadata.version,'1.0');
 assert.match(metadata.$schema,/definitionProperties\/1\.0\.0/);
 assert.equal(metadata.datasetReference.byPath.path,'../Avances.SemanticModel');
 assert.equal(Object.keys(files).length,7);
 assert.ok(!Object.keys(files).some(path=>path.startsWith('Avances.Report/definition/')));
 assert.ok(!Object.keys(files).some(path=>path.endsWith('/visual.json')));
 const report=readReport(files);
 assert.deepEqual(report.sections.map(s=>s.name),['Resumen','Produccion','Vanos']);
 assert.equal(JSON.parse(report.config).version,'5.55');
 assert.equal(report.sections.flatMap(s=>s.visualContainers).length,51);
 assert.match(files['ABRIR_EN_PC.txt'],/2\.140\.1454\.0/);
 const measures=JSON.parse(files['Avances.SemanticModel/model.bim']).model.tables[0].measures;
 assert.match(measures.find(m=>m.name==='Avance de la seleccion').expression,/REMOVEFILTERS\(Vanos\[Estado\]\)/);
 assert.doesNotMatch(measures.find(m=>m.name==='Avance de la seleccion').expression,/ALL\(Vanos\)/);
 assert.match(measures.find(m=>m.name==='Dias registrados').expression,/TerminadoConFecha/);
});

test('las consultas heredadas resuelven alias, selecciones y campos del modelo',() => {
 const files=powerBiProject(inventory,[event('L-001-002')],'2026-11-14');
 const model=JSON.parse(files['Avances.SemanticModel/model.bim']);
 for(const page of readReport(files).sections)for(const {visual,name} of pageVisuals(page)) {
  if(!visual.prototypeQuery)continue;
  assert.equal(visual.prototypeQuery.Version,2);
  const aliases=Object.fromEntries(visual.prototypeQuery.From.map(f=>[f.Name,f.Entity]));
  const selects=visual.prototypeQuery.Select;
  assert.equal(new Set(selects.map(s=>s.Name)).size,selects.length);
  const checkField=field=>{
   const type=field.Measure?'Measure':'Column',value=field[type];
   assert.ok(value,name);
   assert.ok(value.Expression.SourceRef.Source,name);
   assert.ok(!value.Expression.SourceRef.Entity,name);
   const table=model.model.tables.find(t=>t.name===aliases[value.Expression.SourceRef.Source]);
   assert.ok(table,name);
   assert.ok((type==='Measure'?table.measures:table.columns).some(c=>c.name===value.Property),name);
  };
  for(const select of selects)checkField(select);
  for(const role of Object.values(visual.projections))for(const p of role) {
   assert.ok(selects.some(s=>s.Name===p.queryRef),name);
  }
  for(const order of visual.prototypeQuery.OrderBy||[]) {
   assert.ok([1,2].includes(order.Direction));
   checkField(order.Expression);
  }
  assert.equal(visual.query,undefined);
 }
});

test('las tarjetas clásicas usan Values y los botones mantienen destinos válidos',() => {
 const files=powerBiProject(inventory,[event('L-001-002')],'2026-11-14');
 const report=readReport(files),pages=report.sections.map(s=>s.name);
 const roles={card:['Values'],slicer:['Values'],donutChart:['Category','Y'],stackedColumnChart:['Category','Y'],clusteredColumnChart:['Category','Y'],tableEx:['Values'],textbox:[],actionButton:[]};
 let cards=0,buttons=0;
 for(const page of report.sections)for(const {visual,name} of pageVisuals(page)) {
  assert.ok(roles[visual.visualType],visual.visualType);
  assert.deepEqual(Object.keys(visual.projections||{}).sort(),[...roles[visual.visualType]].sort(),name);
  if(visual.visualType==='card') {
   cards++;
   assert.equal(visual.projections.Values.length,1);
   assert.ok(visual.prototypeQuery.Select[0].Measure);
   assert.equal(visual.objects.categoryLabels[0].properties.show.expr.Literal.Value,'true');
   assert.ok(visual.objects.labels);
   assert.equal(visual.objects.value,undefined);
  }
  if(visual.visualType==='actionButton') {
   buttons++;
   const action=visual.vcObjects.visualLink[0].properties;
   assert.equal(action.show.expr.Literal.Value,'true');
   if(action.type.expr.Literal.Value==="'PageNavigation'")assert.ok(pages.includes(action.navigationSection.expr.Literal.Value.slice(1,-1)));
   else assert.equal(action.type.expr.Literal.Value,"'ClearAllSlicers'");
   assert.ok(visual.objects.text[1].properties.text.expr.Literal.Value.length>2);
  }
  if(visual.visualType==='textbox')assert.ok(Array.isArray(visual.objects.general[0].properties.paragraphs));
 }
 assert.equal(cards,14);
 assert.equal(buttons,12);
});

test('la composición heredada conserva geometría, filtros sincronizados y orden por fecha',() => {
 const files=powerBiProject(inventory,[],'2026-11-14');
 const pages=readReport(files).sections;
 for(const page of pages) {
  assert.equal(page.displayOption,1);
  assert.deepEqual(JSON.parse(page.filters),[]);
  assert.ok(JSON.parse(page.config).objects.background);
  const visuals=pageVisuals(page),seen=[];
  for(const v of visuals) {
   const p=v.position;
   assert.ok(p.x>=0&&p.y>=0&&p.x+p.width<=page.width&&p.y+p.height<=page.height,v.name);
   assert.equal(v.container.x,p.x);
   assert.equal(v.container.width,p.width);
   for(const other of seen) {
    const q=other.position;
    assert.ok(!(p.x<q.x+q.width&&p.x+p.width>q.x&&p.y<q.y+q.height&&p.y+p.height>q.y),v.name+' overlaps '+other.name);
   }
   seen.push(v);
  }
  for(const name of ['linea','estado','responsable']) {
   const slicer=visuals.find(v=>v.name===name).visual;
   assert.equal(slicer.syncGroup.groupName,'LMT_'+name);
   assert.equal(slicer.syncGroup.filterChanges,true);
   assert.equal(slicer.objects.data[0].properties.mode.expr.Literal.Value,"'Dropdown'");
  }
  const date=visuals.find(v=>v.name.startsWith('fecha'));
  assert.equal(date.visual.objects.data[0].properties.mode.expr.Literal.Value,"'Between'");
  assert.ok(date.position.height>=104);
 }
 const production=pageVisuals(pages.find(p=>p.name==='Produccion')).find(v=>v.name==='diario').visual;
 assert.equal(production.prototypeQuery.OrderBy[0].Direction,1);
 assert.equal(production.prototypeQuery.Select[0].Column.Property,'FechaFinalizacion');
});

test('la apertura sólo explica PBIP heredado y el tema clásico está incluido',() => {
 const files=powerBiProject(inventory,[],'2026-11-14','2026-11-14T10:00:00Z');
 const instructions=files['ABRIR_EN_PC.txt'];
 assert.match(instructions,/Inicio > Actualizar/);
 assert.match(instructions,/Ctrl \+ clic/);
 assert.match(instructions,/copia de los datos/);
 assert.match(instructions,/Power BI Project \(\.pbip\) save option/);
 assert.doesNotMatch(instructions,/con Power BI Desktop actualizado|PBIP o el formato PBIR, activalos/);
 const report=readReport(files),config=JSON.parse(report.config);
 assert.equal(config.defaultFilterActionIsDataFilter,true);
 const resource=report.resourcePackages[0].resourcePackage;
 assert.equal(resource.type,1);
 assert.equal(resource.items[0].type,201);
 assert.ok(files['Avances.Report/StaticResources/'+resource.name+'/'+resource.items[0].path]);
 assert.equal(config.themeCollection.customTheme.type,1);
 for(const page of report.sections)assert.match(JSON.stringify(pageVisuals(page).find(v=>v.name==='ayuda').visual),/Primera apertura/);
});
