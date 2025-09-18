<?php
require_once 'config.php';

// Basic CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=UTF-8');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit(); }

// Ensure upload dir
$dir = __DIR__ . '/uploads';
if (!is_dir($dir)) { @mkdir($dir, 0755, true); }

$urls = [];
if (!empty($_FILES['files']['name']) && is_array($_FILES['files']['name'])) {
  $count = count($_FILES['files']['name']);
  for ($i = 0; $i < $count; $i++) {
    $name = $_FILES['files']['name'][$i];
    $tmp  = $_FILES['files']['tmp_name'][$i];
    $err  = $_FILES['files']['error'][$i];
    $size = $_FILES['files']['size'][$i];
    if ($err !== UPLOAD_ERR_OK || !$tmp) { continue; }
    // Simple validation
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if (!in_array($ext, ['jpg','jpeg','png','gif','webp','pdf'])) { continue; }
    if ($size > 8 * 1024 * 1024) { continue; }
    $newName = bin2hex(random_bytes(8)) . '.' . $ext;
    $dest = $dir . '/' . $newName;
    if (@move_uploaded_file($tmp, $dest)) {
      $scheme = (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) ? $_SERVER['HTTP_X_FORWARDED_PROTO'] : (isset($_SERVER['REQUEST_SCHEME']) ? $_SERVER['REQUEST_SCHEME'] : 'https'));
      $host = $_SERVER['HTTP_HOST'] ?? '';
      $urls[] = $scheme . '://' . $host . '/api/uploads/' . $newName;
    }
  }
}

echo json_encode([ 'urls' => $urls ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
?>


