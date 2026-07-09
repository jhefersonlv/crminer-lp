/* ============================================================
   INIT — Lenis smooth scroll + GSAP/ScrollTrigger
   (var lenis é global — hero.js também usa)
   ============================================================ */
var lenis = new Lenis({ duration: 1.2, smoothTouch: false });
gsap.registerPlugin(ScrollTrigger, Draggable);
gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function rgbaVar(name, alpha) {
  return 'rgba(' + cssVar(name) + ',' + alpha + ')';
}

/* ============================================================
   STICKY HEADER — some ao rolar para baixo e volta ao rolar para cima
   ============================================================ */
(function () {
  var header = document.getElementById('site-header');
  if (!header) return;

  var lastY = window.scrollY || 0;
  var threshold = 12;

  function onScroll() {
    var currentY = window.scrollY || 0;
    var delta = currentY - lastY;

    header.classList.toggle('scrolled', currentY > 100);

    if (currentY <= 80) {
      header.classList.remove('nav-hidden');
    } else if (Math.abs(delta) > threshold) {
      header.classList.toggle('nav-hidden', delta > 0);
      lastY = currentY;
      return;
    }

    lastY = currentY;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ============================================================
   HERO LINKMINER — mascara slug e redireciona para cadastro
   ============================================================ */
(function () {
  var form = document.querySelector('[data-linkminer-form]');
  if (!form) return;

  var input = form.querySelector('input[name="linkminer"]');
  var signupUrl = form.getAttribute('action') || 'https://app.crminer.com.br/signup';
  var paramName = input ? input.getAttribute('name') || 'linkminer' : 'linkminer';

  function slugify(value) {
    return (value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }

  if (input) {
    input.addEventListener('input', function () {
      var cleaned = slugify(input.value);
      if (input.value !== cleaned) input.value = cleaned;
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var slug = input ? slugify(input.value) : '';
    var url;

    try {
      url = new URL(signupUrl, window.location.href);
      if (slug) url.searchParams.set(paramName, slug);
      url = url.toString();
    } catch (err) {
      url = signupUrl;
      if (slug) {
        url += (url.indexOf('?') === -1 ? '?' : '&') + encodeURIComponent(paramName) + '=' + encodeURIComponent(slug);
      }
    }

    if (typeof window.crmTrack === 'function') {
      window.crmTrack('generate_lead', {
        cta_location: 'hero-linkminer',
        cta_label: 'Criar meu linkminer',
        linkminer_slug_present: slug ? 'true' : 'false'
      });
    }

    window.location.href = url;
  });
})();

/* ============================================================
   SCROLL REVEAL — adiciona .in quando entra na viewport
   ============================================================ */
ScrollTrigger.batch('.reveal', {
  onEnter: function (els) {
    els.forEach(function (el) { el.classList.add('in'); });
  },
  start: 'top 90%',
  once: true
});
// Safety net: garante visibilidade mesmo sem scroll
setTimeout(function () {
  document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
}, 2500);

/* ── Grades de pessoas — Dobra 6 ── */
(function () {
  document.querySelectorAll('.imp-persons').forEach(function (el) {
    var total  = parseInt(el.dataset.total, 10) || 0;
    var active = parseInt(el.dataset.active, 10) || 0;
    for (var i = 0; i < total; i++) {
      var p = document.createElement('span');
      p.className = 'person-icon' + (i < active ? ' person-icon--active' : '');
      el.appendChild(p);
    }
  });
})();

/* ============================================================
   DOBRA 3 — Timeline scroll-driven completa (GSAP scrub)
   ============================================================ */
(function () {
  var driver = document.getElementById('dobra3-driver');
  if (!driver) return;

  var isMobile   = window.innerWidth < 768;
  var dots       = gsap.utils.toArray('#d3-tl-scene .tl-dot');
  var stageCards = gsap.utils.toArray('#d3-tl-scene .tl-stage-card');

  // transform-origin dos cards para o finale (fora da timeline — estático)
  gsap.set('.d3card--left',  { transformOrigin: 'top left' });
  gsap.set('.d3card--right', { transformOrigin: 'bottom right' });

  var d3tl = gsap.timeline({
    scrollTrigger: {
      trigger: '#dobra3-driver',
      start: 'top top',
      end: '+=5000',  // mais espaço → cena mais fluida
      scrub: 1
    }
  });

  // ── Título some, cards entram ──────────────────────────────
  d3tl
    .fromTo('#dobra3-title',
      { opacity: 1, y: 0 },
      { opacity: 0, y: -28, ease: 'none', duration: 2.2 }, 0);

  if (!isMobile) {
    // Desktop: os dois cards entram juntos (diagonal) e somem juntos
    d3tl
      .fromTo('.d3card--left',
        { opacity: 0, x: -70 },
        { opacity: 1, x: 0, ease: 'power2.out', duration: 4.3 }, 1.2)
      .fromTo('.d3card--right',
        { opacity: 0, x: 70 },
        { opacity: 1, x: 0, ease: 'power2.out', duration: 4.3 }, 1.2)
      .to(['.d3card--left', '.d3card--right'],
        { opacity: 0, duration: 0.7 }, 5.5);
  } else {
    // Mobile: "o que você vê" e depois "o que você não vê", no mesmo ponto (só opacidade)
    d3tl
      .fromTo('.d3card--left',
        { opacity: 0 }, { opacity: 1, ease: 'power2.out', duration: 1.4 }, 1.2)
      .to('.d3card--left',
        { opacity: 0, ease: 'power2.in', duration: 0.8 }, 3.2)
      .fromTo('.d3card--right',
        { opacity: 0 }, { opacity: 1, ease: 'power2.out', duration: 1.4 }, 3.8)
      .to('.d3card--right',
        { opacity: 0, ease: 'power2.in', duration: 0.7 }, 5.5);
  }

  // ── Textos da Fase 2 ───────────────────────────────────────
  d3tl
    .to('#d3-tl-title',  { opacity: 1, duration: 0.1 }, 6.0)
  .fromTo('#d3-txt1',  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.0 }, 6.1)
  .fromTo('#d3-txt2',  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1.0 }, 6.9)
  .to(['#d3-txt1', '#d3-txt2'], { opacity: 0, duration: 0.5 }, 7.9)
  .to('#d3-tl-title',  { opacity: 0, duration: 0.4 }, 8.2)

  // ── Cena da timeline (permanece visível até o fim) ─────────
  .fromTo('#d3-tl-scene',
    { opacity: 0 }, { opacity: 1, duration: 0.4 }, 8.3)

  // ── Linha vertical cresce suavemente ──────────────────────
  .fromTo('#d3-tl-fill',
    { height: '0%' }, { height: '100%', ease: 'none', duration: 2.2 }, 8.3);

  // ── Dots + cards ativam sequencialmente (0.4s por dot = ~200px cada) ──
  var DOT_START = 8.30;
  var DOT_STEP  = 0.40;

  dots.forEach(function (dot, i) {
    var t       = DOT_START + i * DOT_STEP;
    var card    = stageCards[i];
    var isRight = card && card.classList.contains('tl-card--right');

    d3tl.fromTo(dot,
      { backgroundColor: rgbaVar('--gold-rgb', 0.12), borderColor: rgbaVar('--gold-rgb', 0.25), boxShadow: 'none' },
      { backgroundColor: cssVar('--gold'), borderColor: rgbaVar('--gold-rgb', 0.55),
        boxShadow: '0 0 0 6px ' + rgbaVar('--gold-rgb', 0.10) + ', 0 0 18px ' + rgbaVar('--gold-rgb', 0.24),
        duration: 0.08 }, t);

    if (card) {
      d3tl.fromTo(card,
        { opacity: 0, x: isRight ? 10 : -10 },
        { opacity: 1, x: 0, duration: 0.12 }, t);
    }
  });

  // ── Cena PERMANECE visível — finale aparece sobre ela ─────
  d3tl
    .fromTo('#d3-finale',
      { opacity: 0 }, { opacity: 1, duration: 0.4 }, 10.6);
})();

/* ============================================================
   DOBRA 4 — CARDS STICKY "CADA SINAL SE TORNA UM LEAD"
   ============================================================ */
(function () {
  var section = document.getElementById('how');
  if (!section) return;

  var cards = gsap.utils.toArray('.how-step-card', section);
  if (!cards.length) return;

  var mm = gsap.matchMedia();

  mm.add("(min-width: 769px)", function () {
    gsap.set(cards, { clearProps: "transform" });

    cards.forEach(function (card, index) {
      if (index === cards.length - 1) return;

      var targetScale = 1 - ((cards.length - 1 - index) * 0.025);

      gsap.to(card, {
        scale: targetScale,
        ease: 'none',
        scrollTrigger: {
          trigger: cards[index + 1],
          start: 'top 78%',
          end: 'top 104px',
          scrub: true
        }
      });
    });

    return function () {
      gsap.set(cards, { clearProps: "transform" });
    };
  });

  mm.add("(max-width: 768px)", function () {
    gsap.set(cards, { clearProps: "transform" });

    cards.forEach(function (card) {
      gsap.fromTo(card,
        { autoAlpha: 0.92, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.45,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 86%',
            once: true
          }
        });
    });

    return function () {
      gsap.set(cards, { clearProps: "all" });
    };
  });

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    ScrollTrigger.getAll().forEach(function (st) {
      if (st.trigger && section.contains(st.trigger)) st.kill();
    });
    gsap.set(cards, { clearProps: "all" });
  }
})();

/* ============================================================
   TRACKING — cliques em CTA + profundidade de scroll
   Espelha cada evento em GA4 (gtag) E Microsoft Clarity.
   Se uma das ferramentas não estiver carregada, vira no-op nela.
   ============================================================ */
(function () {
  function track(name, params) {
    params = params || {};
    // GA4
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
    // Microsoft Clarity: evento custom (vira Smart Event) + tags filtráveis na gravação
    if (typeof window.clarity === 'function') {
      window.clarity('event', name);
      Object.keys(params).forEach(function (k) {
        window.clarity('set', k, String(params[k]));
      });
    }
  }

  // Exposto para outros módulos (ex.: stories.js) reusarem o mesmo tracker
  window.crmTrack = track;

  /* ── Tags de origem/campanha: setadas uma vez no load ──
     Permite segmentar gravações do Clarity e relatórios do GA4 por
     "de onde veio quem converteu" (utm_source / medium / campaign). */
  (function tagSource() {
    var q = new URLSearchParams(location.search);
    var tags = {
      utm_source:   q.get('utm_source')   || 'direct',
      utm_medium:   q.get('utm_medium')   || 'none',
      utm_campaign: q.get('utm_campaign') || 'none',
      landing_path: location.pathname
    };
    if (typeof window.clarity === 'function') {
      Object.keys(tags).forEach(function (k) { window.clarity('set', k, tags[k]); });
    }
    if (typeof window.gtag === 'function') window.gtag('set', 'user_properties', tags);
  })();

  /* ── Clique em qualquer [data-cta] ── */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-cta]');
    if (!el) return;

    var loc   = el.getAttribute('data-cta') || '';
    var dest  = el.getAttribute('href') || '';
    var label = (el.textContent || '').trim().replace(/\s+/g, ' ');

    // Classifica o tipo de clique p/ separar conversão de vídeo/redes na análise
    var type = 'other';
    if (loc.indexOf('social-') === 0)      type = 'social';
    else if (loc.indexOf('video') !== -1)  type = 'video';
    else if (dest.indexOf('signup') !== -1 || loc.indexOf('linkminer') !== -1) type = 'signup';

    track('cta_click', {
      cta_location:    loc,
      cta_label:       label,
      cta_destination: dest,
      cta_type:        type
    });

    // Clique de cadastro = lead em potencial (evento "recomendado" do GA4)
    if (type === 'signup') {
      track('generate_lead', { cta_location: loc, cta_label: label });
      // Prioriza a gravação desse visitante de alto valor no Clarity
      if (typeof window.clarity === 'function') window.clarity('upgrade', 'signup_intent');
      // Preparado para Meta Pixel no futuro (sem instalar agora)
      if (typeof window.fbq === 'function') window.fbq('track', 'Lead', { content_name: loc });
    }
  }, { passive: true });

  /* ── Profundidade de scroll: 25 / 50 / 75 / 100% ── */
  var marks = [25, 50, 75, 100];
  var fired = new Set();
  function onScrollDepth() {
    var doc = document.documentElement;
    var scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    var pct = (window.scrollY / scrollable) * 100;
    marks.forEach(function (m) {
      if (pct >= m && !fired.has(m)) {
        fired.add(m);
        track('scroll_depth', { percent: m });
      }
    });
    if (fired.size === marks.length) window.removeEventListener('scroll', onScrollDepth);
  }
  window.addEventListener('scroll', onScrollDepth, { passive: true });
})();

/* ============================================================
   BOTÕES FLUTUANTES — visibilidade sobre o hero (FAB stories + bubble "Bora conversar")
   Liga a classe .hero-in-view no body enquanto o hero está em tela.
   O CSS esconde os dois botões: no desktop só some sobre o hero;
   durante os stories somem em qualquer viewport (via body.stories-lock).
   ============================================================ */
(function () {
  var hero = document.getElementById('hero-scroll-driver');
  if (!hero) return;
  function sync(active) { document.body.classList.toggle('hero-in-view', active); }
  var st = ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    onToggle:  function (self) { sync(self.isActive); },
    onRefresh: function (self) { sync(self.isActive); }
  });
  sync(st.isActive);
})();
