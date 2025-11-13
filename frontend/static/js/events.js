// Events Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Animation observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animés
    document.querySelectorAll('.event-card, .section-header-events').forEach(element => {
        observer.observe(element);
    });
    
    // Animation des cartes au hover
    document.querySelectorAll('.event-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Fonction d'inscription aux événements
function registerForEvent(eventId, eventTitle) {
    // Animation du bouton
    const button = event.target;
    const originalText = button.textContent;
    
    button.style.transform = 'scale(0.95)';
    button.textContent = 'Inscription...';
    
    setTimeout(() => {
        button.style.transform = 'scale(1)';
        showRegistrationModal(eventId, eventTitle);
        button.textContent = originalText;
    }, 300);
}

// Modal d'inscription
function showRegistrationModal(eventId, eventTitle) {
    const modal = document.createElement('div');
    modal.className = 'event-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeEventModal()"></div>
        <div class="modal-content animate-modal-in">
            <div class="modal-header">
                <h3>Inscription à l'événement</h3>
                <button onclick="closeEventModal()" class="btn-close">&times;</button>
            </div>
            <div class="modal-body">
                <h4>${eventTitle}</h4>
                <form class="registration-form">
                    <div class="form-group">
                        <label>Nom complet</label>
                        <input type="text" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label>Téléphone</label>
                        <input type="tel" class="form-control" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Confirmer l'inscription</button>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeEventModal() {
    const modal = document.querySelector('.event-modal');
    if (modal) {
        modal.querySelector('.modal-content').classList.add('animate-modal-out');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Animation du formulaire newsletter
document.addEventListener('DOMContentLoaded', function() {
    const newsletterForm = document.querySelector('.newsletter-signup form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const button = this.querySelector('button');
            const originalText = button.textContent;
            
            button.textContent = 'Inscription...';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = '✓ Inscrit !';
                button.style.background = 'linear-gradient(45deg, #059669, #10b981)';
                
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                    button.style.background = '';
                    this.reset();
                }, 2000);
            }, 1500);
        });
    }
});