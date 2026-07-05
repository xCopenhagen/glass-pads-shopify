You are upgrading the "Glass Pads" Shopify theme with critical remaining features. The project is at /c/Users/Cole Hodgson/OneDrive/Desktop/Glass Pads Shopify on branch feature/homepage-liquid-build.

## READ FIRST
Read these files to understand the existing codebase:
- assets/gp-theme.css (all styles, custom properties)
- assets/gp-theme.js (existing JS — init functions)
- snippets/gp-icon.liquid, gp-button.liquid
- layout/theme.liquid (the head/body structure — this will need updates)
- templates/index.json, templates/product.json, templates/collection.json
- HOMEPAGE-MOCKUP.md (brand copy, design system)
- CLAUDE.md (project conventions)

## WHAT TO BUILD — 6 features, ~12 files

### FEATURE 1: Mobile Navigation Drawer
A slide-out navigation drawer for mobile screens.

**What to build:**
- Update layout/theme.liquid to include:
  - A fixed mobile nav toggle button (hamburger icon) visible only on mobile
  - A slide-out drawer with full-screen overlay
  - Uses Shopify's native linklist for nav items
  - Glass Pads logo at top of drawer
  - Nav links: Home, Shop All, Artist Collection, Custom Artwork, Gallery, About, Contact
  - "Shop Glass Pads" CTA button at bottom of drawer
  - Social links (Instagram, TikTok, YouTube, X) at bottom
  - Close button (X icon) in top-right
  - Smooth slide-in/out animation (translateX)
- Add styles to gp-theme.css:
  - .gp-mobile-nav-toggle (hamburger button, hidden on desktop)
  - .gp-mobile-nav-overlay (dark overlay behind drawer)
  - .gp-mobile-nav-drawer (slide-out panel from left)
  - .gp-mobile-nav-drawer.is-open (translateX(0))
  - .gp-mobile-nav-drawer.is-closed (translateX(-100%))
  - .gp-mobile-nav-link, .gp-mobile-nav-cta
  - Close button styles
  - Responsive: hidden on desktop (display:none on .gp-mobile-nav* at ≥768px), visible on mobile
- Add JS to gp-theme.js:
  - initMobileNav() — toggle drawer, overlay click closes, Escape key closes
  - Body scroll lock when drawer is open

### FEATURE 2: Announcement Bar
A top-of-page announcement banner for promotions, shipping info, etc.

**What to build:**
- Add to layout/theme.liquid directly above the nav bar:
  - A thin full-width bar (40px height)
  - Text content: "Free Shipping on All Orders  •  30-Day Glide Guarantee"
  - Can be dismissed with X button (stores closed state in sessionStorage)
  - Slide-up animation on dismiss
- Schema settings in theme.liquid or as a standalone section:
  - text, show_announcement (checkbox), dismissible (checkbox), background_color (color picker), text_color (color picker)
- Add to gp-theme.css:
  - .gp-announcement-bar (fixed 40px height, centered text, small font)
  - .gp-announcement-bar__close
  - .gp-announcement-bar.is-hidden (slides up and hides)
- Add to gp-theme.js:
  - initAnnouncementBar() — close button handler with sessionStorage

### FEATURE 3: Slide-Out Cart Drawer
A cart drawer that slides out when adding items to cart.

**What to build:**
- sections/gp-cart-drawer.liquid — Cart drawer section
- Uses Shopify's native {% form 'cart' %} and cart object
- Right-side slide-out panel, full height
- Content:
  - Header: "Your Cart" + item count + close button
  - Cart line items: image, title, variant, price, quantity adjust (minus/input/plus), remove button
  - Subtotal with shipping note
  - "Checkout" button (full-width, cyan)
  - "Continue Shopping" link
  - Empty state: "Your cart is empty" with "Shop Glass Pads" CTA
  - Free shipping threshold bar (e.g., "Add $30 more for free shipping")
- Schema settings: heading, empty_text, empty_link_text, empty_link_url, shipping_threshold (number, for progress bar), shipping_note_text
- Cart drawer is initially hidden on page load, slides in from right
- Open/close triggers:
  - Opens when "Add to Cart" button is clicked on product page
  - Opens when cart icon in nav is clicked (add cart icon to nav)
  - Closes on overlay click, close button, or Escape
- Styles in gp-theme.css:
  - .gp-cart-overlay, .gp-cart-drawer, .gp-cart-drawer.is-open
  - .gp-cart-item (line item row), .gp-cart-item__image, .gp-cart-item__details
  - .gp-cart-quantity (adjuster), .gp-cart-remove
  - .gp-cart-footer (subtotal, checkout button, shipping note)
  - .gp-cart-empty
  - .gp-cart-shipping-bar (progress bar), .gp-cart-shipping-bar__fill
- JS in gp-theme.js:
  - initCartDrawer() — open/close, quantity adjust via AJAX (fetch /cart/change.js), remove line item via AJAX
  - initCartIcon() — update cart count badge from Shopify's cart
- Add cart icon to gp-icon.liquid (bag/shopping cart icon)
- Update layout/theme.liquid to include the cart drawer section and a cart icon link in the nav

### FEATURE 4: Contact Page
A proper contact page with form.

**What to build:**
- sections/gp-contact-page.liquid — Contact page section with blocks:
  Block type: "hero" — Page hero with heading "Get in Touch."
  Block type: "form" — Contact form block:
    - Uses Shopify's native {% form 'contact' %} tag
    - Fields: Name, Email, Phone, Order Number (optional), Message (textarea)
    - Clean, minimal form design with proper labels
    - Submit button: "Send Message" (cyan primary)
    - Success message on submission
    - Left side: form; Right side: contact info (email, social links, response time)
    - Schema: form_heading, form_body, email, response_time_text, show_phone (checkbox)
  Block type: "faq" — Reuse the FAQ pattern from gp-faq.liquid with blocks for business inquiry FAQs
- templates/page.contact.json — Wires hero + form blocks
- Styles in gp-theme.css:
  - .gp-contact-form (2-col grid), .gp-contact-form__field (input/textarea styling)
  - .gp-contact-info (business hours, email, social)
  - .gp-contact-success (success message)
- Update snippets/gp-icon.liquid: mail icon, phone icon, clock icon

### FEATURE 5: Search Results Page
A search results page template.

**What to build:**
- sections/gp-search-hero.liquid — Search hero showing "Results for: [query]"
  - Shows the search query, result count
  - Search input field to refine search
- sections/gp-search-grid.liquid — Search results grid
  - Uses Shopify's {% paginate search.results %} with {% if search.performed %}
  - Shows products first if any, then pages/articles
  - Same product card pattern as collection grid
  - Empty state: "No results found for '[query]'" with suggestions
  - Sort options (Relevance, Date, Price)
  - Pagination
- templates/search.json — Wires search hero + search grid
- Add search icon to gp-icon.liquid (magnifying glass)
- Update layout/theme.liquid to include a search icon in the nav that links to /search
- Styles in gp-theme.css
- JS in gp-theme.js: initSearchForm() — live search suggestions (optional, basic)

### FEATURE 6: Update layout/theme.liquid nav bar
Now that we have cart drawer, mobile nav, search, and announcement bar:
- Update the fixed nav bar at top of theme.liquid to include:
  - Left: Hamburger icon (mobile only) + "GLASS PADS" logo/wordmark
  - Center/Right: Desktop nav links (Shop, Artist Collection, Gallery, About) + Search icon + Cart icon with count badge
  - Mobile: Only logo + search icon + cart icon + hamburger (the drawer has all links)
- Make nav responsive:
  - Desktop: links visible, hamburger hidden
  - Mobile: links hidden, hamburger visible
  - Cart badge always visible (shows "0" or item count from Shopify)
- Add styles for nav:
  - .gp-nav (fixed, glass-morphism background)
  - .gp-nav__links (desktop nav links)
  - .gp-nav__actions (search + cart icons)
  - .gp-nav__cart-badge (cart count bubble)
- Add cart icon, search icon, hamburger icon to gp-icon.liquid if not already there

### FEATURE 7: Recent Styles audit
- Scan gp-theme.css for any missing responsive styles for the recently added sections (gp-custom-page, gp-custom-promo, gp-gallery-hero, gp-gallery-grid, gp-qr-funnel, gp-about-page, gp-artist-program, gp-product, gp-collection-grid, gp-collection-hero)
- Add missing mobile styles where needed
- Ensure all new components have .gp-fade-in support

## GIT WORKFLOW
Commit each feature separately:
```
git add -A
git commit -m "gp-nav: mobile navigation drawer + search icon + cart icon in nav"
```
Then next feature, etc.

Feature 1 → "gp-nav: mobile navigation drawer + announcement bar + nav updates"
Feature 2 → "gp-cart: slide-out cart drawer with AJAX quantity adjust"
Feature 3 → "gp-contact: contact page with Shopify native form"
Feature 4 → "gp-search: search results page template"
Feature 5 → "gp-audit: responsive polish for all recent sections"

## QUALITY
- EVERY section must have {% schema %} with presets
- All text editable via theme editor where applicable
- Responsive at all breakpoints
- Cart drawer must use Shopify AJAX API (/cart/add.js, /cart/change.js, /cart.js)
- No Liquid errors
- Mobile nav must be smooth and feel native (slide-in, backdrop blur, scroll lock)
- Cart drawer slides from right, mobile nav slides from left
- Follow the brand design system exactly
- The nav update should be the last commit so it ties everything together