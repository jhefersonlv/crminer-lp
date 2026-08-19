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

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      var target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
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
