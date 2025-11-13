// About Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Animation observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('mission-content')) {
                    entry.target.classList.add('animate-slide-left');
                } else if (entry.target.classList.contains('mission-visual')) {
                    entry.target.classList.add('animate-slide-right');
                } else if (entry.target.classList.contains('audience-content')) {
                    entry.target.classList.add('animate-slide-right');
                } else if (entry.target.classList.contains('audience-visual')) {
                    entry.target.classList.add('animate-slide-left');
                } else {
                    entry.target.classList.add('animate-fade-up');
                }
            }
        });
    }, observerOptions);
    
    // Observer tous les éléments animés
    document.querySelectorAll('.mission-content, .mission-visual, .audience-content, .audience-visual, .value-card, .timeline-item').forEach(element => {
        observer.observe(element);
    });
    
    // Animation des cartes de valeurs
    document.querySelectorAll('.value-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Animation des éléments d'audience
    document.querySelectorAll('.audience-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Animation de la timeline
    document.querySelectorAll('.timeline-marker').forEach(marker => {
        marker.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });
        
        marker.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
    
    // Animation de la carte visuelle
    const visualCard = document.querySelector('.visual-card');
    if (visualCard) {
        visualCard.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        visualCard.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    }
});