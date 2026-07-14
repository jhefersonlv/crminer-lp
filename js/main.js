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
  var mobileJourney = window.matchMedia('(max-width: 820px)');
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
   BOTÕES FLUTUANTES — visibilidade sobre o hero (FAB stories + bubble "Fale conosco")
   Liga a classe .hero-in-view no body enquanto o hero está em tela.
   O CSS esconde o contato sobre o hero em qualquer viewport e durante os stories.
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
})();

/* ============================================================
   PRICING — abre o conversacional de planos no widget lateral
   ============================================================ */
(function () {
  var pricingPlansButton = document.querySelector('[data-cta="pricing-paid"]');
  if (!pricingPlansButton) return;

  function findWidgetButton() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('button[aria-label="Abrir formulário de contato"]'));
    return buttons.find(function (button) {
      return button.getClientRects().length > 0;
    });
  }

  function findWidgetIframe() {
    return document.querySelector('iframe[data-word-forms-iframe]');
  }

  function waitForWidgetPart(getter, onReady, onTimeout) {
    var startedAt = performance.now();
    var timeout = 2500;

    function check(now) {
      var element = getter();
      if (element) {
        onReady(element);
        return;
      }
      if (now - startedAt > timeout) {
        if (onTimeout) onTimeout();
        return;
      }
      window.requestAnimationFrame(check);
    }

    window.requestAnimationFrame(check);
  }

  function setPlansConversation(iframe, url) {
    if (!iframe || iframe.src === url) return;
    iframe.src = url;
  }

  pricingPlansButton.addEventListener('click', function (event) {
    var plansConversationUrl = pricingPlansButton.href;
    var iframe = findWidgetIframe();
    event.preventDefault();

    if (iframe) {
      var visibleWidgetButton = findWidgetButton();
      if (visibleWidgetButton) visibleWidgetButton.click();
      setPlansConversation(iframe, plansConversationUrl);
      return;
    }

    waitForWidgetPart(findWidgetButton, function (widgetButton) {
      widgetButton.click();
      waitForWidgetPart(findWidgetIframe, function (nextIframe) {
        setPlansConversation(nextIframe, plansConversationUrl);
      }, function () {
        window.open(plansConversationUrl, '_blank', 'noopener');
      });
    }, function () {
      window.open(plansConversationUrl, '_blank', 'noopener');
    });
  });
})();

/* ============================================================
   CTA BAND — picareta pixel art acompanha o ponteiro
   ============================================================ */
(function () {
  var section = document.querySelector('.cta-band');
  if (!section) return;

  var cursor = section.querySelector('.mining-cursor');
  var particles = cursor && cursor.querySelector('.mining-particles');
  var goldButton = section.querySelector('[data-cta="dobra3-reframe"]');
  var desktopPointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 769px)');
  var touchPointer = window.matchMedia('(max-width: 768px) and (pointer: coarse)');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!cursor || !particles || !goldButton || reducedMotion.matches) return;

  var x = -80;
  var y = -80;
  var active = false;
  var gold = false;
  var rafId = 0;
  var cycleStart = 0;
  var lastImpactCycle = -1;
  var touchImpactTimer = 0;
  var touchCleanupTimer = 0;
  var swingDuration = 720;
  var impactPhase = 0.58;
  var stoneColors = ['#343837', '#5d6361', '#858b88', '#4a4f4d'];
  var goldColors = ['#f0b929', '#ffd34d', '#d89b0d', '#ffe17a'];
  var stoneSound = new Audio('assets/batendo-na-pedra.mp3');
  var goldSound = new Audio('assets/batendo-no-ouro.mp3');

  stoneSound.preload = 'auto';
  goldSound.preload = 'auto';
  stoneSound.volume = 0.22;
  goldSound.volume = 0.28;

  function setGold(nextGold) {
    if (gold === nextGold) return;
    gold = nextGold;
    cursor.classList.toggle('is-gold', gold);
  }

  function createParticle(index, isGold) {
    var chip = document.createElement('i');
    var directions = [
      [-17, -17], [-7, -23], [9, -20], [17, -10], [-14, -7], [12, -3]
    ];
    var direction = directions[index % directions.length];
    var palette = isGold ? goldColors : stoneColors;
    chip.className = 'mining-particle';
    chip.style.setProperty('--chip-x', direction[0] + 'px');
    chip.style.setProperty('--chip-y', direction[1] + 'px');
    chip.style.setProperty('--chip-rotate', ((index % 2 ? 1 : -1) * (45 + index * 15)) + 'deg');
    chip.style.setProperty('--particle-color', palette[index % palette.length]);
    chip.style.setProperty('--particle-size', (index % 3 === 0 ? 5 : 3) + 'px');
    particles.appendChild(chip);
    chip.addEventListener('animationend', function () { chip.remove(); }, { once: true });
  }

  function playImpactSound(isGold) {
    var sound = isGold ? goldSound : stoneSound;
    sound.currentTime = 0;
    sound.play().catch(function () {});
  }

  function impact() {
    var count = gold ? 5 : 4;
    for (var i = 0; i < count; i += 1) createParticle(i, gold);
    playImpactSound(gold);

    if (gold) {
      var spark = document.createElement('i');
      spark.className = 'mining-spark';
      particles.appendChild(spark);
      spark.addEventListener('animationend', function () { spark.remove(); }, { once: true });

      goldButton.classList.remove('is-mined');
      void goldButton.offsetWidth;
      goldButton.classList.add('is-mined');
    }
  }

  function frame(now) {
    cursor.style.setProperty('--cursor-x', (x - 11) + 'px');
    cursor.style.setProperty('--cursor-y', (y - 56) + 'px');

    if (active) {
      var elapsed = now - cycleStart;
      var cycle = Math.floor(elapsed / swingDuration);
      var phase = (elapsed % swingDuration) / swingDuration;
      if (phase >= impactPhase && cycle !== lastImpactCycle) {
        lastImpactCycle = cycle;
        impact();
      }
      rafId = window.requestAnimationFrame(frame);
    }
  }

  function setupDesktopMining() {
    if (!desktopPointer.matches) return;
    section.classList.add('is-mining-enabled');

    section.addEventListener('pointerenter', function (event) {
      if (event.pointerType === 'touch') return;
      active = true;
      x = event.clientX;
      y = event.clientY;
      cycleStart = performance.now();
      lastImpactCycle = -1;
      setGold(goldButton.contains(event.target));
      cursor.classList.add('is-visible');
      if (!rafId) rafId = window.requestAnimationFrame(frame);
    });

    section.addEventListener('pointermove', function (event) {
      if (!active || event.pointerType === 'touch') return;
      x = event.clientX;
      y = event.clientY;
      setGold(goldButton.contains(event.target));
    }, { passive: true });

    section.addEventListener('pointerleave', function () {
      active = false;
      gold = false;
      cursor.classList.remove('is-visible', 'is-gold');
      goldButton.classList.remove('is-mined');
      if (rafId) window.cancelAnimationFrame(rafId);
      rafId = 0;
    });
  }

  function setupTouchMining() {
    if (!touchPointer.matches) return;

    section.addEventListener('pointerdown', function (event) {
      if (event.pointerType !== 'touch') return;

      window.clearTimeout(touchImpactTimer);
      window.clearTimeout(touchCleanupTimer);
      cursor.classList.remove('is-touch-impact', 'is-visible');
      goldButton.classList.remove('is-mined');

      x = Math.max(34, Math.min(window.innerWidth - 34, event.clientX));
      y = Math.max(62, Math.min(window.innerHeight - 24, event.clientY));
      cursor.style.setProperty('--cursor-x', (x - 11) + 'px');
      cursor.style.setProperty('--cursor-y', (y - 56) + 'px');
      setGold(goldButton.contains(event.target));

      // Reinicia a animação a cada novo toque, inclusive em toques consecutivos.
      void cursor.offsetWidth;
      cursor.classList.add('is-touch-impact');

      touchImpactTimer = window.setTimeout(function () {
        impact();
      }, swingDuration * impactPhase);

      touchCleanupTimer = window.setTimeout(function () {
        gold = false;
        cursor.classList.remove('is-touch-impact', 'is-gold');
        goldButton.classList.remove('is-mined');
      }, swingDuration + 160);
    }, { passive: true });
  }

  setupDesktopMining();
  setupTouchMining();
})();

/* Abas de preços no mobile; comparação lado a lado no desktop. */
(function () {
  var pricingTabs = Array.prototype.slice.call(document.querySelectorAll('[data-pricing-tab]'));
  var pricingPanels = Array.prototype.slice.call(document.querySelectorAll('[data-pricing-panel]'));
  var mobilePricing = window.matchMedia('(max-width: 768px)');
  var activePlan = 'free';
  if (!pricingTabs.length || !pricingPanels.length) return;

  function activatePricing(plan, focusTab) {
    activePlan = plan;

    pricingTabs.forEach(function (tab) {
      var active = tab.getAttribute('data-pricing-tab') === plan;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.setAttribute('tabindex', active ? '0' : '-1');
      if (active && focusTab) tab.focus({ preventScroll: true });
    });

    pricingPanels.forEach(function (panel) {
      var active = panel.getAttribute('data-pricing-panel') === plan;
      panel.classList.toggle('is-mobile-active', active);
      panel.classList.add('in');
      if (mobilePricing.matches) panel.setAttribute('aria-hidden', active ? 'false' : 'true');
      else panel.removeAttribute('aria-hidden');
    });
  }

  pricingTabs.forEach(function (tab, index) {
    tab.addEventListener('click', function () {
      activatePricing(tab.getAttribute('data-pricing-tab'), false);
    });

    tab.addEventListener('keydown', function (event) {
      var nextIndex = index;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % pricingTabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + pricingTabs.length) % pricingTabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else if (event.key === 'End') nextIndex = pricingTabs.length - 1;
      else return;

      event.preventDefault();
      activatePricing(pricingTabs[nextIndex].getAttribute('data-pricing-tab'), true);
    });
  });

  window.requestAnimationFrame(function () { activatePricing('free', false); });
  window.addEventListener('pageshow', function () { activatePricing('free', false); });
  if (typeof mobilePricing.addEventListener === 'function') {
    mobilePricing.addEventListener('change', function () {
      activatePricing(activePlan, false);
    });
  }
})();
