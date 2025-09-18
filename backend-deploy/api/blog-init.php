<?php
/**
 * راه‌اندازی اولیه سیستم بلاگ
 */

require_once 'config.php';

// تنظیم CORS
setCorsHeaders();

header('Content-Type: application/json; charset=utf-8');

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
    
    $result = [
        'status' => 'success',
        'actions' => []
    ];
    
    // ایجاد جدول مقالات
    $sql = "
    CREATE TABLE IF NOT EXISTS blog_posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        content LONGTEXT NOT NULL,
        excerpt TEXT,
        status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
        category_id INT,
        featured_image VARCHAR(500),
        meta_title VARCHAR(255),
        meta_description TEXT,
        tags JSON,
        author VARCHAR(100) DEFAULT 'مدیر سایت',
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        published_at TIMESTAMP NULL,
        INDEX idx_status (status),
        INDEX idx_slug (slug),
        INDEX idx_published (published_at),
        INDEX idx_category (category_id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $pdo->exec($sql);
    $result['actions'][] = 'blog_posts table created/verified';
    
    // ایجاد جدول دسته‌بندی‌ها
    $sql = "
    CREATE TABLE IF NOT EXISTS blog_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        parent_id INT NULL,
        sort_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_slug (slug),
        INDEX idx_parent (parent_id),
        FOREIGN KEY (parent_id) REFERENCES blog_categories(id) ON DELETE SET NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $pdo->exec($sql);
    $result['actions'][] = 'blog_categories table created/verified';
    
    // ایجاد جدول رسانه
    $sql = "
    CREATE TABLE IF NOT EXISTS blog_media (
        id INT AUTO_INCREMENT PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        mime_type VARCHAR(100) NOT NULL,
        file_size INT NOT NULL,
        width INT NULL,
        height INT NULL,
        alt_text VARCHAR(255),
        caption TEXT,
        uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_mime (mime_type)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    ";
    
    $pdo->exec($sql);
    $result['actions'][] = 'blog_media table created/verified';
    
    // درج دسته‌بندی‌های پیش‌فرض
    $categories = [
        ['name' => 'عمومی', 'slug' => 'general', 'description' => 'مقالات عمومی'],
        ['name' => 'سلامت', 'slug' => 'health', 'description' => 'مقالات مربوط به سلامت'],
        ['name' => 'آزمایشات', 'slug' => 'tests', 'description' => 'مقالات مربوط به آزمایشات پزشکی'],
        ['name' => 'اخبار', 'slug' => 'news', 'description' => 'اخبار و اطلاعیه‌ها']
    ];
    
    $stmt = $pdo->prepare("INSERT IGNORE INTO blog_categories (name, slug, description) VALUES (?, ?, ?)");
    $insertedCount = 0;
    foreach ($categories as $category) {
        $stmt->execute([$category['name'], $category['slug'], $category['description']]);
        if ($stmt->rowCount() > 0) {
            $insertedCount++;
        }
    }
    
    if ($insertedCount > 0) {
        $result['actions'][] = "$insertedCount default categories inserted";
    } else {
        $result['actions'][] = 'default categories already exist';
    }
    
    // ایجاد یک مقاله نمونه
    $samplePost = [
        'title' => 'مقاله نمونه - خوش آمدید به بلاگ آزمایشگاه سلامت',
        'slug' => 'sample-welcome-post',
        'content' => '<p>این یک مقاله نمونه است که برای تست سیستم بلاگ ایجاد شده است.</p><p>شما می‌توانید این مقاله را ویرایش یا حذف کنید.</p>',
        'excerpt' => 'مقاله نمونه برای تست سیستم بلاگ',
        'status' => 'published',
        'category_id' => 1, // عمومی
        'author' => 'مدیر سایت',
        'meta_title' => 'مقاله نمونه - بلاگ آزمایشگاه سلامت',
        'meta_description' => 'مقاله نمونه برای تست سیستم بلاگ آزمایشگاه سلامت'
    ];
    
    $stmt = $pdo->prepare("INSERT IGNORE INTO blog_posts (title, slug, content, excerpt, status, category_id, author, meta_title, meta_description, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $samplePost['title'],
        $samplePost['slug'],
        $samplePost['content'],
        $samplePost['excerpt'],
        $samplePost['status'],
        $samplePost['category_id'],
        $samplePost['author'],
        $samplePost['meta_title'],
        $samplePost['meta_description'],
        date('Y-m-d H:i:s')
    ]);
    
    if ($stmt->rowCount() > 0) {
        $result['actions'][] = 'sample post created';
    } else {
        $result['actions'][] = 'sample post already exists';
    }
    
    echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'error',
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>
