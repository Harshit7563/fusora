<?php
/**
 * Fusora Razorpay helpers (Hostinger PHP)
 * KEY_SECRET stays server-side only — never sent to the browser.
 */

declare(strict_types=1);

function fusora_rzp_config(): array
{
    static $cfg = null;
    if ($cfg !== null) {
        return $cfg;
    }
    $path = __DIR__ . '/config.php';
    if (!is_file($path)) {
        fusora_rzp_json(500, [
            'ok' => false,
            'message' => 'Razorpay config missing. Copy config.example.php to config.php',
        ]);
    }
    /** @var array $cfg */
    $cfg = require $path;
    return $cfg;
}

function fusora_rzp_json(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    echo json_encode($body);
    exit;
}

function fusora_rzp_cors(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        fusora_rzp_json(204, []);
    }
}

function fusora_rzp_read_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function fusora_rzp_keys(): array
{
    $cfg = fusora_rzp_config();
    $keyId = trim((string) ($cfg['RAZORPAY_KEY_ID'] ?? ''));
    $keySecret = trim((string) ($cfg['RAZORPAY_KEY_SECRET'] ?? ''));
    if ($keyId === '' || $keySecret === '') {
        fusora_rzp_json(500, [
            'ok' => false,
            'message' => 'Razorpay keys not configured on server',
        ]);
    }
    return [$keyId, $keySecret];
}
