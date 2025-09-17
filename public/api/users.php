<?php
/**
 * User Management API - Unified Version for SaaS Platform
 * API مدیریت کاربران - نسخه یکپارچه برای پلتفرم SaaS
 */

define('APP_START_TIME', microtime(true));

// Load dependencies
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/core/Database.php';
require_once __DIR__ . '/core/Logger.php';
require_once __DIR__ . '/core/Response.php';

// Handle CORS and preflight requests
Response::setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    Response::success(null, 'Options handled', 200);
}

/**
 * User Management API Class
 */
class UserAPI {
    private $db;
    
    public function __construct() {
        try {
            $this->db = Database::getInstance();
            $this->initializeTables();
        } catch (Exception $e) {
            Logger::critical('UserAPI initialization failed', ['error' => $e->getMessage()]);
            Response::serverError('خطا در راه‌اندازی سیستم');
        }
    }
    
    /**
     * Handle incoming API request
     */
    public function handleRequest(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        
        try {
            switch ($method) {
                case 'GET':
                    $this->handleGet();
                    break;
                case 'POST':
                    $this->handlePost();
                    break;
                case 'PUT':
                    $this->handlePut();
                    break;
                default:
                    Response::error('متد پشتیبانی نمی‌شود', 405);
            }
        } catch (Exception $e) {
            Logger::error('User API request failed', [
                'error' => $e->getMessage(),
                'method' => $method,
                'uri' => $_SERVER['REQUEST_URI'] ?? ''
            ]);
            Response::serverError('خطا در پردازش درخواست');
        }
    }
    
    /**
     * Handle GET requests
     */
    private function handleGet(): void {
        $action = $_GET['action'] ?? 'profile';
        $phone = $_GET['phone'] ?? null;
        
        switch ($action) {
            case 'profile':
                if (!$phone) {
                    Response::error('شماره تلفن الزامی است');
                }
                $this->getUserProfile($phone);
                break;
                
            case 'addresses':
                if (!$phone) {
                    Response::error('شماره تلفن الزامی است');
                }
                $this->getUserAddresses($phone);
                break;
                
            case 'check':
                if (!$phone) {
                    Response::error('شماره تلفن الزامی است');
                }
                $this->checkUserExists($phone);
                break;
                
            default:
                Response::error('عملیات نامعتبر');
        }
    }
    
    /**
     * Handle POST requests
     */
    private function handlePost(): void {
        $input = $this->getInputData();
        $action = $input['action'] ?? 'register';
        
        switch ($action) {
            case 'register':
                $this->registerUser($input);
                break;
                
            case 'login':
                $this->loginUser($input);
                break;
                
            case 'verify_otp':
                $this->verifyOtp($input);
                break;
                
            case 'complete_profile':
                $this->completeProfile($input);
                break;
                
            case 'add_address':
                $this->addAddress($input);
                break;
                
            default:
                Response::error('عملیات نامعتبر');
        }
    }
    
    /**
     * Handle PUT requests
     */
    private function handlePut(): void {
        $input = $this->getInputData();
        $action = $input['action'] ?? 'update_profile';
        
        switch ($action) {
            case 'update_profile':
                $this->updateProfile($input);
                break;
                
            case 'update_address':
                $this->updateAddress($input);
                break;
                
            default:
                Response::error('عملیات نامعتبر');
        }
    }
    
    /**
     * Register new user
     */
    private function registerUser(array $input): void {
        $phone = $this->validatePhone($input['phone'] ?? '');
        
        // Check if user exists
        $existingUser = $this->getUserByPhone($phone);
        if ($existingUser) {
            if ($existingUser['is_verified']) {
                Response::error('کاربری با این شماره قبلاً ثبت شده است');
            }
            // If not verified, send new OTP
            $this->sendOtp($phone, 'register');
            return;
}

// Create new user
        try {
            $this->db->beginTransaction();
            
            $userId = $this->db->insert('users', [
                'phone' => $phone,
                'is_verified' => false,
                'is_active' => true,
                'created_at' => date('Y-m-d H:i:s')
            ]);
            
            $this->sendOtp($phone, 'register');
            
            $this->db->commit();
            
            Logger::info('User registered successfully', ['phone' => $phone, 'user_id' => $userId]);
            
            Response::success([
                'user_id' => $userId,
                'phone' => $phone,
                'requires_verification' => true
            ], 'کاربر با موفقیت ثبت شد. کد تایید ارسال گردید.');
            
        } catch (Exception $e) {
            $this->db->rollback();
            Logger::error('User registration failed', ['phone' => $phone, 'error' => $e->getMessage()]);
            Response::serverError('خطا در ثبت نام کاربر');
        }
    }
    
    /**
     * Login user
     */
    private function loginUser(array $input): void {
        $phone = $this->validatePhone($input['phone'] ?? '');
        
        $user = $this->getUserByPhone($phone);
        if (!$user) {
            Response::error('کاربری با این شماره یافت نشد');
        }
        
        if (!$user['is_active']) {
            Response::error('حساب کاربری غیرفعال است');
        }
        
        $this->sendOtp($phone, 'login');
        
        Response::success([], 'کد تایید ارسال شد');
    }
    
    /**
     * Verify OTP code
     */
    private function verifyOtp(array $input): void {
        $phone = $this->validatePhone($input['phone'] ?? '');
        $code = $input['code'] ?? '';
        
        if (strlen($code) !== 6 || !ctype_digit($code)) {
            Response::error('کد تایید باید ۶ رقم باشد');
        }
        
        // Validate OTP
        if (!$this->validateOtpCode($phone, $code)) {
            Response::error('کد تایید نامعتبر یا منقضی شده است');
        }
        
        // Update user status
        $user = $this->getUserByPhone($phone);
        if (!$user) {
            Response::error('کاربر یافت نشد');
        }
        
        try {
            $this->db->beginTransaction();

// Update user
            $this->db->update('users', [
                'is_verified' => true,
                'last_login_at' => date('Y-m-d H:i:s')
            ], ['id' => $user['id']]);
            
            // Mark OTP as used
            $this->db->update('otp_codes', [
                'is_used' => true,
                'used_at' => date('Y-m-d H:i:s')
            ], ['phone' => $phone, 'code' => $code, 'is_used' => false]);
            
            $this->db->commit();
            
            Logger::info('User OTP verified successfully', ['phone' => $phone, 'user_id' => $user['id']]);
            
            $userData = $this->getUserProfile($phone, false);
            
            Response::success([
                'user' => $userData,
                'requires_profile_completion' => !$user['is_profile_complete']
            ], 'ورود موفقیت‌آمیز');
            
        } catch (Exception $e) {
            $this->db->rollback();
            Logger::error('OTP verification failed', ['phone' => $phone, 'error' => $e->getMessage()]);
            Response::serverError('خطا در تایید کد');
        }
    }
    
    /**
     * Get user profile
     */
    private function getUserProfile(string $phone, bool $sendResponse = true) {
        $user = $this->getUserByPhone($phone);
        if (!$user) {
            if ($sendResponse) {
                Response::error('کاربر یافت نشد');
            }
            return null;
        }
        
        // Remove sensitive data
        unset($user['password_hash']);
        
        // Get addresses
        $addresses = $this->getUserAddresses($phone, false);
        $user['addresses'] = $addresses;
        
        if ($sendResponse) {
            Response::success($user);
        }
        
        return $user;
    }
    
    /**
     * Get user addresses
     */
    private function getUserAddresses(string $phone, bool $sendResponse = true) {
        $user = $this->getUserByPhone($phone);
        if (!$user) {
            if ($sendResponse) {
                Response::error('کاربر یافت نشد');
            }
            return [];
        }
        
        $addresses = $this->db->fetchAll(
            "SELECT * FROM user_addresses WHERE user_id = ? AND is_active = true ORDER BY is_default DESC, created_at DESC",
            [$user['id']]
        );
        
        if ($sendResponse) {
            Response::success($addresses);
        }
        
        return $addresses;
    }
    
    /**
     * Check if user exists
     */
    private function checkUserExists(string $phone): void {
        $user = $this->getUserByPhone($phone);
        Response::success([
            'exists' => $user !== null,
            'is_verified' => $user ? $user['is_verified'] : false,
            'is_profile_complete' => $user ? $user['is_profile_complete'] : false
        ]);
    }
    
    /**
     * Get user by phone number
     */
    private function getUserByPhone(string $phone): ?array {
        return $this->db->fetchOne("SELECT * FROM users WHERE phone = ?", [$phone]);
    }
    
    /**
     * Send OTP code
     */
    private function sendOtp(string $phone, string $purpose = 'login'): bool {
        $code = $this->generateOtpCode();
        $expiresAt = date('Y-m-d H:i:s', time() + OTP_TTL_SECONDS);
        
        try {
            // Delete old OTP codes
            $this->db->delete('otp_codes', ['phone' => $phone, 'purpose' => $purpose]);
            
            // Create new OTP
            $this->db->insert('otp_codes', [
                'phone' => $phone,
                'code' => $code,
                'purpose' => $purpose,
                'expires_at' => $expiresAt,
                'ip_address' => $this->getClientIP(),
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
            ]);
            
            // Send SMS
            if (function_exists('sendOtpSms')) {
                $smsResult = sendOtpSms($phone, $code);
                Logger::info('OTP SMS sent', ['phone' => $phone, 'success' => $smsResult]);
                return $smsResult;
            }
            
        return true;
            
        } catch (Exception $e) {
            Logger::error('OTP send failed', ['phone' => $phone, 'error' => $e->getMessage()]);
        return false;
    }
}

    /**
     * Validate OTP code
     */
    private function validateOtpCode(string $phone, string $code): bool {
        $otp = $this->db->fetchOne(
            "SELECT * FROM otp_codes WHERE phone = ? AND code = ? AND is_used = false AND expires_at > NOW()",
            [$phone, $code]
        );
        
        return $otp !== null;
    }
    
    /**
     * Generate OTP code
     */
    private function generateOtpCode(): string {
        return str_pad(mt_rand(100000, 999999), 6, '0', STR_PAD_LEFT);
    }
    
    /**
     * Validate phone number
     */
    private function validatePhone(string $phone): string {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        if (strlen($phone) === 11 && substr($phone, 0, 2) === '09') {
            return $phone;
        }
        
        if (strlen($phone) === 10 && substr($phone, 0, 1) === '9') {
            return '0' . $phone;
        }
        
        Response::error('شماره تلفن نامعتبر است');
    }
    
    /**
     * Get input data
     */
    private function getInputData(): array {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        
        if (str_contains($contentType, 'application/json')) {
            $input = json_decode(file_get_contents('php://input'), true);
            return is_array($input) ? $input : [];
        }
        
        return $_POST;
    }
    
    /**
     * Get client IP
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
     * Initialize database tables
     */
    private function initializeTables(): void {
        if (!$this->db->tableExists('users')) {
            $this->createUserTables();
        }
    }
    
    /**
     * Create user tables
     */
    private function createUserTables(): void {
        try {
            $sqlFile = __DIR__ . '/../../database-schema.sql';
            if (file_exists($sqlFile)) {
                $this->db->createTablesFromFile($sqlFile);
                Logger::info('Database tables created from schema file');
            } else {
                Logger::warning('Database schema file not found, creating basic tables');
                $this->createBasicTables();
            }
        } catch (Exception $e) {
            Logger::error('Failed to create database tables', ['error' => $e->getMessage()]);
            Response::serverError('خطا در ایجاد جداول دیتابیس');
        }
    }
    
    /**
     * Create basic tables
     */
    private function createBasicTables(): void {
        $tables = [
            "CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                phone VARCHAR(11) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE,
                first_name VARCHAR(50),
                last_name VARCHAR(50),
                national_id VARCHAR(10) UNIQUE,
                birth_date DATE,
                gender ENUM('male', 'female'),
                city VARCHAR(50),
                province VARCHAR(50),
                has_basic_insurance ENUM('yes', 'no') DEFAULT 'no',
                basic_insurance VARCHAR(100),
                complementary_insurance VARCHAR(100),
                is_profile_complete BOOLEAN DEFAULT FALSE,
                is_verified BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                last_login_at TIMESTAMP NULL,
                INDEX idx_phone (phone),
                INDEX idx_email (email),
                INDEX idx_national_id (national_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
            
            "CREATE TABLE IF NOT EXISTS otp_codes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                phone VARCHAR(11) NOT NULL,
                code VARCHAR(6) NOT NULL,
                purpose ENUM('login', 'register', 'reset_password', 'verify_phone') DEFAULT 'login',
                is_used BOOLEAN DEFAULT FALSE,
                attempts INT DEFAULT 0,
                max_attempts INT DEFAULT 5,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL,
                used_at TIMESTAMP NULL,
                ip_address VARCHAR(45),
                user_agent TEXT,
                INDEX idx_phone (phone),
                INDEX idx_expires_at (expires_at),
                INDEX idx_phone_code (phone, code)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
            
            "CREATE TABLE IF NOT EXISTS user_addresses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(100) NOT NULL,
                address TEXT NOT NULL,
                postal_code VARCHAR(10),
                city VARCHAR(50),
                province VARCHAR(50),
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                contact_phone VARCHAR(11),
                contact_name VARCHAR(100),
                is_default BOOLEAN DEFAULT FALSE,
                is_active BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_is_default (is_default)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
        ];
        
        $this->db->beginTransaction();
        
        try {
            foreach ($tables as $sql) {
                $this->db->getConnection()->exec($sql);
            }
            $this->db->commit();
            Logger::info('Basic database tables created successfully');
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    // TODO: Implement additional methods for profile completion, address management, etc.
}

// Execute API
try {
    $api = new UserAPI();
    $api->handleRequest();
} catch (Exception $e) {
    Logger::critical('API initialization failed', ['error' => $e->getMessage()]);
    Response::serverError('خطا در راه‌اندازی سیستم');
}
?>
