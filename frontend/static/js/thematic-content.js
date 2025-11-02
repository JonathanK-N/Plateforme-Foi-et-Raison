// Module de gestion des contenus thématiques - Croire & Penser

// Contenus thématiques organisés selon le plan
const thematicContent = {
    // Thèmes principaux à partir de 2026
    themes: {
        dieu: {
            title: "Dieu",
            icon: "fas fa-infinity",
            questions: [
                "Comment pouvons-nous être sûrs de l'existence de Dieu ?",
                "Le monothéisme est-il une évolution du polythéisme ?",
                "Pourquoi Dieu est-il invisible ?",
                "Pourquoi parler de la trinité alors que le terme n'apparait pas dans la Bible ?",
                "Peut-on vraiment comprendre Dieu ?",
                "La théorie de l'évolution et la foi chrétienne sont-elles compatibles ?",
                "Qu'est-ce que cela signifie être Dieu ?"
            ]
        },
        bible: {
            title: "Bible",
            icon: "fas fa-book",
            questions: [
                "En quoi un livre vieux de 2000 ans peut-il me concerner ?",
                "Pourquoi est-ce que ce sont de simples hommes, pécheurs qui ont écrit la Bible et pourquoi leur faire confiance ?",
                "La Bible est-elle entièrement vraie ?",
                "Pourquoi certains livres sont-ils absents de certaines Bibles ?",
                "Qui a introduit les numéros de verset ?"
            ]
        },
        mondeInvisible: {
            title: "Le monde invisible",
            icon: "fas fa-eye-slash",
            questions: [
                "Y a-t-il plusieurs sortes d'anges ?",
                "Y a-t-il des esprits territoriaux, et qu'est-ce que ça change d'y croire ou pas ?",
                "Les astres exercent-ils une influence sur notre vie ?"
            ]
        },
        etreHumain: {
            title: "L'être humain",
            icon: "fas fa-user",
            questions: [
                "Est-ce que tout être vivant a une âme ?",
                "Que penser du clonage ?",
                "La foi n'est-elle pas une béquille pour les faibles ?",
                "Que penser de la vente ou du don d'organes ?",
                "Où est la responsabilité de l'homme, si Dieu est tout puissant ?"
            ]
        },
        mal: {
            title: "Le mal",
            icon: "fas fa-exclamation-triangle",
            questions: [
                "D'où vient le mal ?",
                "Pourquoi Dieu permet-il que le mal blesse ceux qui ne sont pas responsables ou encore ceux qui croient en lui ?"
            ]
        },
        jesusChrist: {
            title: "Jésus-Christ",
            icon: "fas fa-cross",
            questions: [
                "Jésus a-t-il vraiment existé ?",
                "Jésus est-il né en l'an 0 ?",
                "Comment peut-on dire que Jésus était à la fois Dieu et l'homme ?",
                "Le Jésus de l'histoire et le Jésus de la foi sont-ils un seul et même homme ?",
                "Mort et résurrection de Jésus : faux semblant et canular ?",
                "Le tombeau de Jésus était-il vraiment vide ?",
                "A-t-on revu Jésus vivant, après sa mort sur la croix ?"
            ]
        },
        saintEsprit: {
            title: "Le Saint Esprit",
            icon: "fas fa-dove",
            questions: [
                "Qui est le Saint-Esprit ?",
                "Pourquoi n'y a-t-il pas autant de miracles de nos jours ?",
                "Les dons spirituels existent-ils encore ?"
            ]
        },
        salut: {
            title: "Le Salut",
            icon: "fas fa-heart",
            questions: [
                "Pourquoi adopter la foi chrétienne plutôt que les autres religions ?",
                "Peut-on penser que nous serons tous sauvés ?",
                "Est-ce qu'on peut perdre le salut ?",
                "Est-ce que Dieu a décidé qui deviendrait chrétien avant notre naissance ?"
            ]
        },
        eglise: {
            title: "L'Église",
            icon: "fas fa-church",
            questions: [
                "Qu'est-ce que l'Eglise, d'après la Bible ?",
                "Pourquoi faire le culte le dimanche et pas le samedi ?",
                "Le chrétien doit-il chercher à changer la société ?",
                "D'où vient le signe de croix et que signifie-t-il ?"
            ]
        },
        fin: {
            title: "La fin",
            icon: "fas fa-hourglass-end",
            questions: [
                "Y a-t-il sept cieux ?",
                "Qu'est-ce que le séjour des morts ? Allons-nous y aller ?",
                "Quel est le sort des bébés morts ?",
                "Est-il possible de sortir de l'enfer ?",
                "Peut-on vraiment être heureux au paradis en sachant que certains sont en enfer ?"
            ]
        },
        ethique: {
            title: "Éthique",
            icon: "fas fa-balance-scale",
            questions: [
                "La contraception est-elle un péché ?",
                "Doit-on toujours dire la vérité ?",
                "Comment blâmer l'inceste quand il y a eu des cas d'inceste dans la Bible ?",
                "La Bible incite-t-elle au racisme ?",
                "Est-ce mal de se faire des piercings et des tatouages ?",
                "Puis-je modifier mon corps par la chirurgie esthétique ?",
                "Une fille qui tombe enceinte après un viol peut-elle avorter ?"
            ]
        }
    },

    // Livres de référence
    references: [
        "Pour une foi réfléchie",
        "Jésus l'enquête",
        "L'évangile tout l'évangile et rien que l'Evangile",
        "On parie combien ?",
        "Darwin a-t-il tué Dieu ?",
        "Dieu, science et preuves"
    ],

    // Formats de contenu
    formats: {
        video: "Enseignement vidéo",
        podcast: "Méditation audio",
        article: "Réflexion écrite",
        study: "Étude biblique",
        webinar: "Conférence en ligne"
    }
};

// Affichage des contenus thématiques
function showThematicContent() {
    hideAllPages();
    
    let thematicPage = document.getElementById('thematicPage');
    if (!thematicPage) {
        thematicPage = document.createElement('div');
        thematicPage.id = 'thematicPage';
        thematicPage.className = 'd-none';
        
        thematicPage.innerHTML = `
            <!-- Hero Section Thématique -->
            <div class="thematic-hero">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col-lg-6">
                            <h1 class="display-4 fw-bold text-white mb-4">
                                Explorez les grandes questions
                            </h1>
                            <p class="lead text-white mb-4">
                                "Amener les croyants à penser, et les penseurs à croire"
                            </p>
                            <p class="text-white-75 mb-4">
                                Découvrez nos contenus organisés par thématiques pour approfondir votre foi et votre réflexion.
                            </p>
                        </div>
                        <div class="col-lg-6 text-center">
                            <div class="hero-symbols">
                                <i class="fas fa-book text-white" style="font-size: 4rem; opacity: 0.8; margin: 0 1rem;"></i>
                                <i class="fas fa-plus text-white" style="font-size: 2rem; opacity: 0.6;"></i>
                                <i class="fas fa-lightbulb text-white" style="font-size: 4rem; opacity: 0.8; margin: 0 1rem;"></i>
                            </div>
                            <p class="text-white-50 mt-3 fst-italic">La lampe et le livre</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Grille des thèmes -->
            <div class="container py-5">
                <div class="row mb-5">
                    <div class="col-12 text-center">
                        <h2 class="section-title">Thématiques principales</h2>
                        <p class="section-subtitle">Explorez les grandes questions de la foi chrétienne</p>
                    </div>
                </div>
                
                <div class="row g-4" id="themesGrid">
                    <!-- Thèmes générés dynamiquement -->
                </div>
            </div>

            <!-- Section références -->
            <div class="references-section py-5 bg-light">
                <div class="container">
                    <div class="row">
                        <div class="col-12 text-center mb-4">
                            <h3>Nos références</h3>
                            <p class="text-muted">Livres et ressources qui nourrissent notre réflexion</p>
                        </div>
                    </div>
                    <div class="row g-3" id="referencesGrid">
                        <!-- Références générées dynamiquement -->
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.container-fluid').appendChild(thematicPage);
    }
    
    // Générer la grille des thèmes
    generateThemesGrid();
    generateReferencesGrid();
    
    thematicPage.classList.remove('d-none');
}

// Génération de la grille des thèmes
function generateThemesGrid() {
    const themesGrid = document.getElementById('themesGrid');
    if (!themesGrid) return;
    
    themesGrid.innerHTML = '';
    
    Object.entries(thematicContent.themes).forEach(([key, theme]) => {
        const themeCard = document.createElement('div');
        themeCard.className = 'col-lg-4 col-md-6 mb-4';
        
        themeCard.innerHTML = `
            <div class="theme-card h-100" onclick="showThemeDetail('${key}')">
                <div class="theme-icon">
                    <i class="${theme.icon}"></i>
                </div>
                <h4 class="theme-title">${theme.title}</h4>
                <p class="theme-count">${theme.questions.length} questions</p>
                <div class="theme-preview">
                    <small class="text-muted">${theme.questions[0]}</small>
                </div>
                <div class="theme-action">
                    <i class="fas fa-arrow-right"></i>
                </div>
            </div>
        `;
        
        themesGrid.appendChild(themeCard);
    });
}

// Génération de la grille des références
function generateReferencesGrid() {
    const referencesGrid = document.getElementById('referencesGrid');
    if (!referencesGrid) return;
    
    referencesGrid.innerHTML = '';
    
    thematicContent.references.forEach(reference => {
        const referenceCard = document.createElement('div');
        referenceCard.className = 'col-lg-4 col-md-6 mb-3';
        
        referenceCard.innerHTML = `
            <div class="reference-card">
                <i class="fas fa-book-open me-2"></i>
                <span>${reference}</span>
            </div>
        `;
        
        referencesGrid.appendChild(referenceCard);
    });
}

// Affichage du détail d'un thème
function showThemeDetail(themeKey) {
    const theme = thematicContent.themes[themeKey];
    if (!theme) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="${theme.icon} me-2"></i>${theme.title}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="theme-detail">
                        <p class="lead mb-4">Questions explorées dans cette thématique :</p>
                        <div class="questions-list">
                            ${theme.questions.map(question => `
                                <div class="question-item">
                                    <i class="fas fa-question-circle text-primary me-2"></i>
                                    <span>${question}</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="mt-4 p-3 bg-light rounded">
                            <h6><i class="fas fa-info-circle me-2"></i>Contenus disponibles</h6>
                            <p class="mb-2 text-muted">Cette thématique sera développée avec :</p>
                            <ul class="list-unstyled mb-0">
                                <li><i class="fas fa-video me-2 text-primary"></i>Vidéos d'enseignement</li>
                                <li><i class="fas fa-podcast me-2 text-success"></i>Podcasts de réflexion</li>
                                <li><i class="fas fa-book-open me-2 text-info"></i>Articles approfondis</li>
                                <li><i class="fas fa-users me-2 text-warning"></i>Discussions communautaires</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-primary" onclick="showQuestions()">
                        <i class="fas fa-comments me-2"></i>Rejoindre les discussions
                    </button>
                    <button type="button" class="btn btn-primary" onclick="subscribeToTheme('${themeKey}')">
                        <i class="fas fa-bell me-2"></i>Être notifié des nouveaux contenus
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bootstrapModal = new bootstrap.Modal(modal);
    bootstrapModal.show();
    
    modal.addEventListener('hidden.bs.modal', () => {
        modal.remove();
    });
}

// Abonnement aux notifications d'un thème
function subscribeToTheme(themeKey) {
    const theme = thematicContent.themes[themeKey];
    showAlert(`Vous serez notifié des nouveaux contenus sur "${theme.title}"`, 'success');
}

// Mise à jour du contenu principal pour intégrer les thématiques
function updateMainContentWithThematics() {
    // Ajouter un lien vers les contenus thématiques dans la navigation
    const resourcesMenu = document.querySelector('.mega-menu');
    if (resourcesMenu) {
        const thematicLink = document.createElement('li');
        thematicLink.innerHTML = `
            <a href="#" onclick="showThematicContent(); return false;">
                <i class="fas fa-lightbulb me-2"></i>Contenus thématiques
            </a>
        `;
        
        // Ajouter dans la section "Étudier"
        const studySection = resourcesMenu.querySelector('.mega-list');
        if (studySection) {
            studySection.appendChild(thematicLink);
        }
    }
}

// Initialisation des contenus thématiques
document.addEventListener('DOMContentLoaded', function() {
    updateMainContentWithThematics();
});

// Export des fonctions globales
window.showThematicContent = showThematicContent;
window.showThemeDetail = showThemeDetail;
window.subscribeToTheme = subscribeToTheme;