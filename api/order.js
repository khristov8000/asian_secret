/* Приемане на поръчка и изпращане на двете писма.
   Работи като функция във Vercel: POST /api/order

   Нужни променливи на средата:
     RESEND_API_KEY   ключът от resend.com
     ORDER_TO         къде отиват поръчките (по подразбиране kaloian8000@gmail.com)
     ORDER_FROM       подателят, напр. "Asian Secret <orders@asiansecret.bg>"

   Защо изобщо има сървърна част: ключът за пощата не може да стои в браузъра -
   всеки може да го прочете и да го използва. */

import catalog from './_catalog.json' with { type: 'json' };
import { customerEmail, ownerEmail } from './_emails.js';

const SITE = 'https://asiansecret.bg';
const SHIPPING_FLAT = 3.90;
const FREE_SHIPPING = 40;

const SHOP = {
  phone: '0878 141 487',
  replyTo: 'zax12@abv.bg',
  instagram: 'https://www.instagram.com/asiansecret.bg/'
};

/* Откъде се приемат заявки. Сайтът може да живее на домейна, на Vercel или
   да се отваря локално при разработка. */
const ALLOWED = [
  SITE, 'https://www.asiansecret.bg',
  'http://localhost:8793', 'http://localhost:8787'
];

const BY_SKU = new Map(catalog.items.map(i => [i.sku, i]));
const money = n => Number(n).toFixed(2).replace('.', ',') + ' €';
const clean = (s, max) => String(s == null ? '' : s).replace(/[\r\n\t]+/g, ' ').trim().slice(0, max);
const isEmail = s => /^[^@\s]+@[^@\s.]+\.[^@\s]{2,}$/.test(s);

function cors(req, res) {
  const origin = req.headers.origin;
  if (ALLOWED.includes(origin)) res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

async function send(payload) {
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  if (!r.ok) throw new Error('resend ' + r.status + ': ' + (await r.text()).slice(0, 300));
  return r.json();
}

export default async function handler(req, res) {
  cors(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });
  if (!process.env.RESEND_API_KEY) return res.status(500).json({ error: 'missing RESEND_API_KEY' });

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});

    /* Капан за ботове: полето е скрито в разметката, човек не го попълва. */
    if (clean(body.company, 60)) return res.status(200).json({ ok: true, skipped: true });

    const name = clean(body.name, 80);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 120);
    const city = clean(body.city, 80);
    if (!name || !phone || !isEmail(email) || !city) {
      return res.status(400).json({ error: 'invalid customer details' });
    }

    /* Количката се преизчислява по каталога. На цените от браузъра не се
       вярва - те се подменят тривиално от конзолата на всеки посетител. */
    const raw = Array.isArray(body.items) ? body.items.slice(0, 40) : [];
    const items = [];
    for (const it of raw) {
      const cat = BY_SKU.get(String(it && it.sku));
      const qty = Math.max(1, Math.min(99, parseInt(it && it.qty, 10) || 0));
      if (!cat) continue;
      items.push({
        sku: cat.sku, brand: cat.brand, name: cat.name, size: cat.size,
        url: cat.url, image: cat.image, qty, price: cat.price,
        line: Math.round(cat.price * qty * 100) / 100
      });
    }
    if (!items.length) return res.status(400).json({ error: 'empty or unknown cart' });

    const subtotal = Math.round(items.reduce((s, i) => s + i.line, 0) * 100) / 100;
    const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FLAT;
    const totals = { subtotal, shipping, total: Math.round((subtotal + shipping) * 100) / 100 };

    const isOffice = String(body.deliveryMode || 'office') !== 'address';
    const order = {
      number: 'AS-' + Date.now().toString().slice(-6),
      placedAt: new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' }),
      customer: {
        name, firstName: name.split(' ')[0] || name, phone, email, city,
        zip: clean(body.zip, 12)
      },
      delivery: {
        isOffice,
        method: isOffice ? 'До офис на Спиди - 3,90 €' : 'До адрес със Спиди - 3,90 €',
        address: clean(body.address, 200)
      },
      payment: clean(body.payment, 40) || 'Наложен платеж',
      note: clean(body.note, 500),
      items, totals
    };

    const cfg = { site: SITE, shop: SHOP };
    const from = process.env.ORDER_FROM || 'Asian Secret <orders@asiansecret.bg>';
    const to = process.env.ORDER_TO || 'kaloian8000@gmail.com';

    const forOwner = ownerEmail(order, cfg);
    const forCustomer = customerEmail(order, cfg);

    /* Писмото до магазина е важното - то носи поръчката. Затова се изпраща
       първо и само неговият неуспех проваля заявката. */
    await send({
      from, to: [to], reply_to: order.customer.email,
      subject: forOwner.subject, html: forOwner.html, text: forOwner.text
    });

    let customerSent = true;
    try {
      await send({
        from, to: [order.customer.email], reply_to: SHOP.replyTo,
        subject: forCustomer.subject, html: forCustomer.html, text: forCustomer.text
      });
    } catch (e) {
      /* Поръчката вече е стигнала до магазина - грешен адрес на клиента не
         бива да я проваля. */
      customerSent = false;
      console.error('customer email failed', e);
    }

    return res.status(200).json({
      ok: true, number: order.number, total: money(totals.total), customerSent
    });
  } catch (e) {
    console.error('order failed', e);
    return res.status(500).json({ error: 'send failed' });
  }
}
