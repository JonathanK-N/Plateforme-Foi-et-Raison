// Synchronisation CMS vers pages
console.log('🔄 CMS Sync chargé');

// Charger les contenus du CMS et les appliquer aux pages
function loadCMSContent() {
    fetch('/api/cms/contents')
        .then(response => response.json())
        .then(contents => {
            console.log('📦 Contenus CMS chargés:', contents.length);
            applyCMSContent(contents);
        })
        .catch(err => console.error('❌ Erreur chargement CMS:', err));
}

function applyCMSContent(contents) {
    contents.forEach(content => {
        if (content.published) {
            // Appliquer selon le type de contenu
            switch(content.type) {
                case 'article':
                    updateArticleContent(content);
                    break;
                case 'video':
                    updateVideoContent(content);
                    break;
                case 'podcast':
                    updatePodcastContent(content);
                    break;
            }
        }
    });
}

function updateArticleContent(content) {
    // Mettre à jour les sections d'articles sur la page d'accueil
    const articleSection = document.querySelector('.resource-card');
    if (articleSection && content.title) {
        const titleElement = articleSection.querySelector('h3');
        if (titleElement) {
            titleElement.textContent = content.title;
            console.log('✅ Article mis à jour:', content.title);
        }
    }
}

function updateVideoContent(content) {
    // Mettre à jour les sections vidéo
    const videoCards = document.querySelectorAll('.resource-card');
    videoCards.forEach((card, index) => {
        if (index === 1 && content.title) { // Deuxième carte = vidéo
            const titleElement = card.querySelector('h3');
            if (titleElement) {
                titleElement.textContent = content.title;
                console.log('✅ Vidéo mise à jour:', content.title);
            }
        }
    });
}

function updatePodcastContent(content) {
    // Mettre à jour les sections podcast
    const podcastCards = document.querySelectorAll('.resource-card');
    podcastCards.forEach((card, index) => {
        if (index === 2 && content.title) { // Troisième carte = podcast
            const titleElement = card.querySelector('h3');
            if (titleElement) {
                titleElement.textContent = content.title;
                console.log('✅ Podcast mis à jour:', content.title);
            }
        }
    });
}

// Charger au démarrage
document.addEventListener('DOMContentLoaded', loadCMSContent);

// Recharger toutes les 30 secondes
setInterval(loadCMSContent, 30000);