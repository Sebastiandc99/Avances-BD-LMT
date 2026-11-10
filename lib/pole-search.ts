import type { Pole, Span } from './model';
import type { MapSize, MapView } from './map-view';
export type PoleTarget={id:string;request:number};
export function searchPoles(poles:Pole[],query:string,line='all'){
 const text=query.normalize('NFD').replace(/[\u0300-\u036f\s._-]/g,'').toUpperCase();
 const match=/^(FP|CORTA|LARGA|L|PIQUETE|PIQ|PQT|P)?0*(\d{1,3})$/.exec(text);
 if(!match)return [];
 const explicit=['FP','CORTA'].includes(match[1])?'corta':['L','LARGA','P'].includes(match[1])?'larga':null;
 return poles.filter(p=>Number(p.id.split('-').at(-1))===Number(match[2])&&(explicit?p.linea===explicit:line==='all'||p.linea===line));
}
export function viewAtPole(poles:Pole[],spans:Span[],id:string,size:MapSize):MapView|null{
 const pole=poles.find(p=>p.id===id);if(!pole)return null;
 const neighbors=spans.filter(s=>s.desde===id||s.hasta===id).flatMap(s=>[s.desde,s.hasta]).filter(p=>p!==id).map(id=>poles.find(p=>p.id===id)).filter((p):p is Pole=>!!p);
 const spacing=Math.max(0,...neighbors.map(p=>Math.hypot(p.pixel[0]-pole.pixel[0],p.pixel[1]-pole.pixel[1]))),w=Math.max(100,Math.min(500,spacing*4)),h=w*size.h/size.w;
 return {x:pole.pixel[0]-w/2,y:pole.pixel[1]-h/2,w,h};
}
