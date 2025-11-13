// Home Page Ultra-Dynamic JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeHomePage();
});

function initializeHomePage() {
    // Advanced scroll animations
    setupAdvancedScrollAnimations();
    
    // Parallax effects
    setupParallaxEffects();
    
    // Interactive elements
    setupInteractiveElements();
    
    // Counter animations
    setupCounterAnimations();
    
    // Newsletter form
    setupNewsletterForm();
    
    // Hero carousel enhancements
    enhanceHeroCarousel();
    
    // Floating elements
    createFloatingElements();
    
    // Mouse tracking effects
    setupMouseTracking();
}

function setupAdvancedScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Special animations for different elements
                if (entry.target.classList.contains('stat-card')) {
                    animateStatCard(entry.target);
                }
                
                if (entry.target.classList.contains('feature-card')) {
                    animateFeatureCard(entry.target);
                }
                
                if (entry.target.classList.contains('section-title')) {
                    animateSectionTitle(entry.target);
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.animate-fade-up, .animate-on-scroll, .section-title, .stat-card, .feature-card').forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

function setupParallaxEffects() {
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-particles, .section-soft-blue::before');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

function setupInteractiveElements() {
    // Enhanced hover effects for cards
    const cards = document.querySelectorAll('.feature-card, .resource-card, .insight-card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            createRippleEffect(this, e);
            this.style.transform = 'translateY(-20px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click animation
        card.addEventListener('click', function(e) {
            createClickWave(this, e);
        });
    });
    
    // Enhanced CTA buttons
    const ctaButtons = document.querySelectorAll('.hero-cta, .newsletter-btn');
    
    ctaButtons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.05)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        btn.addEventListener('click', function(e) {
            createButtonExplosion(this, e);
        });
    });
}

function setupCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/\d/g, '');
        
        counter.textContent = '0' + suffix;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(counter, target, suffix);
                    observer.unobserve(counter);
                }
            });
        });
        
        observer.observe(counter);
    });
}

function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 100;
    const duration = 2000;
    const stepTime = duration / 100;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current) + suffix;
        
        // Add pulsing effect during animation
        element.style.transform = `scale(${1 + (Math.sin(current / target * Math.PI) * 0.1)})`;
    }, stepTime);
    
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, duration + 100);
}

function setupNewsletterForm() {
    const form = document.querySelector('.newsletter-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleNewsletterSubmission(this);
    });
    
    // Enhanced input effects
    const input = form.querySelector('.newsletter-input');
    if (input) {
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 0 0 3px rgba(255,255,255,0.3)';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    }
}

function handleNewsletterSubmission(form) {
    const button = form.querySelector('.newsletter-btn');
    const input = form.querySelector('.newsletter-input');
    const originalText = button.textContent;
    
    // Validation
    if (!input.value || !isValidEmail(input.value)) {
        showNotification('Veuillez entrer une adresse email valide', 'error');
        input.style.borderColor = '#ef4444';
        return;
    }
    
    // Animation de soumission
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Inscription...';
    button.disabled = true;
    
    // Simulation d'envoi
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check"></i> Inscrit !';
        button.style.background = 'linear-gradient(135deg, #059669, #10b981)';
        
        showNotification('Inscription réussie ! Merci de rejoindre notre communauté.', 'success');
        
        // Reset form
        input.value = '';
        input.style.borderColor = 'rgba(255,255,255,0.3)';
        
        // Reset button
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = 'linear-gradient(135deg, var(--accent-gold), var(--light-gold))';
            button.disabled = false;
        }, 3000);
    }, 2000);
}

function enhanceHeroCarousel() {
    const carousel = document.getElementById('heroCarousel');
    if (!carousel) return;
    
    // Add custom transition effects
    carousel.addEventListener('slide.bs.carousel', function(e) {
        const activeSlide = e.relatedTarget;
        const activeContent = activeSlide.querySelector('.hero-content-wrapper');
        
        // Reset and animate content
        activeContent.style.opacity = '0';
        activeContent.style.transform = 'translate(-50%, -30%) scale(0.9)';
        
        setTimeout(() => {
            activeContent.style.transition = 'all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            activeContent.style.opacity = '1';
            activeContent.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 300);
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            bootstrap.Carousel.getInstance(carousel).prev();
        } else if (e.key === 'ArrowRight') {
            bootstrap.Carousel.getInstance(carousel).next();
        }
    });
}

function createFloatingElements() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    
    // Create floating geometric shapes
    for (let i = 0; i < 5; i++) {
        const shape = document.createElement('div');
        shape.className = 'floating-shape';
        shape.style.cssText = `
            position: absolute;
            width: ${20 + Math.random() * 40}px;
            height: ${20 + Math.random() * 40}px;
            background: linear-gradient(45deg, rgba(217,119,6,0.3), rgba(59,130,246,0.3));
            border-radius: ${Math.random() > 0.5 ? '50%' : '20%'};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: floatAround ${10 + Math.random() * 10}s ease-in-out infinite;
            z-index: 1;
            pointer-events: none;
        `;
        hero.appendChild(shape);
    }
    
    // Add CSS for floating animation
    if (!document.getElementById('floatingStyles')) {
        const style = document.createElement('style');
        style.id = 'floatingStyles';
        style.textContent = `
            @keyframes floatAround {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                25% { transform: translateY(-30px) rotate(90deg); }
                50% { transform: translateY(20px) rotate(180deg); }
                75% { transform: translateY(-15px) rotate(270deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

function setupMouseTracking() {
    const hero = document.querySelector('.hero-section');
    if (!hero) return;
    
    hero.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // Subtle parallax effect on hero content
        const content = this.querySelector('.hero-content-wrapper');
        if (content) {
            const moveX = (x - 0.5) * 20;
            const moveY = (y - 0.5) * 20;
            content.style.transform = `translate(calc(-50% + ${moveX}px), calc(-50% + ${moveY}px))`;
        }
        
        // Update particles position
        const particles = this.querySelector('.hero-particles');
        if (particles) {
            const particleX = (x - 0.5) * 30;
            const particleY = (y - 0.5) * 30;
            particles.style.transform = `translate(${particleX}px, ${particleY}px)`;
        }
    });
    
    hero.addEventListener('mouseleave', function() {
        const content = this.querySelector('.hero-content-wrapper');
        const particles = this.querySelector('.hero-particles');
        
        if (content) {
            content.style.transform = 'translate(-50%, -50%)';
        }
        if (particles) {
            particles.style.transform = 'translate(0, 0)';
        }
    });
}

// Utility functions
function createRippleEffect(element, event) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(217,119,6,0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnimation 0.6s ease-out;
        pointer-events: none;
        z-index: 1000;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
    
    // Add CSS if not exists
    if (!document.getElementById('rippleStyles')) {
        const style = document.createElement('style');
        style.id = 'rippleStyles';
        style.textContent = `
            @keyframes rippleAnimation {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function createClickWave(element, event) {
    const wave = document.createElement('div');
    wave.className = 'click-wave';
    
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    wave.style.cssText = `
        position: absolute;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(30,58,138,0.4) 0%, transparent 70%);
        transform: translate(-50%, -50%);
        animation: waveExpand 0.5s ease-out;
        pointer-events: none;
        z-index: 1001;
    `;
    
    element.style.position = 'relative';
    element.appendChild(wave);
    
    setTimeout(() => {
        wave.remove();
    }, 500);
    
    // Add CSS if not exists
    if (!document.getElementById('waveStyles')) {
        const style = document.createElement('style');
        style.id = 'waveStyles';
        style.textContent = `
            @keyframes waveExpand {
                to {
                    width: 200px;
                    height: 200px;
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function createButtonExplosion(button, event) {
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 6px;
            height: 6px;
            background: linear-gradient(45deg, #d97706, #f59e0b);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1002;
        `;
        
        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        
        const angle = (i / 8) * Math.PI * 2;
        const velocity = 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.style.animation = `explodeParticle 0.8s ease-out forwards`;
        particle.style.setProperty('--vx', vx + 'px');
        particle.style.setProperty('--vy', vy + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 800);
    }
    
    // Add CSS if not exists
    if (!document.getElementById('explosionStyles')) {
        const style = document.createElement('style');
        style.id = 'explosionStyles';
        style.textContent = `
            @keyframes explodeParticle {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--vx), var(--vy)) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

function animateStatCard(card) {
    card.style.transform = 'scale(0.8)';
    card.style.opacity = '0';
    
    setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        card.style.transform = 'scale(1)';
        card.style.opacity = '1';
    }, 100);
}

function animateFeatureCard(card) {
    card.style.transform = 'translateY(50px) rotateX(20deg)';
    card.style.opacity = '0';
    
    setTimeout(() => {
        card.style.transition = 'all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        card.style.transform = 'translateY(0) rotateX(0deg)';
        card.style.opacity = '1';
    }, 100);
}

function animateSectionTitle(title) {
    const letters = title.textContent.split('');
    title.innerHTML = letters.map(letter => 
        `<span style="display: inline-block; opacity: 0; transform: translateY(20px);">${letter === ' ' ? '&nbsp;' : letter}</span>`
    ).join('');
    
    const spans = title.querySelectorAll('span');
    spans.forEach((span, index) => {
        setTimeout(() => {
            span.style.transition = 'all 0.3s ease';
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        }, index * 50);
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 15px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        transform: translateX(400px);
        transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 4000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Export for global access
window.showHome = initializeHomePage;