<?php
/**
 * User Management API - New Version
 * API مدیریت کاربران با OTP واقعی
 */

define('APP_START_TIME', microtime(true));
define('ENVIRONMENT', 'production');

require_once __DIR__ . '/core/Database.php';
require_once __DIR__ . '/core/Logger.php';
require_once __DIR__ . '/core/Response.php';

Response::handleOptions();
Response::setNoCacheHeaders();

class UserAPI {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    public function handleRequest(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        $input = $this->getInputData();
        
        try {
            switch ($method) {
                case 'GET':
                    $this->handleGet();
                    break;
                case 'POST':
                    $this->handlePost($input);
                    break;
                default:
                    Response::error('متد پشتیبانی نمی‌شود', 405);
            }
        } catch (Exception $e) {
            Logger::error('API request failed', ['error' => $e->getMessage()]);
            Response::serverError();
        }
    }
    
    private function getInputData(): array {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        if (str_contains($contentType, 'application/json')) {
            $input = json_decode(file_get_contents('php://input'), true);
            return is_array($input) ? $input : [];
        }
        return $_POST;
    }
    
    private function handleGet(): void {
        $phone = $_GET['phone'] ?? null;
        if (!$phone) {
            Response::error('شماره تلفن الزامی است');
        }
        
        $phone = $this->validatePhone($phone);
        if (!$phone) {
            Response::error('شماره تلفن نامعتبر است');
        }
        
        $user = $this->getUserByPhone($phone);
        Response::success([
            'exists' => $user !== null,
            'user' => $user
        ]);
    }
    
    private function handlePost(array $input): void {
        $action = $input['action'] ?? '';
        
        switch ($action) {
            case 'sendOtp':
                $this->sendOtp($input);
                break;
            case 'verifyOtp':
                $this->verifyOtp($input);
                break;
            case 'updateProfile':
                $this->updateProfile($input);
                break;
            default:
                Response::error('عمل نامعتبر');
        }
    }
    
    private function sendOtp(array $input): void {
        $phone = $this->validatePhone($input['phone'] ?? '');
        if (!$phone) {
            Response::error('شماره تلفن نامعتبر است');
        }
        
        // بررسی محدودیت زمانی
        $recent = $this->db->fetchOne(
            "SELECT id FROM otp_codes WHERE phone = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)",
            [$phone]
        );
        
        if ($recent) {
            Response::error('لطفاً 1 دقیقه صبر کنید');
        }
        
        $code = $this->generateOtpCode();
        $expiresAt = date('Y-m-d H:i:s', time() + 300);
        
        $this->db->insert('otp_codes', [
            'phone' => $phone,
            'code' => $code,
            'expires_at' => $expiresAt
        ]);
        
        if ($this->sendSms($phone, $code)) {
            Response::success(['message' => 'کد تایید ارسال شد']);
        } else {
            Response::error('خطا در ارسال پیامک');
        }
    }
    
    private function verifyOtp(array $input): void {
        $phone = $this->validatePhone($input['phone'] ?? '');
        $code = $input['code'] ?? '';
        
        if (!$phone || !$code) {
            Response::error('شماره تلفن و کد الزامی است');
        }
        
        $otp = $this->db->fetchOne(
            "SELECT * FROM otp_codes WHERE phone = ? AND code = ? AND expires_at > NOW() AND is_used = FALSE",
            [$phone, $code]
        );
        
        if (!$otp) {
            Response::error('کد نامعتبر یا منقضی شده');
        }
        
        $this->db->update('otp_codes', ['is_used' => true], ['id' => $otp['id']]);
        
        $user = $this->getUserByPhone($phone);
        $isNewUser = !$user;
        
        if ($isNewUser) {
            $userId = $this->createUser($phone);
            $user = $this->getUserById($userId);
        }
        
        Response::success([
            'user' => $user,
            'isNewUser' => $isNewUser
        ]);
    }
    
    private function updateProfile(array $input): void {
        $userId = $input['userId'] ?? '';
        if (!$userId) {
            Response::error('شناسه کاربر الزامی است');
        }
        
        $allowedFields = [
            'first_name', 'last_name', 'email', 'national_id',
            'birth_date', 'gender', 'city', 'province',
            'has_basic_insurance', 'basic_insurance', 'complementary_insurance'
        ];
        
        $updateData = [];
        foreach ($allowedFields as $field) {
            if (isset($input[$field])) {
                $updateData[$field] = $input[$field];
            }
        }
        
        if (!empty($updateData)) {
            $this->db->update('users', $updateData, ['id' => $userId]);
        }
        
        $user = $this->getUserById($userId);
        Response::success(['user' => $user]);
    }
    
    private function getUserByPhone(string $phone): ?array {
        return $this->db->fetchOne(
            "SELECT * FROM users WHERE phone = ? AND is_active = TRUE",
            [$phone]
        );
    }
    
    private function getUserById(int $userId): ?array {
        return $this->db->fetchOne(
            "SELECT * FROM users WHERE id = ? AND is_active = TRUE",
            [$userId]
        );
    }
    
    private function createUser(string $phone): int {
        return $this->db->insert('users', [
            'phone' => $phone,
            'is_verified' => true,
            'is_active' => true
        ]);
    }
    
    private function validatePhone(string $phone): ?string {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        if (strlen($phone) === 10 && substr($phone, 0, 1) === '9') {
            $phone = '0' . $phone;
        } elseif (strlen($phone) === 13 && substr($phone, 0, 3) === '989') {
            $phone = '0' . substr($phone, 2);
        }
        
        if (strlen($phone) === 11 && substr($phone, 0, 2) === '09') {
            return $phone;
        }
        
        return null;
    }
    
    private function generateOtpCode(): string {
        return str_pad((string) random_int(100000, 999999), 6, '0', STR_PAD_LEFT);
    }
    
    private function sendSms(string $phone, string $code): bool {
        $apiKey = 'jClChBBaWXvfhHfqhBrIDIcwV5tzSj7GRVTZavQEFTPcYgqV';
        $templateId = 165688;
        $apiUrl = 'https://api.sms.ir/v1/send/verify';
        
        $data = [
            'mobile' => $phone,
            'templateId' => $templateId,
            'parameters' => [['name' => 'Code', 'value' => $code]]
        ];
        
        $options = [
            'http' => [
                'header' => [
                    'Content-Type: application/json',
                    'X-API-KEY: ' . $apiKey
                ],
                'method' => 'POST',
                'content' => json_encode($data)
            ]
        ];
        
        try {
            $context = stream_context_create($options);
            $result = file_get_contents($apiUrl, false, $context);
            
            if ($result === false) return false;
            
            $response = json_decode($result, true);
            return $response && isset($response['status']) && $response['status'] === 1;
            
        } catch (Exception $e) {
            Logger::error('SMS error', ['error' => $e->getMessage()]);
            return false;
        }
    }
}

try {
    $api = new UserAPI();
    $api->handleRequest();
} catch (Exception $e) {
    Logger::critical('Fatal error', ['error' => $e->getMessage()]);
    Response::serverError();
}
?>
