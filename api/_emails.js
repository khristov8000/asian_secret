/* Шаблоните за двете писма след поръчка.
   Отделен файл (с долна черта отпред, за да не стане маршрут във Vercel),
   за да могат да се пуснат и локално за преглед: node tools/preview-emails.mjs

   Правила за писма, различни от тези за сайта:
   - подредбата е с <table>, не с flex или grid - Outlook не поддържа нито едно
   - стиловете са инлайн: доста клиенти махат <style> от <head>
   - шрифтът е Georgia, а не Playfair Display - уеб шрифтове не се зареждат
     надеждно в пощата, а Georgia е серифен и стои най-близо до марката
   - снимките са JPG, не WebP - Outlook не показва WebP
   - нищо не зависи от снимка: ако клиентът ги блокира, писмото пак се чете */

const C = {
  porcelain: '#FBF9F8', ivory: '#F7F1ED', cream: '#F3E7E2', blush: '#FBEDEA',
  sakura: '#F3A9AD', rose: '#D4666F', roseDeep: '#A94E58',
  ink: '#141110', ink70: '#4a4442', ink45: '#6d6664', line: '#e6e2e0'
};
const SERIF = "Georgia,'Times New Roman',serif";
const SANS = "'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const esc = s => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const money = n => Number(n).toFixed(2).replace('.', ',') + ' €';

/* ── общи парчета ─────────────────────────────────────────────────────────── */

function shell(site, inner, preheader) {
  return `<!doctype html>
<html lang="bg"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>Asian Secret</title>
</head>
<body style="margin:0;padding:0;background:${C.porcelain};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
 style="background:${C.porcelain};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
 style="width:600px;max-width:100%;background:#ffffff;border:1px solid ${C.line};border-radius:10px;overflow:hidden;">
${inner}
</table>
</td></tr></table>
</body></html>`;
}

/* Шапка: логото върху блъш поле с клонка отстрани. */
function header(site, title, sub) {
  return `<tr><td style="background:${C.blush};padding:0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="padding:26px 32px 8px 32px;" align="left">
<a href="${site}/" style="text-decoration:none;">
<img src="${site}/assets/logo-as.png" alt="Asian Secret" width="46" height="40"
 style="display:inline-block;border:0;vertical-align:middle;">
<span style="display:inline-block;vertical-align:middle;padding-left:10px;
 font-family:${SERIF};font-size:17px;letter-spacing:.18em;color:${C.ink};">ASIAN SECRET</span>
</a>
</td></tr>
<tr><td style="padding:6px 32px 28px 32px;">
<div style="font-family:${SANS};font-size:10px;letter-spacing:.24em;text-transform:uppercase;
 color:${C.roseDeep};padding-bottom:8px;">&#10038; ${esc(sub)}</div>
<div style="font-family:${SERIF};font-size:30px;line-height:1.15;color:${C.ink};">${title}</div>
</td></tr>
</table>
</td></tr>
<tr><td style="height:3px;background:${C.sakura};font-size:0;line-height:0;">&nbsp;</td></tr>`;
}

/* Ред за продукт: снимка вляво, име и количество в средата, сума вдясно. */
function itemRows(items) {
  return items.map(it => `<tr>
<td width="72" style="padding:14px 0;vertical-align:top;">
<a href="${it.url}"><img src="${it.image}" alt="${esc(it.name)}" width="64" height="64"
 style="display:block;border:1px solid ${C.line};border-radius:6px;background:${C.ivory};"></a>
</td>
<td style="padding:14px 12px;vertical-align:top;font-family:${SANS};">
<div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:${C.ink45};">${esc(it.brand)}</div>
<a href="${it.url}" style="font-family:${SERIF};font-size:16px;color:${C.ink};text-decoration:none;">${esc(it.name)}</a>
<div style="font-size:12px;color:${C.ink45};padding-top:4px;">${esc(it.size)} &middot; ${it.qty} бр.</div>
</td>
<td align="right" style="padding:14px 0;vertical-align:top;
 font-family:${SERIF};font-size:16px;color:${C.ink};white-space:nowrap;">${money(it.line)}</td>
</tr>
<tr><td colspan="3" style="border-top:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td></tr>`).join('');
}

function totals(t) {
  const row = (label, value, strong) => `<tr>
<td style="padding:6px 0;font-family:${SANS};font-size:${strong ? 15 : 13}px;color:${strong ? C.ink : C.ink70};">${esc(label)}</td>
<td align="right" style="padding:6px 0;font-family:${SERIF};font-size:${strong ? 20 : 14}px;color:${C.ink};white-space:nowrap;">${value}</td>
</tr>`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${row('Междинна сума', money(t.subtotal))}
${row('Доставка', t.shipping === 0 ? 'Безплатна' : money(t.shipping))}
<tr><td colspan="2" style="padding-top:8px;border-top:1px solid ${C.line};font-size:0;">&nbsp;</td></tr>
${row('Общо', money(t.total), true)}
</table>`;
}

function detailTable(rows) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
${rows.filter(r => r[1]).map(r => `<tr>
<td width="150" style="padding:7px 0;font-family:${SANS};font-size:11px;letter-spacing:.12em;
 text-transform:uppercase;color:${C.ink45};vertical-align:top;">${esc(r[0])}</td>
<td style="padding:7px 0;font-family:${SANS};font-size:14px;color:${C.ink};">${esc(r[1])}</td>
</tr>`).join('')}
</table>`;
}

function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:${C.ink};border-radius:999px;">
<a href="${href}" style="display:inline-block;padding:14px 28px;font-family:${SANS};font-size:12px;
 font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#ffffff;text-decoration:none;">${esc(label)}</a>
</td></tr></table>`;
}

function footer(site, shop, note) {
  return `<tr><td style="background:${C.ink};padding:26px 32px;">
<div style="font-family:${SERIF};font-size:15px;letter-spacing:.16em;color:#ffffff;padding-bottom:10px;">ASIAN SECRET</div>
<div style="font-family:${SANS};font-size:12px;line-height:1.7;color:rgba(250,244,242,.72);">
Оригинални продукти от Япония, Корея и Тайланд<br>
<a href="tel:${shop.phone.replace(/\s/g, '')}" style="color:${C.sakura};text-decoration:none;">${esc(shop.phone)}</a>
&nbsp;&middot;&nbsp;
<a href="mailto:${shop.replyTo}" style="color:${C.sakura};text-decoration:none;">${esc(shop.replyTo)}</a>
&nbsp;&middot;&nbsp;
<a href="${shop.instagram}" style="color:${C.sakura};text-decoration:none;">Instagram</a>
</div>
<div style="font-family:${SANS};font-size:11px;color:rgba(250,244,242,.45);padding-top:14px;">
${esc(note)}
</div>
</td></tr>`;
}

const section = (inner, bg) =>
  `<tr><td style="padding:28px 32px;${bg ? 'background:' + bg + ';' : ''}">${inner}</td></tr>`;

const h2 = t => `<div style="font-family:${SERIF};font-size:19px;color:${C.ink};padding-bottom:14px;">${esc(t)}</div>`;

/* ── писмо до клиента ─────────────────────────────────────────────────────── */
export function customerEmail(o, cfg) {
  const { site, shop } = cfg;
  const inner = [
    header(site, `Благодарим за поръчката,<br><em style="color:${C.rose};">${esc(o.customer.firstName)}</em>!`, 'Поръчка ' + o.number),
    section(`<div style="font-family:${SANS};font-size:15px;line-height:1.65;color:${C.ink70};">
Получихме поръчката ви и вече я подготвяме. Ще се свържем с вас на
<strong style="color:${C.ink};">${esc(o.customer.phone)}</strong> за потвърждение,
а пратката тръгва до 48 часа.</div>`),
    section(h2('Вашата поръчка') +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td colspan="3" style="border-top:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td></tr>
${itemRows(o.items)}</table>
<div style="padding-top:12px;">${totals(o.totals)}</div>`, C.porcelain),
    section(h2('Доставка и плащане') + detailTable([
      ['Начин', o.delivery.method],
      [o.delivery.isOffice ? 'Офис на Спиди' : 'Адрес', o.delivery.address],
      ['Град', o.customer.city + (o.customer.zip ? ', ' + o.customer.zip : '')],
      ['Плащане', o.payment],
      ['Срок', '1-3 работни дни']
    ])),
    section(`<div style="font-family:${SANS};font-size:14px;line-height:1.65;color:${C.ink70};padding-bottom:18px;">
Имате въпрос по поръчката? Просто отговорете на това писмо
или ни пишете в Instagram - отговаряме лично.</div>
${button(site + '/products.html', 'Разгледай още продукти')}`, C.blush),
    footer(site, shop, 'Получавате това писмо, защото направихте поръчка в ' +
      site.replace('https://', '') + '.')
  ].join('\n');

  return {
    subject: `Благодарим за поръчката! (${o.number}) - Asian Secret`,
    html: shell(site, inner, `Поръчка ${o.number} на стойност ${money(o.totals.total)} е приета.`),
    text: customerText(o, cfg)
  };
}

/* ── писмо до магазина ────────────────────────────────────────────────────── */
export function ownerEmail(o, cfg) {
  const { site, shop } = cfg;
  const inner = [
    header(site, `Нова поръчка<br><em style="color:${C.rose};">${esc(o.number)}</em>`, 'За изпълнение'),
    section(h2('Клиент') + detailTable([
      ['Име', o.customer.name],
      ['Телефон', o.customer.phone],
      ['Имейл', o.customer.email],
      ['Град', o.customer.city + (o.customer.zip ? ', ' + o.customer.zip : '')]
    ])),
    section(h2('Доставка') + detailTable([
      ['Начин', o.delivery.method],
      [o.delivery.isOffice ? 'Офис на Спиди' : 'Адрес', o.delivery.address],
      ['Плащане', o.payment],
      ['Бележка', o.note || '—']
    ]), C.porcelain),
    section(h2('Продукти') +
      `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td colspan="3" style="border-top:1px solid ${C.line};font-size:0;line-height:0;">&nbsp;</td></tr>
${itemRows(o.items)}</table>
<div style="padding-top:12px;">${totals(o.totals)}</div>`),
    section(button('mailto:' + o.customer.email + '?subject=' +
      encodeURIComponent('Поръчка ' + o.number + ' - Asian Secret'), 'Пиши на клиента') +
      `<div style="font-family:${SANS};font-size:12px;color:${C.ink45};padding-top:14px;">
Поръчано на ${esc(o.placedAt)}</div>`, C.blush),
    footer(site, shop, 'Автоматично известие от ' + site.replace('https://', '') +
      ' - изпраща се при всяка нова поръчка.')
  ].join('\n');

  return {
    subject: `Нова поръчка ${o.number} - ${money(o.totals.total)} - ${o.customer.name}`,
    html: shell(site, inner, `${o.customer.name}, ${o.customer.city} - ${money(o.totals.total)}`),
    text: ownerText(o)
  };
}

/* ── прости текстови варианти ─────────────────────────────────────────────── */
/* Всяко писмо носи и текстова версия: част от клиентите и филтрите за спам
   гледат само нея, а някои хора четат пощата си без HTML. */
const lines = o => o.items
  .map(i => `- ${i.brand} ${i.name} (${i.size}) x${i.qty} = ${money(i.line)}`).join('\n');

function customerText(o, cfg) {
  return `Благодарим за поръчката, ${o.customer.firstName}!

Поръчка: ${o.number}
Ще се свържем с вас на ${o.customer.phone} за потвърждение.

${lines(o)}

Междинна сума: ${money(o.totals.subtotal)}
Доставка: ${o.totals.shipping === 0 ? 'Безплатна' : money(o.totals.shipping)}
Общо: ${money(o.totals.total)}

${o.delivery.method}
${o.delivery.isOffice ? 'Офис на Спиди' : 'Адрес'}: ${o.delivery.address}
Град: ${o.customer.city}${o.customer.zip ? ', ' + o.customer.zip : ''}
Плащане: ${o.payment}

Asian Secret - ${cfg.shop.phone} - ${cfg.site}`;
}

function ownerText(o) {
  return `Нова поръчка ${o.number}

Клиент: ${o.customer.name}
Телефон: ${o.customer.phone}
Имейл: ${o.customer.email}
Град: ${o.customer.city}${o.customer.zip ? ', ' + o.customer.zip : ''}

${o.delivery.method}
${o.delivery.isOffice ? 'Офис' : 'Адрес'}: ${o.delivery.address}
Плащане: ${o.payment}
Бележка: ${o.note || '-'}

${lines(o)}

Междинна сума: ${money(o.totals.subtotal)}
Доставка: ${o.totals.shipping === 0 ? 'Безплатна' : money(o.totals.shipping)}
Общо: ${money(o.totals.total)}

Поръчано на ${o.placedAt}`;
}
