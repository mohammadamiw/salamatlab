<?php
/**
 * Standardized API Response Handler
 * پاسخ‌دهی استاندارد برای API ها
 */

class Response {
    
    /**
     * ارسال پاسخ موفق
     */
    public static function success(string $message = 'Success', array $data = [], int $code = 200): void {
        http_response_code($code);
        
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('c'),
            'request_id' => self::generateRequestId()
        ];
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit();
    }
    
    /**
     * ارسال پاسخ خطا
     */
    public static function error(string $message = 'Error', int $code = 400, array $details = []): void {
        http_response_code($code);
        
        $response = [
            'success' => false,
            'error' => $message,
            'code' => $code,
            'timestamp' => date('c'),
            'request_id' => self::generateRequestId()
        ];
        
        if (!empty($details)) {
            $response['details'] = $details;
        }
        
        // Log error if serious
        if ($code >= 500) {
            if (class_exists('Logger')) {
                Logger::error('API Error Response', [
                    'message' => $message,
                    'code' => $code,
                    'details' => $details,
                    'request_uri' => $_SERVER['REQUEST_URI'] ?? '',
                    'method' => $_SERVER['REQUEST_METHOD'] ?? ''
                ]);
            }
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit();
    }
    
    /**
     * ارسال پاسخ داده خام
     */
    public static function json(array $data, int $code = 200): void {
        http_response_code($code);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        exit();
    }
    
    /**
     * تولید شناسه منحصر به فرد برای درخواست
     */
    private static function generateRequestId(): string {
        return substr(md5(uniqid() . microtime()), 0, 8);
    }
    
    /**
     * اعتبارسنجی Content-Type
     */
    public static function validateContentType(string $expectedType = 'application/json'): bool {
        $contentType = $_SERVER['CONTENT_TYPE'] ?? '';
        return strpos($contentType, $expectedType) !== false;
    }
    
    /**
     * دریافت و اعتبارسنجی JSON input
     */
    public static function getJsonInput(): array {
        if (!self::validateContentType()) {
            self::error('Content-Type must be application/json', 415);
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            self::error('Invalid JSON format: ' . json_last_error_msg(), 400);
        }
        
        return $input ?: [];
    }
}
?>