import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '../../chatgpt-auth';
export async function POST(request:Request) {
  const u=await getChatGPTUser();if(!u)return Response.json({error:'Sesión requerida.'},{status:401});if(!env.BUCKET)return Response.json({error:'Fotos no disponibles.'},{status:503});
  if(request.headers.get('origin')&&request.headers.get('origin')!==new URL(request.url).origin)return new Response(null,{status:403});
  const id=request.headers.get('x-photo-id')||'';const type=request.headers.get('content-type')||'';
  if(!/^[a-f0-9-]{36}$/i.test(id)||!['image/jpeg','image/png','image/webp'].includes(type))return Response.json({error:'Foto inválida.'},{status:400});
  const data=await request.arrayBuffer();if(data.byteLength>8*1024*1024)return Response.json({error:'La foto supera 8 MB.'},{status:413});
  const b=new Uint8Array(data);const valid=type==='image/jpeg'?b[0]===255&&b[1]===216:type==='image/png'?b[0]===137&&b[1]===80&&b[2]===78&&b[3]===71:b[0]===82&&b[1]===73&&b[2]===70&&b[3]===70&&b[8]===87&&b[9]===69&&b[10]===66&&b[11]===80;
  if(!valid)return Response.json({error:'El archivo no es una imagen válida.'},{status:400});
  if(await env.BUCKET.head(`${u.userId}/${id}`))return Response.json({ok:true});
  await env.BUCKET.put(`${u.userId}/${id}`,data,{httpMetadata:{contentType:type}});return Response.json({ok:true});
}
