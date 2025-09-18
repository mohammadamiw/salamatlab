<?php
/**
 * Logging System
 * سیستم لاگ‌گذاری برای آزمایشگاه سلامت
 */

class Logger {
    private static $logFile = 'salamatlab.log'; // Relative path for cross-platform compatibility
    private static $enabled = true;
    private static $minLevel = 'debug';
    
    private static $levels = [
        'debug' => 0,
        'info' => 1,
        'warning' => 2,
        'error' => 3,
        'critical' => 4
    ];
    
    /**
     * تنظیم فایل لاگ
     */
    public static function setLogFile(string $file): void {
        self::$logFile = $file;
    }
    
    /**
     * فعال/غیرفعال کردن لاگ
     */
    public static function setEnabled(bool $enabled): void {
        self::$enabled = $enabled;
    }
    
    /**
     * تنظیم حداقل سطح لاگ
     */
    public static function setMinLevel(string $level): void {
        if (isset(self::$levels[$level])) {
            self::$minLevel = $level;
        }
    }
    
    /**
     * لاگ Debug
     */
    public static function debug(string $message, array $context = []): void {
        self::log('debug', $message, $context);
    }
    
    /**
     * لاگ Info
     */
    public static function info(string $message, array $context = []): void {
        self::log('info', $message, $context);
    }
    
    /**
     * لاگ Warning
     */
    public static function warning(string $message, array $context = []): void {
        self::log('warning', $message, $context);
    }
    
    /**
     * لاگ Error
     */
    public static function error(string $message, array $context = []): void {
        self::log('error', $message, $context);
    }
    
    /**
     * لاگ Critical
     */
    public static function critical(string $message, array $context = []): void {
        self::log('critical', $message, $context);
    }
    
    /**
     * لاگ اصلی
     */
    private static function log(string $level, string $message, array $context = []): void {
        if (!self::$enabled || self::$levels[$level] < self::$levels[self::$minLevel]) {
            return;
        }
        
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'level' => strtoupper($level),
            'message' => $message,
            'context' => $context,
            'request' => [
                'method' => $_SERVER['REQUEST_METHOD'] ?? 'CLI',
                'uri' => $_SERVER['REQUEST_URI'] ?? '',
                'ip' => self::getClientIP(),
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
            ],
            'memory' => self::formatBytes(memory_get_usage(true)),
            'execution_time' => self::getExecutionTime()
        ];
        
        $logLine = json_encode($logEntry, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
        
        // نوشتن در فایل
        file_put_contents(self::$logFile, $logLine, FILE_APPEND | LOCK_EX);
        
        // در محیط development، نمایش در console نیز
        if (defined('ENVIRONMENT') && ENVIRONMENT === 'development') {
            error_log("[$level] $message " . json_encode($context, JSON_UNESCAPED_UNICODE));
        }
        
        // در صورت خطای critical، ارسال ایمیل اضطراری (اختیاری)
        if ($level === 'critical') {
            self::sendCriticalAlert($message, $context);
        }
    }
    
    /**
     * دریافت IP کلاینت
     */
    private static function getClientIP(): string {
        $headers = [
            'HTTP_X_FORWARDED_FOR',
            'HTTP_X_REAL_IP',
            'HTTP_CLIENT_IP',
            'REMOTE_ADDR'
        ];
        
        foreach ($headers as $header) {
            if (!empty($_SERVER[$header])) {
                $ips = explode(',', $_SERVER[$header]);
                return trim($ips[0]);
            }
        }
        
        return 'unknown';
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
     * فرمت کردن حجم حافظه
     */
    private static function formatBytes(int $bytes): string {
        $units = ['B', 'KB', 'MB', 'GB'];
        $factor = floor(log($bytes, 1024));
        return sprintf('%.2f %s', $bytes / (1024 ** $factor), $units[$factor]);
    }
    
    /**
     * ارسال هشدار Critical (اختیاری)
     */
    private static function sendCriticalAlert(string $message, array $context): void {
        // TODO: پیاده‌سازی ارسال ایمیل یا SMS هشدار
        // در صورت نیاز می‌توان اینجا سیستم اعلان اضطراری پیاده‌سازی کرد
    }
    
    /**
     * پاک کردن لاگ‌های قدیمی
     */
    public static function cleanOldLogs(int $daysToKeep = 30): void {
        $logDir = dirname(self::$logFile);
        $cutoffTime = time() - ($daysToKeep * 24 * 60 * 60);
        
        $files = glob($logDir . '/salamatlab*.log');
        foreach ($files as $file) {
            if (filemtime($file) < $cutoffTime) {
                unlink($file);
            }
        }
        
        self::info('Old log files cleaned', ['days_kept' => $daysToKeep]);
    }
    
    /**
     * دریافت آخرین لاگ‌ها
     */
    public static function getRecentLogs(int $lines = 100): array {
        if (!file_exists(self::$logFile)) {
            return [];
        }
        
        $command = "tail -n $lines " . escapeshellarg(self::$logFile);
        $output = shell_exec($command);
        
        if (!$output) {
            return [];
        }
        
        $logs = [];
        $logLines = array_filter(explode("\n", $output));
        
        foreach ($logLines as $line) {
            $decoded = json_decode($line, true);
            if ($decoded) {
                $logs[] = $decoded;
            }
        }
        
        return array_reverse($logs); // جدیدترین اول
    }
    
    /**
     * جستجو در لاگ‌ها
     */
    public static function searchLogs(string $query, int $limit = 50): array {
        if (!file_exists(self::$logFile)) {
            return [];
        }
        
        $command = sprintf(
            "grep -i %s %s | tail -n %d",
            escapeshellarg($query),
            escapeshellarg(self::$logFile),
            $limit
        );
        
        $output = shell_exec($command);
        
        if (!$output) {
            return [];
        }
        
        $logs = [];
        $logLines = array_filter(explode("\n", $output));
        
        foreach ($logLines as $line) {
            $decoded = json_decode($line, true);
            if ($decoded) {
                $logs[] = $decoded;
            }
        }
        
        return array_reverse($logs);
    }
    
    /**
     * آمار لاگ‌ها
     */
    public static function getLogStats(): array {
        if (!file_exists(self::$logFile)) {
            return [
                'total_lines' => 0,
                'file_size' => 0,
                'levels' => []
            ];
        }
        
        $stats = [
            'total_lines' => 0,
            'file_size' => filesize(self::$logFile),
            'levels' => array_fill_keys(array_keys(self::$levels), 0),
            'last_modified' => date('Y-m-d H:i:s', filemtime(self::$logFile))
        ];
        
        // شمارش تعداد خطوط و سطوح
        $handle = fopen(self::$logFile, 'r');
        if ($handle) {
            while (($line = fgets($handle)) !== false) {
                $stats['total_lines']++;
                
                $decoded = json_decode($line, true);
                if ($decoded && isset($decoded['level'])) {
                    $level = strtolower($decoded['level']);
                    if (isset($stats['levels'][$level])) {
                        $stats['levels'][$level]++;
                    }
                }
            }
            fclose($handle);
        }
        
        return $stats;
    }
}
?>
