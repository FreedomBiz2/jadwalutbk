// ===== app.js (refactored, safe, with versioning, search, accordion) =====
(() => {
  'use strict';

  // --- config ---
  const targetDate = new Date('April 21, 2026 00:00:00').getTime();
  const STORAGE_PREFIX = 'focus_utbk__';
  const VERSION_KEY = STORAGE_PREFIX + 'materi_version';
  const CURRENT_VERSION = 1;

  // ===== SAFE DATA MATERI =====
  const dataMateri = {
    "PENALARAN UMUM": [
      "Penalaran Umum (hlm. 26)",
      "Penalaran Induktif (hlm. 27)",
      "Penalaran Deduktif (hlm. 30)",
      "Penalaran Kuantitatif (hlm. 50)"
    ],
    "PENGETAHUAN DAN PEMAHAMAN UMUM": [
      "Semantik (hlm. 56)",
      "Sintaksis (hlm. 59)",
      "Kalimat Efektif (hlm. 62)",
      "Paragraf (hlm. 64)",
      "Bahasa Panda (hlm. 76)"
    ],
    "PEMAHAMAN BACAAN DAN MENULIS": [
      "Kaidah Penulisan Bahasa Indonesia (hlm. 79)",
      "Konjungsi (hlm. 99)",
      "Morfologi (hlm. 101)"
    ],
    "PENGETAHUAN KUANTITATIF": [
      "Operasi Bilangan (hlm. 104)",
      "Eksponen dan Logaritma (hlm. 113)",
      "Bentuk Akar (hlm. 116)",
      "Perbandingan dan Geometri (hlm. 118)",
      "Fungsi, Persamaan, dan Pertidaksamaan (hlm. 122)",
      "Fungsi dan Persamaan Kuadrat (hlm. 128)",
      "Barisan dan Deret (hlm. 132)",
      "Geometri Bangun Datar (hlm. 135)",
      "Lingkaran (hlm. 142)",
      "Fungsi Komposisi (hlm. 146)",
      "Kalkulus Dasar (hlm. 149)",
      "Matriks dan Transformasi Geometri (hlm. 156)",
      "Peluang (hlm. 160)",
      "Statistika (hlm. 164)"
    ],
    "LITERASI BAHASA INDONESIA": [
      "Literasi Bahasa Indonesia (hlm. 169)"
    ],
    "LITERASI BAHASA INGGRIS": [
      "Detail Information (hlm. 178)",
      "Inference (hlm. 182)",
      "Main Idea (hlm. 187)",
      "Author's Tone and Opinion (hlm. 191)",
      "Synonym and Reference Question (hlm. 195)",
      "Main Purpose (hlm. 198)",
      "Simplify Questions (hlm. 202)",
      "Unstated Question (hlm. 206)",
      "Transition Question and Organization of Ideas (hlm. 210)"
    ],
    "PENALARAN MATEMATIKA": [
      "Bilangan (hlm. 215)",
      "Pengukuran dan Geometri (hlm. 220)",
      "Data dan Ketidakpastian (hlm. 236)",
      "Aljabar (hlm. 240)"
    ]
  };

  // ===== utilities =====
  function slugify(str) {
    if (!str) return '';
    try {
      const normalized = str.normalize ? str.normalize('NFKD') : str;
      return normalized.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '');
    } catch (e) {
      return ('' + str).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    }
  }

  // Error reporting to badge
  window.addEventListener('error', function (ev) {
    try {
      const badge = document.getElementById('countdownText');
      const msg = ev && ev.message ? ev.message : String(ev);
      if (badge) badge.textContent = 'JS Error: ' + msg;
    } catch (e) {
      console.error('Error handler failed', e);
    }
    console.error('Captured error:', ev.error || ev.message || ev);
  });
  window.addEventListener('unhandledrejection', function (ev) {
    try {
      const badge = document.getElementById('countdownText');
      if (badge) badge.textContent = 'Promise Error: ' + (ev.reason && ev.reason.message ? ev.reason.message : String(ev.reason));
    } catch (e) {}
    console.error('Unhandled rejection', ev);
  });

  // ----- modal helpers -----
  const modalOverlay = () => document.getElementById('modalConfirm');
  const modalConfirmBtn = () => document.getElementById('modalConfirmBtn');
  const modalCancelBtn = () => document.getElementById('modalCancel');

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

  // ----- Versioning / migration -----
  function ensureVersion() {
    try {
      const stored = Number(localStorage.getItem(VERSION_KEY) || '0');
      if (stored !== CURRENT_VERSION) {
        // simple migration strategy: keep keys that match our current prefixes; remove unknown previous keys created by older versions
        const prefixes = Object.keys(dataMateri).map(k => slugify(k) + '__');
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (!key) continue;
          // keep only keys that start with our prefixes or generic app keys (VERSION_KEY)
          if (key === VERSION_KEY) continue;
          if (!prefixes.some(pref => key.startsWith(pref))) keysToRemove.push(key);
        }
        keysToRemove.forEach(k => localStorage.removeItem(k));
        localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
      }
    } catch (e) {
      console.error('Version check failed', e);
      localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
    }
  }

  // ----- Render logic -----
  function renderMateri(filterText = '') {
    const container = document.getElementById('checklistContainer');
    if (!container) return;
    container.innerHTML = '';

    const lowerFilter = filterText.trim().toLowerCase();

    for (const [kategori, topikList] of Object.entries(dataMateri)) {
      const prefix = slugify(kategori) + '__';
      // group wrapper
      const group = document.createElement('section');
      group.className = 'subject-group';
      group.setAttribute('data-kategori', kategori);

      // header (clickable for collapse)
      const header = document.createElement('button');
      header.className = 'subject-header';
      header.type = 'button';
      header.setAttribute('aria-expanded', 'true');

      const title = document.createElement('div');
      title.className = 'title';
      title.textContent = kategori;

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.innerHTML = `<span class="chev">▾</span> <span style="margin-left:8px;font-weight:600;">${topikList.length}</span>`;

      header.appendChild(title);
      header.appendChild(meta);
      group.appendChild(header);

      // item list
      const itemList = document.createElement('div');
      itemList.className = 'item-list';

      topikList.forEach((topik, i) => {
        if (lowerFilter && !topik.toLowerCase().includes(lowerFilter) && !kategori.toLowerCase().includes(lowerFilter)) return;

        const id = prefix + i;
        const isDone = localStorage.getItem(id) === 'true';

        const label = document.createElement('label');
        label.className = 'check-item' + (isDone ? ' done' : '');
        label.setAttribute('data-id', id);

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = id;
        input.checked = isDone;
        input.setAttribute('aria-label', topik);

        const span = document.createElement('span');
        span.className = 'text-label';
        span.textContent = topik;

        // event handled with delegation below, but set change for accessibility
        input.addEventListener('change', (e) => toggleCheck(id, e.target.checked, label));

        label.appendChild(input);
        label.appendChild(span);
        itemList.appendChild(label);
      });

      group.appendChild(itemList);
      container.appendChild(group);

      // collapse behavior
      header.addEventListener('click', () => {
        const expanded = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        itemList.classList.toggle('collapsed', expanded);
      });
    }

    updateProgressBarFromDOM();
  }

  function updateProgressBar(checked, total) {
    const percent = total === 0 ? 0 : Math.round((checked / total) * 100);
    const bar = document.getElementById('progressBar');
    const text = document.getElementById('progressText');
    if (bar) {
      bar.style.width = percent + '%';
      bar.setAttribute('aria-valuenow', String(percent));
    }
    if (text) text.innerText = `${percent}% Materi Tuntas`;
  }

  function updateProgressBarFromDOM() {
    const container = document.getElementById('checklistContainer');
    if (!container) return;
    const inputs = container.querySelectorAll('input[type="checkbox"]');
    const total = inputs.length;
    let checked = 0;
    inputs.forEach(i => { if (i.checked) checked++; });
    updateProgressBar(checked, total);
  }

  // toggle check -- centralized action
  function toggleCheck(id, isChecked, labelEl) {
    try {
      localStorage.setItem(id, isChecked ? 'true' : 'false');
      if (labelEl) {
        labelEl.classList.toggle('done', isChecked);
      } else {
        // fallback: update DOM later
        renderMateri(document.getElementById('searchInput').value || '');
      }
      updateProgressBarFromDOM();
    } catch (e) {
      console.error('toggleCheck failed', e);
    }
  }

  // Reset logic (safe)
  function resetProgressInternal() {
    const prefixes = Object.keys(dataMateri).map(k => slugify(k) + '__');
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      if (prefixes.some(pref => key.startsWith(pref))) keysToRemove.push(key);
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }

  function confirmResetProgress() {
    resetProgressInternal();
    closeResetModal();
    renderMateri(document.getElementById('searchInput').value || '');
  }

  // Export/import
  function exportProgress() {
    const prefixes = Object.keys(dataMateri).map(k => slugify(k) + '__');
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k === VERSION_KEY) continue;
      if (prefixes.some(pref => k.startsWith(pref))) data[k] = localStorage.getItem(k);
    }
    const blob = new Blob([JSON.stringify({ version: CURRENT_VERSION, data }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'progress-utbk.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  function importProgressFromFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const parsed = JSON.parse(e.target.result);
        const importData = parsed && parsed.data ? parsed.data : parsed;
        const prefixes = Object.keys(dataMateri).map(k => slugify(k) + '__');
        Object.keys(importData).forEach(k => {
          if (prefixes.some(pref => k.startsWith(pref))) {
            localStorage.setItem(k, importData[k]);
          }
        });
        // set version
        localStorage.setItem(VERSION_KEY, String(CURRENT_VERSION));
        renderMateri(document.getElementById('searchInput').value || '');
        alert('Import selesai.');
      } catch (err) {
        alert('Gagal mengimpor file: format tidak valid.');
        console.error(err);
      }
    };
    reader.readAsText(file);
  }

  // Tabs
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

  // Header init countdown + highlight hari ini
  function initHeader() {
    const now = Date.now();
    const diff = targetDate - now;
    const badge = document.getElementById('countdownText');

    if (badge) {
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        badge.innerHTML = `⏳ ${days} Hari Menuju UTBK`;
      } else {
        badge.innerHTML = '🚀 Waktunya Perang!';
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

  // Event wiring
  document.addEventListener('DOMContentLoaded', function () {
    try {
      // version check/migration
      ensureVersion();

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

      // search
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        let timer = null;
        searchInput.addEventListener('input', (e) => {
          clearTimeout(timer);
          timer = setTimeout(() => renderMateri(e.target.value), 150);
        });
      }

      // footer actions
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

      // modal
      const modalConfirm = modalConfirmBtn();
      if (modalConfirm) modalConfirm.addEventListener('click', confirmResetProgress);
      const modalCancel = modalCancelBtn();
      if (modalCancel) modalCancel.addEventListener('click', closeResetModal);

      // initial UI
      initHeader();
      renderMateri();

      // update countdown periodically
      setInterval(initHeader, 30_000);
    } catch (e) {
      console.error('Initialization failed', e);
      const badge = document.getElementById('countdownText');
      if (badge) badge.textContent = 'Init Error: ' + (e && e.message ? e.message : String(e));
    }
  });

})();
