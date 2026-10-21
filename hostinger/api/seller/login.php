<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
fusora_seller_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fusora_seller_json(405, ['ok' => false, 'message' => 'POST only']);
}

$body = fusora_seller_read_json();
$login = strtolower(trim((string) ($body['email'] ?? $body['login'] ?? '')));
$password = (string) ($body['password'] ?? '');

if ($login === '' || $password === '') {
    fusora_seller_json(400, ['ok' => false, 'message' => 'Email and password required']);
}

$sellers = fusora_seller_read_store('sellers.json');
$foundIndex = -1;
$found = null;
foreach ($sellers as $i => $s) {
    if (!is_array($s)) {
        continue;
    }
    $email = strtolower((string) ($s['email'] ?? ''));
    $phone = (string) ($s['phone'] ?? '');
    if ($email === $login || $phone === $login || $phone === preg_replace('/\D+/', '', $login)) {
        $found = $s;
        $foundIndex = (int) $i;
        break;
    }
}

if ($found === null || !password_verify($password, (string) ($found['passwordHash'] ?? ''))) {
    fusora_seller_json(401, ['ok' => false, 'message' => 'Invalid email or password']);
}

$token = fusora_seller_token();
$sellers[$foundIndex]['token'] = $token;
fusora_seller_write_store('sellers.json', $sellers);
$found['token'] = $token;

fusora_seller_json(200, [
    'ok' => true,
    'message' => 'Logged in',
    'token' => $token,
    'seller' => fusora_seller_public($found),
]);
