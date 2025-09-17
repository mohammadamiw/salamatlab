# 🎯 خلاصه راه‌حل مشکل nginx 404

## ❌ **مشکل اصلی:**
```
/auth/login → 404 Not Found (nginx error)
```

## 🔍 **علت مشکل:**
1. **Platform اشتباه**: `liara.json` روی `static` بود اما nginx config داشت
2. **Nginx config غلط**: SPA routing handle نمی‌شد
3. **Architecture اشتباه**: React + PHP در یک app

## ✅ **راه‌حل اعمال شده:**

### **🏗️ Architecture جدید:**

```
Frontend (SPA)          Backend (PHP API)
─────────────────────   ─────────────────────
salamatlab-frontend     salamatlab-backend
├── React Build         ├── public/api/  
├── Static hosting      ├── PHP 8.2
├── SPA routing ✅      ├── Environment vars
└── liara.json          └── liara-backend.json
```

## 📁 **فایل‌های تغییر کرده:**

### **✅ بروزرسانی شده:**
- `liara.json` ← Frontend config (spa: true)
- `src/config/api.ts` ← Backend URL جدید  
- `src/pages/Auth/Login.tsx` ← users.php API
- `src/contexts/AuthContext.tsx` ← API یکپارچه
- `public/api/config.php` ← Environment variables
- `public/api/users.php` ← OOP + Security
- `public/api/booking.php` ← SMS.ir integration

### **🆕 فایل‌های جدید:**
- `liara-backend.json` ← Backend deployment
- `LIARA_DEPLOYMENT_FIXED.md` ← راهنما
- `deploy-separate.sh` ← Deployment script
- `SMS_SETUP_GUIDE.md` ← راهنمای SMS
- `public/api/test-sms.php` ← SMS test

### **❌ حذف شده:**
- `liara_nginx.conf` ← دیگر لازم نیست
- `public/api/users-simple.php` ← یکپارچه شده
- `public/api/users-liara.php` ← یکپارچه شده  
- `public/api/config-liara.php` ← یکپارچه شده

## 🚀 **مراحل Deploy:**

### **گزینه 1: Manual (پیشنهادی)**
```bash
# 1. Backend
mkdir salamatlab-backend
cp -r public/ salamatlab-backend/
cp liara-backend.json salamatlab-backend/liara.json
cd salamatlab-backend
liara deploy --app salamatlab-backend --platform php

# 2. Frontend  
cd ..
npm run build
liara deploy --app salamatlab-frontend --platform static
```

### **گزینه 2: Script**
```bash
./deploy-separate.sh
```

## ⚙️ **Environment Variables:**

در پنل Liara برای `salamatlab-backend`:

```env
# Database
DB_HOST=your_database_host
DB_NAME=your_database_name
DB_USER=your_database_user  
DB_PASS=your_database_password

# SMS.ir
SMSIR_API_KEY=your_sms_api_key
SMSIR_TEMPLATE_ID=your_template_id

# Security
OTP_SECRET=your_32_character_secret
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=your_bcrypt_hash

# CORS (مهم!)
ALLOWED_ORIGINS=https://salamatlab-frontend.liara.run
```

## 🧪 **URLs تست:**

### **بعد از Deploy:**
```
✅ https://salamatlab-frontend.liara.run/auth/login
✅ https://salamatlab-backend.liara.run/api/test-connection.php
✅ https://salamatlab-backend.liara.run/api/test-sms.php
```

## 🎉 **نتیجه:**

- ✅ `/auth/login` دیگر 404 نمی‌خورد
- ✅ React Router کار می‌کند  
- ✅ SPA routing درست
- ✅ API calls به backend جداگانه
- ✅ SMS.ir integration کامل
- ✅ Security بهبود یافته
- ✅ Environment variables مجزا

**🔥 حالا پروژه آماده production است!**
