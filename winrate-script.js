// winrate-script.js
function calculateWinRate() {
    // Get input values
    const totalMatch = parseInt(document.getElementById('totalMatch').value) || 0;
    const matchWin = parseInt(document.getElementById('matchWin').value) || 0;
    const matchLose = parseInt(document.getElementById('matchLose').value) || 0;
    
    // Validate input
    if (totalMatch <= 0) {
        showAlert('Total match harus lebih dari 0!', 'error');
        return;
    }
    
    if (matchWin < 0 || matchLose < 0) {
        showAlert('Nilai tidak boleh negatif!', 'error');
        return;
    }
    
    if (matchWin + matchLose > totalMatch) {
        showAlert('Jumlah win + lose tidak boleh melebihi total match!', 'error');
        return;
    }
    
    // Calculate win rate
    const winRate = (matchWin / totalMatch) * 100;
    const winRateDecimal = (matchWin / totalMatch).toFixed(3);
    
    // Update results
    document.getElementById('winRateResult').textContent = winRate.toFixed(1) + '%';
    document.getElementById('totalMatchResult').textContent = totalMatch;
    document.getElementById('matchWinResult').textContent = matchWin;
    document.getElementById('matchLoseResult').textContent = matchLose;
    document.getElementById('winRateDecimal').textContent = winRateDecimal;
    
    // Determine level and recommendation
    const levelBadge = document.getElementById('levelBadge');
    const recommendation = document.getElementById('recommendation');
    
    if (winRate >= 70) {
        levelBadge.className = 'level-badge badge-pro';
        levelBadge.textContent = 'PRO PLAYER 🏆';
        recommendation.innerHTML = `
            <h3><i class="fas fa-crown"></i> REKOMENDASI</h3>
            <p>Win rate Anda sangat tinggi! Pertahankan performa ini. Coba tantang diri dengan melawan pemain tier lebih tinggi.</p>
        `;
        createConfetti();
    } else if (winRate >= 50) {
        levelBadge.className = 'level-badge badge-good';
        levelBadge.textContent = 'GOOD PLAYER ⭐';
        recommendation.innerHTML = `
            <h3><i class="fas fa-thumbs-up"></i> REKOMENDASI</h3>
            <p>Win rate Anda bagus! Fokus pada konsistensi dan analisis match yang kalah untuk meningkatkan lebih lanjut.</p>
        `;
    } else {
        levelBadge.className = 'level-badge badge-beginner';
        levelBadge.textContent = 'BEGINNER 🔰';
        recommendation.innerHTML = `
            <h3><i class="fas fa-graduation-cap"></i> REKOMENDASI</h3>
            <p>Tingkatkan skill dengan latihan rutin, tonton tutorial, dan analisis kesalahan. Win rate akan naik seiring waktu!</p>
        `;
    }
    
    // Show result container with animation
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.classList.add('show');
    
    // Play success sound
    playSuccessSound();
}

function createConfetti() {
    const colors = ['#00ff00', '#ff0000', '#ffff00', '#0088ff'];
    const container = document.querySelector('.container');
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.cssText = `
            position: absolute;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: -20px;
            z-index: 1000;
            opacity: 0.8;
        `;
        
        container.appendChild(confetti);
        
        // Animation
        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
        ], {
            duration: 1000 + Math.random() * 1000,
            easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
        });
        
        animation.onfinish = () => confetti.remove();
    }
}

function playSuccessSound() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Audio tidak didukung');
    }
}

function showAlert(message, type) {
    // Remove existing alert
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();
    
    // Create alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'error' ? '#ff4444' : '#00ff00'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

// Add CSS for alert animations
const alertStyle = document.createElement('style');
alertStyle.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(alertStyle);

// Auto-calculate lose matches
document.getElementById('matchWin').addEventListener('input', function() {
    const totalMatch = parseInt(document.getElementById('totalMatch').value) || 0;
    const matchWin = parseInt(this.value) || 0;
    const matchLoseInput = document.getElementById('matchLose');
    
    if (totalMatch > 0 && matchWin <= totalMatch) {
        matchLoseInput.value = totalMatch - matchWin;
    }
});

// Auto-calculate win matches
document.getElementById('matchLose').addEventListener('input', function() {
    const totalMatch = parseInt(document.getElementById('totalMatch').value) || 0;
    const matchLose = parseInt(this.value) || 0;
    const matchWinInput = document.getElementById('matchWin');
    
    if (totalMatch > 0 && matchLose <= totalMatch) {
        matchWinInput.value = totalMatch - matchLose;
    }
});

// Auto-calculate total match
document.getElementById('totalMatch').addEventListener('input', function() {
    const totalMatch = parseInt(this.value) || 0;
    const matchWin = parseInt(document.getElementById('matchWin').value) || 0;
    const matchLose = parseInt(document.getElementById('matchLose').value) || 0;
    
    if (matchWin + matchLose > totalMatch) {
        document.getElementById('matchLose').value = totalMatch - matchWin;
    }
});

// Calculate on Enter key
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        calculateWinRate();
    }
});

// Initial calculation on page load
window.addEventListener('load', function() {
    setTimeout(calculateWinRate, 500);
});

// Add input validation
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value < 0) this.value = 0;
        if (this.id === 'totalMatch' && this.value < 1) this.value = 1;
    });
});