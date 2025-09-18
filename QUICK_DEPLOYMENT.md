# ⚡ **استقرار سریع Backend - ۵ دقیقه**

## 📋 **فقط ۳ مرحله!**

---

## 🚀 **مرحله ۱: تنظیم متغیرهای محیطی**

### **پنل لیارا → اپ salamatlab-backend → متغیرهای محیطی:**

```bash
# کپی و پیست کنید:
DB_HOST=salamatlabdb
DB_NAME=musing_merkle
DB_USER=root
DB_PASS=LbGsohGHihr1oZ7l8Jt1Vvb0
DB_PORT=3306

SMSIR_API_KEY=jClChBBaWXvfhHfqhBrIDIcwV5tzSj7GRVTZavQEFTPcYgqV
SMSIR_TEMPLATE_ID=165688
SMSIR_TEMPLATE_PARAM_NAME=Code

OTP_SECRET=your_secure_32_character_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_bcrypt_hash

ALLOWED_ORIGINS=https://salamatlab-frontend.liara.run
```

---

## 📤 **مرحله ۲: Push به Git**

```bash
# اگر تغییری داشتید
git add .
git commit -m "Ready for deployment"
git push origin main
```

---

## 🔄 **مرحله ۳: استقرار**

```bash
# اگر CLI ندارید، از پنل لیارا استفاده کنید

# اگر CLI دارید:
liara deploy --app salamatlab-backend --platform php
```

---

## ✅ **تست سریع**

```bash
# تست اتصال
curl https://salamatlab-backend.liara.run/api/test-connection.php

# تست SMS
curl -X POST https://salamatlab-backend.liara.run/api/test-sms.php \
  -H "Content-Type: application/json" \
  -d '{"action": "test_config"}'

# تست OTP
curl -X POST https://salamatlab-backend.liara.run/api/otp.php \
  -H "Content-Type: application/json" \
  -d '{"action": "send", "phone": "09123456789"}'
```

---

## 🎯 **اگر همه چیز درست بود:**

```
✅ Backend آماده: https://salamatlab-backend.liara.run/api/
✅ SMS.ir فعال
✅ OTP کار می‌کند
✅ دیتابیس متصل
```

---

## 🚨 **اگر مشکل داشت:**

### **مشکل ۱: متغیرهای محیطی**
```
Error: SMS_API_KEY not defined
```
**راه‌حل:** پنل لیارا → متغیرهای محیطی را چک کنید

### **مشکل ۲: استقرار ناموفق**
```
Deployment failed
```
**راه‌حل:** پنل لیارا → لاگ‌های استقرار را ببینید

---

## 🎉 **موفق شدید؟**

**تبریک! Backend شما آماده است!** 🚀

**حالا Frontend را مستقر کنید و تمام!** ✨
