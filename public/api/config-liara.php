<?php
/**
 * تنظیمات API آزمایشگاه سلامت - بهینه شده برای لیارا
 * Liara Optimized Configuration
 */

// تنظیمات محیط
define('ENVIRONMENT', getenv('ENVIRONMENT') ?: 'production');
define('DEBUG_MODE', getenv('DEBUG_MODE') === 'true' ? true : false);

// تنظیمات دیتابیس لیارا
define('DB_HOST', getenv('DB_HOST') ?: 'salamatlabdb');
define('DB_NAME', getenv('DB_NAME') ?: 'musing_merkle');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: 'LbGsohGHihr1oZ7l8Jt1Vvb0');
define('DB_CHARSET', 'utf8mb4');

// تنظیمات امنیت
define('ALLOWED_ORIGINS', ['*']);
define('MAX_REQUESTS_PER_HOUR', 100); // افزایش برای production
define('RATE_LIMIT_ENABLED', true);

// تنظیمات OTP
define('OTP_TTL_SECONDS', 300); // 5 دقیقه
define('OTP_SECRET', getenv('OTP_SECRET') ?: 'salamatlab-liara-secret-key');

// تنظیمات SMS (SMS.ir)
define('SMS_API_URL', getenv('SMSIR_API_URL') ?: 'https://api.sms.ir/v1/send/verify');
define('SMS_API_KEY', getenv('SMSIR_API_KEY') ?: 'jClChBBaWXvfhHfqhBrIDIcwV5tzSj7GRVTZavQEFTPcYgqV');
define('SMSIR_TEMPLATE_ID', intval(getenv('SMSIR_TEMPLATE_ID') ?: '165688'));
define('SMSIR_TEMPLATE_PARAM_NAME', getenv('SMSIR_TEMPLATE_PARAM_NAME') ?: 'Code');

// تنظیمات لاگ
define('LOG_ENABLED', true);
define('LOG_FILE', 'salamat-app.log');

// تنظیمات منطقه زمانی
define('TIMEZONE', 'Asia/Tehran');
date_default_timezone_set(TIMEZONE);

// تنظیمات خطا
if (DEBUG_MODE) {
    ini_set('display_errors', '1');
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', '0');
    error_reporting(0);
}

// تنظیمات PHP برای لیارا
ini_set('max_execution_time', 300);
ini_set('memory_limit', '256M');
ini_set('post_max_size', '10M');
ini_set('upload_max_filesize', '10M');

/**
 * تنظیم هدرهای CORS برای لیارا
 */
function setCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
    
    // لیست دامنه‌های مجاز
    $allowedOrigins = [
        'https://salamatlab.liara.run',
        'http://localhost:5173',
        'http://localhost:3000',
        '*'
    ];
    
    if (in_array('*', $allowedOrigins) || in_array($origin, $allowedOrigins)) {
        header("Access-Control-Allow-Origin: $origin");
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400');
    header('Content-Type: application/json; charset=UTF-8');
}

/**
 * اعتبارسنجی درخواست و Rate Limiting
 */
function validateRequest() {
    if (!RATE_LIMIT_ENABLED) return;
    
    $ip = $_SERVER['REMOTE_ADDR'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? 'unknown';
    $hour = date('Y-m-d-H');
    $cacheFile = sys_get_temp_dir() . "/rate_limit_{$hour}_{$ip}.txt";
    
    // شمارش درخواست‌ها
    $count = 0;
    if (file_exists($cacheFile)) {
        $count = intval(file_get_contents($cacheFile));
    }
    
    if ($count >= MAX_REQUESTS_PER_HOUR) {
        http_response_code(429);
        echo json_encode([
            'error' => 'تعداد درخواست‌ها بیش از حد مجاز است',
            'retry_after' => 3600
        ]);
        exit();
    }
    
    // ثبت درخواست جدید
    file_put_contents($cacheFile, $count + 1);
}

/**
 * اتصال به دیتابیس لیارا
 */
function getDatabaseConnection() {
    static $pdo = null;
    
    if ($pdo === null) {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . DB_CHARSET . " COLLATE utf8mb4_unicode_ci"
            ];
            
            $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
            
        } catch (PDOException $e) {
            logError("Database connection failed: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'خطا در اتصال به پایگاه داده']);
            exit();
        }
    }
    
    return $pdo;
}

/**
 * لاگ خطاها
 */
function logError($message, $context = []) {
    if (!LOG_ENABLED) return;
    
    $logData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'level' => 'ERROR',
        'message' => $message,
        'context' => $context,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
    ];
    
    $logLine = json_encode($logData, JSON_UNESCAPED_UNICODE) . "\n";
    
    // در لیارا، لاگ‌ها در /tmp ذخیره می‌شوند
    $logFile = '/tmp/' . LOG_FILE;
    file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
}

/**
 * لاگ اطلاعات
 */
function logInfo($message, $context = []) {
    if (!LOG_ENABLED) return;
    
    $logData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'level' => 'INFO',
        'message' => $message,
        'context' => $context
    ];
    
    $logLine = json_encode($logData, JSON_UNESCAPED_UNICODE) . "\n";
    $logFile = '/tmp/' . LOG_FILE;
    file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
}

/**
 * ارسال پیامک OTP
 */
function sendOtpSms($phone, $code) {
    try {
        $data = [
            'mobile' => $phone,
            'templateId' => SMSIR_TEMPLATE_ID,
            'parameters' => [
                [
                    'name' => SMSIR_TEMPLATE_PARAM_NAME,
                    'value' => $code
                ]
            ]
        ];
        
        $options = [
            'http' => [
                'header' => [
                    'Content-Type: application/json',
                    'X-API-KEY: ' . SMS_API_KEY
                ],
                'method' => 'POST',
                'content' => json_encode($data)
            ]
        ];
        
        $context = stream_context_create($options);
        $result = file_get_contents(SMS_API_URL, false, $context);
        
        if ($result === FALSE) {
            logError("SMS sending failed", ['phone' => $phone]);
            return false;
        }
        
        $response = json_decode($result, true);
        logInfo("SMS sent successfully", ['phone' => $phone, 'response' => $response]);
        
        return $response['status'] === 1;
        
    } catch (Exception $e) {
        logError("SMS exception: " . $e->getMessage(), ['phone' => $phone]);
        return false;
    }
}

/**
 * تولید کد OTP
 */
function generateOtpCode() {
    return str_pad(rand(100000, 999999), 6, '0', STR_PAD_LEFT);
}

/**
 * پاسخ JSON استاندارد
 */
function jsonResponse($data, $httpCode = 200) {
    http_response_code($httpCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

/**
 * پاسخ خطا
 */
function errorResponse($message, $httpCode = 400, $details = null) {
    $response = ['error' => $message];
    if ($details && DEBUG_MODE) {
        $response['details'] = $details;
    }
    jsonResponse($response, $httpCode);
}

/**
 * اعتبارسنجی شماره تلفن ایرانی
 */
function validateIranianPhone($phone) {
    $phone = preg_replace('/[^0-9]/', '', $phone);
    
    // تبدیل فرمت‌های مختلف به 09xxxxxxxxx
    if (strlen($phone) === 10 && substr($phone, 0, 1) === '9') {
        $phone = '0' . $phone;
    } elseif (strlen($phone) === 13 && substr($phone, 0, 3) === '989') {
        $phone = '0' . substr($phone, 2);
    }
    
    // بررسی فرمت نهایی
    if (strlen($phone) !== 11 || substr($phone, 0, 2) !== '09') {
        return false;
    }
    
    return $phone;
}

/**
 * ایجاد جداول دیتابیس
 */
function createDatabaseTables() {
    $pdo = getDatabaseConnection();
    
    try {
        // جدول کاربران
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                phone VARCHAR(11) UNIQUE NOT NULL,
                first_name VARCHAR(100),
                last_name VARCHAR(100),
                email VARCHAR(100),
                national_id VARCHAR(10),
                birth_date DATE,
                gender ENUM('male', 'female'),
                city VARCHAR(100),
                has_basic_insurance ENUM('yes', 'no') DEFAULT 'no',
                basic_insurance VARCHAR(100),
                complementary_insurance VARCHAR(100),
                is_profile_complete BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_phone (phone),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        
        // جدول آدرس‌های کاربران
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS user_addresses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                title VARCHAR(100) NOT NULL,
                address TEXT NOT NULL,
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                phone VARCHAR(11),
                is_default BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_is_default (is_default)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        
        // جدول OTP
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS otp_codes (
                id INT AUTO_INCREMENT PRIMARY KEY,
                phone VARCHAR(11) NOT NULL,
                code VARCHAR(6) NOT NULL,
                expires_at TIMESTAMP NOT NULL,
                used BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_phone (phone),
                INDEX idx_expires_at (expires_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");
        
        logInfo("Database tables created/verified successfully");
        
    } catch (PDOException $e) {
        logError("Failed to create database tables: " . $e->getMessage());
        throw $e;
    }
}

// اجرای اولیه
try {
    createDatabaseTables();
} catch (Exception $e) {
    if (DEBUG_MODE) {
        errorResponse("Database initialization failed", 500, $e->getMessage());
    } else {
        errorResponse("سیستم در حال راه‌اندازی است، لطفاً چند لحظه صبر کنید", 503);
    }
}

?>
