// Progressive Web App (PWA) - Service Worker et fonctionnalités

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/static/sw.js')
            .then(function(registration) {
                console.log('Service Worker enregistré avec succès:', registration.scope);
            })
            .catch(function(error) {
                console.log('Échec de l\'enregistrement du Service Worker:', error);
            });
    });
}

// Gestion des notifications push
function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                console.log('Permission de notification accordée');
                showAlert('Notifications activées!', 'success');
            } else {
                console.log('Permission de notification refusée');
            }
        });
    }
}

// Envoi de notification
function sendNotification(title, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            icon: '/static/icons/icon-192x192.png',
            badge: '/static/icons/icon-72x72.png',
            ...options
        });
        
        notification.onclick = function() {
            window.focus();
            notification.close();
        };
        
        // Fermer automatiquement après 5 secondes
        setTimeout(() => notification.close(), 5000);
    }
}

// Détection de l'installation PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Empêcher l'affichage automatique
    e.preventDefault();
    deferredPrompt = e;
    
    // Afficher un bouton d'installation personnalisé
    showInstallButton();
});

function showInstallButton() {
    const installButton = document.createElement('button');
    installButton.className = 'btn btn-outline-primary position-fixed';
    installButton.style.cssText = 'bottom: 20px; left: 20px; z-index: 1000;';
    installButton.innerHTML = '📱 Installer l\'app';
    installButton.onclick = installApp;
    
    document.body.appendChild(installButton);
    
    // Masquer après 10 secondes si pas cliqué
    setTimeout(() => {
        if (installButton.parentNode) {
            installButton.remove();
        }
    }, 10000);
}

async function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            showAlert('Application installée avec succès!', 'success');
        }
        
        deferredPrompt = null;
        
        // Supprimer le bouton d'installation
        const installButton = document.querySelector('button[onclick="installApp()"]');
        if (installButton) {
            installButton.remove();
        }
    }
}

// Détection du mode hors ligne
window.addEventListener('online', function() {
    showAlert('Connexion rétablie', 'success');
    // Synchroniser les données en attente
    syncPendingData();
});

window.addEventListener('offline', function() {
    showAlert('Mode hors ligne activé', 'warning');
});

// Synchronisation des données hors ligne
function syncPendingData() {
    const pendingData = localStorage.getItem('pendingSync');
    
    if (pendingData) {
        try {
            const data = JSON.parse(pendingData);
            // Traiter les données en attente
            console.log('Synchronisation des données:', data);
            localStorage.removeItem('pendingSync');
        } catch (error) {
            console.error('Erreur lors de la synchronisation:', error);
        }
    }
}

// Mise en cache des contenus pour l'accès hors ligne
function cacheContent(contentId, contentData) {
    if ('caches' in window) {
        caches.open('foi-raison-content-v1').then(cache => {
            const request = new Request(`/api/contents/${contentId}`);
            const response = new Response(JSON.stringify(contentData), {
                headers: { 'Content-Type': 'application/json' }
            });
            cache.put(request, response);
        });
    }
}

// Récupération de contenu depuis le cache
async function getCachedContent(contentId) {
    if ('caches' in window) {
        const cache = await caches.open('foi-raison-content-v1');
        const response = await cache.match(`/api/contents/${contentId}`);
        
        if (response) {
            return await response.json();
        }
    }
    return null;
}

// Gestion des mises à jour de l'application
function checkForUpdates() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(registration => {
            registration.update();
        });
    }
}

// Vérifier les mises à jour toutes les heures
setInterval(checkForUpdates, 60 * 60 * 1000);

// Initialisation des fonctionnalités PWA
document.addEventListener('DOMContentLoaded', function() {
    // Demander la permission pour les notifications après 5 secondes
    setTimeout(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            const notifBanner = document.createElement('div');
            notifBanner.className = 'alert alert-info alert-dismissible fade show position-fixed';
            notifBanner.style.cssText = 'top: 80px; right: 20px; z-index: 1000; max-width: 300px;';
            notifBanner.innerHTML = `
                Activez les notifications pour recevoir les dernières actualités!
                <button type="button" class="btn btn-sm btn-outline-primary ms-2" onclick="requestNotificationPermission(); this.parentElement.remove();">
                    Activer
                </button>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            
            document.body.appendChild(notifBanner);
        }
    }, 5000);
});

// Partage natif (si supporté)
async function nativeShare(title, text, url) {
    if (navigator.share) {
        try {
            await navigator.share({
                title: title,
                text: text,
                url: url
            });
        } catch (error) {
            console.log('Erreur lors du partage:', error);
            // Fallback vers les boutons de partage classiques
            return false;
        }
        return true;
    }
    return false;
}

// Détection des capacités de l'appareil
function getDeviceCapabilities() {
    return {
        isOnline: navigator.onLine,
        hasNotifications: 'Notification' in window,
        hasServiceWorker: 'serviceWorker' in navigator,
        hasShare: 'share' in navigator,
        isStandalone: window.matchMedia('(display-mode: standalone)').matches,
        isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
}

// Optimisation pour les appareils mobiles
if (getDeviceCapabilities().isMobile) {
    // Désactiver le zoom sur les inputs
    document.addEventListener('DOMContentLoaded', function() {
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                const viewport = document.querySelector('meta[name="viewport"]');
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            });
            
            input.addEventListener('blur', function() {
                const viewport = document.querySelector('meta[name="viewport"]');
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
            });
        });
    });
}