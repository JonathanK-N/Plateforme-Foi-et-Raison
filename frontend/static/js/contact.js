// Contact Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Animation observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animés
    document.querySelectorAll('[class*="animate-"]').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
    
    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
    
    // Animation des liens sociaux
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1) rotate(5deg)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        });
    });
    
    // Animation des items FAQ
    document.querySelectorAll('.faq-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

function handleContactSubmission(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('.btn-contact');
    const originalText = submitBtn.innerHTML;
    
    // Validation simple
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            field.style.borderColor = '#e5e7eb';
        }
    });
    
    if (!isValid) {
        showMessage('Veuillez remplir tous les champs obligatoires.', 'error');
        return;
    }
    
    // Validation email
    const emailField = form.querySelector('input[type="email"]');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailField.value)) {
        emailField.style.borderColor = '#ef4444';
        showMessage('Veuillez entrer une adresse email valide.', 'error');
        return;
    }
    
    // Animation de soumission
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours...';
    
    // Simulation d'envoi (remplacer par vraie logique)
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Message envoyé !';
        submitBtn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
        
        showMessage('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
        
        // Reset form
        form.reset();
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = 'linear-gradient(135deg, #1e3a8a, #3b82f6)';
        }, 3000);
    }, 2000);
}

function showMessage(text, type) {
    // Supprimer message existant
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Créer nouveau message
    const message = document.createElement('div');
    message.className = `form-message ${type}`;
    message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
        ${text}
    `;
    
    // Insérer avant le formulaire
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(message, form);
    
    // Animation d'apparition
    message.style.opacity = '0';
    message.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        message.style.transition = 'all 0.3s ease';
        message.style.opacity = '1';
        message.style.transform = 'translateY(0)';
    }, 100);
    
    // Auto-suppression après 5 secondes
    setTimeout(() => {
        if (message.parentNode) {
            message.style.opacity = '0';
            message.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (message.parentNode) {
                    message.remove();
                }
            }, 300);
        }
    }, 5000);
}