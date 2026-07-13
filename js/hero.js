/* ============================================================
   HERO — centered copy entrance
   ============================================================ */
(function () {
  'use strict';

  var driver = document.getElementById('hero-scroll-driver');
  if (!driver || typeof gsap === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var content = driver.querySelector('.hero-content');
  if (!content) return;

  if (reduceMotion) {
    gsap.set(content, { clearProps: 'all', opacity: 1 });
    return;
  }

  gsap.timeline({ defaults: { ease: 'power2.out' } })
    .fromTo(content, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, 0.1);
})();

/* ============================================================
   HERO MOCKUPS — smooth drop-in when the preview enters
   ============================================================ */
(function () {
  'use strict';

  var stage = document.querySelector('[data-hero-mockup-stage]');
  if (!stage || typeof gsap === 'undefined') return;

  var cards = gsap.utils.toArray('[data-hero-mockup-card]', stage);
  var main = stage.querySelector('.hero-mockup-main');
  if (!cards.length || !main) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getDropDistance(card) {
    var mainHeight = main.getBoundingClientRect().height;
    var cardHeight = card.getBoundingClientRect().height;
    return Math.max(0, mainHeight - cardHeight);
  }

  if (reduceMotion || typeof ScrollTrigger === 'undefined') {
    cards.forEach(function (card) {
      gsap.set(card, { y: getDropDistance(card), opacity: 1 });
    });
    return;
  }

  cards.forEach(function (card, index) {
    gsap.fromTo(card,
      { y: 0, opacity: 0.94 },
      {
        y: function () { return getDropDistance(card); },
        opacity: 1,
        duration: 1.18,
        delay: index * 0.08,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: stage,
          start: 'top 78%',
          once: true,
          invalidateOnRefresh: true
        }
      }
    );
  });
})();
