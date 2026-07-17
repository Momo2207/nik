const menuBtn=document.querySelector('.menu-btn');
const nav=document.querySelector('.nav-links');
if(menuBtn&&nav){menuBtn.addEventListener('click',()=>{const open=nav.classList.toggle('open');document.body.classList.toggle('menu-open',open);menuBtn.setAttribute('aria-expanded',String(open));menuBtn.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');document.body.classList.remove('menu-open');menuBtn.setAttribute('aria-expanded','false');menuBtn.textContent='☰'}));}
const header=document.querySelector('.site-header');
const onScroll=()=>header&&header.classList.toggle('scrolled',window.scrollY>8);onScroll();window.addEventListener('scroll',onScroll,{passive:true});
document.querySelectorAll('[data-filter]').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>b.classList.remove('active'));btn.classList.add('active');const value=btn.dataset.filter;document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=value!=='all'&&card.dataset.category!==value})}));
document.querySelectorAll('.js-demo-form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const msg=form.querySelector('.form-message');if(msg)msg.textContent='Danke. Dies ist noch der Demo-Modus – vor Veröffentlichung bitte Formspree, Netlify Forms oder ein eigenes Backend verbinden.'}));
const io='IntersectionObserver' in window?new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.12}):null;
document.querySelectorAll('.reveal').forEach(el=>io?io.observe(el):el.classList.add('visible'));
