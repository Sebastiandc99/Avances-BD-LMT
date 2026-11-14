import { createRequire } from 'node:module';
import fs from 'node:fs';
import { powerBiProject } from '../lib/powerbi-export.ts';
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
console.log('Power BI: '+count+' archivos validados con esquemas oficiales de Microsoft.');
