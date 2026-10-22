(() => {
  const english = document.documentElement.lang === 'en';
  const artwork = [...document.querySelectorAll('[data-parallax-art]')];
  const artworkMotion = window.matchMedia('(min-width: 1001px) and (prefers-reduced-motion: no-preference)');
  if (artwork.length) {
    let artworkFrame = 0;
    const updateArtwork = () => {
      artworkFrame = 0;
      artwork.forEach((image) => {
        const bounds = image.parentElement.getBoundingClientRect();
        const offset = artworkMotion.matches ? Math.max(-28, Math.min(28, -bounds.top * .12)) : 0;
        image.style.setProperty('--art-offset', offset + 'px');
      });
    };
    const requestArtwork = () => { if (!artworkFrame) artworkFrame = window.requestAnimationFrame(updateArtwork); };
    window.addEventListener('scroll', requestArtwork, { passive: true });
    window.addEventListener('resize', requestArtwork);
    artworkMotion.addEventListener('change', requestArtwork);
    updateArtwork();
  }
  const button = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#main-menu');
  if (button && menu) {
    button.hidden = false;
    document.documentElement.classList.add('has-menu');
    const closeMenu = () => {
      button.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    };
    button.addEventListener('click', () => {
      const open = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
    });
    menu.addEventListener('click', (event) => { if (event.target.closest('a')) closeMenu(); });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        button.focus();
      }
    });
    document.addEventListener('click', (event) => { if (!event.target.closest('.navigation')) closeMenu(); });
    window.matchMedia('(min-width: 1201px)').addEventListener('change', closeMenu);
  }

  const search = document.querySelector('[data-search-input]');
  if (search) {
    document.querySelectorAll('[data-search-controls]').forEach((control) => { control.hidden = false; });
    const items = [...document.querySelectorAll('[data-search-item]')];
    const typeButtons = [...document.querySelectorAll('[data-type-value]')];
    const brandSelect = document.querySelector('[data-brand-filter]');
    const modelSelect = document.querySelector('[data-model-filter]');
    const reset = document.querySelector('[data-search-reset]');
    const legacyLabel = document.querySelector('[data-legacy-category]');
    const empty = document.querySelector('[data-search-empty]');
    const count = document.querySelector('[data-search-count]');
    const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    const categories = new Set(items.flatMap((item) => (item.dataset.postCategories || '').split('|').filter(Boolean)));
    const types = new Set(typeButtons.map((item) => item.dataset.typeValue));
    const selectValues = (select) => new Set(select ? [...select.options].map((option) => option.value) : []);
    const brands = selectValues(brandSelect);
    const models = selectValues(modelSelect);
    let state = { q: '', category: '', type: '', brand: '', model: '' };

    [brandSelect, modelSelect].filter(Boolean).forEach((select) => {
      if (select.options.length <= 1) select.closest('.filter-field').hidden = true;
    });

    const applyFilters = () => {
      if (modelSelect) {
        [...modelSelect.options].forEach((option) => {
          const unavailable = Boolean(option.value && state.brand && option.dataset.brand !== state.brand);
          option.hidden = unavailable;
          option.disabled = unavailable;
        });
      }
      const query = normalize(state.q.trim());
      let visible = 0;
      items.forEach((item) => {
        const matches = normalize(item.dataset.searchText || '').includes(query)
          && (!state.category || (item.dataset.postCategories || '').split('|').includes(state.category))
          && (!state.type || item.dataset.postType === state.type)
          && (!state.brand || item.dataset.postBrand === state.brand)
          && (!state.model || item.dataset.postModel === state.model || (item.dataset.postRelatedModels || '').split('|').includes(state.model));
        item.hidden = !matches;
        if (matches) visible += 1;
      });
      typeButtons.forEach((item) => item.setAttribute('aria-pressed', String(item.dataset.typeValue === state.type)));
      if (brandSelect) brandSelect.value = state.brand;
      if (modelSelect) modelSelect.value = state.model;
      if (legacyLabel) {
        legacyLabel.hidden = !state.category;
        legacyLabel.textContent = state.category ? (english ? 'Category: ' : 'Categoría: ') + state.category + (english ? '. You can change or clear the filters.' : '. Puedes cambiar o limpiar los filtros.') : '';
      }
      if (empty) empty.hidden = visible > 0;
      if (count) count.textContent = visible + (count.dataset.searchUnit === 'model'
        ? (english ? (visible === 1 ? ' model' : ' models') : (visible === 1 ? ' modelo' : ' modelos'))
        : (english ? (visible === 1 ? ' post' : ' posts') : (visible === 1 ? ' publicación' : ' publicaciones')));
    };

    const readFilters = () => {
      const params = new URLSearchParams(window.location.search);
      const requestedCategory = params.get('categoria') || '';
      const requestedType = params.get('tipo') || '';
      const requestedBrand = params.get('marca') || '';
      const requestedModel = params.get('modelo') || '';
      state = {
        q: params.get('q') || '',
        category: categories.has(requestedCategory) ? requestedCategory : '',
        type: types.has(requestedType) ? requestedType : '',
        brand: brands.has(requestedBrand) ? requestedBrand : '',
        model: models.has(requestedModel) ? requestedModel : ''
      };
      if (state.model) {
        const option = [...modelSelect.options].find((option) => option.value === state.model);
        if (state.brand && option.dataset.brand !== state.brand) state.model = '';
        else if (!state.brand) state.brand = option.dataset.brand || '';
      }
      search.value = state.q;
      applyFilters();
    };

    const updateFilters = () => {
      const url = new URL(window.location.href);
      const values = { categoria: state.category, tipo: state.type, marca: state.brand, modelo: state.model, q: state.q.trim() };
      Object.entries(values).forEach(([key, value]) => {
        if (value) url.searchParams.set(key, value);
        else url.searchParams.delete(key);
      });
      window.history.replaceState(null, '', url);
      applyFilters();
    };

    typeButtons.forEach((item) => item.addEventListener('click', () => {
      state.type = item.dataset.typeValue;
      state.category = '';
      updateFilters();
    }));
    if (brandSelect) brandSelect.addEventListener('change', () => {
      state.brand = brandSelect.value;
      state.category = '';
      if (state.model && modelSelect) {
        const option = [...modelSelect.options].find((option) => option.value === state.model);
        if (state.brand && option.dataset.brand !== state.brand) state.model = '';
      }
      updateFilters();
    });
    if (modelSelect) modelSelect.addEventListener('change', () => {
      state.model = modelSelect.value;
      state.category = '';
      if (state.model) state.brand = [...modelSelect.options].find((option) => option.value === state.model).dataset.brand || '';
      updateFilters();
    });
    if (reset) reset.addEventListener('click', () => {
      state = { q: '', category: '', type: '', brand: '', model: '' };
      search.value = '';
      updateFilters();
    });
    search.addEventListener('input', () => { state.q = search.value; updateFilters(); });
    window.addEventListener('popstate', readFilters);
    readFilters();
  }
  document.querySelectorAll('.article-content iframe').forEach((frame) => { frame.loading = 'lazy'; });
})();
