// Keeps the practice app working without internet after the first visit.
const CACHE = "crime-practice-v2";
const FILES = [
  "./",
  "01_vandalism_orange_car_clearer.jpg",
  "02_drunk_driving_driver_bottle_clearer.jpg",
  "atkinson-400.woff2",
  "atkinson-700.woff2",
  "icon-192.png",
  "icon-512.png",
  "index.html",
  "manifest.webmanifest",
  "naskh-400.woff2",
  "naskh-700.woff2",
  "study-book.pdf"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(hit => hit || fetch(e.request).then(res => {
    const copy = res.clone();
    if (res.ok && new URL(e.request.url).origin === location.origin) caches.open(CACHE).then(c => c.put(e.request, copy));
    return res;
  })));
});
