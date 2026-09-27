<?php
declare(strict_types=1);

require __DIR__ . '/_lib.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    fusora_json(405, ['ok' => false, 'message' => 'Method not allowed']);
}

$body = fusora_read_json();
$sessionId = (string) ($body['sessionId'] ?? '');
$otp = trim((string) ($body['otp'] ?? ''));
$phone = fusora_normalize_phone((string) ($body['phone'] ?? ''));
$session = fusora_load_session($sessionId);

if (!$session || !$phone || ($session['phone'] ?? '') !== $phone) {
    fusora_json(400, ['ok' => false, 'message' => 'Invalid OTP session']);
}

if (time() > (int) ($session['expiresAt'] ?? 0)) {
    fusora_delete_session($sessionId);
    fusora_json(400, ['ok' => false, 'message' => 'OTP expired. Please resend.']);
}

if (($session['otpHash'] ?? '') !== fusora_hash_otp($otp, $phone)) {
    fusora_json(400, ['ok' => false, 'message' => 'Incorrect OTP']);
}

$session['verified'] = true;
fusora_save_session($sessionId, $session);

fusora_json(200, [
    'ok' => true,
    'message' => 'Mobile number verified',
    'verified' => true,
    'provider' => 'zone-digital',
]);
