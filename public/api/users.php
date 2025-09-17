<?php
/**
 * API مدیریت کاربران - سیستم پروفایل آزمایشگاه سلامت
 */

require_once 'config.php';

// تنظیم هدرهای CORS
setCorsHeaders();

// پردازش درخواست‌های OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Validate request
validateRequest();

// Database connection
function getDbConnection() {
    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false
        ]);
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'خطا در اتصال به پایگاه داده']);
        exit();
    }
}

// Create tables if not exists
function createTables($pdo) {
    try {
        // جدول کاربران
        $userTable = "
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(50) PRIMARY KEY,
            phone VARCHAR(15) UNIQUE NOT NULL,
            first_name VARCHAR(100),
            last_name VARCHAR(100),
            email VARCHAR(100),
            national_id VARCHAR(10),
            birth_date DATE,
            gender ENUM('male', 'female'),
            city VARCHAR(50),
            has_basic_insurance ENUM('yes', 'no'),
            basic_insurance VARCHAR(100),
            complementary_insurance VARCHAR(100),
            default_address_id VARCHAR(50),
            is_profile_complete BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_phone (phone),
            INDEX idx_national_id (national_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        // جدول آدرس‌ها
        $addressTable = "
        CREATE TABLE IF NOT EXISTS user_addresses (
            id VARCHAR(50) PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL,
            title VARCHAR(100) NOT NULL,
            type ENUM('home', 'work', 'other') DEFAULT 'home',
            address TEXT NOT NULL,
            postal_code VARCHAR(10),
            phone VARCHAR(15),
            is_default BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            INDEX idx_user_id (user_id),
            INDEX idx_is_default (is_default)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
        
        $pdo->exec($userTable);
        $pdo->exec($addressTable);
        
        return true;
    } catch (PDOException $e) {
        error_log("Database table creation error: " . $e->getMessage());
        return false;
    }
}

// Get user by phone
function getUserByPhone($pdo, $phone) {
    try {
        $stmt = $pdo->prepare("
            SELECT u.*, 
                   GROUP_CONCAT(
                       JSON_OBJECT(
                           'id', a.id,
                           'title', a.title,
                           'type', a.type,
                           'address', a.address,
                           'postalCode', a.postal_code,
                           'phone', a.phone,
                           'isDefault', a.is_default
                       )
                   ) as addresses
            FROM users u
            LEFT JOIN user_addresses a ON u.id = a.user_id
            WHERE u.phone = ?
            GROUP BY u.id
        ");
        $stmt->execute([$phone]);
        $user = $stmt->fetch();
        
        if ($user) {
            // Parse addresses JSON
            if ($user['addresses']) {
                $user['addresses'] = array_map('json_decode', explode(',', $user['addresses']));
                foreach ($user['addresses'] as &$addr) {
                    $addr->isDefault = (bool)$addr->isDefault;
                }
            } else {
                $user['addresses'] = [];
            }
            
            // Convert boolean fields
            $user['is_profile_complete'] = (bool)$user['is_profile_complete'];
            
            // Format dates
            $user['created_at'] = $user['created_at'];
            $user['updated_at'] = $user['updated_at'];
        }
        
        return $user;
    } catch (PDOException $e) {
        error_log("Get user error: " . $e->getMessage());
        return false;
    }
}

// Create new user
function createUser($pdo, $userData) {
    try {
        $pdo->beginTransaction();
        
        $stmt = $pdo->prepare("
            INSERT INTO users (
                id, phone, first_name, last_name, email, national_id, 
                birth_date, gender, city, has_basic_insurance, 
                basic_insurance, complementary_insurance, is_profile_complete
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $userId = uniqid('user_', true);
        $stmt->execute([
            $userId,
            $userData['phone'],
            $userData['firstName'] ?? null,
            $userData['lastName'] ?? null,
            $userData['email'] ?? null,
            $userData['nationalId'] ?? null,
            $userData['birthDate'] ?? null,
            $userData['gender'] ?? null,
            $userData['city'] ?? null,
            $userData['hasBasicInsurance'] ?? null,
            $userData['basicInsurance'] ?? null,
            $userData['complementaryInsurance'] ?? null,
            $userData['isProfileComplete'] ?? false
        ]);
        
        $pdo->commit();
        return $userId;
    } catch (PDOException $e) {
        $pdo->rollBack();
        error_log("Create user error: " . $e->getMessage());
        return false;
    }
}

// Update user
function updateUser($pdo, $userId, $userData) {
    try {
        $pdo->beginTransaction();
        
        $stmt = $pdo->prepare("
            UPDATE users SET 
                first_name = ?, last_name = ?, email = ?, national_id = ?,
                birth_date = ?, gender = ?, city = ?, has_basic_insurance = ?,
                basic_insurance = ?, complementary_insurance = ?, is_profile_complete = ?
            WHERE id = ?
        ");
        
        $stmt->execute([
            $userData['firstName'] ?? null,
            $userData['lastName'] ?? null,
            $userData['email'] ?? null,
            $userData['nationalId'] ?? null,
            $userData['birthDate'] ?? null,
            $userData['gender'] ?? null,
            $userData['city'] ?? null,
            $userData['hasBasicInsurance'] ?? null,
            $userData['basicInsurance'] ?? null,
            $userData['complementaryInsurance'] ?? null,
            $userData['isProfileComplete'] ?? false
        ]);
        
        $pdo->commit();
        return true;
    } catch (PDOException $e) {
        $pdo->rollBack();
        error_log("Update user error: " . $e->getMessage());
        return false;
    }
}

// Update user addresses
function updateUserAddresses($pdo, $userId, $addresses) {
    try {
        $pdo->beginTransaction();
        
        // حذف آدرس‌های قدیمی
        $stmt = $pdo->prepare("DELETE FROM user_addresses WHERE user_id = ?");
        $stmt->execute([$userId]);
        
        // اضافه کردن آدرس‌های جدید
        if (!empty($addresses)) {
            $stmt = $pdo->prepare("
                INSERT INTO user_addresses (
                    id, user_id, title, type, address, postal_code, phone, is_default
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");
            
            foreach ($addresses as $address) {
                $addressId = uniqid('addr_', true);
                $stmt->execute([
                    $addressId,
                    $userId,
                    $address['title'],
                    $address['type'],
                    $address['address'],
                    $address['postalCode'] ?? null,
                    $address['phone'] ?? null,
                    $address['isDefault'] ? 1 : 0
                ]);
            }
        }
        
        $pdo->commit();
        return true;
    } catch (PDOException $e) {
        $pdo->rollBack();
        error_log("Update addresses error: " . $e->getMessage());
        return false;
    }
}

// Main API handler
try {
    $pdo = getDbConnection();
    createTables($pdo);
    
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true);
    
    switch ($method) {
        case 'GET':
            $phone = $_GET['phone'] ?? null;
            if (!$phone) {
                http_response_code(400);
                echo json_encode(['error' => 'شماره تلفن الزامی است']);
                exit();
            }
            
            $user = getUserByPhone($pdo, $phone);
            if ($user) {
                echo json_encode([
                    'success' => true,
                    'user' => $user,
                    'exists' => true
                ]);
            } else {
                echo json_encode([
                    'success' => true,
                    'user' => null,
                    'exists' => false
                ]);
            }
            break;
            
        case 'POST':
            $action = $input['action'] ?? 'create';
            
            if ($action === 'create') {
                $phone = $input['phone'] ?? null;
                if (!$phone) {
                    http_response_code(400);
                    echo json_encode(['error' => 'شماره تلفن الزامی است']);
                    exit();
                }
                
                // چک کردن اینکه کاربر وجود داره یا نه
                $existingUser = getUserByPhone($pdo, $phone);
                if ($existingUser) {
                    echo json_encode([
                        'success' => true,
                        'user' => $existingUser,
                        'created' => false
                    ]);
                    exit();
                }
                
                $userId = createUser($pdo, $input);
                if ($userId) {
                    $user = getUserByPhone($pdo, $phone);
                    echo json_encode([
                        'success' => true,
                        'user' => $user,
                        'created' => true
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'خطا در ایجاد کاربر']);
                }
            }
            else if ($action === 'update') {
                $userId = $input['userId'] ?? null;
                if (!$userId) {
                    http_response_code(400);
                    echo json_encode(['error' => 'شناسه کاربر الزامی است']);
                    exit();
                }
                
                $result = updateUser($pdo, $userId, $input);
                if ($result) {
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'خطا در به‌روزرسانی کاربر']);
                }
            }
            else if ($action === 'updateAddresses') {
                $userId = $input['userId'] ?? null;
                $addresses = $input['addresses'] ?? [];
                
                if (!$userId) {
                    http_response_code(400);
                    echo json_encode(['error' => 'شناسه کاربر الزامی است']);
                    exit();
                }
                
                $result = updateUserAddresses($pdo, $userId, $addresses);
                if ($result) {
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'خطا در به‌روزرسانی آدرس‌ها']);
                }
            }
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'روش درخواست پشتیبانی نمی‌شود']);
            break;
    }
    
} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'خطای داخلی سرور']);
}
?>
