// Instagram Downloader Script - NandSki
// Menggunakan API api.vreden.my.id yang terbukti bekerja

document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi tahun
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Buat efek meteor
    createMeteorEffect();
    
    // Event listener untuk tombol proses
    document.getElementById('downloadBtn').addEventListener('click', processInstagramUrl);
    
    // Event listener untuk tombol download video
    document.getElementById('downloadVideoBtn').addEventListener('click', downloadVideo);
    
    // Event listener untuk tombol download audio
    document.getElementById('downloadAudioBtn').addEventListener('click', downloadAudio);
    
    // Event listener untuk tombol download thumbnail
    document.getElementById('downloadThumbBtn').addEventListener('click', downloadThumbnail);
    
    // Enter key untuk trigger proses
    document.getElementById('urlInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processInstagramUrl();
        }
    });
    
    // Tampilkan contoh URL saat load
    showExampleUrl();
});

// Variabel global untuk menyimpan data
let currentInstagramData = null;
let apiUrl = 'https://api.vreden.my.id/api/v1/download/instagram?url=';

// Fungsi untuk membuat efek meteor
function createMeteorEffect() {
    const container = document.getElementById('meteorContainer');
    
    for (let i = 0; i < 15; i++) {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 3 + 2;
        
        meteor.style.left = `${left}%`;
        meteor.style.top = `-100px`;
        meteor.style.animation = `meteorFall ${duration}s linear ${delay}s infinite`;
        
        container.appendChild(meteor);
    }
}

// Tampilkan contoh URL
function showExampleUrl() {
    const exampleUrls = [
        "https://www.instagram.com/reel/DQwhpRpDpIB/",
        "https://www.instagram.com/reel/Cz6JhWNNKcC/",
        "https://www.instagram.com/p/Cy5OJMzNTwq/"
    ];
    
    const randomUrl = exampleUrls[Math.floor(Math.random() * exampleUrls.length)];
    document.getElementById('urlInput').placeholder = `Contoh: ${randomUrl}`;
}

// Fungsi untuk memproses URL Instagram
async function processInstagramUrl() {
    const urlInput = document.getElementById('urlInput').value.trim();
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    const resultSection = document.getElementById('resultSection');
    
    // Validasi URL
    if (!urlInput) {
        showError('Silakan masukkan URL Instagram');
        return;
    }
    
    if (!isValidInstagramUrl(urlInput)) {
        showError('URL tidak valid. Pastikan URL berasal dari Instagram (p/reel/tv)');
        return;
    }
    
    // Tampilkan loading
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    resultSection.style.display = 'none';
    
    try {
        // Fetch data dari API Vreden
        const data = await fetchInstagramData(urlInput);
        
        // Sembunyikan loading
        loading.style.display = 'none';
        
        if (data && data.status && data.result) {
            // Simpan data global
            currentInstagramData = data;
            
            // Tampilkan hasil
            displayInstagramData(data.result);
            
            // Tampilkan pesan sukses
            showSuccess('Data Instagram berhasil diambil!');
        } else {
            showError('Gagal mengambil data Instagram. Silakan coba URL lain.');
        }
        
    } catch (error) {
        console.error('Error:', error);
        loading.style.display = 'none';
        showError(`Terjadi kesalahan: ${error.message}`);
    }
}

// Validasi URL Instagram
function isValidInstagramUrl(url) {
    const patterns = [
        /https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+\/?/,
        /https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+\/\?.*/,
        /instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+/
    ];
    
    return patterns.some(pattern => pattern.test(url));
}

// Fetch data Instagram dari API
async function fetchInstagramData(url) {
    const fullApiUrl = apiUrl + encodeURIComponent(url);
    
    try {
        // Gunakan CORS proxy
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(fullApiUrl)}`;
        
        const response = await fetch(proxyUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        
        const proxyData = await response.json();
        const data = JSON.parse(proxyData.contents);
        
        return data;
        
    } catch (proxyError) {
        console.log('Proxy failed, trying direct fetch...');
        
        // Coba fetch langsung
        try {
            const response = await fetch(fullApiUrl, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json',
                }
            });
            
            if (!response.ok) {
                throw new Error(`Direct fetch failed: ${response.status}`);
            }
            
            return await response.json();
            
        } catch (directError) {
            console.error('All fetch methods failed:', directError);
            throw new Error('Tidak dapat terhubung ke server. Silakan coba lagi nanti.');
        }
    }
}

// Fungsi untuk menampilkan data Instagram
function displayInstagramData(data) {
    const resultSection = document.getElementById('resultSection');
    
    // Update profile info
    const profileImg = document.getElementById('profileImg');
    profileImg.src = data.profile.profile_pic_url;
    profileImg.onerror = function() {
        this.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.profile.full_name) + '&background=4fc3f7&color=fff&size=80';
    };
    
    document.getElementById('profileName').textContent = data.profile.full_name;
    document.getElementById('profileUsername').textContent = `@${data.profile.username}`;
    
    const verifiedElement = document.getElementById('profileVerified');
    if (data.profile.is_verified && data.profile.is_verified !== '-') {
        verifiedElement.textContent = '✓ Akun Terverifikasi';
        verifiedElement.className = 'verified';
    } else {
        verifiedElement.textContent = 'Akun Tidak Terverifikasi';
        verifiedElement.className = 'verified not-verified';
    }
    
    // Update media preview
    const videoPreview = document.getElementById('videoPreview');
    const imageContainer = document.getElementById('imageContainer');
    
    if (data.data && data.data.length > 0) {
        const media = data.data[0];
        
        if (media.type === 'video') {
            // Tampilkan video
            videoPreview.style.display = 'block';
            imageContainer.style.display = 'none';
            imageContainer.innerHTML = '';
            
            // Set video source dengan cache buster
            videoPreview.src = media.url + '?t=' + Date.now();
            videoPreview.poster = media.thumb;
            videoPreview.load();
            
            // Error handling untuk video
            videoPreview.onerror = function() {
                console.log('Video load error, showing thumbnail instead');
                videoPreview.style.display = 'none';
                imageContainer.style.display = 'flex';
                imageContainer.innerHTML = `
                    <img src="${media.thumb}" alt="Video Thumbnail" class="image-preview">
                    <p style="color:#ff4081; margin-top:10px;">Video tidak dapat diputar, tetapi masih bisa didownload</p>
                `;
            };
            
        } else if (media.type === 'image') {
            // Tampilkan gambar
            videoPreview.style.display = 'none';
            imageContainer.style.display = 'flex';
            imageContainer.innerHTML = `
                <img src="${media.url}" alt="Instagram Image" class="image-preview"
                     onerror="this.src='https://images.unsplash.com/photo-1611605698335-8b1569810432?ixlib=rb-4.0.3&auto=format&fit=crop&w=720&q=80'">
            `;
        }
    }
    
    // Update statistics
    document.getElementById('viewCount').textContent = 
        formatNumber(data.statistics.play_count || data.statistics.view_count || 0);
    document.getElementById('likeCount').textContent = 
        formatNumber(data.statistics.like_count || 0);
    document.getElementById('commentCount').textContent = 
        formatNumber(data.statistics.comment_count || 0);
    document.getElementById('shareCount').textContent = 
        formatNumber(data.statistics.share_count || 0);
    
    // Update caption
    const captionText = document.getElementById('captionText');
    captionText.textContent = data.caption.text || 'Tidak ada caption';
    
    // Update hashtags
    const hashtagsContainer = document.getElementById('hashtags');
    hashtagsContainer.innerHTML = '';
    
    if (data.caption.hashtags && data.caption.hashtags.length > 0) {
        data.caption.hashtags.forEach(hashtag => {
            if (hashtag && hashtag.trim()) {
                const tagElement = document.createElement('span');
                tagElement.className = 'hashtag';
                tagElement.textContent = `#${hashtag.replace('#', '')}`;
                hashtagsContainer.appendChild(tagElement);
            }
        });
    }
    
    // Jika tidak ada hashtag, tambahkan default
    if (hashtagsContainer.children.length === 0) {
        const defaultTags = ['instagram', 'reel', 'video'];
        defaultTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'hashtag';
            tagElement.textContent = `#${tag}`;
            hashtagsContainer.appendChild(tagElement);
        });
    }
    
    // Update tombol download
    const downloadVideoBtn = document.getElementById('downloadVideoBtn');
    const downloadAudioBtn = document.getElementById('downloadAudioBtn');
    const downloadThumbBtn = document.getElementById('downloadThumbBtn');
    
    if (data.data && data.data.length > 0) {
        const media = data.data[0];
        
        if (media.type === 'video') {
            // Video content
            downloadVideoBtn.innerHTML = '<i class="fas fa-video"></i> Download Video';
            downloadVideoBtn.style.display = 'flex';
            downloadAudioBtn.style.display = 'flex';
            downloadThumbBtn.style.display = 'flex';
            
            // Set data untuk download
            downloadVideoBtn.setAttribute('data-url', media.url);
            downloadAudioBtn.setAttribute('data-url', media.url);
            downloadThumbBtn.setAttribute('data-url', media.thumb);
            
            // Generate quality options
            generateQualityOptions(media);
            
        } else {
            // Image content
            downloadVideoBtn.innerHTML = '<i class="fas fa-image"></i> Download Gambar';
            downloadVideoBtn.style.display = 'flex';
            downloadAudioBtn.style.display = 'none';
            downloadThumbBtn.style.display = 'flex';
            
            // Set data untuk download
            downloadVideoBtn.setAttribute('data-url', media.url);
            downloadThumbBtn.setAttribute('data-url', media.thumb || media.url);
            
            // Hide quality options
            document.getElementById('qualityOptions').style.display = 'none';
        }
    }
    
    // Tampilkan result section
    resultSection.style.display = 'block';
    
    // Scroll ke hasil
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Generate quality options
function generateQualityOptions(media) {
    const qualityButtons = document.getElementById('qualityButtons');
    const qualityOptions = document.getElementById('qualityOptions');
    
    qualityButtons.innerHTML = '';
    
    // Buat kualitas berdasarkan data video
    const qualities = [];
    
    if (media.height) {
        qualities.push({
            label: `${media.height}p`,
            value: media.height,
            size: getSizeLabel(media.height),
            url: media.url,
            active: true
        });
    }
    
    // Tambahkan kualitas default jika tidak ada
    if (qualities.length === 0) {
        qualities.push(
            { label: 'SD', value: 480, size: 'Standard', url: media.url, active: true },
            { label: 'HD', value: 720, size: 'High', url: media.url },
            { label: 'FHD', value: 1080, size: 'Full HD', url: media.url }
        );
    }
    
    qualities.forEach((quality, index) => {
        const button = document.createElement('button');
        button.className = `quality-btn ${index === 0 ? 'active' : ''}`;
        button.innerHTML = `${quality.label} <span class="size-tag">${quality.size}</span>`;
        button.setAttribute('data-quality', quality.value);
        button.setAttribute('data-url', quality.url);
        
        button.addEventListener('click', function() {
            // Remove active dari semua
            document.querySelectorAll('.quality-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active ke yang diklik
            this.classList.add('active');
            
            // Update download button
            updateDownloadButton(quality.value, quality.url);
        });
        
        qualityButtons.appendChild(button);
    });
    
    qualityOptions.style.display = 'block';
}

// Helper untuk size label
function getSizeLabel(height) {
    if (height <= 480) return 'SD';
    if (height <= 720) return 'HD';
    if (height <= 1080) return 'FHD';
    return 'UHD';
}

// Update download button berdasarkan kualitas
function updateDownloadButton(quality, url) {
    const downloadVideoBtn = document.getElementById('downloadVideoBtn');
    downloadVideoBtn.innerHTML = `<i class="fas fa-video"></i> Download Video (${quality}p)`;
    downloadVideoBtn.setAttribute('data-url', url);
}

// Download video
function downloadVideo() {
    if (!currentInstagramData) {
        showError('Silakan proses URL terlebih dahulu');
        return;
    }
    
    const videoUrl = this.getAttribute('data-url');
    const qualityBtn = document.querySelector('.quality-btn.active');
    const quality = qualityBtn ? qualityBtn.getAttribute('data-quality') : 'HD';
    
    if (!videoUrl) {
        showError('URL video tidak tersedia');
        return;
    }
    
    const filename = `instagram_video_${quality}p_${Date.now()}.mp4`;
    
    showSuccess(`Mendownload video ${quality}p...`);
    
    // Download file
    startDownload(videoUrl, filename);
}

// Download audio
function downloadAudio() {
    if (!currentInstagramData) {
        showError('Silakan proses URL terlebih dahulu');
        return;
    }
    
    const videoUrl = this.getAttribute('data-url');
    
    if (!videoUrl) {
        showError('URL video tidak tersedia');
        return;
    }
    
    const filename = `instagram_audio_${Date.now()}.mp3`;
    
    showSuccess('Mengekstrak audio...');
    
    // Untuk ekstrak audio, kita bisa:
    // 1. Redirect ke service online
    // 2. Atau beri pesan manual
    setTimeout(() => {
        showSuccess('Untuk ekstrak audio, silakan gunakan: onlinevideoconverter.com');
        
        // Buka converter online di tab baru
        const converterUrl = `https://onlinevideoconverter.com/video-converter?url=${encodeURIComponent(videoUrl)}`;
        window.open(converterUrl, '_blank');
    }, 1000);
}

// Download thumbnail
function downloadThumbnail() {
    if (!currentInstagramData) {
        showError('Silakan proses URL terlebih dahulu');
        return;
    }
    
    const imageUrl = this.getAttribute('data-url');
    
    if (!imageUrl) {
        showError('URL gambar tidak tersedia');
        return;
    }
    
    const filename = `instagram_thumbnail_${Date.now()}.jpg`;
    
    showSuccess('Mendownload thumbnail...');
    
    // Download file
    startDownload(imageUrl, filename);
}

// Fungsi untuk memulai download
function startDownload(url, filename) {
    try {
        // Buat link sementara
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.target = '_blank';
        
        // Tambah ke body, klik, hapus
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
    } catch (error) {
        console.error('Download error:', error);
        showError('Gagal memulai download. Silakan coba manual: ' + url);
        
        // Fallback: Buka di tab baru
        window.open(url, '_blank');
    }
}

// Fungsi untuk menampilkan error
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.className = 'error-message error-animation';
    errorMessage.style.display = 'block';
    
    errorMessage.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
        errorMessage.classList.remove('error-animation');
    }, 1000);
}

// Fungsi untuk menampilkan success
function showSuccess(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.className = 'error-message success-message';
    errorMessage.style.display = 'block';
    
    errorMessage.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

// Format angka
function formatNumber(num) {
    const n = parseInt(num) || 0;
    
    if (n >= 1000000) {
        return (n / 1000000).toFixed(1) + 'M';
    } else if (n >= 1000) {
        return (n / 1000).toFixed(1) + 'K';
    }
    return n.toString();
}