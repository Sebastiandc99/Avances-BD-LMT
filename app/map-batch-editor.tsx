'use client';
import { useState } from 'react';
import { Camera, Check, LoaderCircle, X } from 'lucide-react';
import { colors, localDate, statusOptions, type Event, type Photo, type Span, type Status } from '../lib/model';
import { photoFile } from '../lib/storage';
import type { SelectionValues } from '../lib/map-selection';

const name = (s: Span) => `${s.linea === 'corta' ? 'FP ' : ''}${Number(s.desde.split('-')[1])} — ${s.linea === 'corta' ? 'FP ' : ''}${Number(s.hasta.split('-')[1])}`;
export default function MapBatchEditor({ spans, records, onRemove, onClose, onSave }: {
 spans: Span[];
 records: Record<string, Event>;
 onRemove: (id: string) => void;
 onClose: () => void;
 onSave: (values: SelectionValues, photos: Photo[]) => Promise<void>;
}) {
 const [status, setStatus] = useState<Status | ''>('');
 const [date, setDate] = useState(localDate);
 const [withoutDate, setWithoutDate] = useState(false);
 const [changes, setChanges] = useState<NonNullable<SelectionValues['changes']>>({});
 const [photos, setPhotos] = useState<Photo[]>([]);
 const [busy, setBusy] = useState(false);
 const [error, setError] = useState('');
 async function addPhotos(files: FileList | null) {
  if (!files?.length) return;
  setBusy(true); setError('');
  try {
   const largest = Math.max(0, ...spans.map(s => records[s.id]?.photos.length || 0));
   if (largest + photos.length + files.length > 8) throw Error('Cada vano admite hasta 8 fotos, incluyendo las que ya tiene.');
   const additions = await Promise.all([...files].map(photoFile));
   setPhotos(current => [...current, ...additions]);
  } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo abrir la foto.'); }
  finally { setBusy(false); }
 }
 async function submit(e: React.FormEvent) {
  e.preventDefault();
  if (!status || !spans.length || busy) return;
  setBusy(true); setError('');
  try { await onSave({ status, date, withoutDate, changes, photoIds: photos.map(p => p.id) }, photos); }
  catch (e) { setError(e instanceof Error ? e.message : 'No se pudo guardar. La selección se conserva para reintentar.'); }
  finally { setBusy(false); }
 }
 return <div className="modal-backdrop"><div className="modal map-batch-modal" role="dialog" aria-modal="true" aria-label="Editar vanos seleccionados">
  <button className="modal-close" aria-label="Cerrar edición múltiple" onClick={onClose} disabled={busy}><X /></button>
  <h2>Editar {spans.length} vanos seleccionados</h2>
  <p>El estado y la fecha se aplican a toda la selección. Completá los demás campos que quieras actualizar.</p>
  <div className="selected-spans" aria-label="Vanos seleccionados">{spans.map(s => <button type="button" key={s.id} className="outline" disabled={busy} onClick={() => onRemove(s.id)} aria-label={'Quitar vano ' + name(s)}>{name(s)}<X size={13} /></button>)}</div>
  <form onSubmit={submit}><fieldset className="bulk-fields" disabled={busy}>
   <label className="field-label">Estado para todos</label>
   <div className="status-grid" role="group" aria-label="Estado de los vanos seleccionados">{statusOptions.map(([key, label]) => <button type="button" key={key} aria-pressed={status === key} className={status === key ? 'active' : ''} style={{ '--status': colors[key as Status] } as React.CSSProperties} onClick={() => setStatus(key as Status)}><i />{label}{status === key && <Check size={14} />}</button>)}</div>
   <label className="batch-date">Fecha para todos los vanos<input type="date" min="2020-01-01" max={localDate()} required={!withoutDate} disabled={withoutDate} value={withoutDate ? '' : date} onChange={e => setDate(e.target.value)} /></label>
   <label className="batch-no-date"><input type="checkbox" checked={withoutDate} onChange={e => setWithoutDate(e.target.checked)} /> Sin fecha de ejecución</label>
   <div className="batch-work-fields">
    <label>Cantidad de cuadrillas<input type="number" min="1" step="1" placeholder="Conservar la de cada vano" value={changes.crews ?? ''} onChange={e => setChanges(v => ({ ...v, crews: e.target.value ? Number(e.target.value) : undefined }))} /></label>
    <label>Responsable / cuadrilla<input maxLength={120} placeholder="Conservar el de cada vano" value={changes.responsible ?? ''} onChange={e => setChanges(v => ({ ...v, responsible: e.target.value }))} /></label>
    <label>Observaciones<textarea rows={3} maxLength={4000} placeholder="Conservar las de cada vano" value={changes.notes ?? ''} onChange={e => setChanges(v => ({ ...v, notes: e.target.value }))} /></label>
    <details className="technical-details"><summary>Desviadores (opcional)</summary><label>BD reales por vano<input type="number" min="0" max="1000" step="1" disabled={status === 'pendiente'} placeholder="Conservar la cantidad de cada vano" value={changes.installed ?? ''} onChange={e => setChanges(v => ({ ...v, installed: Number(e.target.value) }))} /></label><p className="field-hint">La cantidad se aplica a cada vano seleccionado. Cero permite el cálculo automático en los terminados.</p></details>
   </div>
   {Object.keys(changes).length > 0 && <button type="button" className="text-action" onClick={() => setChanges({})}>Conservar los datos adicionales de cada vano</button>}
   <div className="photo-heading"><label className="field-label">Fotos para todos</label><label className="photo-add"><Camera size={16} /> Adjuntar<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => { void addPhotos(e.target.files); e.target.value = ''; }} /></label></div>
   <div className="photos">{photos.map(p => <div key={p.id}><img alt={p.name} src={p.data} /><button type="button" aria-label={'Quitar foto ' + p.name} onClick={() => setPhotos(list => list.filter(v => v.id !== p.id))}><X size={13} /></button></div>)}</div>
   <p className="field-hint">La cantidad de cuadrillas corresponde al equipo que trabajó en la selección. Las fotos adjuntas se agregan a cada vano. Los campos adicionales sin editar conservan su valor anterior.</p>
   {error && <p className="error-text" role="alert">{error}</p>}
   <div className="dialog-actions"><button type="button" className="outline" onClick={onClose}>Cancelar</button><button type="submit" className="primary" disabled={!spans.length || !status || (!date && !withoutDate)}>{busy ? <LoaderCircle className="spin" size={16} /> : <Check size={16} />} Guardar {spans.length} vanos</button></div>
  </fieldset></form>
 </div></div>;
}
