<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
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

if (!$input || !isset($input['message'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Message is required']);
    exit();
}

$userMessage = trim($input['message']);
$liaraApiKey = $_ENV['LIARA_API_KEY'] ?? '';

// Liara AI configuration
$liaraBaseUrl = 'https://ai.liara.ir/api/v1/68caae6a50d5b2a15f00deff';
$liaraModel = 'openai/gpt-4o-mini';

// SalamatLab knowledge base
$knowledge = [
    'company' => [
        'name' => 'آزمایشگاه تشخیص پزشکی سلامت',
        'location' => 'شهرقدس، میدان مصلی',
        'phones' => ['021-46833010', '021-46833011'],
        'instagram' => '@salamatlab',
        'website' => 'https://www.salamatlab.com',
        'working_hours' => 'شنبه تا پنج‌شنبه، 7 صبح تا 7 عصر'
    ],
    'services' => [
        'هماتولوژی - آزمایش‌های خون و سلول‌های خونی',
        'بیوشیمی - آزمایش‌های بیوشیمیایی عمومی و تخصصی',
        'میکروبیولوژی - کشت و شناسایی میکروارگانیسم‌ها',
        'ایمونولوژی و آلرژی - آزمایش‌های ایمنی و حساسیت',
        'سیتولوژی - بررسی سلول‌ها و بافت‌ها',
        'تشخیص مولکولی - آزمایش‌های PCR و ژنتیک',
        'فلوسایتومتری - ایمونوفنوتایپینگ سلول‌ها',
        'انعقاد خون - آزمایش‌های انعقاد و فاکتورهای خونی'
    ]
];

// Fallback responses based on keywords
function getFallbackResponse($message) {
    $message = strtolower($message);
    
    if (strpos($message, 'سلام') !== false || strpos($message, 'درود') !== false) {
        return 'سلام! خوش آمدید به آزمایشگاه سلامت. چطور می‌تونم کمکتون کنم؟ 😊';
    }
    
    if (strpos($message, 'ساعت کار') !== false || strpos($message, 'زمان') !== false) {
        return 'آزمایشگاه سلامت از شنبه تا پنج‌شنبه از ساعت 7 صبح تا 7 عصر فعال است.';
    }
    
    if (strpos($message, 'تلفن') !== false || strpos($message, 'تماس') !== false) {
        return 'شماره تماس آزمایشگاه: 021-46833010 و 021-46833011';
    }
    
    if (strpos($message, 'آدرس') !== false || strpos($message, 'نشانی') !== false) {
        return 'آدرس آزمایشگاه: شهرقدس، میدان مصلی';
    }
    
    if (strpos($message, 'نتیجه') !== false || strpos($message, 'جواب') !== false) {
        return 'برای دریافت نتیجه آزمایش به آدرس http://93.114.111.53:8086/Login مراجعه کنید.';
    }
    
    if (strpos($message, 'خدمات') !== false || strpos($message, 'آزمایش') !== false) {
        return 'خدمات آزمایشگاه سلامت شامل: هماتولوژی، بیوشیمی، میکروبیولوژی، ایمونولوژی، سیتولوژی، تشخیص مولکولی، فلوسایتومتری و انعقاد خون می‌باشد.';
    }
    
    if (strpos($message, 'پزشک') !== false || strpos($message, 'دکتر') !== false) {
        return 'ما پزشکان متخصص در رشته‌های مختلف از جمله عمومی، اورولوژی، ارتوپدی، زنان و زایمان، قلب و عروق، اطفال و داخلی داریم. برای نوبت‌گیری به سایت مراجعه کنید.';
    }
    
    if (strpos($message, 'نمونه‌گیری') !== false || strpos($message, 'منزل') !== false) {
        return 'بله، ما خدمات نمونه‌گیری در منزل ارائه می‌دهیم. برای اطلاعات بیشتر با شماره‌های 021-46833010 یا 021-46833011 تماس بگیرید.';
    }
    
    return 'برای اطلاعات بیشتر لطفاً با شماره‌های 021-46833010 یا 021-46833011 تماس بگیرید یا به سایت www.salamatlab.com مراجعه کنید.';
}

// If Liara API key is available, use Liara AI
if (!empty($liaraApiKey)) {
    $systemPrompt = "شما دستیار هوشمند آزمایشگاه تشخیص پزشکی سلامت هستید. اطلاعات آزمایشگاه:
    
نام: آزمایشگاه تشخیص پزشکی سلامت
آدرس: شهرقدس، میدان مصلی
تلفن: 021-46833010، 021-46833011
ساعات کاری: شنبه تا پنج‌شنبه، 7 صبح تا 7 عصر
وب‌سایت: www.salamatlab.com
اینستاگرام: @salamatlab

خدمات:
- هماتولوژی (آزمایش‌های خون)
- بیوشیمی (آزمایش‌های بیوشیمیایی)
- میکروبیولوژی (کشت میکروب)
- ایمونولوژی و آلرژی
- سیتولوژی (بررسی سلول‌ها)
- تشخیص مولکولی (PCR)
- فلوسایتومتری
- انعقاد خون
- نمونه‌گیری در منزل
- دریافت نتایج آنلاین

همیشه مودب، مفید و دقیق باشید. هرگز تشخیص پزشکی ندهید.";

    $data = [
        'model' => $liaraModel,
        'messages' => [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $userMessage]
        ],
        'max_tokens' => 300,
        'temperature' => 0.7
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $liaraBaseUrl . '/chat/completions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $liaraApiKey
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $result = json_decode($response, true);
        if (isset($result['choices'][0]['message']['content'])) {
            echo json_encode([
                'message' => $result['choices'][0]['message']['content'],
                'success' => true,
                'source' => 'liara'
            ]);
            exit();
        }
    }
}

// Fallback to rule-based responses
$response = getFallbackResponse($userMessage);
echo json_encode([
    'message' => $response,
    'success' => true,
    'source' => 'fallback'
]);
?>
