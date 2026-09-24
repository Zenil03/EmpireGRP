gsap.registerPlugin(ScrollTrigger);

/* ---------- Respect reduced-motion preference ---------- */
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (prefersReducedMotion) {
  gsap.globalTimeline.timeScale(20); // fast-forward all animations instead of fighting every tween
}

/* ---------- Lenis smooth (inertia) scrolling, synced to ScrollTrigger ---------- */
(function(){
  if (prefersReducedMotion || typeof Lenis === 'undefined') return;
  var lenis = new Lenis({
    duration: 1.15,
    easing: function(t){ return 1 - Math.pow(1 - t, 4); },
    smoothWheel: true,
    wheelMultiplier: 1
  });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(function(time){ lenis.raf(time * 1000); });
  gsap.ticker.lagSmoothing(0);
  window._empireLenis = lenis;
})();

/* ---------- Ambient cursor glow (desktop, motion allowed) ---------- */
(function(){
  if (prefersReducedMotion || ('ontouchstart' in window)) return;
  var glow = document.createElement('div');
  glow.className = 'cursor-glow';
  document.body.appendChild(glow);
  gsap.set(glow, {xPercent:-50, yPercent:-50, x:window.innerWidth/2, y:window.innerHeight/2});
  window.addEventListener('mousemove', function(e){
    gsap.to(glow, {x:e.clientX, y:e.clientY, duration:.7, ease:'power3.out'});
  });
})();

/* ---------- Preloader grid ---------- */
(function(){
  var grid=document.getElementById('pre-grid');
  for(var i=0;i<25;i++){var s=document.createElement('span');grid.appendChild(s);}
  var spans=grid.querySelectorAll('span');
  gsap.timeline({repeat:2})
    .to(spans,{opacity:1,backgroundColor:'#C9A96E',duration:.35,stagger:{each:.03,from:'center'}})
    .to(spans,{opacity:.25,backgroundColor:'rgba(201,169,110,0.35)',duration:.3,stagger:{each:.02,from:'edges'}});

  window.addEventListener('load', function(){
    gsap.to('#preloader',{
      opacity:0, duration:.8, delay:.4, ease:'power2.inOut',
      onComplete:function(){
        document.getElementById('preloader').style.display='none';
        runHeroIntro();
        ScrollTrigger.refresh();
      }
    });
  });
  // fallback in case load event already fired
  setTimeout(function(){
    if(document.getElementById('preloader').style.display!=='none'){
      gsap.to('#preloader',{opacity:0,duration:.8,onComplete:function(){document.getElementById('preloader').style.display='none';runHeroIntro();ScrollTrigger.refresh();}});
    }
  }, 2600);
})();

/* ---------- Keep ScrollTrigger positions accurate as layout settles ----------
   Web fonts swapping in, images loading without reserved dimensions, and the
   split-heading rewrite below all change page height AFTER triggers are first
   calculated. Left uncorrected, elements further down the page (like the 3rd
   card in a row) can end up with a stale trigger window and never animate in. */
if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(function(){ ScrollTrigger.refresh(); });
}
window.addEventListener('load', function(){ ScrollTrigger.refresh(); });

/* ---------- Scroll-spy: highlight current section's nav link ---------- */
(function(){
  var links = Array.prototype.slice.call(document.querySelectorAll('#navLinks a[href^="#"]'));
  if(!links.length) return;

  var map = links.map(function(link){
    var id = link.getAttribute('href').slice(1);
    var section = document.getElementById(id);
    return section ? {link:link, section:section} : null;
  }).filter(Boolean);

  function setActive(link){
    links.forEach(function(l){ l.classList.remove('active'); });
    if(link) link.classList.add('active');
  }

  map.forEach(function(entry){
    ScrollTrigger.create({
      trigger: entry.section,
      start: 'top 45%',
      end: 'bottom 45%',
      onEnter: function(){ setActive(entry.link); },
      onEnterBack: function(){ setActive(entry.link); }
    });
  });
})();

/* ---------- Header scroll state ---------- */
var header=document.getElementById('siteHeader');
ScrollTrigger.create({
  start:'top -60',
  onUpdate:function(self){ header.classList.toggle('scrolled', self.scroll()>60); }
});

/* ---------- Mobile menu ---------- */
var burgerBtn = document.getElementById('burger');
var navLinksEl = document.getElementById('navLinks');
var mobileMenuQuery = window.matchMedia('(max-width:900px)');

// Toggle a class instead of writing inline styles -- inline styles beat the
// CSS breakpoint rules and were permanently hiding the desktop nav after any
// link click. The class only ever does anything below the 900px breakpoint
// (see .nav-links.open in styles.css), so desktop is never affected.
function setMenuOpen(open){
  navLinksEl.classList.toggle('open', open);
  burgerBtn.classList.toggle('active', open);
  burgerBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
burgerBtn.addEventListener('click', function(){
  setMenuOpen(!navLinksEl.classList.contains('open'));
});
navLinksEl.addEventListener('click', function(e){
  // Only auto-close the drawer on mobile; on desktop this must be a no-op
  // or it wipes out the always-visible nav.
  if(e.target.tagName === 'A' && mobileMenuQuery.matches) setMenuOpen(false);
});
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape') setMenuOpen(false);
});
// If the viewport crosses the breakpoint while the drawer is open, reset it
// so the class doesn't linger and fight the desktop layout.
mobileMenuQuery.addEventListener('change', function(){ setMenuOpen(false); });

