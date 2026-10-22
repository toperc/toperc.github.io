(() => {
  const links = [...document.querySelectorAll('[data-language-link]')];
  if (!links.length) return;
  const storageKey = 'toperc-language';
  links.forEach((link) => {
    // Keep active archive filters and the current section when changing language.
    const updateDestination = () => {
      const target = new URL(link.href);
      target.search = window.location.search;
      target.hash = window.location.hash;
      link.href = target.href;
    };
    updateDestination();
    link.addEventListener('click', () => {
      updateDestination();
      try { localStorage.setItem(storageKey, link.dataset.languageLink); } catch (_) { /* Storage is optional. */ }
    });
  });
  // Apply a saved preference only on a fresh home visit. Deep links keep their
  // explicit language, including links shared by someone else.
  const spanishHome = document.documentElement.dataset.spanishHome;
  if (window.location.pathname === spanishHome) {
    try {
      if (localStorage.getItem(storageKey) === 'en') {
        window.location.replace(links.find((link) => link.dataset.languageLink === 'en').href);
      }
    } catch (_) { /* Both versions still work without storage. */ }
  }
})();
