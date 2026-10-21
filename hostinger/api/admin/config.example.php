<?php
// Copy to config.php on the server (never commit the real config.php).
// ADMIN_PASSWORD_HASH = hash('sha256', ADMIN_SALT . password)
return [
    'ADMIN_SALT' => 'change-this-random-salt',
    'ADMIN_PASSWORD_HASH' => 'change-this-hash',
];
