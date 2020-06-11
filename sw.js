var version = 'v1::';

self.addEventListener('install', function(event) {
  console.log('install event in progress');
  event.waitUntil(
    caches
      .open(version + 'cache')
      .then(function(cache) {
        return cache.addAll([]);
      })
      .then(function() {
        console.log('worker install completed');
      })
  );
});

self.addEventListener('fetch', function(event) {
  return; // use network always for now
});
