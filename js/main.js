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
      { opacity: 0 }, { opacity: 1, duration: 0.4 }, 10.6)

  // ── Cards reaparecem menores nos cantos ────────────────────
    .fromTo(['.d3card--left', '.d3card--right'],
      { opacity: 0, scale: 0.68 },
      { opacity: 1, scale: 0.68, duration: 0.4 }, 10.7);
})();

/* ============================================================
   HOW IT WORKS — Card Slider com peek do próximo
   ============================================================ */
(function () {
  var section = document.getElementById('how');
  if (!section) return;

  var track   = section.querySelector('.how-cards-track');
  var cards   = Array.prototype.slice.call(section.querySelectorAll('.how-card'));
  var prevBtn = section.querySelector('.how-prev');
  var nextBtn = section.querySelector('.how-next');
  var curEl   = section.querySelector('.how-count-cur');
  var total   = cards.length;
  var current = 0;

  function updateSlider() {
    var cardW = cards[0].offsetWidth;
    var gap   = 16;
    track.style.transform = 'translateX(-' + (current * (cardW + gap)) + 'px)';
    if (curEl) curEl.textContent = String(current + 1).padStart(2, '0');
    cards.forEach(function (c, i) { c.classList.toggle('active', i === current); });
    prevBtn.disabled = (current === 0);
    nextBtn.disabled = (current === total - 1);
  }

  nextBtn.addEventListener('click', function () {
    if (current < total - 1) { current++; updateSlider(); }
  });
  prevBtn.addEventListener('click', function () {
    if (current > 0) { current--; updateSlider(); }
  });

  updateSlider();
})();
