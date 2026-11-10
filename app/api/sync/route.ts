import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
import { validProgress, validSpanId } from '../../../lib/model';
export const dynamic='force-dynamic';
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store'}});
export async function GET() { const u=await getChatGPTUser();if(!u)return json({error:'Iniciá sesión para sincronizar.'},401);if(!env.DB)return json({error:'Base de datos no disponible.'},503);const r=await env.DB.prepare('SELECT payload, author, received_at FROM lmt_events WHERE owner = ? ORDER BY version ASC, received_at ASC').bind(u.userId).all<{payload:string;author:string;received_at:string}>();return json({events:r.results.map(v=>({...JSON.parse(v.payload),author:v.author,sync:'synced'}))}); }
export async function POST(request:Request) {
  const u=await getChatGPTUser();if(!u)return json({error:'Iniciá sesión para sincronizar.'},401);if(!env.DB||!env.BUCKET)return json({error:'Guardado en la nube no disponible.'},503);
  if(request.headers.get('origin') && request.headers.get('origin')!==new URL(request.url).origin)return json({error:'Origen no permitido.'},403);
  let e;try{const text=await request.text();if(text.length>15000)return json({error:'Registro demasiado grande.'},413);e=JSON.parse(text);}catch{return json({error:'Registro inválido.'},400)}
  if(!validProgress(e)||!validSpanId(e.spanId)||!/^[a-f0-9-]{36}$/i.test(e.id)||!Number.isSafeInteger(e.baseVersion)||e.baseVersion<0||e.baseVersion>100000||e.version!==e.baseVersion+1||typeof e.createdAt!=='string'||isNaN(Date.parse(e.createdAt)))return json({error:'Revisá los datos del registro.'},400);
  const existing=await env.DB.prepare('SELECT owner FROM lmt_events WHERE id = ?').bind(e.id).first<{owner:string}>();if(existing)return existing.owner===u.userId?json({ok:true}):json({error:'Identificador no disponible.'},409);
  for(const photo of e.photos)if(!await env.BUCKET.head(`${u.userId}/${photo}`))return json({error:'Falta cargar una fotografía.'},400);
  const payload={id:e.id,spanId:e.spanId,status:e.status,date:e.date,installed:e.installed,notes:e.notes,responsible:e.responsible,photos:e.photos,version:e.version,baseVersion:e.baseVersion,createdAt:e.createdAt};
  try {
    const r=await env.DB.prepare('INSERT INTO lmt_events (id,owner,span,version,payload,author,received_at) SELECT ?,?,?,?,?,?,? WHERE (SELECT COALESCE(MAX(version),0) FROM lmt_events WHERE owner=? AND span=?)=?').bind(e.id,u.userId,e.spanId,e.version,JSON.stringify(payload),u.displayName,new Date().toISOString(),u.userId,e.spanId,e.baseVersion).run();
    if(!r.meta.changes)return json({error:'Este vano cambió en otro equipo. Elegí qué versión conservar.'},409);
    return json({ok:true});
  }catch{return json({error:'No se pudo guardar. Tus datos siguen guardados en este equipo.'},503)}
}
