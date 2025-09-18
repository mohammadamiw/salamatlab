<?php
/**
 * Database Connection Manager
 * مدیریت اتصال به دیتابیس MySQL لیارا
 */

require_once __DIR__ . '/Environment.php';

class Database {
    private static $instance = null;
    private $connection;
    private $config;
    private $connectionPool = [];
    private $maxConnections = 10;
    private $activeConnections = 0;
    private $connectionTimeout = 30;
    private $lastPing = 0;
    private $pingInterval = 300; // 5 minutes
    
    private function __construct() {
        $this->loadConfig();
        $this->maxConnections = (int) ($_ENV['DB_MAX_CONNECTIONS'] ?? getenv('DB_MAX_CONNECTIONS') ?? 10);
        $this->connectionTimeout = (int) ($_ENV['DB_TIMEOUT'] ?? getenv('DB_TIMEOUT') ?? 30);
        $this->connect();
    }
    
    /**
     * بارگذاری تنظیمات از متغیرهای محیطی
     */
    private function loadConfig(): void {
        // Load configuration via Environment manager to ensure .env support
        $env = Environment::getInstance();
        $db = $env->getDatabaseConfig();

        $this->config = [
            'host' => $db['host'] ?? 'localhost',
            'dbname' => $db['dbname'] ?? '',
            'username' => $db['username'] ?? '',
            'password' => $db['password'] ?? '',
            'charset' => $db['charset'] ?? 'utf8mb4',
            'port' => (int)($db['port'] ?? 3306)
        ];

        // Validate required
        if (empty($this->config['dbname']) || empty($this->config['username'])) {
            throw new Exception('Database configuration is missing. Please set DB_NAME and DB_USER via environment variables.');
        }
    }
    
    /**
     * Singleton pattern - یک نمونه از دیتابیس
     */
    public static function getInstance(): Database {
        if (self::$instance === null) {
            self::$instance = new Database();
        }
        return self::$instance;
    }
    
    /**
     * اتصال به دیتابیس با Connection Pooling
     */
    private function connect(): void {
        try {
            $this->connection = $this->createNewConnection();
            $this->activeConnections++;
            
            Logger::info('Database connection established successfully', [
                'active_connections' => $this->activeConnections,
                'max_connections' => $this->maxConnections
            ]);
            
        } catch (PDOException $e) {
            Logger::error('Database connection failed', [
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            throw new Exception('خطا در اتصال به پایگاه داده');
        }
    }
    
    /**
     * ایجاد اتصال جدید
     */
    private function createNewConnection(): PDO {
        $dsn = sprintf(
            "mysql:host=%s;port=%d;dbname=%s;charset=%s",
            $this->config['host'],
            $this->config['port'],
            $this->config['dbname'],
            $this->config['charset']
        );
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . $this->config['charset'] . " COLLATE utf8mb4_unicode_ci",
            PDO::ATTR_TIMEOUT => $this->connectionTimeout,
            PDO::ATTR_PERSISTENT => false,
            PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true,
            PDO::MYSQL_ATTR_COMPRESS => true
        ];
        
        $connection = new PDO(
            $dsn,
            $this->config['username'],
            $this->config['password'],
            $options
        );
        
        // تنظیمات اضافی برای بهینه‌سازی
        $connection->exec("SET time_zone = '+03:30'");
        $connection->exec("SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO'");
        $connection->exec("SET SESSION transaction_isolation = 'READ-COMMITTED'");
        
        return $connection;
    }
    
    /**
     * دریافت اتصال PDO
     */
    public function getConnection(): PDO {
        // انجام ping به صورت دوره‌ای
        $this->pingConnections();
        
        if ($this->connection === null) {
            $this->connect();
        }
        
        // تست اتصال اصلی
        if (!$this->isConnectionAlive($this->connection)) {
            Logger::warning('Main connection lost, reconnecting...');
            $this->connect();
        }
        
        return $this->connection;
    }
    
    /**
     * بررسی زنده بودن اتصال
     */
    private function isConnectionAlive(PDO $connection): bool {
        try {
            $connection->query('SELECT 1');
            return true;
        } catch (PDOException $e) {
            return false;
        }
    }
    
    /**
     * Ping اتصال‌ها برای حفظ زنده ماندن
     */
    private function pingConnections(): void {
        $now = time();
        
        if ($now - $this->lastPing < $this->pingInterval) {
            return;
        }
        
        $this->lastPing = $now;
        
        Logger::debug('Connection ping completed', [
            'active_connections' => $this->activeConnections
        ]);
    }
    
    /**
     * دریافت آمار اتصالات
     */
    public function getConnectionStats(): array {
        return [
            'active_connections' => $this->activeConnections,
            'max_connections' => $this->maxConnections,
            'last_ping' => $this->lastPing,
            'connection_timeout' => $this->connectionTimeout
        ];
    }
    
    /**
     * اجرای query ساده
     */
    public function query(string $sql, array $params = []): PDOStatement {
        try {
            $stmt = $this->getConnection()->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            Logger::error('Database query failed', [
                'sql' => $sql,
                'params' => $params,
                'error' => $e->getMessage()
            ]);
            throw new Exception('خطا در اجرای عملیات دیتابیس');
        }
    }
    
    /**
     * دریافت یک رکورد
     */
    public function fetchOne(string $sql, array $params = []): ?array {
        $stmt = $this->query($sql, $params);
        $result = $stmt->fetch();
        return $result ?: null;
    }
    
    /**
     * دریافت چندین رکورد
     */
    public function fetchAll(string $sql, array $params = []): array {
        $stmt = $this->query($sql, $params);
        return $stmt->fetchAll();
    }
    
    /**
     * اجرای INSERT و برگرداندن ID
     */
    public function insert(string $table, array $data): int {
        $fields = array_keys($data);
        $placeholders = array_map(fn($field) => ":$field", $fields);
        
        $sql = sprintf(
            "INSERT INTO %s (%s) VALUES (%s)",
            $table,
            implode(', ', $fields),
            implode(', ', $placeholders)
        );
        
        $this->query($sql, $data);
        return (int) $this->getConnection()->lastInsertId();
    }
    
    /**
     * اجرای UPDATE
     */
    public function update(string $table, array $data, array $where): int {
        $setClause = implode(', ', array_map(fn($field) => "$field = :$field", array_keys($data)));
        $whereClause = implode(' AND ', array_map(fn($field) => "$field = :where_$field", array_keys($where)));
        
        $sql = "UPDATE $table SET $setClause WHERE $whereClause";
        
        // ترکیب پارامترها
        $params = $data;
        foreach ($where as $field => $value) {
            $params["where_$field"] = $value;
        }
        
        $stmt = $this->query($sql, $params);
        return $stmt->rowCount();
    }
    
    /**
     * اجرای DELETE
     */
    public function delete(string $table, array $where): int {
        $whereClause = implode(' AND ', array_map(fn($field) => "$field = :$field", array_keys($where)));
        $sql = "DELETE FROM $table WHERE $whereClause";
        
        $stmt = $this->query($sql, $where);
        return $stmt->rowCount();
    }
    
    /**
     * شروع Transaction
     */
    public function beginTransaction(): bool {
        return $this->getConnection()->beginTransaction();
    }
    
    /**
     * تایید Transaction
     */
    public function commit(): bool {
        return $this->getConnection()->commit();
    }
    
    /**
     * برگشت Transaction
     */
    public function rollback(): bool {
        return $this->getConnection()->rollback();
    }
    
    /**
     * بررسی وجود جدول
     */
    public function tableExists(string $table): bool {
        $sql = "SHOW TABLES LIKE ?";
        $stmt = $this->query($sql, [$table]);
        return $stmt->rowCount() > 0;
    }
    
    /**
     * ایجاد جداول از فایل SQL
     */
    public function createTablesFromFile(string $sqlFile): bool {
        if (!file_exists($sqlFile)) {
            throw new Exception("فایل SQL یافت نشد: $sqlFile");
        }
        
        $sql = file_get_contents($sqlFile);
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            fn($stmt) => !empty($stmt) && !str_starts_with($stmt, '--')
        );
        
        $this->beginTransaction();
        
        try {
            foreach ($statements as $statement) {
                if (!empty($statement)) {
                    $this->getConnection()->exec($statement);
                }
            }
            
            $this->commit();
            Logger::info('Database tables created successfully from SQL file');
            return true;
            
        } catch (Exception $e) {
            $this->rollback();
            Logger::error('Failed to create tables from SQL file', [
                'error' => $e->getMessage()
            ]);
            throw $e;
        }
    }
    
    /**
     * بستن اتصال
     */
    public function close(): void {
        $this->connection = null;
    }
    
    /**
     * جلوگیری از کپی کردن
     */
    private function __clone() {}
    
    /**
     * جلوگیری از unserialize
     */
    public function __wakeup() {
        throw new Exception("Cannot unserialize singleton");
    }
}
?>
