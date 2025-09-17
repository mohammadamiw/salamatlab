<?php
// Include configuration file
require_once 'config.php';

// Set CORS headers
setCorsHeaders();

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Validate request rate
validateRequest();

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit();
}

// Validate input data
$validation_errors = validateInput($input);
if (!empty($validation_errors)) {
    http_response_code(400);
    echo json_encode(['error' => 'Validation failed', 'details' => $validation_errors]);
    exit();
}

// Sanitize input
$fullName = htmlspecialchars($input['fullName']);
$phone = htmlspecialchars($input['phone']);
$email = htmlspecialchars($input['email'] ?? '');
$nationalCode = htmlspecialchars($input['nationalCode']);
$birthDate = htmlspecialchars($input['birthDate']);
$gender = htmlspecialchars($input['gender']);
$city = htmlspecialchars($input['city']);
$hasBasicInsurance = htmlspecialchars($input['hasBasicInsurance']);
$basicInsurance = htmlspecialchars($input['basicInsurance'] ?? '');
$complementaryInsurance = htmlspecialchars($input['complementaryInsurance'] ?? '');
$notes = htmlspecialchars($input['notes'] ?? '');
$type = htmlspecialchars($input['type']);
$title = htmlspecialchars($input['title']);
$price = htmlspecialchars($input['price'] ?? '');

// Generate a unique request ID and store minimal payload for public view
$request_id = bin2hex(random_bytes(6));
$requests_store = __DIR__ . '/requests_store.json';
if (!file_exists($requests_store)) {
    file_put_contents($requests_store, json_encode([]));
}
$store_data = [];
$raw_store = @file_get_contents($requests_store);
if ($raw_store) {
    $decoded = json_decode($raw_store, true);
    if (is_array($decoded)) { $store_data = $decoded; }
}
$store_data[$request_id] = [
    'id' => $request_id,
    'createdAt' => date('Y-m-d H:i:s'),
    'title' => $title,
    'type' => $type,
    'fullName' => $fullName,
    'phone' => $phone,
    'nationalCode' => $nationalCode,
    'birthDate' => $birthDate,
    'gender' => $gender,
    'city' => $city,
    'hasBasicInsurance' => $hasBasicInsurance,
    'basicInsurance' => $basicInsurance,
    'complementaryInsurance' => $complementaryInsurance,
    'address' => $input['address'] ?? '',
    'neighborhood' => $input['neighborhood'] ?? '',
    'street' => $input['street'] ?? '',
    'plaque' => $input['plaque'] ?? '',
    'unit' => $input['unit'] ?? '',
    'locationLat' => $input['locationLat'] ?? null,
    'locationLng' => $input['locationLng'] ?? null,
    'notes' => $notes,
    'prescriptionFiles' => $input['prescriptionFiles'] ?? [],
    'price' => $price
];
@file_put_contents($requests_store, json_encode($store_data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);

// Email content will be created by the new HTML email functions

// Log the booking request
logBooking($input);

// Send email to admin using the new function
$admin_email = ADMIN_EMAIL;
$admin_subject = "درخواست جدید " . ($type === 'checkup' ? 'رزرو چکاپ' : 'رزرو ویزیت پزشک') . " - آزمایشگاه سلامت";

// ایجاد ایمیل زیبا برای مدیر (همراه با لینک عمومی و لینک نقشه)
// Build short link for staff/public view first to include in email
$origin = (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) ? $_SERVER['HTTP_X_FORWARDED_PROTO'] : (isset($_SERVER['REQUEST_SCHEME']) ? $_SERVER['REQUEST_SCHEME'] : 'https')) . '://' . ($_SERVER['HTTP_HOST'] ?? 'salamatlab.com');
$public_link = $origin . '/r/' . $request_id;
$admin_message = createBeautifulEmail($input, 'admin', $public_link);
$mail_sent = sendEmail($admin_email, $admin_subject, $admin_message);

// Send confirmation email to customer if email provided
$customer_confirmation_sent = false;
if ($email) {
    $customer_subject = "درخواست " . ($type === 'checkup' ? 'رزرو چکاپ' : 'رزرو ویزیت پزشک') . " - آزمایشگاه سلامت";
    
    // ایجاد ایمیل زیبا برای مشتری
    $customer_message = createCustomerEmail($input);
    $customer_confirmation_sent = sendEmail($email, $customer_subject, $customer_message);
}

// Return success response
if ($mail_sent) {
    // $public_link already built above

    // ارسال پیامک تایید به کاربر از طریق قالب تایید
    if (defined('SMS_API_URL') && SMS_API_URL && defined('SMS_API_KEY') && SMS_API_KEY && defined('SMSIR_CONFIRM_TEMPLATE_ID') && intval(SMSIR_CONFIRM_TEMPLATE_ID) > 0) {
        $digitsPhone = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($digitsPhone) === 11 && strpos($digitsPhone, '0') === 0) {
            $digitsPhone = substr($digitsPhone, 1);
        }
        $paramName = defined('SMSIR_CONFIRM_PARAM_NAME') ? SMSIR_CONFIRM_PARAM_NAME : 'name';
        $headers = [
            'Content-Type: application/json',
            'Accept: text/plain',
            'x-api-key: ' . SMS_API_KEY
        ];
        $payload = json_encode([
            'mobile' => $digitsPhone,
            'templateId' => intval(SMSIR_CONFIRM_TEMPLATE_ID),
            'parameters' => [
                ['name' => $paramName, 'value' => $fullName]
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $ch = curl_init(SMS_API_URL);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_exec($ch);
        curl_close($ch);
    }

    // ارسال پیامک اطلاع‌رسانی به همکار با لینک
    if (defined('SMSIR_STAFF_TEMPLATE_ID') && intval(SMSIR_STAFF_TEMPLATE_ID) > 0 && defined('STAFF_NOTIFY_MOBILE') && STAFF_NOTIFY_MOBILE) {
        $headers = [
            'Content-Type: application/json',
            'Accept: text/plain',
            'x-api-key: ' . SMS_API_KEY
        ];
        $staffMobile = preg_replace('/[^0-9]/', '', STAFF_NOTIFY_MOBILE);
        if (strlen($staffMobile) === 11 && strpos($staffMobile, '0') === 0) {
            $staffMobile = substr($staffMobile, 1);
        }
        $staffPayload = json_encode([
            'mobile' => $staffMobile,
            'templateId' => intval(SMSIR_STAFF_TEMPLATE_ID),
            'parameters' => [
                ['name' => (defined('SMSIR_STAFF_PARAM_NAME') ? SMSIR_STAFF_PARAM_NAME : 'LINK'), 'value' => $public_link]
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $ch2 = curl_init(SMS_API_URL);
        curl_setopt($ch2, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch2, CURLOPT_POSTFIELDS, $staffPayload);
        curl_setopt($ch2, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch2, CURLOPT_HTTPHEADER, $headers);
        curl_exec($ch2);
        curl_close($ch2);
    }

    // پیامک ثبت درخواست چکاپ (در صورت type=checkup)
    if ($type === 'checkup' && defined('CHECKUP_CONFIRM_TEMPLATE_ID') && intval(CHECKUP_CONFIRM_TEMPLATE_ID) > 0) {
        $digitsPhone2 = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($digitsPhone2) === 11 && strpos($digitsPhone2, '0') === 0) { $digitsPhone2 = substr($digitsPhone2, 1); }
        $headers2 = [
            'Content-Type: application/json',
            'Accept: text/plain',
            'x-api-key: ' . SMS_API_KEY
        ];
        $params = [
            ['name' => (defined('CHECKUP_CONFIRM_NAME_PARAM') ? CHECKUP_CONFIRM_NAME_PARAM : 'NAME'), 'value' => $fullName],
            ['name' => (defined('CHECKUP_CONFIRM_TITLE_PARAM') ? CHECKUP_CONFIRM_TITLE_PARAM : 'CHECKUP'), 'value' => $title]
        ];
        $ckPayload = json_encode([
            'mobile' => $digitsPhone2,
            'templateId' => intval(CHECKUP_CONFIRM_TEMPLATE_ID),
            'parameters' => $params
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $ch3 = curl_init(SMS_API_URL);
        curl_setopt($ch3, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch3, CURLOPT_POSTFIELDS, $ckPayload);
        curl_setopt($ch3, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch3, CURLOPT_HTTPHEADER, $headers2);
        curl_exec($ch3);
        curl_close($ch3);
    }
    echo json_encode([
        'success' => true,
        'message' => 'درخواست با موفقیت ارسال شد',
        'admin_email_sent' => $mail_sent,
        'customer_confirmation_sent' => $customer_confirmation_sent
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'خطا در ارسال ایمیل',
        'admin_email_sent' => false,
        'customer_confirmation_sent' => $customer_confirmation_sent
    ]);
}
?>
