const CACHE_NAME = 'croire-penser-v1';
const urlsToCache = [
  '/',
  '/static/css/typography.css',
  '/static/css/brand-colors.css',
  '/static/css/style.css',
  '/static/css/animations.css',
  '/static/css/home.css',
  '/static/js/app.js',
  '/static/js/home.js',
  '/static/img/logo-croire-penser.png',
  '/contents',
  '/prayers',
  '/qa',
  '/about',
  '/contact',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;600;700&family=Source+Sans+Pro:wght@300;400;600;700&display=swap'
];

// Installation du Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache ouvert');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interception des requêtes
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne la réponse du cache si disponible
        if (response) {
          return response;
        }
        
        // Sinon, fait la requête réseau
        return fetch(event.request).then(response => {
          // Vérifie si la réponse est valide
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone la réponse
          const responseToCache = response.clone();
          
          // Ajoute au cache
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        });
      })
      .catch(() => {
        // Page offline de fallback
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Notifications push (optionnel)
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nouveau contenu disponible',
    icon: '/static/img/logo-croire-penser.png',
    badge: '/static/img/logo-croire-penser.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Découvrir',
        icon: '/static/img/logo-croire-penser.png'
      },
      {
        action: 'close',
        title: 'Fermer',
        icon: '/static/img/logo-croire-penser.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Croire & Penser', options)
  );
});