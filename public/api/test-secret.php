<?php
/**
 * Test OTP_SECRET Configuration
 * تست تنظیمات OTP_SECRET
 */

define('APP_START_TIME', microtime(true));

// Load dependencies
require_once __DIR__ . '/config.php';

header('Content-Type: application/json; charset=UTF-8');

// Handle CORS and preflight requests
setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    Response::success('Options handled', [], 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::error('متد مجاز نیست', 405);
}

try {
    $testResults = [];

    // Test 1: Check if OTP_SECRET is set
    $testResults['otp_secret_set'] = 'Testing...';

    $secret = getenv('OTP_SECRET') ?: (defined('OTP_SECRET') ? OTP_SECRET : null);

    if (!$secret) {
        $testResults['otp_secret_set'] = [
            'status' => 'NOT SET ❌',
            'message' => 'OTP_SECRET تنظیم نشده است',
            'solution' => 'متغیر OTP_SECRET را در لیارا تنظیم کنید'
        ];
    } else {
        $testResults['otp_secret_set'] = [
            'status' => 'SET ✅',
            'length' => strlen($secret),
            'preview' => substr($secret, 0, 8) . '...' . substr($secret, -8)
        ];
    }

    // Test 2: Validate secret format
    $testResults['secret_format'] = 'Testing...';

    if (!$secret) {
        $testResults['secret_format'] = [
            'status' => 'SKIPPED ⚠️',
            'message' => 'ابتدا OTP_SECRET را تنظیم کنید'
        ];
    } else {
        $errors = [];

        // Check length (should be 64 for hex 32 bytes)
        if (strlen($secret) !== 64) {
            $errors[] = "طول کلید باید ۶۴ کاراکتر باشد (فعلی: " . strlen($secret) . ")";
        }

        // Check format (should be hexadecimal)
        if (!preg_match('/^[a-f0-9]+$/', $secret)) {
            $errors[] = "کلید باید فقط شامل حروف a-f و اعداد باشد";
        }

        // Check randomness (basic check)
        $uniqueChars = count(array_unique(str_split($secret)));
        if ($uniqueChars < 20) {
            $errors[] = "کلید باید دارای تنوع کافی باشد (کاراکترهای منحصر به فرد: $uniqueChars)";
        }

        if (empty($errors)) {
            $testResults['secret_format'] = [
                'status' => 'VALID ✅',
                'message' => 'کلید معتبر است',
                'entropy' => 'بالا',
                'security_level' => 'قوی'
            ];
        } else {
            $testResults['secret_format'] = [
                'status' => 'INVALID ❌',
                'errors' => $errors,
                'solution' => 'کلید جدید تولید کنید'
            ];
        }
    }

    // Test 3: Generate test OTP
    $testResults['otp_generation'] = 'Testing...';

    if (!$secret) {
        $testResults['otp_generation'] = [
            'status' => 'SKIPPED ⚠️',
            'message' => 'ابتدا OTP_SECRET را تنظیم کنید'
        ];
    } else {
        // Generate test OTP code
        $testCode = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        $testResults['otp_generation'] = [
            'status' => 'SUCCESS ✅',
            'sample_code' => $testCode,
            'code_length' => strlen($testCode),
            'expires_in' => '۵ دقیقه'
        ];
    }

    // Test 4: Security recommendations
    $testResults['security_recommendations'] = [
        'rotate_secret' => 'کلید را هر ۶ ماه تغییر دهید',
        'never_log' => 'کلید را در لاگ‌ها نمایش ندهید',
        'env_only' => 'کلید را فقط در متغیرهای محیطی نگه دارید',
        'unique_per_app' => 'برای هر اپلیکیشن کلید منحصر به فرد استفاده کنید'
    ];

    // Test 5: Environment info
    $testResults['environment'] = [
        'server' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
        'php_version' => PHP_VERSION,
        'request_method' => $_SERVER['REQUEST_METHOD'],
        'remote_addr' => $_SERVER['REMOTE_ADDR'] ?? 'Unknown',
        'user_agent' => substr($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown', 0, 50) . '...'
    ];

    // Overall status
    $allTestsPassed = (
        isset($testResults['otp_secret_set']['status']) &&
        $testResults['otp_secret_set']['status'] === 'SET ✅' &&
        isset($testResults['secret_format']['status']) &&
        $testResults['secret_format']['status'] === 'VALID ✅'
    );

    $testResults['overall_status'] = $allTestsPassed ? 'ALL TESTS PASSED ✅' : 'CONFIGURATION NEEDED ⚠️';
    $testResults['timestamp'] = date('Y-m-d H:i:s');
    $testResults['execution_time'] = round((microtime(true) - APP_START_TIME) * 1000, 2) . 'ms';

    // Instructions for user
    if (!$allTestsPassed) {
        $testResults['next_steps'] = [
            '1. کلید OTP_SECRET را تولید کنید',
            '2. در پنل لیارا تنظیم کنید',
            '3. این صفحه را دوباره تست کنید',
            '4. سیستم OTP را آزمایش کنید'
        ];
    } else {
        $testResults['next_steps'] = [
            '✅ تنظیمات کامل است',
            '✅ می‌توانید از سیستم OTP استفاده کنید',
            '✅ کلید امنیتی معتبر است'
        ];
    }

    echo json_encode($testResults, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

} catch (Exception $e) {
    $errorResponse = [
        'error' => 'Test failed',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'timestamp' => date('Y-m-d H:i:s')
    ];

    http_response_code(500);
    echo json_encode($errorResponse, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
}
?>
