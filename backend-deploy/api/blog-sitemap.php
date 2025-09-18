<?php
/**
 * تولید sitemap برای مقالات بلاگ
 */

require_once 'config.php';

// تنظیم CORS
setCorsHeaders();

// بررسی اتصال به دیتابیس
if (!defined('DB_HOST') || !DB_HOST) {
    http_response_code(500);
    echo '<!-- Database configuration not found -->';
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
    echo '<!-- Database connection failed -->';
    exit();
}

// تنظیم header برای XML
header('Content-Type: application/xml; charset=utf-8');

// دریافت مقالات منتشر شده
try {
    $stmt = $pdo->prepare("
        SELECT slug, updated_at, created_at, published_at
        FROM blog_posts 
        WHERE status = 'published' 
        ORDER BY published_at DESC
    ");
    $stmt->execute();
    $posts = $stmt->fetchAll();
} catch (PDOException $e) {
    echo '<!-- Error fetching posts -->';
    exit();
}

// تولید XML sitemap
echo '<?xml version="1.0" encoding="UTF-8"?>';
?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <!-- صفحه اصلی بلاگ -->
    <url>
        <loc>https://www.salamatlab.com/blog</loc>
        <lastmod><?php echo date('Y-m-d'); ?></lastmod>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>
    
    <?php foreach ($posts as $post): ?>
    <url>
        <loc>https://www.salamatlab.com/blog/<?php echo htmlspecialchars($post['slug']); ?></loc>
        <lastmod><?php echo date('Y-m-d', strtotime($post['updated_at'])); ?></lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>
    <?php endforeach; ?>
</urlset>

