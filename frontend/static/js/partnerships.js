// Partnerships Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Animation observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -30px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animés
    document.querySelectorAll('.partner-card, .collaboration-card, .process-step, .section-header-partnerships').forEach(element => {
        observer.observe(element);
    });
    
    // Animation des cartes partenaires
    document.querySelectorAll('.partner-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.03)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animation des étapes du processus
    document.querySelectorAll('.process-step').forEach(step => {
        step.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) translateY(-10px)';
        });
        
        step.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) translateY(0)';
        });
    });
});

// Fonction pour télécharger le dossier
function downloadPartnershipKit() {
    // Animation du bouton
    const button = event.target;
    const originalText = button.textContent;
    
    button.style.transform = 'scale(0.95)';
    button.textContent = 'Téléchargement...';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        showPartnershipModal();
        button.textContent = originalText;
    }, 500);
}

// Modal de partenariat
function showPartnershipModal() {
    const modal = document.createElement('div');
    modal.className = 'partnership-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closePartnershipModal()"></div>
        <div class="modal-content animate-modal-in">
            <div class="modal-header">
                <h3>Dossier de Partenariat</h3>
                <button onclick="closePartnershipModal()" class="btn-close">&times;</button>
            </div>
            <div class="modal-body">
                <p class="mb-4">Recevez notre dossier complet avec toutes les informations sur nos programmes et opportunités.</p>
                <form class="partnership-form">
                    <div class="form-group mb-3">
                        <label class="form-label">Nom de l'organisation</label>
                        <input type="text" class="form-control" required>
                    </div>
                    <div class="form-group mb-3">
                        <label class="form-label">Email de contact</label>
                        <input type="email" class="form-control" required>
                    </div>
                    <div class="form-group mb-3">
                        <label class="form-label">Type de partenariat</label>
                        <select class="form-select">
                            <option>Éducatif</option>
                            <option>Média</option>
                            <option>Événementiel</option>
                            <option>Autre</option>
                        </select>
                    </div>
                    <div class="form-group mb-4">
                        <label class="form-label">Message (optionnel)</label>
                        <textarea class="form-control" rows="3" placeholder="Décrivez brièvement votre projet..."></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Télécharger le dossier</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Gérer la soumission du formulaire
    modal.querySelector('.partnership-form').addEventListener('submit', function(e) {
        e.preventDefault();
        handlePartnershipSubmission();
    });
}

function closePartnershipModal() {
    const modal = document.querySelector('.partnership-modal');
    if (modal) {
        modal.querySelector('.modal-content').classList.add('animate-modal-out');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

function handlePartnershipSubmission() {
    const button = document.querySelector('.partnership-form button');
    const originalText = button.textContent;
    
    button.textContent = 'Envoi en cours...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = '✓ Dossier envoyé !';
        button.style.background = 'linear-gradient(45deg, #059669, #10b981)';
        
        setTimeout(() => {
            closePartnershipModal();
        }, 1500);
    }, 2000);
}

// Animation des boutons CTA
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.btn-partnership').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});