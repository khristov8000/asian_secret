/* Генератор на статични страници за търсачките.
   Чете assets/data.js като единствен източник и пресъздава:
     /produkt/<slug>/index.html    - продуктовите страници
     /kategoria/<id>/index.html    - категорийните страници
     /sitemap.xml, /robots.txt
   Шаблон са самите product.html и products.html, за да не се разминава
   шапката с останалия сайт. Пуска се с: node tools/seo-build.mjs */
import fs from 'fs';
import path from 'path';
import {
  LANGS, SEG, SITE, urlFor, fileFor, alternatesFor,
  translateProduct, translateList
} from './i18n-lib.mjs';

const root = process.cwd();
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const bgn = n => n.toFixed(2).replace('.', ',');

const { PRODUCTS, CATS, defaultVariant } =
  new Function(read('assets/data.js') + ';return {PRODUCTS,CATS,defaultVariant};')();

/* ── речници ─────────────────────────────────────────────────────────────────
   Българският се чете от самите шаблони, затова за него има само речник за
   низовете от JavaScript. За другите два езика речникът покрива и маркъпа. */
const readJSON = p => (fs.existsSync(path.join(root, p))
  ? JSON.parse(fs.readFileSync(path.join(root, p), 'utf8')) : {});

const UI = Object.fromEntries(LANGS.map(l => [l, readJSON('i18n/ui.' + l + '.json')]));
const CATALOG = Object.fromEntries(LANGS.map(l =>
  [l, l === 'bg' ? {} : readJSON('i18n/catalog.' + l + '.json')]));

/* Всеки непреведен ключ се записва и се отчита в края - build-ът не спира.
   Частичен превод трябва да дава работещ сайт, не счупен. */
const missing = [];

function t(lang, key, file) {
  const v = UI[lang] ? UI[lang][key] : undefined;
  if (v === null || v === undefined) {
    missing.push({ lang, key, file: file || '-' });
    /* Пада се на български: за него стойността винаги идва от ui.bg.json. */
    const bg = UI.bg[key];
    return bg === null || bg === undefined ? '⟨' + key + '⟩' : bg;
  }
  return v;
}

const variantsOf = p => (p.variants && p.variants.length ? p.variants : [defaultVariant(p)]);

/* Всички относителни адреси стават абсолютни: страниците живеят две нива
   по-навътре и "assets/..." оттам сочи в нищото.
   Изразите в шаблонните низове (${...}) СЕ ПРОПУСКАТ - те се пресмятат от
   скрипта и вече връщат абсолютен път. Ако им се сложи наклонена черта,
   се получава "//assets/..." - адрес към несъществуващ хост, тоест счупени
   снимки на всяка генерирана страница. */
function absolutize(html) {
  return html.replace(
    /(href|src|srcset)="(?!https?:|\/|#|mailto:|tel:|data:|\$\{)([^"]+)"/g,
    (_m, attr, val) => (val.includes('${') ? _m : attr + '="/' + val + '"')
  );
}

/* Подменя главата от <title> до края на реда с twitter:image.
   Търси се "<title", не "<title>": етикетът вече носи data-t ключ. */
function swapHead(html, parts) {
  const start = html.indexOf('<title');
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
    '<meta property="og:locale" content="' + OG_LOCALE[o.lang] + '">',
    ...LANGS.filter(l => l !== o.lang)
      .map(l => '<meta property="og:locale:alternate" content="' + OG_LOCALE[l] + '">'),
    hreflangBlock(o.page, o.param),
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

/* ── дължини за резултатите на Google ────────────────────────────────────────
   Google реже заглавието около 60 знака. Името на сайта е най-маловажната
   част и стои най-отзад, затова то отпада, когато мястото не стига - вместо
   да се реже името на продукта, което е причината някой да кликне.
   Отрязването не е наказание, а въпрос на показване: важното трябва да е
   отпред и да се вижда цяло. */
const SITE_SUFFIX = ' | Asian Secret';
function seoTitle(core) {
  const full = core + SITE_SUFFIX;
  return full.length <= 60 ? full : core;
}

/* Описанието под ~70 знака оставя половината място празно и Google по-често
   си го пренаписва сам. Късите се допълват с количество, произход и условията
   за доставка - те и без това са първото, което купувачът пита. */
function seoDesc(base, tail) {
  let d = String(base || '').trim();
  if (d.length < 120 && tail) d = (d + ' ' + tail).trim();
  if (d.length <= 158) return d;
  /* Реже се по дума, не насред нея. */
  const cut = d.slice(0, 158);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[,;:.]$/, '') + '…';
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

/* ── версия на статичните файлове ────────────────────────────────────────────
   Хостингът дава `Cache-Control: max-age=604800` на CSS и JS, без начин да се
   каже "този файл се смени". Затова всяка промяна оставаше невидима за вече
   посетил сайта до седмица. Към адреса се добавя кратък отпечатък от
   съдържанието: смени ли се файлът, сменя се и адресът, и кешът отпада сам. */
import crypto from 'crypto';

/* Краят на реда се нормализира ПРЕДИ хеширането. На Windows git вади файловете
   с CRLF (core.autocrlf=true), а build-ът ги пише с LF - и един и същ по
   съдържание файл даваше два различни отпечатъка. Резултатът беше обратен на
   смисъла им: след всяко изтегляне адресът на CSS-а се сменяше без нито един
   променен байт и седмичният кеш на всеки посетител падаше без причина. */
const stamp = f => crypto.createHash('sha1')
  .update(fs.readFileSync(path.join(root, f), 'utf8').replace(/\r\n/g, '\n'))
  .digest('hex').slice(0, 8);

const ASSETS = ['assets/site.css', 'assets/data.js', 'assets/shop.js', 'assets/icons.js'];
const VER = Object.fromEntries(ASSETS.map(f => [f, stamp(f)]));

function versionAssets(html) {
  /* Първо се махат старите печати, за да е повторяемо: инак при второ пускане
     се получава "site.css?v=aaa?v=bbb". */
  html = html.replace(/(assets\/[\w.-]+\.(?:css|js))\?v=[a-f0-9]+/g, '$1');
  for (const f of ASSETS) {
    html = html.split(f).join(f + '?v=' + VER[f]);
  }
  return html;
}

/* ── превод на шаблона ───────────────────────────────────────────────────────
   Замества текста на всеки елемент с data-t и стойността на всеки
   data-t-<атрибут>. Българският НЕ минава оттук - шаблонът вече е на
   български и това е, което го прави неуязвим за грешка в превода. */
function applyLocale(html, lang, file) {
  if (lang === 'bg') return html;

  /* Липсващ ключ означава "остави българското от шаблона". За маркъпа
     българският живее в самия шаблон, а не в речник - затова падането назад
     е бездействие, не търсене в ui.bg.json. */
  const look = key => {
    const v = UI[lang][key];
    if (v === null || v === undefined) { missing.push({ lang, key, file }); return null; }
    return v;
  };

  /* Атрибутите първи: подмяната на текст мести отместванията в низа.
     Върти се, докато остане data-t-: един елемент може да носи няколко
     ключа (полето за търсене има и placeholder, и aria-label), а всяко
     минаване подменя по един на таг. */
  for (let pass = 0; pass < 8 && /\sdata-t-[\w-]+="/.test(html); pass++) {
    html = html.replace(/<([a-z0-9]+)([^>]*?)\sdata-t-([\w-]+)="([^"]+)"([^>]*)>/gi,
      (m, tag, pre, attr, key, post) => {
        const v = look(key);
        if (v === null) return '<' + tag + pre + post + '>';
        const whole = pre + post;
        const re = new RegExp('\\s' + attr + '="[^"]*"');
        const rebuilt = re.test(whole)
          ? whole.replace(re, ' ' + attr + '="' + esc(v) + '"')
          : whole + ' ' + attr + '="' + esc(v) + '"';
        return '<' + tag + rebuilt + '>';
      });
  }

  /* После текстът. Стойността може да носи вътрешен маркъп (<em>, <br>) и се
     вгражда както е - преводните файлове са наши, не чужд вход.
     Обратната връзка \1 хваща собствения затварящ таг, затова елемент с ключ
     не бива да съдържа друг елемент със същото име. Проверката в
     tools/i18n-check.mjs го улавя: остатъчен data-t в изхода. */
  html = html.replace(/<([a-z0-9]+)([^>]*\sdata-t="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/gi,
    (m, tag, attrs, key, inner) => {
      const v = look(key);
      return '<' + tag + attrs.replace(/\sdata-t="[^"]+"/, '') + '>' +
        (v === null ? inner : v) + '</' + tag + '>';
    });

  return html;
}

/* ── адресите в шаблона ──────────────────────────────────────────────────────
   Връзките сочат българските адреси. За другите езици се пренасочват към
   съответните - инак английската страница връща посетителя в българското
   дърво. Редът има значение: produkt/kategoria минават преди общото правило. */
function relocalizeLinks(html, lang) {
  if (lang === 'bg') return html;
  const p = '/' + lang;
  return html
    .replace(/href="\/produkt\/([^"]*)"/g, `href="${p}/${SEG[lang].product}/$1"`)
    .replace(/href="\/kategoria\/([^"]*)"/g, `href="${p}/${SEG[lang].category}/$1"`)
    .replace(/href="\/(products|about|contact|cart)([""#?])/g, `href="${p}/$1$2`)
    .replace(/href="\/"/g, `href="${p}/"`);
}

/* Речникът и локалните адреси се вграждат точно преди assets/shop.js. */
function injectI18N(html, lang) {
  const pre = lang === 'bg' ? '' : '/' + lang;
  const paths = {
    home: urlFor('home', lang), products: urlFor('products', lang),
    cart: urlFor('cart', lang), about: urlFor('about', lang),
    contact: urlFor('contact', lang),
    product: pre + '/' + SEG[lang].product + '/',
    category: pre + '/' + SEG[lang].category + '/'
  };
  /* За българския върви ui.bg.json (само низовете от JS). За другите два -
     целият речник: същият обект храни и маркъпа, и скриптовете. */
  const dict = lang === 'bg'
    ? stripNulls(UI.bg)
    : { ...stripNulls(UI.bg), ...stripNulls(UI[lang]) };
  const block = '<script>window.I18N=' +
    JSON.stringify({ lang, T: dict, paths }) + ';</' + 'script>';
  html = html.replace(/<script>window\.I18N=[\s\S]*?<\/script>/, block);

  /* Преводът на каталога влиза МЕЖДУ data.js и shop.js: shop.js го налага
     върху данните, така че трябва вече да е зареден, когато той тръгне. */
  html = html.replace(/\n?<script src="\/?assets\/catalog-\w+\.js[^"]*"><\/script>/, '');
  if (CATALOG_FILE[lang]) {
    html = html.replace(/(<script src="\/?assets\/data\.js[^"]*"><\/script>)/,
      '$1\n<script src="/' + CATALOG_FILE[lang] + '"></' + 'script>');
  }
  return html;
}

/* ── преводът на каталога за браузъра ────────────────────────────────────────
   Картите с продукти и филтрите се рисуват от assets/data.js в браузъра, а
   той е само на български. Затова преводът излиза като отделен файл за език и
   се зарежда между data.js и shop.js - shop.js го налага върху данните преди
   първото рисуване. Отделен файл, а не вграден в страницата: 40+ KB на всяка
   страница са излишни, а така се кешира веднъж за целия език. */
const CATALOG_FILE = {};
for (const lang of LANGS) {
  if (lang === 'bg') continue;
  const rel = 'assets/catalog-' + lang + '.js';
  fs.writeFileSync(path.join(root, rel),
    '/* Създава се от tools/seo-build.mjs по i18n/catalog.' + lang +
    '.json - не се пипа на ръка. */\nwindow.I18N_CATALOG=' +
    JSON.stringify(CATALOG[lang]) + ';\n');
  CATALOG_FILE[lang] = rel;
  /* Влиза в списъка с подпечатвани файлове, инак versionAssets му маха
     отпечатъка (шаблонът съвпада) и не му слага нов - и седмичният кеш на
     хостинга задържа стария превод. */
  ASSETS.push(rel);
  VER[rel] = stamp(rel);
}

/* Непреведените ключове отпадат, за да се падне на българската стойност.
   Ключовете с _ отпред са бележки за преводача и нямат работа в браузъра. */
function stripNulls(o) {
  const out = {};
  for (const [k, v] of Object.entries(o)) if (v !== null && k[0] !== '_') out[k] = v;
  return out;
}

/* Езикът на документа. */
const setLang = (html, lang) => html.replace(/<html([^>]*?)\slang="[^"]*"/i, `<html$1 lang="${lang}"`);

/* ── hreflang ────────────────────────────────────────────────────────────────
   Пълен набор от четири записа на всяка страница, включително самопосочващия
   се - Google изхвърля еднопосочните набори. x-default сочи българското: така
   на посетител, чийто език не съвпада с нито един запис, се показва
   българската страница. Това е SEO страната на правилото "винаги български". */
function hreflangBlock(page, param) {
  return alternatesFor(page, param)
    .map(a => `<link rel="alternate" hreflang="${a.lang}" href="${a.url}">`)
    .join('\n');
}

const OG_LOCALE = { bg: 'bg_BG', en: 'en_US', ru: 'ru_RU' };
const LD_LANG = { bg: 'bg-BG', en: 'en-US', ru: 'ru-RU' };

/* Каноничният адрес сочи самата страница, никога оригинала на друг език:
   канонично към българското би извадило преводите от индекса напълно. */
function setCanonical(html, page, lang, param) {
  const url = SITE + urlFor(page, lang, param);
  html = html.replace(/<link rel="canonical" href="[^"]*">/, '<link rel="canonical" href="' + url + '">');
  html = html.replace(/<meta property="og:url" content="[^"]*">/, '<meta property="og:url" content="' + url + '">');

  /* Идемпотентно: старите набори се махат ПРЕДИ да се сложат новите. Без
     това всяко пускане натрупваше още по два og:locale:alternate. */
  html = html.replace(/\n?<meta property="og:locale:alternate" content="[^"]*">/g, '');
  html = html.replace(/\n?<link rel="alternate" hreflang="[^"]*" href="[^"]*">/g, '');

  html = html.replace(/<meta property="og:locale" content="[^"]*">/,
    '<meta property="og:locale" content="' + OG_LOCALE[lang] + '">' +
    LANGS.filter(l => l !== lang)
      .map(l => '\n<meta property="og:locale:alternate" content="' + OG_LOCALE[l] + '">').join(''));
  return html.replace(/(<link rel="canonical"[^>]*>)/, '$1\n' + hreflangBlock(page, param));
}

/* ── превключвател на езика ──────────────────────────────────────────────────
   Статични връзки, не JavaScript: обхождат се и подсилват набора алтернативи.
   Сочат съответната страница на другия език, не началната - от продукт се
   стига до същия продукт. */
function switcherFor(page, param, lang) {
  return LANGS.map(l =>
    `<a href="${urlFor(page, l, param)}"${l === lang ? ' class="on" aria-current="true"' : ''} hreflang="${l}">${l.toUpperCase()}</a>`
  ).join('');
}

function injectSwitcher(html, page, param, lang) {
  return html.replace(/(<div class="langsw"[^>]*>)[\s\S]*?(<\/div>)/g,
    (m, open, close) => open + switcherFor(page, param, lang) + close);
}

/* Общият конвейер за една страница. Редът е важен: relocalizeLinks работи с
   абсолютни адреси, а absolutize пипа само относителните - затова
   relocalizeLinks минава преди него. */
function buildPage(tpl, { page, lang, param, file }) {
  let html = applyLocale(tpl, lang, file);
  html = relocalizeLinks(html, lang);
  html = injectSwitcher(html, page, param, lang);
  html = injectI18N(html, lang);
  html = setLang(html, lang);
  html = absolutize(html);
  return versionAssets(html);
}

/* ── горните страници ────────────────────────────────────────────────────────
   Българските се подпечатват на място - те се отдават направо от корена.
   Английските и руските се изливат в /en и /ru. */
const TOP = [
  { page: 'home', tpl: 'index.html' },
  { page: 'products', tpl: 'products.html' },
  { page: 'productTpl', tpl: 'product.html' },
  { page: 'cart', tpl: 'cart.html' },
  { page: 'about', tpl: 'about.html' },
  { page: 'contact', tpl: 'contact.html' }
];

const write = (rel, html) => {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, html);
};

/* Страниците, които не се превеждат при build - те сами избират езика
   по поискания адрес. Но и тя носи site.css, а хостингът го кешира седмица,
   затова минава през подпечатването като всички останали. */
for (const f of ['404.html', 'thank-you.html', 'payment-failed.html']) {
  if (!fs.existsSync(path.join(root, f))) continue;
  const stamped = versionAssets(read(f));
  if (stamped !== read(f)) fs.writeFileSync(path.join(root, f), stamped);

  /* Страниците след плащане се копират и в /en и /ru. Viva има само ЕДИН
     адрес за връщане, но клиент може да дойде и по езиков път - от отметка,
     от стар линк, или ако адресът в платежния източник някога се смени.
     "Страницата я няма" веднага след платена поръчка е най-лошото, което
     може да види човек, затова и трите пътя водят до нещо разумно.
     Съдържанието е същото: страницата сама си избира езика. */
  if (f === '404.html') continue;
  for (const lang of LANGS) {
    if (lang === 'bg') continue;
    write(lang + '/' + f, stamped);
  }
}

/* Шаблоните се прочитат ВЕДНЪЖ, преди първото писане: българските горни
   страници се презаписват на място и инак биха се върнали като вход. */
const TPL = Object.fromEntries(TOP.map(x => [x.tpl, read(x.tpl)]));

for (const { page, tpl } of TOP) {
  for (const lang of LANGS) {
    const file = fileFor(page, lang);
    let html = buildPage(TPL[tpl], { page, lang, file });
    html = setCanonical(html, page, lang);
    write(file, html);
  }
}

/* ── продуктови страници ─────────────────────────────────────────────────── */
const tplProduct = TPL['product.html'];
let made = 0;

for (const lang of LANGS) {
for (const src of PRODUCTS) {
  const p = translateProduct(src, lang, CATALOG[lang]);
  const CATS_L = translateList(CATS, lang, (CATALOG[lang] || {})._cats || {});
  const v = defaultVariant(p);
  const vars = variantsOf(p);
  const file = fileFor('product', lang, p.slug);
  const url = SITE + urlFor('product', lang, p.slug);
  const image = SITE + '/assets/products/' + v.sku + '.webp';
  const title = seoTitle(p.name + ' - ' + p.brand);
  /* Опашката носи количество, произход и доставка - празното място под
     описанието иначе просто стои неизползвано. */
  const tail = t(lang, 'seo.prodDescTail', file)
    .replace('{count}', (p.specs && p.specs.count) || v.count || '')
    .replace('{origin}', (p.specs && p.specs.origin) || '');
  const desc = seoDesc(p.short || p.intro, tail);
  const cat = CATS_L.find(c => c.id === p.cat) ||
    { id: '', name: t(lang, 'nav.products', file) };

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
      { name: t(lang, 'nav.home', file), url: SITE + urlFor('home', lang) },
      { name: t(lang, 'nav.products', file), url: SITE + urlFor('products', lang) },
      { name: cat.name, url: SITE + urlFor('category', lang, cat.id) },
      { name: p.name, url }
    ])
  ];

  /* Съдържание, което търсачката вижда още в изходния HTML. Скриптът на
     страницата го замества с интерактивния вариант - данните са същите. */
  const benefits = (p.benefits || [])
    .map(b => '<li><b>' + esc(b.t) + '</b> ' + esc(b.d) + '</li>').join('');
  const specRows = [[t(lang, 'pdp.specType', file), p.specs && p.specs.type],
                    [t(lang, 'pdp.specCount', file), v.count],
                    [t(lang, 'pdp.specOrigin', file), p.specs && p.specs.origin]]
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

  let html = buildPage(tplProduct, { page: 'product', lang, param: p.slug, file });
  html = swapHead(html, headFor({
    title, desc, canonical: url, image, ogType: 'product', extraLd: ld,
    lang, page: 'product', param: p.slug
  }));
  html = html.replace('<meta name="robots" content="noindex,follow">\n', '');
  html = html.replace('<body>', '<body data-product="' + p.slug + '">');
  html = html.replace(
    '<main class="wrap pdp" id="pdp"></main>',
    '<main class="wrap pdp" id="pdp">' + seed + '</main>'
  );

  write(file, html);
  made++;
}
}

/* ── категорийни страници ────────────────────────────────────────────────── */
const tplCat = TPL['products.html'];
for (const lang of LANGS) {
const CATS_L = translateList(CATS, lang, (CATALOG[lang] || {})._cats || {});
for (const c of CATS_L) {
  const list = PRODUCTS.filter(p => p.cat === c.id)
    .map(p => translateProduct(p, lang, CATALOG[lang]));
  const file = fileFor('category', lang, c.id);
  const url = SITE + urlFor('category', lang, c.id);
  /* Шаблоните за заглавие и описание носят български думи извън името на
     категорията, затова са ключове с {name} и {n} вместо слепени низове. */
  const fill = (key, s) => t(lang, key, file)
    .replace('{name}', s.name).replace('{n}', String(list.length));
  const title = seoTitle(fill('seo.catTitle', c));
  const desc = fill('seo.catDesc', c);
  const image = list.length
    ? SITE + '/assets/products/' + defaultVariant(list[0]).sku + '.webp'
    : SITE + '/assets/hero.jpg';

  const ld = [
    ldBlock({
      '@context': 'https://schema.org', '@type': 'ItemList',
      name: c.name, numberOfItems: list.length,
      itemListElement: list.map((p, i) => ({
        '@type': 'ListItem', position: i + 1, name: p.name,
        url: SITE + urlFor('product', lang, p.slug)
      }))
    }),
    crumbLd([
      { name: t(lang, 'nav.home', file), url: SITE + urlFor('home', lang) },
      { name: t(lang, 'nav.products', file), url: SITE + urlFor('products', lang) },
      { name: c.name, url }
    ])
  ];

  let html = buildPage(tplCat, { page: 'category', lang, param: c.id, file });
  html = swapHead(html, headFor({
    title, desc, canonical: url, image, ogType: 'website', extraLd: ld,
    lang, page: 'category', param: c.id
  }));
  html = html.replace('<body>', '<body data-category="' + c.id + '">');
  /* H1 и уводът носят името на категорията: инак и петте страници се борят
     за класиране с един и същ H1 "Всички продукти". Търси се по елемента, а
     не по българския текст - на този етап той вече е преведен. */
  html = html.replace(
    /<h1 style="margin-top:10px">[\s\S]*?<\/h1>/,
    '<h1 style="margin-top:10px">' + esc(c.name) + '</h1>'
  );
  html = html.replace(
    /<p class="lead" style="margin-top:14px">[\s\S]*?<\/p>/,
    '<p class="lead" style="margin-top:14px">' + esc(fill('seo.catLead', c)) + '</p>'
  );
  /* Активният маркер в навигацията пада: това е категория, не целият каталог. */
  html = html.replace(
    new RegExp('<a href="' + urlFor('products', lang) + '" class="active">'),
    '<a href="' + urlFor('products', lang) + '">'
  );

  write(file, html);
}
}

/* ── схема за самия каталог ──────────────────────────────────────────────── */
for (const lang of LANGS) {
  const f = fileFor('products', lang);
  let html = read(f);
  const marker = '<!-- ld:catalog -->';
  const list = PRODUCTS.map(p => translateProduct(p, lang, CATALOG[lang]));
  const block = [
    marker,
    ldBlock({
      '@context': 'https://schema.org', '@type': 'CollectionPage',
      name: t(lang, 'shop.title', f), url: SITE + urlFor('products', lang),
      inLanguage: LD_LANG[lang],
      mainEntity: {
        '@type': 'ItemList', numberOfItems: list.length,
        itemListElement: list.map((p, i) => ({
          '@type': 'ListItem', position: i + 1, name: p.name,
          url: SITE + urlFor('product', lang, p.slug)
        }))
      }
    }),
    crumbLd([
      { name: t(lang, 'nav.home', f), url: SITE + urlFor('home', lang) },
      { name: t(lang, 'nav.products', f), url: SITE + urlFor('products', lang) }
    ]),
    ''
  ].join('\n');
  /* Идемпотентно: махаме предишния блок, преди да сложим новия. */
  const at = html.indexOf(marker);
  if (at >= 0) html = html.slice(0, at) + html.slice(html.indexOf('</head>', at));
  html = html.replace('</head>', block + '</head>');
  fs.writeFileSync(path.join(root, f), html);
}

const today = new Date().toISOString().slice(0, 10);

/* ── каталог за сървърната част ──────────────────────────────────────────────
   Функцията за поръчки НЕ вярва на цените от браузъра - смята ги наново по
   този списък. Затова се излива от същия източник, при всяко build-ване. */
{
  const rows = [];
  for (const p of PRODUCTS) {
    for (const v of variantsOf(p)) {
      rows.push({
        sku: v.sku, slug: p.slug, brand: p.brand, name: p.name,
        size: v.size || p.size || '', price: v.price,
        url: SITE + '/produkt/' + p.slug + '/',
        /* JPG, а не WebP: Outlook и част от клиентите не показват WebP. */
        image: SITE + '/assets/products/' + v.sku + '.jpg'
      });
    }
  }
  fs.mkdirSync(path.join(root, 'api'), { recursive: true });
  fs.writeFileSync(path.join(root, 'api', '_catalog.json'),
    JSON.stringify({ generated: today, currency: 'EUR', items: rows }, null, 1));
}

/* ── sitemap + robots ────────────────────────────────────────────────────── */
/* 31 индексируеми адреса на език. Кошницата и шаблонът product остават вън,
   както досега. */
const PAGES = [
  { page: 'home', pri: '1.0', freq: 'weekly' },
  { page: 'products', pri: '0.9', freq: 'weekly' },
  { page: 'about', pri: '0.5', freq: 'monthly' },
  { page: 'contact', pri: '0.6', freq: 'monthly' }
];

const urls = [];
for (const lang of LANGS) {
  for (const x of PAGES)
    urls.push({ loc: SITE + urlFor(x.page, lang), pri: x.pri, freq: x.freq, page: x.page });
  for (const c of CATS)
    urls.push({ loc: SITE + urlFor('category', lang, c.id), pri: '0.8', freq: 'weekly', page: 'category', param: c.id });
  for (const p of PRODUCTS)
    urls.push({ loc: SITE + urlFor('product', lang, p.slug), pri: '0.8', freq: 'weekly', page: 'product', param: p.slug });
}

/* Алтернативите се повтарят и в sitemap-а: това е формата, на която Google
   държи най-много, и идва от същата карта като таговете в главата. */
fs.writeFileSync(path.join(root, 'sitemap.xml'),
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
  '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  urls.map(u =>
    '  <url><loc>' + u.loc + '</loc>\n' +
    alternatesFor(u.page, u.param).map(a =>
      '    <xhtml:link rel="alternate" hreflang="' + a.lang + '" href="' + a.url + '"/>')
      .join('\n') + '\n' +
    '    <lastmod>' + today + '</lastmod><changefreq>' + u.freq +
    '</changefreq><priority>' + u.pri + '</priority></url>').join('\n') +
  '\n</urlset>\n');

fs.writeFileSync(path.join(root, 'robots.txt'),
  'User-agent: *\n' +
  'Allow: /\n\n' +
  '# Служебни страници и работни папки - няма смисъл да се обхождат\n' +
  LANGS.map(l => 'Disallow: ' + urlFor('cart', l) + '\n').join('') +
  /* Котвата $ пази /products - без нея правилото за /product го покрива. */
  LANGS.map(l => 'Disallow: ' + (l === 'bg' ? '' : '/' + l) + '/product$\n').join('') +
  'Disallow: /tmp/\n' +
  'Disallow: /output/\n' +
  'Disallow: /images/\n' +
  'Disallow: /product_images/\n' +
  'Disallow: /docs/\n' +
  'Disallow: /tools/\n\n' +
  'Sitemap: ' + SITE + '/sitemap.xml\n');

console.log('asset versions: ' + ASSETS.map(f => f + '=' + VER[f]).join(', '));
console.log('generated ' + made + ' product pages, ' + CATS.length * LANGS.length +
  ' category pages, ' + TOP.length * LANGS.length + ' top pages, sitemap (' +
  urls.length + ' urls), robots.txt');

/* Отчет за непреведеното. Build-ът НЕ се проваля: частичен превод трябва да
   дава работещ сайт, а списъкът е задачата за довършване. */
if (missing.length) {
  const byLang = {};
  for (const m of missing) (byLang[m.lang] ||= new Set()).add(m.key);
  for (const [lang, keys] of Object.entries(byLang)) {
    const list = [...keys].sort();
    console.log(`\n! ${lang}: ${list.length} непреведени ключа (пада се на български)`);
    console.log('  ' + list.slice(0, 40).join('\n  '));
    if (list.length > 40) console.log(`  … и още ${list.length - 40}`);
  }
} else {
  console.log('\nвсички ключове са преведени');
}
