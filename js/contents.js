(function () {
  'use strict';

  var list = document.querySelector('[data-content-list]');
  var empty = document.querySelector('[data-content-empty]');
  var actions = document.querySelector('[data-content-actions]');
  var showAll = document.querySelector('[data-content-all]');
  if (!list || !empty || !actions || !showAll) return;

  var config = window.crmContents || {};
  var items = (Array.isArray(config.items) ? config.items : []).filter(function (item) {
    if (!item || item.status !== 'published' || item.placeholder) return false;
    if (!item.id || !item.title || !item.description || !item.url) return false;
    try {
      var url = new URL(item.url, window.location.href);
      return url.protocol === 'https:' || url.protocol === 'http:';
    } catch (_) {
      return false;
    }
  });
  if (!items.length) return;

  var cards = items.map(function (item, index) {
    var card = document.createElement('article');
    card.className = 'receive-card content-card';
    card.hidden = index >= 3;
    if (item.image) {
      var imageLink = document.createElement('a');
      imageLink.className = 'content-card__media';
      imageLink.href = item.url;
      imageLink.target = '_blank';
      imageLink.rel = 'noopener';
      imageLink.setAttribute('data-cta', 'content-' + item.id + '-image');
      var image = document.createElement('img');
      image.src = item.image;
      image.alt = item.imageAlt || '';
      image.loading = 'lazy';
      image.width = 900;
      image.height = 506;
      imageLink.appendChild(image);
      card.appendChild(imageLink);
    }
    if (item.category) {
      var category = document.createElement('p');
      category.className = 'content-card__category';
      category.textContent = item.category;
      card.appendChild(category);
    }
    var title = document.createElement('h3');
    var link = document.createElement('a');
    link.href = item.url;
    link.textContent = item.title;
    link.target = '_blank';
    link.rel = 'noopener';
    link.setAttribute('data-cta', 'content-' + item.id);
    title.appendChild(link);
    var description = document.createElement('p');
    description.textContent = item.description;
    card.appendChild(title);
    card.appendChild(description);
    list.appendChild(card);
    return card;
  });

  empty.hidden = true;
  list.hidden = false;
  actions.hidden = cards.length <= 3;
  showAll.addEventListener('click', function () {
    cards.forEach(function (card) { card.hidden = false; });
    showAll.setAttribute('aria-expanded', 'true');
    actions.hidden = true;
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
    var nextLink = cards[3] && cards[3].querySelector('a');
    if (nextLink) nextLink.focus({ preventScroll: true });
  });
  if (window.ScrollTrigger) window.ScrollTrigger.refresh();
})();
