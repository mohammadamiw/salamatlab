<?php
/**
 * Authentication API Endpoint - یکپارچه شده
 * جایگزین localStorage mixing با Backend-only Authentication
 */

require_once 'config.php';
require_once 'core/AuthManager.php';
require_once 'core/Response.php';

// تنظیم CORS
setCorsHeaders();

// پاسخ به preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// فقط POST requests مجاز هستند
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('Method not allowed', 405);
}

// دریافت درخواست
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || empty($input['action'])) {
    Response::error('Invalid request format');
}

$action = $input['action'];
$auth = AuthManager::getInstance();

try {
    switch ($action) {
        case 'initiate_login':
            handleInitiateLogin($auth, $input);
            break;
            
        case 'verify_otp':
            handleVerifyOtp($auth, $input);
            break;
            
        case 'check_status':
            handleCheckStatus($auth);
            break;
            
        case 'complete_profile':
            handleCompleteProfile($auth, $input);
            break;
            
        case 'logout':
            handleLogout($auth);
            break;
            
        case 'logout_all':
            handleLogoutAll($auth);
            break;
            
        case 'resend_otp':
            handleResendOtp($auth, $input);
            break;
            
        default:
            Response::error('Invalid action');
    }
    
} catch (Exception $e) {
    Logger::error('Auth API error', [
        'action' => $action,
        'error' => $e->getMessage(),
        'trace' => $e->getTraceAsString()
    ]);
    
    Response::error('Internal server error', 500);
}

/**
 * شروع فرآیند ورود
 */
function handleInitiateLogin($auth, $input) {
    if (empty($input['phone'])) {
        Response::error('Phone number is required');
    }
    
    $result = $auth->initiateLogin($input['phone']);
    
    if ($result['success']) {
        Response::success('OTP sent successfully', $result);
    } else {
        Response::error($result['error']);
    }
}

/**
 * تأیید OTP و ورود
 */
function handleVerifyOtp($auth, $input) {
    if (empty($input['phone']) || empty($input['code'])) {
        Response::error('Phone and OTP code are required');
    }
    
    $result = $auth->verifyOtpAndLogin($input['phone'], $input['code']);
    
    if ($result['success']) {
        Response::success('Login successful', [
            'user' => $result['user'],
            'is_new_user' => $result['is_new_user']
        ]);
    } else {
        Response::error($result['error']);
    }
}

/**
 * بررسی وضعیت احراز هویت
 */
function handleCheckStatus($auth) {
    $result = $auth->checkAuthStatus();
    
    Response::success('Status retrieved', $result);
}

/**
 * تکمیل پروفایل
 */
function handleCompleteProfile($auth, $input) {
    if (empty($input['profile_data'])) {
        Response::error('Profile data is required');
    }
    
    $result = $auth->completeProfile($input['profile_data']);
    
    if ($result['success']) {
        Response::success('Profile completed successfully', [
            'user' => $result['user']
        ]);
    } else {
        Response::error($result['error'], 400, [
            'validation_errors' => $result['validation_errors'] ?? []
        ]);
    }
}

/**
 * خروج از سیستم
 */
function handleLogout($auth) {
    $result = $auth->logout();
    
    if ($result['success']) {
        Response::success('Logged out successfully');
    } else {
        Response::error('Logout failed');
    }
}

/**
 * خروج از همه دستگاه‌ها
 */
function handleLogoutAll($auth) {
    $result = $auth->logoutAllDevices();
    
    if ($result['success']) {
        Response::success('Logged out from all devices');
    } else {
        Response::error('Logout failed');
    }
}

/**
 * ارسال مجدد OTP
 */
function handleResendOtp($auth, $input) {
    if (empty($input['phone'])) {
        Response::error('Phone number is required');
    }
    
    $result = $auth->resendOtp($input['phone']);
    
    if ($result['success']) {
        Response::success('OTP resent successfully', $result);
    } else {
        Response::error($result['error']);
    }
}
?>
