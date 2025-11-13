// Admin Dashboard JavaScript - Simplifié et Fonctionnel
document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    setupNavigation();
    loadDashboardStats();
    setupEventListeners();
    
    // Auto-login for demo
    localStorage.setItem('admin_token', 'demo-token');
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            const sectionId = this.dataset.section;
            showSection(sectionId);
        });
    });
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionId + '-section');
    if (targetSection) {
        targetSection.classList.add('active');
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
        'settings': 'Paramètres système'
    };
    
    const sectionTitle = document.getElementById('section-title');
    if (sectionTitle && titles[sectionId]) {
        sectionTitle.textContent = titles[sectionId];
    }
    
    loadSectionData(sectionId);
}

function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            loadDashboardStats();
            loadRecentActivity();
            break;
        case 'content':
            loadContentList();
            break;
        case 'users':
            loadUsersList();
            break;
        default:
            break;
    }
}

function loadDashboardStats() {
    updateStatCard('total-users', 156);
    updateStatCard('total-content', 89);
    updateStatCard('total-prayers', 234);
    updateStatCard('total-questions', 67);
}

function updateStatCard(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        animateNumber(element, 0, value, 2000);
    }
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const current = Math.floor(start + (end - start) * progress);
        element.textContent = current.toLocaleString();
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function loadRecentActivity() {
    const activityList = document.getElementById('recent-activity');
    if (!activityList) return;
    
    const activities = [
        { icon: 'fas fa-user-plus', title: 'Nouvel utilisateur inscrit', time: 'Il y a 5 minutes' },
        { icon: 'fas fa-newspaper', title: 'Article publié: "La foi et la science"', time: 'Il y a 1 heure' },
        { icon: 'fas fa-praying-hands', title: 'Nouvelle demande de prière', time: 'Il y a 2 heures' },
        { icon: 'fas fa-question-circle', title: 'Question soumise pour modération', time: 'Il y a 3 heures' },
        { icon: 'fas fa-heart', title: 'Don reçu: 50$', time: 'Il y a 4 heures' }
    ];
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <div class="activity-title">${activity.title}</div>
                <div class="activity-time">${activity.time}</div>
            </div>
        </div>
    `).join('');
}

function loadContentList() {
    const contentList = document.getElementById('content-list');
    if (!contentList) return;
    
    const demoContent = [
        { id: 1, title: 'La foi et la raison', type: 'article', status: 'published', created_at: new Date().toISOString() },
        { id: 2, title: 'Comprendre la Trinité', type: 'video', status: 'draft', created_at: new Date().toISOString() },
        { id: 3, title: 'Podcast - Questions de foi', type: 'podcast', status: 'published', created_at: new Date().toISOString() }
    ];
    
    contentList.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Titre</th>
                    <th>Type</th>
                    <th>Statut</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${demoContent.map(content => `
                    <tr>
                        <td>${content.title}</td>
                        <td><span class="status-badge ${content.type}">${content.type}</span></td>
                        <td><span class="status-badge ${content.status}">${content.status}</span></td>
                        <td>${new Date(content.created_at).toLocaleDateString()}</td>
                        <td>
                            <button class="action-btn edit" onclick="editContent(${content.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="deleteContent(${content.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function loadUsersList() {
    const usersList = document.getElementById('users-list');
    if (!usersList) return;
    
    const users = [
        { id: 1, name: 'Jean Dupont', email: 'jean@example.com', role: 'user', status: 'active' },
        { id: 2, name: 'Marie Martin', email: 'marie@example.com', role: 'user', status: 'active' },
        { id: 3, name: 'Admin Système', email: 'admin@foietraison.ca', role: 'admin', status: 'active' }
    ];
    
    usersList.innerHTML = `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôle</th>
                    <th>Statut</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                ${users.map(user => `
                    <tr>
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                        <td><span class="status-badge ${user.role}">${user.role}</span></td>
                        <td><span class="status-badge ${user.status}">${user.status}</span></td>
                        <td>
                            <button class="action-btn edit" onclick="editUser(${user.id})">
                                <i class="fas fa-edit"></i>
                            </button>
                            ${user.role !== 'admin' ? `
                                <button class="action-btn delete" onclick="deleteUser(${user.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            ` : ''}
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function setupEventListeners() {
    // Page selector
    const pageSelect = document.getElementById('page-select');
    const editBtn = document.getElementById('edit-page-btn');
    const previewBtn = document.getElementById('preview-page-btn');
    
    if (pageSelect && editBtn && previewBtn) {
        pageSelect.addEventListener('change', function() {
            if (this.value) {
                editBtn.disabled = false;
                previewBtn.disabled = false;
            } else {
                editBtn.disabled = true;
                previewBtn.disabled = true;
            }
        });
        
        // Activer immédiatement si une valeur est sélectionnée
        if (pageSelect.value) {
            editBtn.disabled = false;
            previewBtn.disabled = false;
        }
    }
    
    // Content guide tabs
    const guideTabs = document.querySelectorAll('.guide-tab');
    const guideInfos = document.querySelectorAll('.guide-info');
    
    guideTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const type = this.dataset.type;
            
            guideTabs.forEach(t => t.classList.remove('active'));
            guideInfos.forEach(info => info.classList.remove('active'));
            
            this.classList.add('active');
            const targetInfo = document.getElementById(type + '-guide');
            if (targetInfo) {
                targetInfo.classList.add('active');
            }
        });
    });
}

// Page Editor Functions
function editPage() {
    const select = document.getElementById('page-select');
    const page = select.value;
    
    if (!page) {
        alert('Sélectionnez une page d\'abord');
        return;
    }
    
    const url = page === 'home' ? '/?edit=true' : `/${page}?edit=true`;
    window.open(url, '_blank');
}

function loadPageEditor() {
    editPage();
}

function getPageDisplayName(pageValue) {
    const pageNames = {
        'home': 'Accueil',
        'about': 'À propos',
        'contents': 'Contenus',
        'qa': 'Questions & Réponses',
        'prayers': 'Prières',
        'contact': 'Contact',
        'events': 'Événements',
        'partnerships': 'Partenariats',
        'donation': 'Dons'
    };
    return pageNames[pageValue] || pageValue;
}

function savePage() {
    showNotification('Page sauvegardée avec succès !', 'success');
}

function cancelEdit() {
    document.getElementById('page-editor').style.display = 'none';
    document.getElementById('page-select').value = '';
    document.getElementById('edit-page-btn').disabled = true;
    document.getElementById('preview-page-btn').disabled = true;
    showNotification('Édition annulée', 'info');
}

function previewPage() {
    const selectedPage = document.getElementById('page-select').value;
    if (selectedPage) {
        window.open(`/${selectedPage}`, '_blank');
    }
}

// Tutorial Functions
function showFullTutorial() {
    const steps = [
        {
            title: '🏠 Gestion des Pages',
            content: `Étape 1: Modifier les pages

1. Sélectionnez une page dans la liste déroulante
2. Cliquez sur "Modifier cette page"
3. La page s'ouvre en mode édition
4. Cliquez directement sur les textes pour les modifier
5. Cliquez sur les images pour les changer
6. Sauvegardez vos modifications

Astuce: Tous les éléments modifiables sont surlignés au survol !`
        },
        {
            title: '📝 Gestion du Contenu',
            content: `Étape 2: Créer du contenu

• Articles: Rédigez avec texte riche et références bibliques
• Vidéos: Ajoutez des liens YouTube/Vimeo
• Podcasts: Téléchargez vos fichiers audio

Processus simple:
1. Cliquez "Créer un contenu"
2. Choisissez le type
3. Remplissez le formulaire
4. Publiez ou sauvegardez en brouillon`
        },
        {
            title: '✨ Conseils Pratiques',
            content: `Étape 3: Bonnes pratiques

• Sauvegardez régulièrement (Ctrl+S)
• Prévisualisez avant publication
• Optimisez vos images (max 2MB)
• Pensez à votre audience
• Utilisez des titres clairs et engageants
• Ajoutez des références bibliques pertinentes

Vous êtes maintenant prêt à gérer votre plateforme !`
        }
    ];
    
    let currentStep = 0;
    
    function showStep() {
        if (currentStep < steps.length) {
            const step = steps[currentStep];
            const continueReading = confirm(`${step.title}\n\n${step.content}\n\nContinuer le tutoriel ?`);
            
            if (continueReading) {
                currentStep++;
                showStep();
            }
        } else {
            showNotification('Tutoriel terminé ! Vous êtes prêt à gérer votre plateforme.', 'success');
        }
    }
    
    showStep();
}

// Content Management Functions
function showCreateContentModal() {
    showContentModal();
}

function showContentModal() {
    const modal = document.getElementById('admin-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = 'Créer un nouveau contenu';
    
    modalBody.innerHTML = `
        <form id="content-form">
            <div class="form-group mb-3">
                <label>Type de contenu</label>
                <select class="form-control" id="content-type" required>
                    <option value="">Sélectionner un type</option>
                    <option value="article">Article</option>
                    <option value="video">Vidéo</option>
                    <option value="podcast">Podcast</option>
                </select>
            </div>
            <div class="form-group mb-3">
                <label>Titre</label>
                <input type="text" class="form-control" id="content-title" required>
            </div>
            <div class="form-group mb-3">
                <label>Description</label>
                <textarea class="form-control" id="content-description" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="content-published"> Publier immédiatement
                </label>
            </div>
        </form>
    `;
    
    // Mettre à jour le bouton de sauvegarde
    const saveBtn = document.getElementById('modal-save-btn');
    saveBtn.onclick = saveNewContent;
    
    modal.classList.add('show');
}

async function saveNewContent() {
    const form = document.getElementById('content-form');
    const type = document.getElementById('content-type').value;
    const title = document.getElementById('content-title').value;
    const description = document.getElementById('content-description').value;
    const published = document.getElementById('content-published').checked;
    
    if (!type || !title) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    try {
        // Simuler la création
        const newContent = {
            id: Date.now(),
            title: title,
            type: type,
            description: description,
            status: published ? 'published' : 'draft',
            created_at: new Date().toISOString()
        };
        
        // Ajouter à la liste (simulation)
        addContentToList(newContent);
        
        closeAdminModal();
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} "${title}" créé(e) avec succès !`);
        
    } catch (error) {
        alert('Erreur lors de la création: ' + error.message);
    }
}

function addContentToList(content) {
    const contentList = document.getElementById('content-list');
    if (!contentList) return;
    
    const table = contentList.querySelector('table tbody');
    if (table) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${content.title}</td>
            <td><span class="status-badge ${content.type}">${content.type}</span></td>
            <td><span class="status-badge ${content.status}">${content.status}</span></td>
            <td>${new Date(content.created_at).toLocaleDateString()}</td>
            <td>
                <button class="action-btn edit" onclick="editContent(${content.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" onclick="deleteContent(${content.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        table.appendChild(row);
    }
}

// Modal Functions
function showAddModal() {
    const activeSection = document.querySelector('.nav-item.active').dataset.section;
    
    switch(activeSection) {
        case 'content':
            showContentModal();
            break;
        case 'users':
            showUserModal();
            break;
        case 'prayers':
            showPrayerModal();
            break;
        case 'qa':
            showQuestionModal();
            break;
        case 'events':
            showEventModal();
            break;
        case 'donations':
            showDonationModal();
            break;
        default:
            alert('Fonction d\'ajout non disponible pour cette section');
    }
}

function showUserModal() {
    const modal = document.getElementById('admin-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = 'Ajouter un utilisateur';
    modalBody.innerHTML = `
        <form id="user-form">
            <div class="form-group mb-3">
                <label>Nom complet</label>
                <input type="text" class="form-control" id="user-name" required>
            </div>
            <div class="form-group mb-3">
                <label>Email</label>
                <input type="email" class="form-control" id="user-email" required>
            </div>
            <div class="form-group mb-3">
                <label>Rôle</label>
                <select class="form-control" id="user-role" required>
                    <option value="user">Utilisateur</option>
                    <option value="admin">Administrateur</option>
                </select>
            </div>
        </form>
    `;
    
    document.getElementById('modal-save-btn').onclick = saveNewUser;
    modal.classList.add('show');
}

function showPrayerModal() {
    const modal = document.getElementById('admin-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = 'Ajouter une demande de prière';
    modalBody.innerHTML = `
        <form id="prayer-form">
            <div class="form-group mb-3">
                <label>Titre</label>
                <input type="text" class="form-control" id="prayer-title" required>
            </div>
            <div class="form-group mb-3">
                <label>Demande</label>
                <textarea class="form-control" id="prayer-content" rows="4" required></textarea>
            </div>
            <div class="form-group mb-3">
                <label>Priorité</label>
                <select class="form-control" id="prayer-priority">
                    <option value="normal">Normale</option>
                    <option value="urgent">Urgente</option>
                </select>
            </div>
        </form>
    `;
    
    document.getElementById('modal-save-btn').onclick = saveNewPrayer;
    modal.classList.add('show');
}

function showQuestionModal() {
    const modal = document.getElementById('admin-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = 'Ajouter une question';
    modalBody.innerHTML = `
        <form id="question-form">
            <div class="form-group mb-3">
                <label>Question</label>
                <input type="text" class="form-control" id="question-title" required>
            </div>
            <div class="form-group mb-3">
                <label>Détails</label>
                <textarea class="form-control" id="question-content" rows="4"></textarea>
            </div>
            <div class="form-group mb-3">
                <label>Réponse</label>
                <textarea class="form-control" id="question-answer" rows="4"></textarea>
            </div>
        </form>
    `;
    
    document.getElementById('modal-save-btn').onclick = saveNewQuestion;
    modal.classList.add('show');
}

function showEventModal() {
    const modal = document.getElementById('admin-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = 'Ajouter un événement';
    modalBody.innerHTML = `
        <form id="event-form">
            <div class="form-group mb-3">
                <label>Titre de l'événement</label>
                <input type="text" class="form-control" id="event-title" required>
            </div>
            <div class="form-group mb-3">
                <label>Date</label>
                <input type="datetime-local" class="form-control" id="event-date" required>
            </div>
            <div class="form-group mb-3">
                <label>Lieu</label>
                <input type="text" class="form-control" id="event-location">
            </div>
            <div class="form-group mb-3">
                <label>Description</label>
                <textarea class="form-control" id="event-description" rows="3"></textarea>
            </div>
        </form>
    `;
    
    document.getElementById('modal-save-btn').onclick = saveNewEvent;
    modal.classList.add('show');
}

function showDonationModal() {
    const modal = document.getElementById('admin-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    
    modalTitle.textContent = 'Enregistrer un don';
    modalBody.innerHTML = `
        <form id="donation-form">
            <div class="form-group mb-3">
                <label>Montant</label>
                <input type="number" class="form-control" id="donation-amount" step="0.01" required>
            </div>
            <div class="form-group mb-3">
                <label>Donateur (optionnel)</label>
                <input type="text" class="form-control" id="donation-donor">
            </div>
            <div class="form-group mb-3">
                <label>Méthode de paiement</label>
                <select class="form-control" id="donation-method">
                    <option value="paypal">PayPal</option>
                    <option value="stripe">Stripe</option>
                    <option value="interac">Interac</option>
                    <option value="cash">Espèces</option>
                </select>
            </div>
        </form>
    `;
    
    document.getElementById('modal-save-btn').onclick = saveNewDonation;
    modal.classList.add('show');
}

// Fonctions de sauvegarde
function saveNewUser() {
    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const role = document.getElementById('user-role').value;
    
    if (!name || !email) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    closeAdminModal();
    alert(`Utilisateur "${name}" ajouté avec succès !`);
    loadUsersList();
}

function saveNewPrayer() {
    const title = document.getElementById('prayer-title').value;
    const content = document.getElementById('prayer-content').value;
    
    if (!title || !content) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    closeAdminModal();
    alert(`Demande de prière "${title}" ajoutée avec succès !`);
}

function saveNewQuestion() {
    const title = document.getElementById('question-title').value;
    
    if (!title) {
        alert('Veuillez saisir une question');
        return;
    }
    
    closeAdminModal();
    alert(`Question "${title}" ajoutée avec succès !`);
}

function saveNewEvent() {
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    
    if (!title || !date) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    
    closeAdminModal();
    alert(`Événement "${title}" ajouté avec succès !`);
}

function saveNewDonation() {
    const amount = document.getElementById('donation-amount').value;
    
    if (!amount) {
        alert('Veuillez saisir un montant');
        return;
    }
    
    closeAdminModal();
    alert(`Don de ${amount}$ enregistré avec succès !`);
}

function closeAdminModal() {
    document.getElementById('admin-modal').classList.remove('show');
}

function refreshData() {
    const activeSection = document.querySelector('.nav-item.active').dataset.section;
    loadSectionData(activeSection);
    
    const refreshBtn = event.target;
    const originalHTML = refreshBtn.innerHTML;
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualisation...';
    refreshBtn.disabled = true;
    
    setTimeout(() => {
        refreshBtn.innerHTML = originalHTML;
        refreshBtn.disabled = false;
        showNotification('Données actualisées', 'success');
    }, 1500);
}

// CRUD Operations
function editContent(id) {
    showNotification('Fonction d\'édition en développement', 'info');
}

function deleteContent(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contenu ?')) {
        showNotification('Contenu supprimé avec succès', 'success');
        loadContentList();
    }
}

function editUser(id) {
    showNotification('Fonction d\'édition utilisateur en développement', 'info');
}

function deleteUser(id) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
        showNotification('Utilisateur supprimé avec succès', 'success');
        loadUsersList();
    }
}

// Notification System
function showNotification(message, type = 'info') {
    alert(message);
}

// Mobile sidebar toggle
function toggleMobileSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    sidebar.classList.toggle('mobile-open');
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (document.getElementById('page-editor').style.display !== 'none') {
            savePage();
        }
    }
    
    if (e.key === 'Escape') {
        if (document.getElementById('admin-modal').classList.contains('show')) {
            closeAdminModal();
        }
    }
});