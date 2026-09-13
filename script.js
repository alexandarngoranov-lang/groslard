const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

$('#year').textContent = new Date().getFullYear();

const menuBtn = $('.menu-button');
const mobileNav = $('.mobile-nav');
menuBtn?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', String(open));
});
$$('.mobile-nav a').forEach(a => a.addEventListener('click', () => {
  mobileNav.classList.remove('open');
  menuBtn?.setAttribute('aria-expanded', 'false');
}));

function setLang(lang) {
  document.documentElement.lang = lang;
  $$('[data-fr][data-en]').forEach(el => {
    const value = el.dataset[lang];
    if (value !== undefined) el.innerHTML = value;
  });
  $$('.lang').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
  localStorage.setItem('martin-lang', lang);
}
$$('.lang').forEach(btn => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
setLang(localStorage.getItem('martin-lang') || 'fr');

const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.16 });
$$('.reveal').forEach(el => revealObs.observe(el));

const navLinks = $$('.desktop-nav a');
const sections = ['top', 'about', 'journey', 'experience', 'skills', 'contact']
  .map(id => document.getElementById(id))
  .filter(Boolean);
const navObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => navObs.observe(section));

function getMaxScroll(track) {
  return Math.max(0, track.scrollWidth - track.clientWidth);
}
function slideTrack(track, direction) {
  const firstCard = track.firstElementChild;
  const cardWidth = (firstCard?.getBoundingClientRect().width || 280) + 12;
  const max = getMaxScroll(track);
  const current = track.scrollLeft;
  const nearEnd = current >= max - cardWidth * 0.6;
  const nearStart = current <= cardWidth * 0.25;

  if (direction > 0) {
    if (nearEnd) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
  } else {
    if (nearStart) {
      track.scrollTo({ left: max, behavior: 'smooth' });
    } else {
      track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    }
  }
}
$$('.carousel-arrow').forEach(btn => btn.addEventListener('click', () => {
  const track = document.getElementById(btn.dataset.carousel);
  if (!track) return;
  slideTrack(track, btn.classList.contains('next') ? 1 : -1);
}));

const journey = $('#journey');
const panels = $$('.journey-panel');
const years = $$('.journey-nav span');
const current = $('#journey-current');
let activeStep = -1;
function updateJourney() {
  if (!journey) return;
  const rect = journey.getBoundingClientRect();
  const scrollable = Math.max(1, journey.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -rect.top / scrollable));
  const step = Math.min(2, Math.floor(progress * 3));
  if (step === activeStep) return;
  activeStep = step;
  panels.forEach((panel, index) => panel.classList.toggle('active', index === step));
  years.forEach((year, index) => year.classList.toggle('active', index === step));
  if (current) current.textContent = String(step + 1).padStart(2, '0');
}
addEventListener('scroll', updateJourney, { passive: true });
addEventListener('resize', updateJourney);
updateJourney();

const cookieBanner = $('#cookie-banner');
const cookieChoice = localStorage.getItem('martin-cookie-choice');
if (cookieBanner && !cookieChoice) {
  cookieBanner.hidden = false;
}
$$('[data-cookie]').forEach(btn => btn.addEventListener('click', () => {
  localStorage.setItem('martin-cookie-choice', btn.dataset.cookie);
  if (cookieBanner) cookieBanner.hidden = true;
}));
