<?php
/* Проверки по пътя на парите, без да се праща нито едно писмо и без да се
   пипа Viva. Пуска се с:  php tools/test-payment.php

   Заменя счупения tools/test-order.mjs, който още търсеше api/order.js -
   файл от времето на Vercel, изтрит при преминаването към PHP. */

declare(strict_types=1);
require __DIR__ . '/../api/_shared.php';
require __DIR__ . '/../api/_viva.php';
require __DIR__ . '/../api/_pending.php';

$fail = 0;
function check(string $name, bool $ok, string $extra = ''): void {
  global $fail;
  if (!$ok) $fail++;
  echo ($ok ? "ok   " : "FAIL ") . $name . ($ok || $extra === '' ? '' : "  -> $extra") . "\n";
}

/* ── сумата към Viva ──────────────────────────────────────────────────────────
   Праща се в центове, цяло число. Тук се проверява точно капанът с двоичното
   закръгляне: 33.80 * 100 не е 3380.0, а 3379.9999... и голият (int) би
   откраднал един цент от всяка такава поръчка. */
echo "\nсумата в центове\n";
$cents = fn(float $v): int => (int)round($v * 100);
check('33,80 -> 3380', $cents(33.80) === 3380, (string)$cents(33.80));
check('29,90 -> 2990', $cents(29.90) === 2990, (string)$cents(29.90));
check('7,90 + 3,90 -> 1180', $cents(7.90 + 3.90) === 1180, (string)$cents(7.90 + 3.90));
check('гол (int) би сгрешил', (int)(33.80 * 100) !== 3380, 'този път не греши, но не разчитаме');
check('0,01 -> 1', $cents(0.01) === 1, (string)$cents(0.01));

/* ── кодът на поръчката ───────────────────────────────────────────────────────
   16 цифри надхвърлят точните числа в JavaScript. Кодът никъде не бива да
   минава през float, инак последните цифри се губят. */
echo "\nкодът на поръчката остава низ\n";
$code = '7271532565172601';
check('низът не се променя', (string)$code === '7271532565172601');
/* В PHP цялото число е 64-битово и кодът оцелява. Опасността е в БРАУЗЪРА:
   там числата са с плаваща запетая и 16 цифри надхвърлят точните стойности.
   Затова кодът не се връща на страницата изобщо - тя получава готов адрес. */
check('PHP държи 16 цифри без загуба', (string)(int)$code === $code);
/* Кодовете са 16 цифри, тоест между 1e15 и 9,99e15, а точните числа в
   JavaScript свършват на 9 007 199 254 740 991. Част от кодовете са отдолу,
   част - отгоре. Точно това прави капана коварен: работи, докато един ден не
   се падне голям код. Затова кодът изобщо не се връща в страницата. */
check('високите кодове излизат извън точните за JavaScript',
  (float)'9500000000000001' > 9007199254740991.0);
check('ниските са под границата - оттам идва измамното спокойствие',
  (float)$code < 9007199254740991.0);
check('адресът към Viva носи целия код',
  str_contains(viva_checkout_url([], $code), $code));
check('бойният адрес е на vivapayments.com',
  str_starts_with(viva_checkout_url([], $code), 'https://www.vivapayments.com/web/checkout?ref='));
check('демо адресът е отделен',
  str_starts_with(viva_checkout_url(['VIVA_DEMO' => true], $code), 'https://demo.vivapayments.com/'));

/* ── адресите, от които приемаме известия ─────────────────────────────────── */
echo "\nсписъкът с адреси на Viva\n";
check('единичен боен адрес', as_ip_allowed('51.138.37.238', VIVA_IPS));
check('вътре в /28', as_ip_allowed('40.127.253.115', VIVA_IPS));
check('първият в /28', as_ip_allowed('40.127.253.112', VIVA_IPS));
check('последният в /28', as_ip_allowed('40.127.253.127', VIVA_IPS));
check('точно извън /28', !as_ip_allowed('40.127.253.128', VIVA_IPS));
check('чужд адрес се отказва', !as_ip_allowed('8.8.8.8', VIVA_IPS));
check('празно се отказва', !as_ip_allowed('', VIVA_IPS));
check('глупост се отказва', !as_ip_allowed('не-е-адрес', VIVA_IPS));
check('демо адрес се приема', as_ip_allowed('20.50.240.57', VIVA_IPS));

/* ── чакащите поръчки ─────────────────────────────────────────────────────── */
echo "\nскладът за чакащи поръчки\n";
$oc = '9999999999999901';
$order = [
  'number' => 'AS-TEST1',
  'customer' => ['name' => 'Мария Иванова', 'email' => 'm@example.com', 'phone' => '0888', 'city' => 'София'],
  'totals' => ['subtotal' => 29.90, 'shipping' => 3.90, 'total' => 33.80],
  'items' => [],
];
as_pending_delete($oc);
check('преди запис няма нищо', as_pending_load($oc) === null);
check('записва се', as_pending_save($oc, $order, 'bg'));
$back = as_pending_load($oc);
check('чете се обратно', is_array($back));
check('кирилицата оцелява', ($back['order']['customer']['name'] ?? '') === 'Мария Иванова',
  $back['order']['customer']['name'] ?? '-');
check('сумата оцелява', ($back['order']['totals']['total'] ?? 0) === 33.80);
check('езикът се пази', ($back['lang'] ?? '') === 'bg');
check('името на файла не е кодът',
  !str_contains((string)as_pending_path($oc), $oc));
check('изтрива се', (function () use ($oc) { as_pending_delete($oc); return as_pending_load($oc) === null; })());

/* Папката трябва да е затворена за уеб - в нея стоят лични данни. */
echo "\nпапката е затворена\n";
as_pending_save($oc, $order, 'bg');
check('има .htaccess вътре', is_file(AS_PENDING_DIR . '/.htaccess'));
check('той отказва достъп',
  str_contains((string)@file_get_contents(AS_PENDING_DIR . '/.htaccess'), 'denied'));
as_pending_delete($oc);

/* ── настройките ──────────────────────────────────────────────────────────── */
echo "\nнастройки\n";
$cfg = as_config();
check('config се чете без да гърми', is_array($cfg));
check('без ключове Viva не тръгва', viva_token([]) === null);

echo "\n" . ($fail ? "$fail проблема\n" : "всичко е наред\n");
exit($fail ? 1 : 0);
