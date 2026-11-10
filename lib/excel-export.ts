import { zipSync, strToU8 } from 'fflate';
import template from './excel-template.json' with { type: 'json' };
import { colors, diverterBasis, installedDiverters, latestRecords, localDate, metrics, plannedDiverters, statuses, type Event, type Inventory, type Span } from './model.ts';

type Value=string|number|null;
type Formula={formula:string;value:Value};
type Cell=Value|Formula;
export type ExportSheet={name:string;rows:Cell[][]};
export type MapImage={png:Uint8Array;width:number;height:number};
const label=(s:Span)=>`${s.linea==='corta'?'FP ':''}${Number(s.desde.split('-')[1])} — ${s.linea==='corta'?'FP ':''}${Number(s.hasta.split('-')[1])}`;
const origin=(e?:Event)=>diverterBasis(e)==='calculated'?'Calculados por estado':diverterBasis(e)==='reported'?'Informados en campo':'Sin cantidad colocada';
const f=(formula:string,value:Value):Formula=>({formula,value});
export function excelDate(iso:string):number|null{
 if(!/^\d{4}-\d{2}-\d{2}$/.test(iso))return null;
 const t=Date.parse(iso+'T00:00:00Z');
 return Number.isFinite(t)&&new Date(t).toISOString().slice(0,10)===iso?(t-Date.UTC(1899,11,30))/86400000:null;
}
export function productionSheets(inventory:Inventory,events:Event[],today=localDate()):ExportSheet[]{
 const records=latestRecords(events),m=metrics(inventory.vanos,events,today),end=5+inventory.vanos.length;
 const range=(col:string)=>`'Vanos'!$${col}$6:$${col}$${end}`;
 const dates=Object.keys(m.daily).sort(),dailyEnd=Math.max(6,5+dates.length);
 const dailyRange=(col:string)=>`'Rendimiento'!${col}6:${col}${dailyEnd}`;
 const head=(title:string,headers:string[]):Cell[][]=>[[title],['Ambas líneas. Estado actual de los datos guardados en la aplicación.'],['Fecha de corte',excelDate(today)],[],headers];
 const summary=head('Avances BD LMT — Resumen',['Indicador','Valor','Unidad o criterio']);
 summary.push(
  ['Piquetes',inventory.piquetes.length,'Línea larga + línea corta'],
  ['Vanos totales',f(`COUNTA(${range('A')})`,m.total),'Ambas líneas'],
  ['Vanos terminados',f(`COUNTIFS(${range('E')},"Terminado")`,m.done),'vanos'],
  ['Vanos en proceso',f(`COUNTIFS(${range('E')},"En proceso")`,m.inProgress),'vanos'],
  ['Vanos pendientes',f(`COUNTIFS(${range('E')},"Pendiente")`,m.pending),'Sin iniciar'],
  ['Vanos que faltan terminar',f('B7-B8',m.remaining),'Incluye los vanos en proceso'],
  ['Avance total',f('IF(B7>0,B8/B7,0)',m.total?m.done/m.total:0),'Terminados / total de ambas líneas'],
  ['BD calculados totales',f(`SUM(${range('G')})`,m.planned),'Estimación del procedimiento y geometría del DWG'],
  ['BD colocados',f(`SUM(${range('H')})`,m.installed),'Cantidades reales informadas o calculadas por estado'],
  ['BD calculados por estado',f(`SUMIFS(${range('H')},${range('I')},"Calculados por estado")`,m.calculatedInstalled),'Vanos terminados sin cantidad real informada'],
  ['BD reales informados',f(`SUMIFS(${range('H')},${range('I')},"Informados en campo")`,m.reportedInstalled),'Cantidades reales prioritarias'],
  ['Terminados con fecha válida',f(`SUM(${dailyRange('B')})`,m.datedDone),'Se incluyen en el rendimiento'],
  ['Terminados sin fecha válida',f('B8-B17',m.undatedDone),'Suman avance y BD; quedan fuera del rendimiento'],
  ['Días con ejecución registrada',f(`COUNT(${dailyRange('A')})`,m.days),'Fechas distintas con vanos terminados'],
  ['Rendimiento promedio',f('IF(B19>0,B17/B19,"Sin datos con fecha")',m.days?m.average:'Sin datos con fecha'),'vanos/día'],
  ['Rendimiento promedio de BD',f(`IF(B19>0,SUM(${dailyRange('C')})/B19,"Sin datos con fecha")`,m.days?m.averageBD:'Sin datos con fecha'),'BD/día'],
  ['Días para finalizar',f('IF(B11=0,0,IF(B17>0,ROUNDUP(B11*B19/B17,0),"Sin estimación"))',m.estimatedDays??'Sin estimación'),'Una jornada de trabajo por día'],
  ['Fecha estimada de finalización',f('IF(B11=0,"Finalizado",IF(ISNUMBER(B22),B3+B22,"Sin estimación"))',m.remaining===0?'Finalizado':m.eta?excelDate(m.eta):'Sin estimación'),'Proyección desde la fecha de corte']
 );
 const daily=head('Producción por fecha de ejecución',['Fecha de ejecución','Vanos terminados','BD colocados']);
 for(const [i,date] of dates.entries()){
  const row=6+i;
  daily.push([excelDate(date),f(`COUNTIFS(${range('E')},"Terminado",${range('F')},A${row})`,m.daily[date]),f(`SUMIFS(${range('H')},${range('E')},"Terminado",${range('F')},A${row})`,m.dailyBD[date])]);
 }
 if(!dates.length)daily.push(['Sin producción fechada',null,null]);
 const spans=head('Registro de vanos',['ID del vano','Línea','Vano','Longitud (m)','Estado','Fecha de ejecución','BD calculados','BD colocados','Origen del conteo','BD reales informados','Responsable / cuadrilla','Observaciones']);
 for(const s of inventory.vanos){const e=records[s.id];spans.push([s.id,s.linea==='larga'?'Larga':'Corta FP',label(s),s.longitud_planta_m,statuses[e?.status||'pendiente'],excelDate(e?.date||''),plannedDiverters(s),installedDiverters(s,e),origin(e),e?.installed||0,e?.responsible||'',e?.notes||'']);}
 const aerial:Cell[][]=[['Vista aérea del avance'],['Traza completa de ambas líneas. Esquema orientativo del DWG.'],['Fecha de corte',excelDate(today)],['Pendiente: gris. En proceso: amarillo. Terminado: verde.']];
 return [{name:'Resumen',rows:summary},{name:'Rendimiento',rows:daily},{name:'Vanos',rows:spans},{name:'Vista aérea',rows:aerial}];
}

const xml=(s:string)=>s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&apos;');
const column=(n:number)=>String.fromCharCode(65+n);
function cellXML(address:string,cell:Cell,style:string){
 if(cell===null)return `<x:c r="${address}" s="${style}"/>`;
 const formula=typeof cell==='object'?`<x:f>${xml(cell.formula)}</x:f>`:'',value=typeof cell==='object'?cell.value:cell;
 if(typeof value==='number'){if(!Number.isFinite(value))throw new Error('Hay un número inválido en la exportación.');return `<x:c r="${address}" s="${style}">${formula}<x:v>${value}</x:v></x:c>`;}
 if(formula)return `<x:c r="${address}" s="${style}" t="str">${formula}<x:v>${xml(value??'')}</x:v></x:c>`;
 return `<x:c r="${address}" s="${style}" t="inlineStr"><x:is><x:t xml:space="preserve">${xml(value??'')}</x:t></x:is></x:c>`;
}
export function productionXlsx(inventory:Inventory,events:Event[],image:MapImage,today=localDate()):Uint8Array{
 if(!image.png.length||image.width<=0||image.height<=0)throw new Error('Falta la imagen de la vista aérea para exportar.');
 const files:Record<string,Uint8Array>={};
 for(const [path,content] of Object.entries(template.files))files[path]=strToU8(content);
 const sheets=productionSheets(inventory,events,today);
 for(const [i,sheet] of sheets.entries()){
  const path=`xl/worksheets/sheet${i+1}.xml`,source=template.files[path as keyof typeof template.files];
  const styles:Record<string,string>={};
  for(const c of source.matchAll(/<x:c\b[^>]*r="([A-Z]+\d+)"[^>]*s="(\d+)"/g))styles[c[1]]=c[2];
  const rows=sheet.rows.map((cells,j)=>{
   const r=j+1;const h=i===2&&r>5?Math.min(240,Math.max(23,Math.ceil(String(cells[11]||'').length/65)*14)):r===5?34:23;
   return `<x:row r="${r}" ht="${h}" customHeight="1">${cells.map((c,k)=>{const col=column(k),address=col+r,style=styles[address]||styles[col+(r>5?'6':r)]||styles['A6']||'0';return cellXML(address,c,style);}).join('')}</x:row>`;
  }).join('');
  let sheetXML=source.replace(/<x:sheetData>[\s\S]*?<\/x:sheetData>/,`<x:sheetData>${rows}</x:sheetData>`);
  if(i===1||i===2)sheetXML=sheetXML.replace('</x:sheetData>',`</x:sheetData><x:autoFilter ref="A5:${i===2?'L':'C'}${sheet.rows.length}"/>`);
  if(i===3)sheetXML=sheetXML.replace('</x:worksheet>','<x:drawing xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" r:id="rIdMap"/></x:worksheet>');
  files[path]=strToU8(sheetXML);
 }
 const rel='http://schemas.openxmlformats.org/package/2006/relationships',docRel='http://schemas.openxmlformats.org/officeDocument/2006/relationships';
 files['xl/worksheets/_rels/sheet4.xml.rels']=strToU8(`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="${rel}"><Relationship Id="rIdMap" Type="${docRel}/drawing" Target="../drawings/map.xml"/></Relationships>`);
 const w=2600*9525,h=Math.round(2600*image.height/image.width)*9525;
 files['xl/drawings/map.xml']=strToU8(`<?xml version="1.0" encoding="UTF-8"?><xdr:wsDr xmlns:xdr="http://schemas.openxmlformats.org/drawingml/2006/spreadsheetDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main"><xdr:oneCellAnchor><xdr:from><xdr:col>0</xdr:col><xdr:colOff>0</xdr:colOff><xdr:row>5</xdr:row><xdr:rowOff>0</xdr:rowOff></xdr:from><xdr:ext cx="${w}" cy="${h}"/><xdr:pic><xdr:nvPicPr><xdr:cNvPr id="1" name="Traza completa con estados"/><xdr:cNvPicPr><a:picLocks noChangeAspect="1"/></xdr:cNvPicPr></xdr:nvPicPr><xdr:blipFill><a:blip xmlns:r="${docRel}" r:embed="rIdImage"/><a:stretch><a:fillRect/></a:stretch></xdr:blipFill><xdr:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${w}" cy="${h}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></xdr:spPr></xdr:pic><xdr:clientData/></xdr:oneCellAnchor></xdr:wsDr>`);
 files['xl/drawings/_rels/map.xml.rels']=strToU8(`<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="${rel}"><Relationship Id="rIdImage" Type="${docRel}/image" Target="../media/traza.png"/></Relationships>`);
 files['xl/media/traza.png']=image.png;
 files['[Content_Types].xml']=strToU8(template.files['[Content_Types].xml'].replace('</Types>','<Default Extension="png" ContentType="image/png"/><Override PartName="/xl/drawings/map.xml" ContentType="application/vnd.openxmlformats-officedocument.drawing+xml"/></Types>'));
 const workbook=template.files['xl/workbook.xml'].replace(/<x:calcPr[^>]*\/>/,'');
 files['xl/workbook.xml']=strToU8(workbook.replace('</x:workbook>','<x:calcPr calcId="191029" fullCalcOnLoad="1" forceFullCalc="1" calcMode="auto"/></x:workbook>'));
 return zipSync(files,{level:6});
}

/** Uses the existing local map background; no satellite/online map calls or SVG data URLs. */
export async function aerialImage(inventory:Inventory,events:Event[],basePath:string,today=localDate()):Promise<MapImage>{
 const canvas=document.createElement('canvas');canvas.width=4400;canvas.height=3400;
 const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Este navegador no pudo preparar la vista aérea.');
 const background=new Image();
 await new Promise<void>((resolve,reject)=>{background.onload=()=>resolve();background.onerror=()=>reject(new Error('No se pudo leer el fondo local del mapa. Conectate y recargá la app una vez.'));background.src=basePath+'assets/fondo-esquematico.svg';});
 const ps=inventory.piquetes,records=latestRecords(events),poles=Object.fromEntries(ps.map(p=>[p.id,p]));
 const xs=ps.map(p=>p.pixel[0]),ys=ps.map(p=>p.pixel[1]),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const scale=Math.min((canvas.width-180)/(maxX-minX),(canvas.height-300)/(maxY-minY));
 const ox=(canvas.width-(maxX-minX)*scale)/2-minX*scale,oy=160+(canvas.height-300-(maxY-minY)*scale)/2-minY*scale;
 ctx.fillStyle='#dae2d8';ctx.fillRect(0,0,canvas.width,canvas.height);
 ctx.save();ctx.beginPath();ctx.rect(0,120,canvas.width,canvas.height-240);ctx.clip();
 ctx.drawImage(background,ox,oy,inventory.image.width*scale,inventory.image.height*scale);
 const point=(pixel:[number,number])=>[ox+pixel[0]*scale,oy+pixel[1]*scale];
 ctx.lineCap='round';
 for(const s of inventory.vanos){const a=point(poles[s.desde].pixel),b=point(poles[s.hasta].pixel);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.strokeStyle='#18352f';ctx.lineWidth=11;ctx.stroke();ctx.strokeStyle=colors[records[s.id]?.status||'pendiente'];ctx.lineWidth=7;ctx.stroke();}
 ctx.font='bold 18px Arial';
 const occupied:{x:number;y:number;w:number;h:number}[]=[];
 for(const p of ps){
  const [x,y]=point(p.pixel);ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fillStyle='white';ctx.fill();ctx.strokeStyle='#18352f';ctx.lineWidth=2;ctx.stroke();
  const w=ctx.measureText(p.rotulo).width;
  const offsets=[[9,-9],[-w-9,-9],[9,25],[-w-9,25],[-w/2,-30],[-w/2,45],[15,-48],[-w-15,-48]];
  const boxes=offsets.map(([dx,dy])=>({x:x+dx,y:y+dy-18,w:w+5,h:23}));
  const box=boxes.find(b=>!occupied.some(o=>b.x<o.x+o.w+3&&b.x+b.w+3>o.x&&b.y<o.y+o.h+3&&b.y+b.h+3>o.y))||boxes.at(-1)!;
  occupied.push(box);
  if(Math.abs(box.x-x)>w+10||Math.abs(box.y+18-y)>30){ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(box.x+w/2,box.y+12);ctx.lineWidth=1;ctx.strokeStyle='#405c51';ctx.stroke();}
  ctx.strokeStyle='#18352f';ctx.lineWidth=5;ctx.strokeText(p.rotulo,box.x,box.y+18);ctx.fillStyle='white';ctx.fillText(p.rotulo,box.x,box.y+18);
 }
 ctx.restore();ctx.fillStyle='#fffefa';ctx.fillRect(0,0,canvas.width,120);ctx.fillRect(0,canvas.height-120,canvas.width,120);
 ctx.fillStyle='#203a36';ctx.font='bold 38px Arial';ctx.fillText('Avances BD LMT — Ambas líneas',55,52);ctx.font='25px Arial';ctx.fillText(`${today.split('-').reverse().join('/')} · ${ps.length} piquetes · ${inventory.vanos.length} vanos · Esquema orientativo del DWG`,55,94);
 let x=55;ctx.font='26px Arial';for(const status of ['pendiente','ejecucion','terminado'] as const){ctx.fillStyle=colors[status];ctx.fillRect(x,canvas.height-77,36,18);ctx.fillStyle='#203a36';ctx.fillText(statuses[status],x+48,canvas.height-60);x+=330;}
 ctx.font='24px Arial';ctx.fillText('Geometría de referencia. Mismo fondo local que la app.',55,canvas.height-20);
 const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('No se pudo preparar la imagen del mapa.')),'image/png'));
 const result={png:new Uint8Array(await blob.arrayBuffer()),width:canvas.width,height:canvas.height};canvas.width=1;canvas.height=1;return result;
}
