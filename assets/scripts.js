(() => {
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
    window.matchMedia('(min-width: 1001px)').addEventListener('change', closeMenu);
  }

  const search = document.querySelector('[data-search-input]');
  if (search) {
    document.querySelector('[data-search-controls]').hidden = false;
    const items = [...document.querySelectorAll('[data-search-item]')];
    const filters = [...document.querySelectorAll('[data-category-value]')];
    const filterGroup = document.querySelector('[data-category-filters]');
    const empty = document.querySelector('[data-search-empty]');
    const count = document.querySelector('[data-search-count]');
    const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
    let category = '';
    if (filterGroup) filterGroup.hidden = false;
    const applyFilters = () => {
      const query = normalize(search.value.trim());
      let visible = 0;
      items.forEach((item) => {
        const matches = normalize(item.dataset.searchText).includes(query)
          && (!category || item.dataset.postCategories.split('|').includes(category));
        item.hidden = !matches;
        if (matches) visible += 1;
      });
      filters.forEach((filter) => filter.setAttribute('aria-pressed', String(filter.dataset.categoryValue === category)));
      if (empty) empty.hidden = visible > 0;
      if (count) count.textContent = visible + (visible === 1 ? ' publicación' : ' publicaciones');
    };
    const readFilters = () => {
      const params = new URLSearchParams(window.location.search);
      const requested = params.get('categoria') || '';
      category = filters.some((filter) => filter.dataset.categoryValue === requested) ? requested : '';
      search.value = params.get('q') || '';
      applyFilters();
    };
    const updateFilters = () => {
      const url = new URL(window.location.href);
      if (category) url.searchParams.set('categoria', category); else url.searchParams.delete('categoria');
      if (search.value.trim()) url.searchParams.set('q', search.value.trim()); else url.searchParams.delete('q');
      window.history.replaceState(null, '', url);
      applyFilters();
    };
    filters.forEach((filter) => filter.addEventListener('click', () => {
      category = filter.dataset.categoryValue;
      updateFilters();
    }));
    search.addEventListener('input', updateFilters);
    window.addEventListener('popstate', readFilters);
    readFilters();
  }
  document.querySelectorAll('.article-content iframe').forEach((frame) => { frame.loading = 'lazy'; });
})();
