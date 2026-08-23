/* Проверка на многоезичната част. Пуска се СЛЕД build:
     node tools/seo-build.mjs && node tools/i18n-check.mjs

   Какво може и какво не може да докаже:
   - за английския проверката е точна - кирилица в английска страница е
     пропуснат низ по определение;
   - за руския такава проверка няма как да съществува. Тук се лови само
     ЛИПСВАЩ ключ, не ключ, попълнен на грешен език. Руското качество се
     проверява от човек. */
import fs from 'fs';
import path from 'path';
import { LANGS, urlFor, fileFor, alternatesFor, SITE } from './i18n-lib.mjs';

const root = process.cwd();
let fail = 0;
const bad = msg => { fail++; console.log('FAIL ' + msg); };
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const exists = f => fs.existsSync(path.join(root, f));

const { PRODUCTS, CATS } =
  new Function(read('assets/data.js') + ';return {PRODUCTS,CATS};')();

/* Всички страници, които build-ът трябва да е произвел. */
const pages = [];
for (const lang of LANGS) {
  for (const page of ['home', 'products', 'about', 'contact', 'cart', 'productTpl'])
    pages.push({ page, lang });
  for (const c of CATS) pages.push({ page: 'category', lang, param: c.id });
  for (const p of PRODUCTS) pages.push({ page: 'product', lang, param: p.slug });
}

for (const { page, lang, param } of pages) {
  const file = fileFor(page, lang, param);
  if (!exists(file)) { bad(`липсва файл ${file}`); continue; }
  const html = read(file);

  /* 1 + 3: пълен и реципрочен набор алтернативи. Наборът се смята наново от
     картата, така че съвпадение значи, че страницата сочи същото. */
  const want = alternatesFor(page, param);
  for (const a of want) {
    if (!html.includes(`hreflang="${a.lang}" href="${a.url}"`))
      bad(`${file}: липсва hreflang="${a.lang}" href="${a.url}"`);
  }
  const n = (html.match(/rel="alternate" hreflang=/g) || []).length;
  if (n !== 4) bad(`${file}: ${n} алтернативи вместо 4`);

  /* 2: всеки алтернативен адрес сочи файл, който съществува. */
  for (const a of want) {
    if (a.lang === 'x-default') continue;
    const f = fileFor(page, a.lang, param);
    if (!exists(f)) bad(`${file}: ${a.url} сочи липсващ ${f}`);
  }

  /* 4: каноничният адрес сочи самата страница, а не оригинала на друг език. */
  const canon = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
  const self = SITE + urlFor(page, lang, param);
  if (canon !== self) bad(`${file}: canonical "${canon}" вместо "${self}"`);

  /* Езикът на документа. */
  if (!new RegExp(`<html[^>]*lang="${lang}"`).test(html))
    bad(`${file}: <html lang> не е "${lang}"`);

  /* 5: нито един ключ не е останал невидян. Остатъчен data-t в изхода значи,
     че regex-ът не е уловил елемента - обикновено вложен еднакъв таг. */
  if (lang !== 'bg' && /\sdata-t="/.test(html)) {
    const k = (html.match(/\sdata-t="([^"]+)"/g) || []).slice(0, 3).join(', ');
    bad(`${file}: остатъчен data-t (${k})`);
  }
  if (html.includes('⟨')) {
    const k = [...new Set(html.match(/⟨[^⟩]+⟩/g) || [])].slice(0, 3).join(', ');
    bad(`${file}: непопълнен ключ ${k}`);
  }

  /* 7: кирилица в английска страница.
     Скриптовете отпадат целите и това е нарочно - в тях българският е
     законен на три места: коментарите в кода (така е писан целият проект),
     речникът I18N, където българското стои като резервен вариант, и ключовете
     на заявката за поръчка, които трябва да останат български, за да е
     четимо писмото до собственика. Остава чистият маркъп - това, което
     посетителят наистина вижда. */
  if (lang === 'en') {
    const visible = html
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<script[\s\S]*?<\/script>/g, '')
      /* name= и value= по полетата в количката СА български нарочно: те
         пътуват към /api/order.php и оттам в писмото до собственика, което
         по решение остава българско. Виждат се от никого - потребителят чете
         <label>, а той се превежда. */
      .replace(/\s(name|value)="[^"]*"/g, '')
      /* Капанът за ботове е aria-hidden и изнесен извън екрана - не се вижда
         нито от посетител, нито от екранен четец, затова остава български. */
      .replace(/<div aria-hidden="true"[\s\S]*?<\/div>/gi, '');
    if (/[Ѐ-ӿ]/.test(visible)) {
      const s = (visible.match(/[^\s<>"]*[Ѐ-ӿ][^\s<>"]*/g) || [])
        .slice(0, 4).join(' | ');
      bad(`${file}: кирилица в английска страница → ${s}`);
    }
  }
}

/* 6: ui.bg.json покрива всеки ключ, който JavaScript търси. Без това
   българският би показал ⟨ключ⟩ на клиент. */
const js = read('assets/shop.js') +
  ['cart.html', 'product.html', 'products.html', 'index.html', 'contact.html'].map(read).join('');
const bgUI = JSON.parse(read('i18n/ui.bg.json'));
const jsKeys = new Set();
for (const m of js.matchAll(/T\[['"]([\w.]+)['"]\]/g)) jsKeys.add(m[1]);
for (const m of js.matchAll(/plural\(['"]([\w.]+)['"]/g)) jsKeys.add(m[1]);
for (const k of [...jsKeys].sort())
  if (!(k in bgUI)) bad(`i18n/ui.bg.json: липсва ключ ${k}, търсен от JavaScript`);

/* Колко от речниците са попълнени - това не е проверка, а отчет. */
for (const lang of ['en', 'ru']) {
  const ui = JSON.parse(read('i18n/ui.' + lang + '.json'));
  const keys = Object.keys(ui).filter(k => k[0] !== '_');
  const done = keys.filter(k => ui[k] !== null).length;
  const cat = JSON.parse(read('i18n/catalog.' + lang + '.json'));
  let cTotal = 0, cDone = 0;
  const walk = v => {
    if (v === null) { cTotal++; return; }
    if (typeof v === 'string') { cTotal++; cDone++; return; }
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(cat);
  console.log(`${lang}: интерфейс ${done}/${keys.length}, каталог ${cDone}/${cTotal}`);
}

console.log(fail ? `\n${fail} проблема` : `\n${pages.length} страници - всичко наред`);
process.exit(fail ? 1 : 0);
