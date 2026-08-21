# Responsive & mobile-friendly pass — Asian Secret

Date: 2026-08-21
Status: approved for implementation

## Problem

The site already has a partial mobile pass: ~20 media queries at two
breakpoints (`760px`, `1080px`), a working burger menu, 44px touch targets, a
mobile product carousel and collapsible catalog filters. The pass is
incomplete and unsystematic — fixes landed where a problem was noticed, so
behaviour is inconsistent between widths.

A browser audit (6 pages x 11 widths, Chrome headless, lazy images forced
eager) confirmed the defects below. Measured, not inferred.

### D1 — Catalog cards clipped and unreachable (worst)

At 768-1080px `products.html` computes 3 grid tracks totalling 671px inside a
486px container. The third column is sliced by the viewport edge, and because
`body{overflow-x:clip}` it cannot be scrolled to. A third of the catalog is
invisible and unbuyable on every portrait tablet.

Cause: `.shop{grid-template-columns:186px 1fr}` keeps its desktop sidebar while
`.products{repeat(3,1fr)}` fires at `max-width:1080px`. The `.filters-toggle`
that collapses the sidebar is gated at `max-width:760px` — too low.

### D2 — About page scrolls horizontally, including on desktop

`about.html` has real horizontal overflow of +63px (768) to +101px (1440).
Present at 1280 and 1440, i.e. inside the "good" desktop range.

Cause: `overflow-x:clip` is set on `body` only, which does not prevent the
`html` element from scrolling. Compounded by `.edge-*` deco anchored with
negative `left:` offsets, which the `max-width:1360px` rule only ever reset for
`right:`.

### D3 — Values cards clip their own text

`@media(max-width:1080px){.vals{height:380px}}` is a fixed height; at 768-1024
`.val-copy` overflows it and text is cut.

### D4 — Header overflows the viewport at 360px

`.actions` and `.burger` reach x=361 in a 360px viewport, on all 6 pages.

### D5 — Tablet band is ~40% taller than desktop

index.html is 8123px at 1024 vs 5691px at 1180. Consequence of D1-D3.

### D6 — Values copy unreachable on touch

`.vals:hover .val:hover .val-copy` (site.css:536) reveals card text on hover
only. On touch devices cards 2 and 3 never show their copy.

### Explicitly NOT defects

Investigated and dismissed: marquee overflow (by design), `.deco` bleed
(decorative, hidden below 760), `.benefit` and `.page-intro` clipping
(line-clamps present at all widths including desktop), and large vertical gaps
seen in first-pass screenshots (artifacts of `loading="lazy"`, not layout).

## Constraint

**Desktop >= 1281px must render identically.** Verified by pixel-diff, not by
inspection. Any non-zero diff at 1280/1440/1920 is a defect in this work.

## Design

### 1. Tier system

Stylesheet stays desktop-first (`max-width` queries); a mobile-first rewrite
would risk the desktop for no user-visible gain. Six named tiers:

| Tier | Range | Purpose |
|---|---|---|
| A | >=1281 | Desktop — frozen, verified by pixel-diff |
| B | 1081-1280 | Wide laptop (plus a 1360px inset for edge decoration) |
| C | 901-1080 | Laptop / landscape tablet |
| D | 761-900 | Portrait tablet |
| E | 431-760 | Phone |
| F | <=430 | Small phone (with a further <=390 step for the header) |

**Corrected after implementation.** The table first drafted here listed
601-900 / 391-600 / <=390 and omitted the long-standing 760px phone breakpoint
entirely, which carries ~15 rule blocks. The shipped tiers are the ones above:
the phone breakpoint stays at 760, and the narrow-phone step is 430 (where the
two-column field row becomes cramped) rather than 600.

### 2. Fluid grids

```css
.products { grid-template-columns: repeat(auto-fill, minmax(min(216px,100%), 1fr)); }
.cats     { grid-template-columns: repeat(auto-fit,  minmax(min(180px,100%), 1fr)); }
```

216px is derived, not chosen by feel. To hold today's desktop counts the track
minimum must satisfy both:

- catalog, container 998px, gap 40 — 4 cols requires `4m+120 <= 998` -> `m <= 219.5`
- rail, container 1224px, gap 40 — 5 cols must NOT fit: `5m+160 > 1224` -> `m > 212.8`

So `m` in `(212.8, 219.5]`. 216 sits mid-range and reproduces 4 columns in both
containers exactly.

Phone tiers keep explicit overrides, because auto-fill alone would drop `.cats`
to 1 column at 360px (today 2):

- E/F: `.cats{grid-template-columns:repeat(2,minmax(0,1fr))}` (preserves the
  existing `:last-child:nth-child(odd)` centring rule)
- existing `<=760` `.products{repeat(2,minmax(0,1fr))}` and `.products.rail`
  flex carousel are retained unchanged

Grid gap tightens in tiers C/D (`56px 40px` -> `36px 24px`) so 768px fits 3
columns of 216 rather than 2 of 336.

### 3. Defect fixes

- D1: fluid grid above + move `.filters`/`.filters-toggle` collapse from
  `<=760` to `<=1080`.
- D2: `html{overflow-x:clip}` (safe with `position:sticky`; `overflow:hidden`
  was already rejected for that reason, site.css:12) + reset negative `left:`
  deco offsets alongside the existing `right:` reset.
- D3: `.vals{height:380px}` -> `min-height`.
- D4: tier F tightens `.brand .wordmark` and `.actions` gap.
- D5: no direct work; verified by re-measurement after D1-D3.
- D6: tiers C/D and `(hover:none)` reveal all `.val-copy`.

### 4. Fluid typography

`h1`/`h2` already use `clamp()`. `h3` (22px), `.lead` (17px) and `section`
padding are fixed and jump at breakpoints. Convert to `clamp()` with the upper
bound pinned to today's desktop value, so tier A is unaffected and in-between
widths interpolate.

### 5. Consolidation

Tier rules move into one ordered, commented block at the end of site.css,
largest to smallest, absorbing the two ad-hoc `max-width:760px` blocks
currently appended at lines ~817 and ~854. Component-local queries stay only
where genuinely component-scoped.

## Out of scope

HTML restructuring beyond adding class hooks; new images; any change to the
desktop design; `_ds_bundle.js` (generated, unreferenced by any page).

## Implementation status (2026-08-21)

All six sections implemented and verified. Notes:

- §1 tier boundaries corrected as above.
- §5 consolidation moved all 25 responsive `@media` blocks into one ordered
  section. `prefers-reduced-motion` guards deliberately stay with their
  features — they guard an animation, not a breakpoint.
- §5 also uncovered and fixed a real cascade bug: while the tier block sat at
  the end of the file, its `@media(max-width:1080px){.products{gap:36px 24px}}`
  beat the phone `gap:24px 14px`, because both match at 390px and 1080 came
  later. Phones were rendering with tablet spacing.
- A seventh defect (D7) was found after the audit: the checkout form pinned to
  446px on phones because `.field input` lacked `min-width:0`. The audit had
  missed it because the cart is empty on load, so the form never rendered at
  any width. Any future audit must seed a cart first.

## Verification

1. Re-run the audit harness: 6 pages x 11 widths. Every defect resolved, no new
   overflow, no horizontal scroll at any width.
2. Pixel-diff 1280/1440/1920 before vs after. Must be zero.
3. Before/after screenshots at tablet and phone widths for review.
