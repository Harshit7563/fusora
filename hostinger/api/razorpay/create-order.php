<?php
/** POST /api/razorpay/create-order.php  { amount, currency?, receipt? } */
declare(strict_types=1);
require __DIR__ . '/_lib.php';
fusora_rzp_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fusora_rzp_json(405, ['ok' => false, 'message' => 'POST only']);
}

[$keyId, $keySecret] = fusora_rzp_keys();

$body = fusora_rzp_read_json();
$amount = (int) round((float) ($body['amount'] ?? 0));
$currency = strtoupper(trim((string) ($body['currency'] ?? 'INR')));
$receipt = trim((string) ($body['receipt'] ?? ('fus_' . time())));

if ($amount < 100) {
    fusora_rzp_json(400, [
        'ok' => false,
        'message' => 'Minimum amount is 100 paise (₹1)',
    ]);
}
if ($currency !== 'INR') {
    fusora_rzp_json(400, ['ok' => false, 'message' => 'Only INR is supported']);
}
$receipt = substr(preg_replace('/[^a-zA-Z0-9_\-]/', '_', $receipt) ?? 'fus', 0, 40);

$payload = json_encode([
    'amount' => $amount,
    'currency' => $currency,
    'receipt' => $receipt,
    'payment_capture' => 1,
]);

$ch = curl_init('https://api.razorpay.com/v1/orders');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
    CURLOPT_USERPWD => $keyId . ':' . $keySecret,
    CURLOPT_TIMEOUT => 20,
]);
$response = curl_exec($ch);
$httpCode = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$curlErr = curl_error($ch);
curl_close($ch);

if ($response === false) {
    fusora_rzp_json(500, [
        'ok' => false,
        'message' => 'Razorpay request failed: ' . $curlErr,
    ]);
}

$data = json_decode((string) $response, true);
if ($httpCode === 401) {
    fusora_rzp_json(401, [
        'ok' => false,
        'message' => 'Razorpay authentication failed. Check Key ID / Secret.',
    ]);
}
if ($httpCode < 200 || $httpCode >= 300 || !is_array($data) || empty($data['id'])) {
    $desc = is_array($data)
        ? (string) ($data['error']['description'] ?? 'Razorpay order creation failed')
        : 'Razorpay order creation failed';
    fusora_rzp_json(500, ['ok' => false, 'message' => $desc]);
}

fusora_rzp_json(200, [
    'ok' => true,
    'order_id' => $data['id'],
    'amount' => $data['amount'],
    'currency' => $data['currency'],
    'key_id' => $keyId,
]);
