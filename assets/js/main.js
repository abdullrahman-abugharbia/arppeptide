/* ==========================================================================
   ARP Peptide — front-end logic (no framework, no build step)
   Depends on: config.js (window.SITE) and products.js (window.PRODUCTS)
   ========================================================================== */
(function () {
  'use strict';

  var SITE = window.SITE || { brand: 'ARP Peptide', ordersEmail: '' };
  var PRODUCTS = window.PRODUCTS || [];

  function bySlug(slug) {
    for (var i = 0; i < PRODUCTS.length; i++) {
      if (PRODUCTS[i].slug === slug) return PRODUCTS[i];
    }
    return null;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---- Brand text (logo + footer + <title>) ------------------------------ */
  function applyBrand() {
    var logos = document.querySelectorAll('[data-brand]');
    for (var i = 0; i < logos.length; i++) {
      // Render the wordmark "ARPPeptide" (no space) with "ARP" enlarged via CSS.
      var parts = SITE.brand.split(' ');
      var wordmark = parts.length > 1
        ? '<span class="brand-primary">' + escapeHtml(parts[0]) + '</span>' +
          '<span class="brand-secondary">' + escapeHtml(parts.slice(1).join(' ')) + '</span>'
        : escapeHtml(SITE.brand);
      // The logo image sits to the LEFT of the wordmark — only on the logo lockup,
      // not the inline copyright line.
      var isLogo = logos[i].classList.contains('logo');
      var mark = (isLogo && SITE.logoImage)
        ? '<img class="logo-mark" src="' + escapeHtml(SITE.logoImage) + '" alt="">'
        : '';
      logos[i].innerHTML = mark + '<span class="logo-text">' + wordmark + '</span>';
    }
    var years = document.querySelectorAll('[data-year]');
    for (var y = 0; y < years.length; y++) years[y].textContent = new Date().getFullYear();
  }

  /* ---- Mobile navigation -------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.nav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  /* ---- Product grid ------------------------------------------------------- */
  // Format sizes like ["10mg","40mg"] -> "10 / 40mg" (shared unit shown once).
  function formatSizes(sizes) {
    if (!sizes || !sizes.length) return '';
    if (sizes.length === 1) return sizes[0];
    var parts = sizes.map(function (s) {
      var m = String(s).match(/^([\d.]+)\s*([a-zA-Z]+)$/);
      return m ? { n: m[1], u: m[2] } : { n: String(s), u: '' };
    });
    var unit = parts[parts.length - 1].u;
    var sameUnit = unit && parts.every(function (p) { return p.u === unit; });
    if (sameUnit) return parts.map(function (p) { return p.n; }).join(' / ') + unit;
    return sizes.join(' / ');
  }

  function cardHtml(p) {
    var comingSoon = !(p.descriptionHtml && p.descriptionHtml.trim());
    var sizes = formatSizes(p.sizes);
    var href = 'product.html?slug=' + encodeURIComponent(p.slug);
    return '' +
      '<a class="product-card" href="' + href + '">' +
        '<div class="product-card__imgwrap">' +
          '<img src="' + escapeHtml(p.image) + '" alt="' + escapeHtml(p.name) + '" loading="lazy">' +
          (comingSoon ? '<span class="product-card__badge">Coming soon</span>' : '') +
        '</div>' +
        '<div class="product-card__body">' +
          '<div class="product-card__title">' + escapeHtml(p.name) + '</div>' +
          (sizes ? '<div class="product-card__sizes">' + escapeHtml(sizes) + '</div>' : '') +
          '<div class="product-card__cta' + (comingSoon ? ' product-card__cta--ghost' : '') + '">View</div>' +
        '</div>' +
      '</a>';
  }

  // Paginate a grid that opts in with data-page-size="N"; the nav is inserted
  // right after the grid and hides itself when everything fits on one page.
  function paginate(grid, pageSize) {
    var pages = Math.ceil(PRODUCTS.length / pageSize);
    var current = 1;
    var nav = document.createElement('nav');
    nav.className = 'pagination';
    nav.setAttribute('aria-label', 'Product pages');
    grid.insertAdjacentElement('afterend', nav);

    function paintNav() {
      if (pages < 2) { nav.innerHTML = ''; return; }
      var html = '<button class="page-btn" data-nav="prev" aria-label="Previous page"' +
                 (current === 1 ? ' disabled' : '') + '>&larr;</button>';
      for (var p = 1; p <= pages; p++) {
        html += '<button class="page-btn' + (p === current ? ' is-active' : '') + '"' +
                ' data-page="' + p + '"' + (p === current ? ' aria-current="page"' : '') +
                '>' + p + '</button>';
      }
      html += '<button class="page-btn" data-nav="next" aria-label="Next page"' +
              (current === pages ? ' disabled' : '') + '>&rarr;</button>';
      nav.innerHTML = html;
    }

    function show(page) {
      current = Math.min(Math.max(1, page), pages);
      var start = (current - 1) * pageSize;
      grid.innerHTML = PRODUCTS.slice(start, start + pageSize).map(cardHtml).join('');
      paintNav();
    }

    nav.addEventListener('click', function (e) {
      var btn = e.target.closest('.page-btn');
      if (!btn || btn.disabled) return;
      var nav_ = btn.getAttribute('data-nav');
      if (nav_ === 'prev') show(current - 1);
      else if (nav_ === 'next') show(current + 1);
      else show(parseInt(btn.getAttribute('data-page'), 10));
    });

    show(1);
  }

  function renderGrids() {
    var grids = document.querySelectorAll('[data-product-grid]');
    for (var i = 0; i < grids.length; i++) {
      var size = parseInt(grids[i].getAttribute('data-page-size'), 10);
      if (size > 0) paginate(grids[i], size);
      else grids[i].innerHTML = PRODUCTS.map(cardHtml).join('');
    }
  }

  /* ---- Order Now (mailto) ------------------------------------------------- */
  function buildMailto(product, size, qty) {
    var subject = 'Order: ' + product.name + ' (' + size + ')';
    var body = [
      'Hello ' + SITE.brand + ',',
      '',
      'I would like to place the following order:',
      '',
      'Product: ' + product.name,
      'Size: ' + size,
      'SKU: ' + product.specs.sku,
      'Quantity: ' + qty,
      '',
      '--- My details (please fill in) ---',
      'Name: ',
      'Shipping address: ',
      'Phone: ',
      'Notes: ',
      '',
      'Thank you.'
    ].join('\n');
    return 'mailto:' + encodeURIComponent(SITE.ordersEmail) +
           '?subject=' + encodeURIComponent(subject) +
           '&body=' + encodeURIComponent(body);
  }

  /* ---- Product detail page ------------------------------------------------ */
  function renderProductPage() {
    var root = document.querySelector('[data-product-detail]');
    if (!root) return;

    var params = new URLSearchParams(window.location.search);
    var product = bySlug(params.get('slug'));

    if (!product) {
      root.innerHTML = '<div class="coming-soon"><h2>Product not found</h2>' +
        '<p>Sorry, we couldn\'t find that product. <a href="products.html">Browse all peptides</a>.</p></div>';
      return;
    }

    document.title = product.name + ' — ' + SITE.brand;

    var sizeControl = product.sizes.length > 1
      ? '<select id="order-size">' + product.sizes.map(function (s) {
          return '<option value="' + escapeHtml(s) + '">' + escapeHtml(s) + '</option>';
        }).join('') + '</select>'
      : '<input type="text" id="order-size" value="' + escapeHtml(product.sizes[0] || '') + '" readonly>';

    var descHtml = product.descriptionHtml && product.descriptionHtml.trim()
      ? '<div class="product-description">' + product.descriptionHtml + '</div>'
      : '<div class="product-description"><div class="coming-soon">' +
          '<h3>Description coming soon</h3><p>Full product information for ' + escapeHtml(product.name) +
          ' will be added shortly. Contact us for details in the meantime.</p></div></div>';

    root.innerHTML = '' +
      '<nav class="breadcrumb"><a href="index.html">Home</a> / <a href="products.html">Peptides</a> / ' + escapeHtml(product.name) + '</nav>' +
      '<div class="product-detail">' +
        '<div class="product-gallery">' +
          '<img src="' + escapeHtml(product.image) + '" alt="' + escapeHtml(product.name) + '">' +
        '</div>' +
        '<div class="product-info">' +
          '<h1>' + escapeHtml(product.name) + '</h1>' +
          '<table class="spec-table"><tbody>' +
            '<tr><th>Size</th><td>' + escapeHtml(product.sizes.join(', ')) + '</td></tr>' +
            '<tr><th>Contents</th><td>' + escapeHtml(product.specs.contents) + '</td></tr>' +
            '<tr><th>Form</th><td>' + escapeHtml(product.specs.form) + '</td></tr>' +
            '<tr><th>Purity</th><td>' + escapeHtml(product.specs.purity) + '</td></tr>' +
            '<tr><th>SKU</th><td>' + escapeHtml(product.specs.sku) + '</td></tr>' +
          '</tbody></table>' +
          '<div class="order-box">' +
            '<div class="row">' +
              '<div class="field"><label for="order-size">Size</label>' + sizeControl + '</div>' +
              '<div class="field"><label for="order-qty">Quantity</label>' +
                '<input type="number" id="order-qty" min="1" value="1"></div>' +
            '</div>' +
            '<a class="btn btn--solid btn--block btn--lg" id="order-now" href="#">Order Now</a>' +
            '<p class="order-note">Clicking &ldquo;Order Now&rdquo; opens your email app with this order pre-filled. Add your details and send &mdash; we\'ll reply to confirm.</p>' +
          '</div>' +
        '</div>' +
      '</div>' +
      descHtml;

    var orderBtn = document.getElementById('order-now');
    var sizeEl = document.getElementById('order-size');
    var qtyEl = document.getElementById('order-qty');

    function updateLink() {
      var size = sizeEl ? sizeEl.value : (product.sizes[0] || '');
      var qty = qtyEl && qtyEl.value ? qtyEl.value : '1';
      orderBtn.setAttribute('href', buildMailto(product, size, qty));
    }
    updateLink();
    if (sizeEl) sizeEl.addEventListener('change', updateLink);
    if (qtyEl) qtyEl.addEventListener('input', updateLink);
  }

  /* ---- Contact email (populated from config) ------------------------------ */
  function initContactEmail() {
    // Elements that display the address as text AND link to it.
    var textEls = document.querySelectorAll('[data-order-email]');
    for (var i = 0; i < textEls.length; i++) {
      textEls[i].textContent = SITE.ordersEmail;
      if (textEls[i].tagName === 'A') textEls[i].setAttribute('href', 'mailto:' + SITE.ordersEmail);
    }
    // Elements that only need the mailto href (keep their own label).
    var linkEls = document.querySelectorAll('[data-order-email-link]');
    for (var j = 0; j < linkEls.length; j++) {
      linkEls[j].setAttribute('href', 'mailto:' + SITE.ordersEmail);
    }
  }

  /* ---- Newsletter / contact strip (also mailto) --------------------------- */
  function initNewsletter() {
    var form = document.querySelector('[data-newsletter]');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var email = input ? input.value.trim() : '';
      var subject = encodeURIComponent('Newsletter signup');
      var body = encodeURIComponent('Please add this email to your newsletter: ' + email);
      window.location.href = 'mailto:' + encodeURIComponent(SITE.ordersEmail) + '?subject=' + subject + '&body=' + body;
    });
  }

  /* ---- Init --------------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    applyBrand();
    initNav();
    renderGrids();
    renderProductPage();
    initContactEmail();
    initNewsletter();
  });
})();
