import { dateLabel, localDate } from '../lib/model';

export default function DayFilter({date,onChange,total,installed}:{date:string;onChange:(date:string)=>void;total:number;installed:number}){
 return <section className="day-filter" aria-label="Filtrar vanos montados por día">
  <div className="day-filter-controls">
   <label htmlFor="vanos-execution-date">Montados el día
    <input id="vanos-execution-date" type="date" min="2020-01-01" max={localDate()} value={date} onChange={e=>onChange(e.target.value)}/>
   </label>
   {date&&<button type="button" className="outline" onClick={()=>onChange('')}>Ver todas las fechas</button>}
  </div>
  {date?<div className="day-filter-summary" role="status">
   <b>{dateLabel(date)} · Total del día (ambas líneas)</b>
   <p><strong>{total}</strong> {total===1?'vano montado':'vanos montados'} <span>·</span> <strong>{new Intl.NumberFormat('es-AR').format(installed)}</strong> BD colocados</p>
   <small>Solo terminados con esa fecha de ejecución. La tabla también respeta la línea y la búsqueda.</small>
  </div>:<p>Elegí una fecha para ver los vanos montados y el total de ese día.</p>}
 </section>;
}
