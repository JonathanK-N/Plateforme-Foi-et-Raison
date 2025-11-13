// Éditeur Simple - Avec persistance
console.log('🔧 Éditeur Simple chargé');

let modifications = {};

function initSimpleEditor() {
    if (!window.location.search.includes('edit=true')) return;
    
    console.log('✅ Mode édition activé');
    
    // Charger les modifications existantes
    loadExistingChanges();
    
    // Rendre les éléments éditables
    document.querySelectorAll('h1, h2, h3, p, .btn').forEach((el, index) => {
        if (el.textContent.trim()) {
            el.style.border = '2px dashed #d97706';
            el.style.cursor = 'pointer';
            el.title = 'Cliquer pour éditer';
            el.setAttribute('data-edit-id', `element_${index}`);
            
            el.addEventListener('click', function(e) {
                e.preventDefault();
                editElement(this, index);
            });
        }
    });
    
    // Bouton de sauvegarde
    const saveBtn = document.createElement('div');
    saveBtn.innerHTML = '💾 SAUVEGARDER';
    saveBtn.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        background: #d97706; color: white; padding: 15px 25px;
        border-radius: 25px; cursor: pointer; font-weight: bold;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    `;
    saveBtn.onclick = saveToServer;
    document.body.appendChild(saveBtn);
}

function editElement(element, index) {
    const currentText = element.textContent;
    const newText = prompt('Modifier le texte:', currentText);
    
    if (newText && newText !== currentText) {
        element.textContent = newText;
        modifications[`element_${index}`] = newText;
        console.log('✅ Modifié:', newText);
        
        // Marquer comme modifié
        element.style.backgroundColor = '#fef3c7';
        element.style.borderColor = '#10b981';
        
        // Sauvegarder immédiatement
        fetch('/api/save-page-change', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                page: window.location.pathname,
                selector: element.tagName.toLowerCase(),
                type: 'text',
                value: newText
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('💾 Auto-sauvegardé:', newText);
            }
        });
    }
}

function loadExistingChanges() {
    const pagePath = window.location.pathname === '/' ? 'home' : window.location.pathname.substring(1);
    
    fetch(`/api/get-page-changes/${pagePath}`)
        .then(response => response.json())
        .then(changes => {
            console.log('📥 Modifications chargées:', changes);
            
            Object.keys(changes).forEach(selector => {
                const change = changes[selector];
                const elements = document.querySelectorAll(selector);
                
                elements.forEach(el => {
                    if (change.type === 'text') {
                        el.textContent = change.value;
                        console.log('✅ Appliqué:', selector, change.value);
                    }
                });
            });
        })
        .catch(err => console.error('❌ Erreur chargement:', err));
}

function saveToServer() {
    alert('✅ Modifications déjà sauvegardées automatiquement!');
    modifications = {};
    
    // Retirer les indicateurs visuels
    document.querySelectorAll('[style*="background-color"]').forEach(el => {
        el.style.backgroundColor = '';
        el.style.borderColor = '#d97706';
    });
}

// Initialiser quand le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSimpleEditor);
} else {
    initSimpleEditor();
}