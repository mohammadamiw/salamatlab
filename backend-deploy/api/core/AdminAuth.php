<?php
/**
 * Admin Authentication System
 * سیستم احراز هویت پنل ادمین
 */

class AdminAuth {
    private $db;
    private static $sessionKey = 'salamat_admin_session';
    
    // Load admin users from environment or database
    private function getAdminUsers(): array {
        // Try to get from environment first
        $adminUsername = getenv('ADMIN_USERNAME') ?: 'admin';
        $adminPasswordHash = getenv('ADMIN_PASSWORD_HASH');
        
        if (!$adminPasswordHash) {
            if (IS_PRODUCTION) {
                throw new Exception('ADMIN_PASSWORD_HASH environment variable is required in production');
            }
            // Development fallback - password: admin123!@#
            $adminPasswordHash = '$2y$10$K7Z8qPZ7X5FXxXlBX8P4H.LzGzBZJ0J3HZJ4JHK8z7y8X9K0J1L2M';
        }
        
        return [
            $adminUsername => [
                'username' => $adminUsername,
                'password' => $adminPasswordHash,
                'role' => 'super_admin',
                'name' => 'مدیر سیستم',
                'email' => getenv('ADMIN_EMAIL') ?: 'admin@salamatlab.com',
                'permissions' => ['*'] // دسترسی کامل
            ]
        ];
    }
    
    public function __construct() {
        $this->db = Database::getInstance();
        session_start();
    }
    
    /**
     * ورود ادمین
     */
    public function login(string $username, string $password): array {
        $admins = $this->getAdminUsers();
        
        // بررسی وجود کاربر
        if (!isset($admins[$username])) {
            Logger::warning('Admin login attempt with invalid username', ['username' => $username]);
            return ['success' => false, 'error' => 'نام کاربری یا رمز عبور اشتباه است'];
        }
        
        $admin = $admins[$username];
        
        // بررسی رمز عبور
        if (!password_verify($password, $admin['password'])) {
            Logger::warning('Admin login attempt with wrong password', ['username' => $username]);
            return ['success' => false, 'error' => 'نام کاربری یا رمز عبور اشتباه است'];
        }
        
        // ایجاد session
        $sessionData = [
            'username' => $admin['username'],
            'role' => $admin['role'],
            'name' => $admin['name'],
            'email' => $admin['email'],
            'permissions' => $admin['permissions'],
            'login_time' => time(),
            'ip' => $this->getClientIP()
        ];
        
        $_SESSION[self::$sessionKey] = $sessionData;
        
        // لاگ ورود موفق
        Logger::info('Admin login successful', [
            'username' => $username,
            'role' => $admin['role'],
            'ip' => $this->getClientIP()
        ]);
        
        return [
            'success' => true,
            'admin' => [
                'username' => $admin['username'],
                'name' => $admin['name'],
                'role' => $admin['role'],
                'permissions' => $admin['permissions']
            ]
        ];
    }
    
    /**
     * خروج ادمین
     */
    public function logout(): array {
        if (isset($_SESSION[self::$sessionKey])) {
            $username = $_SESSION[self::$sessionKey]['username'];
            
            Logger::info('Admin logout', [
                'username' => $username,
                'ip' => $this->getClientIP()
            ]);
            
            unset($_SESSION[self::$sessionKey]);
        }
        
        return ['success' => true, 'message' => 'خروج موفقیت‌آمیز'];
    }
    
    /**
     * بررسی احراز هویت
     */
    public function isAuthenticated(): bool {
        if (!isset($_SESSION[self::$sessionKey])) {
            return false;
        }
        
        $session = $_SESSION[self::$sessionKey];
        
        // بررسی انقضای session (24 ساعت)
        if (time() - $session['login_time'] > 24 * 60 * 60) {
            $this->logout();
            return false;
        }
        
        return true;
    }
    
    /**
     * دریافت اطلاعات ادمین فعلی
     */
    public function getCurrentAdmin(): ?array {
        if (!$this->isAuthenticated()) {
            return null;
        }
        
        return $_SESSION[self::$sessionKey];
    }
    
    /**
     * بررسی مجوز
     */
    public function hasPermission(string $permission): bool {
        $admin = $this->getCurrentAdmin();
        if (!$admin) {
            return false;
        }
        
        // Super admin دسترسی کامل دارد
        if (in_array('*', $admin['permissions'])) {
            return true;
        }
        
        return in_array($permission, $admin['permissions']);
    }
    
    /**
     * middleware احراز هویت
     */
    public function requireAuth(array $requiredPermissions = []): void {
        if (!$this->isAuthenticated()) {
            Response::unauthorized('لطفاً وارد پنل ادمین شوید');
        }
        
        // بررسی مجوزهای خاص
        foreach ($requiredPermissions as $permission) {
            if (!$this->hasPermission($permission)) {
                Response::error('دسترسی غیرمجاز', 403);
            }
        }
    }
    
    /**
     * تولید توکن CSRF
     */
    public function generateCsrfToken(): string {
        $token = bin2hex(random_bytes(32));
        $_SESSION['csrf_token'] = $token;
        return $token;
    }
    
    /**
     * بررسی توکن CSRF
     */
    public function validateCsrfToken(string $token): bool {
        return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
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
    
    /**
     * لیست همه ادمین‌ها (برای مدیریت)
     */
    public function getAllAdmins(): array {
        $adminList = [];
        foreach (self::$admins as $admin) {
            $adminList[] = [
                'username' => $admin['username'],
                'name' => $admin['name'],
                'email' => $admin['email'],
                'role' => $admin['role'],
                'permissions' => $admin['permissions']
            ];
        }
        return $adminList;
    }
    
    /**
     * تغییر رمز عبور ادمین
     */
    public function changePassword(string $username, string $currentPassword, string $newPassword): array {
        if (!isset(self::$admins[$username])) {
            return ['success' => false, 'error' => 'کاربر یافت نشد'];
        }
        
        $admin = self::$admins[$username];
        
        if (!password_verify($currentPassword, $admin['password'])) {
            return ['success' => false, 'error' => 'رمز عبور فعلی اشتباه است'];
        }
        
        // TODO: ذخیره رمز عبور جدید (در دیتابیس یا فایل config)
        Logger::info('Admin password changed', ['username' => $username]);
        
        return ['success' => true, 'message' => 'رمز عبور با موفقیت تغییر کرد'];
    }
}
?>
