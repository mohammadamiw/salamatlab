<?php
/**
 * Admin Authentication API
 * API احراز هویت پنل ادمین
 */

define('APP_START_TIME', microtime(true));
define('ENVIRONMENT', 'production');

require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Logger.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/AdminAuth.php';

Response::handleOptions();

class AdminAuthAPI {
    private $auth;
    
    public function __construct() {
        $this->auth = new AdminAuth();
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
                default:
                    Response::error('متد پشتیبانی نمی‌شود', 405);
            }
        } catch (Exception $e) {
            Logger::error('Admin auth error', ['error' => $e->getMessage()]);
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
    
    private function handleGet(): void {
        $action = $_GET['action'] ?? 'status';
        
        switch ($action) {
            case 'status':
                $this->getAuthStatus();
                break;
            case 'profile':
                $this->getAdminProfile();
                break;
            case 'permissions':
                $this->getPermissions();
                break;
            default:
                Response::error('عمل نامعتبر');
        }
    }
    
    private function handlePost(array $input): void {
        $action = $input['action'] ?? '';
        
        switch ($action) {
            case 'login':
                $this->login($input);
                break;
            case 'logout':
                $this->logout();
                break;
            case 'change-password':
                $this->changePassword($input);
                break;
            default:
                Response::error('عمل نامعتبر');
        }
    }
    
    /**
     * ورود ادمین
     */
    private function login(array $input): void {
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';
        
        if (!$username || !$password) {
            Response::error('نام کاربری و رمز عبور الزامی است');
        }
        
        // محدودیت تلاش ورود
        $this->checkLoginAttempts($username);
        
        $result = $this->auth->login($username, $password);
        
        if ($result['success']) {
            // پاک کردن تلاش‌های ناموفق
            $this->clearLoginAttempts($username);
            
            Response::success([
                'admin' => $result['admin'],
                'csrf_token' => $this->auth->generateCsrfToken(),
                'message' => 'ورود موفقیت‌آمیز'
            ]);
        } else {
            // ثبت تلاش ناموفق
            $this->recordFailedLogin($username);
            
            Response::unauthorized($result['error']);
        }
    }
    
    /**
     * خروج ادمین
     */
    private function logout(): void {
        $result = $this->auth->logout();
        Response::success($result);
    }
    
    /**
     * وضعیت احراز هویت
     */
    private function getAuthStatus(): void {
        if ($this->auth->isAuthenticated()) {
            $admin = $this->auth->getCurrentAdmin();
            Response::success([
                'authenticated' => true,
                'admin' => [
                    'username' => $admin['username'],
                    'name' => $admin['name'],
                    'role' => $admin['role'],
                    'login_time' => date('Y-m-d H:i:s', $admin['login_time'])
                ],
                'csrf_token' => $this->auth->generateCsrfToken()
            ]);
        } else {
            Response::success([
                'authenticated' => false
            ]);
        }
    }
    
    /**
     * پروفایل ادمین
     */
    private function getAdminProfile(): void {
        $this->auth->requireAuth();
        
        $admin = $this->auth->getCurrentAdmin();
        
        Response::success([
            'profile' => [
                'username' => $admin['username'],
                'name' => $admin['name'],
                'email' => $admin['email'],
                'role' => $admin['role'],
                'permissions' => $admin['permissions'],
                'login_time' => date('Y-m-d H:i:s', $admin['login_time']),
                'ip' => $admin['ip']
            ]
        ]);
    }
    
    /**
     * لیست مجوزها
     */
    private function getPermissions(): void {
        $this->auth->requireAuth();
        
        $allPermissions = [
            'dashboard.view' => 'مشاهده داشبورد',
            'users.view' => 'مشاهده کاربران',
            'users.edit' => 'ویرایش کاربران',
            'users.delete' => 'حذف کاربران',
            'users.export' => 'صادرات کاربران',
            'requests.view' => 'مشاهده درخواست‌ها',
            'requests.edit' => 'ویرایش درخواست‌ها',
            'requests.assign' => 'تخصیص دکتر/تکنسین',
            'services.manage' => 'مدیریت سرویس‌ها',
            'doctors.manage' => 'مدیریت دکترها',
            'content.manage' => 'مدیریت محتوا',
            'settings.manage' => 'مدیریت تنظیمات',
            'logs.view' => 'مشاهده لاگ‌ها'
        ];
        
        $admin = $this->auth->getCurrentAdmin();
        $userPermissions = $admin['permissions'];
        
        $accessiblePermissions = [];
        foreach ($allPermissions as $perm => $description) {
            if (in_array('*', $userPermissions) || in_array($perm, $userPermissions)) {
                $accessiblePermissions[$perm] = $description;
            }
        }
        
        Response::success([
            'all_permissions' => $allPermissions,
            'user_permissions' => $accessiblePermissions,
            'has_full_access' => in_array('*', $userPermissions)
        ]);
    }
    
    /**
     * تغییر رمز عبور
     */
    private function changePassword(array $input): void {
        $this->auth->requireAuth();
        
        $currentPassword = $input['current_password'] ?? '';
        $newPassword = $input['new_password'] ?? '';
        $confirmPassword = $input['confirm_password'] ?? '';
        
        if (!$currentPassword || !$newPassword || !$confirmPassword) {
            Response::error('تمام فیلدها الزامی است');
        }
        
        if ($newPassword !== $confirmPassword) {
            Response::error('رمز عبور جدید و تایید آن مطابقت ندارند');
        }
        
        if (strlen($newPassword) < 6) {
            Response::error('رمز عبور باید حداقل 6 کاراکتر باشد');
        }
        
        $admin = $this->auth->getCurrentAdmin();
        $result = $this->auth->changePassword($admin['username'], $currentPassword, $newPassword);
        
        if ($result['success']) {
            Response::success($result);
        } else {
            Response::error($result['error']);
        }
    }
    
    /**
     * بررسی تلاش‌های ورود ناموفق
     */
    private function checkLoginAttempts(string $username): void {
        $ip = $this->getClientIP();
        $cacheFile = sys_get_temp_dir() . "/admin_login_attempts_{$ip}_{$username}.txt";
        
        if (file_exists($cacheFile)) {
            $attempts = json_decode(file_get_contents($cacheFile), true);
            $recentAttempts = array_filter($attempts, fn($time) => time() - $time < 900); // 15 دقیقه
            
            if (count($recentAttempts) >= 5) {
                Logger::warning('Admin login attempts exceeded', [
                    'username' => $username,
                    'ip' => $ip,
                    'attempts' => count($recentAttempts)
                ]);
                
                Response::error('تعداد تلاش‌های ورود بیش از حد. 15 دقیقه صبر کنید.', 429);
            }
        }
    }
    
    /**
     * ثبت تلاش ناموفق
     */
    private function recordFailedLogin(string $username): void {
        $ip = $this->getClientIP();
        $cacheFile = sys_get_temp_dir() . "/admin_login_attempts_{$ip}_{$username}.txt";
        
        $attempts = [];
        if (file_exists($cacheFile)) {
            $attempts = json_decode(file_get_contents($cacheFile), true) ?: [];
        }
        
        $attempts[] = time();
        file_put_contents($cacheFile, json_encode($attempts));
    }
    
    /**
     * پاک کردن تلاش‌های ناموفق
     */
    private function clearLoginAttempts(string $username): void {
        $ip = $this->getClientIP();
        $cacheFile = sys_get_temp_dir() . "/admin_login_attempts_{$ip}_{$username}.txt";
        
        if (file_exists($cacheFile)) {
            unlink($cacheFile);
        }
    }
    
    /**
     * دریافت IP کلاینت
     */
    private function getClientIP(): string {
        $headers = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
        
        foreach ($headers as $header) {
            if (!empty($_SERVER[$header])) {
                $ips = explode(',', $_SERVER[$header]);
                return trim($ips[0]);
            }
        }
        
        return 'unknown';
    }
}

try {
    $authAPI = new AdminAuthAPI();
    $authAPI->handleRequest();
} catch (Exception $e) {
    Logger::critical('Admin auth API fatal error', ['error' => $e->getMessage()]);
    Response::serverError();
}
?>
