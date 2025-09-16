// Service Worker pour Foi & Raison PWA

const CACHE_NAME = 'foi-raison-v1';
const STATIC_CACHE = 'foi-raison-static-v1';
const DYNAMIC_CACHE = 'foi-raison-dynamic-v1';

// Fichiers à mettre en cache lors de l'installation
const STATIC_FILES = [
    '/',
    '/static/css/style.css',
    '/static/js/app.js',
    '/static/js/auth.js',
    '/static/js/content.js',
    '/static/js/pwa.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
];

// Installation du Service Worker
self.addEventListener('install', event => {
    console.log('Service Worker: Installation');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Service Worker: Mise en cache des fichiers statiques');
                return cache.addAll(STATIC_FILES);
            })
            .catch(error => {
                console.error('Erreur lors de la mise en cache:', error);
            })
    );
    
    // Forcer l'activation immédiate
    self.skipWaiting();
});

// Activation du Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker: Activation');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    // Supprimer les anciens caches
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    // Prendre le contrôle immédiatement
    self.clients.claim();
});

// Interception des requêtes
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Stratégie Cache First pour les fichiers statiques
    if (STATIC_FILES.includes(request.url) || request.url.includes('bootstrap')) {
        event.respondWith(cacheFirst(request));
    }
    // Stratégie Network First pour les API
    else if (url.pathname.startsWith('/api/')) {
        event.respondWith(networkFirst(request));
    }
    // Stratégie Stale While Revalidate pour les autres ressources
    else {
        event.respondWith(staleWhileRevalidate(request));
    }
});

// Stratégie Cache First
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        // Mettre en cache si la réponse est valide
        if (networkResponse.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Cache First failed:', error);
        return new Response('Contenu non disponible hors ligne', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Stratégie Network First
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Mettre en cache les réponses API réussies
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        // Réponse par défaut pour les API hors ligne
        if (request.url.includes('/api/contents')) {
            return new Response(JSON.stringify([]), {
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        return new Response('Service non disponible', {
            status: 503,
            statusText: 'Service Unavailable'
        });
    }
}

// Stratégie Stale While Revalidate
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then(networkResponse => {
        if (networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => cachedResponse);
    
    return cachedResponse || fetchPromise;
}

// Gestion des notifications push
self.addEventListener('push', event => {
    console.log('Push message reçu');
    
    let data = {};
    if (event.data) {
        data = event.data.json();
    }
    
    const options = {
        body: data.body || 'Nouveau contenu disponible sur Foi & Raison',
        icon: '/static/icons/icon-192x192.png',
        badge: '/static/icons/icon-72x72.png',
        tag: 'foi-raison-notification',
        data: data.url || '/',
        actions: [
            {
                action: 'open',
                title: 'Ouvrir',
                icon: '/static/icons/icon-72x72.png'
            },
            {
                action: 'close',
                title: 'Fermer'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title || 'Foi & Raison', options)
    );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', event => {
    console.log('Notification cliquée');
    
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow(event.notification.data || '/')
        );
    }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', event => {
    console.log('Background sync:', event.tag);
    
    if (event.tag === 'sync-questions') {
        event.waitUntil(syncQuestions());
    } else if (event.tag === 'sync-comments') {
        event.waitUntil(syncComments());
    }
});

// Synchronisation des questions en attente
async function syncQuestions() {
    try {
        const pendingQuestions = await getFromIndexedDB('pendingQuestions');
        
        for (const question of pendingQuestions) {
            try {
                const response = await fetch('/api/questions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${question.token}`
                    },
                    body: JSON.stringify({
                        title: question.title,
                        content: question.content
                    })
                });
                
                if (response.ok) {
                    await removeFromIndexedDB('pendingQuestions', question.id);
                }
            } catch (error) {
                console.error('Erreur lors de la synchronisation de la question:', error);
            }
        }
    } catch (error) {
        console.error('Erreur lors de la synchronisation des questions:', error);
    }
}

// Synchronisation des commentaires en attente
async function syncComments() {
    try {
        const pendingComments = await getFromIndexedDB('pendingComments');
        
        for (const comment of pendingComments) {
            try {
                const response = await fetch(`/api/contents/${comment.contentId}/comments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${comment.token}`
                    },
                    body: JSON.stringify({
                        content: comment.content
                    })
                });
                
                if (response.ok) {
                    await removeFromIndexedDB('pendingComments', comment.id);
                }
            } catch (error) {
                console.error('Erreur lors de la synchronisation du commentaire:', error);
            }
        }
    } catch (error) {
        console.error('Erreur lors de la synchronisation des commentaires:', error);
    }
}

// Utilitaires IndexedDB (simulation)
async function getFromIndexedDB(storeName) {
    // Simulation - en production, utiliser IndexedDB
    return [];
}

async function removeFromIndexedDB(storeName, id) {
    // Simulation - en production, utiliser IndexedDB
    return true;
}

// Nettoyage périodique du cache
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'CLEAN_CACHE') {
        cleanOldCache();
    }
});

async function cleanOldCache() {
    const cache = await caches.open(DYNAMIC_CACHE);
    const requests = await cache.keys();
    
    // Supprimer les entrées de cache plus anciennes que 7 jours
    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    for (const request of requests) {
        const response = await cache.match(request);
        const dateHeader = response.headers.get('date');
        
        if (dateHeader) {
            const responseDate = new Date(dateHeader).getTime();
            if (responseDate < oneWeekAgo) {
                await cache.delete(request);
            }
        }
    }
}