// Gestion du contenu thématique selon le plan de contenu

class ThematicContentManager {
    constructor() {
        this.categories = [];
        this.currentContent = [];
        this.init();
    }

    async init() {
        await this.loadCategories();
        this.setupEventListeners();
    }

    async loadCategories() {
        try {
            const response = await fetch('/api/thematic/categories');
            this.categories = await response.json();
            this.renderCategoriesMenu();
        } catch (error) {
            console.error('Erreur lors du chargement des catégories:', error);
        }
    }

    async loadContent(categorySlug = null, contentType = null, featured = false) {
        try {
            let url = '/api/thematic/content?';
            const params = new URLSearchParams();
            
            if (categorySlug) params.append('category', categorySlug);
            if (contentType) params.append('type', contentType);
            if (featured) params.append('featured', 'true');
            
            const response = await fetch('/api/thematic/content?' + params.toString());
            this.currentContent = await response.json();
            this.renderContent();
        } catch (error) {
            console.error('Erreur lors du chargement du contenu:', error);
        }
    }

    renderCategoriesMenu() {
        const menuContainer = document.getElementById('thematicCategoriesMenu');
        if (!menuContainer) return;

        const menuHTML = this.categories.map(category => `
            <div class="col-md-6 col-lg-4 mb-3">
                <div class="thematic-category-card" data-category="${category.slug}">
                    <div class="category-icon">
                        <i class="${category.icon}"></i>
                    </div>
                    <h4>${category.name}</h4>
                    <p>${category.description}</p>
                    <button class="btn btn-outline-primary btn-sm" onclick="thematicManager.showCategoryContent('${category.slug}')">
                        Explorer
                    </button>
                </div>
            </div>
        `).join('');

        menuContainer.innerHTML = menuHTML;
    }

    renderContent() {
        const contentContainer = document.getElementById('thematicContentGrid');
        if (!contentContainer) return;

        if (this.currentContent.length === 0) {
            contentContainer.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-search fs-1 text-muted mb-3"></i>
                    <h3>Aucun contenu trouvé</h3>
                    <p class="text-muted">Essayez de changer les filtres ou revenez plus tard.</p>
                </div>
            `;
            return;
        }

        const contentHTML = this.currentContent.map(content => `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="thematic-content-card h-100">
                    ${content.featured_image ? `
                        <div class="content-image">
                            <img src="${content.featured_image}" alt="${content.title}" class="img-fluid">
                        </div>
                    ` : ''}
                    <div class="content-body p-3">
                        <div class="content-meta mb-2">
                            <span class="badge bg-primary">${this.getContentTypeLabel(content.content_type)}</span>
                            ${content.reading_time ? `<span class="text-muted ms-2"><i class="fas fa-clock"></i> ${content.reading_time} min</span>` : ''}
                        </div>
                        <h5 class="content-title">${content.title}</h5>
                        <p class="content-excerpt text-muted">${content.excerpt || ''}</p>
                        <div class="content-stats d-flex justify-content-between align-items-center">
                            <small class="text-muted">
                                <i class="fas fa-eye"></i> ${content.views}
                                <i class="fas fa-heart ms-2"></i> ${content.likes}
                            </small>
                            <button class="btn btn-sm btn-outline-primary" onclick="thematicManager.showContentDetail('${content.slug}')">
                                Lire
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');

        contentContainer.innerHTML = contentHTML;
    }

    getContentTypeLabel(type) {
        const labels = {
            'article': 'Article',
            'video': 'Vidéo',
            'podcast': 'Podcast',
            'study': 'Étude',
            'carrousel': 'Carrousel',
            'teaser': 'Teaser'
        };
        return labels[type] || type;
    }

    async showCategoryContent(categorySlug) {
        // Afficher la page de contenu thématique
        this.showThematicPage();
        
        // Charger le contenu de la catégorie
        await this.loadContent(categorySlug);
        
        // Mettre à jour le titre de la page
        const category = this.categories.find(c => c.slug === categorySlug);
        if (category) {
            const titleElement = document.getElementById('thematicPageTitle');
            if (titleElement) {
                titleElement.innerHTML = `<i class="${category.icon} me-2"></i>${category.name}`;
            }
        }
    }

    async showContentDetail(slug) {
        try {
            const response = await fetch(`/api/thematic/content/${slug}`);
            const content = await response.json();
            this.renderContentDetail(content);
        } catch (error) {
            console.error('Erreur lors du chargement du contenu:', error);
        }
    }

    renderContentDetail(content) {
        // Créer une modal ou une page dédiée pour afficher le contenu complet
        const modalHTML = `
            <div class="modal fade" id="contentDetailModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${content.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="content-meta mb-3">
                                <span class="badge bg-primary">${this.getContentTypeLabel(content.content_type)}</span>
                                ${content.reading_time ? `<span class="text-muted ms-2"><i class="fas fa-clock"></i> ${content.reading_time} min</span>` : ''}
                                <span class="text-muted ms-2"><i class="fas fa-eye"></i> ${content.views}</span>
                            </div>
                            ${content.featured_image ? `<img src="${content.featured_image}" alt="${content.title}" class="img-fluid mb-3">` : ''}
                            <div class="content-text">
                                ${content.content}
                            </div>
                            ${content.biblical_references && content.biblical_references.length > 0 ? `
                                <div class="biblical-references mt-4">
                                    <h6><i class="fas fa-book me-2"></i>Références bibliques</h6>
                                    ${content.biblical_references.map(ref => `
                                        <div class="biblical-ref mb-2 p-2 bg-light rounded">
                                            <strong>${ref.book} ${ref.chapter}:${ref.verse_start}${ref.verse_end ? '-' + ref.verse_end : ''}</strong>
                                            ${ref.text ? `<p class="mb-0 mt-1">"${ref.text}"</p>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Fermer</button>
                            <button type="button" class="btn btn-primary" onclick="thematicManager.likeContent(${content.id})">
                                <i class="fas fa-heart"></i> J'aime
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Supprimer l'ancienne modal si elle existe
        const existingModal = document.getElementById('contentDetailModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Ajouter la nouvelle modal
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Afficher la modal
        const modal = new bootstrap.Modal(document.getElementById('contentDetailModal'));
        modal.show();
    }

    showThematicPage() {
        // Masquer toutes les autres pages
        document.querySelectorAll('.page-content').forEach(page => {
            page.classList.add('d-none');
        });

        // Afficher la page thématique
        const thematicPage = document.getElementById('thematicPage');
        if (thematicPage) {
            thematicPage.classList.remove('d-none');
        }
    }

    setupEventListeners() {
        // Filtres de contenu
        const typeFilter = document.getElementById('contentTypeFilter');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.loadContent(null, e.target.value);
            });
        }

        // Newsletter
        const newsletterForms = document.querySelectorAll('.newsletter-form');
        newsletterForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.subscribeNewsletter(form);
            });
        });
    }

    async subscribeNewsletter(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;

        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showNotification('Inscription réussie à la newsletter !', 'success');
                emailInput.value = '';
            } else {
                this.showNotification(result.message, 'warning');
            }
        } catch (error) {
            this.showNotification('Erreur lors de l\'inscription', 'error');
        }
    }

    async likeContent(contentId) {
        // Implémentation du système de likes
        try {
            const response = await fetch(`/api/thematic/content/${contentId}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.ok) {
                this.showNotification('Merci pour votre appréciation !', 'success');
            }
        } catch (error) {
            console.error('Erreur lors du like:', error);
        }
    }

    showNotification(message, type = 'info') {
        // Système de notifications simple
        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-suppression après 5 secondes
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Méthodes pour les différents formats de contenu selon le plan
    renderCarrouselContent(contents) {
        // Rendu spécial pour les carrousels interactifs
        return contents.filter(c => c.format_type === 'carrousel').map(content => `
            <div class="carousel-slide">
                <h3>${content.title}</h3>
                <p>${content.excerpt}</p>
                <button class="btn btn-primary" onclick="thematicManager.showContentDetail('${content.slug}')">
                    En savoir plus
                </button>
            </div>
        `).join('');
    }

    renderTeaserContent(contents) {
        // Rendu pour les teasers vidéo
        return contents.filter(c => c.format_type === 'teaser').map(content => `
            <div class="teaser-card">
                <div class="teaser-video">
                    <i class="fas fa-play-circle"></i>
                </div>
                <h4>${content.title}</h4>
                <p>${content.excerpt}</p>
            </div>
        `).join('');
    }
}

// Initialisation
let thematicManager;
document.addEventListener('DOMContentLoaded', () => {
    thematicManager = new ThematicContentManager();
});

// Fonctions globales pour la compatibilité
function showThematicContent(categorySlug) {
    if (thematicManager) {
        thematicManager.showCategoryContent(categorySlug);
    }
}

function loadFeaturedContent() {
    if (thematicManager) {
        thematicManager.loadContent(null, null, true);
    }
}