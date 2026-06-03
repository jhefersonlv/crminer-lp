// ============================================
// STICKY HEADER — Aparece após 100px de scroll
// ============================================
(function () {
  var header = document.getElementById('site-header');

  function onScroll() {
    if (window.scrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ============================================
// SCROLL REVEAL — Anima elementos com classe .reveal
// ============================================
(function () {
  var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  var ticking = false;

  function reveal() {
    ticking = false;
    var vh = window.innerHeight || document.documentElement.clientHeight;

    for (var i = els.length - 1; i >= 0; i--) {
      var el = els[i];
      var top = el.getBoundingClientRect().top;

      if (top < vh * 0.9) {
        el.classList.add('in');
        els.splice(i, 1);
      }
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(reveal);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  window.addEventListener('load', reveal);
  reveal();

  // Safety net: nunca deixa conteúdo escondido
  setTimeout(function () {
    els.forEach(function (el) {
      el.classList.add('in');
    });
  }, 2500);
})();

// ============================================
// DOBRA 3 — Scroll: título some, cards sobem
// ============================================
(function () {
  var driver  = document.getElementById('dobra3-driver');
  var titleWr = document.getElementById('dobra3-title');
  var cardsWr = document.getElementById('dobra3-cards');
  var linesEl = document.getElementById('dobra3-lines');
  if (!driver) return;

  function ease(t) { return 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3); }

  function getProgress() {
    var rect = driver.getBoundingClientRect();
    return Math.max(0, Math.min(1, -rect.top / (driver.offsetHeight - window.innerHeight)));
  }

  function update() {
    var p = getProgress();

    // Título: some entre 0 → 0.35
    var tp = Math.min(1, p / 0.35);
    if (titleWr) {
      titleWr.style.opacity   = String(1 - tp);
      titleWr.style.transform = 'translateY(' + (-tp * 28) + 'px)';
    }

    // Cards: sobem entre 0.25 → 0.75
    var cp = ease((p - 0.25) / 0.50);
    if (cardsWr) {
      cardsWr.style.transform = 'translateY(' + ((1 - cp) * 110) + '%)';
    }

    // Linhas: aparecem quando cards estão chegando
    if (linesEl) {
      var lp = Math.max(0, Math.min(1, (cp - 0.5) / 0.5));
      linesEl.style.opacity = String(lp);
    }
  }

  var raf = false;
  window.addEventListener('scroll', function () {
    if (!raf) { raf = true; requestAnimationFrame(function () { raf = false; update(); }); }
  }, { passive: true });
  update();
})();

// ============================================
// HOW IT WORKS — Card Slider com peek do próximo
// ============================================
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
