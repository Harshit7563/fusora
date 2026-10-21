<?php
/** POST /api/razorpay/create-qr.php  { amount, receipt? } -> Razorpay UPI QR (single use, fixed amount) */
declare(strict_types=1);
require __DIR__ . '/_lib.php';
fusora_rzp_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fusora_rzp_json(405, ['ok' => false, 'message' => 'POST only']);
}

[$keyId, $keySecret] = fusora_rzp_keys();

$body = fusora_rzp_read_json();
$amount = (int) round((float) ($body['amount'] ?? 0));
$receipt = trim((string) ($body['receipt'] ?? ('fus_' . time())));
$receipt = substr(preg_replace('/[^a-zA-Z0-9_\-]/', '_', $receipt) ?? 'fus', 0, 40);

if ($amount < 100) {
    fusora_rzp_json(400, [
        'ok' => false,
        'message' => 'Minimum amount is 100 paise (₹1)',
    ]);
}

$payload = json_encode([
    'type' => 'upi_qr',
    'name' => 'Fusora Order',
    'usage' => 'single_use',
    'fixed_amount' => true,
    'payment_amount' => $amount,
    'description' => 'Fusora order payment ' . $receipt,
    'notes' => ['receipt' => $receipt, 'source' => 'fusora-web'],
]);

$ch = curl_init('https://api.razorpay.com/v1/payments/qr_codes');
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
        'message' => 'Razorpay QR request failed: ' . $curlErr,
    ]);
}

$data = json_decode((string) $response, true);
if ($httpCode === 401) {
    fusora_rzp_json(401, [
        'ok' => false,
        'message' => 'Razorpay authentication failed. Check Key ID / Secret.',
    ]);
}
if ($httpCode < 200 || $httpCode >= 300 || !is_array($data) || empty($data['id']) || empty($data['image_url'])) {
    $desc = is_array($data)
        ? (string) ($data['error']['description'] ?? 'Razorpay QR creation failed')
        : 'Razorpay QR creation failed';
    fusora_rzp_json(500, ['ok' => false, 'message' => $desc]);
}

fusora_rzp_json(200, [
    'ok' => true,
    'qr_id' => $data['id'],
    'image_url' => $data['image_url'],
    'amount' => $amount,
    'currency' => 'INR',
    'status' => $data['status'] ?? 'active',
]);
