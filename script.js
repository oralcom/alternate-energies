const menuButton = document.querySelector('.menu-toggle');
document.querySelectorAll('.amount-grid button').forEach(b=>b.addEventListener('click',()=>{const i=document.querySelector('#donation-amount'),d=document.querySelector('#donation-display');if(i)i.value=b.dataset.amount;if(d)d.textContent='£'+Number(b.dataset.amount).toLocaleString()}));
const searchOverlay = document.querySelector('.search-overlay');
const liveSearchInput = document.querySelector('#overlay-search'), liveSearchResults = document.querySelector('.live-search-results');
liveSearchInput?.addEventListener('input', () => { const q=liveSearchInput.value.trim().toLowerCase(); if(!liveSearchResults) return; if(!q){liveSearchResults.innerHTML='';return;} const hits=(window.siteSearchIndex||[]).filter(item=>(item.title+' '+item.description+' '+item.text).toLowerCase().includes(q)).slice(0,5); liveSearchResults.innerHTML=hits.length?hits.map(item=>`<a href="${item.url}"><strong>${item.title}</strong><span>${item.description}</span></a>`).join(''):'<p>No matching pages yet.</p>'; });
document.querySelectorAll('.search-toggle').forEach(button => button.addEventListener('click', () => { if(searchOverlay){ searchOverlay.hidden=false; document.body.classList.add('search-open'); searchOverlay.querySelector('input')?.focus(); }}));
document.querySelectorAll('.search-close').forEach(button => button.addEventListener('click', () => { if(searchOverlay){ searchOverlay.hidden=true; document.body.classList.remove('search-open'); }}));
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
  document.querySelectorAll('.section-heading, .service-card, .about-photo, .about-copy, .locations > div, .steps article, .contact-copy, #enquiry-form, .page-hero, .institution-banner, .mission-banner, .topic-grid > a, .topic-article, .topic-related, .partner-card, .partner-group-title, .data-chart, .dashboard-details, .data-story, .featured-data, .company-profile, .company-values, .company-record, .legal-content, .connect-band, .footer-columns > *').forEach(element => {
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
const trendData = {
  capacity: { years: [2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], values: [1360,1420,1450,1517,1580,1660,1770,1915,2080,2330,2800,3210,4200,5155], unit: 'GW' },
  employment: { years: [2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], values: [6.8,7.1,7.7,8.0,8.1,8.3,8.6,9.0,9.4,9.8,10.3,12.7,16.2,16.6], unit: 'M jobs' },
  cost: { years: [2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023,2024], values: [0.38,0.35,0.31,0.27,0.24,0.22,0.19,0.17,0.15,0.13,0.12,0.11,0.10,0.09], unit: 'USD/kWh' }
};
document.querySelectorAll('.interactive-chart').forEach(card => {
  const type = card.dataset.chartType, data = trendData[type], svg = card.querySelector('svg');
  if (!data || !svg) return;
  const tooltip = document.createElement('div'); tooltip.className = 'chart-tooltip'; tooltip.setAttribute('role','status'); tooltip.hidden = true; card.append(tooltip);
  const total = card.querySelector('.data-total strong'), unit = card.querySelector('.data-total span');
  const points = data.years.map((year,index) => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    const x = 12 + (index * (type === 'cost' ? 585 : 395) / (data.years.length - 1));
    const y = type === 'capacity' ? 135 - index * 8.7 : type === 'employment' ? 145 - index * 7.7 : 45 + index * 8.8;
    circle.setAttribute('cx',x); circle.setAttribute('cy',y); circle.setAttribute('r','5'); circle.setAttribute('tabindex','0'); circle.setAttribute('class','trend-point '+type); circle.dataset.year=year; circle.dataset.value=data.values[index]; svg.append(circle); return circle;
  });
  const show = point => { tooltip.innerHTML='<strong>'+point.dataset.year+'</strong><span>'+point.dataset.value+' '+data.unit+'</span>'; tooltip.hidden=false; if(total) total.textContent=Number(point.dataset.value).toLocaleString(); if(unit && type !== 'cost') unit.textContent=data.unit; };
  const hide = () => { tooltip.hidden=true; };
  points.forEach(point => { point.addEventListener('mouseenter',()=>show(point)); point.addEventListener('focus',()=>show(point)); point.addEventListener('mouseleave',hide); point.addEventListener('blur',hide); });
});
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
const backTop = document.querySelector('[data-back-top]');
document.querySelectorAll('.video-frame video').forEach(video => { const io = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting) video.play().catch(()=>{}); else video.pause(); }), {threshold:.55}); io.observe(video); });
document.querySelectorAll('.video-mute').forEach(button => { const video=button.closest('.video-frame')?.querySelector('video'); if(!video) return; button.addEventListener('click',()=>{video.muted=!video.muted; button.setAttribute('aria-pressed',String(!video.muted)); button.setAttribute('aria-label',video.muted?'Unmute video':'Mute video'); button.classList.toggle('is-unmuted',!video.muted);}); });
if (backTop) {
  const updateBackTop = () => {
    const atTop = window.scrollY < 160;
    backTop.innerHTML = atTop ? '&darr;' : '&uarr;';
    backTop.setAttribute('aria-label', atTop ? 'Scroll to bottom' : 'Back to top');
    backTop.classList.toggle('is-down', atTop);
    if (atTop) backTop.href = '#footer';
    else backTop.href = '#main';
  };
  updateBackTop();
  window.addEventListener('scroll', updateBackTop, { passive: true });
}
document.querySelectorAll('.count-up').forEach(counter => {
  const target = Number(counter.dataset.target || 0), suffix = counter.dataset.suffix || '';
  let started = false;
  const animate = () => {
    if (started) return; started = true;
    const start = performance.now(), duration = 1500;
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && animate()), { threshold: .35 }).observe(counter);
  else animate();
});

const cookieBanner=document.querySelector('#cookie-banner'); if(cookieBanner && !localStorage.getItem('ae-cookie-choice')) cookieBanner.hidden=false; document.querySelectorAll('[data-cookie]').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('ae-cookie-choice',b.dataset.cookie); if(cookieBanner) cookieBanner.hidden=true;}));
\nconst reviewCards=document.querySelectorAll('.reviews-grid .review-card'); if(reviewCards.length){let reviewIndex=0; reviewCards[0].classList.add('is-active'); setInterval(()=>{reviewCards[reviewIndex].classList.remove('is-active'); reviewIndex=(reviewIndex+1)%reviewCards.length; reviewCards[reviewIndex].classList.add('is-active');},5000);}
