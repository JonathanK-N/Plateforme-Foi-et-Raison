// Nouvelle fonction pour la connexion
async function handleNewLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Connexion...';
    
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('user_data', JSON.stringify(data.user));
            
            currentUser = data.user;
            updateNavigation(true);
            
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