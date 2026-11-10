export const statuses = { pendiente: 'Pendiente', ejecucion: 'En proceso', terminado: 'Terminado', observaciones: 'En proceso' } as const;
export const statusOptions = Object.entries(statuses).filter(([key]) => key !== 'observaciones');
export type Status = keyof typeof statuses;
export const colors: Record<Status,string> = { pendiente:'#8b9299', ejecucion:'#eab645', terminado:'#36a66e', observaciones:'#eab645' };
export type Pole = { id:string; linea:string; rotulo:string; pixel:[number,number]; x_este_m:number; y_norte_m:number };
export type Span = { id:string; linea:string; desde:string; hasta:string; longitud_planta_m:number; bd_propuestos_pendientes_validacion:number };
export type Inventory = { piquetes:Pole[]; vanos:Span[]; resumen:{linea:string;piquetes:number;vanos:number;longitud_planta_m:number;bd_propuestos_pendientes_validacion:number}[]; image:{width:number;height:number;url:string;calibration:unknown} };
export type Progress = { status:Status; date:string; installed:number; notes:string; photos:string[]; responsible:string };
export type Event = Progress & { id:string; spanId:string; version:number; baseVersion:number; createdAt:string; author:string; sync:'pending'|'synced'|'conflict'|'discarded' };
export type Photo = { id:string; data:string; name:string; uploaded?:boolean };
export const emptyProgress = ():Progress => ({status:'pendiente',date:'',installed:0,notes:'',photos:[],responsible:''});
export function localDate(d=new Date()) { return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Argentina/Salta',year:'numeric',month:'2-digit',day:'2-digit'}).format(d); }
export function dateLabel(s:string) { if(!s)return 'Sin fecha';const [y,m,d]=s.split('-');return `${d}/${m}/${y}`; }
export function activeEvents(events:Event[]) { const cut:Record<string,number>={}; for(const e of events)if(e.sync==='pending'||e.sync==='conflict')cut[e.spanId]=Math.min(cut[e.spanId]??Infinity,e.baseVersion); return events.filter(e=>e.sync!=='discarded' && (e.sync!=='synced'||cut[e.spanId]===undefined||e.version<=cut[e.spanId])).sort((a,b)=>a.version-b.version || a.createdAt.localeCompare(b.createdAt) || a.id.localeCompare(b.id)); }
export function latestRecords(events:Event[]) { const out:Record<string,Event>={}; for(const e of activeEvents(events)) { const old=out[e.spanId]; if(!old || e.version>old.version || (e.version===old.version && e.sync!=='synced')) out[e.spanId]=e; } return out; }
export function validSpanId(s:unknown):s is string { return typeof s==='string' && (/^L-\d{3}-\d{3}$/.test(s)||/^FP-\d{3}-\d{3}$/.test(s)) && (()=>{const n=s.split('-').slice(1).map(Number);return n[0]>=1 && n[1]===n[0]+1 && n[1]<=(s.startsWith('L-')?219:18)})(); }
export function validProgress<T>(p:T):p is T & Progress {
  if(!p||typeof p!=='object')return false; const a=p as unknown as Progress;
  const dateValid=typeof a.date==='string' && (a.date==='' || (/^\d{4}-\d{2}-\d{2}$/.test(a.date) && !isNaN(Date.parse(a.date)) && new Date(a.date+'T12:00:00Z').toISOString().slice(0,10)===a.date && a.date<=localDate() && a.date>='2020-01-01'));
  return Object.hasOwn(statuses,a.status) && dateValid && Number.isInteger(a.installed) && a.installed>=0 && a.installed<=1000 && (a.status!=='pendiente'||a.installed===0) && typeof a.notes==='string' && a.notes.length<=4000 && typeof a.responsible==='string' && a.responsible.length<=120 && Array.isArray(a.photos) && a.photos.length<=8 && a.photos.every(id=>typeof id==='string' && /^[a-f0-9-]{36}$/i.test(id));
}
/** Same symmetric 10 m layout validated against the CAD-derived inventory. */
export function plannedDiverters(span:Span){return Math.floor((.60*span.longitud_planta_m+.0001)/10)+1;}
export function diverterBasis(record?:Progress):'reported'|'calculated'|'none'{
 if(record&&record.installed>0)return 'reported';
 return record?.status==='terminado'?'calculated':'none';
}
export function installedDiverters(span:Span,record?:Progress){
 const basis=diverterBasis(record);
 return basis==='reported'?record!.installed:basis==='calculated'?plannedDiverters(span):0;
}
export function metrics(spans:Span[],events:Event[],today=localDate()) {
 const records=latestRecords(events),finished=spans.filter(s=>records[s.id]?.status==='terminado');
 const done=finished.length,inProgress=spans.filter(s=>['ejecucion','observaciones'].includes(records[s.id]?.status)).length;
 const pending=spans.length-done-inProgress,remaining=spans.length-done;
 const planned=spans.reduce((n,s)=>n+plannedDiverters(s),0);
 const calculatedInstalled=spans.reduce((n,s)=>n+(diverterBasis(records[s.id])==='calculated'?installedDiverters(s,records[s.id]):0),0);
 const reportedInstalled=spans.reduce((n,s)=>n+(diverterBasis(records[s.id])==='reported'?installedDiverters(s,records[s.id]):0),0);
 const installed=calculatedInstalled+reportedInstalled;
 const daily:Record<string,number>={},dailyBD:Record<string,number>={};
 // A completion's explicit date is authoritative. No fallback to the registration timestamp.
 for(const span of finished){const record=records[span.id],date=record.date;
  if(!date||!/^\d{4}-\d{2}-\d{2}$/.test(date)||isNaN(Date.parse(date))||new Date(date+'T12:00:00Z').toISOString().slice(0,10)!==date||date<'2020-01-01'||date>today)continue;
  daily[date]=(daily[date]||0)+1;dailyBD[date]=(dailyBD[date]||0)+installedDiverters(span,record);
 }
 const days=Object.keys(daily).length,datedDone=Object.values(daily).reduce((a,b)=>a+b,0),datedInstalled=Object.values(dailyBD).reduce((a,b)=>a+b,0);
 const undatedDone=done-datedDone,average=days?datedDone/days:0,averageBD=days?datedInstalled/days:0;
 const estimatedDays=average>0?Math.ceil(remaining/average):null;
 const eta=estimatedDays!==null?localDate(new Date(Date.parse(today+'T12:00:00-03:00')+estimatedDays*86400000)):null;
 return {total:spans.length,done,inProgress,pending,installed,calculatedInstalled,reportedInstalled,planned,pct:spans.length?done/spans.length*100:0,remaining,average,averageBD,eta,estimatedDays,daily,dailyBD,days,datedDone,undatedDone,datedInstalled};
}
export function csvCell(x:unknown) { let s=String(x??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'; }
