You are doing the final launch-readiness pass on the "Glass Pads" Shopify theme. Project at /c/Users/Cole Hodgson/OneDrive/Desktop/Glass Pads Shopify on branch feature/homepage-liquid-build.

## READ FIRST
Read these files:
- assets/gp-theme.css (all styles)
- assets/gp-theme.js (all JS)
- layout/theme.liquid (the head section — this needs significant SEO updates)
- templates/index.json, product.json, collection.json (existing template patterns)
- sections/gp-footer.liquid, gp-hero.liquid (for the social + schema patterns)
- HOMEPAGE-MOCKUP.md (brand copy, colors, design system)

## WHAT TO BUILD — Launch readiness features

### FEATURE 1: JSON-LD Structured Data (snippets/gp-jsonld.liquid)
Create a comprehensive JSON-LD structured data snippet added to layout/theme.liquid.

This snippet must conditionally output the correct schema based on `request.page_type`:

**Product page** (when template == 'product'):
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "{{ product.title }}",
  "description": "{{ product.description | strip_html | strip_newlines | truncate: 300 }}",
  "image": "{{ product.featured_image | image_url: width: 800 }}",
  "brand": { "@type": "Brand", "name": "Glass Pads" },
  "offers": {
    "@type": "AggregateOffer",
    "priceCurrency": "{{ cart.currency.iso_code }}",
    "lowPrice": "{{ product.price_min | money_without_currency }}",
    "highPrice": "{{ product.price_max | money_without_currency }}",
    "availability": "http://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "1200"
  }
}
```

**Collection page**: BreadcrumbList + CollectionPage
**Blog page**: Blog + BreadcrumbList
**Article page**: Article + BreadcrumbList  
**Homepage**: WebSite + Organization + BreadcrumbList
**Search results**: SearchResultsPage + BreadcrumbList
**FAQ sections**: Use the existing FAQPage schema already in gp-faq.liquid — don't duplicate

For **BreadcrumbList**, build dynamically from:
- Home → Collection (if on collection page)
- Home → Blog → Article (if on article page)
- Home → Page name (if on page)

For **Organization** schema (on homepage):
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Glass Pads",
  "url": "{{ shop.url }}",
  "logo": "{{ 'logo.png' | asset_url }}",
  "sameAs": ["{{ settings.social_instagram_link }}", "{{ settings.social_tiktok_link }}", "{{ settings.social_youtube_link }}"]
}
```

### FEATURE 2: Social Meta Tags (update layout/theme.liquid)
Add proper Open Graph and Twitter Card meta tags in the `<head>` section.

**Open Graph tags** (fallback based on page type):
- og:title — page_title
- og:description — page_description or shop.description
- og:image — product.featured_image or collection.image or article.image or default share image
- og:url — canonical_url
- og:type — website / product / article
- og:site_name — shop.name

**Twitter Card tags:**
- twitter:card — summary_large_image
- twitter:title — page_title
- twitter:description — page_description
- twitter:image — same as og:image

**Additional meta tags:**
- Ensure proper meta description on every page type
- Add meta robots tags (index/follow by default)
- Add hreflang tags if multi-language (basic support)

### FEATURE 3: Performance Optimizations (update layout/theme.liquid + gp-theme.css)

**Critical CSS:**
- Inline critical above-the-fold CSS for the hero section in a `<style>` tag in the `<head>`
- Only the hero and nav styles — enough to render the first viewport without blocking
- The full gp-theme.css loads asynchronously with `media="print" onload="this.media='all'"` pattern

**Font loading:**
- Add `font-display: swap` via the existing Google Fonts link
- Preconnect to fonts.gstatic.com (already done, verify)
- Add `preload` hints for key fonts if possible

**Resource hints:**
- Preconnect to the Shopify CDN: `https://cdn.shopify.com`
- DNS-prefetch for any third-party services
- Preload the hero image on homepage and product pages

**JS loading:**
- Move all script tags to the end of the body (already done, verify)
- Add `defer` to gp-theme.js
- Ensure no render-blocking JS in the head

### FEATURE 4: Theme Editor Polish (update config/settings_schema.json)
Enhance the theme settings panel for non-technical owners.

**Add these sections to settings_schema.json:**

1. **Social Media** (if not already there):
   - social_instagram_link (url)
   - social_tiktok_link (url)
   - social_youtube_link (url)
   - social_x_link (url)

2. **SEO** (new tab):
   - share_image (image_picker) — default social share image
   - og_default_description (textarea) — fallback OG description

3. **Typography** (new tab):
   - heading_font (font_picker) — default Space Grotesk
   - body_font (font_picker) — default Inter
   - mono_font (font_picker) — default IBM Plex Mono

4. **Layout** (new tab):
   - container_width (range, 1000-1600, default 1280)
   - section_padding (range, 2-10, default 7)

5. **Checkout** (new tab):
   - checkout_logo (image_picker) — logo shown at checkout
   - checkout_logo_position (select: left/center)
   - checkout_body_font (font_picker)
   - checkout_heading_font (font_picker)
   - checkout_accent_color (color_picker) — mapped to Shopify's checkout brand settings via theme app extension or note

Also update settings_data.json with default values for all new settings.

### FEATURE 5: Performance & SEO Health Check
Scan all section files and templates for:

**Missing alt text**: Ensure every `<img>` has a proper `alt` attribute (use product.title, collection.title, etc. as fallback)
**Heading hierarchy**: Ensure h1 > h2 > h3 hierarchy is followed (each page has exactly one h1)
**Meta descriptions**: Ensure page_description is properly escaped
**Canonical URLs**: Ensure every template has a proper canonical URL (already in theme.liquid, verify)
**Lazy loading**: Ensure all below-fold images use loading="lazy" (hero uses eager, verify)

### FEATURE 6: Documentation
Create SHOPIFY-SETUP.md at the project root with:
- Brief theme overview
- Required Shopify apps (none for MVP, but note Judge.me/Loox for reviews as optional upgrade)
- How to set up: upload theme, create collections, create products with tags, configure theme settings
- Navigation setup: linklists needed (main-menu)
- Product tags convention: "size-standard", "size-xl", "artwork-gradient", "artwork-geometric", "artwork-monochrome", "artwork-abstract", "artwork-artist-collab", "best-seller"
- How to create pages: Gallery, Custom Artwork, About, Contact, Artist Program, Blog
- How to set up the QR code loop
- Shopify CLI commands for local development

## GIT WORKFLOW
Commit each feature separately:
1. → "gp-seo: JSON-LD structured data + social meta tags for all page types"
2. → "gp-perf: critical CSS inlining, font preloading, async stylesheet, defer JS"
3. → "gp-settings: enhanced theme editor settings (social, SEO, typography, layout, checkout)"
4. → "gp-audit: alt text, heading hierarchy, lazy loading, canonical verification"
5. → "gp-docs: SHOPIFY-SETUP.md deployment guide"

## QUALITY
- JSON-LD must be valid JSON (test with Liquid json filter)
- OG tags must not be empty — always have sensible fallbacks
- Critical CSS must be minimal (only hero + nav styles, <5KB)
- Theme settings must have proper type, label, default, and info text
- Settings_data.json must have realistic default values matching the brand
- Documentation must be clear enough for a non-technical person to follow
- No Liquid errors, no broken tags