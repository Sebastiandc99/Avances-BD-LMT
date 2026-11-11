import { colors } from './model.ts';
export type ProgressTotals={total:number;done:number;inProgress:number;pending:number};
export function progressSlices(stats:ProgressTotals){
 return [
  {key:'terminado',label:'Terminados',value:stats.done,color:colors.terminado},
  {key:'ejecucion',label:'En proceso',value:stats.inProgress,color:colors.ejecucion},
  {key:'pendiente',label:'Pendientes',value:stats.pending,color:colors.pendiente},
 ].map(s=>({...s,share:stats.total?s.value/stats.total:0}));
}
export function progressGradient(stats:ProgressTotals){
 if(!stats.total)return colors.pendiente;
 let start=0;
 return 'conic-gradient('+progressSlices(stats).map(s=>{const end=start+s.share*100,segment=`${s.color} ${start}% ${end}%`;start=end;return segment;}).join(',')+')';
}
