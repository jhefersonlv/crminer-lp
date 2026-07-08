/* ============================================================
   CONSENTIMENTO LGPD — banner + Google Consent Mode v2 + Clarity
   - Default (negado) é setado no <head> antes do gtag.js.
   - Aqui aplicamos a escolha salva e mostramos o banner quando
     ainda não houver decisão. Persistência em localStorage.
   ============================================================ */
(function () {
  "use strict";

  var KEY = "crm_consent";          // "granted" | "denied"
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}

  /* Aplica a decisão nas duas ferramentas. */
  function apply(decision) {
    var granted = decision === "granted";

    // Google Consent Mode v2
    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", {
        ad_storage:         granted ? "granted" : "denied",
        analytics_storage:  granted ? "granted" : "denied",
        ad_user_data:       granted ? "granted" : "denied",
        ad_personalization: granted ? "granted" : "denied"
      });
    }

    // Microsoft Clarity (a fila window.clarity já existe desde o <head>)
    if (typeof window.clarity === "function") {
      window.clarity("consent", granted);
    }
  }

  function save(decision) {
    stored = decision;
    try { localStorage.setItem(KEY, decision); } catch (e) {}
    apply(decision);
  }

  /* Link "Preferências de cookies" (rodapé) reabre o banner a qualquer momento —
     o consentimento deve ser revogável tão facilmente quanto foi concedido (LGPD). */
  window.crmConsent = { open: buildBanner, current: function () { return stored; } };
  document.addEventListener("click", function (e) {
    if (e.target.closest("[data-consent-open]")) { e.preventDefault(); buildBanner(); }
  });

  // Visitante recorrente: reaplica a escolha e não mostra o banner automaticamente.
  if (stored === "granted" || stored === "denied") {
    apply(stored);
    return;
  }

  // Primeira visita: por padrão o Clarity também fica sem cookie até decidir.
  if (typeof window.clarity === "function") window.clarity("consent", false);

  /* ── Banner ── */
  function buildBanner() {
    if (document.querySelector(".crm-consent")) return; // evita banner duplicado
    var el = document.createElement("div");
    el.className = "crm-consent";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-label", "Aviso de privacidade e cookies");
    el.innerHTML =
      '<div class="crm-consent__body">' +
        '<p class="crm-consent__title">Bora deixar sua visita melhor?</p>' +
        '<p class="crm-consent__text">' +
          'Com seu aceite, a gente entende como você usa o site e deixa tudo mais rápido e relevante pra você. ' +
          'Você muda quando quiser. Veja a <a href="/privacidade#cookies">Política de Privacidade</a>.' +
        '</p>' +
      '</div>' +
      '<div class="crm-consent__actions">' +
        '<button type="button" class="crm-consent__btn crm-consent__btn--ghost" data-consent="denied">Recusar</button>' +
        '<button type="button" class="crm-consent__btn crm-consent__btn--primary" data-consent="granted">Aceitar cookies</button>' +
      '</div>';

    el.addEventListener("click", function (e) {
      var b = e.target.closest("[data-consent]");
      if (!b) return;
      save(b.getAttribute("data-consent"));
      el.classList.remove("is-visible");
      // remove do DOM após a transição de saída
      setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 320);
    });

    document.body.appendChild(el);
    // força reflow antes de animar a entrada
    requestAnimationFrame(function () { el.classList.add("is-visible"); });
  }

  if (document.readyState !== "loading") buildBanner();
  else document.addEventListener("DOMContentLoaded", buildBanner);
})();
