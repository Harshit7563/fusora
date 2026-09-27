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

$cfg = fusora_otp_config();
$apiKey = (string) ($cfg['SMS_API_KEY'] ?? '');
$apiUrl = (string) ($cfg['SMS_API_URL'] ?? 'https://authsecure.anilaxpayments.com/api/Sms_api/send');

if ($apiKey === '' || $apiKey === 'your_api_key_here') {
    fusora_json(500, [
        'ok' => false,
        'message' => 'SMS_API_KEY missing in api/otp/config.php',
    ]);
}

$body = fusora_read_json();
$phone = fusora_normalize_phone((string) ($body['phone'] ?? ''));
if (!$phone) {
    fusora_json(400, [
        'ok' => false,
        'message' => 'Enter a valid 10-digit Indian mobile number',
    ]);
}

$otp = (string) random_int(1111, 9999);
$sms = fusora_send_zone_otp($apiUrl, $apiKey, $phone, $otp);
if (!$sms['success']) {
    fusora_json(502, [
        'ok' => false,
        'message' => $sms['message'] ?? 'Zone Digital SMS gateway failed',
    ]);
}

$sessionId = bin2hex(random_bytes(16));
fusora_save_session($sessionId, [
    'phone' => $phone,
    'otpHash' => fusora_hash_otp($otp, $phone),
    'expiresAt' => time() + OTP_TTL_SECONDS,
    'verified' => false,
]);

fusora_json(200, [
    'ok' => true,
    'sessionId' => $sessionId,
    'message' => 'OTP sent to ******' . substr($phone, -4) . ' via Zone Digital',
    'masked' => '******' . substr($phone, -4),
    'provider' => 'zone-digital',
]);
