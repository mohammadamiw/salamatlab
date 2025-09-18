<?php
/**
 * Admin User Management API
 * API مدیریت کاربران برای ادمین
 */

define('APP_START_TIME', microtime(true));
define('ENVIRONMENT', 'production');

require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Logger.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/AdminAuth.php';

Response::handleOptions();

class AdminUserManagement {
    private $db;
    private $auth;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->auth = new AdminAuth();
        
        // بررسی احراز هویت
        $this->auth->requireAuth(['users.view']);
    }
    
    public function handleRequest(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $input = $this->getInputData();
        
        try {
            switch ($method) {
                case 'GET':
                    $this->handleGet();
                    break;
                case 'POST':
                    $this->handlePost($input);
                    break;
                case 'PUT':
                    $this->handlePut($input);
                    break;
                case 'DELETE':
                    $this->handleDelete();
                    break;
                default:
                    Response::error('متد پشتیبانی نمی‌شود', 405);
            }
        } catch (Exception $e) {
            Logger::error('Admin user management error', ['error' => $e->getMessage()]);
            Response::serverError();
        }
    }
    
    private function getInputData(): array {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (str_contains($contentType, 'application/json')) {
            $input = json_decode(file_get_contents('php://input'), true);
            return is_array($input) ? $input : [];
        }
        return $_POST;
    }
    
    /**
     * دریافت لیست کاربران
     */
    private function handleGet(): void {
        $action = $_GET['action'] ?? 'list';
        
        switch ($action) {
            case 'list':
                $this->getUsersList();
                break;
            case 'details':
                $this->getUserDetails();
                break;
            case 'search':
                $this->searchUsers();
                break;
            case 'export':
                $this->exportUsers();
                break;
            default:
                Response::error('عمل نامعتبر');
        }
    }
    
    /**
     * لیست کاربران با فیلتر و صفحه‌بندی
     */
    private function getUsersList(): void {
        $page = max(1, (int) ($_GET['page'] ?? 1));
        $limit = min(100, max(10, (int) ($_GET['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;
        
        $status = $_GET['status'] ?? null; // active, inactive, all
        $verified = $_GET['verified'] ?? null; // true, false
        $sortBy = $_GET['sort_by'] ?? 'created_at';
        $sortOrder = $_GET['sort_order'] ?? 'DESC';
        
        // ساخت کوئری
        $sql = "SELECT u.id, u.phone, u.first_name, u.last_name, u.email, u.city,
                       u.is_profile_complete, u.is_verified, u.is_active,
                       u.created_at, u.last_login_at,
                       COUNT(DISTINCT cr.id) as checkup_count,
                       COUNT(DISTINCT hsr.id) as sampling_count
                FROM users u
                LEFT JOIN checkup_requests cr ON u.id = cr.user_id
                LEFT JOIN home_sampling_requests hsr ON u.id = hsr.user_id";
        
        $whereConditions = [];
        $params = [];
        
        if ($status === 'active') {
            $whereConditions[] = "u.is_active = TRUE";
        } elseif ($status === 'inactive') {
            $whereConditions[] = "u.is_active = FALSE";
        }
        
        if ($verified === 'true') {
            $whereConditions[] = "u.is_verified = TRUE";
        } elseif ($verified === 'false') {
            $whereConditions[] = "u.is_verified = FALSE";
        }
        
        if (!empty($whereConditions)) {
            $sql .= " WHERE " . implode(" AND ", $whereConditions);
        }
        
        $sql .= " GROUP BY u.id";
        
        // مرتب‌سازی
        $allowedSortFields = ['created_at', 'last_login_at', 'first_name', 'last_name', 'phone'];
        if (in_array($sortBy, $allowedSortFields)) {
            $sql .= " ORDER BY u.$sortBy $sortOrder";
        }
        
        $sql .= " LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        $users = $this->db->fetchAll($sql, $params);
        
        // شمارش کل کاربران
        $countSql = str_replace("SELECT u.id, u.phone, u.first_name, u.last_name, u.email, u.city,
                       u.is_profile_complete, u.is_verified, u.is_active,
                       u.created_at, u.last_login_at,
                       COUNT(DISTINCT cr.id) as checkup_count,
                       COUNT(DISTINCT hsr.id) as sampling_count", "SELECT COUNT(DISTINCT u.id) as total", $sql);
        $countSql = str_replace(" GROUP BY u.id", "", $countSql);
        $countSql = str_replace(" LIMIT ? OFFSET ?", "", $countSql);
        array_pop($params); // حذف offset
        array_pop($params); // حذف limit
        
        $total = $this->db->fetchOne($countSql, $params)['total'];
        
        Response::success([
            'users' => $users,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => ceil($total / $limit)
            ]
        ]);
    }
    
    /**
     * جزئیات کامل یک کاربر
     */
    private function getUserDetails(): void {
        $userId = $_GET['user_id'] ?? null;
        
        if (!$userId) {
            Response::error('شناسه کاربر الزامی است');
        }
        
        // اطلاعات کاربر
        $user = $this->db->fetchOne(
            "SELECT * FROM users WHERE id = ?",
            [$userId]
        );
        
        if (!$user) {
            Response::notFound('کاربر یافت نشد');
        }
        
        // آدرس‌های کاربر
        $addresses = $this->db->fetchAll(
            "SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC",
            [$userId]
        );
        
        // درخواست‌های چکاپ
        $checkupRequests = $this->db->fetchAll(
            "SELECT cr.*, ms.name as service_name, d.first_name as doctor_first_name, d.last_name as doctor_last_name
             FROM checkup_requests cr
             LEFT JOIN medical_services ms ON cr.service_id = ms.id
             LEFT JOIN doctors d ON cr.doctor_id = d.id
             WHERE cr.user_id = ?
             ORDER BY cr.created_at DESC LIMIT 10",
            [$userId]
        );
        
        // درخواست‌های نمونه‌گیری
        $samplingRequests = $this->db->fetchAll(
            "SELECT * FROM home_sampling_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 10",
            [$userId]
        );
        
        // آمار کاربر
        $stats = [
            'total_checkups' => $this->db->fetchOne(
                "SELECT COUNT(*) as count FROM checkup_requests WHERE user_id = ?",
                [$userId]
            )['count'],
            'total_samplings' => $this->db->fetchOne(
                "SELECT COUNT(*) as count FROM home_sampling_requests WHERE user_id = ?",
                [$userId]
            )['count'],
            'total_spent' => $this->calculateUserTotalSpent($userId),
            'last_activity' => $this->getUserLastActivity($userId)
        ];
        
        Response::success([
            'user' => $user,
            'addresses' => $addresses,
            'checkup_requests' => $checkupRequests,
            'sampling_requests' => $samplingRequests,
            'stats' => $stats
        ]);
    }
    
    /**
     * جستجوی کاربران
     */
    private function searchUsers(): void {
        $query = $_GET['q'] ?? '';
        $limit = min(50, max(5, (int) ($_GET['limit'] ?? 20)));
        
        if (strlen($query) < 2) {
            Response::error('حداقل 2 کاراکتر برای جستجو لازم است');
        }
        
        $sql = "SELECT id, phone, first_name, last_name, email, city, 
                       is_profile_complete, is_verified, is_active, created_at
                FROM users 
                WHERE (first_name LIKE ? OR last_name LIKE ? OR phone LIKE ? OR email LIKE ? OR national_id LIKE ?)
                ORDER BY 
                    CASE 
                        WHEN phone = ? THEN 1
                        WHEN phone LIKE ? THEN 2
                        WHEN CONCAT(first_name, ' ', last_name) LIKE ? THEN 3
                        ELSE 4
                    END,
                    created_at DESC
                LIMIT ?";
        
        $searchTerm = "%$query%";
        $exactPhone = $query;
        $phonePattern = "$query%";
        $namePattern = "%$query%";
        
        $params = [
            $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm,
            $exactPhone, $phonePattern, $namePattern,
            $limit
        ];
        
        $users = $this->db->fetchAll($sql, $params);
        
        Response::success([
            'users' => $users,
            'query' => $query,
            'total' => count($users)
        ]);
    }
    
    /**
     * ویرایش کاربر توسط ادمین
     */
    private function handlePut(array $input): void {
        $this->auth->requireAuth(['users.edit']);
        
        $userId = $input['user_id'] ?? null;
        if (!$userId) {
            Response::error('شناسه کاربر الزامی است');
        }
        
        $user = $this->db->fetchOne("SELECT * FROM users WHERE id = ?", [$userId]);
        if (!$user) {
            Response::notFound('کاربر یافت نشد');
        }
        
        // فیلدهای قابل ویرایش توسط ادمین
        $allowedFields = [
            'first_name', 'last_name', 'email', 'national_id',
            'birth_date', 'gender', 'city', 'province',
            'has_basic_insurance', 'basic_insurance', 'complementary_insurance',
            'is_verified', 'is_active'
        ];
        
        $updateData = [];
        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $input)) {
                $updateData[$field] = $input[$field];
            }
        }
        
        if (!empty($updateData)) {
            $this->db->update('users', $updateData, ['id' => $userId]);
            
            $admin = $this->auth->getCurrentAdmin();
            Logger::info('User updated by admin', [
                'user_id' => $userId,
                'admin_username' => $admin['username'],
                'updated_fields' => array_keys($updateData)
            ]);
        }
        
        $updatedUser = $this->db->fetchOne("SELECT * FROM users WHERE id = ?", [$userId]);
        
        Response::success([
            'user' => $updatedUser,
            'message' => 'اطلاعات کاربر به‌روزرسانی شد'
        ]);
    }
    
    /**
     * حذف/غیرفعال کردن کاربر
     */
    private function handleDelete(): void {
        $this->auth->requireAuth(['users.delete']);
        
        $userId = $_GET['user_id'] ?? null;
        $action = $_GET['delete_action'] ?? 'deactivate'; // deactivate یا delete
        
        if (!$userId) {
            Response::error('شناسه کاربر الزامی است');
        }
        
        $user = $this->db->fetchOne("SELECT * FROM users WHERE id = ?", [$userId]);
        if (!$user) {
            Response::notFound('کاربر یافت نشد');
        }
        
        $admin = $this->auth->getCurrentAdmin();
        
        if ($action === 'delete') {
            // حذف کامل (خطرناک)
            $this->db->delete('users', ['id' => $userId]);
            
            Logger::warning('User permanently deleted by admin', [
                'user_id' => $userId,
                'user_phone' => $user['phone'],
                'admin_username' => $admin['username']
            ]);
            
            Response::success(['message' => 'کاربر به طور کامل حذف شد']);
            
        } else {
            // غیرفعال کردن
            $this->db->update('users', ['is_active' => false], ['id' => $userId]);
            
            Logger::info('User deactivated by admin', [
                'user_id' => $userId,
                'user_phone' => $user['phone'],
                'admin_username' => $admin['username']
            ]);
            
            Response::success(['message' => 'کاربر غیرفعال شد']);
        }
    }
    
    /**
     * محاسبه کل هزینه‌های کاربر
     */
    private function calculateUserTotalSpent(int $userId): float {
        $checkupTotal = $this->db->fetchOne(
            "SELECT COALESCE(SUM(final_price), 0) as total FROM checkup_requests WHERE user_id = ? AND status = 'completed'",
            [$userId]
        )['total'];
        
        $samplingTotal = $this->db->fetchOne(
            "SELECT COALESCE(SUM(total_price), 0) as total FROM home_sampling_requests WHERE user_id = ? AND status = 'completed'",
            [$userId]
        )['total'];
        
        return (float) ($checkupTotal + $samplingTotal);
    }
    
    /**
     * آخرین فعالیت کاربر
     */
    private function getUserLastActivity(int $userId): ?string {
        $lastCheckup = $this->db->fetchOne(
            "SELECT created_at FROM checkup_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
            [$userId]
        );
        
        $lastSampling = $this->db->fetchOne(
            "SELECT created_at FROM home_sampling_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
            [$userId]
        );
        
        $lastLogin = $this->db->fetchOne(
            "SELECT last_login_at FROM users WHERE id = ?",
            [$userId]
        )['last_login_at'];
        
        $activities = array_filter([
            $lastCheckup['created_at'] ?? null,
            $lastSampling['created_at'] ?? null,
            $lastLogin
        ]);
        
        if (empty($activities)) {
            return null;
        }
        
        usort($activities, fn($a, $b) => strtotime($b) - strtotime($a));
        return $activities[0];
    }
    
    /**
     * صادرات اطلاعات کاربران
     */
    private function exportUsers(): void {
        $this->auth->requireAuth(['users.export']);
        
        $format = $_GET['format'] ?? 'csv'; // csv, json, excel
        
        $users = $this->db->fetchAll(
            "SELECT u.*, 
                    COUNT(DISTINCT cr.id) as checkup_count,
                    COUNT(DISTINCT hsr.id) as sampling_count,
                    COALESCE(SUM(cr.final_price), 0) + COALESCE(SUM(hsr.total_price), 0) as total_spent
             FROM users u
             LEFT JOIN checkup_requests cr ON u.id = cr.user_id AND cr.status = 'completed'
             LEFT JOIN home_sampling_requests hsr ON u.id = hsr.user_id AND hsr.status = 'completed'
             WHERE u.is_active = TRUE
             GROUP BY u.id
             ORDER BY u.created_at DESC"
        );
        
        switch ($format) {
            case 'csv':
                $this->exportToCsv($users);
                break;
            case 'json':
                $this->exportToJson($users);
                break;
            default:
                Response::error('فرمت نامعتبر');
        }
    }
    
    /**
     * صادرات به CSV
     */
    private function exportToCsv(array $users): void {
        $filename = 'users_export_' . date('Y-m-d_H-i-s') . '.csv';
        
        header('Content-Type: text/csv; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
        
        $output = fopen('php://output', 'w');
        
        // BOM برای نمایش صحیح فارسی در Excel
        fwrite($output, "\xEF\xBB\xBF");
        
        // عناوین ستون‌ها
        fputcsv($output, [
            'شناسه', 'شماره تلفن', 'نام', 'نام خانوادگی', 'ایمیل', 'کد ملی',
            'تاریخ تولد', 'جنسیت', 'شهر', 'تایید شده', 'فعال', 'تعداد چکاپ',
            'تعداد نمونه‌گیری', 'کل هزینه', 'تاریخ ثبت‌نام'
        ]);
        
        // داده‌های کاربران
        foreach ($users as $user) {
            fputcsv($output, [
                $user['id'],
                $user['phone'],
                $user['first_name'] ?? '',
                $user['last_name'] ?? '',
                $user['email'] ?? '',
                $user['national_id'] ?? '',
                $user['birth_date'] ?? '',
                $user['gender'] === 'male' ? 'مرد' : ($user['gender'] === 'female' ? 'زن' : ''),
                $user['city'] ?? '',
                $user['is_verified'] ? 'بله' : 'خیر',
                $user['is_active'] ? 'فعال' : 'غیرفعال',
                $user['checkup_count'],
                $user['sampling_count'],
                number_format($user['total_spent']) . ' تومان',
                $user['created_at']
            ]);
        }
        
        fclose($output);
        
        Logger::info('Users exported to CSV', [
            'admin' => $this->auth->getCurrentAdmin()['username'],
            'count' => count($users)
        ]);
        
        exit;
    }
    
    /**
     * صادرات به JSON
     */
    private function exportToJson(array $users): void {
        $filename = 'users_export_' . date('Y-m-d_H-i-s') . '.json';
        
        header('Content-Type: application/json; charset=UTF-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        
        $exportData = [
            'export_info' => [
                'generated_at' => date('Y-m-d H:i:s'),
                'admin' => $this->auth->getCurrentAdmin()['username'],
                'total_users' => count($users)
            ],
            'users' => $users
        ];
        
        echo json_encode($exportData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        
        Logger::info('Users exported to JSON', [
            'admin' => $this->auth->getCurrentAdmin()['username'],
            'count' => count($users)
        ]);
        
        exit;
    }
}

try {
    $userManagement = new AdminUserManagement();
    $userManagement->handleRequest();
} catch (Exception $e) {
    Logger::critical('Admin user management fatal error', ['error' => $e->getMessage()]);
    Response::serverError();
}
?>
