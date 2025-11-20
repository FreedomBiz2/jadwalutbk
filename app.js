// --- 1. KONFIGURASI & DATA ---
const targetDate = new Date("April 21, 2026 00:00:00").getTime();

const dataMateri = {
  "🧠 Penalaran Umum": [
    "Hubungan Sebab-Akibat",
    "Logika: Ponens, Tollens, Negasi",
    "Logika: Ekuivalensi, Silogisme, Biimplikasi",
    "Pernyataan Pasti Benar & Mungkin Benar",
    "Tabel Kebenaran",
    "Memperkuat & Memperlemah Argumen",
    "Kualitas Simpulan",
    "Perbandingan Argumen",
    "Diagram Venn",
    "Bahas Soal Inferensi & Interpretasi Teks",
    "Logika Formal & Representasi Visual",
    "Pola Barisan Angka dan Huruf",
    "Pola Angka dalam Bangun",
    "Penarikan Kesimpulan",
    "Aritmatika Dasar"
  ],

  "📐 Pengetahuan Kuantitatif": [
    "Persamaan dan Sistem Persamaan",
    "Persamaan Kuadrat",
    "Fungsi Linear",
    "Fungsi Sepotong",
    "Fungsi Kuadrat",
    "Fungsi Komposisi & Invers",
    "Fungsi Khusus",
    "Garis dan Sudut",
    "Konsep Luas dan Keliling",
    "Kesebangunan Berbasis Koordinat",
    "Definisi Trigonometri",
    "Sudut Berelasi",
    "Statistika Deskriptif",
    "Barisan & Deret Aritmetika",
    "Barisan & Deret Geometri"
  ],

  "📊 Penalaran Matematika": [
    "Sudut & Hubungan Antarsudut",
    "Bangun Datar dan Properti",
    "Keliling dan Luas",
    "Teorema Pythagoras",
    "Trigonometri pada Segitiga",
    "Aturan Sinus & Aturan Cosinus",
    "Kesebangunan",
    "Bangun Ruang dan Properti",
    "Volume dan Luas Permukaan",
    "Jarak Titik ke Titik",
    "Jarak Titik ke Garis",
    "Jarak Titik ke Bidang",
    "Konsep & Aplikasi Fungsi",
    "Menentukan Fungsi untuk Memodelkan Masalah Geometris",
    "Ukuran Pemusatan Data (mean, median, modus)",
    "Ukuran Penyebaran Data (range, variance, sd)",
    "Diagram Batang, Garis, & Lingkaran",
    "Metode Filling Slot (pola penyusun)",
    "Permutasi & Permutasi Siklis",
    "Kombinasi",
    "Kaidah Pencacahan & Peluang",
    "Barisan & Deret Aritmetika Bertingkat",
    "Barisan Geometri & Bunga Tunggal",
    "Menentukan Masalah dengan Barisan"
  ],

  "📖 PPU & Literasi Indo": [
    "Penulisan Huruf Kapital",
    "Penulisan Huruf Miring & Tebal (formatting)",
    "Tanda Baca: Koma & Lainnya",
    "Afiksasi & Hukum KTSP",
    "Reduplikasi & Majemuk (berpasangan tetap)",
    "Konjungsi",
    "Preposisi",
    "Leksikal, Gramatikal, & Sinonim",
    "Pola Penyusun Kalimat",
    "Inti Kalimat (SPOK)",
    "Tema, Topik, & Judul",
    "Gagasan Pokok",
    "Teks Rumpang & Acak",
    "Transisi & Kesatuan Ide dalam Teks",
    "Keefektifan Kalimat & Teks Bacaan",
    "Kerapatan Bahasa"
  ],

  "🌍 Literasi Inggris": [
    "Text's Structure",
    "Main Idea",
    "Organization Ideas: Predicting, Summarizing, Organizing",
    "Finding Detailed Information",
    "Conclusion",
    "Relation Between Texts",
    "Author's Purpose / Tone",
    "Author's Related Question",
    "Statement: True/False/Opinion/Factual",
    "Words & Meaning: Synonym/Antonym, Equal/Unequal Meaning",
    "Reference (pronouns, lexical reference)"
  ],

  "📚 Literasi Bahasa Indonesia": [
    "Jenis-jenis Teks Bacaan",
    "Ragam Jenis Teks (Saintek & Soshum)",
    "Pernyataan Sesuai & Tidak Sesuai",
    "Semantik & Majas",
    "Fakta vs Opini"
  ]
};

// helper: buat slug aman dari kategori (dengan fallback)
function slugify(str) {
  try {
    const normalized = str.normalize ? str.normalize('NFKD') : str;
    return normalized
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-') // non-letter/number -> dash
      .replace(/^-+|-+$/g, '');
  } catch (e) {
    // fallback
    const s = (str || '').toString();
    const normalized = s.normalize ? s.normalize('NFKD').replace(/[\u0300-\u036f]/g, '') : s;
    return normalized
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

// --- MODAL: helper refs ---
const modalOverlay = () => document.getElementById('modalConfirm');
const modalConfirmBtn = () => document.getElementById('modalConfirmBtn');
const modalCancelBtn = () => document.getElementById('modalCancel');

// --- MODAL: buka / tutup ---
function openResetModal() {
  const modal = modalOverlay();
  if (!modal) return;
  modal.style.display = 'flex';
  modal.setAttribute('aria-hidden', 'false');
  const confirm = modalConfirmBtn();
  if (confirm) confirm.focus();
  document.addEventListener('keydown', handleModalKeyDown);
  modal.addEventListener('click', handleOverlayClick);
}

function closeResetModal() {
  const modal = modalOverlay();
  if (!modal) return;
  modal.style.display = 'none';
  modal.setAttribute('aria-hidden', 'true');
  document.removeEventListener('keydown', handleModalKeyDown);
  modal.removeEventListener('click', handleOverlayClick);
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) resetBtn.focus();
}

function handleModalKeyDown(e) {
  if (e.key === 'Escape') closeResetModal();
}

function handleOverlayClick(e) {
  if (e.target && e.target.id === 'modalConfirm') closeResetModal();
}

// --- GLOBAL UI ---
function switchTab(tabId, btnEl) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.setAttribute('aria-hidden', 'true');
  });
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });

  const page = document.getElementById(tabId);
  if (page) {
    page.classList.add('active');
    page.setAttribute('aria-hidden', 'false');
  }
  if (btnEl) {
    btnEl.classList.add('active');
    btnEl.setAttribute('aria-selected', 'true');
    btnEl.focus();
  }
}

// update progress bar berdasarkan state DOM (efisien)
function updateProgressBarFromDOM() {
  const container = document.getElementById('checklistContainer');
  if (!container) return;
  const inputs = container.querySelectorAll('input[type="checkbox"]');
  const total = inputs.length;
  let checked = 0;
  inputs.forEach(i => { if (i.checked) checked++; });
  updateProgressBar(checked, total);
}

// fungsi yang dipanggil saat checkbox di-toggle (tidak merender ulang seluruh list)
function toggleCheck(id, checkboxEl) {
  const isChecked = !!checkboxEl.checked;
  localStorage.setItem(id, isChecked.toString());
  const label = checkboxEl.closest('.check-item');
  if (label) {
    const textLabel = label.querySelector('.text-label');
    if (textLabel) {
      if (isChecked) {
        textLabel.style.textDecoration = 'line-through';
        textLabel.style.color = '#9CA3AF';
      } else {
        textLabel.style.textDecoration = 'none';
        textLabel.style.color = '';
      }
    }
  }
  updateProgressBarFromDOM();
}

function resetProgressInternal() {
  const prefixes = Object.keys(dataMateri).map(k => slugify(k) + '__');
  const keysToRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (prefixes.some(pref => key.startsWith(pref))) keysToRemove.push(key);
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
}

function confirmResetProgress() {
  resetProgressInternal();
  closeResetModal();
  renderMateri();
}

// --- HEADER & RENDER ---
function initHeader() {
  const now = new Date().getTime();
  const diff = targetDate - now;
  const badge = document.getElementById('countdownText');

  if (badge) {
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      badge.innerHTML = `⏳ ${days} Hari Menuju UTBK`;
    } else {
      badge.innerHTML = "🚀 Waktunya Perang!";
    }
  }

  // highlight hari ini
  const hariIni = new Date().getDay();
  document.querySelectorAll('.day-card').forEach(card => {
    card.classList.remove('hari-ini');
    card.removeAttribute('aria-current');
    if (parseInt(card.dataset.hari, 10) === hariIni) {
      card.classList.add('hari-ini');
      card.setAttribute('aria-current', 'date');
      card.style.order = '-1';
    } else {
      card.style.order = '';
    }
  });
}

function renderMateri() {
  const container = document.getElementById('checklistContainer');
  if (!container) return;

  container.innerHTML = '';

  for (const [kategori, topikList] of Object.entries(dataMateri)) {
    const group = document.createElement('div');
    group.className = 'subject-group';

    const header = document.createElement('div');
    header.className = 'subject-header';
    header.textContent = kategori;
    group.appendChild(header);

    const itemList = document.createElement('div');
    itemList.className = 'item-list';

    const prefix = slugify(kategori) + '__';
    topikList.forEach((topik, i) => {
      const id = prefix + i;
      const isDone = localStorage.getItem(id) === 'true';

      const label = document.createElement('label');
      label.className = 'check-item';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.id = id;
      input.checked = isDone;
      input.setAttribute('aria-label', topik);
      input.addEventListener('change', () => toggleCheck(id, input));

      const span = document.createElement('span');
      span.className = 'text-label';
      span.textContent = topik;
      if (isDone) {
        span.style.textDecoration = 'line-through';
        span.style.color = '#9CA3AF';
      }

      label.appendChild(input);
      label.appendChild(span);
      itemList.appendChild(label);
    });

    group.appendChild(itemList);
    container.appendChild(group);
  }

  updateProgressBarFromDOM();
}

function updateProgressBar(checked, total) {
  const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('progressText');

  if (bar) bar.style.width = `${percent}%`;
  if (text) text.innerText = `${percent}% Materi Tuntas`;
}

// --- Export / Import progress JSON ---
function exportProgress() {
  const prefixes = Object.keys(dataMateri).map(k => slugify(k) + '__');
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (prefixes.some(pref => k.startsWith(pref))) data[k] = localStorage.getItem(k);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'progress-utbk.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function importProgressFromFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      const prefixes = Object.keys(dataMateri).map(k => slugify(k) + '__');
      Object.keys(data).forEach(k => {
        if (prefixes.some(pref => k.startsWith(pref))) {
          localStorage.setItem(k, data[k]);
        }
      });
      renderMateri();
      alert('Import selesai.');
    } catch (err) {
      alert('Gagal mengimpor file: format tidak valid.');
    }
  };
  reader.readAsText(file);
}

// --- INIT UI LISTENERS ---
document.addEventListener('DOMContentLoaded', function () {
  // tabs
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.addEventListener('click', () => switchTab(b.dataset.tab, b));
    b.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        switchTab(b.dataset.tab, b);
      }
    });
  });

  // footer buttons
  const resetBtn = document.getElementById('resetBtn');
  if (resetBtn) resetBtn.addEventListener('click', openResetModal);

  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) exportBtn.addEventListener('click', exportProgress);

  const importBtn = document.getElementById('importBtn');
  const importFile = document.getElementById('importFile');
  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => importFile.click());
    importFile.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (file) importProgressFromFile(file);
      importFile.value = '';
    });
  }

  // modal buttons
  const modalConfirm = modalConfirmBtn();
  if (modalConfirm) modalConfirm.addEventListener('click', confirmResetProgress);
  const modalCancel = modalCancelBtn();
  if (modalCancel) modalCancel.addEventListener('click', closeResetModal);

  // ensure modal hidden initially
  const modal = modalOverlay();
  if (modal) modal.style.display = 'none';

  // start
  initHeader();
  renderMateri();

  // update countdown setiap 30 detik
  setInterval(initHeader, 30_000);
});
