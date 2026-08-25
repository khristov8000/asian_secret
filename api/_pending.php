<?php
/* Склад за поръчките, които чакат плащане.

   Между "клиентът натисна Плати" и "Viva потвърди" минават минути. През това
   време поръчката живее тук: webhook-ът получава само код на поръчка и
   сделка, а името, адресът и артикулите са наши и трябва да го изчакат.

   Файловете съдържат лични данни - име, телефон, адрес - затова папката е
   затворена и от .htaccess, и от собствен .htaccess вътре в нея, и имената
   им не се познават наизуст. */

const AS_PENDING_DIR = __DIR__ . '/_pending';
/* Неплатена поръчка след толкова часа е изоставена и се чисти. Viva дава на
   клиента 30 минути; часът е с широк запас за бавни начини на плащане. */
const AS_PENDING_TTL = 3600;

function as_pending_dir(): ?string {
  if (!is_dir(AS_PENDING_DIR)) {
    if (!@mkdir(AS_PENDING_DIR, 0700, true) && !is_dir(AS_PENDING_DIR)) {
      error_log('pending: папката не може да се създаде');
      return null;
    }
  }
  /* Втора ключалка освен главния .htaccess: ако някой ден правилата в корена
     се пренапишат, тази папка пак си остава затворена. */
  $guard = AS_PENDING_DIR . '/.htaccess';
  if (!is_file($guard)) @file_put_contents($guard, "Require all denied\n");
  return AS_PENDING_DIR;
}

/* Името на файла се извежда от кода на поръчката, но не е самият код:
   пази се хеш, за да не се налучкват файлове по номер. */
function as_pending_path(string $orderCode): ?string {
  $dir = as_pending_dir();
  if ($dir === null) return null;
  return $dir . '/' . hash('sha256', 'as-pending-' . $orderCode) . '.json';
}

function as_pending_save(string $orderCode, array $order, string $lang): bool {
  $p = as_pending_path($orderCode);
  if ($p === null) return false;
  $data = json_encode(
    ['orderCode' => $orderCode, 'lang' => $lang, 'at' => time(), 'order' => $order],
    JSON_UNESCAPED_UNICODE
  );
  /* Първо във временен файл, после преименуване: webhook-ът може да чете
     точно докато пишем, а преименуването е атомарно. */
  $tmp = $p . '.' . bin2hex(random_bytes(4)) . '.tmp';
  if (@file_put_contents($tmp, $data, LOCK_EX) === false) {
    error_log('pending: записът се провали');
    return false;
  }
  @chmod($tmp, 0600);
  if (!@rename($tmp, $p)) { @unlink($tmp); error_log('pending: преименуването се провали'); return false; }
  return true;
}

function as_pending_load(string $orderCode): ?array {
  $p = as_pending_path($orderCode);
  if ($p === null || !is_file($p)) return null;
  $j = json_decode((string)@file_get_contents($p), true);
  return is_array($j) ? $j : null;
}

function as_pending_delete(string $orderCode): void {
  $p = as_pending_path($orderCode);
  if ($p !== null && is_file($p)) @unlink($p);
}

/* Изоставените се махат при всяко минаване - няма cron, а и не е нужен:
   папката се пипа само при поръчка, тоест рядко и с малко файлове. */
function as_pending_sweep(): void {
  $dir = as_pending_dir();
  if ($dir === null) return;
  foreach ((array)@glob($dir . '/*.json') as $f) {
    if (is_file($f) && (time() - (int)@filemtime($f)) > AS_PENDING_TTL) @unlink($f);
  }
}
