<?php
/**
 * OTP_SECRET Generator - PHP Version
 * تولید کلید امنیتی OTP_SECRET با PHP
 */

// تولید کلید 32 بایتی (64 کاراکتری hex)
$secret = bin2hex(random_bytes(32));

echo str_repeat("=", 60) . "\n";
echo "🔐 OTP_SECRET GENERATED SUCCESSFULLY (PHP)\n";
echo str_repeat("=", 60) . "\n";
echo "\n";
echo "OTP_SECRET=" . $secret . "\n";
echo "\n";
echo "📊 مشخصات کلید:\n";
echo "• طول: " . strlen($secret) . " کاراکتر\n";
echo "• فرمت: Hexadecimal (0-9, a-f)\n";
echo "• امنیت: AES-256 Compatible\n";
echo "\n";
echo "⚙️ تنظیم در لیارا:\n";
echo "پنل لیارا → اپ salamatlab-backend → متغیرهای محیطی\n";
echo "OTP_SECRET=" . $secret . "\n";
echo "\n";
echo "🔒 نکات امنیتی:\n";
echo "• این کلید را با دیگران به اشتراک نگذارید\n";
echo "• کلید را در متغیرهای محیطی نگه دارید\n";
echo "• هرگز کلید را در کد قرار ندهید\n";
echo "• کلید را منظماً تغییر دهید\n";
echo "\n";
echo "✅ کلید شما آماده استفاده است!\n";
echo str_repeat("=", 60) . "\n";

// تست صحت کلید
$isValid = preg_match('/^[a-f0-9]{64}$/', $secret);
echo "\n";
echo ($isValid ? "✅ کلید معتبر است" : "❌ کلید نامعتبر است") . "\n";
echo "\n";

echo "💡 اگر نیاز به کلید جدید دارید، دوباره اجرا کنید:\n";
echo "php generate_otp_secret.php\n";
echo str_repeat("=", 60) . "\n";
?>
