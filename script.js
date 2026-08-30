/* =========================================================
   WHIMSY AFTER DARK — script.js
   Vanilla JS. No frameworks, no backend.
   ========================================================= */

(function () {
  'use strict';

  /* ---------------------------------------------------------
     State
     --------------------------------------------------------- */
  let allProducts = [];
  let state = {
    category: 'all',
    marketplace: 'all',
    featured: 'all',
    sort: 'featured',
    search: '',
    moodTag: '',
    moodCat: ''
  };

  /* ---------------------------------------------------------
     DOM references
     --------------------------------------------------------- */
  const trendingGrid = document.getElementById('trendingGrid');
  const allFindsGrid = document.getElementById('allFindsGrid');
  const under299Grid = document.getElementById('under299Grid');
  const recentGrid = document.getElementById('recentGrid');
  const emptyState = document.getElementById('emptyState');
  const resultsCount = document.getElementById('resultsCount');

  const categoryChips = document.getElementById('categoryChips');
  const marketplaceFilter = document.getElementById('marketplaceFilter');
  const featuredFilter = document.getElementById('featuredFilter');
  const sortSelect = document.getElementById('sortSelect');
  const clearFiltersBtn = document.getElementById('clearFilters');
  const moodGrid = document.getElementById('moodGrid');

  const searchToggle = document.getElementById('searchToggle');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');

  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileNav = document.getElementById('mobileNav');

  const modalOverlay = document.getElementById('modalOverlay');
  const modalImage = document.getElementById('modalImage');
  const modalTitle = document.getElementById('modalTitle');
  const modalDescription = document.getElementById('modalDescription');
  const modalPrice = document.getElementById('modalPrice');
  const modalMarketplace = document.getElementById('modalMarketplace');
  const modalBadge = document.getElementById('modalBadge');
  const modalTags = document.getElementById('modalTags');
  const modalCta = document.getElementById('modalCta');
  const modalClose = document.getElementById('modalClose');

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Utilities
     --------------------------------------------------------- */

  // Basic HTML-escaping so product data can never inject markup.
  function escapeHTML(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Parses "₹1,299" -> 1299 for sorting. Falls back to 0.
  function parsePrice(priceStr) {
    if (!priceStr) return 0;
    const digits = String(priceStr).replace(/[^0-9.]/g, '');
    const n = parseFloat(digits);
    return isNaN(n) ? 0 : n;
  }

  // Only allow http(s) URLs to be used as href targets.
  function safeUrl(url) {
    try {
      const u = new URL(url, window.location.href);
      if (u.protocol === 'http:' || u.protocol === 'https:') return u.href;
    } catch (e) { /* fall through */ }
    return '#';
  }

  /* ---------------------------------------------------------
     Load products.json
     --------------------------------------------------------- */
  function loadProducts() {
    fetch('products.json')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok: ' + res.status);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error('products.json did not return an array');
        allProducts = data;
        initAfterLoad();
      })
      .catch((err) => {
        console.error('Whimsy After Dark: failed to load products.json', err);
        showLoadError();
      });
  }

  function showLoadError() {
    const msg = '<p class="empty-state">Oops. The magic cupboard is temporarily empty. ✦</p>';
    [trendingGrid, allFindsGrid, under299Grid, recentGrid].forEach((grid) => {
      if (grid) grid.innerHTML = msg;
    });
  }

  function initAfterLoad() {
    renderTrending();
    renderUnder299();
    renderRecent();
    applyFiltersAndRender();
    handleSharedProductLink();
  }

  /* ---------------------------------------------------------
     Card rendering
     --------------------------------------------------------- */
  function createCard(product) {
    const url = safeUrl(product.affiliateUrl || '#');
    const name = escapeHTML(product.name);
    const desc = escapeHTML(product.description);
    const price = escapeHTML(product.price);
    const market = escapeHTML(product.marketplace);
    const badge = escapeHTML(product.badge || '');
    const img = escapeHTML(product.image || '');

    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.id = product.id;

    card.innerHTML = `
      <a class="card-media" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="View ${name} on ${market}">
        ${badge ? `<span class="card-badge">${badge}</span>` : ''}
        <img src="${img}" alt="${name}" loading="lazy"
             onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23130D20%22/></svg>';">
        <span class="card-market">${market}</span>
      </a>
      <div class="card-body">
        <a class="card-title" href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>
        <p class="card-desc">${desc}</p>
        <div class="card-footer">
          <span class="card-price">${price}</span>
          <button class="card-cta" type="button" data-preview="${product.id}">Reveal the find</button>
        </div>
      </div>
    `;
    return card;
  }

  function renderGrid(grid, products) {
    if (!grid) return;
    grid.innerHTML = '';
    products.forEach((p) => grid.appendChild(createCard(p)));
  }

  function renderTrending() {
    const trending = allProducts.filter((p) => p.badge === 'Trending' || p.featured);
    renderGrid(trendingGrid, trending.slice(0, 8));
  }

  function renderUnder299() {
    const cheap = allProducts.filter((p) => parsePrice(p.price) <= 299);
    renderGrid(under299Grid, cheap);
  }

  function renderRecent() {
    const recent = [...allProducts].sort((a, b) => b.id - a.id).slice(0, 8);
    renderGrid(recentGrid, recent);
  }

  /* ---------------------------------------------------------
     Filtering / search / sort for "All Finds"
     --------------------------------------------------------- */
  function applyFiltersAndRender() {
    let results = [...allProducts];

    if (state.category !== 'all') {
      results = results.filter((p) => p.category === state.category);
    }
    if (state.marketplace !== 'all') {
      results = results.filter((p) => p.marketplace === state.marketplace);
    }
    if (state.featured === 'featured') {
      results = results.filter((p) => p.featured);
    }
    if (state.moodCat) {
      results = results.filter((p) => p.category === state.moodCat);
    }
    if (state.moodTag) {
      results = results.filter((p) =>
        (p.tags || []).some((t) => t.toLowerCase().includes(state.moodTag.toLowerCase())) ||
        (p.name || '').toLowerCase().includes(state.moodTag.toLowerCase())
      );
    }
    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      results = results.filter((p) => {
        const haystack = [
          p.name, p.description, p.category, p.marketplace,
          ...(p.tags || [])
        ].join(' ').toLowerCase();
        return haystack.includes(q);
      });
    }

    switch (state.sort) {
      case 'newest':
        results.sort((a, b) => b.id - a.id);
        break;
      case 'price-asc':
        results.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        break;
      case 'price-desc':
        results.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        break;
      case 'az':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'featured':
      default:
        results.sort((a, b) => (b.featured === true) - (a.featured === true));
        break;
    }

    renderGrid(allFindsGrid, results);

    if (emptyState) emptyState.hidden = results.length !== 0;
    if (resultsCount) {
      resultsCount.textContent = results.length
        ? `${results.length} strange and beautiful thing${results.length === 1 ? '' : 's'} found.`
        : 'No magical finds here yet. ✦';
    }
  }

  /* ---------------------------------------------------------
     Category chips
     --------------------------------------------------------- */
  if (categoryChips) {
    categoryChips.addEventListener('click', (e) => {
      const chip = e.target.closest('.chip');
      if (!chip) return;
      categoryChips.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
      chip.classList.add('active');
      state.category = chip.dataset.category;
      state.moodTag = '';
      state.moodCat = '';
      applyFiltersAndRender();
      document.getElementById('all-finds').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     Mood cards
     --------------------------------------------------------- */
  if (moodGrid) {
    moodGrid.addEventListener('click', (e) => {
      const card = e.target.closest('.mood-card');
      if (!card) return;
      state.moodTag = card.dataset.moodTag || '';
      state.moodCat = card.dataset.moodCat || '';
      state.category = 'all';
      if (categoryChips) {
        categoryChips.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
        const allChip = categoryChips.querySelector('[data-category="all"]');
        if (allChip) allChip.classList.add('active');
      }
      applyFiltersAndRender();
      document.getElementById('all-finds').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------------------
     Filters bar
     --------------------------------------------------------- */
  if (marketplaceFilter) {
    marketplaceFilter.addEventListener('change', () => {
      state.marketplace = marketplaceFilter.value;
      applyFiltersAndRender();
    });
  }
  if (featuredFilter) {
    featuredFilter.addEventListener('change', () => {
      state.featured = featuredFilter.value;
      applyFiltersAndRender();
    });
  }
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      state.sort = sortSelect.value;
      applyFiltersAndRender();
    });
  }
  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener('click', () => {
      state = { category: 'all', marketplace: 'all', featured: 'all', sort: 'featured', search: '', moodTag: '', moodCat: '' };
      if (marketplaceFilter) marketplaceFilter.value = 'all';
      if (featuredFilter) featuredFilter.value = 'all';
      if (sortSelect) sortSelect.value = 'featured';
      if (searchInput) searchInput.value = '';
      if (categoryChips) {
        categoryChips.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
        const allChip = categoryChips.querySelector('[data-category="all"]');
        if (allChip) allChip.classList.add('active');
      }
      applyFiltersAndRender();
    });
  }

  /* ---------------------------------------------------------
     Search
     --------------------------------------------------------- */
  let searchDebounce;
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        state.search = searchInput.value;
        applyFiltersAndRender();
      }, 150);
    });
  }

  if (searchToggle && searchBar) {
    searchToggle.addEventListener('click', () => {
      const isHidden = searchBar.hidden;
      searchBar.hidden = !isHidden;
      searchToggle.setAttribute('aria-expanded', String(isHidden));
      if (isHidden) searchInput.focus();
    });
  }
  if (searchClose && searchBar) {
    searchClose.addEventListener('click', () => {
      searchBar.hidden = true;
      searchToggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* ---------------------------------------------------------
     Mobile nav
     --------------------------------------------------------- */
  if (hamburgerBtn && mobileNav) {
    hamburgerBtn.addEventListener('click', () => {
      const isHidden = mobileNav.hidden;
      mobileNav.hidden = !isHidden;
      hamburgerBtn.classList.toggle('open', isHidden);
      hamburgerBtn.setAttribute('aria-expanded', String(isHidden));
    });
    mobileNav.addEventListener('click', (e) => {
      if (e.target.closest('.nav-link')) {
        mobileNav.hidden = true;
        hamburgerBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------------------------------------------------------
     Product preview modal
     --------------------------------------------------------- */
  function openModal(product) {
    if (!product) return;
    modalImage.src = product.image || '';
    modalImage.alt = product.name || '';
    modalTitle.textContent = product.name || '';
    modalDescription.textContent = product.description || '';
    modalPrice.textContent = product.price || '';
    modalMarketplace.textContent = product.marketplace ? `via ${product.marketplace}` : '';
    modalBadge.textContent = product.badge || '';
    modalBadge.style.display = product.badge ? '' : 'none';
    modalTags.innerHTML = (product.tags || [])
      .map((t) => `<span>${escapeHTML(t)}</span>`)
      .join('');
    modalCta.href = safeUrl(product.affiliateUrl || '#');
    modalCta.textContent = product.marketplace ? `View on ${product.marketplace}` : 'Take me there';

    modalOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
  }

  function closeModal() {
    modalOverlay.hidden = true;
    document.body.style.overflow = '';
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-preview]');
    if (trigger) {
      e.preventDefault();
      const id = Number(trigger.dataset.preview);
      const product = allProducts.find((p) => p.id === id);
      openModal(product);
    }
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modalOverlay.hidden) closeModal();
  });

  /* ---------------------------------------------------------
     Shared product links: ?product=123
     --------------------------------------------------------- */
  function handleSharedProductLink() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('product');
    if (!productId) return;
    const product = allProducts.find((p) => String(p.id) === String(productId));
    if (product) {
      openModal(product);
    }
  }

  /* ---------------------------------------------------------
     Ambient stars background
     --------------------------------------------------------- */
  function buildStars() {
    const container = document.getElementById('bgStars');
    if (!container) return;
    const count = window.innerWidth < 640 ? 18 : 34;
    const glyphs = ['✦', '✧', '·'];
    const frag = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const star = document.createElement('span');
      star.className = 'star';
      star.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.animationDelay = (Math.random() * 5).toFixed(2) + 's';
      star.style.animationDuration = (4 + Math.random() * 4).toFixed(2) + 's';
      frag.appendChild(star);
    }
    container.appendChild(frag);
  }

  /* ---------------------------------------------------------
     Header shadow/blur intensifies slightly on scroll
     --------------------------------------------------------- */
  const header = document.getElementById('siteHeader');
  window.addEventListener('scroll', () => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 20 ? '0 8px 28px rgba(0,0,0,0.35)' : 'none';
  }, { passive: true });

  /* ---------------------------------------------------------
     Init
     --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    buildStars();
    loadProducts();
  });
})();
