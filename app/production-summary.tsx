'use client';
import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ChevronDown, LoaderCircle, TrendingUp, X } from 'lucide-react';
import { dailyCompletion } from '../lib/daily-completion';
import { dateLabel, latestRecords, metrics, type Event, type Inventory, type Span } from '../lib/model';
import ProgressPie from './progress-pie';

const fmt = (n: number, digits = 0) => new Intl.NumberFormat('es-AR', { maximumFractionDigits: digits }).format(n);
const spanName = (s: Span) => `${s.linea === 'corta' ? 'FP ' : ''}${Number(s.desde.split('-')[1])}-${Number(s.hasta.split('-')[1])}`;
function DailyChart({ daily, onChoose }: { daily: Record<string, number>; onChoose: (day: string) => void }) {
 const days = Object.keys(daily).sort();
 const host = useRef<SVGSVGElement>(null);
 const [width, setWidth] = useState(640);
 const hasDays = days.length > 0;
 useEffect(() => {
  if (!host.current) return;
  const observer = new ResizeObserver(entries => {
   const next = entries[0].contentRect.width;
   if (next > 0) setWidth(Math.max(240, next));
  });
  observer.observe(host.current);
  return () => observer.disconnect();
 }, [hasDays]);
 if (!days.length) return <p className="summary-empty">Agregá fechas a los vanos terminados para ver la producción diaria.</p>;
 const start = Date.parse(days[0]), end = Date.parse(days.at(-1)!);
 const height = 220, left = 42, right = 24, top = 22, bottom = 45;
 const max = Math.max(1, ...Object.values(daily));
 const x = (day: string) => left + (end === start ? .5 : (Date.parse(day) - start) / (end - start)) * (width - left - right);
 const y = (value: number) => height - bottom - value / max * (height - top - bottom);
 const tickCount = Math.min(days.length, width < 420 ? 3 : 5);
 const ticks = Array.from({ length: tickCount }, (_, i) => days[Math.round(i * (days.length - 1) / Math.max(1, tickCount - 1))]);
 return <svg ref={host} className="summary-daily-chart" viewBox={`0 0 ${width} ${height}`} role="group" aria-label="Vanos terminados por fecha de ejecución">
  {[0, .5, 1].map(t => <g key={t}><line x1={left} x2={width - right} y1={y(max * t)} y2={y(max * t)} stroke="#dce7e3" /><text x={left - 9} y={y(max * t) + 4} textAnchor="end">{fmt(max * t, 1)}</text></g>)}
  <polyline points={days.map(day => `${x(day)},${y(daily[day])}`).join(' ')} fill="none" stroke="#087f78" strokeWidth={2.5} />
  {days.map(day => <g key={day} role="button" tabIndex={0} aria-label={`${dateLabel(day)}: ${daily[day]} vanos terminados. Filtrar este día.`} onClick={() => onChoose(day)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onChoose(day); } }}>
   <title>{dateLabel(day)} · {daily[day]} terminados</title><circle cx={x(day)} cy={y(daily[day])} r={12} fill="transparent" /><circle cx={x(day)} cy={y(daily[day])} r={4} fill="#087f78" pointerEvents="none" />
  </g>)}
  {ticks.map(day => <text key={day} x={x(day)} y={height - 17} textAnchor="middle">{dateLabel(day).slice(0, 5)}</text>)}
 </svg>;
}
export default function ProductionSummary({ inventory, events, today, onOpenSpan, onCompleteInProgress, completingInProgress, inProgressCompletionBlocked, basePath='/' }: {
 inventory: Inventory; events: Event[]; today: string; onOpenSpan: (id: string) => void; onCompleteInProgress: () => void; completingInProgress: boolean; inProgressCompletionBlocked: boolean; basePath?: string;
}) {
 const [selectedDay, setSelectedDay] = useState('');
 const records = latestRecords(events);
 const stats = metrics(inventory.vanos, events, today);
 const day = selectedDay ? dailyCompletion(inventory.vanos, records, selectedDay, today) : null;
 return <>
  <div className="panel-title"><h3><TrendingUp size={17} /> Resumen de producción</h3><span>Ambas líneas · Proyecto completo</span></div>
  <div className="analytics">
   <p className="project-total">Ambas líneas · {inventory.piquetes.length} piquetes · {stats.total} vanos</p>
   <div className="summary-bulk-action">
    <button className="outline" type="button" onClick={onCompleteInProgress} disabled={!stats.inProgress||completingInProgress||inProgressCompletionBlocked}>{completingInProgress?<LoaderCircle className="spin" size={17}/>:<CheckCircle2 size={17}/>} {completingInProgress?'Guardando…':'Terminar los vanos en proceso'}</button>
    <span>{inProgressCompletionBlocked?'Guardá o cerrá la carga abierta para usar esta opción.':stats.inProgress?`${stats.inProgress} vanos en proceso de ambas líneas · Se guardan con la fecha de hoy (${dateLabel(today)}).`:'No hay vanos en proceso.'}</span>
   </div>
   <div className="summary-visuals">
    <ProgressPie stats={stats} />
    <figure className="summary-diverters">
     <img src={basePath+'assets/diverters-perspectiva.svg'} width="800" height="460" alt="Secuencia ilustrativa de ocho Bird diverters amarillos apareciendo de a uno entre dos piquetes, con el paisaje de la Puna."/>
    </figure>
   </div>
   <div className="performance-summary">
    <p><b>{stats.days ? fmt(stats.average, 1) : '—'} vanos/día</b></p>
    <p>{stats.datedDone} terminados con fecha · {stats.days} día(s) de ejecución registrados · {stats.undatedDone} terminados sin fecha excluidos</p>
    <div className="forecast-grid">
     <div><span>Días para finalizar</span><strong>{stats.estimatedDays !== null ? stats.estimatedDays : '—'}<small> días</small></strong></div>
     <div><span>Fecha estimada de finalización</span><strong>{stats.remaining === 0 ? 'Finalizado' : stats.eta ? dateLabel(stats.eta) : 'Sin estimación'}</strong></div>
    </div>
    <p>{stats.estimatedDays === null ? 'Agregá fechas de ejecución a los vanos terminados para obtener la proyección.' : stats.remaining === 0 ? 'Todos los vanos del proyecto están terminados.' : 'Proyección desde hoy al rendimiento promedio fechado, suponiendo una jornada de trabajo por día.'}</p>
   </div>
   <section className="summary-daily-card" aria-labelledby="summary-daily-title">
    <h3 id="summary-daily-title">Vanos terminados por día</h3>
    <DailyChart daily={stats.daily} onChoose={setSelectedDay} />
    {day && <div className="summary-day-detail">
     <div className="summary-day-heading"><h4>{dateLabel(selectedDay)} · {day.total} vanos terminados</h4><button className="icon-button" aria-label="Cerrar detalle del día" onClick={() => setSelectedDay('')}><X size={17} /></button></div>
     <div className="summary-day-spans">{day.spans.map(s => <button key={s.id} className="outline" onClick={() => onOpenSpan(s.id)}>Vano {spanName(s)}</button>)}</div>
    </div>}
   </section>
   <details className="technical-details">
    <summary>Detalle de desviadores <ChevronDown size={16} /></summary>
    <p><b>Diverters totales: {fmt(stats.planned)}</b></p>
    <p>Diverters terminados: {fmt(stats.installed)}</p>
    <p>Diverters pendientes: {fmt(stats.remainingBD)}</p>
    <p>{fmt(stats.calculatedInstalled)} según planilla de vanos terminados · {fmt(stats.reportedInstalled)} informados en campo.</p>
    <p>{stats.days ? fmt(stats.averageBD, 1) : '—'} BD/día con fecha de ejecución.</p>
   </details>
   <p className="method-note">El rendimiento usa solo vanos actualmente terminados con fecha de ejecución: cantidad fechada dividida por días distintos con ejecución registrada. Los vanos sin fecha no afectan ese promedio. Corregir una fecha mueve el vano al día correcto; reabrirlo lo retira de la producción terminada. Las jornadas restantes son orientativas.</p>
  </div>
 </>;
}
