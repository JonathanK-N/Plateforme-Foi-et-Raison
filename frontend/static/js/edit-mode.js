// Edit Mode Script - Simple et fonctionnel
(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const editMode = urlParams.get('edit') === 'true';
    
    if (!editMode) return;
    
    document.addEventListener('DOMContentLoaded', function() {
        initEditMode();
    });
    
    function initEditMode() {
        addEditModeStyles();
        addEditModeIndicator();
        makeElementsEditable();
    }
    
    function addEditModeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .edit-indicator {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #dc2626;
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-weight: bold;
                z-index: 10000;
                cursor: pointer;
            }
            .editable:hover {
                background: rgba(59, 130, 246, 0.1) !important;
                outline: 2px dashed #3b82f6 !important;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    }
    
    function addEditModeIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'edit-indicator';
        indicator.textContent = '✏️ MODE ÉDITION';
        indicator.onclick = () => {
            if (confirm('Quitter le mode édition ?')) {
                window.location.href = window.location.pathname;
            }
        };
        document.body.appendChild(indicator);
    }
    
    function makeElementsEditable() {
        const selectors = 'h1, h2, h3, h4, h5, h6, p, .hero-title, .hero-subtitle, .section-title, .card-title, .card-text, img';
        
        document.querySelectorAll(selectors).forEach(el => {
            if (el.closest('nav') || el.closest('footer')) return;
            
            el.classList.add('editable');
            el.onclick = async (e) => {
                e.preventDefault();
                if (el.tagName === 'IMG') {
                    const newSrc = prompt('URL de la nouvelle image:', el.src);
                    if (newSrc && newSrc !== el.src) {
                        el.src = newSrc;
                        await saveToServer(el, 'image', newSrc);
                        alert('✓ Image modifiée et sauvegardée !');
                    }
                } else {
                    const newText = prompt('Nouveau texte:', el.textContent);
                    if (newText && newText !== el.textContent) {
                        el.textContent = newText;
                        await saveToServer(el, 'text', newText);
                        alert('✓ Texte modifié et sauvegardé !');
                    }
                }
            };
        });
    }
    
    async function saveToServer(element, type, value) {
        try {
            const selector = getElementId(element);
            const page = window.location.pathname;
            
            const response = await fetch('/api/save-page-change', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    page: page,
                    selector: selector,
                    type: type,
                    value: value
                })
            });
            
            const result = await response.json();
            if (!result.success) {
                console.error('Erreur sauvegarde:', result.error);
            }
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
        }
    }
    
    function getElementId(element) {
        if (element.id) return element.id;
        
        // Générer un ID unique basé sur le contenu
        const text = element.textContent || element.src || '';
        return 'edit_' + text.substring(0, 20).replace(/\s+/g, '_').toLowerCase();
    }
    
    // Charger les modifications au démarrage
    async function loadServerChanges() {
        try {
            const page = window.location.pathname === '/' ? 'home' : window.location.pathname.substring(1);
            const response = await fetch(`/api/get-page-changes/${page}`);
            const changes = await response.json();
            
            Object.entries(changes).forEach(([selector, change]) => {
                const element = document.getElementById(selector) || 
                               document.querySelector(`[data-edit-id="${selector}"]`);
                if (element) {
                    if (change.type === 'text') {
                        element.textContent = change.value;
                    } else if (change.type === 'image') {
                        element.src = change.value;
                    }
                }
            });
        } catch (error) {
            console.error('Erreur chargement:', error);
        }
    }
    
    // Charger les modifications au démarrage
    document.addEventListener('DOMContentLoaded', loadServerChanges);
    
    function makeElementsEditable() {
        const selectors = 'h1, h2, h3, h4, h5, h6, p, .hero-title, .hero-subtitle, .section-title, .card-title, .card-text, img';
        
        document.querySelectorAll(selectors).forEach(el => {
            if (el.closest('nav') || el.closest('footer')) return;
            
            el.classList.add('editable');
            
            // Ajouter un ID unique si nécessaire
            if (!el.id) {
                el.setAttribute('data-edit-id', getElementId(el));
            }
            
            el.onclick = async (e) => {
                e.preventDefault();
                if (el.tagName === 'IMG') {
                    const newSrc = prompt('URL de la nouvelle image:', el.src);
                    if (newSrc && newSrc !== el.src) {
                        el.src = newSrc;
                        await saveToServer(el, 'image', newSrc);
                        alert('✓ Image modifiée et sauvegardée !');
                    }
                } else {
                    const newText = prompt('Nouveau texte:', el.textContent);
                    if (newText && newText !== el.textContent) {
                        el.textContent = newText;
                        await saveToServer(el, 'text', newText);
                        alert('✓ Texte modifié et sauvegardé !');
                    }
                }
            };
        });
    }
})();