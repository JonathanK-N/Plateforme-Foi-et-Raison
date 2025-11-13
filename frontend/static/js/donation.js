// Donation Page JavaScript - Ultra Dynamic & Interactive
document.addEventListener('DOMContentLoaded', function() {
    initializeDonationPage();
});

function initializeDonationPage() {
    // Animation observer
    setupScrollAnimations();
    
    // Counter animations
    animateCounters();
    
    // Amount selection
    setupAmountSelection();
    
    // Donation type toggle
    setupDonationType();
    
    // Payment methods
    setupPaymentMethods();
    
    // Progress bars animation
    animateProgressBars();
    
    // Testimonials slider
    setupTestimonialsSlider();
    
    // Donate button
    setupDonateButton();
    
    // Payment integrations
    initializePaymentMethods();
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
                
                // Special handling for progress bars
                if (entry.target.classList.contains('donation-impact')) {
                    setTimeout(() => {
                        animateProgressBars();
                    }, 500);
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('[class*="animate-"]').forEach(el => {
        el.style.animationPlayState = 'paused';
        observer.observe(el);
    });
}

function animateCounters() {
    const counters = document.querySelectorAll('.animate-counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const numberElement = counter.querySelector('.stat-number');
        let current = 0;
        const increment = target / 100;
        const duration = 2000;
        const stepTime = duration / 100;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            numberElement.textContent = Math.floor(current);
        }, stepTime);
    });
}

function setupAmountSelection() {
    const amountCards = document.querySelectorAll('.amount-card');
    const customAmountInput = document.querySelector('.custom-amount-input');
    const customAmountField = document.getElementById('customAmount');
    const amountDisplay = document.querySelector('.amount-display');
    const frequencyDisplay = document.querySelector('.frequency-display');
    
    let selectedAmount = 0;
    let isCustom = false;
    
    amountCards.forEach(card => {
        card.addEventListener('click', function() {
            // Remove previous selection
            amountCards.forEach(c => c.classList.remove('selected'));
            
            // Add selection with animation
            this.classList.add('selected');
            
            // Ripple effect
            createRippleEffect(this, event);
            
            const amount = this.dataset.amount;
            
            if (amount === 'custom') {
                customAmountInput.classList.add('show');
                customAmountField.focus();
                isCustom = true;
                selectedAmount = 0;
            } else {
                customAmountInput.classList.remove('show');
                selectedAmount = parseInt(amount);
                isCustom = false;
            }
            
            updateAmountDisplay();
        });
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-15px) scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });
    
    // Custom amount input
    customAmountField.addEventListener('input', function() {
        selectedAmount = parseInt(this.value) || 0;
        updateAmountDisplay();
    });
    
    function updateAmountDisplay() {
        const donationType = document.querySelector('.type-btn.active').dataset.type;
        const frequency = donationType === 'monthly' ? ' / mois' : '';
        
        amountDisplay.textContent = selectedAmount + '$';
        frequencyDisplay.textContent = 'CAD' + frequency;
        
        // Animate amount change
        amountDisplay.style.transform = 'scale(1.2)';
        setTimeout(() => {
            amountDisplay.style.transform = 'scale(1)';
        }, 200);
    }
}

function setupDonationType() {
    const typeButtons = document.querySelectorAll('.type-btn');
    
    typeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            typeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update amount display
            const amountDisplay = document.querySelector('.amount-display');
            const frequencyDisplay = document.querySelector('.frequency-display');
            const selectedAmount = parseInt(amountDisplay.textContent) || 0;
            const frequency = this.dataset.type === 'monthly' ? ' / mois' : '';
            
            frequencyDisplay.textContent = 'CAD' + frequency;
            
            // Animation effect
            createRippleEffect(this, event);
        });
    });
}

function setupPaymentMethods() {
    const paymentCards = document.querySelectorAll('.payment-card');
    
    paymentCards.forEach(card => {
        card.addEventListener('click', function() {
            paymentCards.forEach(c => c.classList.remove('selected'));
            this.classList.add('selected');
            
            // Ripple effect
            createRippleEffect(this, event);
            
            // Update donate button text
            const method = this.dataset.method;
            const donateBtn = document.getElementById('donateBtn');
            const btnText = donateBtn.querySelector('.btn-text');
            
            switch(method) {
                case 'paypal':
                    btnText.innerHTML = '<i class="fab fa-paypal me-2"></i>Payer avec PayPal';
                    break;
                case 'stripe':
                    btnText.innerHTML = '<i class="fas fa-credit-card me-2"></i>Payer par carte';
                    break;
                case 'interac':
                    btnText.innerHTML = '<i class="fas fa-university me-2"></i>Virement Interac';
                    break;
                default:
                    btnText.innerHTML = '<i class="fas fa-heart me-2"></i>Faire un don maintenant';
            }
        });
    });
}

function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const progress = bar.dataset.progress;
        setTimeout(() => {
            bar.style.width = progress + '%';
        }, Math.random() * 500);
    });
}

function setupTestimonialsSlider() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    function showTestimonial(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.classList.remove('active');
            if (i === index) {
                setTimeout(() => {
                    testimonial.classList.add('active');
                }, 100);
            }
        });
    }
    
    // Auto-slide every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }, 5000);
}

function setupDonateButton() {
    const donateBtn = document.getElementById('donateBtn');
    
    donateBtn.addEventListener('click', function(e) {
        // Validation
        if (!validateDonation()) {
            return;
        }
        
        // Ripple effect
        createRippleEffect(this, e);
        
        // Open payment modal
        setTimeout(() => {
            openPaymentModal();
        }, 300);
    });
}

function validateDonation() {
    const selectedAmount = parseInt(document.querySelector('.amount-display').textContent) || 0;
    const selectedPayment = document.querySelector('.payment-card.selected');
    const firstName = document.querySelector('input[placeholder="Prénom"]').value;
    const lastName = document.querySelector('input[placeholder="Nom"]').value;
    const email = document.querySelector('input[placeholder="Email"]').value;
    
    if (selectedAmount < 5) {
        showNotification('Veuillez sélectionner un montant d\'au moins 5$', 'error');
        return false;
    }
    
    if (!selectedPayment) {
        showNotification('Veuillez sélectionner une méthode de paiement', 'error');
        return false;
    }
    
    if (!firstName || !lastName || !email) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return false;
    }
    
    if (!isValidEmail(email)) {
        showNotification('Veuillez entrer une adresse email valide', 'error');
        return false;
    }
    
    return true;
}

function openPaymentModal() {
    const modal = document.getElementById('paymentModal');
    const selectedPayment = document.querySelector('.payment-card.selected').dataset.method;
    
    // Hide all payment containers
    document.getElementById('paypal-button-container').style.display = 'none';
    document.getElementById('stripe-card-element').style.display = 'none';
    document.getElementById('interac-info').style.display = 'none';
    
    // Show selected payment method
    switch(selectedPayment) {
        case 'paypal':
            document.getElementById('paypal-button-container').style.display = 'block';
            initializePayPal();
            break;
        case 'stripe':
            document.getElementById('stripe-card-element').style.display = 'block';
            initializeStripe();
            break;
        case 'interac':
            document.getElementById('interac-info').style.display = 'block';
            break;
    }
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closePaymentModal() {
    const modal = document.getElementById('paymentModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function initializePaymentMethods() {
    // PayPal will be initialized when modal opens
    // Stripe will be initialized when modal opens
}

function initializePayPal() {
    const amount = parseInt(document.querySelector('.amount-display').textContent) || 0;
    
    if (window.paypal && document.getElementById('paypal-button-container').innerHTML === '') {
        paypal.Buttons({
            createOrder: function(data, actions) {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: amount.toString()
                        }
                    }]
                });
            },
            onApprove: function(data, actions) {
                return actions.order.capture().then(function(details) {
                    showNotification('Merci pour votre don ! Transaction ID: ' + details.id, 'success');
                    closePaymentModal();
                    showThankYouAnimation();
                });
            },
            onError: function(err) {
                showNotification('Erreur lors du paiement PayPal', 'error');
            }
        }).render('#paypal-button-container');
    }
}

function initializeStripe() {
    // Simulation Stripe (remplacer par vraie intégration)
    const stripeContainer = document.getElementById('stripe-card-element');
    stripeContainer.innerHTML = `
        <div class="stripe-form">
            <div class="form-group mb-3">
                <label>Numéro de carte</label>
                <input type="text" class="form-control" placeholder="1234 5678 9012 3456" maxlength="19">
            </div>
            <div class="row">
                <div class="col-6">
                    <label>Expiration</label>
                    <input type="text" class="form-control" placeholder="MM/YY" maxlength="5">
                </div>
                <div class="col-6">
                    <label>CVC</label>
                    <input type="text" class="form-control" placeholder="123" maxlength="3">
                </div>
            </div>
            <button class="btn btn-primary w-100 mt-3" onclick="processStripePayment()">
                Confirmer le paiement
            </button>
        </div>
    `;
}

function processStripePayment() {
    // Simulation du traitement Stripe
    showNotification('Traitement du paiement...', 'info');
    
    setTimeout(() => {
        showNotification('Paiement réussi ! Merci pour votre don.', 'success');
        closePaymentModal();
        showThankYouAnimation();
    }, 2000);
}

function createRippleEffect(element, event) {
    const ripple = document.createElement('div');
    ripple.classList.add('btn-ripple');
    
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-weight: 600;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function showThankYouAnimation() {
    const thankYou = document.createElement('div');
    thankYou.innerHTML = `
        <div class="thank-you-overlay">
            <div class="thank-you-content">
                <div class="thank-you-icon">
                    <i class="fas fa-heart"></i>
                </div>
                <h2>Merci pour votre générosité !</h2>
                <p>Votre don nous aide à continuer notre mission</p>
                <div class="thank-you-animation">
                    <div class="heart-float"></div>
                    <div class="heart-float"></div>
                    <div class="heart-float"></div>
                </div>
            </div>
        </div>
    `;
    
    thankYou.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .thank-you-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(30, 58, 138, 0.95);
            backdrop-filter: blur(10px);
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .thank-you-content {
            text-align: center;
            color: white;
            animation: thankYouSlideIn 0.5s ease-out;
        }
        .thank-you-icon {
            font-size: 5rem;
            color: #ef4444;
            margin-bottom: 2rem;
            animation: heartPulse 2s ease-in-out infinite;
        }
        .thank-you-content h2 {
            font-size: 3rem;
            margin-bottom: 1rem;
        }
        .thank-you-content p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        .heart-float {
            position: absolute;
            font-size: 2rem;
            color: #ef4444;
            animation: floatUp 3s ease-out infinite;
        }
        .heart-float:nth-child(1) { left: 20%; animation-delay: 0s; }
        .heart-float:nth-child(2) { left: 50%; animation-delay: 1s; }
        .heart-float:nth-child(3) { left: 80%; animation-delay: 2s; }
        @keyframes thankYouSlideIn {
            from { opacity: 0; transform: scale(0.8) translateY(50px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes floatUp {
            0% { opacity: 0; transform: translateY(100px); }
            50% { opacity: 1; }
            100% { opacity: 0; transform: translateY(-100px); }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(thankYou);
    
    setTimeout(() => {
        thankYou.remove();
        style.remove();
    }, 5000);
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Close modal when clicking backdrop
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-backdrop')) {
        closePaymentModal();
    }
});