<?php
/* Временен преглед на писмата с примерна поръчка. Нищо не се праща.
   Трие се веднага след проверката. */
require __DIR__ . '/_emails.php';
$cat = json_decode(file_get_contents(__DIR__ . '/_catalog.json'), true);
$by = [];
foreach ($cat['items'] as $r) $by[$r['sku']] = $r;
$mk = function ($sku, $qty) use ($by) {
  $c = $by[$sku];
  return $c + ['qty' => $qty, 'line' => round($c['price'] * $qty, 2)];
};
$items = [$mk('resbro-ex', 1), $mk('puru-puru-eye', 2), $mk('tuneup-niacinamide-7', 1)];
$sub = round(array_sum(array_column($items, 'line')), 2);
$ship = $sub >= 40 ? 0.0 : 3.90;
$o = [
  'number' => 'AS-482913', 'placedAt' => '22.08.2026 14:32',
  'customer' => ['name' => 'Мария Иванова', 'firstName' => 'Мария', 'phone' => '0888 123 456',
    'email' => 'maria@example.com', 'city' => 'София', 'zip' => '1000'],
  'delivery' => ['isOffice' => false, 'method' => 'До адрес със Спиди - 3,90 €',
    'address' => 'ул. Витоша 15, вх. Б, ет. 3, ап. 7'],
  'payment' => 'Наложен платеж', 'note' => 'Моля, обадете се преди доставка след 17:00 ч.',
  'items' => $items, 'totals' => ['subtotal' => $sub, 'shipping' => $ship, 'total' => round($sub + $ship, 2)],
];
$cfg = ['site' => 'https://asiansecret.bg', 'shop' => [
  'phone' => '0878 141 487', 'replyTo' => 'zax12@abv.bg',
  'instagram' => 'https://www.instagram.com/asiansecret.bg/']];
$m = ($_GET['who'] ?? 'customer') === 'owner' ? as_owner_email($o, $cfg) : as_customer_email($o, $cfg);
header('Content-Type: text/html; charset=utf-8');
echo $m['html'];
