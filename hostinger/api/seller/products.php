<?php
declare(strict_types=1);
require __DIR__ . '/_lib.php';
fusora_seller_cors();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

/** Public catalog — only admin-approved seller products */
if ($method === 'GET') {
    $mine = isset($_GET['mine']) && $_GET['mine'] === '1';
    $adminScope = isset($_GET['scope']) && $_GET['scope'] === 'admin';
    $products = fusora_seller_read_store('products.json');
    if ($adminScope) {
        require __DIR__ . '/../admin/_lib.php';
        fusora_admin_require_token();
        fusora_seller_json(200, [
            'ok' => true,
            'products' => array_values($products),
        ]);
    }
    if ($mine) {
        $seller = fusora_seller_auth();
        if ($seller === null) {
            fusora_seller_json(401, ['ok' => false, 'message' => 'Login required']);
        }
        $sid = $seller['id'] ?? '';
        $products = array_values(array_filter(
            $products,
            static fn($p) => is_array($p) && ($p['sellerId'] ?? '') === $sid,
        ));
    } else {
        // Legacy products without a status are treated as approved
        $products = array_values(array_filter(
            $products,
            static fn($p) => is_array($p) && (($p['status'] ?? 'approved') === 'approved'),
        ));
    }
    fusora_seller_json(200, [
        'ok' => true,
        'products' => array_values($products),
    ]);
}

$seller = fusora_seller_auth();
if ($seller === null) {
    fusora_seller_json(401, ['ok' => false, 'message' => 'Login required']);
}

$sellerId = (string) ($seller['id'] ?? '');
$shopName = (string) ($seller['shopName'] ?? 'Seller');

if ($method === 'POST' || $method === 'PUT') {
    $body = fusora_seller_read_json();
    $existingId = trim((string) ($body['id'] ?? ''));
    $name = trim((string) ($body['name'] ?? ''));
    $price = (float) ($body['price'] ?? 0);
    $was = (float) ($body['was'] ?? $price);
    $gender = (string) ($body['gender'] ?? 'men');
    $subtype = (string) ($body['subtype'] ?? '');
    $description = trim((string) ($body['description'] ?? ''));
    $fabric = trim((string) ($body['fabric'] ?? ''));
    $fit = trim((string) ($body['fit'] ?? ''));
    $wash = trim((string) ($body['wash'] ?? ''));
    $topDeal = (bool) ($body['topDeal'] ?? false);
    $imagesIn = $body['images'] ?? [];
    if (!is_array($imagesIn)) {
        $imagesIn = [];
    }

    if ($name === '') {
        fusora_seller_json(400, ['ok' => false, 'message' => 'Product name required']);
    }
    if ($gender !== 'men' && $gender !== 'women') {
        fusora_seller_json(400, ['ok' => false, 'message' => 'Select Men or Women']);
    }
    $allowed = ['tshirts', 'shirts', 'sarees', 'jeans', 'dresses'];
    if (!in_array($subtype, $allowed, true)) {
        fusora_seller_json(400, ['ok' => false, 'message' => 'Select a product type']);
    }
    if ($gender === 'men' && ($subtype === 'sarees' || $subtype === 'dresses')) {
        fusora_seller_json(400, ['ok' => false, 'message' => 'Sarees and dresses belong in Women']);
    }
    if ($price <= 0) {
        fusora_seller_json(400, ['ok' => false, 'message' => 'Valid price required']);
    }
    if ($was < $price) {
        $was = $price;
    }
    if (count($imagesIn) < 1) {
        fusora_seller_json(400, ['ok' => false, 'message' => 'Upload at least 1 product photo']);
    }

    $products = fusora_seller_read_store('products.json');
    $id = $existingId !== ''
        ? $existingId
        : 'seller-' . fusora_seller_slug($name) . '-' . substr(bin2hex(random_bytes(4)), 0, 8);

    if ($existingId !== '') {
        $owned = false;
        foreach ($products as $p) {
            if (is_array($p) && ($p['id'] ?? '') === $existingId) {
                if (($p['sellerId'] ?? '') !== $sellerId) {
                    fusora_seller_json(403, ['ok' => false, 'message' => 'Not your product']);
                }
                $owned = true;
                break;
            }
        }
        if (!$owned) {
            fusora_seller_json(404, ['ok' => false, 'message' => 'Product not found']);
        }
    }

    $savedImages = [];
    $i = 0;
    foreach (array_slice($imagesIn, 0, 4) as $img) {
        $path = fusora_seller_save_image((string) $img, $id . '-' . $i);
        if ($path) {
            $savedImages[] = $path;
            $i++;
        }
    }
    if (count($savedImages) < 1) {
        fusora_seller_json(400, ['ok' => false, 'message' => 'Could not save product photos']);
    }

    $collection = null;
    if ($subtype === 'jeans') {
        $collection = $gender === 'men' ? 'mens-jeans' : 'womens-jeans';
    }
    if ($subtype === 'dresses') {
        $collection = 'womens-dresses';
    }

    $product = [
        'id' => $id,
        'rank' => 1,
        'name' => $name,
        'price' => (int) round($price),
        'was' => (int) round($was),
        'topDeal' => $topDeal,
        'tab' => $gender,
        'gender' => $gender,
        'subtype' => $subtype,
        'collection' => $collection,
        'categoryName' => $gender === 'men' ? 'Men' : 'Women',
        'brand' => $shopName,
        'image' => $savedImages[0],
        'images' => array_slice($savedImages, 1),
        'description' => $description !== '' ? $description : null,
        'sizes' => fusora_seller_sizes($subtype),
        'fabric' => $fabric !== '' ? $fabric : null,
        'fit' => ($subtype === 'jeans' && $fit !== '') ? $fit : null,
        'wash' => ($subtype === 'jeans' && $wash !== '') ? $wash : null,
        'sku' => 'SL-' . strtoupper(substr(bin2hex(random_bytes(3)), 0, 6)),
        'source' => 'seller',
        'sellerId' => $sellerId,
        'sellerShop' => $shopName,
        'uploadedBy' => 'Seller',
        'uploadedAt' => date('c'),
        // Every new or edited listing goes through admin approval first
        'status' => 'pending',
    ];

    $idx = -1;
    foreach ($products as $i => $p) {
        if (is_array($p) && ($p['id'] ?? '') === $id) {
            $idx = (int) $i;
            // keep original sku if editing
            if (!empty($p['sku'])) {
                $product['sku'] = $p['sku'];
            }
            break;
        }
    }
    if ($idx >= 0) {
        $products[$idx] = $product;
    } else {
        array_unshift($products, $product);
    }
    fusora_seller_write_store('products.json', array_values($products));

    fusora_seller_json($existingId !== '' ? 200 : 201, [
        'ok' => true,
        'message' => $existingId !== ''
            ? 'Product updated — pending admin approval'
            : 'Product submitted — pending admin approval',
        'product' => $product,
    ]);
}

if ($method === 'DELETE') {
    $body = fusora_seller_read_json();
    $id = trim((string) ($body['id'] ?? $_GET['id'] ?? ''));
    if ($id === '') {
        fusora_seller_json(400, ['ok' => false, 'message' => 'Product id required']);
    }
    $products = fusora_seller_read_store('products.json');
    $next = [];
    $found = false;
    foreach ($products as $p) {
        if (!is_array($p)) {
            continue;
        }
        if (($p['id'] ?? '') === $id) {
            if (($p['sellerId'] ?? '') !== $sellerId) {
                fusora_seller_json(403, ['ok' => false, 'message' => 'Not your product']);
            }
            $found = true;
            continue;
        }
        $next[] = $p;
    }
    if (!$found) {
        fusora_seller_json(404, ['ok' => false, 'message' => 'Product not found']);
    }
    fusora_seller_write_store('products.json', $next);
    fusora_seller_json(200, ['ok' => true, 'message' => 'Product deleted']);
}

fusora_seller_json(405, ['ok' => false, 'message' => 'Method not allowed']);
