// --- 1. KONFIGURASI & DATA ---
const targetDate = new Date("April 21, 2026 00:00:00").getTime();

const dataMateri = {
    "🧠 Penalaran Umum": [
        "Logika Proposisi (Jika-Maka)", "Penarikan Kesimpulan", 
        "Kuantor (Semua/Ada)", "Pola Barisan Bilangan", 
        "Pola Huruf & Gambar", "Aritmatika Dasar"
    ],
    "📐 Pengetahuan Kuantitatif": [
        "Aljabar & Persamaan", "Fungsi Kuadrat", "Eksponen & Akar",
        "Bangun Datar & Ruang", "Sudut & Garis", "Statistika Dasar", 
        "Peluang & Kombinatorika", "Matriks"
    ],
    "📖 PPU & Literasi Indo": [
        "Ide Pokok & Simpulan", "PUEBI (Huruf Kapital/Miring)", 
        "Tanda Baca", "Kalimat Efektif (SPOK)", "Konjungsi",
        "Makna Kata & Istilah"
    ],
    "🌍 Literasi Inggris": [
        "Topic & Main Idea", "Author's Purpose/Tone", 
        "Detailed Information", "Synonym & Reference", 
        "Inference (Kesimpulan Tersirat)"
    ],
    "📊 Penalaran Matematika": [
        "Aritmatika Sosial (Diskon/Bunga)", "Perbandingan & Skala", 
        "Kecepatan & Debit", "Membaca Data Grafik/Tabel", 
        "Geometri Terapan"
    ]
};

// --- 2. COUNTDOWN & HARI INI ---
function initHeader() {
    // Countdown Logic
    const now = new Date().getTime();
    const diff = targetDate - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    const badge = document.getElementById('countdownText');
    if (badge) {
        badge.innerHTML = diff > 0 ? `⏳ ${days} Hari Menuju UTBK` : "🚀 Waktunya Perang!";
    }

    // Highlight Hari Ini
    const hariIni = new Date().getDay(); // 0=Minggu, 1=Senin...
    document.querySelectorAll('.day-card').forEach(card => {
        card.classList.remove('hari-ini');
        if (parseInt(card.dataset.hari) === hariIni) {
            card.classList.add('hari-ini');
        }
    });
}

// --- 3. RENDER MATERI ---
function renderMateri() {
    const container = document.getElementById('checklistContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    let total = 0; 
    let checked = 0;

    for (const [kategori, topikList] of Object.entries(dataMateri)) {
        const group = document.createElement('div');
        group.className = 'subject-group';
        
        let itemsHtml = '<div class="item-list">';
        topikList.forEach((topik, i) => {
            // ID unik tanpa spasi
            const id = kategori.replace(/[^a-zA-Z]/g, '') + i;
            const isDone = localStorage.getItem(id) === 'true';
            
            if (isDone) checked++;
            total++;

            itemsHtml += `
                <label class="check-item">
                    <input type="checkbox" onchange="toggleCheck('${id}')" ${isDone ? 'checked' : ''}>
                    <span class="text-label">${topik}</span>
                </label>
            `;
        });
        itemsHtml += '</div>';

        group.innerHTML = `<div class="subject-header">${kategori}</div>` + itemsHtml;
        container.appendChild(group);
    }
    
    updateProgressBar(checked, total);
}

// --- 4. LOGIC CHECKLIST & TABS ---
function toggleCheck(id) {
    const isChecked = localStorage.getItem(id) === 'true';
    localStorage.setItem(id, !isChecked); 
    renderMateri(); 
}

function updateProgressBar(checked, total) {
    const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    
    if(bar) bar.style.width = `${percent}%`;
    if(text) text.innerText = `${percent}% Materi Tuntas`;
}

function resetProgress() {
    if(confirm('Yakin mau hapus semua progress? (Tidak bisa dikembalikan)')) {
        localStorage.clear();
        renderMateri();
    }
}

function switchTab(tabId, btn) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
}

// --- 5. START ---
// Menjalankan fungsi saat file di-load
initHeader();
renderMateri();


