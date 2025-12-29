// Instagram Downloader Script - NandSki

document.addEventListener('DOMContentLoaded', function() {
    // Inisialisasi tahun
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Buat efek meteor
    createMeteorEffect();
    
    // Event listener untuk tombol download
    document.getElementById('downloadBtn').addEventListener('click', fetchInstagramData);
    
    // Event listener untuk tombol download video
    document.getElementById('downloadVideoBtn').addEventListener('click', function() {
        const videoUrl = this.getAttribute('data-url');
        if (videoUrl) {
            window.open(videoUrl, '_blank');
        }
    });
    
    // Event listener untuk tombol download thumbnail
    document.getElementById('downloadThumbBtn').addEventListener('click', function() {
        const thumbUrl = this.getAttribute('data-url');
        if (thumbUrl) {
            window.open(thumbUrl, '_blank');
        }
    });
    
    // Enter key untuk trigger download
    document.getElementById('urlInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            fetchInstagramData();
        }
    });
    
    // Tampilkan data contoh saat pertama kali load
    setTimeout(showExampleData, 500);
});

// Fungsi untuk membuat efek meteor
function createMeteorEffect() {
    const container = document.getElementById('meteorContainer');
    
    for (let i = 0; i < 15; i++) {
        const meteor = document.createElement('div');
        meteor.className = 'meteor';
        
        // Random posisi dan delay
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = Math.random() * 3 + 2;
        
        meteor.style.left = `${left}%`;
        meteor.style.top = `-100px`;
        meteor.style.animation = `meteorFall ${duration}s linear ${delay}s infinite`;
        
        container.appendChild(meteor);
    }
}

// Fungsi untuk mengambil data Instagram
async function fetchInstagramData() {
    const urlInput = document.getElementById('urlInput').value.trim();
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');
    const resultSection = document.getElementById('resultSection');
    
    // Validasi URL
    if (!urlInput) {
        showError('Silakan masukkan URL Instagram');
        return;
    }
    
    if (!urlInput.includes('instagram.com')) {
        showError('URL harus berasal dari Instagram');
        return;
    }
    
    // Tampilkan loading
    loading.style.display = 'block';
    errorMessage.style.display = 'none';
    resultSection.style.display = 'none';
    
    try {
        // Gunakan API vreden
        const apiUrl = `https://api.vreden.my.id/api/v1/download/instagram?url=${encodeURIComponent(urlInput)}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Sembunyikan loading
        loading.style.display = 'none';
        
        if (data.status && data.result) {
            // Tampilkan hasil
            displayInstagramData(data.result);
        } else {
            showError('Gagal mengambil data. Silakan coba lagi.');
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
        loading.style.display = 'none';
        showError(`Terjadi kesalahan: ${error.message}. Silakan coba lagi.`);
    }
}

// Fungsi untuk menampilkan data Instagram
function displayInstagramData(data) {
    const resultSection = document.getElementById('resultSection');
    
    // Update profile info
    const profileImg = document.getElementById('profileImg');
    profileImg.src = data.profile.profile_pic_url || 'https://via.placeholder.com/80';
    profileImg.onerror = function() {
        this.src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.profile.full_name) + '&background=4fc3f7&color=fff&size=80';
    };
    
    document.getElementById('profileName').textContent = data.profile.full_name || 'Tidak diketahui';
    document.getElementById('profileUsername').textContent = data.profile.username ? `@${data.profile.username}` : '@unknown';
    document.getElementById('profileVerified').textContent = 
        data.profile.is_verified === '-' || !data.profile.is_verified ? 'Akun Tidak Terverifikasi' : 'Akun Terverifikasi';
    
    // Update video preview
    if (data.data && data.data.length > 0 && data.data[0].type === 'video') {
        const video = data.data[0];
        const videoPreview = document.getElementById('videoPreview');
        videoPreview.src = video.url;
        videoPreview.poster = video.thumb || '';
        videoPreview.load();
        
        // Set data untuk tombol download
        document.getElementById('downloadVideoBtn').setAttribute('data-url', video.url);
        document.getElementById('downloadThumbBtn').setAttribute('data-url', video.thumb || video.url);
    } else if (data.data && data.data.length > 0 && data.data[0].type === 'image') {
        // Handle image posts
        const image = data.data[0];
        const videoPreview = document.getElementById('videoPreview');
        videoPreview.style.display = 'none';
        document.querySelector('.video-container').innerHTML = `
            <img src="${image.url}" alt="Instagram Image" class="video-preview" style="display: block;">
        `;
        
        // Set data untuk tombol download
        document.getElementById('downloadVideoBtn').setAttribute('data-url', image.url);
        document.getElementById('downloadVideoBtn').innerHTML = '<i class="fas fa-image"></i> Download Gambar';
        document.getElementById('downloadThumbBtn').setAttribute('data-url', image.url);
    }
    
    // Update statistics
    document.getElementById('playCount').textContent = 
        formatNumber(data.statistics.play_count || data.statistics.view_count || 0);
    document.getElementById('likeCount').textContent = 
        formatNumber(data.statistics.like_count || 0);
    document.getElementById('commentCount').textContent = 
        formatNumber(data.statistics.comment_count || 0);
    document.getElementById('shareCount').textContent = 
        formatNumber(data.statistics.share_count || 0);
    
    // Update caption
    document.getElementById('captionText').textContent = data.caption.text || 'Tidak ada caption';
    
    // Update hashtags
    const hashtagsContainer = document.getElementById('hashtags');
    hashtagsContainer.innerHTML = '';
    
    if (data.caption.hashtags && data.caption.hashtags.length > 0) {
        data.caption.hashtags.forEach(hashtag => {
            const tagElement = document.createElement('span');
            tagElement.className = 'hashtag';
            tagElement.textContent = `#${hashtag}`;
            hashtagsContainer.appendChild(tagElement);
        });
    } else {
        hashtagsContainer.innerHTML = '<span class="hashtag">Tidak ada hashtag</span>';
    }
    
    // Tampilkan result section
    resultSection.style.display = 'block';
    
    // Scroll ke hasil
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Fungsi untuk menampilkan data contoh
function showExampleData() {
    // Data contoh dari API
    const exampleData = {
        profile: {
            full_name: "Jake",
            username: "mycustomgokart",
            is_verified: "-",
            profile_pic_url: "https://scontent-vie1-1.cdninstagram.com/v/t51.2885-19/564228872_18057347828539367_7224228249173723831_n.jpg?stp=dst-jpg_e0_s150x150_tt6&efg=eyJ2ZW5jb2RlX3RhZyI6InByb2ZpbGVfcGljLmRqYW5nby4xMDgwLmMyIn0&_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_cat=111&_nc_oc=Q6cZ2QEL6ouMOBO2oVhYKtNaU-CaBC-mkaiS3LvIhYGoN8AlfzLC0z0ApYg330BjDdVQfbk&_nc_ohc=D4L9OmeSB9wQ7kNvwFN9yu-&_nc_gid=FwtXNo1kf1qAXjoTnLT7rw&edm=ALQROFkBAAAA&ccb=7-5&ig_cache_key=GAhzoSHn3_fqDydAALeKVyhRnUFkbmNDAQAB1501500j-ccb7-5&oh=00_AfkqI1NNNFC-5uRArz38vL3VT3LILxvJbcM4N2hqVLkiJw&oe=6957A987&_nc_sid=fc8dfb"
        },
        data: [
            {
                type: "video",
                url: "https://scontent-vie1-1.cdninstagram.com/o1/v/t2/f2/m86/AQPeAAGWGPGIM3BzvXKNg0PkTZdxBcAT_0YBDnsxMTfCkA_D_urw_Xv5E_G1aWGPLLTRi3axR8p84gFPYggg8f4zPH0ubijI6oW_w2k.mp4?_nc_cat=101&_nc_sid=5e9851&_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_ohc=iUsQtFwipJwQ7kNvwE0X5pd&efg=eyJ2ZW5jb2RlX3RhZyI6Inhwdl9wcm9ncmVzc2l2ZS5JTlNUQUdSQU0uQ0xJUFMuQzMuNzIwLmRhc2hfYmFzZWxpbmVfMV92MSIsInhwdl9hc3NldF9pZCI6ODYxODUwMDk3MDA0MDcyLCJhc3NldF9hZ2VfZGF5cyI6NzUsInZpX3VzZWNhc2VfaWQiOjEwMDk5LCJkdXJhdGlvbl9zIjoxMiwidXJsZ2VuX3NvdXJjZSI6Ind3dyJ9&ccb=17-1&_nc_gid=FwtXNo1kf1qAXjoTnLT7rw&_nc_zt=28&vs=b8e181028a82bb34&_nc_vs=HBksFQIYUmlnX3hwdl9yZWVsc19wZXJtYW5lbnRfc3JfcHJvZC84MTRGRjA0NTVCN0Y3Qjg0MjJBODMxNkYwNDkxRTg4MF92aWRlb19kYXNoaW5pdC5tcDQVAALIARIAFQIYOnBhc3N0aHJvdWdoX2V2ZXJzdG9yZS9HRGYwcWlFNzZHSkFWWjBFQU9QT1M1YzBWM3NkYnN0VEFRQUYVAgLIARIAKAAYABsCiAd1c2Vfb2lsATEScHJvZ3Jlc3NpdmVfcmVjaXBlATEVAAAm0LiNzqP2hwMVAigCQzMsF0Ao7peNT987GBJkYXNoX2Jhc2VsaW5lXzFfdjERAHX-B2XmnQEA&oh=00_AfkIn8aj3jZlFUJGOLdZlPKOt2CgZwxG-Y8pzp1TgUAsXw&oe=6953CB92",
                thumb: "https://scontent-vie1-1.cdninstagram.com/v/t51.82787-15/563876442_18057186356539367_4641752087641718998_n.jpg?stp=dst-jpg_e15_s640x640_tt6&_nc_cat=107&ig_cache_key=Mzc0MzMyMTgzMDA0OTMzMDUwNDE4MDU3MTg2MzUwNTM5MzY3.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjcyMHgxMjgwLnNkci5DMyJ9&_nc_ohc=cSwbcYD_PlYQ7kNvwHIPDL_&_nc_oc=AdnpMVnxqEh3ry1MAyHrwp2ITveKsv3lUXGSmyheB6CwtrgjA34kHw5Gn6_cdAuc2n4&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=scontent-vie1-1.cdninstagram.com&_nc_gid=FwtXNo1kf1qAXjoTnLT7rw&oh=00_Afm4RVVwAjdFEln-N9oT0-Xnw7LBaxuAZAxTf66qmYhJqA&oe=6957C7AD"
            }
        ],
        statistics: {
            play_count: 3731395,
            like_count: 244175,
            comment_count: 223,
            share_count: 12222
        },
        caption: {
            text: "FOR FREE??\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n•\n#custom #drift #drifting #summer #minibike #racing #gokarting #motorsport #race #speed #gokartracing #karts #racecar #sport #fun #driftkart #diy #fabrication #hoonigan #gokart #gokarts #gocarts #gocart #ticktok #comedy #fyp #cars #carsofinstagram #auto #project",
            hashtags: ["custom", "drift", "drifting", "summer", "minibike", "racing", "gokarting", "motorsport", "race", "speed", "gokartracing", "karts", "racecar", "sport", "fun", "driftkart", "diy", "fabrication", "hoonigan", "gokart", "gokarts", "gocarts", "gocart", "ticktok", "comedy", "fyp", "cars", "carsofinstagram", "auto", "project"]
        }
    };
    
    displayInstagramData(exampleData);
}

// Fungsi untuk menampilkan error
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Scroll ke error
    errorMessage.scrollIntoView({ behavior: 'smooth' });
}

// Fungsi untuk format angka (1,000,000)
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Fungsi untuk mengubah tanggal Unix ke format yang mudah dibaca
function formatDate(timestamp) {
    if (!timestamp) return 'Tidak diketahui';
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Fungsi untuk mengubah durasi detik ke format menit:detik
function formatDuration(seconds) {
    if (!seconds) return 'Tidak diketahui';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}