<?php
/* Клиент за Viva Smart Checkout.

   Потокът е: създава се поръчка за плащане (оттук), клиентът се праща на
   страницата на Viva, плаща там, връща се на /thank-you, а истината за
   плащането идва отделно - през viva-webhook.php. Картовите данни никога не
   минават през нашия сървър, затова и PCI изискванията не ни засягат.

   Всички тайни се четат от api/config.local.php, който не влиза в Git -
   хранилището е публично. */

/* Бойните адреси. Демо стойностите стоят тук нарочно: при преминаване към
   тестова сметка се сменя само VIVA_DEMO в config.local.php. */
const VIVA_HOSTS = [
  'live' => [
    'token'    => 'https://accounts.vivapayments.com/connect/token',
    'api'      => 'https://api.vivapayments.com',
    'checkout' => 'https://www.vivapayments.com/web/checkout?ref=',
  ],
  'demo' => [
    'token'    => 'https://demo-accounts.vivapayments.com/connect/token',
    'api'      => 'https://demo-api.vivapayments.com',
    'checkout' => 'https://demo.vivapayments.com/web/checkout?ref=',
  ],
];

function viva_hosts(array $cfg): array {
  $demo = !empty($cfg['VIVA_DEMO']) && $cfg['VIVA_DEMO'] !== 'false';
  return VIVA_HOSTS[$demo ? 'demo' : 'live'];
}

/* Един HTTP разговор. Връща [http код, тяло, грешка от curl]. */
function viva_http(string $url, array $opt): array {
  $ch = curl_init($url);
  curl_setopt_array($ch, $opt + [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 20,
    CURLOPT_CONNECTTIMEOUT => 10,
    /* Проверката на сертификата НЕ се изключва. Това е пътят на парите. */
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_SSL_VERIFYHOST => 2,
  ]);
  $body = curl_exec($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
  $err  = curl_error($ch);
  curl_close($ch);
  return [$code, is_string($body) ? $body : '', $err];
}

/* Достъпът е с токен по OAuth2, който живее един час. Взима се наново за
   всяка поръчка - поръчките са редки, а кеширането на токен по файлове носи
   повече рискове (стар токен, състезание при запис), отколкото полза. */
function viva_token(array $cfg): ?string {
  $id     = (string)($cfg['VIVA_CLIENT_ID'] ?? '');
  $secret = (string)($cfg['VIVA_CLIENT_SECRET'] ?? '');
  if ($id === '' || $secret === '') { error_log('viva: липсват client id/secret'); return null; }

  $h = viva_hosts($cfg);
  [$code, $body, $err] = viva_http($h['token'], [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => 'grant_type=client_credentials',
    CURLOPT_HTTPHEADER => [
      'Content-Type: application/x-www-form-urlencoded',
      'Authorization: Basic ' . base64_encode($id . ':' . $secret),
    ],
  ]);
  if ($code !== 200) {
    error_log("viva: токенът отказан ($code) " . ($err ?: mb_substr($body, 0, 200)));
    return null;
  }
  $j = json_decode($body, true);
  return is_array($j) && !empty($j['access_token']) ? (string)$j['access_token'] : null;
}

/* Създава поръчка за плащане и връща кода ѝ като НИЗ.
   Кодът е 16 цифри и надхвърля точността на числата в JavaScript
   (9 007 199 254 740 991) - подаден като число, последните му цифри се
   губят и Viva отговаря "OrderCode not found". Затова никъде не става int. */
function viva_create_order(array $cfg, array $order, string $lang): ?string {
  $token = viva_token($cfg);
  if ($token === null) return null;

  $h = viva_hosts($cfg);
  $total = (float)$order['totals']['total'];
  /* Сумата се праща в центове, цяло число. round() преди cast: (int)(33.80*100)
     дава 3379 при двоично закръгляне надолу. */
  $amount = (int)round($total * 100);
  if ($amount < 30) { error_log('viva: сума под минимума'); return null; }

  $names = ['bg' => 'bg-BG', 'en' => 'en-US', 'ru' => 'ru-RU'];

  $payload = [
    'amount' => $amount,
    'customerTrns' => 'Asian Secret - поръчка ' . $order['number'],
    'customer' => [
      'email' => $order['customer']['email'],
      'fullName' => $order['customer']['name'],
      'phone' => $order['customer']['phone'],
      'countryCode' => 'BG',
      'requestLang' => $names[$lang] ?? 'bg-BG',
    ],
    /* Нашият номер пътува до Viva, за да се сверяват двата списъка после. */
    'merchantTrns' => $order['number'],
    'sourceCode' => (string)($cfg['VIVA_SOURCE_CODE'] ?? ''),
    /* Толкова има клиентът да плати, преди поръчката да изтече. */
    'paymentTimeout' => 1800,
    'disableCash' => true,
    'disableWallet' => false,
  ];

  [$code, $body, $err] = viva_http($h['api'] . '/checkout/v2/orders', [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
    CURLOPT_HTTPHEADER => [
      'Content-Type: application/json',
      'Authorization: Bearer ' . $token,
    ],
  ]);
  if ($code < 200 || $code >= 300) {
    error_log("viva: поръчката отказана ($code) " . ($err ?: mb_substr($body, 0, 300)));
    return null;
  }
  $j = json_decode($body, true);
  /* Отговорът идва ту като orderCode, ту като OrderCode - и двете се приемат. */
  $oc = $j['orderCode'] ?? $j['OrderCode'] ?? null;
  if ($oc === null) { error_log('viva: липсва orderCode в отговора'); return null; }
  /* Форматира се без експонента и без разделители - 16 цифри, нищо друго. */
  return is_string($oc) ? $oc : number_format((float)$oc, 0, '.', '');
}

/* Адресът, на който се праща клиентът. */
function viva_checkout_url(array $cfg, string $orderCode): string {
  return viva_hosts($cfg)['checkout'] . rawurlencode($orderCode);
}

/* Проверява сделката при самата Viva. Документацията е изрична: на данните
   от webhook-а не се вярва на сляпо - те се потвърждават с това извикване. */
function viva_retrieve_transaction(array $cfg, string $transactionId): ?array {
  $token = viva_token($cfg);
  if ($token === null) return null;
  $h = viva_hosts($cfg);
  [$code, $body] = viva_http(
    $h['api'] . '/checkout/v2/transactions/' . rawurlencode($transactionId),
    [CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token]]
  );
  if ($code !== 200) { error_log("viva: справката за сделка се провали ($code)"); return null; }
  $j = json_decode($body, true);
  return is_array($j) ? $j : null;
}

/* Адресите, от които Viva праща известия (бойни сметки; демо са различни).
   Списъкът е от документацията и е втора преграда след проверката на самата
   сделка при Viva - не единствената. */
const VIVA_IPS = [
  '51.138.37.238/32', '40.127.253.112/28', '51.105.129.192/28',
  '20.54.89.16/32', '4.223.76.50/32', '51.12.157.0/28',
  /* демо */
  '20.50.240.57/32', '40.74.20.78/32', '195.167.87.181/32',
  '195.167.87.180/32', '20.13.195.185/32', '135.225.16.50/32',
];

function as_ip_allowed(string $ip, array $cidrs): bool {
  $n = ip2long($ip);
  if ($n === false) return false;
  foreach ($cidrs as $c) {
    [$net, $bits] = explode('/', $c);
    $netN = ip2long($net);
    if ($netN === false) continue;
    $mask = $bits == 0 ? 0 : (-1 << (32 - (int)$bits));
    if (($n & $mask) === ($netN & $mask)) return true;
  }
  return false;
}
