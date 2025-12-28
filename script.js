// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to all buttons
    const buttons = document.querySelectorAll('.link-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
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
            
            this.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => ripple.remove(), 600);
        });
    });
    
    // Add ripple animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add loading animation to profile image
    const profileImg = document.querySelector('.profile img');
    if (profileImg) {
        profileImg.addEventListener('load', function() {
            this.style.animation = 'fadeIn 0.5s ease';
        });
        
        // Fallback for image error
        profileImg.addEventListener('error', function() {
            this.src = 'https://ui-avatars.com/api/?name=NandSki&background=4fc3f7&color=fff&size=256&bold=true';
            this.alt = 'NandSki Avatar';
        });
    }
    
    // Add current year to footer
    const footerYear = document.getElementById('currentYear');
    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
    
    // Add hover sound effect
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            playHoverSound();
        });
    });
    
    // Add floating particles
    createFloatingParticles();
    
    // Efek khusus untuk WR CALCULATE button
    const wrButton = document.querySelector('.link-btn.wr-calculate');
    if (wrButton) {
        // Add click counter animation
        wrButton.addEventListener('click', function(e) {
            // Create particle explosion effect
            createWrParticles(this);
            
            // Play special sound
            playWrSound();
        });
        
        // Add hover glow effect
        wrButton.addEventListener('mouseenter', function() {
            this.style.animation = 'wrPulse 1s infinite';
        });
        
        wrButton.addEventListener('mouseleave', function() {
            this.style.animation = 'wrPulse 3s infinite';
        });
    }
    
    // Page transition effect
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', function(e) {
            // Only for internal links
            if (this.href.includes(window.location.hostname) || !this.href.includes('http')) {
                e.preventDefault();
                
                // Add fade out effect
                document.body.style.opacity = '0.7';
                document.body.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    window.location.href = this.href;
                }, 300);
            }
        });
    });
});

function playHoverSound() {
    // Create a subtle hover sound using Web Audio API
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
        // Audio not supported or user blocked
    }
}

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
        
        // Random starting position within container
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        
        particle.style.left = `${startX}%`;
        particle.style.top = `${startY}%`;
        
        container.appendChild(particle);
    }
    
    // Add particle animation CSS
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

// Function untuk efek partikel WR CALCULATE
function createWrParticles(button) {
    const rect = button.getBoundingClientRect();
    const colors = ['#ffb74d', '#ff9800', '#ff5722', '#ffeb3b'];
    
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'wr-particle';
        
        const size = Math.random() * 8 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 3 + 2;
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
            z-index: 1000;
            pointer-events: none;
            transform: translate(0, 0);
        `;
        
        document.body.appendChild(particle);
        
        // Animate particle
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

// Function untuk suara khusus WR CALCULATE
function playWrSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create multiple oscillators for richer sound
        for (let i = 0; i < 3; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Different frequencies for chord effect
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

// Add CSS for WR particles
const wrParticleStyle = document.createElement('style');
wrParticleStyle.textContent = `
    @keyframes wrPulse {
        0%, 100% {
            box-shadow: 0 0 10px rgba(255, 183, 77, 0.3);
        }
        50% {
            box-shadow: 0 0 20px rgba(255, 183, 77, 0.6);
        }
    }
    
    .wr-particle {
        animation: wrParticleFloat 0.8s ease-out forwards;
    }
    
    @keyframes wrParticleFloat {
        to {
            transform: translate(var(--end-x), var(--end-y)) scale(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(wrParticleStyle);