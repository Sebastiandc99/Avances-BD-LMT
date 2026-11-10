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
export function metrics(spans:Span[],events:Event[],today=localDate()) {
  const records=latestRecords(events); const done=spans.filter(s=>records[s.id]?.status==='terminado').length;
  const installed=spans.reduce((n,s)=>n+(records[s.id]?.installed||0),0);
  const planned=spans.reduce((n,s)=>n+s.bd_propuestos_pendientes_validacion,0);
  const allowed=new Set(spans.map(s=>s.id)); const daily:Record<string,number>={}; const previous:Record<string,boolean>={};const completionDates:string[]=[];
  for(const e of activeEvents(events).filter(e=>allowed.has(e.spanId))) {
    const completed=e.status==='terminado',delta=Number(completed)-Number(previous[e.spanId]||false);
    if(delta){const date=e.date||localDate(new Date(e.createdAt));daily[date]=(daily[date]||0)+delta;if(delta>0)completionDates.push(date);}
    previous[e.spanId]=completed;
  }
  const start=completionDates.sort()[0];
  const days=start?Math.max(1,Math.round((Date.parse(today)-Date.parse(start))/86400000)+1):0;
  const average=days?done/days:0;
  const remaining=Math.max(0,spans.length-done); const eta=average>0?localDate(new Date(Date.parse(today+'T12:00:00-03:00')+Math.ceil(remaining/average)*86400000)):null;
  return {total:spans.length,done,installed,planned,pct:spans.length?done/spans.length*100:0,remaining,average,eta,daily,days};
}
export function csvCell(x:unknown) { let s=String(x??'');if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"'; }
