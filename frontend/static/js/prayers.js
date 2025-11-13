// Prayers Page JavaScript - Spiritual & Interactive
document.addEventListener('DOMContentLoaded', function() {
    initializePrayersPage();
});

function initializePrayersPage() {
    // Set current date
    setCurrentDate();
    
    // Setup scroll animations
    setupScrollAnimations();
    
    // Initialize daily verse
    initializeDailyVerse();
    
    // Setup prayer types interaction
    setupPrayerTypes();
    
    // Setup prayer request form
    setupPrayerRequestForm();
    
    // Initialize meditation space
    initializeMeditationSpace();
    
    // Setup community prayers
    setupCommunityPrayers();
    
    // Setup spiritual resources
    setupSpiritualResources();
}

function setCurrentDate() {
    const dateElement = document.getElementById('currentDate');
    const today = new Date();
    const options = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    };
    dateElement.textContent = today.toLocaleDateString('fr-FR', options);
}

function setupScrollAnimations() {
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
    
    document.querySelectorAll('[class*="animate-"]').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

function initializeDailyVerse() {
    // Rotation des versets (simulation)
    const verses = [
        {
            text: "Que ce livre de la loi ne s'éloigne point de ta bouche; médite-le jour et nuit, pour agir fidèlement selon tout ce qui y est écrit; car c'est alors que tu auras du succès dans tes entreprises, c'est alors que tu réussiras.",
            reference: "Josué 1:8"
        },
        {
            text: "Heureux l'homme qui ne marche pas selon le conseil des méchants, qui ne s'arrête pas sur la voie des pécheurs, et qui ne s'assied pas en compagnie des moqueurs, mais qui trouve son plaisir dans la loi de l'Éternel, et qui la médite jour et nuit!",
            reference: "Psaume 1:1-2"
        },
        {
            text: "Ta parole est une lampe à mes pieds, Et une lumière sur mon sentier.",
            reference: "Psaume 119:105"
        }
    ];
    
    // Sélection aléatoire ou basée sur la date
    const today = new Date();
    const verseIndex = today.getDate() % verses.length;
    const selectedVerse = verses[verseIndex];
    
    // Mise à jour du verset (si différent de celui par défaut)
    if (verseIndex !== 0) {
        const verseText = document.querySelector('.verse-text');
        const verseRef = document.querySelector('.verse-reference');
        
        verseText.textContent = `"${selectedVerse.text}"`;
        verseRef.textContent = selectedVerse.reference;
    }
}

function setupPrayerTypes() {
    const prayerCards = document.querySelectorAll('.prayer-type-card');
    
    prayerCards.forEach(card => {
        card.addEventListener('click', function() {
            const type = this.dataset.type;
            showPrayerTypeModal(type);
            
            // Animation de clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // Effets hover avancés
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

function showPrayerTypeModal(type) {
    const prayerTypes = {
        adoration: {
            title: 'Prières d\'Adoration',
            description: 'Louer et glorifier Dieu pour qui Il est',
            prayers: [
                'Seigneur, Tu es saint, saint, saint!',
                'Gloire à Ton nom, ô Dieu Tout-Puissant!',
                'Tu es digne de recevoir la gloire, l\'honneur et la puissance!'
            ]
        },
        confession: {
            title: 'Prières de Confession',
            description: 'Reconnaître nos péchés et demander pardon',
            prayers: [
                'Seigneur, aie pitié de moi, pécheur',
                'Purifie-moi de toute iniquité',
                'Crée en moi un cœur pur, ô Dieu'
            ]
        },
        gratitude: {
            title: 'Prières de Gratitude',
            description: 'Remercier Dieu pour Ses bienfaits',
            prayers: [
                'Merci Seigneur pour Tes bénédictions',
                'Je Te loue pour Ta fidélité',
                'Que Ton nom soit béni pour Tes bienfaits'
            ]
        },
        supplication: {
            title: 'Prières de Supplication',
            description: 'Présenter nos demandes à Dieu',
            prayers: [
                'Seigneur, écoute ma prière',
                'Accorde-moi selon Ta volonté',
                'Que Ta grâce me suffise'
            ]
        }
    };
    
    const prayerType = prayerTypes[type];
    showNotification(`Prières de ${prayerType.title.split(' ')[2]} - ${prayerType.description}`, 'info');
}

function setupPrayerRequestForm() {
    const form = document.getElementById('prayerRequestForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handlePrayerRequest();
    });
}

function handlePrayerRequest() {
    const form = document.getElementById('prayerRequestForm');
    const submitBtn = form.querySelector('.btn-prayer-submit');
    const originalText = submitBtn.innerHTML;
    
    // Validation
    const firstName = form.querySelector('input[placeholder="Votre prénom"]').value;
    const prayerType = form.querySelector('select').value;
    
    if (!firstName || !prayerType) {
        showNotification('Veuillez remplir les champs obligatoires', 'error');
        return;
    }
    
    // Animation de soumission
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.innerHTML = '<i class="fas fa-check me-2"></i>Demande envoyée !';
        submitBtn.style.background = 'linear-gradient(135deg, #059669, #10b981)';
        
        showNotification('Votre demande de prière a été envoyée. Notre communauté priera pour vous.', 'success');
        
        // Reset form
        form.reset();
        
        // Add to community prayers
        addToCommunityPrayers(firstName, prayerType);
        
        // Reset button
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = 'linear-gradient(135deg, #1e3a8a, #7c3aed)';
            submitBtn.disabled = false;
        }, 3000);
    }, 2000);
}

function addToCommunityPrayers(name, type) {
    const prayersFeed = document.getElementById('prayersFeed');
    const typeLabels = {
        sante: { label: 'Santé', class: 'health' },
        famille: { label: 'Famille', class: 'family' },
        travail: { label: 'Travail', class: 'work' },
        finances: { label: 'Finances', class: 'finance' },
        spirituel: { label: 'Spirituel', class: 'spiritual' },
        autre: { label: 'Autre', class: 'other' }
    };
    
    const typeInfo = typeLabels[type] || typeLabels.autre;
    
    const newPrayer = document.createElement('div');
    newPrayer.className = 'prayer-item';
    newPrayer.innerHTML = `
        <div class="prayer-header">
            <div class="prayer-avatar">${name.charAt(0).toUpperCase()}</div>
            <div class="prayer-info">
                <div class="prayer-name">${name}</div>
                <div class="prayer-time">À l'instant</div>
            </div>
            <div class="prayer-type-badge ${typeInfo.class}">${typeInfo.label}</div>
        </div>
        <div class="prayer-content">
            <p>Nouvelle demande de prière pour ${typeInfo.label.toLowerCase()}. Merci de prier pour cette situation.</p>
        </div>
        <div class="prayer-actions">
            <button class="prayer-action-btn" onclick="prayFor(this)">
                <i class="fas fa-praying-hands"></i>
                <span class="pray-count">0</span> Je prie
            </button>
            <button class="prayer-action-btn" onclick="encouragePrayer(this)">
                <i class="fas fa-heart"></i>
                <span class="encourage-count">0</span> Encourager
            </button>
        </div>
    `;
    
    // Animation d'apparition
    newPrayer.style.opacity = '0';
    newPrayer.style.transform = 'translateY(-20px)';
    prayersFeed.insertBefore(newPrayer, prayersFeed.firstChild);
    
    setTimeout(() => {
        newPrayer.style.transition = 'all 0.5s ease';
        newPrayer.style.opacity = '1';
        newPrayer.style.transform = 'translateY(0)';
    }, 100);
}

// Méditation guidée
let meditationTimer = null;
let meditationTime = 0;
let currentStep = 1;
const meditationSteps = [
    { duration: 120, title: 'Préparation' },      // 2 min
    { duration: 300, title: 'Lecture méditative' }, // 5 min
    { duration: 480, title: 'Réflexion' },        // 8 min
    { duration: 300, title: 'Prière' }            // 5 min
];

function initializeMeditationSpace() {
    // Setup ambiance controls
    const ambianceButtons = document.querySelectorAll('.ambiance-btn');
    ambianceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            ambianceButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const sound = this.dataset.sound;
            playAmbianceSound(sound);
        });
    });
}

function startMeditation() {
    const startBtn = document.querySelector('.btn-meditation[onclick="startMeditation()"]');
    const pauseBtn = document.querySelector('.btn-meditation[onclick="pauseMeditation()"]');
    
    startBtn.style.display = 'none';
    pauseBtn.style.display = 'inline-block';
    
    meditationTimer = setInterval(updateMeditationTimer, 1000);
    showNotification('Méditation commencée. Prenez une position confortable et respirez profondément.', 'info');
}

function pauseMeditation() {
    const startBtn = document.querySelector('.btn-meditation[onclick="startMeditation()"]');
    const pauseBtn = document.querySelector('.btn-meditation[onclick="pauseMeditation()"]');
    
    if (meditationTimer) {
        clearInterval(meditationTimer);
        meditationTimer = null;
        startBtn.style.display = 'inline-block';
        pauseBtn.style.display = 'none';
        startBtn.innerHTML = '<i class="fas fa-play"></i> Reprendre';
    }
}

function resetMeditation() {
    if (meditationTimer) {
        clearInterval(meditationTimer);
        meditationTimer = null;
    }
    
    meditationTime = 0;
    currentStep = 1;
    
    const startBtn = document.querySelector('.btn-meditation[onclick="startMeditation()"]');
    const pauseBtn = document.querySelector('.btn-meditation[onclick="pauseMeditation()"]');
    
    startBtn.style.display = 'inline-block';
    startBtn.innerHTML = '<i class="fas fa-play"></i> Commencer';
    pauseBtn.style.display = 'none';
    
    updateMeditationDisplay();
    showCurrentStep();
}

function updateMeditationTimer() {
    meditationTime++;
    updateMeditationDisplay();
    
    // Vérifier les transitions d'étapes
    let totalTime = 0;
    for (let i = 0; i < meditationSteps.length; i++) {
        totalTime += meditationSteps[i].duration;
        if (meditationTime === totalTime - meditationSteps[i].duration + 1) {
            currentStep = i + 1;
            showCurrentStep();
            showNotification(`Étape ${currentStep}: ${meditationSteps[i].title}`, 'info');
            break;
        }
    }
    
    // Fin de la méditation
    if (meditationTime >= 1200) { // 20 minutes total
        clearInterval(meditationTimer);
        meditationTimer = null;
        showNotification('Méditation terminée. Que Dieu vous bénisse!', 'success');
        resetMeditation();
    }
}

function updateMeditationDisplay() {
    const minutes = Math.floor(meditationTime / 60);
    const seconds = meditationTime % 60;
    const timerDisplay = document.getElementById('meditationTimer');
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function showCurrentStep() {
    const steps = document.querySelectorAll('.guide-step');
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index === currentStep - 1) {
            step.classList.add('active');
        }
    });
}

function playAmbianceSound(sound) {
    // Simulation des sons d'ambiance
    const sounds = {
        nature: 'Sons de la nature activés',
        rain: 'Sons de pluie activés',
        silence: 'Mode silence activé'
    };
    
    showNotification(sounds[sound] || 'Ambiance changée', 'info');
}

function setupCommunityPrayers() {
    // Les boutons sont déjà configurés dans le HTML avec onclick
    // Ici on peut ajouter des animations ou des effets supplémentaires
}

function prayFor(button) {
    const countSpan = button.querySelector('.pray-count');
    let count = parseInt(countSpan.textContent);
    
    if (!button.classList.contains('prayed')) {
        count++;
        countSpan.textContent = count;
        button.classList.add('prayed');
        
        // Animation de prière
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 150);
        
        showNotification('Merci pour votre prière! 🙏', 'success');
        
        // Effet de particules de prière
        createPrayerParticles(button);
    }
}

function encouragePrayer(button) {
    const countSpan = button.querySelector('.encourage-count');
    let count = parseInt(countSpan.textContent);
    
    if (!button.classList.contains('encouraged')) {
        count++;
        countSpan.textContent = count;
        button.classList.add('encouraged');
        
        // Animation d'encouragement
        button.style.transform = 'scale(1.1)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
        
        showNotification('Encouragement envoyé! ❤️', 'success');
    }
}

function createPrayerParticles(element) {
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.innerHTML = '🙏';
        particle.style.cssText = `
            position: absolute;
            font-size: 1.2rem;
            pointer-events: none;
            z-index: 1000;
            animation: prayerFloat 2s ease-out forwards;
        `;
        
        const rect = element.getBoundingClientRect();
        particle.style.left = (rect.left + Math.random() * rect.width) + 'px';
        particle.style.top = rect.top + 'px';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 2000);
    }
    
    // Add CSS animation
    if (!document.getElementById('prayerParticleStyle')) {
        const style = document.createElement('style');
        style.id = 'prayerParticleStyle';
        style.textContent = `
            @keyframes prayerFloat {
                0% { opacity: 1; transform: translateY(0px); }
                100% { opacity: 0; transform: translateY(-100px); }
            }
        `;
        document.head.appendChild(style);
    }
}

function loadMorePrayers() {
    const button = document.querySelector('.btn-load-more');
    const originalText = button.textContent;
    
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...';
    button.disabled = true;
    
    setTimeout(() => {
        // Simulation du chargement de nouvelles prières
        showNotification('Nouvelles prières chargées', 'info');
        button.textContent = originalText;
        button.disabled = false;
    }, 1500);
}

function setupSpiritualResources() {
    const resourceButtons = document.querySelectorAll('.btn-resource');
    
    resourceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const resourceType = this.parentElement.querySelector('h4').textContent;
            showNotification(`${resourceType} - Fonctionnalité en développement`, 'info');
            
            // Animation de clic
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Fonctions pour les actions du verset
function shareVerse() {
    const verseText = document.querySelector('.verse-text').textContent;
    const verseRef = document.querySelector('.verse-reference').textContent;
    const shareText = `${verseText} - ${verseRef}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Verset du jour',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback: copier dans le presse-papiers
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Verset copié dans le presse-papiers!', 'success');
        });
    }
}

function meditateVerse() {
    // Scroll vers la section méditation
    document.querySelector('.meditation-space').scrollIntoView({ 
        behavior: 'smooth' 
    });
    
    showNotification('Prenez un moment pour méditer ce verset...', 'info');
    
    // Highlight du verset dans la méditation
    const verseFocus = document.querySelector('.verse-focus');
    verseFocus.style.background = 'linear-gradient(135deg, #fef3c7, #fed7aa)';
    setTimeout(() => {
        verseFocus.style.background = 'linear-gradient(135deg, #f8fafc, #e2e8f0)';
    }, 3000);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
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
        backdrop-filter: blur(10px);
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