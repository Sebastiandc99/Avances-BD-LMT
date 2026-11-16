/* BUILD_CONFIG */
const scope = self.registration.scope;
const prefix = 'lmt-pages:' + new URL(scope).pathname + ':';
const cacheName = prefix + BUILD.version;
const files = BUILD.files.map(url => new Request(new URL(url, scope), {cache: 'reload'}));
const assetUrls = new Set(files.map(request => request.url));

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const shell = await fetch(scope, {cache: 'reload', headers: {Accept: 'text/html'}});
    const html = await shell.clone().text();
    if (!shell.ok || shell.redirected || !BUILD.entryAssets.every(file => html.includes(new URL(file, scope).pathname))) {
      throw new Error('La página y los recursos corresponden a versiones diferentes.');
    }
    const cache = await caches.open(cacheName);
    await cache.addAll(files);
    // Pages can return the HTML shell with status 200 for a missing static file.
    for (const file of files) {
      const saved = await cache.match(file, {ignoreVary: true});
      if (!saved || saved.headers.get('Content-Type')?.includes('text/html')) {
        throw new Error('No se pudo guardar el recurso ' + file.url);
      }
    }
    await cache.put(scope, shell);
    // An open tab can keep using its own complete version until it closes.
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    // Keep one previous shell while a document from that version finishes loading.
    const previous = keys.filter(key => key.startsWith(prefix) && key !== cacheName).pop();
    await Promise.all(keys.filter(key => key.startsWith(prefix) && key !== cacheName && key !== previous).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const isApp = request.mode === 'navigate' && url.origin === self.location.origin &&
    (url.pathname === new URL(scope).pathname || url.pathname === new URL('index.html', scope).pathname);
  const compiledAsset = url.origin === self.location.origin && url.pathname.startsWith(new URL('assets/', scope).pathname) && /\.(?:js|css)$/.test(url.pathname);
  // Recovery verifies the deployed files directly before replacing the local shell.
  if (url.searchParams.has('recuperar')) return;
  if (!isApp && !assetUrls.has(url.href) && !compiledAsset) return;
  event.respondWith((async () => {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(isApp ? scope : request, {ignoreVary: true});
    if (cached) return cached;
    if (compiledAsset) {
      const previous = (await caches.keys()).filter(key => key.startsWith(prefix) && key !== cacheName);
      for (const key of previous) {
        const saved = await (await caches.open(key)).match(request, {ignoreVary: true});
        if (saved && !saved.headers.get('Content-Type')?.includes('text/html')) return saved;
      }
    }
    return fetch(request);
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type === 'CACHE_URLS') {
    // Only an installed, active worker receives this request from the dashboard.
    event.source?.postMessage({type: 'LMT_OFFLINE_READY'});
  }
});
