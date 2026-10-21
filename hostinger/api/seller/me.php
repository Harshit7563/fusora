<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
fusora_seller_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    fusora_seller_json(405, ['ok' => false, 'message' => 'GET only']);
}

$seller = fusora_seller_auth();
if ($seller === null) {
    fusora_seller_json(401, ['ok' => false, 'message' => 'Login required']);
}

fusora_seller_json(200, [
    'ok' => true,
    'seller' => fusora_seller_public($seller),
]);
