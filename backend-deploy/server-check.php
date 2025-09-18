<?php
// بررسی وضعیت سرور
header('Content-Type: application/json; charset=UTF-8');

$status = [
    'server_time' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
    'memory_limit' => ini_get('memory_limit'),
    'max_execution_time' => ini_get('max_execution_time'),
    'disk_free_space' => disk_free_space('.'),
    'disk_total_space' => disk_total_space('.'),
    'extensions' => [
        'curl' => extension_loaded('curl'),
        'pdo' => extension_loaded('pdo'),
        'json' => extension_loaded('json'),
        'mbstring' => extension_loaded('mbstring')
    ],
    'writable_directories' => [
        'current' => is_writable('.'),
        'api' => is_writable('./api/')
    ]
];

echo json_encode($status, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
?>
