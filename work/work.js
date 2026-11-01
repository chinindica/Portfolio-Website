(function(){
  // Back returns to where the visitor came from on this site, otherwise to the work section
  const back = document.getElementById('back');
  if (back) back.addEventListener('click', e=>{ try { if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1){ e.preventDefault(); history.back(); } } catch(_){} });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // entrances: heading, text, then pictures; content is visible without script
  if (!reduce && 'IntersectionObserver' in window){
    const io = new IntersectionObserver(es=>es.forEach(e=>{ if(!e.isIntersecting) return;
      e.target.animate([{transform:'translateY(20px)',opacity:.001},{transform:'none',opacity:1}],{duration:550,easing:'cubic-bezier(.16,1,.3,1)',delay:+e.target.dataset.d||0,fill:'backwards'}); io.unobserve(e.target); }),{rootMargin:'0px 0px -6% 0px'});
    document.querySelectorAll('.blk h2,.blk p,.figs figure,.stats div,.next').forEach(el=>{
      const sib = el.parentElement ? [...el.parentElement.children].indexOf(el) : 0;
      el.dataset.d = el.matches('.blk p') ? 80 : Math.min(sib,5)*70; io.observe(el); });
  }
  // lightbox: keyboard, arrows, swipe; returns focus to the picture it came from
  const lb = document.getElementById('lb'), li = lb.querySelector('img'), figs = [...document.querySelectorAll('.figs figure')];
  let at = -1, opener = null;
  function show(i){ at = (i + figs.length) % figs.length; const im = figs[at].querySelector('img'); li.src = im.src; li.alt = im.alt; }
  function open(i){ opener = figs[i]; show(i); lb.hidden = false; document.body.style.overflow='hidden'; lb.querySelector('.lbx').focus(); }
  function close(){ lb.hidden = true; li.src=''; document.body.style.overflow=''; if (opener) opener.focus(); }
  figs.forEach((f,i)=>{ f.addEventListener('click',()=>open(i)); f.addEventListener('keydown',e=>{ if (e.key==='Enter'||e.key===' '){ e.preventDefault(); open(i); } }); });
  lb.querySelector('.lbx').addEventListener('click', close);
  lb.querySelector('.lbp').addEventListener('click', e=>{ e.stopPropagation(); show(at-1); });
  lb.querySelector('.lbn').addEventListener('click', e=>{ e.stopPropagation(); show(at+1); });
  lb.addEventListener('click', e=>{ if (e.target===lb) close(); });
  addEventListener('keydown', e=>{ if (lb.hidden) return; if (e.key==='Escape') close(); else if (e.key==='ArrowLeft') show(at-1); else if (e.key==='ArrowRight') show(at+1);
    else if (e.key==='Tab'){ const f=[...lb.querySelectorAll('button')]; const k=f.indexOf(document.activeElement); e.preventDefault(); f[(k+(e.shiftKey?-1:1)+f.length)%f.length].focus(); } });
  let sx = null; lb.addEventListener('pointerdown', e=>{ sx = e.clientX; }); lb.addEventListener('pointerup', e=>{ if (sx===null) return; const d = e.clientX - sx; sx = null; if (Math.abs(d) > 50) show(at + (d<0?1:-1)); });
})();
