<?php
/* Образец. Копира се като api/config.local.php ПРЯКО НА ХОСТИНГА
   (hPanel -> File Manager), НЕ се качва в Git - ключовете са тайни.
   .gitignore вече пази config.local.php.

   Хранилището е публично. Всичко тайно живее само в този файл на сървъра. */
return [
  /* ── поща ──────────────────────────────────────────────────────────────── */
  'RESEND_API_KEY' => 're_xxxxxxxxxxxxxxxxxxxxxxxx',
  'ORDER_TO'       => 'kaloian8000@gmail.com',
  'ORDER_FROM'     => 'Asian Secret <orders@asiansecret.bg>',

  /* ── плащане с карта през Viva ──────────────────────────────────────────
     Settings -> API Access -> Smart Checkout Credentials.
     ВНИМАНИЕ: това НЕ са "Merchant ID и API Key" от същата страница - те са
     за друг вид удостоверяване и тук не вършат работа. */
  'VIVA_CLIENT_ID'     => 'xxxxxxxxxxxxx.apps.vivapayments.com',
  'VIVA_CLIENT_SECRET' => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxx',

  /* Четирите цифри на платежния източник:
     Sales -> Online payments -> Websites/Apps */
  'VIVA_SOURCE_CODE'   => '1234',

  /* Ключът, с който Viva проверява, че адресът за известия е наш.
     Взима се ВЕДНЪЖ с това извикване (сложи своите Merchant ID и API Key):

       curl -u "MERCHANT_ID:API_KEY" \
         https://www.vivapayments.com/api/messages/config/token

     Отговорът е {"Key":"..."} - стойността се слага тук. Merchant ID и API
     Key НЕ се пазят никъде: нужни са само за това еднократно извикване. */
  'VIVA_WEBHOOK_KEY'   => 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',

  /* true само ако ключовете горе са от ДЕМО сметка. За бойна сметка се маха
     или се оставя false. Определя към кои адреси на Viva се говори. */
  'VIVA_DEMO'          => false,
];
