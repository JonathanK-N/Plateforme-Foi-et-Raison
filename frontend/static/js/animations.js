// JavaScript pour animations dynamiques

// Animation au scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Initialisation des animations
document.addEventListener('DOMContentLoaded', function() {
    // Ajouter les classes d'animation aux éléments existants
    enhanceAnimatedElements();
    window.addEventListener('scroll', animateOnScroll, { passive: true });
    animateOnScroll(); // Vérifier au chargement

    initHeroParallax();
    initMegaNavHover();
});

// Effet de particules flottantes
function createFloatingParticles() {
    const hero = document.querySelector('.hero-fullscreen');
    if (!hero) return;
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatParticle ${5 + Math.random() * 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        hero.appendChild(particle);
    }
}

// CSS pour particules (ajouté dynamiquement)
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes floatParticle {
        0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
    }
`;
document.head.appendChild(particleStyle);

// Initialiser les particules
setTimeout(createFloatingParticles, 1000);

function enhanceAnimatedElements() {
    setTimeout(() => {
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            card.style.transitionDelay = `${index * 0.15}s`;
        });

        const contentCards = document.querySelectorAll('.content-card');
        contentCards.forEach((card, index) => {
            card.classList.add('animate-on-scroll');
            card.style.transitionDelay = `${index * 0.1}s`;
        });

        const heroElements = document.querySelectorAll('.hero-content, .hero-featured-card, .hero-highlight-pills .pill, .hero-meta span');
        heroElements.forEach((element, index) => {
            element.classList.add('animate-on-scroll');
            element.style.transitionDelay = `${0.1 + index * 0.1}s`;
        });

        const introItems = document.querySelectorAll('.intro-item');
        introItems.forEach((item, index) => {
            item.classList.add('animate-on-scroll');
            item.style.transitionDelay = `${index * 0.15}s`;
        });

        animateOnScroll();
    }, 150);
}

function initHeroParallax() {
    const hero = document.querySelector('.hero-fullscreen');
    if (!hero) return;

    let ticking = false;
    const updateParallax = () => {
        const offset = Math.min(window.scrollY * 0.18, 120);
        hero.style.setProperty('--hero-shift', `${offset}px`);
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

function initMegaNavHover() {
    if (typeof bootstrap === 'undefined') return;
    const mediaQuery = window.matchMedia('(min-width: 992px)');

    const setupHover = () => {
        document.querySelectorAll('.mega-nav').forEach(item => {
            if (item.dataset.hoverBound === 'true') return;
            const trigger = item.querySelector('[data-bs-toggle="dropdown"]');
            if (!trigger) return;
            const dropdown = bootstrap.Dropdown.getOrCreateInstance(trigger, { autoClose: false });

            item.addEventListener('mouseenter', () => {
                if (mediaQuery.matches) dropdown.show();
            });
            item.addEventListener('mouseleave', () => {
                if (mediaQuery.matches) dropdown.hide();
            });
            item.dataset.hoverBound = 'true';

            item.querySelectorAll('.mega-menu a, .mega-menu button').forEach(link => {
                link.addEventListener('click', () => {
                    if (!mediaQuery.matches) {
                        dropdown.hide();
                    }
                });
            });
        });
    };

    setupHover();
    mediaQuery.addEventListener('change', setupHover);
}
