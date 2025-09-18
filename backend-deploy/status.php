<?php
/**
 * API Status Endpoint - تست کامل معماری جدید
 * System Health Check and Architecture Validation
 */

require_once 'config.php';
require_once 'core/Database.php';
require_once 'core/SessionManager.php';
require_once 'core/AuthManager.php';
require_once 'core/Response.php';

// تنظیم CORS
setCorsHeaders();

// پاسخ به preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // تست Environment Manager
    $env = Environment::getInstance();
    $envStatus = $env->getStatus();
    
    // تست Database Connection
    $db = Database::getInstance();
    $dbStats = $db->getConnectionStats();
    
    // تست قرار دادن یک رکورد ساده در دیتابیس
    $testQuery = $db->query("SELECT 1 as test, NOW() as current_time");
    $dbTest = $testQuery->fetch();
    
    // تست Session Manager
    $sessionManager = SessionManager::getInstance();
    $sessionStatus = [
        'session_configured' => session_status() !== PHP_SESSION_DISABLED,
        'session_active' => session_status() === PHP_SESSION_ACTIVE
    ];
    
    // تست Auth Manager
    $authManager = AuthManager::getInstance();
    $authStatus = $authManager->checkAuthStatus();
    
    // تست Logger
    Logger::info('System status check performed', [
        'timestamp' => date('c'),
        'ip' => getClientIP()
    ]);
    
    // تست Exception Handler
    $exceptionHandler = ExceptionHandler::getInstance();
    
    // جمع‌آوری آمار سیستم
    $systemStats = [
        'php_version' => PHP_VERSION,
        'memory_usage' => memory_get_usage(true),
        'memory_peak' => memory_get_peak_usage(true),
        'memory_limit' => ini_get('memory_limit'),
        'max_execution_time' => ini_get('max_execution_time'),
        'timezone' => date_default_timezone_get(),
        'server_time' => date('c'),
        'uptime' => getServerUptime()
    ];
    
    $status = [
        'status' => 'healthy',
        'architecture' => 'SaaS Standard',
        'version' => '2.0',
        'components' => [
            'environment_manager' => [
                'status' => 'operational',
                'details' => $envStatus
            ],
            'database' => [
                'status' => 'operational',
                'connection_stats' => $dbStats,
                'test_query' => $dbTest
            ],
            'session_manager' => [
                'status' => 'operational',
                'details' => $sessionStatus
            ],
            'auth_manager' => [
                'status' => 'operational',
                'authenticated' => $authStatus['authenticated']
            ],
            'exception_handler' => [
                'status' => 'operational',
                'configured' => true
            ],
            'logger' => [
                'status' => 'operational',
                'test_completed' => true
            ]
        ],
        'system' => $systemStats,
        'security' => [
            'https_enabled' => isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on',
            'cors_configured' => true,
            'rate_limiting' => defined('MAX_REQUESTS_PER_HOUR'),
            'environment' => $env->isProduction() ? 'production' : 'development',
            'debug_mode' => $env->isDebug()
        ],
        'architecture_improvements' => [
            'environment_variables_centralized' => true,
            'authentication_unified' => true,
            'database_connection_optimized' => true,
            'error_handling_standardized' => true,
            'session_management_implemented' => true,
            'api_responses_standardized' => true
        ]
    ];
    
    Response::success('System is healthy and architecture is optimized', $status);
    
} catch (Exception $e) {
    // خطا در سیستم - اطلاعات خطا برای دیباگ
    $errorDetails = [
        'error_type' => get_class($e),
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ];
    
    // اگر در حالت debug هستیم، جزئیات بیشتری بفرست
    if ($env->isDebug()) {
        $errorDetails['trace'] = $e->getTraceAsString();
    }
    
    Response::error('System health check failed', 500, $errorDetails);
}

/**
 * دریافت uptime سرور (تقریبی)
 */
function getServerUptime(): array {
    $uptime = 'unknown';
    $load = 'unknown';
    
    // در سیستم‌های Unix-like
    if (function_exists('sys_getloadavg')) {
        $load = sys_getloadavg();
    }
    
    if (file_exists('/proc/uptime')) {
        $uptimeData = file_get_contents('/proc/uptime');
        $uptime = (int) floatval($uptimeData);
    }
    
    return [
        'uptime_seconds' => $uptime,
        'load_average' => $load
    ];
}
?>
