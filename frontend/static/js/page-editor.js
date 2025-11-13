// ULTRA SIMPLE - juste pour que ça marche
console.log('🔧 Page Editor ULTRA SIMPLE chargé');

// Au chargement, restaurer le titre sauvegardé
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Chargement des modifications...');
    
    const savedTitle = localStorage.getItem('hero_title');
    if (savedTitle) {
        const heroTitle = document.querySelector('.hero-title');
        if (heroTitle) {
            heroTitle.textContent = savedTitle;
            console.log('✅ Titre restauré:', savedTitle);
        }
    }
});

// Fonction globale pour tester
window.testEdit = function() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const newTitle = prompt('Nouveau titre:', heroTitle.textContent);
        if (newTitle && newTitle.trim()) {
            heroTitle.textContent = newTitle;
            localStorage.setItem('hero_title', newTitle);
            alert('✅ Sauvegardé ! Rechargez la page pour tester.');
        }
    } else {
        alert('❌ Élément .hero-title non trouvé');
    }
};

console.log('✅ Page Editor prêt');