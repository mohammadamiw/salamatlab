<?php
/**
 * Admin Dashboard API
 * API داشبورد مدیریت
 */

define('APP_START_TIME', microtime(true));
define('ENVIRONMENT', 'production');

require_once __DIR__ . '/../core/Database.php';
require_once __DIR__ . '/../core/Logger.php';
require_once __DIR__ . '/../core/Response.php';
require_once __DIR__ . '/../core/AdminAuth.php';

Response::handleOptions();

class AdminDashboard {
    private $db;
    private $auth;
    
    public function __construct() {
        $this->db = Database::getInstance();
        $this->auth = new AdminAuth();
        
        // بررسی احراز هویت
        $this->auth->requireAuth(['dashboard.view']);
    }
    
    public function handleRequest(): void {
        $method = $_SERVER['REQUEST_METHOD'];
        
        try {
            switch ($method) {
                case 'GET':
                    $this->handleGet();
                    break;
                default:
                    Response::error('متد پشتیبانی نمی‌شود', 405);
            }
        } catch (Exception $e) {
            Logger::error('Admin dashboard error', ['error' => $e->getMessage()]);
            Response::serverError();
        }
    }
    
    private function handleGet(): void {
        $action = $_GET['action'] ?? 'overview';
        
        switch ($action) {
            case 'overview':
                $this->getOverview();
                break;
            case 'stats':
                $this->getDetailedStats();
                break;
            case 'recent-activity':
                $this->getRecentActivity();
                break;
            case 'system-health':
                $this->getSystemHealth();
                break;
            default:
                Response::error('عمل نامعتبر');
        }
    }
    
    /**
     * نمای کلی داشبورد
     */
    private function getOverview(): void {
        $overview = [
            'summary' => $this->getSummaryStats(),
            'recent_requests' => $this->getRecentRequests(5),
            'pending_actions' => $this->getPendingActions(),
            'quick_stats' => $this->getQuickStats()
        ];
        
        Response::success($overview);
    }
    
    /**
     * آمار خلاصه
     */
    private function getSummaryStats(): array {
        $today = date('Y-m-d');
        $thisMonth = date('Y-m');
        
        return [
            'users' => [
                'total' => $this->db->fetchOne("SELECT COUNT(*) as count FROM users WHERE is_active = TRUE")['count'],
                'new_today' => $this->db->fetchOne("SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = ?", [$today])['count'],
                'verified' => $this->db->fetchOne("SELECT COUNT(*) as count FROM users WHERE is_verified = TRUE")['count']
            ],
            'requests' => [
                'checkup_total' => $this->db->fetchOne("SELECT COUNT(*) as count FROM checkup_requests")['count'],
                'checkup_pending' => $this->db->fetchOne("SELECT COUNT(*) as count FROM checkup_requests WHERE status = 'pending'")['count'],
                'sampling_total' => $this->db->fetchOne("SELECT COUNT(*) as count FROM home_sampling_requests")['count'],
                'sampling_pending' => $this->db->fetchOne("SELECT COUNT(*) as count FROM home_sampling_requests WHERE status = 'pending'")['count']
            ],
            'revenue' => [
                'today' => $this->calculateDailyRevenue($today),
                'this_month' => $this->calculateMonthlyRevenue($thisMonth),
                'total' => $this->calculateTotalRevenue()
            ],
            'services' => [
                'active_services' => $this->db->fetchOne("SELECT COUNT(*) as count FROM medical_services WHERE is_active = TRUE")['count'],
                'active_doctors' => $this->db->fetchOne("SELECT COUNT(*) as count FROM doctors WHERE is_active = TRUE")['count']
            ]
        ];
    }
    
    /**
     * آمار سریع
     */
    private function getQuickStats(): array {
        $last24h = date('Y-m-d H:i:s', time() - 24 * 60 * 60);
        
        return [
            'new_users_24h' => $this->db->fetchOne(
                "SELECT COUNT(*) as count FROM users WHERE created_at >= ?", 
                [$last24h]
            )['count'],
            'new_requests_24h' => $this->db->fetchOne(
                "SELECT COUNT(*) as count FROM checkup_requests WHERE created_at >= ?", 
                [$last24h]
            )['count'] + $this->db->fetchOne(
                "SELECT COUNT(*) as count FROM home_sampling_requests WHERE created_at >= ?", 
                [$last24h]
            )['count'],
            'pending_checkups' => $this->db->fetchOne(
                "SELECT COUNT(*) as count FROM checkup_requests WHERE status = 'pending'"
            )['count'],
            'pending_samplings' => $this->db->fetchOne(
                "SELECT COUNT(*) as count FROM home_sampling_requests WHERE status = 'pending'"
            )['count']
        ];
    }
    
    /**
     * آخرین درخواست‌ها
     */
    private function getRecentRequests(int $limit = 10): array {
        $checkupRequests = $this->db->fetchAll(
            "SELECT 'checkup' as type, id, title, patient_name, patient_phone, status, created_at 
             FROM checkup_requests 
             ORDER BY created_at DESC LIMIT ?",
            [$limit]
        );
        
        $samplingRequests = $this->db->fetchAll(
            "SELECT 'sampling' as type, id, title, patient_name, patient_phone, status, created_at 
             FROM home_sampling_requests 
             ORDER BY created_at DESC LIMIT ?",
            [$limit]
        );
        
        // ترکیب و مرتب‌سازی
        $allRequests = array_merge($checkupRequests, $samplingRequests);
        usort($allRequests, fn($a, $b) => strtotime($b['created_at']) - strtotime($a['created_at']));
        
        return array_slice($allRequests, 0, $limit);
    }
    
    /**
     * اقدامات در انتظار
     */
    private function getPendingActions(): array {
        return [
            'pending_checkups' => $this->db->fetchAll(
                "SELECT id, title, patient_name, created_at 
                 FROM checkup_requests 
                 WHERE status = 'pending' 
                 ORDER BY created_at ASC LIMIT 5"
            ),
            'pending_samplings' => $this->db->fetchAll(
                "SELECT id, title, patient_name, created_at 
                 FROM home_sampling_requests 
                 WHERE status = 'pending' 
                 ORDER BY created_at ASC LIMIT 5"
            ),
            'unread_contacts' => $this->db->fetchAll(
                "SELECT id, name, subject, created_at 
                 FROM contact_messages 
                 WHERE status = 'new' 
                 ORDER BY created_at DESC LIMIT 5"
            )
        ];
    }
    
    /**
     * آمار تفصیلی
     */
    private function getDetailedStats(): void {
        $period = $_GET['period'] ?? 'week'; // day, week, month, year
        $stats = [];
        
        switch ($period) {
            case 'day':
                $stats = $this->getDailyStats();
                break;
            case 'week':
                $stats = $this->getWeeklyStats();
                break;
            case 'month':
                $stats = $this->getMonthlyStats();
                break;
            case 'year':
                $stats = $this->getYearlyStats();
                break;
        }
        
        Response::success([
            'period' => $period,
            'stats' => $stats,
            'generated_at' => date('Y-m-d H:i:s')
        ]);
    }
    
    /**
     * آمار روزانه (7 روز گذشته)
     */
    private function getDailyStats(): array {
        $stats = [];
        
        for ($i = 6; $i >= 0; $i--) {
            $date = date('Y-m-d', strtotime("-$i days"));
            
            $stats[] = [
                'date' => $date,
                'persian_date' => $this->toPersianDate($date),
                'new_users' => $this->db->fetchOne(
                    "SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = ?",
                    [$date]
                )['count'],
                'checkup_requests' => $this->db->fetchOne(
                    "SELECT COUNT(*) as count FROM checkup_requests WHERE DATE(created_at) = ?",
                    [$date]
                )['count'],
                'sampling_requests' => $this->db->fetchOne(
                    "SELECT COUNT(*) as count FROM home_sampling_requests WHERE DATE(created_at) = ?",
                    [$date]
                )['count'],
                'revenue' => $this->calculateDailyRevenue($date)
            ];
        }
        
        return $stats;
    }
    
    /**
     * آمار هفتگی (4 هفته گذشته)
     */
    private function getWeeklyStats(): array {
        $stats = [];
        
        for ($i = 3; $i >= 0; $i--) {
            $startDate = date('Y-m-d', strtotime("-" . ($i + 1) . " week monday"));
            $endDate = date('Y-m-d', strtotime("-$i week sunday"));
            
            $stats[] = [
                'week_start' => $startDate,
                'week_end' => $endDate,
                'week_label' => "هفته " . ($i + 1),
                'new_users' => $this->db->fetchOne(
                    "SELECT COUNT(*) as count FROM users WHERE DATE(created_at) BETWEEN ? AND ?",
                    [$startDate, $endDate]
                )['count'],
                'total_requests' => $this->getWeeklyRequestCount($startDate, $endDate),
                'revenue' => $this->calculatePeriodRevenue($startDate, $endDate)
            ];
        }
        
        return $stats;
    }
    
    /**
     * فعالیت‌های اخیر
     */
    private function getRecentActivity(): void {
        $limit = (int) ($_GET['limit'] ?? 20);
        
        $activities = [];
        
        // کاربران جدید
        $newUsers = $this->db->fetchAll(
            "SELECT 'user_registered' as type, CONCAT(first_name, ' ', last_name) as title, 
                    phone as subtitle, created_at 
             FROM users 
             ORDER BY created_at DESC LIMIT ?",
            [$limit / 4]
        );
        
        // درخواست‌های جدید
        $newCheckups = $this->db->fetchAll(
            "SELECT 'checkup_request' as type, title, patient_name as subtitle, created_at 
             FROM checkup_requests 
             ORDER BY created_at DESC LIMIT ?",
            [$limit / 4]
        );
        
        $newSamplings = $this->db->fetchAll(
            "SELECT 'sampling_request' as type, title, patient_name as subtitle, created_at 
             FROM home_sampling_requests 
             ORDER BY created_at DESC LIMIT ?",
            [$limit / 4]
        );
        
        // ترکیب و مرتب‌سازی
        $activities = array_merge($newUsers, $newCheckups, $newSamplings);
        usort($activities, fn($a, $b) => strtotime($b['created_at']) - strtotime($a['created_at']));
        
        Response::success([
            'activities' => array_slice($activities, 0, $limit),
            'total' => count($activities)
        ]);
    }
    
    /**
     * وضعیت سلامت سیستم
     */
    private function getSystemHealth(): void {
        $health = [
            'database' => $this->checkDatabaseHealth(),
            'storage' => $this->checkStorageHealth(),
            'services' => $this->checkServicesHealth(),
            'performance' => $this->checkPerformanceHealth()
        ];
        
        $overallStatus = 'healthy';
        foreach ($health as $component) {
            if ($component['status'] === 'error') {
                $overallStatus = 'error';
                break;
            } elseif ($component['status'] === 'warning') {
                $overallStatus = 'warning';
            }
        }
        
        Response::success([
            'overall_status' => $overallStatus,
            'components' => $health,
            'checked_at' => date('Y-m-d H:i:s')
        ]);
    }
    
    /**
     * بررسی سلامت دیتابیس
     */
    private function checkDatabaseHealth(): array {
        try {
            $start = microtime(true);
            $this->db->getConnection()->query('SELECT 1');
            $responseTime = (microtime(true) - $start) * 1000;
            
            $tableCount = count($this->db->fetchAll("SHOW TABLES"));
            
            return [
                'status' => $responseTime < 100 ? 'healthy' : 'warning',
                'response_time_ms' => round($responseTime, 2),
                'table_count' => $tableCount,
                'message' => 'دیتابیس در وضعیت مطلوب'
            ];
            
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'خطا در اتصال به دیتابیس',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * بررسی فضای ذخیره‌سازی
     */
    private function checkStorageHealth(): array {
        $logFile = 'salamatlab.log'; // Relative path for cross-platform compatibility
        $logSize = file_exists($logFile) ? filesize($logFile) : 0;
        $logSizeMB = round($logSize / 1024 / 1024, 2);
        
        $status = 'healthy';
        if ($logSizeMB > 100) {
            $status = 'warning';
        } elseif ($logSizeMB > 500) {
            $status = 'error';
        }
        
        return [
            'status' => $status,
            'log_size_mb' => $logSizeMB,
            'message' => $status === 'healthy' ? 'فضای ذخیره‌سازی مناسب' : 'نیاز به پاک‌سازی لاگ‌ها'
        ];
    }
    
    /**
     * بررسی سرویس‌ها
     */
    private function checkServicesHealth(): array {
        $services = [];
        
        // بررسی SMS API
        $services['sms'] = $this->checkSmsService();
        
        // بررسی Email Service (اختیاری)
        $services['email'] = ['status' => 'healthy', 'message' => 'سرویس ایمیل فعال'];
        
        $overallStatus = 'healthy';
        foreach ($services as $service) {
            if ($service['status'] === 'error') {
                $overallStatus = 'error';
                break;
            } elseif ($service['status'] === 'warning') {
                $overallStatus = 'warning';
            }
        }
        
        return [
            'status' => $overallStatus,
            'services' => $services
        ];
    }
    
    /**
     * بررسی سرویس SMS
     */
    private function checkSmsService(): array {
        // تست ساده API SMS (بدون ارسال واقعی)
        try {
            $apiUrl = 'https://api.sms.ir/v1/send/verify';
            $headers = get_headers($apiUrl);
            
            if ($headers && str_contains($headers[0], '200')) {
                return [
                    'status' => 'healthy',
                    'message' => 'سرویس SMS در دسترس'
                ];
            } else {
                return [
                    'status' => 'warning',
                    'message' => 'سرویس SMS ممکن است مشکل داشته باشد'
                ];
            }
        } catch (Exception $e) {
            return [
                'status' => 'error',
                'message' => 'خطا در دسترسی به سرویس SMS'
            ];
        }
    }
    
    /**
     * بررسی عملکرد سیستم
     */
    private function checkPerformanceHealth(): array {
        $memoryUsage = memory_get_usage(true);
        $memoryUsageMB = round($memoryUsage / 1024 / 1024, 2);
        
        $executionTime = (microtime(true) - APP_START_TIME) * 1000;
        
        $status = 'healthy';
        if ($memoryUsageMB > 128 || $executionTime > 1000) {
            $status = 'warning';
        } elseif ($memoryUsageMB > 256 || $executionTime > 2000) {
            $status = 'error';
        }
        
        return [
            'status' => $status,
            'memory_usage_mb' => $memoryUsageMB,
            'execution_time_ms' => round($executionTime, 2),
            'message' => 'عملکرد سیستم مطلوب'
        ];
    }
    
    /**
     * محاسبه درآمد روزانه
     */
    private function calculateDailyRevenue(string $date): float {
        $checkupRevenue = $this->db->fetchOne(
            "SELECT COALESCE(SUM(final_price), 0) as revenue 
             FROM checkup_requests 
             WHERE DATE(created_at) = ? AND status = 'completed'",
            [$date]
        )['revenue'];
        
        $samplingRevenue = $this->db->fetchOne(
            "SELECT COALESCE(SUM(total_price), 0) as revenue 
             FROM home_sampling_requests 
             WHERE DATE(created_at) = ? AND status = 'completed'",
            [$date]
        )['revenue'];
        
        return (float) ($checkupRevenue + $samplingRevenue);
    }
    
    /**
     * محاسبه درآمد ماهانه
     */
    private function calculateMonthlyRevenue(string $month): float {
        $checkupRevenue = $this->db->fetchOne(
            "SELECT COALESCE(SUM(final_price), 0) as revenue 
             FROM checkup_requests 
             WHERE DATE_FORMAT(created_at, '%Y-%m') = ? AND status = 'completed'",
            [$month]
        )['revenue'];
        
        $samplingRevenue = $this->db->fetchOne(
            "SELECT COALESCE(SUM(total_price), 0) as revenue 
             FROM home_sampling_requests 
             WHERE DATE_FORMAT(created_at, '%Y-%m') = ? AND status = 'completed'",
            [$month]
        )['revenue'];
        
        return (float) ($checkupRevenue + $samplingRevenue);
    }
    
    /**
     * محاسبه کل درآمد
     */
    private function calculateTotalRevenue(): float {
        $checkupRevenue = $this->db->fetchOne(
            "SELECT COALESCE(SUM(final_price), 0) as revenue FROM checkup_requests WHERE status = 'completed'"
        )['revenue'];
        
        $samplingRevenue = $this->db->fetchOne(
            "SELECT COALESCE(SUM(total_price), 0) as revenue FROM home_sampling_requests WHERE status = 'completed'"
        )['revenue'];
        
        return (float) ($checkupRevenue + $samplingRevenue);
    }
    
    /**
     * تعداد درخواست‌های هفتگی
     */
    private function getWeeklyRequestCount(string $startDate, string $endDate): int {
        $checkupCount = $this->db->fetchOne(
            "SELECT COUNT(*) as count FROM checkup_requests WHERE DATE(created_at) BETWEEN ? AND ?",
            [$startDate, $endDate]
        )['count'];
        
        $samplingCount = $this->db->fetchOne(
            "SELECT COUNT(*) as count FROM home_sampling_requests WHERE DATE(created_at) BETWEEN ? AND ?",
            [$startDate, $endDate]
        )['count'];
        
        return $checkupCount + $samplingCount;
    }
    
    /**
     * محاسبه درآمد دوره‌ای
     */
    private function calculatePeriodRevenue(string $startDate, string $endDate): float {
        $checkupRevenue = $this->db->fetchOne(
            "SELECT COALESCE(SUM(final_price), 0) as revenue 
             FROM checkup_requests 
             WHERE DATE(created_at) BETWEEN ? AND ? AND status = 'completed'",
            [$startDate, $endDate]
        )['revenue'];
        
        $samplingRevenue = $this->db->fetchOne(
            "SELECT COALESCE(SUM(total_price), 0) as revenue 
             FROM home_sampling_requests 
             WHERE DATE(created_at) BETWEEN ? AND ? AND status = 'completed'",
            [$startDate, $endDate]
        )['revenue'];
        
        return (float) ($checkupRevenue + $samplingRevenue);
    }
    
    /**
     * تبدیل تاریخ میلادی به شمسی (ساده)
     */
    private function toPersianDate(string $date): string {
        // پیاده‌سازی ساده - می‌توان از کتابخانه استفاده کرد
        $months = [
            'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
            'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
        ];
        
        $timestamp = strtotime($date);
        $jDate = jdate('Y/m/d', $timestamp);
        
        return $jDate;
    }
}

try {
    $dashboard = new AdminDashboard();
    $dashboard->handleRequest();
} catch (Exception $e) {
    Logger::critical('Admin dashboard fatal error', ['error' => $e->getMessage()]);
    Response::serverError();
}
?>
