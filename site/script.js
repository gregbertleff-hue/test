async function fetchContent() {
  const response = await fetch('./content/pages.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('Failed to load content');
  return response.json();
}

function setMeta(site) {
  document.title = site.title;
  document.getElementById('site-title').textContent = site.title;
  document.getElementById('site-tagline').textContent = site.tagline;
  document.getElementById('footer-title').textContent = site.footerTitle || site.title;
  document.getElementById('copyright-year').textContent = new Date().getFullYear();
}

function renderNav(nav, currentSlug) {
  const navEl = document.getElementById('site-nav');
  navEl.innerHTML = '';
  nav.forEach(item => {
    const a = document.createElement('a');
    a.href = `#/${item.slug}`;
    a.textContent = item.title;
    if (item.slug === currentSlug) a.setAttribute('aria-current', 'page');
    navEl.appendChild(a);
  });
}

function html(strings, ...values) {
  const string = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ''), '');
  const template = document.createElement('template');
  template.innerHTML = string.trim();
  return template.content;
}

function renderSection(section) {
  switch (section.type) {
    case 'hero':
      return html`
        <section>
          <div class="card">
            <h2>${section.heading}</h2>
            <p class="tagline">${section.subheading ?? ''}</p>
            ${section.cta ? html`<p><a class="button" href="${section.cta.href}">${section.cta.label}</a></p>` : ''}
          </div>
        </section>
      `;
    case 'features':
      return html`
        <section>
          <h2>${section.heading}</h2>
          <div class="grid">
            ${section.items.map(item => `
              <div class="card">
                <h3>${item.title}</h3>
                <p>${item.text}</p>
              </div>
            `).join('')}
          </div>
        </section>
      `;
    case 'text':
      return html`
        <section>
          <div class="card">
            ${section.html}
          </div>
        </section>
      `;
    default:
      return html`<section><div class="card"><p>Unknown section type: ${section.type}</p></div></section>`;
  }
}

function renderPage(page) {
  const main = document.getElementById('content');
  main.innerHTML = '';
  main.appendChild(html`<h2>${page.title}</h2>`);
  page.sections.forEach(section => main.appendChild(renderSection(section)));
}

function getSlugFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return hash || 'home';
}

function startRouter(state) {
  function handleRoute() {
    const slug = getSlugFromHash();
    const page = state.pages[slug] || state.pages['home'];
    renderNav(state.site.nav, slug);
    renderPage(page);
  }
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}

(async function init() {
  try {
    const state = await fetchContent();
    setMeta(state.site);
    startRouter(state);
  } catch (err) {
    const main = document.getElementById('content');
    main.innerHTML = `<div class="card"><p>Failed to load content: ${err?.message || err}</p></div>`;
    console.error(err);
  }
})();