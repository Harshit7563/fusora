<?php
/** GET /api/orders/list.php?email=&phone= — a customer's own orders. */
declare(strict_types=1);
require __DIR__ . '/_lib.php';
fusora_orders_cors();

$email = strtolower(trim((string) ($_GET['email'] ?? '')));
$phone = preg_replace('/\D/', '', (string) ($_GET['phone'] ?? ''));
$phone = strlen($phone) > 10 ? substr($phone, -10) : $phone;

if ($email === '' && strlen($phone) < 10) {
    fusora_orders_json(400, ['ok' => false, 'message' => 'email or phone is required']);
}

$mine = array_values(array_filter(fusora_orders_load(), function ($o) use ($email, $phone) {
    if ($email !== '' && strtolower((string) ($o['email'] ?? '')) === $email) return true;
    if (strlen($phone) >= 10 && (string) ($o['phone'] ?? '') === $phone) return true;
    return false;
}));

fusora_orders_json(200, ['ok' => true, 'orders' => $mine]);
