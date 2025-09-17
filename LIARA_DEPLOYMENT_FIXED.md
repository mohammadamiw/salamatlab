# راهنمای Deployment درست شده برای Liara

## ❌ **مشکل قبلی:**
```
nginx 404 error for /auth/login
```

## ✅ **راه‌حل اعمال شده:**

### **Architecture جدید:**

```
┌─────────────────────────────────────┐
│  🎨 Frontend (React SPA)            │
│  salamatlab-frontend.liara.run      │
│  platform: static                  │
│  spa: true                         │
└─────────────────────────────────────┘
                     │
                     │ API Calls
                     ▼
┌─────────────────────────────────────┐
│  ⚙️ Backend (PHP APIs)              │
│  salamatlab-backend.liara.run       │
│  platform: php                     │
│  PHP 8.2                           │
└─────────────────────────────────────┘
```

## 🚀 **مراحل Deployment:**

### **مرحله 1: Backend Deployment**

```bash
# کپی کردن فایل‌های PHP به پوشه جداگانه
mkdir salamatlab-backend
cp -r public/ salamatlab-backend/
cp liara-backend.json salamatlab-backend/liara.json
cp database-schema.sql salamatlab-backend/
cp *.md salamatlab-backend/

# Deploy Backend
cd salamatlab-backend
liara deploy --app salamatlab-backend --platform php
```

### **مرحله 2: Frontend Deployment**

```bash
# Build Frontend
npm install
npm run build

# Deploy Frontend  
liara deploy --app salamatlab-frontend --platform static
```

## ⚙️ **Environment Variables برای Backend:**

در پنل Liara برای `salamatlab-backend`:

```bash
# Database
DB_HOST=your_database_host
DB_NAME=your_database_name  
DB_USER=your_database_user
DB_PASS=your_database_password

# SMS.ir
SMSIR_API_KEY=your_sms_api_key
SMSIR_TEMPLATE_ID=your_template_id
SMSIR_TEMPLATE_PARAM_NAME=Code

# Security
OTP_SECRET=your_32_character_secret_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD_HASH=your_bcrypt_hash

# CORS
ALLOWED_ORIGINS=https://salamatlab-frontend.liara.run

# Email
ADMIN_EMAIL=admin@yourdomain.com
FROM_EMAIL=noreply@yourdomain.com
```

## 🧪 **تست کردن:**

### **Backend Test URLs:**
```
https://salamatlab-backend.liara.run/api/test-connection.php
https://salamatlab-backend.liara.run/api/test-sms.php
https://salamatlab-backend.liara.run/api/users.php
```

### **Frontend Test URLs:**
```
https://salamatlab-frontend.liara.run/
https://salamatlab-frontend.liara.run/auth/login ✅ (بدون 404)
https://salamatlab-frontend.liara.run/profile
```

## 🔧 **تغییرات اعمال شده:**

### **✅ فایل‌های تغییر کرده:**

1. **`liara.json`** ← Frontend config
   ```json
   {
     "app": "salamatlab-frontend",
     "platform": "static", 
     "static": { "spa": true }
   }
   ```

2. **`liara-backend.json`** ← Backend config (جدید)
   ```json
   {
     "app": "salamatlab-backend",
     "platform": "php",
     "php": { "version": "8.2" }
   }
   ```

3. **`src/config/api.ts`** ← API URLs
   ```typescript
   production: {
     api: 'https://salamatlab-backend.liara.run/api'
   }
   ```

### **❌ فایل‌های حذف شده:**
- `liara_nginx.conf` ← دیگر لازم نیست

## 🎯 **چرا این روش بهتر است:**

1. **✅ SPA Routing**: React Router کار می‌کند
2. **✅ API Separation**: Backend و Frontend جداگانه  
3. **✅ Scalability**: هر کدام جداگانه scale می‌شوند
4. **✅ Performance**: Static hosting برای Frontend سریع‌تر
5. **✅ Security**: Backend environment variables مجزا

## 📱 **Local Development:**

```bash
# Frontend
npm run dev     # http://localhost:5173

# Backend (نیاز به local server)
php -S localhost:8000 -t public/
```

## 🆘 **عیب‌یابی:**

### **اگر هنوز 404 می‌خورید:**
1. مطمئن شوید Frontend با `spa: true` deploy شده
2. بررسی کنید API URLs در `api.ts` درست است
3. CORS headers در backend تنظیم شده باشد

### **اگر API کار نمی‌کند:**
1. Environment variables در backend تنظیم شده باشد
2. Database connection درست باشد
3. PHP files permission درست باشد

---

**🎉 حالا `/auth/login` باید کار کند!**
