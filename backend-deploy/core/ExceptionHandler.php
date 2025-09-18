<?php
/**
 * Exception Handler - مدیریت یکپارچه خطاها
 * Unified Error Handling System
 */

class ExceptionHandler {
    private static $instance = null;
    private $env;
    private $errorTypes = [
        E_ERROR => 'FATAL_ERROR',
        E_WARNING => 'WARNING',
        E_PARSE => 'PARSE_ERROR',
        E_NOTICE => 'NOTICE',
        E_CORE_ERROR => 'CORE_ERROR',
        E_CORE_WARNING => 'CORE_WARNING',
        E_COMPILE_ERROR => 'COMPILE_ERROR',
        E_COMPILE_WARNING => 'COMPILE_WARNING',
        E_USER_ERROR => 'USER_ERROR',
        E_USER_WARNING => 'USER_WARNING',
        E_USER_NOTICE => 'USER_NOTICE',
        E_STRICT => 'STRICT',
        E_RECOVERABLE_ERROR => 'RECOVERABLE_ERROR',
        E_DEPRECATED => 'DEPRECATED',
        E_USER_DEPRECATED => 'USER_DEPRECATED'
    ];
    
    private function __construct() {
        $this->env = Environment::getInstance();
        $this->setupHandlers();
    }
    
    public static function getInstance(): ExceptionHandler {
        if (self::$instance === null) {
            self::$instance = new ExceptionHandler();
        }
        return self::$instance;
    }
    
    /**
     * تنظیم handler ها
     */
    private function setupHandlers(): void {
        // تنظیم exception handler
        set_exception_handler([$this, 'handleException']);
        
        // تنظیم error handler
        set_error_handler([$this, 'handleError']);
        
        // تنظیم shutdown function
        register_shutdown_function([$this, 'handleShutdown']);
        
        // تنظیم نمایش خطاها
        ini_set('display_errors', $this->env->isDebug() ? '1' : '0');
        ini_set('log_errors', '1');
        
        // سطح گزارش خطا
        if ($this->env->isProduction()) {
            error_reporting(E_ERROR | E_WARNING | E_PARSE);
        } else {
            error_reporting(E_ALL & ~E_DEPRECATED & ~E_STRICT);
        }
    }
    
    /**
     * مدیریت Exception ها
     */
    public function handleException(Throwable $exception): void {
        $errorData = [
            'type' => 'EXCEPTION',
            'class' => get_class($exception),
            'message' => $exception->getMessage(),
            'file' => $exception->getFile(),
            'line' => $exception->getLine(),
            'trace' => $exception->getTraceAsString(),
            'code' => $exception->getCode(),
            'timestamp' => date('c'),
            'request_uri' => $_SERVER['REQUEST_URI'] ?? '',
            'method' => $_SERVER['REQUEST_METHOD'] ?? '',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? '',
            'ip' => $this->getClientIP()
        ];
        
        // لاگ کردن خطا
        Logger::error('Uncaught Exception', $errorData);
        
        // ارسال پاسخ مناسب
        $this->sendErrorResponse($exception);
    }
    
    /**
     * مدیریت Error های PHP
     */
    public function handleError(int $severity, string $message, string $file, int $line): bool {
        // اگر error_reporting غیرفعال باشد، نادیده بگیر
        if (!(error_reporting() & $severity)) {
            return false;
        }
        
        $errorData = [
            'type' => 'PHP_ERROR',
            'severity' => $this->errorTypes[$severity] ?? 'UNKNOWN',
            'message' => $message,
            'file' => $file,
            'line' => $line,
            'timestamp' => date('c'),
            'request_uri' => $_SERVER['REQUEST_URI'] ?? '',
            'method' => $_SERVER['REQUEST_METHOD'] ?? '',
            'ip' => $this->getClientIP()
        ];
        
        // لاگ کردن خطا
        $logLevel = $this->getLogLevelForSeverity($severity);
        Logger::log($logLevel, 'PHP Error', $errorData);
        
        // در صورت خطای شدید، exception پرتاب کن
        if (in_array($severity, [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_USER_ERROR])) {
            throw new ErrorException($message, 0, $severity, $file, $line);
        }
        
        return true;
    }
    
    /**
     * مدیریت Shutdown
     */
    public function handleShutdown(): void {
        $error = error_get_last();
        
        if ($error && in_array($error['type'], [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_PARSE])) {
            $errorData = [
                'type' => 'FATAL_ERROR',
                'severity' => $this->errorTypes[$error['type']] ?? 'UNKNOWN',
                'message' => $error['message'],
                'file' => $error['file'],
                'line' => $error['line'],
                'timestamp' => date('c')
            ];
            
            Logger::critical('Fatal Error', $errorData);
            
            // اگر هنوز header ارسال نشده، پاسخ خطا بفرست
            if (!headers_sent()) {
                $this->sendFatalErrorResponse($error);
            }
        }
    }
    
    /**
     * ارسال پاسخ خطا
     */
    private function sendErrorResponse(Throwable $exception): void {
        if (headers_sent()) {
            return;
        }
        
        http_response_code($this->getHttpCodeForException($exception));
        header('Content-Type: application/json; charset=UTF-8');
        
        if ($this->env->isDebug()) {
            // در حالت debug، اطلاعات کامل بفرست
            $response = [
                'success' => false,
                'error' => $exception->getMessage(),
                'debug' => [
                    'type' => get_class($exception),
                    'file' => $exception->getFile(),
                    'line' => $exception->getLine(),
                    'trace' => explode("\n", $exception->getTraceAsString())
                ],
                'timestamp' => date('c')
            ];
        } else {
            // در production، پیام عمومی بفرست
            $response = [
                'success' => false,
                'error' => $this->getPublicErrorMessage($exception),
                'timestamp' => date('c')
            ];
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    /**
     * ارسال پاسخ خطای فتال
     */
    private function sendFatalErrorResponse(array $error): void {
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
        
        if ($this->env->isDebug()) {
            $response = [
                'success' => false,
                'error' => 'Fatal Error: ' . $error['message'],
                'debug' => [
                    'file' => $error['file'],
                    'line' => $error['line']
                ],
                'timestamp' => date('c')
            ];
        } else {
            $response = [
                'success' => false,
                'error' => 'یک خطای داخلی رخ داده است',
                'timestamp' => date('c')
            ];
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit();
    }
    
    /**
     * تعیین HTTP code برای Exception
     */
    private function getHttpCodeForException(Throwable $exception): int {
        switch (get_class($exception)) {
            case 'InvalidArgumentException':
                return 400;
            case 'UnauthorizedException':
                return 401;
            case 'ForbiddenException':
                return 403;
            case 'NotFoundException':
                return 404;
            case 'MethodNotAllowedException':
                return 405;
            case 'ValidationException':
                return 422;
            case 'RateLimitException':
                return 429;
            default:
                return $exception->getCode() ?: 500;
        }
    }
    
    /**
     * تعیین پیام عمومی خطا
     */
    private function getPublicErrorMessage(Throwable $exception): string {
        switch (get_class($exception)) {
            case 'InvalidArgumentException':
                return 'پارامترهای ارسالی نامعتبر است';
            case 'UnauthorizedException':
                return 'احراز هویت مورد نیاز است';
            case 'ForbiddenException':
                return 'دسترسی مجاز نیست';
            case 'NotFoundException':
                return 'منبع مورد نظر یافت نشد';
            case 'MethodNotAllowedException':
                return 'روش درخواست مجاز نیست';
            case 'ValidationException':
                return 'اطلاعات وارد شده نامعتبر است';
            case 'RateLimitException':
                return 'تعداد درخواست‌ها بیش از حد مجاز است';
            case 'PDOException':
                return 'خطا در پایگاه داده';
            default:
                return 'یک خطای داخلی رخ داده است';
        }
    }
    
    /**
     * تعیین سطح لاگ برای خطا
     */
    private function getLogLevelForSeverity(int $severity): string {
        switch ($severity) {
            case E_ERROR:
            case E_CORE_ERROR:
            case E_COMPILE_ERROR:
            case E_USER_ERROR:
                return 'error';
            case E_WARNING:
            case E_CORE_WARNING:
            case E_COMPILE_WARNING:
            case E_USER_WARNING:
                return 'warning';
            case E_NOTICE:
            case E_USER_NOTICE:
                return 'notice';
            case E_DEPRECATED:
            case E_USER_DEPRECATED:
                return 'warning';
            default:
                return 'info';
        }
    }
    
    /**
     * دریافت IP کلاینت
     */
    private function getClientIP(): string {
        $ipKeys = ['HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'HTTP_CLIENT_IP', 'REMOTE_ADDR'];
        
        foreach ($ipKeys as $key) {
            if (!empty($_SERVER[$key])) {
                $ip = $_SERVER[$key];
                if (strpos($ip, ',') !== false) {
                    $ip = trim(explode(',', $ip)[0]);
                }
                return $ip;
            }
        }
        
        return 'unknown';
    }
    
    /**
     * ایجاد Custom Exception
     */
    public static function createException(string $type, string $message, int $code = 0): Exception {
        switch ($type) {
            case 'validation':
                return new ValidationException($message, $code);
            case 'unauthorized':
                return new UnauthorizedException($message, $code);
            case 'forbidden':
                return new ForbiddenException($message, $code);
            case 'not_found':
                return new NotFoundException($message, $code);
            case 'rate_limit':
                return new RateLimitException($message, $code);
            default:
                return new Exception($message, $code);
        }
    }
}

/**
 * Custom Exception Classes
 */
class ValidationException extends Exception {}
class UnauthorizedException extends Exception {}
class ForbiddenException extends Exception {}
class NotFoundException extends Exception {}
class MethodNotAllowedException extends Exception {}
class RateLimitException extends Exception {}
?>
