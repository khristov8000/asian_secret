<?php
/* Общото между приемането на поръчка и известието от Viva.

   Дотук тези неща живееха в order.php. Известието за платена карта идва по
   съвсем друг път - viva-webhook.php - и има нужда от същите настройки и от
   същото пращане на писма. Копие би се разминало с оригинала при първата
   поправка, затова стоят на едно място. */

declare(strict_types=1);

const AS_SITE = 'https://asiansecret.bg';
const AS_SHIPPING_FLAT = 3.90;
const AS_FREE_SHIPPING = 40.0;

const AS_SHOP = [
  'phone' => '0878 141 487',
  'replyTo' => 'zax12@abv.bg',
  'instagram' => 'https://www.instagram.com/asiansecret.bg/',
];

/* Настройките: файлът на хостинга, а отгоре му - стойности от средата.
   Така преместване на друг хостинг не изисква редакция на файл. */
function as_config(): array {
  $cfg = [];
  $file = __DIR__ . '/config.local.php';
  if (is_readable($file)) {
    $loaded = require $file;
    if (is_array($loaded)) $cfg = $loaded;
  }
  foreach ([
    'RESEND_API_KEY', 'ORDER_TO', 'ORDER_FROM',
    'VIVA_CLIENT_ID', 'VIVA_CLIENT_SECRET', 'VIVA_SOURCE_CODE',
    'VIVA_WEBHOOK_KEY', 'VIVA_DEMO',
  ] as $k) {
    $v = getenv($k);
    if ($v !== false && $v !== '') $cfg[$k] = $v;
  }
  return $cfg;
}

function as_clean($v, int $max): string {
  $s = is_scalar($v) ? (string)$v : '';
  $s = preg_replace('/[\r\n\t]+/u', ' ', $s);
  $s = trim($s);
  return mb_substr($s, 0, $max);
}

/* Праща едно писмо през Resend. Връща [ok, съобщение за дневника]. */
function as_send(array $payload, string $key): array {
  $ch = curl_init('https://api.resend.com/emails');
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
    CURLOPT_HTTPHEADER => [
      'Content-Type: application/json',
      'Authorization: Bearer ' . $key,
    ],
  ]);
  $body = curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  $err = curl_error($ch);
  curl_close($ch);
  if ($body === false) return [false, 'curl: ' . $err];
  if ($code < 200 || $code >= 300) return [false, "resend $code: " . mb_substr((string)$body, 0, 300)];
  return [true, ''];
}
