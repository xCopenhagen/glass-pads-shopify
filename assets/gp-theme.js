/* ==========================================================================
   GLASS PADS — THEME JS
   Vanilla JS only. No jQuery, no external libraries.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initFadeInOnScroll();
  initSmoothAnchorScroll();
  initLazyImages();
  initBeforeAfterSliders();
  initStickyShopBar();
  initFilterPills();
  initCollectionSort();
  initInfiniteScroll();
  initProductGallery();
  initProductVariantPicker();
  initQuantityStepper();
  initProductTabs();
  initAnnouncementBar();
  initMobileNav();
  initCartDrawer();
  initCartIcon();
  initPredictiveSearch();
  initCopyLinkButtons();
  initNewsletterPopup();
  initAuthFormToggle();
  initConfirmSubmit();
  initQuickView();
  initStickyAddToCart();
  initImageZoom();
  initRecentlyViewed();
});

/* Shared body-scroll lock for the mobile nav drawer and cart drawer (counted,
   so one drawer closing doesn't re-enable scroll while another is open). */
var gpScrollLockCount = 0;
function gpLockBodyScroll() {
  gpScrollLockCount++;
  document.body.style.overflow = 'hidden';
}
function gpUnlockBodyScroll() {
  gpScrollLockCount = Math.max(0, gpScrollLockCount - 1);
  if (gpScrollLockCount === 0) document.body.style.overflow = '';
}

function gpEscapeHtml(value) {
  var div = document.createElement('div');
  div.textContent = value;
  return div.innerHTML;
}

/* Fade sections/cards in as they enter the viewport. */
function initFadeInOnScroll() {
  var targets = document.querySelectorAll('.gp-fade-in');
  if (!targets.length) return;

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  targets.forEach(function (el) { observer.observe(el); });
}

/* Smooth-scroll for same-page anchor links. */
function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href').slice(1);
      if (!id) return;
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* Lazy-load non-critical images that don't already use native loading. */
function initLazyImages() {
  document.querySelectorAll('img[data-gp-lazy]').forEach(function (img) {
    img.loading = 'lazy';
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
  });
}

/* Before/after drag slider used by the Solution section. */
function initBeforeAfterSliders() {
  document.querySelectorAll('[data-gp-before-after]').forEach(function (slider) {
    var handle = slider.querySelector('[data-gp-slider-handle]');
    var afterPane = slider.querySelector('[data-gp-slider-after]');
    if (!handle || !afterPane) return;

    var dragging = false;

    function setPosition(clientX) {
      var rect = slider.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      afterPane.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
    }

    function onMove(e) {
      if (!dragging) return;
      var clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(clientX);
    }

    handle.addEventListener('mousedown', function () { dragging = true; });
    handle.addEventListener('touchstart', function () { dragging = true; }, { passive: true });
    window.addEventListener('mouseup', function () { dragging = false; });
    window.addEventListener('touchend', function () { dragging = false; });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });

    handle.addEventListener('keydown', function (e) {
      var rect = slider.getBoundingClientRect();
      var current = handle.getBoundingClientRect().left - rect.left;
      var pct = (current / rect.width) * 100;
      if (e.key === 'ArrowLeft') { setPosition(rect.left + rect.width * ((pct - 5) / 100)); }
      if (e.key === 'ArrowRight') { setPosition(rect.left + rect.width * ((pct + 5) / 100)); }
    });
  });
}

/* Optional mobile sticky "Shop Now" bar, shown after scrolling past the hero. */
function initStickyShopBar() {
  var bar = document.querySelector('[data-gp-sticky-bar]');
  var hero = document.querySelector('[data-gp-hero]');
  if (!bar || !hero) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      bar.classList.toggle('is-visible', !entry.isIntersecting);
    });
  }, { threshold: 0 });

  observer.observe(hero);
}

/* Collection page sort-by dropdown — submits the native ?sort_by= param. */
function initCollectionSort() {
  document.querySelectorAll('[data-gp-sort-select]').forEach(function (select) {
    select.addEventListener('change', function () {
      select.closest('form').submit();
    });
  });
}

/* Collection page infinite scroll — fetches and appends the next page of products. */
function initInfiniteScroll() {
  document.querySelectorAll('[data-gp-infinite-scroll]').forEach(function (grid) {
    if (!('IntersectionObserver' in window)) return;

    var sentinel = document.createElement('div');
    grid.after(sentinel);
    var loading = false;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) loadNextPage();
      });
    }, { rootMargin: '400px' });

    observer.observe(sentinel);

    function loadNextPage() {
      var nextUrl = grid.dataset.gpNextUrl;
      if (loading || !nextUrl) return;
      loading = true;

      fetch(nextUrl)
        .then(function (response) { return response.text(); })
        .then(function (html) {
          var doc = new DOMParser().parseFromString(html, 'text/html');
          var nextGrid = doc.getElementById(grid.id);
          if (!nextGrid) return;

          nextGrid.querySelectorAll(':scope > .gp-product-card').forEach(function (card) {
            grid.appendChild(card);
          });

          if (nextGrid.dataset.gpNextUrl) {
            grid.dataset.gpNextUrl = nextGrid.dataset.gpNextUrl;
          } else {
            grid.removeAttribute('data-gp-next-url');
            observer.unobserve(sentinel);
          }
        })
        .finally(function () { loading = false; });
    }
  });
}

/* Product page image gallery — clicking a thumbnail swaps the main image. */
function initProductGallery() {
  document.querySelectorAll('[data-gp-product-gallery]').forEach(function (gallery) {
    var main = gallery.querySelector('[data-gp-gallery-main]');
    var thumbs = gallery.querySelectorAll('[data-gp-gallery-thumb]');
    if (!main || !thumbs.length) return;

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        thumbs.forEach(function (t) { t.classList.remove('is-active'); });
        thumb.classList.add('is-active');
        main.src = thumb.dataset.full;
      });
    });
  });
}

/* Wires up a single product form — matches selected options against the
   embedded product.variants JSON and updates price, image, and cart state.
   Extracted from initProductVariantPicker so the same wiring can be re-run
   on markup injected later (e.g. the quick-view modal's fetched content —
   see initQuickView). Also toggles the back-in-stock form (Feature 4b)
   when the matched variant is unavailable. */
function gpInitProductForm(form) {
  var variantsScript = form.querySelector('[data-gp-product-variants]');
  if (!variantsScript) return;

  var variants;
  try {
    variants = JSON.parse(variantsScript.textContent);
  } catch (e) {
    return;
  }

  var optionCount = parseInt(form.dataset.gpOptionCount, 10) || 0;
  var variantIdInput = form.querySelector('[data-gp-variant-id]');
  var priceCurrent = form.parentElement.querySelector('[data-gp-price-current]');
  var comparePrice = form.parentElement.querySelector('[data-gp-compare-price]');
  var addToCartBtn = form.querySelector('[data-gp-add-to-cart]');
  var addToCartText = form.querySelector('[data-gp-add-to-cart-text]');
  var gallery = form.closest('.gp-product__layout') || form.closest('.gp-quick-view-content') || document;
  var galleryMain = gallery.querySelector('[data-gp-gallery-main]');
  var galleryThumbs = gallery.querySelectorAll('[data-gp-gallery-thumb]');
  var backInStock = form.parentElement.querySelector('[data-gp-back-in-stock]');
  var backInStockBodyInput = backInStock ? backInStock.querySelector('[data-gp-back-in-stock-body]') : null;
  var backInStockProductTitle = backInStock ? backInStock.dataset.productTitle : '';

  function formatMoney(cents) {
    return (cents / 100).toLocaleString(undefined, { style: 'currency', currency: window.Shopify && Shopify.currency ? Shopify.currency.active : 'USD' });
  }

  function selectedOptions() {
    var selected = [];
    for (var i = 1; i <= optionCount; i++) {
      var checked = form.querySelector('input[name="option-' + i + '"]:checked');
      selected.push(checked ? checked.value : null);
    }
    return selected;
  }

  function findMatch(selected) {
    return variants.filter(function (variant) {
      for (var i = 0; i < optionCount; i++) {
        if (variant['option' + (i + 1)] !== selected[i]) return false;
      }
      return true;
    })[0];
  }

  function updateSwatchAndPillState() {
    form.querySelectorAll('.gp-product__size-pill, .gp-product__swatch').forEach(function (el) {
      var input = el.querySelector('input');
      el.classList.toggle('is-active', !!(input && input.checked));
    });
  }

  function toggleBackInStock(variant) {
    if (!backInStock) return;
    var show = !!variant && !variant.available;
    backInStock.hidden = !show;
    form.hidden = show;
    if (show && backInStockBodyInput) {
      backInStockBodyInput.value = 'Back-in-stock request for ' + backInStockProductTitle +
        ' — ' + variant.title + ' (variant ID: ' + variant.id + ')';
    }
  }

  function onOptionChange() {
    updateSwatchAndPillState();
    var variant = findMatch(selectedOptions());

    if (!variant) {
      if (variantIdInput) variantIdInput.value = '';
      if (addToCartBtn) addToCartBtn.disabled = true;
      if (addToCartText) addToCartText.textContent = 'Unavailable';
      toggleBackInStock(null);
      return;
    }

    if (variantIdInput) variantIdInput.value = variant.id;

    if (priceCurrent) priceCurrent.textContent = formatMoney(variant.price);
    if (comparePrice) {
      if (variant.compare_at_price && variant.compare_at_price > variant.price) {
        comparePrice.textContent = formatMoney(variant.compare_at_price);
        comparePrice.style.display = '';
      } else {
        comparePrice.style.display = 'none';
      }
    }

    if (addToCartBtn) addToCartBtn.disabled = !variant.available;
    if (addToCartText) {
      addToCartText.textContent = variant.available
        ? 'Add to Cart — ' + formatMoney(variant.price)
        : 'Sold Out';
    }

    if (variant.featured_image && galleryMain) {
      galleryMain.src = variant.featured_image.src;
      galleryThumbs.forEach(function (thumb) {
        thumb.classList.toggle('is-active', String(thumb.dataset.imageId) === String(variant.featured_image.id));
      });
    }

    toggleBackInStock(variant);
  }

  form.querySelectorAll('[data-gp-option-input]').forEach(function (input) {
    input.addEventListener('change', onOptionChange);
  });

  toggleBackInStock(variants.filter(function (v) { return String(v.id) === String(variantIdInput && variantIdInput.value); })[0]);
}

/* Product page variant picker — matches selected options against the
   embedded product.variants JSON and updates price, image, and cart state. */
function initProductVariantPicker() {
  document.querySelectorAll('[data-gp-product-form]').forEach(gpInitProductForm);
}

/* Wires up a single quantity stepper. Extracted from initQuantityStepper so
   it can also be run against markup injected into the quick-view modal. */
function gpInitQtyStepper(stepper) {
  var input = stepper.querySelector('[data-gp-qty-input]');
  var decrease = stepper.querySelector('[data-gp-qty-decrease]');
  var increase = stepper.querySelector('[data-gp-qty-increase]');
  if (!input) return;

  decrease.addEventListener('click', function () {
    var value = Math.max(1, (parseInt(input.value, 10) || 1) - 1);
    input.value = value;
  });
  increase.addEventListener('click', function () {
    var value = (parseInt(input.value, 10) || 1) + 1;
    input.value = value;
  });
}

/* Product page quantity stepper. */
function initQuantityStepper() {
  document.querySelectorAll('[data-gp-qty-stepper]').forEach(gpInitQtyStepper);
}

/* Product page description/specs/shipping/reviews tabs. */
function initProductTabs() {
  document.querySelectorAll('[data-gp-product-tabs]').forEach(function (tabs) {
    var triggers = tabs.querySelectorAll('[data-gp-tab-trigger]');
    var panels = tabs.querySelectorAll('[data-gp-tab-panel]');

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        triggers.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        panels.forEach(function (p) { p.classList.remove('is-active'); });

        trigger.classList.add('is-active');
        trigger.setAttribute('aria-selected', 'true');
        tabs.querySelector('[data-gp-tab-panel="' + trigger.dataset.gpTabTrigger + '"]').classList.add('is-active');
      });
    });
  });
}

/* Product showcase filter pills — client-side show/hide by collection tag. */
function initFilterPills() {
  document.querySelectorAll('[data-gp-filter-group]').forEach(function (group) {
    var pills = group.querySelectorAll('[data-gp-filter]');
    var grid = document.querySelector(group.dataset.gpFilterGroup);
    if (!grid) return;
    var cards = grid.querySelectorAll('[data-gp-tags]');

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        pills.forEach(function (p) { p.classList.remove('is-active'); });
        pill.classList.add('is-active');
        var filter = pill.dataset.gpFilter;

        cards.forEach(function (card) {
          var tags = (card.dataset.gpTags || '').split(',');
          var show = filter === 'all' || tags.indexOf(filter) !== -1;
          card.style.display = show ? '' : 'none';
        });
      });
    });
  });
}

/* Announcement bar — dismiss state stored in sessionStorage so it stays
   hidden for the rest of the visit but reappears next session. */
function initAnnouncementBar() {
  var bar = document.querySelector('[data-gp-announcement-bar]');
  if (!bar) return;

  var key = bar.dataset.gpAnnouncementKey;
  var closeBtn = bar.querySelector('[data-gp-announcement-close]');

  try {
    if (key && sessionStorage.getItem(key) === 'dismissed') {
      bar.classList.add('is-hidden');
    }
  } catch (e) {}

  if (closeBtn) {
    closeBtn.addEventListener('click', function () {
      bar.classList.add('is-hidden');
      try {
        if (key) sessionStorage.setItem(key, 'dismissed');
      } catch (e) {}
    });
  }
}

/* Mobile navigation drawer — slide-in from left, overlay/Escape/close-button
   dismissal, body scroll lock while open. */
function initMobileNav() {
  var toggle = document.querySelector('[data-gp-mobile-nav-open]');
  var drawer = document.querySelector('[data-gp-mobile-nav-drawer]');
  var overlay = document.querySelector('[data-gp-mobile-nav-overlay]');
  var closeBtn = document.querySelector('[data-gp-mobile-nav-close]');
  if (!toggle || !drawer || !overlay) return;

  function open() {
    drawer.classList.remove('is-closed');
    drawer.classList.add('is-open');
    drawer.removeAttribute('inert');
    overlay.hidden = false;
    requestAnimationFrame(function () { overlay.classList.add('is-visible'); });
    toggle.setAttribute('aria-expanded', 'true');
    gpLockBodyScroll();
  }

  function close() {
    drawer.classList.remove('is-open');
    drawer.classList.add('is-closed');
    drawer.setAttribute('inert', '');
    overlay.classList.remove('is-visible');
    toggle.setAttribute('aria-expanded', 'false');
    gpUnlockBodyScroll();
    setTimeout(function () {
      if (drawer.classList.contains('is-closed')) overlay.hidden = true;
    }, 320);
  }

  toggle.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) close();
  });
  drawer.querySelectorAll('.gp-mobile-nav-link').forEach(function (link) {
    link.addEventListener('click', close);
  });
}

/* Shared cart-drawer helpers, promoted to module scope (rather than kept as
   closures inside initCartDrawer) so other entry points — the quick-view
   modal's add-to-cart form, for instance — can add an item and open/refresh
   the same drawer without needing their own copy of this wiring. */
function gpCartDrawerEl() { return document.querySelector('[data-gp-cart-drawer]'); }
function gpCartOverlayEl() { return document.querySelector('[data-gp-cart-overlay]'); }

function gpUpdateCartBadge(count) {
  document.querySelectorAll('[data-gp-cart-count]').forEach(function (el) {
    el.textContent = count;
  });
}

function gpRefreshCartCount() {
  fetch('/cart.js')
    .then(function (res) { return res.json(); })
    .then(function (cart) { gpUpdateCartBadge(cart.item_count); })
    .catch(function () {});
}

function gpOpenCartDrawer() {
  var drawer = gpCartDrawerEl();
  var overlay = gpCartOverlayEl();
  if (!drawer || !overlay) return;
  drawer.classList.remove('is-closed');
  drawer.classList.add('is-open');
  drawer.removeAttribute('inert');
  overlay.hidden = false;
  requestAnimationFrame(function () { overlay.classList.add('is-visible'); });
  document.querySelectorAll('[data-gp-cart-open]').forEach(function (btn) { btn.setAttribute('aria-expanded', 'true'); });
  gpLockBodyScroll();
}

function gpCloseCartDrawer() {
  var drawer = gpCartDrawerEl();
  var overlay = gpCartOverlayEl();
  if (!drawer || !overlay) return;
  drawer.classList.remove('is-open');
  drawer.classList.add('is-closed');
  drawer.setAttribute('inert', '');
  overlay.classList.remove('is-visible');
  document.querySelectorAll('[data-gp-cart-open]').forEach(function (btn) { btn.setAttribute('aria-expanded', 'false'); });
  gpUnlockBodyScroll();
  setTimeout(function () {
    if (drawer.classList.contains('is-closed')) overlay.hidden = true;
  }, 320);
}

function gpBindCartDrawerContentEvents() {
  var drawer = gpCartDrawerEl();
  if (!drawer) return;

  drawer.querySelectorAll('[data-gp-cart-close]').forEach(function (btn) {
    btn.addEventListener('click', gpCloseCartDrawer);
  });

  drawer.querySelectorAll('[data-gp-cart-qty-stepper]').forEach(function (stepper) {
    var line = parseInt(stepper.dataset.line, 10);
    var input = stepper.querySelector('[data-gp-cart-qty-input]');
    var decrease = stepper.querySelector('[data-gp-cart-qty-decrease]');
    var increase = stepper.querySelector('[data-gp-cart-qty-increase]');
    if (!input) return;

    decrease.addEventListener('click', function () {
      gpChangeCartLine(line, Math.max(0, (parseInt(input.value, 10) || 1) - 1));
    });
    increase.addEventListener('click', function () {
      gpChangeCartLine(line, (parseInt(input.value, 10) || 1) + 1);
    });
    input.addEventListener('change', function () {
      gpChangeCartLine(line, Math.max(0, parseInt(input.value, 10) || 0));
    });
  });

  drawer.querySelectorAll('[data-gp-cart-remove]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      gpChangeCartLine(parseInt(btn.dataset.line, 10), 0);
    });
  });
}

function gpApplyCartSectionHtml(html) {
  var drawer = gpCartDrawerEl();
  if (!drawer) return;
  var doc = new DOMParser().parseFromString(html, 'text/html');
  var newDrawer = doc.querySelector('[data-gp-cart-drawer]');
  if (!newDrawer) return;
  drawer.innerHTML = newDrawer.innerHTML;
  gpBindCartDrawerContentEvents();
}

function gpChangeCartLine(line, quantity) {
  var drawer = gpCartDrawerEl();
  var sectionId = drawer ? drawer.dataset.sectionId : '';
  fetch('/cart/change.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ line: line, quantity: quantity, sections: sectionId })
  })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.sections && data.sections[sectionId]) gpApplyCartSectionHtml(data.sections[sectionId]);
      gpRefreshCartCount();
    })
    .catch(function () {});
}

/* Adds a product form's data to the cart via AJAX, then refreshes the
   drawer contents + badge count and opens the drawer. Used by both the
   main product-page add-to-cart form (bound below) and the quick-view
   modal's form (see initQuickView), which is injected after page load. */
function gpSubmitAddToCart(form) {
  var drawer = gpCartDrawerEl();
  var sectionId = drawer ? drawer.dataset.sectionId : '';
  var formData = new FormData(form);
  if (sectionId) formData.append('sections', sectionId);

  return fetch('/cart/add.js', { method: 'POST', body: formData })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (data.sections && sectionId && data.sections[sectionId]) gpApplyCartSectionHtml(data.sections[sectionId]);
      gpRefreshCartCount();
      gpOpenCartDrawer();
      return data;
    });
}

/* Slide-out cart drawer — opens on add-to-cart or the nav cart icon, adjusts
   quantities and removes lines via AJAX (/cart/change.js), and re-renders
   itself from the Section Rendering API response so markup/schema settings
   stay in sync without a full page reload. */
function initCartDrawer() {
  var drawer = gpCartDrawerEl();
  var overlay = gpCartOverlayEl();
  if (!drawer || !overlay) return;

  document.querySelectorAll('[data-gp-cart-open]').forEach(function (btn) { btn.addEventListener('click', gpOpenCartDrawer); });
  overlay.addEventListener('click', gpCloseCartDrawer);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) gpCloseCartDrawer();
  });

  gpBindCartDrawerContentEvents();

  /* Intercept product-page add-to-cart forms so they open the drawer
     instead of doing a full-page form submit/reload. */
  document.querySelectorAll('[data-gp-product-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      gpSubmitAddToCart(form).catch(function () {});
    });
  });
}

/* Syncs the nav cart count badge from Shopify's cart on page load (keeps
   the badge correct after back/forward navigation from the browser cache). */
function initCartIcon() {
  var badges = document.querySelectorAll('[data-gp-cart-count]');
  if (!badges.length) return;

  fetch('/cart.js')
    .then(function (res) { return res.json(); })
    .then(function (cart) {
      badges.forEach(function (el) { el.textContent = cart.item_count; });
    })
    .catch(function () {});
}

/* Predictive search dropdown — live product + collection suggestions from
   Shopify's native /search/suggest.json (no app required) as the visitor
   types in the search hero's refine field. Note: suggest.json returns
   product prices as shop-money-formatted strings already, not cents, so
   they're rendered as-is rather than run through a money formatter. */
function initPredictiveSearch() {
  document.querySelectorAll('[data-gp-predictive-search]').forEach(function (input) {
    var form = input.closest('form');
    var resultsBox = form ? form.querySelector('[data-gp-predictive-search-results]') : null;
    var listEl = resultsBox ? resultsBox.querySelector('[data-gp-predictive-search-list]') : null;
    var loadingEl = resultsBox ? resultsBox.querySelector('[data-gp-predictive-search-loading]') : null;
    if (!form || !resultsBox || !listEl || !loadingEl) return;

    var debounceTimer;
    var activeIndex = -1;

    function closeResults() {
      resultsBox.classList.remove('is-active');
      input.setAttribute('aria-expanded', 'false');
      activeIndex = -1;
      setTimeout(function () {
        if (!resultsBox.classList.contains('is-active')) resultsBox.hidden = true;
      }, 180);
    }

    function openResults() {
      resultsBox.hidden = false;
      requestAnimationFrame(function () { resultsBox.classList.add('is-active'); });
      input.setAttribute('aria-expanded', 'true');
    }

    function setActive(index) {
      var items = resultsBox.querySelectorAll('[data-gp-predictive-search-item]');
      if (!items.length) return;
      activeIndex = ((index % items.length) + items.length) % items.length;
      items.forEach(function (item, i) { item.classList.toggle('is-active', i === activeIndex); });
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    }

    function renderResults(data, term) {
      var products = (data.resources && data.resources.results && data.resources.results.products) || [];
      var collections = (data.resources && data.resources.results && data.resources.results.collections) || [];

      if (!products.length && !collections.length) {
        listEl.innerHTML = '<p class="gp-predictive-search__empty">No results found for &ldquo;' + gpEscapeHtml(term) + '&rdquo;</p>';
        openResults();
        return;
      }

      var html = '';

      if (collections.length) {
        html += '<div class="gp-predictive-search__group">';
        html += '<p class="gp-predictive-search__group-label">Collections</p>';
        collections.slice(0, 3).forEach(function (collection) {
          html += '<a href="' + gpEscapeHtml(collection.url) + '" class="gp-predictive-search__item gp-predictive-search__item--collection" data-gp-predictive-search-item>' +
            '<span class="gp-predictive-search__item-title">' + gpEscapeHtml(collection.title) + '</span>' +
          '</a>';
        });
        html += '</div>';
      }

      if (products.length) {
        html += '<div class="gp-predictive-search__group">';
        html += '<p class="gp-predictive-search__group-label">Products</p>';
        products.slice(0, 6).forEach(function (product) {
          html += '<a href="' + gpEscapeHtml(product.url) + '" class="gp-predictive-search__item" data-gp-predictive-search-item>' +
            '<span class="gp-predictive-search__item-image">' + (product.image ? '<img src="' + gpEscapeHtml(product.image) + '" alt="" loading="lazy">' : '') + '</span>' +
            '<span class="gp-predictive-search__item-info">' +
              '<span class="gp-predictive-search__item-title">' + gpEscapeHtml(product.title) + '</span>' +
              '<span class="gp-predictive-search__item-price">' + gpEscapeHtml(product.price) + '</span>' +
            '</span>' +
          '</a>';
        });
        html += '</div>';
      }

      html += '<a href="' + form.getAttribute('action') + '?q=' + encodeURIComponent(term) +
        '" class="gp-predictive-search__footer" data-gp-predictive-search-item>View all results for &ldquo;' + gpEscapeHtml(term) + '&rdquo;</a>';

      listEl.innerHTML = html;
      openResults();
    }

    function fetchResults(term) {
      loadingEl.hidden = false;
      resultsBox.classList.add('is-loading');
      openResults();

      fetch('/search/suggest.json?q=' + encodeURIComponent(term) + '&resources[type]=product,collection&resources[limit]=6')
        .then(function (res) { return res.json(); })
        .then(function (data) {
          loadingEl.hidden = true;
          resultsBox.classList.remove('is-loading');
          renderResults(data, term);
        })
        .catch(function () {
          loadingEl.hidden = true;
          resultsBox.classList.remove('is-loading');
        });
    }

    input.addEventListener('input', function () {
      clearTimeout(debounceTimer);
      var term = input.value.trim();
      if (term.length < 2) {
        closeResults();
        return;
      }
      debounceTimer = setTimeout(function () { fetchResults(term); }, 300);
    });

    input.addEventListener('focus', function () {
      var term = input.value.trim();
      if (term.length >= 2 && listEl.innerHTML) openResults();
    });

    input.addEventListener('blur', function () {
      setTimeout(closeResults, 200);
    });

    input.addEventListener('keydown', function (e) {
      if (resultsBox.hidden) return;
      var items = resultsBox.querySelectorAll('[data-gp-predictive-search-item]');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(activeIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(activeIndex - 1);
      } else if (e.key === 'Enter') {
        if (activeIndex > -1 && items[activeIndex]) {
          e.preventDefault();
          window.location.href = items[activeIndex].getAttribute('href');
        }
      } else if (e.key === 'Escape') {
        closeResults();
      }
    });
  });
}

/* Product quick-view modal — clicking any `.gp-quick-view-trigger` (added to
   collection-grid product cards) re-fetches the gp-quick-view section in the
   context of that product's own page via the Section Rendering API
   (`/products/{handle}?section_id=gp-quick-view`, which binds Liquid's
   `product` object) and swaps the returned `[data-gp-quick-view-content]`
   markup into the persistent modal shell rendered globally by theme.liquid.
   The injected form/stepper get the exact same wiring as the full product
   page via gpInitProductForm/gpInitQtyStepper, and submitting the form adds
   to cart via gpSubmitAddToCart, which opens the existing cart drawer. Uses
   event delegation for the trigger click so cards added later (e.g. by
   infinite scroll) work without any extra binding. */
function initQuickView() {
  var modal = document.querySelector('[data-gp-quick-view]');
  if (!modal) return;

  var overlay = modal.querySelector('[data-gp-quick-view-overlay]');
  var closeBtn = modal.querySelector('[data-gp-quick-view-close]');
  var content = modal.querySelector('[data-gp-quick-view-content]');
  if (!overlay || !closeBtn || !content) return;

  var loadedHandle = null;

  function bindContent() {
    var form = content.querySelector('[data-gp-product-form]');
    if (form) {
      gpInitProductForm(form);
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        gpSubmitAddToCart(form).then(close).catch(function () {});
      });
    }
    var stepper = content.querySelector('[data-gp-qty-stepper]');
    if (stepper) gpInitQtyStepper(stepper);
  }

  function open() {
    modal.removeAttribute('inert');
    requestAnimationFrame(function () { modal.classList.add('is-visible'); });
    gpLockBodyScroll();
  }

  function close() {
    modal.classList.remove('is-visible');
    modal.setAttribute('inert', '');
    gpUnlockBodyScroll();
  }

  function loadProduct(handle) {
    if (!handle) return;
    if (loadedHandle === handle) {
      open();
      return;
    }
    content.classList.add('is-loading');
    fetch('/products/' + handle + '?section_id=gp-quick-view')
      .then(function (res) { return res.text(); })
      .then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var newContent = doc.querySelector('[data-gp-quick-view-content]');
        if (!newContent) return;
        content.classList.remove('is-loading');
        content.innerHTML = newContent.innerHTML;
        loadedHandle = handle;
        bindContent();
        open();
      })
      .catch(function () { content.classList.remove('is-loading'); });
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('.gp-quick-view-trigger');
    if (!trigger) return;
    e.preventDefault();
    loadProduct(trigger.dataset.productHandle);
  });

  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal.classList.contains('is-visible')) close();
  });
}

/* Mobile sticky add-to-cart bar (product page) — shows once the real
   add-to-cart button has scrolled above the viewport (not just off-screen
   below it, which would also be true before the user ever reaches it on a
   long page). The bar's own button forwards a click to the real button
   instead of re-implementing cart-add, so disabled/sold-out state and the
   currently selected variant/quantity stay correct for free. Price is kept
   in sync with the real price element via MutationObserver since the
   variant picker updates it in place. */
function initStickyAddToCart() {
  var bar = document.querySelector('[data-gp-product-sticky-bar]');
  var mainBtn = document.querySelector('.gp-product__add-to-cart');
  if (!bar || !mainBtn || !('IntersectionObserver' in window)) return;

  var stickyBtn = bar.querySelector('[data-gp-sticky-add-to-cart]');
  var stickyPrice = bar.querySelector('[data-gp-sticky-price]');
  var mainPrice = document.querySelector('[data-gp-price-current]');

  if (stickyBtn) {
    stickyBtn.addEventListener('click', function () { mainBtn.click(); });
  }

  if (stickyPrice && mainPrice && 'MutationObserver' in window) {
    new MutationObserver(function () {
      stickyPrice.textContent = mainPrice.textContent;
    }).observe(mainPrice, { childList: true, characterData: true, subtree: true });
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      var scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      bar.classList.toggle('is-visible', scrolledPast);
    });
  }, { threshold: 0 });

  observer.observe(mainBtn);
}

/* Product image zoom — desktop hovers a lens that follows the cursor
   (CSS transform: scale with transform-origin tracking the pointer);
   touch devices tap to toggle a centered zoom instead. */
function initImageZoom() {
  var containers = document.querySelectorAll('[data-gp-image-zoom]');
  if (!containers.length) return;

  var isTouch = window.matchMedia('(pointer: coarse)').matches;

  containers.forEach(function (container) {
    var img = container.querySelector('img');
    if (!img) return;

    if (isTouch) {
      container.addEventListener('click', function () {
        container.classList.toggle('zoomed');
      });
      return;
    }

    container.addEventListener('mousemove', function (e) {
      var rect = container.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width) * 100;
      var y = ((e.clientY - rect.top) / rect.height) * 100;
      img.style.transformOrigin = x + '% ' + y + '%';
    });
    container.addEventListener('mouseenter', function () { container.classList.add('zoomed'); });
    container.addEventListener('mouseleave', function () {
      container.classList.remove('zoomed');
      img.style.transformOrigin = '';
    });
  });
}

/* Recently Viewed Products — tracks the current product page's handle in
   localStorage (deduped, most-recent-first, capped at 8 — independent of
   whether the display row is even on the page, via a tiny tracker element
   gp-product.liquid always renders), then populates any
   `[data-gp-recently-viewed]` rows by fetching each stored handle's data
   via the native `/products/{handle}.js` endpoint (no app required). */
function initRecentlyViewed() {
  var STORAGE_KEY = 'gp_recently_viewed';
  var MAX_ITEMS = 8;

  function readHandles() {
    try {
      var stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(stored) ? stored : [];
    } catch (e) {
      return [];
    }
  }

  function writeHandles(handles) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(handles)); } catch (e) {}
  }

  var tracker = document.querySelector('[data-gp-track-product-view]');
  if (tracker && tracker.dataset.gpTrackProductView) {
    var viewedHandle = tracker.dataset.gpTrackProductView;
    var handles = readHandles().filter(function (h) { return h !== viewedHandle; });
    handles.unshift(viewedHandle);
    writeHandles(handles.slice(0, MAX_ITEMS));
  }

  var containers = document.querySelectorAll('[data-gp-recently-viewed]');
  if (!containers.length) return;

  var storedHandles = readHandles();
  if (!storedHandles.length) return;

  function formatMoney(cents) {
    return (cents / 100).toLocaleString(undefined, { style: 'currency', currency: window.Shopify && Shopify.currency ? Shopify.currency.active : 'USD' });
  }

  containers.forEach(function (container) {
    var row = container.querySelector('[data-gp-recently-viewed-row]');
    if (!row) return;

    var excludeHandle = container.dataset.gpCurrentHandle;
    var displayHandles = storedHandles.filter(function (h) { return h !== excludeHandle; }).slice(0, MAX_ITEMS);
    if (!displayHandles.length) return;

    Promise.all(displayHandles.map(function (handle) {
      return fetch('/products/' + handle + '.js')
        .then(function (res) { return res.ok ? res.json() : null; })
        .catch(function () { return null; });
    })).then(function (products) {
      var html = products.filter(Boolean).map(function (product) {
        var image = product.featured_image || (product.images && product.images[0]);
        return '<a href="' + gpEscapeHtml(product.url) + '" class="gp-recently-viewed__card">' +
          '<span class="gp-recently-viewed__image">' + (image ? '<img src="' + gpEscapeHtml(image) + '" alt="" loading="lazy">' : '') + '</span>' +
          '<span class="gp-recently-viewed__title">' + gpEscapeHtml(product.title) + '</span>' +
          '<span class="gp-recently-viewed__price">' + formatMoney(product.price) + '</span>' +
        '</a>';
      }).join('');

      if (!html) return;
      row.innerHTML = html;
      container.hidden = false;
    });
  });
}

/* Article page "Copy Link" share button. */
function initCopyLinkButtons() {
  document.querySelectorAll('[data-gp-copy-link]').forEach(function (btn) {
    var label = btn.querySelector('span');
    var defaultText = label ? label.textContent : '';

    btn.addEventListener('click', function () {
      var url = btn.dataset.url;
      if (!navigator.clipboard) return;

      navigator.clipboard.writeText(url).then(function () {
        if (!label) return;
        label.textContent = 'Copied!';
        setTimeout(function () { label.textContent = defaultText; }, 2000);
      }).catch(function () {});
    });
  });
}

/* Newsletter signup popup — shows on exit-intent, a timed delay, or a scroll
   percentage (configurable per section), and stays dismissed via
   localStorage once closed or submitted. */
function initNewsletterPopup() {
  var popup = document.querySelector('[data-gp-newsletter-popup]');
  if (!popup) return;

  if (!popup.dataset.gpEnabled || popup.dataset.gpEnabled === 'false') return;

  var isMobile = window.matchMedia('(max-width: 767px)').matches;
  if (isMobile && popup.dataset.gpShowOnMobile === 'false') return;

  var storageKey = 'gpNewsletterPopupDismissed';
  try {
    if (localStorage.getItem(storageKey) === 'true') return;
  } catch (e) {}

  var closeBtn = popup.querySelector('[data-gp-popup-close]');
  var dismissLink = popup.querySelector('[data-gp-popup-dismiss]');
  var dontShowAgain = popup.querySelector('[data-gp-popup-dont-show]');
  var form = popup.querySelector('form');
  var triggerType = popup.dataset.gpTrigger || 'timed';
  var shown = false;

  function persistDismissed() {
    try {
      if (dontShowAgain && dontShowAgain.checked) {
        localStorage.setItem(storageKey, 'true');
      }
    } catch (e) {}
  }

  function open() {
    if (shown) return;
    shown = true;
    popup.classList.add('is-visible');
    popup.removeAttribute('inert');
    gpLockBodyScroll();
  }

  function close() {
    popup.classList.remove('is-visible');
    popup.setAttribute('inert', '');
    gpUnlockBodyScroll();
    persistDismissed();
  }

  if (closeBtn) closeBtn.addEventListener('click', close);
  popup.addEventListener('click', function (e) {
    if (e.target === popup) close();
  });
  if (dismissLink) {
    dismissLink.addEventListener('click', function (e) {
      e.preventDefault();
      close();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && popup.classList.contains('is-visible')) close();
  });

  if (form) {
    form.addEventListener('submit', function () {
      try { localStorage.setItem(storageKey, 'true'); } catch (e) {}
    });
  }

  if (triggerType === 'manual') return;

  if (triggerType === 'exit_intent') {
    document.addEventListener('mouseout', function (e) {
      if (!e.relatedTarget && e.clientY <= 0) open();
    });
  } else if (triggerType === 'scroll') {
    var scrollPct = parseInt(popup.dataset.gpScrollPercentage, 10) || 50;
    window.addEventListener('scroll', function () {
      var scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (scrolled >= scrollPct) open();
    });
  } else {
    var delay = (parseInt(popup.dataset.gpDelay, 10) || 15) * 1000;
    setTimeout(open, delay);
  }
}

/* Login page — swaps between the sign-in and recover-password panels
   without a page reload. */
function initAuthFormToggle() {
  document.querySelectorAll('[data-gp-auth-toggle]').forEach(function (wrap) {
    var panels = wrap.querySelectorAll('[data-gp-auth-panel]');

    wrap.querySelectorAll('[data-gp-auth-switch]').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var target = link.dataset.gpAuthSwitch;
        panels.forEach(function (panel) {
          var isTarget = panel.dataset.gpAuthPanel === target;
          panel.classList.toggle('is-active', isTarget);
          panel.hidden = !isTarget;
        });
      });
    });
  });
}

/* Confirmation prompt for destructive form submits (e.g. deleting a saved
   address) — reads its message from the submit button's data attribute. */
function initConfirmSubmit() {
  document.querySelectorAll('[data-gp-confirm]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (!window.confirm(btn.dataset.gpConfirm)) {
        e.preventDefault();
      }
    });
  });
}
