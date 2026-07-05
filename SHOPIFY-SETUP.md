# Glass Pads — Shopify Setup Guide

A plain-language walkthrough for getting this theme live on a Shopify store. No coding required for any of the steps below — everything is done through the Shopify admin and theme editor.

## 1. Theme overview

Glass Pads is a custom Online Store 2.0 theme built specifically for this brand — a full homepage, product/collection/search pages, an account area, and a set of marketing pages (About, Gallery, Custom Artwork, Artist Program, Contact, Policies). Every section is prefixed `gp-` and shows up in the theme editor under a plain-English name (e.g. `sections/gp-hero.liquid` shows as "Hero Banner"). Sections and blocks are fully editable — headings, images, buttons, colors, and repeatable rows (FAQ items, testimonials, features, etc.) can all be changed from **Online Store → Themes → Customize** without touching code.

## 2. Required apps

**None are required to launch.** The theme uses only native Shopify features: the customer/newsletter form, the contact form, the cart & product AJAX APIs, and native search — no third-party app is needed for the MVP to function.

**Optional upgrade — reviews.** The testimonials section (`gp-testimonials`) and the product page's review tab currently show static/placeholder content, structured so a reviews app can be swapped in later without a rebuild. If you want real customer reviews, install **Judge.me** or **Loox**, then replace the placeholder block in `sections/gp-testimonials.liquid` and the `data-gp-reviews-app-slot` block in `sections/gp-product.liquid` with the app's embed snippet.

## 3. Initial setup checklist

1. **Upload the theme.** In Shopify admin, go to **Online Store → Themes → Add theme → Upload zip** (or connect this repo via Shopify CLI/GitHub — see §7). Publish it once you're ready to go live, or preview it first.
2. **Create collections.** At minimum, create an "All" collection (used as the default Featured Products / Shop All destination) and an "Artist Collection" collection (linked from the homepage's Artist Collection Spotlight section). Add more collections per product line as needed (e.g. Standard, XL Desk).
3. **Create products** and tag them using the convention in §5 below — the homepage's filter pills, use-case cards, and collection pages all key off these tags.
4. **Configure theme settings** at **Online Store → Themes → Customize → Theme settings**:
   - **Colors** — brand palette (defaults already match the brand spec).
   - **Typography** — font weight and optional font overrides.
   - **Social media** — Instagram/TikTok/YouTube/X URLs (populates the footer, mobile nav, and JSON-LD `sameAs` fields).
   - **Newsletter** — heading/button copy for the footer signup form.
   - **Shipping & guarantee** — the trust micro-copy shown near add-to-cart and in the final CTA.
   - **SEO** — a default social share image (1200×630px) and fallback meta description, used whenever a page/product/article doesn't have its own.
   - **Layout** — max content width and section spacing, if you want a tighter or looser page feel.
   - **Checkout** — see the note in that settings tab: Shopify checkout is a separate experience from the theme, so these values (logo, fonts, accent color) need to be copied into **Settings → Checkout → Branding** in the admin to actually apply.

## 4. Navigation setup

Create these menus at **Online Store → Navigation** — the theme reads them by handle, so use these exact handles:

| Menu handle | Used for |
|---|---|
| `main-menu` | Primary nav (desktop) + mobile nav drawer. Recommended items: Home, Shop All, Artist Collection, Custom Artwork, Gallery, About, Contact. |
| `footer-shop` | Footer "Shop" column. |
| `footer-company` | Footer "Company" column. |
| `footer-support` | Footer "Support/Legal" column — link to Shipping, Refunds, Privacy, Terms (Shopify auto-generates these policy pages under **Settings → Policies**). |

## 5. Product tag convention

Tags drive the homepage filter pills, the "Shop by Use Case" links, and collection filtering — apply them consistently to every product:

- **Size:** `size-standard`, `size-xl`
- **Artwork style:** `artwork-gradient`, `artwork-geometric`, `artwork-monochrome`, `artwork-abstract`, `artwork-artist-collab`
- **Merchandising:** `best-seller`

## 6. Creating marketing pages

Templates already exist for each of these — when creating the page in **Online Store → Pages → Add page**, just set the matching template in the "Theme template" dropdown on the right:

| Page | Template to select |
|---|---|
| Gallery | `page.gallery` |
| Custom Artwork | `page.custom-artwork` |
| About | `page.about` |
| Contact | `page.contact` |
| Artist Program | `page.artist-program` |
| Policies (if not using Shopify's auto-generated policy pages) | `page.policies` |

**Blog:** create a blog at **Online Store → Blog posts → Manage blogs** (any handle works — the theme's `templates/blog.json` and `templates/article.json` render whichever blog/article you link to).

## 7. Setting up the QR code loop

The homepage's "Glass Pads Loop" section (`gp-qr-funnel`) promises a QR code on packaging that links to the community gallery. To set this up:

1. Generate a QR code (any QR generator) pointing at `https://<your-store-domain>/pages/gallery`.
2. Add that QR code image to your product packaging/insert artwork (done outside Shopify, in your packaging design files).
3. Make sure the Gallery page (§6) is published and showcases real customer setups before shipping the first batch with the code — update the `gp-gallery-grid` section's blocks as you collect submissions.

## 8. Shopify CLI — local development

```bash
# Install the CLI (once)
npm install -g @shopify/cli @shopify/theme

# Authenticate + link to your store
shopify theme dev --store your-store.myshopify.com

# Push local changes to a theme on Shopify
shopify theme push

# Pull the live theme down locally
shopify theme pull

# Run Shopify's theme linter before committing
shopify theme check
```

`shopify theme dev` starts a local preview server with hot reload against your dev store — use it instead of editing directly in the admin when making code changes.
