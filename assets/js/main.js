(() => {
  'use strict';

  const root = document.documentElement;
  const body = document.body;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;

  // Core navigation
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.querySelector('.nav-links');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      body.classList.toggle('menu-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      body.classList.remove('menu-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.textContent = '☰';
    }));
  }

  // Utility layers
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  body.appendChild(progress);

  const glow = document.createElement('div');
  glow.className = 'ambient-glow';
  glow.setAttribute('aria-hidden', 'true');
  body.appendChild(glow);

  const curtain = document.createElement('div');
  curtain.className = 'page-curtain is-entering';
  curtain.setAttribute('aria-hidden', 'true');
  body.appendChild(curtain);
  setTimeout(() => curtain.classList.remove('is-entering'), 760);

  // Scroll progress + header state + gentle parallax
  const header = document.querySelector('.site-header');
  const depthVisual = document.querySelector('.depth-visual');
  const depthNumber = document.querySelector('[data-depth-number]');
  let ticking = false;
  const updateScroll = () => {
    const y = window.scrollY;
    const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    root.style.setProperty('--scroll-progress', Math.min(1, y / max));
    if (header) header.classList.toggle('scrolled', y > 8);
    if (!reduceMotion && depthVisual) {
      const offset = Math.min(80, y * .085);
      depthVisual.style.setProperty('--depth-scroll', `${offset}px`);
      depthVisual.style.transform = `translate3d(0, ${offset * .12}px, 0)`;
    }
    if (depthNumber) depthNumber.textContent = String(Math.min(40, Math.round((y / Math.max(1, window.innerHeight)) * 22))).padStart(2, '0');
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(updateScroll); ticking = true; }
  }, { passive: true });
  updateScroll();

  // Existing filters and demo forms
  document.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const value = btn.dataset.filter;
    document.querySelectorAll('[data-category]').forEach(card => { card.hidden = value !== 'all' && card.dataset.category !== value; });
  }));
  document.querySelectorAll('.js-demo-form').forEach(form => form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = form.querySelector('.form-message');
    if (msg) msg.textContent = 'Danke. Dies ist noch der Demo-Modus – vor Veröffentlichung bitte Formspree, Netlify Forms oder ein eigenes Backend verbinden.';
  }));

  // Staggered entrance reveals
  const revealEls = [...document.querySelectorAll('.reveal')];
  revealEls.forEach((el, i) => el.style.setProperty('--reveal-delay', `${Math.min((i % 4) * 75, 225)}ms`));
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  }), { threshold: .1, rootMargin: '0px 0px -5% 0px' }) : null;
  revealEls.forEach(el => io ? io.observe(el) : el.classList.add('visible'));

  // Add animated caustics to visual placeholders
  document.querySelectorAll('.portrait-frame,.course-image,.article-image,.offer-visual,.image-stage').forEach(el => {
    if (!el.querySelector('.caustic')) {
      const caustic = document.createElement('span');
      caustic.className = 'caustic';
      caustic.setAttribute('aria-hidden', 'true');
      el.appendChild(caustic);
    }
  });

  // Generate restrained bubble field in the homepage depth visual
  if (depthVisual && !reduceMotion) {
    for (let i = 0; i < 9; i += 1) {
      const bubble = document.createElement('i');
      bubble.className = 'dive-bubble';
      bubble.setAttribute('aria-hidden', 'true');
      bubble.style.setProperty('--bubble-x', `${20 + Math.random() * 58}%`);
      bubble.style.setProperty('--bubble-size', `${5 + Math.random() * 14}px`);
      bubble.style.setProperty('--bubble-time', `${7 + Math.random() * 7}s`);
      bubble.style.setProperty('--bubble-delay', `${-Math.random() * 12}s`);
      bubble.style.setProperty('--bubble-drift', `${-35 + Math.random() * 70}px`);
      depthVisual.appendChild(bubble);
    }
  }

  // Button ripples and magnetic motion
  const interactive = document.querySelectorAll('.btn,.nav-cta,.filterbar button');
  interactive.forEach(el => {
    el.addEventListener('pointerdown', e => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--ripple-x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--ripple-y', `${e.clientY - rect.top}px`);
      el.classList.remove('is-rippling');
      requestAnimationFrame(() => el.classList.add('is-rippling'));
      setTimeout(() => el.classList.remove('is-rippling'), 680);
    });
    if (finePointer && !reduceMotion) {
      el.addEventListener('pointermove', e => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * .12;
        const y = (e.clientY - rect.top - rect.height / 2) * .18;
        el.style.transform = `translate3d(${x}px,${y}px,0)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    }
  });

  // Premium 3D tilt for larger cards
  if (finePointer && !reduceMotion) {
    const cards = document.querySelectorAll('.path-card,.course-card,.article-feature,.article-card,.editorial-card,.card,.offer-highlight,.manifesto,.band,.contact-panel');
    cards.forEach(card => {
      card.classList.add('tilt-card');
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5;
        const py = (e.clientY - r.top) / r.height - .5;
        const rx = py * -4.5;
        const ry = px * 5.5;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    // Cursor-responsive depth visual
    if (depthVisual) {
      const portrait = depthVisual.querySelector('.portrait-frame');
      depthVisual.addEventListener('pointermove', e => {
        const r = depthVisual.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5;
        const y = (e.clientY - r.top) / r.height - .5;
        if (portrait) portrait.style.transform = `rotateX(${y * -5}deg) rotateY(${x * 7}deg) translate3d(${x * 12}px,${y * 10}px,0)`;
      });
      depthVisual.addEventListener('pointerleave', () => { if (portrait) portrait.style.transform = ''; });
    }
  }

  // Contextual custom cursor
  if (finePointer && !reduceMotion) {
    const dot = document.createElement('span');
    const ring = document.createElement('span');
    const label = document.createElement('span');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring'; label.className = 'cursor-label';
    [dot, ring, label].forEach(el => { el.setAttribute('aria-hidden', 'true'); body.appendChild(el); });
    body.classList.add('cursor-ready');

    let mouseX = innerWidth / 2, mouseY = innerHeight / 2, ringX = mouseX, ringY = mouseY;
    const renderCursor = () => {
      ringX += (mouseX - ringX) * .16;
      ringY += (mouseY - ringY) * .16;
      dot.style.transform = `translate3d(${mouseX}px,${mouseY}px,0)`;
      ring.style.transform = `translate3d(${ringX}px,${ringY}px,0)`;
      label.style.transform = `translate3d(${ringX}px,${ringY}px,0) translate(-50%,-50%)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();

    document.addEventListener('pointermove', e => {
      mouseX = e.clientX; mouseY = e.clientY;
      root.style.setProperty('--mx', `${e.clientX}px`);
      root.style.setProperty('--my', `${e.clientY}px`);
      body.classList.add('cursor-visible');
    }, { passive: true });
    document.addEventListener('pointerleave', () => body.classList.remove('cursor-visible'));
    document.addEventListener('pointerdown', () => body.classList.add('cursor-pressed'));
    document.addEventListener('pointerup', () => body.classList.remove('cursor-pressed'));

    const cursorTargets = [
      ['.path-card,.course-card', 'EXPLORE'],
      ['.article-card,.article-feature', 'READ'],
      ['.btn,.nav-cta', 'GO'],
      ['.brand', 'HOME']
    ];
    cursorTargets.forEach(([selector, text]) => document.querySelectorAll(selector).forEach(el => {
      el.addEventListener('pointerenter', () => { label.textContent = text; body.classList.add('cursor-active'); });
      el.addEventListener('pointerleave', () => body.classList.remove('cursor-active'));
    }));
  }

  // Smooth internal page transition. Modified clicks still behave normally.
  if (!reduceMotion) {
    document.querySelectorAll('a[href]').forEach(link => link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = new URL(link.href, location.href);
      if (target.origin !== location.origin || target.pathname === location.pathname && target.hash) return;
      e.preventDefault();
      curtain.classList.remove('is-entering');
      curtain.classList.add('is-leaving');
      setTimeout(() => { location.href = target.href; }, 500);
    }));
  }
})();
