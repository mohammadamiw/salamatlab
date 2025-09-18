<?php
require_once 'config.php';

setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$id = $_GET['id'] ?? '';
$id = preg_replace('/[^a-f0-9]/', '', strtolower($id));
if (!$id) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid id']);
    exit();
}

// Try requests store
$record = null;
$reqStore = __DIR__ . '/requests_store.json';
if (file_exists($reqStore)) {
    $raw = @file_get_contents($reqStore);
    $data = json_decode($raw, true);
    if (is_array($data) && isset($data[$id])) {
        $record = $data[$id];
    }
}

// If not found in requests, try feedback store
if (!$record) {
    $fstore = __DIR__ . '/feedback_store.json';
    if (file_exists($fstore)) {
        $fraw = @file_get_contents($fstore);
        $fdata = json_decode($fraw, true);
        if (is_array($fdata) && isset($fdata[$id])) {
            $record = $fdata[$id];
        }
    }
}

// If not found yet, try careers store
if (!$record) {
    $cstore = __DIR__ . '/careers_store.json';
    if (file_exists($cstore)) {
        $craw = @file_get_contents($cstore);
        $cdata = json_decode($craw, true);
        if (is_array($cdata) && isset($cdata[$id])) {
            $record = $cdata[$id];
        }
    }
}

if (!$record) {
    http_response_code(404);
    echo json_encode(['error' => 'not found']);
    exit();
}

echo json_encode($record, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
exit();
?>


