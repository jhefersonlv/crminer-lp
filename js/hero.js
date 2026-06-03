/* ============================================================
   HERO — Animação com GSAP + ScrollTrigger
   Fase 1: texto desliza + cards entram (dispara no primeiro scroll)
   Fase 2: finale overlay "É captura." (dispara com scroll adicional)
   ============================================================ */
(function () {
  'use strict';

  var driver      = document.getElementById('hero-scroll-driver');
  if (!driver) return;

  var content     = driver.querySelector('.hero-content');
  var cards       = gsap.utils.toArray('#hero-sticky .hero-card');
  var finaleEl    = driver.querySelector('.hero-finale');
  var finLine1    = driver.querySelector('.finale-line-1');
  var finLine2    = driver.querySelector('.finale-line-2');
  var finScrollCta = driver.querySelector('.finale-scroll-cta');

  var animTriggered = false;
  var finaleDone    = false;

  /* ── TIMELINE FASE 1: texto desliza + 5 cards entram ── */
  var hero1 = gsap.timeline({ paused: true });

  hero1
    .to(content, {
      x: '-5vw',
      duration: 0.6,
      ease: 'power2.out',
      onStart: function () { content.classList.add('anim-active'); }
    }, 0)
    .fromTo(cards[0], { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, 0.5)
    .fromTo(cards[1], { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, 1.0)
    .fromTo(cards[2], { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, 1.5)
    .fromTo(cards[3], { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, 2.0)
    .fromTo(cards[4], { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, 2.5);

  /* ── TIMELINE FASE 2: finale overlay ── */
  var heroFinale = gsap.timeline({
    paused: true,
    onComplete: function () {
      if (typeof lenis !== 'undefined') lenis.start();
    }
  });

  heroFinale
    // Overlay escurece + cards somem
    .call(function () { finaleEl.classList.add('visible'); })
    .to(cards, { opacity: 0, duration: 0.3 }, 0)

    // Linha 1: "O problema não é tráfego."
    .call(function () { finLine1.classList.add('show'); }, null, 0.3)
    .call(function () { finLine1.classList.add('hide'); }, null, 1.3)
    .call(function () {
      finLine1.style.display = 'none';
      // Linha 2: "É captura."
      finLine2.classList.add('show');
    }, null, 1.65)

    // CTA para continuar
    .call(function () {
      if (finScrollCta) finScrollCta.classList.add('show');
    }, null, 2.3);

  /* ── SCROLL TRIGGERS ── */

  // Fase 1: qualquer scroll > 4% dispara uma vez
  ScrollTrigger.create({
    trigger: driver,
    start: 'top+=4% top',
    onEnter: function () {
      if (!animTriggered) {
        animTriggered = true;

        // Trava scroll durante toda a animação da fase 1
        if (typeof lenis !== 'undefined') lenis.stop();

        hero1.play();

        // Quando fase 1 termina: mantém scroll TRAVADO e espera intenção do usuário
        hero1.eventCallback('onComplete', function () {

          function onScrollIntent(e) {
            // Detecta scroll para baixo (wheel ou touch)
            if (e.type === 'wheel' && e.deltaY <= 0) return;
            if (finaleDone) return;

            window.removeEventListener('wheel',      onScrollIntent);
            window.removeEventListener('touchstart', onScrollIntent);

            finaleDone = true;

            if (typeof lenis === 'undefined') {
              heroFinale.play();
              return;
            }

            // Posição exata da Fase 2 — 62% do driver (hero ainda visível)
            var phase2Y = driver.offsetTop +
              Math.round((driver.offsetHeight - window.innerHeight) * 0.62);

            // Desbloqueia → move para a posição certa → bloqueia → toca finale
            lenis.start();
            lenis.scrollTo(phase2Y, {
              duration: 0.5,
              lock: true,
              onComplete: function () {
                lenis.stop();
                heroFinale.play();
              }
            });
          }

          window.addEventListener('wheel',      onScrollIntent, { passive: true });
          window.addEventListener('touchstart', onScrollIntent, { passive: true });
        });
      }
    }
  });

  /* ── CTA DO FINALE → transição branca de tela inteira para Dobra 2 ── */
  if (finScrollCta) {
    var transEl   = document.getElementById('page-transition');
    var transPath = document.getElementById('pt-path');

    var PT_FLAT = 'M 0 100 V 100 Q 50 100 100 100 V 100 z';
    var PT_WAVE = 'M 0 100 V 50 Q 50 0 100 50 V 100 z';
    var PT_FILL = 'M 0 100 V 0 Q 50 0 100 0 V 100 z';

    finScrollCta.addEventListener('click', function () {
      var next = driver.nextElementSibling;
      if (!next) return;

      // Fallback sem overlay
      if (!transEl || !transPath) {
        if (typeof lenis !== 'undefined') lenis.scrollTo(next);
        else next.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      // Bloqueia interação e scroll
      transEl.classList.add('active');
      if (typeof lenis !== 'undefined') lenis.stop();

      gsap.timeline()
        // 1. Onda branca sobe cobrindo a tela
        .to(transPath, { attr: { d: PT_WAVE }, ease: 'power2.in',  duration: 0.40 })
        .to(transPath, { attr: { d: PT_FILL }, ease: 'power2.out', duration: 0.30,
          onComplete: function () {
            // 2. Scroll instantâneo para Dobra 2 (invisível — tela branca)
            if (typeof lenis !== 'undefined') {
              lenis.start();
              lenis.scrollTo(next, { immediate: true });
            } else {
              window.scrollTo(0, next.offsetTop);
            }
          }
        })
        // 3. Breve pausa → onda desce revelando Dobra 2
        .to(transPath, { attr: { d: PT_WAVE }, ease: 'power2.in',  duration: 0.35, delay: 0.08 })
        .to(transPath, { attr: { d: PT_FLAT }, ease: 'power2.out', duration: 0.45,
          onComplete: function () {
            transEl.classList.remove('active');
          }
        });
    });
  }

  /* ── MAGNETIC + DRIFT: logo silhouette ── */
  var logo = driver.querySelector('.hero-logo-bg img');
  if (logo) {
    var mouseHeroX = window.innerWidth  / 2;
    var mouseHeroY = window.innerHeight / 2;

    // Drift suave via ticker (substitui CSS animation removida)
    gsap.ticker.add(function (time) {
      var driftY     = Math.sin(time * 0.35) * 9;
      var driftScale = 1 + Math.sin(time * 0.35) * 0.013;
      var magnetX    = (mouseHeroX - window.innerWidth  / 2) * 0.05;
      var magnetY    = (mouseHeroY - window.innerHeight / 2) * 0.04;
      gsap.set(logo, { x: magnetX, y: driftY + magnetY, scale: driftScale });
    });

    // Captura posição do mouse no hero
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
