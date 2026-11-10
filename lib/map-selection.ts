import { latestRecords, validProgress, type Event, type Span, type Status } from './model.ts';

export type SelectionValues={status:Status;date:string;withoutDate:boolean};
export function toggleSpanSelection(ids:string[],id:string){return ids.includes(id)?ids.filter(v=>v!==id):[...ids,id];}
export function selectionEvents(spans:Span[],ids:string[],events:Event[],expected:Record<string,number>,values:SelectionValues,author:string,makeId:()=>string,createdAt:string):Event[]{
 const selected=[...new Set(ids)],allowed=new Set(spans.map(s=>s.id)),records=latestRecords(events);
 if(!selected.length)throw Error('Seleccioná al menos un vano en el mapa.');
 if(!['pendiente','ejecucion','terminado'].includes(values.status))throw Error('Elegí el estado para los vanos seleccionados.');
 if(!values.date&&!values.withoutDate)throw Error('Elegí una fecha o marcá Sin fecha de ejecución.');
 for(const id of selected){
  if(!allowed.has(id))throw Error('La selección incluye un vano que no pertenece al proyecto.');
  if(events.some(e=>e.spanId===id&&e.sync==='conflict'))throw Error('Hay un vano seleccionado con cambios en otro equipo. Resolvé el conflicto en Datos y respaldo antes de guardar.');
  if(expected[id]!== (records[id]?.version||0))throw Error('Un vano seleccionado cambió mientras editabas. Cerrá esta ventana y volvé a abrir Editar seleccionados para revisar los datos actuales.');
 }
 const date=values.withoutDate?'':values.date;
 const additions=selected.map(spanId=>{const old=records[spanId];return {
  status:values.status,date,installed:values.status==='pendiente'?0:old?.installed||0,
  notes:old?.notes||'',photos:[...(old?.photos||[])],responsible:old?.responsible||'',
  id:makeId(),spanId,baseVersion:old?.version||0,version:(old?.version||0)+1,createdAt,author,sync:'pending' as const,
 };});
 if(!additions.every(validProgress))throw Error('Revisá la fecha. Debe ser válida, desde 2020 y hasta hoy.');
 return additions;
}
