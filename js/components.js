
async function loadSiteHeader() {
  const mount = document.getElementById('site-header');

  if (!mount) return;

  try {
    const response = await fetch('/components/header.html');

    if (!response.ok) {
      throw new Error(`Header HTTP ${response.status}`);
    }

    mount.innerHTML = await response.text();

    const current = window.location.pathname.replace(
      /\/$/,
      '/index.html'
    );

    mount.querySelectorAll('nav a').forEach(a => {
      if (new URL(a.href).pathname === current) {
        a.setAttribute('aria-current', 'page');
      }
    });

  } catch (error) {
    console.error('Unable to load shared header:', error);
  }
}

async function loadSiteFooter() {
  const mount = document.getElementById('site-footer');

  if (!mount) return;

  try {
    const response = await fetch('/components/footer.html');

    if (!response.ok) {
      throw new Error(`Footer HTTP ${response.status}`);
    }

    mount.innerHTML = await response.text();

  } catch (error) {
    console.error('Unable to load shared footer:', error);
  }
}

loadSiteHeader();
loadSiteFooter();
