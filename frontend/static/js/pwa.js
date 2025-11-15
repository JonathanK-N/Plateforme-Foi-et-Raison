// PWA Installation et Service Worker
console.log('🚀 PWA Script chargé');

// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/static/sw.js')
            .then(registration => {
                console.log('✅ Service Worker enregistré:', registration.scope);
            })
            .catch(error => {
                console.log('❌ Erreur Service Worker:', error);
            });
    });
}

// Installation PWA
let deferredPrompt;
const installButton = document.createElement('button');

// Écouter l'événement beforeinstallprompt
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('💾 PWA installable détectée');
    e.preventDefault();
    deferredPrompt = e;
    showInstallButton();
});

// Créer et afficher le bouton d'installation
function showInstallButton() {
    installButton.innerHTML = '<i class="fas fa-download"></i> Installer l\'app';
    installButton.className = 'btn btn-outline-primary btn-sm position-fixed';
    installButton.style.cssText = `
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        border-radius: 25px;
        padding: 10px 20px;
        font-weight: 600;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        backdrop-filter: blur(10px);
        background: rgba(255,255,255,0.9);
        border: 2px solid var(--accent-gold);
        color: var(--accent-gold);
        transition: all 0.3s ease;
    `;
    
    installButton.addEventListener('click', installPWA);
    document.body.appendChild(installButton);
    
    // Animation d'apparition
    setTimeout(() => {
        installButton.style.transform = 'translateY(0)';
        installButton.style.opacity = '1';
    }, 100);
}

// Fonction d'installation
async function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('✅ PWA installée');
            hideInstallButton();
        } else {
            console.log('❌ Installation refusée');
        }
        
        deferredPrompt = null;
    }
}

// Masquer le bouton d'installation
function hideInstallButton() {
    if (installButton && installButton.parentNode) {
        installButton.style.transform = 'translateY(100px)';
        installButton.style.opacity = '0';
        setTimeout(() => {
            installButton.remove();
        }, 300);
    }
}

// Détecter si l'app est déjà installée
window.addEventListener('appinstalled', () => {
    console.log('✅ PWA installée avec succès');
    hideInstallButton();
    
    // Notification de succès
    showNotification('Application installée !', 'Vous pouvez maintenant utiliser Croire & Penser hors ligne.');
});

// Gestion du mode standalone (app installée)
if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('📱 Mode PWA standalone actif');
    document.body.classList.add('pwa-mode');
}

// Notifications push (si supportées)
if ('Notification' in window && 'serviceWorker' in navigator) {
    // Demander permission pour les notifications
    if (Notification.permission === 'default') {
        setTimeout(() => {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('✅ Notifications autorisées');
                }
            });
        }, 5000); // Attendre 5 secondes avant de demander
    }
}

// Fonction pour afficher des notifications
function showNotification(title, body, options = {}) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification(title, {
            body: body,
            icon: '/static/img/logo-croire-penser.png',
            badge: '/static/img/logo-croire-penser.png',
            vibrate: [200, 100, 200],
            ...options
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
        
        // Auto-fermer après 5 secondes
        setTimeout(() => {
            notification.close();
        }, 5000);
    }
}

// Gestion de la connectivité
window.addEventListener('online', () => {
    console.log('🌐 Connexion rétablie');
    showNotification('Connexion rétablie', 'Vous êtes de nouveau en ligne.');
    document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
    console.log('📴 Mode hors ligne');
    showNotification('Mode hors ligne', 'Vous pouvez continuer à naviguer grâce au cache.');
    document.body.classList.add('offline');
});

// Mise à jour de l'app
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Nouvelle version disponible');
        showUpdateNotification();
    });
}

// Notification de mise à jour
function showUpdateNotification() {
    const updateBanner = document.createElement('div');
    updateBanner.innerHTML = `
        <div style="background: var(--accent-gold); color: white; padding: 1rem; text-align: center; position: fixed; top: 0; left: 0; right: 0; z-index: 9999; box-shadow: 0 2px 10px rgba(0,0,0,0.2);">
            <span>🔄 Nouvelle version disponible !</span>
            <button onclick="window.location.reload()" style="background: white; color: var(--accent-gold); border: none; padding: 0.5rem 1rem; border-radius: 15px; margin-left: 1rem; font-weight: 600; cursor: pointer;">
                Actualiser
            </button>
            <button onclick="this.parentElement.parentElement.remove()" style="background: transparent; color: white; border: 1px solid white; padding: 0.5rem 1rem; border-radius: 15px; margin-left: 0.5rem; cursor: pointer;">
                Plus tard
            </button>
        </div>
    `;
    document.body.appendChild(updateBanner);
}

// Partage natif (si supporté)
function shareContent(title, text, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            text: text,
            url: url
        }).then(() => {
            console.log('✅ Contenu partagé');
        }).catch(err => {
            console.log('❌ Erreur partage:', err);
        });
    } else {
        // Fallback: copier dans le presse-papier
        navigator.clipboard.writeText(url).then(() => {
            showNotification('Lien copié !', 'Le lien a été copié dans votre presse-papier.');
        });
    }
}

// Ajouter les boutons de partage
document.addEventListener('DOMContentLoaded', () => {
    // Ajouter un bouton de partage sur chaque page
    const shareButton = document.createElement('button');
    shareButton.innerHTML = '<i class="fas fa-share-alt"></i>';
    shareButton.className = 'btn btn-outline-secondary btn-sm position-fixed';
    shareButton.style.cssText = `
        bottom: 80px;
        right: 20px;
        z-index: 1000;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        backdrop-filter: blur(10px);
        background: rgba(255,255,255,0.9);
    `;
    
    shareButton.addEventListener('click', () => {
        shareContent(
            document.title,
            'Découvrez cette plateforme spirituelle exceptionnelle !',
            window.location.href
        );
    });
    
    document.body.appendChild(shareButton);
});

// Styles PWA additionnels
const pwaStyles = document.createElement('style');
pwaStyles.textContent = `
    .pwa-mode .navbar {
        padding-top: env(safe-area-inset-top);
    }
    
    .offline {
        filter: grayscale(0.3);
    }
    
    .offline::before {
        content: '📴 Mode hors ligne';
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 15px;
        z-index: 1000;
        font-size: 0.8rem;
    }
    
    @media (display-mode: standalone) {
        .navbar {
            padding-top: env(safe-area-inset-top, 20px);
        }
        
        body {
            padding-bottom: env(safe-area-inset-bottom, 0);
        }
    }
`;
document.head.appendChild(pwaStyles);