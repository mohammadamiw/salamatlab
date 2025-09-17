<?php
/**
 * Database Connection Manager
 * مدیریت اتصال به دیتابیس MySQL لیارا
 */

class Database {
    private static $instance = null;
    private $connection;
    
    // اطلاعات اتصال لیارا
    private const DB_CONFIG = [
        'host' => 'salamatlabdb',
        'dbname' => 'musing_merkle',
        'username' => 'root',
        'password' => 'LbGsohGHihr1oZ7l8Jt1Vvb0',
        'charset' => 'utf8mb4',
        'port' => 3306
    ];
    
    private function __construct() {
        $this->connect();
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
     * اتصال به دیتابیس
     */
    private function connect(): void {
        try {
            $dsn = sprintf(
                "mysql:host=%s;port=%d;dbname=%s;charset=%s",
                self::DB_CONFIG['host'],
                self::DB_CONFIG['port'],
                self::DB_CONFIG['dbname'],
                self::DB_CONFIG['charset']
            );
            
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES " . self::DB_CONFIG['charset'] . " COLLATE utf8mb4_unicode_ci",
                PDO::ATTR_TIMEOUT => 30,
                PDO::ATTR_PERSISTENT => false
            ];
            
            $this->connection = new PDO(
                $dsn,
                self::DB_CONFIG['username'],
                self::DB_CONFIG['password'],
                $options
            );
            
            // تنظیم timezone
            $this->connection->exec("SET time_zone = '+03:30'");
            
            Logger::info('Database connection established successfully');
            
        } catch (PDOException $e) {
            Logger::error('Database connection failed', [
                'error' => $e->getMessage(),
                'code' => $e->getCode()
            ]);
            throw new Exception('خطا در اتصال به پایگاه داده');
        }
    }
    
    /**
     * دریافت اتصال PDO
     */
    public function getConnection(): PDO {
        // بررسی وضعیت اتصال
        if ($this->connection === null) {
            $this->connect();
        }
        
        // تست اتصال
        try {
            $this->connection->query('SELECT 1');
        } catch (PDOException $e) {
            Logger::warning('Database connection lost, reconnecting...');
            $this->connect();
        }
        
        return $this->connection;
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
