'use client';
import { useEffect, useRef, useState } from 'react';
import type { Event } from '../lib/model';
import { GitHubBackupError, githubRecords, restoreGitHubBackups, saveGitHubBackup, verifyGitHubRepo } from '../lib/github-backup';

export function useGitHubBackup({owner,events,ready,online,onRestore}:{owner:string;events:Event[];ready:boolean;online:boolean;onRestore:(incoming:Event[])=>Promise<void>}){
 const tokenKey='lmt-github-token:'+owner,deviceKey='lmt-github-device:'+owner;
 const [token,setToken]=useState(()=>{try{return localStorage.getItem(tokenKey)||'';}catch{return '';}});
 const [busy,setBusy]=useState(false),[blocked,setBlocked]=useState(false),[error,setError]=useState(''),[last,setLast]=useState(''),[verified,setVerified]=useState(''),[tick,setTick]=useState(0),[message,setMessage]=useState('');
 const lock=useRef(false),retryAt=useRef(0),failures=useRef(0),live=useRef({events,onRestore,token});live.current={events,onRestore,token};
 const signature=githubRecords(events),pending=!!token&&signature!==verified;
 function failed(e:unknown){
  const reason=e instanceof Error?e.message:'No se pudo guardar en GitHub. Los datos siguen en este equipo.';
  setError(reason);failures.current++;retryAt.current=Date.now()+Math.min(300000,5000*2**failures.current);
  if((e instanceof GitHubBackupError&&[400,401,403,404].includes(e.status))||failures.current>=5)setBlocked(true);
 }
 async function save(manual=false){
  if(lock.current||!ready||!navigator.onLine||!live.current.token)return;
  if(!manual&&(blocked||Date.now()<retryAt.current))return;
  lock.current=true;setBusy(true);setError('');setMessage('');
  try{
   const current=live.current.events.slice(),sent=githubRecords(current);let device=localStorage.getItem(deviceKey);
   if(!device){device=crypto.randomUUID();localStorage.setItem(deviceKey,device);}
   const result=await saveGitHubBackup(live.current.token,current,device);
   setVerified(sent);setLast(result.at);setBlocked(false);failures.current=0;retryAt.current=0;
  }catch(e){failed(e);}finally{lock.current=false;setBusy(false);}
 }
 async function connect(value:string,remember:boolean){
  if(lock.current)return;
  const next=value.trim();
  if(!/^github_pat_[A-Za-z0-9_]{20,}$/.test(next)){setError('Usá un token granular de GitHub (github_pat_…) limitado al repositorio de datos.');return false;}
  if(!navigator.onLine){setError('Conectate para comprobar la autorización.');return false;}
  lock.current=true;setBusy(true);setError('');
  try{
   await verifyGitHubRepo(next);
   if(remember)localStorage.setItem(tokenKey,next);else localStorage.removeItem(tokenKey);
   live.current.token=next;setToken(next);setVerified('');setLast('');setBlocked(false);failures.current=0;retryAt.current=0;
   return true;
  }catch(e){failed(e);return false;}finally{lock.current=false;setBusy(false);}
 }
 function disconnect(){if(lock.current)return;localStorage.removeItem(tokenKey);live.current.token='';setToken('');setVerified('');setLast('');setError('');setMessage('Conexión retirada de este navegador. Los respaldos de GitHub se conservan.');setBlocked(false);}
 async function restore(){
  if(lock.current||!live.current.token||!navigator.onLine)return;
  lock.current=true;setBusy(true);setError('');setMessage('');
  try{const incoming=await restoreGitHubBackups(live.current.token);await live.current.onRestore(incoming);setMessage('Registros de GitHub incorporados. Los registros locales existentes se conservaron.');setBlocked(false);failures.current=0;retryAt.current=0;}catch(e){failed(e);}finally{lock.current=false;setBusy(false);}
 }
 useEffect(()=>{
  const resume=()=>{if(document.visibilityState==='visible'){retryAt.current=0;setTick(n=>n+1);}};
  const timer=setInterval(()=>setTick(n=>n+1),45000);
  window.addEventListener('focus',resume);document.addEventListener('visibilitychange',resume);
  return()=>{clearInterval(timer);window.removeEventListener('focus',resume);document.removeEventListener('visibilitychange',resume);};
 },[]);
 useEffect(()=>{
  if(!ready||!online||!token||busy||blocked||!pending)return;
  const timer=setTimeout(()=>void save(),Math.max(2500,retryAt.current-Date.now()));
  return()=>clearTimeout(timer);
 },[ready,online,token,signature,busy,blocked,pending,tick]);
 const title=!token?'Respaldo en GitHub pendiente de conectar':!online?'GitHub sin conexión · copia pendiente de comprobar':busy?'Comprobando respaldo privado en GitHub':error?'GitHub: respaldo sin confirmar':pending?'Cambios pendientes de guardar en GitHub':last?'Respaldo de registros comprobado en GitHub':'GitHub todavía sin comprobar';
 return {connected:!!token,busy,blocked,error,message,last,pending,title,verified:!!token&&online&&!busy&&!error&&!pending&&!!last,connect,disconnect,save:()=>save(true),restore};
}
