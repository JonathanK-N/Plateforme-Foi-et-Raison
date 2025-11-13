// CMS Content Loader - Version simplifiée
console.log('CMS Loader chargé');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé, initialisation CMS Loader');
    loadCMSContent();
    
    // Vérifier les changements toutes les 3 secondes
    setInterval(function() {
        loadCMSContent();
    }, 3000);
});

let lastCheck = 0;

function loadCMSContent() {
    try {
        const contents = JSON.parse(localStorage.getItem('cms_contents') || '[]');
        const lastUpdate = localStorage.getItem('cms_last_update') || '0';
        
        // Vérifier s'il y a du nouveau contenu
        if (lastUpdate > lastCheck || lastCheck === 0) {
            console.log('Nouveaux contenus détectés:', contents.length);
            lastCheck = lastUpdate;
            
            if (contents.length > 0) {
                updateHomePage(contents);
                updateContentsPage(contents);
            }
        }
    } catch (error) {
        console.error('Erreur CMS Loader:', error);
    }
}

// Fonction globale pour forcer le rechargement
window.reloadCMSContent = function() {
    console.log('Rechargement forcé du contenu CMS');
    localStorage.setItem('cms_last_update', Date.now().toString());
    loadCMSContent();
};

function updateHomePage(contents) {
    // Vérifier si on est sur la page d'accueil
    if (!window.location.pathname.match(/^\/$|^\/home$/)) {
        return;
    }
    
    console.log('Mise à jour page d\'accueil avec', contents.length, 'contenus');
    
    const featuredContents = contents.filter(c => c.featured && c.published);
    const publishedContents = contents.filter(c => c.published);
    
    console.log('Contenus mis en avant:', featuredContents.length);
    
    // Créer ou mettre à jour la section CMS
    let cmsSection = document.getElementById('cms-dynamic-content');
    if (!cmsSection) {
        // Trouver où insérer la section
        const main = document.querySelector('main') || document.body;
        cmsSection = document.createElement('div');
        cmsSection.id = 'cms-dynamic-content';
        cmsSection.style.cssText = 'padding: 60px 0; background: #f8f9fa;';
        main.appendChild(cmsSection);
    }
    
    // Contenu de la section
    if (featuredContents.length > 0) {
        cmsSection.innerHTML = `
            <div class="container">
                <div class="text-center mb-5">
                    <h2 style="color: #1e3a8a; font-weight: bold;">📚 Contenus Récents du CMS</h2>
                    <p style="color: #6b7280;">Découvrez nos derniers contenus (${publishedContents.length} au total)</p>
                </div>
                <div class="row">
                    ${featuredContents.slice(0, 3).map(content => `
                        <div class="col-md-4 mb-4">
                            <div class="card h-100 shadow-sm">
                                ${content.banner ? `<img src="${content.banner}" class="card-img-top" style="height: 200px; object-fit: cover;">` : ''}
                                <div class="card-body">
                                    <h5 class="card-title">${content.title}</h5>
                                    <p class="card-text">${content.excerpt || content.body.substring(0, 100) + '...'}</p>
                                    <span class="badge bg-primary">${content.type}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        cmsSection.innerHTML = `
            <div class="container text-center">
                <h3>Aucun contenu mis en avant</h3>
                <p>Créez du contenu dans le CMS et cochez "Contenu mis en avant"</p>
            </div>
        `;
    }
}

function updateContentsPage(contents) {
    // Vérifier si on est sur la page contenus
    if (!window.location.pathname.includes('/contents') && !window.location.pathname.includes('/contenus')) {
        return;
    }
    
    console.log('Mise à jour page contenus');
    
    const publishedContents = contents.filter(c => c.published);
    
    // Créer ou mettre à jour la section
    let cmsSection = document.getElementById('cms-contents-section');
    if (!cmsSection) {
        const main = document.querySelector('main') || document.body;
        cmsSection = document.createElement('div');
        cmsSection.id = 'cms-contents-section';
        cmsSection.style.cssText = 'padding: 40px 0;';
        main.appendChild(cmsSection);
    }
    
    if (publishedContents.length > 0) {
        cmsSection.innerHTML = `
            <div class="container">
                <h2 class="mb-4">📚 Contenus du CMS (${publishedContents.length})</h2>
                <div class="row">
                    ${publishedContents.map(content => `
                        <div class="col-md-6 mb-4">
                            <div class="card">
                                ${content.banner ? `<img src="${content.banner}" class="card-img-top" style="height: 200px; object-fit: cover;">` : ''}
                                <div class="card-body">
                                    <h5 class="card-title">${content.title}</h5>
                                    <p class="card-text">${content.excerpt || content.body.substring(0, 150) + '...'}</p>
                                    <span class="badge bg-primary me-2">${content.type}</span>
                                    <small class="text-muted">${new Date(content.created_at).toLocaleDateString()}</small>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } else {
        cmsSection.innerHTML = `
            <div class="container text-center">
                <h3>Aucun contenu publié</h3>
                <p>Créez et publiez du contenu dans le CMS</p>
            </div>
        `;
    }
}

function updateContentFilters(contents) {
    // Créer les filtres par type
    const types = [...new Set(contents.map(c => c.type))];
    const categories = [...new Set(contents.map(c => c.category))];
    
    const filtersContainer = document.querySelector('.content-filters');
    if (filtersContainer) {
        filtersContainer.innerHTML = `
            <div class="filter-group">
                <label>Type:</label>
                <select id="type-filter" onchange="filterContents()">
                    <option value="">Tous</option>
                    ${types.map(type => `<option value="${type}">${type}</option>`).join('')}
                </select>
            </div>
            <div class="filter-group">
                <label>Catégorie:</label>
                <select id="category-filter" onchange="filterContents()">
                    <option value="">Toutes</option>
                    ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
                </select>
            </div>
        `;
    }
}

function filterContents() {
    const typeFilter = document.getElementById('type-filter')?.value;
    const categoryFilter = document.getElementById('category-filter')?.value;
    
    // Recharger les contenus avec les filtres
    loadCMSContent().then(() => {
        // Appliquer les filtres
        const contentItems = document.querySelectorAll('.content-item');
        contentItems.forEach(item => {
            let show = true;
            
            if (typeFilter && !item.innerHTML.includes(typeFilter)) {
                show = false;
            }
            
            if (categoryFilter && !item.innerHTML.includes(categoryFilter)) {
                show = false;
            }
            
            item.style.display = show ? 'block' : 'none';
        });
    });
}

function viewContent(contentId) {
    const contents = JSON.parse(localStorage.getItem('cms_contents') || '[]');
    const content = contents.find(c => c.id == contentId);
    
    if (content) {
        alert(`Titre: ${content.title}\nType: ${content.type}\nContenu: ${content.body.substring(0, 200)}...`);
    } else {
        alert('Contenu non trouvé');
    }
}

function showContentModal(content) {
    // Créer une modal pour afficher le contenu
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${content.title}</h5>
                    <button type="button" class="close" data-dismiss="modal">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    ${content.banner ? `<img src="${content.banner}" class="img-fluid mb-3" alt="${content.title}">` : ''}
                    <div class="content-body">
                        ${content.body}
                    </div>
                    ${content.tags && content.tags.length > 0 ? `
                    <div class="content-tags mt-3">
                        ${content.tags.map(tag => `<span class="badge badge-secondary">${tag}</span>`).join(' ')}
                    </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Fermer</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    $(modal).modal('show');
    
    // Supprimer la modal après fermeture
    $(modal).on('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

// Fonction pour recharger les contenus (appelée après modification dans le CMS)
window.reloadCMSContent = loadCMSContent;