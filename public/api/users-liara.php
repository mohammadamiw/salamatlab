<?php
/**
 * API مدیریت کاربران - بهینه شده برای لیارا
 * User Management API - Liara Optimized
 */

require_once 'config-liara.php';

// تنظیم هدرهای CORS
setCorsHeaders();

// پردازش درخواست‌های OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// اعتبارسنجی درخواست
validateRequest();

/**
 * دریافت کاربر با شماره تلفن
 */
function getUserByPhone($phone) {
    $pdo = getDatabaseConnection();
    
    try {
        $stmt = $pdo->prepare("
            SELECT u.*, 
                   GROUP_CONCAT(
                       JSON_OBJECT(
                           'id', a.id,
                           'title', a.title,
                           'address', a.address,
                           'latitude', a.latitude,
                           'longitude', a.longitude,
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
        
        if (!$user) {
            return null;
        }
        
        // پردازش آدرس‌ها
        $addresses = [];
        if ($user['addresses']) {
            $addressList = explode(',', $user['addresses']);
            foreach ($addressList as $addr) {
                $addresses[] = json_decode($addr, true);
            }
        }
        
        return [
            'id' => $user['id'],
            'phone' => $user['phone'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name'],
            'email' => $user['email'],
            'national_id' => $user['national_id'],
            'birth_date' => $user['birth_date'],
            'gender' => $user['gender'],
            'city' => $user['city'],
            'has_basic_insurance' => $user['has_basic_insurance'],
            'basic_insurance' => $user['basic_insurance'],
            'complementary_insurance' => $user['complementary_insurance'],
            'is_profile_complete' => (bool)$user['is_profile_complete'],
            'addresses' => $addresses,
            'created_at' => $user['created_at'],
            'updated_at' => $user['updated_at']
        ];
        
    } catch (PDOException $e) {
        logError("Failed to get user by phone", ['phone' => $phone, 'error' => $e->getMessage()]);
        return null;
    }
}

/**
 * ایجاد کاربر جدید
 */
function createUser($data) {
    $pdo = getDatabaseConnection();
    
    try {
        $stmt = $pdo->prepare("
            INSERT INTO users (phone, first_name, last_name, email, national_id, 
                             birth_date, gender, city, has_basic_insurance, 
                             basic_insurance, complementary_insurance, is_profile_complete)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        
        $result = $stmt->execute([
            $data['phone'],
            $data['firstName'] ?? null,
            $data['lastName'] ?? null,
            $data['email'] ?? null,
            $data['nationalId'] ?? null,
            $data['birthDate'] ?? null,
            $data['gender'] ?? null,
            $data['city'] ?? null,
            $data['hasBasicInsurance'] ?? 'no',
            $data['basicInsurance'] ?? null,
            $data['complementaryInsurance'] ?? null,
            isset($data['isProfileComplete']) ? (bool)$data['isProfileComplete'] : false
        ]);
        
        if ($result) {
            $userId = $pdo->lastInsertId();
            logInfo("User created successfully", ['user_id' => $userId, 'phone' => $data['phone']]);
            return $userId;
        }
        
        return false;
        
    } catch (PDOException $e) {
        logError("Failed to create user", ['phone' => $data['phone'], 'error' => $e->getMessage()]);
        return false;
    }
}

/**
 * به‌روزرسانی کاربر
 */
function updateUser($userId, $data) {
    $pdo = getDatabaseConnection();
    
    try {
        $fields = [];
        $values = [];
        
        $allowedFields = [
            'firstName' => 'first_name',
            'lastName' => 'last_name', 
            'email' => 'email',
            'nationalId' => 'national_id',
            'birthDate' => 'birth_date',
            'gender' => 'gender',
            'city' => 'city',
            'hasBasicInsurance' => 'has_basic_insurance',
            'basicInsurance' => 'basic_insurance',
            'complementaryInsurance' => 'complementary_insurance',
            'isProfileComplete' => 'is_profile_complete'
        ];
        
        foreach ($allowedFields as $inputField => $dbField) {
            if (isset($data[$inputField])) {
                $fields[] = "$dbField = ?";
                if ($inputField === 'isProfileComplete') {
                    $values[] = (bool)$data[$inputField];
                } else {
                    $values[] = $data[$inputField];
                }
            }
        }
        
        if (empty($fields)) {
            return true; // هیچ تغییری نیست
        }
        
        $values[] = $userId;
        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = ?";
        
        $stmt = $pdo->prepare($sql);
        $result = $stmt->execute($values);
        
        logInfo("User updated successfully", ['user_id' => $userId]);
        return $result;
        
    } catch (PDOException $e) {
        logError("Failed to update user", ['user_id' => $userId, 'error' => $e->getMessage()]);
        return false;
    }
}

/**
 * به‌روزرسانی آدرس‌های کاربر
 */
function updateUserAddresses($userId, $addresses) {
    $pdo = getDatabaseConnection();
    
    try {
        $pdo->beginTransaction();
        
        // حذف آدرس‌های قبلی
        $stmt = $pdo->prepare("DELETE FROM user_addresses WHERE user_id = ?");
        $stmt->execute([$userId]);
        
        // اضافه کردن آدرس‌های جدید
        if (!empty($addresses)) {
            $stmt = $pdo->prepare("
                INSERT INTO user_addresses (user_id, title, address, latitude, longitude, phone, is_default)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            
            foreach ($addresses as $address) {
                $stmt->execute([
                    $userId,
                    $address['title'] ?? '',
                    $address['address'] ?? '',
                    $address['latitude'] ?? null,
                    $address['longitude'] ?? null,
                    $address['phone'] ?? null,
                    isset($address['isDefault']) ? (bool)$address['isDefault'] : false
                ]);
            }
        }
        
        $pdo->commit();
        logInfo("User addresses updated successfully", ['user_id' => $userId, 'count' => count($addresses)]);
        return true;
        
    } catch (PDOException $e) {
        $pdo->rollBack();
        logError("Failed to update user addresses", ['user_id' => $userId, 'error' => $e->getMessage()]);
        return false;
    }
}

/**
 * ایجاد و ارسال کد OTP
 */
function sendOtpToPhone($phone) {
    $pdo = getDatabaseConnection();
    
    try {
        // حذف کدهای منقضی
        $stmt = $pdo->prepare("DELETE FROM otp_codes WHERE expires_at < NOW()");
        $stmt->execute();
        
        // بررسی درخواست‌های اخیر (محدودیت 1 دقیقه)
        $stmt = $pdo->prepare("
            SELECT COUNT(*) as count 
            FROM otp_codes 
            WHERE phone = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 MINUTE)
        ");
        $stmt->execute([$phone]);
        $recentCount = $stmt->fetchColumn();
        
        if ($recentCount > 0) {
            return ['success' => false, 'error' => 'لطفاً 1 دقیقه صبر کنید'];
        }
        
        // تولید کد جدید
        $code = generateOtpCode();
        $expiresAt = date('Y-m-d H:i:s', time() + OTP_TTL_SECONDS);
        
        // ذخیره کد در دیتابیس
        $stmt = $pdo->prepare("
            INSERT INTO otp_codes (phone, code, expires_at)
            VALUES (?, ?, ?)
        ");
        $stmt->execute([$phone, $code, $expiresAt]);
        
        // ارسال پیامک
        $smsResult = sendOtpSms($phone, $code);
        
        if ($smsResult) {
            logInfo("OTP sent successfully", ['phone' => $phone]);
            return ['success' => true, 'message' => 'کد تایید ارسال شد'];
        } else {
            logError("Failed to send SMS", ['phone' => $phone]);
            return ['success' => false, 'error' => 'خطا در ارسال پیامک'];
        }
        
    } catch (PDOException $e) {
        logError("Failed to send OTP", ['phone' => $phone, 'error' => $e->getMessage()]);
        return ['success' => false, 'error' => 'خطای سیستم'];
    }
}

/**
 * تایید کد OTP
 */
function verifyOtpCode($phone, $code) {
    $pdo = getDatabaseConnection();
    
    try {
        // یافتن کد معتبر
        $stmt = $pdo->prepare("
            SELECT id FROM otp_codes 
            WHERE phone = ? AND code = ? AND expires_at > NOW() AND used = FALSE
            ORDER BY created_at DESC LIMIT 1
        ");
        $stmt->execute([$phone, $code]);
        $otpRecord = $stmt->fetch();
        
        if (!$otpRecord) {
            logInfo("Invalid or expired OTP", ['phone' => $phone]);
            return ['success' => false, 'error' => 'کد تایید نامعتبر یا منقضی شده'];
        }
        
        // علامت‌گذاری کد به عنوان استفاده شده
        $stmt = $pdo->prepare("UPDATE otp_codes SET used = TRUE WHERE id = ?");
        $stmt->execute([$otpRecord['id']]);
        
        // بررسی وجود کاربر
        $user = getUserByPhone($phone);
        $isNewUser = !$user;
        
        if ($isNewUser) {
            // ایجاد کاربر جدید
            $userId = createUser([
                'phone' => $phone,
                'isProfileComplete' => false
            ]);
            
            if ($userId) {
                $user = getUserByPhone($phone);
            } else {
                return ['success' => false, 'error' => 'خطا در ایجاد کاربر'];
            }
        }
        
        logInfo("OTP verified successfully", ['phone' => $phone, 'is_new_user' => $isNewUser]);
        
        return [
            'success' => true,
            'user' => $user,
            'isNewUser' => $isNewUser
        ];
        
    } catch (PDOException $e) {
        logError("Failed to verify OTP", ['phone' => $phone, 'error' => $e->getMessage()]);
        return ['success' => false, 'error' => 'خطای سیستم'];
    }
}

// پردازش درخواست‌ها
try {
    $method = $_SERVER['REQUEST_METHOD'];
    $input = json_decode(file_get_contents('php://input'), true) ?: [];
    
    switch ($method) {
        case 'GET':
            $phone = $_GET['phone'] ?? null;
            
            if (!$phone) {
                errorResponse('شماره تلفن الزامی است');
            }
            
            $phone = validateIranianPhone($phone);
            if (!$phone) {
                errorResponse('شماره تلفن نامعتبر است');
            }
            
            $user = getUserByPhone($phone);
            jsonResponse([
                'success' => true,
                'user' => $user,
                'exists' => $user !== null
            ]);
            break;
            
        case 'POST':
            $action = $input['action'] ?? 'create';
            
            switch ($action) {
                case 'sendOtp':
                    $phone = $input['phone'] ?? null;
                    
                    if (!$phone) {
                        errorResponse('شماره تلفن الزامی است');
                    }
                    
                    $phone = validateIranianPhone($phone);
                    if (!$phone) {
                        errorResponse('شماره تلفن نامعتبر است');
                    }
                    
                    $result = sendOtpToPhone($phone);
                    jsonResponse($result);
                    break;
                    
                case 'verifyOtp':
                    $phone = $input['phone'] ?? null;
                    $code = $input['code'] ?? null;
                    
                    if (!$phone || !$code) {
                        errorResponse('شماره تلفن و کد تایید الزامی است');
                    }
                    
                    $phone = validateIranianPhone($phone);
                    if (!$phone) {
                        errorResponse('شماره تلفن نامعتبر است');
                    }
                    
                    $result = verifyOtpCode($phone, $code);
                    jsonResponse($result);
                    break;
                    
                case 'create':
                    $phone = $input['phone'] ?? null;
                    
                    if (!$phone) {
                        errorResponse('شماره تلفن الزامی است');
                    }
                    
                    $phone = validateIranianPhone($phone);
                    if (!$phone) {
                        errorResponse('شماره تلفن نامعتبر است');
                    }
                    
                    // بررسی وجود کاربر
                    $existingUser = getUserByPhone($phone);
                    if ($existingUser) {
                        jsonResponse([
                            'success' => true,
                            'user' => $existingUser,
                            'created' => false
                        ]);
                    }
                    
                    $input['phone'] = $phone;
                    $userId = createUser($input);
                    
                    if ($userId) {
                        $user = getUserByPhone($phone);
                        jsonResponse([
                            'success' => true,
                            'user' => $user,
                            'created' => true
                        ]);
                    } else {
                        errorResponse('خطا در ایجاد کاربر', 500);
                    }
                    break;
                    
                case 'update':
                    $userId = $input['userId'] ?? null;
                    
                    if (!$userId) {
                        errorResponse('شناسه کاربر الزامی است');
                    }
                    
                    $result = updateUser($userId, $input);
                    
                    if ($result) {
                        jsonResponse(['success' => true]);
                    } else {
                        errorResponse('خطا در به‌روزرسانی کاربر', 500);
                    }
                    break;
                    
                case 'updateAddresses':
                    $userId = $input['userId'] ?? null;
                    $addresses = $input['addresses'] ?? [];
                    
                    if (!$userId) {
                        errorResponse('شناسه کاربر الزامی است');
                    }
                    
                    $result = updateUserAddresses($userId, $addresses);
                    
                    if ($result) {
                        jsonResponse(['success' => true]);
                    } else {
                        errorResponse('خطا در به‌روزرسانی آدرس‌ها', 500);
                    }
                    break;
                    
                default:
                    errorResponse('عمل نامعتبر');
                    break;
            }
            break;
            
        default:
            errorResponse('روش درخواست پشتیبانی نمی‌شود', 405);
            break;
    }
    
} catch (Exception $e) {
    logError("API Exception", ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
    errorResponse('خطای داخلی سرور', 500, DEBUG_MODE ? $e->getMessage() : null);
}

?>
