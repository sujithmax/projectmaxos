const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
// Gallery category filtering, scroll reveals and image lightbox.
const galleryFilters=[...document.querySelectorAll('.gallery-filter')];
const gallerySections=[...document.querySelectorAll('.gallery-category')];
galleryFilters.forEach(btn=>btn.addEventListener('click',()=>{
  galleryFilters.forEach(b=>b.classList.toggle('active',b===btn));
  const filter=btn.dataset.filter;
  gallerySections.forEach(section=>{section.hidden=filter!=='all'&&section.dataset.category!==filter;});
  observeReveals();
}));
let revealObserver;
function observeReveals(){
  if(revealObserver) revealObserver.disconnect();
  const items=[...document.querySelectorAll('.gallery-category:not([hidden]) .reveal')];
  if(!('IntersectionObserver' in window)){items.forEach(el=>el.classList.add('visible'));return;}
  revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target);}
  }),{threshold:.08});
  items.forEach(el=>{el.classList.remove('visible');revealObserver.observe(el);});
}
if(document.querySelector('.gallery-category')) observeReveals();
const lightbox=document.querySelector('.lightbox');
if(lightbox){
 const lightboxImg=lightbox.querySelector('img'), caption=lightbox.querySelector('.lightbox-caption');
 let currentImages=[],currentIndex=0,lastFocus=null;
 // Zoom: wheel / pinch / double-click / +,- buttons; drag to pan when zoomed
 const zoomReset=lightbox.querySelector('.zoom-reset');
 let z={s:1,x:0,y:0},dragMoved=false,suppressClick=false;
 const MAXZ=6;
 function applyZoom(){lightboxImg.style.transform=`translate(${z.x}px,${z.y}px) scale(${z.s})`;lightboxImg.classList.toggle('zoomed',z.s>1.001);zoomReset.textContent=Math.round(z.s*100)+'%';}
 function clampPan(){
   if(z.s<=1){z.x=0;z.y=0;return;}
   const mx=(lightboxImg.offsetWidth*z.s-lightboxImg.offsetWidth)/2,my=(lightboxImg.offsetHeight*z.s-lightboxImg.offsetHeight)/2;
   z.x=Math.max(-mx,Math.min(mx,z.x));z.y=Math.max(-my,Math.min(my,z.y));
 }
 function resetZoom(){z={s:1,x:0,y:0};applyZoom();}
 function zoomAt(cx,cy,k){
   const px=cx-window.innerWidth/2,py=cy-window.innerHeight/2;
   const ns=Math.min(MAXZ,Math.max(1,z.s*k)),kk=ns/z.s;
   z.x=px-kk*(px-z.x);z.y=py-kk*(py-z.y);z.s=ns;clampPan();applyZoom();
 }
 lightbox.addEventListener('wheel',e=>{e.preventDefault();zoomAt(e.clientX,e.clientY,Math.exp(-e.deltaY*(e.ctrlKey?0.01:0.0018)));},{passive:false});
 lightboxImg.addEventListener('dblclick',e=>{if(z.s>1.001)resetZoom();else zoomAt(e.clientX,e.clientY,2.5);});
 lightbox.querySelector('.zoom-in').addEventListener('click',()=>zoomAt(window.innerWidth/2,window.innerHeight/2,1.4));
 lightbox.querySelector('.zoom-out').addEventListener('click',()=>zoomAt(window.innerWidth/2,window.innerHeight/2,1/1.4));
 zoomReset.addEventListener('click',resetZoom);
 const pts=new Map();let startDist=0,startScale=1;
 lightboxImg.addEventListener('pointerdown',e=>{
   lightboxImg.setPointerCapture(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});lightboxImg.classList.add('dragging');dragMoved=false;
   if(pts.size===2){const [a,b]=[...pts.values()];startDist=Math.hypot(a.x-b.x,a.y-b.y);startScale=z.s;}
 });
 lightboxImg.addEventListener('pointermove',e=>{
   if(!pts.has(e.pointerId))return;
   const prev=pts.get(e.pointerId);pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
   if(pts.size===2){const [a,b]=[...pts.values()],d=Math.hypot(a.x-b.x,a.y-b.y);if(startDist)zoomAt((a.x+b.x)/2,(a.y+b.y)/2,(startScale*d/startDist)/z.s);dragMoved=true;}
   else if(z.s>1.001){z.x+=e.clientX-prev.x;z.y+=e.clientY-prev.y;clampPan();applyZoom();dragMoved=true;}
 });
 const endPtr=e=>{pts.delete(e.pointerId);if(pts.size<2)startDist=0;if(!pts.size){lightboxImg.classList.remove('dragging');if(dragMoved){suppressClick=true;setTimeout(()=>{suppressClick=false;},60);}}};
 lightboxImg.addEventListener('pointerup',endPtr);lightboxImg.addEventListener('pointercancel',endPtr);
 document.addEventListener('keydown',e=>{
   if(!lightbox.classList.contains('open'))return;
   if(e.key==='+'||e.key==='=')zoomAt(window.innerWidth/2,window.innerHeight/2,1.4);
   if(e.key==='-'||e.key==='_')zoomAt(window.innerWidth/2,window.innerHeight/2,1/1.4);
   if(e.key==='0')resetZoom();
 });

 function openLightbox(button){
   currentImages=[...document.querySelectorAll('.gallery-category:not([hidden]) .gallery-image:not([hidden])')];
   currentIndex=currentImages.indexOf(button);
   lastFocus=button;showLightboxImage();lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';lightbox.querySelector('.lightbox-close').focus();
 }
 function showLightboxImage(){
   resetZoom();const btn=currentImages[currentIndex];if(!btn)return;
   lightboxImg.src=btn.dataset.full;lightboxImg.alt=btn.getAttribute('aria-label')||'Project MaxOS screenshot';
   caption.textContent=`${currentIndex+1} / ${currentImages.length}`;
 }
 function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow='';if(lastFocus)lastFocus.focus();}
 document.querySelectorAll('.gallery-image').forEach(btn=>btn.addEventListener('click',()=>openLightbox(btn)));
 lightbox.querySelector('.lightbox-close').addEventListener('click',closeLightbox);
 lightbox.querySelector('.lightbox-prev').addEventListener('click',()=>{currentIndex=(currentIndex-1+currentImages.length)%currentImages.length;showLightboxImage();});
 lightbox.querySelector('.lightbox-next').addEventListener('click',()=>{currentIndex=(currentIndex+1)%currentImages.length;showLightboxImage();});
 lightbox.addEventListener('click',e=>{if(e.target===lightbox&&!suppressClick)closeLightbox();});
 document.addEventListener('keydown',e=>{if(!lightbox.classList.contains('open'))return;if(e.key==='Escape')closeLightbox();if(e.key==='ArrowRight')lightbox.querySelector('.lightbox-next').click();if(e.key==='ArrowLeft')lightbox.querySelector('.lightbox-prev').click();});
}

// Gallery editions (Void, Kyuka Sugetsu, ...)
const editionTabs=[...document.querySelectorAll('.edition')];
const editionPanels=[...document.querySelectorAll('.edition-panel')];
editionTabs.forEach(tab=>tab.addEventListener('click',()=>{
  editionTabs.forEach(t=>{const on=t===tab;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));});
  editionPanels.forEach(p=>{p.hidden=p.dataset.edition!==tab.dataset.edition;});
  if(typeof observeReveals==='function'&&document.querySelector('.gallery-category'))observeReveals();
}));

// Team: tap a profile to open a small glass popup above it
const people=[...document.querySelectorAll('.person')];
function closePeople(except){people.forEach(p=>{if(p!==except){p.classList.remove('open');p.firstElementChild.setAttribute('aria-expanded','false');}});}
people.forEach(person=>{
  const btn=person.querySelector('button'),pop=person.querySelector('.pop');
  btn.addEventListener('click',e=>{
    e.stopPropagation();
    const wasOpen=person.classList.contains('open');
    // second tap on an open profile opens that member's Telegram (when one is set)
    if(wasOpen&&btn.dataset.tg){window.open(btn.dataset.tg,'_blank','noopener');return;}
    closePeople(person);
    const open=!wasOpen;
    person.classList.toggle('open',open);btn.setAttribute('aria-expanded',String(open));
    if(open){
      pop.style.setProperty('--shift','0px');
      const r=pop.getBoundingClientRect(),m=10;let shift=0;
      if(r.left<m)shift=m-r.left;else if(r.right>window.innerWidth-m)shift=window.innerWidth-m-r.right;
      pop.style.setProperty('--shift',shift+'px');
    }
  });
});
document.addEventListener('click',e=>{if(!e.target.closest('.pop'))closePeople();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closePeople();});

// Home: the dragon background drifts, turns and softens as you scroll
const logoBg=document.querySelector('.logo-bg');
if(logoBg&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  let ticking=false;
  const update=()=>{const s=window.scrollY;
    logoBg.style.setProperty('--y',(-s*.32).toFixed(1)+'px');
    logoBg.style.setProperty('--r',(s*.012).toFixed(2)+'deg');
    logoBg.style.setProperty('--o',Math.max(.28,1-s/1300).toFixed(2));
    ticking=false;};
  window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});
  update();
}

// Every page: blocks come in one by one as you scroll
(function(){
  if(window.matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window))return;
  const sel='.page-hero>*,.hero-copy>*,.facts span,.section-heading,.row,.rom,.request,.pill-links,.maintain,.community,.subhead,.founder>*,.team-head,.person,.sheet,.contribute>*,.editions,.edition-note,.gallery-toolbar';
  const els=[...document.querySelectorAll(sel)];
  els.forEach(el=>el.classList.add('reveal'));
  const io=new IntersectionObserver(entries=>{
    const shown=entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top||a.boundingClientRect.left-b.boundingClientRect.left);
    shown.forEach((e,i)=>{e.target.style.transitionDelay=Math.min(i,9)*80+'ms';e.target.classList.add('visible');io.unobserve(e.target);
      setTimeout(()=>{e.target.style.transitionDelay='';},900);});
  },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(el=>io.observe(el));
})();
