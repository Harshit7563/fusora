<?php
/** GET /api/razorpay/qr-status.php?qr_id=qr_xxx -> { paid, payment_id, ... } */
declare(strict_types=1);
require __DIR__ . '/_lib.php';
fusora_rzp_cors();

if (!in_array($_SERVER['REQUEST_METHOD'] ?? '', ['GET', 'POST'], true)) {
    fusora_rzp_json(405, ['ok' => false, 'message' => 'GET only']);
}

[$keyId, $keySecret] = fusora_rzp_keys();

$qrId = trim((string) ($_GET['qr_id'] ?? ''));
if ($qrId === '') {
    $body = fusora_rzp_read_json();
    $qrId = trim((string) ($body['qr_id'] ?? ''));
}
if (!preg_match('/^qr_[A-Za-z0-9]+$/', $qrId)) {
    fusora_rzp_json(400, ['ok' => false, 'message' => 'Valid qr_id is required']);
}

function fusora_rzp_get(string $url, string $keyId, string $keySecret): array
{
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_USERPWD => $keyId . ':' . $keySecret,
        CURLOPT_TIMEOUT => 20,
    ]);
    $response = curl_exec($ch);
    $httpCode = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    if ($response === false) {
        fusora_rzp_json(500, ['ok' => false, 'message' => 'Razorpay request failed']);
    }
    $data = json_decode((string) $response, true);
    if ($httpCode === 401) {
        fusora_rzp_json(401, [
            'ok' => false,
            'message' => 'Razorpay authentication failed.',
        ]);
    }
    if ($httpCode < 200 || $httpCode >= 300 || !is_array($data)) {
        fusora_rzp_json(500, [
            'ok' => false,
            'message' => 'Razorpay QR status failed',
        ]);
    }
    return $data;
}

$payments = fusora_rzp_get(
    'https://api.razorpay.com/v1/payments/qr_codes/' . urlencode($qrId) . '/payments',
    $keyId,
    $keySecret,
);

$paid = false;
$paymentId = null;
foreach (($payments['items'] ?? []) as $p) {
    if (($p['status'] ?? '') === 'captured') {
        $paid = true;
        $paymentId = $p['id'] ?? null;
        break;
    }
}

$qr = fusora_rzp_get(
    'https://api.razorpay.com/v1/payments/qr_codes/' . urlencode($qrId),
    $keyId,
    $keySecret,
);

fusora_rzp_json(200, [
    'ok' => true,
    'qr_id' => $qrId,
    'paid' => $paid,
    'payment_id' => $paymentId,
    'status' => $qr['status'] ?? null,
    'payments_count' => count($payments['items'] ?? []),
    'amount_paid' => $qr['payments_amount_received'] ?? 0,
]);
