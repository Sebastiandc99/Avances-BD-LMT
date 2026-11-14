import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { unzipSync, strFromU8 } from 'fflate';
import { productionSheets, productionXlsx, excelDate } from '../lib/excel-export.ts';
import { emptyProgress, metrics } from '../lib/model.ts';
const inventory=JSON.parse(fs.readFileSync(new URL('../public/assets/inventory.json',import.meta.url)));
const event=(spanId,changes={})=>({...emptyProgress(),id:spanId,spanId,status:'terminado',version:1,baseVersion:0,createdAt:'2026-11-10T12:00:00Z',author:'Prueba',sync:'synced',...changes});
const value=cell=>cell&&typeof cell==='object'?cell.value:cell;
const png=new Uint8Array([137,80,78,71,13,10,26,10]);
test('Excel incluye 235 vanos, fechas numéricas y resumen global coherente con la aplicación',()=>{
 const events=[event('L-001-002',{date:'2026-11-08'}),event('L-002-003',{date:''}),event('FP-001-002',{date:'2026-11-09',installed:12}),event('L-003-004',{status:'ejecucion',installed:4})];
 const sheets=productionSheets(inventory,events,'2026-11-10'),m=metrics(inventory.vanos,events,'2026-11-10');
 assert.deepEqual(sheets.map(s=>s.name),['Resumen','Rendimiento','Vanos','Vista aérea']);
 assert.equal(sheets[2].rows.length,240);assert.equal(sheets[2].rows[5][5],excelDate('2026-11-08'));assert.equal(sheets[2].rows[6][5],null);
 const summary=Object.fromEntries(sheets[0].rows.slice(5).map(r=>[r[0],value(r[1])]));
 assert.equal(summary['Vanos totales'],235);assert.equal(summary['Vanos terminados'],3);assert.equal(summary['Vanos en proceso'],undefined);assert.equal(summary['Vanos pendientes'],undefined);
 assert.equal(summary['Avance total'],3/235);assert.equal(sheets[2].rows.slice(5).reduce((n,r)=>n+value(r[7]),0),m.installed);
 assert.equal(summary['Rendimiento promedio'],1);assert.equal(summary['Terminados sin fecha válida'],undefined);assert.equal(summary['Días para finalizar'],232);
 assert.deepEqual(sheets[1].rows.slice(5).map(r=>value(r[1])),[1,1]);
 assert.equal(sheets[2].rows.filter(r=>r[1]==='Corta FP').length,17);
});
test('La exportación usa revisiones vigentes y excluye cargas históricas sin fecha del rendimiento',()=>{
 const old=event('L-001-002',{date:'2026-11-08'}),updated=event('L-001-002',{id:'correction',version:2,baseVersion:1,date:'2026-11-09'});
 const sheets=productionSheets(inventory,[old,updated,event('FP-001-002')],'2026-11-10');
 assert.equal(value(sheets[0].rows[7][1]),2);assert.equal(sheets[1].rows.length,6);assert.equal(sheets[1].rows[5][0],excelDate('2026-11-09'));
 const blank=productionSheets(inventory,[],'2026-11-10');assert.equal(value(blank[0].rows.find(r=>r[0]==='Rendimiento promedio')[1]),'Sin datos con fecha');assert.equal(value(blank[0].rows.find(r=>r[0]==='Días para finalizar')[1]),'Sin estimación');
 assert.equal(excelDate('2026-02-30'),null);assert.equal(excelDate(''),null);
});
test('XLSX contiene cuatro hojas, fórmulas, formatos, filtros e imagen embebida sin enlaces externos',()=>{
 const events=[event('L-001-002',{date:'2026-11-09',notes:'=HYPERLINK("https://example.invalid") <&>\u0001',responsible:'Cuadrilla & A'})];
 const files=unzipSync(productionXlsx(inventory,events,{png,width:4400,height:3400},'2026-11-10'));
 const read=p=>strFromU8(files[p]);
 assert.ok(read('xl/workbook.xml').includes('Vista aérea'));assert.ok(read('xl/workbook.xml').includes('fullCalcOnLoad="1"'));
 assert.ok(read('xl/worksheets/sheet1.xml').includes('<x:f>SUM('));assert.ok(read('xl/worksheets/sheet3.xml').includes('autoFilter ref="A5:L240"'));
 assert.match(read('xl/worksheets/sheet3.xml'),/<x:c r="L6"[^>]*t="inlineStr">/);assert.ok(read('xl/worksheets/sheet3.xml').includes('&lt;&amp;&gt;'));assert.ok(!read('xl/worksheets/sheet3.xml').includes('\u0001'));
 assert.ok(read('xl/worksheets/sheet4.xml').includes('r:id="rIdMap"'));assert.ok(read('xl/drawings/map.xml').includes('r:embed="rIdImage"'));assert.ok(read('[Content_Types].xml').includes('image/png'));
 assert.deepEqual(files['xl/media/traza.png'],png);
 for(const [p,b] of Object.entries(files))if(p.endsWith('.rels'))assert.ok(!strFromU8(b).includes('TargetMode="External"'));
 assert.throws(()=>productionXlsx(inventory,[],{png:new Uint8Array(),width:0,height:0}));
});
test('torta nativa del Excel enlaza Resumen y conserva valores y colores del avance global',()=>{
 for(const [events,expected] of [[[],[0,0,235]],[[event('L-001-002'),event('FP-001-002',{status:'ejecucion'})],[1,1,233]]]){
  const files=unzipSync(productionXlsx(inventory,events,{png,width:4400,height:3400},'2026-11-11'));
  const chartNames=Object.keys(files).filter(p=>/\/charts\/chart\d+\.xml$/.test(p));assert.equal(chartNames.length,1);
  const chart=strFromU8(files[chartNames[0]]);assert.ok(chart.includes('<c:pieChart>'));
  assert.ok(chart.includes("'Resumen'!$X$6:$X$8"));assert.ok(chart.includes("'Resumen'!$Y$6:$Y$8"));
  const values=chart.match(/<c:numCache>[\s\S]*?<\/c:numCache>/)[0];
  assert.deepEqual([...values.matchAll(/<c:pt idx="\d+"><c:v>(\d+)<\/c:v>/g)].map(m=>Number(m[1])),expected);
  for(const rgb of ['36A66E','EAB645','8B9299'])assert.ok(chart.includes(`val="${rgb}"`));
  assert.ok(!chart.includes('<c:showPercent val="1"/>'));assert.ok(strFromU8(files['xl/worksheets/sheet1.xml']).includes('<x:drawing'));
  assert.ok(files['xl/media/traza.png']);
 }
});
test('la descarga conserva alturas legibles y alternancia hasta el último vano sin confundir ht con customHeight',()=>{
 const files=unzipSync(productionXlsx(inventory,[event('L-001-002',{responsible:'Cuadrilla de montaje '.repeat(5),notes:'Revisión del montaje\n'.repeat(5)})],{png,width:4400,height:3400},'2026-11-11'));
 const sheet=n=>strFromU8(files[`xl/worksheets/sheet${n}.xml`]);
 const row=(s,r)=>s.match(new RegExp(`<x:row r="${r}"[^>]*>[\\s\\S]*?</x:row>`))[0];
 const height=(s,r)=>Number(row(s,r).match(/\bht="([\d.]+)"/)[1]);
 const style=(s,address)=>s.match(new RegExp(`<x:c r="${address}" s="(\\d+)"`))[1];
 assert.ok(height(sheet(1),1)>=30);assert.ok(height(sheet(1),5)>=34);assert.ok(height(sheet(1),12)>=28);
 assert.ok(height(sheet(3),5)>=40);assert.ok(height(sheet(3),6)>height(sheet(3),7));assert.ok(height(sheet(3),240)>=28);
 assert.notEqual(style(sheet(3),'A6'),style(sheet(3),'A7'));assert.equal(style(sheet(3),'A6'),style(sheet(3),'A240'));
 assert.match(sheet(3),/conditionalFormatting sqref="E6:E240"/);assert.match(sheet(3),/ySplit="5"/);
});


test('Resumen elimina las nueve filas solicitadas y conserva fórmulas y gráfico editables',()=>{
 const removed=['BD calculados totales','BD colocados','BD calculados por estado','BD reales informados','Terminados sin fecha válida','Días con ejecución registrada','Vanos en proceso','Vanos pendientes','Vanos que faltan terminar'];
 const events=[event('L-001-002',{date:'2026-11-08'}),event('L-002-003'),event('L-003-004',{status:'ejecucion'})];
 const sheets=productionSheets(inventory,events,'2026-11-10');
 assert.equal(sheets[0].rows.length,14);
 for(const label of removed)assert.ok(!sheets[0].rows.some(row=>row[0]===label),label);
 const files=unzipSync(productionXlsx(inventory,events,{png,width:4400,height:3400},'2026-11-10'));
 const summary=strFromU8(files['xl/worksheets/sheet1.xml']);
 assert.ok(summary.includes('min="24" max="25" width="0" hidden="1"'));
 assert.match(summary,/<x:c r="Y6"[^>]*>[\s\S]*?<x:v>2<\/x:v>/);
 assert.match(summary,/<x:c r="Y7"[^>]*>[\s\S]*?<x:v>1<\/x:v>/);
 assert.match(summary,/<x:c r="Y8"[^>]*>[\s\S]*?<x:v>232<\/x:v>/);
 for(const label of removed)assert.ok(!summary.includes(label),label);
 const chartName=Object.keys(files).find(p=>/charts\/chart\d+\.xml$/.test(p));
 assert.ok(strFromU8(files[chartName]).includes('<c:plotVisOnly val="0"/>'));
 const sheetRows=Object.fromEntries(sheets[0].rows.map((r,i)=>[r[0],{row:i+1,value:r[1]}]));
 assert.equal(sheetRows['Avance total'].value.formula,'IF(B7>0,B8/B7,0)');
 assert.ok(sheetRows['Días para finalizar'].value.formula.includes('(B7-B8)*COUNT('));
 assert.ok(sheetRows['Fecha estimada de finalización'].value.formula.includes('B3+B13'));
 assert.ok(strFromU8(files['xl/drawings/drawing1.xml']).includes('<xdr:row>16</xdr:row>'));
});
