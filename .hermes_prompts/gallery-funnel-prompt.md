You are building the Glass Pads UGC (User Generated Content) gallery page and QR code funnel marketing loop. The project is at /c/Users/Cole Hodgson/OneDrive/Desktop/Glass Pads Shopify on branch feature/homepage-liquid-build.

## READ FIRST
Read these files to understand the existing codebase:
- assets/gp-theme.css (all styles, custom properties, component classes)
- snippets/gp-icon.liquid
- snippets/gp-button.liquid
- snippets/gp-section-header.liquid
- templates/index.json
- HOMEPAGE-MOCKUP.md (brand copy, colors, design system)

## THE CONCEPT
Glass Pads has a viral marketing loop:
1. Customer buys a glass pad
2. The packaging includes a QR code that links to @glasspads Instagram (or a landing page)
3. Customer posts their desk setup with the pad on Instagram, tagging @glasspads
4. Their setup gets featured in the gallery page
5. Their followers see it, want one, buy, and the loop repeats forever

This is a FREE marketing funnel — the customer does the marketing for you by showing off their premium desk setup.

## WHAT TO BUILD

### 1. New section: sections/gp-gallery-hero.liquid
A hero section for the gallery page specifically.

**Copy:**
- Eyebrow: "Community Gallery"
- Headline: "Your Setup. Our Glass."
- Subheading: "Every Glass Pads box comes with a QR code. Scan it, share your setup on Instagram with #GlassPads, and you could be featured here."
- CTA: "Share Your Setup →" (links to Instagram or a how-to page)
- Secondary stat line: "Join 1,200+ setups featured"

**Schema settings:**
- heading, subheading, button_text, button_link, stat_text, background_image, stat_number

**Visual:**
- Full-width hero with a collage/grid of small setup photos in the background (like Instagram grid)
- Void Black background with subtle cyan glow
- Clean, minimal overlay

### 2. New section: sections/gp-gallery-grid.liquid
The main gallery grid — a masonry/collage grid of customer setup photos.

**Structure:**
- Headline: "Featured Setups"
- Subheading: "Tag @glasspads and use #GlassPads for a chance to be featured."
- Filter/pill bar: "All / Gaming / Workstations / Creators / Minimal"
- Responsive grid: 4 columns desktop, 2 columns tablet, 1 column mobile
- Each card: photo (placeholder), customer handle, description, likes count (placeholder)

**Block type: "photo"** — repeatable
- Settings: image (image_picker), handle (text, e.g. "@gamer_desk"), description (text, e.g. "Torrent XL in a full RGB setup"), likes (text, e.g. "342"), category (select: gaming/workstation/creator/minimal)

**Schema settings:**
- heading, subheading, show_filter (checkbox)

**Presets:**
- 8 placeholder photos with realistic-looking desk setup descriptions and handles

**Responsive:**
- CSS grid with masonry-like layout
- 4-col → 2-col → 1-col

### 3. New section: sections/gp-qr-funnel.liquid
A homepage section that explains the QR code loop and drives people to buy and share.

**Placement:** Between the Custom Artwork Promo and the Final CTA in the homepage template.

**Copy:**
- Eyebrow: "The Glass Pads Loop"
- Headline: "Share Your Setup. Get Featured. Inspire the Next."
- Body: "Every Glass Pads box ships with a QR code that links directly to our community. Post your setup, tag @glasspads, and your desk becomes part of the gallery — seen by thousands of people who love premium setups as much as you do."
- 3-step visual: 
  1. "Buy" — "Every pad ships with a QR code"
  2. "Share" — "Post your setup on Instagram"
  3. "Inspire" — "Your setup gets featured and inspires others"
- CTA: "Browse the Gallery" (primary) + "Shop Glass Pads" (secondary)

**Visual:**
- 3-step horizontal layout with connecting arrow/line between steps
- Each step has an icon
- Background: Frost White (light mode) for contrast against the dark sections around it
- Clean, Apple-style step diagram

**Schema settings:**
- heading, body, step_1_title, step_1_body, step_2_title, step_2_body, step_3_title, step_3_body, button_text, button_link, secondary_text, secondary_link, use_dark_bg (checkbox)

### 4. Create template: templates/page.gallery.json
Wires the gallery page sections:
1. gp-gallery-hero
2. gp-gallery-grid (with 8 placeholder photo blocks)

### 5. Update templates/index.json
Add the gp-qr-funnel section between gp-custom-promo and gp-final-cta in the homepage template.

### 6. Add styles to gp-theme.css
Append all needed styles for the new sections. Use the existing CSS custom properties.

New CSS classes needed:
- .gp-gallery-hero (collage background hero)
- .gp-gallery-hero__collage (the Instagram-style background grid)
- .gp-gallery-grid (masonry grid)
- .gp-gallery-card (individual photo card)
- .gp-gallery-card__image
- .gp-gallery-card__info
- .gp-gallery-card__handle
- .gp-gallery-card__likes
- .gp-gallery-card__category (category badge)
- .gp-qr-funnel (light mode section)
- .gp-qr-funnel__steps (3-step layout)
- .gp-qr-funnel__step (individual step)
- .gp-qr-funnel__step-icon
- .gp-qr-funnel__step-number
- .gp-qr-funnel__connector (line/arrow between steps)

### 7. Add SVG icons to gp-icon.liquid
- camera (for share your setup)
- heart (likes)
- instagram (Instagram icon)
- qr-code (QR code icon)
- share (share icon)
- trending-up (growth/inspire icon)

### 8. Update preview.html
Add the gp-qr-funnel section between the Custom Artwork Promo and Final CTA in the homepage preview HTML.

### 9. Create preview-gallery.html
A standalone HTML preview of the gallery page (similar to preview-custom.html). Use inline styles based on gp-theme.css, inline SVG placeholders for the gallery photos, and make it look polished.

### 10. Update preview.html nav
Add a "Gallery" link in the top navigation bar so users can see it's a real page.

## GIT WORKFLOW
After creating all files, commit:
```
git add -A
git commit -m "gp-gallery: UGC gallery page + QR code funnel loop"
```

## QUALITY
- Every section must have {% schema %} with proper presets
- All text editable via theme editor
- Responsive at all breakpoints
- Follow the brand design system
- No Liquid errors
- Clean comments marking editable areas
- The gallery grid should look like a real Instagram-like layout — clean, image-first, minimal text overlay