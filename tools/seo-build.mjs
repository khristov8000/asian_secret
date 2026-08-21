/* Генератор на статични страници за търсачките.
   Чете assets/data.js като единствен източник и пресъздава:
     /produkt/<slug>/index.html    - продуктовите страници
     /kategoria/<id>/index.html    - категорийните страници
     /sitemap.xml, /robots.txt
   Шаблон са самите product.html и products.html, за да не се разминава
   шапката с останалия сайт. Пуска се с: node tools/seo-build.mjs */
import fs from 'fs';
import path from 'path';

const SITE = 'https://asiansecret.bg';
const root = process.cwd();
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const bgn = n => n.toFixed(2).replace('.', ',');

const { PRODUCTS, CATS, defaultVariant } =
  new Function(read('assets/data.js') + ';return {PRODUCTS,CATS,defaultVariant};')();

const variantsOf = p => (p.variants && p.variants.length ? p.variants : [defaultVariant(p)]);

/* Всички относителни адреси стават абсолютни: страниците живеят две нива
   по-навътре и "assets/..." оттам сочи в нищото.
   Изразите в шаблонните низове (${...}) СЕ ПРОПУСКАТ - те се пресмятат от
   скрипта и вече връщат абсолютен път. Ако им се сложи наклонена черта,
   се получава "//assets/..." - адрес към несъществуващ хост, тоест счупени
   снимки на всяка генерирана страница. */
function absolutize(html) {
  return html.replace(
    /(href|src)="(?!https?:|\/|#|mailto:|tel:|data:|\$\{)([^"]+)"/g,
    (_m, attr, val) => (val.includes('${') ? _m : attr + '="/' + val + '"')
  );
}

/* Подменя главата от <title> до края на реда с twitter:image. */
function swapHead(html, parts) {
  const start = html.indexOf('<title>');
  const i = html.indexOf('name="twitter:image"');
  const end = html.indexOf('>', i) + 1;
  if (start < 0 || i < 0) throw new Error('template head markers not found');
  return html.slice(0, start) + parts + html.slice(end);
}

function headFor(o) {
  return [
    '<title>' + esc(o.title) + '</title>',
    '<meta name="description" content="' + esc(o.desc) + '">',
    '<link rel="canonical" href="' + o.canonical + '">',
    '<meta property="og:type" content="' + o.ogType + '">',
    '<meta property="og:site_name" content="Asian Secret">',
    '<meta property="og:locale" content="bg_BG">',
    '<meta property="og:title" content="' + esc(o.title) + '">',
    '<meta property="og:description" content="' + esc(o.desc) + '">',
    '<meta property="og:url" content="' + o.canonical + '">',
    '<meta property="og:image" content="' + o.image + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(o.title) + '">',
    '<meta name="twitter:description" content="' + esc(o.desc) + '">',
    '<meta name="twitter:image" content="' + o.image + '">'
  ].concat(o.extraLd).join('\n');
}

const ldBlock = obj =>
  '<script type="application/ld+json">\n' + JSON.stringify(obj) + '\n</script>';

const crumbLd = items => ldBlock({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({
    '@type': 'ListItem', position: i + 1, name: it.name, item: it.url
  }))
});

/* ── продуктови страници ─────────────────────────────────────────────────── */
const tplProduct = read('product.html');
let made = 0;

for (const p of PRODUCTS) {
  const v = defaultVariant(p);
  const vars = variantsOf(p);
  const url = SITE + '/produkt/' + p.slug + '/';
  const image = SITE + '/assets/products/' + v.sku + '.webp';
  const title = p.name + ' - ' + p.brand + ' | Asian Secret';
  const desc = (p.short || p.intro || '').slice(0, 158);
  const cat = CATS.find(c => c.id === p.cat) || { id: '', name: 'Продукти' };

  const offers = vars.length > 1
    ? {
        '@type': 'AggregateOffer', priceCurrency: 'EUR',
        lowPrice: Math.min.apply(null, vars.map(x => x.price)).toFixed(2),
        highPrice: Math.max.apply(null, vars.map(x => x.price)).toFixed(2),
        offerCount: vars.length, availability: 'https://schema.org/InStock', url
      }
    : {
        '@type': 'Offer', priceCurrency: 'EUR', price: v.price.toFixed(2),
        availability: 'https://schema.org/InStock', url,
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: { '@type': 'MonetaryAmount', value: '3.90', currency: 'EUR' },
          shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'BG' }
        }
      };

  const ld = [
    ldBlock({
      '@context': 'https://schema.org', '@type': 'Product',
      name: p.name, brand: { '@type': 'Brand', name: p.brand },
      description: p.intro || p.short, image: [image], sku: v.sku,
      category: cat.name,
      countryOfOrigin: p.specs && p.specs.origin, offers
    }),
    crumbLd([
      { name: 'Начало', url: SITE + '/' },
      { name: 'Продукти', url: SITE + '/products.html' },
      { name: cat.name, url: SITE + '/kategoria/' + cat.id + '/' },
      { name: p.name, url }
    ])
  ];

  /* Съдържание, което търсачката вижда още в изходния HTML. Скриптът на
     страницата го замества с интерактивния вариант - данните са същите. */
  const benefits = (p.benefits || [])
    .map(b => '<li><b>' + esc(b.t) + '</b> ' + esc(b.d) + '</li>').join('');
  const specRows = [['Тип', p.specs && p.specs.type], ['Количество', v.count],
                    ['Произход', p.specs && p.specs.origin]]
    .filter(r => r[1])
    .map(r => '<li><b>' + esc(r[0]) + ':</b> ' + esc(r[1]) + '</li>').join('');
  /* На самата страница снимката е с относителен корен път - абсолютният
     адрес е за og:image и schema, но като src се чупи при локална проверка. */
  const imgPath = '/assets/products/' + v.sku + '.webp';
  const seed = [
    '<article>',
    '<img src="' + imgPath + '" alt="' + esc(p.brand + ' ' + p.name) + '" width="640" height="640">',
    '<p>' + esc(p.brand) + '</p>',
    '<h1>' + esc(p.name) + '</h1>',
    '<p>' + esc(p.short || '') + '</p>',
    '<p><strong>' + bgn(v.price) + ' &euro;</strong></p>',
    p.intro ? '<p>' + esc(p.intro) + '</p>' : '',
    specRows ? '<ul>' + specRows + '</ul>' : '',
    benefits ? '<ul>' + benefits + '</ul>' : '',
    '</article>'
  ].filter(Boolean).join('\n');

  let html = absolutize(tplProduct);
  html = swapHead(html, headFor({
    title, desc, canonical: url, image, ogType: 'product', extraLd: ld
  }));
  html = html.replace('<meta name="robots" content="noindex,follow">\n', '');
  html = html.replace('<body>', '<body data-product="' + p.slug + '">');
  html = html.replace(
    '<main class="wrap pdp" id="pdp"></main>',
    '<main class="wrap pdp" id="pdp">' + seed + '</main>'
  );

  const dir = path.join(root, 'produkt', p.slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  made++;
}

/* ── категорийни страници ────────────────────────────────────────────────── */
const tplCat = read('products.html');
for (const c of CATS) {
  const list = PRODUCTS.filter(p => p.cat === c.id);
  const url = SITE + '/kategoria/' + c.id + '/';
  const title = c.name + ' - японска и корейска козметика | Asian Secret';
  const desc = c.name + ' от Япония, Корея и Тайланд - ' + list.length +
    ' продукта в каталога. Доставка 3,90 € със Спиди, безплатно над 40 €.';
  const image = list.length
    ? SITE + '/assets/products/' + defaultVariant(list[0]).sku + '.webp'
    : SITE + '/assets/hero.jpg';

  const ld = [
    ldBlock({
      '@context': 'https://schema.org', '@type': 'ItemList',
      name: c.name, numberOfItems: list.length,
      itemListElement: list.map((p, i) => ({
        '@type': 'ListItem', position: i + 1, name: p.name,
        url: SITE + '/produkt/' + p.slug + '/'
      }))
    }),
    crumbLd([
      { name: 'Начало', url: SITE + '/' },
      { name: 'Продукти', url: SITE + '/products.html' },
      { name: c.name, url }
    ])
  ];

  let html = absolutize(tplCat);
  html = swapHead(html, headFor({
    title, desc, canonical: url, image, ogType: 'website', extraLd: ld
  }));
  html = html.replace('<body>', '<body data-category="' + c.id + '">');
  /* H1 и уводът носят името на категорията: инак и петте страници се борят
     за класиране с един и същ H1 "Всички продукти". */
  html = html.replace(
    '<h1 style="margin-top:10px">Всички продукти</h1>',
    '<h1 style="margin-top:10px">' + esc(c.name) + '</h1>'
  );
  html = html.replace(
    'Тъканни маски, патчи за очи, слънцезащита и грижа за ръце и коса - от Япония, Корея и Тайланд.',
    esc(c.name) + ' от Япония, Корея и Тайланд - ' + list.length +
    ' продукта, подбрани и проверени лично.'
  );
  html = html.replace('<a href="/products.html" class="active">', '<a href="/products.html">');

  const dir = path.join(root, 'kategoria', c.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

/* ── схема за самия каталог ──────────────────────────────────────────────── */
{
  const f = 'products.html';
  let html = read(f);
  const marker = '<!-- ld:catalog -->';
  const block = [
    marker,
    ldBlock({
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: 'Всички продукти', url: SITE + '/products.html', inLanguage: 'bg-BG',
      mainEntity: {
        '@type': 'ItemList', numberOfItems: PRODUCTS.length,
        itemListElement: PRODUCTS.map((p, i) => ({
          '@type': 'ListItem', position: i + 1, name: p.name,
          url: SITE + '/produkt/' + p.slug + '/'
        }))
      }
    }),
    crumbLd([
      { name: 'Начало', url: SITE + '/' },
      { name: 'Продукти', url: SITE + '/products.html' }
    ]),
    ''
  ].join('\n');
  /* Идемпотентно: махаме предишния блок, преди да сложим новия. */
  const at = html.indexOf(marker);
  if (at >= 0) html = html.slice(0, at) + html.slice(html.indexOf('</head>', at));
  html = html.replace('</head>', block + '</head>');
  fs.writeFileSync(path.join(root, f), html);
}

/* ── sitemap + robots ────────────────────────────────────────────────────── */
const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: SITE + '/', pri: '1.0', freq: 'weekly' },
  { loc: SITE + '/products.html', pri: '0.9', freq: 'weekly' },
  { loc: SITE + '/about.html', pri: '0.5', freq: 'monthly' },
  { loc: SITE + '/contact.html', pri: '0.6', freq: 'monthly' }
]
  .concat(CATS.map(c => ({ loc: SITE + '/kategoria/' + c.id + '/', pri: '0.8', freq: 'weekly' })))
  .concat(PRODUCTS.map(p => ({ loc: SITE + '/produkt/' + p.slug + '/', pri: '0.8', freq: 'weekly' })));

fs.writeFileSync(path.join(root, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u =>
    '  <url><loc>' + u.loc + '</loc><lastmod>' + today +
    '</lastmod><changefreq>' + u.freq + '</changefreq><priority>' + u.pri +
    '</priority></url>').join('\n') +
  '\n</urlset>\n');

fs.writeFileSync(path.join(root, 'robots.txt'),
  'User-agent: *\n' +
  'Allow: /\n\n' +
  '# Служебни страници и работни папки - няма смисъл да се обхождат\n' +
  'Disallow: /cart.html\n' +
  'Disallow: /product.html\n' +
  'Disallow: /tmp/\n' +
  'Disallow: /output/\n' +
  'Disallow: /images/\n' +
  'Disallow: /product_images/\n' +
  'Disallow: /docs/\n' +
  'Disallow: /tools/\n\n' +
  'Sitemap: ' + SITE + '/sitemap.xml\n');

console.log('generated ' + made + ' product pages, ' + CATS.length +
  ' category pages, sitemap (' + urls.length + ' urls), robots.txt');
