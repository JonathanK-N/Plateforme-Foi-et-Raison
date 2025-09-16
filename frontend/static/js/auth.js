// Gestion de l'authentification

function showLogin() {
    setupAuthModal('login', 'Connexion', 'Se connecter');
}

function showRegister() {
    setupAuthModal('register', 'Inscription', 'S\'inscrire');
}

function setupAuthModal(type, title, submitText) {
    const modal = document.getElementById('authModal');
    const modalTitle = document.getElementById('authModalTitle');
    const authFields = document.getElementById('authFields');
    const authSubmit = document.getElementById('authSubmit');
    const authForm = document.getElementById('authForm');
    
    modalTitle.textContent = title;
    authSubmit.textContent = submitText;
    
    // Nettoyer les anciens écouteurs
    const newForm = authForm.cloneNode(true);
    authForm.parentNode.replaceChild(newForm, authForm);
    
    if (type === 'login') {
        authFields.innerHTML = `
            <div class="mb-3">
                <label for="username" class="form-label">Nom d'utilisateur</label>
                <input type="text" class="form-control" id="username" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Mot de passe</label>
                <input type="password" class="form-control" id="password" required>
            </div>
        `;
        
        document.getElementById('authForm').addEventListener('submit', handleLogin);
    } else {
        authFields.innerHTML = `
            <div class="mb-3">
                <label for="username" class="form-label">Nom d'utilisateur</label>
                <input type="text" class="form-control" id="username" required>
            </div>
            <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" id="email" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Mot de passe</label>
                <input type="password" class="form-control" id="password" required minlength="6">
            </div>
            <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirmer le mot de passe</label>
                <input type="password" class="form-control" id="confirmPassword" required>
            </div>
        `;
        
        document.getElementById('authForm').addEventListener('submit', handleRegister);
    }
    
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
}

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const submitBtn = document.getElementById('authSubmit');
    
    // Désactiver le bouton et afficher le chargement
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> Connexion...';
    
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Stocker les informations d'authentification
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_data', JSON.stringify(data.user));
            
            currentUser = data.user;
            updateNavigation(true);
            
            // Fermer la modal
            bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
            
            showAlert('Connexion réussie!', 'success');
        } else {
            showAlert(data.message || 'Erreur de connexion', 'danger');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur', 'danger');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Se connecter';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = document.getElementById('authSubmit');
    
    // Validation côté client
    if (password !== confirmPassword) {
        showAlert('Les mots de passe ne correspondent pas', 'danger');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Le mot de passe doit contenir au moins 6 caractères', 'danger');
        return;
    }
    
    // Désactiver le bouton et afficher le chargement
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="loading"></span> Inscription...';
    
    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showAlert('Inscription réussie! Vous pouvez maintenant vous connecter.', 'success');
            
            // Fermer la modal et afficher la connexion
            bootstrap.Modal.getInstance(document.getElementById('authModal')).hide();
            
            setTimeout(() => {
                showLogin();
            }, 1000);
        } else {
            showAlert(data.message || 'Erreur lors de l\'inscription', 'danger');
        }
    } catch (error) {
        showAlert('Erreur de connexion au serveur', 'danger');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'S\'inscrire';
    }
}

// Vérification du token JWT
function isTokenValid() {
    const token = localStorage.getItem('access_token');
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        return payload.exp > currentTime;
    } catch (error) {
        return false;
    }
}

// Middleware pour les requêtes authentifiées
async function authenticatedFetch(url, options = {}) {
    const token = localStorage.getItem('access_token');
    
    if (!token || !isTokenValid()) {
        logout();
        showAlert('Session expirée, veuillez vous reconnecter', 'warning');
        return null;
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    return fetch(url, { ...options, headers });
}

// Profil utilisateur
function showProfile() {
    if (!currentUser) return;
    
    showAlert(`Profil de ${currentUser.username} (${currentUser.role})`, 'info');
}

// Administration (pour les admins)
async function showAdmin() {
    if (!currentUser || currentUser.role !== 'admin') {
        showAlert('Accès refusé', 'danger');
        return;
    }
    
    try {
        const response = await authenticatedFetch(`${API_BASE}/admin/stats`);
        if (!response) return;
        
        const stats = await response.json();
        
        const adminContent = `
            <div class="row">
                <div class="col-md-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title">${stats.total_users}</h5>
                            <p class="card-text">Utilisateurs</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title">${stats.total_contents}</h5>
                            <p class="card-text">Contenus</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title">${stats.total_questions}</h5>
                            <p class="card-text">Questions</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card text-center">
                        <div class="card-body">
                            <h5 class="card-title">${stats.pending_questions}</h5>
                            <p class="card-text">En attente</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Créer une modal pour l'admin
        const adminModal = document.createElement('div');
        adminModal.className = 'modal fade';
        adminModal.innerHTML = `
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Tableau de bord administrateur</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${adminContent}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(adminModal);
        const modal = new bootstrap.Modal(adminModal);
        modal.show();
        
        // Nettoyer après fermeture
        adminModal.addEventListener('hidden.bs.modal', () => {
            adminModal.remove();
        });
        
    } catch (error) {
        showAlert('Erreur lors du chargement des statistiques', 'danger');
    }
}