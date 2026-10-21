<?php
/** Fusora Admin auth helpers — password & tokens stay server-side only. */
declare(strict_types=1);

function fusora_admin_config(): array
{
    static $cfg = null;
    if ($cfg !== null) return $cfg;
    $path = __DIR__ . '/config.php';
    if (!is_file($path)) {
        fusora_admin_json(500, ['ok' => false, 'message' => 'Admin config missing on server']);
    }
    $cfg = require $path;
    return $cfg;
}

function fusora_admin_json(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type, X-Admin-Token');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    echo json_encode($body);
    exit;
}

function fusora_admin_cors(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        fusora_admin_json(204, []);
    }
}

function fusora_admin_read_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function fusora_admin_issue_token(): string
{
    $cfg = fusora_admin_config();
    $exp = time() + 12 * 3600;
    $sig = hash_hmac('sha256', (string) $exp, (string) ($cfg['ADMIN_SALT'] ?? ''));
    return $exp . '.' . $sig;
}

function fusora_admin_require_token(): void
{
    $cfg = fusora_admin_config();
    $token = trim((string) ($_SERVER['HTTP_X_ADMIN_TOKEN'] ?? ''));
    if ($token === '' || !str_contains($token, '.')) {
        fusora_admin_json(401, ['ok' => false, 'message' => 'Admin login required']);
    }
    [$exp, $sig] = explode('.', $token, 2);
    if (!ctype_digit($exp) || (int) $exp < time()) {
        fusora_admin_json(401, ['ok' => false, 'message' => 'Admin session expired. Login again.']);
    }
    $expected = hash_hmac('sha256', $exp, (string) ($cfg['ADMIN_SALT'] ?? ''));
    if (!hash_equals($expected, $sig)) {
        fusora_admin_json(401, ['ok' => false, 'message' => 'Invalid admin token']);
    }
}
