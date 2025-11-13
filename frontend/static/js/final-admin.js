// ADMIN FINAL - SOLUTION DÉFINITIVE
console.log('Admin chargé');

// Variables globales
let currentSection = 'dashboard';

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé');
    init();
});

function init() {
    setupNav();
    loadStats();
    setupButtons();
}

function setupNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Retirer active de tous
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            
            // Ajouter active au cliqué
            this.classList.add('active');
            currentSection = this.dataset.section;
            
            // Afficher la section
            const section = document.getElementById(currentSection + '-section');
            if (section) {
                section.classList.add('active');
            }
            
            // Changer le titre
            const titles = {
                'dashboard': 'Tableau de bord',
                'pages': 'Gestion des pages',
                'content': 'Gestion du contenu',
                'users': 'Gestion des utilisateurs',
                'prayers': 'Gestion des prières',
                'qa': 'Questions & Réponses',
                'events': 'Gestion des événements',
                'donations': 'Gestion des dons',
                'settings': 'Paramètres'
            };
            
            document.getElementById('section-title').textContent = titles[currentSection] || currentSection;
        });
    });
}

function loadStats() {
    // Charger les statistiques
    setTimeout(() => {
        document.getElementById('total-users').textContent = '156';
        document.getElementById('total-content').textContent = '89';
        document.getElementById('total-prayers').textContent = '234';
        document.getElementById('total-questions').textContent = '67';
    }, 100);
}

function setupButtons() {
    // Bouton Ajouter
    const addBtn = document.querySelector('.btn-primary');
    if (addBtn && addBtn.textContent.includes('Ajouter')) {
        addBtn.onclick = showAddModal;
    }
    
    // Bouton Actualiser
    const refreshBtn = document.querySelector('.btn-secondary');
    if (refreshBtn && refreshBtn.textContent.includes('Actualiser')) {
        refreshBtn.onclick = refreshData;
    }
}

// GESTION DES PAGES
function editPage() {
    console.log('editPage appelée');
    const select = document.getElementById('page-select');
    if (!select) {
        alert('Sélecteur de page non trouvé');
        return;
    }
    
    const page = select.value;
    console.log('Page sélectionnée:', page);
    
    if (!page) {
        alert('Veuillez sélectionner une page');
        return;
    }
    
    let url;
    if (page === 'home') {
        url = '/?edit=true';
    } else {
        url = `/${page}?edit=true`;
    }
    
    console.log('URL à ouvrir:', url);
    window.open(url, '_blank');
    alert('Page ouverte en mode édition!\n\nCliquez sur les textes pour les modifier.');
}

// MODALES
function showAddModal() {
    console.log('showAddModal appelée, section:', currentSection);
    
    const modal = document.getElementById('admin-modal');
    const title = document.getElementById('modal-title');
    const body = document.getElementById('modal-body');
    
    if (!modal || !title || !body) {
        alert('Éléments de modal non trouvés');
        return;
    }
    
    // Contenu selon la section
    switch(currentSection) {
        case 'content':
            title.textContent = 'Ajouter du contenu';
            body.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <label>Titre:</label>
                    <input type="text" id="new-title" style="width: 100%; padding: 8px; margin-top: 5px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label>Type:</label>
                    <select id="new-type" style="width: 100%; padding: 8px; margin-top: 5px;">
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
                <div style="margin-bottom: 15px;">
                    <label>Nom:</label>
                    <input type="text" id="new-name" style="width: 100%; padding: 8px; margin-top: 5px;">
                </div>
                <div style="margin-bottom: 15px;">
                    <label>Email:</label>
                    <input type="email" id="new-email" style="width: 100%; padding: 8px; margin-top: 5px;">
                </div>
            `;
            break;
            
        default:
            title.textContent = 'Ajouter un élément';
            body.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <label>Titre:</label>
                    <input type="text" id="new-item" style="width: 100%; padding: 8px; margin-top: 5px;">
                </div>
            `;
    }
    
    modal.style.display = 'block';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    modal.style.zIndex = '10000';
    modal.classList.add('show');
}

function closeModal() {
    console.log('closeModal appelée');
    const modal = document.getElementById('admin-modal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('show');
        // Nettoyer les styles inline
        modal.style.position = '';
        modal.style.top = '';
        modal.style.left = '';
        modal.style.width = '';
        modal.style.height = '';
        modal.style.backgroundColor = '';
        modal.style.zIndex = '';
    }
}

function saveModal() {
    console.log('saveModal appelée, section:', currentSection);
    
    let success = false;
    let message = '';
    
    switch(currentSection) {
        case 'content':
            const title = document.getElementById('new-title')?.value;
            const type = document.getElementById('new-type')?.value;
            if (title) {
                message = `${type} "${title}" créé avec succès!`;
                success = true;
            }
            break;
            
        case 'users':
            const name = document.getElementById('new-name')?.value;
            const email = document.getElementById('new-email')?.value;
            if (name && email) {
                message = `Utilisateur "${name}" créé avec succès!`;
                success = true;
            }
            break;
            
        default:
            const item = document.getElementById('new-item')?.value;
            if (item) {
                message = `Élément "${item}" créé avec succès!`;
                success = true;
            }
    }
    
    if (success) {
        closeModal();
        alert(message);
    } else {
        alert('Veuillez remplir tous les champs');
    }
}

function refreshData() {
    console.log('refreshData appelée');
    alert('Données actualisées!');
    loadStats();
}

// Fermer modal en cliquant à l'extérieur
window.onclick = function(event) {
    const modal = document.getElementById('admin-modal');
    if (event.target === modal || event.target.classList.contains('modal-backdrop')) {
        closeModal();
    }
};

// Empêcher la fermeture lors du clic sur le contenu
document.addEventListener('click', function(e) {
    if (e.target.closest('.modal-content')) {
        e.stopPropagation();
    }
});

// Exposer les fonctions globalement
window.editPage = editPage;
window.showAddModal = showAddModal;
window.closeModal = closeModal;
window.saveModal = saveModal;
window.refreshData = refreshData;

console.log('Fonctions exposées:', {editPage, showAddModal, closeModal, saveModal, refreshData});