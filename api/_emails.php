<?php
/* Шаблоните за двете писма след поръчка.
   Име с долна черта отпред: това не е маршрут, а помощен файл.

   Правила за писма, различни от тези за сайта:
   - подредбата е с <table>, не с flex или grid - Outlook не поддържа нито едно
   - стиловете са инлайн: доста клиенти махат <style> от <head>
   - шрифтът е Georgia, а не Playfair Display - уеб шрифтове не се зареждат
     надеждно в пощата, а Georgia е серифен и стои най-близо до марката
   - снимките са JPG, не WebP - Outlook не показва WebP
   - нищо не зависи от снимка: ако клиентът ги блокира, писмото пак се чете */

const AS_C = [
  'porcelain' => '#FBF9F8', 'ivory' => '#F7F1ED', 'blush' => '#FBEDEA',
  'sakura' => '#F3A9AD', 'rose' => '#D4666F', 'roseDeep' => '#A94E58',
  'ink' => '#141110', 'ink70' => '#4a4442', 'ink45' => '#6d6664', 'line' => '#e6e2e0',
];
const AS_SERIF = "Georgia,'Times New Roman',serif";
const AS_SANS  = "'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

function as_esc($s) {
  return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
function as_money($n) {
  return str_replace('.', ',', number_format((float)$n, 2, '.', '')) . ' €';
}

function as_shell($inner, $preheader) {
  $c = AS_C;
  return '<!doctype html>
<html lang="bg"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>Asian Secret</title>
</head>
<body style="margin:0;padding:0;background:' . $c['porcelain'] . ';">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">' . as_esc($preheader) . '</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
 style="background:' . $c['porcelain'] . ';padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
 style="width:600px;max-width:100%;background:#ffffff;border:1px solid ' . $c['line'] . ';border-radius:10px;overflow:hidden;">
' . $inner . '
</table>
</td></tr></table>
</body></html>';
}

function as_header($site, $title, $sub) {
  $c = AS_C;
  return '<tr><td style="background:' . $c['blush'] . ';padding:0;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td style="padding:26px 32px 8px 32px;" align="left">
<a href="' . $site . '/" style="text-decoration:none;">
<img src="' . $site . '/assets/logo-as.png" alt="Asian Secret" width="46" height="40"
 style="display:inline-block;border:0;vertical-align:middle;">
<span style="display:inline-block;vertical-align:middle;padding-left:10px;
 font-family:' . AS_SERIF . ';font-size:17px;letter-spacing:.18em;color:' . $c['ink'] . ';">ASIAN SECRET</span>
</a>
</td></tr>
<tr><td style="padding:6px 32px 28px 32px;">
<div style="font-family:' . AS_SANS . ';font-size:10px;letter-spacing:.24em;text-transform:uppercase;
 color:' . $c['roseDeep'] . ';padding-bottom:8px;">&#10038; ' . as_esc($sub) . '</div>
<div style="font-family:' . AS_SERIF . ';font-size:30px;line-height:1.15;color:' . $c['ink'] . ';">' . $title . '</div>
</td></tr>
</table>
</td></tr>
<tr><td style="height:3px;background:' . $c['sakura'] . ';font-size:0;line-height:0;">&nbsp;</td></tr>';
}

function as_item_rows($items) {
  $c = AS_C; $out = '';
  foreach ($items as $it) {
    $out .= '<tr>
<td width="72" style="padding:14px 0;vertical-align:top;">
<a href="' . $it['url'] . '"><img src="' . $it['image'] . '" alt="' . as_esc($it['name']) . '" width="64" height="64"
 style="display:block;border:1px solid ' . $c['line'] . ';border-radius:6px;background:' . $c['ivory'] . ';"></a>
</td>
<td style="padding:14px 12px;vertical-align:top;font-family:' . AS_SANS . ';">
<div style="font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:' . $c['ink45'] . ';">' . as_esc($it['brand']) . '</div>
<a href="' . $it['url'] . '" style="font-family:' . AS_SERIF . ';font-size:16px;color:' . $c['ink'] . ';text-decoration:none;">' . as_esc($it['name']) . '</a>
<div style="font-size:12px;color:' . $c['ink45'] . ';padding-top:4px;">' . as_esc($it['size']) . ' &middot; ' . (int)$it['qty'] . ' бр.</div>
</td>
<td align="right" style="padding:14px 0;vertical-align:top;
 font-family:' . AS_SERIF . ';font-size:16px;color:' . $c['ink'] . ';white-space:nowrap;">' . as_money($it['line']) . '</td>
</tr>
<tr><td colspan="3" style="border-top:1px solid ' . $c['line'] . ';font-size:0;line-height:0;">&nbsp;</td></tr>';
  }
  return $out;
}

function as_totals($t) {
  $c = AS_C;
  $row = function ($label, $value, $strong = false) use ($c) {
    return '<tr>
<td style="padding:6px 0;font-family:' . AS_SANS . ';font-size:' . ($strong ? 15 : 13) . 'px;color:' . ($strong ? $c['ink'] : $c['ink70']) . ';">' . as_esc($label) . '</td>
<td align="right" style="padding:6px 0;font-family:' . AS_SERIF . ';font-size:' . ($strong ? 20 : 14) . 'px;color:' . $c['ink'] . ';white-space:nowrap;">' . $value . '</td>
</tr>';
  };
  return '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">'
    . $row('Междинна сума', as_money($t['subtotal']))
    . $row('Доставка', $t['shipping'] == 0 ? 'Безплатна' : as_money($t['shipping']))
    . '<tr><td colspan="2" style="padding-top:8px;border-top:1px solid ' . $c['line'] . ';font-size:0;">&nbsp;</td></tr>'
    . $row('Общо', as_money($t['total']), true)
    . '</table>';
}

function as_detail_table($rows) {
  $c = AS_C; $out = '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">';
  foreach ($rows as $r) {
    if ($r[1] === '' || $r[1] === null) continue;
    $out .= '<tr>
<td width="150" style="padding:7px 0;font-family:' . AS_SANS . ';font-size:11px;letter-spacing:.12em;
 text-transform:uppercase;color:' . $c['ink45'] . ';vertical-align:top;">' . as_esc($r[0]) . '</td>
<td style="padding:7px 0;font-family:' . AS_SANS . ';font-size:14px;color:' . $c['ink'] . ';">' . as_esc($r[1]) . '</td>
</tr>';
  }
  return $out . '</table>';
}

function as_button($href, $label) {
  $c = AS_C;
  return '<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
<td style="background:' . $c['ink'] . ';border-radius:999px;">
<a href="' . $href . '" style="display:inline-block;padding:14px 28px;font-family:' . AS_SANS . ';font-size:12px;
 font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#ffffff;text-decoration:none;">' . as_esc($label) . '</a>
</td></tr></table>';
}

function as_footer($site, $shop, $note) {
  $c = AS_C;
  $tel = preg_replace('/\s+/', '', $shop['phone']);
  return '<tr><td style="background:' . $c['ink'] . ';padding:26px 32px;">
<div style="font-family:' . AS_SERIF . ';font-size:15px;letter-spacing:.16em;color:#ffffff;padding-bottom:10px;">ASIAN SECRET</div>
<div style="font-family:' . AS_SANS . ';font-size:12px;line-height:1.7;color:rgba(250,244,242,.72);">
Оригинални продукти от Япония, Корея и Тайланд<br>
<a href="tel:' . $tel . '" style="color:' . $c['sakura'] . ';text-decoration:none;">' . as_esc($shop['phone']) . '</a>
&nbsp;&middot;&nbsp;
<a href="mailto:' . $shop['replyTo'] . '" style="color:' . $c['sakura'] . ';text-decoration:none;">' . as_esc($shop['replyTo']) . '</a>
&nbsp;&middot;&nbsp;
<a href="' . $shop['instagram'] . '" style="color:' . $c['sakura'] . ';text-decoration:none;">Instagram</a>
</div>
<div style="font-family:' . AS_SANS . ';font-size:11px;color:rgba(250,244,242,.45);padding-top:14px;">
' . as_esc($note) . '
</div>
</td></tr>';
}

function as_section($inner, $bg = null) {
  return '<tr><td style="padding:28px 32px;' . ($bg ? 'background:' . $bg . ';' : '') . '">' . $inner . '</td></tr>';
}
function as_h2($t) {
  return '<div style="font-family:' . AS_SERIF . ';font-size:19px;color:' . AS_C['ink'] . ';padding-bottom:14px;">' . as_esc($t) . '</div>';
}

/* ── писмо до клиента ─────────────────────────────────────────────────────── */
function as_customer_email($o, $cfg) {
  $c = AS_C; $site = $cfg['site']; $shop = $cfg['shop'];
  $inner = as_header($site,
      'Благодарим за поръчката,<br><em style="color:' . $c['rose'] . ';">' . as_esc($o['customer']['firstName']) . '</em>!',
      'Поръчка ' . $o['number'])
    . as_section('<div style="font-family:' . AS_SANS . ';font-size:15px;line-height:1.65;color:' . $c['ink70'] . ';">
Получихме поръчката ви и вече я подготвяме. Ще се свържем с вас на
<strong style="color:' . $c['ink'] . ';">' . as_esc($o['customer']['phone']) . '</strong> за потвърждение,
а пратката тръгва до 48 часа.</div>')
    . as_section(as_h2('Вашата поръчка')
      . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td colspan="3" style="border-top:1px solid ' . $c['line'] . ';font-size:0;line-height:0;">&nbsp;</td></tr>'
      . as_item_rows($o['items']) . '</table>
<div style="padding-top:12px;">' . as_totals($o['totals']) . '</div>', $c['porcelain'])
    . as_section(as_h2('Доставка и плащане') . as_detail_table([
        ['Начин', $o['delivery']['method']],
        [$o['delivery']['isOffice'] ? 'Офис на Спиди' : 'Адрес', $o['delivery']['address']],
        ['Град', $o['customer']['city'] . ($o['customer']['zip'] ? ', ' . $o['customer']['zip'] : '')],
        ['Плащане', $o['payment']],
        ['Срок', '1-3 работни дни'],
      ]))
    . as_section('<div style="font-family:' . AS_SANS . ';font-size:14px;line-height:1.65;color:' . $c['ink70'] . ';padding-bottom:18px;">
Имате въпрос по поръчката? Просто отговорете на това писмо
или ни пишете в Instagram - отговаряме лично.</div>'
      . as_button($site . '/products', 'Разгледай още продукти'), $c['blush'])
    . as_footer($site, $shop, 'Получавате това писмо, защото направихте поръчка в '
      . str_replace('https://', '', $site) . '.');

  return [
    'subject' => 'Благодарим за поръчката! (' . $o['number'] . ') - Asian Secret',
    'html' => as_shell($inner, 'Поръчка ' . $o['number'] . ' на стойност ' . as_money($o['totals']['total']) . ' е приета.'),
    'text' => as_customer_text($o, $cfg),
  ];
}

/* ── писмо до магазина ────────────────────────────────────────────────────── */
function as_owner_email($o, $cfg) {
  $c = AS_C; $site = $cfg['site']; $shop = $cfg['shop'];
  $inner = as_header($site,
      'Нова поръчка<br><em style="color:' . $c['rose'] . ';">' . as_esc($o['number']) . '</em>', 'За изпълнение')
    . as_section(as_h2('Клиент') . as_detail_table([
        ['Име', $o['customer']['name']],
        ['Телефон', $o['customer']['phone']],
        ['Имейл', $o['customer']['email']],
        ['Град', $o['customer']['city'] . ($o['customer']['zip'] ? ', ' . $o['customer']['zip'] : '')],
      ]))
    . as_section(as_h2('Доставка') . as_detail_table([
        ['Начин', $o['delivery']['method']],
        [$o['delivery']['isOffice'] ? 'Офис на Спиди' : 'Адрес', $o['delivery']['address']],
        ['Плащане', $o['payment']],
        ['Бележка', $o['note'] !== '' ? $o['note'] : '—'],
      ]), $c['porcelain'])
    . as_section(as_h2('Продукти')
      . '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
<tr><td colspan="3" style="border-top:1px solid ' . $c['line'] . ';font-size:0;line-height:0;">&nbsp;</td></tr>'
      . as_item_rows($o['items']) . '</table>
<div style="padding-top:12px;">' . as_totals($o['totals']) . '</div>')
    . as_section(as_button('mailto:' . $o['customer']['email'] . '?subject='
        . rawurlencode('Поръчка ' . $o['number'] . ' - Asian Secret'), 'Пиши на клиента')
      . '<div style="font-family:' . AS_SANS . ';font-size:12px;color:' . $c['ink45'] . ';padding-top:14px;">
Поръчано на ' . as_esc($o['placedAt']) . '</div>', $c['blush'])
    . as_footer($site, $shop, 'Автоматично известие от ' . str_replace('https://', '', $site)
      . ' - изпраща се при всяка нова поръчка.');

  return [
    'subject' => 'Нова поръчка ' . $o['number'] . ' - ' . as_money($o['totals']['total']) . ' - ' . $o['customer']['name'],
    'html' => as_shell($inner, $o['customer']['name'] . ', ' . $o['customer']['city'] . ' - ' . as_money($o['totals']['total'])),
    'text' => as_owner_text($o),
  ];
}

/* ── прости текстови варианти ─────────────────────────────────────────────── */
/* Всяко писмо носи и текстова версия: част от клиентите и филтрите за спам
   гледат само нея, а някои хора четат пощата си без HTML. */
function as_lines($o) {
  $out = [];
  foreach ($o['items'] as $i) {
    $out[] = '- ' . $i['brand'] . ' ' . $i['name'] . ' (' . $i['size'] . ') x' . $i['qty'] . ' = ' . as_money($i['line']);
  }
  return implode("\n", $out);
}

function as_customer_text($o, $cfg) {
  $ship = $o['totals']['shipping'] == 0 ? 'Безплатна' : as_money($o['totals']['shipping']);
  return "Благодарим за поръчката, {$o['customer']['firstName']}!\n\n"
    . "Поръчка: {$o['number']}\n"
    . "Ще се свържем с вас на {$o['customer']['phone']} за потвърждение.\n\n"
    . as_lines($o) . "\n\n"
    . 'Междинна сума: ' . as_money($o['totals']['subtotal']) . "\n"
    . "Доставка: $ship\n"
    . 'Общо: ' . as_money($o['totals']['total']) . "\n\n"
    . $o['delivery']['method'] . "\n"
    . ($o['delivery']['isOffice'] ? 'Офис на Спиди' : 'Адрес') . ': ' . $o['delivery']['address'] . "\n"
    . 'Град: ' . $o['customer']['city'] . ($o['customer']['zip'] ? ', ' . $o['customer']['zip'] : '') . "\n"
    . 'Плащане: ' . $o['payment'] . "\n\n"
    . 'Asian Secret - ' . $cfg['shop']['phone'] . ' - ' . $cfg['site'];
}

function as_owner_text($o) {
  $ship = $o['totals']['shipping'] == 0 ? 'Безплатна' : as_money($o['totals']['shipping']);
  return "Нова поръчка {$o['number']}\n\n"
    . "Клиент: {$o['customer']['name']}\n"
    . "Телефон: {$o['customer']['phone']}\n"
    . "Имейл: {$o['customer']['email']}\n"
    . 'Град: ' . $o['customer']['city'] . ($o['customer']['zip'] ? ', ' . $o['customer']['zip'] : '') . "\n\n"
    . $o['delivery']['method'] . "\n"
    . ($o['delivery']['isOffice'] ? 'Офис' : 'Адрес') . ': ' . $o['delivery']['address'] . "\n"
    . 'Плащане: ' . $o['payment'] . "\n"
    . 'Бележка: ' . ($o['note'] !== '' ? $o['note'] : '-') . "\n\n"
    . as_lines($o) . "\n\n"
    . 'Междинна сума: ' . as_money($o['totals']['subtotal']) . "\n"
    . "Доставка: $ship\n"
    . 'Общо: ' . as_money($o['totals']['total']) . "\n\n"
    . 'Поръчано на ' . $o['placedAt'];
}
