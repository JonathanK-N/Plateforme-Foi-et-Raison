// Test simple pour vérifier si JavaScript fonctionne
console.log('JavaScript chargé correctement');

// Test Bootstrap
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM chargé');
    console.log('Bootstrap disponible:', typeof bootstrap !== 'undefined');
    
    // Test simple d'ouverture de modal
    window.testModal = function() {
        console.log('Test modal appelé');
        const modal = document.getElementById('registerModal');
        if (modal) {
            console.log('Modal trouvée');
            try {
                new bootstrap.Modal(modal).show();
                console.log('Modal ouverte avec succès');
            } catch (error) {
                console.error('Erreur ouverture modal:', error);
            }
        } else {
            console.error('Modal non trouvée');
        }
    };
});