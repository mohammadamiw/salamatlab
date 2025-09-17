# راهنمای جامع حل مشکل از دست رفتن داده‌ها

## 🔍 مشکل فعلی

هر بار که سایت را آپدیت می‌کنید، تمام داده‌های کاربران (رزروها، تماس‌ها، نظرسنجی‌ها) پاک می‌شود. این مشکل به دلیل ذخیره‌سازی داده‌ها در فایل‌های داخل پوشه `dist` رخ می‌دهد که در هنگام آپلود دوباره، overwritten می‌شوند.

## ✅ راه‌حل‌های ارائه شده

### 1. جداسازی داده‌ها از فایل‌های وب (Immediate Solution)

#### تغییرات انجام شده:
- ایجاد پوشه `salamatlab_data/` خارج از `public_html/`
- انتقال تمام فایل‌های داده به این پوشه امن
- ایجاد سیستم پشتیبان‌گیری خودکار
- ایجاد اسکریپت استقرار امن

#### مزایا:
- ✅ داده‌ها در هنگام آپدیت پاک نمی‌شوند
- ✅ پشتیبان‌گیری خودکار قبل از هر استقرار
- ✅ امنیت بالاتر (فایل‌ها خارج از دسترسی وب)
- ✅ امکان بازیابی سریع در صورت مشکل

#### نحوه استفاده:

1. **اولین بار - راه‌اندازی سیستم:**
   ```bash
   # آپلود فایل‌های جدید به هاست
   upload: setup-data-directory.php
   upload: deploy-safe.php

   # دسترسی به اسکریپت راه‌اندازی
   visit: https://yourdomain.com/setup-data-directory.php
   ```

2. **انتقال داده‌های موجود:**
   - اگر قبلاً داده‌ای دارید، آنها را در `salamatlab_data/` کپی کنید
   - فایل‌های `bookings.log`, `contacts.log`, `requests_store.json` را انتقال دهید

3. **استقرار نسخه‌های جدید:**
   ```bash
   # دسترسی به پنل استقرار امن
   visit: https://yourdomain.com/deploy-safe.php

   # یا استفاده از FTP برای آپلود مستقیم در salamatlab_data/
   ```

### 2. مهاجرت به دیتابیس واقعی (Long-term Solution)

#### مزایای استفاده از دیتابیس:
- 🚀 عملکرد بهتر با داده‌های زیاد
- 🔍 امکان جستجو و فیلتر پیشرفته
- 📊 گزارش‌گیری آسان
- 🔒 امنیت بالاتر
- 📈 قابلیت توسعه

#### گزینه‌های دیتابیس:

##### الف) MySQL/MariaDB (رایگان با هاست)
```sql
-- ایجاد دیتابیس
CREATE DATABASE salamatlab_db;

-- جدول رزروها
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    request_id VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    national_code VARCHAR(20) NOT NULL,
    birth_date DATE,
    gender ENUM('male', 'female'),
    city VARCHAR(100),
    has_basic_insurance BOOLEAN DEFAULT FALSE,
    basic_insurance VARCHAR(255),
    complementary_insurance VARCHAR(255),
    address TEXT,
    neighborhood VARCHAR(255),
    street VARCHAR(255),
    plaque VARCHAR(50),
    unit VARCHAR(50),
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    notes TEXT,
    prescription_files JSON,
    price DECIMAL(10, 2),
    type ENUM('booking', 'checkup') DEFAULT 'booking',
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- جدول تماس‌ها
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- جدول نظرسنجی‌ها
CREATE TABLE feedbacks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

##### ب) PostgreSQL (پیشرفته‌تر)
```sql
-- PostgreSQL Schema
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    request_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    -- ... سایر فیلدها
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

##### ج) SQLite (بدون نیاز به سرور جداگانه)
```php
// اتصال به SQLite
$db = new PDO('sqlite:' . DATA_DIR . 'salamatlab.db');

// ایجاد جداول
$db->exec("
    CREATE TABLE IF NOT EXISTS bookings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        request_id TEXT UNIQUE,
        full_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        -- ... سایر فیلدها
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
");
```

#### اسکریپت مهاجرت از فایل به دیتابیس:

```php
<?php
// migrate-to-database.php
function migrateBookingsToDatabase($db) {
    $log_file = DATA_DIR . 'bookings.log';

    if (!file_exists($log_file)) {
        return ['success' => false, 'message' => 'فایل لاگ وجود ندارد'];
    }

    $lines = file($log_file, FILE_IGNORE_NEW_LINES);
    $migrated = 0;

    foreach ($lines as $line) {
        // Parse log line and insert to database
        $parts = explode(' | ', $line);
        if (count($parts) >= 6) {
            $stmt = $db->prepare("
                INSERT OR IGNORE INTO bookings
                (request_id, type, full_name, phone, city, national_code, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");

            // Generate request_id from timestamp or use incremental
            $request_id = 'migrated_' . $migrated;
            $type = strpos($parts[1], 'checkup') !== false ? 'checkup' : 'booking';

            $stmt->execute([
                $request_id,
                $type,
                $parts[2], // full_name
                $parts[3], // phone
                $parts[4], // city
                $parts[5], // national_code
                date('Y-m-d H:i:s')
            ]);

            $migrated++;
        }
    }

    return ['success' => true, 'migrated' => $migrated];
}
```

### 3. راهکارهای استقرار پیشرفته

#### الف) استفاده از Git و CI/CD
```bash
# استقرار با rsync (حفظ داده‌ها)
rsync -av --exclude='salamatlab_data/' --exclude='salamatlab_backups/' ./dist/ user@server:/path/to/public_html/

# استقرار با Git
cd /path/to/website
git pull origin main
npm run build
```

#### ب) Docker برای توسعه محلی
```dockerfile
# Dockerfile
FROM php:8.1-apache
COPY . /var/www/html/
RUN chown -R www-data:www-data /var/www/html/salamatlab_data/
```

#### ج) استفاده از Cloudflare Pages + Database
- استقرار frontend در Cloudflare Pages
- استفاده از Cloudflare D1 (SQLite) یا PlanetScale (MySQL)

## 📋 چک لیست استقرار امن

### قبل از استقرار:
- [ ] پشتیبان‌گیری از داده‌های فعلی
- [ ] تست نسخه جدید در محیط local
- [ ] بررسی فایل‌های ضروری (config.php, API files)
- [ ] اطمینان از وجود پوشه `salamatlab_data/`

### مراحل استقرار:
1. [ ] آپلود فایل‌ها به هاست (به جز پوشه data)
2. [ ] اجرای تست‌ها
3. [ ] بررسی لاگ‌ها
4. [ ] پاک کردن کش مرورگر

### بعد از استقرار:
- [ ] تست فرم رزرو
- [ ] تست فرم تماس
- [ ] بررسی ایمیل‌ها
- [ ] تست پنل مدیریت

## 🔧 عیب‌یابی

### مشکل: داده‌ها پاک می‌شوند
**راه‌حل:** اطمینان حاصل کنید که فایل‌ها در `salamatlab_data/` قرار دارند

### مشکل: خطای دسترسی فایل
**راه‌حل:** بررسی permission‌های پوشه data
```bash
chmod 755 /home/user/salamatlab_data/
chmod 644 /home/user/salamatlab_data/*.log
```

### مشکل: خطای دیتابیس
**راه‌حل:** بررسی connection string و credentials

## 📞 پشتیبانی

در صورت مشکل:
1. لاگ‌های سرور را بررسی کنید
2. فایل `error_log` را ببینید
3. از پشتیبان برای بازیابی استفاده کنید
4. با توسعه‌دهنده تماس بگیرید

## 🎯 نتیجه‌گیری

با پیاده‌سازی این راه‌حل‌ها:
- ✅ داده‌ها دیگر پاک نمی‌شوند
- ✅ پشتیبان‌گیری خودکار انجام می‌شود
- ✅ امنیت بالاتر حاصل می‌شود
- ✅ امکان مهاجرت به دیتابیس واقعی فراهم می‌شود
- ✅ فرآیند استقرار ساده‌تر می‌شود

**توصیه:** از سیستم فعلی استفاده کنید و همزمان برنامه‌ریزی برای مهاجرت به دیتابیس واقعی را انجام دهید.
