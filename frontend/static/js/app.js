// Configuration globale
const API_BASE = 'http://localhost:5000/api';
let currentUser = null;

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    checkAuthStatus();
    loadRecentContents();
    setupEventListeners();
});

// Gestion de l'authentification
function checkAuthStatus() {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
        currentUser = JSON.parse(userData);
        updateNavigation(true);
    } else {
        updateNavigation(false);
    }
}

function updateNavigation(isLoggedIn) {
    const authNav = document.getElementById('authNav');
    const userNav = document.getElementById('userNav');
    const askQuestionBtn = document.getElementById('askQuestionBtn');
    const adminLink = document.getElementById('adminLink');
    
    if (isLoggedIn) {
        authNav.classList.add('d-none');
        userNav.classList.remove('d-none');
        askQuestionBtn.style.display = 'block';
        document.getElementById('username').textContent = currentUser.username;
        
        if (currentUser.role === 'admin') {
            adminLink.style.display = 'block';
        }
    } else {
        authNav.classList.remove('d-none');
        userNav.classList.add('d-none');
        askQuestionBtn.style.display = 'none';
    }
}

// Navigation entre les pages
function showHome() {
    hideAllPages();
    document.getElementById('homePage').classList.remove('d-none');
    loadRecentContents();
}

function showContents() {
    hideAllPages();
    document.getElementById('contentsPage').classList.remove('d-none');
    loadContents();
}

function showQuestions() {
    hideAllPages();
    document.getElementById('questionsPage').classList.remove('d-none');
    loadQuestions();
}

function hideAllPages() {
    const pages = ['homePage', 'contentsPage', 'questionsPage'];
    pages.forEach(pageId => {
        document.getElementById(pageId).classList.add('d-none');
    });
}

// Chargement des contenus récents pour la grille
async function loadRecentContents() {
    try {
        const response = await fetch(`${API_BASE}/contents`);
        const contents = await response.json();
        
        const recentGrid = document.getElementById('recentContentGrid');
        if (!recentGrid) return;
        
        recentGrid.innerHTML = '';
        
        contents.slice(0, 6).forEach((content, index) => {
            recentGrid.innerHTML += `
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="content-card fade-in-up" onclick="openContent(${content.id})" style="animation-delay: ${index * 0.1}s">
                        <div class="content-thumbnail position-relative">
                            ${getContentIcon(content.content_type)}
                            <span class="content-type-badge">
                                ${getContentTypeLabel(content.content_type)}
                            </span>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-primary">${content.title}</h5>
                            <p class="card-text text-muted">
                                ${content.description ? 
                                    (content.description.length > 80 ? 
                                        content.description.substring(0, 80) + '...' : 
                                        content.description) : 
                                    'Découvrez ce contenu spirituel enrichissant'}
                            </p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">
                                    <i class="fas fa-eye me-1"></i>${content.views} vues
                                </small>
                                <small class="text-muted">
                                    ${formatDate(content.created_at)}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Si aucun contenu, afficher un message d'encouragement
        if (contents.length === 0) {
            recentGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-cross text-primary" style="font-size: 4rem; margin-bottom: 1rem;"></i>
                    <h4 class="text-primary">Bientôt des contenus inspirants</h4>
                    <p class="text-muted">Notre équipe prépare des enseignements et témoignages pour nourrir votre foi.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Erreur lors du chargement des contenus:', error);
        const recentGrid = document.getElementById('recentContentGrid');
        if (recentGrid) {
            recentGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
                    <h5 class="mt-3">Erreur de chargement</h5>
                    <p class="text-muted">Impossible de charger les contenus pour le moment.</p>
                </div>
            `;
        }
    }
}

// Utilitaires pour les contenus
function getContentIcon(type) {
    const icons = {
        video: '<i class="fas fa-video"></i>',
        podcast: '<i class="fas fa-podcast"></i>',
        article: '<i class="fas fa-book-open"></i>',
        prayer: '<i class="fas fa-praying-hands"></i>'
    };
    return icons[type] || '<i class="fas fa-file-alt"></i>';
}

function getContentTypeLabel(type) {
    const labels = {
        video: 'Enseignement',
        podcast: 'Méditation',
        article: 'Réflexion',
        prayer: 'Prière'
    };
    return labels[type] || 'Contenu';
}

function getDefaultThumbnail(type) {
    return `https://via.placeholder.com/300x200/3498db/ffffff?text=${getContentTypeLabel(type)}`;
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Filtre de contenu
    const contentFilter = document.getElementById('contentFilter');
    if (contentFilter) {
        contentFilter.addEventListener('change', function() {
            loadContents(this.value);
        });
    }
    
    // Formulaire de question
    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
        questionForm.addEventListener('submit', handleQuestionSubmit);
    }
}

// Gestion des questions
async function handleQuestionSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('questionTitle').value;
    const content = document.getElementById('questionContent').value;
    const token = localStorage.getItem('access_token');
    
    try {
        const response = await fetch(`${API_BASE}/questions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ title, content })
        });
        
        if (response.ok) {
            showAlert('Question soumise avec succès! Elle sera visible après modération.', 'success');
            document.getElementById('questionForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('questionModal')).hide();
        } else {
            const error = await response.json();
            showAlert(error.message || 'Erreur lors de la soumission', 'danger');
        }
    } catch (error) {
        showAlert('Erreur de connexion', 'danger');
    }
}

function showQuestionForm() {
    const modal = new bootstrap.Modal(document.getElementById('questionModal'));
    modal.show();
}

// Système d'alertes
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Déconnexion
function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    currentUser = null;
    updateNavigation(false);
    showHome();
    showAlert('Déconnexion réussie', 'success');
}