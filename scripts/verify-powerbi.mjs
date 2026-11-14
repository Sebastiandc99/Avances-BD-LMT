import { createRequire } from 'node:module';
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { powerBiProject, powerBiTarget } from '../lib/powerbi-export.ts';
const require = createRequire(import.meta.url);
const Ajv = require('ajv');
const schemas = new Map();
const ajv = new Ajv({allErrors:true,strict:false,validateFormats:false,loadSchema:async uri => {
 const path = new URL(uri).pathname.replace('/json-schemas/','').replace('schema.embedded.json','schema-embedded.json');
 const response = await fetch('https://raw.githubusercontent.com/microsoft/json-schemas/main/'+path,{signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw Error('Schema HTTP '+response.status+' '+path);
 return response.json();
}});
const inventory = JSON.parse(fs.readFileSync(new URL('../public/assets/inventory.json',import.meta.url)));
const files = powerBiProject(inventory,[],'2026-11-10');
const roles = {card:['Values'],slicer:['Values'],donutChart:['Category','Y'],stackedColumnChart:['Category','Y'],clusteredColumnChart:['Category','Y'],tableEx:['Values'],textbox:[],actionButton:[]};
assert.equal(JSON.parse(files['Avances.Report/definition.pbir']).version,'1.0');
assert.ok(!Object.keys(files).some(path=>path.startsWith('Avances.Report/definition/')),'No debe exportarse PBIR mejorado');
const report=JSON.parse(files['Avances.Report/report.json']);
const model=JSON.parse(files['Avances.SemanticModel/model.bim']);
let visuals=0;
for(const page of report.sections) {
 JSON.parse(page.config);
 JSON.parse(page.filters);
 for(const container of page.visualContainers) {
  const config=JSON.parse(container.config),visual=config.singleVisual;
  const expected=roles[visual.visualType];
  assert.ok(expected,'Visual posterior a febrero de 2025: '+visual.visualType);
  assert.deepEqual(Object.keys(visual.projections||{}).sort(),[...expected].sort(),config.name);
  const query=visual.prototypeQuery;
  if(query) {
   const aliases=new Map(query.From.map(f=>[f.Name,f.Entity]));
   for(const select of query.Select) {
    const kind=select.Measure?'Measure':'Column',field=select[kind];
    const table=model.model.tables.find(t=>t.name===aliases.get(field.Expression.SourceRef.Source));
    assert.ok(table,config.name+' tiene un alias inválido');
    assert.ok((kind==='Measure'?table.measures:table.columns).some(f=>f.name===field.Property),config.name+' tiene un campo inválido');
   }
   const refs=new Set(query.Select.map(s=>s.Name));
   for(const projections of Object.values(visual.projections))for(const p of projections)assert.ok(refs.has(p.queryRef),config.name+' tiene una proyección sin selección');
  }
  const action=visual.vcObjects?.visualLink?.[0]?.properties;
  if(action?.type?.expr.Literal.Value==="'PageNavigation'")assert.ok(report.sections.some(p=>"'"+p.name+"'"===action.navigationSection.expr.Literal.Value));
  visuals++;
 }
}
let count = 0;
for(const [path,text] of Object.entries(files)) {
 if(path.endsWith('.txt'))continue;
 const value = JSON.parse(text);
 if(!value.$schema)continue;
 let validate = schemas.get(value.$schema);
 if(!validate) {
  validate = await ajv.compileAsync({$ref:value.$schema});
  schemas.set(value.$schema,validate);
 }
 if(!validate(value))throw Error(path+' '+JSON.stringify(validate.errors));
 count++;
}
console.log('Power BI: '+count+' metadatos validados con esquemas oficiales de Microsoft.');
console.log('Informe heredado para '+powerBiTarget+': '+report.sections.length+' páginas y '+visuals+' visuales verificados. Apertura real en Desktop pendiente.');
