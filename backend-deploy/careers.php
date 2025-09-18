<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Accept both JSON (preferred) and form-data
$json = json_decode(file_get_contents('php://input'), true);
$source = is_array($json) ? $json : $_POST;

// Get form data
$firstName = htmlspecialchars($source['firstName'] ?? '');
$lastName = htmlspecialchars($source['lastName'] ?? '');
$nationalId = htmlspecialchars($source['nationalId'] ?? '');
$birthDate = htmlspecialchars($source['birthDate'] ?? '');
$phone = htmlspecialchars($source['phone'] ?? '');
$email = htmlspecialchars($source['email'] ?? '');
$major = htmlspecialchars($source['major'] ?? '');
$degree = htmlspecialchars($source['degree'] ?? '');
$description = htmlspecialchars($source['description'] ?? '');
$hasExperience = htmlspecialchars($source['hasExperience'] ?? '');
$experienceDetails = htmlspecialchars($source['experienceDetails'] ?? '');
$address = htmlspecialchars($source['address'] ?? '');

// Handle resume upload (multipart/form-data)
$resumeUrl = '';
if (!empty($_FILES['resume']) && isset($_FILES['resume']['error']) && $_FILES['resume']['error'] === UPLOAD_ERR_OK) {
    $allowedExtensions = ['pdf', 'doc', 'docx', 'txt'];
    $maxSize = 5 * 1024 * 1024; // 5MB
    $originalName = $_FILES['resume']['name'];
    $tmpPath = $_FILES['resume']['tmp_name'];
    $size = (int)$_FILES['resume']['size'];
    $ext = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    if ($size > 0 && $size <= $maxSize && in_array($ext, $allowedExtensions, true)) {
        $uploadDir = __DIR__ . '/uploads';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0755, true);
        }
        $safeBase = preg_replace('/[^a-zA-Z0-9_-]/', '-', pathinfo($originalName, PATHINFO_FILENAME));
        $newName = $safeBase . '-' . date('Ymd-His') . '-' . substr(md5(uniqid('', true)), 0, 6) . '.' . $ext;
        $destPath = $uploadDir . '/' . $newName;
        if (@move_uploaded_file($tmpPath, $destPath)) {
            $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') ? 'https' : 'http';
            $host = $_SERVER['HTTP_HOST'] ?? '';
            $resumeUrl = $scheme . '://' . $host . '/api/uploads/' . rawurlencode($newName);
        }
    }
}

// Validate required fields
$required_fields = ['firstName', 'lastName', 'nationalId', 'birthDate', 'phone'];
foreach ($required_fields as $field) {
    if (empty($source[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit();
    }
}

// Create minimal HTML email for admin (careers)
function createBeautifulCareersEmail($data) {
    $fullName = htmlspecialchars(($data['firstName'] ?? '') . ' ' . ($data['lastName'] ?? ''));
    $nationalId = htmlspecialchars($data['nationalId'] ?? '');
    $birthDate = htmlspecialchars($data['birthDate'] ?? '');
    $phone = htmlspecialchars($data['phone'] ?? '');
    $email = htmlspecialchars($data['email'] ?? '');
    $major = htmlspecialchars($data['major'] ?? '');
    $degree = htmlspecialchars($data['degree'] ?? '');
    $description = isset($data['description']) ? nl2br(htmlspecialchars($data['description'])) : '';
    $hasExperience = htmlspecialchars($data['hasExperience'] ?? 'no');
    $experienceText = $hasExperience === 'yes' ? 'بله' : 'خیر';
    $experienceDetails = isset($data['experienceDetails']) ? nl2br(htmlspecialchars($data['experienceDetails'])) : '';
    $address = isset($data['address']) ? nl2br(htmlspecialchars($data['address'])) : '';
    $date = date('Y/m/d H:i:s');
    
    $html = '
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>درخواست جدید همکاری</title>
    </head>
    <body style="margin:0;background:#f6f9fc;font-family:Tahoma,Arial,sans-serif;color:#1f2328;">
        <div style="max-width:640px;margin:24px auto;background:#fff;border:1px solid #e6e8eb;border-radius:12px;overflow:hidden;">
            <div style="padding:20px 24px;border-bottom:1px solid #eef1f4;">
                <div style="font-size:16px;color:#6b7280;">آزمایشگاه تشخیص پزشکی سلامت</div>
                <h1 style="margin:4px 0 0 0;font-size:18px;font-weight:700;color:#111827;">درخواست جدید همکاری</h1>
            </div>
            <div style="padding:20px 24px;">
                <table role="presentation" style="width:100%;border-collapse:collapse;">
                    <tbody>
                        <tr><td style="width:170px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">نام و نام خانوادگی</td><td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $fullName . '</td></tr>
                        <tr><td style="width:170px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">کد ملی</td><td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $nationalId . '</td></tr>
                        <tr><td style="width:170px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">تاریخ تولد</td><td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $birthDate . '</td></tr>
                        <tr><td style="width:170px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">شماره تماس</td><td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;"><a href="tel:' . $phone . '" style="color:#0ea5e9;text-decoration:none;">' . $phone . '</a></td></tr>' .
                        ($email ? '<tr><td style="width:170px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">ایمیل</td><td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;"><a href="mailto:' . $email . '" style="color:#0ea5e9;text-decoration:none;">' . $email . '</a></td></tr>' : '') .
                        '<tr><td style="width:170px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">رشته تحصیلی</td><td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $major . '</td></tr>
                        <tr><td style="width:170px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">مقطع تحصیلی</td><td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $degree . '</td></tr>
                        <tr><td style="width:170px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">سابقه کار</td><td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $experienceText . '</td></tr>
                    </tbody>
                </table>';

    if (!empty($data['resumeUrl'])) {
        $html .= '
                <div style="margin-top:16px;padding:12px 14px;background:#eef6ff;border:1px solid #cfe1ff;border-radius:8px;">
                    <div style="font-size:13px;color:#1d4ed8;margin-bottom:6px;">رزومه</div>
                    <a href="' . htmlspecialchars($data['resumeUrl']) . '" style="font-size:14px;color:#0ea5e9;text-decoration:none;">دانلود رزومه</a>
                        </div>';
    }
    
    if ($experienceDetails) {
    $html .= '
                <div style="margin-top:16px;padding:12px 14px;background:#f9fafb;border:1px solid #eef1f4;border-radius:8px;">
                    <div style="font-size:13px;color:#6b7280;margin-bottom:6px;">جزئیات سابقه کار</div>
                    <div style="font-size:14px;color:#111827;line-height:1.9;white-space:pre-wrap;">' . $experienceDetails . '</div>
                </div>';
    }
    
    if ($description) {
        $html .= '
                <div style="margin-top:16px;padding:12px 14px;background:#fff7ed;border:1px solid #ffedd5;border-radius:8px;">
                    <div style="font-size:13px;color:#9a3412;margin-bottom:6px;">توضیحات متقاضی</div>
                    <div style="font-size:14px;color:#7c2d12;line-height:1.9;white-space:pre-wrap;">' . $description . '</div>
                </div>';
    }
    
    if ($address) {
        $html .= '
                <div style="margin-top:16px;padding:12px 14px;background:#f9fafb;border:1px solid #eef1f4;border-radius:8px;">
                    <div style="font-size:13px;color:#6b7280;margin-bottom:6px;">نشانی</div>
                    <div style="font-size:14px;color:#111827;line-height:1.9;white-space:pre-wrap;">' . $address . '</div>
                </div>';
    }
    
    $html .= '
            </div>
            <div style="padding:12px 24px;background:#fafafa;border-top:1px solid #eef1f4;text-align:center;">
                <div style="font-size:12px;color:#6b7280;">این ایمیل به صورت خودکار ارسال شده است • ' . $date . '</div>
            </div>
        </div>
    </body>
    </html>';
    
    return $html;
}

// Create beautiful confirmation email for applicant
function createCustomerCareersEmail($data) {
    $fullName = htmlspecialchars(($data['firstName'] ?? '') . ' ' . ($data['lastName'] ?? ''));
    
    return '
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>درخواست همکاری شما دریافت شد</title>
    </head>
    <body style="margin:0;background:#f6f9fc;font-family:Tahoma,Arial,sans-serif;color:#1f2328;">
        <div style="max-width:640px;margin:24px auto;background:#fff;border:1px solid #e6e8eb;border-radius:12px;overflow:hidden;">
            <div style="padding:20px 24px;border-bottom:1px solid #eef1f4;">
                <div style="font-size:16px;color:#6b7280;">آزمایشگاه تشخیص پزشکی سلامت</div>
                <h1 style="margin:4px 0 0 0;font-size:18px;font-weight:700;color:#111827;">درخواست همکاری شما دریافت شد</h1>
            </div>
            <div style="padding:20px 24px;">
                <p style="margin:0 0 12px 0;font-size:14px;color:#374151;">' . $fullName . ' عزیز، درخواست شما دریافت شد و در صف بررسی قرار گرفت.</p>
                <div style="font-size:12px;color:#6b7280;">زمان ثبت: ' . date('Y/m/d H:i:s') . '</div>
            </div>
            <div style="padding:12px 24px;background:#fafafa;border-top:1px solid #eef1f4;text-align:center;">
                <div style="font-size:12px;color:#6b7280;">با تشکر از شما • تیم آزمایشگاه سلامت</div>
            </div>
        </div>
    </body>
    </html>';
}

// Email headers for HTML emails
$headers = [
    'From: info@salamatlab.com',
    'Reply-To: info@salamatlab.com',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit'
];

// Send beautiful email to admin
$admin_email = 'salamatlab33010@gmail.com';
$admin_subject = "درخواست جدید همکاری - آزمایشگاه سلامت";
$admin_message = createBeautifulCareersEmail([
    'firstName' => $firstName,
    'lastName' => $lastName,
    'nationalId' => $nationalId,
    'birthDate' => $birthDate,
    'phone' => $phone,
    'email' => $email,
    'major' => $major,
    'degree' => $degree,
    'description' => $description,
    'hasExperience' => $hasExperience,
    'experienceDetails' => $experienceDetails,
    'address' => $address,
    'resumeUrl' => $resumeUrl
]);
$mail_sent = mail($admin_email, $admin_subject, $admin_message, implode("\r\n", $headers));

// Store to file with unique id for admin view
$cid = bin2hex(random_bytes(6));
$cstore = __DIR__ . '/careers_store.json';
if (!file_exists($cstore)) { file_put_contents($cstore, json_encode([])); }
$all = [];
$rawStore = @file_get_contents($cstore);
if ($rawStore) { $dec = json_decode($rawStore, true); if (is_array($dec)) { $all = $dec; } }
$record = [
    'id' => $cid,
    'createdAt' => date('Y-m-d H:i:s'),
    'firstName' => $firstName,
    'lastName' => $lastName,
    'fullName' => trim($firstName . ' ' . $lastName),
    'nationalId' => $nationalId,
    'birthDate' => $birthDate,
    'phone' => $phone,
    'email' => $email,
    'major' => $major,
    'degree' => $degree,
    'description' => $description,
    'hasExperience' => $hasExperience,
    'experienceDetails' => $experienceDetails,
    'address' => $address,
    'resumeUrl' => $resumeUrl,
    'type' => 'career'
];
$all[$cid] = $record;
@file_put_contents($cstore, json_encode($all, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);

// Send beautiful confirmation email to applicant
$customer_confirmation_sent = false;
if ($email) {
    $customer_subject = "درخواست همکاری شما دریافت شد - آزمایشگاه سلامت";
    $customer_message = createCustomerCareersEmail([
        'firstName' => $firstName,
        'lastName' => $lastName
    ]);
    $customer_confirmation_sent = mail($email, $customer_subject, $customer_message, implode("\r\n", $headers));
}

// Log the careers request
$log_entry = date('Y-m-d H:i:s') . " | " . $firstName . " " . $lastName . " | " . $phone . " | " . $email . " | " . $major . " | " . $degree . "\n";
file_put_contents('careers.log', $log_entry, FILE_APPEND | LOCK_EX);

// Return success response
if ($mail_sent) {
    // ارسال پیامک تایید همکاری با ما
    if (defined('SMS_API_URL') && SMS_API_URL && defined('SMS_API_KEY') && SMS_API_KEY && defined('CAREERS_CONFIRM_TEMPLATE_ID') && intval(CAREERS_CONFIRM_TEMPLATE_ID) > 0) {
        $digitsPhone = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($digitsPhone) === 11 && strpos($digitsPhone, '0') === 0) { $digitsPhone = substr($digitsPhone, 1); }
        $headersSms = [
            'Content-Type: application/json',
            'Accept: text/plain',
            'x-api-key: ' . SMS_API_KEY
        ];
        $fullName = trim(($firstName ?: '') . ' ' . ($lastName ?: ''));
        $payloadSms = json_encode([
            'mobile' => $digitsPhone,
            'templateId' => intval(CAREERS_CONFIRM_TEMPLATE_ID),
            'parameters' => [
                ['name' => (defined('CAREERS_CONFIRM_PARAM_NAME') ? CAREERS_CONFIRM_PARAM_NAME : 'NAME'), 'value' => $fullName]
            ]
        ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $ch = curl_init(SMS_API_URL);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $payloadSms);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headersSms);
        curl_exec($ch);
        curl_close($ch);
    }
    echo json_encode([
        'success' => true,
        'message' => 'درخواست همکاری شما با موفقیت ارسال شد',
        'admin_email_sent' => $mail_sent,
        'customer_confirmation_sent' => $customer_confirmation_sent
        , 'id' => $cid
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'خطا در ارسال درخواست',
        'admin_email_sent' => false,
        'customer_confirmation_sent' => $customer_confirmation_sent
    ]);
}
?>
