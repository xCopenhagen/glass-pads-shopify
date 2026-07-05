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
