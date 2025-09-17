# 🚀 راهنمای ساده SalamatLab

## ✅ کارهای انجام شده

همه اطلاعات **مستقیماً در فایل `public/api/config.php`** قرار گرفته:

### 🗄️ دیتابیس
```php
DB_HOST: salamatlabdb
DB_NAME: musing_merkle  
DB_USER: root
DB_PASS: LbGsohGHihr1oZ7l8Jt1Vvb0
```

### 📱 SMS API
```php
SMS_API_KEY: jClChBBaWXvfhHfqhBrIDIcwV5tzSj7GRVTZavQEFTPcYgqV
TEMPLATE_ID: 165688
```

### 👤 Admin Panel
```php
Username: salamat_admin
Password: admin123!@#
```

## 🔧 مراحل استفاده

### 1. تست محلی
```bash
# تست تنظیمات
php test-simple.php

# تست کامل
php public/api/status.php
```

### 2. آپلود به سرور
1. تمام فایل‌های پروژه را آپلود کنید
2. مطمئن شوید که `public` پوشه اصلی وب‌سایت باشد
3. مجوزها را تنظیم کنید:
   ```bash
   chmod 755 public/api/
   chmod 755 public/api/core/
   ```

### 3. تست روی سرور
```bash
# تست از طریق مرورگر
https://yourdomain.com/test-simple.php

# تست API
https://yourdomain.com/api/status.php
```

## 🎯 همه چیز آماده است!

- ✅ دیتابیس تنظیم شده
- ✅ SMS API تنظیم شده  
- ✅ Authentication آماده
- ✅ Admin panel آماده
- ✅ نیازی به فایل .env نیست
- ✅ نیازی به setup script نیست

## 📞 تست سریع

برای اطمینان از کارکرد:
1. `php test-simple.php` اجرا کنید
2. باید تمام تنظیمات ✅ باشند  
3. اتصال دیتابیس موفق باشد

---

**🎉 سیستم کاملاً آماده استفاده است!**
