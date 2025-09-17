# 🛠️ راهنمای توسعه محلی (Local Development)

## 🏗️ Architecture محلی:

```
Frontend (React)        Backend (PHP)
──────────────────      ─────────────────
http://localhost:5173   http://localhost:8000
├── npm run dev         ├── PHP built-in server
├── Vite dev server     ├── public/api/ files
├── Hot reload          └── Local database
└── React Router        
```

## 🚀 **راه‌اندازی محلی:**

### **مرحله 1: Backend**

```bash
# 1. تنظیم Environment Variables محلی
cp env.example .env.local

# 2. ویرایش .env.local (تنظیمات محلی)
# DB_HOST=localhost
# DB_NAME=salamatlab_dev  
# DB_USER=root
# DB_PASS=
# SMSIR_API_KEY=your_api_key
# OTP_SECRET=dev-secret-32-chars-minimum

# 3. اجرای PHP Server
cd public
php -S localhost:8000

# یا از root directory:
php -S localhost:8000 -t public/
```

### **مرحله 2: Frontend**

```bash
# Terminal جدید
npm install
npm run dev

# باز می‌شود: http://localhost:5173
```

## 🧪 **تست API های محلی:**

### **Backend Test URLs:**
```
http://localhost:8000/api/test-connection.php
http://localhost:8000/api/test-sms.php  
http://localhost:8000/api/users.php
http://localhost:8000/api/otp.php
http://localhost:8000/api/booking.php
```

### **Frontend Routes:**
```
http://localhost:5173/
http://localhost:5173/auth/login
http://localhost:5173/profile
http://localhost:5173/checkups/request
```

## 📊 **Database Setup:**

### **گزینه 1: Local MySQL**
```sql
CREATE DATABASE salamatlab_dev;
USE salamatlab_dev;
SOURCE database-schema.sql;
```

### **گزینه 2: SQLite (ساده‌تر)**
```php
// در config.php برای development
if (!IS_PRODUCTION) {
    define('DB_HOST', 'sqlite:salamatlab_dev.db');
    // ...
}
```

## 🔧 **تنظیمات IDE:**

### **VS Code Extensions:**
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "bradlc.vscode-tailwindcss", 
    "ms-vscode.vscode-php-debug",
    "bmewburn.vscode-intelephense-client"
  ]
}
```

### **Debug Config (.vscode/launch.json):**
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Frontend",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vite",
      "args": ["dev"],
      "console": "integratedTerminal"
    },
    {
      "name": "Debug PHP",
      "type": "php",
      "request": "launch",
      "port": 9003,
      "pathMappings": {
        "/var/www/html": "${workspaceFolder}/public"
      }
    }
  ]
}
```

## 🔄 **Development Workflow:**

### **1. شروع کار روزانه:**
```bash
# Terminal 1: Backend
php -S localhost:8000 -t public/

# Terminal 2: Frontend  
npm run dev

# Terminal 3: کار عادی
git status
```

### **2. تست تغییرات:**
```bash
# Frontend خودکار reload می‌شود
# Backend: Refresh کردن صفحه

# تست API با curl:
curl http://localhost:8000/api/test-connection.php
```

### **3. Commit کردن:**
```bash
git add .
git commit -m "feature: add user authentication"
git push
```

## 🐛 **عیب‌یابی محلی:**

### **مشکلات رایج:**

#### **1. CORS Error**
```
❌ Access to fetch at 'http://localhost:8000' blocked by CORS
```
**راه‌حل:** بررسی `config.php` و `ALLOWED_ORIGINS`

#### **2. PHP Error**
```
❌ Fatal error: Call to undefined function...
```
**راه‌حل:** 
```bash
# نصب extensions
sudo apt install php-curl php-mysql php-mbstring
# یا در Windows: فعال کردن در php.ini
```

#### **3. Database Connection**
```
❌ SQLSTATE[HY000] [1045] Access denied
```
**راه‌حل:** بررسی `.env.local` و database credentials

#### **4. Port در حال استفاده**
```
❌ Address already in use
```
**راه‌حل:**
```bash
# Kill process
lsof -ti:8000 | xargs kill -9

# یا port دیگر
php -S localhost:8001 -t public/
```

## 📱 **Mobile Development:**

### **Network Access:**
```bash
# Frontend accessible از موبایل
npm run dev -- --host

# Backend accessible از network  
php -S 0.0.0.0:8000 -t public/

# دسترسی از موبایل:
# http://YOUR_LOCAL_IP:5173
# http://YOUR_LOCAL_IP:8000/api/
```

## 🎯 **Performance Tips:**

### **Frontend:**
```bash
# Bundle Analysis
npm run build
npm run preview

# Performance monitoring
npm install --save-dev @vitejs/plugin-legacy
```

### **Backend:**
```bash
# PHP Performance
# در php.ini:
opcache.enable=1
opcache.memory_consumption=128
```

## 📋 **Environment Files:**

### **.env.local** (محلی - git ignore):
```bash
# Development Settings
DB_HOST=localhost
DB_NAME=salamatlab_dev
DB_USER=root
DB_PASS=

# SMS API (اختیاری برای dev)
SMSIR_API_KEY=test_key
SMSIR_TEMPLATE_ID=123456

# Security (نسخه ساده برای dev)
OTP_SECRET=dev-secret-minimum-32-characters
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2y$10$dev.hash.for.local

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### **.gitignore** بروزرسانی:
```bash
# Environment
.env.local
.env.production

# Development
salamatlab_dev.db
public/api/otp_store.json

# IDE
.vscode/settings.json
.idea/
```

---

**🚀 حالا می‌توانید در محیط محلی کار کنید!**
