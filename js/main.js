/* ============================================================
   INIT — Lenis smooth scroll + GSAP/ScrollTrigger
   (var lenis é global — hero.js também usa)
   ============================================================ */
var lenis = new Lenis({ duration: 1.2, smoothTouch: false });
gsap.registerPlugin(ScrollTrigger, Draggable);
gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);
lenis.on('scroll', ScrollTrigger.update);

/* ============================================================
   STICKY HEADER — aparece após 100px de scroll
   ============================================================ */
(function () {
  var header = document.getElementById('site-header');
  if (!header) return;
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 100); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
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

/* ── Benefits Dock — efeito macOS ── */
(function () {
  var dock = document.querySelector('.benefits');
  if (!dock) return;

  var items    = Array.from(dock.querySelectorAll('.benefit'));
  var icEls    = items.map(function (b) { return b.querySelector('.ic'); });
  var first    = items[0];
  var min      = 60;   /* item width (48px ic + 12px padding) */
  var max      = 100;  /* max scale height */
  var bound    = min * Math.PI;

  gsap.set(icEls, { transformOrigin: '50% 120%' });

  dock.addEventListener('mousemove', function (e) {
    var offset = dock.getBoundingClientRect().left + first.offsetLeft;
    update(e.clientX - offset);
  });

  dock.addEventListener('mouseleave', function () {
    gsap.to(items,  { duration: 0.3, x: 0, ease: 'power2.out' });
    gsap.to(icEls,  { duration: 0.3, scale: 1, ease: 'power2.out' });
  });

  function update(pointer) {
    items.forEach(function (item, i) {
      var distance = (i * min + min / 2) - pointer;
      var x = 0, scale = 1;
      if (-bound < distance && distance < bound) {
        var rad = distance / min * 0.5;
        scale = 1 + (max / min - 1) * Math.cos(rad);
        x     = 2 * (max - min) * Math.sin(rad);
      } else {
        x = (-bound < distance ? 2 : -2) * (max - min);
      }
      gsap.to(item,       { duration: 0.3, x: x,     ease: 'power2.out' });
      gsap.to(icEls[i],   { duration: 0.3, scale: scale, ease: 'power2.out' });
    });
  }
})();

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
      { opacity: 0, y: -28, ease: 'none', duration: 2.2 }, 0)
    .fromTo('.d3card--left',
      { opacity: 0, x: -70 },
      { opacity: 1, x: 0, ease: 'power2.out', duration: 4.3 }, 1.2)
    .fromTo('.d3card--right',
      { opacity: 0, x: 70 },
      { opacity: 1, x: 0, ease: 'power2.out', duration: 4.3 }, 1.2)

  // ── Cards somem ────────────────────────────────────────────
  .to(['.d3card--left', '.d3card--right'],
    { opacity: 0, duration: 0.7 }, 5.5)

  // ── Textos da Fase 2 ───────────────────────────────────────
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
      { backgroundColor: 'rgba(255,200,0,0.12)', borderColor: 'rgba(255,200,0,0.25)', boxShadow: 'none' },
      { backgroundColor: '#FFC800', borderColor: 'rgba(255,200,0,0.60)',
        boxShadow: '0 0 0 6px rgba(255,200,0,0.12), 0 0 18px rgba(255,200,0,0.55)',
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
   DOBRA 4 — SCROLL-DRIVEN PIN "CADA SINAL SE TORNA UM LEAD"
   Inspirado na referência GSAP: pin + scrub + lista progressiva
   ============================================================ */
(function () {
  var section    = document.getElementById('how');
  if (!section) return;

  var listItems  = gsap.utils.toArray('.how-list-item',  section);
  var slides     = gsap.utils.toArray('.how-slide',      section);
  var descs      = gsap.utils.toArray('.how-desc-item',  section);
  var fill       = section.querySelector('.how-fill');

  if (!listItems.length || !slides.length) return;

  var total       = listItems.length;
  var GOLD        = '#ffe450';
  var MUTED       = 'rgba(182,186,198,0.28)';

  var mm = gsap.matchMedia();

  // Desktop (min-width: 769px): Scroll-driven pin layout
  mm.add("(min-width: 769px)", function () {
    // Reset any layout props from mobile
    gsap.set(listItems, { clearProps: "all" });
    gsap.set(slides, { clearProps: "all" });
    gsap.set(descs, { clearProps: "all" });
    gsap.set(fill, { clearProps: "all" });

    // Initial state
    gsap.set(fill, { scaleY: 1 / total, transformOrigin: 'top left' });
    gsap.set(slides, { autoAlpha: 0, scale: 1.04 });
    gsap.set(descs,  { autoAlpha: 0, y: 8 });

    gsap.set(slides[0], { autoAlpha: 1, scale: 1 });
    gsap.set(descs[0],  { autoAlpha: 1, y: 0 });

    gsap.set(listItems, { color: MUTED });
    gsap.set(listItems[0], { color: GOLD });

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start:   'top top',
        end:     '+=' + (total * 90) + '%', /* 90% viewport per slide */
        pin:     true,
        scrub:   1,
        anticipatePin: 1
      }
    });

    // Fill line grows
    tl.to(fill, {
      scaleY: 1,
      ease: 'none',
      duration: total - 1
    }, 0);

    // Transitions
    for (var i = 1; i < total; i++) {
      var prev      = listItems[i - 1];
      var curr      = listItems[i];
      var prevSlide = slides[i - 1];
      var currSlide = slides[i];
      var prevDesc  = descs[i - 1];
      var currDesc  = descs[i];

      var startTime = i - 0.5;

      tl.to(prev, { color: MUTED, duration: 0.3 }, startTime)
        .to(curr, { color: GOLD, duration: 0.3 }, startTime)
        .to(prevSlide, { autoAlpha: 0, scale: 1.04, duration: 0.3 }, startTime)
        .fromTo(currSlide, { autoAlpha: 0, scale: 1.04 }, { autoAlpha: 1, scale: 1, duration: 0.3 }, startTime)
        .to(prevDesc,  { autoAlpha: 0, y: -8, duration: 0.3 }, startTime)
        .fromTo(currDesc,  { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.3 }, startTime);
    }

    // Add brief pause at the end
    tl.to({}, { duration: 0.5 });

    return function() {
      // Cleanup desktop
    };
  });

  // Mobile (max-width: 768px): Interactive tabs + auto rotation
  mm.add("(max-width: 768px)", function () {
    var activeIdx = 0;
    var autoTimer = null;

    // Reset styles
    gsap.set(listItems, { clearProps: "all" });
    gsap.set(slides, { clearProps: "all" });
    gsap.set(descs, { clearProps: "all" });
    gsap.set(fill, { clearProps: "all" });

    function updateTabs(index, animate) {
      activeIdx = index;

      listItems.forEach(function (item, idx) {
        gsap.to(item, {
          color: idx === index ? GOLD : MUTED,
          duration: animate ? 0.3 : 0
        });
      });

      gsap.to(fill, {
        scaleY: (index + 1) / total,
        transformOrigin: 'top left',
        duration: animate ? 0.3 : 0
      });

      slides.forEach(function (slide, idx) {
        if (idx === index) {
          gsap.fromTo(slide,
            { autoAlpha: 0, scale: 1.04 },
            { autoAlpha: 1, scale: 1, duration: animate ? 0.4 : 0 }
          );
        } else {
          gsap.to(slide, {
            autoAlpha: 0,
            scale: 1.04,
            duration: animate ? 0.4 : 0
          });
        }
      });

      descs.forEach(function (desc, idx) {
        if (idx === index) {
          gsap.fromTo(desc,
            { autoAlpha: 0, y: 8 },
            { autoAlpha: 1, y: 0, duration: animate ? 0.3 : 0 }
          );
        } else {
          gsap.to(desc, {
            autoAlpha: 0,
            y: -8,
            duration: animate ? 0.3 : 0
          });
        }
      });
    }

    // Init state
    updateTabs(0, false);

    // Setup tap/click actions
    listItems.forEach(function (item, idx) {
      item.style.cursor = 'pointer';
      item.onclick = function () {
        stopAuto();
        updateTabs(idx, true);
      };
    });

    function startAuto() {
      autoTimer = setInterval(function () {
        var next = (activeIdx + 1) % total;
        updateTabs(next, true);
      }, 5000);
    }

    function stopAuto() {
      if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
      }
    }

    startAuto();

    return function () {
      stopAuto();
      listItems.forEach(function (item) {
        item.style.cursor = '';
        item.onclick = null;
      });
    };
  });
})();


