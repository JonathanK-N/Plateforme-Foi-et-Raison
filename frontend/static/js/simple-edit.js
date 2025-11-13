// Éditeur de page ultra-simple
(function() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('edit') !== 'true') return;
    
    // Attendre le chargement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        addEditIndicator();
        makeEditable();
        loadSavedChanges();
    }
    
    function addEditIndicator() {
        const indicator = document.createElement('div');
        indicator.innerHTML = '✏️ MODE ÉDITION - Cliquez sur les textes pour modifier';
        indicator.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #dc2626;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            font-weight: bold;
            cursor: pointer;
        `;
        
        indicator.onclick = () => {
            if (confirm('Quitter le mode édition?')) {
                window.location.href = window.location.pathname;
            }
        };
        
        document.body.appendChild(indicator);
    }
    
    function makeEditable() {
        const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, .hero-title, .section-title, .card-title');
        
        elements.forEach(el => {
            if (el.closest('nav') || el.closest('footer') || el.closest('script')) return;
            
            el.style.cursor = 'pointer';
            el.title = 'Cliquer pour modifier';
            
            el.addEventListener('mouseover', () => {
                el.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                el.style.outline = '2px dashed #3b82f6';
            });
            
            el.addEventListener('mouseout', () => {
                el.style.backgroundColor = '';
                el.style.outline = '';
            });
            
            el.onclick = (e) => {
                e.preventDefault();
                editElement(el);
            };
        });
    }
    
    function editElement(element) {
        const currentText = element.textContent;
        const newText = prompt('Modifier le texte:', currentText);
        
        if (newText && newText !== currentText) {
            element.textContent = newText;
            saveChange(element, newText);
            
            // Animation de confirmation
            element.style.backgroundColor = '#22c55e';
            element.style.color = 'white';
            setTimeout(() => {
                element.style.backgroundColor = '';
                element.style.color = '';
            }, 1000);
            
            alert('✓ Texte modifié et sauvegardé!');
        }
    }
    
    function saveChange(element, text) {
        const key = getElementKey(element);
        const pageKey = `edits_${window.location.pathname}`;
        
        let edits = JSON.parse(localStorage.getItem(pageKey) || '{}');
        edits[key] = text;
        localStorage.setItem(pageKey, JSON.stringify(edits));
    }
    
    function loadSavedChanges() {
        const pageKey = `edits_${window.location.pathname}`;
        const edits = JSON.parse(localStorage.getItem(pageKey) || '{}');
        
        Object.entries(edits).forEach(([key, text]) => {
            const element = findElementByKey(key);
            if (element) {
                element.textContent = text;
            }
        });
    }
    
    function getElementKey(element) {
        // Créer une clé unique basée sur la position et le contenu
        const tag = element.tagName.toLowerCase();
        const parent = element.parentElement ? element.parentElement.tagName.toLowerCase() : 'body';
        const index = Array.from(element.parentElement.children).indexOf(element);
        return `${parent}_${tag}_${index}`;
    }
    
    function findElementByKey(key) {
        const [parent, tag, index] = key.split('_');
        const parentElements = document.querySelectorAll(parent);
        
        for (let parentEl of parentElements) {
            const children = Array.from(parentEl.children);
            const element = children[parseInt(index)];
            if (element && element.tagName.toLowerCase() === tag) {
                return element;
            }
        }
        return null;
    }
})();