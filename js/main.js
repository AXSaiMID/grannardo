/* ═══════════════════════════════════════════════════════
   GRAN NARDO — Interações
   Lenis · GSAP ScrollTrigger · Cursor · Preloader
   ═══════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var doc = document;
  var qs  = function (s, c) { return (c || doc).querySelector(s); };
  var qsa = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer    = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var hasGSAP        = typeof gsap !== 'undefined';
  var hasLenis       = typeof Lenis !== 'undefined';

  if (hasGSAP && typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);

  /* ───────────────────────── Lenis ───────────────────────── */
  var lenis = null;
  if (hasLenis && !prefersReduced) {
    lenis = new Lenis({
      duration: 1.25,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6
    });
    if (hasGSAP) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    }
  }

  function scrollToTarget(target, offset) {
    if (lenis) { lenis.scrollTo(target, { offset: offset || -76, duration: 1.6 }); }
    else {
      var el = typeof target === 'string' ? qs(target) : target;
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: 'smooth' });
      else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /* ─────────────────── Links âncora suaves ────────────────── */
  qsa('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length > 1 && qs(id)) {
        e.preventDefault();
        closeMenu();
        scrollToTarget(id);
      } else if (id === '#') { e.preventDefault(); }
    });
  });

  /* ═══════════════════ PRELOADER ═══════════════════ */
  var preloader = qs('#preloader');
  var preCount  = qs('#preCount');
  var preWord   = qs('#preWord');
  var words     = ['mármores', 'granitos', 'quartzitos', 'desde 2009', 'grupo nardo'];
  var body      = doc.body;
  body.setAttribute('data-loading', '');

  function finishPreload() {
    if (!preloader) return;
    if (!hasGSAP || prefersReduced) {
      preloader.parentNode && preloader.parentNode.removeChild(preloader);
      body.removeAttribute('data-loading');
      heroIntro(true);
      return;
    }
    var tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } });
    tl.to('.pre-center', { yPercent: -18, opacity: 0, duration: .65, ease: 'power2.in' }, 0)
      .to('.pre-foot',   { opacity: 0, duration: .45 }, 0)
      .to('.pre-curtain.c1', { yPercent: -100, duration: 1.05, ease: 'power4.inOut' }, .28)
      .to('.pre-curtain.c2', { yPercent: -100, duration: 1.05, ease: 'power4.inOut' }, .42)
      .add(function () { body.removeAttribute('data-loading'); heroIntro(false); }, .62)
      .set(preloader, { display: 'none' });
  }

  (function runPreload() {
    if (!preloader) { body.removeAttribute('data-loading'); return; }
    if (!hasGSAP || prefersReduced) {
      // Sem GSAP: deixa o fallback de CSS (6s) agir e mostra o conteúdo
      setTimeout(finishPreload, 350);
      return;
    }
    var counter = { v: 0 }, wi = 0;
    var wordTimer = setInterval(function () {
      wi = (wi + 1) % words.length;
      if (preWord) preWord.textContent = words[wi];
    }, 420);

    gsap.timeline()
      .from('.pre-logo',  { y: 40, opacity: 0, duration: .9, ease: 'power3.out' }, .1)
      .from('.pre-rule',  { scaleX: 0, duration: .8, ease: 'power2.out' }, .35)
      .from('.pre-word',  { opacity: 0, duration: .5 }, .5)
      .from('.pre-tag',   { opacity: 0, y: 12, duration: .6 }, .5)
      .to(counter, {
        v: 100, duration: 2.1, ease: 'power2.inOut',
        onUpdate: function () { if (preCount) preCount.textContent = String(Math.round(counter.v)).padStart(2, '0'); }
      }, .25)
      .add(function () { clearInterval(wordTimer); finishPreload(); }, '+=.15');
  })();

  /* ═══════════════════ HERO INTRO ═══════════════════ */
  function heroIntro(instant) {
    if (!hasGSAP || prefersReduced) return;
    var tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    tl.fromTo('.hero-img', { scale: 1.28 }, { scale: 1.06, duration: instant ? 0 : 2.4, ease: 'power2.out' }, 0)
      .from('.ht-word',  { yPercent: 118, duration: 1.35, stagger: .12 }, .12)
      .from('.ht-sub',   { y: 44, opacity: 0, duration: 1.1 }, .78)
      .from('.hero-lead', { y: 30, opacity: 0, duration: .9 }, .95)
      .from('.hero-actions', { y: 26, opacity: 0, duration: .9 }, 1.08)
      .from('.hero-eyebrow', { y: -18, opacity: 0, duration: .8, stagger: .12 }, .85)
      .from('.hero-bottom', { opacity: 0, duration: 1 }, 1.25)
      .from('.hero-frame i', { scaleY: 0, duration: 1.4, ease: 'power3.inOut' }, .6);
  }

  /* ═══════════════ SCROLL-DRIVEN MOTION ═════════════ */
  function initScrollFX() {
    if (!hasGSAP || typeof ScrollTrigger === 'undefined') return;

    /* Barra de progresso */
    gsap.to('#progressBar', {
      scaleX: 1, ease: 'none',
      scrollTrigger: { start: 0, end: 'max', scrub: .3 }
    });

    /* Parallax + fade do hero */
    gsap.to('.hero-bg', {
      yPercent: 18, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero-title, .hero-lead, .hero-actions', {
      yPercent: -60, opacity: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: '42% top', end: 'bottom top', scrub: true }
    });

    /* Reveals genéricos de linha */
    qsa('.reveal-line').forEach(function (el) {
      gsap.from(el, {
        yPercent: 60, opacity: 0, duration: 1.15, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true }
      });
    });

    /* Títulos de seção (máscara de linha com span interno) */
    function maskWrap(line) {
      var inner = doc.createElement('span');
      inner.className = 'st-inner';
      while (line.firstChild) inner.appendChild(line.firstChild);
      line.appendChild(inner);
      return inner;
    }
    qsa('.sec-title').forEach(function (el) {
      var lines = qsa('.st-line', el);
      if (!lines.length) return;
      var inners = lines.map(maskWrap);
      gsap.from(inners, {
        yPercent: 115, duration: 1.3, stagger: .12, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 86%', once: true }
      });
    });
    var ctaTitle = qs('.cta-title');
    if (ctaTitle) {
      var ctInners = qsa('.ct-line', ctaTitle).map(maskWrap);
      gsap.from(ctInners, {
        yPercent: 112, duration: 1.25, stagger: .09, ease: 'power4.out',
        scrollTrigger: { trigger: ctaTitle, start: 'top 85%', once: true }
      });
    }

    /* Manifesto — palavra a palavra com scrub */
    var mText = qs('#manifestoText');
    if (mText) {
      wrapWords(mText);
      gsap.to('#manifestoText .w', {
        opacity: 1, stagger: .06, ease: 'none',
        scrollTrigger: { trigger: '#manifestoText', start: 'top 78%', end: 'bottom 45%', scrub: .6 }
      });
    }

    /* Contadores */
    qsa('.stat-num').forEach(function (el) {
      var target = parseInt(el.dataset.count, 10) || 0;
      var suffix = el.dataset.suffix || '';
      var obj = { v: 0 };
      gsap.to(obj, {
        v: target, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onUpdate: function () {
          el.textContent = (target >= 1000 ? Math.round(obj.v).toLocaleString('pt-BR') : Math.round(obj.v)) + suffix;
        }
      });
    });
    qsa('.stat').forEach(function (s, i) {
      gsap.from(s, {
        y: 44, opacity: 0, duration: 1, delay: i * .1, ease: 'power3.out',
        scrollTrigger: { trigger: '.stats', start: 'top 88%', once: true }
      });
    });

    /* Stack de serviços — cartão anterior encolhe */
    var cards = qsa('.scard');
    if (window.matchMedia('(min-width: 769px)').matches) {
      cards.forEach(function (card, i) {
        if (i === cards.length - 1) return;
        var inner = qs('.sc-inner', card);
        gsap.to(inner, {
          scale: .92, yPercent: -2, filter: 'brightness(.45) blur(2px)', ease: 'none',
          scrollTrigger: {
            trigger: cards[i + 1],
            start: 'top bottom-=15%',
            end: 'top top+=10%',
            scrub: true
          }
        });
      });
    }
    cards.forEach(function (card) {
      var media = qs('.sc-media', card);
      if (!media || !window.matchMedia('(min-width: 769px)').matches) return;
      gsap.fromTo(qs('img', media), { yPercent: -8 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });

    /* Reveal de imagens com clip-path */
    qsa('.img-reveal').forEach(function (fig) {
      gsap.fromTo(fig, { clipPath: 'inset(12% 6% 12% 6%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', ease: 'none',
        scrollTrigger: { trigger: fig, start: 'top 92%', end: 'top 45%', scrub: true }
      });
    });

    /* Passos do processo */
    qsa('.pstep').forEach(function (step) {
      gsap.from(step, {
        y: 60, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: step, start: 'top 88%', once: true }
      });
    });

    /* Linhas do grupo */
    qsa('.grow').forEach(function (row) {
      gsap.from(row, {
        y: 54, opacity: 0, duration: .9, ease: 'power3.out',
        scrollTrigger: { trigger: row, start: 'top 92%', once: true }
      });
    });

    /* Materiais — scroll horizontal fixado (desktop) */
    ScrollTrigger.matchMedia({
      '(min-width: 769px)': function () {
        var track = qs('#matTrack');
        var pin   = qs('#matPin');
        if (!track || !pin) return;
        var getAmount = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
        gsap.to(track, {
          x: function () { return -getAmount(); },
          ease: 'none',
          scrollTrigger: {
            trigger: '#materiais',
            start: 'top top',
            end: function () { return '+=' + (getAmount() + window.innerHeight * .2); },
            scrub: 1,
            pin: '#matPin',
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: function (self) {
              var bar = qs('#matProg');
              if (bar) bar.style.transform = 'scaleX(' + self.progress + ')';
            }
          }
        });
      }
    });

    /* Cards de materiais entram suavemente (mobile) */
    qsa('.mat-card').forEach(function (c) {
      gsap.from(c, {
        y: 60, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: c, start: 'top 95%', once: true }
      });
    });

    /* Rodapé gigante */
    var giant = qs('#footGiant');
    if (giant) {
      gsap.fromTo(giant, { yPercent: 46 }, {
        yPercent: 0, ease: 'none',
        scrollTrigger: { trigger: '.footer', start: 'top 92%', end: 'bottom bottom', scrub: true }
      });
    }
  }

  function wrapWords(el) {
    var nodes = Array.prototype.slice.call(el.childNodes);
    nodes.forEach(function (node) {
      if (node.nodeType === 3) {
        var frag = doc.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (piece) {
          if (!piece) return;
          if (/^\s+$/.test(piece)) { frag.appendChild(doc.createTextNode(piece)); return; }
          var s = doc.createElement('span');
          s.className = 'w';
          s.textContent = piece;
          frag.appendChild(s);
        });
        el.replaceChild(frag, node);
      } else if (node.nodeType === 1) {
        var wordsIn = node.textContent.split(/(\s+)/);
        var frag2 = doc.createDocumentFragment();
        wordsIn.forEach(function (piece) {
          if (!piece) return;
          if (/^\s+$/.test(piece)) { frag2.appendChild(doc.createTextNode(' ')); return; }
          var s = doc.createElement('span');
          s.className = 'w ' + node.tagName.toLowerCase();
          s.textContent = piece;
          frag2.appendChild(s);
        });
        el.replaceChild(frag2, node);
      }
    });
    /* mantém itálico nas palavras herdadas de <em> */
    qsa('#manifestoText .w.em').forEach(function (w) {
      w.style.fontStyle = 'italic';
      w.style.color = 'var(--gold-2)';
    });
  }

  /* ═══════════════ NAV comportamento ═══════════════ */
  var nav = qs('#nav');
  var lastY = 0;
  function onScrollY(y) {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', y > 60);
    if (y > 320 && y > lastY + 4 && !body.classList.contains('menu-open')) nav.classList.add('is-hidden');
    else if (y < lastY - 4 || y < 320) nav.classList.remove('is-hidden');
    lastY = y;
    var f = qs('#wppFloat');
    if (f) f.classList.toggle('show', y > window.innerHeight * .7);
  }
  if (lenis) lenis.on('scroll', function (e) { onScrollY(e.scroll); });
  else window.addEventListener('scroll', function () { onScrollY(window.scrollY); }, { passive: true });

  /* ═══════════════ MENU mobile ═══════════════ */
  var burger = qs('#burger');
  function closeMenu() {
    if (!body.classList.contains('menu-open')) return;
    body.classList.remove('menu-open');
    burger && burger.setAttribute('aria-expanded', 'false');
    if (lenis) lenis.start();
  }
  if (burger) burger.addEventListener('click', function () {
    var open = body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', String(open));
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  doc.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* ═══════════════ CURSOR ═══════════════ */
  if (finePointer) {
    var dot = qs('.cursor-dot'), ring = qs('.cursor-ring'), label = qs('.cursor-label');
    var mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    doc.addEventListener('mousemove', function (e) { mx = e.clientX; my = e.clientY; });
    (function loop() {
      rx += (mx - rx) * .16; ry += (my - ry) * .16;
      if (dot)  dot.style.transform  = 'translate(' + (mx - 3) + 'px,' + (my - 3) + 'px)';
      if (ring) ring.style.transform = 'translate(' + (rx - ring.offsetWidth / 2) + 'px,' + (ry - ring.offsetHeight / 2) + 'px)';
      requestAnimationFrame(loop);
    })();
    function bindCursor() {
      qsa('a, button, input, select, textarea, [data-hover]').forEach(function (el) {
        if (el.dataset.cbound) return; el.dataset.cbound = '1';
        el.addEventListener('mouseenter', function () { ring && ring.classList.add('is-hover'); });
        el.addEventListener('mouseleave', function () { ring && ring.classList.remove('is-hover'); });
      });
      qsa('[data-cursor]').forEach(function (el) {
        if (el.dataset.clbound) return; el.dataset.clbound = '1';
        el.addEventListener('mouseenter', function () {
          if (!ring || !label) return;
          label.textContent = el.dataset.cursor === 'drag' ? 'deslize' : 'ver';
          ring.classList.add('is-label'); dot && dot.classList.add('is-label');
        });
        el.addEventListener('mouseleave', function () {
          ring && ring.classList.remove('is-label'); dot && dot.classList.remove('is-label');
        });
      });
    }
    bindCursor();
  }

  /* ═══════════════ BOTÕES MAGNÉTICOS ═══════════════ */
  if (finePointer && hasGSAP && !prefersReduced) {
    qsa('.magnetic').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = e.clientX - r.left - r.width / 2;
        var y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { x: x * .28, y: y * .28, duration: .5, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1, .45)' });
      });
    });
  }

  /* ═══════════════ GRUPO — preview flutuante ═══════════════ */
  if (finePointer) {
    var prev = qs('#grupoPreview');
    var grupo = qs('#grupo');
    if (prev && grupo) {
      var px = 0, py = 0, tx = 0, ty = 0;
      grupo.addEventListener('mousemove', function (e) { tx = e.clientX + 28; ty = e.clientY - 190; });
      var hovering = false;
      (function pl() {
        if (hovering) {
          px += (tx - px) * .1; py += (ty - py) * .1;
          prev.style.left = px + 'px'; prev.style.top = py + 'px';
        }
        requestAnimationFrame(pl);
      })();
      qsa('.grow').forEach(function (row) {
        row.addEventListener('mouseenter', function () {
          prev.style.backgroundImage = 'url(' + row.dataset.img + ')';
          px = tx; py = ty; hovering = true;
          prev.classList.add('on');
        });
        row.addEventListener('mouseleave', function () { hovering = false; prev.classList.remove('on'); });
      });
    }
    /* Linhas do grupo abrem WhatsApp/contexto ao clicar */
    qsa('.grow').forEach(function (row) {
      row.addEventListener('click', function () {
        var link = qs('a', row);
        if (link) link.click();
      });
    });
  }

  /* ═══════════════ FORM → WHATSAPP ═══════════════ */
  var cform = qs('#cform');
  if (cform) cform.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(cform);
    var nome = (d.get('nome') || '').toString().trim();
    if (!nome) { var n = qs('input[name="nome"]', cform); n && n.focus(); return; }
    var tel = (d.get('telefone') || '').toString().trim();
    var msg = 'Olá! Meu nome é ' + nome + '.' +
      (tel ? ' Meu telefone é ' + tel + '.' : '') +
      ' Gostaria de um orçamento: ' + d.get('assunto') + '.' +
      ((d.get('mensagem') || '').toString().trim() ? ' ' + d.get('mensagem').toString().trim() : '');
    window.open('https://api.whatsapp.com/send?phone=5544991082460&text=' + encodeURIComponent(msg), '_blank');
  });

  /* Newsletter (fake, com feedback) */
  var news = qs('#newsForm');
  if (news) news.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = qs('#fnOk');
    if (ok) ok.classList.add('show');
    news.reset();
    setTimeout(function () { ok && ok.classList.remove('show'); }, 5000);
  });

  /* Voltar ao topo */
  var toTop = qs('#toTop');
  if (toTop) toTop.addEventListener('click', function () { scrollToTarget(0, 0); });

  /* ═══════════════ BOOT ═══════════════ */
  if (prefersReduced) {
    body.removeAttribute('data-loading');
    qsa('.w').forEach(function (w) { w.style.opacity = 1; });
  } else {
    initScrollFX();
  }

  /* Refresh quando tudo carregar (fontes/imagens mudam medidas) */
  window.addEventListener('load', function () {
    if (hasGSAP && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () {
    if (hasGSAP && typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
  });
})();
