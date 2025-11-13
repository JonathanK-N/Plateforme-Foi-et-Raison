// Navigation vers les sections
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier les paramètres URL pour navigation directe
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    
    if (type) {
        setTimeout(() => {
            scrollToSection(type);
        }, 500);
    }
    
    // Animation au scroll
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
    
    // Observer toutes les cartes
    document.querySelectorAll('.content-card, .section-header').forEach(card => {
        observer.observe(card);
    });
});

function scrollToSection(type) {
    const sectionMap = {
        'articles': 'articles',
        'videos': 'videos', 
        'podcasts': 'podcasts'
    };
    
    const sectionId = sectionMap[type];
    if (sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
            
            // Highlight de la section
            element.classList.add('section-highlight');
            setTimeout(() => {
                element.classList.remove('section-highlight');
            }, 2000);
        }
    }
}

// Smooth scroll pour les liens internes
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation des cartes au hover
document.querySelectorAll('.content-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.cursor = 'pointer';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Fonction pour ouvrir le contenu
function openContent(contentId, type) {
    // Animation de clic
    event.currentTarget.style.transform = 'scale(0.95)';
    setTimeout(() => {
        event.currentTarget.style.transform = 'translateY(-8px) scale(1.02)';
    }, 150);
    
    // Simulation d'ouverture de contenu
    setTimeout(() => {
        showContentModal(contentId, type);
    }, 300);
}

// Modal de contenu
function showContentModal(contentId, type) {
    const modal = document.createElement('div');
    modal.className = 'content-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeContentModal()"></div>
        <div class="modal-content animate-modal-in">
            <div class="modal-header">
                <h3>Contenu ${type}</h3>
                <button onclick="closeContentModal()" class="btn-close">&times;</button>
            </div>
            <div class="modal-body">
                <p>Contenu en cours de préparation...</p>
                <p>ID: ${contentId}</p>
                <div class="loading-animation">
                    <div class="spinner"></div>
                    <p>Notre équipe prépare ce contenu pour vous</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeContentModal() {
    const modal = document.querySelector('.content-modal');
    if (modal) {
        modal.querySelector('.modal-content').classList.add('animate-modal-out');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Animation des icônes play
document.querySelectorAll('.play-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.2) rotate(10deg)';
    });
    
    icon.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});