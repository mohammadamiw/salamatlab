<?php
/**
 * Medical Services API
 * API خدمات پزشکی (چکاپ، نمونه‌گیری در محل)
 */

define('APP_START_TIME', microtime(true));
define('ENVIRONMENT', 'production');

require_once __DIR__ . '/core/Database.php';
require_once __DIR__ . '/core/Logger.php';
require_once __DIR__ . '/core/Response.php';

Response::handleOptions();
Response::setNoCacheHeaders();

class MedicalServicesAPI {
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
            Logger::error('Medical API error', ['error' => $e->getMessage()]);
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
        $action = $_GET['action'] ?? '';
        
        switch ($action) {
            case 'services':
                $this->getServices();
                break;
            case 'doctors':
                $this->getDoctors();
                break;
            case 'checkup-requests':
                $this->getCheckupRequests();
                break;
            case 'sampling-requests':
                $this->getSamplingRequests();
                break;
            default:
                Response::error('عمل نامعتبر');
        }
    }
    
    private function handlePost(array $input): void {
        $action = $input['action'] ?? '';
        
        switch ($action) {
            case 'submit-checkup':
                $this->submitCheckupRequest($input);
                break;
            case 'submit-sampling':
                $this->submitSamplingRequest($input);
                break;
            case 'update-request-status':
                $this->updateRequestStatus($input);
                break;
            default:
                Response::error('عمل نامعتبر');
        }
    }
    
    /**
     * دریافت لیست سرویس‌های پزشکی
     */
    private function getServices(): void {
        $category = $_GET['category'] ?? null;
        $homeService = $_GET['home_service'] ?? null;
        
        $sql = "SELECT * FROM medical_services WHERE is_active = TRUE";
        $params = [];
        
        if ($category) {
            $sql .= " AND category = ?";
            $params[] = $category;
        }
        
        if ($homeService !== null) {
            $sql .= " AND home_service_available = ?";
            $params[] = (bool) $homeService;
        }
        
        $sql .= " ORDER BY name";
        
        $services = $this->db->fetchAll($sql, $params);
        
        Response::success([
            'services' => $services,
            'total' => count($services)
        ]);
    }
    
    /**
     * دریافت لیست دکترها
     */
    private function getDoctors(): void {
        $specialty = $_GET['specialty'] ?? null;
        $featured = $_GET['featured'] ?? null;
        
        $sql = "SELECT * FROM doctors WHERE is_active = TRUE";
        $params = [];
        
        if ($specialty) {
            $sql .= " AND specialty_category = ?";
            $params[] = $specialty;
        }
        
        if ($featured !== null) {
            $sql .= " AND is_featured = ?";
            $params[] = (bool) $featured;
        }
        
        $sql .= " ORDER BY is_featured DESC, display_order, last_name";
        
        $doctors = $this->db->fetchAll($sql, $params);
        
        Response::success([
            'doctors' => $doctors,
            'total' => count($doctors)
        ]);
    }
    
    /**
     * درخواست چکاپ
     */
    private function submitCheckupRequest(array $input): void {
        // اعتبارسنجی داده‌های ورودی
        $requiredFields = ['patient_name', 'patient_phone', 'title'];
        foreach ($requiredFields as $field) {
            if (empty($input[$field])) {
                Response::error("فیلد $field الزامی است");
            }
        }
        
        // اعتبارسنجی شماره تلفن
        $phone = $this->validatePhone($input['patient_phone']);
        if (!$phone) {
            Response::error('شماره تلفن نامعتبر است');
        }
        
        $this->db->beginTransaction();
        
        try {
            $requestData = [
                'user_id' => $input['user_id'] ?? null,
                'service_id' => $input['service_id'] ?? null,
                'doctor_id' => $input['doctor_id'] ?? null,
                'title' => $input['title'],
                'patient_name' => $input['patient_name'],
                'patient_phone' => $phone,
                'patient_national_id' => $input['patient_national_id'] ?? null,
                'patient_birth_date' => $input['patient_birth_date'] ?? null,
                'patient_gender' => $input['patient_gender'] ?? null,
                'patient_city' => $input['patient_city'] ?? null,
                'has_insurance' => isset($input['has_insurance']) ? (bool) $input['has_insurance'] : false,
                'insurance_type' => $input['insurance_type'] ?? null,
                'preferred_date' => $input['preferred_date'] ?? null,
                'preferred_time' => $input['preferred_time'] ?? null,
                'address_id' => $input['address_id'] ?? null,
                'custom_address' => $input['custom_address'] ?? null,
                'patient_notes' => $input['patient_notes'] ?? null,
                'status' => 'pending',
                'priority' => $input['priority'] ?? 'normal'
            ];
            
            $requestId = $this->db->insert('checkup_requests', $requestData);
            
            // ارسال SMS تایید به بیمار
            $this->sendCheckupConfirmationSms($phone, $input['patient_name'], $input['title']);
            
            // ارسال اطلاع‌رسانی به ادمین (اختیاری)
            $this->notifyAdminNewRequest('checkup', $requestId);
            
            $this->db->commit();
            
            Logger::info('Checkup request submitted', [
                'request_id' => $requestId,
                'patient_phone' => $phone
            ]);
            
            Response::success([
                'request_id' => $requestId,
                'message' => 'درخواست شما با موفقیت ثبت شد'
            ]);
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    /**
     * درخواست نمونه‌گیری در محل
     */
    private function submitSamplingRequest(array $input): void {
        $requiredFields = ['patient_name', 'patient_phone', 'title', 'service_ids'];
        foreach ($requiredFields as $field) {
            if (empty($input[$field])) {
                Response::error("فیلد $field الزامی است");
            }
        }
        
        $phone = $this->validatePhone($input['patient_phone']);
        if (!$phone) {
            Response::error('شماره تلفن نامعتبر است');
        }
        
        // بررسی وجود آدرس
        if (empty($input['address_id']) && empty($input['custom_address'])) {
            Response::error('آدرس الزامی است');
        }
        
        $this->db->beginTransaction();
        
        try {
            $requestData = [
                'user_id' => $input['user_id'] ?? null,
                'service_ids' => json_encode($input['service_ids']),
                'title' => $input['title'],
                'patient_name' => $input['patient_name'],
                'patient_phone' => $phone,
                'patient_national_id' => $input['patient_national_id'] ?? null,
                'patient_birth_date' => $input['patient_birth_date'] ?? null,
                'patient_gender' => $input['patient_gender'] ?? null,
                'address_id' => $input['address_id'] ?? null,
                'custom_address' => $input['custom_address'] ?? null,
                'address_latitude' => $input['address_latitude'] ?? null,
                'address_longitude' => $input['address_longitude'] ?? null,
                'preferred_date' => $input['preferred_date'] ?? null,
                'preferred_time_start' => $input['preferred_time_start'] ?? null,
                'preferred_time_end' => $input['preferred_time_end'] ?? null,
                'patient_notes' => $input['patient_notes'] ?? null,
                'status' => 'pending',
                'priority' => $input['priority'] ?? 'normal'
            ];
            
            // محاسبه قیمت تقریبی
            $pricing = $this->calculateSamplingPrice($input['service_ids'], $input);
            $requestData['service_price'] = $pricing['service_price'];
            $requestData['transport_price'] = $pricing['transport_price'];
            $requestData['total_price'] = $pricing['total_price'];
            
            $requestId = $this->db->insert('home_sampling_requests', $requestData);
            
            // ارسال SMS تایید
            $this->sendSamplingConfirmationSms($phone, $input['patient_name'], $input['title']);
            
            // اطلاع‌رسانی به ادمین
            $this->notifyAdminNewRequest('sampling', $requestId);
            
            $this->db->commit();
            
            Logger::info('Home sampling request submitted', [
                'request_id' => $requestId,
                'patient_phone' => $phone,
                'services_count' => count($input['service_ids'])
            ]);
            
            Response::success([
                'request_id' => $requestId,
                'estimated_price' => $pricing,
                'message' => 'درخواست نمونه‌گیری در محل ثبت شد'
            ]);
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw $e;
        }
    }
    
    /**
     * دریافت درخواست‌های چکاپ کاربر
     */
    private function getCheckupRequests(): void {
        $userId = $_GET['user_id'] ?? null;
        $status = $_GET['status'] ?? null;
        $limit = (int) ($_GET['limit'] ?? 20);
        $offset = (int) ($_GET['offset'] ?? 0);
        
        if (!$userId) {
            Response::error('شناسه کاربر الزامی است');
        }
        
        $sql = "SELECT cr.*, 
                       ms.name as service_name,
                       d.first_name as doctor_first_name, 
                       d.last_name as doctor_last_name
                FROM checkup_requests cr
                LEFT JOIN medical_services ms ON cr.service_id = ms.id
                LEFT JOIN doctors d ON cr.doctor_id = d.id
                WHERE cr.user_id = ?";
        $params = [$userId];
        
        if ($status) {
            $sql .= " AND cr.status = ?";
            $params[] = $status;
        }
        
        $sql .= " ORDER BY cr.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        $requests = $this->db->fetchAll($sql, $params);
        
        // شمارش کل درخواست‌ها
        $countSql = "SELECT COUNT(*) as total FROM checkup_requests WHERE user_id = ?";
        $countParams = [$userId];
        if ($status) {
            $countSql .= " AND status = ?";
            $countParams[] = $status;
        }
        
        $total = $this->db->fetchOne($countSql, $countParams)['total'];
        
        Response::success([
            'requests' => $requests,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset
        ]);
    }
    
    /**
     * دریافت درخواست‌های نمونه‌گیری کاربر
     */
    private function getSamplingRequests(): void {
        $userId = $_GET['user_id'] ?? null;
        $status = $_GET['status'] ?? null;
        $limit = (int) ($_GET['limit'] ?? 20);
        $offset = (int) ($_GET['offset'] ?? 0);
        
        if (!$userId) {
            Response::error('شناسه کاربر الزامی است');
        }
        
        $sql = "SELECT hsr.*
                FROM home_sampling_requests hsr
                WHERE hsr.user_id = ?";
        $params = [$userId];
        
        if ($status) {
            $sql .= " AND hsr.status = ?";
            $params[] = $status;
        }
        
        $sql .= " ORDER BY hsr.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        $requests = $this->db->fetchAll($sql, $params);
        
        // اضافه کردن اطلاعات سرویس‌ها
        foreach ($requests as &$request) {
            if ($request['service_ids']) {
                $serviceIds = json_decode($request['service_ids'], true);
                if ($serviceIds) {
                    $placeholders = str_repeat('?,', count($serviceIds) - 1) . '?';
                    $services = $this->db->fetchAll(
                        "SELECT id, name, base_price FROM medical_services WHERE id IN ($placeholders)",
                        $serviceIds
                    );
                    $request['services'] = $services;
                }
            }
        }
        
        $countSql = "SELECT COUNT(*) as total FROM home_sampling_requests WHERE user_id = ?";
        $countParams = [$userId];
        if ($status) {
            $countSql .= " AND status = ?";
            $countParams[] = $status;
        }
        
        $total = $this->db->fetchOne($countSql, $countParams)['total'];
        
        Response::success([
            'requests' => $requests,
            'total' => $total,
            'limit' => $limit,
            'offset' => $offset
        ]);
    }
    
    /**
     * محاسبه قیمت نمونه‌گیری در محل
     */
    private function calculateSamplingPrice(array $serviceIds, array $requestData): array {
        $servicePrice = 0;
        $transportPrice = 50000; // قیمت پایه حمل و نقل
        
        if (!empty($serviceIds)) {
            $placeholders = str_repeat('?,', count($serviceIds) - 1) . '?';
            $services = $this->db->fetchAll(
                "SELECT base_price, home_service_price FROM medical_services WHERE id IN ($placeholders)",
                $serviceIds
            );
            
            foreach ($services as $service) {
                $servicePrice += $service['home_service_price'] ?: $service['base_price'];
            }
        }
        
        // محاسبه هزینه اضافی بر اساس فاصله (اختیاری)
        if (isset($requestData['address_latitude']) && isset($requestData['address_longitude'])) {
            $distance = $this->calculateDistance(
                $requestData['address_latitude'],
                $requestData['address_longitude']
            );
            
            if ($distance > 10) { // بیش از 10 کیلومتر
                $transportPrice += ($distance - 10) * 5000; // 5000 تومان به ازای هر کیلومتر اضافی
            }
        }
        
        return [
            'service_price' => $servicePrice,
            'transport_price' => $transportPrice,
            'total_price' => $servicePrice + $transportPrice
        ];
    }
    
    /**
     * محاسبه فاصله از مرکز آزمایشگاه (تقریبی)
     */
    private function calculateDistance(float $lat, float $lng): float {
        // مختصات فرضی آزمایشگاه (تهران)
        $labLat = 35.6892;
        $labLng = 51.3890;
        
        $earthRadius = 6371; // شعاع زمین به کیلومتر
        
        $dLat = deg2rad($lat - $labLat);
        $dLng = deg2rad($lng - $labLng);
        
        $a = sin($dLat / 2) * sin($dLat / 2) +
             cos(deg2rad($labLat)) * cos(deg2rad($lat)) *
             sin($dLng / 2) * sin($dLng / 2);
        
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        
        return $earthRadius * $c;
    }
    
    /**
     * ارسال SMS تایید چکاپ
     */
    private function sendCheckupConfirmationSms(string $phone, string $name, string $title): bool {
        $message = "سلام $name عزیز\nدرخواست $title شما با موفقیت ثبت شد.\nکارشناسان ما به زودی با شما تماس خواهند گرفت.\nآزمایشگاه سلامت";
        
        return $this->sendSms($phone, $message);
    }
    
    /**
     * ارسال SMS تایید نمونه‌گیری
     */
    private function sendSamplingConfirmationSms(string $phone, string $name, string $title): bool {
        $message = "سلام $name عزیز\nدرخواست نمونه‌گیری در محل شما ثبت شد.\nتکنسین ما در زمان مقرر به آدرس شما خواهد آمد.\nآزمایشگاه سلامت";
        
        return $this->sendSms($phone, $message);
    }
    
    /**
     * اطلاع‌رسانی به ادمین
     */
    private function notifyAdminNewRequest(string $type, int $requestId): void {
        // TODO: پیاده‌سازی اطلاع‌رسانی به ادمین
        // می‌تواند شامل ارسال ایمیل، SMS یا پوش نوتیفیکیشن باشد
        
        Logger::info('Admin notification sent', [
            'type' => $type,
            'request_id' => $requestId
        ]);
    }
    
    /**
     * ارسال SMS ساده
     */
    private function sendSms(string $phone, string $message): bool {
        // پیاده‌سازی ساده SMS
        // در صورت نیاز می‌توان از API های SMS مختلف استفاده کرد
        
        try {
            // فعلاً فقط لاگ می‌کنیم
            Logger::info('SMS sent', [
                'phone' => $phone,
                'message' => substr($message, 0, 50) . '...'
            ]);
            
            return true;
        } catch (Exception $e) {
            Logger::error('SMS failed', ['error' => $e->getMessage()]);
            return false;
        }
    }
    
    /**
     * اعتبارسنجی شماره تلفن
     */
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
}

try {
    $api = new MedicalServicesAPI();
    $api->handleRequest();
} catch (Exception $e) {
    Logger::critical('Medical API fatal error', ['error' => $e->getMessage()]);
    Response::serverError();
}
?>
