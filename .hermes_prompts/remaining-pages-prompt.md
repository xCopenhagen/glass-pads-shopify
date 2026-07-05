You are building the remaining core pages for the "Glass Pads" Shopify theme. The project is at /c/Users/Cole Hodgson/OneDrive/Desktop/Glass Pads Shopify on branch feature/homepage-liquid-build.

## READ FIRST
Read these files to understand the existing codebase, design system, and patterns:
- assets/gp-theme.css (all styles, CSS custom properties)
- snippets/gp-icon.liquid, gp-button.liquid, gp-section-header.liquid, gp-star-rating.liquid
- sections/gp-hero.liquid, gp-footer.liquid, gp-features.liquid (section patterns)
- templates/index.json, templates/page.custom-artwork.json (template wiring patterns)
- HOMEPAGE-MOCKUP.md (brand copy, colors, design system)
- CLAUDE.md (project conventions)

## WHAT TO BUILD — 6 Pages, 10+ files

Build ALL of the following. Git-commit each batch separately.

### BATCH 1: Collection Page (templates/collection.json + sections)

**1. sections/gp-collection-hero.liquid**
A collection-level banner/hero section.
- Schema: heading (dynamic from collection.title default), description, banner_image, overlay_opacity
- Shows collection title + description over a banner image
- If no banner, use Void Black background with just text
- Clean, minimal — just title, description, product count
- Optional eyebrow: "Browse" + collection.title

**2. sections/gp-collection-grid.liquid**
The main product grid for collection pages.
- Uses Shopify's native {% paginate collection.products %} loop
- Schema settings: products_per_page (range 8-48, default 24), show_sort_by (checkbox, default true), enable_infinite_scroll (checkbox, default false)
- Sort options: Featured, Best Selling, Alphabetical A-Z, Price Low-High, Price High-Low, Date New-Old
- Product cards matching the existing gp-product-showcase pattern: image, title, price, badge, quick-add on hover
- Responsive: 4-col desktop, 2-col tablet, 1-col mobile
- Pagination at bottom (page numbers or prev/next)
- Empty collection state: "This collection is empty. Browse all products instead." with link to /collections/all
- Product card style matches the existing homepage product showcase (Graphite surface, Pure White text, Glass Cyan badges, rounded corners 12px, Hairline Gray border)

**3. templates/collection.json**
Wires the collection page:
1. gp-collection-hero (uses collection metafields or default)
2. gp-collection-grid

### BATCH 2: Product Page (templates/product.json + sections)

**4. sections/gp-product.liquid**
The individual product page — the most important conversion page.
- Left side: Image gallery with main image + thumbnails (using Shopify's featured_image and product.images)
- Right side: Product info
  - Product title (h1)
  - Price with compare-at price if on sale
  - Star rating placeholder ("4.9/5 — 120+ reviews")
  - Short description (first paragraph from product.description)
  - Size/variant selector: radio-button pill style ("Standard 9×9″ — $49" / "XL Desk 2:1 — $69") using product.variants
    - Each option shows size name, short spec, and price
    - Selected option has Glass Cyan border
  - Artwork design selector (if product has tags for designs): visual swatch circles
  - Quantity selector (minus/plus/input)
  - Add to Cart button (full-width, cyan, large) — "Add to Cart — $XX"
  - Dynamic checkout button (Shopify's {% render 'dynamic-checkout' %}) below add to cart
  - Trust micro-copy: "Free Shipping • 30-Day Glide Guarantee • Secure Checkout" (same as final CTA)
- Below fold:
  - Description tab/accordion with full product.description
  - Specs tab: Hardcoded specs for glass pads (Material: 4mm Tempered Glass, Surface: Micro-etched, Base: Silicone Anti-Slip, Sizes: Standard 9×9″, XL Desk 2:1)
  - Shipping tab: "Ships within 1-2 business days. Free shipping on all orders."
  - Reviews placeholder tab (structured for Judge.me/Loox swap-in later)
- Below that: "Complete Your Setup" — cross-sell section showing 2-4 related products (using product.metafields or collection handle)
- Schema settings: show_related_products (checkbox), related_collection (collection picker), show_dynamic_checkout (checkbox, default true), enable_tabs (checkbox, default true)
- Responsive: On mobile, image gallery stacks above product info; tabs become accordion

**5. templates/product.json**
Wires the product page with gp-product section.

### BATCH 3: About Us + Artist Program + Policies (page templates)

**6. sections/gp-about-page.liquid**
About Us page — Brand story section.
- Full page content with these blocks:

Block type: "hero"
- Headline: "Built Different. On Purpose."
- Subheading: "Glass Pads was born from a simple observation: your desk setup deserves better than fabric."
- Full-width hero with lifestyle placeholder bg

Block type: "story"
- Split layout with brand story
- Headline: "Why Glass?"
- Body: "We started with a question: why do we spend thousands on keyboards, monitors, and peripherals — and then use a fraying cloth pad that collects dust, sweat, and coffee stains? Tempered glass was the answer. It's the same precision material used in the devices it supports. It's cleaner, faster, and it lasts. Every Glass Pad is designed to be the foundation of a premium desk setup — not an afterthought."
- Image: Placeholder lifestyle shot

Block type: "values"
- 4 value cards in a grid
- 1. Precision Engineering — "Every surface is micro-etched for consistent glide."
- 2. Art-First Design — "We collaborate with artists to turn desk space into gallery space."
- 3. Built to Last — "4mm tempered glass that outlasts every other pad you've owned."
- 4. Community Driven — "Your setups inspire the next generation of designs."

Block type: "cta"
- "See the Collection" CTA to /collections/all

**7. sections/gp-artist-program.liquid**
Artist Program recruitment page.
- Headline: "Your Art. Our Glass. A Global Canvas."
- Body: Pitch to artists — "Your work printed, sealed under glass, and shipped to premium desk setups worldwide."
- 3 benefits for artists:
  1. "Royalties on Every Sale" — "Earn a percentage of every pad featuring your artwork."
  2. "Global Exposure" — "Your work featured on premium desks in 20+ countries."
  3. "Creative Freedom" — "Full-size canvases at 2:1 and 1:1 ratios. No brand restrictions."
- CTA: "Apply as an Artist" (links to contact form)
- Past collaborations gallery (repeatable blocks)
- FAQ: How it works, rights, timeline, exclusivity

**8. sections/gp-policies-page.liquid**
A reusable page section for legal/ policy pages.
- Block type: "content" — single richtext block for the policy content
- Block type: "section" — with heading and body richtext for multi-section policies
- Clean typography, readable width (max-width 720px), Frost White background
- Table of contents sidebar/links at top for multi-section pages

**9. templates/page.about.json**
Wires gp-about-page in order: hero → story → values → cta

**10. templates/page.artist-program.json**
Wires gp-artist-program section.

**11. templates/page.policies.json**
A reusable template for policy pages (Privacy, Refund, Shipping, Terms). Uses gp-policies-page with content blocks.

### BATCH 4: Add page links to footer + nav

**12. Update sections/gp-footer.liquid**
If the footer currently has hardcoded link list items, make sure all pages are linked:
- Shop: Home, Shop All (collections/all), Artist Collection, Best Sellers, Custom Artwork (pages/custom-artwork)
- Company: About (pages/about), Artist Program (pages/artist-program), Gallery (pages/gallery), Contact
- Support: FAQ, Shipping Policy, Refund Policy, Privacy Policy, Terms of Service

These should use Shopify linklist menus via settings.

**13. Add new icons to gp-icon.liquid**
- palette (artist program)
- users (community)
- award (artist royalties)
- globe (global exposure)
- file-text (policies)

## GIT WORKFLOW
Commit each batch separately with clear messages:
```
git add -A
git commit -m "gp-collection: collection page template with hero + product grid"
```
Then next batch, etc.

Batch 1 → "gp-collection: collection page template with hero + product grid"
Batch 2 → "gp-product: individual product page with gallery, variants, add-to-cart"
Batch 3 → "gp-pages: about us, artist program, and policy page templates"
Batch 4 → "gp-nav: update footer links and add new icons"

## QUALITY
- EVERY section must have {% schema %} with presets
- All text editable via theme editor
- Responsive at all breakpoints (desktop, tablet, mobile)
- Follow the brand design system exactly (colors: Void Black #0A0A0C, Glass Cyan #5EE6D9, etc.)
- No Liquid errors — use Shopify 2.0 patterns
- Use CSS custom properties from gp-theme.css everywhere
- Product page especially must be flawless — it's the most important conversion page
- Collection filter/sort must use Shopify native patterns (no custom URL params)