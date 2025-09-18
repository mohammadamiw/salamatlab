<?php
require_once 'config.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Basic Auth
$authUser = $_SERVER['PHP_AUTH_USER'] ?? '';
$authPass = $_SERVER['PHP_AUTH_PW'] ?? '';
if (!$authUser || !$authPass) {
    $hdr = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['Authorization'] ?? '';
    if (stripos($hdr, 'basic ') === 0) {
        $b64 = trim(substr($hdr, 6));
        $dec = base64_decode($b64);
        if (strpos($dec, ':') !== false) { [$authUser, $authPass] = explode(':', $dec, 2); }
    }
}

if ($authUser !== FEEDBACK_ADMIN_USER || $authPass !== FEEDBACK_ADMIN_PASS) {
    header('WWW-Authenticate: Basic realm="Admin"');
    http_response_code(401);
    echo json_encode(['error' => 'unauthorized']);
    exit();
}

$store = __DIR__ . '/requests_store.json';
$items = [];
if (file_exists($store)) {
    $raw = @file_get_contents($store);
    $dec = json_decode($raw, true);
    if (is_array($dec)) {
        foreach ($dec as $id => $rec) {
            if (($rec['type'] ?? '') === 'sampling') {
                $items[] = $rec;
            }
        }
    }
}

usort($items, function($a, $b) { return strcmp($b['createdAt'] ?? '', $a['createdAt'] ?? ''); });

echo json_encode(['items' => $items], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
exit();
?>


