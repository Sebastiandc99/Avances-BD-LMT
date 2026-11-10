'use client';
import { useState } from 'react';
import { Check, LoaderCircle, X } from 'lucide-react';
import { colors, localDate, statusOptions, type Event, type Span, type Status } from '../lib/model';
import type { SelectionValues } from '../lib/map-selection';
const name=(s:Span)=>`${s.linea==='corta'?'FP ':''}${Number(s.desde.split('-')[1])} — ${s.linea==='corta'?'FP ':''}${Number(s.hasta.split('-')[1])}`;
export default function MapBatchEditor({spans,records,onRemove,onClose,onSave}:{spans:Span[];records:Record<string,Event>;onRemove:(id:string)=>void;onClose:()=>void;onSave:(values:SelectionValues)=>Promise<void>}){
 const common=[...new Set(spans.map(s=>records[s.id]?.date||''))];
 const [status,setStatus]=useState<Status|''>(''),[date,setDate]=useState(common.length===1?common[0]:''),[withoutDate,setWithoutDate]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function submit(e:React.FormEvent){e.preventDefault();if(!status||!spans.length||busy)return;setBusy(true);setError('');try{await onSave({status,date,withoutDate});}catch(e){setError(e instanceof Error?e.message:'No se pudo guardar. La selección se conserva para reintentar.');}finally{setBusy(false);}}
 return <div className="modal-backdrop"><div className="modal map-batch-modal" role="dialog" aria-modal="true" aria-label="Editar vanos seleccionados">
  <button className="modal-close" aria-label="Cerrar edición múltiple" onClick={onClose} disabled={busy}><X/></button>
  <div className="eyebrow">SELECCIÓN EN EL MAPA</div><h2>Editar {spans.length} vanos seleccionados</h2>
  <p>Se aplicarán el mismo estado y la misma fecha a todos los vanos de esta selección.</p>
  <div className="selected-spans" aria-label="Vanos seleccionados">{spans.map(s=><button type="button" key={s.id} className="outline" disabled={busy} onClick={()=>onRemove(s.id)} aria-label={'Quitar vano '+name(s)}>{name(s)}<X size={13}/></button>)}</div>
  <form onSubmit={submit}><fieldset className="bulk-fields" disabled={busy}>
   <label className="field-label">Estado para todos</label><div className="status-grid" role="group" aria-label="Estado de los vanos seleccionados">{statusOptions.map(([key,label])=><button type="button" key={key} aria-pressed={status===key} className={status===key?'active':''} style={{'--status':colors[key as Status]} as React.CSSProperties} onClick={()=>setStatus(key as Status)}><i/>{label}{status===key&&<Check size={14}/>}</button>)}</div>
   <label className="batch-date">Fecha para todos los vanos<input type="date" min="2020-01-01" max={localDate()} required={!withoutDate} disabled={withoutDate} value={withoutDate?'':date} onChange={e=>setDate(e.target.value)}/></label>
   <label className="batch-no-date"><input type="checkbox" checked={withoutDate} onChange={e=>setWithoutDate(e.target.checked)}/> Sin fecha de ejecución</label>
   <p className="field-hint">Sin fecha, los terminados suman al avance y a los BD, pero quedan fuera del rendimiento. Se conservan las fotos, notas, responsable y cantidades reales de cada vano. Al marcar Pendiente, la cantidad colocada queda en cero.</p>
   {error&&<p className="error-text" role="alert">{error}</p>}
   <div className="dialog-actions"><button type="button" className="outline" onClick={onClose}>Cancelar</button><button type="submit" className="primary" disabled={!spans.length||!status||(!date&&!withoutDate)}>{busy?<LoaderCircle className="spin" size={16}/>:<Check size={16}/>} Guardar {spans.length} vanos</button></div>
  </fieldset></form>
 </div></div>;
}
