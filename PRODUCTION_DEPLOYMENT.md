# 🚀 راهنمای Deployment سیستم SalamatLab

## 📋 پیش‌نیازها

### 1. سرور Requirements
- **PHP**: 8.0 یا بالاتر
- **MySQL**: 8.0.30 (تأیید شده)
- **Web Server**: Apache/Nginx
- **SSL Certificate**: برای HTTPS
- **Memory**: حداقل 512MB RAM
- **Storage**: حداقل 1GB فضای خالی

### 2. اطلاعات دیتابیس (آماده)
```
Host: salamatlabdb
Port: 3306
User: root
Password: LbGsohGHihr1oZ7l8Jt1Vvb0
Database: musing_merkle
Version: 8.0.30
```

### 3. SMS API (آماده)
```
Provider: SMS.ir
API Key: jClChBBaWXvfhHfqhBrIDIcwV5tzSj7GRVTZavQEFTPcYgqV
Template ID: 165688
```

## 🛠️ مراحل Deployment

### مرحله 1: آپلود فایل‌ها

1. **آپلود کامل پروژه** به سرور
2. **تنظیم Document Root** روی پوشه `public`
3. **بررسی مجوزها**:
   ```bash
   chmod 755 public/api/core/
   chmod 644 public/api/core/*.php
   mkdir public/api/logs
   chmod 755 public/api/logs
   ```

### مرحله 2: تنظیم Environment

#### روش 1: استفاده از Setup Script

**Linux/Mac:**
```bash
./setup-production.sh
```

**Windows:**
```cmd
setup-production.bat
```

#### روش 2: دستی
1. **کپی کردن فایل نمونه**:
   ```bash
   cp env.example .env
   ```

2. **ویرایش فایل .env** با اطلاعات صحیح

### مرحله 3: راه‌اندازی دیتابیس

1. **اجرای Database Schema**:
   ```bash
   mysql -h salamatlabdb -u root -pLbGsohGHihr1oZ7l8Jt1Vvb0 musing_merkle < database-schema.sql
   ```

2. **یا استفاده از PHP**:
   ```bash
   php public/api/init-database.php
   ```

### مرحله 4: تست سیستم

1. **تست کامل معماری**:
   ```bash
   curl -X POST https://yourdomain.com/api/status.php
   ```

2. **تست Authentication**:
   ```bash
   curl -X POST https://yourdomain.com/api/auth.php \
     -H "Content-Type: application/json" \
     -d '{"action": "check_status"}'
   ```

3. **تست SMS (اختیاری)**:
   ```bash
   php public/api/test-sms.php
   ```

## 🔧 تنظیمات Web Server

### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.html [QSA,L]

# API Routes
RewriteRule ^api/(.*)$ api/$1 [L]

# Security Headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

### Nginx
```nginx
server {
    listen 80;
    server_name salamatlab.com www.salamatlab.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name salamatlab.com www.salamatlab.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /path/to/salamatlab/public;
    index index.html index.php;
    
    # API Routes
    location /api/ {
        try_files $uri $uri/ /api/index.php?$query_string;
        
        location ~ \.php$ {
            fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
            fastcgi_index index.php;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            include fastcgi_params;
        }
    }
    
    # Frontend Routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security Headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}
```

## 🔐 تنظیمات امنیتی

### 1. تغییر رمز Admin
```bash
# تولید hash جدید
php -r "echo password_hash('your_secure_password', PASSWORD_BCRYPT);"

# بروزرسانی در .env
ADMIN_PASSWORD_HASH=new_generated_hash
```

### 2. تنظیم شماره تلفن Staff
```bash
# در فایل .env
STAFF_NOTIFY_MOBILE=09123456789
```

### 3. تنظیم دامنه‌های مجاز
```bash
# در فایل .env
ALLOWED_ORIGINS=https://salamatlab.com,https://www.salamatlab.com
```

### 4. تولید Security Keys جدید
```bash
# برای تولید کلیدهای امن
php -r "echo bin2hex(random_bytes(32));"
```

## 📊 مانیتورینگ و Logging

### 1. مسیرهای Log
```
public/api/logs/bookings.log
public/api/logs/contacts.log
public/api/logs/rate_limit_*.log
public/api/logs/system.log
```

### 2. Monitoring Endpoints
```
GET /api/status.php - سلامت سیستم
GET /api/ping.php - پاسخ ساده
```

### 3. تنظیم Log Rotation
```bash
# در crontab
0 0 * * * find /path/to/logs -name "*.log" -mtime +7 -delete
```

## 🚨 عیب‌یابی

### مشکلات رایج و راه‌حل

1. **خطای اتصال دیتابیس**:
   - بررسی اطلاعات دیتابیس در .env
   - تست اتصال: `php public/api/test-connection.php`

2. **خطای SMS**:
   - بررسی API key در .env
   - تست SMS: `php public/api/test-sms.php`

3. **خطای مجوزها**:
   ```bash
   chmod -R 755 public/api/
   chmod 600 .env
   ```

4. **خطای CORS**:
   - بررسی ALLOWED_ORIGINS در .env
   - بررسی تنظیمات web server

### 5. بررسی Logs
```bash
# آخرین خطاها
tail -f public/api/logs/system.log

# تست خطای خاص
grep "ERROR" public/api/logs/*.log
```

## ✅ Checklist نهایی

- [ ] فایل‌ها آپلود شده
- [ ] فایل .env ایجاد شده
- [ ] Database schema اجرا شده
- [ ] مجوزها تنظیم شده
- [ ] SSL certificate نصب شده
- [ ] Web server تنظیم شده
- [ ] رمز admin تغییر کرده
- [ ] شماره staff تنظیم شده
- [ ] Domain های CORS صحیح هستند
- [ ] تست status.php موفق
- [ ] تست authentication موفق
- [ ] تست SMS موفق (اختیاری)
- [ ] Monitoring تنظیم شده

## 📞 پشتیبانی

در صورت بروز مشکل:
1. بررسی logs در `public/api/logs/`
2. اجرای `php public/api/status.php`
3. تست اتصال دیتابیس
4. بررسی تنظیمات web server

---

🎉 **سیستم آماده بهره‌برداری است!**

معماری جدید SalamatLab شامل:
- ✅ Environment Management یکپارچه
- ✅ Authentication امن و استاندارد
- ✅ Database Connection Pooling
- ✅ Session Management حرفه‌ای
- ✅ Error Handling جامع
- ✅ API Standardization
- ✅ Production-ready Security
