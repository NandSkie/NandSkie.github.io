// script.js - Untuk halaman utama
document.addEventListener('DOMContentLoaded', function() {
    // Add click animation to all buttons
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
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                width: ${size}px;
                height: ${size}px;
                top: ${y}px;
                left: ${x}px;
                pointer-events: none;
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
            this.src = 'https://via.placeholder.com/110/ff0000/ffffff?text=XDOO';
            this.alt = 'Logo XDOO Store - Placeholder';
        });
    }
    
    // Add current year to footer
    const footer = document.querySelector('footer');
    if (footer) {
        const yearSpan = document.createElement('span');
        yearSpan.textContent = new Date().getFullYear();
        footer.innerHTML = footer.innerHTML.replace('2025', yearSpan.textContent);
    }
    
    // Add page transition effect
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.href.includes(window.location.hostname)) {
                e.preventDefault();
                document.body.style.opacity = '0.7';
                setTimeout(() => {
                    window.location.href = this.href;
                }, 300);
            }
        });
    });
});