/* ---------- Hero canvas: lightweight animated dot lattice (no three.js dependency, pure canvas2d for reliability) ---------- */
(function(){
  var canvas=document.getElementById('hero-canvas');
  var ctx=canvas.getContext('2d');
  var w,h,dots=[];
  function resize(){
    w=canvas.width=canvas.offsetWidth*devicePixelRatio;
    h=canvas.height=canvas.offsetHeight*devicePixelRatio;
  }
  window.addEventListener('resize', resize);
  resize();

  var cols=18, rows=10, spacingX, spacingY;
  function buildDots(){
    dots=[];
    spacingX = w/cols; spacingY = h/rows;
    for(var i=0;i<=cols;i++){
      for(var j=0;j<=rows;j++){
        dots.push({
          x:i*spacingX, y:j*spacingY,
          baseX:i*spacingX, baseY:j*spacingY,
          phase: Math.random()*Math.PI*2
        });
      }
    }
  }
  buildDots();
  window.addEventListener('resize', buildDots);

  var mouse={x:w/2,y:h/2};
  canvas.addEventListener('mousemove', function(e){
    var r=canvas.getBoundingClientRect();
    mouse.x=(e.clientX-r.left)*devicePixelRatio;
    mouse.y=(e.clientY-r.top)*devicePixelRatio;
  });

  var t=0;
  function draw(){
    t+=0.006;
    ctx.clearRect(0,0,w,h);
    for(var i=0;i<dots.length;i++){
      var d=dots[i];
      var dx = d.baseX - mouse.x, dy = d.baseY - mouse.y;
      var dist = Math.sqrt(dx*dx+dy*dy);
      var influence = Math.max(0, 1 - dist/(280*devicePixelRatio));
      var wob = Math.sin(t*2+d.phase)*3*devicePixelRatio;
      var px = d.baseX + dx*influence*0.06;
      var py = d.baseY + dy*influence*0.06 + wob;
      var alpha = 0.12 + influence*0.5;
      var size = (influence>0.05 ? 1.6 : 1.1) * devicePixelRatio;
      ctx.beginPath();
      ctx.arc(px,py,size,0,Math.PI*2);
      ctx.fillStyle = 'rgba(201,169,110,'+alpha.toFixed(2)+')';
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

