You are continuing to build the "Glass Pads" Shopify theme — final polish and conversion optimization. The project is at /c/Users/Cole Hodgson/OneDrive/Desktop/Glass Pads Shopify on branch feature/homepage-liquid-build.

## READ FIRST
Read these files:
- assets/gp-theme.css (all styles, custom properties)
- assets/gp-theme.js (all existing JS init functions — add new functions to the existing DOMContentLoaded block)
- layout/theme.liquid (the head/body structure)
- sections/gp-product.liquid (for understanding the variant/form pattern)
- sections/gp-collection-grid.liquid (for the product card pattern)
- snippets/gp-icon.liquid, gp-button.liquid
- templates/product.json, templates/collection.json
- HOMEPAGE-MOCKUP.md (brand design system)
- CLAUDE.md (project conventions)

## WHAT TO BUILD — 5 features

### FEATURE 1: Product Quick-View Modal
A modal that opens from collection page product cards, showing product details + add-to-cart without navigating away.

**What to build:**

**sections/gp-quick-view.liquid**
A global section that renders a hidden modal on every page. It's included via theme.liquid.
- Hidden modal with dark overlay + centered white/dark card
- Content loaded dynamically via Shopify's Section Rendering API (/?sections=gp-quick-view&product=HANDLE)
- Structure when rendered:
  - Left: Product image (main image, single large view)
  - Right: Product title, price (with compare-at), short description, size pills (variant selector matching gp-product.liquid pattern), quantity, add-to-cart button, "View Full Details" link to product page
  - Close button top-right (X icon)
  - Scale-up fade-in animation
- Schema: heading, show_view_details (checkbox default true)
- Close on: X button, overlay click, Escape key
- Body scroll lock when open

**JS in gp-theme.js:**
- initQuickView() — opens modal when clicking a ".gp-quick-view-trigger" element
- Fetches product data via Section Rendering API: `/products/QUICK-VIEW-HANDLE/?sections=gp-quick-view`
- Injects returned HTML into the modal container
- Initializes variant selector, add-to-cart form, quantity adjust inside the modal
- Handles open/close state, scroll lock, Escape key

**Update sections/gp-collection-grid.liquid:**
- Add a "Quick View" button on product card hover (desktop) / tap (mobile)
- Add `.gp-quick-view-trigger` class with `data-product-handle="{{ product.handle }}"` attribute
- Style: small ghost button below product title, visible on card hover

**Update layout/theme.liquid:**
- Include `{% section 'gp-quick-view' %}` near the end of the body (before closing body tag)

**CSS classes:**
- .gp-quick-view-overlay, .gp-quick-view-modal, .gp-quick-view-content
- .gp-quick-view-image, .gp-quick-view-info
- .gp-quick-view-close
- .gp-quick-view.is-open / .gp-quick-view.is-closed animations
- Responsive: full-screen on mobile, centered card on desktop (max-width 900px)

### FEATURE 2: Mobile Sticky Add-to-Cart + Product Image Zoom

**2a: Mobile Sticky Add-to-Cart Bar (sections/gp-product.liquid)**
Add to the existing gp-product section:
- A fixed bottom bar that appears only on mobile when the user scrolls past the main add-to-cart button
- Shows: product thumbnail (small), product title, price, "Add to Cart" button
- Slides up from bottom with smooth animation
- Trigger: IntersectionObserver watches the main add-to-cart button; when it scrolls out of view, the sticky bar appears
- Style: Void Black background, hairline top border, same glass-morphism as the nav
- Only visible on mobile (max-width: 767px)

**2b: Product Image Zoom (assets/gp-theme.js + gp-theme.css)**
- On desktop: hover-to-zoom on the main product image
  - When hovering over main product image, a magnified lens follows the cursor
  - Uses CSS transform: scale(1.8) with transform-origin tracking mouse position
  - Smooth transition
- On mobile: tap-to-zoom (toggle) — tapping the main image toggles a zoomed view
- CSS: .gp-product__main-image.zoom-container, .gp-product__main-image.zoomed with overflow hidden
- JS: initImageZoom() in gp-theme.js

### FEATURE 3: Predictive Search Dropdown
A live search dropdown that appears when typing in the search input.

**What to build:**

**Update sections/gp-search-hero.liquid:**
- Change the search input to have data-gp-predictive-search attribute
- Below the input, add a hidden dropdown container: .gp-predictive-search-results
- The dropdown shows: product results (image, title, price), collection results, "View all results for [query]" link
- Results fetched from Shopify's /search/suggest.json endpoint (native, no app needed)
- Debounced input (300ms delay)
- Max 6 product suggestions
- Dropdown appears on focus + input, disappears on blur (with 200ms delay for click capture)
- Keyboard support: ArrowDown/ArrowUp to navigate, Enter to select, Escape to close
- Loading state: subtle spinner/indicator while fetching
- Empty state: "No results found for [query]"
- Style: Glass-morphism dropdown, matches the brand design system
- Mobile: full-width dropdown below the search input

**JS: initPredictiveSearch() in gp-theme.js**
- Fetch from /search/suggest.json?q=QUERY&resources[type]=product,collection&resources[limit]=6
- Parse response, build HTML for results
- Handle keyboard navigation
- Handle click outside to close

**CSS:**
- .gp-predictive-search, .gp-predictive-search__results, .gp-predictive-search__item
- .gp-predictive-search__item-image, .gp-predictive-search__item-info
- .gp-predictive-search__footer
- .gp-predictive-search.is-active/is-loading

### FEATURE 4: Collection Filtering + Back-in-Stock

**4a: Enhanced Collection Filtering**
Update gp-collection-grid.liquid to add:
- Filter sidebar/top bar with:
  - Size filter: checkboxes for "Standard 9×9″" and "XL Desk 2:1" (maps to product tags)
  - Artwork type filter: "Monochrome", "Gradient", "Geometric", "Abstract", "Artist Collab" (maps to product tags)
  - Filter chips showing active filters with X to remove
- Uses Shopify's native tag filtering via /collections/COLLECTION/TAG_HANDLE
- Filter state reflected in URL params for shareability
- Reset/Clear all filters button
- Responsive: horizontal scroll pills on mobile, sidebar on desktop
- Only show filters that have available products

**4b: Back-in-Stock Form**
Add to gp-product.liquid at the variant selector area (shown only when a variant is unavailable/sold out):
- "Notify Me When Available" section replaces the add-to-cart button when variant is unavailable
- Email input + "Notify Me" button
- Uses Shopify's native {% form 'contact' %} with hidden fields:
  - Product title, variant title, variant ID in the message body
- Success message: "We'll let you know when this is back in stock."
- Clean, minimal styling matching the brand
- Schema: enable_back_in_stock (checkbox, default true), back_in_stock_heading, back_in_stock_button_text, back_in_stock_success

### FEATURE 5: Recently Viewed + Final Polish

**5a: Recently Viewed Products (snippets/gp-recently-viewed.liquid)**
A snippet that can be included anywhere to show recently viewed products.
- Uses localStorage to store last 8 product handles
- Each product page visit pushes the current product handle (deduped, most recent first)
- Renders a horizontal scroll row of product cards
- Heading: "Recently Viewed"
- Each card: image, title, price
- Only shown if there are recently viewed products
- Max 8 items

**Update templates/product.json:**
- Add recently viewed section below the cross-sell section

**JS: initRecentlyViewed() in gp-theme.js**
- On product page: store product handle to localStorage (gp_recently_viewed array)
- Deduplicate, keep max 8
- Render from snippet on any page

**5b: Final Polish Pass**
- Scan all 40+ sections for any missing responsive styles (mobile-first audit)
- Ensure all buttons have hover states
- Ensure all interactive elements have focus states for accessibility
- Add `gp-fade-in` to any remaining cards/sections that are below the fold
- Ensure all section schema includes proper `presets` so they appear in the theme editor

## GIT WORKFLOW
Commit each feature separately:
```
git add -A
git commit -m "gp-quickview: product quick-view modal with section rendering API"
```
Then the others.

Feature 1 → "gp-quickview: product quick-view modal with section rendering API"
Feature 2 → "gp-product-optimizations: sticky mobile add-to-cart + image zoom"
Feature 3 → "gp-predictive-search: live search dropdown with suggestions"
Feature 4 → "gp-filters-backinstock: collection tag filters + back-in-stock form"
Feature 5 → "gp-recently-viewed: recently viewed products + polish pass"

## QUALITY
- ALL features must use vanilla JS (no jQuery, no libraries)
- Quick-view uses Shopify's Section Rendering API for dynamic content loading
- Predictive search uses /search/suggest.json (native Shopify, no app)
- Back-in-stock uses native Shopify contact form
- Recently viewed uses localStorage
- Every section/element must be responsive
- Follow the brand design system exactly (Void Black #0A0A0C, Glass Cyan #5EE6D9, etc.)
- All interactive elements need keyboard and screen reader support where applicable