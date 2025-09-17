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

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON input']);
    exit();
}

// Validate required fields
$required_fields = ['name', 'email', 'phone', 'subject', 'message'];
foreach ($required_fields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit();
    }
}

// Sanitize input
$name = htmlspecialchars($input['name']);
$email = htmlspecialchars($input['email']);
$phone = htmlspecialchars($input['phone'] ?? '');
$subject = htmlspecialchars($input['subject']);
$message = htmlspecialchars($input['message']);

// Create minimal, clean HTML email for admin (contact form)
function createBeautifulContactEmail($data) {
	$name = htmlspecialchars($data['name']);
	$email = htmlspecialchars($data['email']);
	$phone = htmlspecialchars($data['phone'] ?? '');
	$subject = htmlspecialchars($data['subject']);
	$message = nl2br(htmlspecialchars($data['message']));
    $date = date('Y/m/d H:i:s');
    
    return '
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>پیام جدید از فرم تماس</title>
    </head>
	<body style="margin:0;background:#f6f9fc;font-family:Tahoma,Arial,sans-serif;color:#1f2328;">
		<div style="max-width:640px;margin:24px auto;background:#fff;border:1px solid #e6e8eb;border-radius:12px;overflow:hidden;">
			<div style="padding:20px 24px;border-bottom:1px solid #eef1f4;">
				<div style="font-size:16px;color:#6b7280;">آزمایشگاه تشخیص پزشکی سلامت</div>
				<h1 style="margin:4px 0 0 0;font-size:18px;font-weight:700;color:#111827;">پیام جدید از فرم تماس</h1>
            </div>
			<div style="padding:20px 24px;">
				<p style="margin:0 0 16px 0;font-size:14px;color:#374151;">خلاصه اطلاعات پیام ارسال‌شده در جدول زیر آمده است.</p>
				<table role="presentation" style="width:100%;border-collapse:collapse;">
					<tbody>
						<tr>
							<td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">نام و نام خانوادگی</td>
							<td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $name . '</td>
						</tr>
						<tr>
							<td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">ایمیل</td>
							<td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;"><a href="mailto:' . $email . '" style="color:#0ea5e9;text-decoration:none;">' . $email . '</a></td>
						</tr>' .
						($phone ? '
						<tr>
							<td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">شماره تماس</td>
							<td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;"><a href="tel:' . $phone . '" style="color:#0ea5e9;text-decoration:none;">' . $phone . '</a></td>
						</tr>' : '') . '
						<tr>
							<td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">موضوع</td>
							<td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $subject . '</td>
						</tr>
					</tbody>
				</table>

				<div style="margin-top:16px;padding:12px 14px;background:#f9fafb;border:1px solid #eef1f4;border-radius:8px;">
					<div style="font-size:13px;color:#6b7280;margin-bottom:6px;">متن پیام</div>
					<div style="font-size:14px;color:#111827;line-height:1.9;">' . $message . '</div>
                    </div>
                </div>
			<div style="padding:12px 24px;background:#fafafa;border-top:1px solid #eef1f4;text-align:center;">
				<div style="font-size:12px;color:#6b7280;">این ایمیل به صورت خودکار ارسال شده است • ' . $date . '</div>
            </div>
        </div>
    </body>
    </html>';
}

// Create minimal confirmation email for customer (contact form)
function createCustomerContactEmail($data) {
	$name = htmlspecialchars($data['name']);
	$subject = htmlspecialchars($data['subject']);
	$phone = htmlspecialchars($data['phone'] ?? '');
    
    return '
    <!DOCTYPE html>
    <html lang="fa" dir="rtl">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>پیام شما دریافت شد</title>
    </head>
	<body style="margin:0;background:#f6f9fc;font-family:Tahoma,Arial,sans-serif;color:#1f2328;">
		<div style="max-width:640px;margin:24px auto;background:#fff;border:1px solid #e6e8eb;border-radius:12px;overflow:hidden;">
			<div style="padding:20px 24px;border-bottom:1px solid #eef1f4;">
				<div style="font-size:16px;color:#6b7280;">آزمایشگاه تشخیص پزشکی سلامت</div>
				<h1 style="margin:4px 0 0 0;font-size:18px;font-weight:700;color:#111827;">پیام شما دریافت شد</h1>
            </div>
			<div style="padding:20px 24px;">
				<p style="margin:0 0 12px 0;font-size:14px;color:#374151;">' . $name . ' عزیز، پیام شما دریافت شد و به‌زودی پاسخ می‌دهیم.</p>
				<table role="presentation" style="width:100%;border-collapse:collapse;">
					<tbody>
						<tr>
							<td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">موضوع</td>
							<td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $subject . '</td>
						</tr>' .
						($phone ? '
						<tr>
							<td style="width:160px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">شماره تماس شما</td>
							<td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $phone . '</td>
						</tr>' : '') . '
					</tbody>
				</table>
				<div style="margin-top:12px;font-size:12px;color:#6b7280;">ساعت ثبت: ' . date('Y/m/d H:i:s') . '</div>
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
$admin_subject = "پیام جدید از فرم تماس - آزمایشگاه سلامت";
$admin_message = createBeautifulContactEmail($input);
$mail_sent = mail($admin_email, $admin_subject, $admin_message, implode("\r\n", $headers));

// Send beautiful confirmation email to customer
$customer_confirmation_sent = false;
$customer_subject = "پیام شما دریافت شد - آزمایشگاه سلامت";
$customer_message = createCustomerContactEmail($input);
$customer_confirmation_sent = mail($email, $customer_subject, $customer_message, implode("\r\n", $headers));

// Store contact submission with ID
$cid = bin2hex(random_bytes(6));
$cstore = __DIR__ . '/contacts_store.json';
if (!file_exists($cstore)) { file_put_contents($cstore, json_encode([])); }
$all = [];
$raw = @file_get_contents($cstore);
if ($raw) { $dec = json_decode($raw, true); if (is_array($dec)) { $all = $dec; } }
$all[$cid] = [
    'id' => $cid,
    'createdAt' => date('Y-m-d H:i:s'),
    'name' => $name,
    'email' => $email,
    'phone' => $phone,
    'subject' => $subject,
    'message' => $message,
    'type' => 'contact'
];
@file_put_contents($cstore, json_encode($all, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);

// Log the contact request
$log_entry = date('Y-m-d H:i:s') . " | " . $name . " | " . $email . " | " . ($phone ?: 'no-phone') . " | " . $subject . "\n";
file_put_contents('contacts.log', $log_entry, FILE_APPEND | LOCK_EX);

// Return success response
if ($mail_sent) {
    // ارسال پیامک تایید فرم تماس
    if (defined('SMS_API_URL') && SMS_API_URL && defined('SMS_API_KEY') && SMS_API_KEY && defined('CONTACT_CONFIRM_TEMPLATE_ID') && intval(CONTACT_CONFIRM_TEMPLATE_ID) > 0) {
        $digitsPhone = preg_replace('/[^0-9]/', '', $phone);
        if (strlen($digitsPhone) === 11 && strpos($digitsPhone, '0') === 0) { $digitsPhone = substr($digitsPhone, 1); }
        $headersSms = [
            'Content-Type: application/json',
            'Accept: text/plain',
            'x-api-key: ' . SMS_API_KEY
        ];
        $payloadSms = json_encode([
            'mobile' => $digitsPhone,
            'templateId' => intval(CONTACT_CONFIRM_TEMPLATE_ID),
            'parameters' => [
                ['name' => (defined('CONTACT_CONFIRM_PARAM_NAME') ? CONTACT_CONFIRM_PARAM_NAME : 'NAME'), 'value' => $name]
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
        'message' => 'پیام شما با موفقیت ارسال شد',
        'admin_email_sent' => $mail_sent,
        'customer_confirmation_sent' => $customer_confirmation_sent,
        'id' => $cid
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'error' => 'خطا در ارسال پیام',
        'admin_email_sent' => false,
        'customer_confirmation_sent' => $customer_confirmation_sent
    ]);
}
?>
