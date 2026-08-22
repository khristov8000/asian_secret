<?php
// Временна проверка дали хостингът изпълнява PHP. Трие се веднага след това.
header('Content-Type: text/plain; charset=utf-8');
echo "PHP-OK\n";
echo "version=" . PHP_VERSION . "\n";
echo "curl=" . (function_exists('curl_init') ? 'yes' : 'no') . "\n";
echo "openssl=" . (extension_loaded('openssl') ? 'yes' : 'no') . "\n";
echo "mail=" . (function_exists('mail') ? 'yes' : 'no') . "\n";
echo "allow_url_fopen=" . (ini_get('allow_url_fopen') ? 'yes' : 'no') . "\n";
