<?php
/**
 * Database Initialization Script
 * اسکریپت راه‌اندازی دیتابیس آزمایشگاه سلامت
 */

define('APP_START_TIME', microtime(true));
define('ENVIRONMENT', 'production');

require_once __DIR__ . '/core/Database.php';
require_once __DIR__ . '/core/Logger.php';
require_once __DIR__ . '/core/Response.php';

class DatabaseInitializer {
    private $db;
    
    public function __construct() {
        $this->db = Database::getInstance();
    }
    
    /**
     * راه‌اندازی کامل دیتابیس
     */
    public function initialize(): array {
        $results = [
            'success' => true,
            'steps' => [],
            'errors' => []
        ];
        
        try {
            // گام 1: ایجاد جداول
            $results['steps'][] = $this->createTables();
            
            // گام 2: درج داده‌های اولیه
            $results['steps'][] = $this->insertInitialData();
            
            // گام 3: ایجاد ایندکس‌های اضافی
            $results['steps'][] = $this->createAdditionalIndexes();
            
            // گام 4: تنظیم مجوزها و امنیت
            $results['steps'][] = $this->setupSecurity();
            
            Logger::info('Database initialization completed successfully');
            
        } catch (Exception $e) {
            $results['success'] = false;
            $results['errors'][] = $e->getMessage();
            Logger::error('Database initialization failed', ['error' => $e->getMessage()]);
        }
        
        return $results;
    }
    
    /**
     * ایجاد جداول از فایل schema
     */
    private function createTables(): array {
        $step = [
            'name' => 'ایجاد جداول دیتابیس',
            'success' => false,
            'details' => []
        ];
        
        try {
            $schemaFile = __DIR__ . '/../../database-schema.sql';
            
            if (!file_exists($schemaFile)) {
                throw new Exception('فایل schema یافت نشد');
            }
            
            $sql = file_get_contents($schemaFile);
            $statements = $this->parseSqlStatements($sql);
            
            $this->db->beginTransaction();
            
            foreach ($statements as $statement) {
                if (!empty(trim($statement))) {
                    $this->db->getConnection()->exec($statement);
                    $step['details'][] = 'اجرای statement: ' . substr(trim($statement), 0, 50) . '...';
                }
            }
            
            $this->db->commit();
            
            $step['success'] = true;
            $step['details'][] = 'تمام جداول با موفقیت ایجاد شدند';
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception('خطا در ایجاد جداول: ' . $e->getMessage());
        }
        
        return $step;
    }
    
    /**
     * درج داده‌های اولیه
     */
    private function insertInitialData(): array {
        $step = [
            'name' => 'درج داده‌های اولیه',
            'success' => false,
            'details' => []
        ];
        
        try {
            $this->db->beginTransaction();
            
            // تنظیمات سیستم
            $this->insertSystemSettings($step);
            
            // سرویس‌های پزشکی پایه
            $this->insertBasicMedicalServices($step);
            
            // دکترهای نمونه
            $this->insertSampleDoctors($step);
            
            // محتوای وبلاگ نمونه
            $this->insertSampleBlogPosts($step);
            
            $this->db->commit();
            
            $step['success'] = true;
            $step['details'][] = 'تمام داده‌های اولیه با موفقیت درج شدند';
            
        } catch (Exception $e) {
            $this->db->rollback();
            throw new Exception('خطا در درج داده‌های اولیه: ' . $e->getMessage());
        }
        
        return $step;
    }
    
    /**
     * درج تنظیمات سیستم
     */
    private function insertSystemSettings(array &$step): void {
        $settings = [
            ['site_name', 'آزمایشگاه تشخیص پزشکی سلامت', 'string', 'نام سایت', 'general'],
            ['site_description', 'ارائه خدمات تشخیص پزشکی با کیفیت بالا', 'string', 'توضیحات سایت', 'general'],
            ['contact_phone', '021-46833010', 'string', 'شماره تماس اصلی', 'contact'],
            ['contact_email', 'info@salamatlab.com', 'string', 'ایمیل تماس', 'contact'],
            ['contact_address', 'تهران، خیابان ولیعصر، پلاک 123', 'string', 'آدرس آزمایشگاه', 'contact'],
            ['working_hours', '8:00-20:00', 'string', 'ساعات کاری', 'general'],
            ['otp_expire_minutes', '5', 'integer', 'مدت انقضای OTP (دقیقه)', 'security'],
            ['max_otp_attempts', '5', 'integer', 'حداکثر تلاش OTP', 'security'],
            ['home_service_radius_km', '25', 'integer', 'شعاع خدمات در محل (کیلومتر)', 'services'],
            ['min_home_service_price', '100000', 'integer', 'حداقل مبلغ خدمات در محل', 'services'],
            ['emergency_phone', '09121234567', 'string', 'شماره اضطراری', 'contact'],
            ['sms_api_active', 'true', 'boolean', 'فعال بودن SMS API', 'services'],
            ['email_notifications', 'true', 'boolean', 'اطلاع‌رسانی ایمیل', 'notifications'],
            ['maintenance_mode', 'false', 'boolean', 'حالت تعمیرات', 'system']
        ];
        
        foreach ($settings as $setting) {
            $this->db->insert('system_settings', [
                'setting_key' => $setting[0],
                'setting_value' => $setting[1],
                'setting_type' => $setting[2],
                'description' => $setting[3],
                'category' => $setting[4],
                'is_public' => in_array($setting[0], ['site_name', 'site_description', 'contact_phone', 'working_hours'])
            ]);
        }
        
        $step['details'][] = 'تنظیمات سیستم درج شد (' . count($settings) . ' مورد)';
    }
    
    /**
     * درج سرویس‌های پزشکی پایه
     */
    private function insertBasicMedicalServices(array &$step): void {
        $services = [
            // آزمایشات خون
            ['آزمایش خون کامل (CBC)', 'laboratory', 'blood_test', 'شامل شمارش گلبول‌های قرمز، سفید و پلاکت', 120000, 150000, 30, true],
            ['بیوشیمی خون (پایه)', 'laboratory', 'blood_test', 'قند، اوره، کراتینین، کلسترول', 200000, 230000, 30, true],
            ['آزمایش تیروئید (TSH, T3, T4)', 'laboratory', 'hormone', 'بررسی عملکرد غده تیروئید', 180000, 210000, 45, true],
            ['آزمایش کبد (SGOT, SGPT)', 'laboratory', 'blood_test', 'بررسی عملکرد کبد', 150000, 180000, 30, true],
            
            // آزمایشات ادرار
            ['آزمایش ادرار کامل', 'laboratory', 'urine_test', 'تجزیه فیزیکی، شیمیایی و میکروسکوپی ادرار', 80000, 100000, 20, true],
            ['کشت ادرار', 'laboratory', 'culture', 'تشخیص عفونت مجاری ادراری', 120000, 150000, 48, true],
            
            // تصویربرداری
            ['سونوگرافی شکم و لگن', 'imaging', 'ultrasound', 'بررسی اندام‌های داخلی شکم', 300000, 0, 30, false],
            ['اکوکاردیوگرافی', 'imaging', 'ultrasound', 'سونوگرافی قلب', 400000, 0, 45, false],
            ['رادیوگرافی قفسه سینه', 'imaging', 'xray', 'عکس‌برداری از ریه‌ها', 150000, 0, 15, false],
            
            // تست‌های تشخیصی
            ['نوار قلب (ECG)', 'diagnostic', 'cardiac', 'بررسی ریتم و عملکرد قلب', 100000, 120000, 15, true],
            ['اسپیرومتری', 'diagnostic', 'pulmonary', 'بررسی عملکرد ریه‌ها', 150000, 180000, 20, true],
            ['تست ورزش', 'diagnostic', 'cardiac', 'بررسی قلب در حین فعالیت', 300000, 0, 60, false],
            
            // چکاپ‌های جامع
            ['چکاپ عمومی پایه', 'checkup', 'general', 'بررسی کلی سلامت شامل آزمایشات اساسی', 500000, 0, 120, false],
            ['چکاپ قلب و عروق', 'checkup', 'cardiac', 'بررسی کامل سیستم قلبی عروقی', 800000, 0, 180, false],
            ['چکاپ زنان', 'checkup', 'gynecology', 'بررسی‌های تخصصی بانوان', 600000, 0, 120, false],
            
            // تست‌های تخصصی
            ['آزمایش هورمون‌های جنسی', 'laboratory', 'hormone', 'تستوسترون، استروژن، پروژسترون', 250000, 280000, 45, true],
            ['آزمایش ویتامین‌ها', 'laboratory', 'vitamin', 'ویتامین D، B12، فولات', 200000, 230000, 45, true],
            ['تست آلرژی', 'laboratory', 'allergy', 'تشخیص آلرژن‌های شایع', 300000, 350000, 60, true]
        ];
        
        foreach ($services as $service) {
            $this->db->insert('medical_services', [
                'name' => $service[0],
                'category' => $service[1],
                'sub_category' => $service[2],
                'description' => $service[3],
                'base_price' => $service[4],
                'home_service_price' => $service[5],
                'duration_minutes' => $service[6],
                'home_service_available' => $service[7],
                'is_active' => true,
                'requires_appointment' => true
            ]);
        }
        
        $step['details'][] = 'سرویس‌های پزشکی درج شد (' . count($services) . ' مورد)';
    }
    
    /**
     * درج دکترهای نمونه
     */
    private function insertSampleDoctors(array &$step): void {
        $doctors = [
            ['دکتر', 'احمد', 'محمدی', 'پزشک عمومی', 'general', null, '1234567890', 15, 'دکترای پزشکی از دانشگاه تهران', '09121234567', 'info@salamatlab.com', 'پزشک عمومی با تجربه در درمان بیماری‌های شایع', 'ویزیت عمومی، مشاوره سلامت', true, true, 1, 200000, 300000],
            
            ['دکتر', 'فاطمه', 'احمدی', 'متخصص قلب و عروق', 'cardiology', 'اکوکاردیوگرافی', '2345678901', 12, 'فوق تخصص قلب از دانشگاه شهید بهشتی', '09123456789', 'f.ahmadi@salamatlab.com', 'متخصص قلب و عروق با تخصص در اکوکاردیوگرافی', 'اکو قلب، نوار قلب، مشاوره قلبی', true, true, 2, 400000, 500000],
            
            ['دکتر', 'علی', 'رضایی', 'متخصص داخلی', 'internal', 'غدد درون‌ریز', '3456789012', 10, 'تخصص داخلی از دانشگاه ایران', '09134567890', 'a.rezaei@salamatlab.com', 'متخصص بیماری‌های داخلی و غدد', 'درمان دیابت، تیروئید، فشار خون', true, false, 3, 350000, 450000],
            
            ['دکتر', 'مریم', 'کریمی', 'متخصص زنان و زایمان', 'gynecology', 'سونوگرافی زنان', '4567890123', 8, 'تخصص زنان از دانشگاه علوم پزشکی تهران', '09145678901', 'm.karimi@salamatlab.com', 'متخصص زنان و زایمان با تجربه در سونوگرافی', 'ویزیت زنان، سونوگرافی، مشاوره بارداری', true, false, 4, 380000, 480000],
            
            ['دکتر', 'محسن', 'حسینی', 'متخصص اطفال', 'pediatrics', null, '5678901234', 6, 'تخصص اطفال از دانشگاه مشهد', '09156789012', 'm.hosseini@salamatlab.com', 'متخصص بیماری‌های کودکان', 'واکسیناسیون، درمان کودکان، مشاوره رشد', true, false, 5, 300000, 400000]
        ];
        
        foreach ($doctors as $doctor) {
            $this->db->insert('doctors', [
                'title' => $doctor[0],
                'first_name' => $doctor[1],
                'last_name' => $doctor[2],
                'specialty' => $doctor[3],
                'specialty_category' => $doctor[4],
                'sub_specialty' => $doctor[5],
                'medical_council_number' => $doctor[6],
                'experience_years' => $doctor[7],
                'education' => $doctor[8],
                'phone' => $doctor[9],
                'email' => $doctor[10],
                'bio' => $doctor[11],
                'services' => $doctor[12],
                'is_active' => $doctor[13],
                'is_featured' => $doctor[14],
                'display_order' => $doctor[15],
                'consultation_fee' => $doctor[16],
                'home_visit_fee' => $doctor[17],
                'available_days' => json_encode(['monday', 'tuesday', 'wednesday', 'thursday', 'saturday']),
                'available_hours' => json_encode([['start' => '09:00', 'end' => '17:00']])
            ]);
        }
        
        $step['details'][] = 'اطلاعات دکترها درج شد (' . count($doctors) . ' مورد)';
    }
    
    /**
     * درج محتوای نمونه وبلاگ
     */
    private function insertSampleBlogPosts(array &$step): void {
        $posts = [
            [
                'اهمیت چکاپ منظم سلامت',
                'importance-of-regular-health-checkup',
                'چکاپ منظم یکی از مهم‌ترین اقدامات پیشگیرانه برای حفظ سلامتی است.',
                'چکاپ منظم سلامت یکی از مهم‌ترین اقدامات پیشگیرانه است که می‌تواند از بروز بسیاری از بیماری‌ها جلوگیری کند یا آنها را در مراحل اولیه تشخیص دهد...',
                'health-tips',
                '["سلامت", "چکاپ", "پیشگیری"]',
                'published',
                true
            ],
            [
                'آزمایش خون و اهمیت آن',
                'blood-test-importance',
                'آزمایش خون یکی از مهم‌ترین ابزارهای تشخیصی در پزشکی است.',
                'آزمایش خون ابزاری قدرتمند برای تشخیص انواع بیماری‌ها و نظارت بر سلامت عمومی بدن است. این آزمایش می‌تواند اطلاعات ارزشمندی در مورد عملکرد اندام‌های مختلف بدن ارائه دهد...',
                'laboratory',
                '["آزمایش", "خون", "تشخیص"]',
                'published',
                false
            ],
            [
                'راهنمای آماده‌سازی برای آزمایشات',
                'test-preparation-guide',
                'آماده‌سازی صحیح برای آزمایشات می‌تواند دقت نتایج را تضمین کند.',
                'برای دریافت نتایج دقیق از آزمایشات، رعایت نکات آماده‌سازی بسیار مهم است. در این مقاله راهنمای کاملی برای آماده‌سازی انواع آزمایشات ارائه می‌دهیم...',
                'guide',
                '["آماده‌سازی", "آزمایش", "راهنما"]',
                'published',
                false
            ]
        ];
        
        foreach ($posts as $post) {
            $this->db->insert('blog_posts', [
                'title' => $post[0],
                'slug' => $post[1],
                'excerpt' => $post[2],
                'content' => $post[3],
                'category' => $post[4],
                'tags' => $post[5],
                'status' => $post[6],
                'is_featured' => $post[7],
                'published_at' => date('Y-m-d H:i:s'),
                'meta_title' => $post[0],
                'meta_description' => $post[2]
            ]);
        }
        
        $step['details'][] = 'مقالات نمونه درج شد (' . count($posts) . ' مورد)';
    }
    
    /**
     * ایجاد ایندکس‌های اضافی
     */
    private function createAdditionalIndexes(): array {
        $step = [
            'name' => 'ایجاد ایندکس‌های اضافی',
            'success' => false,
            'details' => []
        ];
        
        try {
            $indexes = [
                "CREATE INDEX idx_users_phone_active ON users(phone, is_active)",
                "CREATE INDEX idx_otp_phone_expires ON otp_codes(phone, expires_at)",
                "CREATE INDEX idx_checkup_user_status ON checkup_requests(user_id, status)",
                "CREATE INDEX idx_sampling_user_status ON home_sampling_requests(user_id, status)",
                "CREATE INDEX idx_blog_status_featured ON blog_posts(status, is_featured)",
                "CREATE INDEX idx_services_category_active ON medical_services(category, is_active)",
                "CREATE INDEX idx_doctors_specialty_active ON doctors(specialty_category, is_active)"
            ];
            
            foreach ($indexes as $index) {
                try {
                    $this->db->getConnection()->exec($index);
                    $step['details'][] = 'ایندکس ایجاد شد: ' . substr($index, 0, 50) . '...';
                } catch (Exception $e) {
                    // ایندکس ممکن است از قبل وجود داشته باشد
                    if (!str_contains($e->getMessage(), 'already exists')) {
                        throw $e;
                    }
                }
            }
            
            $step['success'] = true;
            $step['details'][] = 'تمام ایندکس‌ها بررسی و ایجاد شدند';
            
        } catch (Exception $e) {
            throw new Exception('خطا در ایجاد ایندکس‌ها: ' . $e->getMessage());
        }
        
        return $step;
    }
    
    /**
     * تنظیم امنیت و مجوزها
     */
    private function setupSecurity(): array {
        $step = [
            'name' => 'تنظیم امنیت دیتابیس',
            'success' => false,
            'details' => []
        ];
        
        try {
            // تنظیمات امنیتی MySQL
            $securitySettings = [
                "SET GLOBAL sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO'",
                "SET GLOBAL max_connections = 100",
                "SET GLOBAL connect_timeout = 10"
            ];
            
            foreach ($securitySettings as $setting) {
                try {
                    $this->db->getConnection()->exec($setting);
                    $step['details'][] = 'تنظیم امنیتی اعمال شد';
                } catch (Exception $e) {
                    // برخی تنظیمات ممکن است نیاز به مجوز خاص داشته باشند
                    $step['details'][] = 'تنظیم امنیتی نادیده گرفته شد (نیاز به مجوز)';
                }
            }
            
            $step['success'] = true;
            $step['details'][] = 'تنظیمات امنیتی بررسی شد';
            
        } catch (Exception $e) {
            // خطاهای امنیتی critical نیستند
            $step['success'] = true;
            $step['details'][] = 'تنظیمات امنیتی با محدودیت اعمال شد';
        }
        
        return $step;
    }
    
    /**
     * تجزیه statements SQL
     */
    private function parseSqlStatements(string $sql): array {
        // حذف کامنت‌ها
        $sql = preg_replace('/--.*$/m', '', $sql);
        $sql = preg_replace('/\/\*.*?\*\//s', '', $sql);
        
        // تقسیم بر اساس semicolon
        $statements = explode(';', $sql);
        
        // حذف statements خالی
        return array_filter(array_map('trim', $statements), function($stmt) {
            return !empty($stmt) && !str_starts_with($stmt, '--');
        });
    }
    
    /**
     * بررسی وضعیت دیتابیس
     */
    public function checkStatus(): array {
        $status = [
            'database_connected' => false,
            'tables_exist' => false,
            'data_initialized' => false,
            'table_count' => 0,
            'record_counts' => []
        ];
        
        try {
            // بررسی اتصال
            $this->db->getConnection()->query('SELECT 1');
            $status['database_connected'] = true;
            
            // شمارش جداول
            $tables = $this->db->fetchAll("SHOW TABLES");
            $status['table_count'] = count($tables);
            $status['tables_exist'] = $status['table_count'] > 0;
            
            // شمارش رکوردها در جداول اصلی
            $mainTables = ['users', 'medical_services', 'doctors', 'system_settings'];
            foreach ($mainTables as $table) {
                if ($this->db->tableExists($table)) {
                    $count = $this->db->fetchOne("SELECT COUNT(*) as count FROM $table")['count'];
                    $status['record_counts'][$table] = $count;
                }
            }
            
            // بررسی وجود داده‌های اولیه
            $status['data_initialized'] = 
                ($status['record_counts']['system_settings'] ?? 0) > 0 &&
                ($status['record_counts']['medical_services'] ?? 0) > 0;
                
        } catch (Exception $e) {
            Logger::error('Database status check failed', ['error' => $e->getMessage()]);
        }
        
        return $status;
    }
}

// اجرای اسکریپت
try {
    Response::setCorsHeaders();
    
    $initializer = new DatabaseInitializer();
    
    $action = $_GET['action'] ?? 'status';
    
    switch ($action) {
        case 'init':
            $results = $initializer->initialize();
            Response::success($results, 'راه‌اندازی دیتابیس کامل شد');
            break;
            
        case 'status':
        default:
            $status = $initializer->checkStatus();
            Response::success($status, 'وضعیت دیتابیس');
            break;
    }
    
} catch (Exception $e) {
    Logger::critical('Database initialization script failed', ['error' => $e->getMessage()]);
    Response::serverError('خطا در اجرای اسکریپت راه‌اندازی');
}
?>
