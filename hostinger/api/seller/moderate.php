<?php
/** POST /api/seller/moderate.php — admin only. { id, action: approve|reject } */
declare(strict_types=1);
require __DIR__ . '/_lib.php';
require __DIR__ . '/../admin/_lib.php';
fusora_seller_cors();
fusora_admin_require_token();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fusora_seller_json(405, ['ok' => false, 'message' => 'POST only']);
}

$body = fusora_seller_read_json();
$id = trim((string) ($body['id'] ?? ''));
$action = trim((string) ($body['action'] ?? ''));
if ($id === '' || !in_array($action, ['approve', 'reject'], true)) {
    fusora_seller_json(400, ['ok' => false, 'message' => 'id and action (approve|reject) required']);
}

$products = fusora_seller_read_store('products.json');
foreach ($products as $i => $p) {
    if (is_array($p) && ($p['id'] ?? '') === $id) {
        $products[$i]['status'] = $action === 'approve' ? 'approved' : 'rejected';
        fusora_seller_write_store('products.json', array_values($products));
        fusora_seller_json(200, ['ok' => true, 'product' => $products[$i]]);
    }
}
fusora_seller_json(404, ['ok' => false, 'message' => 'Product not found']);
