'use client';
import { useEffect, useRef, useState } from 'react';
import { Activity, BarChart3, List, RotateCcw, UtilityPole } from 'lucide-react';
import { dailyActivity } from '../lib/daily-completion';
import { colors, dateLabel, latestRecords, metrics, statuses, type Event, type Inventory, type Span } from '../lib/model';
import { progressGradient, progressSlices } from '../lib/progress-pie';

const fmt = (n: number, digits = 0) => new Intl.NumberFormat('es-AR', { maximumFractionDigits: digits }).format(n);
const spanName = (s: Span) => `${s.linea === 'corta' ? 'FP ' : ''}${Number(s.desde.split('-')[1])}–${Number(s.hasta.split('-')[1])}`;
const state = (event?: Event) => event?.status === 'observaciones' ? 'ejecucion' : event?.status || 'pendiente';
const pages = [
 { id: 'overview', label: 'Resumen', icon: BarChart3 },
 { id: 'production', label: 'Producción', icon: Activity },
 { id: 'spans', label: 'Por vano', icon: UtilityPole },
 { id: 'detail', label: 'Detalle', icon: List },
];
type Filters = { line: string; status: string; responsible: string; from: string; to: string };
const emptyFilters: Filters = { line: 'all', status: 'all', responsible: 'all', from: '', to: '' };
const sessionKey = 'lmt-summary-session-v1';
function savedSummary() {
 try {
  const value = JSON.parse(sessionStorage.getItem(sessionKey) || '{}');
  const filters = Object.fromEntries(Object.keys(emptyFilters).map(k => [k, typeof value.filters?.[k] === 'string' ? value.filters[k] : emptyFilters[k as keyof Filters]])) as Filters;
  return { filters, page: pages.some(p => p.id === value.page) ? value.page : 'overview' };
 } catch { return { filters: { ...emptyFilters }, page: 'overview' }; }
}
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
export default function ProductionSummary({ inventory, events, today, onOpenSpan }: {
 inventory: Inventory; events: Event[]; today: string; onOpenSpan: (id: string) => void;
}) {
 const [initial] = useState(savedSummary);
 const [filters, setFilters] = useState<Filters>(initial.filters);
 const [page, setPage] = useState(initial.page);
 useEffect(() => { try { sessionStorage.setItem(sessionKey, JSON.stringify({ filters, page })); } catch { /* The view remains available in this tab. */ } }, [filters, page]);
 const records = latestRecords(events);
 const responsible = [...new Set(Object.values(records).map(e => e.responsible).filter(Boolean))].sort();
 const spans = inventory.vanos.filter(s => {
  const record = records[s.id];
  return (filters.line === 'all' || s.linea === filters.line)
   && (filters.status === 'all' || (filters.status === 'active' ? state(record) !== 'pendiente' : state(record) === filters.status))
   && (filters.responsible === 'all' || record?.responsible === filters.responsible)
   && (!filters.from || !!record?.date && record.date >= filters.from)
   && (!filters.to || !!record?.date && record.date <= filters.to);
 });
 const stats = metrics(spans, events, today);
 const currentDay = dailyActivity(inventory.vanos, records, today, today);
 const days = Object.entries(stats.daily).sort(([a], [b]) => a.localeCompare(b));
 function change(value: Partial<Filters>) { setFilters(current => ({ ...current, ...value })); }
 function chooseDay(day: string) { change({ from: day, to: day }); }
 const cards = [
  { label: 'Vanos totales', value: fmt(stats.total), tone: 'total' },
  { label: 'Terminados', value: fmt(stats.done), tone: 'done' },
  { label: 'Pendientes', value: fmt(stats.pending), tone: 'pending' },
  { label: 'En proceso', value: fmt(stats.inProgress), tone: 'process' },
  { label: 'Promedio de vanos / día', value: stats.days ? fmt(stats.average, 1) : '—', tone: 'rate' },
  { label: 'Finalización estimada', value: stats.total > 0 && stats.remaining === 0 ? 'Finalizado' : stats.eta ? dateLabel(stats.eta) : 'Sin estimación', tone: 'eta' },
 ];
 return <div className="production-report">
  <aside className="report-nav" aria-label="Páginas del informe">
   <div className="report-brand">AVANCES <b>LMT</b></div>
   <nav>{pages.map(item => <button key={item.id} onClick={() => setPage(item.id)} aria-current={page === item.id ? 'page' : undefined} className={page === item.id ? 'active' : ''}><item.icon size={18} />{item.label}</button>)}</nav>
   <button className="report-reset" onClick={() => setFilters({ ...emptyFilters })}><RotateCcw size={17} />Limpiar filtros</button>
  </aside>
  <div className="report-content">
   <div className="report-heading"><h3>{pages.find(p => p.id === page)?.label}</h3><span>{stats.total} vanos en la selección</span></div>
   <div className="report-filters">
    <label>Línea<select value={filters.line} onChange={e => change({ line: e.target.value })}><option value="all">Todas</option><option value="larga">Larga</option><option value="corta">Corta FP</option></select></label>
    <label>Estado<select value={filters.status} onChange={e => change({ status: e.target.value })}><option value="all">Todos</option><option value="active">Terminados y en proceso</option><option value="terminado">Terminado</option><option value="ejecucion">En proceso</option><option value="pendiente">Pendiente</option></select></label>
    <label>Responsable<select value={filters.responsible} onChange={e => change({ responsible: e.target.value })}><option value="all">Todos</option>{responsible.map(name => <option key={name}>{name}</option>)}</select></label>
    <label>Desde<input type="date" min="2020-01-01" max={filters.to || today} value={filters.from} onChange={e => change({ from: e.target.value })} /></label>
    <label>Hasta<input type="date" min={filters.from || '2020-01-01'} max={today} value={filters.to} onChange={e => change({ to: e.target.value })} /></label>
   </div>
   <button className="report-today" onClick={() => { setFilters({ ...emptyFilters, from: today, to: today, status: 'active' }); setPage('detail'); }} aria-label={`Ver los ${currentDay.total} vanos con actividad hoy`}>
    <span><Activity size={22} /><b>Vanos de hoy</b><small>{dateLabel(today)} · Ambas líneas</small></span><strong>{currentDay.total}</strong><span>{currentDay.done} terminados <i /> {currentDay.inProgress} en proceso</span>
   </button>
   {page === 'overview' && <>
    <div className="report-overview">
     <section className="report-donut-card"><h4>Avance de la selección</h4><div className="report-donut" style={{ background: progressGradient(stats) }} role="img" aria-label={`${fmt(stats.pct, 1)} % de ${stats.total} vanos terminados`}><div><strong>{fmt(stats.pct, 1)}<small>%</small></strong><span>{stats.done} de {stats.total}</span></div></div>
      <div className="report-state-legend">{progressSlices(stats).map(item => <button key={item.key} onClick={() => change({ status: filters.status === item.key ? 'all' : item.key })} aria-pressed={filters.status === item.key}><i style={{ background: item.color }} />{item.label} <b>{item.value}</b></button>)}</div>
     </section>
     <div className="report-kpis">{cards.map(item => <article className={'report-kpi ' + item.tone} key={item.label}><h4>{item.label}</h4><strong>{item.value}</strong></article>)}</div>
    </div>
    <div className="report-charts">
     <section className="report-chart-card"><h4>Vanos por línea</h4><div className="report-line-columns">{['larga', 'corta'].map(line => {
      const group = spans.filter(s => s.linea === line), total = metrics(group, events, today);
      const maximum = Math.max(1, ...['larga', 'corta'].map(l => spans.filter(s => s.linea === l).length));
      return <div key={line} className="report-line-column"><div className="report-column-space"><span className="report-column-total">{total.total}</span><div className="report-column" style={{ height: total.total / maximum * 100 + '%' }}>{progressSlices(total).filter(part => part.value).map(part => <button key={part.key} aria-label={`${line === 'larga' ? 'Línea larga' : 'Línea corta FP'}, ${part.value} ${part.label}`} title={`${part.label}: ${part.value}`} style={{ background: part.color, flex: part.value }} onClick={() => change({ line, status: part.key })}>{part.value / maximum * 170 >= 18 ? part.value : ''}</button>)}</div></div><button className="report-column-label" onClick={() => change({ line })}>{line === 'larga' ? 'Línea larga' : 'Línea corta FP'}</button></div>;
     })}</div><p className="report-chart-hint">Seleccioná una columna o un estado para filtrar.</p></section>
     <section className="report-chart-card"><h4>Vanos terminados por día</h4><DailyChart daily={stats.daily} onChoose={chooseDay} /></section>
    </div>
   </>}
   {page === 'production' && <>
    <div className="report-production-stats"><article><span>Terminados con fecha</span><strong>{stats.datedDone}</strong></article><article><span>Promedio de vanos / día</span><strong>{stats.days ? fmt(stats.average, 1) : '—'}</strong></article><article><span>Días con producción</span><strong>{stats.days}</strong></article><article><span>Días estimados restantes</span><strong>{stats.estimatedDays ?? '—'}</strong></article></div>
    <section className="report-chart-card"><h4>Evolución diaria</h4><DailyChart daily={stats.daily} onChoose={chooseDay} /></section>
    <div className="table-scroll"><table className="report-table"><thead><tr><th>Fecha</th><th>Vanos terminados</th><th>Acumulados</th></tr></thead><tbody>{days.map(([day, count], i) => <tr key={day}><td><button onClick={() => { chooseDay(day); setPage('detail'); }}>{dateLabel(day)}</button></td><td>{count}</td><td>{days.slice(0, i + 1).reduce((n, [, value]) => n + value, 0)}</td></tr>)}</tbody></table></div>
   </>}
   {page === 'spans' && <><p className="report-chart-hint">Seleccioná un vano para abrir su ficha.</p>{['larga', 'corta'].map(line => <section key={line} className="report-span-section"><h4>{line === 'larga' ? 'Línea larga' : 'Línea corta FP'}</h4><div className="report-span-grid">{spans.filter(s => s.linea === line).map(s => <button key={s.id} style={{ '--span-color': colors[records[s.id]?.status || 'pendiente'] } as React.CSSProperties} onClick={() => onOpenSpan(s.id)}><b>{spanName(s)}</b><span>{statuses[records[s.id]?.status || 'pendiente']}</span></button>)}</div></section>)}</>}
   {page === 'detail' && <div className="table-scroll"><table className="report-table"><thead><tr><th>Vano</th><th>Estado</th><th>Fecha de actividad</th><th>Cuadrillas</th><th>Responsable</th></tr></thead><tbody>{spans.map(s => <tr key={s.id}><td><button onClick={() => onOpenSpan(s.id)}>{spanName(s)}</button></td><td><span className="report-state"><i style={{ background: colors[records[s.id]?.status || 'pendiente'] }} />{statuses[records[s.id]?.status || 'pendiente']}</span></td><td>{dateLabel(records[s.id]?.date || '')}</td><td>{records[s.id]?.crews ?? '—'}</td><td>{records[s.id]?.responsible || '—'}</td></tr>)}</tbody></table></div>}
   {!spans.length && <p className="summary-empty">No hay vanos con estos filtros.</p>}
   <p className="report-method">Rendimiento = vanos actualmente terminados con fecha ÷ días distintos con producción. La finalización se proyecta desde hoy a ese ritmo. {stats.undatedDone > 0 && `${stats.undatedDone} terminados sin fecha quedan fuera del rendimiento.`}</p>
  </div>
 </div>;
}
