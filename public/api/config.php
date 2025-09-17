<?php
/**
 * تنظیمات سیستم آزمایشگاه سلامت - بهینه شده برای SaaS Platform
 * SalamatLab Configuration - Optimized for SaaS Platform
 */

// Security Headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('X-XSS-Protection: 1; mode=block');
header('Referrer-Policy: strict-origin-when-cross-origin');

// Environment Detection
define('IS_PRODUCTION', !empty($_SERVER['HTTP_HOST']) && strpos($_SERVER['HTTP_HOST'], 'localhost') === false);

// تنظیمات ایمیل (از متغیرهای محیطی)
define('ADMIN_EMAIL', getenv('ADMIN_EMAIL') ?: 'admin@salamatlab.com');
define('FROM_EMAIL', getenv('FROM_EMAIL') ?: 'noreply@salamatlab.com');
define('REPLY_TO_EMAIL', getenv('REPLY_TO_EMAIL') ?: 'info@salamatlab.com');

// تنظیمات امنیت (بهینه شده برای SaaS)
$allowedOrigins = IS_PRODUCTION 
    ? (getenv('ALLOWED_ORIGINS') ? explode(',', getenv('ALLOWED_ORIGINS')) : ['https://salamatlab.com'])
    : ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:3000'];
define('ALLOWED_ORIGINS', $allowedOrigins);
define('MAX_REQUESTS_PER_HOUR', getenv('RATE_LIMIT') ?: (IS_PRODUCTION ? 100 : 500));

// تنظیمات لاگ
define('LOG_FILE', 'bookings.log'); // نام فایل لاگ
define('LOG_ENABLED', true); // فعال/غیرفعال کردن لاگ

// تنظیمات اعتبارسنجی
define('MIN_PHONE_LENGTH', 10); // حداقل طول شماره تماس
define('MAX_PHONE_LENGTH', 11); // حداکثر طول شماره تماس
define('NATIONAL_CODE_LENGTH', 10); // طول کد ملی

// تنظیمات ایمیل
define('EMAIL_CHARSET', 'UTF-8'); // کدگذاری ایمیل
define('EMAIL_ENCODING', '8bit'); // نوع کدگذاری

// تنظیمات SMTP (اختیاری؛ در صورت فعال بودن، به جای mail() استفاده می‌شود)
if (!defined('SMTP_ENABLED')) {
    define('SMTP_ENABLED', false); // در صورت نیاز true کنید
}
if (!defined('SMTP_HOST')) {
    define('SMTP_HOST', getenv('SMTP_HOST') ?: '');
}
if (!defined('SMTP_PORT')) {
    define('SMTP_PORT', getenv('SMTP_PORT') ?: '587');
}
if (!defined('SMTP_SECURE')) { // none | tls
    define('SMTP_SECURE', getenv('SMTP_SECURE') ?: 'tls');
}
if (!defined('SMTP_USER')) {
    define('SMTP_USER', getenv('SMTP_USER') ?: '');
}
if (!defined('SMTP_PASS')) {
    define('SMTP_PASS', getenv('SMTP_PASS') ?: '');
}

// تنظیمات پیامک (تماماً از متغیرهای محیطی)
if (!defined('SMS_API_URL')) {
    define('SMS_API_URL', getenv('SMSIR_API_URL') ?: 'https://api.sms.ir/v1/send/verify');
}
if (!defined('SMS_API_KEY')) {
    $smsKey = getenv('SMSIR_API_KEY');
    if (!$smsKey) {
        throw new Exception('SMS_API_KEY environment variable is required');
    }
    define('SMS_API_KEY', $smsKey);
}
if (!defined('SMSIR_TEMPLATE_ID')) {
    // شناسه قالب «ارسال سریع» در پنل sms.ir را اینجا قرار دهید
    $tplIdEnv = getenv('SMSIR_TEMPLATE_ID');
    define('SMSIR_TEMPLATE_ID', $tplIdEnv !== false ? intval($tplIdEnv) : 165688);
}
if (!defined('SMSIR_TEMPLATE_PARAM_NAME')) {
    // نام کلید پارامتر داخل قالب (بدون #) – معمولاً Code
    define('SMSIR_TEMPLATE_PARAM_NAME', getenv('SMSIR_TEMPLATE_PARAM_NAME') ?: 'Code');
}
if (!defined('SMSIR_CONFIRM_TEMPLATE_ID')) {
    // شناسه قالب پیام تایید نمونه‌گیری در محل
    $confirmTplEnv = getenv('SMSIR_CONFIRM_TEMPLATE_ID');
    define('SMSIR_CONFIRM_TEMPLATE_ID', $confirmTplEnv !== false ? intval($confirmTplEnv) : 152864);
}
if (!defined('SMSIR_CONFIRM_PARAM_NAME')) {
    // نام پارامتر در قالب تایید (مثلاً name)
    define('SMSIR_CONFIRM_PARAM_NAME', getenv('SMSIR_CONFIRM_PARAM_NAME') ?: 'name');
}
// ارسال پیامک پس از ثبت نظرسنجی
if (!defined('FEEDBACK_CONFIRM_TEMPLATE_ID')) {
    $fbTplEnv = getenv('FEEDBACK_CONFIRM_TEMPLATE_ID');
    define('FEEDBACK_CONFIRM_TEMPLATE_ID', $fbTplEnv !== false ? intval($fbTplEnv) : 637383);
}
if (!defined('FEEDBACK_CONFIRM_PARAM_NAME')) {
    define('FEEDBACK_CONFIRM_PARAM_NAME', getenv('FEEDBACK_CONFIRM_PARAM_NAME') ?: 'NAME');
}

// ارسال پیامک پس از ثبت درخواست چکاپ
if (!defined('CHECKUP_CONFIRM_TEMPLATE_ID')) {
    $ckTplEnv = getenv('CHECKUP_CONFIRM_TEMPLATE_ID');
    define('CHECKUP_CONFIRM_TEMPLATE_ID', $ckTplEnv !== false ? intval($ckTplEnv) : 980073);
}
if (!defined('CHECKUP_CONFIRM_NAME_PARAM')) {
    define('CHECKUP_CONFIRM_NAME_PARAM', getenv('CHECKUP_CONFIRM_NAME_PARAM') ?: 'NAME');
}
if (!defined('CHECKUP_CONFIRM_TITLE_PARAM')) {
    define('CHECKUP_CONFIRM_TITLE_PARAM', getenv('CHECKUP_CONFIRM_TITLE_PARAM') ?: 'CHECKUP');
}

// ارسال پیامک پس از ثبت همکاری با ما
if (!defined('CAREERS_CONFIRM_TEMPLATE_ID')) {
    $crTplEnv = getenv('CAREERS_CONFIRM_TEMPLATE_ID');
    define('CAREERS_CONFIRM_TEMPLATE_ID', $crTplEnv !== false ? intval($crTplEnv) : 467180);
}
if (!defined('CAREERS_CONFIRM_PARAM_NAME')) {
    define('CAREERS_CONFIRM_PARAM_NAME', getenv('CAREERS_CONFIRM_PARAM_NAME') ?: 'NAME');
}

// ارسال پیامک پس از ثبت فرم تماس
if (!defined('CONTACT_CONFIRM_TEMPLATE_ID')) {
    $ctTplEnv = getenv('CONTACT_CONFIRM_TEMPLATE_ID');
    define('CONTACT_CONFIRM_TEMPLATE_ID', $ctTplEnv !== false ? intval($ctTplEnv) : 850852);
}
if (!defined('CONTACT_CONFIRM_PARAM_NAME')) {
    define('CONTACT_CONFIRM_PARAM_NAME', getenv('CONTACT_CONFIRM_PARAM_NAME') ?: 'NAME');
}
if (!defined('SMSIR_STAFF_TEMPLATE_ID')) {
    // شناسه قالب پیام اطلاع‌رسانی به همکار
    $staffTplEnv = getenv('SMSIR_STAFF_TEMPLATE_ID');
    define('SMSIR_STAFF_TEMPLATE_ID', $staffTplEnv !== false ? intval($staffTplEnv) : 471186);
}
if (!defined('SMSIR_STAFF_PARAM_NAME')) {
    // نام پارامتر لینک در قالب همکار (پیشنهادی: LINK)
    define('SMSIR_STAFF_PARAM_NAME', getenv('SMSIR_STAFF_PARAM_NAME') ?: 'LINK');
}
if (!defined('STAFF_NOTIFY_MOBILE')) {
    // شماره همکار جهت دریافت اعلان
    define('STAFF_NOTIFY_MOBILE', getenv('STAFF_NOTIFY_MOBILE') ?: '09206510538');
}
if (!defined('OTP_TTL_SECONDS')) {
    define('OTP_TTL_SECONDS', getenv('OTP_TTL_SECONDS') ?: 300); // 5 دقیقه
}
if (!defined('OTP_SECRET')) {
    $otpSecret = getenv('OTP_SECRET');
    if (!$otpSecret || strlen($otpSecret) < 32) {
        if (IS_PRODUCTION) {
            throw new Exception('OTP_SECRET environment variable is required and must be at least 32 characters');
        }
        // فقط برای development
        $otpSecret = 'salamatlab-dev-secret-key-' . md5(__DIR__);
    }
    define('OTP_SECRET', $otpSecret);
}

// تنظیمات خطا - DirectAdmin compatible
define('DEBUG_MODE', false); // حالت دیباگ (در تولید false باشد)
define('SHOW_ERRORS', false); // نمایش خطاها (در تولید false باشد)

// تنظیمات اضافی
define('TIMEZONE', 'Asia/Tehran'); // منطقه زمانی
define('DATE_FORMAT', 'Y/m/d H:i:s'); // فرمت تاریخ

// تنظیمات پنل مدیریت (از متغیرهای محیطی)
if (!defined('ADMIN_USERNAME')) {
    $adminUser = getenv('ADMIN_USERNAME');
    if (!$adminUser) {
        if (IS_PRODUCTION) {
            throw new Exception('ADMIN_USERNAME environment variable is required');
        }
        $adminUser = 'admin';
    }
    define('ADMIN_USERNAME', $adminUser);
}
if (!defined('ADMIN_PASSWORD_HASH')) {
    $adminPass = getenv('ADMIN_PASSWORD_HASH');
    if (!$adminPass) {
        if (IS_PRODUCTION) {
            throw new Exception('ADMIN_PASSWORD_HASH environment variable is required');
        }
        // فقط برای development - رمز: admin123!@#
        $adminPass = '$2y$10$K7Z8qPZ7X5FXxXlBX8P4H.LzGzBZJ0J3HZJ4JHK8z7y8X9K0J1L2M';
    }
    define('ADMIN_PASSWORD_HASH', $adminPass);
}

// تنظیم منطقه زمانی
if (defined('TIMEZONE')) {
    date_default_timezone_set(TIMEZONE);
}

// تنظیم نمایش خطاها - DirectAdmin compatible
if (defined('SHOW_ERRORS')) {
    ini_set('display_errors', SHOW_ERRORS ? '1' : '0');
    error_reporting(SHOW_ERRORS ? E_ALL & ~E_DEPRECATED & ~E_STRICT : 0);
}

// تنظیمات دیتابیس (تماماً از متغیرهای محیطی)
$dbHost = getenv('DB_HOST');
$dbName = getenv('DB_NAME');
$dbUser = getenv('DB_USER');
$dbPass = getenv('DB_PASS');

// بررسی وجود متغیرهای ضروری
if (!$dbHost || !$dbName || !$dbUser || !$dbPass) {
    if (IS_PRODUCTION) {
        throw new Exception('Database environment variables (DB_HOST, DB_NAME, DB_USER, DB_PASS) are required');
    }
    // مقادیر development
    $dbHost = $dbHost ?: 'localhost';
    $dbName = $dbName ?: 'salamatlab_dev';
    $dbUser = $dbUser ?: 'root';
    $dbPass = $dbPass ?: '';
}

define('DB_HOST', $dbHost);
define('DB_NAME', $dbName);
define('DB_USER', $dbUser);
define('DB_PASS', $dbPass);
define('DB_CHARSET', 'utf8mb4');

// تنظیمات PHP برای DirectAdmin
ini_set('max_execution_time', 300);
ini_set('memory_limit', '256M');
ini_set('post_max_size', '10M');
ini_set('upload_max_filesize', '10M');

// تنظیمات CORS - DirectAdmin compatible
function setCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

    if (defined('ALLOWED_ORIGINS') && is_array(ALLOWED_ORIGINS)) {
        if (in_array('*', ALLOWED_ORIGINS) || in_array($origin, ALLOWED_ORIGINS)) {
            header("Access-Control-Allow-Origin: $origin");
        }
    } else {
        header("Access-Control-Allow-Origin: *");
    }

    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
    header('Access-Control-Max-Age: 86400'); // 24 hours
    header('Content-Type: application/json; charset=UTF-8');
}

// تنظیمات امنیت - DirectAdmin compatible
function validateRequest() {
    // بررسی تعداد درخواست‌ها
    if (defined('MAX_REQUESTS_PER_HOUR')) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? $_SERVER['HTTP_X_FORWARDED_FOR'] ?? 'unknown';
        $log_file = dirname(__FILE__) . '/rate_limit_' . date('Y-m-d-H') . '.log';

        if (file_exists($log_file)) {
            $requests = file($log_file, FILE_IGNORE_NEW_LINES);
            $count = 0;

            foreach ($requests as $request) {
                if (strpos($request, $ip) === 0) {
                    $count++;
                }
            }

            if ($count >= MAX_REQUESTS_PER_HOUR) {
                http_response_code(429);
                echo json_encode(['error' => 'تعداد درخواست‌ها بیش از حد مجاز است. لطفاً بعداً تلاش کنید.']);
                exit();
            }
        }

        // ثبت درخواست
        file_put_contents($log_file, $ip . ' ' . date('Y-m-d H:i:s') . "\n", FILE_APPEND | LOCK_EX);
    }
}

// تنظیمات لاگ - DirectAdmin compatible
function logBooking($data) {
    if (!defined('LOG_ENABLED') || !LOG_ENABLED) {
        return;
    }

    $log_file = dirname(__FILE__) . '/' . (defined('LOG_FILE') ? LOG_FILE : 'bookings.log');
    $log_entry = date('Y-m-d H:i:s') . " | " .
                 ($data['type'] ?? 'unknown') . " | " .
                 ($data['fullName'] ?? 'unknown') . " | " .
                 ($data['phone'] ?? 'unknown') . " | " .
                 ($data['city'] ?? 'unknown') . " | " .
                 ($data['nationalCode'] ?? 'unknown') . "\n";

    // اطمینان از وجود پوشه لاگ
    $log_dir = dirname($log_file);
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
}

// لاگ پیام‌های تماس
function logContact($data) {
    if (!defined('LOG_ENABLED') || !LOG_ENABLED) {
        return;
    }

    $log_file = dirname(__FILE__) . '/contacts.log';
    $log_entry = date('Y-m-d H:i:s') . " | " .
                 ($data['name'] ?? 'unknown') . " | " .
                 ($data['email'] ?? 'unknown') . " | " .
                 ($data['phone'] ?? 'no-phone') . " | " .
                 ($data['subject'] ?? 'unknown') . "\n";

    // اطمینان از وجود پوشه لاگ
    $log_dir = dirname($log_file);
    if (!is_dir($log_dir)) {
        mkdir($log_dir, 0755, true);
    }

    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
}

// تنظیمات اعتبارسنجی
function validateInput($data) {
    $errors = [];

    // بررسی نام
    if (empty($data['fullName']) || strlen(trim($data['fullName'])) < 2) {
        $errors[] = 'نام باید حداقل ۲ کاراکتر باشد';
    }

    // بررسی شماره تماس
    $phone = preg_replace('/[^0-9]/', '', $data['phone']);
    if (strlen($phone) < MIN_PHONE_LENGTH || strlen($phone) > MAX_PHONE_LENGTH) {
        $errors[] = 'شماره تماس باید بین ' . MIN_PHONE_LENGTH . ' تا ' . MAX_PHONE_LENGTH . ' رقم باشد';
    }

    // بررسی کد ملی
    if (strlen($data['nationalCode']) !== NATIONAL_CODE_LENGTH) {
        $errors[] = 'کد ملی باید ' . NATIONAL_CODE_LENGTH . ' رقم باشد';
    }

    // بررسی تاریخ تولد
    if (empty($data['birthDate'])) {
        $errors[] = 'تاریخ تولد الزامی است';
    }

    // بررسی جنسیت
    if (!in_array($data['gender'], ['male', 'female'])) {
        $errors[] = 'جنسیت نامعتبر است';
    }

    // بررسی شهر
    if (empty($data['city'])) {
        $errors[] = 'شهر الزامی است';
    }

    // بررسی بیمه
    if (!in_array($data['hasBasicInsurance'], ['yes', 'no'])) {
        $errors[] = 'وضعیت بیمه نامعتبر است';
    }

    if ($data['hasBasicInsurance'] === 'yes' && empty($data['basicInsurance'])) {
        $errors[] = 'نوع بیمه پایه الزامی است';
    }

    return $errors;
}

// اعتبارسنجی فرم تماس
function validateContactInput($data) {
    $errors = [];

    // بررسی نام
    if (empty($data['name']) || strlen(trim($data['name'])) < 2) {
        $errors[] = 'نام باید حداقل ۲ کاراکتر باشد';
    }

    // بررسی ایمیل
    if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'ایمیل معتبر وارد کنید';
    }

    // بررسی موضوع
    if (empty($data['subject']) || strlen(trim($data['subject'])) < 3) {
        $errors[] = 'موضوع باید حداقل ۳ کاراکتر باشد';
    }

    // بررسی پیام
    if (empty($data['message']) || strlen(trim($data['message'])) < 10) {
        $errors[] = 'پیام باید حداقل ۱۰ کاراکتر باشد';
    }

    return $errors;
}

// تنظیمات ایمیل برای DirectAdmin
function sendEmail($to, $subject, $message, $headers = []) {
    // تنظیمات پیش‌فرض هدرها
    $default_headers = [
        'From: ' . FROM_EMAIL,
        'Reply-To: ' . REPLY_TO_EMAIL,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=' . EMAIL_CHARSET,
        'X-Mailer: PHP/' . phpversion()
    ];
    $final_headers_arr = array_merge($default_headers, $headers);
    $final_headers = implode("\r\n", $final_headers_arr);

    if (defined('SMTP_ENABLED') && SMTP_ENABLED && SMTP_HOST && SMTP_PORT) {
        return sendEmailSMTP($to, $subject, $message, $final_headers_arr);
    }

    // fallback: mail()
    $additional_params = '-f ' . FROM_EMAIL;
    return @mail($to, $subject, $message, $final_headers, $additional_params);
}

function sendEmailSMTP($to, $subject, $message, $headersArr = []) {
    $host = SMTP_HOST;
    $port = intval(SMTP_PORT);
    $secure = strtolower(SMTP_SECURE);
    $user = SMTP_USER;
    $pass = SMTP_PASS;

    $transport = ($secure === 'tls') ? 'tcp' : 'tcp';
    $errno = 0; $errstr = '';
    $fp = @stream_socket_client("$transport://$host:$port", $errno, $errstr, 15, STREAM_CLIENT_CONNECT);
    if (!$fp) { return false; }
    stream_set_timeout($fp, 15);

    $read = function() use ($fp) { return fgets($fp, 515); };
    $write = function($data) use ($fp) { fwrite($fp, $data); };

    $read(); // greeting
    $write("EHLO salamatlab.com\r\n");
    $ehloResp = '';
    while ($line = $read()) { $ehloResp .= $line; if (substr($line, 3, 1) !== '-') break; }

    if ($secure === 'tls') {
        $write("STARTTLS\r\n");
        $read();
        if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) { fclose($fp); return false; }
        $write("EHLO salamatlab.com\r\n");
        while ($line = $read()) { if (substr($line, 3, 1) !== '-') break; }
    }

    if ($user && $pass) {
        $write("AUTH LOGIN\r\n"); $read();
        $write(base64_encode($user) . "\r\n"); $read();
        $write(base64_encode($pass) . "\r\n"); $read();
    }

    $from = FROM_EMAIL;
    $write("MAIL FROM:<$from>\r\n"); $read();
    $write("RCPT TO:<$to>\r\n"); $read();
    $write("DATA\r\n"); $read();

    // Assemble headers
    $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
    $dateHdr = 'Date: ' . date('r');
    $toHdr = 'To: ' . $to;
    $headersText = implode("\r\n", array_merge([$toHdr, 'Subject: ' . $encodedSubject, $dateHdr], $headersArr));
    $data = $headersText . "\r\n\r\n" . $message . "\r\n.\r\n";
    $write($data); $read();
    $write("QUIT\r\n");
    fclose($fp);
    return true;
}

// ایجاد ایمیل HTML زیبا برای رزرو
function createBeautifulEmail($data, $type = 'admin', $publicLink = '') {
    $typeText = $data['type'] === 'checkup' ? 'رزرو چکاپ' : 'رزرو ویزیت پزشک';
    $genderText = $data['gender'] === 'male' ? 'مرد' : 'زن';
    $insuranceText = $data['hasBasicInsurance'] === 'yes' ? 'بله' : 'خیر';

    // Minimal, clean HTML email similar to Google security alerts
    $html = '
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>درخواست جدید ' . $typeText . '</title>
    </head>
    <body style="margin:0;background:#f6f9fc;font-family:Tahoma,Arial,sans-serif;color:#1f2328;">
        <div style="max-width:640px;margin:24px auto;background:#fff;border:1px solid #e6e8eb;border-radius:12px;overflow:hidden;">
            <div style="padding:20px 24px;border-bottom:1px solid #eef1f4;">
                <div style="font-size:16px;color:#6b7280;">آزمایشگاه تشخیص پزشکی سلامت</div>
                <h1 style="margin:4px 0 0 0;font-size:18px;font-weight:700;color:#111827;">درخواست جدید ' . $typeText . '</h1>
            </div>
            <div style="padding:20px 24px;">
                <p style="margin:0 0 16px 0;font-size:14px;color:#374151;">جزئیات درخواست در جدول زیر آمده است. لطفاً بررسی بفرمایید.</p>
                <table role="presentation" style="width:100%;border-collapse:collapse;">
                    <tbody>
                        <tr>
                            <td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">عنوان</td>
                            <td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . htmlspecialchars($data['title']) . '</td>
                        </tr>
                        <tr>
                            <td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">نام و نام خانوادگی</td>
                            <td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . htmlspecialchars($data['fullName']) . '</td>
                        </tr>
                        <tr>
                            <td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">شماره تماس</td>
                            <td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;"><a href="tel:' . htmlspecialchars($data['phone']) . '" style="color:#0ea5e9;text-decoration:none;">' . htmlspecialchars($data['phone']) . '</a></td>
                        </tr>';

    if (!empty($data['email'])) {
        $html .= '
                        <tr>
                            <td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">ایمیل</td>
                            <td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;"><a href="mailto:' . htmlspecialchars($data['email']) . '" style="color:#0ea5e9;text-decoration:none;">' . htmlspecialchars($data['email']) . '</a></td>
                        </tr>';
    }

    $html .= '
                        <tr>
                            <td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">کد ملی</td>
                            <td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . htmlspecialchars($data['nationalCode']) . '</td>
                        </tr>
                        <tr>
                            <td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">تاریخ تولد</td>
                            <td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . htmlspecialchars($data['birthDate']) . '</td>
                        </tr>
                        <tr>
                            <td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">جنسیت</td>
                            <td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $genderText . '</td>
                        </tr>
                        <tr>
                            <td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">شهر</td>
                            <td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . htmlspecialchars($data['city']) . '</td>
                        </tr>';

    if (!empty($data['price'])) {
        $html .= '
                        <tr>
                            <td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">قیمت</td>
                            <td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . htmlspecialchars($data['price']) . '</td>
                        </tr>';
    }

        $html .= '
                        <tr>
                            <td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">بیمه پایه</td>
                            <td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $insuranceText . '</td>
                        </tr>';

    if ($data['hasBasicInsurance'] === 'yes') {
        $html .= '
                        <tr>
                            <td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">نوع بیمه پایه</td>
                            <td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . htmlspecialchars($data['basicInsurance']) . '</td>
                        </tr>';
    }

    if (!empty($data['complementaryInsurance'])) {
        $html .= '
                        <tr>
                            <td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">بیمه تکمیلی</td>
                            <td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . htmlspecialchars($data['complementaryInsurance']) . '</td>
                        </tr>';
    }

    $html .= '
                    </tbody>
                </table>';

    // Map and links section
    $lat = isset($data['locationLat']) ? $data['locationLat'] : '';
    $lng = isset($data['locationLng']) ? $data['locationLng'] : '';
    $hasCoords = $lat !== '' && $lng !== '';
    $googleLink = $hasCoords ? ('https://maps.google.com/?q=' . $lat . ',' . $lng) : '';
    $osmLink = $hasCoords ? ('https://www.openstreetmap.org/?mlat=' . $lat . '&mlon=' . $lng . '#map=16/' . $lat . '/' . $lng) : '';

    if ($hasCoords || $publicLink) {
        $html .= '
                <div style="margin-top:16px;padding:12px 14px;background:#f0f9ff;border:1px solid #e0f2fe;border-radius:8px;">
                    <div style="font-size:13px;color:#075985;margin-bottom:6px;">نقشه و لینک‌ها</div>
                    <div style="font-size:14px;line-height:1.9;">
                        ' . ($hasCoords ? ('مختصات: <strong>' . htmlspecialchars($lat) . ', ' . htmlspecialchars($lng) . "</strong><br/>\n") : '') . '
                        ' . ($googleLink ? ('<a href="' . $googleLink . '" style="color:#0ea5e9;text-decoration:none;">باز کردن در گوگل‌مپ</a><br/>') : '') . '
                        ' . ($osmLink ? ('<a href="' . $osmLink . '" style="color:#0ea5e9;text-decoration:none;">مشاهده در OpenStreetMap</a><br/>') : '') . '
                        ' . ($publicLink ? ('<a href="' . $publicLink . '" style="display:inline-block;margin-top:8px;padding:10px 14px;background:#0ea5e9;color:#fff;border-radius:8px;text-decoration:none;">مشاهده صفحه درخواست</a>') : '') . '
                    </div>
                </div>';
    }

    if (!empty($data['notes'])) {
        $html .= '
                <div style="margin-top:16px;padding:12px 14px;background:#fff7ed;border:1px solid #ffedd5;border-radius:8px;">
                    <div style="font-size:13px;color:#9a3412;margin-bottom:6px;">توضیحات اضافی</div>
                    <div style="font-size:14px;color:#7c2d12;line-height:1.8;white-space:pre-wrap;">' . nl2br(htmlspecialchars($data['notes'])) . '</div>
                </div>';
    }

    $html .= '
                        </div>
            <div style="padding:12px 24px;background:#fafafa;border-top:1px solid #eef1f4;text-align:center;">
                <div style="font-size:12px;color:#6b7280;">این ایمیل به صورت خودکار ارسال شده است • ' . date('Y/m/d H:i:s') . '</div>
                        </div>
                        </div>
    </body>
    </html>';

    return $html;
}

// ایجاد ایمیل تأیید برای مشتری
function createCustomerEmail($data) {
    $typeText = $data['type'] === 'checkup' ? 'رزرو چکاپ' : 'رزرو ویزیت پزشک';

    $html = '
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>تأیید درخواست ' . $typeText . '</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Tahoma, Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">✅ درخواست شما تأیید شد</h1>
                <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">آزمایشگاه تشخیص پزشکی سلامت</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 30px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="background-color: #d4edda; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;">
                        <span style="font-size: 40px;">🎉</span>
                    </div>
                    <h2 style="color: #155724; margin: 0; font-size: 24px;">سلام ' . htmlspecialchars($data['fullName']) . ' عزیز</h2>
                    <p style="color: #155724; font-size: 18px; margin: 10px 0;">درخواست شما با موفقیت ثبت شد</p>
                </div>
                
                <div style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); border: 1px solid #28a745; padding: 25px; border-radius: 10px; text-align: center; margin: 20px 0;">
                    <h3 style="margin: 0 0 10px 0; color: #155724; font-size: 20px;">🎉 درخواست شما با موفقیت ثبت شد</h3>
                    <p style="margin: 0; color: #155724; font-size: 16px;">کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت</p>
                </div>
                
                <div style="background-color: #f8f9fa; border-radius: 10px; padding: 25px; margin-bottom: 25px; border-right: 5px solid #28a745;">
                    <h2 style="color: #333; margin: 0 0 20px 0; font-size: 22px; text-align: center;">📋 جزئیات درخواست</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">';

    $requestInfo = [
        ['نوع درخواست', $typeText, '📋', '#28a745'],
        ['عنوان', $data['title'], '📝', '#17a2b8'],
        ['نام و نام خانوادگی', $data['fullName'], '👤', '#667eea'],
        ['کد ملی', $data['nationalCode'], '🆔', '#ffc107'],
        ['تاریخ تولد', $data['birthDate'], '📅', '#fd7e14'],
        ['شهر', $data['city'], '🏙️', '#6f42c1']
    ];

    foreach ($requestInfo as $info) {
        $html .= '
                        <div style="display: flex; align-items: center; padding: 12px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e9ecef;">
                            <span style="background-color: ' . $info[3] . '; color: white; padding: 8px 12px; border-radius: 20px; margin-left: 15px; font-size: 14px;">' . $info[2] . '</span>
                            <div>
                                <strong style="color: #333; font-size: 16px;">' . $info[0] . ':</strong>
                                <span style="color: #666; font-size: 16px; margin-right: 10px;">' . htmlspecialchars($info[1]) . '</span>
                            </div>
                        </div>';
    }

    $html .= '
                    </div>
                </div>';

    if ($data['hasBasicInsurance'] === 'yes') {
        $html .= '
                <div style="background-color: #f8f9fa; border-radius: 10px; padding: 25px; margin-bottom: 25px; border-right: 5px solid #28a745;">
                    <h2 style="color: #333; margin: 0 0 20px 0; font-size: 22px; text-align: center;">🏥 اطلاعات بیمه</h2>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                        <div style="display: flex; align-items: center; padding: 12px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e9ecef;">
                            <span style="background-color: #17a2b8; color: white; padding: 8px 12px; border-radius: 20px; margin-left: 15px; font-size: 14px;">🏥</span>
                            <div>
                                <strong style="color: #333; font-size: 16px;">نوع بیمه پایه:</strong>
                                <span style="color: #666; font-size: 16px; margin-right: 10px;">' . htmlspecialchars($data['basicInsurance']) . '</span>
                            </div>
                        </div>';

        if (!empty($data['complementaryInsurance'])) {
            $html .= '
                        <div style="display: flex; align-items: center; padding: 12px; background-color: #ffffff; border-radius: 8px; border: 1px solid #e9ecef;">
                            <span style="background-color: #6f42c1; color: white; padding: 8px 12px; border-radius: 20px; margin-left: 15px; font-size: 14px;">💎</span>
                            <div>
                                <strong style="color: #333; font-size: 16px;">بیمه تکمیلی:</strong>
                                <span style="color: #666; font-size: 16px; margin-right: 10px;">' . htmlspecialchars($data['complementaryInsurance']) . '</span>
                            </div>
                        </div>';
        }

        $html .= '
                    </div>
                </div>';
    }

    $html .= '
                <div style="background-color: #e3f2fd; border: 1px solid #2196f3; padding: 25px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="margin: 0 0 15px 0; color: #1976d2; text-align: center;">📞 مراحل بعدی</h3>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #2196f3;">
                        <ol style="margin: 0; padding-right: 20px; color: #1565c0; font-size: 16px; line-height: 1.8;">
                            <li style="margin-bottom: 10px;">کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت</li>
                            <li style="margin-bottom: 10px;">زمان دقیق و جزئیات بیشتر هماهنگ خواهد شد</li>
                            <li style="margin-bottom: 10px;">در صورت نیاز به اطلاعات بیشتر، با ما تماس بگیرید</li>
                        </ol>
                    </div>
                </div>
                
                <div style="background-color: #d1ecf1; border-radius: 10px; padding: 20px; text-align: center; border: 1px solid #bee5eb;">
                    <p style="color: #0c5460; margin: 0; font-size: 14px;">
                        <strong>📅 تاریخ ثبت درخواست:</strong> ' . date('Y/m/d H:i:s') . '
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #343a40; padding: 25px; text-align: center;">
                <p style="color: #ffffff; margin: 0; font-size: 16px; font-weight: bold;">با تشکر از اعتماد شما</p>
                <p style="color: #adb5bd; margin: 10px 0 0 0; font-size: 14px;">تیم آزمایشگاه سلامت</p>
            </div>
        </div>
    </body>
    </html>';
    
    return $html;
}

// ایجاد ایمیل HTML زیبا برای پیام‌های تماس (مدیر)
function createContactEmail($data, $type = 'admin') {
    $html = '
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>پیام جدید از فرم تماس</title>
        <style>
            body {
                font-family: "Tahoma", "Arial", sans-serif;
                line-height: 1.6;
                color: #333;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                margin: 0;
                padding: 20px;
                min-height: 100vh;
            }
            .email-container {
                max-width: 650px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                box-shadow: 0 25px 50px rgba(0,0,0,0.15);
                overflow: hidden;
                border: 3px solid #fff;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            .header::before {
                content: "";
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: float 6s ease-in-out infinite;
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                position: relative;
                z-index: 1;
            }
            .header .subtitle {
                margin: 15px 0 0 0;
                opacity: 0.95;
                font-size: 18px;
                position: relative;
                z-index: 1;
            }
            .urgent-notice {
                background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                color: white;
                padding: 20px;
                border-radius: 15px;
                text-align: center;
                margin: 25px;
                font-weight: bold;
                font-size: 18px;
                box-shadow: 0 10px 25px rgba(255,107,107,0.3);
                border: 2px solid #fff;
                position: relative;
                overflow: hidden;
            }
            .urgent-notice::before {
                content: "⚡";
                font-size: 24px;
                margin-left: 10px;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            .content {
                padding: 30px;
            }
            .section {
                margin-bottom: 30px;
                padding: 25px;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 15px;
                border-right: 5px solid #667eea;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            .section:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 35px rgba(0,0,0,0.15);
            }
            .section h3 {
                margin: 0 0 20px 0;
                color: #667eea;
                font-size: 20px;
                border-bottom: 3px solid #667eea;
                padding-bottom: 12px;
                text-align: center;
                position: relative;
            }
            .section h3::after {
                content: "";
                position: absolute;
                bottom: -3px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 3px;
                background: linear-gradient(90deg, #667eea, #764ba2);
                border-radius: 2px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            .info-item {
                background: white;
                padding: 20px;
                border-radius: 12px;
                border: 2px solid #e9ecef;
                box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            .info-item::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background: linear-gradient(180deg, #667eea, #764ba2);
                transition: width 0.3s ease;
            }
            .info-item:hover::before {
                width: 8px;
            }
            .info-item:hover {
                transform: translateX(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                border-color: #667eea;
            }
            .info-label {
                font-weight: bold;
                color: #495057;
                margin-bottom: 8px;
                font-size: 15px;
                display: flex;
                align-items: center;
            }
            .info-label::before {
                content: "📌";
                margin-left: 8px;
                font-size: 16px;
            }
            .info-value {
                color: #212529;
                font-size: 17px;
                font-weight: 500;
                padding: 8px 12px;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 8px;
                border: 1px solid #dee2e6;
            }
            .message-box {
                background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                border: 3px solid #2196f3;
                padding: 25px;
                border-radius: 15px;
                margin: 25px 0;
                box-shadow: 0 10px 30px rgba(33,150,243,0.2);
                position: relative;
                overflow: hidden;
            }
            .message-box::before {
                content: "💬";
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 24px;
                opacity: 0.3;
            }
            .message-box h4 {
                margin: 0 0 20px 0;
                color: #1976d2;
                text-align: center;
                font-size: 22px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            }
            .message-content {
                background: white;
                padding: 25px;
                border-radius: 12px;
                border: 2px solid #e3f2fd;
                white-space: pre-wrap;
                line-height: 1.8;
                color: #1565c0;
                font-size: 16px;
                box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
                position: relative;
            }
            .message-content::before {
                content: "📝";
                position: absolute;
                top: 10px;
                right: 15px;
                font-size: 20px;
                opacity: 0.4;
            }
            .contact-info {
                background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%);
                border: 3px solid #4caf50;
                padding: 25px;
                border-radius: 15px;
                margin: 25px 0;
                box-shadow: 0 10px 30px rgba(76,175,80,0.2);
                position: relative;
            }
            .contact-info::before {
                content: "👤";
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 24px;
                opacity: 0.3;
            }
            .contact-info h4 {
                margin: 0 0 20px 0;
                color: #2e7d32;
                text-align: center;
                font-size: 22px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            }
            .contact-info p {
                margin: 12px 0;
                color: #1b5e20;
                font-size: 16px;
                padding: 10px 15px;
                background: white;
                border-radius: 8px;
                border: 1px solid #c8e6c9;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
            }
            .contact-info p strong {
                color: #2e7d32;
                margin-left: 8px;
            }
            .highlight-box {
                background: linear-gradient(135deg, #ffd54f 0%, #ffb300 100%);
                color: #333;
                padding: 25px;
                border-radius: 15px;
                text-align: center;
                margin: 25px 0;
                box-shadow: 0 15px 35px rgba(255,213,79,0.3);
                border: 3px solid #fff;
                position: relative;
                overflow: hidden;
            }
            .highlight-box::before {
                content: "⏰";
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 24px;
                opacity: 0.3;
            }
            .highlight-box h3 {
                margin: 0 0 15px 0;
                font-size: 24px;
                color: #333;
                text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
            }
            .highlight-box p {
                margin: 0;
                font-size: 20px;
                font-weight: bold;
                color: #333;
            }
            .footer {
                background: linear-gradient(135deg, #343a40 0%, #495057 100%);
                color: white;
                padding: 30px;
                text-align: center;
                font-size: 15px;
                position: relative;
                overflow: hidden;
            }
            .footer::before {
                content: "";
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
                animation: float 8s ease-in-out infinite reverse;
            }
            .footer p {
                margin: 8px 0;
                position: relative;
                z-index: 1;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            .stat-item {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 8px 25px rgba(102,126,234,0.3);
                border: 2px solid #fff;
                transition: transform 0.3s ease;
            }
            .stat-item:hover {
                transform: translateY(-5px);
            }
            .stat-number {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .stat-label {
                font-size: 14px;
                opacity: 0.9;
            }
            @media (max-width: 600px) {
                .info-grid {
                    grid-template-columns: 1fr;
                }
                .stats-grid {
                    grid-template-columns: 1fr;
                }
                .content {
                    padding: 20px;
                }
                .header {
                    padding: 25px 20px;
                }
                .section {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>📧 پیام جدید از فرم تماس</h1>
                <div class="subtitle">آزمایشگاه تشخیص پزشکی سلامت</div>
            </div>
            
            <div class="content">
                <div class="urgent-notice">
                    پیام جدید دریافت شد - لطفاً در اسرع وقت بررسی کنید
                </div>
                
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">📊</div>
                        <div class="stat-label">پیام جدید</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">👤</div>
                        <div class="stat-label">فرستنده</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">📝</div>
                        <div class="stat-label">موضوع</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">⏰</div>
                        <div class="stat-label">زمان</div>
                    </div>
                </div>
                
                <div class="section">
                    <h3>👤 اطلاعات فرستنده</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">نام و نام خانوادگی</div>
                            <div class="info-value">' . htmlspecialchars($data['name']) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">ایمیل</div>
                            <div class="info-value">' . htmlspecialchars($data['email']) . '</div>
                        </div>';
    
    if (!empty($data['phone'])) {
        $html .= '
                        <div class="info-item">
                            <div class="info-label">شماره تلفن</div>
                            <div class="info-value">' . htmlspecialchars($data['phone']) . '</div>
                        </div>';
    }
    
    $html .= '
                        <div class="info-item">
                            <div class="info-label">موضوع</div>
                            <div class="info-value">' . htmlspecialchars($data['subject']) . '</div>
                        </div>
                    </div>
                </div>
                
                <div class="message-box">
                    <h4>📝 متن پیام</h4>
                    <div class="message-content">' . nl2br(htmlspecialchars($data['message'])) . '</div>
                </div>
                
                <div class="contact-info">
                    <h4>📞 اطلاعات تماس فرستنده</h4>
                    <p><strong>نام:</strong> ' . htmlspecialchars($data['name']) . '</p>
                    <p><strong>ایمیل:</strong> ' . htmlspecialchars($data['email']) . '</p>';
    
    if (!empty($data['phone'])) {
        $html .= '<p><strong>شماره تلفن:</strong> ' . htmlspecialchars($data['phone']) . '</p>';
    }
    
    $html .= '
                </div>
                
                <div class="highlight-box">
                    <h3>⏰ زمان ارسال پیام</h3>
                    <p>' . date('Y/m/d H:i:s') . '</p>
                </div>
            </div>
            
            <div class="footer">
                <p>این ایمیل به صورت خودکار توسط سیستم تماس آزمایشگاه سلامت ارسال شده است</p>
                <p>لطفاً در اسرع وقت به پیام پاسخ دهید</p>
                <p>💡 برای پاسخ سریع، روی ایمیل فرستنده کلیک کنید</p>
            </div>
        </div>
    </body>
    </html>';
    
    return $html;
}

// ایجاد ایمیل تأیید برای فرستنده پیام تماس
function createContactConfirmationEmail($data) {
    $html = '
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>پیام شما دریافت شد</title>
        <style>
            body {
                font-family: "Tahoma", "Arial", sans-serif;
                line-height: 1.6;
                color: #333;
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                margin: 0;
                padding: 20px;
                min-height: 100vh;
            }
            .email-container {
                max-width: 650px;
                margin: 0 auto;
                background: white;
                border-radius: 20px;
                box-shadow: 0 25px 50px rgba(0,0,0,0.15);
                overflow: hidden;
                border: 3px solid #fff;
            }
            .header {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            .header::before {
                content: "";
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: float 6s ease-in-out infinite;
            }
            @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }
            .header h1 {
                margin: 0;
                font-size: 28px;
                font-weight: bold;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                position: relative;
                z-index: 1;
            }
            .header .subtitle {
                margin: 15px 0 0 0;
                opacity: 0.95;
                font-size: 18px;
                position: relative;
                z-index: 1;
            }
            .content {
                padding: 30px;
            }
            .success-box {
                background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
                border: 3px solid #28a745;
                padding: 30px;
                border-radius: 15px;
                text-align: center;
                margin: 25px 0;
                box-shadow: 0 15px 35px rgba(40,167,69,0.3);
                position: relative;
                overflow: hidden;
            }
            .success-box::before {
                content: "🎉";
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 32px;
                opacity: 0.3;
                animation: bounce 2s infinite;
            }
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                60% { transform: translateY(-5px); }
            }
            .success-box h3 {
                margin: 0 0 15px 0;
                color: #155724;
                font-size: 24px;
                text-shadow: 1px 1px 2px rgba(255,255,255,0.5);
            }
            .success-box p {
                margin: 0;
                color: #155724;
                font-size: 18px;
                font-weight: 500;
            }
            .section {
                margin-bottom: 30px;
                padding: 25px;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 15px;
                border-right: 5px solid #28a745;
                box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                transition: transform 0.3s ease;
            }
            .section:hover {
                transform: translateY(-5px);
                box-shadow: 0 15px 35px rgba(0,0,0,0.15);
            }
            .section h3 {
                margin: 0 0 20px 0;
                color: #28a745;
                font-size: 20px;
                border-bottom: 3px solid #28a745;
                padding-bottom: 12px;
                text-align: center;
                position: relative;
            }
            .section h3::after {
                content: "";
                position: absolute;
                bottom: -3px;
                left: 50%;
                transform: translateX(-50%);
                width: 60px;
                height: 3px;
                background: linear-gradient(90deg, #28a745, #20c997);
                border-radius: 2px;
            }
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 20px;
            }
            .info-item {
                background: white;
                padding: 20px;
                border-radius: 12px;
                border: 2px solid #e9ecef;
                box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }
            .info-item::before {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 4px;
                height: 100%;
                background: linear-gradient(180deg, #28a745, #20c997);
                transition: width 0.3s ease;
            }
            .info-item:hover::before {
                width: 8px;
            }
            .info-item:hover {
                transform: translateX(-5px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.15);
                border-color: #28a745;
            }
            .info-label {
                font-weight: bold;
                color: #495057;
                margin-bottom: 8px;
                font-size: 15px;
                display: flex;
                align-items: center;
            }
            .info-label::before {
                content: "📌";
                margin-left: 8px;
                font-size: 16px;
            }
            .info-value {
                color: #212529;
                font-size: 17px;
                font-weight: 500;
                padding: 8px 12px;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                border-radius: 8px;
                border: 1px solid #dee2e6;
            }
            .next-steps {
                background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
                border: 3px solid #2196f3;
                padding: 25px;
                border-radius: 15px;
                margin: 25px 0;
                box-shadow: 0 10px 30px rgba(33,150,243,0.2);
                position: relative;
                overflow: hidden;
            }
            .next-steps::before {
                content: "📞";
                position: absolute;
                top: 15px;
                right: 20px;
                font-size: 24px;
                opacity: 0.3;
            }
            .next-steps h3 {
                margin: 0 0 20px 0;
                color: #1976d2;
                text-align: center;
                font-size: 22px;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            }
            .next-steps ul {
                margin: 0;
                padding-right: 20px;
            }
            .next-steps li {
                margin-bottom: 15px;
                color: #1565c0;
                font-size: 16px;
                padding: 12px 15px;
                background: white;
                border-radius: 8px;
                border: 1px solid #e3f2fd;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                position: relative;
                transition: all 0.3s ease;
            }
            .next-steps li::before {
                content: "✅";
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                font-size: 18px;
                opacity: 0.7;
            }
            .next-steps li:hover {
                transform: translateX(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                border-color: #2196f3;
            }
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin: 20px 0;
            }
            .stat-item {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                color: white;
                padding: 20px;
                border-radius: 12px;
                text-align: center;
                box-shadow: 0 8px 25px rgba(40,167,69,0.3);
                border: 2px solid #fff;
                transition: transform 0.3s ease;
            }
            .stat-item:hover {
                transform: translateY(-5px);
            }
            .stat-number {
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .stat-label {
                font-size: 14px;
                opacity: 0.9;
            }
            .footer {
                background: linear-gradient(135deg, #343a40 0%, #495057 100%);
                color: white;
                padding: 30px;
                text-align: center;
                font-size: 15px;
                position: relative;
                overflow: hidden;
            }
            .footer::before {
                content: "";
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%);
                animation: float 8s ease-in-out infinite reverse;
            }
            .footer p {
                margin: 8px 0;
                position: relative;
                z-index: 1;
            }
            @media (max-width: 600px) {
                .info-grid {
                    grid-template-columns: 1fr;
                }
                .stats-grid {
                    grid-template-columns: 1fr;
                }
                .content {
                    padding: 20px;
                }
                .header {
                    padding: 25px 20px;
                }
                .section {
                    padding: 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>✅ پیام شما دریافت شد</h1>
                <div class="subtitle">آزمایشگاه تشخیص پزشکی سلامت</div>
            </div>
            
            <div class="content">
                <div class="success-box">
                    <h3>🎉 پیام شما با موفقیت ارسال شد</h3>
                    <p>کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-item">
                        <div class="stat-number">📧</div>
                        <div class="stat-label">پیام ارسال شد</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">👤</div>
                        <div class="stat-label">نام شما</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">📝</div>
                        <div class="stat-label">موضوع</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">⏰</div>
                        <div class="stat-label">زمان</div>
                    </div>
                </div>
                
                <div class="section">
                    <h3>📋 جزئیات پیام</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <div class="info-label">نام و نام خانوادگی</div>
                            <div class="info-value">' . htmlspecialchars($data['name']) . '</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label">موضوع</div>
                            <div class="info-value">' . htmlspecialchars($data['subject']) . '</div>
                        </div>';
    
    if (!empty($data['phone'])) {
        $html .= '
                        <div class="info-item">
                            <div class="info-label">شماره تلفن</div>
                            <div class="info-value">' . htmlspecialchars($data['phone']) . '</div>
                        </div>';
    }
    
    $html .= '
                    </div>
                </div>
                
                <div class="next-steps">
                    <h3>📞 مراحل بعدی</h3>
                    <ul>
                        <li>کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت</li>
                        <li>در صورت نیاز به اطلاعات بیشتر، با ما تماس بگیرید</li>
                        <li>شماره تماس: 021-46833010</li>
                    </ul>
                </div>
            </div>
            
            <div class="footer">
                <p>با تشکر از تماس شما</p>
                <p>تیم آزمایشگاه سلامت</p>
                <p>💡 برای سوالات بیشتر، از فرم تماس استفاده کنید</p>
            </div>
        </div>
    </body>
    </html>';
    
    return $html;
}

/**
 * ارسال پیامک OTP مطابق با مستندات رسمی SMS.ir
 * SMS.ir Official API Documentation Implementation
 */
function sendOtpSms($phone, $code) {
    try {
        // بررسی تنظیمات ضروری مطابق مستندات SMS.ir
        if (!defined('SMS_API_KEY') || !SMS_API_KEY) {
            if (function_exists('logError')) {
                logError("SMS_API_KEY not defined", ['phone' => $phone]);
            }
            return false;
        }
        
        if (!defined('SMSIR_TEMPLATE_ID') || intval(SMSIR_TEMPLATE_ID) <= 0) {
            if (function_exists('logError')) {
                logError("SMSIR_TEMPLATE_ID invalid", ['phone' => $phone, 'template_id' => SMSIR_TEMPLATE_ID]);
            }
            return false;
        }

        // آماده‌سازی داده‌ها طبق مستندات SMS.ir
        $requestData = [
            'mobile' => $phone,
            'templateId' => intval(SMSIR_TEMPLATE_ID),
            'parameters' => [
                [
                    'name' => SMSIR_TEMPLATE_PARAM_NAME,
                    'value' => strval($code)
                ]
            ]
        ];
        
        $jsonData = json_encode($requestData, JSON_UNESCAPED_UNICODE);
        
        // تنظیمات cURL مطابق مستندات SMS.ir
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://api.sms.ir/v1/send/verify',
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $jsonData,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'x-api-key: ' . SMS_API_KEY, // Header مطابق مستندات SMS.ir
                'Accept: application/json'
            ],
            // تنظیمات SSL
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2
        ]);
        
        // اجرای درخواست
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);
        
        // بررسی خطاهای cURL
        if ($curlError) {
            if (function_exists('logError')) {
                logError("SMS.ir CURL Error: " . $curlError, [
                    'phone' => $phone,
                    'template_id' => SMSIR_TEMPLATE_ID
                ]);
            }
            return false;
        }
        
        // بررسی کد HTTP
        if ($httpCode !== 200) {
            if (function_exists('logError')) {
                logError("SMS.ir HTTP Error", [
                    'phone' => $phone,
                    'http_code' => $httpCode,
                    'response' => $result,
                    'template_id' => SMSIR_TEMPLATE_ID
                ]);
            }
            return false;
        }
        
        // پردازش پاسخ API
        if ($result === false) {
            if (function_exists('logError')) {
                logError("SMS.ir no response received", ['phone' => $phone]);
            }
            return false;
        }
        
        $response = json_decode($result, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            if (function_exists('logError')) {
                logError("SMS.ir JSON decode error", [
                    'phone' => $phone,
                    'response' => $result,
                    'json_error' => json_last_error_msg()
                ]);
            }
            return false;
        }
        
        // بررسی پاسخ مطابق مستندات SMS.ir
        $isSuccess = false;
        $messageId = null;
        $cost = null;
        
        if (isset($response['status']) && intval($response['status']) === 1) {
            $isSuccess = true;
            $messageId = $response['data']['messageId'] ?? null;
            $cost = $response['data']['cost'] ?? null;
            
            // لاگ موفقیت‌آمیز
            if (function_exists('logInfo')) {
                logInfo("SMS.ir OTP sent successfully", [
                    'phone' => $phone,
                    'message_id' => $messageId,
                    'cost' => $cost,
                    'template_id' => SMSIR_TEMPLATE_ID
                ]);
            }
        } else {
            // لاگ خطا
            if (function_exists('logError')) {
                logError("SMS.ir API returned error", [
                    'phone' => $phone,
                    'response' => $response,
                    'template_id' => SMSIR_TEMPLATE_ID
                ]);
            }
        }
        
        return $isSuccess;
        
    } catch (Exception $e) {
        if (function_exists('logError')) {
            logError("SMS.ir exception: " . $e->getMessage(), [
                'phone' => $phone,
                'template_id' => SMSIR_TEMPLATE_ID ?? 'not_set',
                'trace' => $e->getTraceAsString()
            ]);
        }
        return false;
    }
}

/**
 * ارسال پیامک قالب‌دار مطابق SMS.ir
 * Template SMS sending according to SMS.ir documentation
 */
function sendTemplateSMS($phone, $templateId, $parameters = []) {
    try {
        if (!defined('SMS_API_KEY') || !SMS_API_KEY) {
            if (function_exists('logError')) {
                logError("SMS_API_KEY not defined for template SMS", ['phone' => $phone]);
            }
            return false;
        }

        // تبدیل پارامترها به فرمت مورد نیاز SMS.ir
        $smsParameters = [];
        foreach ($parameters as $name => $value) {
            $smsParameters[] = [
                'name' => $name,
                'value' => strval($value)
            ];
        }

        $requestData = [
            'mobile' => $phone,
            'templateId' => intval($templateId),
            'parameters' => $smsParameters
        ];
        
        $jsonData = json_encode($requestData, JSON_UNESCAPED_UNICODE);
        
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => 'https://api.sms.ir/v1/send/verify',
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $jsonData,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 10,
            CURLOPT_HTTPHEADER => [
                'Content-Type: application/json',
                'x-api-key: ' . SMS_API_KEY,
                'Accept: application/json'
            ],
            CURLOPT_SSL_VERIFYPEER => true,
            CURLOPT_SSL_VERIFYHOST => 2
        ]);
        
        $result = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $curlError = curl_error($ch);
        curl_close($ch);
        
        if ($curlError) {
            if (function_exists('logError')) {
                logError("Template SMS CURL Error: " . $curlError, [
                    'phone' => $phone,
                    'template_id' => $templateId
                ]);
            }
            return false;
        }
        
        if ($httpCode !== 200) {
            if (function_exists('logError')) {
                logError("Template SMS HTTP Error", [
                    'phone' => $phone,
                    'http_code' => $httpCode,
                    'template_id' => $templateId,
                    'response' => $result
                ]);
            }
            return false;
        }
        
        $response = json_decode($result, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            if (function_exists('logError')) {
                logError("Template SMS JSON decode error", [
                    'phone' => $phone,
                    'template_id' => $templateId,
                    'response' => $result
                ]);
            }
            return false;
        }
        
        $isSuccess = isset($response['status']) && intval($response['status']) === 1;
        
        if ($isSuccess && function_exists('logInfo')) {
            logInfo("Template SMS sent successfully", [
                'phone' => $phone,
                'template_id' => $templateId,
                'message_id' => $response['data']['messageId'] ?? null,
                'cost' => $response['data']['cost'] ?? null
            ]);
        }
        
        return $isSuccess;
        
    } catch (Exception $e) {
        if (function_exists('logError')) {
            logError("Template SMS exception: " . $e->getMessage(), [
                'phone' => $phone,
                'template_id' => $templateId
            ]);
        }
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
 * لاگ خطا
 */
function logError($message, $context = []) {
    if (!defined('LOG_ENABLED') || !LOG_ENABLED) return;
    
    $logData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'level' => 'ERROR',
        'message' => $message,
        'context' => $context
    ];
    
    $logLine = json_encode($logData, JSON_UNESCAPED_UNICODE) . "\n";
    $logFile = dirname(__FILE__) . '/' . (defined('LOG_FILE') ? LOG_FILE : 'errors.log');
    file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
}

/**
 * لاگ اطلاعات
 */
function logInfo($message, $context = []) {
    if (!defined('LOG_ENABLED') || !LOG_ENABLED) return;
    
    $logData = [
        'timestamp' => date('Y-m-d H:i:s'),
        'level' => 'INFO',
        'message' => $message,
        'context' => $context
    ];
    
    $logLine = json_encode($logData, JSON_UNESCAPED_UNICODE) . "\n";
    $logFile = dirname(__FILE__) . '/' . (defined('LOG_FILE') ? LOG_FILE : 'info.log');
    file_put_contents($logFile, $logLine, FILE_APPEND | LOCK_EX);
}
?>
