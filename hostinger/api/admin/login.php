<?php
/** POST /api/admin/login.php { password } -> { token } (password never ships to browser code) */
declare(strict_types=1);
require __DIR__ . '/_lib.php';
fusora_admin_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fusora_admin_json(405, ['ok' => false, 'message' => 'POST only']);
}

$cfg = fusora_admin_config();
$body = fusora_admin_read_json();
$password = (string) ($body['password'] ?? '');

$salt = (string) ($cfg['ADMIN_SALT'] ?? '');
$stored = (string) ($cfg['ADMIN_PASSWORD_HASH'] ?? '');
$candidate = hash('sha256', $salt . $password);

if ($stored === '' || !hash_equals($stored, $candidate)) {
    fusora_admin_json(401, ['ok' => false, 'message' => 'Wrong password']);
}

fusora_admin_json(200, [
    'ok' => true,
    'token' => fusora_admin_issue_token(),
    'message' => 'Logged in',
]);
