
const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
$('#year').textContent=new Date().getFullYear();

const menuBtn=$('.menu-button'),mobileNav=$('.mobile-nav');
menuBtn?.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');menuBtn.setAttribute('aria-expanded',String(open));});
$$('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');menuBtn.setAttribute('aria-expanded','false');}));

function setLang(lang){
  document.documentElement.lang=lang;
  $$('[data-fr][data-en]').forEach(el=>{const v=el.dataset[lang];if(v!==undefined)el.innerHTML=v;});
  $$('.lang').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===lang));
  localStorage.setItem('martin-lang',lang);
}
$$('.lang').forEach(btn=>btn.addEventListener('click',()=>setLang(btn.dataset.lang)));
setLang(localStorage.getItem('martin-lang')||'fr');

const revealObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in');}),{threshold:.18});
$$('.reveal').forEach(el=>revealObs.observe(el));

const navLinks=$$('.desktop-nav a');
const sections=['top','about','journey','experience','skills','contact'].map(id=>document.getElementById(id)).filter(Boolean);
const navObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){navLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}}),{rootMargin:'-35% 0px -55% 0px'});
sections.forEach(s=>navObs.observe(s));

$$('.carousel-arrow').forEach(btn=>btn.addEventListener('click',()=>{
  const track=document.getElementById(btn.dataset.carousel); if(!track)return;
  const card=track.firstElementChild; const amount=(card?.getBoundingClientRect().width||280)+12;
  track.scrollBy({left:btn.classList.contains('next')?amount:-amount,behavior:'smooth'});
}));

const journey=$('#journey'),panels=$$('.journey-panel'),years=$$('.journey-nav span'),current=$('#journey-current');
let activeStep=-1;
function updateJourney(){
  if(!journey)return;
  const r=journey.getBoundingClientRect();
  const scrollable=Math.max(1,journey.offsetHeight-window.innerHeight);
  const progress=Math.min(1,Math.max(0,-r.top/scrollable));
  const step=Math.min(2,Math.floor(progress*3));
  if(step!==activeStep){
    activeStep=step;
    panels.forEach((p,i)=>p.classList.toggle('active',i===step));
    years.forEach((y,i)=>y.classList.toggle('active',i===step));
    if(current)current.textContent=String(step+1).padStart(2,'0');
  }
}
addEventListener('scroll',updateJourney,{passive:true});
addEventListener('resize',updateJourney);
updateJourney();
