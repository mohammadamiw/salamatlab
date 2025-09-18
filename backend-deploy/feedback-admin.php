<?php
require_once 'config.php';

// Basic Auth
if (!isset($_SERVER['PHP_AUTH_USER'])) {
    header('WWW-Authenticate: Basic realm="Feedback Admin"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Unauthorized';
    exit();
}

$user = $_SERVER['PHP_AUTH_USER'] ?? '';
$pass = $_SERVER['PHP_AUTH_PW'] ?? '';
if ($user !== FEEDBACK_ADMIN_USER || $pass !== FEEDBACK_ADMIN_PASS) {
    header('WWW-Authenticate: Basic realm="Feedback Admin"');
    header('HTTP/1.0 401 Unauthorized');
    echo 'Unauthorized';
    exit();
}

header('Content-Type: text/html; charset=UTF-8');

$store = __DIR__ . '/feedback_store.json';
$list = [];
if (file_exists($store)) {
    $raw = @file_get_contents($store);
    $dec = json_decode($raw, true);
    if (is_array($dec)) { $list = $dec; }
}

// Simple HTML list
echo '<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>مدیریت نظرسنجی‌ها</title>';
echo '<style>body{font-family:Tahoma,Arial,sans-serif;background:#f6f9fc;color:#1f2328} .container{max-width:1000px;margin:30px auto;background:#fff;border:1px solid #e6e8eb;border-radius:12px;padding:20px} table{width:100%;border-collapse:collapse} th,td{border:1px solid #eef1f4;padding:8px 10px;font-size:13px} th{background:#f9fafb;color:#6b7280} a{color:#0ea5e9;text-decoration:none}</style>';
echo '</head><body><div class="container">';
echo '<h2>مدیریت نظرسنجی‌ها</h2>';
echo '<table><thead><tr><th>شناسه</th><th>تاریخ</th><th>نام</th><th>تلفن</th><th>مشاهده</th></tr></thead><tbody>';
foreach (array_reverse($list, true) as $id => $rec) {
    $name = htmlspecialchars($rec['fullName'] ?? '');
    $phone = htmlspecialchars($rec['phone'] ?? '');
    $created = htmlspecialchars($rec['createdAt'] ?? '');
    $link = '../r/' . $id;
    echo '<tr>';
    echo '<td>' . htmlspecialchars($id) . '</td>'; 
    echo '<td>' . $created . '</td>'; 
    echo '<td>' . $name . '</td>'; 
    echo '<td>' . $phone . '</td>'; 
    echo '<td><a href="' . $link . '" target="_blank">مشاهده</a></td>';
    echo '</tr>';
}
echo '</tbody></table>';
echo '</div></body></html>';
?>


