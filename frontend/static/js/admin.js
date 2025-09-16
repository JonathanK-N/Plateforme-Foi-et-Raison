// Interface d'administration

function showAdmin() {
    if (!currentUser || currentUser.role !== 'admin') {
        showAlert('Accès refusé', 'danger');
        return;
    }
    
    hideAllPages();
    
    let adminPage = document.getElementById('adminPage');
    if (!adminPage) {
        adminPage = document.createElement('div');
        adminPage.id = 'adminPage';
        adminPage.className = 'd-none';
        
        adminPage.innerHTML = `
            <div class="container-fluid py-4">
                <div class="row">
                    <!-- Sidebar Admin -->
                    <div class="col-md-3">
                        <div class="admin-sidebar bg-white shadow rounded p-3">
                            <h5 class="text-primary mb-3"><i class="fas fa-cog me-2"></i>Administration</h5>
                            <ul class="nav nav-pills flex-column">
                                <li class="nav-item mb-2">
                                    <a class="nav-link active" href="#" onclick="showAdminSection('dashboard')">
                                        <i class="fas fa-chart-bar me-2"></i>Tableau de bord
                                    </a>
                                </li>
                                <li class="nav-item mb-2">
                                    <a class="nav-link" href="#" onclick="showAdminSection('users')">
                                        <i class="fas fa-users me-2"></i>Utilisateurs
                                    </a>
                                </li>
                                <li class="nav-item mb-2">
                                    <a class="nav-link" href="#" onclick="showAdminSection('contents')">
                                        <i class="fas fa-play-circle me-2"></i>Contenus
                                    </a>
                                </li>
                                <li class="nav-item mb-2">
                                    <a class="nav-link" href="#" onclick="showAdminSection('questions')">
                                        <i class="fas fa-question-circle me-2"></i>Questions
                                    </a>
                                </li>
                                <li class="nav-item mb-2">
                                    <a class="nav-link" href="#" onclick="showAdminSection('prayers')">
                                        <i class="fas fa-praying-hands me-2"></i>Prières
                                    </a>
                                </li>
                                <li class="nav-item mb-2">
                                    <a class="nav-link" href="#" onclick="showAdminSection('settings')">
                                        <i class="fas fa-cog me-2"></i>Paramètres
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    
                    <!-- Contenu Admin -->
                    <div class="col-md-9">
                        <div id="adminContent" class="bg-white shadow rounded p-4">
                            <!-- Contenu généré dynamiquement -->
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.container-fluid').appendChild(adminPage);
    }
    
    adminPage.classList.remove('d-none');
    showAdminSection('dashboard');
}

function showAdminSection(section) {
    // Mettre à jour la navigation
    document.querySelectorAll('.admin-sidebar .nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    const content = document.getElementById('adminContent');
    
    switch(section) {
        case 'dashboard':
            showAdminDashboard(content);
            break;
        case 'users':
            showAdminUsers(content);
            break;
        case 'contents':
            showAdminContents(content);
            break;
        case 'questions':
            showAdminQuestions(content);
            break;
        case 'prayers':
            showAdminPrayers(content);
            break;
        case 'settings':
            showAdminSettings(content);
            break;
    }
}

function showAdminDashboard(content) {
    content.innerHTML = `
        <h3 class="mb-4"><i class="fas fa-chart-bar me-2"></i>Tableau de bord</h3>
        
        <!-- Statistiques -->
        <div class="row mb-4">
            <div class="col-md-3">
                <div class="card text-center border-primary">
                    <div class="card-body">
                        <i class="fas fa-users text-primary fs-1"></i>
                        <h4 class="mt-2" id="totalUsers">-</h4>
                        <p class="text-muted">Utilisateurs</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center border-success">
                    <div class="card-body">
                        <i class="fas fa-play-circle text-success fs-1"></i>
                        <h4 class="mt-2" id="totalContents">-</h4>
                        <p class="text-muted">Contenus</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center border-warning">
                    <div class="card-body">
                        <i class="fas fa-question-circle text-warning fs-1"></i>
                        <h4 class="mt-2" id="totalQuestions">-</h4>
                        <p class="text-muted">Questions</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="card text-center border-info">
                    <div class="card-body">
                        <i class="fas fa-praying-hands text-info fs-1"></i>
                        <h4 class="mt-2" id="totalPrayers">-</h4>
                        <p class="text-muted">Demandes prière</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Actions rapides -->
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-plus me-2"></i>Actions rapides</h5>
                    </div>
                    <div class="card-body">
                        <button class="btn btn-primary me-2 mb-2" onclick="showContentForm()">
                            <i class="fas fa-plus me-1"></i>Nouveau contenu
                        </button>
                        <button class="btn btn-success me-2 mb-2" onclick="showAdminSection('users')">
                            <i class="fas fa-users me-1"></i>Gérer utilisateurs
                        </button>
                        <button class="btn btn-warning me-2 mb-2" onclick="showAdminSection('questions')">
                            <i class="fas fa-check me-1"></i>Modérer questions
                        </button>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5><i class="fas fa-clock me-2"></i>Activité récente</h5>
                    </div>
                    <div class="card-body" id="recentActivity">
                        <div class="text-center">
                            <div class="spinner-border text-primary" role="status"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    loadAdminStats();
}

function showAdminUsers(content) {
    content.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3><i class="fas fa-users me-2"></i>Gestion des utilisateurs</h3>
            <div>
                <input type="text" class="form-control d-inline-block w-auto me-2" placeholder="Rechercher..." id="userSearch">
                <button class="btn btn-primary" onclick="exportUsers()">
                    <i class="fas fa-download me-1"></i>Exporter
                </button>
            </div>
        </div>
        
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom complet</th>
                        <th>Email</th>
                        <th>Téléphone</th>
                        <th>Sexe</th>
                        <th>Naissance</th>
                        <th>Jésus</th>
                        <th>Baptisé</th>
                        <th>Inscription</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="usersTable">
                    <tr><td colspan="10" class="text-center">Chargement...</td></tr>
                </tbody>
            </table>
        </div>
    `;
    
    loadUsers();
}

function showAdminContents(content) {
    content.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3><i class="fas fa-play-circle me-2"></i>Gestion des contenus</h3>
            <button class="btn btn-primary" onclick="showContentForm()">
                <i class="fas fa-plus me-1"></i>Nouveau contenu
            </button>
        </div>
        
        <div class="row mb-3">
            <div class="col-md-4">
                <select class="form-select" id="contentTypeFilter">
                    <option value="">Tous les types</option>
                    <option value="video">Vidéos</option>
                    <option value="podcast">Podcasts</option>
                    <option value="article">Articles</option>
                </select>
            </div>
        </div>
        
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titre</th>
                        <th>Type</th>
                        <th>Vues</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="contentsTable">
                    <tr><td colspan="6" class="text-center">Chargement...</td></tr>
                </tbody>
            </table>
        </div>
    `;
    
    loadAdminContents();
}

function showAdminQuestions(content) {
    content.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3><i class="fas fa-question-circle me-2"></i>Modération des questions</h3>
            <div>
                <select class="form-select d-inline-block w-auto" id="questionStatusFilter">
                    <option value="">Tous les statuts</option>
                    <option value="pending">En attente</option>
                    <option value="approved">Approuvées</option>
                    <option value="rejected">Rejetées</option>
                </select>
            </div>
        </div>
        
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Titre</th>
                        <th>Auteur</th>
                        <th>Statut</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="questionsTable">
                    <tr><td colspan="6" class="text-center">Chargement...</td></tr>
                </tbody>
            </table>
        </div>
    `;
    
    loadAdminQuestions();
}

function showAdminPrayers(content) {
    content.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h3><i class="fas fa-praying-hands me-2"></i>Demandes de prière</h3>
        </div>
        
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Sujet</th>
                        <th>Demandeur</th>
                        <th>Anonyme</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="prayersTable">
                    <tr><td colspan="6" class="text-center">Chargement...</td></tr>
                </tbody>
            </table>
        </div>
    `;
    
    loadAdminPrayers();
}

function showAdminSettings(content) {
    content.innerHTML = `
        <h3 class="mb-4"><i class="fas fa-cog me-2"></i>Paramètres du système</h3>
        
        <div class="row">
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5>Paramètres généraux</h5>
                    </div>
                    <div class="card-body">
                        <form id="generalSettings">
                            <div class="mb-3">
                                <label class="form-label">Nom du site</label>
                                <input type="text" class="form-control" value="Foi & Raison">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Email administrateur</label>
                                <input type="email" class="form-control" value="admin@foi-raison.com">
                            </div>
                            <div class="mb-3">
                                <div class="form-check">
                                    <input class="form-check-input" type="checkbox" id="allowRegistration" checked>
                                    <label class="form-check-label" for="allowRegistration">
                                        Autoriser les inscriptions
                                    </label>
                                </div>
                            </div>
                            <button type="submit" class="btn btn-primary">Sauvegarder</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="card">
                    <div class="card-header">
                        <h5>Actions système</h5>
                    </div>
                    <div class="card-body">
                        <button class="btn btn-warning mb-2 w-100" onclick="backupDatabase()">
                            <i class="fas fa-download me-2"></i>Sauvegarder la base de données
                        </button>
                        <button class="btn btn-info mb-2 w-100" onclick="clearCache()">
                            <i class="fas fa-trash me-2"></i>Vider le cache
                        </button>
                        <button class="btn btn-success mb-2 w-100" onclick="sendNewsletter()">
                            <i class="fas fa-envelope me-2"></i>Envoyer newsletter
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Fonctions de chargement des données
async function loadAdminStats() {
    try {
        // Simulation des statistiques
        document.getElementById('totalUsers').textContent = '156';
        document.getElementById('totalContents').textContent = '42';
        document.getElementById('totalQuestions').textContent = '28';
        document.getElementById('totalPrayers').textContent = '73';
    } catch (error) {
        console.error('Erreur chargement stats:', error);
    }
}

async function loadUsers() {
    const tbody = document.getElementById('usersTable');
    tbody.innerHTML = `
        <tr>
            <td>1</td>
            <td>Jean Dupont</td>
            <td>jean@email.com</td>
            <td>+33123456789</td>
            <td>M</td>
            <td>15/03/1985</td>
            <td><span class="badge bg-success">Oui</span></td>
            <td><span class="badge bg-primary">2010</span></td>
            <td>01/01/2024</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewUser(1)">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-warning" onclick="editUser(1)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(1)">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

async function loadAdminContents() {
    const tbody = document.getElementById('contentsTable');
    tbody.innerHTML = `
        <tr>
            <td>1</td>
            <td>Enseignement sur la foi</td>
            <td><span class="badge bg-primary">Vidéo</span></td>
            <td>245</td>
            <td>15/01/2024</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editContent(1)">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteContent(1)">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

async function loadAdminQuestions() {
    const tbody = document.getElementById('questionsTable');
    tbody.innerHTML = `
        <tr>
            <td>1</td>
            <td>Comment prier efficacement ?</td>
            <td>Marie Martin</td>
            <td><span class="badge bg-warning">En attente</span></td>
            <td>20/01/2024</td>
            <td>
                <button class="btn btn-sm btn-success" onclick="approveQuestion(1)">
                    <i class="fas fa-check"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="rejectQuestion(1)">
                    <i class="fas fa-times"></i>
                </button>
            </td>
        </tr>
    `;
}

async function loadAdminPrayers() {
    const tbody = document.getElementById('prayersTable');
    tbody.innerHTML = `
        <tr>
            <td>1</td>
            <td>Guérison pour ma famille</td>
            <td>Pierre Durand</td>
            <td><span class="badge bg-secondary">Non</span></td>
            <td>22/01/2024</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewPrayer(1)">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>
    `;
}

// Fonctions d'actions
function showContentForm() {
    showAlert('Formulaire de contenu à implémenter', 'info');
}

function viewUser(id) {
    showAlert(`Voir utilisateur ${id}`, 'info');
}

function editUser(id) {
    showAlert(`Éditer utilisateur ${id}`, 'info');
}

function deleteUser(id) {
    if (confirm('Supprimer cet utilisateur ?')) {
        showAlert(`Utilisateur ${id} supprimé`, 'success');
    }
}

function editContent(id) {
    showAlert(`Éditer contenu ${id}`, 'info');
}

function deleteContent(id) {
    if (confirm('Supprimer ce contenu ?')) {
        showAlert(`Contenu ${id} supprimé`, 'success');
    }
}

function approveQuestion(id) {
    showAlert(`Question ${id} approuvée`, 'success');
}

function rejectQuestion(id) {
    showAlert(`Question ${id} rejetée`, 'warning');
}

function viewPrayer(id) {
    showAlert(`Voir demande de prière ${id}`, 'info');
}

function exportUsers() {
    showAlert('Export des utilisateurs en cours...', 'info');
}

function backupDatabase() {
    showAlert('Sauvegarde en cours...', 'info');
}

function clearCache() {
    showAlert('Cache vidé', 'success');
}

function sendNewsletter() {
    showAlert('Newsletter envoyée', 'success');
}