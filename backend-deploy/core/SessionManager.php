<?php
/**
 * Session Manager - مدیریت حرفه‌ای جلسات کاربری
 * تعویض localStorage با Backend Session Management
 */

class SessionManager {
    private static $instance = null;
    private $db;
    private $env;
    private $sessionTable = 'user_sessions';
    
    private function __construct() {
        $this->db = Database::getInstance();
        $this->env = Environment::getInstance();
        $this->initializeSessionTable();
        $this->configureSession();
    }
    
    public static function getInstance(): SessionManager {
        if (self::$instance === null) {
            self::$instance = new SessionManager();
        }
        return self::$instance;
    }
    
    /**
     * تنظیم PHP session
     */
    private function configureSession(): void {
        // Session configuration
        ini_set('session.cookie_httponly', 1);
        ini_set('session.cookie_secure', $this->env->isProduction() ? 1 : 0);
        ini_set('session.cookie_samesite', 'Lax');
        ini_set('session.use_strict_mode', 1);
        ini_set('session.cookie_lifetime', $this->env->getInt('SESSION_LIFETIME', 86400));
        
        // Session name
        session_name('SALAMAT_SESSION');
        
        // Custom session handler - store in database
        session_set_save_handler(
            [$this, 'sessionOpen'],
            [$this, 'sessionClose'],
            [$this, 'sessionRead'],
            [$this, 'sessionWrite'],
            [$this, 'sessionDestroy'],
            [$this, 'sessionGc']
        );
        
        register_shutdown_function('session_write_close');
    }
    
    /**
     * ایجاد جدول sessions
     */
    private function initializeSessionTable(): void {
        $sql = "
            CREATE TABLE IF NOT EXISTS {$this->sessionTable} (
                id VARCHAR(128) PRIMARY KEY,
                user_id INT,
                data LONGTEXT,
                ip_address VARCHAR(45),
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                expires_at TIMESTAMP,
                is_active BOOLEAN DEFAULT TRUE,
                
                INDEX idx_user_id (user_id),
                INDEX idx_expires_at (expires_at),
                INDEX idx_is_active (is_active),
                
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ";
        
        try {
            $this->db->query($sql);
        } catch (Exception $e) {
            Logger::error('Failed to create sessions table', ['error' => $e->getMessage()]);
        }
    }
    
    /**
     * شروع session
     */
    public function start(): bool {
        if (session_status() === PHP_SESSION_ACTIVE) {
            return true;
        }
        
        return session_start();
    }
    
    /**
     * ایجاد session جدید برای کاربر
     */
    public function createUserSession(int $userId, array $userData = []): string {
        $this->start();
        
        // Regenerate session ID برای امنیت
        session_regenerate_id(true);
        $sessionId = session_id();
        
        // ذخیره اطلاعات در session
        $_SESSION['user_id'] = $userId;
        $_SESSION['user_data'] = $userData;
        $_SESSION['created_at'] = time();
        $_SESSION['last_activity'] = time();
        
        // ذخیره metadata در دیتابیس
        $this->updateSessionMetadata($sessionId, $userId);
        
        Logger::info('User session created', [
            'user_id' => $userId,
            'session_id' => $sessionId,
            'ip' => $this->getClientIP()
        ]);
        
        return $sessionId;
    }
    
    /**
     * بررسی وجود session معتبر
     */
    public function isValidSession(): bool {
        if (!$this->start()) {
            return false;
        }
        
        // بررسی وجود user_id
        if (!isset($_SESSION['user_id'])) {
            return false;
        }
        
        // بررسی انقضا
        $maxLifetime = $this->env->getInt('SESSION_LIFETIME', 86400);
        if (isset($_SESSION['created_at']) && 
            (time() - $_SESSION['created_at']) > $maxLifetime) {
            $this->destroySession();
            return false;
        }
        
        // بررسی last activity (اختیاری)
        $maxInactivity = 3600; // 1 hour
        if (isset($_SESSION['last_activity']) && 
            (time() - $_SESSION['last_activity']) > $maxInactivity) {
            $this->destroySession();
            return false;
        }
        
        // بروزرسانی last activity
        $_SESSION['last_activity'] = time();
        
        return true;
    }
    
    /**
     * دریافت اطلاعات کاربر از session
     */
    public function getCurrentUser(): ?array {
        if (!$this->isValidSession()) {
            return null;
        }
        
        $userId = $_SESSION['user_id'];
        
        // دریافت اطلاعات کامل از دیتابیس
        $sql = "
            SELECT u.*, 
                   GROUP_CONCAT(
                       CONCAT(ua.id, ':', ua.title, ':', ua.address, ':', ua.is_default)
                       SEPARATOR '|'
                   ) as addresses
            FROM users u
            LEFT JOIN user_addresses ua ON u.id = ua.user_id AND ua.is_active = 1
            WHERE u.id = ? AND u.is_active = 1
            GROUP BY u.id
        ";
        
        $user = $this->db->fetchOne($sql, [$userId]);
        
        if (!$user) {
            $this->destroySession();
            return null;
        }
        
        // پردازش آدرس‌ها
        $user['addresses'] = $this->parseAddresses($user['addresses']);
        
        return $user;
    }
    
    /**
     * بروزرسانی اطلاعات کاربر در session
     */
    public function updateUserData(array $userData): bool {
        if (!$this->isValidSession()) {
            return false;
        }
        
        $_SESSION['user_data'] = array_merge($_SESSION['user_data'] ?? [], $userData);
        return true;
    }
    
    /**
     * نابود کردن session
     */
    public function destroySession(): bool {
        if (!$this->start()) {
            return false;
        }
        
        $sessionId = session_id();
        $userId = $_SESSION['user_id'] ?? null;
        
        // حذف از دیتابیس
        if ($sessionId) {
            $this->db->query(
                "UPDATE {$this->sessionTable} SET is_active = 0 WHERE id = ?", 
                [$sessionId]
            );
        }
        
        // پاک کردن session
        $_SESSION = [];
        
        // حذف session cookie
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'],
            $params['secure'],
            $params['httponly']
        );
        
        session_destroy();
        
        Logger::info('User session destroyed', [
            'user_id' => $userId,
            'session_id' => $sessionId
        ]);
        
        return true;
    }
    
    /**
     * حذف تمام sessions کاربر (logout از همه دستگاه‌ها)
     */
    public function destroyAllUserSessions(int $userId): bool {
        $sql = "UPDATE {$this->sessionTable} SET is_active = 0 WHERE user_id = ?";
        $this->db->query($sql, [$userId]);
        
        Logger::info('All user sessions destroyed', ['user_id' => $userId]);
        return true;
    }
    
    /**
     * دریافت sessions فعال کاربر
     */
    public function getUserActiveSessions(int $userId): array {
        $sql = "
            SELECT id, ip_address, user_agent, created_at, updated_at
            FROM {$this->sessionTable}
            WHERE user_id = ? AND is_active = 1 AND expires_at > NOW()
            ORDER BY updated_at DESC
        ";
        
        return $this->db->fetchAll($sql, [$userId]);
    }
    
    /**
     * پاکسازی sessions منقضی شده
     */
    public function cleanupExpiredSessions(): int {
        $sql = "DELETE FROM {$this->sessionTable} WHERE expires_at < NOW() OR is_active = 0";
        $stmt = $this->db->query($sql);
        return $stmt->rowCount();
    }
    
    // Custom Session Handlers
    
    public function sessionOpen($savePath, $sessionName): bool {
        return true;
    }
    
    public function sessionClose(): bool {
        return true;
    }
    
    public function sessionRead($sessionId): string {
        $sql = "SELECT data FROM {$this->sessionTable} WHERE id = ? AND is_active = 1 AND expires_at > NOW()";
        $result = $this->db->fetchOne($sql, [$sessionId]);
        
        return $result ? $result['data'] : '';
    }
    
    public function sessionWrite($sessionId, $data): bool {
        $expiresAt = date('Y-m-d H:i:s', time() + $this->env->getInt('SESSION_LIFETIME', 86400));
        
        $sql = "
            INSERT INTO {$this->sessionTable} (id, data, ip_address, user_agent, expires_at)
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                data = VALUES(data),
                ip_address = VALUES(ip_address),
                user_agent = VALUES(user_agent),
                expires_at = VALUES(expires_at),
                updated_at = CURRENT_TIMESTAMP
        ";
        
        try {
            $this->db->query($sql, [
                $sessionId,
                $data,
                $this->getClientIP(),
                $_SERVER['HTTP_USER_AGENT'] ?? '',
                $expiresAt
            ]);
            return true;
        } catch (Exception $e) {
            Logger::error('Session write failed', ['error' => $e->getMessage()]);
            return false;
        }
    }
    
    public function sessionDestroy($sessionId): bool {
        $sql = "DELETE FROM {$this->sessionTable} WHERE id = ?";
        $this->db->query($sql, [$sessionId]);
        return true;
    }
    
    public function sessionGc($maxLifetime): bool {
        $sql = "DELETE FROM {$this->sessionTable} WHERE expires_at < NOW()";
        $stmt = $this->db->query($sql);
        return $stmt->rowCount();
    }
    
    // Helper Methods
    
    private function updateSessionMetadata(string $sessionId, int $userId): void {
        $sql = "UPDATE {$this->sessionTable} SET user_id = ? WHERE id = ?";
        $this->db->query($sql, [$userId, $sessionId]);
    }
    
    private function getClientIP(): string {
        $ipKeys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
        
        foreach ($ipKeys as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = $_SERVER[$key];
                // اگر comma-separated باشد، اولین IP را بگیر
                if (strpos($ip, ',') !== false) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                return $ip;
            }
        }
        
        return 'unknown';
    }
    
    private function parseAddresses(?string $addressesStr): array {
        if (empty($addressesStr)) {
            return [];
        }
        
        $addresses = [];
        $addressParts = explode('|', $addressesStr);
        
        foreach ($addressParts as $part) {
            $fields = explode(':', $part, 4);
            if (count($fields) >= 4) {
                $addresses[] = [
                    'id' => $fields[0],
                    'title' => $fields[1],
                    'address' => $fields[2],
                    'is_default' => (bool) $fields[3]
                ];
            }
        }
        
        return $addresses;
    }
}
