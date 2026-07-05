You are building two new sections for the "Glass Pads" Shopify theme. The project is at /c/Users/Cole Hodgson/OneDrive/Desktop/Glass Pads Shopify on branch feature/homepage-liquid-build.

## READ FIRST
Read these files to understand the existing codebase:
- assets/gp-theme.css (all styles, custom properties, component classes)
- snippets/gp-icon.liquid (icon system)
- snippets/gp-button.liquid (button component)
- snippets/gp-section-header.liquid (section header pattern)
- templates/index.json (how sections are wired)
- HOMEPAGE-MOCKUP.md (brand copy, colors, design system)

## WHAT TO BUILD

### 1. New section: sections/gp-custom-promo.liquid
A full-width promo banner for the HOMEPAGE that sells the custom artwork option. Place this in the template between the Artist Collection section and the Final CTA section.

**Design:**
- Full-width section with dramatic gradient background (cyan-to-violet, but warmer than the Final CTA — think "creative energy" not "last call")
- Split layout: left side has copy, right side shows a mockup of a custom-designed pad with someone's artwork
- The mockup area should show a glass pad with abstract "user uploaded" artwork visible underneath — use the existing gp-placeholder-artwork.svg as fallback
- Subtle glow effect behind the mockup

**Copy:**
- Eyebrow (gp-mono-spec): "Custom Artwork"
- Headline: "Make It Yours."
- Body: "Upload your own design and we'll seal it under 4mm tempered glass. Photos, patterns, logos, original art — if you can create it, we'll make it a glass pad."
- CTA: "Design Your Custom Pad" (primary button)
- Secondary CTA: "See Design Specs" (ghost link)

**Schema settings:**
- heading, body, button_text, button_link, secondary_text, secondary_link, image (for the mockup), use_dark_bg (checkbox, default true — when unchecked, use frost white bg for variety)

**Responsive:**
- Desktop: side-by-side split (1fr 1fr)
- Mobile: stacked (image above copy)

### 2. New section: sections/gp-custom-page.liquid
A FULL dedicated page section with multiple sub-sections for the custom artwork landing page. This is one complete section with multiple block types to keep it modular.

**Block types needed:**

**Block type: "hero"** — The page hero
- Full-width hero similar to homepage hero but with custom artwork theme
- Headline: "Your Art. Your Pad. One-of-a-Kind."
- Subheading: "Upload your own design and we'll seal it under 4mm tempered glass. Every custom pad is made to order, one at a time — precision-crafted to your exact artwork."
- Background: Void Black with violet-tinted glow (different from homepage cyan — violet signals "special/custom")
- CTA: "Start Your Custom Design"
- Settings: heading, subheading, button_text, button_link, background_image

**Block type: "specs"** — Design specifications
- Clean card layout showing the exact specs needed
- Headline: "Design Specifications"
- Cards:
  1. **Desk Pad (2:1 Ratio)** — "Width × Height = 2:1 aspect ratio. Perfect for full desk coverage. Recommended: 3600 × 1800px at 300 DPI."
  2. **Standard Pad (Square — 9×9")** — "A perfect square. Ideal for standalone mouse use. Recommended: 2700 × 2700px at 300 DPI."
  3. **Maximum Resolution** — "The higher the better. We recommend 300 DPI minimum. JPEG, PNG, or TIFF accepted."
  4. **Safe Zones** — "Keep critical artwork away from edges. We provide a downloadable template with marked safe zones."
- Each card: icon, title, description, download_template_link (url setting)
- Background: Slate Charcoal

**Block type: "how-it-works"** — 3-step process
- Headline: "How It Works"
- 3 steps with icons:
  1. **Choose Your Size** — "Select Standard (9×9") or XL Desk Pad (2:1). Every custom pad is made to order."
  2. **Upload Your Artwork** — "Send us your high-res design. We'll review it for print readiness and reach out if anything needs adjustment."
  3. **We Craft Your Pad** — "Your artwork is printed and sealed beneath 4mm tempered glass. Ships within 5-7 business days."
- Background: Frost White (light mode) for pacing
- Settings: step_1_title, step_1_body, step_2_title, step_2_body, step_3_title, step_3_body
- Each step has icon selectable from the icon system

**Block type: "gallery"** — Customer examples / mockups
- Headline: "Custom Pads, Real Results."
- Grid of placeholder mockup images showing what custom pads could look like (photos, patterns, logos)
- 4-placeholder grid (2×2 on desktop, 2×2 on tablet, single column on mobile)
- Each is a repeatable "Example" block (image, label, optional description)
- Background: Void Black

**Block type: "cta"** — Call to action
- Final conversion push
- Headline: "Ready to Create?"
- Body: "Upload your artwork and we'll take care of the rest. Free shipping on every custom order."
- CTA: "Start Your Custom Design"
- Background: Cyan-to-violet gradient (even more dramatic than the homepage CTA)
- Settings: heading, body, button_text, button_link

**Block type: "faq"** — Custom-specific FAQs
- Headline: "Custom Orders — FAQ"
- FAQ items (repeatable block, question + answer):
  1. "What file formats do you accept?" — "JPEG, PNG, and TIFF. For vector artwork, we prefer high-res PNG exports."
  2. "What's the turnaround time?" — "Custom orders ship within 5-7 business days from approval. Each pad is made to order."
  3. "Can I request color matching?" — "We print with high-fidelity UV printing. Colors appear vibrant and accurate, though some variation may occur between screen and print."
  4. "What if my artwork doesn't fit?" — "We'll review every submission and contact you if resizing or adjustments are needed."
  5. "Can I order a custom pad for my business or brand?" — "Absolutely. Custom branding orders are welcome — contact us for bulk pricing."
  6. "Is the custom artwork covered by the glass the same way?" — "Yes. Custom artwork is sealed under glass with the same process as our standard designs — it will never fade, peel, or rub off."
- Background: Slate Charcoal
- Uses native <details>/<summary> accordion (same pattern as gp-faq.liquid)
- FAQPage schema markup

### 3. Create template: templates/page.custom-artwork.json
Wires the gp-custom-page section with all block types in order:
1. hero block
2. specs block (with 4 spec cards)
3. how-it-works block (3 steps)
4. gallery block (4 example placeholders)
5. cta block
6. faq block (6 Q&As)

### 4. Update templates/index.json
Add the gp-custom-promo section between gp-artist-collection and gp-final-cta in the homepage template. Give it reasonable default settings including the placeholder image.

### 5. Add styles to gp-theme.css
Append all needed styles for the new sections using the existing CSS custom properties (--color-cyan, --color-violet, etc.). Add at the end of gp-theme.css.

New CSS classes needed:
- .gp-custom-promo (split layout, gradient bg)
- .gp-custom-page-hero (violet glow hero)
- .gp-custom-specs (4-card spec grid)
- .gp-custom-spec-card (individual spec card with icon)
- .gp-custom-steps (3-step process layout)
- .gp-custom-step (individual step)
- .gp-custom-step__number (step number indicator)
- .gp-custom-gallery (mockup grid)
- .gp-custom-gallery-card (individual example)

### 6. Add SVG icons to gp-icon.liquid
If the icon system doesn't already have these, add:
- upload (upload arrow)
- ruler (dimensions)
- image (artwork)
- printer (manufacturing)
- palette (creativity)
- download (template download)

### 7. Add a preview page
Create preview-custom.html at the project root — a standalone HTML preview of the custom artwork page (similar to how preview.html shows the homepage). Use inline styles based on gp-theme.css and inline SVG for placeholders. Make it look polished and scrollable.

## GIT WORKFLOW
After creating all files, commit:
```
git add -A
git commit -m "gp-custom: custom artwork page + homepage custom promo section"
```

## QUALITY
- Every section must have {% schema %} with proper presets
- All text editable via theme editor
- Responsive at all breakpoints
- Follow the brand design system (colors, fonts, spacing)
- No Liquid errors
- Clean comments marking editable areas