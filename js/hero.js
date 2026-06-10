/* ============================================================
   HERO — Animação scroll-driven (GSAP + ScrollTrigger scrub)
   ============================================================ */
(function () {
  'use strict';

  var driver       = document.getElementById('hero-scroll-driver');
  if (!driver) return;

  var isMobile     = window.innerWidth < 768;

  // Mobile: hero estático — sem animação scroll-driven (cards/overlay/finale ficam ocultos via CSS)
  if (isMobile) return;

  var content      = driver.querySelector('.hero-content');
  var cards        = gsap.utils.toArray('#hero-sticky .hero-card');
  var finaleEl     = driver.querySelector('.hero-finale');
  var finLine1     = driver.querySelector('.finale-line-1');
  var finLine2     = driver.querySelector('.finale-line-2');
  var finScrollCta = driver.querySelector('.finale-scroll-cta');
  var mobileOverlay = driver.querySelector('.hero-mobile-overlay');
  var h1           = content.querySelector('h1');
  var lead         = content.querySelector('.hc-lead');

  var SCROLL_END = 5000;

  /* ── Estado inicial ── */
  if (isMobile) {
    gsap.set(cards, { x: 0, y: 24, opacity: 0 });
    if (mobileOverlay) gsap.set(mobileOverlay, { opacity: 0 });
  } else {
    gsap.set(cards, { x: 50, opacity: 0 });
  }
  gsap.set(finLine1, { opacity: 0 });
  gsap.set(finLine2, { opacity: 0, position: 'absolute' });
  gsap.set(finScrollCta, { opacity: 0 });

  h1.style.transition   = 'none';
  lead.style.transition = 'none';

  /* ── Layout esquerdo ── */
  ScrollTrigger.create({
    trigger: driver,
    start: 'top+=8% top',
    onEnter:     function () { content.classList.add('anim-active'); },
    onLeaveBack: function () { content.classList.remove('anim-active'); }
  });

  /* ── Finale overlay ── */
  ScrollTrigger.create({
    trigger: driver,
    start: 'top+=' + Math.round(SCROLL_END * 0.60) + 'px top',
    onEnter:     function () { finaleEl.classList.add('visible'); },
    onLeaveBack: function () { finaleEl.classList.remove('visible'); }
  });


  /* ── Timeline principal scrubada ── */
  var tl = gsap.timeline({
    scrollTrigger: {
      trigger: driver,
      start: 'top top',
      end:   '+=' + SCROLL_END,
      scrub: 1.4
    }
  });

  /* Phase 1 — conteúdo desloca para esquerda (desktop only) */
  tl
    .fromTo(content,
      { x: 0 },
      { x: isMobile ? 0 : '-5vw', ease: 'power2.out', duration: 3 }, 1.2)
    .fromTo(h1,
      { scale: 1 },
      { scale: isMobile ? 1 : 0.68, transformOrigin: 'left top', ease: 'power2.out', duration: 3 }, 1.2)
    .fromTo(lead,
      { scale: 1 },
      { scale: isMobile ? 1 : 0.85, transformOrigin: 'left top', ease: 'power2.out', duration: 3 }, 1.2);

  /* Cards entram da direita (desktop) */
  if (!isMobile) {
    tl
      .fromTo(cards[0], { x: 50, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', duration: 0.8 }, 1.5)
      .fromTo(cards[1], { x: 50, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', duration: 0.8 }, 2.0)
      .fromTo(cards[2], { x: 50, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', duration: 0.8 }, 2.5)
      .fromTo(cards[3], { x: 50, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', duration: 0.8 }, 3.0)
      .fromTo(cards[4], { x: 50, opacity: 0 }, { x: 0, opacity: 1, ease: 'power2.out', duration: 0.8 }, 3.5);
  } else {
    /* Mobile: overlay escurece o hero e os cards sobem ao centro, um a um.
       Início logo no primeiro scroll, espalhados até pouco antes do fade (4.4). */
    if (mobileOverlay) {
      tl.fromTo(mobileOverlay, { opacity: 0 }, { opacity: 1, ease: 'power2.out', duration: 0.6 }, 0.1);
    }
    tl
      .fromTo(cards[0], { x: 0, y: 24, opacity: 0 }, { x: 0, y: 0, opacity: 1, ease: 'power2.out', duration: 0.8 }, 0.3)
      .fromTo(cards[1], { x: 0, y: 24, opacity: 0 }, { x: 0, y: 0, opacity: 1, ease: 'power2.out', duration: 0.8 }, 1.1)
      .fromTo(cards[2], { x: 0, y: 24, opacity: 0 }, { x: 0, y: 0, opacity: 1, ease: 'power2.out', duration: 0.8 }, 1.9)
      .fromTo(cards[3], { x: 0, y: 24, opacity: 0 }, { x: 0, y: 0, opacity: 1, ease: 'power2.out', duration: 0.8 }, 2.7)
      .fromTo(cards[4], { x: 0, y: 24, opacity: 0 }, { x: 0, y: 0, opacity: 1, ease: 'power2.out', duration: 0.8 }, 3.5);
  }

  /* Phase 2 — tudo some, finale entra */
  var phase2Fade = isMobile
    ? cards.concat([content]).concat(mobileOverlay ? [mobileOverlay] : [])
    : cards.concat([content]);
  tl
    .to(phase2Fade,
      { opacity: 0, ease: 'power2.in', duration: 0.6 }, 4.4)

    /* Linha 1 — entra logo após os cards saírem (sem zona morta na timeline) */
    .fromTo(finLine1, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.4 }, 5.0)
    /* Linha 1 some — linha 2 começa EXATAMENTE quando linha 1 termina (sem gap, sem sobreposição) */
    .to(finLine1,     { opacity: 0, ease: 'none', duration: 0.4 }, 6.6)
    .fromTo(finLine2, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.4 }, 7.0)

    .fromTo(finScrollCta, { opacity: 0 }, { opacity: 1, ease: 'none', duration: 0.4 }, 7.8);

  /* ── CTA → transição de página ── */
  if (finScrollCta) {
    var transEl   = document.getElementById('page-transition');
    var transPath = document.getElementById('pt-path');

    var PT_FLAT = 'M 0 100 V 100 Q 50 100 100 100 V 100 z';
    var PT_WAVE = 'M 0 100 V 50 Q 50 0 100 50 V 100 z';
    var PT_FILL = 'M 0 100 V 0 Q 50 0 100 0 V 100 z';

    finScrollCta.addEventListener('click', function () {
      var next = driver.nextElementSibling;
      if (!next) return;

      if (!transEl || !transPath) {
        if (typeof lenis !== 'undefined') lenis.scrollTo(next);
        else next.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      transEl.classList.add('active');

      gsap.timeline()
        .to(transPath, { attr: { d: PT_WAVE }, ease: 'power2.in',  duration: 0.40 })
        .to(transPath, { attr: { d: PT_FILL }, ease: 'power2.out', duration: 0.30,
          onComplete: function () {
            if (typeof lenis !== 'undefined') lenis.scrollTo(next, { immediate: true });
            else window.scrollTo(0, next.offsetTop);
          }
        })
        .to(transPath, { attr: { d: PT_WAVE }, ease: 'power2.in',  duration: 0.35, delay: 0.08 })
        .to(transPath, { attr: { d: PT_FLAT }, ease: 'power2.out', duration: 0.45,
          onComplete: function () { transEl.classList.remove('active'); }
        });
    });
  }

  /* ── Magnetic + Drift: logo silhouette ── */
  var logo = driver.querySelector('.hero-logo-bg img');
  if (logo) {
    var mouseHeroX = window.innerWidth  / 2;
    var mouseHeroY = window.innerHeight / 2;

    gsap.ticker.add(function (time) {
      var driftY     = Math.sin(time * 0.35) * 9;
      var driftScale = 1 + Math.sin(time * 0.35) * 0.013;
      var magnetX    = (mouseHeroX - window.innerWidth  / 2) * 0.05;
      var magnetY    = (mouseHeroY - window.innerHeight / 2) * 0.04;
      gsap.set(logo, { x: magnetX, y: driftY + magnetY, scale: driftScale });
    });

    driver.addEventListener('mousemove', function (e) {
      mouseHeroX = e.clientX;
      mouseHeroY = e.clientY;
    });

    driver.addEventListener('mouseleave', function () {
      mouseHeroX = window.innerWidth  / 2;
      mouseHeroY = window.innerHeight / 2;
    });
  }

})();
