// ÉDITEUR FINAL - SOLUTION DÉFINITIVE
console.log('Éditeur chargé');

// Vérifier si on est en mode édition
const urlParams = new URLSearchParams(window.location.search);
const isEditMode = urlParams.get('edit') === 'true';

console.log('Mode édition:', isEditMode);

if (!isEditMode) {
    console.log('Pas en mode édition, arrêt');
} else {
    // Attendre le chargement complet
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startEdit);
    } else {
        startEdit();
    }
}

function startEdit() {
    console.log('Démarrage mode édition');
    
    // Ajouter l'indicateur
    addIndicator();
    
    // Rendre les éléments éditables
    makeEditable();
    
    // Charger les modifications sauvegardées
    loadChanges();
}

function addIndicator() {
    const indicator = document.createElement('div');
    indicator.innerHTML = '✏️ MODE ÉDITION - Cliquez pour modifier';
    indicator.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #dc2626;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 99999;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
    `;
    
    indicator.onclick = () => {
        if (confirm('Quitter le mode édition?')) {
            window.location.href = window.location.pathname;
        }
    };
    
    document.body.appendChild(indicator);
    console.log('Indicateur ajouté');
}

function makeEditable() {
    // Sélecteurs d'éléments éditables
    const selectors = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'p', 'span:not(.fas):not(.fab)',
        '.hero-title', '.hero-subtitle',
        '.section-title', '.section-subtitle',
        '.card-title', '.card-text',
        '.feature-title', '.feature-description'
    ];
    
    let editableCount = 0;
    
    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            // Ignorer les éléments dans nav, footer, script
            if (element.closest('nav') || 
                element.closest('footer') || 
                element.closest('script') ||
                element.closest('.edit-indicator')) {
                return;
            }
            
            // Ignorer les éléments vides ou très courts
            const text = element.textContent.trim();
            if (text.length < 2) return;
            
            makeElementEditable(element);
            editableCount++;
        });
    });
    
    console.log(`${editableCount} éléments rendus éditables`);
}

function makeElementEditable(element) {
    // Styles de survol
    element.style.cursor = 'pointer';
    element.title = 'Cliquer pour modifier ce texte';
    
    // Événements
    element.addEventListener('mouseenter', () => {
        element.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
        element.style.outline = '2px dashed #3b82f6';
        element.style.outlineOffset = '2px';
    });
    
    element.addEventListener('mouseleave', () => {
        element.style.backgroundColor = '';
        element.style.outline = '';
        element.style.outlineOffset = '';
    });
    
    // Clic pour éditer
    element.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        editElement(element);
    });
}

function editElement(element) {
    const currentText = element.textContent.trim();
    console.log('Édition de:', currentText);
    
    const newText = prompt('Modifier le texte:', currentText);
    
    if (newText !== null && newText.trim() !== currentText) {
        // Appliquer le changement
        element.textContent = newText.trim();
        
        // Sauvegarder
        saveChange(element, newText.trim());
        
        // Animation de confirmation
        element.style.backgroundColor = '#22c55e';
        element.style.color = 'white';
        element.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            element.style.backgroundColor = '';
            element.style.color = '';
        }, 1500);
        
        console.log('Texte modifié et sauvegardé');
        alert('✓ Modification sauvegardée!');
    }
}

function saveChange(element, text) {
    try {
        const key = getElementKey(element);
        const pageKey = `edits_${window.location.pathname}`;
        
        let edits = {};
        try {
            edits = JSON.parse(localStorage.getItem(pageKey) || '{}');
        } catch (e) {
            console.log('Erreur parsing localStorage:', e);
        }
        
        edits[key] = text;
        localStorage.setItem(pageKey, JSON.stringify(edits));
        
        console.log('Sauvegardé:', key, '=', text);
    } catch (error) {
        console.error('Erreur sauvegarde:', error);
    }
}

function loadChanges() {
    try {
        const pageKey = `edits_${window.location.pathname}`;
        const edits = JSON.parse(localStorage.getItem(pageKey) || '{}');
        
        let loadedCount = 0;
        
        Object.entries(edits).forEach(([key, text]) => {
            const element = findElementByKey(key);
            if (element) {
                element.textContent = text;
                loadedCount++;
            }
        });
        
        if (loadedCount > 0) {
            console.log(`${loadedCount} modifications chargées`);
        }
    } catch (error) {
        console.error('Erreur chargement:', error);
    }
}

function getElementKey(element) {
    // Créer une clé unique
    const tag = element.tagName.toLowerCase();
    const text = element.textContent.trim().substring(0, 30);
    const parent = element.parentElement ? element.parentElement.tagName.toLowerCase() : 'body';
    
    // Position dans le parent
    let index = 0;
    if (element.parentElement) {
        const siblings = Array.from(element.parentElement.children);
        index = siblings.indexOf(element);
    }
    
    return `${parent}_${tag}_${index}_${text.replace(/\s+/g, '_')}`;
}

function findElementByKey(key) {
    // Essayer de retrouver l'élément par sa clé
    const parts = key.split('_');
    if (parts.length < 4) return null;
    
    const parent = parts[0];
    const tag = parts[1];
    const index = parseInt(parts[2]);
    
    const parentElements = document.querySelectorAll(parent);
    
    for (let parentEl of parentElements) {
        const children = Array.from(parentEl.children);
        const element = children[index];
        
        if (element && element.tagName.toLowerCase() === tag) {
            return element;
        }
    }
    
    return null;
}

console.log('Éditeur initialisé');