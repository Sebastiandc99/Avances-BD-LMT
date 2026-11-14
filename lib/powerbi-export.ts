import { zipSync, strToU8 } from 'fflate';
import { diverterBasis, installedDiverters, latestRecords, localDate, metrics, plannedDiverters, statuses, type Event, type Inventory } from './model.ts';
import type { SyncAdapter } from './sync-engine.ts';

type Cell = string | number | null;
type Row = Record<string, Cell>;
type Column = { name:string; dataType:'string'|'int64'|'double'|'dateTime' };
const schema = 'https://developer.microsoft.com/json-schemas/fabric/';
const reportFolder = 'Avances.Report';
const modelFolder = 'Avances.SemanticModel';

export function powerBiData(inventory:Inventory, events:Event[], today=localDate()) {
 const records = latestRecords(events);
 const vanos:Row[] = inventory.vanos.map(span => {
  const record = records[span.id];
  const status = record?.status || 'pendiente';
  const finished = status === 'terminado';
  return {
   Vano:span.id, Linea:span.linea === 'corta' ? 'Corta' : 'Larga',
   Estado:statuses[status], Fecha:record?.date || null,
   FechaFinalizacion:finished ? record.date || null : null,
   LongitudM:span.longitud_planta_m, BDPrevistos:plannedDiverters(span),
   BDColocados:installedDiverters(span,record), BDReales:record?.installed || 0,
   OrigenConteo:diverterBasis(record) === 'reported' ? 'Informado' : diverterBasis(record) === 'calculated' ? 'Calculado por vano terminado' : 'Sin cantidad',
   Terminado:finished ? 1 : 0, EnProceso:['ejecucion','observaciones'].includes(status) ? 1 : 0,
   Pendiente:status === 'pendiente' ? 1 : 0, TerminadoConFecha:finished && record.date ? 1 : 0,
   Responsable:record?.responsible || '', Observaciones:record?.notes || ''
  };
 });
 const historial:Row[] = events.map(event => ({
  Registro:event.id, Vano:event.spanId, Version:event.version, Estado:statuses[event.status],
  Fecha:event.date || null, RegistroUTC:event.createdAt,
  BDReales:event.installed, Responsable:event.responsible, Observaciones:event.notes
 }));
 return { vanos, historial, resumen:metrics(inventory.vanos,events,today) };
}

function modelTable(name:string, rows:Row[], columns:Column[]) {
 const mTypes = {string:'type text',int64:'Int64.Type',double:'type number',dateTime:'type date'};
 // M escapes # independently of quotes, including text entered by a user.
 const json = JSON.stringify(rows).replaceAll('#','#(0023)').replaceAll('"','""');
 const columnNames = columns.map(column => JSON.stringify(column.name)).join(',');
 const types = columns.map(column => '{' + JSON.stringify(column.name) + ',' + mTypes[column.dataType] + '}').join(',');
 return {
  name,
  columns:columns.map(column => ({
   ...column, sourceColumn:column.name, summarizeBy:'none',
   ...(column.dataType === 'dateTime' ? {formatString:'dd/MM/yyyy'} : {})
  })),
  partitions:[{name,mode:'import',source:{type:'m',expression:[
   'let',
   '  Source = Table.FromRecords(Json.Document("' + json + '"), {' + columnNames + '}, MissingField.UseNull),',
   '  Typed = Table.TransformColumnTypes(Source, {' + types + '}, "en-US")',
   'in',
   '  Typed'
  ]}}]
 };
}

function projection(table:string, name:string, measure=false) {
 return {
  field:{[measure ? 'Measure' : 'Column']:{Expression:{SourceRef:{Entity:table}},Property:name}},
  queryRef:table + '.' + name, nativeQueryRef:name
 };
}

function visual(name:string, type:string, title:string, x:number, y:number, width:number, height:number,
 roles:Record<string,ReturnType<typeof projection>[]>) {
 return {
  $schema:schema + 'item/report/definition/visualContainer/2.1.0/schema.json',
  name, position:{x,y,z:0,width,height,tabOrder:0},
  visual:{
   visualType:type,
   query:{queryState:Object.fromEntries(Object.entries(roles).map(([role,projections]) => [role,{projections}]))},
   visualContainerObjects:{title:[{properties:{
    show:{expr:{Literal:{Value:'true'}}},
    text:{expr:{Literal:{Value:"'" + title.replaceAll("'","''") + "'"}}}
   }}]},
   drillFilterOtherVisuals:true
  }
 };
}

/** Creates a private, portable snapshot. Credentials and photo contents are excluded. */
export function powerBiProject(inventory:Inventory, events:Event[], today=localDate(), extractedAt=new Date().toISOString()) {
 const data = powerBiData(inventory,events,today);
 const textColumns = ['Vano','Linea','Estado','OrigenConteo','Responsable','Observaciones'];
 const integerColumns = ['BDPrevistos','BDColocados','BDReales','Terminado','EnProceso','Pendiente','TerminadoConFecha'];
 const columns:Column[] = [
  ...textColumns.map(name => ({name,dataType:'string' as const})),
  ...integerColumns.map(name => ({name,dataType:'int64' as const})),
  {name:'LongitudM',dataType:'double'},
  {name:'Fecha',dataType:'dateTime'},{name:'FechaFinalizacion',dataType:'dateTime'}
 ];
 const vanos = modelTable('Vanos',data.vanos,columns);
 const measure = (name:string, expression:string, formatString='#,0') => ({name,expression,formatString});
 const measures = [
  measure('Vanos totales','COUNTROWS(Vanos)'),
  measure('Vanos terminados','COALESCE(SUM(Vanos[Terminado]), 0)'),
  measure('Vanos en proceso','COALESCE(SUM(Vanos[EnProceso]), 0)'),
  measure('Vanos pendientes','COALESCE(SUM(Vanos[Pendiente]), 0)'),
  measure('BD previstos','SUM(Vanos[BDPrevistos])'),
  measure('BD colocados','COALESCE(SUM(Vanos[BDColocados]), 0)'),
  measure('Avance total','DIVIDE([Vanos terminados], CALCULATE(COUNTROWS(Vanos), ALL(Vanos)), 0)','0.0%'),
  measure('Vanos fechados','CALCULATE(SUM(Vanos[Terminado]), KEEPFILTERS(Vanos[TerminadoConFecha] = 1))'),
  measure('Dias registrados','CALCULATE(DISTINCTCOUNT(Vanos[FechaFinalizacion]), KEEPFILTERS(Vanos[TerminadoConFecha] = 1))'),
  measure('Promedio vanos dia','DIVIDE([Vanos fechados], [Dias registrados])','0.00'),
  measure('BD fechados','CALCULATE(SUM(Vanos[BDColocados]), KEEPFILTERS(Vanos[TerminadoConFecha] = 1))'),
  measure('Promedio BD dia','DIVIDE([BD fechados], [Dias registrados])','0.00'),
  measure('Dias restantes','VAR Restantes = [Vanos totales] - [Vanos terminados] RETURN IF(Restantes = 0, 0, IF([Promedio vanos dia] > 0, ROUNDUP(DIVIDE(Restantes, [Promedio vanos dia]), 0), BLANK()))'),
  measure('Finalizacion estimada','IF(ISBLANK([Dias restantes]), BLANK(), DATE(' + today.replaceAll('-',',') + ') + [Dias restantes])','dd/MM/yyyy')
 ];
 const historyColumns:Column[] = ['Registro','Vano','Estado','RegistroUTC','Responsable','Observaciones'].map(name => ({name,dataType:'string'}));
 historyColumns.push({name:'Version',dataType:'int64'},{name:'BDReales',dataType:'int64'},{name:'Fecha',dataType:'dateTime'});
 const files:Record<string,string> = {};
 const put = (path:string, value:unknown) => {files[path] = JSON.stringify(value,null,2);};
 put('Avances_BD_LMT.pbip',{$schema:schema+'pbip/pbipProperties/1.0.0/schema.json',version:'1.0',artifacts:[{report:{path:reportFolder}}],settings:{enableAutoRecovery:true}});
 put(modelFolder+'/definition.pbism',{$schema:schema+'item/semanticModel/definitionProperties/1.0.0/schema.json',version:'1.0',settings:{qnaEnabled:false}});
 put(modelFolder+'/model.bim',{
  name:'Avances_BD_LMT',compatibilityLevel:1567,
  model:{culture:'es-AR',sourceQueryCulture:'en-US',defaultPowerBIDataSourceVersion:'powerBI_V3',
   dataAccessOptions:{legacyRedirects:true,returnErrorValuesAsNull:true},
   tables:[{...vanos,measures},modelTable('Historial',data.historial,historyColumns)],
   relationships:[{name:'Historial_Vanos',fromTable:'Historial',fromColumn:'Vano',toTable:'Vanos',toColumn:'Vano',crossFilteringBehavior:'oneDirection'}]
  }
 });
 put(reportFolder+'/definition.pbir',{$schema:schema+'item/report/definitionProperties/2.0.0/schema.json',version:'4.0',datasetReference:{byPath:{path:'../'+modelFolder}}});
 put(reportFolder+'/definition/version.json',{$schema:schema+'item/report/definition/versionMetadata/1.0.0/schema.json',version:'2.0.0'});
 put(reportFolder+'/definition/report.json',{$schema:schema+'item/report/definition/report/2.0.0/schema.json',themeCollection:{}});
 put(reportFolder+'/definition/pages/pages.json',{$schema:schema+'item/report/definition/pagesMetadata/1.0.0/schema.json',pageOrder:['Resumen','Vanos','Historial'],activePageName:'Resumen'});
 const addPage = (name:string, displayName:string) => put(reportFolder+'/definition/pages/'+name+'/page.json',{
  $schema:schema+'item/report/definition/page/2.0.0/schema.json',name,displayName,displayOption:'FitToPage',width:1280,height:800
 });
 const addVisual = (page:string, v:ReturnType<typeof visual>) => put(reportFolder+'/definition/pages/'+page+'/visuals/'+v.name+'/visual.json',v);
 addPage('Resumen','Resumen de avances');
 addPage('Vanos','Detalle de vanos');
 addPage('Historial','Historial de Supabase');
 const col = (name:string) => projection('Vanos',name);
 const val = (name:string) => projection('Vanos',name,true);
 ['Vanos terminados','Vanos en proceso','Vanos pendientes','BD colocados','Avance total'].forEach((name,i) => {
  addVisual('Resumen',visual('indicador'+i,'card',name,20+i*250,15,240,125,{Values:[val(name)]}));
 });
 addVisual('Resumen',visual('avance','pieChart','Vanos por estado',20,160,390,300,{Category:[col('Estado')],Y:[val('Vanos totales')]}));
 addVisual('Resumen',visual('produccion','clusteredColumnChart','Vanos terminados por fecha',430,160,830,300,{Category:[col('FechaFinalizacion')],Y:[val('Vanos fechados')]}));
 ['Promedio vanos dia','Promedio BD dia','Dias restantes','Finalizacion estimada'].forEach((name,i) => {
  addVisual('Resumen',visual('rendimiento'+i,'card',name,20+i*315,480,305,120,{Values:[val(name)]}));
 });
 addVisual('Resumen',visual('linea','slicer','Filtrar linea',20,620,390,160,{Values:[col('Linea')]}));
 addVisual('Resumen',visual('responsable','slicer','Filtrar responsable',430,620,400,160,{Values:[col('Responsable')]}));
 addVisual('Resumen',visual('fecha','slicer','Filtrar fecha de actividad',850,620,410,160,{Values:[col('Fecha')]}));
 addVisual('Vanos',visual('linea','slicer','Linea',20,15,390,140,{Values:[col('Linea')]}));
 addVisual('Vanos',visual('estado','slicer','Estado',430,15,400,140,{Values:[col('Estado')]}));
 addVisual('Vanos',visual('fecha','slicer','Fecha de actividad',850,15,410,140,{Values:[col('Fecha')]}));
 addVisual('Vanos',visual('detalle','tableEx','Detalle de los 235 vanos',20,175,1240,600,{Values:['Vano','Linea','Estado','Fecha','BDPrevistos','BDColocados','OrigenConteo','Responsable','Observaciones'].map(col)}));
 addVisual('Historial',visual('cambios','tableEx','Cambios guardados en Supabase',20,20,1240,760,{
  Values:['Registro','Vano','Version','Estado','Fecha','RegistroUTC','BDReales','Responsable','Observaciones'].map(name => projection('Historial',name))
 }));
 files['ABRIR_EN_PC.txt'] = [
  'AVANCES BD LMT — POWER BI DESKTOP',
  '',
  '1. Extrae TODO el ZIP en una carpeta de la PC.',
  '2. Abre Avances_BD_LMT.pbip con Power BI Desktop actualizado.',
  '3. Pulsa Actualizar para cargar las tablas incluidas y ver los graficos.',
  '4. Puedes filtrar los datos, editar el informe y guardarlo como .pbix.',
  'Si Desktop pide habilitar proyectos PBIP o el formato PBIR, activalos en Opciones > Caracteristicas de version preliminar y reinicia Desktop.',
  '',
  'Origen: registros privados leidos de Supabase desde la sesion de la app.',
  'Extraccion UTC: '+extractedAt,
  'Cambios: '+events.length+' | Vanos: '+inventory.vanos.length,
  'Esta descarga contiene una copia de los datos al exportar. Para obtener avances posteriores, vuelve a descargar desde la app.',
  'Actualizar en Desktop vuelve a cargar esta copia. La conexion permanente con Supabase se configura por separado.',
  'El rendimiento usa solo vanos terminados con fecha explicita. Los terminados sin fecha cuentan en el avance.',
  'La estimacion suma dias calendario a la fecha de exportacion segun el promedio de dias con produccion cargada.',
  'El porcentaje usa como denominador los 235 vanos de ambas lineas.',
  'El archivo contiene informacion de obra. Compartelo solo con personas autorizadas.'
 ].join('\r\n');
 return files;
}

export function powerBiZip(inventory:Inventory, events:Event[], today=localDate()) {
 const files = powerBiProject(inventory,events,today);
 return zipSync(Object.fromEntries(Object.entries(files).map(([path,text]) => [path,strToU8(text)])),{level:6});
}

export async function powerBiFromCloud(inventory:Inventory, cloud:Pick<SyncAdapter,'listEvents'>, today=localDate()) {
 const events = await cloud.listEvents();
 if(!events.length)throw Error('Supabase todavia no tiene avances en esta sesion. Sincroniza los datos antes de descargar Power BI.');
 return powerBiZip(inventory,events,today);
}
