# 🚀 **راهنمای گام به گام استقرار Backend در لیارا**

## 📋 **پیش‌نیازها**

### **1. حساب کاربری لیارا**
- ثبت‌نام در [liara.ir](https://liara.ir)
- شارژ حساب
- CLI لیارا نصب شده

### **2. پروژه آماده**
- کدهای backend در `public/api/`
- فایل‌های تنظیمات آماده
- متغیرهای محیطی مشخص

---

## ⚙️ **گام ۱: تنظیم متغیرهای محیطی**

### **روش ۱: از طریق پنل لیارا (توصیه شده)**

1. **ورود به پنل لیارا:**
   ```
   https://console.liara.ir/
   ```

2. **انتخاب اپلیکیشن:**
   - `salamatlab-backend` را انتخاب کنید
   - یا اگر وجود ندارد، اپ جدید ایجاد کنید

3. **بخش Environment Variables:**
   - روی تب "متغیرهای محیطی" کلیک کنید
   - متغیرهای زیر را اضافه کنید:

#### **متغیرهای دیتابیس:**
```bash
DB_HOST=salamatlabdb
DB_NAME=musing_merkle
DB_USER=root
DB_PASS=LbGsohGHihr1oZ7l8Jt1Vvb0
DB_PORT=3306
```

#### **متغیرهای SMS.ir:**
```bash
SMSIR_API_KEY=jClChBBaWXvfhHfqhBrIDIcwV5tzSj7GRVTZavQEFTPcYgqV
SMSIR_TEMPLATE_ID=165688
SMSIR_TEMPLATE_PARAM_NAME=Code
```

#### **متغیرهای امنیتی:**
```bash
OTP_SECRET=your_secure_32_character_secret_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=your_bcrypt_password_hash
```

#### **متغیرهای CORS:**
```bash
ALLOWED_ORIGINS=https://salamatlab-frontend.liara.run,https://your-domain.com
```

---

## 📁 **گام ۲: آماده‌سازی فایل‌های Backend**

### **ساختار فایل‌های backend:**
```
public/api/
├── config.php              # تنظیمات اصلی
├── otp.php                 # API OTP
├── users.php               # API کاربران
├── booking.php             # API رزرو
├── contact.php             # API تماس
├── core/                   # کلاس‌های اصلی
│   ├── Database.php
│   ├── Logger.php
│   ├── Response.php
│   └── Environment.php
└── ...
```

### **بررسی فایل‌های ضروری:**
```bash
# اطمینان از وجود فایل‌ها
ls -la public/api/config.php
ls -la public/api/otp.php
ls -la public/api/users.php
ls -la public/api/core/
```

---

## 🚀 **گام ۳: استقرار در لیارا**

### **روش ۱: استقرار مستقیم (توصیه شده)**

```bash
# 1. اطمینان از نصب CLI لیارا
liara --version

# 2. ورود به حساب لیارا
liara login

# 3. استقرار backend
liara deploy --app salamatlab-backend --platform php

# 4. یا اگر اپ وجود دارد
liara deploy
```

### **روش ۲: استقرار از طریق پنل**

1. **ورود به پنل لیارا**
2. **انتخاب اپ `salamatlab-backend`**
3. **بخش "استقرار"**
4. **"استقرار جدید" کلیک کنید**
5. **انتظار برای اتمام استقرار**

---

## 🧪 **گام ۴: تست استقرار**

### **تست ۱: اتصال به backend**
```bash
# تست اتصال پایه
curl https://salamatlab-backend.liara.run/api/test-connection.php
```

**پاسخ مورد انتظار:**
```json
{
  "status": "success",
  "message": "Database connection successful",
  "database": "connected"
}
```

### **تست ۲: تنظیمات SMS**
```bash
# تست تنظیمات SMS.ir
curl -X POST https://salamatlab-backend.liara.run/api/test-sms.php \
  -H "Content-Type: application/json" \
  -d '{"action": "test_config"}'
```

**پاسخ مورد انتظار:**
```json
{
  "success": true,
  "message": "پیکربندی بررسی شد",
  "data": {
    "sms_api_key": "SET ✅",
    "sms_template_id": "SET ✅"
  }
}
```

### **تست ۳: ارسال OTP**
```bash
# تست ارسال OTP
curl -X POST https://salamatlab-backend.liara.run/api/otp.php \
  -H "Content-Type: application/json" \
  -d '{"action": "send", "phone": "09123456789"}'
```

**پاسخ مورد انتظار:**
```json
{
  "success": true,
  "message": "کد امنیتی ارسال شد",
  "data": {
    "expiresIn": 300,
    "phone": "09123456789"
  }
}
```

---

## 🔧 **عیب‌یابی مشکلات رایج**

### **خطای ۱: متغیرهای محیطی تنظیم نشده**
```json
{
  "error": "SMS_API_KEY not defined"
}
```

**راه‌حل:**
1. برید به پنل لیارا
2. اپلیکیشن → تنظیمات → متغیرهای محیطی
3. متغیرهای SMS.ir را اضافه کنید

### **خطای ۲: اتصال دیتابیس ناموفق**
```json
{
  "error": "Database connection failed"
}
```

**راه‌حل:**
1. اطلاعات دیتابیس را چک کنید
2. مطمئن شوید دیتابیس فعال است
3. متغیرهای DB_* را بررسی کنید

### **خطای ۳: استقرار ناموفق**
```
Deployment failed
```

**راه‌حل:**
1. لاگ‌های لیارا را چک کنید
2. مطمئن شوید فایل‌های PHP معتبر هستند
3. تنظیمات PHP را بررسی کنید

---

## 📊 **مانیتورینگ پس از استقرار**

### **بررسی لاگ‌ها:**
```bash
# لاگ‌های استقرار
liara logs --app salamatlab-backend

# لاگ‌های runtime
liara logs --app salamatlab-backend --follow
```

### **بررسی وضعیت اپ:**
```bash
# وضعیت اپلیکیشن
liara apps

# جزئیات اپ
liara app:info salamatlab-backend
```

---

## 🔄 **به‌روزرسانی Backend**

### **پس از تغییرات کد:**

```bash
# 1. Commit تغییرات
git add .
git commit -m "Backend update - SMS.ir integration"

# 2. Push به repository
git push origin main

# 3. استقرار مجدد
liara deploy --app salamatlab-backend --platform php
```

---

## 📱 **URL نهایی Backend**

پس از استقرار موفق، backend در دسترس خواهد بود:

```
https://salamatlab-backend.liara.run/api/
```

### **API Endpoints:**
- `/api/test-connection.php` - تست اتصال
- `/api/test-sms.php` - تست SMS.ir
- `/api/otp.php` - ارسال/بررسی OTP
- `/api/users.php` - مدیریت کاربران
- `/api/booking.php` - رزرو ویزیت

---

## ✅ **چک لیست نهایی**

### **قبل از استقرار:**
- [x] حساب لیارا فعال
- [x] CLI لیارا نصب شده
- [x] متغیرهای محیطی آماده
- [x] فایل‌های backend آماده

### **پس از استقرار:**
- [ ] تست اتصال موفق ✅
- [ ] تست SMS.ir موفق ✅
- [ ] تست OTP موفق ✅
- [ ] لاگ‌ها بدون خطا ✅

---

## 🎉 **تبریک!**

**Backend شما با موفقیت در لیارا مستقر شد!** 🚀

### **مراحل بعدی:**
1. **Frontend را مستقر کنید**
2. **سیستم را تست کنید**
3. **از اپلیکیشن استفاده کنید**

**آدرس backend شما:** `https://salamatlab-backend.liara.run/api/`

اگر سوالی دارید، در خدمتم! 😊
