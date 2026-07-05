You are doing the final fixes on the "Glass Pads" Shopify theme, then merging to main. Project at /c/Users/Cole Hodgson/OneDrive/Desktop/Glass Pads Shopify on branch feature/homepage-liquid-build.

## READ FIRST
Read these files to understand what needs fixing:
- sections/gp-collection-grid.liquid (card titles)
- sections/gp-search-grid.liquid (card titles)
- sections/gp-blog-grid.liquid (card titles)
- sections/gp-product-showcase.liquid (reference for correct heading pattern)
- config/settings_schema.json (look for typography/font settings)
- assets/gp-theme.css (look for where fonts are referenced)

## WHAT TO FIX

### FIX 1: Heading Hierarchy in Product Cards
The audit flagged that collection grid, search grid, and blog grid use `<h2>` for individual product/article card titles, but they should use `<h3>` because:
- There's no section-level `<h2>` above the grid
- On the product page, the product title is `<h1>`
- Card titles should be `<h3>` to maintain proper hierarchy

In each of these files, add a visible `<span class="gp-visually-hidden">` or `<h2 class="gp-visually-hidden">` section heading above the grid (e.g., "Products" or "Articles"), then change the card `<h2>` tags to `<h3>`.

**gp-collection-grid.liquid**: Add `<h2 class="gp-visually-hidden">{{ collection.title }} products</h2>` above the product grid. Change card title from `<h2>`/`<h3>` to `<h3>`.

**gp-search-grid.liquid**: Add `<h2 class="gp-visually-hidden">Search results</h2>` above the results. Change card titles to `<h3>`.

**gp-blog-grid.liquid**: Add `<h2 class="gp-visually-hidden">{{ blog.title }} articles</h2>` above the article grid. Change article card titles to `<h3>`.

### FIX 2: Wire Typography Settings to CSS Output
The settings_schema.json has font picker settings but they're not wired to CSS output.

**Create snippets/gp-fonts.liquid** that outputs CSS custom properties based on theme settings:
```liquid
<style>
:root {
  --font-display: {{ settings.heading_font.family | default: 'Space Grotesk' }}, sans-serif;
  --font-body: {{ settings.body_font.family | default: 'Inter' }}, sans-serif;
  --font-mono: {{ settings.mono_font.family | default: 'IBM Plex Mono' }}, monospace;
}
</style>
```

**Update layout/theme.liquid**: Include `{% render 'gp-fonts' %}` before the gp-theme.css link. This way theme settings override the CSS defaults.

**Also fix the Google Fonts link**: If custom fonts are selected, the Google Fonts URL needs to change. Use the font family names from settings. If all are default, use the existing URL.

### FIX 3: Quick Final Scan
Quick check:
- Run: `grep -r '<h2' sections/gp-*.liquid | grep -v 'visually-hidden' | grep -v 'gp-h2' | grep -v 'h2 class="gp-h2"' | grep -v 'schema'` to find any remaining heading hierarchy issues
- Run: `grep -rn 'gp-btn--primary' sections/ | wc -l` to count CTAs (just a sanity check)

### FINAL STEP: Merge to Main
After all fixes are committed and pushed:
```bash
git add -A
git commit -m "gp-final: heading hierarchy fixes, font settings wiring, ready for launch"
git push origin feature/homepage-liquid-build
git checkout main
git merge feature/homepage-liquid-build
git push origin main
```

Then the store is ready to upload to a Shopify dev store. The branch can stay for future development.

## QUALITY
- Only change the heading tags — don't modify any styling
- The visually-hidden h2 keeps screen readers happy without changing visual layout
- Font settings override gracefully — if settings are default, nothing changes visually
- After merge, main has the complete theme ready for upload