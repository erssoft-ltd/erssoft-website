(function () {
  const key = 'erssoft-theme';
  let selected = 'dark';
  try { selected = localStorage.getItem(key) === 'light' ? 'light' : 'dark'; } catch (_) {}
  const apply = (theme) => {
    document.documentElement.dataset.theme = theme;
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.setAttribute('aria-pressed', String(theme === 'light'));
      button.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
    }
  };
  apply(selected);
  const init = () => {
    apply(selected);
    document.querySelector('.theme-toggle')?.addEventListener('click', () => {
      selected = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      apply(selected);
      try { localStorage.setItem(key, selected); } catch (_) {}
    });
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
