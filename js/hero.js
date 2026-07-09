/* ============================================================
   HERO — Light Craft static entrance
   ============================================================ */
(function () {
  'use strict';

  var driver = document.getElementById('hero-scroll-driver');
  if (!driver || typeof gsap === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var content = driver.querySelector('.hero-content');
  var photo = driver.querySelector('.hero-bg');

  if (reduceMotion) {
    gsap.set([content, photo], { clearProps: 'all', opacity: 1 });
    return;
  }

  gsap.timeline({ defaults: { ease: 'power2.out' } })
    .fromTo(content, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, 0.1)
    .fromTo(photo, { scale: 1.03, opacity: 0.88 }, { scale: 1, opacity: 1, duration: 0.9 }, 0.2);
})();
