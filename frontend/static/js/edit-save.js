// Système de sauvegarde pour le mode édition
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('edit') !== 'true') return;
    
    // Stockage local des modifications
    const pageKey = `edit_${window.location.pathname}`;
    
    // Charger les modifications sauvegardées
    function loadSavedChanges() {
        const saved = localStorage.getItem(pageKey);
        if (saved) {
            const changes = JSON.parse(saved);
            changes.forEach(change => {
                const element = document.querySelector(change.selector);
                if (element) {
                    if (change.type === 'text') {
                        element.textContent = change.value;
                    } else if (change.type === 'image') {
                        element.src = change.value;
                    }
                }
            });
        }
    }
    
    // Sauvegarder une modification
    function saveChange(element, type, value) {
        let changes = [];
        const saved = localStorage.getItem(pageKey);
        if (saved) {
            changes = JSON.parse(saved);
        }
        
        const selector = getElementSelector(element);
        const existingIndex = changes.findIndex(c => c.selector === selector);
        
        if (existingIndex >= 0) {
            changes[existingIndex] = { selector, type, value };
        } else {
            changes.push({ selector, type, value });
        }
        
        localStorage.setItem(pageKey, JSON.stringify(changes));
    }
    
    // Générer un sélecteur unique pour un élément
    function getElementSelector(element) {
        if (element.id) return `#${element.id}`;
        if (element.className) return `.${element.className.split(' ')[0]}`;
        
        let path = [];
        while (element.parentNode) {
            let selector = element.tagName.toLowerCase();
            if (element.id) {
                selector += `#${element.id}`;
                path.unshift(selector);
                break;
            }
            if (element.className) {
                selector += `.${element.className.split(' ')[0]}`;
            }
            
            let sibling = element;
            let nth = 1;
            while (sibling = sibling.previousElementSibling) {
                if (sibling.tagName.toLowerCase() === element.tagName.toLowerCase()) nth++;
            }
            if (nth > 1) selector += `:nth-of-type(${nth})`;
            
            path.unshift(selector);
            element = element.parentNode;
        }
        return path.join(' > ');
    }
    
    // Exposer les fonctions globalement
    window.editSave = {
        saveChange: saveChange,
        loadSavedChanges: loadSavedChanges
    };
    
    // Charger automatiquement au démarrage
    document.addEventListener('DOMContentLoaded', loadSavedChanges);
})();