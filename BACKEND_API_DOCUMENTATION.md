# 🏥 **مستندات Backend API - آزمایشگاه سلامت**

## 📋 **فهرست مطالب**
- [معرفی](#معرفی)
- [معماری سیستم](#معماری-سیستم)
- [راه‌اندازی](#راه‌اندازی)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [امنیت](#امنیت)
- [لاگ‌گذاری](#لاگ‌گذاری)
- [عیب‌یابی](#عیب‌یابی)

---

## 🎯 **معرفی**

Backend API آزمایشگاه سلامت یک سیستم کامل مدیریت خدمات پزشکی است که شامل:

- **مدیریت کاربران** با احراز هویت OTP
- **خدمات پزشکی** (چکاپ، نمونه‌گیری در محل)
- **مدیریت محتوا** (وبلاگ، دکترها)
- **پنل ادمین** برای مدیریت سیستم

### **ویژگی‌های کلیدی:**
- ✅ **OTP واقعی** با SMS.ir
- ✅ **MySQL Database** بهینه شده
- ✅ **RESTful API** استاندارد
- ✅ **لاگ‌گذاری پیشرفته**
- ✅ **امنیت بالا** با Rate Limiting
- ✅ **مستندسازی کامل**

---

## 🏗️ **معماری سیستم**

```
📁 public/api/
├── core/                   # کلاس‌های اصلی
│   ├── Database.php        # مدیریت دیتابیس
│   ├── Logger.php          # سیستم لاگ‌گذاری
│   └── Response.php        # مدیریت پاسخ‌ها
├── users-new.php          # API مدیریت کاربران
├── medical-services.php   # API خدمات پزشکی
├── init-database.php      # راه‌اندازی دیتابیس
└── database-schema.sql    # Schema دیتابیس
```

### **اجزای اصلی:**

#### **1. Database Class**
- اتصال Singleton به MySQL
- عملیات CRUD بهینه شده
- مدیریت Transaction
- Connection Pooling

#### **2. Logger Class**
- لاگ‌گذاری سطح‌بندی شده
- ذخیره در فایل JSON
- جستجو و فیلتر لاگ‌ها
- آمارگیری

#### **3. Response Class**
- پاسخ‌های استاندارد JSON
- مدیریت CORS
- کدهای HTTP صحیح
- پیام‌های فارسی

---

## 🚀 **راه‌اندازی**

### **پیش‌نیازها:**
- PHP 8.0+
- MySQL 8.0+
- اتصال اینترنت (برای SMS)

### **مراحل راه‌اندازی:**

#### **گام 1: تنظیم دیتابیس**
```bash
# اطلاعات دیتابیس لیارا
Host: salamatlabdb
Database: musing_merkle  
Username: root
Password: LbGsohGHihr1oZ7l8Jt1Vvb0
Port: 3306
```

#### **گام 2: راه‌اندازی جداول**
```bash
# دستور مستقیم
curl "https://salamatlab.liara.run/api/init-database.php?action=init"

# یا از مرورگر
https://salamatlab.liara.run/api/init-database.php?action=init
```

#### **گام 3: بررسی وضعیت**
```bash
curl "https://salamatlab.liara.run/api/init-database.php?action=status"
```

### **پاسخ نمونه راه‌اندازی:**
```json
{
  "success": true,
  "data": {
    "steps": [
      {
        "name": "ایجاد جداول دیتابیس",
        "success": true,
        "details": ["تمام جداول با موفقیت ایجاد شدند"]
      },
      {
        "name": "درج داده‌های اولیه", 
        "success": true,
        "details": ["14 تنظیم سیستم", "18 سرویس پزشکی", "5 دکتر نمونه"]
      }
    ]
  },
  "message": "راه‌اندازی دیتابیس کامل شد"
}
```

---

## 🔗 **API Endpoints**

### **Base URL:**
```
Production: https://salamatlab.liara.run/api/
Development: http://localhost:5173/api/
```

---

## 👤 **User Management API**
**File:** `users-new.php`

### **1. دریافت اطلاعات کاربر**
```http
GET /users-new.php?phone=09123456789
```

**پاسخ موفق:**
```json
{
  "success": true,
  "data": {
    "exists": true,
    "user": {
      "id": "1",
      "phone": "09123456789",
      "first_name": "احمد",
      "last_name": "محمدی",
      "email": "ahmad@example.com",
      "is_profile_complete": true,
      "created_at": "2024-01-15 10:30:00"
    }
  }
}
```

### **2. ارسال کد OTP**
```http
POST /users-new.php
Content-Type: application/json

{
  "action": "sendOtp",
  "phone": "09123456789"
}
```

**پاسخ موفق:**
```json
{
  "success": true,
  "data": {
    "message": "کد تایید ارسال شد",
    "expires_in": 300
  }
}
```

### **3. تایید کد OTP**
```http
POST /users-new.php
Content-Type: application/json

{
  "action": "verifyOtp",
  "phone": "09123456789",
  "code": "123456"
}
```

**پاسخ موفق:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "1",
      "phone": "09123456789",
      "is_profile_complete": false,
      "created_at": "2024-01-15 10:30:00"
    },
    "isNewUser": true
  }
}
```

### **4. به‌روزرسانی پروفایل**
```http
POST /users-new.php
Content-Type: application/json

{
  "action": "updateProfile",
  "userId": "1",
  "first_name": "احمد",
  "last_name": "محمدی",
  "email": "ahmad@example.com",
  "national_id": "1234567890",
  "birth_date": "1990-01-01",
  "gender": "male",
  "city": "تهران"
}
```

---

## 🏥 **Medical Services API**
**File:** `medical-services.php`

### **1. دریافت لیست سرویس‌ها**
```http
GET /medical-services.php?action=services&category=laboratory
```

**پاسخ موفق:**
```json
{
  "success": true,
  "data": {
    "services": [
      {
        "id": 1,
        "name": "آزمایش خون کامل",
        "category": "laboratory",
        "description": "شامل شمارش گلبول‌های قرمز، سفید و پلاکت",
        "base_price": 120000,
        "home_service_price": 150000,
        "home_service_available": true
      }
    ],
    "total": 1
  }
}
```

### **2. دریافت لیست دکترها**
```http
GET /medical-services.php?action=doctors&specialty=cardiology
```

### **3. ثبت درخواست چکاپ**
```http
POST /medical-services.php
Content-Type: application/json

{
  "action": "submit-checkup",
  "user_id": 1,
  "service_id": 1,
  "doctor_id": 2,
  "title": "چکاپ قلب",
  "patient_name": "احمد محمدی",
  "patient_phone": "09123456789",
  "patient_national_id": "1234567890",
  "preferred_date": "2024-01-20",
  "preferred_time": "10:00",
  "patient_notes": "درد قفسه سینه"
}
```

**پاسخ موفق:**
```json
{
  "success": true,
  "data": {
    "request_id": 15,
    "message": "درخواست شما با موفقیت ثبت شد"
  }
}
```

### **4. ثبت درخواست نمونه‌گیری در محل**
```http
POST /medical-services.php
Content-Type: application/json

{
  "action": "submit-sampling",
  "user_id": 1,
  "service_ids": [1, 2, 3],
  "title": "نمونه‌گیری در منزل",
  "patient_name": "احمد محمدی",
  "patient_phone": "09123456789",
  "custom_address": "تهران، خیابان ولیعصر، پلاک 123",
  "address_latitude": 35.6892,
  "address_longitude": 51.3890,
  "preferred_date": "2024-01-21",
  "preferred_time_start": "09:00",
  "preferred_time_end": "12:00"
}
```

**پاسخ موفق:**
```json
{
  "success": true,
  "data": {
    "request_id": 25,
    "estimated_price": {
      "service_price": 350000,
      "transport_price": 50000,
      "total_price": 400000
    },
    "message": "درخواست نمونه‌گیری در محل ثبت شد"
  }
}
```

### **5. دریافت درخواست‌های کاربر**
```http
GET /medical-services.php?action=checkup-requests&user_id=1&status=pending
GET /medical-services.php?action=sampling-requests&user_id=1&limit=10&offset=0
```

---

## 🗄️ **Database Schema**

### **جداول اصلی:**

#### **1. users - کاربران**
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    national_id VARCHAR(10) UNIQUE,
    birth_date DATE,
    gender ENUM('male', 'female'),
    city VARCHAR(50),
    province VARCHAR(50),
    has_basic_insurance ENUM('yes', 'no') DEFAULT 'no',
    basic_insurance VARCHAR(100),
    complementary_insurance VARCHAR(100),
    is_profile_complete BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### **2. otp_codes - کدهای تایید**
```sql
CREATE TABLE otp_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(11) NOT NULL,
    code VARCHAR(6) NOT NULL,
    purpose ENUM('login', 'register', 'reset_password') DEFAULT 'login',
    is_used BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 5,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);
```

#### **3. medical_services - سرویس‌های پزشکی**
```sql
CREATE TABLE medical_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    description TEXT,
    base_price DECIMAL(10, 2),
    home_service_price DECIMAL(10, 2),
    duration_minutes INT,
    home_service_available BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);
```

#### **4. checkup_requests - درخواست‌های چکاپ**
```sql
CREATE TABLE checkup_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_id INT,
    doctor_id INT,
    title VARCHAR(200) NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(11) NOT NULL,
    status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### **روابط دیتابیس:**
```
users (1) ←→ (N) user_addresses
users (1) ←→ (N) checkup_requests  
users (1) ←→ (N) home_sampling_requests
medical_services (1) ←→ (N) checkup_requests
doctors (1) ←→ (N) checkup_requests
```

---

## 🔒 **امنیت**

### **1. Rate Limiting**
- **محدودیت:** 100 درخواست در ساعت به ازای هر IP
- **پیاده‌سازی:** در تابع `checkRateLimit()`
- **پاسخ خطا:** HTTP 429

### **2. اعتبارسنجی ورودی**
```php
// اعتبارسنجی شماره تلفن
private function validatePhone(string $phone): ?string {
    $phone = preg_replace('/[^0-9]/', '', $phone);
    
    if (strlen($phone) === 11 && substr($phone, 0, 2) === '09') {
        return $phone;
    }
    return null;
}
```

### **3. SQL Injection Prevention**
- استفاده از Prepared Statements
- Parameterized Queries
- Input Sanitization

### **4. OTP Security**
- **انقضا:** 5 دقیقه
- **حداکثر تلاش:** 5 بار
- **محدودیت زمانی:** 1 درخواست در دقیقه

### **5. CORS Headers**
```php
'Access-Control-Allow-Origin' => '*',
'Access-Control-Allow-Methods' => 'GET, POST, PUT, DELETE, OPTIONS',
'Access-Control-Allow-Headers' => 'Content-Type, Authorization'
```

---

## 📊 **لاگ‌گذاری**

### **سطوح لاگ:**
- **DEBUG:** اطلاعات توسعه
- **INFO:** عملیات عادی
- **WARNING:** هشدارها
- **ERROR:** خطاهای قابل برطرف
- **CRITICAL:** خطاهای جدی

### **فرمت لاگ:**
```json
{
  "timestamp": "2024-01-15 10:30:45",
  "level": "INFO",
  "message": "User login successful",
  "context": {
    "user_id": 123,
    "phone": "09123456789"
  },
  "request": {
    "method": "POST",
    "uri": "/api/users-new.php",
    "ip": "192.168.1.100"
  }
}
```

### **مدیریت لاگ‌ها:**
```php
// دریافت آخرین لاگ‌ها
Logger::getRecentLogs(100);

// جستجو در لاگ‌ها  
Logger::searchLogs('user login', 50);

// آمار لاگ‌ها
Logger::getLogStats();
```

---

## 🔧 **عیب‌یابی**

### **خطاهای رایج:**

#### **1. خطای اتصال دیتابیس**
```json
{
  "success": false,
  "error": "خطا در اتصال به پایگاه داده"
}
```
**راه حل:** بررسی اطلاعات اتصال در `Database.php`

#### **2. خطای ارسال SMS**
```json
{
  "success": false,
  "error": "خطا در ارسال پیامک"
}
```
**راه حل:** بررسی API Key و Template ID در `sendSms()`

#### **3. خطای Rate Limiting**
```json
{
  "success": false,
  "error": "تعداد درخواست‌ها بیش از حد مجاز"
}
```
**راه حل:** کاهش تعداد درخواست‌ها یا افزایش محدودیت

### **Debug Mode:**
```php
// فعال کردن حالت دیباگ
define('ENVIRONMENT', 'development');

// نمایش جزئیات خطا
Response::error('خطا', 500, $debugDetails);
```

### **بررسی لاگ‌ها:**
```bash
# مشاهده آخرین لاگ‌ها
tail -f /tmp/salamatlab.log

# جستجو برای خطاها
grep "ERROR\|CRITICAL" /tmp/salamatlab.log
```

---

## 📈 **نظارت و آمار**

### **API Health Check:**
```http
GET /init-database.php?action=status
```

### **آمار عملکرد:**
- تعداد کاربران فعال
- درخواست‌های روزانه
- میانگین زمان پاسخ
- نرخ خطا

### **Monitoring Tools:**
- **Logger Class:** آمار داخلی
- **Database Status:** وضعیت جداول
- **Error Tracking:** ردیابی خطاها

---

## 🚀 **بهینه‌سازی**

### **Database Optimization:**
- **Indexing:** ایندکس‌های بهینه
- **Query Optimization:** بهبود کوئری‌ها
- **Connection Pooling:** مدیریت اتصالات

### **Caching Strategy:**
- **Response Caching:** کش پاسخ‌ها
- **Database Caching:** کش نتایج
- **Static Content:** فایل‌های استاتیک

### **Performance Tips:**
```php
// استفاده از prepared statements
$stmt = $this->db->prepare($sql);
$stmt->execute($params);

// Batch operations
$this->db->beginTransaction();
// multiple operations
$this->db->commit();
```

---

## 🎯 **نتیجه‌گیری**

Backend API آزمایشگاه سلامت یک سیستم کامل و قابل اعتماد است که:

- ✅ **امنیت بالا** دارد
- ✅ **مقیاس‌پذیر** است  
- ✅ **قابل نگهداری** است
- ✅ **مستندسازی کامل** دارد
- ✅ **آماده production** است

برای اطلاعات بیشتر یا گزارش مشکل، با تیم توسعه تماس بگیرید.

---

**📞 پشتیبانی فنی:** info@salamatlab.com  
**🌐 وبسایت:** https://salamatlab.liara.run  
**📅 آخرین بروزرسانی:** 17 شهریور 1404
