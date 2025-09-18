# 🧪 **تست کامل API SMS.ir - مطابق مستندات رسمی**

## 📋 **اطلاعات تنظیم شده:**

| پارامتر | مقدار | وضعیت |
|---------|--------|--------|
| **API Key** | `jClChBBaWXvfhHfqhBrIDIcwV5tzSj7GRVTZavQEFTPcYgqV` | ✅ تنظیم شده |
| **Template ID** | `165688` | ✅ تنظیم شده |
| **Parameter Name** | `Code` | ✅ تنظیم شده |
| **Mobile Number** | تست با شماره واقعی | ✅ آماده |

---

## 🧪 **تست‌های مطابق مستندات SMS.ir**

### **1. تست مستقیم API (مستندات SMS.ir)**

#### **Request Body:**
```json
{
    "mobile": "9123456789",
    "templateId": 165688,
    "parameters": [
        {
            "name": "Code",
            "value": "123456"
        }
    ]
}
```

#### **cURL Command:**
```bash
curl -X POST "https://api.sms.ir/v1/send/verify" \
  -H "x-api-key: jClChBBaWXvfhHfqhBrIDIcwV5tzSj7GRVTZavQEFTPcYgqV" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "mobile": "9123456789",
    "templateId": 165688,
    "parameters": [
      {
        "name": "Code",
        "value": "123456"
      }
    ]
  }'
```

#### **Expected Response:**
```json
{
    "status": 1,
    "message": "موفق",
    "data": {
        "messageId": 89545112,
        "cost": 1.0
    }
}
```

---

### **2. تست از طریق سیستم (پیاده‌سازی شده)**

#### **Request to Backend:**
```bash
POST https://salamatlab-backend.liara.run/api/otp.php
Content-Type: application/json

{
  "action": "send",
  "phone": "09123456789"
}
```

#### **Expected Response:**
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

### **3. تست بررسی کد**

#### **Request:**
```bash
POST https://salamatlab-backend.liara.run/api/otp.php
Content-Type: application/json

{
  "action": "verify",
  "phone": "09123456789",
  "code": "123456"
}
```

#### **Expected Response:**
```json
{
  "success": true,
  "message": "کد امنیتی تأیید شد",
  "data": {
    "verified": true,
    "phone": "09123456789"
  }
}
```

---

## 📱 **تست با رابط کاربری**

### **مرحله ۱: باز کردن صفحه تست**
```
https://salamatlab-frontend.liara.run/test-otp.html
```

### **مرحله ۲: تست تنظیمات**
1. تب "تنظیمات" را انتخاب کنید
2. روی "تست تنظیمات" کلیک کنید
3. باید پیام موفقیت ببینید

### **مرحله ۳: تست ارسال SMS**
1. تب "ارسال کد" را انتخاب کنید
2. شماره موبایل خودتان را وارد کنید (مثال: 09123456789)
3. روی "ارسال واقعی" کلیک کنید
4. منتظر دریافت پیامک باشید

### **مرحله ۴: تست بررسی کد**
1. تب "بررسی کد" را انتخاب کنید
2. شماره موبایل و کد دریافتی را وارد کنید
3. روی "بررسی کد" کلیک کنید
4. باید پیام تأیید ببینید

---

## 🔍 **بررسی Response Codes**

### **موفقیت:**
```json
{
    "status": 1,
    "message": "موفق",
    "data": {
        "messageId": 89545112,
        "cost": 1.0
    }
}
```

### **خطاهای رایج:**

#### **API Key نامعتبر:**
```json
{
    "status": 0,
    "message": "کلید وب سرویس نامعتبر است"
}
```

#### **Template ID نامعتبر:**
```json
{
    "status": 0,
    "message": "قالب یافت نشد"
}
```

#### **شماره موبایل نامعتبر:**
```json
{
    "status": 0,
    "message": "شماره موبایل نامعتبر است"
}
```

#### **محدودیت ارسال:**
```json
{
    "status": 0,
    "message": "محدودیت ارسال روزانه"
}
```

---

## 📊 **مانیتورینگ و لاگ‌ها**

### **لاگ‌های موفق:**
```
[SMS.ir] OTP sent successfully
- phone: 9123456789
- message_id: 89545112
- cost: 1.0
- template_id: 165688
```

### **لاگ‌های خطا:**
```
[SMS.ir] API returned error
- phone: 9123456789
- status_code: 0
- error_message: قالب یافت نشد
```

---

## ✅ **چک لیست تست نهایی**

### **قبل از تست:**
- [x] API Key تنظیم شده
- [x] Template ID تنظیم شده
- [x] Environment Variables در Liara تنظیم شده
- [x] Backend مستقر شده
- [x] Frontend مستقر شده

### **تست‌های اصلی:**
- [ ] تست تنظیمات (test-sms.php)
- [ ] تست ارسال SMS (otp.php)
- [ ] تست بررسی کد (otp.php)
- [ ] تست رابط کاربری (test-otp.html)

### **تست‌های پیشرفته:**
- [ ] تست با شماره‌های مختلف
- [ ] تست محدودیت ارسال
- [ ] تست کدهای منقضی
- [ ] تست لاگ‌های سیستم

---

## 🎯 **اگر همه چیز درست کار کرد:**

### **✅ نتیجه موفق:**
```
✅ تنظیمات SMS.ir کامل
✅ API کاملاً مطابق مستندات
✅ ارسال پیامک موفق
✅ بررسی کد موفق
✅ لاگ‌گذاری کامل
✅ امنیت بالا
```

---

## 🚨 **عیب‌یابی:**

### **اگر تست تنظیمات ناموفق بود:**
```json
{
  "sms_api_key": "NOT SET ❌"
}
```
**راه‌حل:** تنظیمات Liara را چک کنید

### **اگر ارسال SMS ناموفق بود:**
```json
{
  "success": false,
  "error": "خطا در ارسال پیامک"
}
```
**راه‌حل:** لاگ‌های Liara را چک کنید

---

## 🎉 **تبریک!**

اگر همه تست‌ها موفق بودند، **سیستم SMS.ir شما کاملاً آماده و مطابق مستندات رسمی است!** 🚀

**شماره موبایل خودتان را تست کنید و از سیستم لذت ببرید!** 📱✨
