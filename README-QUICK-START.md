# 🚀 SalamatLab - شروع سریع

## ⚡ تنظیم سریع برای Production

### گام 1: اجرای Setup Script

**Windows:**
```cmd
setup-production.bat
```

**Linux/Mac:**
```bash
./setup-production.sh
```

### گام 2: تست سیستم

```bash
php public/api/quick-test.php
```

اگر همه تست‌ها ✅ باشند، سیستم آماده است!

### گام 3: دسترسی به سیستم

- **Frontend**: `https://yourdomain.com`
- **API Status**: `https://yourdomain.com/api/status.php`
- **API Auth**: `https://yourdomain.com/api/auth.php`

## 🔑 اطلاعات تنظیم شده

### دیتابیس (آماده)
```
Host: salamatlabdb
Database: musing_merkle
User: root
Password: [تنظیم شده]
```

### SMS API (آماده)
```
Provider: SMS.ir
Template ID: 165688
API Key: [تنظیم شده]
```

### Admin Panel
```
Username: salamat_admin
Password: admin123!@# (⚠️ حتماً تغییر دهید)
```

## 🛠️ تنظیمات مهم

### 1. تغییر رمز Admin
در فایل `.env`:
```bash
ADMIN_PASSWORD_HASH=new_hash_here
```

### 2. تنظیم شماره همکار
```bash
STAFF_NOTIFY_MOBILE=09123456789
```

### 3. تنظیم دامنه
```bash
ALLOWED_ORIGINS=https://yourdomain.com
```

## 🎯 ویژگی‌های جدید

✅ **Environment Management**: تنظیمات مرکزی
✅ **Authentication**: امن و استاندارد  
✅ **Database Pooling**: بهینه‌سازی اتصالات
✅ **Error Handling**: مدیریت خطای جامع
✅ **Session Management**: نشست‌های امن
✅ **API Standardization**: ساختار یکپارچه

## 📞 تست سریع API

```bash
# تست سلامت سیستم
curl https://yourdomain.com/api/status.php

# تست احراز هویت  
curl -X POST https://yourdomain.com/api/auth.php \
  -H "Content-Type: application/json" \
  -d '{"action":"check_status"}'
```

## 🚨 عیب‌یابی

اگر مشکلی بود:
1. `php public/api/quick-test.php` اجرا کنید
2. فایل `.env` را بررسی کنید  
3. Logs را چک کنید: `public/api/logs/`

---

🎉 **سیستم آماده بهره‌برداری است!**

برای اطلاعات کامل: `PRODUCTION_DEPLOYMENT.md`
