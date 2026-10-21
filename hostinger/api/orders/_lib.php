<?php
/** Fusora Orders store — JSON file on server, never web-accessible. */
declare(strict_types=1);

function fusora_orders_file(): string
{
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) mkdir($dir, 0775, true);
    return $dir . '/orders.json';
}

function fusora_orders_json(int $status, array $body): void
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

function fusora_orders_cors(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        fusora_orders_json(204, []);
    }
}

function fusora_orders_read_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function fusora_orders_load(): array
{
    $file = fusora_orders_file();
    if (!is_file($file)) return [];
    $raw = file_get_contents($file);
    $data = json_decode((string) $raw, true);
    return is_array($data) ? $data : [];
}

function fusora_orders_save(array $orders): void
{
    $file = fusora_orders_file();
    $tmp = $file . '.tmp';
    file_put_contents($tmp, json_encode(array_values($orders)), LOCK_EX);
    rename($tmp, $file);
}
