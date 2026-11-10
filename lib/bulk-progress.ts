import type { Event, Span } from './model';
export type CompletionRange={line:'larga'|'corta';from:number;to:number};
export function completionPlan(spans:Span[],ranges:CompletionRange[],records:Record<string,Event>,conflicts:string[]){
 if(!ranges.length)throw Error('Agregá al menos un tramo.');
 const selected=new Set<string>();
 for(const range of ranges){
  const max=range.line==='larga'?219:range.line==='corta'?18:0;
  if(!max||!Number.isInteger(range.from)||!Number.isInteger(range.to)||range.from<1||range.to>max||range.from>=range.to)throw Error(`Revisá el tramo: usá piquetes del 1 al ${max||219}, con el final mayor que el inicial.`);
  const matches=spans.filter(s=>s.linea===range.line&&Number(s.desde.split('-')[1])>=range.from&&Number(s.hasta.split('-')[1])<=range.to);
  if(matches.length!==range.to-range.from)throw Error('El tramo no coincide con los vanos del proyecto.');
  for(const span of matches)selected.add(span.id);
 }
 const eligible:string[]=[],done:string[]=[],blocked:string[]=[];
 for(const id of selected){if(conflicts.includes(id))blocked.push(id);else if(records[id]?.status==='terminado')done.push(id);else eligible.push(id);}
 return {selected:[...selected],eligible,done,blocked};
}
export function completedEvents(ids:string[],records:Record<string,Event>,options:{date:string;responsible:string;author:string},makeId:()=>string,createdAt:string):Event[]{
 return ids.map(spanId=>{
  const old=records[spanId];
  return {status:'terminado',date:options.date||old?.date||'',installed:old?.installed||0,notes:old?.notes||'',photos:old?.photos||[],responsible:options.responsible||old?.responsible||'',id:makeId(),spanId,version:(old?.version||0)+1,baseVersion:old?.version||0,createdAt,author:options.author,sync:'pending'};
 });
}
