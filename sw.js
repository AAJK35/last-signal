const CACHE='the-last-signal-v9-patch18';
const CORE=['./','./index.html','./game.js','./levels.js','./style.css','./three.module.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
// Network-first so updated game files are never hidden behind an old cache; cache is only the offline fallback.
// Audio uses Range requests (206), which cannot be cached, so it always goes straight to the network.
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET'||req.headers.has('range')||req.url.endsWith('.wav'))return;
  event.respondWith(fetch(req).then(res=>{
    if(res&&res.status===200){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{});}
    return res;
  }).catch(()=>caches.match(req)));
});
