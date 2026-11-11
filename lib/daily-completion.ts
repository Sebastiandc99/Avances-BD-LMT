import { installedDiverters, localDate, type Progress, type Span } from './model.ts';

/** Completed spans by their current execution date, never by the save timestamp. */
export function dailyCompletion(spans:Span[],records:Readonly<Record<string,Progress|undefined>>,date:string,today=localDate()){
 const valid=/^\d{4}-\d{2}-\d{2}$/.test(date)&&!isNaN(Date.parse(date))&&new Date(date+'T12:00:00Z').toISOString().slice(0,10)===date&&date>='2020-01-01'&&date<=today;
 const completed=valid?spans.filter(s=>records[s.id]?.status==='terminado'&&records[s.id]?.date===date):[];
 return {spans:completed,total:completed.length,installed:completed.reduce((n,s)=>n+installedDiverters(s,records[s.id]),0)};
}
