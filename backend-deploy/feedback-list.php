<?php
require_once 'config.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Basic Auth (via header Authorization or standard server vars)
$authUser = $_SERVER['PHP_AUTH_USER'] ?? '';
$authPass = $_SERVER['PHP_AUTH_PW'] ?? '';
if (!$authUser || !$authPass) {
    // Try header Authorization: Basic ...
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['Authorization'] ?? '';
    if (stripos($hdr, 'basic ') === 0) {
        $b64 = trim(substr($hdr, 6));
        $dec = base64_decode($b64);
        if (strpos($dec, ':') !== false) {
            [$authUser, $authPass] = explode(':', $dec, 2);
        }
    }
}

if ($authUser !== FEEDBACK_ADMIN_USER || $authPass !== FEEDBACK_ADMIN_PASS) {
    header('WWW-Authenticate: Basic realm="Feedback Admin"');
    http_response_code(401);
    echo json_encode(['error' => 'unauthorized']);
    exit();
}

$store = __DIR__ . '/feedback_store.json';
if (!file_exists($store)) {
    echo json_encode(['items' => []]);
    exit();
}

$raw = @file_get_contents($store);
$data = json_decode($raw, true);
if (!is_array($data)) { $data = []; }

// Return as array of records, newest first
$items = array_values($data);
usort($items, function($a, $b) {
    return strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? '');
});

echo json_encode(['items' => $items], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
exit();
?>


