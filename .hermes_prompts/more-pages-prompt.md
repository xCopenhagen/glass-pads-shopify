You are continuing to build the "Glass Pads" Shopify theme. The project is at /c/Users/Cole Hodgson/OneDrive/Desktop/Glass Pads Shopify on branch feature/homepage-liquid-build.

## READ FIRST
Read these files to understand the existing codebase:
- assets/gp-theme.css (all styles, custom properties)
- assets/gp-theme.js (existing JS init functions)
- layout/theme.liquid (the head/body structure — this will need updates)
- snippets/gp-icon.liquid, gp-button.liquid, gp-section-header.liquid
- templates/index.json, templates/product.json, templates/collection.json
- sections/gp-hero.liquid, sections/gp-footer.liquid (patterns)
- HOMEPAGE-MOCKUP.md (brand copy, design system)
- CLAUDE.md (project conventions)

## WHAT TO BUILD — 4 features, ~10 files

### FEATURE 1: Blog & Article Pages
Content marketing pages for SEO and brand storytelling.

**1a. sections/gp-blog-hero.liquid**
Blog listing page hero.
- Headline: "Stories & Setups"
- Subheading: "Behind the designs, the desks, and the people who make Glass Pads what it is."
- Clean, minimal hero with a subtle glow
- Schema: heading, subheading, background_image

**1b. sections/gp-blog-grid.liquid**
Blog listing grid using Shopify's native blog/article system.
- Uses {% paginate blog.articles %} with 6 articles per page
- Article cards: featured image, title, excerpt (first 150 chars), date, author, read more link
- 3-col grid desktop, 2-col tablet, 1-col mobile
- Each card: Graphite surface, rounded corners, image at top, text below
- Pagination at bottom
- Empty state: "No articles yet. Check back soon."
- Schema: articles_per_page (range 3-24, default 6), show_author (checkbox), show_date (checkbox)
- Presets with default placeholder content

**1c. sections/gp-article.liquid**
Individual article page section.
- Uses article object (article.title, article.content, article.image, article.author, article.published_at)
- Featured image at top (full-width, max-height 500px)
- Article title (h1), author + date below
- Article content ({{ article.content }})
- Social share buttons: Copy link, Twitter/X, (placeholders)
- Related articles at bottom (using blog.articles, excluding current article, limit 3)
- Back to blog link
- Schema: show_share_buttons (checkbox), show_related (checkbox, default true), related_count (range 1-6, default 3)
- Max-width content area (720px) for readability
- Frost White background for clean reading experience

**1d. templates/blog.json**
Blog listing template wiring hero + grid with 6 default articles.

**1e. templates/article.json**
Article template wiring gp-article section.

### FEATURE 2: 404 Page + Password Page
Branded error page and coming soon / password page.

**2a. sections/gp-404.liquid**
Custom 404 page section.
- Headline: "Lost Your Way?"
- Body: "This page doesn't exist. But the perfect glass pad for your desk does."
- Large 404 number in the background (subtle, like a watermark) — "404" in IBM Plex Mono, 200px, very low opacity
- CTA: "Shop Glass Pads" (primary) + "Go Home" (secondary)
- Quick links below: Browse all products, Custom Artwork, Gallery
- Background: Void Black with subtle cyan glow
- Schema: heading, body, button_text, button_link, secondary_text, secondary_link

**2b. sections/gp-password.liquid**
Coming soon / password page for pre-launch.
- Full-screen, centered
- Glass Pads logo/wordmark at top
- Headline: "Coming Soon"
- Body: "Something exceptional is being crafted. Enter your email to be the first to know when we launch."
- Email capture form (native Shopify password page form)
- Password entry field for store preview access ({{ form.password }})
- Background: Full-bleed dark with animated cyan-to-violet gradient (CSS animation)
- Footer: "© 2026 Glass Pads"
- Schema: heading, body, show_email_form (checkbox, default true), show_password (checkbox, default true)
- Styles: full viewport height, no nav, no footer, centered content

**2c. templates/404.json**
404 template wiring gp-404 section.

**2d. templates/password.json**
Password template wiring gp-password section.

### FEATURE 3: Newsletter Popup
Exit-intent or timed email capture popup.

**3a. sections/gp-newsletter-popup.liquid**
Newsletter signup popup section.
- Modal overlay that appears on:
  - Exit intent (mouse leaves the window)
  - OR timed delay (configurable seconds)
  - OR scroll percentage (configurable)
- Content:
  - Headline: "Get 10% Off Your First Order."
  - Body: "Be the first to know about new drops, artist collaborations, and exclusive designs."
  - Email input + Subscribe button (native Shopify {% form 'customer' %} with contact[tags]=newsletter)
  - Success message on submission
  - "No thanks, I'll pay full price" dismiss link at bottom
  - Close button (X) in top-right
  - Small checkbox: "Don't show again" (stores in localStorage)
- Schema settings:
  - heading, body, button_text, success_message, dismiss_text
  - trigger_type (select: exit_intent, timed, scroll, manual)
  - trigger_delay (range 5-60 seconds, default 15)
  - scroll_percentage (range 25-100, default 50)
  - show_on_mobile (checkbox, default false)
  - enable_popup (checkbox, default true)
  - discount_text (text, default "Get 10% off your first order")
- Styles: centered modal with backdrop overlay, smooth fade-in animation, mobile-friendly (full-screen on mobile)
- JS: initNewsletterPopup() in gp-theme.js — exit intent detection, timer, scroll trigger, localStorage check
- CSS classes: .gp-popup-overlay, .gp-popup-modal, .gp-popup-content, .gp-popup-close, .gp-popup-success

### FEATURE 4: Customer Account Pages
Login, register, and account dashboard pages.

**4a. sections/gp-login.liquid**
Customer login page.
- Uses Shopify's {% form 'customer_login' %} and {% form 'recover_customer_password' %}
- Clean split layout: left side form, right side brand messaging
- Form fields: Email, Password
- "Forgot your password?" link toggles recovery form
- "Create account" link below
- Right side: "Welcome Back" heading, "Your premium desk setup awaits." body, decorative glass pad mockup
- Schema: heading, body, recover_heading, recover_body, show_guest_checkout (checkbox)

**4b. sections/gp-register.liquid**
Customer registration page.
- Uses {% form 'create_customer' %}
- Form fields: First Name, Last Name, Email, Password
- "Sign up for 10% off your first order" headline
- Back to login link
- Right side: same brand messaging as login
- Schema: heading, body, button_text

**4c. sections/gp-account.liquid**
Customer account dashboard.
- Welcome message with customer name
- Order history table: Order #, Date, Payment Status, Fulfillment Status, Total
- Each order row links to order page
- Address section: default shipping address, link to manage addresses
- Sidebar: Account navigation (Orders, Addresses, Logout)
- Empty state: "No orders yet. Time to upgrade your desk." with CTA to shop
- Schema: show_order_history (checkbox), show_addresses (checkbox)

**4d. sections/gp-addresses.liquid**
Customer address management page.
- Uses {% form 'customer_address' %} with customer.addresses
- List of saved addresses with Edit/Delete buttons
- Add new address form
- Default address badge
- Back to account link

**4e. templates/customers/login.json**
Login template wiring gp-login section.

**4f. templates/customers/register.json**
Register template wiring gp-register section.

**4g. templates/customers/account.json**
Account template wiring gp-account section.

**4h. templates/customers/addresses.json**
Addresses template wiring gp-addresses section.

**4i. templates/customers/order.json**
Order template (basic) — shows order details, line items, shipping address, timeline.

### FEATURE 5: Add new icons to gp-icon.liquid
- clock (reading time / business hours)
- book-open (blog)
- arrow-left (back to blog)
- copy (copy link)
- eye (password/coming soon)
- gift (discount/popup)
- user (account)
- package (orders)
- map-pin (addresses)
- log-out (logout)

## GIT WORKFLOW
Commit each feature separately:
```
git add -A
git commit -m "gp-blog: blog listing + article page templates"
```
Then next feature, etc.

Feature 1 → "gp-blog: blog listing + article page templates"
Feature 2 → "gp-404-password: 404 error page + password/coming soon page"
Feature 3 → "gp-popup: newsletter signup popup with exit-intent/timed triggers"
Feature 4 → "gp-accounts: customer login, register, account dashboard pages"
Feature 5 → "gp-icons: add new icons to icon system"

## QUALITY
- EVERY section must have {% schema %} with presets
- All text editable via theme editor
- Responsive at all breakpoints
- Follow the brand design system exactly
- No Liquid errors
- Blog and article pages use Shopify native blog/article objects
- Account pages use Shopify native customer objects and forms
- Newsletter popup stores dismissed state in localStorage
- 404 page is on-brand (not generic)
- Password page has animated gradient background