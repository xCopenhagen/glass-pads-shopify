# GLASS PADS — HOMEPAGE MOCKUP DOCUMENT

**Version 1.0 | Homepage Build Spec**
**Brand:** Glass Pads — Premium Tempered Glass Mousepads
**Purpose:** Complete creative + conversion + Shopify implementation reference for homepage build, section by section.

---

## GLOBAL DESIGN SYSTEM (Reference for all sections below)

### Color Palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| Primary Background | Void Black | `#0A0A0C` | Main dark background, hero, footer |
| Secondary Background | Slate Charcoal | `#141417` | Section alternation, cards |
| Surface / Panel | Graphite | `#1D1E22` | Cards, comparison table, FAQ accordions |
| Primary Text | Pure White | `#F5F6F7` | Headlines on dark |
| Secondary Text | Cool Gray | `#9B9DA3` | Body copy, subtext |
| Accent (Signature) | Glass Cyan | `#5EE6D9` | CTAs, highlights, glass \"glow\" edge, links |
| Accent (Secondary) | Electric Violet | `#8B7CF6` | Gradient pairing with cyan, artist/collection accents |
| Light Mode Base | Frost White | `#FAFAFA` | Optional light sections (comparison/FAQ) |
| Success/Trust | Mint | `#4ADE80` | Checkmarks, trust bar icons |
| Border/Divider | Hairline Gray | `#2A2B30` | 1px dividers on dark surfaces |

### Typography Pairing

- **Display / Headlines:** `"Space Grotesk"` (Google Fonts) — geometric, modern, slightly technical. Weight 500–700.
- **Body / UI:** `"Inter"` (Google Fonts) — weight 400–500, excellent legibility at small sizes, neutral and clean.
- **Accent/Numerals (specs, comparison tables):** `"IBM Plex Mono"` (Google Fonts) — used sparingly for spec callouts (e.g. "4MM TEMPERED GLASS") to add a technical/premium feel, Razer-style.

**Type scale (desktop):**
- H1 Hero: 64–80px / Space Grotesk 600 / -2% tracking
- H2 Section: 40–48px / Space Grotesk 600
- H3 Card: 22–26px / Space Grotesk 500
- Body: 16–18px / Inter 400 / 1.6 line-height
- Micro/Label: 12–13px / IBM Plex Mono 500 / uppercase / +8% tracking

### Responsive Notes (Global)
- Breakpoints: Desktop ≥1200px, Tablet 768–1199px, Mobile ≤767px
- Mobile: all multi-column layouts (comparison, feature grids, use cases) collapse to single-column stacked cards with swipeable carousels where noted
- Hero visual repositions below headline on mobile (never cropped awkwardly — use `padding-top` aspect box, not fixed height)
- Sticky \"Shop Now\" bar appears on mobile scroll after Hero (optional toggle in theme settings)
- All CTAs full-width on mobile, max-width 420px centered on tablet

### Shopify Section Naming Convention
All sections use the prefix `gp-` (Glass Pads) in the file name for easy identification, but **display names in the theme editor are plain human-readable English** (e.g., editor shows "Hero Banner", not `gp-hero.liquid`). Every section includes schema settings for text/image/color so the owner never touches code.

Naming pattern: `sections/gp-[section-name].liquid` → schema `"name": "Human Readable Name"`

---

## 1. HERO SECTION

**Purpose (conversion role):** Immediate brand impression + product clarity within 3 seconds. Must communicate \"premium glass mousepad\" instantly and drive the first click of the session.

**Headline:**
> \"Your Setup Deserves Glass.\"

**Subheadline:**
> \"Tempered glass mousepads with artwork sealed underneath. Smoother than cloth. Cleaner than plastic. Built to outlast them both.\"

**CTA (Primary):** `Shop Glass Pads`
**CTA (Secondary, ghost/underline style):** `See Why Glass →`

**Visual Direction:**
- Full-bleed hero image/video: a glass pad photographed at a low 3/4 angle on a dark desk setup, dramatic side lighting that catches the glass edge and creates a visible refraction/glow line — this is the signature \"glass hero shot\" motif used sitewide.
- Optional subtle looping video (5–8 sec, muted, autoplay): mouse gliding across the pad, catching light reflections, camera slowly pushes in.
- Product artwork underneath glass should be visible and vivid (placeholder: abstract dark-mode geometric art with cyan/violet gradient accent — replace with real product photography later).
- A soft cyan glow/rim-light sits behind the product to separate it from the void-black background.

**Color/Background Treatment:**
- Background: Void Black (`#0A0A0C`) with a very subtle radial gradient vignette (black → `#141417`) centered behind product.
- Headline in Pure White, CTA in Glass Cyan fill with black text (high contrast, primary action).
- Secondary CTA: transparent with cyan underline on hover.

**Shopify Implementation Notes:**
- Section: `sections/gp-hero.liquid` → Editor name: **\"Hero Banner\"**
- Schema settings: heading (text), subheading (textarea), primary button text/link, secondary button text/link, background media (image or video upload), overlay opacity slider, mobile image (separate upload for cropped mobile hero art).
- Blocks: none required (single hero); optionally allow a \"badge\" block above headline (e.g., \"New: Aurora Collection\") toggled on/off.
- Responsive: video hero auto-swaps to static image on mobile to protect load time (checkbox: \"Disable video on mobile\").
- Performance: hero image uses `loading=\"eager\"` + `fetchpriority=\"high\"`; video lazy-loads after LCP paint.

---

## 2. TRUST/BENEFIT BAR

**Purpose (conversion role):** Fast, scannable reassurance strip immediately below the hero — reduces bounce by answering \"why glass\" before the user has to think about it.

**Headline:** *(none — icon bar, optional small eyebrow label)* \"Why Glass Pads\"

**Body Copy (4 items, icon + short label + one-line support):**
1. **Smooth Glide** — \"Consistent, frictionless tracking every time.\"
2. **Easy Clean** — \"Wipe it down in seconds. No stains, no odor.\"
3. **Built to Last** — \"Scratch-resistant tempered glass, not fraying fabric.\"
4. **Premium Aesthetic** — \"A desk setup upgrade you can actually see.\"

**CTA Text:** None (informational bar)

**Visual Direction:**
- Thin horizontal band, 4 columns desktop / 2x2 grid mobile / auto-scroll carousel option on small screens.
- Minimal line-style icons in Glass Cyan, consistent stroke weight (1.5px), no fill — matches Apple/Razer restraint.

**Color/Background Treatment:**
- Background: Slate Charcoal (`#141417`), subtle 1px hairline top/bottom border in Hairline Gray to separate from hero and next section.
- Icons in Glass Cyan, labels in Pure White (bold), support text in Cool Gray.

**Shopify Implementation Notes:**
- Section: `sections/gp-trust-bar.liquid` → Editor name: **\"Trust & Benefits Bar\"**
- Blocks: repeatable \"Benefit\" block (icon picker or SVG upload, label text, support text) — owner can add/remove/reorder up to 6.
- Responsive: 4-col grid → 2x2 grid at tablet → horizontal swipe carousel at mobile (native scroll-snap, no JS library needed).

---

## 3. PROBLEM SECTION

**Purpose (conversion role):** Build tension/relatability — agitate the pain of the current cloth mousepad experience before presenting the solution. Classic PAS (Problem-Agitate-Solve) copy structure.

**Headline:**
> \"Cloth Pads Were Never Built to Last.\"

**Body Copy:**
> \"Fraying edges. Grime soaked into the fabric. That dead, sticky drag after a few months of use. Cloth mousepads look fine on day one — and it's downhill from there. You clean the rest of your desk. Why not your mousepad?\"

**CTA Text:** None (transitional/emotional section, no CTA — keeps focus on narrative, not a dead-end click)

**Visual Direction:**
- Split layout: left side text, right side a moody, slightly desaturated macro photograph of a worn cloth mousepad (frayed edge, stain, visible wear) — shot in cold, unflattering light to contrast with the glowing glass shots elsewhere on the page.
- Alternatively: a short close-up video loop of fabric fraying/fingers picking at a worn edge.

**Color/Background Treatment:**
- Background: Void Black, but desaturated/colder treatment on the image (slight blue-gray grade) to visually signal \"this is the problem, not the brand.\"
- Text in Cool Gray/White, no cyan accents in this section — cyan is reserved for the \"solution\" moments, which makes its reappearance in Section 4 feel intentional.

**Shopify Implementation Notes:**
- Section: `sections/gp-problem.liquid` → Editor name: **\"Problem Statement\"**
- Schema: heading, body richtext, image upload, image position toggle (left/right), enable/disable section checkbox.
- Responsive: stacks image below text on mobile; image gets rounded-corner crop, max-height cap to avoid pushing CTA-bearing sections below the fold.

---

## 4. SOLUTION SECTION

**Purpose (conversion role):** Resolve the tension from Section 3 with the brand's core promise — this is the emotional pivot point of the page, where cyan/glow visual language returns.

**Headline:**
> \"Glass Doesn't Wear Down. It Just Works.\"

**Body Copy:**
> \"Tempered glass never frays, never stains, never slows down. It's the same smooth glide on day 1,000 as it was on day one — with a look that actually belongs on a premium desk setup.\"

**CTA Text:** `Explore the Difference`

**Visual Direction:**
- Mirror composition of Section 3, but warm/glowing: glass pad in identical desk context, now lit with the signature cyan rim-light, condensation-free, pristine surface reflecting ambient light.
- Optional before/after slider component: drag to compare \"cloth\" (Section 3 image) vs \"glass\" (this image) — strong interactive engagement moment.

**Color/Background Treatment:**
- Background transitions from Void Black to a subtle dark-to-cyan gradient glow behind the product, reintroducing Glass Cyan as the \"answer\" color.

**Shopify Implementation Notes:**
- Section: `sections/gp-solution.liquid` → Editor name: **\"Solution Statement\"**
- Schema: heading, body richtext, image upload, optional \"before/after slider\" block toggle (uses two image uploads: before/after), button text/link.
- If before/after slider enabled, use a lightweight vanilla-JS drag handle (no external app/library) to keep performance high.

---

## 5. GLASS VS CLOTH COMPARISON

**Purpose (conversion role):** Rational proof point for logic-driven buyers — converts the emotional problem/solution narrative into a scannable, credible comparison that justifies the price premium.

**Headline:**
> \"See the Difference for Yourself.\"

**Body Copy (table intro line):**
> \"Same desk. Same mouse. A completely different experience.\"

**Comparison Table:**

| | Cloth Pads | Glass Pads |
|---|---|---|
| Surface Feel | Inconsistent, drags over time | Consistent glide, every time |
| Cleaning | Absorbs oils, sweat, dust | Wipes clean in seconds |
| Lifespan | Frays and flattens in months | Scratch-resistant, built for years |
| Artwork | Prints fade and rub off | Artwork sealed under glass — never fades |
| Sound | Soft, sometimes noisy fabric drag | Quiet, smooth tracking |
| Aesthetic | Fabric look, dorm-room feel | Glass finish, premium desk setup |

**CTA Text:** `Shop the Upgrade`

**Visual Direction:**
- Clean, minimal data table with icon checkmarks (Mint green check for Glass Pads column, muted gray X or dash for Cloth column — avoid red/alarming color, keep it factual not aggressive).
- Optional: small glass-texture background swatch behind the \"Glass Pads\" column header to visually differentiate it as the \"winning\" column.

**Color/Background Treatment:**
- Background: can switch to Frost White (`#FAFAFA`) light-mode panel here for contrast/pacing relief from the dark sections above and below — signals \"proof/data\" mode. Table surface: white cards with Hairline Gray borders, text in near-black.
- Glass Pads column header highlighted with a thin Glass Cyan top border.

**Shopify Implementation Notes:**
- Section: `sections/gp-comparison.liquid` → Editor name: **\"Glass vs Cloth Comparison\"**
- Blocks: repeatable \"Comparison Row\" block (label, cloth value, glass value) — owner can add/edit/reorder rows without touching code.
- Responsive: table converts to stacked comparison cards on mobile (each row becomes its own mini card with cloth/glass side-by-side in 2 columns), horizontal scroll disabled to avoid poor mobile UX.

---

## 6. PRODUCT SHOWCASE

**Purpose (conversion role):** First direct product/collection browsing moment — moves user from \"convinced\" to \"shopping.\" Primary catalog entry point on the homepage.

**Headline:**
> \"Find Your Glass.\"

**Body Copy:**
> \"Every design is sealed beneath 4mm tempered glass — sizes for every desk, every setup.\"

**CTA Text:** `View All Glass Pads` (below grid), plus per-product `Shop Now` on hover/tap

**Visual Direction:**
- Responsive product grid (4-up desktop / 2-up tablet / carousel mobile) pulling from a featured collection.
- Each card: top-down flat-lay product shot on black background, subtle drop shadow, artwork clearly visible, hover state reveals a second angle (side profile showing glass edge thickness) or a quick \"Add to Cart\" button.
- Category filter pills above grid: \"All / XL Desk Pads / Standard / Artist Collabs / Monochrome\"

**Color/Background Treatment:**
- Background: Slate Charcoal. Product cards on Graphite surface with rounded corners (12–16px radius), Hairline Gray border.
- Price and title in Pure White, tag/badge (\"Best Seller\", \"New\") in Glass Cyan pill.

**Shopify Implementation Notes:**
- Section: `sections/gp-product-showcase.liquid` → Editor name: **\"Featured Products\"**
- Settings: collection picker (owner selects which Shopify collection populates this grid), heading/subheading text, \"View All\" button link, products-to-show count, enable/disable filter pills (auto-pulled from collection tags — zero code needed to update).
- Uses Shopify's native `{% for product in collection.products %}` loop with a max limit setting — no third-party app required.
- Responsive: CSS grid with `auto-fit`/`minmax` for clean reflow; mobile switches to native scroll-snap carousel.

---

## 7. FEATURE BREAKDOWN

**Purpose (conversion role):** Detailed spec/feature justification — this is where technically-minded buyers (gamers especially) get the granular \"why this is worth it\" proof, styled like a Razer/Apple spec sheet.

**Headline:**
> \"Engineered Like a Setup Upgrade Should Be.\"

**Feature List (5 items — icon + title + 1-2 line description):**
1. **Tempered Glass Core** — \"4mm shatter-resistant tempered glass, rated for daily impact and pressure.\"
2. **Precision Glide Coating** — \"A micro-etched surface tuned for consistent sensor tracking, mouse feet included.\"
3. **Sealed Under-Glass Art** — \"Artwork is fused beneath the surface — it will never fade, peel, or rub off.\"
4. **Anti-Slip Base** — \"A silicone grip base keeps it locked in place, even during intense sessions.\"
5. **Effortless Clean** — \"One wipe removes dust, oils, and spills — no washing, no drying time.\"

**CTA Text:** `See Full Specs`

**Visual Direction:**
- Alternating zig-zag layout: each feature paired with a tight macro/detail photograph (glass edge cross-section, close-up of mouse gliding, water droplet beading off the surface, underside grip texture).
- IBM Plex Mono spec callouts (e.g., \"4MM / TEMPERED / SCRATCH-RESISTANT\") as small technical labels near each image, Razer-style.

**Color/Background Treatment:**
- Background: Void Black. Each feature image gets a subtle cyan or violet rim-light depending on alternating rhythm (cyan on odd rows, violet on even rows) to add visual variety without breaking the palette.

**Shopify Implementation Notes:**
- Section: `sections/gp-features.liquid` → Editor name: **\"Feature Breakdown\"**
- Blocks: repeatable \"Feature\" block (icon, title, description, image, image position left/right) — fully owner-editable, add/remove features freely.
- Responsive: zig-zag layout collapses to stacked (image always on top, text below) on mobile for readability.

---

## 8. USE CASES

**Purpose (conversion role):** Helps different customer segments self-identify (\"this is for me\") — broadens appeal beyond core gamer audience to creators/professionals, increasing addressable market and perceived versatility.

**Headline:**
> \"One Surface. Every Setup.\"

**Body Copy (4 use-case cards):**
1. **Gaming** — \"Consistent glide for precision aim and fast flicks — no drag, no hesitation.\"
2. **Workstations** — \"A clean, professional desk finish that looks as good on a video call as it performs.\"
3. **Creators** — \"A canvas for your setup — pair your desk pad with the content you make.\"
4. **Premium Setups** — \"For desks built to be seen. The finishing piece your setup was missing.\"

**CTA Text:** `Shop by Use Case`

**Visual Direction:**
- 4-card grid, each with a lifestyle photo (top-down desk setup shot styled per use case: RGB gaming rig / minimal MacBook workstation / creative studio with tablet+camera / architectural minimal desk).
- Consistent lighting/color-grade across all four to keep brand cohesion despite different desk styles.

**Color/Background Treatment:**
- Background: Slate Charcoal. Cards on Graphite with a hover-lift interaction (subtle scale + shadow) to invite clicking.

**Shopify Implementation Notes:**
- Section: `sections/gp-use-cases.liquid` → Editor name: **\"Shop by Use Case\"**
- Blocks: repeatable \"Use Case\" block (image, label, description, link to collection/tag) — owner can retarget each card to any collection.
- Responsive: 4-col → 2x2 → single-column stack with full-width cards on mobile.

---

## 9. SOCIAL PROOF PLACEHOLDER

**Purpose (conversion role):** Third-party credibility — reduces purchase risk perception at the point where the user is warm but not yet convinced enough to buy. Placed after product/feature sections, before the final offer push.

**Headline:**
> \"Loved by Desks Everywhere.\"

**Body Copy (placeholder testimonial slots — 3 shown):**
> ⭐⭐⭐⭐⭐ \"[Placeholder] The glide is unreal compared to my old cloth pad. Looks incredible under my RGB setup.\" — *Customer Name, Verified Buyer*
> ⭐⭐⭐⭐⭐ \"[Placeholder] Cleaning it takes 5 seconds. Wish I'd switched years ago.\" — *Customer Name, Verified Buyer*
> ⭐⭐⭐⭐⭐ \"[Placeholder] The artwork under the glass is way better in person. Feels genuinely premium.\" — *Customer Name, Verified Buyer*

**CTA Text:** `Read More Reviews`

**Visual Direction:**
- Card carousel with star rating, quote, reviewer name/photo (placeholder avatar circles), and optionally a small verified-purchase badge.
- Include a placeholder for an aggregate rating banner: \"4.9/5 from 1,200+ reviews\" (to be wired to real review app data later — e.g., Judge.me/Loox/Okendo).

**Color/Background Treatment:**
- Background: Void Black. Cards on Graphite, star ratings in Glass Cyan (not generic yellow) to keep brand-consistent — a small but distinctive brand choice.

**Shopify Implementation Notes:**
- Section: `sections/gp-testimonials.liquid` → Editor name: **\"Customer Reviews\"**
- Built to be app-agnostic: static blocks now (repeatable \"Testimonial\" block: quote, name, rating, avatar), but structured so a review app snippet (Judge.me/Loox) can be swapped in later via a \"Use review app instead\" theme setting toggle — avoids fragile app-lock-in from day one per build guidelines.
- Responsive: carousel with scroll-snap, dots indicator on mobile, 3-up static grid on desktop (no JS carousel required at desktop width, saves performance).

---

## 10. ARTIST/DESIGN COLLECTION

**Purpose (conversion role):** Differentiator and urgency driver — positions Glass Pads as a design/collectible platform (not just a commodity accessory), while limited-drop framing creates urgency and repeat-visit behavior.

**Headline:**
> \"Limited Art. Sealed in Glass.\"

**Body Copy:**
> \"Every drop features original artwork from independent artists — once it's gone, it's gone. New designs, released in limited runs.\"

**CTA Text:** `Explore Current Drop`
**Secondary CTA:** `Meet the Artists`

**Visual Direction:**
- Editorial/gallery-style layout: large hero artwork image for the current featured collab, artist name/portrait small inset, \"Drop 004\" style numbering label in IBM Plex Mono.
- Below: horizontal scroll of past/current collection thumbnails with a \"Limited — X remaining\" or \"Sold Out\" tag treatment.

**Color/Background Treatment:**
- This section is the one place Electric Violet plays a bigger role (gradient behind the artist spotlight image) to visually signal \"special/limited\" distinct from the core cyan product story.

**Shopify Implementation Notes:**
- Section: `sections/gp-artist-collection.liquid` → Editor name: **\"Artist Collection Spotlight\"**
- Settings: featured collection picker, drop number/label text, artist name/bio text, artist portrait image, primary/secondary button links.
- Blocks: repeatable \"Past Drop\" thumbnail block (image, title, status badge: Available/Sold Out/Limited, link).
- Responsive: horizontal scroll-snap row for past drops on all breakpoints (consistent interaction pattern, not just a mobile fallback).

---

## 11. OFFER/CTA SECTION

**Purpose (conversion role):** Final full-width conversion push before FAQ/footer — last high-intent moment to convert warm traffic, or capture email for not-yet-ready buyers via launch-list opt-in.

**Headline:**
> \"Upgrade Your Desk. For Good.\"

**Body Copy:**
> \"Join thousands who've made the switch to glass. Free shipping on every order, and a 30-day glide guarantee.\"

**CTA Text (Primary):** `Shop Glass Pads Now`
**CTA Text (Secondary/Alt mode):** `Join the Launch List` *(with email capture field — used if positioned as pre-launch/waitlist instead of live store)*

**Visual Direction:**
- Full-width, high-impact closing banner: centered text over a dramatic close-up glass macro shot (light refraction, edge glow), darker vignette so text stays legible.
- Trust micro-copy beneath CTA: \"Free Shipping • 30-Day Guarantee • Secure Checkout\" with small lock/shipping icons.

**Color/Background Treatment:**
- Background: Void Black with full-bleed cyan-to-violet gradient glow radiating from center — the single boldest color moment on the page, reserved for this final push.

**Shopify Implementation Notes:**
- Section: `sections/gp-final-cta.liquid` → Editor name: **\"Closing Offer Banner\"**
- Settings: heading, subheading, button text/link, toggle for \"email signup mode\" vs \"shop now mode\" (swaps CTA for a Klaviyo/Shopify-native email form block if pre-launch), background image/video upload, trust micro-copy text field.
- Email capture (if enabled) posts to Shopify's native customer/newsletter form — no third-party app dependency required for MVP.
- Responsive: gradient glow scales down in intensity/blur radius on mobile to avoid muddying small-screen text contrast.

---

## 12. FAQ SECTION

**Purpose (conversion role):** Objection-handling — removes final friction points for hesitant buyers right before they'd otherwise abandon at checkout consideration. Also strong for SEO (rich snippet potential).

**Headline:**
> \"Questions? Answered.\"

**FAQ Items:**

1. **Is tempered glass durable?**
   \"Yes. Each pad uses 4mm shatter-resistant tempered glass, the same category of glass used in smartphone screen protectors and cooktops — built to handle daily desk use without scratching or cracking under normal conditions.\"

2. **How do I clean it?**
   \"Wipe with a damp microfiber cloth or standard glass cleaner. No washing, no drying time, no buildup — spills and dust lift off in seconds.\"

3. **Does it affect mouse glide or sensor tracking?**
   \"No — the surface is micro-etched for smooth, consistent glide and is fully compatible with optical and laser mouse sensors.\"

4. **Is it noisy compared to cloth?**
   \"No, it's actually quieter. The smooth glass surface produces less friction noise than textured cloth.\"

5. **Will the artwork fade or peel?**
   \"Never. Artwork is sealed directly beneath the glass surface, fully protected from UV fading, scratching, or rubbing off over time.\"

6. **What sizes are available?**
   \"Glass Pads come in Standard (mouse-only) and XL Desk (full keyboard + mouse coverage) sizes — see each product page for exact dimensions.\"

7. **How long does shipping take?**
   \"Orders ship within 1-2 business days. Delivery timelines vary by location — full details on our Shipping page.\"

**CTA Text:** `Contact Us` (below FAQ list, for unanswered questions)

**Visual Direction:**
- Clean accordion list, single-column, generous vertical spacing (Apple-support-page style, not cramped).
- Plus/minus icon indicator, smooth expand/collapse animation (CSS-only, no JS library needed).

**Color/Background Treatment:**
- Background: Slate Charcoal or Frost White (light mode) — whichever creates better rhythm following Section 11's bold gradient close; recommend Frost White here to \"cool down\" visually before the footer.

**Shopify Implementation Notes:**
- Section: `sections/gp-faq.liquid` → Editor name: **\"FAQ\"**
- Blocks: repeatable \"FAQ Item\" block (question text, answer richtext) — owner can add/remove/reorder freely without code.
- Use native `<details>`/`<summary>` HTML elements for accordion behavior — zero JS dependency, fully accessible out of the box, great for performance and SEO.
- Add FAQ schema markup (`FAQPage` structured data) generated from the blocks automatically for SEO rich results.

---

## 13. FOOTER

**Purpose (conversion role):** Navigation safety net + trust/legitimacy signals (policies, contact) + secondary conversion paths (affiliate/artist program recruitment, newsletter capture).

**Structure:**

**Column 1 — Brand**
- Glass Pads logo/wordmark
- Short tagline: \"Premium tempered glass mousepads. Built to outlast everything else on your desk.\"
- Social icons: Instagram, TikTok, YouTube, X

**Column 2 — Shop**
- Home
- Shop All
- Artist Collection
- Best Sellers

**Column 3 — Company**
- About
- Artist Program
- Affiliate Program
- Contact

**Column 4 — Support/Legal**
- FAQ
- Shipping Policy
- Refund Policy
- Privacy Policy
- Terms of Service

**Bottom bar:** Payment icons (Visa/Mastercard/PayPal/Shop Pay/Apple Pay), copyright line \"© 2026 Glass Pads. All rights reserved.\"

**CTA Text:** `Subscribe` (newsletter email field, small inline form above legal columns — \"Get 10% off your first order\")

**Visual Direction:**
- Minimal, dense, clean 4-column grid on desktop, accordion-collapsible columns on mobile to save vertical space.
- Logo in Pure White, links in Cool Gray with Glass Cyan hover state (underline or color shift).

**Color/Background Treatment:**
- Background: Void Black (darkest point on the page, standard footer convention), Hairline Gray top border to separate from FAQ section above.

**Shopify Implementation Notes:**
- Section: `sections/gp-footer.liquid` (or footer group in `sections/footer-group.json` per Shopify OS 2.0 conventions) → Editor name: **\"Footer\"**
- Uses Shopify's native `linklist` menus for each column (owner manages links via Shopify Admin → Navigation, zero code required to add/remove/reorder links).
- Newsletter form uses Shopify's native customer/newsletter contact form (`{% form 'customer' %}`) — no third-party email app required for MVP, upgradeable to Klaviyo later via a swap-in snippet.
- Responsive: columns collapse into accordions (using native `<details>`) on mobile to keep footer scannable without excessive scroll length.

---

## BUILD SEQUENCE NOTE
Per project workflow: this document represents the **full homepage mockup** for review. Once approved, build proceeds section-by-section as individual, modular Liquid sections (Hero → Trust Bar → Problem → Solution → Comparison → Product Showcase → Features → Use Cases → Testimonials → Artist Collection → Final CTA → FAQ → Footer), each committed separately on a feature branch off `main` per the repo's git workflow, with review before merge.