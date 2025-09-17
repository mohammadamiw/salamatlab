# 🚀 راهنمای استقرار لیارا - آزمایشگاه سلامت

## 📋 فهرست مطالب
- [معماری سیستم](#معماری-سیستم)
- [فایل‌های جدید](#فایل‌های-جدید)
- [تنظیمات Environment Variables](#تنظیمات-environment-variables)
- [مراحل استقرار](#مراحل-استقرار)
- [تست سیستم](#تست-سیستم)
- [عیب‌یابی](#عیب‌یابی)

---

## 🏗️ معماری سیستم

### Backend (PHP + MySQL)
```
📁 public/api/
├── config-liara.php        # تنظیمات بهینه شده برای لیارا
├── users-liara.php         # API مدیریت کاربران + OTP
├── config.php              # تنظیمات قدیمی (fallback)
└── users-simple.php        # API ساده (fallback)
```

### Frontend (React + Vite)
```
📁 src/
├── config/api.ts           # تنظیمات API و Environment
├── contexts/AuthContext-liara.tsx  # Context بهینه شده
├── main-liara.tsx          # Entry point جدید
└── ...
```

### Database Schema
```sql
-- کاربران
users (id, phone, first_name, last_name, email, national_id, 
       birth_date, gender, city, has_basic_insurance, 
       basic_insurance, complementary_insurance, 
       is_profile_complete, created_at, updated_at)

-- آدرس‌های کاربران  
user_addresses (id, user_id, title, address, latitude, 
                longitude, phone, is_default, created_at)

-- کدهای OTP
otp_codes (id, phone, code, expires_at, used, created_at)
```

---

## 📁 فایل‌های جدید

### 1. Backend Files
- `public/api/config-liara.php` - پیکربندی بهینه شده برای لیارا
- `public/api/users-liara.php` - API کامل مدیریت کاربران

### 2. Frontend Files
- `src/config/api.ts` - مدیریت API و Environment Variables
- `src/contexts/AuthContext-liara.tsx` - Context بهینه شده
- `src/main-liara.tsx` - Entry point جدید

### 3. Configuration Files
- `env.example` - نمونه Environment Variables
- `LIARA_DEPLOYMENT_GUIDE.md` - این راهنما

---

## ⚙️ تنظیمات Environment Variables

### در پنل لیارا تنظیم کنید:

#### Database
```env
DB_HOST=salamatlabdb
DB_NAME=musing_merkle  
DB_USER=root
DB_PASS=LbGsohGHihr1oZ7l8Jt1Vvb0
```

#### SMS Configuration
```env
SMSIR_API_KEY=jClChBBaWXvfhHfqhBrIDIcwV5tzSj7GRVTZavQEFTPcYgqV
SMSIR_TEMPLATE_ID=165688
SMSIR_TEMPLATE_PARAM_NAME=Code
```

#### Security & Debug
```env
OTP_SECRET=salamatlab-liara-secret-key
DEBUG_MODE=false
ENVIRONMENT=production
```

---

## 🚀 مراحل استقرار

### گام 1: آماده‌سازی کد

```bash
# 1. بررسی فایل‌های ضروری
ls -la public/api/config-liara.php
ls -la public/api/users-liara.php  
ls -la src/config/api.ts

# 2. Build برای production
npm run build:liara

# 3. بررسی build
ls -la dist/
```

### گام 2: تنظیم Repository

```bash
# 1. Commit تغییرات
git add .
git commit -m "Complete Liara optimization - ready for deployment"
git push origin main
```

### گام 3: استقرار در لیارا

1. **برید به پنل لیارا**
2. **برنامه salamatlab → تنظیمات**
3. **Platform: `static` (برای React build شده)**
4. **Environment Variables رو تنظیم کنید**
5. **استقرار جدید کنید**

---

## 🧪 تست سیستم

### 1. تست Backend API

```bash
# تست اتصال دیتابیس
curl https://salamatlab.liara.run/api/config-liara.php

# تست ارسال OTP
curl -X POST https://salamatlab.liara.run/api/users-liara.php \
  -H "Content-Type: application/json" \
  -d '{"action":"sendOtp","phone":"09123456789"}'

# تست تایید OTP  
curl -X POST https://salamatlab.liara.run/api/users-liara.php \
  -H "Content-Type: application/json" \
  -d '{"action":"verifyOtp","phone":"09123456789","code":"123456"}'
```

### 2. تست Frontend

1. **برید به:** `https://salamatlab.liara.run`
2. **تست مراحل:**
   - بارگذاری صفحه اصلی ✅
   - ورود به پنل کاربری ✅  
   - ارسال OTP ✅
   - تایید OTP ✅
   - تکمیل پروفایل ✅
   - مدیریت آدرس‌ها ✅

---

## 🔧 عیب‌یابی

### خطاهای رایج

#### 1. خطای 502 Bad Gateway
```bash
# بررسی لاگ‌ها در پنل لیارا
# احتمالاً مشکل Platform (باید static باشه)
```

#### 2. خطای Database Connection
```bash
# بررسی Environment Variables
# اطمینان از صحت اطلاعات دیتابیس
```

#### 3. خطای CORS
```bash
# بررسی تنظیمات CORS در config-liara.php
# اضافه کردن domain لیارا به ALLOWED_ORIGINS
```

### Debug Mode

برای فعال کردن debug در production:
```env
DEBUG_MODE=true
```

### لاگ‌ها

لاگ‌های سیستم در `/tmp/salamat-app.log` ذخیره می‌شوند.

---

## 📞 پشتیبانی

در صورت بروز مشکل:

1. **بررسی لاگ‌های لیارا**
2. **بررسی Console Browser**  
3. **تست API endpoints مستقیماً**
4. **بررسی Environment Variables**

---

## 🎉 موفقیت!

اگر تمام مراحل درست انجام شده باشد:

- ✅ سایت روی `https://salamatlab.liara.run` در دسترس است
- ✅ سیستم OTP کار می‌کند
- ✅ اطلاعات کاربران در MySQL ذخیره می‌شوند
- ✅ تمام قابلیت‌های پروفایل فعال هستند

**🎊 تبریک! سیستم شما روی لیارا مستقر شد!**
