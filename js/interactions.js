/* ---------- Split heading words + reveal ---------- */
document.querySelectorAll('.split-heading').forEach(function(h){
  var words = h.textContent.trim().split(/\s+/);
  h.innerHTML = words.map(function(w){
    return '<span class="sh-wrap"><span class="sh-word">'+w+'&nbsp;</span></span>';
  }).join('');
});
gsap.utils.toArray('.split-heading .sh-word').forEach(function(w){ gsap.set(w,{yPercent:110}); });
document.querySelectorAll('.split-heading').forEach(function(h){
  gsap.to(h.querySelectorAll('.sh-word'), {
    yPercent:0, duration:.9, stagger:.045, ease:'power4.out',
    scrollTrigger:{ trigger:h, start:'top 88%', toggleActions:'restart reverse restart reverse' }
  });
});

/* ---------- Magnetic buttons ---------- */
document.querySelectorAll('.btn-primary, .nav-cta').forEach(function(el){
  el.style.display = el.style.display || 'inline-flex';
  el.addEventListener('mousemove', function(e){
    var r=el.getBoundingClientRect();
    var x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
    gsap.to(el,{x:x*0.35,y:y*0.45,duration:.4,ease:'power2.out'});
  });
  el.addEventListener('mouseleave', function(){
    gsap.to(el,{x:0,y:0,duration:.6,ease:'elastic.out(1,0.4)'});
  });
});

/* ---------- 3D tilt on vertical cards ---------- */
document.querySelectorAll('.v-card').forEach(function(card){
  card.addEventListener('mousemove', function(e){
    var r=card.getBoundingClientRect();
    var x=(e.clientX-r.left)/r.width-0.5, y=(e.clientY-r.top)/r.height-0.5;
    gsap.to(card,{rotateY:x*8, rotateX:-y*8, transformPerspective:700, duration:.5, ease:'power2.out'});
  });
  card.addEventListener('mouseleave', function(){
    gsap.to(card,{rotateY:0, rotateX:0, duration:.7, ease:'power3.out'});
  });
});

/* ---------- Icon draw-in (vertical icons) ---------- */
gsap.utils.toArray('.v-card').forEach(function(card){
  var shapes = card.querySelectorAll('.v-icon path, .v-icon rect, .v-icon line');
  gsap.fromTo(shapes, {strokeDashoffset:230}, {
    strokeDashoffset:0, duration:1.1, ease:'power2.out',
    scrollTrigger:{ trigger:card, start:'top 85%', toggleActions:'restart reverse restart reverse' }
  });
});

/* ---------- Mart curtain reveal ---------- */
gsap.fromTo('.mart-media', {clipPath:'inset(0 100% 0 0)'}, {
  clipPath:'inset(0 0% 0 0)', duration:1.5, ease:'power4.inOut',
  scrollTrigger:{ trigger:'.mart', start:'top 75%', toggleActions:'restart reverse restart reverse' }
});

/* mark loaded in case window.load already fired before script executed */
if(document.readyState==='complete'){ window.dispatchEvent(new Event('load')); }