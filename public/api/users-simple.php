<?php
/**
 * API ساده مدیریت کاربران - فعلاً بدون دیتابیس
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// پردازش درخواست‌های OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ساخت پوشه data اگر وجود نداره
$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// فایل ذخیره کاربران
$usersFile = $dataDir . '/users.json';

// خواندن کاربران از فایل
function getUsers() {
    global $usersFile;
    if (!file_exists($usersFile)) {
        return [];
    }
    $content = file_get_contents($usersFile);
    return json_decode($content, true) ?: [];
}

// ذخیره کاربران در فایل
function saveUsers($users) {
    global $usersFile;
    return file_put_contents($usersFile, json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

// پیدا کردن کاربر با شماره تلفن
function getUserByPhone($phone) {
    $users = getUsers();
    foreach ($users as $user) {
        if ($user['phone'] === $phone) {
            return $user;
        }
    }
    return null;
}

// ایجاد کاربر جدید
function createUser($userData) {
    $users = getUsers();
    
    // چک کردن اینکه کاربر قبلاً وجود داره یا نه
    $existingUser = getUserByPhone($userData['phone']);
    if ($existingUser) {
        return ['user' => $existingUser, 'created' => false];
    }
    
    // ایجاد کاربر جدید
    $newUser = [
        'id' => uniqid('user_', true),
        'phone' => $userData['phone'],
        'first_name' => $userData['firstName'] ?? null,
        'last_name' => $userData['lastName'] ?? null,
        'email' => $userData['email'] ?? null,
        'national_id' => $userData['nationalId'] ?? null,
        'birth_date' => $userData['birthDate'] ?? null,
        'gender' => $userData['gender'] ?? null,
        'city' => $userData['city'] ?? null,
        'has_basic_insurance' => $userData['hasBasicInsurance'] ?? null,
        'basic_insurance' => $userData['basicInsurance'] ?? null,
        'complementary_insurance' => $userData['complementaryInsurance'] ?? null,
        'default_address_id' => null,
        'is_profile_complete' => $userData['isProfileComplete'] ?? false,
        'addresses' => [],
        'created_at' => date('Y-m-d H:i:s'),
        'updated_at' => date('Y-m-d H:i:s')
    ];
    
    $users[] = $newUser;
    saveUsers($users);
    
    return ['user' => $newUser, 'created' => true];
}

// به‌روزرسانی کاربر
function updateUser($userId, $userData) {
    $users = getUsers();
    
    foreach ($users as $index => $user) {
        if ($user['id'] === $userId) {
            $users[$index] = array_merge($user, $userData, [
                'updated_at' => date('Y-m-d H:i:s')
            ]);
            saveUsers($users);
            return true;
        }
    }
    
    return false;
}

// به‌روزرسانی آدرس‌ها
function updateUserAddresses($userId, $addresses) {
    $users = getUsers();
    
    foreach ($users as $index => $user) {
        if ($user['id'] === $userId) {
            $users[$index]['addresses'] = $addresses;
            $users[$index]['updated_at'] = date('Y-m-d H:i:s');
            saveUsers($users);
            return true;
        }
    }
    
    return false;
}

// پردازش درخواست‌ها
try {
    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'GET') {
        $phone = $_GET['phone'] ?? null;
        if (!$phone) {
            http_response_code(400);
            echo json_encode(['error' => 'شماره تلفن الزامی است']);
            exit();
        }
        
        $user = getUserByPhone($phone);
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
    }
    else if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $action = $input['action'] ?? 'create';
        
        if ($action === 'create') {
            $phone = $input['phone'] ?? null;
            if (!$phone) {
                http_response_code(400);
                echo json_encode(['error' => 'شماره تلفن الزامی است']);
                exit();
            }
            
            $result = createUser($input);
            echo json_encode([
                'success' => true,
                'user' => $result['user'],
                'created' => $result['created']
            ]);
        }
        else if ($action === 'update') {
            $userId = $input['userId'] ?? null;
            if (!$userId) {
                http_response_code(400);
                echo json_encode(['error' => 'شناسه کاربر الزامی است']);
                exit();
            }
            
            $result = updateUser($userId, $input);
            if ($result) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'کاربر یافت نشد']);
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
            
            $result = updateUserAddresses($userId, $addresses);
            if ($result) {
                echo json_encode(['success' => true]);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'کاربر یافت نشد']);
            }
        }
        else {
            http_response_code(400);
            echo json_encode(['error' => 'عملیات نامعتبر']);
        }
    }
    else {
        http_response_code(405);
        echo json_encode(['error' => 'روش درخواست پشتیبانی نمی‌شود']);
    }
    
} catch (Exception $e) {
    error_log("Users API Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'خطای داخلی سرور: ' . $e->getMessage()]);
}
?>
