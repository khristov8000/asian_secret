---
name: Asian Secret
description: Porcelain ground, ink gravity and a single sakura accent — Japanese and Asian skincare presented as a ritual, not a sale.
colors:
  porcelain: "#FBF9F8"
  ivory: "#F7F1ED"
  cream: "#F3E7E2"
  blush: "#FBEDEA"
  blush-deep: "#F6DCD8"
  sakura: "#F3A9AD"
  rose: "#D4666F"
  rose-deep: "#A94E58"
  ink: "#141110"
  white: "#FFFFFF"
  ink-70: "rgba(20,17,16,.68)"
  ink-45: "rgba(20,17,16,.60)"
  line: "rgba(20,17,16,.10)"
  rose-line: "rgba(212,102,111,.32)"
  on-ink: "rgba(250,244,242,.82)"
  on-ink-muted: "rgba(250,244,242,.55)"
typography:
  scale:
    micro: "7.5px"
    wordmark-sub: "8.5px"
    badge: "9px"
    tag: "9.5px"
    spec-key: "10px"
    filter-head: "10.5px"
    label: "11px"
    button-sm: "11.5px"
    meta: "12px"
    usp: "12.5px"
    button: "13px"
    nav: "13.5px"
    body-sm: "14px"
    answer: "14.5px"
    input: "15px"
    cart-line: "15.5px"
    body: "16px"
    lead: "17px"
    card-title: "18px"
    marquee: "19px"
    wordmark: "20px"
    brand-name: "21px"
    title: "22px"
    form-head: "26px"
    pdp-price: "32px"
    ritual-numeral: "34px"
    story-quote: "23px"
  display:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(42px, 6vw, 80px)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "clamp(30px, 3.9vw, 50px)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "22px"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Manrope, -apple-system, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "normal"
  lead:
    fontFamily: "Manrope, -apple-system, Segoe UI, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.62
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, -apple-system, Segoe UI, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.26em"
  price:
    fontFamily: "Playfair Display, Georgia, serif"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  xs: "2px"
  sm: "3px"
  md: "6px"
  lg: "10px"
  pill: "999px"
  arch: "999px 999px 6px 6px"
  arch-lg: "999px 999px 10px 10px"
spacing:
  gutter: "28px"
  gutter-sm: "18px"
  section: "88px"
  section-sm: "58px"
  grid-gap: "18px"
  grid-gap-lg: "40px"
  row-gap-lg: "56px"
  container: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
    rounded: "{rounded.pill}"
    padding: "15px 28px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.white}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.rose}"
    rounded: "{rounded.pill}"
    padding: "15px 28px"
  button-outline-hover:
    backgroundColor: "{colors.rose}"
    textColor: "{colors.white}"
  button-ghost:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "15px 28px"
  button-ghost-hover:
    textColor: "{colors.rose}"
  button-sm:
    padding: "11px 19px"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    width: "42px"
    height: "42px"
  icon-button-hover:
    backgroundColor: "{colors.white}"
    textColor: "{colors.rose}"
  chip:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink-70}"
    rounded: "{rounded.pill}"
    padding: "5px 11px"
  chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.white}"
  filter-chip:
    backgroundColor: "{colors.blush}"
    textColor: "{colors.rose-deep}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
  panel:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "28px"
  category-tile:
    rounded: "{rounded.arch}"
    padding: "30px 22px 24px"
    height: "250px"
  input:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "14px 16px"
  variant-option:
    backgroundColor: "{colors.white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "12px 16px"
  variant-option-selected:
    backgroundColor: "{colors.blush}"
    textColor: "{colors.rose-deep}"
---

# Design System: Asian Secret

## Overview

**Creative North Star: "The Porcelain Shrine"**

The page is a porcelain surface with an ink-black weight at either end and one blossom of colour between them. Everything rests on a near-white ground (`porcelain`, #FBF9F8) that is warm rather than clinical; the header floats over it on frosted glass, the footer and the Instagram band drop to near-black, and between those two anchors the content is allowed to breathe at 88px of vertical air per section.

The shrine is literal, not metaphorical decoration. Category tiles and the product-detail image are arched — fully round at the top, barely rounded at the base (`999px 999px 6px 6px`) — a torii silhouette that appears nowhere else in the system. A `✦` is the system's punctuation mark: it opens every eyebrow, sits in the centre of every divider, and rotates 45° when an FAQ opens. Brand branches, a crescent and a medallion are placed across the *seams* between sections, the way objects are placed at a shrine rather than repeated as a pattern. Each motif keeps a fixed job rather than a single appearance: the branch marks a page's top corner, the crescent opens an ivory band, the cascade closes one, the sage crosses into a dark band. A motif recurs only in that same role.

Restraint carries the retail side. Product cards have no border, no background, no shadow and no lift — the cut-out bottle or sachet floats directly on the porcelain and grows 5% on hover, which is the only thing that moves. Where the rest of the category shouts with discount stickers and star ratings, this system states the sheet count, the origin and the price in a Playfair numeral and stops. The retired gold theme kept at `assets/site-v1-gold.css` is the anti-reference: warmth without metal, ceremony without luxury cliché.

**Key Characteristics:**
- Porcelain ground, ink anchors, one accent — the rose never has to compete.
- The arch (`999px 999px 6px 6px`) is the signature silhouette, reserved for category tiles and the PDP image.
- `✦` is the recurring mark: eyebrow prefix, divider centre, FAQ toggle.
- Product cards are frameless and shadowless; the product itself is the card.
- Decorative motifs cross section boundaries; each keeps one fixed role across the site.
- Every motion is suppressed under `prefers-reduced-motion`.
- Playfair Display for anything that names or prices; Manrope for everything that instructs.

## Colors

A warm near-monochrome — five barely-separated whites running from porcelain to blush — interrupted by a single desaturated rose and grounded by an almost-black brown-black.

### Primary
- **Faded Camellia** (`{colors.rose}`): the one accent. It carries the italic word inside a headline, ring outlines and icons, the active nav underline, the cart badge, focus borders, and the `✦`. It is **not** used for small uppercase text — at 3.37:1 on porcelain it fails WCAG AA below 18.66px, so eyebrows, filter headings and spec keys take `rose-deep` instead. It is never a background for large areas — only for the 20px cart count, small filled states, and button hover.
- **Camellia Shadow** (`{colors.rose-deep}`): the pressed/darker register. Story pull-quotes, selected filter-chip text, selected variant sub-labels. Used where rose on a blush ground would be too light to read.

### Secondary
- **Pale Sakura** (`{colors.sakura}`): the accent as it behaves *on ink*. On the dark footer and dark band it replaces rose entirely — section labels, link hover, social hover fill, toast icon, and the numerals in the principles list. On light grounds it appears only in the marquee separators.

### Neutral
- **Porcelain** (`{colors.porcelain}`): the page ground. Warm off-white, never pure.
- **Paper White** (`{colors.white}`): raised surfaces only — panels, inputs, chips, the marquee strip, the icon button on hover. White is what "lifted" means in this system.
- **Ivory** (`{colors.ivory}`): alternating band background, one step warmer than porcelain, used to separate a section without a border.
- **Cream** (`{colors.cream}`): the announcement topbar only.
- **Blush** (`{colors.blush}`) and **Deep Blush** (`{colors.blush-deep}`): the pink-tinted wash. Hero background, selected states, filter chips, and the radial glow at the top of interior pages.
- **Sumi Ink** (`{colors.ink}`): text, the footer, the dark band, primary button fill. A brown-black (#141110), never #000.
- **Ink 70 / Ink 45** (`{colors.ink-70}`, `{colors.ink-45}`): body prose and quiet metadata respectively. Hierarchy is built with opacity, not with grey hex values.
- **Hairline** (`{colors.line}`): every divider and resting border on light ground — a 10% ink line, not a grey.

### Named Rules

**The One Blossom Rule.** Rose and sakura together stay under roughly 10% of any screen. If a comp needs a second accent hue to work, the layout is wrong, not the palette.

**The Opacity Hierarchy Rule.** Secondary text and borders are `ink` at reduced alpha, never a separate grey token. Never introduce `#666`, `#999`, or `#E5E5E5`.

**The Ink Inversion Rule.** On an ink ground, `rose` is replaced by `sakura` and body text becomes `on-ink` (`rgba(250,244,242,.82)`) — a warm off-white, never pure white. Only headings and links go to `#fff`.

**The Product Colour Rule.** Each catalog entry carries its own `accent` and `tint` (in `assets/data.js`) used solely for its badge and origin chip. That per-product colour never leaks into layout, buttons, or type.

## Typography

**Display Font:** Playfair Display (with Georgia, serif)
**Body Font:** Manrope (with -apple-system, Segoe UI, sans-serif)

**Character:** A high-contrast Didone against a low-contrast geometric sans. Playfair names things — headings, brand wordmark, prices, cart totals, FAQ questions, the numerals in the ritual steps — and does it at weight 500 with a tight −0.02em, so it reads composed rather than fashionable. Manrope does all the work of instruction: labels, buttons, form fields, chips, specs. The split is strict, and the italic is where the two meet: `em` inside a heading turns italic *and* rose, which is how nearly every headline gets its emphasis.

### Hierarchy
- **Display** (500, `clamp(42px, 6vw, 80px)`, 1.08): the h1 on each page. Capped at 13ch in the hero so the line breaks where intended.
- **Headline** (500, `clamp(30px, 3.9vw, 50px)`, 1.08): section titles, always paired with an eyebrow above.
- **Title** (500, 22px, 1.08): pillar and category names, FAQ questions (20px), cart line items (19px). Product-card titles run 18px at 1.24 with a `min-height: 2.48em` so prices align across a row.
- **Body** (400, 16px, 1.62): default prose. `.lead` runs 17px at `ink-70` and is capped at 58ch; long-form prose caps at 70ch, FAQ answers at 76ch.
- **Label** (600, 11px, 0.26em, uppercase): the eyebrow. Related uppercase registers step down the same ladder — 12.5px/0.1em for benefit and USP headings, 10.5px/0.24em for filter-group and footer headings, 10px/0.2em for field labels and spec keys, 9px/0.18em for product badges.
- **Price** (Playfair, 22px; 34px on the PDP, 21px for the cart total): the euro figure. The lev equivalent sits under it in Manrope at 11px `ink-45`.

### Named Rules

**The Two-Voice Rule.** Playfair names and prices; Manrope instructs and labels. A button, a chip, a form label or a spec value in Playfair is a defect — as is a price or a heading in Manrope.

**The Rose Italic Rule.** Emphasis inside a heading is achieved with `<em>`, which is italic *and* rose. No bold, no underline, no colour change without the italic.

**The Letterspacing Ladder Rule.** Uppercase tracking scales inversely with size: 11px → 0.26em, 12.5px → 0.1em, 10px → 0.2em. Uppercase text below 13px without tracking is wrong.

## Layout

A single centred container of 1280px with 28px gutters, dropping to 18px under 760px. Sections run 88px of vertical padding, tightening to 58px on phones, and alternate ground colour (`porcelain` → `ivory` via `.band`) rather than using rules to separate themselves.

The product and category grids are **intrinsically fluid**, not fixed-column.
They reflow at every width via `auto-fill`/`auto-fit` rather than stepping at
named breakpoints:

- Products: `repeat(auto-fill, minmax(min(216px,100%), 1fr))`, with a deliberately asymmetric gap (`56px 40px`, tightening to `36px 24px` at 1080px) that gives each frameless card more air below than beside it.
- Categories: `repeat(auto-fit, minmax(min(180px,100%), 1fr))` at 18px.

**216px is derived, not chosen.** To keep 4 columns in the 998px catalog
container the track minimum must be `<= 219.5px`; to stop a 5th column appearing
in the 1224px rail it must be `> 212.8px`. Any replacement value must satisfy
both, or the desktop layout changes.
- Instagram: 6 → 3 → 2 columns (the only grid with a third stop, at 560px).
- Catalog page: a 186px sticky filter rail beside the grid, collapsing to a static full-width block on phones.
- Product detail: `1.02fr .98fr`; cart: `1.35fr .65fr`; story: `.92fr 1.08fr` — all collapsing to one column at 1080px.

Sticky elements share one offset: the header at `top: 0` (84px tall, 72px on phones), and the filter rail and cart summary at `top: 112px`.

The hero is the one layout that restructures rather than reflows. On desktop the photograph is a full-bleed background with the products framed right, a 260° gradient veil laid over the left third for legibility, and the copy in a 2-column grid occupying the left cell. Under 760px the veil is removed, the photo becomes a 16:10 band above the copy, and the section drops out of flex entirely.

**Body has `overflow-x: hidden`** because decorative motifs are intentionally positioned outside the container. This is load-bearing, not a patch.

### Named Rules

**The Two-Stop Rule.** The system breaks at 1080px and 760px. A new component adopts those stops rather than inventing its own.

**The Seam Container Rule.** Sections are `overflow: hidden`, so decoration that must cross a background boundary lives in its own zero-height `.edge-deco` container placed *between* the two sections, with `overflow: visible`. Below 1360px its right offset must go positive (`right: 12px`), because rotation widens the bounding box and a negative offset creates horizontal scroll.

## Elevation & Depth

Essentially flat, and deliberately so. Depth is built from three things in order of preference: a change of ground colour (`porcelain` / `ivory` / `blush` / `ink`), a 10%-ink hairline, and white as the "raised" surface. Two shadow tokens exist but are rationed — `--sh-1` appears on exactly two elements (the overlay sheet, the order-confirmation panel) and `--sh-2` on three (the story photographs and the toast).

Both shadows are long, low-opacity and almost vertical (a −18px to −26px spread with a large blur), so they read as a soft settling onto paper rather than a card floating above a page.

Hover never adds a shadow. Category tiles rise 2px and warm their border; product images scale; buttons change fill. Nothing lifts.

### Shadow Vocabulary
- **Settle** (`box-shadow: 0 1px 2px rgba(20,17,16,.03), 0 14px 34px -18px rgba(20,17,16,.14)`): a document laid on the page. The manufacturer's overlay sheet and the order-confirmation panel.
- **Float** (`box-shadow: 0 2px 6px rgba(20,17,16,.05), 0 30px 60px -26px rgba(20,17,16,.22)`): genuinely detached objects. The story photographs and the toast.
- **Focus ring** (`box-shadow: 0 0 0 3px rgba(212,102,111,.13)`): the only glow in the system, on focused form fields, paired with a rose border.

### Named Rules

**The Flat-Card Rule.** Product cards get no background, no border, no radius and no shadow. The cut-out product on porcelain *is* the card. Adding a container to a product card breaks the system.

**The Rationed Shadow Rule.** A shadow means the element is a physical object — a photograph, a printed sheet, a notification. UI surfaces (panels, inputs, chips, tiles) use a hairline and a white fill instead.

## Shapes

Four radii and one silhouette.

`3px` is for the smallest interactive squares (custom checkboxes) — nearly sharp. `6px` is the working radius for inputs, radio cards, variant options, cart thumbnails, Instagram tiles and the toast. `10px` is the panel radius for anything holding a block of content: pillars, the cart summary, form boxes, delivery cards, the overlay sheet. `999px` is unusually dominant — every button, chip, filter pill, icon button, quantity stepper, search field, sort select and status ring is fully round. A rectangular button in this system reads as foreign.

The **arch** is the signature: `999px 999px 6px 6px` on category tiles, `999px 999px 10px 10px` on the product-detail image. A fully round top on a squared base. It is used on exactly two components, and its scarcity is what makes it read as a mark rather than a style.

Circles carry every icon: the 42–46px `.ring` outline (1px `rose-line`, white or transparent fill, rose glyph) recurs across USP strip, pillars, contact list, delivery cards and benefit rows. On the PDP benefits list the ring switches to `currentColor` so it inherits each row's colour.

Borders are always exactly 1px and almost always `line` (10% ink). `rose-line` (32% rose) marks anything the accent owns — rings, selected filter chips, the story pull-quote's left border, sparkle dividers.

### Named Rules

**The Arch Reservation Rule.** `999px 999px x x` belongs to category tiles and the PDP image. Do not apply it to cards, panels, buttons, or modals.

**The Round-Control Rule.** Anything the user clicks that is not a panel is a pill. Inputs and text areas are the documented exception at 6px.

## Components

### Buttons
- **Shape:** fully round (`{rounded.pill}`), 1px transparent border so all three variants share a box.
- **Type:** Manrope 13px / 600 / 0.12em / uppercase, with a 16px icon at 1.6 stroke.
- **Primary:** ink fill, white text, `15px 28px`. Hover swaps the fill to rose — the accent arrives on interaction rather than at rest.
- **Outline:** transparent with a rose border and rose text; hover fills rose.
- **Ghost:** white fill with a hairline border; hover shifts border and text to rose.
- **Small:** `11px 19px` at 11.5px, used inside product cards and section heads.
- **Press:** every button scales to `0.975`. **Disabled:** 45% opacity, pointer-events off.
- **Card exception:** the buy button inside a product card overrides primary to transparent-with-hairline, inverting to ink fill on hover — so a grid of four cards doesn't become four black bars.

### Chips
- **Style:** white fill, hairline border, `ink-70` text, 11px, fully round. Used for size, origin and variant summaries.
- **Selected (concern filter):** ink fill, white text, ink border.
- **Filter chip (active filters):** blush fill, `rose-line` border, `rose-deep` text, with a 12px × icon; hover deepens to `blush-deep`.
- **Origin chip:** border and text take the product's own accent at 40% (`${accent}66`) — the one place per-product colour reaches a chip.

### Cards / Containers
- **Product card:** no background, no border, no radius, no shadow. A 1:1 image area with 6%/8% padding, a hairline `.foot` separating price from action, and fixed minimum heights on the title (`2.48em`) and description (3 clamped lines) so prices align across the row. Hover scales the image 1.05 and turns the title rose — nothing else.
- **Panel** (pillars, cart summary, form box, delivery card, brand card): white fill, hairline border, 10px radius, 26–30px padding, no shadow.
- **Category tile:** arch silhouette, 250px minimum height, per-category tint background, a white-to-transparent gradient over the top 55%, count in tracked uppercase at the top, name in Playfair at the bottom. Hover: `translateY(-2px)` and a rose border.

### Inputs / Fields
- **Style:** white fill, hairline border, 6px radius, `14px 16px`, Manrope 15px. Labels sit above in 10.5px uppercase at 0.2em, `ink-45`.
- **Focus:** rose border plus a 3px rose glow at 13% opacity. Never the browser default outline.
- **Search field:** the exception — fully round with a 14px icon inset at 11px left; focus shifts the border to `rose-line` only, no glow.
- **Checkbox:** 16px, 3px radius, appearance stripped; checked fills rose with a 3px inset white ring.
- **Radio card:** hairline box that shifts to `rose-line` border on blush fill when hovered; native input keeps `accent-color: rose`.
- **Price range:** a 2px hairline track with a rose fill segment and 15px white circular thumbs on a 1px rose border.

### Navigation
- **Header:** sticky, 84px, `rgba(251,249,248,.82)` over a 16px backdrop blur, hairline bottom border. Links are Manrope 13.5px at 0.06em.
- **Underline:** each link carries a 1px rose rule animated from `right: 100%` to `right: 0` over 0.3s — it wipes in from the left rather than fading. The active link holds it open.
- **Icon buttons:** 42px circles with a hairline border; hover fills white and turns rose. The cart badge is a 20px rose circle at the top-right corner.
- **Mobile:** below 760px the nav is replaced by a burger, the logo drops to 40px and the wordmark to 15.5px so the lockup and three controls fit at 390px.
- **Footer:** ink ground, `sakura` section headings at 10px/0.24em, warm off-white links that go sakura on hover, 40px circular social buttons that fill sakura on hover.

### Decorative System (signature)

The brand's own motifs sit in `assets/deco/`, pre-trimmed and pre-scaled to their display size, at 26–55% opacity behind a `z-index: 2` content layer. **Each motif holds one fixed role**, and recurs only in that role — the scarcity is in the job, not the file. Current census:

| motif | role | uses |
| --- | --- | --- |
| `branch.png` | top corner of a page | 4 — Категории (left), interior page tops (right, mirrored) |
| `cascade.png` | closes an ivory band, bottom | 3 — story seam, Въпроси seam, За нас hero |
| `crescent.png` | opens an ivory band, top | 3 — Подбери грижа, Доставка, Марките |
| `sage.png` | crosses into a dark band | 3 |
| `sage-horizontal.png` | mirrored horizontal seam | 2 |
| `medallion.png` | seal on the story photograph | 1 |
| `divider.png`, `fan.png`, `petals.png`, `ring.png` | **unused** | 0 |

`sakura-petal.png` is the drifting accent spawned by `spawnPetals()`; it is not part of this census. `ring.png` and `divider.png` contain gold and cannot be used without re-cutting — the palette bans it.

Motifs that must cross a background seam live in a zero-height `.edge-deco` container between the two sections. Several are counter-rotated in CSS to correct the artwork's own axis (`rotate(-26deg)` for the petals, `rotate(-58deg)` for the vertical branch); when mirroring one, remember CSS applies transforms right-to-left. All decoration is hidden below 760px.

### Toast
Fixed bottom-right, ink fill, 6px radius, `Float` shadow, a sakura check icon, rising 16px into place over 0.34s. It is the only element that appears unprompted.

## Do's and Don'ts

### Do:
- **Do** put emphasis inside headings in `<em>`, which renders italic and rose. That pairing is the house's signature gesture.
- **Do** build hierarchy from `ink` at 68% and 44% opacity rather than introducing grey values.
- **Do** use `✦` as the system's mark — eyebrow prefix, divider centre, FAQ toggle — and keep it in the accent colour.
- **Do** separate sections by alternating `porcelain` and `ivory` grounds; reach for a rule only when a background change would be wrong.
- **Do** swap `rose` for `sakura` and body text for `on-ink` on any ink-grounded surface.
- **Do** place decoration outside the container and rely on `body { overflow-x: hidden }`, using `.edge-deco` whenever the motif must cross a seam.
- **Do** guard every animation with `@media (prefers-reduced-motion: reduce)` — the existing code disables reveals, petals, blossoms and the hero entrance.
- **Do** express a reveal's travel through the `--rise` custom property, never as a `transform` on the variant selector. `.card[data-reveal]{transform:…}` ties with `[data-reveal].in{transform:none}` on specificity and, sitting lower in the file, wins — leaving the element visible but permanently displaced.
- **Do** give new interactive controls the pill radius and Manrope uppercase at 0.12em.
- **Do** work in the six named tiers, not two breakpoints: A `>=1281` (desktop, frozen), B `1081-1280`, C `901-1080`, D `761-900`, E `431-760`, F `<=430` (plus a `<=390` step for the header). Every breakpoint rule lives in the consolidated tier section at the end of site.css — never beside its component, which is how 761-1080px went uncovered. The old two-breakpoint rule left 761-1080px unhandled, which clipped a third of the catalog behind a viewport edge that could not be scrolled to.
- **Do** verify any layout change with a pixel-diff at 1280/1440/1920 before shipping. Tier A must come back byte-identical.
- **Do** pin `clamp()` upper bounds so they are reached at **1200px**, not at the tier-A edge — a ramp topping out at 1281px lands on sub-pixel values and shifts desktop text.
- **Do** clamp equivalent card fields to fixed heights so prices align across a frameless row.

### Don't:
- **Don't** put a border, background, shadow or lift on a product card. The frameless card is the deliberate centre of the system. Cards *do* now fade in on scroll (`--rise:9px`, no scale) — appearance only; nothing that frames or raises the card.
- **Don't** use the arch (`999px 999px x x`) anywhere but category tiles and the product-detail image.
- **Don't** reintroduce gold. `assets/site-v1-gold.css` is a retired theme kept only as a backup, and the palette's warmth must come from blush and cream.
- **Don't** add a second accent hue. Per-product `accent` colours stay confined to badges and origin chips.
- **Don't** set body text or backgrounds to pure `#000` or `#FFF` on a light ground — the ground is `porcelain` and the ink is `#141110`. White is reserved for raised surfaces.
- **Don't** set a heading, price, button, label or spec value in the wrong family; the Playfair/Manrope split is strict.
- **Don't** add discount stickers, countdowns, star ratings or "customers also bought" rails. No review data exists, and the category's sale-wall vocabulary is the anti-reference.
- **Don't** use shadows for UI surfaces — a hairline and a white fill say "raised" in this system.
- **Don't** let a rotated decorative element keep a negative `right` offset below 1360px; it creates horizontal scroll.
- **Don't** use the browser's default focus outline; focused fields take a rose border plus the 13% rose glow.
