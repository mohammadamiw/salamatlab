# 🚀 راهنمای راه‌اندازی سریع SMS.ir

## 📋 **پیش‌نیازها**

### **1. حساب SMS.ir**
- ثبت‌نام در [SMS.ir](https://sms.ir)
- فعال‌سازی حساب کاربری
- شارژ حساب

### **2. ایجاد API Key**
1. ورود به پنل SMS.ir
2. بخش **برنامه‌نویسان** → **API Key**
3. ایجاد کلید جدید
4. کپی کردن API Key

### **3. ایجاد الگوها (Templates)**
1. بخش **ارسال سریع** → **الگوها**
2. ایجاد الگوهای زیر:

#### **الگوی OTP (اجباری)**
```
عنوان: کد تایید ورود
متن: کد تایید شما: {Code}
```

#### **الگوهای تأیید (اختیاری)**
```
عنوان: تایید رزرو چکاپ
متن: {NAME} عزیز، رزرو {CHECKUP} شما تایید شد.

عنوان: تایید نظرسنجی
متن: {NAME} عزیز، نظر شما دریافت شد.

عنوان: تایید استخدام
متن: {NAME} عزیز، درخواست شما ثبت شد.
```

---

## ⚙️ **تنظیم متغیرهای محیطی در Liara**

در پنل Liara برای اپ `salamatlab-backend`:

```bash
# ===========================================
# SMS.ir Configuration
# ===========================================

# API Key از پنل SMS.ir
SMSIR_API_KEY=your_actual_api_key_here

# Template ID برای OTP (از پنل SMS.ir)
SMSIR_TEMPLATE_ID=your_otp_template_id

# نام پارامتر در الگو (معمولاً Code)
SMSIR_TEMPLATE_PARAM_NAME=Code

# ===========================================
# Optional Templates
# ===========================================

# الگوی تایید چکاپ
CHECKUP_CONFIRM_TEMPLATE_ID=your_checkup_template_id
CHECKUP_CONFIRM_NAME_PARAM=NAME
CHECKUP_CONFIRM_TITLE_PARAM=CHECKUP

# الگوی تایید عمومی
SMSIR_CONFIRM_TEMPLATE_ID=your_general_confirm_template_id
SMSIR_CONFIRM_PARAM_NAME=NAME

# الگوی تایید نظرسنجی
FEEDBACK_CONFIRM_TEMPLATE_ID=your_feedback_template_id
FEEDBACK_CONFIRM_PARAM_NAME=NAME

# الگوی استخدام
CAREERS_CONFIRM_TEMPLATE_ID=your_careers_template_id
CAREERS_CONFIRM_PARAM_NAME=NAME

# الگوی تماس
CONTACT_CONFIRM_TEMPLATE_ID=your_contact_template_id
CONTACT_CONFIRM_PARAM_NAME=NAME

# ===========================================
# Staff Notifications
# ===========================================

# الگوی اطلاع‌رسانی به کارکنان
SMSIR_STAFF_TEMPLATE_ID=your_staff_template_id
SMSIR_STAFF_PARAM_NAME=LINK

# شماره موبایل کارکنان برای اطلاع‌رسانی
STAFF_NOTIFY_MOBILE=09xxxxxxxxx
```

---

## 🧪 **تست سیستم**

### **مرحله ۱: تست تنظیمات**
```bash
POST https://salamatlab-backend.liara.run/api/test-sms.php
Content-Type: application/json

{
  "action": "test_config"
}
```

**پاسخ مورد انتظار:**
```json
{
  "success": true,
  "message": "پیکربندی بررسی شد",
  "data": {
    "sms_api_key": "SET ✅",
    "sms_template_id": "SET ✅",
    "sendOtpSms_function": "EXISTS ✅"
  }
}
```

### **مرحله ۲: تست ارسال OTP**
```bash
POST https://salamatlab-backend.liara.run/api/test-otp.php
Content-Type: application/json

{
  "action": "test_send",
  "phone": "09123456789"
}
```

**پاسخ مورد انتظار:**
```json
{
  "success": true,
  "message": "کد امنیتی تولید شد",
  "data": {
    "phone": "09123456789",
    "code_generated": "123456",
    "database_storage": "SUCCESS ✅",
    "sms_simulation": "NOT SENT (test mode)",
    "expires_in": 300
  }
}
```

### **مرحله ۳: تست واقعی SMS**
```bash
POST https://salamatlab-backend.liara.run/api/otp.php
Content-Type: application/json

{
  "action": "send",
  "phone": "09123456789"
}
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

## 📱 **تست با رابط کاربری**

1. فایل `test-otp.html` را در مرورگر باز کنید:
```
https://your-domain.com/test-otp.html
```

2. **تب "تنظیمات"** را انتخاب کنید
3. روی **"تست تنظیمات"** کلیک کنید
4. **تب "ارسال کد"** را انتخاب کنید
5. شماره موبایل وارد کنید
6. روی **"ارسال کد تست"** کلیک کنید
7. برای ارسال واقعی SMS روی **"ارسال واقعی"** کلیک کنید

---

## 🔍 **عیب‌یابی**

### **اگر تست تنظیمات ناموفق بود:**

#### **خطا: SMS_API_KEY not set**
```json
{
  "sms_api_key": "NOT SET ❌"
}
```

**راه‌حل:**
1. وارد پنل Liara شوید
2. اپ `salamatlab-backend` را انتخاب کنید
3. بخش Environment Variables
4. متغیر `SMSIR_API_KEY` را اضافه کنید

#### **خطا: SMSIR_TEMPLATE_ID not set**
```json
{
  "sms_template_id": "NOT SET ❌"
}
```

**راه‌حل:**
1. وارد پنل SMS.ir شوید
2. الگو ایجاد کنید
3. Template ID را کپی کنید
4. در Liara متغیر `SMSIR_TEMPLATE_ID` را تنظیم کنید

---

### **اگر ارسال SMS ناموفق بود:**

#### **بررسی لاگ‌ها:**
1. وارد پنل Liara شوید
2. اپ `salamatlab-backend` را انتخاب کنید
3. بخش Logs را چک کنید

#### **خطاهای رایج:**

**خطا: API Key نامعتبر**
```
SMS.ir API returned error: Invalid API Key
```

**راه‌حل:**
- API Key را از پنل SMS.ir دوباره چک کنید

**خطا: Template ID نامعتبر**
```
SMS.ir API returned error: Invalid Template ID
```

**راه‌حل:**
- Template ID را از پنل SMS.ir چک کنید

**خطا: شماره موبایل نامعتبر**
```
SMS.ir API returned error: Invalid mobile number
```

**راه‌حل:**
- شماره موبایل باید ۱۰ رقم و بدون صفر شروع باشد
- مثال: `9123456789` نه `09123456789`

---

## 📊 **مانیتورینگ و آمار**

### **بررسی آمار ارسال SMS:**
در پنل SMS.ir می‌توانید آمار زیر را مشاهده کنید:
- تعداد پیام‌های ارسالی
- هزینه ارسال
- نرخ موفقیت
- گزارش خطاها

### **لاگ‌های سیستم:**
لاگ‌های کاملی از عملیات SMS در سیستم ذخیره می‌شود:
- زمان ارسال
- شماره گیرنده
- وضعیت ارسال
- هزینه
- خطاها

---

## 💡 **نکات مهم**

### **1. امنیت**
- API Key را با کسی به اشتراک نگذارید
- از HTTPS استفاده کنید
- لاگ‌های حساس را چک کنید

### **2. هزینه‌ها**
- هر پیامک هزینه دارد
- هزینه را در پنل SMS.ir چک کنید
- از ارسال تست بیش از حد خودداری کنید

### **3. محدودیت‌ها**
- SMS.ir محدودیت تعداد ارسال در ساعت دارد
- در صورت رسیدن به محدودیت، منتظر بمانید

### **4. پشتیبان‌گیری**
- تنظیمات را در جای امن نگه دارید
- از API Key پشتیبان تهیه کنید

---

## 🎉 **تبریک!**

اگر تمام تست‌ها موفق بودند، سیستم SMS.ir شما آماده استفاده است! 🚀

**اکنون می‌توانید از سیستم OTP در اپلیکیشن استفاده کنید.**
