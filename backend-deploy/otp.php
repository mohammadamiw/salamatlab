<?php
/**
 * Updated OTP API - Fixed for SMS.ir Integration
 * API OTP بروزرسانی شده برای اتصال به SMS.ir
 */

define('APP_START_TIME', microtime(true));

// Load dependencies
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/core/Logger.php';
require_once __DIR__ . '/core/Response.php';

// Handle CORS and preflight requests
setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    Response::success('Options handled', [], 200);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('متد مجاز نیست', 405);
}

/**
 * Clean mobile number for SMS.ir API
 */
function cleanMobileNumber($phone) {
    $phone = preg_replace('/[^0-9]/', '', $phone);
    // SMS.ir expects 10-digit mobile without leading zero
    if (strlen($phone) === 11 && strpos($phone, '0') === 0) {
        return substr($phone, 1);
    }
    return $phone;
}

/**
 * Validate phone number
 */
function validatePhoneNumber($phone) {
    $phone = preg_replace('/[^0-9]/', '', $phone);

    if (strlen($phone) < 10 || strlen($phone) > 11) {
        return false;
    }

    // Check if it's a valid Iranian mobile number
    if (strlen($phone) === 11) {
        return strpos($phone, '09') === 0;
    }

    return true;
}

/**
 * Store OTP in database
 */
function storeOtp($phone, $code, $ttl = 300) {
    try {
        $db = Database::getInstance();

        // Clean phone number for storage
        $cleanPhone = cleanMobileNumber($phone);
        $expiresAt = date('Y-m-d H:i:s', time() + $ttl);

        // Store in database
        $otpData = [
            'phone' => $cleanPhone,
            'code' => $code,
            'purpose' => 'login',
            'is_used' => false,
            'attempts' => 0,
            'max_attempts' => 5,
            'created_at' => date('Y-m-d H:i:s'),
            'expires_at' => $expiresAt,
            'ip_address' => $_SERVER['REMOTE_ADDR'] ?? '',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
        ];

        $db->insert('otp_codes', $otpData);

        Logger::info('OTP stored in database', [
            'phone' => $cleanPhone,
            'expires_at' => $expiresAt
        ]);

        return true;

    } catch (Exception $e) {
        Logger::error('Failed to store OTP', [
            'phone' => $phone,
            'error' => $e->getMessage()
        ]);
        return false;
    }
}

/**
 * Verify OTP from database
 */
function verifyOtp($phone, $code) {
    try {
        $db = Database::getInstance();
        $cleanPhone = cleanMobileNumber($phone);

        // Find OTP record
        $otpRecord = $db->fetchOne(
            "SELECT * FROM otp_codes WHERE phone = ? AND code = ? AND is_used = false ORDER BY created_at DESC LIMIT 1",
            [$cleanPhone, $code]
        );

        if (!$otpRecord) {
            Logger::warning('OTP not found or already used', ['phone' => $cleanPhone]);
            return ['success' => false, 'error' => 'کد وارد شده صحیح نیست'];
        }

        // Check expiration
        $expiresAt = strtotime($otpRecord['expires_at']);
        if (time() > $expiresAt) {
            Logger::warning('OTP expired', ['phone' => $cleanPhone, 'expires_at' => $otpRecord['expires_at']]);
            return ['success' => false, 'error' => 'کد منقضی شده است'];
        }

        // Check attempts
        $attempts = $otpRecord['attempts'] + 1;
        if ($attempts > $otpRecord['max_attempts']) {
            Logger::warning('Max OTP attempts exceeded', ['phone' => $cleanPhone, 'attempts' => $attempts]);
            return ['success' => false, 'error' => 'تعداد تلاش‌های مجاز پایان یافته'];
        }

        // Update attempts and mark as used
        $db->update('otp_codes', [
            'is_used' => true,
            'attempts' => $attempts,
            'used_at' => date('Y-m-d H:i:s')
        ], ['id' => $otpRecord['id']]);

        Logger::info('OTP verified successfully', ['phone' => $cleanPhone]);

        return ['success' => true];

    } catch (Exception $e) {
        Logger::error('OTP verification failed', [
            'phone' => $phone,
            'error' => $e->getMessage()
        ]);
        return ['success' => false, 'error' => 'خطا در بررسی کد'];
    }
}

try {
    // Get input data
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input || empty($input['action'])) {
        Response::error('اقدام نامعتبر است');
    }

    $action = $input['action'];

    // Handle send OTP action
    if ($action === 'send') {
        $phone = $input['phone'] ?? '';

        if (!validatePhoneNumber($phone)) {
            Response::error('شماره موبایل نامعتبر است');
        }

        // Generate OTP code
        $code = str_pad(rand(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store OTP in database
        $stored = storeOtp($phone, $code);

        if (!$stored) {
            Response::error('خطا در ذخیره کد امنیتی');
        }

        // Send SMS using the new function from config.php
        $cleanPhone = cleanMobileNumber($phone);
        $smsSent = sendOtpSms($cleanPhone, $code);

        if (!$smsSent) {
            Logger::error('Failed to send OTP SMS', ['phone' => $cleanPhone]);
            Response::error('خطا در ارسال پیامک');
        }

        $ttl = defined('OTP_TTL_SECONDS') ? OTP_TTL_SECONDS : 300;
        Response::success('کد امنیتی ارسال شد', [
            'expiresIn' => $ttl,
            'phone' => $phone
        ]);
    }

    // Handle verify OTP action
    elseif ($action === 'verify') {
        $phone = $input['phone'] ?? '';
        $code = $input['code'] ?? '';

        if (!validatePhoneNumber($phone)) {
            Response::error('شماره موبایل نامعتبر است');
        }

        if (empty($code) || strlen($code) !== 6) {
            Response::error('کد امنیتی باید ۶ رقم باشد');
        }

        $result = verifyOtp($phone, $code);

        if (!$result['success']) {
            Response::error($result['error']);
        }

        Response::success('کد امنیتی تأیید شد', [
            'verified' => true,
            'phone' => $phone
        ]);
    }

    else {
        Response::error('اقدام نامعتبر است');
    }

} catch (Exception $e) {
    Logger::error('OTP API Error', [
        'error' => $e->getMessage(),
        'action' => $action ?? 'unknown',
        'phone' => $phone ?? 'unknown'
    ]);

    Response::error('خطا در پردازش درخواست');
}
?>


