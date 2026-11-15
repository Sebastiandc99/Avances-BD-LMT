import type { MapMemory } from './map-view';

export type ViewState = {
 tab: string;
 mapLine: string;
 listLine: string;
 listDate: string;
 listFilter: string;
 listSearch: string;
 mapQuery: string;
 mapMemory: MapMemory | null;
 multiMode: boolean;
 multiIds: string[];
};
const key = 'lmt-view-session-v2';
const defaults: ViewState = {
 tab: 'list', mapLine: 'all', listLine: 'all', listDate: '', listFilter: 'all',
 listSearch: '', mapQuery: '', mapMemory: null, multiMode: false, multiIds: [],
};
export function readViewState(): ViewState {
 try {
  const saved = JSON.parse(sessionStorage.getItem(key) || 'null');
  if (!saved || typeof saved !== 'object') return { ...defaults };
  const memory = saved.mapMemory;
  const validMemory = memory && ['all', 'larga', 'corta'].includes(memory.line)
   && ['x', 'y', 'w', 'h'].every(k => Number.isFinite(memory.view?.[k]))
   && memory.view.w > 0 && memory.view.h > 0
   && Number.isFinite(memory.size?.w) && Number.isFinite(memory.size?.h)
   && memory.size.w > 0 && memory.size.h > 0;
  return {
   tab: ['list', 'map', 'metrics', 'history'].includes(saved.tab) ? saved.tab : defaults.tab,
   mapLine: ['all', 'larga', 'corta'].includes(saved.mapLine) ? saved.mapLine : 'all',
   listLine: ['all', 'larga', 'corta'].includes(saved.listLine) ? saved.listLine : 'all',
   listDate: typeof saved.listDate === 'string' ? saved.listDate : '',
   listFilter: ['all', 'pendiente', 'ejecucion', 'terminado'].includes(saved.listFilter) ? saved.listFilter : 'all',
   listSearch: typeof saved.listSearch === 'string' ? saved.listSearch : '',
   mapQuery: typeof saved.mapQuery === 'string' ? saved.mapQuery : '',
   mapMemory: validMemory ? memory : null,
   multiMode: saved.multiMode === true,
   multiIds: Array.isArray(saved.multiIds) ? saved.multiIds.filter((id: unknown) => typeof id === 'string') : [],
  };
 } catch { return { ...defaults }; }
}
export function saveViewState(value: ViewState) {
 try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* The current view stays in memory. */ }
}
