/*
  service worker for mkisg.html
  Version: 0.0.2
*/

self.addEventListener('install', e => {
    e.waitUntil(
	caches.open('pwa-assets').then(cache => 
				       {
					   
					   return fetch('files-to-cache.json').then(response => {
					       return response.json();
					   } ).then( files => {
					       console.log(files);
					       return cache.addAll(files);
					   } )
				       }).then( () => {
					   console.log("CACHED !!!");
				       })
    );

});

self.addEventListener('fetch', e => {
    e.respondWith(
	caches.match(e.request).then(response => {
	    return response || fetch(e.request);
	})
    );
});
