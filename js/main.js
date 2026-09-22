/* ============================================================
   INIT — Lenis smooth scroll + GSAP/ScrollTrigger
   (var lenis é global — hero.js também usa)
   ============================================================ */
var lenis = new Lenis({ duration: 1.2, smoothTouch: false });
gsap.registerPlugin(ScrollTrigger);
gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

/* ============================================================
   NAVEGAÇÃO POR ÂNCORAS — scroll suave com offset do header
   ============================================================ */
(function () {
  var header = document.getElementById('site-header');
  var anchorLinks = Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]'));
  var menuLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]'));

  function setCurrentMenu(hash) {
    menuLinks.forEach(function (link) {
      var isCurrent = link.getAttribute('href') === hash;
      link.classList.toggle('is-current', isCurrent);
      if (isCurrent) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }

  function getOffset() {
    return -((header ? header.offsetHeight : 0) + 18);
  }

  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      var hash = link.getAttribute('href');
      if (!hash || hash === '#') return;

      var target = document.querySelector(hash);
      if (!target) return;

      event.preventDefault();
      if (header) header.classList.remove('nav-hidden');
      setCurrentMenu(hash);
      window.crmAnchorScrolling = true;

      var anchorScrollFallback = window.setTimeout(function () {
        window.crmAnchorScrolling = false;
      }, 1800);

      lenis.scrollTo(target, {
        offset: getOffset(),
        duration: 1.15,
        easing: function (t) { return 1 - Math.pow(1 - t, 4); },
        onComplete: function () {
          window.clearTimeout(anchorScrollFallback);
          window.crmAnchorScrolling = false;
          if (window.location.hash !== hash) history.pushState(null, '', hash);
        }
      });
    });
  });

  menuLinks.forEach(function (link) {
    var hash = link.getAttribute('href');
    var section = document.querySelector(hash);
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top 48%',
      end: 'bottom 48%',
      onEnter: function () { setCurrentMenu(hash); },
      onEnterBack: function () { setCurrentMenu(hash); }
    });
  });

  ScrollTrigger.create({
    trigger: '#hero-scroll-driver',
    start: 'top top',
    end: 'bottom 52%',
    onEnter: function () { setCurrentMenu(''); },
    onEnterBack: function () { setCurrentMenu(''); }
  });
})();
/* ============================================================
   DEMONSTRAÇÃO — abre o formulário no widget nativo LinkMiner
   ============================================================ */
(function () {
  var openers = Array.prototype.slice.call(document.querySelectorAll('[data-demo-open]'));
  if (!openers.length) return;

  var demoEmbedUrl = 'https://www.linkminer.app/embed/crminer?fill=true&t=1789240482256&crmOrigin=LANDING_PAGE&skippable=true';
  var openingWidget = false;

  function getWidgetToggle() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll(
      'body > button[aria-label="Abrir formulário de contato"], body > button[aria-label="Fechar formulário"]'
    ));
    return buttons[0] || null;
  }

  function isWidgetOpen() {
    var toggle = getWidgetToggle();
    return Boolean(toggle && toggle.getAttribute('aria-label') === 'Fechar formulário');
  }

  function getWidgetFrame() {
    return document.querySelector('iframe[data-word-forms-iframe]');
  }

  function setWidgetOpen(open) {
    document.body.classList.toggle('widget-offer-open', open);
  }

  function loadDemoForm(frame) {
    if (frame.src !== demoEmbedUrl) frame.src = demoEmbedUrl;
    openingWidget = false;
    setWidgetOpen(true);
  }

  function openWidget() {
    if (openingWidget) return;

    openingWidget = true;
    setWidgetOpen(true);
    var startedAt = performance.now();

    function attempt() {
      var toggle = getWidgetToggle();
      if (toggle && toggle.getAttribute('aria-label') === 'Abrir formulário de contato') {
        toggle.click();
      }

      var frame = getWidgetFrame();
      if (frame && isWidgetOpen()) {
        loadDemoForm(frame);
        return;
      }

      if (performance.now() - startedAt >= 5000) {
        openingWidget = false;
        setWidgetOpen(false);
        window.location.assign(demoEmbedUrl);
        return;
      }

      window.requestAnimationFrame(attempt);
    }

    attempt();
  }

  openers.forEach(function (opener) {
    opener.removeAttribute('target');
    opener.removeAttribute('rel');
    opener.addEventListener('click', function (event) {
      event.preventDefault();
      openWidget();
    });
  });

  new MutationObserver(function () {
    if (isWidgetOpen() || openingWidget) setWidgetOpen(true);
    else setWidgetOpen(false);
  }).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['aria-label']
  });
})();

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

    if (window.crmAnchorScrolling) {
      header.classList.remove('nav-hidden');
      lastY = currentY;
      return;
    }

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
   SCROLL REVEAL — adiciona .in quando entra na viewport
   ============================================================ */
var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var revealElements = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

if (reduceMotion) {
  revealElements.forEach(function (el) { el.classList.add('in'); });
} else {
  ScrollTrigger.batch('.reveal', {
    interval: 0.1,
    batchMax: 4,
    onEnter: function (els) {
      els.forEach(function (el, index) {
        el.style.setProperty('--reveal-delay', (index * 75) + 'ms');
        el.classList.add('in');
      });
    },
    start: 'top 88%',
    once: true
  });

  // Safety net apenas para conteúdo já visível, sem revelar o restante da página.
  setTimeout(function () {
    revealElements.forEach(function (el) {
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.94 && rect.bottom > 0) el.classList.add('in');
    });
  }, 1400);
}

/* ============================================================
   COMO FUNCIONA — troca interativa dos 5 passos
   ============================================================ */
(function () {
  var journey = document.querySelector('[data-how-journey]');
  if (!journey) return;

  var stepNav = journey.querySelector('.how-step-nav');
  var triggers = Array.prototype.slice.call(journey.querySelectorAll('[data-how-target]'));
  var panels = Array.prototype.slice.call(journey.querySelectorAll('[data-how-panel]'));
  var currentNumber = journey.querySelector('[data-how-current]');
  var progressBar = journey.querySelector('[data-how-progress]');
  var positionText = journey.querySelector('[data-how-position]');
  var prevButton = journey.querySelector('[data-how-prev]');
  var nextButton = journey.querySelector('[data-how-next]');
  var mobileJourney = window.matchMedia('(max-width: 980px)');
  var journeyReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var activeIndex = 0;
  if (!triggers.length || !panels.length) return;

  function alignMobileTrigger(trigger, immediate) {
    if (!stepNav || !trigger || !mobileJourney.matches) return;

    var paddingLeft = parseFloat(window.getComputedStyle(stepNav).paddingLeft) || 0;
    var targetLeft = Math.max(0, trigger.offsetLeft - paddingLeft);
    stepNav.scrollTo({
      left: targetLeft,
      behavior: immediate || journeyReducedMotion.matches ? 'auto' : 'smooth'
    });
  }

  function resetMobileJourney() {
    if (!stepNav || !mobileJourney.matches) return;
    activeIndex = 0;
    activate(triggers[0].getAttribute('data-how-target'), false, true);
  }

  function activate(step, focusTab, immediateScroll) {
    var nextIndex = Math.max(0, triggers.findIndex(function (trigger) {
      return trigger.getAttribute('data-how-target') === step;
    }));
    activeIndex = nextIndex;

    triggers.forEach(function (trigger) {
      var active = trigger.getAttribute('data-how-target') === step;
      trigger.classList.toggle('is-active', active);
      trigger.setAttribute('aria-selected', active ? 'true' : 'false');
      trigger.setAttribute('tabindex', active ? '0' : '-1');
      if (active && focusTab) trigger.focus({ preventScroll: true });
    });

    panels.forEach(function (panel) {
      var active = panel.getAttribute('data-how-panel') === step;
      panel.classList.toggle('is-active', active);
      panel.setAttribute('aria-hidden', active ? 'false' : 'true');
    });

    if (currentNumber) currentNumber.textContent = String(activeIndex + 1).padStart(2, '0');
    if (progressBar) progressBar.style.width = (((activeIndex + 1) / triggers.length) * 100) + '%';
    if (positionText) positionText.textContent = 'Etapa ' + (activeIndex + 1) + ' de ' + triggers.length;
    if (prevButton) prevButton.disabled = activeIndex === 0;
    if (nextButton) {
      var isLast = activeIndex === triggers.length - 1;
      nextButton.querySelector('span').textContent = isLast ? 'Voltar ao início' : 'Próxima etapa';
      nextButton.setAttribute('aria-label', isLast ? 'Voltar para a primeira etapa' : 'Avançar para a próxima etapa');
    }

    alignMobileTrigger(triggers[activeIndex], immediateScroll);
  }

  triggers.forEach(function (trigger, index) {
    trigger.setAttribute('tabindex', trigger.classList.contains('is-active') ? '0' : '-1');

    trigger.addEventListener('click', function () {
      activate(trigger.getAttribute('data-how-target'), false);
    });

    trigger.addEventListener('keydown', function (event) {
      var nextIndex = index;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % triggers.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + triggers.length) % triggers.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = triggers.length - 1;
      else return;

      event.preventDefault();
      activate(triggers[nextIndex].getAttribute('data-how-target'), true);
    });
  });

  if (prevButton) {
    prevButton.addEventListener('click', function () {
      if (activeIndex > 0) activate(triggers[activeIndex - 1].getAttribute('data-how-target'), false);
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', function () {
      var nextIndex = activeIndex === triggers.length - 1 ? 0 : activeIndex + 1;
      activate(triggers[nextIndex].getAttribute('data-how-target'), false);
    });
  }

  window.requestAnimationFrame(resetMobileJourney);
  window.addEventListener('pageshow', resetMobileJourney);
  if (typeof mobileJourney.addEventListener === 'function') {
    mobileJourney.addEventListener('change', function (event) {
      if (event.matches) resetMobileJourney();
    });
  }
})();
/* Centraliza suavemente a jornada quando o card entra na tela. */
(function () {
  var stage = document.querySelector('#how .how-stage');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var centering = false;

  if (!stage || reducedMotion.matches || typeof ScrollTrigger === 'undefined') return;

  function centerStage() {
    if (centering) return;

    var viewportHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    var stageHeight = stage.getBoundingClientRect().height;
    var visibleTop = Math.max(12, (viewportHeight - stageHeight) / 2);

    centering = true;
    lenis.scrollTo(stage, {
      offset: -visibleTop,
      duration: 0.72,
      easing: function (t) { return 1 - Math.pow(1 - t, 4); },
      onComplete: function () {
        centering = false;
      }
    });
  }

  ScrollTrigger.create({
    trigger: stage,
    start: 'top 82%',
    end: 'bottom 18%',
    onEnter: centerStage,
    onEnterBack: centerStage
  });
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
    else if (loc.indexOf('demo') !== -1 || dest.indexOf('/qrcode/') !== -1) type = 'demo';
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
   BOTÕES FLUTUANTES — visibilidade sobre o hero e a jornada "Como funciona"
   O CSS esconde o contato nessas áreas em qualquer viewport e durante os stories.
   ============================================================ */
(function () {
  var hero = document.getElementById('hero-scroll-driver');
  if (!hero) return;
  function sync(active) { document.body.classList.toggle('hero-in-view', active); }
  function isVisible() {
    var rect = hero.getBoundingClientRect();
    return rect.bottom > 0 && rect.top < window.innerHeight;
  }
  sync(isVisible());
  var observer = new IntersectionObserver(function (entries) {
    sync(entries[0].isIntersecting);
  }, {
    threshold: 0,
    rootMargin: '0px'
  });
  observer.observe(hero);

  var how = document.getElementById('how');
  if (how) {
    function syncHow(active) { document.body.classList.toggle('how-in-view', active); }
    function isHowVisible() {
      var rect = how.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight;
    }
    syncHow(isHowVisible());
    var howObserver = new IntersectionObserver(function (entries) {
      syncHow(entries[0].isIntersecting);
    }, {
      threshold: 0,
      rootMargin: '0px'
    });
    howObserver.observe(how);
  }
})();
