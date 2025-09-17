# راهنمای راه‌اندازی Backend اصلاح شده

## 🔧 تغییرات اعمال شده

### ✅ مشکلات برطرف شده:

1. **امنیت**: 
   - حذف اطلاعات حساس از فایل‌های کد
   - استفاده از Environment Variables
   - اصلاح SQL Injection vulnerabilities
   - بهبود سیستم احراز هویت

2. **ساختار کد**:
   - Refactor فایل‌های API با OOP pattern
   - حذف کدهای تکراری
   - ایجاد کلاس‌های Database، Logger، Response
   - سازماندهی بهتر کد

3. **دیتابیس**:
   - Schema بهینه و استاندارد
   - استفاده از Prepared Statements
   - Foreign Key constraints
   - Proper indexing

## 🚀 راه‌اندازی در پلتفرم SaaS

### مرحله 1: تنظیم Environment Variables

در پنل SaaS خود، این متغیرها را تنظیم کنید:

```bash
# دیتابیس
DB_HOST=your_database_host
DB_NAME=your_database_name  
DB_USER=your_database_user
DB_PASS=your_secure_database_password

# امنیت
OTP_SECRET=your_32_character_or_longer_secret_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password

# پیامک (SMS.ir) - مطابق مستندات رسمی
SMSIR_API_KEY=your_sms_api_key_from_panel
SMSIR_TEMPLATE_ID=your_otp_template_id
SMSIR_TEMPLATE_PARAM_NAME=Code
CHECKUP_CONFIRM_TEMPLATE_ID=your_checkup_template_id
SMSIR_STAFF_TEMPLATE_ID=your_staff_template_id

# ایمیل
ADMIN_EMAIL=admin@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com
REPLY_TO_EMAIL=info@yourdomain.com

# CORS
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
RATE_LIMIT=100

# اعلان‌ها
STAFF_NOTIFY_MOBILE=09xxxxxxxxx
```

### مرحله 2: تولید رمز عبور Admin

برای تولید hash رمز عبور admin:

```php
<?php
echo password_hash('your_secure_password', PASSWORD_DEFAULT);
?>
```

### مرحله 3: تست سیستم

پس از آپلود فایل‌ها، این URLها را باز کنید:

#### تست دیتابیس و کانفیگ عمومی:
```
https://yourdomain.com/api/test-connection.php
```

#### تست سیستم SMS.ir:
```
https://yourdomain.com/api/test-sms.php
```

#### تست Live ارسال SMS (اختیاری):
```
https://yourdomain.com/api/test-sms.php?live_test=1&test_phone=09123456789
```

باید خروجی شبیه این ببینید:
```json
{
    "database_connection": "SUCCESS ✅",
    "table_creation": "SUCCESS ✅", 
    "crud_operations": "SUCCESS ✅",
    "sms_config": {"SMSIR_API_KEY": "SET ✅"},
    "overall_status": "ALL TESTS PASSED ✅"
}
```

## 📁 ساختار فایل‌های اصلاح شده

```
public/api/
├── config.php (اصلاح شده - امن)
├── users.php (بازنویسی شده با OOP)
├── booking.php (بازنویسی شده با OOP)
├── test-connection.php (جدید)
├── test-sms.php (جدید - تست SMS.ir)
├── core/
│   ├── Database.php (اصلاح شده - امن)
│   ├── Logger.php (بهبود یافته)
│   ├── Response.php (جدید)
│   └── AdminAuth.php (اصلاح شده - امن)
```

## 🔐 ویژگی‌های امنیتی جدید

### 1. Input Validation
- تمام ورودی‌ها sanitize می‌شوند
- Validation قوی برای شماره تلفن، کد ملی، ایمیل
- SQL Injection prevention با Prepared Statements

### 2. Authentication
- OTP system امن با expiration
- Admin authentication با bcrypt
- Session management بهبود یافته

### 3. Rate Limiting
- محدودیت تعداد درخواست‌ها
- IP-based tracking
- Automatic blocking

### 4. Logging
- تمام عملیات log می‌شوند
- سطوح مختلف log (info, warning, error, critical)
- Context-aware logging

### 5. SMS Integration
- مطابق مستندات رسمی SMS.ir
- Template-based messaging
- Comprehensive error handling
- Live testing capabilities

## 📊 API Endpoints

### User Management
```
GET  /api/users.php?action=profile&phone=09xxxxxxxxx
POST /api/users.php {"action": "register", "phone": "09xxxxxxxxx"}
POST /api/users.php {"action": "verify_otp", "phone": "09xxxxxxxxx", "code": "123456"}
```

### Booking System  
```
POST /api/booking.php {
  "fullName": "نام و نام خانوادگی",
  "phone": "09xxxxxxxxx",
  "nationalCode": "1234567890",
  "birthDate": "1990-01-01",
  "gender": "male",
  "city": "تهران",
  "hasBasicInsurance": "yes",
  "basicInsurance": "تامین اجتماعی",
  "type": "checkup",
  "title": "چکاپ عمومی"
}
```

## 🐛 عیب‌یابی

### خطاهای رایج:

1. **Database Connection Failed**
   - بررسی Environment Variables
   - تست اتصال دیتابیس از پنل هاست

2. **SMS Not Sending**
   - بررسی SMSIR_API_KEY در Environment Variables
   - تست Template ID در پنل SMS.ir
   - اجرای `/api/test-sms.php` برای تشخیص مشکل
   - مطالعه فایل راهنمای `SMS_SETUP_GUIDE.md`

3. **Admin Login Failed**  
   - بررسی ADMIN_PASSWORD_HASH
   - مطمئن شوید از bcrypt استفاده کرده‌اید

4. **CORS Errors**
   - بررسی ALLOWED_ORIGINS
   - اضافه کردن domain صحیح

### فایل‌های Log:

- `/tmp/salamat-app.log` - لاگ‌های عمومی
- `/tmp/bookings.log` - لاگ‌های رزرو  
- Error logs در پنل هاست

## 📞 پشتیبانی

در صورت بروز مشکل:

1. اول `/api/test-connection.php` را چک کنید
2. سپس `/api/test-sms.php` را برای تست SMS بررسی کنید
3. لاگ‌ها را بررسی کنید
4. Environment Variables را تایید کنید
5. راهنمای `SMS_SETUP_GUIDE.md` را مطالعه کنید
6. Syntax errors احتمالی را بررسی کنید

## 🔄 بروزرسانی‌های آینده

- [ ] Two-factor authentication
- [ ] Advanced rate limiting
- [ ] Cache layer
- [ ] API versioning
- [ ] Real-time notifications

---

**توجه**: این Backend کاملاً refactor شده و برای production آماده است. قبل از استفاده در production، حتماً test کنید.
