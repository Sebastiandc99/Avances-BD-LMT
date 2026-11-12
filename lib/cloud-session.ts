type AuthResult<S>={data:{session:S|null};error:{message:string;code?:string}|null};
export interface AutomaticAuth<S>{getSession():Promise<AuthResult<S>>;signInAnonymously():Promise<AuthResult<S>>;}
/** One private identity per browser. Lost access must never silently create another account. */
export function automaticSession<S>(auth:AutomaticAuth<S>,hadAccess:()=>boolean){
 let running:Promise<S>|null=null;
 return ()=>{
  if(running)return running;
  running=(async()=>{
   const current=await auth.getSession();if(current.error)throw Error(current.error.message);
   if(current.data.session)return current.data.session;
   if(hadAccess())throw Error('Este navegador tenía una copia en Supabase, pero falta su sesión. Recuperá el acceso con tu correo; no se creó otra cuenta ni se borraron registros.');
   const created=await auth.signInAnonymously();
   if(created.error){
    if(created.error.code==='anonymous_provider_disabled')throw Error('El guardado automático está preparado, pero falta habilitar los accesos anónimos en la configuración de Supabase. Los registros siguen en este equipo.');
    throw Error(created.error.message);
   }
   if(!created.data.session)throw Error('Supabase no confirmó la sesión privada. Los registros siguen en este equipo.');
   return created.data.session;
  })().finally(()=>{running=null;});
  return running;
 };
}
