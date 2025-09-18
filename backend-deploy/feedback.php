<?php
// Minimal feedback API: accepts JSON, emails admin a clean summary

require_once 'config.php';

// CORS and content headers
setCorsHeaders();

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(200);
	exit();
}

// Basic rate limit
validateRequest();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	http_response_code(405);
	echo json_encode(['error' => 'Method not allowed']);
	exit();
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
	http_response_code(400);
	echo json_encode(['error' => 'Invalid JSON input']);
	exit();
}

// Extract and sanitize
$fullName = htmlspecialchars($input['fullName'] ?? '');
$phone = htmlspecialchars($input['phone'] ?? '');
$admissionNumber = htmlspecialchars($input['admissionNumber'] ?? '');
$recommendation = htmlspecialchars($input['recommendation'] ?? '');
$suggestions = htmlspecialchars($input['suggestions'] ?? '');
$answers = isset($input['answers']) && is_array($input['answers']) ? $input['answers'] : [];

// Require fullName and phone
if (!$fullName || !$phone) {
	http_response_code(400);
	echo json_encode(['error' => 'name and phone are required']);
	exit();
}

// Questions (same order as UI)
$questions = [
	1 => 'میزان رضایت شما از سیستم نوبت دهی',
	2 => 'میزان رضایت شما از ارائه توضیحات جهت آمادگی قبل از آزمایش',
	3 => 'میزان رضایت شما از سرعت عمل پذیرش',
	4 => 'میزان رضایت شما از برخورد اولیه پرسنل پذیرش و جوابدهی',
	5 => 'میزان رضایت شما از نحوه تعامل مالی متصدی صندوق',
	6 => 'میزان رضایت شما از مهارت و دقت عمل خونگیری (در آزمایشگاه یا منزل)',
	7 => 'میزان رضایت شما از سطح بهداشتی سالن و سرویس بهداشتی',
	8 => 'میزان رضایت شما از حضور مسئول واحد پذیرش و نحوه برخورد آن',
	9 => 'میزان رضایت شما از سرعت جوابدهی آزمایشگاه',
	10 => 'میزان رضایت شما از نحوه ارسال جواب (پیامک، وبسایت و ...)',
	11 => 'میزان رضایت شما از ساعت شروع به کار (۷:۰۰ صبح تا ۲۰:۰۰)',
	12 => 'میزان رضایت شما از تکریم و احترام به سالمندان و معلولین',
	13 => 'میزان رضایت شما از فضای عمومی آزمایشگاه',
	14 => 'میزان رضایت شما از پاسخدهی تلفن',
];

// Minimal HTML email for admin
function createMinimalFeedbackEmail($data, $questions) {
	$fullName = $data['fullName'];
	$phone = $data['phone'];
	$admissionNumber = $data['admissionNumber'];
	$recommendation = $data['recommendation'];
	$suggestions = $data['suggestions'];
	$answers = $data['answers'];

	$html = '<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>نظرسنجی جدید مشتری</title></head>';
	$html .= '<body style="margin:0;background:#f6f9fc;font-family:Tahoma,Arial,sans-serif;color:#1f2328;">';
	$html .= '<div style="max-width:640px;margin:24px auto;background:#fff;border:1px solid #e6e8eb;border-radius:12px;overflow:hidden;">';
	$html .= '<div style="padding:20px 24px;border-bottom:1px solid #eef1f4;"><div style="font-size:16px;color:#6b7280;">آزمایشگاه تشخیص پزشکی سلامت</div><h1 style="margin:4px 0 0 0;font-size:18px;font-weight:700;color:#111827;">نظرسنجی جدید مشتری</h1></div>';
	$html .= '<div style="padding:20px 24px;">';
	$html .= '<table role="presentation" style="width:100%;border-collapse:collapse;"><tbody>';
	$html .= '<tr><td style="width:170px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">نام و نام خانوادگی</td><td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $fullName . '</td></tr>';
	if ($phone) {
		$html .= '<tr><td style="width:170px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">تلفن تماس</td><td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;"><a href="tel:' . $phone . '" style="color:#0ea5e9;text-decoration:none;">' . $phone . '</a></td></tr>';
	}
	if ($admissionNumber) {
		$html .= '<tr><td style="width:170px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">شماره پذیرش</td><td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $admissionNumber . '</td></tr>';
	}
	if ($recommendation) {
		$html .= '<tr><td style="width:170px;background:#f9fafb;border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#6b7280;">معرفی به دیگران</td><td style="border:1px solid #eef1f4;padding:10px 12px;font-size:14px;color:#111827;">' . $recommendation . '</td></tr>';
	}
	$html .= '</tbody></table>';

	if ($suggestions) {
		$html .= '<div style="margin-top:16px;padding:12px 14px;background:#fff7ed;border:1px solid #ffedd5;border-radius:8px;"><div style="font-size:13px;color:#9a3412;margin-bottom:6px;">پیشنهادات و انتقادات</div><div style="font-size:14px;color:#7c2d12;line-height:1.9;white-space:pre-wrap;">' . $suggestions . '</div></div>';
	}

	// Answers table
	if (!empty($answers)) {
		$html .= '<div style="margin-top:16px">';
		$html .= '<div style="font-size:13px;color:#6b7280;margin-bottom:6px;">پاسخ‌ها</div>';
		$html .= '<table role="presentation" style="width:100%;border-collapse:collapse;"><thead><tr>' .
			'<th style="background:#f9fafb;border:1px solid #eef1f4;padding:8px 10px;font-size:13px;color:#6b7280;">ردیف</th>' .
			'<th style="background:#f9fafb;border:1px solid #eef1f4;padding:8px 10px;font-size:13px;color:#6b7280;">سؤال</th>' .
			'<th style="background:#f9fafb;border:1px solid #eef1f4;padding:8px 10px;font-size:13px;color:#6b7280;">پاسخ</th>' .
			'</tr></thead><tbody>';
		foreach ($answers as $idx => $choice) {
			$idxNum = intval($idx);
			$q = htmlspecialchars($questions[$idxNum] ?? (string)$idxNum);
			$ans = htmlspecialchars($choice ?? '');
			if ($ans === '') continue;
			$html .= '<tr>' .
				'<td style="border:1px solid #eef1f4;padding:8px 10px;font-size:13px;color:#374151;text-align:center;">' . $idxNum . '</td>' .
				'<td style="border:1px solid #eef1f4;padding:8px 10px;font-size:13px;color:#374151;">' . $q . '</td>' .
				'<td style="border:1px solid #eef1f4;padding:8px 10px;font-size:13px;color:#111827;text-align:center;">' . $ans . '</td>' .
			'</tr>';
		}
		$html .= '</tbody></table></div>';
	}

	$html .= '</div><div style="padding:12px 24px;background:#fafafa;border-top:1px solid #eef1f4;text-align:center;">
		<div style="font-size:12px;color:#6b7280;">این ایمیل به صورت خودکار ارسال شده است • ' . date('Y/m/d H:i:s') . '</div>
	</div></div></body></html>';

	return $html;
}

// Compose and send email
$admin_email = ADMIN_EMAIL;
$subject = 'نظرسنجی جدید مشتری - آزمایشگاه سلامت';
$message = createMinimalFeedbackEmail([
	'fullName' => $fullName,
	'phone' => $phone,
	'admissionNumber' => $admissionNumber,
	'recommendation' => $recommendation,
	'suggestions' => $suggestions,
	'answers' => $answers,
], $questions);

$sent = sendEmail($admin_email, $subject, $message);

// Store to file with unique id for admin view
$fid = bin2hex(random_bytes(6));
$fstore = __DIR__ . '/feedback_store.json';
if (!file_exists($fstore)) { file_put_contents($fstore, json_encode([])); }
$all = [];
$raw = @file_get_contents($fstore);
if ($raw) { $dec = json_decode($raw, true); if (is_array($dec)) { $all = $dec; } }
$record = [
	'id' => $fid,
	'createdAt' => date('Y-m-d H:i:s'),
	'fullName' => $fullName,
	'phone' => $phone,
	'admissionNumber' => $admissionNumber,
	'recommendation' => $recommendation,
	'suggestions' => $suggestions,
	'answers' => $answers,
];
$all[$fid] = $record;
@file_put_contents($fstore, json_encode($all, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);

// Log light
$logLine = date('Y-m-d H:i:s') . ' | ' . ($fullName ?: 'بدون‌نام') . ' | ' . ($phone ?: 'no-phone') . ' | id:' . $fid . ' | rec:' . ($recommendation ?: '-') . "\n";
file_put_contents(dirname(__FILE__) . '/feedbacks.log', $logLine, FILE_APPEND | LOCK_EX);

if ($sent) {
	// ارسال پیامک تایید برای شرکت در نظرسنجی
	if (defined('SMS_API_URL') && SMS_API_URL && defined('SMS_API_KEY') && SMS_API_KEY && defined('FEEDBACK_CONFIRM_TEMPLATE_ID') && intval(FEEDBACK_CONFIRM_TEMPLATE_ID) > 0) {
		$digitsPhone = preg_replace('/[^0-9]/', '', $phone);
		if (strlen($digitsPhone) === 11 && strpos($digitsPhone, '0') === 0) { $digitsPhone = substr($digitsPhone, 1); }
		$headers = [
			'Content-Type: application/json',
			'Accept: text/plain',
			'x-api-key: ' . SMS_API_KEY
		];
		$payload = json_encode([
			'mobile' => $digitsPhone,
			'templateId' => intval(FEEDBACK_CONFIRM_TEMPLATE_ID),
			'parameters' => [
				['name' => (defined('FEEDBACK_CONFIRM_PARAM_NAME') ? FEEDBACK_CONFIRM_PARAM_NAME : 'NAME'), 'value' => $fullName]
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
	echo json_encode(['success' => true, 'message' => 'feedback received', 'email_sent' => true, 'id' => $fid]);
} else {
	http_response_code(500);
	echo json_encode(['error' => 'failed to send email', 'email_sent' => false, 'id' => $fid]);
}

?>


