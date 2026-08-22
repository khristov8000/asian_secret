/* Изчертава двете писма с примерна поръчка, за да се гледат в браузър:
     node tools/preview-emails.mjs
   Резултатът е в tmp/email-*.html - не се качва никъде и не се изпраща. */
import fs from 'fs';
import path from 'path';
import { customerEmail, ownerEmail } from '../api/_emails.js';

const catalog = JSON.parse(fs.readFileSync(new URL('../api/_catalog.json', import.meta.url), 'utf8'));
const pick = sku => catalog.items.find(i => i.sku === sku) || catalog.items[0];

const mk = (sku, qty) => {
  const c = pick(sku);
  return { ...c, qty, line: Math.round(c.price * qty * 100) / 100 };
};

const items = [mk('resbro-ex', 1), mk('puru-puru-eye', 2), mk('tuneup-niacinamide-7', 1)];
const subtotal = Math.round(items.reduce((s, i) => s + i.line, 0) * 100) / 100;
const shipping = subtotal >= 40 ? 0 : 3.90;

const order = {
  number: 'AS-482913',
  placedAt: '22.08.2026 г., 14:32',
  customer: {
    name: 'Мария Иванова', firstName: 'Мария', phone: '0888 123 456',
    email: 'maria@example.com', city: 'София', zip: '1000'
  },
  delivery: {
    isOffice: false,
    method: 'До адрес със Спиди - 3,90 €',
    address: 'ул. Витоша 15, вх. Б, ет. 3, ап. 7'
  },
  payment: 'Наложен платеж',
  note: 'Моля, обадете се преди доставка след 17:00 ч.',
  items,
  totals: { subtotal, shipping, total: Math.round((subtotal + shipping) * 100) / 100 }
};

const cfg = {
  site: 'https://asiansecret.bg',
  shop: {
    phone: '0878 141 487', replyTo: 'zax12@abv.bg',
    instagram: 'https://www.instagram.com/asiansecret.bg/'
  }
};

const out = path.join(process.cwd(), 'tmp');
fs.mkdirSync(out, { recursive: true });

/* За преглед адресите на снимките сочат към локалния сървър: домейнът още
   не се резолвва, а без снимки не се вижда дали дизайнът работи. */
const LOCAL = process.env.PREVIEW_BASE || '';

for (const [name, mail] of [['customer', customerEmail(order, cfg)], ['owner', ownerEmail(order, cfg)]]) {
  const html = LOCAL ? mail.html.split(cfg.site).join(LOCAL) : mail.html;
  fs.writeFileSync(path.join(out, 'email-' + name + '.html'), html);
  fs.writeFileSync(path.join(out, 'email-' + name + '.txt'), mail.text);
  console.log(name.padEnd(9), '->', 'tmp/email-' + name + '.html   subject: ' + mail.subject);
}
