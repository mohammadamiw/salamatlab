<?php
/**
 * آپلود رسانه برای بلاگ
 */

require_once 'config.php';

// تنظیم CORS
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'متد غیرمجاز']);
    exit();
}

// بررسی اتصال به دیتابیس
if (!defined('DB_HOST') || !DB_HOST) {
    http_response_code(500);
    echo json_encode(['error' => 'تنظیمات دیتابیس یافت نشد']);
    exit();
}

try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET,
        DB_USER,
        DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'خطا در اتصال به دیتابیس']);
    exit();
}

// بررسی آپلود فایل
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'فایل آپلود نشده یا دچار خطا شده']);
    exit();
}

$file = $_FILES['file'];
$allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// بررسی نوع فایل
if (!in_array($file['type'], $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'نوع فایل مجاز نیست']);
    exit();
}

// بررسی اندازه فایل (حداکثر 10MB)
$maxSize = 10 * 1024 * 1024; // 10MB
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'اندازه فایل بیش از حد مجاز است']);
    exit();
}

// ایجاد پوشه uploads
$uploadDir = dirname(__FILE__) . '/../uploads/blog/';
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'امکان ایجاد پوشه آپلود وجود ندارد']);
        exit();
    }
}

// تولید نام فایل یکتا
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('blog_') . '_' . time() . '.' . $extension;
$filePath = $uploadDir . $filename;

// آپلود فایل
if (!move_uploaded_file($file['tmp_name'], $filePath)) {
    http_response_code(500);
    echo json_encode(['error' => 'خطا در آپلود فایل']);
    exit();
}

// دریافت اطلاعات تصویر (در صورت وجود)
$width = null;
$height = null;

if (strpos($file['type'], 'image/') === 0) {
    $imageInfo = getimagesize($filePath);
    if ($imageInfo) {
        $width = $imageInfo[0];
        $height = $imageInfo[1];
    }
}

// ذخیره اطلاعات در دیتابیس
try {
    $stmt = $pdo->prepare("
        INSERT INTO blog_media (
            filename, original_name, mime_type, file_size, 
            width, height, alt_text, caption
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ");
    
    $stmt->execute([
        $filename,
        $file['name'],
        $file['type'],
        $file['size'],
        $width,
        $height,
        $_POST['alt_text'] ?? '',
        $_POST['caption'] ?? ''
    ]);
    
    $mediaId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'فایل با موفقیت آپلود شد',
        'media' => [
            'id' => $mediaId,
            'filename' => $filename,
            'original_name' => $file['name'],
            'url' => '/uploads/blog/' . $filename,
            'mime_type' => $file['type'],
            'file_size' => $file['size'],
            'width' => $width,
            'height' => $height
        ]
    ]);
    
} catch (PDOException $e) {
    // حذف فایل در صورت خطا در دیتابیس
    unlink($filePath);
    
    http_response_code(500);
    echo json_encode(['error' => 'خطا در ذخیره اطلاعات فایل']);
}
?>

