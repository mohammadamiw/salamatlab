# راهنمای نصب سیستم رزرو در DirectAdmin

## مقدمه

این راهنما برای نصب سیستم رزرو در هاست‌های DirectAdmin طراحی شده است. DirectAdmin یک پنل مدیریت هاست است که معمولاً روی سرورهای لینوکس نصب می‌شود.

## پیش‌نیازها

### 1. مشخصات سرور
- **سیستم عامل**: Linux (CentOS, Ubuntu, Debian)
- **پنل مدیریت**: DirectAdmin
- **نسخه PHP**: 7.4 یا بالاتر
- **ماژول‌های PHP**: mail, json, mbstring

### 2. بررسی ماژول‌های PHP
در DirectAdmin، به بخش **Advanced Features > PHP Selector** بروید و مطمئن شوید که ماژول‌های زیر فعال هستند:
- `mail`
- `json` 
- `mbstring`
- `curl` (اختیاری)

## مراحل نصب

### مرحله 1: آپلود فایل‌ها

#### الف) آپلود فایل‌های PHP
1. وارد DirectAdmin شوید
2. به بخش **File Manager** بروید
3. پوشه `public_html` را باز کنید
4. پوشه `api` را ایجاد کنید
5. فایل‌های زیر را آپلود کنید:
   - `booking.php`
   - `config.php`
   - `.htaccess`

#### ب) آپلود فایل‌های React
1. در پوشه `public_html`، فایل‌های React را آپلود کنید
2. مطمئن شوید که `index.html` در ریشه قرار دارد

### مرحله 2: تنظیم مجوزها

#### الف) تنظیم مجوزهای فایل
```bash
# در File Manager یا SSH
chmod 644 *.php
chmod 644 *.html
chmod 644 *.css
chmod 644 *.js
```

#### ب) تنظیم مجوزهای پوشه
```bash
chmod 755 api/
chmod 755 images/
chmod 755 fonts/
```

### مرحله 3: تنظیمات DirectAdmin

#### الف) تنظیم PHP
1. به **Advanced Features > PHP Selector** بروید
2. نسخه PHP 7.4 یا بالاتر را انتخاب کنید
3. ماژول‌های مورد نیاز را فعال کنید

#### ب) تنظیم Email
1. به **Email Accounts** بروید
2. یک ایمیل برای سیستم رزرو ایجاد کنید
3. آدرس ایمیل را در `config.php` وارد کنید

#### ج) تنظیم DNS
1. به **DNS Management** بروید
2. رکورد A برای دامنه اصلی تنظیم کنید
3. رکورد CNAME برای `www` تنظیم کنید

## تنظیمات فایل‌ها

### 1. فایل config.php
```php
// تنظیمات ایمیل - آدرس‌های خود را وارد کنید
define('ADMIN_EMAIL', 'your-email@yourdomain.com');
define('FROM_EMAIL', 'noreply@yourdomain.com');
define('REPLY_TO_EMAIL', 'info@yourdomain.com');

// تنظیمات امنیت
define('ALLOWED_ORIGINS', ['https://yourdomain.com']); // دامنه خود را وارد کنید
```

### 2. فایل .htaccess
فایل `.htaccess` از قبل برای DirectAdmin بهینه شده است. در صورت نیاز به تغییرات خاص، آن را ویرایش کنید.

## تست سیستم

### 1. تست اتصال
1. فایل `test-booking-api.html` را در مرورگر باز کنید
2. دکمه "تست اتصال" را کلیک کنید
3. مطمئن شوید که پیام موفقیت دریافت می‌کنید

### 2. تست فرم اصلی
1. فرم رزرو را در سایت اصلی باز کنید
2. یک درخواست تست ارسال کنید
3. ایمیل تأیید را بررسی کنید

## عیب‌یابی DirectAdmin

### مشکلات رایج

#### 1. خطای 500 Internal Server Error
**علت**: مشکل در تنظیمات PHP یا .htaccess
**راه حل**:
- بررسی لاگ‌های خطا در **Logs > Error Log**
- بررسی مجوزهای فایل‌ها
- غیرفعال کردن موقت .htaccess

#### 2. عدم ارسال ایمیل
**علت**: مشکل در تنظیمات mail server
**راه حل**:
- بررسی **Email > Email Configuration**
- تست ارسال ایمیل از DirectAdmin
- بررسی تنظیمات SPF و DKIM

#### 3. خطای CORS
**علت**: مشکل در تنظیمات .htaccess
**راه حل**:
- بررسی فعال بودن `mod_headers`
- بررسی تنظیمات CORS در .htaccess

#### 4. خطای 404
**علت**: مشکل در مسیر فایل‌ها
**راه حل**:
- بررسی مسیر فایل‌ها در File Manager
- بررسی تنظیمات rewrite در .htaccess

### بررسی لاگ‌ها

#### الف) لاگ‌های DirectAdmin
1. به **Logs > Error Log** بروید
2. خطاهای مربوط به دامنه خود را بررسی کنید

#### ب) لاگ‌های PHP
1. فایل `bookings.log` را در پوشه `api` بررسی کنید
2. فایل‌های `rate_limit_*.log` را بررسی کنید

#### ج) لاگ‌های سرور
1. به **Logs > System Log** بروید
2. خطاهای مربوط به Apache را بررسی کنید

## بهینه‌سازی DirectAdmin

### 1. تنظیمات Apache
```apache
# در .htaccess
# فعال کردن فشرده‌سازی
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json
</IfModule>

# تنظیم کش
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 2. تنظیمات PHP
```php
// در config.php
ini_set('max_execution_time', 300);
ini_set('memory_limit', '256M');
ini_set('post_max_size', '10M');
```

### 3. تنظیمات امنیت
```apache
# در .htaccess
Header always set X-Content-Type-Options "nosniff"
Header always set X-Frame-Options "SAMEORIGIN"
Header always set X-XSS-Protection "1; mode=block"
```

## پشتیبانی

### منابع کمک
1. **مستندات DirectAdmin**: https://docs.directadmin.com/
2. **انجمن DirectAdmin**: https://forum.directadmin.com/
3. **لاگ‌های سیستم**: بخش Logs در DirectAdmin

### تماس با پشتیبانی
در صورت بروز مشکل:
1. لاگ‌های خطا را جمع‌آوری کنید
2. تصاویر از صفحه خطا تهیه کنید
3. مراحل انجام شده را مستند کنید
4. با پشتیبانی هاست تماس بگیرید

## نکات مهم

### 1. امنیت
- همیشه از HTTPS استفاده کنید
- فایل‌های حساس را خارج از `public_html` قرار دهید
- مجوزهای فایل‌ها را محدود کنید

### 2. عملکرد
- از CDN برای فایل‌های استاتیک استفاده کنید
- فشرده‌سازی را فعال کنید
- کش مرورگر را تنظیم کنید

### 3. پشتیبان‌گیری
- به طور منظم از فایل‌ها پشتیبان تهیه کنید
- از دیتابیس (در صورت وجود) پشتیبان تهیه کنید
- تنظیمات DirectAdmin را ذخیره کنید
