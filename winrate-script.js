// Fungsi untuk menghitung win rate
function calculateWinRate() {
    // Ambil nilai dari input
    const totalMatch = parseInt(document.getElementById('totalMatch').value);
    const currentWR = parseFloat(document.getElementById('currentWR').value);
    const targetWR = document.getElementById('targetWR').value;
    
    // Validasi input
    if (isNaN(totalMatch) || totalMatch <= 0) {
        alert("Masukkan jumlah match yang valid (lebih dari 0)");
        return;
    }
    
    if (isNaN(currentWR) || currentWR < 0 || currentWR > 100) {
        alert("Masukkan win rate yang valid (0-100%)");
        return;
    }
    
    // Hitung jumlah menang dan kalah saat ini
    const currentWins = Math.round((currentWR / 100) * totalMatch);
    const currentLosses = totalMatch - currentWins;
    
    // Tampilkan hasil saat ini
    document.getElementById('currentWRDisplay').textContent = currentWR.toFixed(2) + "%";
    document.getElementById('totalWinResult').textContent = currentWins;
    document.getElementById('totalLoseResult').textContent = currentLosses;
    
    // Tampilkan section target jika ada target yang dimasukkan
    const targetSection = document.getElementById('targetSection');
    const recommendation = document.getElementById('recommendation');
    
    if (targetWR !== "" && !isNaN(parseFloat(targetWR))) {
        const targetWRValue = parseFloat(targetWR);
        
        // Validasi target WR
        if (targetWRValue < 0 || targetWRValue > 100) {
            alert("Masukkan target win rate yang valid (0-100%)");
            return;
        }
        
        if (targetWRValue <= currentWR) {
            recommendation.innerHTML = `
                <h4><i class="fas fa-check-circle"></i> INFORMASI</h4>
                <p>Target win rate (${targetWRValue}%) sudah tercapai atau lebih rendah dari win rate saat ini (${currentWR.toFixed(2)}%).</p>
            `;
            
            // Tetap tampilkan target section
            targetSection.style.display = 'block';
            document.getElementById('targetWRDisplay').textContent = targetWRValue.toFixed(2) + "%";
            
            // Hitung jika ingin meningkatkan sedikit
            const requiredMatches = calculateMatchesToTarget(totalMatch, currentWins, targetWRValue);
            const winStreakNeeded = Math.max(0, requiredMatches - currentLosses - currentWins);
            
            document.getElementById('requiredMatches').textContent = requiredMatches;
            document.getElementById('winStreakNeeded').textContent = winStreakNeeded > 0 ? winStreakNeeded : "0";
            document.getElementById('requiredWinRate').textContent = targetWRValue.toFixed(2) + "%";
        } else {
            // Hitung kebutuhan untuk mencapai target
            const requiredMatches = calculateMatchesToTarget(totalMatch, currentWins, targetWRValue);
            const additionalMatches = Math.max(0, requiredMatches - totalMatch);
            const winStreakNeeded = Math.max(0, requiredMatches - currentLosses - currentWins);
            
            // Tampilkan hasil target
            document.getElementById('targetWRDisplay').textContent = targetWRValue.toFixed(2) + "%";
            document.getElementById('requiredMatches').textContent = requiredMatches;
            document.getElementById('winStreakNeeded').textContent = winStreakNeeded > 0 ? winStreakNeeded : "0";
            document.getElementById('requiredWinRate').textContent = targetWRValue.toFixed(2) + "%";
            
            // Berikan rekomendasi berdasarkan hasil
            if (additionalMatches <= 0) {
                recommendation.innerHTML = `
                    <h4><i class="fas fa-trophy"></i> SELAMAT!</h4>
                    <p>Anda sudah mencapai target win rate ${targetWRValue}% dengan performa saat ini.</p>
                `;
            } else if (additionalMatches <= 5) {
                recommendation.innerHTML = `
                    <h4><i class="fas fa-star"></i> REKOMENDASI</h4>
                    <p>Anda hanya perlu ${additionalMatches} match menang lagi untuk mencapai target win rate ${targetWRValue}%.</p>
                `;
            } else if (additionalMatches <= 20) {
                recommendation.innerHTML = `
                    <h4><i class="fas fa-fire"></i> REKOMENDASI</h4>
                    <p>Anda perlu ${additionalMatches} match menang untuk mencapai target. Fokus pada performa konsisten!</p>
                `;
            } else if (additionalMatches <= 100) {
                recommendation.innerHTML = `
                    <h4><i class="fas fa-mountain"></i> REKOMENDASI</h4>
                    <p>Mencapai target ${targetWRValue}% membutuhkan ${additionalMatches} match menang. Tetap semangat dan konsisten!</p>
                `;
            } else {
                recommendation.innerHTML = `
                    <h4><i class="fas fa-chart-line"></i> REKOMENDASI</h4>
                    <p>Target ${targetWRValue}% sangat ambisius! Butuh ${additionalMatches} match menang. Pertimbangkan target bertahap.</p>
                `;
            }
            
            targetSection.style.display = 'block';
        }
    } else {
        // Jika tidak ada target, sembunyikan section target
        targetSection.style.display = 'none';
        
        // Berikan rekomendasi berdasarkan win rate saat ini
        updateRecommendation(currentWR);
    }
    
    // Tampilkan hasil
    document.getElementById('resultContainer').style.display = 'block';
}

// Fungsi untuk menghitung match yang dibutuhkan untuk mencapai target
function calculateMatchesToTarget(totalMatches, currentWins, targetWR) {
    const targetDecimal = targetWR / 100;
    
    // Jika target sudah 100% atau lebih dari current
    if (targetDecimal >= 1) {
        // Untuk mencapai 100%, kita perlu menang semua match yang kalah
        const currentLosses = totalMatches - currentWins;
        return totalMatches + currentLosses;
    }
    
    // Rumus: (currentWins + x) / (totalMatches + x) = targetWR/100
    // x = [(targetWR/100)*totalMatches - currentWins] / (1 - targetWR/100)
    const numerator = (targetDecimal * totalMatches) - currentWins;
    const denominator = 1 - targetDecimal;
    
    // Jika denominator 0 (targetWR = 100%), kita sudah handle di atas
    if (Math.abs(denominator) < 0.0001) {
        return totalMatches;
    }
    
    const additionalWinsNeeded = numerator / denominator;
    
    // Jika additionalWinsNeeded negatif, artinya kita sudah mencapai target
    if (additionalWinsNeeded <= 0) {
        return totalMatches;
    }
    
    // Total match yang dibutuhkan = match saat ini + match tambahan yang dibutuhkan
    // Kita bulatkan ke atas karena tidak mungkin match pecahan
    return Math.ceil(totalMatches + additionalWinsNeeded);
}

// Fungsi untuk memberikan rekomendasi berdasarkan win rate
function updateRecommendation(currentWR) {
    const recommendation = document.getElementById('recommendation');
    
    if (currentWR >= 90) {
        recommendation.innerHTML = `
            <h4><i class="fas fa-crown"></i> LEGENDARY PLAYER!</h4>
            <p>Win rate Anda luar biasa! Anda termasuk pemain top tier. Pertahankan!</p>
        `;
    } else if (currentWR >= 80) {
        recommendation.innerHTML = `
            <h4><i class="fas fa-award"></i> ELITE PLAYER!</h4>
            <p>Win rate Anda sangat mengesankan! Sedikit lagi mencapai level legendary.</p>
        `;
    } else if (currentWR >= 70) {
        recommendation.innerHTML = `
            <h4><i class="fas fa-trophy"></i> PRO PLAYER!</h4>
            <p>Win rate Anda bagus! Anda sudah di atas rata-rata pemain.</p>
        `;
    } else if (currentWR >= 60) {
        recommendation.innerHTML = `
            <h4><i class="fas fa-thumbs-up"></i> SOLID PLAYER!</h4>
            <p>Win rate Anda solid. Fokus pada konsistensi untuk menjadi pro player.</p>
        `;
    } else if (currentWR >= 50) {
        recommendation.innerHTML = `
            <h4><i class="fas fa-balance-scale"></i> AVERAGE PLAYER</h4>
            <p>Win rate Anda rata-rata. Analisis permainan dan cari area perbaikan.</p>
        `;
    } else if (currentWR >= 40) {
        recommendation.innerHTML = `
            <h4><i class="fas fa-book"></i> LEARNING PLAYER</h4>
            <p>Win rate Anda di bawah rata-rata. Pelajari strategi baru dan review gameplay.</p>
        `;
    } else {
        recommendation.innerHTML = `
            <h4><i class="fas fa-graduation-cap"></i> BEGINNER</h4>
            <p>Win rate Anda masih rendah. Fokus belajar dasar-dasar dan jangan menyerah!</p>
        `;
    }
}

// Fungsi untuk reset form
function resetCalculator() {
    document.getElementById('totalMatch').value = '80';
    document.getElementById('currentWR').value = '90.1';
    document.getElementById('targetWR').value = '95';
    document.getElementById('resultContainer').style.display = 'none';
}

// Fungsi untuk menghitung win streak yang dibutuhkan
function calculateWinStreakNeeded(totalMatches, currentWins, currentLosses, targetMatches) {
    const remainingMatches = targetMatches - totalMatches;
    if (remainingMatches <= 0) return 0;
    
    // Untuk mencapai target, kita perlu menang semua match yang tersisa
    return remainingMatches;
}

// Event listener untuk input otomatis
document.addEventListener('DOMContentLoaded', function() {
    // Hitung otomatis saat halaman dimuat
    calculateWinRate();
    
    // Tambahkan event listener untuk input
    const inputs = ['totalMatch', 'currentWR', 'targetWR'];
    inputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', calculateWinRate);
        }
    });
    
    // Tambahkan tombol reset jika diperlukan
    const calculateBtn = document.querySelector('.calculate-btn');
    if (calculateBtn) {
        // Tambahkan tooltip
        calculateBtn.title = "Klik untuk menghitung win rate";
        
        // Tambahkan event listener untuk Enter key
        document.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateWinRate();
            }
        });
    }
});

// Fungsi untuk menghitung dengan contoh
function calculateExample() {
    // Contoh 1: Player dengan 100 match, WR 50%, target 60%
    document.getElementById('totalMatch').value = '100';
    document.getElementById('currentWR').value = '50';
    document.getElementById('targetWR').value = '60';
    calculateWinRate();
}