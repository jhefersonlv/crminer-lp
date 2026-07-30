/* ============================================================
   STORIES — player estilo Instagram para os vídeos "Como funciona".
   Vídeos verticais 9:16 renderizados no Remotion (stories-remotion/).
   Cada entrada: { id, src, poster, label }.
   ============================================================ */
(function () {
  "use strict";

  // ── Config: adicione os próximos vídeos aqui conforme renderizar ──
  var STORIES = [
    {
      id: "crm-video",
      src: "assets/stories/CRMiner_01_letters_v3_editorial.mp4",
      poster: "",
      label: "CRMiner · Demonstração",
    },
    // { id: "crm", src: "assets/stories/crm.mp4", poster: "assets/stories/crm-poster.jpg", label: "CRM · Funil de vendas" },
    // { id: "catalogo",  src: "assets/stories/catalogo.mp4",  poster: "assets/stories/catalogo-poster.jpg",  label: "Catálogo · Produtos" },
    // { id: "agenda",    src: "assets/stories/agenda.mp4",    poster: "assets/stories/agenda-poster.jpg",    label: "Agenda" },
    // { id: "financeiro",src: "assets/stories/financeiro.mp4",poster: "assets/stories/financeiro-poster.jpg",label: "Financeiro · Dashboard" },
  ];

  if (!STORIES.length) return;

  var overlay, stage, video, progressWrap, bars, captionEl, idLabel, muteBtn;
  var current = 0;
  var raf = null;
  var built = false;
  var muted = false; // abre com som (player é iniciado por clique → autoplay com áudio permitido)

  var ICON_SOUND_ON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14"/></svg>';
  var ICON_SOUND_OFF =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>';

  function updateMuteIcon() {
    if (muteBtn) muteBtn.innerHTML = muted ? ICON_SOUND_OFF : ICON_SOUND_ON;
  }

  function toggleMute(e) {
    if (e) e.stopPropagation();
    muted = !muted;
    if (video) video.muted = muted;
    updateMuteIcon();
  }

  function buildDOM() {
    if (built) return;
    built = true;

    overlay = document.createElement("div");
    overlay.className = "stories-overlay";
    overlay.id = "stories-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Como funciona o crminer");
    overlay.setAttribute("aria-hidden", "true");

    var backdrop = document.createElement("div");
    backdrop.className = "stories-backdrop";
    backdrop.addEventListener("click", close);

    stage = document.createElement("div");
    stage.className = "stories-stage";

    // barras de progresso (uma por story)
    progressWrap = document.createElement("div");
    progressWrap.className = "stories-progress";
    bars = STORIES.map(function () {
      var i = document.createElement("i");
      var b = document.createElement("b");
      i.appendChild(b);
      progressWrap.appendChild(i);
      return b;
    });

    // cabeçalho
    var head = document.createElement("div");
    head.className = "stories-head";
    var idWrap = document.createElement("div");
    idWrap.className = "stories-id";
    var logo = document.createElement("img");
    logo.src = "assets/logo/logo_white.png";
    logo.alt = "crminer";
    idLabel = document.createElement("span");
    idWrap.appendChild(logo);
    idWrap.appendChild(idLabel);
    muteBtn = document.createElement("button");
    muteBtn.className = "stories-mute";
    muteBtn.setAttribute("aria-label", "Ativar ou desativar som");
    muteBtn.addEventListener("click", toggleMute);
    updateMuteIcon();

    var closeBtn = document.createElement("button");
    closeBtn.className = "stories-close";
    closeBtn.setAttribute("aria-label", "Fechar");
    closeBtn.innerHTML = "&times;";
    closeBtn.addEventListener("click", close);

    var actions = document.createElement("div");
    actions.className = "stories-actions";
    actions.appendChild(muteBtn);
    actions.appendChild(closeBtn);

    head.appendChild(idWrap);
    head.appendChild(actions);

    // vídeo
    video = document.createElement("video");
    video.className = "stories-video";
    video.muted = muted;
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.preload = "auto";
    video.addEventListener("ended", next);
    video.addEventListener("timeupdate", syncBar);

    // zonas de toque
    var prevZone = document.createElement("button");
    prevZone.className = "stories-nav prev";
    prevZone.setAttribute("aria-label", "Anterior");
    prevZone.addEventListener("click", prev);
    var nextZone = document.createElement("button");
    nextZone.className = "stories-nav next";
    nextZone.setAttribute("aria-label", "Próximo");
    nextZone.addEventListener("click", next);

    captionEl = document.createElement("div");
    captionEl.className = "stories-caption";

    stage.appendChild(video);
    stage.appendChild(prevZone);
    stage.appendChild(nextZone);
    stage.appendChild(progressWrap);
    stage.appendChild(head);
    stage.appendChild(captionEl);

    overlay.appendChild(backdrop);
    overlay.appendChild(stage);
    document.body.appendChild(overlay);
  }

  function setBars() {
    bars.forEach(function (b, i) {
      b.style.width = i < current ? "100%" : "0%";
    });
  }

  function syncBar() {
    if (!video.duration) return;
    var pct = Math.min(100, (video.currentTime / video.duration) * 100);
    if (bars[current]) bars[current].style.width = pct + "%";
  }

  // rAF suaviza a barra entre os eventos timeupdate
  function tick() {
    syncBar();
    raf = requestAnimationFrame(tick);
  }

  function load(i) {
    current = i;
    var s = STORIES[i];
    idLabel.textContent = s.label || "";
    captionEl.textContent = s.label || "";
    video.poster = s.poster || "";
    video.src = s.src;
    video.muted = muted;
    setBars();
    var p = video.play();
    if (p && p.catch)
      p.catch(function () {
        // Navegador bloqueou autoplay com som → toca mudo e atualiza o ícone
        if (!muted) {
          muted = true;
          video.muted = true;
          updateMuteIcon();
          var p2 = video.play();
          if (p2 && p2.catch) p2.catch(function () {});
        }
      });
  }

  function next() {
    if (current < STORIES.length - 1) load(current + 1);
    else close();
  }

  function prev() {
    if (video.currentTime > 2 || current === 0) {
      video.currentTime = 0;
      syncBar();
    } else {
      load(current - 1);
    }
  }

  function open(i) {
    buildDOM();
    // Registra a abertura real do player (visualização de vídeo), além do clique no CTA
    var s = STORIES[i || 0];
    if (typeof window.crmTrack === "function") {
      window.crmTrack("video_play", { story_id: s.id, story_label: s.label });
    }
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("stories-lock");
    if (typeof lenis !== "undefined" && lenis.stop) lenis.stop();
    document.addEventListener("keydown", onKey);
    load(i || 0);
    cancelAnimationFrame(raf);
    tick();
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("stories-lock");
    if (typeof lenis !== "undefined" && lenis.start) lenis.start();
    document.removeEventListener("keydown", onKey);
    cancelAnimationFrame(raf);
    video.pause();
    video.removeAttribute("src");
    video.load();
  }

  function onKey(e) {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  }

  // Liga qualquer elemento [data-stories-open] ao player
  function wireTriggers() {
    var triggers = document.querySelectorAll("[data-stories-open]");
    triggers.forEach(function (t) {
      t.addEventListener("click", function (e) {
        e.preventDefault();
        open(0);
      });
    });
  }

  if (document.readyState !== "loading") wireTriggers();
  else document.addEventListener("DOMContentLoaded", wireTriggers);
})();
