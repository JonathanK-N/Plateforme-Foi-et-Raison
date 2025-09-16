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

            <!-- Contenu Principal -->
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
                                    <p class="text-muted">Partagez vos intentions et priez les uns pour les autres</p>
                                </div>
                                <div class="col-md-6">
                                    <div class="row g-2">
                                        <div class="col-md-6">
                                            <button class="btn btn-primary w-100 prayer-btn" onclick="showPrayerRequestForm()">
                                                <i class="fas fa-plus d-block mb-1"></i>
                                                <small>Nouvelle Demande</small>
                                            </button>
                                        </div>
                                        <div class="col-md-6">
                                            <button class="btn btn-outline-primary w-100 prayer-btn" onclick="showPrayerRequests()">
                                                <i class="fas fa-list d-block mb-1"></i>
                                                <small>Voir les Demandes</small>
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

// Formulaire de demande de prière
function showPrayerRequestForm() {
    if (!currentUser) {
        showAlert('Veuillez vous connecter pour soumettre une demande de prière', 'warning');
        showLogin();
        return;
    }

    const requestModal = document.createElement('div');
    requestModal.className = 'modal fade';
    requestModal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-praying-hands me-2"></i>Demande de Prière
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="prayerRequestForm">
                        <div class="mb-3">
                            <label class="form-label">Sujet de la prière</label>
                            <input type="text" class="form-control" id="prayerSubject" required 
                                   placeholder="Ex: Guérison, Guidance, Famille...">
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Détails (optionnel)</label>
                            <textarea class="form-control" id="prayerDetails" rows="4" 
                                      placeholder="Partagez plus de détails si vous le souhaitez..."></textarea>
                        </div>
                        <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="prayerAnonymous">
                                <label class="form-check-label" for="prayerAnonymous">
                                    Demande anonyme
                                </label>
                            </div>
                        </div>
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            Votre demande sera partagée avec notre communauté de prière pour intercéder en votre faveur.
                        </div>
                        <button type="submit" class="btn btn-primary w-100">
                            <i class="fas fa-paper-plane me-2"></i>Soumettre la Demande
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(requestModal);
    const modal = new bootstrap.Modal(requestModal);
    modal.show();

    // Gérer la soumission
    document.getElementById('prayerRequestForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const subject = document.getElementById('prayerSubject').value;
        const details = document.getElementById('prayerDetails').value;
        const isAnonymous = document.getElementById('prayerAnonymous').checked;

        try {
            // Simulation d'envoi - en production, envoyer à l'API
            showAlert('Votre demande de prière a été soumise. La communauté priera pour vous.', 'success');
            modal.hide();
        } catch (error) {
            showAlert('Erreur lors de la soumission de votre demande', 'danger');
        }
    });

    // Nettoyer après fermeture
    requestModal.addEventListener('hidden.bs.modal', () => {
        requestModal.remove();
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
    const shareText = "Découvrez cette belle prière sur Foi & Raison";
    
    if (navigator.share) {
        navigator.share({
            title: 'Prière - Foi & Raison',
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