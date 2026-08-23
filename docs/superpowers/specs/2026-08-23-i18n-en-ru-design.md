# English and Russian translations — Asian Secret

Date: 2026-08-23
Status: approved for implementation

## Problem

The site exists only in Bulgarian. The goal is a full English and Russian
version under `/en` and `/ru`, connected to the existing SEO setup, with
Bulgarian remaining the default for every visitor regardless of browser
language.

Measured scope of the text to translate:

| Source | Volume |
|---|---|
| `assets/data.js` catalog | ~3,562 words across 756 strings (incl. non-text keys) |
| 6 page templates, visible prose | ~2,000 words |
| Cyrillic string literals in templates + `assets/shop.js` | 310 occurrences |

The 310 literals matter architecturally: `cart.html` alone holds 91, because
the entire checkout UI — labels, validation messages, summary rows — is built
in JavaScript rather than written in markup. Markup-based and JS-based strings
therefore need two different mechanisms.

## Decisions taken

These were settled during brainstorming and are not open in implementation:

1. **Translation source** — written directly into the repo now, adapted for
   tone rather than translated literally. Reviewed by the owner afterwards.
2. **Path segments** — localized. English words under `/en`; `/ru` reuses the
   existing `produkt` / `kategoria` transliteration, which reads natively in
   Russian (продукт / категория). Product slugs are brand names and stay
   byte-identical in all three languages.
3. **Order flow** — pages only. Confirmation emails stay Bulgarian in all
   languages; `api/_emails.php` and `api/order.php` are not modified.
4. **Language memory** — none. No `Accept-Language` sniffing, no cookie, no
   `localStorage`, no JS redirect. `/` renders Bulgarian on every visit for
   every visitor. Language changes only by an explicit click.

### Known consequence of decision 3

A Russian customer browses and checks out entirely in Russian, then receives a
Bulgarian confirmation email. This is a real path a customer will walk. It is
accepted for now; adding it later means passing a `lang` field through the
order POST and keying the existing template strings in `api/_emails.php`.

## Architecture

### Bulgarian does not move

The root tree keeps every URL it has today — `/`, `/products`,
`/produkt/resbro-ex/`, `/kategoria/masks/`. There is no `/bg` prefix and no
redirect of existing URLs. `/en` and `/ru` are purely additive, so nothing
currently ranking is disturbed.

### The Bulgarian templates are the locale store for markup

Translatable markup keeps its Bulgarian text inline and gains a key:

```html
<a href="/products" data-t="nav.products">Продукти</a>
```

The build replaces the element's text when generating `/en` and `/ru`. The
Bulgarian page ships the file as authored.

This has one property worth stating as a requirement rather than a
side-effect: **Bulgarian cannot be broken by a translation defect.** A missing
key, a malformed JSON file or a build failure leaves the primary market's site
untouched, because Bulgarian is never rendered from the locale data.

It also removes the need for a `bg` entry for every markup string.

### JS-built UI is the exception

Strings constructed inside JavaScript cannot carry an attribute. They become
lookups against a dictionary the build injects into each generated page:

```js
`<label for="name">${T['checkout.name']}</label>`
```

These strings do need a Bulgarian entry, since the Bulgarian page also reads
from `T`. This is the only place where Bulgarian text lives outside the
templates, and the `i18n-check` script asserts that `ui.bg.json` covers every
`T[...]` key referenced in shipped JS.

### File layout

```
i18n/ui.bg.json          JS-side strings only
i18n/ui.en.json          JS-side strings + every data-t key
i18n/ui.ru.json          same as en
i18n/catalog.en.json     per-slug product copy
i18n/catalog.ru.json     per-slug product copy
```

`assets/data.js` remains the untouched Bulgarian source of truth. The catalog
files carry only `name`, `short`, `intro`, `benefits[].t`, `benefits[].d`,
`specs`, `story.lead`, `story.images[].cap` and `badges`, keyed by slug.

Never translated, in any language: `slug`, `sku`, `price`, `accent`, `tint`,
`cat`, `concerns`, `overlay`, `benefits[].icon`, image paths. Brand names
(`Premium Resbro EX`, `Zen no Shizuku`) also stay identical — they are proper
nouns.

### Build

`tools/seo-build.mjs` currently generates 27 pages from `assets/data.js` and
two templates. It gains an outer loop over `['bg', 'en', 'ru']`.

Per language: 6 top-level pages + 5 category + 22 product = 33 pages.
Bulgarian's 33 already exist as source files; the build emits 66 new files
under `/en` and `/ru`.

URL map:

| Page | BG (unchanged) | EN | RU |
|---|---|---|---|
| home | `/` | `/en/` | `/ru/` |
| catalog | `/products` | `/en/products` | `/ru/products` |
| category | `/kategoria/masks/` | `/en/category/masks/` | `/ru/kategoria/masks/` |
| product | `/produkt/resbro-ex/` | `/en/product/resbro-ex/` | `/ru/produkt/resbro-ex/` |
| about | `/about` | `/en/about` | `/ru/about` |
| contact | `/contact` | `/en/contact` | `/ru/contact` |
| cart | `/cart` | `/en/cart` | `/ru/cart` |

The existing asset fingerprinting (`versionAssets`) applies to generated pages
in all languages unchanged.

### `.htaccess` requires no changes

Verified against the rules committed in 3b13dc5:

- `/en/products` — not a directory, not a file, `…/en/products.html` exists,
  so the existing `REQUEST_FILENAME.html` condition serves it.
- `/en/` and `/en/category/masks/` — real directories; Apache serves
  `index.html` natively.
- `/en` — a real directory, so the `!-d` guard on the trailing-slash rule
  leaves it to Apache's `DirectorySlash`, which redirects to `/en/`. No loop.

### Missing-translation behaviour

A key absent from a locale file falls back to the Bulgarian text and prints a
build warning naming the key, the locale and the output file. The build does
not fail. The result is that every run produces a checklist of gaps, and no
page can ever ship with a blank element.

## SEO

### hreflang

Every page in every language carries the complete four-entry set, including a
self-reference. Sets are generated from the same map used to emit the pages, so
they cannot drift apart, and one-way sets — which Google discards — cannot
occur.

```html
<link rel="alternate" hreflang="bg"        href="https://asiansecret.bg/products">
<link rel="alternate" hreflang="en"        href="https://asiansecret.bg/en/products">
<link rel="alternate" hreflang="ru"        href="https://asiansecret.bg/ru/products">
<link rel="alternate" hreflang="x-default" href="https://asiansecret.bg/products">
```

`x-default` points at Bulgarian on every page. This is the SEO expression of
the "Bulgarian first regardless of browser language" requirement: it tells
Google to serve the Bulgarian page to any visitor whose language matches no
entry in the set.

### Canonicals

Every page is canonical to itself. `/en/products` canonicalises to
`/en/products`, never to `/products`.

Stated explicitly because the opposite is the tempting mistake: pointing a
translation's canonical at its original removes the translation from the index
entirely, which would silently undo the whole project.

### Per-language head

- `<html lang="bg|en|ru">`
- `og:locale`: `bg_BG` / `en_US` / `ru_RU`, plus `og:locale:alternate` for the
  other two
- JSON-LD: localized `inLanguage`, breadcrumb `name`, product `name` and
  `description`

Prices and `priceCurrency: EUR` are identical in all three languages. Only
words change.

### Sitemap and robots

`sitemap.xml` becomes a single file covering all three languages: 31
indexable URLs per language = 93 total (cart and the `product` template page
stay excluded, as today). Each `<url>` carries `xhtml:link` alternates in the
`xhtml` namespace, generated from the same map as the head tags — so the
hreflang set is asserted twice from one source.

`robots.txt` gains `/en/cart`, `/ru/cart`, and anchored `/en/product$`,
`/ru/product$`. The `$` anchor is required for the same reason as the existing
`/product$` rule: unanchored, it would also block `/en/products`.

## Language switcher

Static `<a href>` links written at build time, not JavaScript. The build knows
each page's counterparts, so links are crawlable and reinforce the hreflang
set.

Links point at the **equivalent** page, not the language home — from
`/produkt/resbro-ex/`, the EN link goes to `/en/product/resbro-ex/`. Where a
counterpart genuinely does not exist, it falls back to that language's home.

Placement, constrained by `DESIGN.md` §356 ("below 760px the nav is replaced
by a burger, the logo drops to 40px and the wordmark to 15.5px so the lockup
and three controls fit at 390px"):

- **Desktop:** a compact `BG · EN · RU` group in the header, active item marked
  with the existing active-nav treatment.
- **Below 760px:** it moves inside the burger menu. It does **not** become a
  fourth header control, because the header is already documented as exactly
  fitting three at 390px.

Type follows the existing nav scale — Manrope 13.5px at 0.06em — and the
active state reuses the established rose underline. No new component
vocabulary.

## Verification

`tools/serve.mjs` handles the new paths with no changes; local preview works
as-is.

New `tools/i18n-check.mjs` asserts:

1. Every generated page carries all four hreflang entries.
2. Every alternate URL resolves to a file that exists on disk.
3. Every hreflang set is reciprocal.
4. Every canonical is self-referencing.
5. No `data-t` key fell back to Bulgarian during the build.
6. `ui.bg.json` covers every `T[...]` key referenced in shipped JS.
7. No Cyrillic character appears anywhere under `/en/**`.

Check 7 is exact for English — any Cyrillic in an English page is a missed
string by definition. It cannot work for Russian, so Russian coverage rests on
check 5, which is exact but only catches *absent* keys, not keys filled with
the wrong language. Russian correctness ultimately depends on the owner's
review; the spec does not claim otherwise.

The check script output is shown to the owner before the work is committed.

## Out of scope

- Translating `api/_emails.php` or `api/order.php` (decision 3)
- Any language detection or redirect behaviour (decision 4)
- A `/bg` prefix or any change to existing Bulgarian URLs
- Currency conversion — EUR everywhere
- Translating `DESIGN.md`, `README.md`, `PRODUCT.md` or other repo docs
