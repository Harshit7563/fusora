<?php
/**
 * Fusora Zone Digital OTP helpers (Hostinger PHP)
 */

declare(strict_types=1);

const OTP_TTL_SECONDS = 300;

function fusora_otp_config(): array
{
    static $cfg = null;
    if ($cfg !== null) {
        return $cfg;
    }
    $path = __DIR__ . '/config.php';
    if (!is_file($path)) {
        http_response_code(500);
        header('Content-Type: application/json');
        echo json_encode([
            'ok' => false,
            'message' => 'OTP config missing. Copy config.example.php to config.php',
        ]);
        exit;
    }
    /** @var array $cfg */
    $cfg = require $path;
    return $cfg;
}

function fusora_json(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    echo json_encode($body);
    exit;
}

function fusora_read_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function fusora_normalize_phone(string $raw): ?string
{
    $digits = preg_replace('/\D+/', '', $raw) ?? '';
    $phone = strlen($digits) > 10 ? substr($digits, -10) : $digits;
    if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
        return null;
    }
    return $phone;
}

function fusora_hash_otp(string $otp, string $phone): string
{
    return hash('sha256', $phone . ':' . $otp);
}

function fusora_session_dir(): string
{
    $dir = __DIR__ . '/sessions';
    if (!is_dir($dir)) {
        mkdir($dir, 0700, true);
    }
    return $dir;
}

function fusora_session_path(string $sessionId): string
{
    $safe = preg_replace('/[^a-zA-Z0-9\-]/', '', $sessionId) ?? '';
    return fusora_session_dir() . '/' . $safe . '.json';
}

function fusora_save_session(string $sessionId, array $session): void
{
    file_put_contents(
        fusora_session_path($sessionId),
        json_encode($session),
        LOCK_EX,
    );
}

function fusora_load_session(string $sessionId): ?array
{
    $path = fusora_session_path($sessionId);
    if (!is_file($path)) {
        return null;
    }
    $data = json_decode((string) file_get_contents($path), true);
    return is_array($data) ? $data : null;
}

function fusora_delete_session(string $sessionId): void
{
    $path = fusora_session_path($sessionId);
    if (is_file($path)) {
        unlink($path);
    }
}

function fusora_send_zone_otp(string $apiUrl, string $apiKey, string $phone, string $otp): array
{
    $qs = http_build_query([
        'number' => $phone,
        'otp' => $otp,
        'api_key' => $apiKey,
    ]);
    $url = rtrim($apiUrl, '?&') . (str_contains($apiUrl, '?') ? '&' : '?') . $qs;

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 20,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
    ]);
    $text = curl_exec($ch);
    $err = curl_error($ch);
    curl_close($ch);

    if ($text === false) {
        return ['success' => false, 'message' => $err ?: 'SMS request failed'];
    }

    $decoded = json_decode($text, true);
    $status = is_array($decoded) ? ($decoded['status'] ?? null) : null;
    $success =
        $status === true ||
        $status === 1 ||
        $status === '1' ||
        $status === 'success' ||
        (is_string($status) && strtolower($status) === 'true');

    return [
        'success' => (bool) $success,
        'message' =>
            (is_array($decoded) ? ($decoded['message'] ?? null) : null) ?:
            ($success ? 'OTP sent via Zone Digital' : 'Zone Digital SMS failed'),
    ];
}
