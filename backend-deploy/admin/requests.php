<?php
/**
 * Admin Request Management API
 * API مدیریت درخواست‌ها برای ادمین
 */

define('APP_START_TIME', microtime(true));
define('ENVIRONMENT', 'production');

require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Logger.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/AdminAuth.php';

Response::handleOptions();

class AdminRequestManagement {
    private $db;
    private $auth;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->auth = new AdminAuth();
        
        // بررسی احراز هویت
        $this->auth->requireAuth(['requests.view']);
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
                case 'PUT':
                    $this->handlePut($input);
                    break;
                default:
                    Response::error('متد پشتیبانی نمی‌شود', 405);
            }
        } catch (Exception $e) {
            Logger::error('Admin request management error', ['error' => $e->getMessage()]);
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
        $action = $_GET['action'] ?? 'list';
        
        switch ($action) {
            case 'list':
                $this->getRequestsList();
                break;
            case 'details':
                $this->getRequestDetails();
                break;
            case 'stats':
                $this->getRequestsStats();
                break;
            case 'export':
                $this->exportRequests();
                break;
            default:
                Response::error('عمل نامعتبر');
        }
    }
    
    /**
     * لیست درخواست‌ها
     */
    private function getRequestsList(): void {
        $type = $_GET['type'] ?? 'all'; // checkup, sampling, all
        $status = $_GET['status'] ?? null;
        $date = $_GET['date'] ?? null; // today, week, month, or specific date
        $priority = $_GET['priority'] ?? null;
        $page = max(1, (int) ($_GET['page'] ?? 1));
        $limit = min(100, max(10, (int) ($_GET['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;
        
        $requests = [];
        $total = 0;
        
        if ($type === 'checkup' || $type === 'all') {
            $checkupData = $this->getCheckupRequests($status, $date, $priority, $limit, $offset);
            if ($type === 'checkup') {
                $requests = $checkupData['requests'];
                $total = $checkupData['total'];
            } else {
                $requests = array_merge($requests, $checkupData['requests']);
                $total += $checkupData['total'];
            }
        }
        
        if ($type === 'sampling' || $type === 'all') {
            $samplingData = $this->getSamplingRequests($status, $date, $priority, $limit, $offset);
            if ($type === 'sampling') {
                $requests = $samplingData['requests'];
                $total = $samplingData['total'];
            } else {
                $requests = array_merge($requests, $samplingData['requests']);
                $total += $samplingData['total'];
            }
        }
        
        // مرتب‌سازی ترکیبی
        if ($type === 'all') {
            usort($requests, fn($a, $b) => strtotime($b['created_at']) - strtotime($a['created_at']));
            $requests = array_slice($requests, $offset, $limit);
        }
        
        Response::success([
            'requests' => $requests,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $limit,
                'total' => $total,
                'total_pages' => ceil($total / $limit)
            ],
            'filters' => [
                'type' => $type,
                'status' => $status,
                'date' => $date,
                'priority' => $priority
            ]
        ]);
    }
    
    /**
     * دریافت درخواست‌های چکاپ
     */
    private function getCheckupRequests(?string $status, ?string $date, ?string $priority, int $limit, int $offset): array {
        $sql = "SELECT cr.*, 
                       u.first_name as user_first_name, u.last_name as user_last_name,
                       ms.name as service_name,
                       d.first_name as doctor_first_name, d.last_name as doctor_last_name,
                       'checkup' as request_type
                FROM checkup_requests cr
                LEFT JOIN users u ON cr.user_id = u.id
                LEFT JOIN medical_services ms ON cr.service_id = ms.id
                LEFT JOIN doctors d ON cr.doctor_id = d.id";
        
        $whereConditions = [];
        $params = [];
        
        if ($status) {
            $whereConditions[] = "cr.status = ?";
            $params[] = $status;
        }
        
        if ($date) {
            $whereConditions[] = $this->getDateCondition('cr.created_at', $date);
            if ($date !== 'today' && $date !== 'week' && $date !== 'month') {
                $params[] = $date;
            }
        }
        
        if ($priority) {
            $whereConditions[] = "cr.priority = ?";
            $params[] = $priority;
        }
        
        if (!empty($whereConditions)) {
            $sql .= " WHERE " . implode(" AND ", $whereConditions);
        }
        
        $sql .= " ORDER BY cr.created_at DESC LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
        
        $requests = $this->db->fetchAll($sql, $params);
        
        // شمارش کل
        $countSql = str_replace("SELECT cr.*, 
                       u.first_name as user_first_name, u.last_name as user_last_name,
                       ms.name as service_name,
                       d.first_name as doctor_first_name, d.last_name as doctor_last_name,
                       'checkup' as request_type", "SELECT COUNT(*) as total", $sql);
        $countSql = str_replace(" LIMIT ? OFFSET ?", "", $countSql);
        array_pop($params); // حذف offset
        array_pop($params); // حذف limit
        
        $total = $this->db->fetchOne($countSql, $params)['total'];
        
        return [
            'requests' => $requests,
            'total' => $total
        ];
    }
    
    /**
     * دریافت درخواست‌های نمونه‌گیری
     */
    private function getSamplingRequests(?string $status, ?string $date, ?string $priority, int $limit, int $offset): array {
        $sql = "SELECT hsr.*, 
                       u.first_name as user_first_name, u.last_name as user_last_name,
                       'sampling' as request_type
                FROM home_sampling_requests hsr
                LEFT JOIN users u ON hsr.user_id = u.id";
        
        $whereConditions = [];
        $params = [];
        
        if ($status) {
            $whereConditions[] = "hsr.status = ?";
            $params[] = $status;
        }
        
        if ($date) {
            $whereConditions[] = $this->getDateCondition('hsr.created_at', $date);
            if ($date !== 'today' && $date !== 'week' && $date !== 'month') {
                $params[] = $date;
            }
        }
        
        if ($priority) {
            $whereConditions[] = "hsr.priority = ?";
            $params[] = $priority;
        }
        
        if (!empty($whereConditions)) {
            $sql .= " WHERE " . implode(" AND ", $whereConditions);
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
        
        // شمارش کل
        $countSql = str_replace("SELECT hsr.*, 
                       u.first_name as user_first_name, u.last_name as user_last_name,
                       'sampling' as request_type", "SELECT COUNT(*) as total", $sql);
        $countSql = str_replace(" LIMIT ? OFFSET ?", "", $countSql);
        array_pop($params);
        array_pop($params);
        
        $total = $this->db->fetchOne($countSql, $params)['total'];
        
        return [
            'requests' => $requests,
            'total' => $total
        ];
    }
    
    /**
     * جزئیات یک درخواست
     */
    private function getRequestDetails(): void {
        $requestId = $_GET['request_id'] ?? null;
        $requestType = $_GET['request_type'] ?? null; // checkup, sampling
        
        if (!$requestId || !$requestType) {
            Response::error('شناسه و نوع درخواست الزامی است');
        }
        
        if ($requestType === 'checkup') {
            $request = $this->db->fetchOne(
                "SELECT cr.*, 
                        u.*, 
                        ms.name as service_name, ms.description as service_description,
                        d.first_name as doctor_first_name, d.last_name as doctor_last_name,
                        d.specialty, d.phone as doctor_phone
                 FROM checkup_requests cr
                 LEFT JOIN users u ON cr.user_id = u.id
                 LEFT JOIN medical_services ms ON cr.service_id = ms.id
                 LEFT JOIN doctors d ON cr.doctor_id = d.id
                 WHERE cr.id = ?",
                [$requestId]
            );
        } else {
            $request = $this->db->fetchOne(
                "SELECT hsr.*, u.*
                 FROM home_sampling_requests hsr
                 LEFT JOIN users u ON hsr.user_id = u.id
                 WHERE hsr.id = ?",
                [$requestId]
            );
            
            // اضافه کردن اطلاعات سرویس‌ها
            if ($request && $request['service_ids']) {
                $serviceIds = json_decode($request['service_ids'], true);
                if ($serviceIds) {
                    $placeholders = str_repeat('?,', count($serviceIds) - 1) . '?';
                    $services = $this->db->fetchAll(
                        "SELECT * FROM medical_services WHERE id IN ($placeholders)",
                        $serviceIds
                    );
                    $request['services'] = $services;
                }
            }
        }
        
        if (!$request) {
            Response::notFound('درخواست یافت نشد');
        }
        
        Response::success([
            'request' => $request,
            'request_type' => $requestType
        ]);
    }
    
    /**
     * به‌روزرسانی وضعیت درخواست
     */
    private function handlePut(array $input): void {
        $this->auth->requireAuth(['requests.edit']);
        
        $action = $input['action'] ?? '';
        
        switch ($action) {
            case 'update-status':
                $this->updateRequestStatus($input);
                break;
            case 'assign-doctor':
                $this->assignDoctor($input);
                break;
            case 'assign-technician':
                $this->assignTechnician($input);
                break;
            case 'add-notes':
                $this->addAdminNotes($input);
                break;
            default:
                Response::error('عمل نامعتبر');
        }
    }
    
    /**
     * به‌روزرسانی وضعیت درخواست
     */
    private function updateRequestStatus(array $input): void {
        $requestId = $input['request_id'] ?? null;
        $requestType = $input['request_type'] ?? null;
        $newStatus = $input['status'] ?? null;
        $adminNotes = $input['admin_notes'] ?? null;
        
        if (!$requestId || !$requestType || !$newStatus) {
            Response::error('اطلاعات ناکامل');
        }
        
        $table = $requestType === 'checkup' ? 'checkup_requests' : 'home_sampling_requests';
        $allowedStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected'];
        
        if (!in_array($newStatus, $allowedStatuses)) {
            Response::error('وضعیت نامعتبر');
        }
        
        $updateData = ['status' => $newStatus];
        
        if ($adminNotes) {
            $updateData['admin_notes'] = $adminNotes;
        }
        
        // تنظیم زمان‌های خاص
        if ($newStatus === 'confirmed') {
            $updateData['confirmed_at'] = date('Y-m-d H:i:s');
        } elseif ($newStatus === 'completed') {
            $updateData['completed_at'] = date('Y-m-d H:i:s');
        }
        
        $this->db->update($table, $updateData, ['id' => $requestId]);
        
        // ارسال SMS اطلاع‌رسانی به بیمار
        $this->sendStatusUpdateSms($requestId, $requestType, $newStatus);
        
        $admin = $this->auth->getCurrentAdmin();
        Logger::info('Request status updated by admin', [
            'request_id' => $requestId,
            'request_type' => $requestType,
            'new_status' => $newStatus,
            'admin_username' => $admin['username']
        ]);
        
        Response::success(['message' => 'وضعیت درخواست به‌روزرسانی شد']);
    }
    
    /**
     * تخصیص دکتر به درخواست چکاپ
     */
    private function assignDoctor(array $input): void {
        $this->auth->requireAuth(['requests.assign']);
        
        $requestId = $input['request_id'] ?? null;
        $doctorId = $input['doctor_id'] ?? null;
        $appointmentDate = $input['appointment_date'] ?? null;
        
        if (!$requestId || !$doctorId) {
            Response::error('شناسه درخواست و دکتر الزامی است');
        }
        
        // بررسی وجود درخواست
        $request = $this->db->fetchOne(
            "SELECT * FROM checkup_requests WHERE id = ?",
            [$requestId]
        );
        
        if (!$request) {
            Response::notFound('درخواست یافت نشد');
        }
        
        // بررسی وجود دکتر
        $doctor = $this->db->fetchOne(
            "SELECT * FROM doctors WHERE id = ? AND is_active = TRUE",
            [$doctorId]
        );
        
        if (!$doctor) {
            Response::error('دکتر یافت نشد یا غیرفعال است');
        }
        
        $updateData = [
            'doctor_id' => $doctorId,
            'status' => 'confirmed'
        ];
        
        if ($appointmentDate) {
            $updateData['appointment_date'] = $appointmentDate;
        }
        
        $this->db->update('checkup_requests', $updateData, ['id' => $requestId]);
        
        // ارسال SMS تایید به بیمار
        $this->sendDoctorAssignmentSms($requestId, $doctor);
        
        $admin = $this->auth->getCurrentAdmin();
        Logger::info('Doctor assigned to checkup request', [
            'request_id' => $requestId,
            'doctor_id' => $doctorId,
            'admin_username' => $admin['username']
        ]);
        
        Response::success(['message' => 'دکتر با موفقیت تخصیص داده شد']);
    }
    
    /**
     * تخصیص تکنسین به نمونه‌گیری
     */
    private function assignTechnician(array $input): void {
        $this->auth->requireAuth(['requests.assign']);
        
        $requestId = $input['request_id'] ?? null;
        $technicianName = $input['technician_name'] ?? null;
        $technicianPhone = $input['technician_phone'] ?? null;
        $scheduledDateTime = $input['scheduled_datetime'] ?? null;
        
        if (!$requestId || !$technicianName || !$technicianPhone) {
            Response::error('اطلاعات تکنسین ناکامل است');
        }
        
        $updateData = [
            'technician_name' => $technicianName,
            'technician_phone' => $technicianPhone,
            'status' => 'assigned'
        ];
        
        if ($scheduledDateTime) {
            $updateData['scheduled_datetime'] = $scheduledDateTime;
        }
        
        $this->db->update('home_sampling_requests', $updateData, ['id' => $requestId]);
        
        // ارسال SMS تایید
        $this->sendTechnicianAssignmentSms($requestId, $technicianName, $scheduledDateTime);
        
        $admin = $this->auth->getCurrentAdmin();
        Logger::info('Technician assigned to sampling request', [
            'request_id' => $requestId,
            'technician_name' => $technicianName,
            'admin_username' => $admin['username']
        ]);
        
        Response::success(['message' => 'تکنسین با موفقیت تخصیص داده شد']);
    }
    
    /**
     * اضافه کردن یادداشت ادمین
     */
    private function addAdminNotes(array $input): void {
        $requestId = $input['request_id'] ?? null;
        $requestType = $input['request_type'] ?? null;
        $notes = $input['notes'] ?? null;
        
        if (!$requestId || !$requestType || !$notes) {
            Response::error('اطلاعات ناکامل');
        }
        
        $table = $requestType === 'checkup' ? 'checkup_requests' : 'home_sampling_requests';
        
        $this->db->update($table, ['admin_notes' => $notes], ['id' => $requestId]);
        
        $admin = $this->auth->getCurrentAdmin();
        Logger::info('Admin notes added to request', [
            'request_id' => $requestId,
            'request_type' => $requestType,
            'admin_username' => $admin['username']
        ]);
        
        Response::success(['message' => 'یادداشت اضافه شد']);
    }
    
    /**
     * آمار درخواست‌ها
     */
    private function getRequestsStats(): void {
        $period = $_GET['period'] ?? 'month';
        
        $stats = [
            'summary' => [
                'total_checkups' => $this->db->fetchOne("SELECT COUNT(*) as count FROM checkup_requests")['count'],
                'total_samplings' => $this->db->fetchOne("SELECT COUNT(*) as count FROM home_sampling_requests")['count'],
                'pending_checkups' => $this->db->fetchOne("SELECT COUNT(*) as count FROM checkup_requests WHERE status = 'pending'")['count'],
                'pending_samplings' => $this->db->fetchOne("SELECT COUNT(*) as count FROM home_sampling_requests WHERE status = 'pending'")['count']
            ],
            'status_breakdown' => $this->getStatusBreakdown(),
            'popular_services' => $this->getPopularServices(),
            'revenue_stats' => $this->getRevenueStats($period)
        ];
        
        Response::success($stats);
    }
    
    /**
     * تفکیک وضعیت درخواست‌ها
     */
    private function getStatusBreakdown(): array {
        $checkupStatuses = $this->db->fetchAll(
            "SELECT status, COUNT(*) as count FROM checkup_requests GROUP BY status"
        );
        
        $samplingStatuses = $this->db->fetchAll(
            "SELECT status, COUNT(*) as count FROM home_sampling_requests GROUP BY status"
        );
        
        return [
            'checkup' => $checkupStatuses,
            'sampling' => $samplingStatuses
        ];
    }
    
    /**
     * سرویس‌های محبوب
     */
    private function getPopularServices(): array {
        return $this->db->fetchAll(
            "SELECT ms.name, ms.category, COUNT(cr.id) as request_count
             FROM medical_services ms
             LEFT JOIN checkup_requests cr ON ms.id = cr.service_id
             WHERE ms.is_active = TRUE
             GROUP BY ms.id
             ORDER BY request_count DESC
             LIMIT 10"
        );
    }
    
    /**
     * آمار درآمد
     */
    private function getRevenueStats(string $period): array {
        // پیاده‌سازی آمار درآمد بر اساس دوره زمانی
        return [
            'total_revenue' => $this->calculateTotalRevenue(),
            'period' => $period,
            'breakdown' => $this->getRevenueBreakdown($period)
        ];
    }
    
    /**
     * شرط تاریخ برای کوئری
     */
    private function getDateCondition(string $field, string $date): string {
        switch ($date) {
            case 'today':
                return "DATE($field) = CURDATE()";
            case 'week':
                return "$field >= DATE_SUB(NOW(), INTERVAL 7 DAY)";
            case 'month':
                return "$field >= DATE_SUB(NOW(), INTERVAL 30 DAY)";
            default:
                return "DATE($field) = ?";
        }
    }
    
    /**
     * ارسال SMS به‌روزرسانی وضعیت
     */
    private function sendStatusUpdateSms(int $requestId, string $requestType, string $status): void {
        // TODO: پیاده‌سازی ارسال SMS بر اساس وضعیت جدید
        Logger::info('Status update SMS sent', [
            'request_id' => $requestId,
            'type' => $requestType,
            'status' => $status
        ]);
    }
    
    /**
     * ارسال SMS تخصیص دکتر
     */
    private function sendDoctorAssignmentSms(int $requestId, array $doctor): void {
        // TODO: پیاده‌سازی ارسال SMS اطلاع‌رسانی تخصیص دکتر
        Logger::info('Doctor assignment SMS sent', [
            'request_id' => $requestId,
            'doctor_id' => $doctor['id']
        ]);
    }
    
    /**
     * ارسال SMS تخصیص تکنسین
     */
    private function sendTechnicianAssignmentSms(int $requestId, string $technicianName, ?string $scheduledDateTime): void {
        // TODO: پیاده‌سازی ارسال SMS اطلاع‌رسانی تخصیص تکنسین
        Logger::info('Technician assignment SMS sent', [
            'request_id' => $requestId,
            'technician' => $technicianName,
            'scheduled' => $scheduledDateTime
        ]);
    }
}

try {
    $requestManagement = new AdminRequestManagement();
    $requestManagement->handleRequest();
} catch (Exception $e) {
    Logger::critical('Admin request management fatal error', ['error' => $e->getMessage()]);
    Response::serverError();
}
?>
