<?php
/** POST /api/orders/create.php — save a customer order on the server. */
declare(strict_types=1);
require __DIR__ . '/_lib.php';
fusora_orders_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fusora_orders_json(405, ['ok' => false, 'message' => 'POST only']);
}

$body = fusora_orders_read_json();
$id = trim((string) ($body['id'] ?? ''));
$items = $body['items'] ?? null;
$total = (float) ($body['total'] ?? 0);
$name = trim((string) ($body['name'] ?? ''));
$phone = preg_replace('/\D/', '', (string) ($body['phone'] ?? ''));
$email = strtolower(trim((string) ($body['email'] ?? '')));

if ($id === '' || !is_array($items) || count($items) === 0 || $total <= 0 || $name === '' || strlen($phone) < 10) {
    fusora_orders_json(400, [
        'ok' => false,
        'message' => 'id, items, total, name and a valid phone are required',
    ]);
}

$cleanItems = [];
foreach ($items as $it) {
    if (!is_array($it)) continue;
    $cleanItems[] = [
        'id' => (string) ($it['id'] ?? ''),
        'name' => (string) ($it['name'] ?? ''),
        'image' => (string) ($it['image'] ?? ''),
        'price' => (float) ($it['price'] ?? 0),
        'qty' => max(1, (int) ($it['qty'] ?? 1)),
        'selectedSize' => isset($it['selectedSize']) ? (string) $it['selectedSize'] : null,
        'sellerId' => isset($it['sellerId']) ? (string) $it['sellerId'] : null,
    ];
}

$order = [
    'id' => substr(preg_replace('/[^A-Za-z0-9_-]/', '', $id), 0, 40),
    'createdAt' => isset($body['createdAt']) ? (int) $body['createdAt'] : time() * 1000,
    'status' => 'placed',
    'payment' => in_array($body['payment'] ?? '', ['cod', 'upi', 'card', 'netbanking'], true) ? $body['payment'] : 'cod',
    'paymentId' => isset($body['paymentId']) ? (string) $body['paymentId'] : null,
    'total' => $total,
    'name' => $name,
    'phone' => substr($phone, -10),
    'email' => $email,
    'address' => trim((string) ($body['address'] ?? '')),
    'hub' => trim((string) ($body['hub'] ?? 'Fusora hub')),
    'items' => $cleanItems,
];

$orders = fusora_orders_load();
foreach ($orders as $i => $existing) {
    if (($existing['id'] ?? '') === $order['id']) {
        $orders[$i] = $order;
        fusora_orders_save($orders);
        fusora_orders_json(200, ['ok' => true, 'order' => $order, 'updated' => true]);
    }
}
array_unshift($orders, $order);
fusora_orders_save($orders);

fusora_orders_json(200, ['ok' => true, 'order' => $order]);
