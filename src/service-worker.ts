import { app } from './app';

const cache_name = `v${ app.version }`;

self.addEventListener('install', event => {
  (event as ExtendableEvent).waitUntil(cacheAssets());
});

self.addEventListener('activate', event => {
  (event as ExtendableEvent).waitUntil(deleteOldCaches());
});

self.addEventListener('fetch', event => {
  (event as FetchEvent).respondWith(handleFetch((event as FetchEvent).request));
});

async function cacheAssets(): Promise<void> {
  const cache = await caches.open(cache_name);
  await cache.addAll(app.files);
}

async function deleteOldCaches(): Promise<void> {
  const cache_keys = await caches.keys();
  const old_cache_keys = cache_keys.filter((key) => key !== cache_name);

  await Promise.all(old_cache_keys.map(cache_key => caches.delete(cache_key)));
}

async function handleFetch(request: Request): Promise<Response> {
  const cache = await caches.open(cache_name);
  const cached_response = await cache.match(request);

  if (cached_response)
    return cached_response;

  return fetch(request);
}
