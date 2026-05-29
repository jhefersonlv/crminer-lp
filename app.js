/* =======================================================
   CRMiner — Landing Page JS
   ======================================================= */

document.addEventListener('DOMContentLoaded', () => {
  // Register ScrollTrigger plugin
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  initCountdown();
  initReveal();
  initStagger();
  initAnimatedText();
  initWordReveal();
  initFaq();
  initHeroEntrance();       // inclui word-by-word h1
  initLeadCounter();
  initNavScroll();
  initSegmentCycling();
  initMarqueeLens();
  initStackingCards();
  initModuleTabs();
  initPainVideoBg();
  initPainCountUp();        // agora usa ScrollTrigger
  initPainFlipTouch();
  initPainFlipHint();
  initKanbanDrag();
  initWaChat();
  initCanaisLive();
  initAgendaToggle();
  initTour();
  initJornadaReveal();      // reveal dos 3 cards
  initCJPhones();           // stagger nos 3 phones CJ
  initIntegrationDraw();    // stroke-draw nos ícones de integração
});

/* ── 1. Countdown timer ── */
function initCountdown() {
  const el = document.getElementById('banner-countdown');
  if (!el) return;

  const KEY  = 'crm_banner_deadline';
  let stored = localStorage.getItem(KEY);
  if (!stored) {
    const d = new Date(Date.now() + 72 * 3600 * 1000);
    stored = d.toISOString();
    localStorage.setItem(KEY, stored);
  }
  const deadline = new Date(stored).getTime();

  const hEl = el.querySelector('[data-h]');
  const mEl = el.querySelector('[data-m]');
  const sEl = el.querySelector('[data-s]');

  function tick() {
    const diff = deadline - Date.now();
    if (diff <= 0) {
      hEl.textContent = '00';
      mEl.textContent = '00';
      sEl.textContent = '00';
      return;
    }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    hEl.textContent = String(h).padStart(2, '0');
    mEl.textContent = String(m).padStart(2, '0');
    sEl.textContent = String(s).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}

/* ── 2. Reveal on scroll ── */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

  els.forEach(el => io.observe(el));
}

/* ── 3. Stagger delays ── */
function initStagger() {
  document.querySelectorAll('[data-stagger]').forEach(wrap => {
    const gap = parseInt(wrap.dataset.stagger, 10) || 60;
    Array.from(wrap.children).forEach((child, i) => {
      child.style.setProperty('--stagger-delay', `${i * gap}ms`);
    });
  });
}

/* ── 4. Animated text (char by char) ── */
function initAnimatedText() {
  document.querySelectorAll('.animated-text').forEach(el => {
    if (el.querySelector('.char')) return; // already split
    el.setAttribute('aria-label', el.textContent);
    let charIdx = 0;

    function wrapNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent.split('').map(ch => {
          const span = document.createElement('span');
          span.className = 'char';
          span.style.setProperty('--i', charIdx++);
          span.textContent = ch;
          return span;
        });
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        const clone = node.cloneNode(false);
        Array.from(node.childNodes).forEach(child => {
          wrapNode(child).forEach(n => clone.appendChild(n));
        });
        return [clone];
      }
      return [node.cloneNode()];
    }

    const frag = document.createDocumentFragment();
    Array.from(el.childNodes).forEach(child => {
      wrapNode(child).forEach(n => frag.appendChild(n));
    });
    el.innerHTML = '';
    el.appendChild(frag);

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.25 });
    io.observe(el);
  });
}

/* ── 5. Word reveal ── */
function initWordReveal() {
  document.querySelectorAll('.word-reveal').forEach(el => {
    if (el.querySelector('.wr-word')) return;
    const words = el.textContent.split(/\s+/).filter(Boolean);
    el.innerHTML = words.map(w =>
      `<span class="wr-word">${w}</span>`
    ).join(' ');

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.wr-word').forEach((w, i) => {
            setTimeout(() => w.classList.add('wr-visible'), i * 40);
          });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
    io.observe(el);
  });
}

/* ── 6. FAQ accordion ── */
function initFaq() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}

/* ── 7. Hero entrance (GSAP) ── */
function initHeroEntrance() {
  if (typeof gsap === 'undefined') return;

  // Pre-mark hero reveal elements (GSAP handles entrance)
  document.querySelectorAll('.hero .reveal').forEach(el => {
    el.style.opacity = '1';
    el.style.transform = 'none';
    el.classList.add('in');
  });

  // ── Word-by-word split on h1 ──
  const h1 = document.querySelector('.hero-h1');
  if (h1 && !h1.querySelector('.hw')) {
    const nodes = Array.from(h1.childNodes);
    h1.innerHTML = '';
    nodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent.split(/(\s+)/).forEach(part => {
          if (!part.trim()) { h1.appendChild(document.createTextNode(part)); return; }
          const span = document.createElement('span');
          span.className = 'hw';
          span.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
          const inner = document.createElement('span');
          inner.className = 'hw-inner';
          inner.style.cssText = 'display:inline-block;';
          inner.textContent = part;
          span.appendChild(inner);
          h1.appendChild(span);
        });
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        node.textContent.trim().split(/\s+/).forEach((word, i, arr) => {
          const span = document.createElement('span');
          span.className = 'hw';
          span.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
          const em = document.createElement('em');
          em.className = node.className || 'hero-accent';
          em.style.cssText = 'display:inline-block;';
          em.textContent = word + (i < arr.length - 1 ? ' ' : '');
          span.appendChild(em);
          h1.appendChild(span);
          if (i < arr.length - 1) h1.appendChild(document.createTextNode(' '));
        });
      }
    });
  }

  const words = h1 ? h1.querySelectorAll('.hw-inner, .hw em') : [];

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl
    .from('.hero-badge', { opacity: 0, y: 16, duration: .6 })
    .from(words,         { y: '110%', opacity: 0, duration: .7, stagger: .055 }, '-=.2')
    .from('.hero-sub',   { opacity: 0, y: 20, duration: .65 }, '-=.25')
    .from('.hero-ctas',  { opacity: 0, y: 16, duration: .55 }, '-=.35')
    .from('.hero-note',  { opacity: 0, duration: .5 }, '-=.3')
    .from('.loss-ticker',{ opacity: 0, y: 12, duration: .5 }, '-=.2');

  // Parallax após timeline hero
  initHeroParallax();
}

/* ── Parallax na foto de fundo do hero ── */
function initHeroParallax() {
  // Desativado — imagem já tem o tamanho exato, sem necessidade de travel
}

/* ── 8. Live lead counter animation ── */
function initLeadCounter() {
  const el = document.getElementById('lead-count');
  if (!el) return;

  let base = 14762;
  function bump() {
    base += Math.floor(Math.random() * 3) + 1;
    el.textContent = base.toLocaleString('pt-BR');
  }
  function schedule() {
    setTimeout(() => { bump(); schedule(); }, 8000 + Math.random() * 4000);
  }
  schedule();
}

/* ── 9. Navbar opacity on scroll ── */
function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.background = '#121417';
  }, { passive: true });
}

/* ── 10. Hero segment cycling ── */
function initSegmentCycling() {
  const el = document.getElementById('hero-segment');
  if (!el) return;

  const segments = [
    'Óticas', 'Barbearias', 'Clínicas', 'Salões', 'Pet Shops',
    'Academias', 'Studios', 'Advogados', 'Dentistas', 'Contadores',
    'Fotógrafos', 'Arquitetos', 'Psicólogos', 'Autônomos'
  ];
  let current = 0;

  function next() {
    el.classList.add('is-leaving');
    setTimeout(() => {
      current = (current + 1) % segments.length;
      el.textContent = segments[current];
      el.classList.remove('is-leaving');
      el.classList.add('is-entering');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.classList.remove('is-entering');
        });
      });
    }, 220);
  }

  setInterval(next, 2200);
}

/* ── 11. Segment marquee dock-lens magnification ── */
function initMarqueeLens() {
  const container = document.querySelector('.hero-segments');
  if (!container) return;

  const RADIUS = 200;
  const MAX_SCALE = 1.45;

  container.addEventListener('mousemove', (e) => {
    const chips = container.querySelectorAll('.seg-marquee .chip');
    chips.forEach(chip => {
      const rect = chip.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top  + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist < RADIUS) {
        const t = 1 - dist / RADIUS;
        const scale = 1 + (MAX_SCALE - 1) * t * t;
        chip.style.transform = `scale(${scale.toFixed(3)})`;
        chip.style.zIndex = '10';
      } else {
        chip.style.transform = 'scale(1)';
        chip.style.zIndex = '';
      }
    });
  });

  container.addEventListener('mouseleave', () => {
    container.querySelectorAll('.seg-marquee .chip').forEach(chip => {
      chip.style.transform = 'scale(1)';
      chip.style.zIndex = '';
    });
  });
}

/* ── 11b. Pain section — black hole video background ── */
function initPainVideoBg() {
  const video = document.getElementById('pain-vbg-video');
  if (!video) return;
  video.src = 'assets/pain-bg.ts';
  video.play().catch(() => {});
}

/* ── 12. Pain count-up animation ── */
function initPainCountUp() {
  const nums = document.querySelectorAll('.pain-num[data-target]');
  if (!nums.length) return;

  const useGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';

  if (useGSAP) {
    // ── ScrollTrigger version — fires exactly when in view ──
    nums.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      const obj = { val: 0 };
      gsap.to(obj, {
        val: target,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(obj.val); },
        scrollTrigger: {
          trigger: el,
          start: 'top 78%',
          once: true,
        }
      });
    });

    // Animate the 89% anchor number with blur-to-clear reveal
    const anchor = document.querySelector('.pain-anchor-num');
    if (anchor) {
      const obj = { val: 0 };
      gsap.set(anchor, { filter: 'blur(10px)', opacity: 0 });
      gsap.to(obj, {
        val: 89,
        duration: 2.2,
        ease: 'power3.out',
        onUpdate: () => { anchor.textContent = Math.round(obj.val) + '%'; },
        scrollTrigger: { trigger: anchor, start: 'top 72%', once: true }
      });
      gsap.to(anchor, {
        filter: 'blur(0px)', opacity: 1, duration: 1.4,
        ease: 'power2.out',
        scrollTrigger: { trigger: anchor, start: 'top 72%', once: true }
      });
    }

  } else {
    // ── IntersectionObserver fallback ──
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        const duration = 1600;
        const start = performance.now();
        (function step(now) {
          const p = Math.min((now - start) / duration, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target);
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
        io.unobserve(el);
      });
    }, { threshold: 0.6 });
    nums.forEach(el => io.observe(el));
  }
}

/* ── 12c. Pain flip hint — wiggle when card reaches viewport center ── */
function initPainFlipHint() {
  const wrappers = document.querySelectorAll('.pain-card-wrap');
  if (!wrappers.length) return;

  // rootMargin crops top+bottom so observer fires only when card is near center
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      const wrap  = entry.target;
      const inner = wrap.querySelector('.pain-card-inner');
      if (!inner) return;

      // stagger each card slightly
      const delay = i * 120;
      setTimeout(() => {
        if (wrap.matches(':hover') || wrap.classList.contains('is-flipped')) return;
        inner.classList.add('hint-wiggle');
        inner.addEventListener('animationend', () => {
          inner.classList.remove('hint-wiggle');
        }, { once: true });
      }, delay + 350);

      io.unobserve(wrap);
    });
  }, { threshold: 0.65, rootMargin: '-8% 0px -8% 0px' });

  wrappers.forEach(w => io.observe(w));
}

/* ── 12b. Pain flip — touch toggle for mobile ── */
function initPainFlipTouch() {
  document.querySelectorAll('.pain-card-wrap').forEach(wrap => {
    wrap.addEventListener('click', () => {
      wrap.classList.toggle('is-flipped');
    });
  });
}

/* ── 13. Module tab switcher ── */
function initModuleTabs() {
  const tabs   = document.querySelectorAll('.mod-tab');
  const panels = document.querySelectorAll('.mod-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const idx = tab.dataset.tab;

      // update tabs
      tabs.forEach(t => {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });

      // update panels
      panels.forEach(p => {
        p.classList.toggle('is-active', p.dataset.panel === idx);
      });
    });
  });
}

/* ── 13. Sticky stacking cards ── */
function initStackingCards() {
  const cards = Array.from(document.querySelectorAll('.stack-card'));
  if (!cards.length) return;

  const stickyTop = window.innerHeight * 0.12 + 1;

  function updateCards() {
    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      // Count how many earlier cards are "buried" above (stuck at top)
      let aboveCount = 0;
      for (let j = 0; j < i; j++) {
        const prevRect = cards[j].getBoundingClientRect();
        if (prevRect.top <= stickyTop + 2) aboveCount++;
      }
      if (aboveCount > 0) {
        const scale = Math.max(0.85, 1 - aboveCount * 0.035);
        card.style.transform = `scale(${scale.toFixed(3)})`;
        card.style.boxShadow = `0 -4px 32px rgba(11,20,38,${(0.10 + aboveCount * 0.04).toFixed(2)}), 0 -1px 0 rgba(11,20,38,.05)`;
      } else {
        card.style.transform = '';
        card.style.boxShadow = '';
      }
    });
  }

  window.addEventListener('scroll', updateCards, { passive: true });
  updateCards();
}

/* ── 14. Kanban drag & drop ── */
function initKanbanDrag() {
  const board = document.querySelector('.mod-panel[data-panel="0"] .ob-crm-board');
  if (!board) return;

  let dragged = null;

  function updateColCounts() {
    board.querySelectorAll('.ob-crm-col').forEach(col => {
      const cnt = col.querySelectorAll('.ob-crm-card').length;
      const el  = col.querySelector('.ob-col-count');
      if (el) el.textContent = cnt;
    });
  }

  function makeDraggable() {
    board.querySelectorAll('.ob-crm-card:not([draggable])').forEach(card => {
      card.setAttribute('draggable', 'true');

      card.addEventListener('dragstart', e => {
        dragged = card;
        card.classList.add('crm-dragging');
        e.dataTransfer.effectAllowed = 'move';
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('crm-dragging');
        board.querySelectorAll('.ob-crm-col').forEach(c => c.classList.remove('crm-drop-over'));
        updateColCounts();
        dragged = null;
      });
    });
  }

  board.querySelectorAll('.ob-crm-col').forEach(col => {
    col.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      col.classList.add('crm-drop-over');
    });

    col.addEventListener('dragleave', e => {
      if (!col.contains(e.relatedTarget)) col.classList.remove('crm-drop-over');
    });

    col.addEventListener('drop', e => {
      e.preventDefault();
      col.classList.remove('crm-drop-over');
      if (dragged && dragged.closest('.ob-crm-col') !== col) {
        col.appendChild(dragged);
        makeDraggable();
        updateColCounts();
      }
    });
  });

  makeDraggable();
}

/* ── 15. WhatsApp chat simulation ── */
function initWaChat() {
  const input   = document.getElementById('wa-type-input');
  const sendBtn = document.getElementById('wa-send-btn');
  const chat    = document.querySelector('.mod-panel[data-panel="3"] .wa-chat');
  if (!input || !chat) return;

  const RESPONSES = [
    {
      keys: ['plano', 'preço', 'valor', 'custo', 'quanto'],
      msg:  'Temos 3 planos: Free (grátis), Pro (R$ 97/mês) e Business (R$ 197/mês). Qual perfil te descreve melhor?'
    },
    {
      keys: ['barbearia', 'salão', 'ótica', 'tica', 'loja', 'clínica', 'clinica', 'petshop', 'pet'],
      msg:  'Perfeito para isso! Em 10 minutos você já tem o QR Code na vitrine capturando leads. Quer começar?'
    },
    {
      keys: ['grátis', 'gratis', 'free', 'gratuito'],
      msg:  'O plano Free inclui 50 leads/mês e 1 QR Code dinâmico — zero cartão de crédito!'
    },
    {
      keys: ['sim', 'quero', 'vamos', 'manda', 'ok', 'bora', 'top'],
      msg:  'Ótimo! Acesse crminer.com.br e crie sua conta em 60 segundos. Precisa de mais alguma coisa?'
    },
    {
      keys: ['como', 'funciona', 'explica', 'explicar'],
      msg:  'Você imprime o QR Code e cola na vitrine. O cliente escaneia, ganha um cupom e entra no seu WhatsApp — tudo automático!'
    },
    {
      keys: ['whatsapp', 'zap', 'mensagem'],
      msg:  'Sim! O CRMiner captura o lead e dispara mensagens pelo seu próprio WhatsApp, sem robôs terceiros.'
    },
    {
      keys: ['integra', 'instagram', 'meta', 'google'],
      msg:  'Integra com Instagram, Meta Ads, Google Meu Negócio e mais 12 plataformas. Tudo centralizando no seu CRM.'
    },
  ];

  function getReply(text) {
    const lower = text.toLowerCase();
    for (const r of RESPONSES) {
      if (r.keys.some(k => lower.includes(k))) return r.msg;
    }
    return 'Entendido! Posso te ajudar com mais alguma dúvida sobre o CRMiner?';
  }

  function ts() {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  function addMsg(text, isUser) {
    const div = document.createElement('div');
    div.className = `wa-msg ${isUser ? 'wa-received' : 'wa-sent'}`;
    div.innerHTML = `<div class="wa-bubble">${text}<div class="wa-ts">${ts()}</div></div>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  function showTyping() {
    const div = document.createElement('div');
    div.className = 'wa-msg wa-sent wa-typing-indicator';
    div.innerHTML = `<div class="wa-bubble"><span></span><span></span><span></span></div>`;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
    return div;
  }

  function send() {
    const text = input.value.trim();
    if (!text) return;
    // Hide idle placeholder on first message
    const idleEl = document.getElementById('wa-idle-state');
    if (idleEl) { idleEl.style.transition = 'opacity .2s'; idleEl.style.opacity = '0'; setTimeout(() => { idleEl.style.display = 'none'; }, 200); }
    addMsg(text, true);
    input.value = '';

    const typingEl = showTyping();
    const delay = 800 + Math.random() * 600;
    setTimeout(() => {
      typingEl.remove();
      addMsg(getReply(text), false);
    }, delay);
  }

  input.addEventListener('keydown', e => { if (e.key === 'Enter') send(); });
  if (sendBtn) sendBtn.addEventListener('click', send);
}

/* ── 16. Canais live preview ── */
function initCanaisLive() {
  const nameEl   = document.getElementById('canais-biz-name');
  const colorIn  = document.getElementById('canais-color-input');
  const colorDot = document.getElementById('canais-color-dot');
  const colorHex = document.getElementById('canais-color-hex');
  const lpName   = document.getElementById('canais-lp-name');
  const lpHeader = document.getElementById('canais-lp-header');
  const lpBtn    = document.getElementById('canais-lp-btn');
  const lpGhost  = document.getElementById('canais-lp-btn2');
  const lmHeader = document.getElementById('ob-lm-header');
  const lmBiz    = document.getElementById('ob-lm-biz');

  if (!nameEl || !colorIn) return;

  nameEl.addEventListener('input', () => {
    const val = nameEl.textContent.trim();
    if (lpName)  lpName.textContent  = val || 'Seu Negócio';
    if (lmBiz)   lmBiz.textContent   = val || 'Seu Negócio';
  });

  colorIn.addEventListener('input', () => {
    const c = colorIn.value;
    if (colorDot)  colorDot.style.background  = c;
    if (colorHex)  colorHex.textContent        = c;
    if (lpHeader)  lpHeader.style.background   = c;
    if (lpBtn)     lpBtn.style.background      = c;
    if (lpGhost) {
      lpGhost.style.borderColor = c;
      lpGhost.style.color       = c;
    }
    if (lmHeader)  lmHeader.style.background   = c;
  });
}

/* ── 17. Agenda week / month toggle ── */
function initAgendaToggle() {
  const panel = document.querySelector('.mod-panel[data-panel="4"]');
  if (!panel) return;

  const btns      = panel.querySelectorAll('.ag-view-btn');
  const weekView  = panel.querySelector('.ag-week-view');
  const monthView = panel.querySelector('.ag-month-view');
  if (!btns.length || !weekView || !monthView) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;

      // update pill
      btns.forEach(b => b.classList.toggle('is-active', b === btn));

      if (view === 'week') {
        monthView.style.display = 'none';
        weekView.style.display  = '';
        weekView.classList.add('ag-entering');
        weekView.addEventListener('animationend', () => weekView.classList.remove('ag-entering'), { once: true });
      } else {
        weekView.style.display  = 'none';
        monthView.style.display = '';
        monthView.classList.add('ag-entering');
        monthView.addEventListener('animationend', () => monthView.classList.remove('ag-entering'), { once: true });
      }
    });
  });
}

/* ── 18. Interactive onboarding tour ── */
function initTour() {
  const overlay      = document.getElementById('mod-tour');
  const introEl      = document.getElementById('tour-intro');
  const hudEl        = document.getElementById('tour-hud');
  const fillEl       = document.getElementById('tour-hud-fill');
  const descEl       = document.getElementById('tour-hud-desc');
  const nextBtn      = document.getElementById('tour-next-btn');
  const skipBtn      = document.getElementById('tour-skip-btn');
  const startBtn     = document.getElementById('tour-start-btn');
  const dismissBtn   = document.getElementById('tour-dismiss-btn');
  const dotsWrap     = document.getElementById('tour-hud-dots');

  if (!overlay || !startBtn) return;

  let currentStep = 0;
  let stepCleanup = null;

  /* 5 passos mapeados ao fluxo self-serve do PRD */
  const STEPS = [
    { tab: 1, desc: '3 campos, 60 segundos. Nome, cor e oferta — sua LP está pronta.', setup: setupConfigLP  },
    { tab: 1, desc: 'Um toggle. QR Code gerado. Sistema ativo imediatamente.',          setup: setupPublish   },
    { tab: 3, desc: 'Primeiro lead! WhatsApp automático disparado em 8 segundos.',      setup: setupAhaMoment },
    { tab: 0, desc: 'Lead no CRM com origem rastreada. Hora de fechar.',                setup: setupCrm       },
    { tab: 4, desc: 'Agendamento vinculado ao lead. Recorrência automática ativada!',   setup: setupAgenda    },
  ];

  /* ── Dismiss — user wants to explore on their own ── */
  dismissBtn?.addEventListener('click', dismissTour);

  function dismissTour() {
    introEl.style.transition = 'opacity .3s ease';
    introEl.style.opacity = '0';
    setTimeout(() => {
      overlay.style.transition = 'opacity .3s ease';
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
        // Switch to first tab so mocks are visible and interactive
        switchTab(0);
      }, 300);
    }, 50);
  }

  /* ── Start tour ── */
  startBtn.addEventListener('click', () => {
    introEl.style.transition = 'opacity .35s ease';
    introEl.style.opacity = '0';
    introEl.style.pointerEvents = 'none';
    setTimeout(() => {
      introEl.style.display = 'none';
      overlay.classList.remove('is-intro');
      overlay.classList.add('is-touring');
      hudEl.style.display = 'block';
      goToStep(0);
    }, 350);
  });

  /* ── Skip / close during tour ── */
  skipBtn?.addEventListener('click', endTour);
  nextBtn?.addEventListener('click', advance);

  /* ── Step orchestration ── */
  function goToStep(idx) {
    currentStep = idx;
    if (stepCleanup) { stepCleanup(); stepCleanup = null; }

    const step = STEPS[idx];

    // Animate desc swap
    descEl.classList.remove('is-entering');
    void descEl.offsetWidth; // reflow
    descEl.textContent = step.desc;
    descEl.classList.add('is-entering');

    // Progress bar
    fillEl.style.width = `${((idx + 1) / STEPS.length) * 100}%`;

    // Dot indicators
    dotsWrap?.querySelectorAll('.tour-dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === idx);
      dot.classList.toggle('is-done',   i < idx);
    });

    nextBtn.style.display = 'none';
    switchTab(step.tab);
    stepCleanup = step.setup(advance) || null;
  }

  function advance() {
    if (stepCleanup) { stepCleanup(); stepCleanup = null; }
    if (currentStep < STEPS.length - 1) {
      goToStep(currentStep + 1);
    } else {
      endTour();
    }
  }

  function endTour() {
    if (stepCleanup) { stepCleanup(); stepCleanup = null; }
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
    overlay.style.transition = 'opacity .35s ease';
    overlay.style.opacity = '0';
    setTimeout(() => { overlay.style.display = 'none'; }, 350);
  }

  function switchTab(tabIdx) {
    document.querySelectorAll('.mod-tab').forEach(t => {
      const active = parseInt(t.dataset.tab) === tabIdx;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    document.querySelectorAll('.mod-panel').forEach(p => {
      p.classList.toggle('is-active', parseInt(p.dataset.panel) === tabIdx);
    });

    // Move the tour overlay into the now-active panel's visual column
    const targetVisual = document.querySelector(`.mod-panel[data-panel="${tabIdx}"] .mod-panel-visual`);
    if (targetVisual && overlay.parentElement !== targetVisual) {
      targetVisual.insertBefore(overlay, targetVisual.firstChild);
    }
  }

  function showNextFallback(ms) {
    return setTimeout(() => { nextBtn.style.display = 'inline-flex'; }, ms);
  }

  /* ══ Passo 1 — Config LP: nome → cor → oferta (3 campos) ══ */
  function setupConfigLP(advance) {
    const config      = document.getElementById('ob-cn-config');
    const preview     = document.getElementById('ob-cn-preview');
    const nameGroup   = document.getElementById('cn-name-group');
    const colorGroup  = document.getElementById('cn-color-group');
    const offerGroup  = document.getElementById('cn-offer-group');
    const nameInput   = document.getElementById('canais-biz-name');
    const colorInput  = document.getElementById('canais-color-input');
    const offerInput  = document.getElementById('canais-offer-text');

    const allGroups = [nameGroup, colorGroup, offerGroup];
    let cancelled = false;
    const timers = [];

    function focusGroup(g) {
      allGroups.forEach(x => x?.classList.remove('tour-focus'));
      g?.classList.add('tour-focus');
    }

    function waitForInput(el, next, timeoutMs = 7000) {
      if (cancelled) return;
      let done = false;
      const handler = () => {
        if (done || cancelled) return;
        done = true;
        el.removeEventListener('input', handler);
        clearTimeout(fb);
        setTimeout(() => { if (!cancelled) next(); }, 600);
      };
      el?.addEventListener('input', handler);
      const fb = setTimeout(() => {
        if (done || cancelled) return;
        done = true;
        el?.removeEventListener('input', handler);
        next();
      }, timeoutMs);
      timers.push(fb);
    }

    function subStep(n) {
      if (cancelled) return;
      allGroups.forEach(x => x?.classList.remove('tour-focus'));

      if (n === 0) {
        config?.classList.add('tour-guiding');
        preview?.classList.add('tour-dim');
        focusGroup(nameGroup);
        nameInput?.focus();
        waitForInput(nameInput, () => subStep(1));

      } else if (n === 1) {
        preview?.classList.remove('tour-dim');
        focusGroup(colorGroup);
        waitForInput(colorInput, () => subStep(2));

      } else if (n === 2) {
        preview?.classList.add('tour-dim');
        focusGroup(offerGroup);
        offerInput?.focus();
        waitForInput(offerInput, () => {
          config?.classList.remove('tour-guiding');
          preview?.classList.remove('tour-dim');
          allGroups.forEach(x => x?.classList.remove('tour-focus'));
          advance();
        }, 6000);
      }
    }

    subStep(0);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      config?.classList.remove('tour-guiding');
      preview?.classList.remove('tour-dim');
      allGroups.forEach(x => x?.classList.remove('tour-focus'));
    };
  }

  /* ══ Passo 2 — Publicar: toggle → QR splash → lead chega ══ */
  function setupPublish(advance) {
    const config       = document.getElementById('ob-cn-config');
    const preview      = document.getElementById('ob-cn-preview');
    const pubGroup     = document.getElementById('cn-publish-group');
    const toggle       = document.getElementById('canais-publish-toggle');
    const toggleTrack  = document.getElementById('cn-toggle-track');
    const toggleStatus = document.getElementById('cn-toggle-status');
    const modal        = document.getElementById('ob-lead-modal');
    const qrSplash     = document.getElementById('ob-qr-splash');
    const lmBadge      = document.getElementById('ob-lm-badge');
    const lmFlow       = document.getElementById('ob-lm-flow');
    const lmName       = document.getElementById('ob-lm-name');
    const lmCrmCard    = document.getElementById('ob-lm-crm-card');
    const lmCta        = document.getElementById('ob-lm-cta');

    let cancelled = false;
    const timers = [];

    config?.classList.add('tour-guiding');
    pubGroup?.classList.add('tour-focus');

    function onToggle() {
      if (cancelled) return;
      toggle?.removeEventListener('change', onToggle);
      clearTimeout(fallbackTimer);

      toggleTrack?.classList.add('is-on');
      if (toggleStatus) { toggleStatus.textContent = 'Online'; toggleStatus.classList.add('is-on'); }
      config?.classList.remove('tour-guiding');
      preview?.classList.remove('tour-dim');
      pubGroup?.classList.remove('tour-focus');

      // Show modal with QR splash first
      if (modal) modal.style.display = 'flex';
      if (qrSplash) { qrSplash.style.display = 'flex'; qrSplash.style.opacity = '1'; }
      if (lmBadge)  lmBadge.style.display = 'none';

      // After 4.2s: transition to lead flow
      const t1 = setTimeout(() => {
        if (cancelled) return;
        if (qrSplash) {
          qrSplash.style.transition = 'opacity .4s ease';
          qrSplash.style.opacity = '0';
        }
        const t2 = setTimeout(() => {
          if (cancelled) return;
          if (qrSplash) qrSplash.style.display = 'none';
          if (lmBadge)  lmBadge.style.display = 'flex';
          if (lmFlow)   lmFlow.style.display  = 'flex';
          if (lmCta)    lmCta.style.display   = 'block';

          // Typewriter for lead name
          if (lmName) lmName.textContent = '';
          const name = 'Ana Paula';
          let i = 0;
          const typer = setInterval(() => {
            if (cancelled) { clearInterval(typer); return; }
            if (lmName) lmName.textContent = name.slice(0, ++i);
            if (i >= name.length) {
              clearInterval(typer);
              const sub = document.getElementById('ob-lm-submit');
              if (sub) sub.style.background = '#10B981';
              const t3 = setTimeout(() => {
                if (!cancelled && lmCrmCard) lmCrmCard.style.opacity = '1';
              }, 500);
              timers.push(t3);
            }
          }, 80);

          // CTA → advance
          const ctaFb = showNextFallback(14000);
          lmCta?.addEventListener('click', () => {
            if (cancelled) return;
            clearTimeout(ctaFb);
            if (modal) modal.style.display = 'none';
            advance();
          }, { once: true });
        }, 450);
        timers.push(t2);
      }, 4200);
      timers.push(t1);
    }

    toggle?.addEventListener('change', onToggle);
    const fallbackTimer = setTimeout(() => {
      if (!cancelled) {
        toggle?.dispatchEvent(new Event('change'));
      }
    }, 9000);
    timers.push(fallbackTimer);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      toggle?.removeEventListener('change', onToggle);
      config?.classList.remove('tour-guiding');
      pubGroup?.classList.remove('tour-focus');
      if (modal)    modal.style.display    = 'none';
      if (qrSplash) { qrSplash.style.display = 'none'; qrSplash.style.opacity = '1'; qrSplash.style.transition = ''; }
      if (lmBadge)  lmBadge.style.display  = 'none';
      if (lmFlow)   lmFlow.style.display   = 'none';
      if (lmCta)    lmCta.style.display    = 'none';
    };
  }

  /* ══ Step 2 — CRM: Maria Santos arrives, drag to Fechado ══ */
  function setupCrm(advance) {
    const board = document.querySelector('.mod-panel[data-panel="0"] .ob-crm-board');
    if (!board) { nextBtn.style.display = 'inline-flex'; return; }

    const cols       = board.querySelectorAll('.ob-crm-col');
    const novoCol    = cols[0];
    const fechadoCol = cols[3]; // Fechado is the 4th column

    // Inject Maria Santos card in the Novo column
    const card = document.createElement('div');
    card.className = 'ob-crm-card tour-lead-card tour-highlight';
    card.setAttribute('draggable', 'true');
    card.innerHTML = `
      <div class="ob-card-name">Maria Santos</div>
      <div class="ob-card-sub">via Landing Page</div>
      <div class="ob-card-av" style="background:#5FB389">MS</div>
    `;
    card.style.cssText += 'opacity:0;transform:translateY(-10px);transition:opacity .4s,transform .4s;';
    novoCol?.appendChild(card);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      card.style.opacity = '1';
      card.style.transform = 'none';
    }));

    const novoCount = novoCol?.querySelector('.ob-col-count');
    if (novoCount) novoCount.textContent = parseInt(novoCount.textContent || '0') + 1;

    let dragged = null;
    let moved   = false;

    function onDragStart(e) {
      dragged = card;
      card.classList.add('crm-dragging');
      e.dataTransfer.effectAllowed = 'move';
    }
    function onDragEnd() {
      card.classList.remove('crm-dragging');
    }
    card.addEventListener('dragstart', onDragStart);
    card.addEventListener('dragend', onDragEnd);

    // Move the card to the Fechado column and advance
    function moveCard(targetCol) {
      if (moved) return;
      moved = true;
      const dest = targetCol || fechadoCol;
      if (!dest) return;

      dest.appendChild(card);
      card.classList.remove('tour-highlight', 'crm-dragging');

      // Update source count
      if (novoCount) novoCount.textContent = Math.max(0, parseInt(novoCount.textContent || '1') - 1);
      const destCount = dest.querySelector('.ob-col-count');
      if (destCount) destCount.textContent = parseInt(destCount.textContent || '0') + 1;

      clearTimeout(fallback);
      setTimeout(advance, 600);
    }

    // Click card to move (friendly for non-drag users)
    card.addEventListener('click', () => moveCard(fechadoCol), { once: true });

    // Drop on any non-Novo column
    const dropHandlers = Array.from(cols).slice(1).map(col => {
      const fn = (e) => {
        e.preventDefault();
        col.classList.remove('crm-drop-over');
        if (dragged === card) moveCard(col);
      };
      col.addEventListener('drop', fn);
      return { col, fn };
    });

    const fallback = showNextFallback(14000);

    return () => {
      clearTimeout(fallback);
      card.removeEventListener('dragstart', onDragStart);
      card.removeEventListener('dragend', onDragEnd);
      dropHandlers.forEach(({ col, fn }) => col.removeEventListener('drop', fn));
      card.classList.remove('tour-highlight');
    };
  }

  /* ══ Step 3 — Financeiro (sale registers) ══ */
  function setupFinanceiro(advance) {
    const list = document.getElementById('fin-movements-list');
    if (!list) { nextBtn.style.display = 'inline-flex'; return; }

    const row = document.createElement('div');
    row.style.cssText = 'display:flex;justify-content:space-between;font-size:10px;padding:4px 0;border-bottom:1px solid #d0f5e6;opacity:0;transform:translateY(-6px);transition:opacity .45s ease,transform .45s ease;';
    row.innerHTML = `
      <span style="color:#1a2540;display:flex;align-items:center;gap:5px;">
        <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:#10B981;flex-shrink:0"></span>
        Marina Silva — Landing Page
      </span>
      <span style="color:#10B981;font-weight:700">+R$ 350</span>
    `;
    list.insertBefore(row, list.firstChild);

    requestAnimationFrame(() => requestAnimationFrame(() => {
      row.style.opacity = '1';
      row.style.transform = 'none';
    }));
    row.classList.add('tour-highlight');

    const autoAdvance = setTimeout(() => {
      row.classList.remove('tour-highlight');
      nextBtn.style.display = 'inline-flex';
    }, 2200);

    return () => {
      clearTimeout(autoAdvance);
      row.classList.remove('tour-highlight');
    };
  }

  /* ══ Passo 3 — Aha! Lead + WhatsApp automático em 8s ══ */
  function setupAhaMoment(advance) {
    const chat   = document.querySelector('.mod-panel[data-panel="3"] .wa-chat');
    const idleEl = document.getElementById('wa-idle-state');
    if (!chat) { nextBtn.style.display = 'inline-flex'; return; }

    let cancelled = false;
    let fallbackTimer = null;
    const addedEls = [];
    const timers = [];

    const fmt = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    // Fade out idle placeholder
    if (idleEl) {
      idleEl.style.transition = 'opacity .3s ease';
      idleEl.style.opacity = '0';
      const t0 = setTimeout(() => { if (idleEl) idleEl.style.display = 'none'; }, 300);
      timers.push(t0);
    }

    // Inject lead notification chip above chat
    const chip = document.createElement('div');
    chip.className = 'tour-lead-chip';
    chip.style.cssText = 'opacity:0;transform:translateY(-8px);transition:opacity .4s ease,transform .4s ease';
    chip.innerHTML = `
      <span class="tour-chip-pulse"></span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 6.29 6.29l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
      <div>
        <strong>Novo lead</strong> — Ana Paula
        <div style="font-size:9px;opacity:.7">via QR Code da Vitrine · agora</div>
      </div>
    `;
    chat.parentElement?.insertBefore(chip, chat);
    addedEls.push(chip);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      if (!cancelled) { chip.style.opacity = '1'; chip.style.transform = 'none'; }
    }));

    function addBubble(html, bubbleCls) {
      if (cancelled) return null;
      const el = document.createElement('div');
      el.className = 'wa-msg ' + bubbleCls;
      el.style.cssText = 'opacity:0;transition:opacity .35s ease';
      el.innerHTML = html;
      chat.appendChild(el);
      addedEls.push(el);
      chat.scrollTop = chat.scrollHeight;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (!cancelled) el.style.opacity = '1';
      }));
      return el;
    }

    // After chip settles, start WA sequence
    const t1 = setTimeout(() => {
      if (cancelled) return;

      addBubble(
        `<div class="wa-bubble">Oi! Vi o QR Code na vitrine. Quero meu cupom! 🎉<div class="wa-ts">${fmt()}</div></div>`,
        'wa-received'
      );

      const t2 = setTimeout(() => {
        if (cancelled) return;
        const typing = addBubble(
          '<div class="wa-bubble"><span></span><span></span><span></span></div>',
          'wa-sent wa-typing-indicator'
        );

        const t3 = setTimeout(() => {
          if (cancelled) return;
          if (typing?.parentNode) { typing.remove(); addedEls.splice(addedEls.indexOf(typing), 1); }

          addBubble(`
            <div class="wa-bubble">
              Olá Ana! 👋 Aqui está seu cupom de 15% off:<br>
              <strong style="color:#FFC800;font-family:monospace">CAFE-ANA15</strong><br>
              Válido até 30/06. Mostre na próxima visita! ✅
              <button class="tour-ia-agenda-btn" id="tour-ia-agenda-btn">Ver lead no CRM →</button>
              <div class="wa-ts">${fmt()} <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#FFC800" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg></div>
            </div>
          `, 'wa-sent');

          // "resposta automática" label
          const autoLabel = document.createElement('div');
          autoLabel.className = 'tour-auto-label';
          autoLabel.innerHTML = `<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg> resposta automática · 8s`;
          autoLabel.style.cssText = 'opacity:0;transition:opacity .4s ease';
          chat.appendChild(autoLabel);
          addedEls.push(autoLabel);
          requestAnimationFrame(() => requestAnimationFrame(() => {
            if (!cancelled) autoLabel.style.opacity = '1';
          }));

          fallbackTimer = showNextFallback(12000);

          document.getElementById('tour-ia-agenda-btn')?.addEventListener('click', () => {
            if (cancelled) return;
            clearTimeout(fallbackTimer);
            advance();
          }, { once: true });
        }, 1100);
        timers.push(t3);
      }, 900);
      timers.push(t2);
    }, 800);
    timers.push(t1);

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
      clearTimeout(fallbackTimer);
      addedEls.forEach(el => el.parentNode && el.remove());
      if (idleEl) { idleEl.style.display = ''; idleEl.style.opacity = '1'; idleEl.style.transition = ''; }
    };
  }

  /* ══ Passo 5 — Agenda: agendamento aparece → banner de conclusão ══ */
  function setupAgenda() {
    const banner      = document.getElementById('ag-completion-banner');
    const dismissBtn  = document.getElementById('ag-complete-dismiss');
    const exploreBtn  = document.getElementById('ag-complete-explore');
    const apts        = document.querySelector('.mod-panel[data-panel="4"] .ag-apts');

    // Inject Ana Paula appointment at the top of the week view
    let anaApt = null;
    if (apts) {
      anaApt = document.createElement('div');
      anaApt.className = 'ag-apt ag-apt-gold tour-maria-apt';
      anaApt.style.cssText = 'opacity:0;transform:translateY(-8px);transition:opacity .45s ease,transform .45s ease;';
      anaApt.innerHTML = `
        <div class="ag-apt-title">Ana Paula — Consulta via LP</div>
        <div class="ag-apt-sub">amanhã · 10:00 — 11:00 · lembrete WhatsApp ativo</div>
      `;
      apts.insertBefore(anaApt, apts.firstChild);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        anaApt.style.opacity  = '1';
        anaApt.style.transform = 'none';
      }));
    }

    // Show completion banner after appointment animates in
    setTimeout(() => {
      if (banner) banner.style.display = 'flex';
    }, 900);

    // Hide HUD nav — completion card has its own CTAs
    nextBtn.style.display = 'none';
    fillEl.style.width = '100%';
    descEl.textContent = 'Tour concluído. Muito mais espera por você no CRMiner.';

    function hideBanner() {
      if (!banner) return;
      banner.style.transition = 'opacity .3s ease';
      banner.style.opacity = '0';
      setTimeout(() => { banner.style.display = 'none'; banner.style.opacity = ''; banner.style.transition = ''; }, 300);
    }

    // X button — dismiss banner, agenda fica visível por baixo
    dismissBtn?.addEventListener('click', hideBanner, { once: true });

    // "Ver agenda ao vivo" — mesma ação: some o banner
    exploreBtn?.addEventListener('click', hideBanner, { once: true });

    return () => {
      anaApt?.remove();
      dismissBtn?.removeEventListener('click', hideBanner);
      exploreBtn?.removeEventListener('click', hideBanner);
    };
  }
}

/* ── 19. Jornada "Como Funciona" — scroll reveal nos 3 cards ── */
/* ── 19. Jornada "Como Funciona" — stage TOONHUB ── */
function initJornadaReveal() {
  const stage      = document.getElementById('ob-stage');
  const cards      = stage ? Array.from(stage.querySelectorAll('.ob-stage-card')) : [];
  const ghostEl    = document.getElementById('ob-stage-ghost');
  const counterEl  = document.getElementById('ob-stage-counter');
  const prevBtn    = stage?.querySelector('.ob-stage-prev');
  const nextBtn    = stage?.querySelector('.ob-stage-next');
  if (!stage || !cards.length) return;

  const N = cards.length; // 3
  let activeIdx   = 0;
  let isAnimating = false;

  const GHOST_LABELS = ['01', '02', '03'];
  const GHOST_COLORS = [
    '#FFC800',
    '#FFC800',
    '#FFC800',
  ];

  function applyRoles(animate = true) {
    cards.forEach(c => c.classList.remove('is-center','is-left','is-right'));
    cards[activeIdx].classList.add('is-center');
    cards[(activeIdx + N - 1) % N].classList.add('is-left');
    cards[(activeIdx + 1) % N].classList.add('is-right');

    // Animação de background via GSAP (mais confiável que CSS transition em alguns browsers)
    if (typeof gsap !== 'undefined') {
      cards.forEach(c => {
        const isCenter    = c.classList.contains('is-center');
        const isComunidade = c.classList.contains('ob-card-comunidade');
        const targetBg    = isCenter ? (isComunidade ? '#1C1F24' : '#1A1D21') : 'transparent';
        const targetBorder = isCenter ? '#2A2D32' : 'rgba(255,255,255,0.1)';
        if (animate) {
          gsap.to(c, { backgroundColor: targetBg, borderColor: targetBorder, duration: 0.65, ease: 'power2.inOut', overwrite: 'auto' });
        } else {
          gsap.set(c, { backgroundColor: targetBg, borderColor: targetBorder });
        }
      });
    }

    if (ghostEl) {
      ghostEl.textContent = GHOST_LABELS[activeIdx];
      ghostEl.style.color = GHOST_COLORS[activeIdx];
    }
    if (counterEl) {
      counterEl.textContent = `0${activeIdx + 1} / 0${N}`;
    }
  }

  function navigate(dir) {
    if (isAnimating) return;
    isAnimating = true;
    activeIdx = dir === 'next'
      ? (activeIdx + 1) % N
      : (activeIdx + N - 1) % N;
    applyRoles();
    setTimeout(() => { isAnimating = false; }, 660);
  }

  prevBtn?.addEventListener('click', () => navigate('prev'));
  nextBtn?.addEventListener('click', () => navigate('next'));

  // Clicar no card lateral navega para ele
  cards.forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('is-left'))  navigate('prev');
      if (card.classList.contains('is-right')) navigate('next');
    });
  });

  // Inicializar posições (sem animação)
  applyRoles(false);

  // Revelar o stage quando entra na viewport
  if (typeof gsap !== 'undefined') {
    gsap.fromTo(stage,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: typeof ScrollTrigger !== 'undefined'
          ? { trigger: stage, start: 'top 82%', once: true }
          : undefined
      }
    );
  }

  // Loop diagram dots
  const loopDots = document.querySelectorAll('.ob-loop-dot');
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    loopDots.forEach((dot, i) => {
      gsap.fromTo(dot,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.4, ease: 'power2.out', delay: i * 0.18,
          scrollTrigger: { trigger: '.ob-loop', start: 'top 80%', once: true } }
      );
    });
  }
}

/* ── 20. Customer Journey phones — GSAP stagger entrance ── */
function initCJPhones() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const steps = document.querySelectorAll('.cj-step');
  if (!steps.length) return;

  // Remove CSS reveal class — GSAP takes over
  steps.forEach(el => {
    el.classList.remove('reveal');
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
  });

  const isMobile = window.matchMedia('(max-width: 900px)').matches;

  steps.forEach((step, i) => {
    const phone = step.querySelector('.phone-body');

    gsap.to(step, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: step,
        start: isMobile ? 'top 88%' : 'top 80%',
        once: true,
      }
    });

    // Phone body gets a subtle scale-up pop
    if (phone) {
      gsap.fromTo(phone,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 1,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: step,
            start: isMobile ? 'top 85%' : 'top 78%',
            once: true,
          }
        }
      );
    }
  });
}

/* ── 21. Integration icons — CSS stroke draw animation via ScrollTrigger ── */
function initIntegrationDraw() {
  if (typeof ScrollTrigger === 'undefined') return;

  const items = document.querySelectorAll('.int-item');
  if (!items.length) return;

  items.forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, y: 20, scale: 0.88 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6,
        ease: 'back.out(1.6)',
        delay: i * 0.08,
        scrollTrigger: {
          trigger: '.integrations-row',
          start: 'top 82%',
          once: true,
        }
      }
    );
  });
}

/* ─── Widget Conversacional ─── */
(function initWidget() {
  const btn    = document.getElementById('wdg-btn');
  const panel  = document.getElementById('wdg-panel');
  const closeEl = document.getElementById('wdg-close');
  const msgs   = document.getElementById('wdg-messages');
  const input  = document.getElementById('wdg-input');
  const send   = document.getElementById('wdg-send');
  const footer = document.getElementById('wdg-footer');
  const badge  = btn?.querySelector('.wdg-btn-badge');

  if (!btn || !panel) return;

  let step = 0;
  let isOpen = false;
  const data = { nome: '', whatsapp: '', email: '' };

  const steps = [
    { key: 'nome',     placeholder: 'Seu nome completo...', type: 'text',  validate: v => v.trim().length >= 2 },
    { key: 'whatsapp', placeholder: '(11) 99999-9999',      type: 'tel',   validate: v => v.replace(/\D/g,'').length >= 10 },
    { key: 'email',    placeholder: 'seu@email.com',        type: 'email', validate: v => /\S+@\S+\.\S+/.test(v) },
  ];

  const botLines = [
    'Olá! 👋 Para conectar você com um especialista do CRMiner, preciso de algumas informações. Qual é o seu nome?',
    nome => `Prazer, ${nome}! Qual é o seu WhatsApp com DDD?`,
    'Ótimo! E qual é o seu e-mail?',
  ];

  function open() {
    isOpen = true;
    panel.classList.add('is-open');
    if (badge) badge.style.display = 'none';
    if (msgs.children.length === 0) {
      setTimeout(() => showTyping(() => addBot(botLines[0])), 450);
    }
    setTimeout(() => input.focus(), 380);
  }

  function close() {
    isOpen = false;
    panel.classList.remove('is-open');
  }

  btn.addEventListener('click', () => isOpen ? close() : open());
  closeEl?.addEventListener('click', close);

  function addBot(text) {
    const d = document.createElement('div');
    d.className = 'wdg-msg wdg-msg-bot';
    d.innerHTML = `<div class="wdg-bubble">${text}</div>`;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function addUser(text) {
    const d = document.createElement('div');
    d.className = 'wdg-msg wdg-msg-user';
    d.innerHTML = `<div class="wdg-bubble">${text}</div>`;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function showTyping(cb) {
    const d = document.createElement('div');
    d.className = 'wdg-msg wdg-typing';
    d.innerHTML = `<div class="wdg-bubble"><div class="wdg-typing-dots"><span></span><span></span><span></span></div></div>`;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => { d.remove(); cb(); msgs.scrollTop = msgs.scrollHeight; }, 1300);
  }

  function showDone() {
    footer.style.display = 'none';
    msgs.innerHTML = '';
    const d = document.createElement('div');
    d.className = 'wdg-done';
    d.innerHTML = `
      <div class="wdg-done-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="wdg-done-title">Recebemos tudo! ✨</div>
      <div class="wdg-done-sub">Em breve um especialista do CRMiner vai entrar em contato com você pelo WhatsApp. Fique de olho!</div>
    `;
    msgs.appendChild(d);
  }

  function handleSend() {
    if (step >= 3) return;
    const val = input.value.trim();
    const cur = steps[step];
    if (!val || !cur.validate(val)) {
      input.classList.add('error');
      setTimeout(() => input.classList.remove('error'), 600);
      return;
    }
    data[cur.key] = val;
    addUser(val);
    input.value = '';
    step++;

    if (step < 3) {
      const next = typeof botLines[step] === 'function' ? botLines[step](data.nome) : botLines[step];
      input.type = steps[step].type;
      input.placeholder = steps[step].placeholder;
      showTyping(() => addBot(next));
    } else {
      showTyping(showDone);
    }
  }

  send.addEventListener('click', handleSend);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
  input.type = steps[0].type;
  input.placeholder = steps[0].placeholder;
})();
