<?php
/**
 * Authentication Manager - مدیریت کامل احراز هویت
 * جایگزین localStorage mixing با Backend Authentication
 */

require_once 'SessionManager.php';
require_once 'Database.php';
require_once 'Logger.php';
require_once 'Environment.php';

class AuthManager {
    private static $instance = null;
    private $db;
    private $env;
    private $sessionManager;
    private $otpTable = 'otp_codes';
    
    private function __construct() {
        $this->db = Database::getInstance();
        $this->env = Environment::getInstance();
        $this->sessionManager = SessionManager::getInstance();
        $this->initializeOtpTable();
    }
    
    public static function getInstance(): AuthManager {
        if (self::$instance === null) {
            self::$instance = new AuthManager();
        }
        return self::$instance;
    }
    
    /**
     * ایجاد جدول OTP
     */
    private function initializeOtpTable(): void {
        $sql = "
            CREATE TABLE IF NOT EXISTS {$this->otpTable} (
                id INT AUTO_INCREMENT PRIMARY KEY,
                phone VARCHAR(11) NOT NULL,
                code VARCHAR(6) NOT NULL,
                purpose ENUM('login', 'register', 'reset_password', 'verify_phone') DEFAULT 'login',
                
                -- وضعیت و زمان
                is_used BOOLEAN DEFAULT FALSE,
                attempts INT DEFAULT 0,
                max_attempts INT DEFAULT 5,
                
                -- زمان‌بندی
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP NOT NULL,
                used_at TIMESTAMP NULL,
                
                -- متادیتا
                ip_address VARCHAR(45),
                user_agent TEXT,
                
                -- ایندکس‌ها
                INDEX idx_phone (phone),
                INDEX idx_expires_at (expires_at),
                INDEX idx_phone_code (phone, code)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
        ";
        
        try {
            $this->db->query($sql);
        } catch (Exception $e) {
            Logger::error('Failed to create OTP table', ['error' => $e->getMessage()]);
        }
    }
    
    /**
     * شروع فرآیند احراز هویت با شماره تلفن
     */
    public function initiateLogin(string $phone): array {
        // اعتبارسنجی شماره تلفن
        $phone = $this->normalizePhone($phone);
        if (!$this->isValidPhone($phone)) {
            return [
                'success' => false,
                'error' => 'شماره تلفن نامعتبر است'
            ];
        }
        
        // بررسی محدودیت تعداد درخواست
        if (!$this->checkRateLimit($phone)) {
            return [
                'success' => false,
                'error' => 'تعداد درخواست‌های شما بیش از حد مجاز است. لطفاً بعداً تلاش کنید.'
            ];
        }
        
        // بررسی وجود کاربر
        $user = $this->findUserByPhone($phone);
        $isNewUser = ($user === null);
        
        // تولید و ارسال OTP
        $otpResult = $this->generateAndSendOtp($phone, 'login');
        
        if (!$otpResult['success']) {
            return [
                'success' => false,
                'error' => 'خطا در ارسال کد تأیید'
            ];
        }
        
        Logger::info('Login initiated', [
            'phone' => $phone,
            'is_new_user' => $isNewUser,
            'ip' => $this->getClientIP()
        ]);
        
        return [
            'success' => true,
            'needs_otp' => true,
            'is_new_user' => $isNewUser,
            'expires_in' => $this->env->getInt('OTP_TTL_SECONDS', 300)
        ];
    }
    
    /**
     * تأیید OTP و ایجاد session
     */
    public function verifyOtpAndLogin(string $phone, string $code): array {
        $phone = $this->normalizePhone($phone);
        
        // تأیید OTP
        $otpResult = $this->verifyOtp($phone, $code, 'login');
        
        if (!$otpResult['success']) {
            return [
                'success' => false,
                'error' => $otpResult['error']
            ];
        }
        
        // پیدا کردن یا ایجاد کاربر
        $user = $this->findUserByPhone($phone);
        $isNewUser = false;
        
        if ($user === null) {
            // ایجاد کاربر جدید
            $user = $this->createUser($phone);
            $isNewUser = true;
        }
        
        // ایجاد session
        $sessionId = $this->sessionManager->createUserSession($user['id'], [
            'phone' => $user['phone'],
            'is_profile_complete' => (bool) $user['is_profile_complete']
        ]);
        
        // آماده‌سازی اطلاعات کاربر برای فرانت‌اند
        $userData = $this->formatUserData($user);
        
        Logger::info('User logged in successfully', [
            'user_id' => $user['id'],
            'phone' => $phone,
            'is_new_user' => $isNewUser,
            'session_id' => $sessionId
        ]);
        
        return [
            'success' => true,
            'user' => $userData,
            'is_new_user' => $isNewUser,
            'session_id' => $sessionId
        ];
    }
    
    /**
     * بررسی وضعیت احراز هویت
     */
    public function checkAuthStatus(): array {
        $user = $this->sessionManager->getCurrentUser();
        
        if ($user === null) {
            return [
                'authenticated' => false,
                'user' => null
            ];
        }
        
        return [
            'authenticated' => true,
            'user' => $this->formatUserData($user)
        ];
    }
    
    /**
     * تکمیل پروفایل کاربر
     */
    public function completeProfile(array $profileData): array {
        $user = $this->sessionManager->getCurrentUser();
        
        if (!$user) {
            return [
                'success' => false,
                'error' => 'کاربر احراز هویت نشده'
            ];
        }
        
        // اعتبارسنجی داده‌ها
        $validationResult = $this->validateProfileData($profileData);
        if (!$validationResult['valid']) {
            return [
                'success' => false,
                'error' => 'اطلاعات وارد شده نامعتبر است',
                'validation_errors' => $validationResult['errors']
            ];
        }
        
        // بروزرسانی پروفایل
        try {
            $updateData = [
                'first_name' => $profileData['firstName'] ?? '',
                'last_name' => $profileData['lastName'] ?? '',
                'email' => $profileData['email'] ?? '',
                'national_id' => $profileData['nationalId'] ?? '',
                'birth_date' => $profileData['birthDate'] ?? null,
                'gender' => $profileData['gender'] ?? '',
                'city' => $profileData['city'] ?? '',
                'has_basic_insurance' => $profileData['hasBasicInsurance'] ?? 'no',
                'basic_insurance' => $profileData['basicInsurance'] ?? '',
                'complementary_insurance' => $profileData['complementaryInsurance'] ?? '',
                'is_profile_complete' => true
            ];
            
            $this->db->update('users', $updateData, ['id' => $user['id']]);
            
            // بروزرسانی session
            $this->sessionManager->updateUserData([
                'is_profile_complete' => true
            ]);
            
            Logger::info('User profile completed', [
                'user_id' => $user['id'],
                'phone' => $user['phone']
            ]);
            
            return [
                'success' => true,
                'user' => $this->formatUserData(array_merge($user, $updateData))
            ];
            
        } catch (Exception $e) {
            Logger::error('Profile completion failed', [
                'user_id' => $user['id'],
                'error' => $e->getMessage()
            ]);
            
            return [
                'success' => false,
                'error' => 'خطا در ذخیره اطلاعات'
            ];
        }
    }
    
    /**
     * خروج از سیستم
     */
    public function logout(): array {
        $result = $this->sessionManager->destroySession();
        
        return [
            'success' => $result
        ];
    }
    
    /**
     * خروج از همه دستگاه‌ها
     */
    public function logoutAllDevices(): array {
        $user = $this->sessionManager->getCurrentUser();
        
        if (!$user) {
            return [
                'success' => false,
                'error' => 'کاربر احراز هویت نشده'
            ];
        }
        
        $result = $this->sessionManager->destroyAllUserSessions($user['id']);
        
        return [
            'success' => $result
        ];
    }
    
    /**
     * ارسال مجدد OTP
     */
    public function resendOtp(string $phone): array {
        $phone = $this->normalizePhone($phone);
        
        // بررسی محدودیت زمانی
        if (!$this->checkResendLimit($phone)) {
            return [
                'success' => false,
                'error' => 'لطفاً 60 ثانیه منتظر بمانید'
            ];
        }
        
        $result = $this->generateAndSendOtp($phone, 'login');
        
        return $result;
    }
    
    // Helper Methods
    
    private function normalizePhone(string $phone): string {
        // حذف کاراکترهای غیرضروری
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        // تبدیل به فرمت استاندارد (11 رقمی با 0)
        if (strlen($phone) === 10) {
            $phone = '0' . $phone;
        }
        
        return $phone;
    }
    
    private function isValidPhone(string $phone): bool {
        return preg_match('/^09\d{9}$/', $phone);
    }
    
    private function findUserByPhone(string $phone): ?array {
        $sql = "SELECT * FROM users WHERE phone = ? AND is_active = 1";
        return $this->db->fetchOne($sql, [$phone]);
    }
    
    private function createUser(string $phone): array {
        $userData = [
            'phone' => $phone,
            'is_profile_complete' => false,
            'is_verified' => true, // چون OTP تأیید شده
            'is_active' => true
        ];
        
        $userId = $this->db->insert('users', $userData);
        $userData['id'] = $userId;
        
        Logger::info('New user created', [
            'user_id' => $userId,
            'phone' => $phone
        ]);
        
        return $userData;
    }
    
    private function generateAndSendOtp(string $phone, string $purpose = 'login'): array {
        // تولید کد
        $code = str_pad(rand(100000, 999999), 6, '0', STR_PAD_LEFT);
        $expiresAt = date('Y-m-d H:i:s', time() + $this->env->getInt('OTP_TTL_SECONDS', 300));
        
        // ذخیره در دیتابیس
        try {
            $this->db->insert($this->otpTable, [
                'phone' => $phone,
                'code' => $code,
                'purpose' => $purpose,
                'expires_at' => $expiresAt,
                'ip_address' => $this->getClientIP(),
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
            ]);
        } catch (Exception $e) {
            Logger::error('Failed to save OTP', ['error' => $e->getMessage()]);
            return ['success' => false, 'error' => 'خطا در تولید کد'];
        }
        
        // ارسال SMS
        $smsResult = $this->sendOtpSms($phone, $code);
        
        if (!$smsResult) {
            Logger::error('SMS sending failed', ['phone' => $phone]);
            
            // در development، کد را log کن
            if (!$this->env->isProduction()) {
                Logger::info('OTP Code (Development)', ['phone' => $phone, 'code' => $code]);
            }
        }
        
        return [
            'success' => true,
            'expires_in' => $this->env->getInt('OTP_TTL_SECONDS', 300)
        ];
    }
    
    private function verifyOtp(string $phone, string $code, string $purpose = 'login'): array {
        // پیدا کردن OTP معتبر
        $sql = "
            SELECT * FROM {$this->otpTable}
            WHERE phone = ? AND code = ? AND purpose = ? 
                AND is_used = 0 AND expires_at > NOW() AND attempts < max_attempts
            ORDER BY created_at DESC
            LIMIT 1
        ";
        
        $otp = $this->db->fetchOne($sql, [$phone, $code, $purpose]);
        
        if (!$otp) {
            // افزایش تعداد تلاش‌های ناموفق
            $this->incrementOtpAttempts($phone, $code);
            
            return [
                'success' => false,
                'error' => 'کد تأیید نامعتبر یا منقضی شده'
            ];
        }
        
        // علامت‌گذاری به عنوان استفاده شده
        $this->db->update($this->otpTable, [
            'is_used' => true,
            'used_at' => date('Y-m-d H:i:s')
        ], ['id' => $otp['id']]);
        
        return ['success' => true];
    }
    
    private function incrementOtpAttempts(string $phone, string $code): void {
        $sql = "
            UPDATE {$this->otpTable} 
            SET attempts = attempts + 1 
            WHERE phone = ? AND code = ? AND is_used = 0
        ";
        $this->db->query($sql, [$phone, $code]);
    }
    
    private function sendOtpSms(string $phone, string $code): bool {
        $smsConfig = $this->env->getSmsConfig();
        
        if (empty($smsConfig['api_key']) || empty($smsConfig['template_id'])) {
            Logger::warning('SMS configuration incomplete');
            return false;
        }
        
        // تبدیل شماره برای API
        $apiPhone = (strlen($phone) === 11 && $phone[0] === '0') ? substr($phone, 1) : $phone;
        
        $payload = [
            'mobile' => $apiPhone,
            'templateId' => $smsConfig['template_id'],
            'parameters' => [
                [
                    'name' => $smsConfig['template_param'],
                    'value' => $code
                ]
            ]
        ];
        
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $smsConfig['api_url'],
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'x-api-key: ' . $smsConfig['api_key'],
                'Accept: application/json'
            ]
        ]);
        
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);
        
        if ($error || $httpCode !== 200) {
            Logger::error('SMS API error', [
                'http_code' => $httpCode,
                'error' => $error,
                'response' => $result
            ]);
            return false;
        }
        
        $response = json_decode($result, true);
        return isset($response['status']) && $response['status'] == 1;
    }
    
    private function formatUserData(array $user): array {
        return [
            'id' => $user['id'],
            'phone' => $user['phone'],
            'firstName' => $user['first_name'] ?? '',
            'lastName' => $user['last_name'] ?? '',
            'email' => $user['email'] ?? '',
            'nationalId' => $user['national_id'] ?? '',
            'birthDate' => $user['birth_date'] ?? '',
            'gender' => $user['gender'] ?? '',
            'city' => $user['city'] ?? '',
            'hasBasicInsurance' => $user['has_basic_insurance'] ?? 'no',
            'basicInsurance' => $user['basic_insurance'] ?? '',
            'complementaryInsurance' => $user['complementary_insurance'] ?? '',
            'addresses' => $user['addresses'] ?? [],
            'isProfileComplete' => (bool) ($user['is_profile_complete'] ?? false),
            'createdAt' => $user['created_at'] ?? ''
        ];
    }
    
    private function validateProfileData(array $data): array {
        $errors = [];
        
        if (empty($data['firstName']) || strlen($data['firstName']) < 2) {
            $errors[] = 'نام باید حداقل 2 کاراکتر باشد';
        }
        
        if (empty($data['lastName']) || strlen($data['lastName']) < 2) {
            $errors[] = 'نام خانوادگی باید حداقل 2 کاراکتر باشد';
        }
        
        if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $errors[] = 'ایمیل نامعتبر است';
        }
        
        if (!empty($data['nationalId']) && !$this->isValidNationalId($data['nationalId'])) {
            $errors[] = 'کد ملی نامعتبر است';
        }
        
        return [
            'valid' => empty($errors),
            'errors' => $errors
        ];
    }
    
    private function isValidNationalId(string $nationalId): bool {
        if (strlen($nationalId) !== 10 || !ctype_digit($nationalId)) {
            return false;
        }
        
        // Check for invalid patterns
        if (preg_match('/^(\d)\1{9}$/', $nationalId)) {
            return false;
        }
        
        // Calculate checksum
        $sum = 0;
        for ($i = 0; $i < 9; $i++) {
            $sum += intval($nationalId[$i]) * (10 - $i);
        }
        
        $remainder = $sum % 11;
        $checkDigit = intval($nationalId[9]);
        
        return ($remainder < 2 && $checkDigit === $remainder) || 
               ($remainder >= 2 && $checkDigit === 11 - $remainder);
    }
    
    private function checkRateLimit(string $phone): bool {
        $maxAttempts = 5;
        $timeWindow = 3600; // 1 hour
        
        $sql = "
            SELECT COUNT(*) as count
            FROM {$this->otpTable}
            WHERE phone = ? AND created_at > DATE_SUB(NOW(), INTERVAL ? SECOND)
        ";
        
        $result = $this->db->fetchOne($sql, [$phone, $timeWindow]);
        return ($result['count'] ?? 0) < $maxAttempts;
    }
    
    private function checkResendLimit(string $phone): bool {
        $sql = "
            SELECT created_at
            FROM {$this->otpTable}
            WHERE phone = ?
            ORDER BY created_at DESC
            LIMIT 1
        ";
        
        $result = $this->db->fetchOne($sql, [$phone]);
        
        if (!$result) {
            return true;
        }
        
        $lastSent = strtotime($result['created_at']);
        return (time() - $lastSent) >= 60; // 60 seconds
    }
    
    private function getClientIP(): string {
        $ipKeys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
        
        foreach ($ipKeys as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = $_SERVER[$key];
                if (strpos($ip, ',') !== false) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                return $ip;
            }
        }
        
        return 'unknown';
    }
}
