<?php
/**
 * API برای مدیریت مقالات بلاگ
 */

require_once 'config.php';

// تنظیم CORS
setCorsHeaders();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
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

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'list':
        handleList($pdo);
        break;
    case 'get':
        handleGet($pdo);
        break;
    case 'create':
        handleCreate($pdo);
        break;
    case 'update':
        handleUpdate($pdo);
        break;
    case 'delete':
        handleDelete($pdo);
        break;
    case 'categories':
        handleCategories($pdo);
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'عملیات نامعتبر']);
        break;
}

function handleList($pdo) {
    $status = $_GET['status'] ?? 'all';
    $category = $_GET['category'] ?? '';
    $search = $_GET['search'] ?? '';
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = min(50, max(1, intval($_GET['limit'] ?? 10)));
    $offset = ($page - 1) * $limit;
    
    $where = [];
    $params = [];
    
    if ($status !== 'all') {
        $where[] = 'bp.status = ?';
        $params[] = $status;
    }
    
    if ($category) {
        $where[] = 'bc.slug = ?';
        $params[] = $category;
    }
    
    if ($search) {
        $where[] = '(bp.title LIKE ? OR bp.content LIKE ? OR bp.excerpt LIKE ?)';
        $searchTerm = '%' . $search . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }
    
    $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    
    $sql = "
        SELECT 
            bp.id, bp.title, bp.slug, bp.excerpt, bp.status, 
            bp.featured_image, bp.views, bp.author, bp.created_at, 
            bp.updated_at, bp.published_at,
            bc.name as category_name, bc.slug as category_slug
        FROM blog_posts bp
        LEFT JOIN blog_categories bc ON bp.category_id = bc.id
        $whereClause
        ORDER BY bp.created_at DESC
        LIMIT ? OFFSET ?
    ";
    
    $params[] = $limit;
    $params[] = $offset;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $posts = $stmt->fetchAll();
    
    // شمارش کل رکوردها
    $countSql = "
        SELECT COUNT(*) as total
        FROM blog_posts bp
        LEFT JOIN blog_categories bc ON bp.category_id = bc.id
        $whereClause
    ";
    
    $countParams = array_slice($params, 0, -2); // حذف limit و offset
    $countStmt = $pdo->prepare($countSql);
    $countStmt->execute($countParams);
    $total = $countStmt->fetch()['total'];
    
    echo json_encode([
        'posts' => $posts,
        'pagination' => [
            'current_page' => $page,
            'total_pages' => ceil($total / $limit),
            'total_posts' => $total,
            'per_page' => $limit
        ]
    ]);
}

function handleGet($pdo) {
    $identifier = $_GET['id'] ?? $_GET['slug'] ?? '';
    
    if (!$identifier) {
        http_response_code(400);
        echo json_encode(['error' => 'شناسه یا slug مقاله الزامی است']);
        return;
    }
    
    $field = is_numeric($identifier) ? 'bp.id' : 'bp.slug';
    
    $sql = "
        SELECT 
            bp.*, 
            bc.name as category_name, bc.slug as category_slug
        FROM blog_posts bp
        LEFT JOIN blog_categories bc ON bp.category_id = bc.id
        WHERE $field = ?
    ";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$identifier]);
    $post = $stmt->fetch();
    
    if (!$post) {
        http_response_code(404);
        echo json_encode(['error' => 'مقاله یافت نشد']);
        return;
    }
    
    // افزایش تعداد بازدید
    if (!is_numeric($identifier)) { // فقط برای slug (نه برای ادمین)
        $updateViews = $pdo->prepare("UPDATE blog_posts SET views = views + 1 WHERE id = ?");
        $updateViews->execute([$post['id']]);
        $post['views']++;
    }
    
    // تبدیل tags از JSON
    if ($post['tags']) {
        $post['tags'] = json_decode($post['tags'], true);
    }
    
    echo json_encode(['post' => $post]);
}

function handleCreate($pdo) {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'متد غیرمجاز']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input || !isset($input['title'], $input['content'])) {
        http_response_code(400);
        echo json_encode(['error' => 'عنوان و محتوا الزامی است']);
        return;
    }
    
    // تولید slug
    $slug = generateSlug($input['title'], $pdo);
    
    $sql = "
        INSERT INTO blog_posts (
            title, slug, content, excerpt, status, category_id, 
            featured_image, meta_title, meta_description, tags, author,
            published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ";
    
    $publishedAt = null;
    if (($input['status'] ?? 'draft') === 'published') {
        $publishedAt = date('Y-m-d H:i:s');
    }
    
    $tags = isset($input['tags']) ? json_encode($input['tags']) : null;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        $input['title'],
        $slug,
        $input['content'],
        $input['excerpt'] ?? '',
        $input['status'] ?? 'draft',
        $input['category_id'] ?? null,
        $input['featured_image'] ?? null,
        $input['meta_title'] ?? $input['title'],
        $input['meta_description'] ?? $input['excerpt'] ?? '',
        $tags,
        $input['author'] ?? 'مدیر سایت',
        $publishedAt
    ]);
    
    $postId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'مقاله با موفقیت ایجاد شد',
        'post_id' => $postId,
        'slug' => $slug
    ]);
}

function handleUpdate($pdo) {
    if ($_SERVER['REQUEST_METHOD'] !== 'PUT') {
        http_response_code(405);
        echo json_encode(['error' => 'متد غیرمجاز']);
        return;
    }
    
    $id = $_GET['id'] ?? '';
    if (!$id || !is_numeric($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'شناسه مقاله الزامی است']);
        return;
    }
    
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'داده‌های ورودی نامعتبر']);
        return;
    }
    
    // بررسی وجود مقاله
    $checkStmt = $pdo->prepare("SELECT id, status FROM blog_posts WHERE id = ?");
    $checkStmt->execute([$id]);
    $existingPost = $checkStmt->fetch();
    
    if (!$existingPost) {
        http_response_code(404);
        echo json_encode(['error' => 'مقاله یافت نشد']);
        return;
    }
    
    $updateFields = [];
    $params = [];
    
    if (isset($input['title'])) {
        $updateFields[] = 'title = ?';
        $params[] = $input['title'];
    }
    
    if (isset($input['content'])) {
        $updateFields[] = 'content = ?';
        $params[] = $input['content'];
    }
    
    if (isset($input['excerpt'])) {
        $updateFields[] = 'excerpt = ?';
        $params[] = $input['excerpt'];
    }
    
    if (isset($input['status'])) {
        $updateFields[] = 'status = ?';
        $params[] = $input['status'];
        
        // اگر وضعیت به published تغییر کرد، تاریخ انتشار را تنظیم کن
        if ($input['status'] === 'published' && $existingPost['status'] !== 'published') {
            $updateFields[] = 'published_at = ?';
            $params[] = date('Y-m-d H:i:s');
        }
    }
    
    if (isset($input['category_id'])) {
        $updateFields[] = 'category_id = ?';
        $params[] = $input['category_id'];
    }
    
    if (isset($input['featured_image'])) {
        $updateFields[] = 'featured_image = ?';
        $params[] = $input['featured_image'];
    }
    
    if (isset($input['meta_title'])) {
        $updateFields[] = 'meta_title = ?';
        $params[] = $input['meta_title'];
    }
    
    if (isset($input['meta_description'])) {
        $updateFields[] = 'meta_description = ?';
        $params[] = $input['meta_description'];
    }
    
    if (isset($input['tags'])) {
        $updateFields[] = 'tags = ?';
        $params[] = json_encode($input['tags']);
    }
    
    if (isset($input['author'])) {
        $updateFields[] = 'author = ?';
        $params[] = $input['author'];
    }
    
    if (empty($updateFields)) {
        http_response_code(400);
        echo json_encode(['error' => 'هیچ فیلدی برای بروزرسانی ارسال نشده']);
        return;
    }
    
    $sql = "UPDATE blog_posts SET " . implode(', ', $updateFields) . " WHERE id = ?";
    $params[] = $id;
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    
    echo json_encode([
        'success' => true,
        'message' => 'مقاله با موفقیت بروزرسانی شد'
    ]);
}

function handleDelete($pdo) {
    if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
        http_response_code(405);
        echo json_encode(['error' => 'متد غیرمجاز']);
        return;
    }
    
    $id = $_GET['id'] ?? '';
    if (!$id || !is_numeric($id)) {
        http_response_code(400);
        echo json_encode(['error' => 'شناسه مقاله الزامی است']);
        return;
    }
    
    $stmt = $pdo->prepare("DELETE FROM blog_posts WHERE id = ?");
    $stmt->execute([$id]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(['error' => 'مقاله یافت نشد']);
        return;
    }
    
    echo json_encode([
        'success' => true,
        'message' => 'مقاله با موفقیت حذف شد'
    ]);
}

function handleCategories($pdo) {
    $stmt = $pdo->prepare("
        SELECT 
            bc.*, 
            COUNT(bp.id) as post_count
        FROM blog_categories bc
        LEFT JOIN blog_posts bp ON bc.id = bp.category_id AND bp.status = 'published'
        GROUP BY bc.id
        ORDER BY bc.sort_order ASC, bc.name ASC
    ");
    $stmt->execute();
    $categories = $stmt->fetchAll();
    
    echo json_encode(['categories' => $categories]);
}

function generateSlug($title, $pdo) {
    // تبدیل عنوان فارسی به slug انگلیسی
    $persianToEnglish = [
        'ا' => 'a', 'آ' => 'a', 'ب' => 'b', 'پ' => 'p', 'ت' => 't', 'ث' => 's',
        'ج' => 'j', 'چ' => 'ch', 'ح' => 'h', 'خ' => 'kh', 'د' => 'd', 'ذ' => 'z',
        'ر' => 'r', 'ز' => 'z', 'ژ' => 'zh', 'س' => 's', 'ش' => 'sh', 'ص' => 's',
        'ض' => 'z', 'ط' => 't', 'ظ' => 'z', 'ع' => 'a', 'غ' => 'gh', 'ف' => 'f',
        'ق' => 'gh', 'ک' => 'k', 'گ' => 'g', 'ل' => 'l', 'م' => 'm', 'ن' => 'n',
        'و' => 'v', 'ه' => 'h', 'ی' => 'y', ' ' => '-'
    ];
    
    $slug = str_replace(array_keys($persianToEnglish), array_values($persianToEnglish), $title);
    $slug = preg_replace('/[^a-zA-Z0-9\-]/', '', $slug);
    $slug = preg_replace('/-+/', '-', $slug);
    $slug = trim($slug, '-');
    $slug = strtolower($slug);
    
    if (empty($slug)) {
        $slug = 'post-' . time();
    }
    
    // بررسی یکتا بودن slug
    $originalSlug = $slug;
    $counter = 1;
    
    while (true) {
        $stmt = $pdo->prepare("SELECT id FROM blog_posts WHERE slug = ?");
        $stmt->execute([$slug]);
        
        if ($stmt->rowCount() === 0) {
            break;
        }
        
        $slug = $originalSlug . '-' . $counter;
        $counter++;
    }
    
    return $slug;
}
?>

