<?php
/**
 * API Response Handler
 * مدیریت پاسخ‌های API
 */

class Response {
    private static $corsHeaders = [
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
        'Access-Control-Max-Age' => '86400',
        'Content-Type' => 'application/json; charset=UTF-8'
    ];
    
    /**
     * تنظیم CORS headers
     */
    public static function setCorsHeaders(): void {
        foreach (self::$corsHeaders as $header => $value) {
            header("$header: $value");
        }
    }
    
    /**
     * پاسخ موفقیت‌آمیز
     */
    public static function success($data = null, string $message = null, int $httpCode = 200): void {
        self::setCorsHeaders();
        http_response_code($httpCode);
        
        $response = [
            'success' => true,
            'timestamp' => date('Y-m-d H:i:s'),
            'execution_time' => self::getExecutionTime()
        ];
        
        if ($message) {
            $response['message'] = $message;
        }
        
        if ($data !== null) {
            $response['data'] = $data;
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    /**
     * پاسخ خطا
     */
    public static function error(string $message, int $httpCode = 400, $details = null): void {
        self::setCorsHeaders();
        http_response_code($httpCode);
        
        $response = [
            'success' => false,
            'error' => $message,
            'timestamp' => date('Y-m-d H:i:s'),
            'execution_time' => self::getExecutionTime()
        ];
        
        if ($details && (defined('ENVIRONMENT') && ENVIRONMENT === 'development')) {
            $response['details'] = $details;
        }
        
        // لاگ خطا
        Logger::error('API Error Response', [
            'message' => $message,
            'http_code' => $httpCode,
            'details' => $details,
            'request_uri' => $_SERVER['REQUEST_URI'] ?? '',
            'request_method' => $_SERVER['REQUEST_METHOD'] ?? ''
        ]);
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    /**
     * پاسخ اعتبارسنجی
     */
    public static function validationError(array $errors): void {
        self::error('خطای اعتبارسنجی', 422, ['validation_errors' => $errors]);
    }
    
    /**
     * پاسخ عدم دسترسی
     */
    public static function unauthorized(string $message = 'دسترسی غیرمجاز'): void {
        self::error($message, 401);
    }
    
    /**
     * پاسخ عدم وجود منبع
     */
    public static function notFound(string $message = 'منبع یافت نشد'): void {
        self::error($message, 404);
    }
    
    /**
     * پاسخ خطای سرور
     */
    public static function serverError(string $message = 'خطای داخلی سرور'): void {
        self::error($message, 500);
    }
    
    /**
     * پاسخ محدودیت نرخ درخواست
     */
    public static function rateLimitExceeded(string $message = 'تعداد درخواست‌ها بیش از حد مجاز'): void {
        self::error($message, 429);
    }
    
    /**
     * پاسخ پیجینیشن
     */
    public static function paginated(array $data, int $page, int $perPage, int $total): void {
        $totalPages = ceil($total / $perPage);
        
        self::success([
            'items' => $data,
            'pagination' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total_items' => $total,
                'total_pages' => $totalPages,
                'has_next' => $page < $totalPages,
                'has_previous' => $page > 1,
                'next_page' => $page < $totalPages ? $page + 1 : null,
                'previous_page' => $page > 1 ? $page - 1 : null
            ]
        ]);
    }
    
    /**
     * پاسخ فایل (دانلود)
     */
    public static function file(string $filePath, string $fileName = null, string $contentType = null): void {
        if (!file_exists($filePath)) {
            self::notFound('فایل یافت نشد');
        }
        
        $fileName = $fileName ?: basename($filePath);
        $contentType = $contentType ?: mime_content_type($filePath) ?: 'application/octet-stream';
        
        header('Content-Type: ' . $contentType);
        header('Content-Disposition: attachment; filename="' . $fileName . '"');
        header('Content-Length: ' . filesize($filePath));
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        
        readfile($filePath);
        exit;
    }
    
    /**
     * پاسخ JSON خام
     */
    public static function json($data, int $httpCode = 200): void {
        self::setCorsHeaders();
        http_response_code($httpCode);
        
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit;
    }
    
    /**
     * پاسخ متنی
     */
    public static function text(string $text, int $httpCode = 200): void {
        header('Content-Type: text/plain; charset=UTF-8');
        http_response_code($httpCode);
        
        echo $text;
        exit;
    }
    
    /**
     * پاسخ HTML
     */
    public static function html(string $html, int $httpCode = 200): void {
        header('Content-Type: text/html; charset=UTF-8');
        http_response_code($httpCode);
        
        echo $html;
        exit;
    }
    
    /**
     * پردازش درخواست OPTIONS
     */
    public static function handleOptions(): void {
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            self::setCorsHeaders();
            http_response_code(200);
            exit;
        }
    }
    
    /**
     * محاسبه زمان اجرا
     */
    private static function getExecutionTime(): string {
        if (!defined('APP_START_TIME')) {
            return 'unknown';
        }
        
        $executionTime = microtime(true) - APP_START_TIME;
        return number_format($executionTime * 1000, 2) . 'ms';
    }
    
    /**
     * تنظیم Cache headers
     */
    public static function setCacheHeaders(int $maxAge = 3600): void {
        header('Cache-Control: public, max-age=' . $maxAge);
        header('Expires: ' . gmdate('D, d M Y H:i:s', time() + $maxAge) . ' GMT');
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s', time()) . ' GMT');
    }
    
    /**
     * تنظیم No-Cache headers
     */
    public static function setNoCacheHeaders(): void {
        header('Cache-Control: no-cache, no-store, must-revalidate');
        header('Pragma: no-cache');
        header('Expires: 0');
    }
}
?>
