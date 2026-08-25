<?php
/* Известия от Viva за платена или провалена поръчка.

   GET  - връща проверочния ключ. Viva го иска веднъж, когато записваш адреса
          в банковото приложение, и не приема пренасочвания.
   POST - същинското известие. Оттук тръгват писмата: за карта те НЕ се пращат
          при подаване на формата, а чак когато парите наистина са минали.

   Отговаряме 2xx на всяко известие, което сме разбрали - включително на
   повторно за същата поръчка. Друг код кара Viva да опитва отново 24 пъти,
   веднъж на час. */

require __DIR__ . '/_shared.php';
require __DIR__ . '/_emails.php';
require __DIR__ . '/_viva.php';
require __DIR__ . '/_pending.php';

/* Успешно плащане и провалено плащане - другите видове не ни интересуват. */
const VIVA_EVENT_PAID   = 1796;
const VIVA_EVENT_FAILED = 1798;


$cfg = as_config();
$method = $_SERVER['REQUEST_METHOD'] ?? '';

/* ── проверката на адреса ─────────────────────────────────────────────────── */
if ($method === 'GET') {
  header('Content-Type: application/json; charset=utf-8');
  $key = (string)($cfg['VIVA_WEBHOOK_KEY'] ?? '');
  if ($key === '') {
    error_log('viva-webhook: VIVA_WEBHOOK_KEY не е настроен');
    http_response_code(503);
    echo json_encode(['error' => 'not configured']);
    exit;
  }
  /* Точно този вид отговор очаква Viva при натискане на "Verify". */
  echo json_encode(['Key' => $key]);
  exit;
}

if ($method !== 'POST') { http_response_code(405); exit; }

$ip = (string)($_SERVER['REMOTE_ADDR'] ?? '');
if (!as_ip_allowed($ip, VIVA_IPS)) {
  error_log('viva-webhook: отказан адрес ' . $ip);
  http_response_code(403);
  exit;
}

$raw = file_get_contents('php://input');
$body = json_decode((string)$raw, true);
if (!is_array($body)) { http_response_code(400); exit; }

$eventType = (int)($body['EventTypeId'] ?? 0);
$d = is_array($body['EventData'] ?? null) ? $body['EventData'] : [];
$orderCode = (string)($d['OrderCode'] ?? $d['orderCode'] ?? '');
$transactionId = (string)($d['TransactionId'] ?? $d['transactionId'] ?? '');

/* От тук нататък отговорът е 200 при всеки изход: известието е получено и
   разбрано, а повторни опити не биха променили нищо. */
header('Content-Type: application/json; charset=utf-8');
$done = function (string $what) { echo json_encode(['ok' => true, 'result' => $what]); exit; };

if ($orderCode === '') $done('без код на поръчка');

as_pending_sweep();

if ($eventType === VIVA_EVENT_FAILED) {
  /* Провалено плащане не изтрива чакащата поръчка: клиентът често опитва
     пак със същия код и второто плащане трябва да намери данните си. */
  error_log("viva-webhook: провалено плащане, поръчка $orderCode");
  $done('провалено плащане');
}

if ($eventType !== VIVA_EVENT_PAID) $done('вид известие без значение');

$pending = as_pending_load($orderCode);
if ($pending === null) {
  /* Или вече е обработена - Viva праща повторно при неин съмнение - или е
     чужда. И в двата случая 200: няма какво да се поправи с нов опит. */
  error_log("viva-webhook: няма чакаща поръчка за $orderCode (вероятно вече обработена)");
  $done('няма чакаща поръчка');
}

/* ── потвърждение при самата Viva ─────────────────────────────────────────── */
$order = $pending['order'];
$expected = (int)round((float)$order['totals']['total'] * 100);

if ($transactionId !== '') {
  $tx = viva_retrieve_transaction($cfg, $transactionId);
  if ($tx === null) {
    /* Не можем да потвърдим - НЕ пращаме писма и НЕ изтриваме поръчката.
       Тук връщаме 500 нарочно: това е единственият случай, в който нов опит
       от страна на Viva има смисъл. */
    error_log("viva-webhook: сделката $transactionId не можа да се провери");
    http_response_code(500);
    echo json_encode(['ok' => false, 'retry' => true]);
    exit;
  }
  $paid = (int)round(((float)($tx['amount'] ?? 0)) * 100);
  $status = (string)($tx['statusId'] ?? '');
  /* 'F' е окончателно платена сделка при Viva. */
  if ($status !== 'F') { error_log("viva-webhook: статус '$status' за $orderCode"); $done('още не е платена'); }
  if ($paid !== $expected) {
    /* Платено е друго - това не е поръчката, за която мислим. Писма не се
       пращат; случаят иска човек. */
    error_log("viva-webhook: сумата не съвпада за $orderCode: платено $paid, очаквано $expected");
    $done('сумата не съвпада');
  }
}

/* ── писмата ──────────────────────────────────────────────────────────────── */
if (empty($cfg['RESEND_API_KEY'])) {
  error_log('viva-webhook: RESEND_API_KEY липсва - поръчката остава да чака');
  http_response_code(500);
  echo json_encode(['ok' => false, 'retry' => true]);
  exit;
}

$order['payment'] = 'Карта (платена през Viva)';
$order['paidAt'] = (new DateTime('now', new DateTimeZone('Europe/Sofia')))->format('d.m.Y H:i');
$emailCfg = ['site' => AS_SITE, 'shop' => AS_SHOP];
$from = $cfg['ORDER_FROM'] ?? 'Asian Secret <orders@asiansecret.bg>';
$to   = $cfg['ORDER_TO'] ?? 'zax12@abv.bg';

$forOwner = as_owner_email($order, $emailCfg);
[$ok, $err] = as_send([
  'from' => $from, 'to' => [$to], 'reply_to' => $order['customer']['email'],
  'subject' => $forOwner['subject'], 'html' => $forOwner['html'], 'text' => $forOwner['text'],
], $cfg['RESEND_API_KEY']);

if (!$ok) {
  /* Парите са взети, а магазинът не знае за поръчката - това е точно
     случаят, в който искаме Viva да опита пак. */
  error_log('viva-webhook: писмото до магазина се провали - ' . $err);
  http_response_code(500);
  echo json_encode(['ok' => false, 'retry' => true]);
  exit;
}

/* Оттук нататък поръчката е при магазина. Изтрива се веднага, за да не се
   изпрати два пъти, ако Viva повтори известието. */
as_pending_delete($orderCode);

$forCustomer = as_customer_email($order, $emailCfg);
[$custOk, $custErr] = as_send([
  'from' => $from, 'to' => [$order['customer']['email']], 'reply_to' => AS_SHOP['replyTo'],
  'subject' => $forCustomer['subject'], 'html' => $forCustomer['html'], 'text' => $forCustomer['text'],
], $cfg['RESEND_API_KEY']);
if (!$custOk) error_log('viva-webhook: писмото до клиента се провали - ' . $custErr);

$done('поръчката е обработена');
