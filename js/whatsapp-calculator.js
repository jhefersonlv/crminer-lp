(() => {
  'use strict';

  const fields = {
    marketing: document.getElementById('marketing-messages'),
    utility: document.getElementById('utility-messages'),
    service: document.getElementById('service-messages')
  };
  if (Object.values(fields).some((field) => !field)) return;

  const formatCurrency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const maxMessages = 1_000_000_000;
  const count = (field) => {
    const value = Number(field.value);
    return Number.isFinite(value) ? Math.min(maxMessages, Math.max(0, Math.trunc(value))) : 0;
  };

  const update = () => {
    // Inteiros em centésimos de centavo evitam erros de ponto flutuante nas tarifas de 4 casas.
    const marketing = count(fields.marketing) * 3217;
    const utility = count(fields.utility) * 350;
    const service = Math.max(0, count(fields.service) - 1000) * 350;
    const show = (id, amount) => {
      document.getElementById(id).textContent = formatCurrency.format(amount / 10000);
    };
    show('marketing-cost', marketing);
    show('utility-cost', utility);
    show('service-cost', service);
    show('meta-estimate', marketing + utility + service);
  };

  Object.values(fields).forEach((field) => {
    field.addEventListener('input', () => {
      const entered = Number(field.value);
      if (field.value !== '' && Number.isFinite(entered) && (entered < 0 || entered > maxMessages)) {
        field.value = String(count(field));
      }
      update();
    });
    field.addEventListener('change', () => {
      field.value = String(count(field));
      update();
    });
  });
  update();
})();
