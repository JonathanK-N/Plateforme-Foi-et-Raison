// Module de gestion des prières

// Affichage de la page des prières
function showPrayers() {
    hideAllPages();
    
    // Créer la page des prières si elle n'existe pas
    let prayersPage = document.getElementById('prayersPage');
    if (!prayersPage) {
        prayersPage = document.createElement('div');
        prayersPage.id = 'prayersPage';
        prayersPage.className = 'd-none';
        
        prayersPage.innerHTML = `
            <!-- Hero Section Prières -->
            <div class="hero-section-prayers">
                <div class="hero-bg"></div>
                <div class="container position-relative">
                    <div class="row justify-content-center text-center text-white py-5">
                        <div class="col-lg-8">
                            <i class="fas fa-praying-hands mb-4" style="font-size: 4rem;"></i>
                            <h1 class="display-3 fw-bold mb-4">Espace de Prière</h1>
                            <p class="lead fs-5 mb-4">Trouvez la paix et la communion avec Dieu dans cet espace sacré</p>
                            <div class="hero-verse p-3 bg-white bg-opacity-10 rounded">
                                <p class="mb-2 fst-italic">"Priez sans cesse. Rendez grâces en toutes choses."</p>
                                <small class="text-light">1 Thessaloniciens 5:17-18</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Contenu Principal - Espace de Prière Uniquement -->
            <div class="container py-5">
                <!-- Prières du jour -->
                <div class="row mb-5">
                    <div class="col-12">
                        <div class="prayer-section-card">
                            <div class="row align-items-center">
                                <div class="col-md-2 text-center">
                                    <div class="prayer-main-icon">
                                        <i class="fas fa-sun"></i>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <h3 class="text-primary mb-2">Prières Quotidiennes</h3>
                                    <p class="text-muted">Commencez et terminez votre journée dans la communion avec Dieu</p>
                                </div>
                                <div class="col-md-6">
                                    <div class="row g-2">
                                        <div class="col-md-4">
                                            <button class="btn btn-outline-primary w-100 prayer-btn" onclick="showPrayer('morning')">
                                                <i class="fas fa-sunrise d-block mb-1"></i>
                                                <small>Matin</small>
                                            </button>
                                        </div>
                                        <div class="col-md-4">
                                            <button class="btn btn-outline-primary w-100 prayer-btn" onclick="showPrayer('evening')">
                                                <i class="fas fa-moon d-block mb-1"></i>
                                                <small>Soir</small>
                                            </button>
                                        </div>
                                        <div class="col-md-4">
                                            <button class="btn btn-outline-primary w-100 prayer-btn" onclick="showPrayer('meal')">
                                                <i class="fas fa-utensils d-block mb-1"></i>
                                                <small>Repas</small>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Prières spéciales -->
                <div class="row mb-5">
                    <div class="col-12">
                        <div class="prayer-section-card">
                            <div class="row align-items-center">
                                <div class="col-md-2 text-center">
                                    <div class="prayer-main-icon">
                                        <i class="fas fa-heart"></i>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <h3 class="text-primary mb-2">Prières Spéciales</h3>
                                    <p class="text-muted">Pour les moments particuliers et les besoins spécifiques</p>
                                </div>
                                <div class="col-md-6">
                                    <div class="row g-2">
                                        <div class="col-md-3">
                                            <button class="btn btn-outline-primary w-100 prayer-btn" onclick="showPrayer('healing')">
                                                <i class="fas fa-hand-holding-heart d-block mb-1"></i>
                                                <small>Guérison</small>
                                            </button>
                                        </div>
                                        <div class="col-md-3">
                                            <button class="btn btn-outline-primary w-100 prayer-btn" onclick="showPrayer('guidance')">
                                                <i class="fas fa-compass d-block mb-1"></i>
                                                <small>Guidance</small>
                                            </button>
                                        </div>
                                        <div class="col-md-3">
                                            <button class="btn btn-outline-primary w-100 prayer-btn" onclick="showPrayer('gratitude')">
                                                <i class="fas fa-hands d-block mb-1"></i>
                                                <small>Gratitude</small>
                                            </button>
                                        </div>
                                        <div class="col-md-3">
                                            <button class="btn btn-outline-primary w-100 prayer-btn" onclick="showPrayer('protection')">
                                                <i class="fas fa-shield-alt d-block mb-1"></i>
                                                <small>Protection</small>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Communauté de prière -->
                <div class="row mb-5">
                    <div class="col-12">
                        <div class="prayer-section-card">
                            <div class="row align-items-center">
                                <div class="col-md-2 text-center">
                                    <div class="prayer-main-icon">
                                        <i class="fas fa-users"></i>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <h3 class="text-primary mb-2">Communauté de Prière</h3>
                                    <p class="text-muted">Rejoignez notre communauté pour prier ensemble et partager vos intentions</p>
                                </div>
                                <div class="col-md-6">
                                    <div class="row g-2">
                                        <div class="col-md-4">
                                            <button class="btn btn-outline-primary w-100 prayer-btn" onclick="showPrayerRequests()">
                                                <i class="fas fa-hands-helping d-block mb-1"></i>
                                                <small>Demandes</small>
                                            </button>
                                        </div>
                                        <div class="col-md-4">
                                            <button class="btn btn-outline-primary w-100 prayer-btn" onclick="showPrayerChain()">
                                                <i class="fas fa-link d-block mb-1"></i>
                                                <small>Chaîne</small>
                                            </button>
                                        </div>
                                        <div class="col-md-4">
                                            <button class="btn btn-outline-primary w-100 prayer-btn" onclick="showTestimonies()">
                                                <i class="fas fa-heart d-block mb-1"></i>
                                                <small>Témoignages</small>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section méditation guidée -->
                <div class="meditation-section">
                    <div class="row align-items-center">
                        <div class="col-lg-6">
                            <h3 class="text-white mb-3">Méditation Guidée</h3>
                            <p class="lead text-white opacity-75">Prenez un moment de silence pour vous connecter avec Dieu à travers la méditation chrétienne.</p>
                            <button class="btn btn-light btn-lg" onclick="startMeditation()">
                                <i class="fas fa-play me-2"></i>Commencer la Méditation
                            </button>
                        </div>
                        <div class="col-lg-6 text-center">
                            <i class="fas fa-dove text-white" style="font-size: 8rem; opacity: 0.3;"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.querySelector('.container-fluid').appendChild(prayersPage);
    }
    
    prayersPage.classList.remove('d-none');
}

// Affichage d'une prière spécifique
function showPrayer(prayerType) {
    const prayers = {
        morning: {
            title: "Prière du Matin",
            content: `
                <p class="prayer-verse">"Ce matin, Seigneur, je remets ma journée entre tes mains."</p>
                
                <div class="prayer-text">
                    <p>Père céleste,</p>
                    <p>Merci pour cette nouvelle journée que tu m'accordes. Merci pour le repos de la nuit et pour ta protection.</p>
                    <p>Je te confie cette journée qui commence. Guide mes pas, mes paroles et mes pensées. Aide-moi à être un témoin de ton amour auprès de ceux que je rencontrerai.</p>
                    <p>Donne-moi la sagesse pour prendre les bonnes décisions, la force pour surmonter les difficultés, et la joie de te servir.</p>
                    <p>Que ta volonté soit faite dans ma vie aujourd'hui.</p>
                    <p class="text-end"><em>Au nom de Jésus, Amen.</em></p>
                </div>
                
                <div class="prayer-verse mt-4">
                    <p><em>"Recommande à l'Éternel tes œuvres, et tes projets réussiront."</em></p>
                    <small class="text-muted">Proverbes 16:3</small>
                </div>
            `
        },
        evening: {
            title: "Prière du Soir",
            content: `
                <p class="prayer-verse">"Seigneur, je te rends grâce pour cette journée."</p>
                
                <div class="prayer-text">
                    <p>Père aimant,</p>
                    <p>Merci pour cette journée qui se termine. Merci pour tes bénédictions, ta présence constante et ta fidélité.</p>
                    <p>Je te demande pardon pour mes fautes, mes paroles blessantes et mes pensées impures. Purifie mon cœur, Seigneur.</p>
                    <p>Je te confie mes proches, ma famille, mes amis. Protège-les pendant la nuit et accorde-leur un sommeil paisible.</p>
                    <p>Prépare mon cœur pour demain. Que je puisse te servir avec un cœur renouvelé.</p>
                    <p class="text-end"><em>Au nom de Jésus, Amen.</em></p>
                </div>
                
                <div class="prayer-verse mt-4">
                    <p><em>"En paix je me couche et je m'endors, car toi seul, ô Éternel ! tu me donnes la sécurité dans ma demeure."</em></p>
                    <small class="text-muted">Psaume 4:8</small>
                </div>
            `
        },
        meal: {
            title: "Prière du Repas",
            content: `
                <p class="prayer-verse">"Rendez grâces en toutes choses."</p>
                
                <div class="prayer-text">
                    <p>Père céleste,</p>
                    <p>Nous te remercions pour cette nourriture que tu places devant nous.</p>
                    <p>Bénis ce repas et ceux qui l'ont préparé avec amour.</p>
                    <p>Que cette nourriture fortifie nos corps pour te servir.</p>
                    <p>Nous pensons à ceux qui n'ont pas à manger aujourd'hui, aide-nous à partager tes bénédictions.</p>
                    <p class="text-end"><em>Au nom de Jésus, Amen.</em></p>
                </div>
                
                <div class="prayer-verse mt-4">
                    <p><em>"Que vous mangiez, soit que vous buviez, soit que vous fassiez quelque autre chose, faites tout pour la gloire de Dieu."</em></p>
                    <small class="text-muted">1 Corinthiens 10:31</small>
                </div>
            `
        },
        healing: {
            title: "Prière pour la Guérison",
            content: `
                <p class="prayer-verse">"Jésus-Christ est le même hier, aujourd'hui, et éternellement."</p>
                
                <div class="prayer-text">
                    <p>Seigneur Jésus, grand médecin des âmes et des corps,</p>
                    <p>Tu as guéri les malades, consolé les affligés et redonné l'espoir aux désespérés.</p>
                    <p>Je viens à toi avec foi, portant dans mon cœur [nom de la personne] qui souffre.</p>
                    <p>Pose ta main guérisseuse sur cette situation. Apporte la guérison là où il y a la maladie, la paix là où il y a l'inquiétude.</p>
                    <p>Donne aux médecins la sagesse, aux proches la force, et à celui qui souffre l'espérance.</p>
                    <p>Que ta volonté parfaite s'accomplisse.</p>
                    <p class="text-end"><em>Au nom de Jésus, notre guérisseur, Amen.</em></p>
                </div>
                
                <div class="prayer-verse mt-4">
                    <p><em>"Mais il était blessé pour nos péchés, brisé pour nos iniquités; le châtiment qui nous donne la paix est tombé sur lui, et c'est par ses meurtrissures que nous sommes guéris."</em></p>
                    <small class="text-muted">Ésaïe 53:5</small>
                </div>
            `
        },
        guidance: {
            title: "Prière pour la Guidance",
            content: `
                <p class="prayer-verse">"Je t'instruirai et te montrerai la voie que tu dois suivre."</p>
                
                <div class="prayer-text">
                    <p>Seigneur, mon guide fidèle,</p>
                    <p>Je me trouve à un carrefour et j'ai besoin de ta sagesse.</p>
                    <p>Éclaire mon chemin, montre-moi la direction à prendre.</p>
                    <p>Donne-moi un cœur attentif à ta voix et des oreilles pour entendre tes conseils.</p>
                    <p>Que ta volonté soit ma boussole et ta parole ma lumière.</p>
                    <p>Je remets mes décisions entre tes mains, confiant en ta bonté.</p>
                    <p class="text-end"><em>Au nom de Jésus, Amen.</em></p>
                </div>
                
                <div class="prayer-verse mt-4">
                    <p><em>"Confie-toi en l'Éternel de tout ton cœur, et ne t'appuie pas sur ta sagesse; reconnais-le dans toutes tes voies, et il aplanira tes sentiers."</em></p>
                    <small class="text-muted">Proverbes 3:5-6</small>
                </div>
            `
        },
        gratitude: {
            title: "Prière de Gratitude",
            content: `
                <p class="prayer-verse">"Rendez grâces en toutes choses."</p>
                
                <div class="prayer-text">
                    <p>Père plein d'amour,</p>
                    <p>Mon cœur déborde de reconnaissance pour toutes tes bontés.</p>
                    <p>Merci pour la vie, la santé, la famille et les amis que tu m'as donnés.</p>
                    <p>Merci pour les épreuves qui m'ont fait grandir et les joies qui ont illuminé mes jours.</p>
                    <p>Merci pour ton amour inconditionnel et ta grâce qui me relève chaque jour.</p>
                    <p>Que ma vie soit un cantique de louange à ta gloire.</p>
                    <p class="text-end"><em>Au nom de Jésus, Amen.</em></p>
                </div>
                
                <div class="prayer-verse mt-4">
                    <p><em>"Rendez grâces en toutes choses, car c'est à votre égard la volonté de Dieu en Jésus-Christ."</em></p>
                    <small class="text-muted">1 Thessaloniciens 5:18</small>
                </div>
            `
        },
        protection: {
            title: "Prière de Protection",
            content: `
                <p class="prayer-verse">"L'Éternel te gardera de tout mal."</p>
                
                <div class="prayer-text">
                    <p>Dieu tout-puissant, mon refuge et ma forteresse,</p>
                    <p>Je me place sous ta protection divine.</p>
                    <p>Couvre-moi de tes ailes, entoure-moi de tes anges gardiens.</p>
                    <p>Protège ma famille, mes proches et moi-même du mal sous toutes ses formes.</p>
                    <p>Garde nos cœurs dans la paix, nos esprits dans la vérité.</p>
                    <p>Que ton bouclier nous accompagne partout où nous allons.</p>
                    <p class="text-end"><em>Au nom de Jésus, notre protecteur, Amen.</em></p>
                </div>
                
                <div class="prayer-verse mt-4">
                    <p><em>"L'Éternel te gardera de tout mal, il gardera ton âme; L'Éternel gardera ton départ et ton arrivée, dès maintenant et à jamais."</em></p>
                    <small class="text-muted">Psaume 121:7-8</small>
                </div>
            `
        }
    };

    const prayer = prayers[prayerType];
    if (!prayer) return;

    // Créer et afficher la modal de prière
    const prayerModal = document.createElement('div');
    prayerModal.className = 'modal fade';
    prayerModal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-praying-hands me-2"></i>${prayer.title}
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body prayer-modal-body">
                    ${prayer.content}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-primary" onclick="sharePrayer('${prayerType}')">
                        <i class="fas fa-share me-2"></i>Partager
                    </button>
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                        <i class="fas fa-heart me-2"></i>Amen
                    </button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(prayerModal);
    const modal = new bootstrap.Modal(prayerModal);
    modal.show();

    // Nettoyer après fermeture
    prayerModal.addEventListener('hidden.bs.modal', () => {
        prayerModal.remove();
    });
}



// Méditation guidée
function startMeditation() {
    const meditationModal = document.createElement('div');
    meditationModal.className = 'modal fade';
    meditationModal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-dove me-2"></i>Méditation Guidée
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <div class="meditation-content">
                        <div class="meditation-circle mb-4">
                            <i class="fas fa-circle meditation-breath"></i>
                        </div>
                        <h4 id="meditationText">Préparez-vous à entrer dans la présence de Dieu</h4>
                        <p class="text-muted" id="meditationInstruction">Fermez les yeux et respirez profondément</p>
                        
                        <div class="meditation-controls mt-4">
                            <button class="btn btn-primary" id="startMeditationBtn" onclick="beginMeditation()">
                                <i class="fas fa-play me-2"></i>Commencer
                            </button>
                            <button class="btn btn-outline-primary d-none" id="pauseMeditationBtn" onclick="pauseMeditation()">
                                <i class="fas fa-pause me-2"></i>Pause
                            </button>
                        </div>
                        
                        <div class="meditation-timer mt-3 d-none" id="meditationTimer">
                            <span class="fs-4 text-primary">5:00</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(meditationModal);
    const modal = new bootstrap.Modal(meditationModal);
    modal.show();

    // Nettoyer après fermeture
    meditationModal.addEventListener('hidden.bs.modal', () => {
        meditationModal.remove();
    });
}

// Partage de prière
function sharePrayer(prayerType) {
    const shareUrl = `${window.location.origin}#prayer-${prayerType}`;
    const shareText = "Découvrez cette belle prière sur Croire & Penser";
    
    if (navigator.share) {
        navigator.share({
            title: 'Prière - Croire & Penser',
            text: shareText,
            url: shareUrl
        });
    } else {
        // Copier dans le presse-papier
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`).then(() => {
            showAlert('Lien copié dans le presse-papier', 'success');
        });
    }
}

// Fonctions de la communauté de prière
function showPrayerRequests() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-hands-helping me-2"></i>Demandes de Prière
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-4">
                        <button class="btn btn-primary" onclick="showAddPrayerRequest()">
                            <i class="fas fa-plus me-2"></i>Ajouter une demande
                        </button>
                    </div>
                    <div id="prayerRequestsList">
                        <div class="prayer-request-item p-3 mb-3 border rounded">
                            <h6>Prière pour la guérison</h6>
                            <p class="text-muted">Merci de prier pour la guérison de ma grand-mère qui est hospitalisée.</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">Il y a 2 heures</small>
                                <button class="btn btn-sm btn-outline-primary" onclick="prayForRequest(1)">
                                    <i class="fas fa-praying-hands me-1"></i>Je prie (12)
                                </button>
                            </div>
                        </div>
                        <div class="prayer-request-item p-3 mb-3 border rounded">
                            <h6>Sagesse pour une décision importante</h6>
                            <p class="text-muted">J'ai besoin de la sagesse de Dieu pour prendre une décision professionnelle importante.</p>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted">Il y a 5 heures</small>
                                <button class="btn btn-sm btn-outline-primary" onclick="prayForRequest(2)">
                                    <i class="fas fa-praying-hands me-1"></i>Je prie (8)
                                </button>
                            </div>
                        </div>
                    </div>
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

function showPrayerChain() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-link me-2"></i>Chaîne de Prière
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="text-center mb-4">
                        <div class="prayer-chain-stats">
                            <div class="row">
                                <div class="col-4">
                                    <div class="stat-card">
                                        <h3 class="text-primary">247</h3>
                                        <small>Personnes en prière</small>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="stat-card">
                                        <h3 class="text-success">1,432</h3>
                                        <small>Prières aujourd'hui</small>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="stat-card">
                                        <h3 class="text-info">24/7</h3>
                                        <small>Couverture</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="text-center">
                        <p class="lead">Rejoignez notre chaîne de prière continue</p>
                        <p class="text-muted">Ensemble, nous maintenons une couverture de prière 24h/24</p>
                        <button class="btn btn-primary btn-lg" onclick="joinPrayerChain()">
                            <i class="fas fa-hands me-2"></i>Rejoindre la chaîne
                        </button>
                    </div>
                    
                    <div class="mt-4">
                        <h6>Créneaux disponibles aujourd'hui:</h6>
                        <div class="prayer-slots">
                            <button class="btn btn-outline-primary btn-sm me-2 mb-2">14:00 - 15:00</button>
                            <button class="btn btn-outline-primary btn-sm me-2 mb-2">18:00 - 19:00</button>
                            <button class="btn btn-outline-primary btn-sm me-2 mb-2">22:00 - 23:00</button>
                        </div>
                    </div>
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

function showTestimonies() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-heart me-2"></i>Témoignages de Prières Exaucées
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div class="mb-4">
                        <button class="btn btn-primary" onclick="showAddTestimony()">
                            <i class="fas fa-plus me-2"></i>Partager un témoignage
                        </button>
                    </div>
                    
                    <div class="testimonies-list">
                        <div class="testimony-item p-3 mb-3 bg-light rounded">
                            <div class="d-flex align-items-start">
                                <i class="fas fa-quote-left text-primary me-3 mt-1"></i>
                                <div>
                                    <p>"Dieu a répondu à nos prières ! Mon mari a retrouvé un emploi après 6 mois de recherche. Merci à tous ceux qui ont prié avec nous."</p>
                                    <small class="text-muted">- Marie, il y a 3 jours</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="testimony-item p-3 mb-3 bg-light rounded">
                            <div class="d-flex align-items-start">
                                <i class="fas fa-quote-left text-primary me-3 mt-1"></i>
                                <div>
                                    <p>"Ma fille a été guérie de sa maladie. Les médecins n'y comprennent rien, mais nous savons que c'est un miracle de Dieu !"</p>
                                    <small class="text-muted">- Jean, il y a 1 semaine</small>
                                </div>
                            </div>
                        </div>
                        
                        <div class="testimony-item p-3 mb-3 bg-light rounded">
                            <div class="d-flex align-items-start">
                                <i class="fas fa-quote-left text-primary me-3 mt-1"></i>
                                <div>
                                    <p>"Dieu m'a donné la paix et la sagesse pour réconcilier ma famille. Nos relations sont maintenant restaurées."</p>
                                    <small class="text-muted">- Sophie, il y a 2 semaines</small>
                                </div>
                            </div>
                        </div>
                    </div>
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

// Fonctions utilitaires pour la communauté
function prayForRequest(requestId) {
    showAlert('Merci d\'avoir prié ! Votre prière compte.', 'success');
}

function joinPrayerChain() {
    showAlert('Merci de rejoindre notre chaîne de prière !', 'success');
}

function showAddPrayerRequest() {
    showAlert('Fonctionnalité en développement', 'info');
}

function showAddTestimony() {
    showAlert('Fonctionnalité en développement', 'info');
}