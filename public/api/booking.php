<?php
/**
 * Booking API - Secure Version for SaaS Platform
 * API رزرو - نسخه امن برای پلتفرم SaaS
 */

define('APP_START_TIME', microtime(true));

// Load dependencies
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/core/Database.php';
require_once __DIR__ . '/core/Logger.php';
require_once __DIR__ . '/core/Response.php';

// Handle CORS and preflight requests
Response::setCorsHeaders();
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    Response::success(null, 'Options handled', 200);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::error('متد مجاز نیست', 405);
}

/**
 * Booking Management Class
 */
class BookingAPI {
    private $db;
    
    public function __construct() {
        try {
            $this->db = Database::getInstance();
        } catch (Exception $e) {
            Logger::critical('BookingAPI initialization failed', ['error' => $e->getMessage()]);
            Response::serverError('خطا در راه‌اندازی سیستم رزرو');
        }
    }
    
    /**
     * Handle booking request
     */
    public function handleRequest(): void {
        try {
            $input = $this->getInputData();

if (!$input) {
                Response::error('داده‌های ورودی نامعتبر');
            }
            
            // Validate and sanitize input
            $validatedData = $this->validateAndSanitizeInput($input);
            
            // Process booking
            $this->processBooking($validatedData);
            
        } catch (Exception $e) {
            Logger::error('Booking request failed', ['error' => $e->getMessage()]);
            Response::serverError('خطا در پردازش درخواست رزرو');
        }
    }
    
    /**
     * Get input data
     */
    private function getInputData(): array {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        
        if (str_contains($contentType, 'application/json')) {
            $input = json_decode(file_get_contents('php://input'), true);
            return is_array($input) ? $input : [];
        }
        
        return $_POST;
    }
    
    /**
     * Validate and sanitize input data
     */
    private function validateAndSanitizeInput(array $input): array {
        $required_fields = ['fullName', 'phone', 'nationalCode', 'birthDate', 'gender', 'city', 'hasBasicInsurance'];
        
        foreach ($required_fields as $field) {
            if (empty($input[$field])) {
                Response::error("فیلد {$field} الزامی است");
            }
        }
        
        $data = [];
        
        // Sanitize and validate each field
        $data['fullName'] = $this->sanitizeString($input['fullName']);
        if (strlen($data['fullName']) < 2) {
            Response::error('نام باید حداقل ۲ کاراکتر باشد');
        }
        
        $data['phone'] = $this->validatePhone($input['phone']);
        $data['email'] = $this->sanitizeEmail($input['email'] ?? '');
        $data['nationalCode'] = $this->validateNationalCode($input['nationalCode']);
        $data['birthDate'] = $this->validateDate($input['birthDate']);
        $data['gender'] = $this->validateGender($input['gender']);
        $data['city'] = $this->sanitizeString($input['city']);
        $data['hasBasicInsurance'] = $this->validateBoolean($input['hasBasicInsurance']);
        
        // Optional fields
        if ($data['hasBasicInsurance'] === 'yes') {
            $data['basicInsurance'] = $this->sanitizeString($input['basicInsurance'] ?? '');
        }
        
        $data['complementaryInsurance'] = $this->sanitizeString($input['complementaryInsurance'] ?? '');
        $data['notes'] = $this->sanitizeString($input['notes'] ?? '');
        
        // Service specific fields
        $data['type'] = $this->validateServiceType($input['type'] ?? 'checkup');
        $data['title'] = $this->sanitizeString($input['title'] ?? '');
        
        // Location data
        if (isset($input['locationLat']) && isset($input['locationLng'])) {
            $data['locationLat'] = $this->validateCoordinate($input['locationLat']);
            $data['locationLng'] = $this->validateCoordinate($input['locationLng']);
        }
        
        return $data;
    }
    
    /**
     * Process booking request
     */
    private function processBooking(array $data): void {
        try {
            $this->db->beginTransaction();
            
            // Generate unique booking ID
            $bookingId = uniqid('booking_', true);
            
            // Get or create user ID
            $userId = $this->getOrCreateUser($data);
            
            // Insert booking record
            $tableData = [
                'user_id' => $userId,
                'patient_name' => $data['fullName'],
                'patient_phone' => $data['phone'],
                'patient_national_id' => $data['nationalCode'],
                'patient_birth_date' => $data['birthDate'],
                'patient_gender' => $data['gender'],
                'patient_city' => $data['city'],
                'has_insurance' => $data['hasBasicInsurance'] === 'yes',
                'insurance_type' => $data['basicInsurance'] ?? null,
                'patient_notes' => $data['notes'] ?? null,
                'title' => $data['title'],
                'status' => 'pending',
                'created_at' => date('Y-m-d H:i:s')
            ];
            
            if (isset($data['locationLat']) && isset($data['locationLng'])) {
                $tableData['location_latitude'] = $data['locationLat'];
                $tableData['location_longitude'] = $data['locationLng'];
            }
            
            // Choose appropriate table based on service type
            $tableName = $data['type'] === 'home_sampling' ? 'home_sampling_requests' : 'checkup_requests';
            
            // Ensure table exists
            $this->ensureTableExists($tableName);
            
            $insertedId = $this->db->insert($tableName, $tableData);
            
            // Send notifications
            $this->sendNotifications($data, $bookingId);
            
            // Log successful booking
            Logger::info('Booking created successfully', [
                'booking_id' => $bookingId,
                'type' => $data['type'],
                'phone' => $data['phone'],
                'city' => $data['city']
            ]);
            
            $this->db->commit();
            
            // Generate public view link
            $publicLink = $this->generatePublicLink($bookingId);
            
            Response::success([
                'booking_id' => $bookingId,
                'public_link' => $publicLink,
                'status' => 'pending'
            ], 'درخواست شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.');
            
        } catch (Exception $e) {
            $this->db->rollback();
            Logger::error('Booking processing failed', [
                'error' => $e->getMessage(),
                'phone' => $data['phone'] ?? 'unknown'
            ]);
            Response::serverError('خطا در ثبت درخواست');
        }
    }
    
    /**
     * Send notifications (email/SMS)
     */
    private function sendNotifications(array $data, string $bookingId): void {
        try {
            // Generate public link
            $publicLink = $this->generatePublicLink($bookingId);
            
            // Send admin email
            $adminEmailBody = $this->createAdminEmail($data, $publicLink);
            if (function_exists('sendEmail')) {
                sendEmail(
                    ADMIN_EMAIL,
                    'درخواست جدید ' . ($data['type'] === 'checkup' ? 'چکاپ' : 'نمونه‌گیری'),
                    $adminEmailBody
                );
            }
            
            // Send customer email (if email provided)
            if (!empty($data['email'])) {
                $customerEmailBody = $this->createCustomerEmail($data);
                if (function_exists('sendEmail')) {
                    sendEmail(
                        $data['email'],
                        'تایید درخواست آزمایشگاه سلامت',
                        $customerEmailBody
                    );
                }
            }
            
            // Send SMS to customer
            $this->sendCustomerSMS($data);
            
            // Send SMS to staff
            $this->sendStaffSMS($data, $publicLink);
            
        } catch (Exception $e) {
            Logger::warning('Notification sending failed', [
                'error' => $e->getMessage(),
                'booking_id' => $bookingId
            ]);
            // Don't fail the booking if notifications fail
        }
    }
    
    /**
     * Send SMS to customer using SMS.ir templates
     */
    private function sendCustomerSMS(array $data): void {
        try {
            // انتخاب Template ID مناسب بر اساس نوع سرویس
            $templateId = $data['type'] === 'checkup' ? 
                (defined('CHECKUP_CONFIRM_TEMPLATE_ID') ? CHECKUP_CONFIRM_TEMPLATE_ID : null) : 
                (defined('SMSIR_CONFIRM_TEMPLATE_ID') ? SMSIR_CONFIRM_TEMPLATE_ID : null);
                
            if (!$templateId) {
                Logger::warning('Customer SMS template ID not defined', [
                    'service_type' => $data['type']
                ]);
                return;
            }
            
            // آماده‌سازی پارامترها مطابق قالب SMS.ir
            $parameters = [
                'NAME' => $data['fullName']
            ];
            
            // اضافه کردن پارامترهای اضافی بر اساس نوع سرویس
            if ($data['type'] === 'checkup') {
                $parameters['CHECKUP'] = $data['title'] ?? 'چکاپ عمومی';
            }
            
            if (function_exists('sendTemplateSMS')) {
                $result = sendTemplateSMS($data['phone'], $templateId, $parameters);
                
                if ($result) {
                    Logger::info('Customer confirmation SMS sent', [
                        'phone' => $data['phone'],
                        'template_id' => $templateId,
                        'service_type' => $data['type']
                    ]);
                } else {
                    Logger::error('Customer confirmation SMS failed', [
                        'phone' => $data['phone'],
                        'template_id' => $templateId
                    ]);
                }
            } else {
                Logger::warning('sendTemplateSMS function not available');
            }
            
        } catch (Exception $e) {
            Logger::error('Customer SMS sending exception', [
                'phone' => $data['phone'],
                'error' => $e->getMessage()
            ]);
        }
    }
    
    /**
     * Send SMS notification to staff using SMS.ir templates
     */
    private function sendStaffSMS(array $data, string $publicLink): void {
        try {
            if (!defined('STAFF_NOTIFY_MOBILE') || !STAFF_NOTIFY_MOBILE) {
                Logger::info('Staff notification mobile not defined');
                return;
            }
            
            if (!defined('SMSIR_STAFF_TEMPLATE_ID') || !SMSIR_STAFF_TEMPLATE_ID) {
                Logger::warning('Staff notification template ID not defined');
                return;
            }
            
            // آماده‌سازی پارامترها برای قالب اطلاع‌رسانی همکار
            $parameters = [
                'LINK' => $publicLink
            ];
            
            if (function_exists('sendTemplateSMS')) {
                $result = sendTemplateSMS(STAFF_NOTIFY_MOBILE, SMSIR_STAFF_TEMPLATE_ID, $parameters);
                
                if ($result) {
                    Logger::info('Staff notification SMS sent', [
                        'staff_mobile' => STAFF_NOTIFY_MOBILE,
                        'template_id' => SMSIR_STAFF_TEMPLATE_ID,
                        'public_link' => $publicLink
    ]);
} else {
                    Logger::error('Staff notification SMS failed', [
                        'staff_mobile' => STAFF_NOTIFY_MOBILE,
                        'template_id' => SMSIR_STAFF_TEMPLATE_ID
                    ]);
                }
            } else {
                Logger::warning('sendTemplateSMS function not available for staff notification');
            }
            
        } catch (Exception $e) {
            Logger::error('Staff SMS notification exception', [
                'error' => $e->getMessage(),
                'public_link' => $publicLink
            ]);
        }
    }
    
    /**
     * Create admin email content
     */
    private function createAdminEmail(array $data, string $publicLink): string {
        if (function_exists('createBeautifulEmail')) {
            return createBeautifulEmail($data, 'admin', $publicLink);
        }
        
        // Fallback simple email
        return "درخواست جدید از {$data['fullName']} با شماره {$data['phone']} ثبت شد.\n\nلینک مشاهده: {$publicLink}";
    }
    
    /**
     * Create customer email content
     */
    private function createCustomerEmail(array $data): string {
        if (function_exists('createCustomerEmail')) {
            return createCustomerEmail($data);
        }
        
        // Fallback simple email
        return "درخواست شما با موفقیت ثبت شد. به زودی با شما تماس خواهیم گرفت.";
    }
    
    /**
     * Generate public view link
     */
    private function generatePublicLink(string $bookingId): string {
        $baseUrl = isset($_SERVER['HTTPS']) ? 'https' : 'http';
        $baseUrl .= '://' . $_SERVER['HTTP_HOST'];
        return $baseUrl . '/r/' . $bookingId;
    }
    
    /**
     * Ensure database table exists
     */
    private function ensureTableExists(string $tableName): void {
        if (!$this->db->tableExists($tableName)) {
            $this->createBookingTable($tableName);
        }
    }
    
    /**
     * Get or create user for booking
     */
    private function getOrCreateUser(array $data): int {
        // Check if user exists by phone
        $user = $this->db->fetchOne("SELECT id FROM users WHERE phone = ?", [$data['phone']]);
        
        if ($user) {
            return $user['id'];
        }
        
        // Create new user
        $userData = [
            'phone' => $data['phone'],
            'first_name' => $this->extractFirstName($data['fullName']),
            'last_name' => $this->extractLastName($data['fullName']),
            'national_id' => $data['nationalCode'],
            'birth_date' => $data['birthDate'],
            'gender' => $data['gender'],
            'city' => $data['city'],
            'has_basic_insurance' => $data['hasBasicInsurance'],
            'basic_insurance' => $data['basicInsurance'] ?? null,
            'complementary_insurance' => $data['complementaryInsurance'] ?? null,
            'is_profile_complete' => true,
            'is_verified' => false, // Will verify via booking process
            'is_active' => true,
            'created_at' => date('Y-m-d H:i:s')
        ];
        
        if (!empty($data['email'])) {
            $userData['email'] = $data['email'];
        }
        
        return $this->db->insert('users', $userData);
    }
    
    /**
     * Extract first name from full name
     */
    private function extractFirstName(string $fullName): string {
        $parts = explode(' ', trim($fullName));
        return $parts[0] ?? '';
    }
    
    /**
     * Extract last name from full name
     */
    private function extractLastName(string $fullName): string {
        $parts = explode(' ', trim($fullName));
        array_shift($parts); // Remove first name
        return implode(' ', $parts);
    }
    
    /**
     * Create booking table
     */
    private function createBookingTable(string $tableName): void {
        // Use the standard schema from database-schema.sql
        if ($tableName === 'checkup_requests') {
            $sql = "CREATE TABLE IF NOT EXISTS checkup_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                service_id INT,
                doctor_id INT,
                title VARCHAR(200) NOT NULL,
                patient_name VARCHAR(100) NOT NULL,
                patient_phone VARCHAR(11) NOT NULL,
                patient_national_id VARCHAR(10),
                patient_birth_date DATE,
                patient_gender ENUM('male', 'female'),
                patient_city VARCHAR(50),
                has_insurance BOOLEAN DEFAULT FALSE,
                insurance_type VARCHAR(100),
                preferred_date DATE,
                preferred_time TIME,
                appointment_date DATETIME,
                address_id INT,
                custom_address TEXT,
                status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected') DEFAULT 'pending',
                priority ENUM('normal', 'urgent', 'emergency') DEFAULT 'normal',
                estimated_price DECIMAL(10, 2),
                final_price DECIMAL(10, 2),
                patient_notes TEXT,
                admin_notes TEXT,
                doctor_notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                confirmed_at TIMESTAMP NULL,
                completed_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_status (status),
                INDEX idx_appointment_date (appointment_date),
                INDEX idx_created_at (created_at),
                INDEX idx_patient_phone (patient_phone)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        } else { // home_sampling_requests
            $sql = "CREATE TABLE IF NOT EXISTS home_sampling_requests (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                service_ids JSON,
                title VARCHAR(200) NOT NULL,
                patient_name VARCHAR(100) NOT NULL,
                patient_phone VARCHAR(11) NOT NULL,
                patient_national_id VARCHAR(10),
                patient_birth_date DATE,
                patient_gender ENUM('male', 'female'),
                address_id INT,
                custom_address TEXT,
                address_latitude DECIMAL(10, 8),
                address_longitude DECIMAL(11, 8),
                preferred_date DATE,
                preferred_time_start TIME,
                preferred_time_end TIME,
                scheduled_datetime DATETIME,
                status ENUM('pending', 'confirmed', 'assigned', 'in_progress', 'collected', 'completed', 'cancelled') DEFAULT 'pending',
                priority ENUM('normal', 'urgent') DEFAULT 'normal',
                technician_id INT,
                technician_name VARCHAR(100),
                technician_phone VARCHAR(11),
                service_price DECIMAL(10, 2),
                transport_price DECIMAL(10, 2),
                total_price DECIMAL(10, 2),
                patient_notes TEXT,
                admin_notes TEXT,
                technician_notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                confirmed_at TIMESTAMP NULL,
                completed_at TIMESTAMP NULL,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                INDEX idx_user_id (user_id),
                INDEX idx_status (status),
                INDEX idx_scheduled_datetime (scheduled_datetime),
                INDEX idx_created_at (created_at),
                INDEX idx_patient_phone (patient_phone)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        }
        
        $this->db->getConnection()->exec($sql);
    }
    
    /**
     * Validation helper methods
     */
    private function sanitizeString(string $input): string {
        return trim(strip_tags($input));
    }
    
    private function sanitizeEmail(string $email): string {
        return filter_var($email, FILTER_SANITIZE_EMAIL);
    }
    
    private function validatePhone(string $phone): string {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        
        if (strlen($phone) === 11 && substr($phone, 0, 2) === '09') {
            return $phone;
        }
        
        if (strlen($phone) === 10 && substr($phone, 0, 1) === '9') {
            return '0' . $phone;
        }
        
        Response::error('شماره تلفن نامعتبر است');
    }
    
    private function validateNationalCode(string $nationalCode): string {
        $nationalCode = preg_replace('/[^0-9]/', '', $nationalCode);
        
        if (strlen($nationalCode) !== 10) {
            Response::error('کد ملی باید ۱۰ رقم باشد');
        }
        
        return $nationalCode;
    }
    
    private function validateDate(string $date): string {
        // Basic date validation (you might want to improve this)
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
            Response::error('فرمت تاریخ نامعتبر است');
        }
        
        return $date;
    }
    
    private function validateGender(string $gender): string {
        if (!in_array($gender, ['male', 'female'])) {
            Response::error('جنسیت نامعتبر است');
        }
        
        return $gender;
    }
    
    private function validateBoolean(string $value): string {
        if (!in_array($value, ['yes', 'no'])) {
            Response::error('مقدار boolean نامعتبر است');
        }
        
        return $value;
    }
    
    private function validateServiceType(string $type): string {
        $validTypes = ['checkup', 'home_sampling', 'consultation'];
        
        if (!in_array($type, $validTypes)) {
            Response::error('نوع سرویس نامعتبر است');
        }
        
        return $type;
    }
    
    private function validateCoordinate($coordinate): float {
        if (!is_numeric($coordinate)) {
            Response::error('مختصات جغرافیایی نامعتبر است');
        }
        
        return (float)$coordinate;
    }
}

// Execute API
try {
    $api = new BookingAPI();
    $api->handleRequest();
} catch (Exception $e) {
    Logger::critical('BookingAPI execution failed', ['error' => $e->getMessage()]);
    Response::serverError('خطا در سیستم رزرو');
}
?>
