// Gestion des contenus multimédia

// Chargement de tous les contenus
async function loadContents(filter = '') {
    try {
        const response = await fetch(`${API_BASE}/contents`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const contents = await response.json();
        
        // Vérifier si c'est une erreur du serveur
        if (contents.error) {
            throw new Error(contents.error);
        }
        
        // Filtrer les contenus si nécessaire
        const filteredContents = filter ? 
            contents.filter(content => content.content_type === filter) : 
            contents;
        
        displayContents(filteredContents);
    } catch (error) {
        console.error('Erreur lors du chargement des contenus:', error);
        
        // Afficher l'erreur réelle
        const contentsList = document.getElementById('contentsList');
        if (contentsList) {
            contentsList.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-danger">
                        <h4>Erreur de chargement</h4>
                        <p>Impossible de charger les contenus pour le moment.</p>
                        <small>Détails: ${error.message}</small>
                        <br><br>
                        <button class="btn btn-outline-danger" onclick="loadContents()">
                            <i class="bi bi-arrow-clockwise"></i> Réessayer
                        </button>
                    </div>
                </div>
            `;
        }
        
        showAlert(`Erreur: ${error.message}`, 'danger');
    }
}

// Affichage des contenus
function displayContents(contents) {
    const contentsList = document.getElementById('contentsList');
    
    if (contents.length === 0) {
        contentsList.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-heart text-primary" style="font-size: 3rem; margin-bottom: 1rem;"></i>
                <h4 class="text-primary">Contenus en préparation</h4>
                <p class="text-muted">Notre équipe travaille avec amour pour vous offrir des contenus spirituels de qualité.</p>
                <p class="text-muted">Revenez bientôt découvrir nos enseignements, témoignages et réflexions !</p>
            </div>
        `;
        return;
    }
    
    contentsList.innerHTML = contents.map(content => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card content-card h-100" onclick="openContent(${content.id})">
                <div class="position-relative">
                    <div class="content-thumbnail">
                        ${getContentIcon(content.content_type)}
                    </div>
                    <span class="badge content-type-badge bg-${getContentTypeBadgeColor(content.content_type)}">
                        ${getContentTypeLabel(content.content_type)}
                    </span>
                </div>
                <div class="card-body">
                    <h5 class="card-title">${content.title}</h5>
                    <p class="card-text text-muted">
                        ${content.description ? 
                            (content.description.length > 100 ? 
                                content.description.substring(0, 100) + '...' : 
                                content.description) : 
                            'Aucune description disponible'}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <small class="text-muted">
                            <i class="bi bi-eye"></i> ${content.views} vues
                        </small>
                        <small class="text-muted">
                            ${formatDate(content.created_at)}
                        </small>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Ouverture d'un contenu spécifique
async function openContent(contentId) {
    try {
        const response = await fetch(`${API_BASE}/contents/${contentId}`);
        const content = await response.json();
        
        showContentModal(content);
    } catch (error) {
        console.error('Erreur lors du chargement du contenu:', error);
        showAlert('Erreur lors du chargement du contenu', 'danger');
    }
}

// Modal pour afficher un contenu
function showContentModal(content) {
    const modalId = 'contentModal';
    let modal = document.getElementById(modalId);
    
    // Créer la modal si elle n'existe pas
    if (!modal) {
        modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'modal fade';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${content.title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${renderContentPlayer(content)}
                    <div class="mt-3">
                        <p>${content.description || 'Aucune description disponible'}</p>
                        <div class="d-flex justify-content-between text-muted">
                            <span>Type: ${getContentTypeLabel(content.content_type)}</span>
                            <span>${content.views} vues</span>
                        </div>
                    </div>
                    
                    <!-- Boutons de partage -->
                    <div class="mt-4">
                        <h6>Partager ce contenu:</h6>
                        <div class="btn-group" role="group">
                            <button class="btn btn-outline-primary btn-sm" onclick="shareContent('facebook', ${content.id})">
                                Facebook
                            </button>
                            <button class="btn btn-outline-success btn-sm" onclick="shareContent('whatsapp', ${content.id})">
                                WhatsApp
                            </button>
                            <button class="btn btn-outline-info btn-sm" onclick="shareContent('twitter', ${content.id})">
                                Twitter
                            </button>
                        </div>
                    </div>
                    
                    <!-- Section commentaires -->
                    <div class="mt-4">
                        <h6>Commentaires</h6>
                        ${currentUser ? `
                            <form onsubmit="addComment(event, ${content.id})">
                                <div class="mb-3">
                                    <textarea class="form-control" placeholder="Ajouter un commentaire..." required></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary btn-sm">Commenter</button>
                            </form>
                        ` : `
                            <p class="text-muted">Connectez-vous pour commenter</p>
                        `}
                        <div id="commentsList-${content.id}" class="mt-3">
                            <!-- Commentaires chargés dynamiquement -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    // Charger les commentaires
    loadComments(content.id);
}

// Rendu du lecteur de contenu
function renderContentPlayer(content) {
    switch (content.content_type) {
        case 'video':
            return content.file_path ? `
                <video controls class="w-100" style="max-height: 400px;">
                    <source src="${content.file_path}" type="video/mp4">
                    Votre navigateur ne supporte pas la lecture vidéo.
                </video>
            ` : `
                <div class="text-center py-5 bg-light">
                    <h4>🎥</h4>
                    <p>Vidéo non disponible</p>
                </div>
            `;
            
        case 'podcast':
            return content.file_path ? `
                <audio controls class="w-100">
                    <source src="${content.file_path}" type="audio/mpeg">
                    Votre navigateur ne supporte pas la lecture audio.
                </audio>
            ` : `
                <div class="text-center py-5 bg-light">
                    <h4>🎧</h4>
                    <p>Podcast non disponible</p>
                </div>
            `;
            
        case 'article':
            return `
                <div class="text-center py-5 bg-light">
                    <h4>📖</h4>
                    <p>Article disponible</p>
                </div>
            `;
            
        default:
            return `
                <div class="text-center py-5 bg-light">
                    <h4>📄</h4>
                    <p>Contenu disponible</p>
                </div>
            `;
    }
}

// Partage de contenu
function shareContent(platform, contentId) {
    const url = encodeURIComponent(window.location.origin + `#content-${contentId}`);
    const title = encodeURIComponent('Découvrez ce contenu sur Croire & Penser');
    
    let shareUrl;
    
    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
            break;
        case 'whatsapp':
            shareUrl = `https://wa.me/?text=${title}%20${url}`;
            break;
        case 'twitter':
            shareUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
            break;
    }
    
    if (shareUrl) {
        window.open(shareUrl, '_blank', 'width=600,height=400');
    }
}

// Gestion des commentaires
async function loadComments(contentId) {
    // Simulation de chargement des commentaires
    const commentsList = document.getElementById(`commentsList-${contentId}`);
    
    // Pour l'instant, afficher un message
    commentsList.innerHTML = `
        <div class="text-center text-muted py-3">
            <p>Aucun commentaire pour le moment</p>
        </div>
    `;
}

async function addComment(event, contentId) {
    event.preventDefault();
    
    const textarea = event.target.querySelector('textarea');
    const content = textarea.value.trim();
    
    if (!content) return;
    
    try {
        // Simulation d'ajout de commentaire
        showAlert('Commentaire ajouté avec succès!', 'success');
        textarea.value = '';
        loadComments(contentId);
    } catch (error) {
        showAlert('Erreur lors de l\'ajout du commentaire', 'danger');
    }
}

// Chargement des questions
async function loadQuestions() {
    try {
        const response = await fetch(`${API_BASE}/questions`);
        const questions = await response.json();
        
        displayQuestions(questions);
    } catch (error) {
        console.error('Erreur lors du chargement des questions:', error);
        showAlert('Erreur lors du chargement des questions', 'danger');
    }
}

// Affichage des questions
function displayQuestions(questions) {
    const questionsList = document.getElementById('questionsList');
    
    if (questions.length === 0) {
        questionsList.innerHTML = `
            <div class="text-center py-5">
                <h4 class="text-muted">Aucune question disponible</h4>
                <p class="text-muted">Soyez le premier à poser une question!</p>
            </div>
        `;
        return;
    }
    
    questionsList.innerHTML = questions.map(question => `
        <div class="question-card">
            <h5>${question.title}</h5>
            <p>${question.content}</p>
            <div class="question-meta">
                <small>Posée le ${formatDate(question.created_at)}</small>
            </div>
        </div>
    `).join('');
}

// Utilitaires
function getContentTypeBadgeColor(type) {
    const colors = {
        video: 'primary',
        podcast: 'success',
        article: 'info'
    };
    return colors[type] || 'secondary';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-CA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}