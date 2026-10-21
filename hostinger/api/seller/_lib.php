<?php
/**
 * Fusora seller marketplace helpers (Hostinger PHP)
 */

declare(strict_types=1);

function fusora_seller_json(int $status, array $body): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Seller-Token');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    echo json_encode($body);
    exit;
}

function fusora_seller_cors(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        fusora_seller_json(204, []);
    }
}

function fusora_seller_read_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function fusora_seller_data_dir(): string
{
    $dir = __DIR__ . '/data';
    if (!is_dir($dir)) {
        mkdir($dir, 0750, true);
    }
    return $dir;
}

function fusora_seller_uploads_dir(): string
{
    $dir = __DIR__ . '/uploads';
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    return $dir;
}

function fusora_seller_read_store(string $file): array
{
    $path = fusora_seller_data_dir() . '/' . $file;
    if (!is_file($path)) {
        return [];
    }
    $raw = file_get_contents($path);
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function fusora_seller_write_store(string $file, array $data): void
{
    $path = fusora_seller_data_dir() . '/' . $file;
    $tmp = $path . '.tmp';
    $json = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        fusora_seller_json(500, ['ok' => false, 'message' => 'Could not encode data']);
    }
    if (file_put_contents($tmp, $json, LOCK_EX) === false) {
        fusora_seller_json(500, ['ok' => false, 'message' => 'Could not save data']);
    }
    rename($tmp, $path);
}

function fusora_seller_slug(string $text): string
{
    $s = strtolower(trim($text));
    $s = preg_replace('/[^a-z0-9]+/', '-', $s) ?? '';
    $s = trim($s, '-');
    return $s !== '' ? substr($s, 0, 40) : 'shop';
}

function fusora_seller_token(): string
{
    return bin2hex(random_bytes(24));
}

function fusora_seller_auth(): ?array
{
    $token = '';
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['HTTP_X_SELLER_TOKEN'] ?? '';
    if (preg_match('/Bearer\s+(\S+)/i', $hdr, $m)) {
        $token = $m[1];
    } elseif ($hdr !== '') {
        $token = trim($hdr);
    }
    if ($token === '') {
        return null;
    }
    $sellers = fusora_seller_read_store('sellers.json');
    foreach ($sellers as $seller) {
        if (!is_array($seller)) {
            continue;
        }
        if (($seller['token'] ?? '') === $token) {
            return $seller;
        }
    }
    return null;
}

function fusora_seller_public(array $seller): array
{
    return [
        'id' => $seller['id'] ?? '',
        'shopName' => $seller['shopName'] ?? '',
        'ownerName' => $seller['ownerName'] ?? '',
        'email' => $seller['email'] ?? '',
        'phone' => $seller['phone'] ?? '',
        'payoutUpi' => $seller['payoutUpi'] ?? '',
        'createdAt' => $seller['createdAt'] ?? 0,
    ];
}

/** Persist data-URL image → /api/seller/uploads/*.jpg public path */
function fusora_seller_save_image(string $input, string $prefix): ?string
{
    $input = trim($input);
    if ($input === '') {
        return null;
    }
    if (str_starts_with($input, '/api/seller/uploads/')) {
        return $input;
    }
    if (preg_match('#^https?://#i', $input)) {
        return $input;
    }
    if (!preg_match('#^data:image/(jpeg|jpg|png|webp);base64,#i', $input)) {
        return null;
    }
    $comma = strpos($input, ',');
    if ($comma === false) {
        return null;
    }
    $bin = base64_decode(substr($input, $comma + 1), true);
    if ($bin === false || strlen($bin) < 32) {
        return null;
    }
    // Cap ~900KB binary
    if (strlen($bin) > 900_000) {
        fusora_seller_json(400, [
            'ok' => false,
            'message' => 'Image too large. Compress and try again.',
        ]);
    }
    $name = $prefix . '-' . bin2hex(random_bytes(5)) . '.jpg';
    $path = fusora_seller_uploads_dir() . '/' . $name;
    if (file_put_contents($path, $bin) === false) {
        return null;
    }
    return '/api/seller/uploads/' . $name;
}

function fusora_seller_sizes(?string $subtype): array
{
    return match ($subtype) {
        'jeans' => ['28', '30', '32', '34', '36', '38', '40', '42'],
        'sarees' => ['Free Size'],
        'tshirts', 'shirts' => ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
        default => ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
    };
}
