<?php
/** GET /api/orders/all.php — admin only (X-Admin-Token). All orders, newest first. */
declare(strict_types=1);
require __DIR__ . '/_lib.php';
require __DIR__ . '/../admin/_lib.php';
fusora_orders_cors();
fusora_admin_require_token();

fusora_orders_json(200, ['ok' => true, 'orders' => fusora_orders_load()]);
