import { dateLabel, localDate } from '../lib/model';

export default function DayFilter({date,onChange,total,done,inProgress}:{date:string;onChange:(date:string)=>void;total:number;done:number;inProgress:number}){
 return <section className="day-filter" aria-label="Filtrar vanos por día de actividad">
  <div className="day-filter-controls">
   <label htmlFor="vanos-execution-date">Fecha de actividad
    <input id="vanos-execution-date" type="date" min="2020-01-01" max={localDate()} value={date} onChange={e=>onChange(e.target.value)}/>
   </label>
   {date&&<button type="button" className="outline" onClick={()=>onChange('')}>Ver todas las fechas</button>}
  </div>
  {date?<div className="day-filter-summary" role="status">
   <b>{dateLabel(date)} · Ambas líneas</b>
   <p><strong>{total}</strong> vanos con actividad <span>·</span> {done} terminados <span>·</span> {inProgress} en proceso</p>
   <small>La tabla también respeta los filtros de línea, estado y búsqueda.</small>
  </div>:<p>Elegí una fecha para consultar los vanos terminados y en proceso de ese día.</p>}
 </section>;
}
