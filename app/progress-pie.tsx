import { progressGradient, progressSlices, type ProgressTotals } from '../lib/progress-pie';
const percent=(n:number)=>new Intl.NumberFormat('es-AR',{style:'percent',maximumFractionDigits:1}).format(n);
export default function ProgressPie({stats}:{stats:ProgressTotals}){
 const slices=progressSlices(stats);
 return <figure className="progress-pie-card" aria-labelledby="progress-pie-title">
  <figcaption><h3 id="progress-pie-title">Avance de vanos</h3><p>Ambas líneas · {stats.total} vanos</p></figcaption>
  <div className="progress-pie" role="img" aria-label={`Gráfico de torta del avance total: ${slices.map(s=>`${s.label}: ${s.value} ${s.value===1?'vano':'vanos'}, ${percent(s.share)}`).join('; ')}.`} style={{background:progressGradient(stats)}}/>
  <ul className="pie-legend">{slices.map(s=><li key={s.key}><span className="pie-state"><i style={{background:s.color}}/>{s.label}</span><b>{s.value}<small> {s.value===1?'vano':'vanos'}</small></b><strong>{percent(s.share)}</strong></li>)}</ul>
 </figure>;
}
