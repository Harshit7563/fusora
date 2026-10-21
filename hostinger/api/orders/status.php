<?php
/** POST /api/orders/status.php — admin only. { id, status } */
declare(strict_types=1);
require __DIR__ . '/_lib.php';
require __DIR__ . '/../admin/_lib.php';
fusora_orders_cors();
fusora_admin_require_token();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fusora_orders_json(405, ['ok' => false, 'message' => 'POST only']);
}

$body = fusora_orders_read_json();
$id = trim((string) ($body['id'] ?? ''));
$status = trim((string) ($body['status'] ?? ''));
$allowed = ['placed', 'confirmed', 'packing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];

if ($id === '' || !in_array($status, $allowed, true)) {
    fusora_orders_json(400, ['ok' => false, 'message' => 'Valid id and status are required']);
}

$orders = fusora_orders_load();
foreach ($orders as $i => $o) {
    if (($o['id'] ?? '') === $id) {
        $orders[$i]['status'] = $status;
        fusora_orders_save($orders);
        fusora_orders_json(200, ['ok' => true, 'order' => $orders[$i]]);
    }
}
fusora_orders_json(404, ['ok' => false, 'message' => 'Order not found']);
