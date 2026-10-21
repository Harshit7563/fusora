<?php
/** POST /api/razorpay/verify-payment.php { razorpay_payment_id, razorpay_order_id, razorpay_signature } */
declare(strict_types=1);
require __DIR__ . '/_lib.php';
fusora_rzp_cors();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    fusora_rzp_json(405, ['ok' => false, 'message' => 'POST only']);
}

[, $keySecret] = fusora_rzp_keys();

$body = fusora_rzp_read_json();
$paymentId = trim((string) ($body['razorpay_payment_id'] ?? ''));
$orderId = trim((string) ($body['razorpay_order_id'] ?? ''));
$signature = trim((string) ($body['razorpay_signature'] ?? ''));

if ($paymentId === '' || $orderId === '' || $signature === '') {
    fusora_rzp_json(400, [
        'ok' => false,
        'message' => 'razorpay_payment_id, razorpay_order_id and razorpay_signature are required',
    ]);
}

$expected = hash_hmac('sha256', $orderId . '|' . $paymentId, $keySecret);

if (!hash_equals($expected, $signature)) {
    fusora_rzp_json(400, [
        'ok' => false,
        'verified' => false,
        'message' => 'Payment signature verification failed',
    ]);
}

fusora_rzp_json(200, [
    'ok' => true,
    'verified' => true,
    'message' => 'Payment verified',
    'razorpay_payment_id' => $paymentId,
    'razorpay_order_id' => $orderId,
]);
