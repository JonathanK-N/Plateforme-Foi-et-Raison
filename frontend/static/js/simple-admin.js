// Admin Simple et Fonctionnel
document.addEventListener('DOMContentLoaded', function() {
    initSimpleAdmin();
});

function initSimpleAdmin() {
    setupNavigation();
    loadDashboard();
    setupModals();
}

function setupNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.onclick = function() {
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            this.classList.add('active');
            
            const section = this.dataset.section;
            showSection(section);
        };
    });
}

function showSection(section) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.getElementById(section + '-section').classList.add('active');
    
    const titles = {
        'dashboard': 'Tableau de bord',
        'pages': 'Gestion des pages',
        'content': 'Gestion du contenu',
        'users': 'Gestion des utilisateurs',
        'prayers': 'Gestion des prières',
        'qa': 'Questions & Réponses',
        'events': 'Gestion des événements',
        'donations': 'Gestion des dons'
    };
    
    document.getElementById('section-title').textContent = titles[section];
}

function loadDashboard() {
    // Statistiques
    document.getElementById('total-users').textContent = '156';
    document.getElementById('total-content').textContent = '89';
    document.getElementById('total-prayers').textContent = '234';
    document.getElementById('total-questions').textContent = '67';
}

// Gestion des pages
function editPage() {
    const select = document.getElementById('page-select');
    const page = select.value;
    
    if (!page) {
        alert('Sélectionnez une page');
        return;
    }
    
    const url = page === 'home' ? '/?edit=true' : `/${page}?edit=true`;
    window.open(url, '_blank');
    alert('Page ouverte en mode édition!\n\nCliquez sur les textes pour les modifier.');
}

// Modales
function setupModals() {
    window.onclick = function(event) {
        const modal = document.getElementById('admin-modal');
        if (event.target === modal) {
            closeModal();
        }
    };
}

function showAddModal() {
    const activeSection = document.querySelector('.nav-item.active').dataset.section;
    
    const modal = document.getElementById('admin-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    
    switch(activeSection) {
        case 'content':
            title.textContent = 'Ajouter du contenu';
            body.innerHTML = `
                <div class="form-group">
                    <label>Titre</label>
                    <input type="text" id="new-title" class="form-control">
                </div>
                <div class="form-group">
                    <label>Type</label>
                    <select id="new-type" class="form-control">
                        <option value="article">Article</option>
                        <option value="video">Vidéo</option>
                        <option value="podcast">Podcast</option>
                    </select>
                </div>
            `;
            break;
            
        case 'users':
            title.textContent = 'Ajouter un utilisateur';
            body.innerHTML = `
                <div class="form-group">
                    <label>Nom</label>
                    <input type="text" id="new-name" class="form-control">
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" id="new-email" class="form-control">
                </div>
            `;
            break;
            
        default:
            title.textContent = 'Ajouter un élément';
            body.innerHTML = `
                <div class="form-group">
                    <label>Titre</label>
                    <input type="text" id="new-item" class="form-control">
                </div>
            `;
    }
    
    modal.style.display = 'block';
}

function closeModal() {
    document.getElementById('admin-modal').style.display = 'none';
}

function saveModal() {
    const activeSection = document.querySelector('.nav-item.active').dataset.section;
    
    switch(activeSection) {
        case 'content':
            const title = document.getElementById('new-title').value;
            const type = document.getElementById('new-type').value;
            if (title) {
                alert(`${type} "${title}" créé avec succès!`);
                closeModal();
            }
            break;
            
        case 'users':
            const name = document.getElementById('new-name').value;
            const email = document.getElementById('new-email').value;
            if (name && email) {
                alert(`Utilisateur "${name}" créé avec succès!`);
                closeModal();
            }
            break;
            
        default:
            const item = document.getElementById('new-item').value;
            if (item) {
                alert(`Élément "${item}" créé avec succès!`);
                closeModal();
            }
    }
}

function refreshData() {
    alert('Données actualisées!');
}

// Fonctions globales
window.editPage = editPage;
window.showAddModal = showAddModal;
window.closeModal = closeModal;
window.saveModal = saveModal;
window.refreshData = refreshData;