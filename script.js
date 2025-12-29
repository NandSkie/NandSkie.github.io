// script.js - MODAL SYSTEM
document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    initializePage();
    
    // Add floating particles
    createFloatingParticles();
});

function initializePage() {
    // Add ripple effect to main menu buttons
    const menuButtons = document.querySelectorAll('.menu-btn');
    const templateButtons = document.querySelectorAll('.template-btn');
    
    // Add ripple effect to menu buttons
    menuButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(this, e);
            playHoverSound();
        });
        
        button.addEventListener('mouseenter', function() {
            playHoverSound();
        });
    });
    
    // Add ripple effect to template buttons
    templateButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            createRippleEffect(this, e);
            playHoverSound();
            
            // Special effect for WR CALCULATE
            if (this.classList.contains('wr-calculate-btn')) {
                createWrParticles(this);
                playWrSound();
            }
        });
    });
    
    // Profile image fallback
    const profileImg = document.querySelector('.profile img');
    if (profileImg) {
        profileImg.addEventListener('error', function() {
            this.src = 'https://ui-avatars.com/api/?name=NandSki&background=4fc3f7&color=fff&size=256&bold=true';
            this.alt = 'NandSki Avatar';
        });
    }
    
    // Update current year
    const footerYear = document.getElementById('currentYear');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
    
    // Close modal when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal(this.id);
            }
        });
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Modal Functions
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Add entrance animation to modal content
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = 'slideUpModal 0.4s ease';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // Reset animation
        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.animation = '';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.classList.remove('active');
    });
    document.body.style.overflow = 'auto';
}

// Ripple Effect
function createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(79, 195, 247, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
        z-index: 1;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Sound Effects
function playHoverSound() {
    try {
        if (!window.hoverSoundEnabled) {
            window.hoverSoundEnabled = true;
            return;
        }
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 523.25;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Audio not supported
    }
}

function playWrSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create chord effect
        for (let i = 0; i < 3; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            const frequencies = [523.25, 659.25, 783.99];
            oscillator.frequency.value = frequencies[i];
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }
    } catch (e) {
        // Audio not supported
    }
}

// Floating Particles
function createFloatingParticles() {
    const container = document.querySelector('.container');
    const colors = ['#4fc3f7', '#ba68c8', '#66bb6a', '#ffb74d'];
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'floating-particle';
        
        const size = Math.random() * 4 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = Math.random() * 10 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            opacity: ${Math.random() * 0.3 + 0.1};
            z-index: 0;
            pointer-events: none;
            animation: floatParticle ${duration}s linear ${delay}s infinite;
        `;
        
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        particle.style.left = `${startX}%`;
        particle.style.top = `${startY}%`;
        
        container.appendChild(particle);
    }
    
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes floatParticle {
            0% {
                transform: translate(0, 0) rotate(0deg);
                opacity: 0.1;
            }
            25% {
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(90deg);
                opacity: 0.3;
            }
            50% {
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(180deg);
                opacity: 0.1;
            }
            75% {
                transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px) rotate(270deg);
                opacity: 0.3;
            }
            100% {
                transform: translate(0, 0) rotate(360deg);
                opacity: 0.1;
            }
        }
    `;
    document.head.appendChild(particleStyle);
}

// WR Particle Effect
function createWrParticles(button) {
    const rect = button.getBoundingClientRect();
    const colors = ['#ffb74d', '#ff9800', '#ff5722', '#ffeb3b'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'wr-particle';
        
        const size = Math.random() * 8 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 100 + 50;
        
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        
        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${startX}px;
            top: ${startY}px;
            opacity: 0.8;
            z-index: 2000;
            pointer-events: none;
        `;
        
        document.body.appendChild(particle);
        
        const endX = startX + Math.cos(angle) * distance;
        const endY = startY + Math.sin(angle) * distance;
        
        const animation = particle.animate([
            { 
                transform: 'translate(0, 0) scale(1)',
                opacity: 0.8 
            },
            { 
                transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`,
                opacity: 0 
            }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        animation.onfinish = () => particle.remove();
    }
}

// Add CSS for WR particles
const wrParticleStyle = document.createElement('style');
wrParticleStyle.textContent = `
    .wr-particle {
        animation: wrParticleFloat 0.8s ease-out forwards;
    }
    
    @keyframes wrParticleFloat {
        to {
            opacity: 0;
            transform: translate(var(--end-x), var(--end-y)) scale(0);
        }
    }
`;
document.head.appendChild(wrParticleStyle);