/* ============================================================
   HERO — Light Craft mockup carousel
   ============================================================ */
(function () {
  'use strict';

  var driver = document.getElementById('hero-scroll-driver');
  if (!driver || typeof gsap === 'undefined') return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobileQuery = window.matchMedia('(max-width: 900px)');
  var sticky = document.getElementById('hero-sticky');
  var content = driver.querySelector('.hero-content');
  var mockups = Array.prototype.slice.call(driver.querySelectorAll('.hero-mockup'));
  var mockupShell = driver.querySelector('.hero-mockups');
  var activeIndex = 0;
  var autoplayTimer = null;
  var colors = [
    { r: 73,  g: 134, b: 255 }, // mock01: azulado
    { r: 18,  g: 20,  b: 23  }, // mock02: preto/grafite
    { r: 157, g: 92,  b: 46  }, // mock03: amarronzado
    { r: 143, g: 68,  b: 216 }  // mock04: roxo
  ];
  var mobileStaticColor = { r: 18, g: 20, b: 23 };

  if (!sticky || !mockups.length) return;

  mockups.forEach(function (mockup) {
    var img = new Image();
    img.src = mockup.getAttribute('src');
  });

  function applyRoles(index) {
    var center = index;
    var left = (index + 3) % mockups.length;
    var right = (index + 1) % mockups.length;
    var back = (index + 2) % mockups.length;

    mockups.forEach(function (mockup, i) {
      mockup.classList.toggle('is-center', i === center);
      mockup.classList.toggle('is-left', i === left);
      mockup.classList.toggle('is-right', i === right);
      mockup.classList.toggle('is-back', i === back);
    });
  }

  function applyColor(index, immediate) {
    var color = colors[index] || colors[0];
    var vars = {
      '--hero-glow-r': color.r,
      '--hero-glow-g': color.g,
      '--hero-glow-b': color.b
    };

    if (immediate || reduceMotion) {
      gsap.set(sticky, vars);
      return;
    }

    gsap.to(sticky, {
      duration: 0.65,
      ease: 'power2.inOut',
      '--hero-glow-r': color.r,
      '--hero-glow-g': color.g,
      '--hero-glow-b': color.b
    });
  }

  function applyStaticMobileColor() {
    gsap.set(sticky, {
      '--hero-glow-r': mobileStaticColor.r,
      '--hero-glow-g': mobileStaticColor.g,
      '--hero-glow-b': mobileStaticColor.b
    });
  }

  function goNext() {
    activeIndex = (activeIndex + 1) % mockups.length;
    applyRoles(activeIndex);
    applyColor(activeIndex, false);
  }

  function startAutoplay() {
    if (reduceMotion || mobileQuery.matches || autoplayTimer) return;
    autoplayTimer = window.setInterval(goNext, 3200);
  }

  function stopAutoplay() {
    if (!autoplayTimer) return;
    window.clearInterval(autoplayTimer);
    autoplayTimer = null;
  }

  function syncMode() {
    if (mobileQuery.matches) {
      stopAutoplay();
      activeIndex = 0;
      applyRoles(0);
      applyStaticMobileColor();
      return;
    }

    startAutoplay();
  }

  if (reduceMotion) {
    applyRoles(0);
    applyColor(0, true);
    gsap.set([content, mockupShell], { clearProps: 'all', opacity: 1 });
    return;
  }

  applyRoles(0);
  if (mobileQuery.matches) {
    applyStaticMobileColor();
  } else {
    applyColor(0, true);
  }

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', syncMode);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(syncMode);
  }

  gsap.timeline({ defaults: { ease: 'power2.out' } })
    .fromTo(content, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, 0.1)
    .fromTo(mockupShell, { scale: 1.03, opacity: 0.88 }, { scale: 1, opacity: 1, duration: 0.9 }, 0.2)
    .add(syncMode, 0.9);
})();
