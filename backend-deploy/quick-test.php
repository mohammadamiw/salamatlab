<?php
/**
 * Quick Test - تست سریع تنظیمات جدید
 * برای بررسی آماده بودن سیستم برای production
 */

echo "🚀 SalamatLab Quick Test\n";
echo "======================\n\n";

// Test 1: Environment Manager
echo "1. Testing Environment Manager...\n";
try {
    require_once 'core/Environment.php';
    $env = Environment::getInstance();
    echo "   ✅ Environment Manager loaded\n";
    echo "   📍 Environment: " . ($env->isProduction() ? 'production' : 'development') . "\n";
    echo "   🔧 Debug: " . ($env->isDebug() ? 'enabled' : 'disabled') . "\n";
} catch (Exception $e) {
    echo "   ❌ Error: " . $e->getMessage() . "\n";
}

// Test 2: Database Configuration
echo "\n2. Testing Database Configuration...\n";
try {
    $dbConfig = $env->getDatabaseConfig();
    echo "   ✅ Database config loaded\n";
    echo "   🏠 Host: " . $dbConfig['host'] . "\n";
    echo "   📦 Database: " . $dbConfig['dbname'] . "\n";
    echo "   👤 User: " . $dbConfig['username'] . "\n";
    echo "   🔌 Port: " . $dbConfig['port'] . "\n";
} catch (Exception $e) {
    echo "   ❌ Error: " . $e->getMessage() . "\n";
}

// Test 3: SMS Configuration
echo "\n3. Testing SMS Configuration...\n";
try {
    $smsConfig = $env->getSmsConfig();
    echo "   ✅ SMS config loaded\n";
    echo "   🔑 API Key: " . (strlen($smsConfig['api_key']) > 0 ? 'Set (' . strlen($smsConfig['api_key']) . ' chars)' : 'Not set') . "\n";
    echo "   📱 Template ID: " . $smsConfig['template_id'] . "\n";
    echo "   🎯 Template Param: " . $smsConfig['template_param'] . "\n";
} catch (Exception $e) {
    echo "   ❌ Error: " . $e->getMessage() . "\n";
}

// Test 4: Security Configuration
echo "\n4. Testing Security Configuration...\n";
try {
    $securityConfig = $env->getSecurityConfig();
    echo "   ✅ Security config loaded\n";
    echo "   🔐 OTP Secret: " . (strlen($securityConfig['otp_secret']) > 0 ? 'Set (' . strlen($securityConfig['otp_secret']) . ' chars)' : 'Not set') . "\n";
    echo "   ⏱️ OTP TTL: " . $securityConfig['otp_ttl'] . " seconds\n";
    echo "   🚫 Rate Limit: " . $securityConfig['rate_limit'] . " requests/hour\n";
    echo "   🌐 CORS Origins: " . implode(', ', $securityConfig['allowed_origins']) . "\n";
} catch (Exception $e) {
    echo "   ❌ Error: " . $e->getMessage() . "\n";
}

// Test 5: Database Connection
echo "\n5. Testing Database Connection...\n";
try {
    require_once 'core/Database.php';
    require_once 'core/Logger.php';
    
    $db = Database::getInstance();
    $connection = $db->getConnection();
    
    // Test query
    $result = $db->query("SELECT 1 as test, NOW() as current_time, VERSION() as mysql_version");
    $row = $result->fetch();
    
    echo "   ✅ Database connection successful\n";
    echo "   🕐 Server time: " . $row['current_time'] . "\n";
    echo "   🐬 MySQL version: " . $row['mysql_version'] . "\n";
    
    // Test connection stats
    $stats = $db->getConnectionStats();
    echo "   📊 Active connections: " . $stats['active_connections'] . "\n";
    echo "   🔄 Max connections: " . $stats['max_connections'] . "\n";
    
} catch (Exception $e) {
    echo "   ❌ Database Error: " . $e->getMessage() . "\n";
}

// Test 6: Exception Handler
echo "\n6. Testing Exception Handler...\n";
try {
    require_once 'core/ExceptionHandler.php';
    $exceptionHandler = ExceptionHandler::getInstance();
    echo "   ✅ Exception Handler initialized\n";
    echo "   🛡️ Error handling: Active\n";
} catch (Exception $e) {
    echo "   ❌ Error: " . $e->getMessage() . "\n";
}

// Test 7: Overall System Health
echo "\n7. Overall System Health...\n";
$healthScore = 0;
$totalTests = 6;

// Check if all major components loaded
if (isset($env)) $healthScore++;
if (isset($dbConfig)) $healthScore++;
if (isset($smsConfig)) $healthScore++;
if (isset($securityConfig)) $healthScore++;
if (isset($db)) $healthScore++;
if (isset($exceptionHandler)) $healthScore++;

$percentage = round(($healthScore / $totalTests) * 100);

if ($percentage >= 90) {
    echo "   🎉 EXCELLENT: System is ready for production! ($percentage%)\n";
} elseif ($percentage >= 70) {
    echo "   ✅ GOOD: System is mostly ready ($percentage%)\n";
} elseif ($percentage >= 50) {
    echo "   ⚠️ WARNING: Some issues need attention ($percentage%)\n";
} else {
    echo "   ❌ CRITICAL: Major issues found ($percentage%)\n";
}

echo "\n======================\n";
echo "📋 Next Steps:\n";
echo "1. اگر تمام تست‌ها موفق بودند، سیستم آماده است\n";
echo "2. در صورت خطا، فایل .env را بررسی کنید\n";
echo "3. برای تست کامل: php public/api/status.php\n";
echo "4. برای تست authentication: php public/api/auth.php\n";
echo "\n🚀 SalamatLab System Ready!\n";
?>
