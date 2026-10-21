<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
fusora_seller_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fusora_seller_json(405, ['ok' => false, 'message' => 'POST only']);
}

$body = fusora_seller_read_json();
$shopName = trim((string) ($body['shopName'] ?? ''));
$ownerName = trim((string) ($body['ownerName'] ?? ''));
$email = strtolower(trim((string) ($body['email'] ?? '')));
$phone = preg_replace('/\D+/', '', (string) ($body['phone'] ?? '')) ?? '';
$password = (string) ($body['password'] ?? '');

if (strlen($phone) > 10) {
    $phone = substr($phone, -10);
}

if ($shopName === '' || strlen($shopName) < 2) {
    fusora_seller_json(400, ['ok' => false, 'message' => 'Shop name required']);
}
if ($ownerName === '') {
    fusora_seller_json(400, ['ok' => false, 'message' => 'Owner name required']);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    fusora_seller_json(400, ['ok' => false, 'message' => 'Valid email required']);
}
if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
    fusora_seller_json(400, ['ok' => false, 'message' => 'Valid 10-digit mobile required']);
}
if (strlen($password) < 6) {
    fusora_seller_json(400, ['ok' => false, 'message' => 'Password must be at least 6 characters']);
}

$sellers = fusora_seller_read_store('sellers.json');
foreach ($sellers as $s) {
    if (!is_array($s)) {
        continue;
    }
    if (strtolower((string) ($s['email'] ?? '')) === $email) {
        fusora_seller_json(409, ['ok' => false, 'message' => 'Email already registered']);
    }
    if (($s['phone'] ?? '') === $phone) {
        fusora_seller_json(409, ['ok' => false, 'message' => 'Mobile already registered']);
    }
}

$payoutUpi = trim((string) ($body['payoutUpi'] ?? ''));
$id = 'sel-' . fusora_seller_slug($shopName) . '-' . substr(bin2hex(random_bytes(4)), 0, 8);
$token = fusora_seller_token();
$seller = [
    'id' => $id,
    'shopName' => $shopName,
    'ownerName' => $ownerName,
    'email' => $email,
    'phone' => $phone,
    'passwordHash' => password_hash($password, PASSWORD_DEFAULT),
    'token' => $token,
    'payoutUpi' => $payoutUpi,
    'createdAt' => time() * 1000,
];

$sellers[] = $seller;
fusora_seller_write_store('sellers.json', $sellers);

fusora_seller_json(201, [
    'ok' => true,
    'message' => 'Seller account created',
    'token' => $token,
    'seller' => fusora_seller_public($seller),
]);
