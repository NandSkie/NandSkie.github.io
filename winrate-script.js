// winrate-script.js
function calculateWinRate() {
    // Get input values
    const totalMatch = parseInt(document.getElementById('totalMatch').value) || 0;
    const currentWR = parseFloat(document.getElementById('currentWR').value) || 0;
    const targetWR = parseFloat(document.getElementById('targetWR').value) || 0;
    
    // Validate input
    if (totalMatch <= 0) {
        showAlert('Total match harus lebih dari 0!', 'error');
        return;
    }
    
    if (currentWR < 0 || currentWR > 100) {
        showAlert('Win rate saat ini harus antara 0-100%!', 'error');
        return;
    }
    
    if (targetWR && (targetWR < 0 || targetWR > 100)) {
        showAlert('Target win rate harus antara 0-100%!', 'error');
        return;
    }
    
    // Calculate current stats
    const totalWin = Math.round((currentWR / 100) * totalMatch);
    const totalLose = totalMatch - totalWin;
    
    // Update current stats display
    document.getElementById('currentWRDisplay').textContent = currentWR.toFixed(2) + '%';
    document.getElementById('totalWinResult').textContent = totalWin;
    document.getElementById('totalLoseResult').textContent = totalLose;
    
    // Show target section if target is set
    const targetSection = document.getElementById('targetSection');
    const increaseSection = document.getElementById('increaseSection');
    const decreaseSection = document.getElementById('decreaseSection');
    
    if (targetWR > 0) {
        targetSection.style.display = 'block';
        document.getElementById('targetWRDisplay').textContent = targetWR.toFixed(2) + '%';
        
        const wrDifference = targetWR - currentWR;
        document.getElementById('wrDifference').textContent = wrDifference.toFixed(2) + '%';
        
        // Determine if we need to increase or decrease win rate
        if (targetWR > currentWR) {
            // Calculate requirements to INCREASE win rate
            calculateIncreaseRequirements(totalMatch, totalWin, totalLose, currentWR, targetWR);
            increaseSection.style.display = 'block';
            decreaseSection.style.display = 'none';
        } else if (targetWR < currentWR) {
            // Calculate requirements to DECREASE win rate
            calculateDecreaseRequirements(totalMatch, totalWin, totalLose, currentWR, targetWR);
            increaseSection.style.display = 'none';
            decreaseSection.style.display = 'block';
        } else {
            // Same win rate
            increaseSection.style.display = 'none';
            decreaseSection.style.display = 'none';
            showInfoBox('Win rate sudah sesuai target! Pertahankan performa Anda.');
        }
        
        // Calculate additional stats
        calculateAdditionalStats(wrDifference, totalMatch);
    } else {
        targetSection.style.display = 'none';
        showInfoBox('Masukkan target win rate untuk melihat kebutuhan match.');
    }
    
    // Show result container with animation
    const resultContainer = document.getElementById('resultContainer');
    resultContainer.classList.add('show');
    
    // Update recommendation based on result
    updateRecommendation(currentWR, targetWR);
    
    // Play success sound
    playSuccessSound();
}

function calculateIncreaseRequirements(totalMatch, totalWin, totalLose, currentWR, targetWR) {
    // Formula: WR = (W + x) / (T + x) where x is win streak needed
    // targetWR = (totalWin + x) / (totalMatch + x)
    // targetWR * (totalMatch + x) = totalWin + x
    // targetWR*totalMatch + targetWR*x = totalWin + x
    // targetWR*x - x = totalWin - targetWR*totalMatch
    // x*(targetWR - 1) = totalWin - targetWR*totalMatch
    // x = (totalWin - targetWR*totalMatch) / (targetWR - 1)
    
    const winStreakNeeded = Math.ceil((totalWin - (targetWR/100) * totalMatch) / ((targetWR/100) - 1));
    
    if (winStreakNeeded < 0) {
        document.getElementById('winStreakNeeded').textContent = '0';
        document.getElementById('requiredMatches').textContent = '0';
        document.getElementById('requiredWinRate').textContent = '100%';
    } else {
        const requiredMatches = totalMatch + winStreakNeeded;
        const requiredWinRate = ((totalWin + winStreakNeeded) / requiredMatches * 100).toFixed(2);
        
        document.getElementById('winStreakNeeded').textContent = winStreakNeeded;
        document.getElementById('requiredMatches').textContent = requiredMatches;
        document.getElementById('requiredWinRate').textContent = requiredWinRate + '%';
    }
}

function calculateDecreaseRequirements(totalMatch, totalWin, totalLose, currentWR, targetWR) {
    // Formula for decreasing win rate:
    // We need to add losses (lose streak) to decrease win rate
    // targetWR = totalWin / (totalMatch + x) where x is lose streak needed
    
    // targetWR * (totalMatch + x) = totalWin
    // targetWR*totalMatch + targetWR*x = totalWin
    // targetWR*x = totalWin - targetWR*totalMatch
    // x = (totalWin - targetWR*totalMatch) / targetWR
    
    const loseStreakNeeded = Math.ceil((totalWin - (targetWR/100) * totalMatch) / (targetWR/100));
    
    if (loseStreakNeeded < 0) {
        document.getElementById('loseStreakNeeded').textContent = '0';
        document.getElementById('decreaseMatches').textContent = '0';
        document.getElementById('decreaseWinRate').textContent = '0%';
    } else {
        const requiredMatches = totalMatch + loseStreakNeeded;
        const requiredWinRate = (totalWin / requiredMatches * 100).toFixed(2);
        
        document.getElementById('loseStreakNeeded').textContent = loseStreakNeeded;
        document.getElementById('decreaseMatches').textContent = requiredMatches;
        document.getElementById('decreaseWinRate').textContent = requiredWinRate + '%';
    }
}

function calculateAdditionalStats(wrDifference, totalMatch) {
    // Calculate win rate change needed per match
    const wrChangeNeeded = Math.abs(wrDifference) / 100;
    document.getElementById('wrChangeNeeded').textContent = (wrChangeNeeded * 100).toFixed(2) + '%';
    
    // Estimate time needed (assuming 5 matches per day)
    const matchesPerDay = 5;
    const winStreak = parseInt(document.getElementById('winStreakNeeded').textContent) || 
                      parseInt(document.getElementById('loseStreakNeeded').textContent) || 0;
    const daysNeeded = Math.ceil(winStreak / matchesPerDay);
    
    let timeText = '';
    if (daysNeeded === 0) {
        timeText = 'Sekarang';
    } else if (daysNeeded < 7) {
        timeText = `${daysNeeded} hari`;
    } else if (daysNeeded < 30) {
        const weeks = Math.ceil(daysNeeded / 7);
        timeText = `${weeks} minggu`;
    } else {
        const months = Math.ceil(daysNeeded / 30);
        timeText = `${months} bulan`;
    }
    
    document.getElementById('estimatedTime').textContent = timeText;
}

function updateRecommendation(currentWR, targetWR) {
    const recommendation = document.getElementById('recommendation');
    const wrDifference = targetWR - currentWR;
    
    if (targetWR === 0) {
        recommendation.innerHTML = `
            <h4><i class="fas fa-lightbulb"></i> REKOMENDASI</h4>
            <p>Masukkan target win rate untuk melihat rekomendasi spesifik!</p>
        `;
        return;
    }
    
    if (wrDifference > 0) {
        // Need to increase win rate
        const winStreak = parseInt(document.getElementById('winStreakNeeded').textContent);
        
        if (winStreak <= 0) {
            recommendation.innerHTML = `
                <h4><i class="fas fa-trophy"></i> REKOMENDASI</h4>
                <p>Selamat! Win rate Anda sudah cukup tinggi. Pertahankan konsistensi permainan.</p>
            `;
        } else if (winStreak <= 10) {
            recommendation.innerHTML = `
                <h4><i class="fas fa-rocket"></i> REKOMENDASI</h4>
                <p>Hanya butuh ${winStreak} kemenangan berturut-turut! Fokus pada performa terbaik Anda.</p>
            `;
        } else if (winStreak <= 50) {
            recommendation.innerHTML = `
                <h4><i class="fas fa-chart-line"></i> REKOMENDASI</h4>
                <p>Butuh ${winStreak} kemenangan berturut-turut. Mainkan lebih banyak match dengan fokus tinggi.</p>
            `;
        } else {
            recommendation.innerHTML = `
                <h4><i class="fas fa-mountain"></i> REKOMENDASI</h4>
                <p>Butuh ${winStreak} kemenangan berturut-turut. Ini tantangan besar! Siapkan strategi jangka panjang.</p>
            `;
        }
    } else if (wrDifference < 0) {
        // Need to decrease win rate
        const loseStreak = parseInt(document.getElementById('loseStreakNeeded').textContent);
        
        if (loseStreak <= 0) {
            recommendation.innerHTML = `
                <h4><i class="fas fa-smile"></i> REKOMENDASI</h4>
                <p>Win rate Anda sudah sesuai target. Tidak perlu menurunkan lebih lanjut.</p>
            `;
        } else if (loseStreak <= 10) {
            recommendation.innerHTML = `
                <h4><i class="fas fa-exclamation-triangle"></i> REKOMENDASI</h4>
                <p>Butuh ${loseStreak} kekalahan berturut-turut. Hati-hati dengan MMR drop!</p>
            `;
        } else {
            recommendation.innerHTML = `
                <h4><i class="fas fa-skull-crossbones"></i> REKOMENDASI</h4>
                <p>Butuh ${loseStreak} kekalahan berturut-turut. Pertimbangkan kembali target win rate Anda.</p>
            `;
        }
    } else {
        recommendation.innerHTML = `
            <h4><i class="fas fa-check-circle"></i> REKOMENDASI</h4>
            <p>Win rate sudah sesuai target! Pertahankan performa konsisten Anda.</p>
        `;
    }
}

function showInfoBox(message) {
    const recommendation = document.getElementById('recommendation');
    recommendation.innerHTML = `
        <h4><i class="fas fa-info-circle"></i> INFORMASI</h4>
        <p>${message}</p>
    `;
}

function createConfetti() {
    const colors = ['#00ff00', '#ff0000', '#ffff00', '#0088ff', '#9d00ff', '#ff8800'];
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
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) existingAlert.remove();
    
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

// Auto calculate when input changes
document.getElementById('totalMatch').addEventListener('input', calculateWinRate);
document.getElementById('currentWR').addEventListener('input', calculateWinRate);
document.getElementById('targetWR').addEventListener('input', calculateWinRate);

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
        if ((this.id === 'currentWR' || this.id === 'targetWR') && this.value > 100) {
            this.value = 100;
        }
    });
});