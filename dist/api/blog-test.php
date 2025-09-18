<?php
/**
 * تست اتصال دیتابیس و جداول بلاگ
 */

require_once 'config.php';

// تنظیم CORS
setCorsHeaders();

header('Content-Type: application/json; charset=utf-8');

try {
    // تست اتصال دیتابیس
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
    
    $result = [
        'database_connection' => 'success',
        'tables' => []
    ];
    
    // بررسی وجود جداول
    $tables = ['blog_posts', 'blog_categories', 'blog_media'];
    
    foreach ($tables as $table) {
        try {
            $stmt = $pdo->prepare("SHOW TABLES LIKE ?");
            $stmt->execute([$table]);
            $exists = $stmt->rowCount() > 0;
            
            $result['tables'][$table] = [
                'exists' => $exists,
                'status' => $exists ? 'ok' : 'missing'
            ];
            
            if ($exists) {
                // بررسی ساختار جدول
                $stmt = $pdo->prepare("DESCRIBE $table");
                $stmt->execute();
                $columns = $stmt->fetchAll();
                $result['tables'][$table]['columns'] = count($columns);
            }
            
        } catch (PDOException $e) {
            $result['tables'][$table] = [
                'exists' => false,
                'status' => 'error',
                'error' => $e->getMessage()
            ];
        }
    }
    
    // تست درج و خواندن داده
    try {
        // بررسی وجود دسته‌بندی‌ها
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM blog_categories");
        $stmt->execute();
        $categoryCount = $stmt->fetch()['count'];
        $result['categories_count'] = $categoryCount;
        
        // بررسی وجود مقالات
        $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM blog_posts");
        $stmt->execute();
        $postCount = $stmt->fetch()['count'];
        $result['posts_count'] = $postCount;
        
    } catch (PDOException $e) {
        $result['data_test'] = [
            'status' => 'error',
            'error' => $e->getMessage()
        ];
    }
    
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'database_connection' => 'failed',
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
