<?php
/* Приемане на поръчка и изпращане на двете писма.
   Живее на самия домейн: POST https://asiansecret.bg/api/order.php
   Понеже е на същия произход, CORS не е нужен.

   Настройките се четат от api/config.local.php - файл, който НЕ е в
   хранилището и се създава през файловия мениджър на хостинга. Ключът за
   пощата не бива да влиза в Git. Виж api/config.example.php.

   Защо изобщо има сървърна част: ключът не може да стои в браузъра - всеки
   може да го прочете и да го използва. */

declare(strict_types=1);

const AS_SITE = 'https://asiansecret.bg';
const AS_SHIPPING_FLAT = 3.90;
const AS_FREE_SHIPPING = 40.0;

const AS_SHOP = [
  'phone' => '0878 141 487',
  'replyTo' => 'zax12@abv.bg',
  'instagram' => 'https://www.instagram.com/asiansecret.bg/',
];

require __DIR__ . '/_emails.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

function as_fail(int $code, string $msg): never {
  http_response_code($code);
  echo json_encode(['error' => $msg], JSON_UNESCAPED_UNICODE);
  exit;
}

function as_config(): array {
  $cfg = [];
  $file = __DIR__ . '/config.local.php';
  if (is_readable($file)) {
    $loaded = require $file;
    if (is_array($loaded)) $cfg = $loaded;
  }
  /* Стойност от средата бие файла - удобно при местене на друг хостинг. */
  foreach (['RESEND_API_KEY', 'ORDER_TO', 'ORDER_FROM'] as $k) {
    $v = getenv($k);
    if ($v !== false && $v !== '') $cfg[$k] = $v;
  }
  return $cfg;
}

function as_clean($v, int $max): string {
  $s = is_scalar($v) ? (string)$v : '';
  $s = preg_replace('/[\r\n\t]+/u', ' ', $s);
  $s = trim($s);
  return mb_substr($s, 0, $max, 'UTF-8');
}

/* Праща едно писмо през Resend. Връща [ok, съобщение за дневника]. */
function as_send(array $payload, string $key): array {
  $ch = curl_init('https://api.resend.com/emails');
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_HTTPHEADER => [
      'Authorization: Bearer ' . $key,
      'Content-Type: application/json',
    ],
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
  ]);
  $body = curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  $err = curl_error($ch);
  curl_close($ch);
  if ($body === false) return [false, 'curl: ' . $err];
  if ($code < 200 || $code >= 300) return [false, "resend $code: " . mb_substr((string)$body, 0, 300)];
  return [true, ''];
}

/* ── заявката ─────────────────────────────────────────────────────────────── */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') as_fail(405, 'method not allowed');

$cfg = as_config();
if (empty($cfg['RESEND_API_KEY'])) as_fail(500, 'missing RESEND_API_KEY');

$raw = file_get_contents('php://input');
if ($raw === false || strlen($raw) > 60000) as_fail(400, 'bad request');
$body = json_decode($raw, true);
if (!is_array($body)) as_fail(400, 'invalid json');

/* Капан за ботове: полето е скрито в разметката, човек не го попълва. */
if (as_clean($body['company'] ?? '', 60) !== '') {
  echo json_encode(['ok' => true, 'skipped' => true]);
  exit;
}

$name  = as_clean($body['name'] ?? '', 80);
$phone = as_clean($body['phone'] ?? '', 40);
$email = as_clean($body['email'] ?? '', 120);
$city  = as_clean($body['city'] ?? '', 80);
if ($name === '' || $phone === '' || $city === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
  as_fail(400, 'invalid customer details');
}

/* Количката се преизчислява по каталога. На цените от браузъра не се вярва -
   те се подменят тривиално от конзолата на всеки посетител. */
$catalogRaw = file_get_contents(__DIR__ . '/_catalog.json');
$catalog = json_decode((string)$catalogRaw, true);
if (!is_array($catalog) || empty($catalog['items'])) as_fail(500, 'catalog unavailable');
$bySku = [];
foreach ($catalog['items'] as $row) $bySku[$row['sku']] = $row;

$items = [];
$rawItems = is_array($body['items'] ?? null) ? array_slice($body['items'], 0, 40) : [];
foreach ($rawItems as $it) {
  $sku = is_array($it) ? (string)($it['sku'] ?? '') : '';
  if (!isset($bySku[$sku])) continue;
  $qty = (int)($it['qty'] ?? 0);
  $qty = max(1, min(99, $qty));
  $cat = $bySku[$sku];
  $items[] = [
    'sku' => $cat['sku'], 'brand' => $cat['brand'], 'name' => $cat['name'],
    'size' => $cat['size'], 'url' => $cat['url'], 'image' => $cat['image'],
    'qty' => $qty, 'price' => (float)$cat['price'],
    'line' => round((float)$cat['price'] * $qty, 2),
  ];
}
if (!$items) as_fail(400, 'empty or unknown cart');

$subtotal = round(array_sum(array_column($items, 'line')), 2);
$shipping = $subtotal >= AS_FREE_SHIPPING ? 0.0 : AS_SHIPPING_FLAT;
$totals = ['subtotal' => $subtotal, 'shipping' => $shipping, 'total' => round($subtotal + $shipping, 2)];

$isOffice = (string)($body['deliveryMode'] ?? 'office') !== 'address';
$firstName = explode(' ', $name)[0] ?: $name;

$now = new DateTime('now', new DateTimeZone('Europe/Sofia'));
$order = [
  'number' => 'AS-' . substr((string)(int)(microtime(true) * 1000), -6),
  'placedAt' => $now->format('d.m.Y H:i'),
  'customer' => [
    'name' => $name, 'firstName' => $firstName, 'phone' => $phone,
    'email' => $email, 'city' => $city, 'zip' => as_clean($body['zip'] ?? '', 12),
  ],
  'delivery' => [
    'isOffice' => $isOffice,
    'method' => $isOffice ? 'До офис на Спиди - 3,90 €' : 'До адрес със Спиди - 3,90 €',
    'address' => as_clean($body['address'] ?? '', 200),
  ],
  'payment' => as_clean($body['payment'] ?? '', 40) ?: 'Наложен платеж',
  'note' => as_clean($body['note'] ?? '', 500),
  'items' => $items, 'totals' => $totals,
];

$emailCfg = ['site' => AS_SITE, 'shop' => AS_SHOP];
$from = $cfg['ORDER_FROM'] ?? 'Asian Secret <orders@asiansecret.bg>';
$to   = $cfg['ORDER_TO'] ?? 'kaloian8000@gmail.com';

$forOwner = as_owner_email($order, $emailCfg);
$forCustomer = as_customer_email($order, $emailCfg);

/* Писмото до магазина е важното - то носи поръчката. Затова се изпраща първо
   и само неговият неуспех проваля заявката. */
[$ok, $err] = as_send([
  'from' => $from, 'to' => [$to], 'reply_to' => $order['customer']['email'],
  'subject' => $forOwner['subject'], 'html' => $forOwner['html'], 'text' => $forOwner['text'],
], $cfg['RESEND_API_KEY']);

if (!$ok) {
  error_log('order: owner email failed - ' . $err);
  as_fail(502, 'send failed');
}

/* Поръчката вече е при магазина - грешен адрес на клиента не бива да я
   проваля. */
[$custOk, $custErr] = as_send([
  'from' => $from, 'to' => [$order['customer']['email']], 'reply_to' => AS_SHOP['replyTo'],
  'subject' => $forCustomer['subject'], 'html' => $forCustomer['html'], 'text' => $forCustomer['text'],
], $cfg['RESEND_API_KEY']);
if (!$custOk) error_log('order: customer email failed - ' . $custErr);

echo json_encode([
  'ok' => true,
  'number' => $order['number'],
  'total' => as_money($totals['total']),
  'customerSent' => $custOk,
], JSON_UNESCAPED_UNICODE);
