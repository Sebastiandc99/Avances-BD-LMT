const CACHE='lmt-v1.0.0';
const CORE=['/','/assets/inventory.json','/assets/traza.webp','/icon.svg','/manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('lmt-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const r=event.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/')||u.pathname.startsWith('/signin')||u.pathname.startsWith('/signout')||u.pathname==='/callback')return;
 if(r.mode==='navigate'){event.respondWith(fetch(r).then(async response=>{if(response.ok&&!response.redirected&&new URL(response.url).origin===u.origin){const cache=await caches.open(CACHE);cache.put('/',response.clone());}return response;}).catch(()=>caches.match('/').then(cached=>cached||new Response('Conectate una vez para preparar el modo sin conexión.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}}))));return;}
 if(u.pathname.startsWith('/assets/')||/\.(?:js|css|woff2|svg|png)$/.test(u.pathname)){event.respondWith(caches.match(r).then(cached=>cached||fetch(r).then(async response=>{if(response.ok){const cache=await caches.open(CACHE);cache.put(r,response.clone());}return response;})));}
});

self.addEventListener('message',event=>{if(event.data?.type!=='CACHE_URLS'||!Array.isArray(event.data.urls))return;event.waitUntil((async()=>{try{const urls=event.data.urls.filter(value=>{try{const u=new URL(value);return u.origin===self.location.origin&&!u.pathname.startsWith('/api/')&&/\.(?:js|css|woff2|svg|png)$/.test(u.pathname)}catch{return false}});const cache=await caches.open(CACHE);await cache.addAll([...new Set(urls)]);event.source?.postMessage({type:'LMT_OFFLINE_READY'});}catch{event.source?.postMessage({type:'LMT_OFFLINE_FAILED'});}})());});
