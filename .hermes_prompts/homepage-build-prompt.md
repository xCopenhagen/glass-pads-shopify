You are building the complete Shopify homepage for "Glass Pads" — a premium tempered glass mousepad brand.

## PROJECT CONTEXT
- Working directory: /c/Users/Cole Hodgson/OneDrive/Desktop/Glass Pads Shopify
- Git branch: feature/homepage-liquid-build (already created and checked out)
- Design spec: read HOMEPAGE-MOCKUP.md for the full detailed mockup (colors, copy, visual direction, implementation notes)
- CLAUDE.md: read it for project conventions

## WHAT TO BUILD

Create a complete, working Shopify 2.0 (OS 2.0) theme homepage with all of the following files. Use the exact design system, copy, and visual direction from HOMEPAGE-MOCKUP.md.

### FILE STRUCTURE

```
layout/
  theme.liquid              — Main theme layout with Liquid, CSS, JS
sections/
  gp-hero.liquid            — Hero Banner
  gp-trust-bar.liquid       — Trust & Benefits Bar
  gp-problem.liquid         — Problem Statement
  gp-solution.liquid        — Solution Statement
  gp-comparison.liquid      — Glass vs Cloth Comparison
  gp-product-showcase.liquid — Featured Products
  gp-features.liquid        — Feature Breakdown
  gp-use-cases.liquid       — Shop by Use Case
  gp-testimonials.liquid    — Customer Reviews
  gp-artist-collection.liquid — Artist Collection Spotlight
  gp-final-cta.liquid       — Closing Offer Banner
  gp-faq.liquid             — FAQ
  gp-footer.liquid          — Footer
assets/
  gp-theme.css              — Complete stylesheet
  gp-theme.js               — Interactive JS (scroll effects, carousels, accordions, slider)
  gp-placeholder-product.svg  — Placeholder for product images
  gp-placeholder-lifestyle.svg — Placeholder for lifestyle shots
  gp-placeholder-artwork.svg  — Placeholder for artwork collection
snippets/
  gp-icon.liquid            — SVG icon system (tick, cross, chevron, plus, minus, star, etc.)
  gp-button.liquid          — Reusable CTA button component
  gp-star-rating.liquid     — Star rating display
  gp-section-header.liquid  — Reusable section heading + subheading pattern
config/
  settings_schema.json      — Theme settings (colors, fonts, social links)
  settings_data.json        — Default settings data
templates/
  index.json                — Homepage template wiring all sections in order
```

### EXACT FILE REQUIREMENTS

#### 1. layout/theme.liquid
- Include Google Fonts: Space Grotesk, Inter, IBM Plex Mono
- Include gp-theme.css and gp-theme.js
- Standard Shopify {{ content_for_header }} and {{ content_for_layout }}
- Responsive viewport meta tag
- Proper theme.liquid structure with all necessary Liquid tags

#### 2. Each Section File (gp-*.liquid)
Every section MUST have:
- **{% schema %}** with proper settings (text, image_picker, color, range, select, checkbox, etc.)
- **Human-readable name** in the schema (e.g., "Hero Banner", not "gp-hero")
- **presets** block so it appears in the Shopify theme editor
- **Clear HTML comments** explaining what each part does
- **Responsive classes** — use the CSS classes from gp-theme.css
- **Placeholder image areas** with `{{ 'gp-placeholder-*.svg' | asset_url }}` fallbacks
- **Liquid comments** indicating what the section owner can edit in the theme editor

#### 3. Section-Specific Details

**gp-hero.liquid:**
- Full-bleed section with image/video background support
- H1 headline "Your Setup Deserves Glass."
- Subheading: "Tempered glass mousepads with artwork sealed underneath. Smoother than cloth. Cleaner than plastic. Built to outlast them both."
- Primary CTA "Shop Glass Pads" + ghost secondary "See Why Glass →"
- Optional badge block above headline (e.g., "New: Aurora Collection")
- Schema: heading, subheading, primary_btn_text, primary_btn_link, secondary_btn_text, secondary_btn_link, background_image, background_video, mobile_image, overlay_opacity, disable_video_mobile (checkbox)
- padding-top aspect box for hero visual (not fixed height)
- loading="eager" fetchpriority="high" on hero image

**gp-trust-bar.liquid:**
- 4 columns: Smooth Glide / Easy Clean / Built to Last / Premium Aesthetic
- Repeatable "Benefit" block with icon, label, description
- Background: --color-bg-secondary (#141417), hairline borders
- Responsive: 4-col → 2x2 → horizontal scroll-snap on mobile

**gp-problem.liquid:**
- Split layout (text left / image right, toggleable)
- Headline: "Cloth Pads Were Never Built to Last."
- Body copy from mockup
- Image position toggle in schema (left/right)
- No cyan accents in this section (desaturated/colder)

**gp-solution.liquid:**
- Mirror of problem section but warm/glowing
- Headline: "Glass Doesn't Wear Down. It Just Works."
- CTA: "Explore the Difference"
- Optional before/after slider toggle (vanilla JS, no library)
- Cyan glow reintroduced

**gp-comparison.liquid:**
- Clean comparison table with repeatable rows
- Headline: "See the Difference for Yourself."
- Intro copy: "Same desk. Same mouse. A completely different experience."
- 6 rows: Surface Feel, Cleaning, Lifespan, Artwork, Sound, Aesthetic
- Repeatable "Comparison Row" block (label, cloth_value, glass_value)
- Mint checkmarks for Glass column, gray dashes for Cloth column
- Frost White background option
- Responsive: stacked cards on mobile

**gp-product-showcase.liquid:**
- Collection picker in schema settings
- Headline: "Find Your Glass."
- Subheading: "Every design is sealed beneath 4mm tempered glass — sizes for every desk, every setup."
- CTA: "View All Glass Pads"
- Product grid using {% for product in collection.products %} with max limit
- Filter pills above grid (pulled from collection tags)
- Hover state on product cards shows second image or "Shop Now" button
- 4-col → 2-col → carousel responsive

**gp-features.liquid:**
- Zig-zag layout with repeatable Feature blocks
- Headline: "Engineered Like a Setup Upgrade Should Be."
- 5 features with exact copy from mockup
- Each block: icon, title, description, image, image_position (left/right)
- IBM Plex Mono spec callouts (e.g., "4MM / TEMPERED / SCRATCH-RESISTANT")
- Alternate cyan/violet rim-light per feature

**gp-use-cases.liquid:**
- 4-card grid with repeatable Use Case blocks
- Headline: "One Surface. Every Setup."
- 4 cards: Gaming, Workstations, Creators, Premium Setups (exact copy from mockup)
- Each block: image, label, description, link
- hover-lift interaction on cards
- 4-col → 2x2 → single-column responsive

**gp-testimonials.liquid:**
- Repeatable Testimonial blocks (quote, name, rating, avatar)
- Headline: "Loved by Desks Everywhere."
- 3 placeholder testimonials with exact copy from mockup
- Aggregate rating banner: "4.9/5 from 1,200+ reviews"
- Stars in Glass Cyan color
- Toggle: "Use review app instead" (for swapping to Judge.me/Loox later)
- 3-up static grid desktop → scroll-snap carousel mobile

**gp-artist-collection.liquid:**
- Editorial/gallery-style layout
- Headline: "Limited Art. Sealed in Glass."
- Body: "Every drop features original artwork from independent artists — once it's gone, it's gone."
- Primary CTA "Explore Current Drop" + Secondary "Meet the Artists"
- Settings: featured collection, drop number, artist name, artist bio, artist portrait
- Electric Violet gradient background
- Repeatable Past Drop thumbnails with status badges (Available/Sold Out/Limited)
- Horizontal scroll-snap for past drops on all breakpoints

**gp-final-cta.liquid:**
- Full-width closing banner
- Headline: "Upgrade Your Desk. For Good."
- Body: "Join thousands who've made the switch to glass. Free shipping on every order, and a 30-day glide guarantee."
- Mode toggle: "shop now" vs "email signup" (pre-launch mode)
- Shop mode: "Shop Glass Pads Now" button
- Email mode: email input + "Join the Launch List" button
- Trust micro-copy: "Free Shipping • 30-Day Guarantee • Secure Checkout"
- Full-bleed cyan-to-violet gradient glow
- Trust micro-copy editable in schema

**gp-faq.liquid:**
- Native <details>/<summary> accordion (zero JS)
- Headline: "Questions? Answered."
- 7 FAQ items with exact copy from mockup
- Repeatable FAQ Item blocks (question, answer)
- FAQPage schema markup auto-generated
- Contact Us link below FAQs
- Frost White or Slate Charcoal background

**gp-footer.liquid:**
- 4-column layout using linklist menus
- Column 1: Brand logo, tagline, social icons (Instagram, TikTok, YouTube, X)
- Column 2: Shop (Home, Shop All, Artist Collection, Best Sellers)
- Column 3: Company (About, Artist Program, Affiliate Program, Contact)
- Column 4: Support/Legal (FAQ, Shipping Policy, Refund Policy, Privacy Policy, Terms of Service)
- Newsletter signup: "Get 10% off your first order" with native Shopify form
- Bottom bar: payment icons + copyright "© 2026 Glass Pads. All rights reserved."
- Void Black background, Hairline Gray top border
- Mobile: accordion collapse using <details>

#### 4. assets/gp-theme.css
Complete stylesheet with:
- CSS custom properties for the full color palette (--color-bg-primary, --color-cyan, etc.)
- Google Fonts @import (Space Grotesk, Inter, IBM Plex Mono)
- Type scale classes matching the mockup
- Responsive breakpoints (≥1200px desktop, 768-1199px tablet, ≤767px mobile)
- Section styles for ALL 13 sections
- Grid layouts for all multi-column sections
- Scroll-snap carousel styles for mobile
- Hover effects (card lift, underline animations, button transitions)
- Accordion styles for FAQ and mobile footer
- Before/after slider styles (if included)
- Hero section full-bleed with overlay
- Product card styles with hover states
- Button styles: primary (cyan fill), secondary (ghost/underline)
- Hairline border utility class
- Animations: fade-in on scroll, smooth transitions
- All styles reference the CSS custom properties for easy theme editing

#### 5. assets/gp-theme.js
Vanilla JS (no jQuery, no libraries) with:
- Mobile scroll-snap carousel initialization
- FAQ accordion behavior (enhancement for native <details>)
- Before/after slider drag interaction (if implemented)
- Optional mobile sticky "Shop Now" bar on scroll
- Lazy-loading for non-critical images
- Smooth scroll for anchor links
- All code wrapped in DOMContentLoaded

#### 6. assets/gp-placeholder-*.svg
Simple SVG placeholder images that look decent:
- Product placeholder: dark rounded rectangle with a subtle glass icon/reflection line
- Lifestyle placeholder: darker desk setup silhouette
- Artwork placeholder: abstract geometric pattern with cyan/violet gradient

#### 7. snippets/gp-icon.liquid
SVG sprite or inline SVG partials for:
- tick (checkmark) — for comparison table
- cross (x) — for comparison table
- chevron-right — for CTAs
- chevron-down — for accordion
- plus / minus — for accordion toggle
- star (filled) — for ratings
- star (empty)
- smooth-glide icon
- easy-clean icon
- built-to-last icon
- premium-aesthetic icon
- shopping-bag
- envelope (newsletter)
- lock (trust micro-copy)
- shipping-truck
- shield (guarantee)
- social icons: Instagram, TikTok, YouTube, X

#### 8. templates/index.json
Homepage template that wires all 13 sections in order with their default settings. Each section reference should include default placeholder content.

#### 9. config/settings_schema.json
Theme settings panel with:
- Color scheme settings (all 10 colors from palette)
- Typography settings
- Social media links
- Newsletter settings
- Shipping/guarantee text

#### 10. config/settings_data.json
Default values for all theme settings matching the Glass Pads brand.

## GIT WORKFLOW
After creating each batch of files, run:
```
git add -A
git commit -m "gp-[section]: [description]"
```
Commit in logical batches:
1. Layout + config + assets foundation
2. Hero + Trust Bar
3. Problem + Solution
4. Comparison + Product Showcase
5. Features + Use Cases
6. Testimonials + Artist Collection
7. Final CTA + FAQ
8. Footer + index template

## QUALITY REQUIREMENTS
- NO Liquid syntax errors — every {% %} tag must be properly closed
- 100% valid Shopify 2.0 section schema format
- Every section has proper "presets" so it appears in the theme editor
- Responsive at all breakpoints (desktop, tablet, mobile)
- All text content is editable via theme editor settings/blocks
- Non-technical owner can edit everything without touching code
- Performance: minimal JS, no external libraries, native HTML elements where possible
- Clean, well-commented code with section names and editable areas clearly marked
- Include placeholders for real product photos — use the SVG placeholders as fallbacks

Read the full HOMEPAGE-MOCKUP.md file in the project root for exact copy, colors, and visual direction. Read CLAUDE.md for project conventions. Build everything listed above.