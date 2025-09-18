<?php
/**
 * Environment Configuration Manager
 * مدیریت حرفه‌ای متغیرهای محیطی برای SalamatLab
 */

class Environment {
    private static $instance = null;
    private $config = [];
    private $isLoaded = false;
    
    private function __construct() {
        $this->loadEnvironment();
    }
    
    /**
     * Singleton Pattern
     */
    public static function getInstance(): Environment {
        if (self::$instance === null) {
            self::$instance = new Environment();
        }
        return self::$instance;
    }
    
    /**
     * بارگذاری متغیرهای محیطی از منابع مختلف
     */
    private function loadEnvironment(): void {
        // اولویت 1: متغیرهای محیطی سیستم
        $this->loadSystemEnv();
        
        // اولویت 2: فایل .env (اگر وجود داشته باشد)
        $this->loadEnvFile();
        
        // اولویت 3: مقادیر پیش‌فرض امن
        $this->loadDefaults();
        
        // اعتبارسنجی تنظیمات ضروری
        $this->validateRequired();
        
        $this->isLoaded = true;
    }
    
    /**
     * بارگذاری از متغیرهای سیستم
     */
    private function loadSystemEnv(): void {
        $systemVars = [
            // Database
            'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS', 'DB_PORT',
            
            // SMS Configuration
            'SMSIR_API_KEY', 'SMSIR_TEMPLATE_ID', 'SMSIR_TEMPLATE_PARAM_NAME',
            'CHECKUP_CONFIRM_TEMPLATE_ID', 'FEEDBACK_CONFIRM_TEMPLATE_ID',
            'CAREERS_CONFIRM_TEMPLATE_ID', 'CONTACT_CONFIRM_TEMPLATE_ID',
            'SMSIR_STAFF_TEMPLATE_ID', 'STAFF_NOTIFY_MOBILE',
            
            // Security
            'OTP_SECRET', 'ADMIN_USERNAME', 'ADMIN_PASSWORD_HASH',
            'JWT_SECRET', 'SESSION_SECRET',
            
            // Email
            'ADMIN_EMAIL', 'FROM_EMAIL', 'REPLY_TO_EMAIL',
            'SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'SMTP_SECURE',
            
            // Application
            'APP_ENV', 'APP_DEBUG', 'ALLOWED_ORIGINS', 'RATE_LIMIT',
            'APP_URL', 'API_URL'
        ];
        
        foreach ($systemVars as $var) {
            $value = getenv($var);
            if ($value !== false) {
                $this->config[$var] = $value;
            }
        }
    }
    
    /**
     * بارگذاری از فایل .env
     */
    private function loadEnvFile(): void {
        $envFile = dirname(__DIR__, 2) . '/.env';
        
        if (!file_exists($envFile)) {
            return;
        }
        
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            // Skip comments
            if (strpos(trim($line), '#') === 0) {
                continue;
            }
            
            // Parse KEY=VALUE
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remove quotes
                if (preg_match('/^(["\'])(.*)\1$/', $value, $matches)) {
                    $value = $matches[2];
                }
                
                // Only set if not already set by system env
                if (!isset($this->config[$key])) {
                    $this->config[$key] = $value;
                }
            }
        }
    }
    
    /**
     * تنظیم مقادیر پیش‌فرض امن
     */
    private function loadDefaults(): void {
        $defaults = [
            // Database defaults
            'DB_HOST' => 'localhost',
            'DB_PORT' => '3306',
            'DB_CHARSET' => 'utf8mb4',
            
            // Application defaults
            'APP_ENV' => 'production',
            'APP_DEBUG' => 'false',
            'APP_TIMEZONE' => 'Asia/Tehran',
            
            // Security defaults
            'OTP_TTL_SECONDS' => '300',
            'SESSION_LIFETIME' => '86400', // 24 hours
            'RATE_LIMIT' => '100',
            'MAX_LOGIN_ATTEMPTS' => '5',
            
            // Email defaults
            'SMTP_PORT' => '587',
            'SMTP_SECURE' => 'tls',
            'EMAIL_CHARSET' => 'UTF-8',
            
            // SMS defaults
            'SMSIR_TEMPLATE_PARAM_NAME' => 'Code'
        ];
        
        foreach ($defaults as $key => $value) {
            if (!isset($this->config[$key])) {
                $this->config[$key] = $value;
            }
        }
    }
    
    /**
     * اعتبارسنجی متغیرهای ضروری
     */
    private function validateRequired(): void {
        $required = [
            'DB_HOST', 'DB_NAME', 'DB_USER', 'DB_PASS'
        ];
        
        // در production، موارد بیشتری ضروری است
        if ($this->isProduction()) {
            $required = array_merge($required, [
                'SMSIR_API_KEY', 'OTP_SECRET', 'ADMIN_PASSWORD_HASH',
                'ADMIN_EMAIL', 'FROM_EMAIL'
            ]);
        }
        
        $missing = [];
        foreach ($required as $key) {
            if (empty($this->config[$key])) {
                $missing[] = $key;
            }
        }
        
        if (!empty($missing)) {
            throw new Exception('Required environment variables missing: ' . implode(', ', $missing));
        }
    }
    
    /**
     * دریافت مقدار متغیر
     */
    public function get(string $key, $default = null) {
        return $this->config[$key] ?? $default;
    }
    
    /**
     * دریافت مقدار به عنوان boolean
     */
    public function getBool(string $key, bool $default = false): bool {
        $value = $this->get($key);
        
        if ($value === null) {
            return $default;
        }
        
        return in_array(strtolower($value), ['true', '1', 'yes', 'on']);
    }
    
    /**
     * دریافت مقدار به عنوان integer
     */
    public function getInt(string $key, int $default = 0): int {
        $value = $this->get($key);
        return is_numeric($value) ? (int) $value : $default;
    }
    
    /**
     * دریافت مقدار به عنوان array (comma separated)
     */
    public function getArray(string $key, array $default = []): array {
        $value = $this->get($key);
        
        if (empty($value)) {
            return $default;
        }
        
        return array_map('trim', explode(',', $value));
    }
    
    /**
     * بررسی محیط production
     */
    public function isProduction(): bool {
        return $this->get('APP_ENV') === 'production';
    }
    
    /**
     * بررسی حالت debug
     */
    public function isDebug(): bool {
        return $this->getBool('APP_DEBUG');
    }
    
    /**
     * دریافت تنظیمات دیتابیس
     */
    public function getDatabaseConfig(): array {
        return [
            'host' => $this->get('DB_HOST'),
            'port' => $this->getInt('DB_PORT', 3306),
            'dbname' => $this->get('DB_NAME'),
            'username' => $this->get('DB_USER'),
            'password' => $this->get('DB_PASS'),
            'charset' => $this->get('DB_CHARSET', 'utf8mb4')
        ];
    }
    
    /**
     * دریافت تنظیمات SMS
     */
    public function getSmsConfig(): array {
        return [
            'api_key' => $this->get('SMSIR_API_KEY'),
            'api_url' => 'https://api.sms.ir/v1/send/verify',
            'template_id' => $this->getInt('SMSIR_TEMPLATE_ID'),
            'template_param' => $this->get('SMSIR_TEMPLATE_PARAM_NAME', 'Code'),
            'templates' => [
                'checkup_confirm' => $this->getInt('CHECKUP_CONFIRM_TEMPLATE_ID'),
                'feedback_confirm' => $this->getInt('FEEDBACK_CONFIRM_TEMPLATE_ID'),
                'careers_confirm' => $this->getInt('CAREERS_CONFIRM_TEMPLATE_ID'),
                'contact_confirm' => $this->getInt('CONTACT_CONFIRM_TEMPLATE_ID'),
                'staff_notify' => $this->getInt('SMSIR_STAFF_TEMPLATE_ID')
            ],
            'staff_mobile' => $this->get('STAFF_NOTIFY_MOBILE')
        ];
    }
    
    /**
     * دریافت تنظیمات امنیتی
     */
    public function getSecurityConfig(): array {
        return [
            'otp_secret' => $this->get('OTP_SECRET'),
            'otp_ttl' => $this->getInt('OTP_TTL_SECONDS', 300),
            'jwt_secret' => $this->get('JWT_SECRET'),
            'session_secret' => $this->get('SESSION_SECRET'),
            'session_lifetime' => $this->getInt('SESSION_LIFETIME', 86400),
            'rate_limit' => $this->getInt('RATE_LIMIT', 100),
            'max_login_attempts' => $this->getInt('MAX_LOGIN_ATTEMPTS', 5),
            'allowed_origins' => $this->getArray('ALLOWED_ORIGINS')
        ];
    }
    
    /**
     * دریافت تنظیمات ایمیل
     */
    public function getEmailConfig(): array {
        return [
            'admin_email' => $this->get('ADMIN_EMAIL'),
            'from_email' => $this->get('FROM_EMAIL'),
            'reply_to_email' => $this->get('REPLY_TO_EMAIL'),
            'smtp' => [
                'host' => $this->get('SMTP_HOST'),
                'port' => $this->getInt('SMTP_PORT', 587),
                'username' => $this->get('SMTP_USER'),
                'password' => $this->get('SMTP_PASS'),
                'secure' => $this->get('SMTP_SECURE', 'tls')
            ],
            'charset' => $this->get('EMAIL_CHARSET', 'UTF-8')
        ];
    }
    
    /**
     * دریافت تنظیمات Admin
     */
    public function getAdminConfig(): array {
        return [
            'username' => $this->get('ADMIN_USERNAME'),
            'password_hash' => $this->get('ADMIN_PASSWORD_HASH')
        ];
    }
    
    /**
     * نمایش وضعیت تنظیمات (برای دیباگ)
     */
    public function getStatus(): array {
        return [
            'loaded' => $this->isLoaded,
            'environment' => $this->get('APP_ENV'),
            'debug' => $this->isDebug(),
            'database_configured' => !empty($this->get('DB_NAME')),
            'sms_configured' => !empty($this->get('SMSIR_API_KEY')),
            'email_configured' => !empty($this->get('FROM_EMAIL')),
            'admin_configured' => !empty($this->get('ADMIN_PASSWORD_HASH'))
        ];
    }
}
