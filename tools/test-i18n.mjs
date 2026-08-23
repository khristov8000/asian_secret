/* Проверка на картата с адресите. Пуска се с: node tools/test-i18n.mjs */
import { urlFor, fileFor, alternatesFor, translateProduct, LANGS, SITE } from './i18n-lib.mjs';

let fail = 0;
const eq = (name, got, want) => {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (!ok) fail++;
  console.log((ok ? 'ok   ' : 'FAIL ') + name +
    (ok ? '' : `\n     got  ${JSON.stringify(got)}\n     want ${JSON.stringify(want)}`));
};

/* Българският остава непокътнат - без представка и със старите сегменти. */
eq('bg home', urlFor('home', 'bg'), '/');
eq('bg products', urlFor('products', 'bg'), '/products');
eq('bg product', urlFor('product', 'bg', 'resbro-ex'), '/produkt/resbro-ex/');
eq('bg category', urlFor('category', 'bg', 'masks'), '/kategoria/masks/');

/* Английският има свои сегменти. */
eq('en home', urlFor('home', 'en'), '/en/');
eq('en products', urlFor('products', 'en'), '/en/products');
eq('en product', urlFor('product', 'en', 'resbro-ex'), '/en/product/resbro-ex/');
eq('en category', urlFor('category', 'en', 'masks'), '/en/category/masks/');
eq('en cart', urlFor('cart', 'en'), '/en/cart');

/* Руският ползва транслитерацията, която се чете и на руски. */
eq('ru product', urlFor('product', 'ru', 'resbro-ex'), '/ru/produkt/resbro-ex/');
eq('ru category', urlFor('category', 'ru', 'masks'), '/ru/kategoria/masks/');
eq('ru about', urlFor('about', 'ru'), '/ru/about');

/* Пътищата до файловете - там, където build-ът пише. */
eq('file bg products', fileFor('products', 'bg'), 'products.html');
eq('file en products', fileFor('products', 'en'), 'en/products.html');
eq('file en home', fileFor('home', 'en'), 'en/index.html');
eq('file ru product', fileFor('product', 'ru', 'resbro-ex'), 'ru/produkt/resbro-ex/index.html');

/* Наборът алтернативи е винаги пълен и x-default сочи българското. */
const alt = alternatesFor('products');
eq('alt count', alt.length, 4);
eq('alt langs', alt.map(a => a.lang), ['bg', 'en', 'ru', 'x-default']);
eq('alt bg url', alt[0].url, SITE + '/products');
eq('alt xdefault points at bg', alt[3].url, alt[0].url);
eq('langs', LANGS, ['bg', 'en', 'ru']);

/* ── превод на продукт ───────────────────────────────────────────────────── */
const sample = {
  slug: 'x', brand: 'Brand', name: 'Име', size: '40 листа', price: 29.9,
  accent: '#C2185B', cat: 'masks', badges: ['Бестселър'],
  benefits: [{ t: 'Заглавие', d: 'Описание', icon: 'droplet' }],
  specs: { type: 'Тип', origin: 'Япония' },
  story: { lead: 'Разказ', images: [{ src: '/a.jpg', cap: 'Надпис' }] }
};
const dict = {
  x: {
    name: 'Name', size: '40 sheets', badges: ['Bestseller'],
    benefits: ['Title', 'Description'],
    specs: { type: 'Type', origin: 'Japan' },
    story: { lead: 'Story', caps: ['Caption'] }
  }
};

const en = translateProduct(sample, 'en', dict);
eq('translate name', en.name, 'Name');
eq('translate badges', en.badges, ['Bestseller']);
eq('translate benefit text', [en.benefits[0].t, en.benefits[0].d], ['Title', 'Description']);
eq('benefit icon preserved', en.benefits[0].icon, 'droplet');
eq('translate spec values', en.specs, { type: 'Type', origin: 'Japan' });
eq('translate story lead', en.story.lead, 'Story');
eq('image src preserved', en.story.images[0].src, '/a.jpg');
eq('translate caption', en.story.images[0].cap, 'Caption');
eq('price untouched', en.price, 29.9);
eq('slug untouched', en.slug, 'x');
eq('brand untouched', en.brand, 'Brand');
eq('accent untouched', en.accent, '#C2185B');

/* Българският се връща както е дошъл - никога не минава през речник. */
eq('bg is identity', translateProduct(sample, 'bg', dict), sample);

/* Липсващ продукт в речника не чупи - връща оригинала. */
eq('missing product falls back', translateProduct(sample, 'en', {}).name, 'Име');

/* Оригиналът не се променя - build-ът го ползва и за другите езици. */
eq('source object not mutated', sample.name, 'Име');
eq('source benefit not mutated', sample.benefits[0].t, 'Заглавие');

console.log(fail ? `\n${fail} FAILED` : '\nall passed');
process.exit(fail ? 1 : 0);
