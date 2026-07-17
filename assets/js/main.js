(function () {
  'use strict';

  function ready(callback) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback, { once: true });
    } else {
      callback();
    }
  }

  ready(function () {
    var root = document.documentElement;
    var body = document.body;
    if (!body) return;

    root.classList.add('js');
    root.setAttribute('data-js-status', 'running');

    var reducedMotion = false;
    try {
      reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (error) {
      reducedMotion = false;
    }

    function runFeature(name, callback) {
      try {
        callback();
      } catch (error) {
        root.setAttribute('data-js-' + name, 'error');
        if (window.console && console.warn) console.warn('[Nik Linder] ' + name + ' disabled:', error);
      }
    }

    function each(selector, callback, scope) {
      var nodes = (scope || document).querySelectorAll(selector);
      Array.prototype.forEach.call(nodes, callback);
    }

    function createLayer(className) {
      var element = document.createElement('div');
      element.className = className;
      element.setAttribute('aria-hidden', 'true');
      body.appendChild(element);
      return element;
    }

    var curtain = null;

    runFeature('navigation', function () {
      var menuButton = document.querySelector('.menu-btn');
      var navigation = document.querySelector('.nav-links');
      if (!menuButton || !navigation) return;

      function closeMenu() {
        navigation.classList.remove('open');
        body.classList.remove('menu-open');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.textContent = '☰';
      }

      menuButton.addEventListener('click', function () {
        var isOpen = !navigation.classList.contains('open');
        navigation.classList.toggle('open', isOpen);
        body.classList.toggle('menu-open', isOpen);
        menuButton.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        menuButton.textContent = isOpen ? '×' : '☰';
      });

      each('a', function (link) {
        link.addEventListener('click', closeMenu);
      }, navigation);

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape') closeMenu();
      });
    });

    runFeature('layers', function () {
      createLayer('scroll-progress');
      createLayer('ambient-glow');
      curtain = createLayer('page-curtain is-entering');
      window.setTimeout(function () {
        if (curtain) curtain.classList.remove('is-entering');
      }, 760);
    });

    runFeature('scroll', function () {
      var header = document.querySelector('.site-header');
      var depthVisual = document.querySelector('.depth-visual');
      var depthNumber = document.querySelector('[data-depth-number]');
      var ticking = false;

      function updateScroll() {
        var y = window.pageYOffset || root.scrollTop || 0;
        var maximum = Math.max(1, root.scrollHeight - window.innerHeight);
        root.style.setProperty('--scroll-progress', String(Math.min(1, y / maximum)));

        if (header) header.classList.toggle('scrolled', y > 8);

        if (!reducedMotion && depthVisual) {
          var offset = Math.min(80, y * 0.085);
          depthVisual.style.setProperty('--depth-scroll', offset + 'px');
          depthVisual.style.transform = 'translate3d(0,' + (offset * 0.12) + 'px,0)';
        }

        if (depthNumber) {
          var depth = Math.min(40, Math.round((y / Math.max(1, window.innerHeight)) * 22));
          depthNumber.textContent = depth < 10 ? '0' + depth : String(depth);
        }
        ticking = false;
      }

      window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame ? window.requestAnimationFrame(updateScroll) : window.setTimeout(updateScroll, 16);
      }, { passive: true });

      window.addEventListener('resize', updateScroll, { passive: true });
      updateScroll();
    });

    runFeature('filters', function () {
      each('[data-filter]', function (button) {
        button.addEventListener('click', function () {
          each('[data-filter]', function (otherButton) {
            otherButton.classList.remove('active');
            otherButton.setAttribute('aria-pressed', 'false');
          });
          button.classList.add('active');
          button.setAttribute('aria-pressed', 'true');

          var value = button.getAttribute('data-filter');
          each('[data-category]', function (card) {
            var shouldHide = value !== 'all' && card.getAttribute('data-category') !== value;
            card.hidden = shouldHide;
            card.setAttribute('aria-hidden', shouldHide ? 'true' : 'false');
          });
        });
      });
    });

    runFeature('forms', function () {
      each('.js-demo-form', function (form) {
        form.addEventListener('submit', function (event) {
          event.preventDefault();
          var message = form.querySelector('.form-message');
          if (message) {
            message.textContent = 'Danke. Dies ist noch der Demo-Modus – vor Veröffentlichung bitte Formspree, Netlify Forms oder ein eigenes Backend verbinden.';
            message.setAttribute('role', 'status');
          }
        });
      });
    });

    runFeature('reveals', function () {
      var elements = document.querySelectorAll('.reveal');
      Array.prototype.forEach.call(elements, function (element, index) {
        element.style.setProperty('--reveal-delay', Math.min((index % 4) * 75, 225) + 'ms');
      });

      if (reducedMotion || !('IntersectionObserver' in window)) {
        Array.prototype.forEach.call(elements, function (element) {
          element.classList.add('visible');
        });
        return;
      }

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });

      Array.prototype.forEach.call(elements, function (element) {
        observer.observe(element);
      });
    });

    runFeature('caustics', function () {
      each('.portrait-frame,.course-image,.article-image,.offer-visual,.image-stage', function (element) {
        if (element.querySelector('.caustic')) return;
        var caustic = document.createElement('span');
        caustic.className = 'caustic';
        caustic.setAttribute('aria-hidden', 'true');
        element.appendChild(caustic);
      });
    });

    runFeature('bubbles', function () {
      if (reducedMotion) return;
      var depthVisual = document.querySelector('.depth-visual');
      if (!depthVisual || depthVisual.querySelector('.dive-bubble')) return;

      for (var index = 0; index < 9; index += 1) {
        var bubble = document.createElement('i');
        bubble.className = 'dive-bubble';
        bubble.setAttribute('aria-hidden', 'true');
        bubble.style.setProperty('--bubble-x', (20 + Math.random() * 58) + '%');
        bubble.style.setProperty('--bubble-size', (5 + Math.random() * 14) + 'px');
        bubble.style.setProperty('--bubble-time', (7 + Math.random() * 7) + 's');
        bubble.style.setProperty('--bubble-delay', (-Math.random() * 12) + 's');
        bubble.style.setProperty('--bubble-drift', (-35 + Math.random() * 70) + 'px');
        depthVisual.appendChild(bubble);
      }
    });

    runFeature('buttons', function () {
      each('.btn,.nav-cta,.filterbar button', function (element) {
        element.addEventListener('pointerdown', function (event) {
          var rectangle = element.getBoundingClientRect();
          element.style.setProperty('--ripple-x', (event.clientX - rectangle.left) + 'px');
          element.style.setProperty('--ripple-y', (event.clientY - rectangle.top) + 'px');
          element.classList.remove('is-rippling');
          window.setTimeout(function () { element.classList.add('is-rippling'); }, 0);
          window.setTimeout(function () { element.classList.remove('is-rippling'); }, 680);
        });
      });
    });

    runFeature('pointer-effects', function () {
      if (reducedMotion) return;

      var mouseCapable = false;
      try {
        mouseCapable = !!(window.matchMedia && (
          window.matchMedia('(any-pointer: fine)').matches ||
          window.matchMedia('(pointer: fine)').matches ||
          window.matchMedia('(any-hover: hover)').matches
        ));
      } catch (error) {
        mouseCapable = false;
      }
      if (!mouseCapable) return;

      each('.btn,.nav-cta,.filterbar button', function (element) {
        element.addEventListener('mousemove', function (event) {
          var rectangle = element.getBoundingClientRect();
          var x = (event.clientX - rectangle.left - rectangle.width / 2) * 0.12;
          var y = (event.clientY - rectangle.top - rectangle.height / 2) * 0.18;
          element.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
        });
        element.addEventListener('mouseleave', function () {
          element.style.transform = '';
        });
      });

      each('.path-card,.course-card,.article-feature,.article-card,.editorial-card,.card,.offer-highlight,.manifesto,.band,.contact-panel', function (card) {
        card.classList.add('tilt-card');
        card.addEventListener('mousemove', function (event) {
          var rectangle = card.getBoundingClientRect();
          if (!rectangle.width || !rectangle.height) return;
          var x = (event.clientX - rectangle.left) / rectangle.width - 0.5;
          var y = (event.clientY - rectangle.top) / rectangle.height - 0.5;
          card.style.transform = 'perspective(1000px) rotateX(' + (y * -4.5) + 'deg) rotateY(' + (x * 5.5) + 'deg) translateY(-3px)';
        });
        card.addEventListener('mouseleave', function () {
          card.style.transform = '';
        });
      });

      var depthVisual = document.querySelector('.depth-visual');
      if (depthVisual) {
        var portrait = depthVisual.querySelector('.portrait-frame');
        depthVisual.addEventListener('mousemove', function (event) {
          var rectangle = depthVisual.getBoundingClientRect();
          var x = (event.clientX - rectangle.left) / rectangle.width - 0.5;
          var y = (event.clientY - rectangle.top) / rectangle.height - 0.5;
          if (portrait) portrait.style.transform = 'rotateX(' + (y * -5) + 'deg) rotateY(' + (x * 7) + 'deg) translate3d(' + (x * 12) + 'px,' + (y * 10) + 'px,0)';
        });
        depthVisual.addEventListener('mouseleave', function () {
          if (portrait) portrait.style.transform = '';
        });
      }
    });

    runFeature('cursor', function () {
      if (reducedMotion) return;

      var dot = document.createElement('span');
      var ring = document.createElement('span');
      var label = document.createElement('span');
      dot.className = 'cursor-dot';
      ring.className = 'cursor-ring';
      label.className = 'cursor-label';
      [dot, ring, label].forEach(function (element) {
        element.setAttribute('aria-hidden', 'true');
        body.appendChild(element);
      });

      var mouseX = window.innerWidth / 2;
      var mouseY = window.innerHeight / 2;
      var ringX = mouseX;
      var ringY = mouseY;
      var activated = false;
      var animationFrame = null;

      function renderCursor() {
        ringX += (mouseX - ringX) * 0.16;
        ringY += (mouseY - ringY) * 0.16;
        dot.style.transform = 'translate3d(' + mouseX + 'px,' + mouseY + 'px,0)';
        ring.style.transform = 'translate3d(' + ringX + 'px,' + ringY + 'px,0)';
        label.style.transform = 'translate3d(' + ringX + 'px,' + ringY + 'px,0) translate(-50%,-50%)';
        animationFrame = window.requestAnimationFrame(renderCursor);
      }

      function activateCursor(event) {
        if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
        mouseX = event.clientX;
        mouseY = event.clientY;
        root.style.setProperty('--mx', event.clientX + 'px');
        root.style.setProperty('--my', event.clientY + 'px');

        if (!activated) {
          activated = true;
          body.classList.add('cursor-ready');
          if (window.requestAnimationFrame) animationFrame = window.requestAnimationFrame(renderCursor);
        }
        body.classList.add('cursor-visible');
      }

      document.addEventListener('pointermove', activateCursor, { passive: true });
      document.addEventListener('mousemove', activateCursor, { passive: true });
      document.addEventListener('pointerdown', function () { body.classList.add('cursor-pressed'); });
      document.addEventListener('pointerup', function () { body.classList.remove('cursor-pressed'); });
      document.addEventListener('mouseleave', function () { body.classList.remove('cursor-visible'); });
      window.addEventListener('blur', function () { body.classList.remove('cursor-visible'); });

      var targetGroups = [
        { selector: '.path-card,.course-card', text: 'EXPLORE' },
        { selector: '.article-card,.article-feature', text: 'READ' },
        { selector: '.btn,.nav-cta', text: 'GO' },
        { selector: '.brand', text: 'HOME' }
      ];

      targetGroups.forEach(function (group) {
        each(group.selector, function (element) {
          element.addEventListener('mouseenter', function () {
            label.textContent = group.text;
            body.classList.add('cursor-active');
          });
          element.addEventListener('mouseleave', function () {
            body.classList.remove('cursor-active');
          });
        });
      });

      document.addEventListener('visibilitychange', function () {
        if (document.hidden && animationFrame) {
          window.cancelAnimationFrame(animationFrame);
          animationFrame = null;
        } else if (!document.hidden && activated && !animationFrame) {
          animationFrame = window.requestAnimationFrame(renderCursor);
        }
      });
    });

    runFeature('transitions', function () {
      if (reducedMotion || !curtain || window.location.protocol === 'file:') return;

      each('a[href]', function (link) {
        link.addEventListener('click', function (event) {
          var href = link.getAttribute('href');
          if (!href || href.charAt(0) === '#' || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) return;
          if (link.target === '_blank' || link.hasAttribute('download')) return;
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button > 0) return;

          var target;
          try {
            target = new URL(link.href, window.location.href);
          } catch (error) {
            return;
          }

          if (target.origin !== window.location.origin) return;
          if (target.pathname === window.location.pathname && target.hash) return;

          event.preventDefault();
          curtain.classList.remove('is-entering');
          curtain.classList.add('is-leaving');
          window.setTimeout(function () {
            window.location.href = target.href;
          }, 500);
        });
      });
    });

    root.setAttribute('data-js-status', 'ready');
  });
})();
