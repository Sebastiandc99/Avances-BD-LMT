import { zipSync, strToU8 } from 'fflate';
import { diverterBasis, installedDiverters, latestRecords, localDate, metrics, plannedDiverters, statuses, type Event, type Inventory } from './model.ts';
import type { SyncAdapter } from './sync-engine.ts';

type Cell = string | number | null;
type Row = Record<string, Cell>;
type Column = { name:string; dataType:'string'|'int64'|'double'|'dateTime' };
const schema = 'https://developer.microsoft.com/json-schemas/fabric/';
const reportFolder = 'Avances.Report';
const modelFolder = 'Avances.SemanticModel';
export const powerBiTarget = '2.140.1454.0 (febrero de 2025)';

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
  queryRef:table + '.' + name, nativeQueryRef:name, displayName:name
 };
}

const palette = {ink:'#18324D',muted:'#526579',blue:'#2474DD',green:'#22946B',amber:'#C98B12',gray:'#7C8998',paper:'#F1F5F9',white:'#FFFFFF'};
const literal = (value:string|number|boolean) => ({expr:{Literal:{Value:typeof value === 'string' ? "'" + value.replaceAll("'","''") + "'" : typeof value === 'number' ? value + 'D' : String(value)}}});
const solid = (color:string) => ({solid:{color:literal(color)}});
const properties = (value:Record<string,unknown>) => [{properties:value}];
const padding = (size:number) => properties({top:literal(size),bottom:literal(size),left:literal(size),right:literal(size)});

function visual(name:string, type:string, title:string, x:number, y:number, width:number, height:number,
 roles:Record<string,ReturnType<typeof projection>[]>) {
 const objects:Record<string,unknown> = {};
 const visualContainerObjects:Record<string,unknown> = {
  title:properties({show:literal(!!title),text:literal(title),fontColor:solid(palette.ink),fontSize:literal(13),fontFamily:literal('Segoe UI Semibold')}),
  background:properties({show:literal(true),color:solid(palette.white),transparency:literal(0)}),
  border:properties({show:literal(false)}),
  padding:padding(12),
  visualHeader:properties({show:literal(true)})
 };
 return {
  $schema:schema + 'item/report/definition/visualContainer/2.1.0/schema.json',
  name, position:{x,y,z:1000,width,height,tabOrder:y*10+x},
  visual:{
   visualType:type,
   syncGroup:undefined as {groupName:string;fieldChanges:boolean;filterChanges:boolean}|undefined,
   query:{sortDefinition:undefined as {sort:{field:ReturnType<typeof projection>['field'];direction:string}[];isDefaultSort:boolean}|undefined,queryState:Object.fromEntries(Object.entries(roles).map(([role,projections]) => [role,{projections}]))},
   objects, visualContainerObjects, drillFilterOtherVisuals:true
  }
 };
}

function textbox(name:string, text:string, x:number, y:number, width:number, height:number, size=14, color=palette.muted) {
 const v=visual(name,'textbox','',x,y,width,height,{});
 v.visual.objects.general=properties({paragraphs:[{textRuns:[{value:text,textStyle:{fontFamily:'Segoe UI',fontSize:size+'px',color}}],horizontalTextAlignment:'left'}]});
 v.visual.visualContainerObjects.background=properties({show:literal(false)});
 v.visual.visualContainerObjects.padding=padding(0);
 v.visual.visualContainerObjects.visualHeader=properties({show:literal(false)});
 return v;
}

function button(name:string, label:string, x:number, action:string, destination='', selected=false) {
 const v=visual(name,'actionButton','',x,20,name==='limpiar'?200:140,48,{});
 const state = (value:Record<string,unknown>, id='default') => ({properties:value,selector:{id}});
 v.visual.objects={
  text:[...properties({show:literal(true)}),state({text:literal(label),fontSize:literal(12),fontColor:solid(selected?palette.white:palette.ink),horizontalAlignment:literal('center')})],
  icon:[...properties({show:literal(false)}),state({shapeType:literal('blank'),placement:literal('left')})],
  fill:[...properties({show:literal(true)}),state({fillColor:solid(selected?palette.blue:palette.white)}),state({fillColor:solid('#DCEAFB')},'hover')],
  outline:properties({show:literal(false)}),
  shape:[...properties({tileShape:literal('rectangleRounded'),roundEdge:literal(8)}),state({tileShape:literal('rectangleRounded')})]
 };
 v.visual.visualContainerObjects.background=properties({show:literal(false)});
 v.visual.visualContainerObjects.padding=padding(0);
 v.visual.visualContainerObjects.visualHeader=properties({show:literal(false)});
 v.visual.visualContainerObjects.visualLink=properties({
  show:literal(true),type:literal(action),
  tooltip:literal(action==='PageNavigation'?'Abrir '+label:'Restablecer los filtros de esta página'),
  ...(destination?{navigationSection:literal(destination)}:{})
 });
 return v;
}

function card(name:string, measure:ReturnType<typeof projection>, x:number, y:number, width:number, color=palette.blue) {
 // The classic card and its Values role predate February 2025. Do not use the
 // newer cardVisual/Data format or its preview-only formatting objects here.
 const v=visual(name,'card','',x,y,width,120,{Values:[measure]});
 v.visual.objects={
  labels:properties({fontSize:literal(32),color:solid(color),labelDisplayUnits:literal(1)}),
  categoryLabels:properties({show:literal(true),fontSize:literal(12),color:solid(palette.muted)})
 };
 return v;
}

function slicer(name:string, title:string, field:ReturnType<typeof projection>, x:number, width:number, range=false) {
 const v=visual(name,'slicer','',x,88,width,104,{Values:[field]});
 v.visual.objects={
  data:properties({mode:literal(range?'Between':'Dropdown')}),
  header:properties({show:literal(true),text:literal(title),textSize:literal(12),fontColor:solid(palette.ink)}),
  items:properties({textSize:literal(11),fontColor:solid(palette.ink)}),
  selection:properties({singleSelect:literal(false),selectAllCheckboxEnabled:literal(true)})
 };
 v.visual.visualContainerObjects.padding=padding(8);
 // Keep line, status and responsible selections while navigating pages.
 // Dates apply to activity in overview/detail, and completion in production.
 v.visual.syncGroup={groupName:'LMT_'+name,fieldChanges:true,filterChanges:true};
 return v;
}

/** Serializes the original single-file report layout, not enhanced PBIR.
 * The shape (config/layouts/singleVisual/prototypeQuery) follows Microsoft's
 * pre-2025 Desktop samples. Expressions use query aliases in this format.
 */
function legacyContainer(v:ReturnType<typeof visual>) {
 const aliases=new Map<string,string>();
 const expression=(field:ReturnType<typeof projection>['field']) => {
  const [kind,value]=Object.entries(field)[0];
  const entity=value.Expression.SourceRef.Entity;
  if(!aliases.has(entity))aliases.set(entity,'t'+aliases.size);
  return {[kind]:{...value,Expression:{SourceRef:{Source:aliases.get(entity)!}}}};
 };
 const selects=new Map<string,Record<string,unknown>>();
 const projections=Object.fromEntries(Object.entries(v.visual.query.queryState).map(([role,state]) => [role,state.projections.map(p => {
  if(!selects.has(p.queryRef))selects.set(p.queryRef,{...expression(p.field),Name:p.queryRef,NativeReferenceName:p.nativeQueryRef});
  return {queryRef:p.queryRef,...(p.field.Column?{active:true}:{})};
 })]));
 const order=v.visual.query.sortDefinition?.sort.map(s => ({Direction:s.direction==='Ascending'?1:2,Expression:expression(s.field)}));
 const singleVisual={
  visualType:v.visual.visualType,
  ...(selects.size?{
   projections,
   prototypeQuery:{Version:2,From:[...aliases].map(([Entity,Name]) => ({Name,Entity,Type:0})),Select:[...selects.values()],...(order?.length?{OrderBy:order}:{})},
   hasDefaultSort:!v.visual.query.sortDefinition || v.visual.query.sortDefinition.isDefaultSort,
   columnProperties:Object.fromEntries(Object.values(v.visual.query.queryState).flatMap(s=>s.projections).map(p=>[p.queryRef,{displayName:p.displayName}]))
  }:{}),
  objects:v.visual.objects,vcObjects:v.visual.visualContainerObjects,
  ...(v.visual.syncGroup?{syncGroup:v.visual.syncGroup}:{}),
  drillFilterOtherVisuals:true
 };
 const {tabOrder,...position}=v.position;
 return {...position,tabOrder,config:JSON.stringify({name:v.name,layouts:[{id:0,position:v.position}],singleVisual}),filters:'[]'};
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
  measure('Vanos totales','COALESCE(COUNTROWS(Vanos), 0)'),
  measure('Vanos terminados','COALESCE(SUM(Vanos[Terminado]), 0)'),
  measure('Vanos en proceso','COALESCE(SUM(Vanos[EnProceso]), 0)'),
  measure('Vanos pendientes','COALESCE(SUM(Vanos[Pendiente]), 0)'),
  measure('BD previstos','SUM(Vanos[BDPrevistos])'),
  measure('BD colocados','COALESCE(SUM(Vanos[BDColocados]), 0)'),
  measure('Avance total','DIVIDE([Vanos terminados], CALCULATE(COUNTROWS(Vanos), ALL(Vanos)), 0)','0.0%'),
  measure('Avance de la seleccion','DIVIDE([Vanos terminados], CALCULATE([Vanos totales], REMOVEFILTERS(Vanos[Estado])), 0)','0.0%'),
  measure('BD pendientes','MAX(0, COALESCE(SUM(Vanos[BDPrevistos]), 0) - [BD colocados])'),
  measure('Terminados sin fecha','COALESCE(CALCULATE(SUM(Vanos[Terminado]), KEEPFILTERS(Vanos[TerminadoConFecha] = 0)), 0)'),
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
 // Version 1.0 selects the legacy report.json layout. The metadata filename
 // definition.pbir is used by both formats; there is no enhanced /definition/.
 put(reportFolder+'/definition.pbir',{$schema:schema+'item/report/definitionProperties/1.0.0/schema.json',version:'1.0',datasetReference:{byPath:{path:'../'+modelFolder}}});
 const report={
  config:JSON.stringify({version:'5.55',themeCollection:{customTheme:{name:'LMT.json',version:'5.55',type:1}},activeSectionIndex:0,defaultFilterActionIsDataFilter:true,defaultDrillFilterOtherVisuals:true,
   settings:{useNewFilterPaneExperience:true,useStylableVisualContainerHeader:true,allowChangeFilterTypes:true,useEnhancedTooltips:true,exportDataMode:1}}),
  layoutOptimization:0,
  resourcePackages:[{resourcePackage:{name:'RegisteredResources',type:1,items:[{name:'LMT.json',path:'LMT.json',type:201}],disabled:false}}],
  sections:[] as {name:string;displayName:string;displayOption:number;width:number;height:number;config:string;filters:string;visualContainers:ReturnType<typeof legacyContainer>[]}[]
 };
 put(reportFolder+'/StaticResources/RegisteredResources/LMT.json',{
  name:'LMT',dataColors:[palette.green,palette.amber,palette.gray,palette.blue],
  background:palette.white,foreground:palette.ink,tableAccent:palette.blue,
  textClasses:{title:{fontFace:'Segoe UI Semibold',fontSize:13,color:palette.ink},label:{fontFace:'Segoe UI',fontSize:11,color:palette.muted}}
 });
 const addVisual = (page:string, v:ReturnType<typeof visual>) => {
  const section=report.sections.find(s=>s.name===page);
  if(!section)throw Error('Página Power BI inexistente: '+page);
  section.visualContainers.push(legacyContainer(v));
 };
 const col = (name:string) => projection('Vanos',name);
 const val = (name:string) => projection('Vanos',name,true);
 const readableDate = new Intl.DateTimeFormat('es-AR',{timeZone:'America/Argentina/Salta',dateStyle:'short',timeStyle:'short'}).format(new Date(extractedAt));
 const pages=[{name:'Resumen',label:'Resumen'},{name:'Produccion',label:'Producción'},{name:'Vanos',label:'Vanos'}];
 for(const page of pages) {
  report.sections.push({
   name:page.name,displayName:page.label,displayOption:1,width:1280,height:800,
   config:JSON.stringify({objects:{background:properties({color:solid(palette.paper),transparency:literal(0)})}}),
   filters:'[]',visualContainers:[]
  });
  addVisual(page.name,textbox('titulo','Avances BD LMT  /  '+page.label,24,20,550,40,26,palette.ink));
  pages.forEach((target,i)=>addVisual(page.name,button('abrir'+target.name,target.label,600+i*150,'PageNavigation',target.name,target.name===page.name)));
  addVisual(page.name,button('limpiar','Limpiar filtros',1056,'ClearAllSlicers'));
  addVisual(page.name,slicer('linea','Línea',col('Linea'),24,240));
  addVisual(page.name,slicer('estado','Estado',col('Estado'),280,240));
  addVisual(page.name,slicer('responsable','Responsable',col('Responsable'),536,240));
  const date=slicer(page.name==='Produccion'?'fechaProduccion':'fechaActividad',page.name==='Produccion'?'Fecha de finalización':'Fecha de actividad',col(page.name==='Produccion'?'FechaFinalizacion':'Fecha'),792,464,true);
  addVisual(page.name,date);
  addVisual(page.name,textbox('ayuda','Primera apertura: Inicio → Actualizar. Botones en Desktop: Ctrl + clic. Copia de Supabase: '+readableDate+'.',24,752,1232,32,14));
 }
 const summary=[
  ['Avance de la seleccion',palette.blue],['Vanos terminados',palette.green],
  ['Vanos en proceso',palette.amber],['Vanos pendientes',palette.gray],['BD colocados',palette.blue]
 ];
 summary.forEach(([name,color],i)=>addVisual('Resumen',card('indicador'+i,val(name),24+i*250,216,232,color)));
 const stateChart=visual('estados','donutChart','Vanos por estado · seleccioná un segmento',24,360,400,328,{Category:[col('Estado')],Y:[val('Vanos totales')]});
 stateChart.visual.objects={
  legend:properties({show:literal(true),position:literal('Bottom'),fontSize:literal(11)}),
  labels:properties({show:literal(true),fontSize:literal(12)})
 };
 addVisual('Resumen',stateChart);
 const byLine=visual('porLinea','stackedColumnChart','Avance por línea',448,360,808,328,{Category:[col('Linea')],Y:[val('Vanos terminados'),val('Vanos en proceso'),val('Vanos pendientes')]});
 byLine.visual.objects={legend:properties({show:literal(true),position:literal('Bottom')}),labels:properties({show:literal(true),fontSize:literal(12)})};
 addVisual('Resumen',byLine);
 addVisual('Resumen',textbox('nota','Los filtros y los segmentos de los gráficos actualizan los indicadores. El avance porcentual respeta la línea y la fecha seleccionadas.',24,704,1232,36,14));
 const production=[
  ['Vanos fechados',palette.green],['BD fechados',palette.blue],['Promedio BD dia',palette.blue],
  ['Dias registrados',palette.ink],['Terminados sin fecha',palette.amber]
 ];
 production.forEach(([name,color],i)=>addVisual('Produccion',card('produccion'+i,val(name),24+i*250,216,232,color)));
 const daily=visual('diario','clusteredColumnChart','BD colocados por fecha de finalización',24,360,784,328,{Category:[col('FechaFinalizacion')],Y:[val('BD fechados')]});
 daily.visual.query.sortDefinition={sort:[{field:col('FechaFinalizacion').field,direction:'Ascending'}],isDefaultSort:false};
 daily.visual.objects={dataPoint:properties({defaultColor:solid(palette.blue)}),labels:properties({show:literal(true),fontSize:literal(11)})};
 addVisual('Produccion',daily);
 const dailyTable=visual('detalleDiario','tableEx','Producción diaria',832,360,424,328,{Values:[col('FechaFinalizacion'),val('Vanos fechados'),val('BD fechados')]});
 dailyTable.visual.query.sortDefinition={sort:[{field:col('FechaFinalizacion').field,direction:'Ascending'}],isDefaultSort:false};
 addVisual('Produccion',dailyTable);
 addVisual('Produccion',textbox('nota','El promedio usa días con producción registrada. Los terminados sin fecha suman al avance; quedan fuera del rendimiento y del gráfico diario.',24,704,1232,36,14));
 ['Vanos totales','Avance de la seleccion','BD colocados','BD pendientes'].forEach((name,i)=>addVisual('Vanos',card('detalleKpi'+i,val(name),24+i*312,216,296)));
 const detail=visual('detalle','tableEx','Detalle de vanos · filtrá arriba para buscar',24,360,1232,368,{
  Values:['Vano','Linea','Estado','Fecha','BDPrevistos','BDColocados','OrigenConteo','Responsable','Observaciones'].map(col)
 });
 detail.visual.objects={
  grid:properties({gridVertical:literal(false),rowPadding:literal(8)}),
  columnHeaders:properties({fontSize:literal(11),fontColor:solid(palette.white),backColor:solid(palette.ink)}),
  values:properties({fontSize:literal(11),fontColorPrimary:solid(palette.ink)})
 };
 detail.visual.query.sortDefinition={sort:[{field:col('Vano').field,direction:'Ascending'}],isDefaultSort:false};
 addVisual('Vanos',detail);
 put(reportFolder+'/report.json',report);
 files['ABRIR_EN_PC.txt'] = [
  'AVANCES BD LMT — POWER BI DESKTOP '+powerBiTarget,
  '',
  '1. Extrae TODO el ZIP en una carpeta de la PC.',
  '2. Abre Avances_BD_LMT.pbip con tu Power BI Desktop de febrero de 2025.',
  '3. Pulsa Actualizar para cargar las tablas incluidas y ver los graficos.',
  '4. Usa los botones Resumen / Producción / Vanos para navegar (Ctrl + clic en el modo edición de Desktop).',
  '5. Filtra por línea, estado, responsable y fechas. Limpiar filtros restablece los selectores de la página.',
  '6. Selecciona una barra o segmento para filtrar los demás gráficos e indicadores.',
  '7. Guarda el informe como .pbix una vez cargadas las tablas.',
  '',
  'SI LOS INDICADORES ESTÁN EN BLANCO: este proyecto no incluye cache.abf; pulsa Inicio > Actualizar.',
  'Los datos ya están incluidos en las consultas del proyecto. Esa carga no pide acceso a Supabase.',
  'Si Actualizar devuelve un error, conserva el mensaje exacto para revisar el problema.',
  'La apertura visual en Power BI Desktop debe comprobarse en tu PC.',
  'FORMATO: informe heredado report.json, con definition.pbir versión 1.0. No usa PBIR mejorado ni tarjetas nuevas.',
  'El nombre interno definition.pbir también existe en el formato heredado. Abre el archivo .pbip de la carpeta principal.',
  'Si Desktop pide habilitar proyectos PBIP: Archivo > Opciones y configuración > Opciones > Características de versión preliminar > Power BI Project (.pbip) save option. Reinicia Desktop.',
  'No hace falta habilitar PBIR mejorado ni actualizar Power BI a una versión posterior para este diseño.',
  '',
  'Origen: registros privados leidos de Supabase desde la sesion de la app.',
  'Extraccion UTC: '+extractedAt,
  'Cambios: '+events.length+' | Vanos: '+inventory.vanos.length,
  'Esta descarga contiene una copia de los datos al exportar. Para obtener avances posteriores, vuelve a descargar desde la app.',
  'Actualizar en Desktop vuelve a cargar esta copia. La conexion permanente con Supabase se configura por separado.',
  'El rendimiento usa solo vanos terminados con fecha explicita. Los terminados sin fecha cuentan en el avance.',
  'La estimacion suma dias calendario a la fecha de exportacion segun el promedio de dias con produccion cargada.',
  'Avance de la selección respeta línea, fechas y responsable; retira solo el filtro de estado del denominador.',
  'El historial completo también está disponible como tabla Historial en la vista Datos de Desktop.',
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
