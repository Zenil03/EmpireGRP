/* ---------- Hero text intro ---------- */
function runHeroIntro(){
  gsap.set('.hero h1 .line span', {yPercent:110});
  gsap.timeline({defaults:{ease:'power4.out'}})
    .to('.hero h1 .line span', {yPercent:0, duration:1.1, stagger:.12})
    .from('.hero-sub', {opacity:0, y:20, duration:.9}, '-=.5')
    .from('.hero-actions', {opacity:0, y:20, duration:.9}, '-=.6')
    .from('.hero-pillars .pillar-chip', {opacity:0, x:20, duration:.6, stagger:.1}, '-=.7')
    .from('.hero-tag', {opacity:0, y:10, duration:.6}, '-=1.3');
}

/* ---------- Generic reveal on scroll (replays every pass, both directions) ---------- */
gsap.utils.toArray('.reveal').forEach(function(el){
  gsap.to(el, {
    opacity:1, y:0, duration:1, ease:'power3.out',
    scrollTrigger:{ trigger:el, start:'top 85%', toggleActions:'restart reverse restart reverse' }
  });
});

/* ---------- Trusted Brands — scroll-tied reveal, alternating from left/right ---------- */
(function(){
  var cards = document.querySelectorAll('#brandsStage .brand-card');
  if (!cards.length) return;

  cards.forEach(function(card, i){
    var fromSide = (i % 2 === 0) ? -110 : 110; // even index enters from left, odd from right
    gsap.set(card, {opacity:0, x:fromSide, y:16, scale:.94});

    gsap.to(card, {
      opacity:1, x:0, y:0, scale:1, duration:.9, ease:'power3.out',
      scrollTrigger:{
        trigger:card, start:'top 88%',
        toggleActions:'restart reverse restart reverse'
      },
      delay:i*0.08,
      onStart:function(){
        card.classList.remove('floating');
        card.classList.add('is-lit', 'sweeping');
      },
      onComplete:function(){
        card.classList.remove('sweeping');
        card.classList.add('floating');
      },
      onReverseComplete:function(){
        // Reset fully so the sweep/glow feel fresh next time it scrolls in
        card.classList.remove('is-lit', 'sweeping', 'floating');
      }
    });
  });
})();

/* ---------- Verticals card stagger ---------- */
/* Each card now gets its OWN trigger (was one shared trigger for the whole
   grid). Sharing a single trigger meant that if its calculated position drifted
   even slightly -- e.g. after web fonts swap in and reflow the page -- a card
   could miss its animation window entirely and never appear. Per-card triggers
   are self-correcting and also replay on every scroll pass. */
gsap.utils.toArray('.v-card').forEach(function(card){
  gsap.fromTo(card, {opacity:0, y:50}, {
    opacity:1, y:0, duration:.9, ease:'power3.out',
    scrollTrigger:{ trigger:card, start:'top 85%', toggleActions:'restart reverse restart reverse' }
  });
});

/* ---------- Counters (recount every time they scroll into view) ---------- */
gsap.utils.toArray('.stat-num').forEach(function(el){
  var target = +el.getAttribute('data-count');
  ScrollTrigger.create({
    trigger: el, start:'top 88%', end:'bottom top',
    onEnter:function(){ runCount(); },
    onEnterBack:function(){ runCount(); },
    onLeave:function(){ el.textContent = '0'; },
    onLeaveBack:function(){ el.textContent = '0'; }
  });
  function runCount(){
    var obj={val:0};
    gsap.to(obj,{val:target, duration:1.8, ease:'power2.out', onUpdate:function(){ el.textContent = Math.floor(obj.val); }});
  }
});

/* ---------- Mart parallax ---------- */
gsap.to('.mart-media img', {
  yPercent:14, ease:'none',
  scrollTrigger:{ trigger:'.mart', start:'top bottom', end:'bottom top', scrub:true }
});

/* ---------- Duotone tint via canvas-free CSS filter ---------- */
document.querySelectorAll('.duotone').forEach(function(img){
  img.style.filter = 'grayscale(1) sepia(0.25) hue-rotate(185deg) saturate(1.6) brightness(0.55) contrast(1.15)';
});

