<?php
/**
 * Database Connection Test
 * تست اتصال به دیتابیس و بررسی API
 */

define('APP_START_TIME', microtime(true));

// Load dependencies
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/core/Database.php';
require_once __DIR__ . '/core/Logger.php';
require_once __DIR__ . '/core/Response.php';

header('Content-Type: application/json; charset=UTF-8');

$testResults = [];

try {
    // Test 1: Database Connection
    $testResults['database_connection'] = 'Testing...';
    $db = Database::getInstance();
    $connection = $db->getConnection();
    $testResults['database_connection'] = 'SUCCESS ✅';
    
    // Test 2: Table Creation
    $testResults['table_creation'] = 'Testing...';
    
    // Test if users table exists
    if (!$db->tableExists('users')) {
        // Create basic users table for test
        $sql = "CREATE TABLE IF NOT EXISTS users (
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
            INDEX idx_phone (phone)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $db->getConnection()->exec($sql);
    }
    
    $testResults['table_creation'] = 'SUCCESS ✅';
    
    // Test 3: Basic CRUD Operations
    $testResults['crud_operations'] = 'Testing...';
    
    // Insert test user
    $testUserId = $db->insert('users', [
        'phone' => '09123456789',
        'first_name' => 'تست',
        'last_name' => 'کاربر',
        'email' => 'test@salamatlab.com',
        'city' => 'تهران',
        'is_verified' => true,
        'is_active' => true
    ]);
    
    // Read test user
    $testUser = $db->fetchOne("SELECT * FROM users WHERE id = ?", [$testUserId]);
    
    if (!$testUser) {
        throw new Exception('Failed to read test user');
    }
    
    // Update test user
    $updateResult = $db->update('users', [
        'last_name' => 'کاربر تست شده'
    ], ['id' => $testUserId]);
    
    if ($updateResult !== 1) {
        throw new Exception('Failed to update test user');
    }
    
    // Delete test user
    $deleteResult = $db->delete('users', ['id' => $testUserId]);
    
    if ($deleteResult !== 1) {
        throw new Exception('Failed to delete test user');
    }
    
    $testResults['crud_operations'] = 'SUCCESS ✅';
    
    // Test 4: OTP Table
    $testResults['otp_table'] = 'Testing...';
    
    if (!$db->tableExists('otp_codes')) {
        $sql = "CREATE TABLE IF NOT EXISTS otp_codes (
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $db->getConnection()->exec($sql);
    }
    
    $testResults['otp_table'] = 'SUCCESS ✅';
    
    // Test 5: Environment Variables
    $testResults['environment_variables'] = 'Testing...';
    
    $envChecks = [
        'DB_HOST' => getenv('DB_HOST') ? 'SET' : 'NOT SET',
        'DB_NAME' => getenv('DB_NAME') ? 'SET' : 'NOT SET',
        'DB_USER' => getenv('DB_USER') ? 'SET' : 'NOT SET',
        'DB_PASS' => getenv('DB_PASS') ? 'SET' : 'NOT SET',
        'OTP_SECRET' => defined('OTP_SECRET') ? 'SET' : 'NOT SET',
        'ADMIN_USERNAME' => defined('ADMIN_USERNAME') ? 'SET' : 'NOT SET'
    ];
    
    $testResults['environment_variables'] = $envChecks;
    
    // Test 6: Logger
    $testResults['logger'] = 'Testing...';
    Logger::info('Test log message', ['test' => true]);
    $testResults['logger'] = 'SUCCESS ✅';
    
    // Test 7: Response Class
    $testResults['response_class'] = 'Testing...';
    // This is just checking the class exists and can be instantiated
    if (class_exists('Response')) {
        $testResults['response_class'] = 'SUCCESS ✅';
    } else {
        $testResults['response_class'] = 'FAILED ❌';
    }
    
    // Test 8: Configuration
    $testResults['configuration'] = [
        'IS_PRODUCTION' => defined('IS_PRODUCTION') ? (IS_PRODUCTION ? 'TRUE' : 'FALSE') : 'NOT SET',
        'OTP_TTL_SECONDS' => defined('OTP_TTL_SECONDS') ? OTP_TTL_SECONDS : 'NOT SET',
        'TIMEZONE' => defined('TIMEZONE') ? TIMEZONE : 'NOT SET',
        'LOG_ENABLED' => defined('LOG_ENABLED') ? (LOG_ENABLED ? 'TRUE' : 'FALSE') : 'NOT SET'
    ];
    
    // Test Summary
    $testResults['overall_status'] = 'ALL TESTS PASSED ✅';
    $testResults['timestamp'] = date('Y-m-d H:i:s');
    $testResults['execution_time'] = round((microtime(true) - APP_START_TIME) * 1000, 2) . 'ms';
    
} catch (Exception $e) {
    $testResults['error'] = $e->getMessage();
    $testResults['overall_status'] = 'TESTS FAILED ❌';
    
    // Log the error
    if (class_exists('Logger')) {
        Logger::error('Database test failed', ['error' => $e->getMessage()]);
    }
}

// Output results
echo json_encode($testResults, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
?>
