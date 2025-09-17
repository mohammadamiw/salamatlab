<?php
require_once 'config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || empty($input['action'])) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid request']);
    exit();
}

$action = $input['action'];

// Simple file-based storage for OTP: phone -> { code, expiresAt }
$storeFile = __DIR__ . '/otp_store.json';
if (!file_exists($storeFile)) {
    file_put_contents($storeFile, json_encode([]));
}

function readStore($file) {
    $raw = @file_get_contents($file);
    if (!$raw) return [];
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

function writeStore($file, $data) {
    @file_put_contents($file, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES), LOCK_EX);
}

function sendSmsInternal($to, $code) {
    if (!defined('SMS_API_URL') || !SMS_API_URL) return false;
    $url = SMS_API_URL;
    $key = defined('SMS_API_KEY') ? SMS_API_KEY : '';
    $templateId = defined('SMSIR_TEMPLATE_ID') ? intval(SMSIR_TEMPLATE_ID) : 0;
    if ($templateId <= 0) return false;
    $paramName = defined('SMSIR_TEMPLATE_PARAM_NAME') ? SMSIR_TEMPLATE_PARAM_NAME : 'Code';

    $headers = [
        'Content-Type: application/json',
        'Accept: text/plain',
        'x-api-key: ' . $key
    ];
    $payload = json_encode([
        'mobile' => $to,
        'templateId' => $templateId,
        'parameters' => [
            ['name' => $paramName, 'value' => strval($code)]
        ]
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    $result = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if (!($httpCode >= 200 && $httpCode < 300)) {
        return false;
    }
    // Try to ensure provider status is successful
    $decoded = json_decode($result, true);
    if (is_array($decoded) && isset($decoded['status'])) {
        return intval($decoded['status']) === 1;
    }
    return true;
}

if ($action === 'send') {
    $phone = preg_replace('/[^0-9]/', '', $input['phone'] ?? '');
    if (strlen($phone) < 10 || strlen($phone) > 11) {
        http_response_code(400);
        echo json_encode(['error' => 'invalid phone']);
        exit();
    }
    $code = strval(random_int(100000, 999999));
    $expiresAt = time() + (defined('OTP_TTL_SECONDS') ? OTP_TTL_SECONDS : 300);
    $store = readStore($storeFile);
    $store[$phone] = ['code' => $code, 'expiresAt' => $expiresAt];
    writeStore($storeFile, $store);

    // sms.ir expects 10-digit mobile without leading zero
    $apiMobile = (strlen($phone) === 11 && strpos($phone, '0') === 0) ? substr($phone, 1) : $phone;
    $sent = sendSmsInternal($apiMobile, $code);
    echo json_encode(['success' => $sent, 'expiresIn' => ($expiresAt - time())]);
    exit();
}

if ($action === 'verify') {
    $phone = preg_replace('/[^0-9]/', '', $input['phone'] ?? '');
    $code = preg_replace('/[^0-9]/', '', $input['code'] ?? '');
    $store = readStore($storeFile);
    if (!isset($store[$phone])) {
        http_response_code(400);
        echo json_encode(['error' => 'not found']);
        exit();
    }
    $entry = $store[$phone];
    if (time() > ($entry['expiresAt'] ?? 0)) {
        unset($store[$phone]);
        writeStore($storeFile, $store);
        http_response_code(400);
        echo json_encode(['error' => 'expired']);
        exit();
    }
    if ($code !== ($entry['code'] ?? '')) {
        http_response_code(400);
        echo json_encode(['error' => 'invalid code']);
        exit();
    }
    unset($store[$phone]);
    writeStore($storeFile, $store);
    echo json_encode(['success' => true]);
    exit();
}

http_response_code(400);
echo json_encode(['error' => 'invalid action']);
?>


