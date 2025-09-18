# ⚡ **تست سریع SMS.ir - تنظیمات نهایی**

## ✅ **مقادیر تنظیم شده:**

### **API Key:**
```
jClChBBaWXvfhHfqhBrIDIcwV5tzSj7GRVTZavQEFTPcYgqV
```

### **Template ID:**
```
165688
```

### **Parameter:**
```
Code
```

---

## 🧪 **تست‌های سریع:**

### **1. تست تنظیمات (GET):**
```
https://salamatlab-backend.liara.run/api/test-sms.php
```

### **2. تست تنظیمات (POST):**
```bash
curl -X POST "https://salamatlab-backend.liara.run/api/test-sms.php" \
  -H "Content-Type: application/json" \
  -d '{"action": "test_config"}'
```

### **3. تست ارسال واقعی SMS:**
```bash
curl -X POST "https://salamatlab-backend.liara.run/api/otp.php" \
  -H "Content-Type: application/json" \
  -d '{"action": "send", "phone": "09123456789"}'
```

### **4. تست رابط کاربری:**
```
https://salamatlab-frontend.liara.run/test-otp.html
```

---

## 📱 **تست عملی:**

1. **مرورگر را باز کنید**
2. **این آدرس را وارد کنید:**
   ```
   https://salamatlab-frontend.liara.run/test-otp.html
   ```

3. **شماره موبایل خودتان را وارد کنید**
4. **روی "ارسال واقعی" کلیک کنید**
5. **کد دریافتی را بررسی کنید**

---

## 🎯 **اگر همه چیز درست کار کرد:**

### **✅ نتیجه موفق:**
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

## 🚨 **اگر خطا داشت:**

### **خطای تنظیمات:**
```json
{
  "error": "SMS_API_KEY not defined"
}
```

**راه‌حل:** تنظیمات Liara را چک کنید

### **خطای API:**
```json
{
  "error": "SMS.ir API returned error"
}
```

**راه‌حل:** API Key و Template ID را چک کنید

---

## 📊 **اطلاعات مهم:**

- **محدودیت ارسال:** حداکثر ۵ پیامک در ساعت
- **زمان انقضا:** ۵ دقیقه
- **هزینه:** بر اساس تعرفه SMS.ir
- **لاگ‌ها:** در پنل Liara قابل مشاهده

---

## 🎉 **آماده هستید!**

**SMS.ir تنظیم شده و آماده استفاده است!** 🚀

فقط شماره موبایل خودتان را تست کنید! 📱
