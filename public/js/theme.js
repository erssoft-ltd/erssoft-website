(function () {
  const key = 'erssoft-theme';
  let selected = 'dark';
  try { selected = localStorage.getItem(key) === 'light' ? 'light' : 'dark'; } catch (_) {}

  function apply(theme) {
    document.documentElement.dataset.theme = theme;
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      button.setAttribute('aria-pressed', String(theme === 'light'));
      button.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    });
  }

  function init() {
    apply(selected);
    document.querySelectorAll('.theme-toggle').forEach((button) => {
      if (button.dataset.themeBound === 'true') return;
      button.dataset.themeBound = 'true';
      button.addEventListener('click', () => {
        selected = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
        apply(selected);
        try { localStorage.setItem(key, selected); } catch (_) {}
      });
    });
  }

  apply(selected);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
  document.addEventListener('astro:page-load', init);
})();
