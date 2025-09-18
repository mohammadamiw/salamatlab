<?php
/**
 * OTP Test API
 * تست اتصال به سیستم OTP
 */

define('APP_START_TIME', microtime(true));

// Load dependencies
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/core/Logger.php';
require_once __DIR__ . '/core/Response.php';

header('Content-Type: application/json; charset=UTF-8');

// Handle CORS and preflight requests
setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    Response::success('Options handled', [], 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('متد مجاز نیست', 405);
}

try {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || empty($input['action'])) {
        Response::error('اقدام نامعتبر است');
    }

    $action = $input['action'];

    // Test SMS configuration
    if ($action === 'test_config') {
        $configStatus = [
            'sms_api_key' => defined('SMS_API_KEY') && SMS_API_KEY ? 'SET' : 'NOT SET',
            'sms_template_id' => defined('SMSIR_TEMPLATE_ID') && SMSIR_TEMPLATE_ID ? 'SET' : 'NOT SET',
            'otp_ttl' => defined('OTP_TTL_SECONDS') ? OTP_TTL_SECONDS : 'DEFAULT (300)',
            'database_connected' => false,
            'sendOtpSms_function' => function_exists('sendOtpSms') ? 'EXISTS' : 'NOT FOUND'
        ];

        // Test database connection
        try {
            $db = Database::getInstance();
            $configStatus['database_connected'] = true;
        } catch (Exception $e) {
            $configStatus['database_error'] = $e->getMessage();
        }

        Response::success('پیکربندی بررسی شد', $configStatus);
    }

    // Test OTP send (without actual SMS)
    elseif ($action === 'test_send') {
        $phone = $input['phone'] ?? '';

        if (empty($phone)) {
            Response::error('شماره موبایل الزامی است');
        }

        // Generate test OTP
        $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // Test database storage
        $stored = false;
        try {
            $db = Database::getInstance();

            $otpData = [
                'phone' => preg_replace('/[^0-9]/', '', $phone),
                'code' => $code,
                'purpose' => 'test',
                'is_used' => false,
                'attempts' => 0,
                'max_attempts' => 5,
                'created_at' => date('Y-m-d H:i:s'),
                'expires_at' => date('Y-m-d H:i:s', time() + 300),
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
            ];

            $db->insert('otp_codes', $otpData);
            $stored = true;

        } catch (Exception $e) {
            Logger::error('Test OTP storage failed', ['error' => $e->getMessage()]);
        }

        $result = [
            'phone' => $phone,
            'code_generated' => $code,
            'database_storage' => $stored ? 'SUCCESS' : 'FAILED',
            'sms_simulation' => 'NOT SENT (test mode)',
            'expires_in' => 300
        ];

        Response::success('تست ارسال OTP انجام شد', $result);
    }

    // Test OTP verify
    elseif ($action === 'test_verify') {
        $phone = $input['phone'] ?? '';
        $code = $input['code'] ?? '';

        if (empty($phone) || empty($code)) {
            Response::error('شماره موبایل و کد الزامی هستند');
        }

        try {
            $db = Database::getInstance();

            $otpRecord = $db->fetchOne(
                "SELECT * FROM otp_codes WHERE phone = ? AND code = ? AND is_used = false ORDER BY created_at DESC LIMIT 1",
                [preg_replace('/[^0-9]/', '', $phone), $code]
            );

            if (!$otpRecord) {
                Response::error('کد یافت نشد یا استفاده شده');
            }

            $result = [
                'phone' => $phone,
                'code' => $code,
                'found' => true,
                'expires_at' => $otpRecord['expires_at'],
                'is_expired' => time() > strtotime($otpRecord['expires_at']),
                'attempts' => $otpRecord['attempts']
            ];

            Response::success('تست بررسی کد انجام شد', $result);

        } catch (Exception $e) {
            Logger::error('Test OTP verify failed', ['error' => $e->getMessage()]);
            Response::error('خطا در بررسی کد');
        }
    }

    else {
        Response::error('اقدام نامعتبر است');
    }

} catch (Exception $e) {
    Logger::error('OTP Test API Error', [
        'error' => $e->getMessage(),
        'action' => $action ?? 'unknown'
    ]);

    Response::error('خطا در پردازش درخواست');
}
?>
