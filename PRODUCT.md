
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Three confirmed audiences, all shopping in Bulgarian:

- **Skincare-routine regulars** — already run a daily mask/serum ritual. They restock favourites and scan for the next sheet mask. They read ingredient lists, compare sheet counts, and work out price per mask.
- **Curious first-timers** — met Asian beauty through social media, have no routine yet, and need to be led from a concern ("dry skin", "tired eyes") to a specific product.
- **Instagram followers** — arrive from [@asiansecret.bg](https://www.instagram.com/asiansecret.bg/) already trusting the brand. They need the catalog and the fastest possible route to placing an order, not persuasion.

The same page must serve the regular who wants counts, origin and formula, and the newcomer who does not yet know what a sheet mask is. Concern-first navigation (`CONCERNS` in `assets/data.js`) is the bridge between the two.

## Product Purpose

Asian Secret is a Bulgarian online shop for Japanese and Asian cosmetics — sheet masks, eye patches, sun protection, hand care and hair care imported from Japan, South Korea and Thailand. The site is the shop: it presents the assortment, explains each product honestly, and collects the order.

Success is a placed order — a visitor who finds the right product for their concern and completes the cart form without needing to ask a question in DMs first.

## Positioning

Personally vetted Japanese and Korean lines sold with the original product sheet attached. Every product page can show the brand's own overlay sheet (`assets/overlays/`), so the ingredient story, essence volume and sheet count come from the manufacturer rather than from shop copy. The brand's stated stance: products are tested personally before entering the catalog, and skincare is a ritual, not a promise.

## Operating Context

- A single operator runs the shop. Orders land in a personal inbox and are confirmed by phone or email, so the site's job ends at a complete, unambiguous order.
- Bulgarian only (`lang="bg"`). Prices are shown in euro with the lev equivalent at the fixed rate 1.95583 — both currencies matter during the changeover period.
- Delivery is by courier within Bulgaria, to office or to address.
- Instagram is the brand's second storefront and its support channel; the site and the feed are read as one thing.

## Capabilities and Constraints

- **Static site, no backend.** Plain HTML, CSS and vanilla JS, deployable to any static host (GitHub Pages, Netlify, Vercel). No build step, no framework.
- **Ordering is email-based, permanently.** The cart posts through FormSubmit to the shop inbox; the operator confirms and ships. There is no online payment and none is planned. A `mailto:` fallback with the full order is shown if the POST fails. Future work must not assume a checkout backend exists.
- **Cart lives in `localStorage`** and stores `sku`, not `slug`, so the two pack sizes of one product are separate lines.
- **Catalog is confirmed final:** 22 products / 29 SKUs across five categories — sheet masks, eye patches, SPF, hand care, hair care. Seven products ship in two pack sizes and are modelled as one product with a `variants` array; single-pack products are levelled to the same shape by `variantsOf()`, `defaultVariant()`, `priceFrom()`, `bySku()` and friends.
- **Brands carried:** Premium Resbro / Arbro, TEMOGEY, ESTE QUALITY / TUNE UP, Earthful Beauty, PulluP / PuRu PuRu, MHY.
- **Prices in `assets/data.js` are the real current selling prices** and may be used as fact. (The README still calls them "примерни" — that line is out of date.)
- **Delivery terms are provisional:** 3,90 € to office, 4,90 € to address, free over 60 €, dispatch within 48 hours. Usable, but not to be hardened into headline claims until confirmed. They are duplicated in `cart.html` and `contact.html`.
- **Contact details are real and binding:** zax12@abv.bg, 0878 141 487, @asiansecret.bg.
- Icons come from the Lucide CDN as a stand-in; the brand owns no icon set.

## Brand Commitments

- Name **Asian Secret**, wordmark lockup with the descriptor **BEAUTY FROM ASIA**, logo at `assets/logo-as.png`.
- Voice: plain, factual Bulgarian. States what is in the product and how much of it, without superlatives or beauty-industry promise language. "Грижата за кожата е ритуал, а не обещание."
- Product claims are transferred from the manufacturer's own sheets, not authored. Ingredient and quantity claims must stay traceable to `assets/overlays/`.
- Stated principles: natural ingredients (no parabens, alcohol, mineral oils, dyes), effective actives with a named role, originals bought direct from Japanese and Korean lines.

## Evidence on Hand

- 22 products with brand copy, benefits, specs, origin and accent colour — `assets/data.js`.
- Product photography: `assets/products/`, **all 29 SKUs** cut out on transparent backgrounds at 1200 px; the set is listed in `TRANSPARENT_SHOTS`. The four that previously fell back to an overlay crop (MHY hand cream, SPF90+, MHY hair cream, Phytocotton) now have dedicated shots.
- Original manufacturer product sheets at 1400 px — `assets/overlays/`. This is the strongest proof asset the shop owns.
- Instagram grid crops `assets/instagram/ig-1…6.jpg`, each linking to the profile.
- Brand decorative motifs (`assets/deco/`) and sakura elements cut from the logo.
- `assets/story/` now holds the owner's own brand photography: `main.jpg` (9:16 tray still life) and `sub.jpg` (1:1 detail). No longer stand-ins.
- **No customer reviews, ratings, testimonials, certificates, press or sales figures exist.** None may be written or implied.

## Product Principles

1. **The manufacturer's sheet is the source of truth.** Claims come from the overlay, not from copy written to sell. Where the sheet is silent, the site is silent.
2. **Route by concern, not by brand.** A newcomer who knows only "my skin is dry" must reach a product; a regular who knows the brand must not be slowed down getting there.
3. **State the quantity.** Sheet count, essence volume, pack size and origin are the facts this audience buys on — never bury them under mood copy.
4. **The order must survive the handoff.** With no backend, an order that reaches the inbox incomplete or ambiguous is a lost sale. Completeness and fallbacks beat elegance in the cart.
5. **Two pack sizes, one product.** Variant selection stays a choice inside a product, never a duplicated catalog entry.

## Accessibility & Inclusion

No product-specific standard was established. The existing implementation honours `prefers-reduced-motion` (decorative petal animation stops), which future work must preserve.
