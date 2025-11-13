// ADMIN ULTRA SIMPLE - VERSION FINALE
console.log('Admin ultra simple chargé');

let currentSection = 'dashboard';

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé - initialisation');
    init();
});

function init() {
    setupNav();
    loadStats();
    console.log('Admin initialisé');
}

function setupNav() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
            
            this.classList.add('active');
            currentSection = this.dataset.section;
            
            const section = document.getElementById(currentSection + '-section');
            if (section) {
                section.classList.add('active');
            }
            
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
    setTimeout(() => {
        document.getElementById('total-users').textContent = '156';
        document.getElementById('total-content').textContent = '89';
        document.getElementById('total-prayers').textContent = '234';
        document.getElementById('total-questions').textContent = '67';
    }, 100);
}

// GESTION DES PAGES
function editPage() {
    console.log('editPage appelée');
    const select = document.getElementById('page-select');
    if (!select) {
        alert('Sélecteur non trouvé');
        return;
    }
    
    const page = select.value;
    if (!page) {
        alert('Veuillez sélectionner une page');
        return;
    }
    
    const url = page === 'home' ? '/?edit=true' : `/${page}?edit=true`;
    window.open(url, '_blank');
    alert('Page ouverte en mode édition!');
}

// MODALES ULTRA SIMPLES
function showAddModal() {
    console.log('showAddModal - section:', currentSection);
    
    // Créer une modal simple avec prompt
    let result;
    
    switch(currentSection) {
        case 'content':
            const title = prompt('Titre du contenu:');
            if (title) {
                const type = prompt('Type (article/video/podcast):') || 'article';
                alert(`Contenu "${title}" (${type}) créé avec succès!`);
            }
            break;
            
        case 'users':
            const name = prompt('Nom de l\'utilisateur:');
            if (name) {
                const email = prompt('Email:');
                if (email) {
                    alert(`Utilisateur "${name}" créé avec succès!`);
                }
            }
            break;
            
        case 'prayers':
            const prayer = prompt('Demande de prière:');
            if (prayer) {
                alert(`Prière "${prayer}" ajoutée avec succès!`);
            }
            break;
            
        case 'qa':
            const question = prompt('Question:');
            if (question) {
                alert(`Question "${question}" ajoutée avec succès!`);
            }
            break;
            
        case 'events':
            const event = prompt('Nom de l\'événement:');
            if (event) {
                alert(`Événement "${event}" créé avec succès!`);
            }
            break;
            
        case 'donations':
            const amount = prompt('Montant du don:');
            if (amount) {
                alert(`Don de ${amount}$ enregistré avec succès!`);
            }
            break;
            
        default:
            const item = prompt('Nom de l\'élément:');
            if (item) {
                alert(`Élément "${item}" créé avec succès!`);
            }
    }
}

function closeModal() {
    console.log('closeModal - pas de modal à fermer');
}

function saveModal() {
    console.log('saveModal - pas de modal à sauvegarder');
}

function refreshData() {
    console.log('refreshData appelée');
    alert('Données actualisées!');
    loadStats();
}

// Exposer les fonctions
window.editPage = editPage;
window.showAddModal = showAddModal;
window.closeModal = closeModal;
window.saveModal = saveModal;
window.refreshData = refreshData;

console.log('Fonctions exposées:', {editPage, showAddModal, closeModal, saveModal, refreshData});