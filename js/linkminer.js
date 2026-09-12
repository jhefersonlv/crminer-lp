(function () {
  var header = document.getElementById('site-header');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('scroll', function () {
    if (header) header.classList.toggle('scrolled', window.scrollY > 24);
  }, { passive: true });

  var menuToggle = document.querySelector('.nav-toggle');
  var mobileMenu = document.getElementById('mobile-menu');

  function setMenu(open) {
    if (!header || !menuToggle || !mobileMenu) return;
    header.classList.toggle('menu-open', open);
    document.body.classList.toggle('nav-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    mobileMenu.setAttribute('aria-hidden', String(!open));
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });
  }

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') setMenu(false);
  });

  document.addEventListener('click', function (event) {
    if (!header || !header.classList.contains('menu-open')) return;
    if (!header.contains(event.target) || event.target.closest('.mobile-menu a')) setMenu(false);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 940) setMenu(false);
  }, { passive: true });

  function normalizeClaim(value, trimEnd) {
    var normalized = value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/-{2,}/g, '-')
      .replace(/^-+/, '');
    return trimEnd ? normalized.replace(/-+$/, '') : normalized;
  }

  document.querySelectorAll('[data-claim-form]').forEach(function (form) {
    var input = form.querySelector('input[name="linkminerSlug"]');
    var field = form.querySelector('[data-claim-field]');
    var error = form.querySelector('[data-claim-error]');
    if (!input || !field || !error) return;

    function clearError() {
      field.classList.remove('is-error');
      input.removeAttribute('aria-invalid');
      error.textContent = '';
    }

    input.addEventListener('input', function () {
      var clean = normalizeClaim(input.value, false);
      if (input.value !== clean) input.value = clean;
      clearError();
    });

    form.addEventListener('submit', function (event) {
      input.value = normalizeClaim(input.value, true);
      var valid = /^[a-z0-9](?:[a-z0-9-]{1,58}[a-z0-9])$/.test(input.value);
      if (!valid) {
        event.preventDefault();
        field.classList.add('is-error');
        input.setAttribute('aria-invalid', 'true');
        error.textContent = input.value.length < 3
          ? 'Use pelo menos 3 caracteres para criar seu endereço.'
          : 'Use apenas letras, números e hífens, sem hífen no final.';
        input.focus();
        return;
      }

      clearError();
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'begin_signup', { method: 'linkminer_claim', requested_slug: input.value });
      }
    });
  });

  document.querySelectorAll('[data-linkminer-showcase]').forEach(function (showcase) {
    var stage = showcase.querySelector('.lm-showcase__stage');
    var slides = Array.prototype.slice.call(showcase.querySelectorAll('[data-showcase-slide]'));
    var dots = Array.prototype.slice.call(showcase.querySelectorAll('[data-showcase-dot]'));
    var caption = showcase.querySelector('[data-showcase-caption]');
    var previous = showcase.querySelector('[data-showcase-prev]');
    var next = showcase.querySelector('[data-showcase-next]');
    var active = 0;
    var interval;
    var startX = null;

    if (!stage || !slides.length || !caption) return;

    function positionFor(index) {
      var distance = (index - active + slides.length) % slides.length;
      if (distance === 0) return 'active';
      if (distance === 1) return 'next';
      if (distance === slides.length - 1) return 'prev';
      return 'far';
    }

    function render(index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        var isActive = slideIndex === active;
        slide.dataset.position = positionFor(slideIndex);
        slide.classList.toggle('is-active', isActive);
        slide.setAttribute('aria-hidden', String(!isActive));
      });
      dots.forEach(function (dot, dotIndex) {
        dot.setAttribute('aria-selected', String(dotIndex === active));
        dot.tabIndex = dotIndex === active ? 0 : -1;
      });
      caption.textContent = slides[active].dataset.name;
    }

    function stop() { window.clearInterval(interval); }
    function start() {
      stop();
      if (!reduceMotion) interval = window.setInterval(function () { render(active + 1); }, 3800);
    }
    function move(step) { render(active + step); start(); }

    if (previous) previous.addEventListener('click', function () { move(-1); });
    if (next) next.addEventListener('click', function () { move(1); });
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () { render(Number(dot.dataset.showcaseDot)); start(); });
    });
    stage.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    });
    stage.addEventListener('pointerdown', function (event) { startX = event.clientX; });
    stage.addEventListener('pointerup', function (event) {
      if (startX === null) return;
      var distance = event.clientX - startX;
      startX = null;
      if (Math.abs(distance) > 35) move(distance > 0 ? -1 : 1);
    });
    stage.addEventListener('pointercancel', function () { startX = null; });
    showcase.addEventListener('mouseenter', stop);
    showcase.addEventListener('mouseleave', start);
    showcase.addEventListener('focusin', stop);
    showcase.addEventListener('focusout', function (event) {
      if (!showcase.contains(event.relatedTarget)) start();
    });

    render(0);
    start();
  });

  document.querySelectorAll('video[data-loop-to]').forEach(function (video) {
    var loopTo = Number(video.dataset.loopTo);
    if (!Number.isFinite(loopTo) || loopTo <= 0) return;

    video.addEventListener('timeupdate', function () {
      if (video.currentTime < loopTo) return;
      video.currentTime = 0;
      video.play().catch(function () {});
    });
  });

  var personalizeTrigger = document.querySelector('[data-personalize-open]');
  var personalizeModal = document.getElementById('personalize-video-modal');
  var personalizeVideo = personalizeModal && personalizeModal.querySelector('video');
  var personalizeClose = personalizeModal && personalizeModal.querySelector('.lm-video-modal__close');
  var lastPersonalizeFocus = null;

  function closePersonalizeVideo() {
    if (!personalizeModal || !personalizeModal.classList.contains('is-open')) return;
    personalizeModal.classList.remove('is-open');
    personalizeModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lm-video-open');
    if (personalizeVideo) {
      personalizeVideo.pause();
      personalizeVideo.currentTime = 0;
    }
    if (lastPersonalizeFocus) lastPersonalizeFocus.focus();
  }

  function openPersonalizeVideo() {
    if (!personalizeModal || !personalizeVideo) return;
    lastPersonalizeFocus = document.activeElement;
    personalizeModal.classList.add('is-open');
    personalizeModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lm-video-open');
    personalizeVideo.currentTime = 0;
    personalizeVideo.muted = false;
    personalizeVideo.play().catch(function () {});
    if (personalizeClose) personalizeClose.focus();
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'video_play', { video_id: 'linkminer_empresarios_da_moda', video_location: 'personalize_section' });
    }
  }

  if (personalizeTrigger) personalizeTrigger.addEventListener('click', openPersonalizeVideo);
  if (personalizeModal) {
    personalizeModal.querySelectorAll('[data-personalize-close]').forEach(function (closeButton) {
      closeButton.addEventListener('click', closePersonalizeVideo);
    });
  }
  if (personalizeVideo) personalizeVideo.addEventListener('ended', closePersonalizeVideo);
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closePersonalizeVideo();
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      if (target.tagName === 'DETAILS') target.open = true;
      setMenu(false);
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      if (target.matches('input')) target.focus({ preventScroll: true });
    });
  });

  var reveal = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveal.forEach(function (element) { element.classList.add('in'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('in'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    reveal.forEach(function (element) { observer.observe(element); });
  }

  document.addEventListener('click', function (event) {
    var cta = event.target.closest('[data-cta]');
    if (!cta) return;
    var location = cta.getAttribute('data-cta');
    var label = (cta.textContent || '').trim().replace(/\s+/g, ' ');
    var type = location && location.indexOf('real-linkminer-') === 0 ? 'published_example' : 'signup';
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'cta_click', { cta_location: location, cta_label: label, cta_type: type });
      if (cta.href && cta.href.indexOf('signup') !== -1) window.gtag('event', 'generate_lead', { cta_location: location });
    }
    if (typeof window.clarity === 'function') window.clarity('event', 'cta_click');
  }, { passive: true });
})();
