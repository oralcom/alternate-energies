const menuButton = document.querySelector('.menu-toggle');
// Animate visible sections once; content stays visible without JavaScript.
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
if (!motionPreference.matches && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.section-heading, .service-card, .about-photo, .about-copy, .locations > div, .steps article, .contact-copy, #enquiry-form').forEach(element => {
    element.classList.add('motion-reveal');
    observer.observe(element);
  });
  motionPreference.addEventListener('change', event => {
    if (event.matches) {
      observer.disconnect();
      document.querySelectorAll('.motion-reveal').forEach(element => element.classList.add('is-visible'));
    }
  });
}
const navigation = document.querySelector('#navigation');
const sidebar = document.querySelector('#site-sidebar');
const backdrop = document.querySelector('.sidebar-backdrop');
const closeButton = document.querySelector('.sidebar-close');
const pageRegions = [...document.querySelectorAll('header, main, footer, .skip')];
function closeMenu() {
  sidebar.hidden = true;
  backdrop.hidden = true;
  document.body.classList.remove('sidebar-open');
  pageRegions.forEach(region => { region.inert = false; });
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  menuButton.focus();
}
menuButton.addEventListener('click', () => {
  sidebar.hidden = false;
  backdrop.hidden = false;
  document.body.classList.add('sidebar-open');
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Close navigation');
  pageRegions.forEach(region => { region.inert = true; });
  closeButton.focus();
});
closeButton.addEventListener('click', closeMenu);
backdrop.addEventListener('click', closeMenu);
sidebar.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (sidebar.hidden) return;
  if (event.key === 'Escape') {
    closeMenu();
  }
  if (event.key === 'Tab') {
    const focusable = [...sidebar.querySelectorAll('button, a[href], summary')].filter(element => element.getClientRects().length);
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }
});
document.querySelectorAll('.nav-dropdown').forEach(dropdown => {
  dropdown.addEventListener('toggle', () => {
    if (dropdown.open) document.querySelectorAll('.nav-dropdown').forEach(other => { if (other !== dropdown) other.open = false; });
  });
});
document.addEventListener('click', event => {
  document.querySelectorAll('.nav-dropdown').forEach(dropdown => { if (!dropdown.contains(event.target)) dropdown.open = false; });
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') document.querySelectorAll('.nav-dropdown[open]').forEach(dropdown => { dropdown.open = false; dropdown.querySelector('summary').focus(); });
});
document.querySelectorAll('[data-social]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelector('.social-status').textContent = `${button.dataset.social} profile is not linked yet. Please use our email contacts below.`;
  });
});
const searchInput = document.querySelector('#search-query');
if (searchInput) {
  const results = document.querySelector('#search-results');
  const status = document.querySelector('#search-status');
  searchInput.value = new URLSearchParams(location.search).get('q') || '';
  function searchPages() {
    const query = searchInput.value.trim().toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    const index = window.siteSearchIndex || [];
    const matches = terms.length ? index.filter(page => terms.every(term => `${page.title} ${page.description} ${page.text}`.toLowerCase().includes(term))) : [];
    matches.sort((a,b) => Number(b.title.toLowerCase().includes(query)) - Number(a.title.toLowerCase().includes(query)));
    results.replaceChildren();
    status.textContent = !terms.length ? 'Enter a topic, location or service to search.' : matches.length ? `${matches.length} result${matches.length === 1 ? '' : 's'} found.` : 'No matching pages. Try a broader term such as solar, Africa or planning.';
    matches.forEach(page => {
      const link = document.createElement('a'); link.href = page.url;
      const title = document.createElement('h2'); title.textContent = page.title;
      const description = document.createElement('p'); description.textContent = page.description;
      link.append(title,description); results.append(link);
    });
  }
  searchInput.form.addEventListener('submit', event => { event.preventDefault(); searchPages(); });
  searchInput.addEventListener('input', searchPages);
  searchPages();
}
document.querySelectorAll('[data-service]').forEach(card => {
  card.addEventListener('click', () => {
    const select = document.querySelector('#service');
    if (select) select.value = card.dataset.service;
  });
});
document.querySelector('#year').textContent = new Date().getFullYear();
let downloadUrl;
const serviceSelect = document.querySelector('#service');
const requestedService = new URLSearchParams(window.location.search).get('service');
if (serviceSelect && [...serviceSelect.options].some(option => option.value === requestedService)) {
  serviceSelect.value = requestedService;
}
document.querySelector('#enquiry-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const enquiry = ['ALTERNATE ENERGIES — ENQUIRY DRAFT', '', 'This draft has not been sent.', '',
    `Name: ${data.get('name')}`, `Email: ${data.get('email')}`, `Phone: ${data.get('phone') || 'Not provided'}`,
    `Location: ${data.get('location')}`, `Service: ${data.get('service')}`, '', 'Project details:', data.get('message')].join('\n');
  if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  downloadUrl = URL.createObjectURL(new Blob([enquiry], { type: 'text/plain;charset=utf-8' }));
  const status = document.querySelector('#form-status');
  status.replaceChildren(document.createTextNode('Your enquiry draft is ready. Nothing has been sent. '));
  const emailLink = document.createElement('a');
  emailLink.href = `mailto:sales@alternateenergieslimited.com?subject=${encodeURIComponent(`Solar enquiry — ${data.get('service')}`)}&body=${encodeURIComponent(enquiry)}`;
  emailLink.textContent = 'Open in your email app';
  status.append(emailLink);
  status.append(document.createTextNode(' to review and send, or '));
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = 'alternate-energies-enquiry.txt';
  link.textContent = 'Download your enquiry';
  status.append(link);
});
