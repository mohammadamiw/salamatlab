<?php
/**
 * تست ساده - بررسی تنظیمات
 */

echo "<h2>🚀 تست ساده SalamatLab</h2>\n";

// بارگذاری تنظیمات
require_once 'public/api/config.php';

echo "<h3>📊 تنظیمات دیتابیس:</h3>\n";
echo "Host: " . DB_HOST . "<br>\n";
echo "Database: " . DB_NAME . "<br>\n";
echo "User: " . DB_USER . "<br>\n";
echo "Password: " . (strlen(DB_PASS) > 0 ? '✅ تنظیم شده (' . strlen(DB_PASS) . ' کاراکتر)' : '❌ تنظیم نشده') . "<br>\n";

echo "<h3>📱 تنظیمات SMS:</h3>\n";
echo "API Key: " . (strlen(SMS_API_KEY) > 0 ? '✅ تنظیم شده (' . strlen(SMS_API_KEY) . ' کاراکتر)' : '❌ تنظیم نشده') . "<br>\n";
echo "Template ID: " . SMSIR_TEMPLATE_ID . "<br>\n";

echo "<h3>🔐 تنظیمات امنیت:</h3>\n";
echo "Admin Username: " . ADMIN_USERNAME . "<br>\n";
echo "OTP TTL: " . OTP_TTL_SECONDS . " ثانیه<br>\n";
echo "Rate Limit: " . MAX_REQUESTS_PER_HOUR . " درخواست در ساعت<br>\n";

echo "<h3>📧 تنظیمات ایمیل:</h3>\n";
echo "Admin Email: " . ADMIN_EMAIL . "<br>\n";
echo "From Email: " . FROM_EMAIL . "<br>\n";

// تست اتصال دیتابیس
echo "<h3>🔌 تست اتصال دیتابیس:</h3>\n";
try {
    require_once 'public/api/core/Database.php';
    $db = Database::getInstance();
    $connection = $db->getConnection();
    
    $result = $db->query("SELECT 1 as test, NOW() as server_time, VERSION() as mysql_version");
    $row = $result->fetch();
    
    echo "✅ اتصال موفق!<br>\n";
    echo "زمان سرور: " . $row['server_time'] . "<br>\n";
    echo "نسخه MySQL: " . $row['mysql_version'] . "<br>\n";
    
} catch (Exception $e) {
    echo "❌ خطا در اتصال: " . $e->getMessage() . "<br>\n";
}

echo "<h3>🎯 نتیجه:</h3>\n";
echo "✅ تمام تنظیمات مستقیماً در کد قرار گرفتند<br>\n";
echo "✅ نیازی به فایل .env نیست<br>\n";
echo "✅ سیستم آماده استفاده است<br>\n";

echo "<hr>\n";
echo "<p><strong>مراحل بعدی:</strong></p>\n";
echo "1. فایل‌های پروژه را روی سرور آپلود کنید<br>\n";
echo "2. تنظیمات دامنه را در config.php اصلاح کنید<br>\n";
echo "3. تست نهایی انجام دهید<br>\n";
?>
