/* Събира ключовете от шаблоните и ги слива в i18n/ui.<lang>.json.
   Новите ключове влизат с null - това е списъкът за превод. Съществуващите
   преводи не се пипат, а отпадналите ключове се махат сами.

   С --audit показва българския текст, който още стои без ключ - така се
   вижда какво е пропуснато при отбелязването.

   Пуска се с: node tools/i18n-extract.mjs [--audit] */
import fs from 'fs';
import path from 'path';

const root = process.cwd();
export const TEMPLATES = ['index.html', 'products.html', 'product.html',
                          'cart.html', 'about.html', 'contact.html'];

/* Ключовете идват както от data-t, така и от data-t-<атрибут>. */
const KEY_RE = /\sdata-t(?:-[\w-]+)?="([^"]+)"/g;

/* Ключове, които не се срещат в шаблон: едните ги ползва JavaScript, другите
   ги сглобява build-ът. Без този списък извличането би ги изхвърлило при
   всяко пускане, защото ги няма в маркъпа. */
const EXTRA_KEYS = [
  /* сглобяват се в tools/seo-build.mjs */
  'seo.catTitle', 'seo.catDesc', 'seo.catLead', 'seo.prodDescTail',
  /* от JavaScript - вж. i18n/ui.bg.json */
  'cart.remove', 'checkout.addrAddress', 'checkout.addrHintAddress',
  'checkout.addrHintOffice', 'checkout.addrOffice', 'checkout.addrPhAddress',
  'checkout.addrPhOffice', 'contact.failed', 'contact.failedLink',
  'contact.ok', 'contact.sending', 'done.fallback', 'done.fallbackLink',
  'done.orderNo', 'home.countProducts', 'ig.alt1', 'ig.alt2', 'ig.alt3',
  'ig.alt4', 'ig.alt5', 'ig.onInstagram', 'nav.closeMenu', 'pdp.add',
  'pdp.cod', 'pdp.less', 'pdp.more', 'pdp.pack', 'pdp.shipDays',
  'pdp.specCount', 'pdp.specOrigin', 'pdp.specType', 'pdp.toCart',
  'shop.buy', 'shop.choose', 'shop.countProducts', 'shop.from', 'shop.swipe',
  'sum.free', 'sum.sending', 'toast.added'
];

export function keysFromTemplates() {
  const keys = new Set(EXTRA_KEYS);
  for (const f of TEMPLATES) {
    for (const m of fs.readFileSync(path.join(root, f), 'utf8').matchAll(KEY_RE))
      keys.add(m[1]);
  }
  return [...keys].sort();
}

/* Търси видим български текст, който не е зад ключ. Скриптовете и
   коментарите се махат първо - те се превеждат по друг път (речника T). */
export function auditFile(file) {
  let html = fs.readFileSync(path.join(root, file), 'utf8')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    /* Капанът за ботове в количката е aria-hidden и изнесен извън екрана.
       Никой не го чете - нито потребител, нито екранен четец - затова
       етикетът му остава български във всички езици. */
    .replace(/<div aria-hidden="true"[\s\S]*?<\/div>/gi, '');

  /* Махат се елементите, които вече носят ключ - заедно със съдържанието. */
  html = html.replace(/<([a-z0-9]+)([^>]*\sdata-t="[^"]+"[^>]*)>([\s\S]*?)<\/\1>/gi, '');

  const left = [];
  for (const m of html.matchAll(/>([^<>]*[А-Яа-яЁё][^<>]*)</g)) {
    const t = m[1].trim();
    if (t) left.push(t);
  }
  /* Български в атрибути, които се виждат от потребителя. Атрибут със свой
     data-t-<име> в същия таг вече е покрит - затова се гледа целият таг, а
     не самият атрибут. */
  for (const tag of html.match(/<[a-z0-9]+[^>]*>/gi) || []) {
    for (const m of tag.matchAll(/\s(alt|title|placeholder|aria-label)="([^"]*[А-Яа-яЁё][^"]*)"/g)) {
      if (!tag.includes('data-t-' + m[1] + '=')) left.push(m[1] + '="' + m[2] + '"');
    }
  }
  return left;
}

if (import.meta.filename === process.argv[1]) {
  if (process.argv.includes('--audit')) {
    let total = 0;
    for (const f of TEMPLATES) {
      const left = auditFile(f);
      total += left.length;
      if (left.length) {
        console.log(`\n${f}: ${left.length} без ключ`);
        for (const t of left) console.log('  ' + t.slice(0, 100));
      }
    }
    console.log(total ? `\nобщо ${total} без ключ` : '\nвсичко видимо е с ключ');
    process.exit(0);
  }

  const keys = keysFromTemplates();
  fs.mkdirSync(path.join(root, 'i18n'), { recursive: true });
  for (const lang of ['en', 'ru']) {
    const p = path.join(root, 'i18n', 'ui.' + lang + '.json');
    const cur = fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {};
    const out = {};
    for (const k of keys) out[k] = Object.hasOwn(cur, k) ? cur[k] : null;
    fs.writeFileSync(p, JSON.stringify(out, null, 1) + '\n');
    const done = keys.filter(k => out[k] !== null).length;
    console.log(`ui.${lang}.json: ${keys.length} ключа, ${done} преведени`);
  }
}
