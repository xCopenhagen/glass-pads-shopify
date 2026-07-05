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
});

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

/* Product page variant picker — matches selected options against the
   embedded product.variants JSON and updates price, image, and cart state. */
function initProductVariantPicker() {
  document.querySelectorAll('[data-gp-product-form]').forEach(function (form) {
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
    var gallery = form.closest('.gp-product__layout') || document;
    var galleryMain = gallery.querySelector('[data-gp-gallery-main]');
    var galleryThumbs = gallery.querySelectorAll('[data-gp-gallery-thumb]');

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

    function onOptionChange() {
      updateSwatchAndPillState();
      var variant = findMatch(selectedOptions());

      if (!variant) {
        if (variantIdInput) variantIdInput.value = '';
        if (addToCartBtn) addToCartBtn.disabled = true;
        if (addToCartText) addToCartText.textContent = 'Unavailable';
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
    }

    form.querySelectorAll('[data-gp-option-input]').forEach(function (input) {
      input.addEventListener('change', onOptionChange);
    });
  });
}

/* Product page quantity stepper. */
function initQuantityStepper() {
  document.querySelectorAll('[data-gp-qty-stepper]').forEach(function (stepper) {
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
  });
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
