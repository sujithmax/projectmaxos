const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.nav');if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));}const y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
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
 function openLightbox(button){
   currentImages=[...document.querySelectorAll('.gallery-category:not([hidden]) .gallery-image:not([hidden])')];
   currentIndex=currentImages.indexOf(button);
   lastFocus=button;showLightboxImage();lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';lightbox.querySelector('.lightbox-close').focus();
 }
 function showLightboxImage(){
   const btn=currentImages[currentIndex];if(!btn)return;
   lightboxImg.src=btn.dataset.full;lightboxImg.alt=btn.getAttribute('aria-label')||'Project MaxOS screenshot';
   caption.textContent=`${currentIndex+1} / ${currentImages.length}`;
 }
 function closeLightbox(){lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.style.overflow='';if(lastFocus)lastFocus.focus();}
 document.querySelectorAll('.gallery-image').forEach(btn=>btn.addEventListener('click',()=>openLightbox(btn)));
 lightbox.querySelector('.lightbox-close').addEventListener('click',closeLightbox);
 lightbox.querySelector('.lightbox-prev').addEventListener('click',()=>{currentIndex=(currentIndex-1+currentImages.length)%currentImages.length;showLightboxImage();});
 lightbox.querySelector('.lightbox-next').addEventListener('click',()=>{currentIndex=(currentIndex+1)%currentImages.length;showLightboxImage();});
 lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLightbox();});
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
    const open=!person.classList.contains('open');
    closePeople(person);
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
