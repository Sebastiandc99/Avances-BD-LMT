const BASE=new URL('./',self.location.href).pathname;
const PREFIX='lmt-pages:'+BASE+':';
const CACHE=PREFIX+'v2';
const CORE=[BASE,BASE+'assets/inventory.json',BASE+'assets/fondo-esquematico.svg',BASE+'manifest.webmanifest'];
const belongs=u=>u.origin===self.location.origin&&u.pathname.startsWith(BASE);
const asset=u=>belongs(u)&&(/\.(?:js|css|woff2|svg|png)$/.test(u.pathname)||u.pathname.startsWith(BASE+'assets/'));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||!belongs(url)||url.pathname.startsWith(BASE+'api/'))return;
  if(request.mode==='navigate'){
    event.respondWith(fetch(request).then(async response=>{if(response.ok&&!response.redirected){const cache=await caches.open(CACHE);await cache.put(BASE,response.clone());}return response;}).catch(async()=>await caches.match(BASE)||new Response('Conectate una vez para preparar el modo sin conexión.',{status:503})));
  }else if(asset(url)){
    event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);await cache.put(request,response.clone());}return response;})));
  }
});
self.addEventListener('message',event=>{
  if(event.data?.type!=='CACHE_URLS'||!Array.isArray(event.data.urls))return;
  event.waitUntil((async()=>{try{
    const urls=event.data.urls.filter(value=>{try{return asset(new URL(value))}catch{return false}});
    const cache=await caches.open(CACHE);await cache.addAll([...new Set(urls)]);
    event.source?.postMessage({type:'LMT_OFFLINE_READY'});
  }catch{event.source?.postMessage({type:'LMT_OFFLINE_FAILED'});}})());
});
