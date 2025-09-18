# 🔧 راهنمای عیب‌یابی سرویس SMS و OTP

## 🚨 مشکلات رایج و راه‌حل‌ها

### 1. **خطا: "خطا در اتصال به سرویس OTP"**

#### علل احتمالی:
- ❌ تنظیمات SMS.ir نادرست
- ❌ متغیرهای محیطی تنظیم نشده
- ❌ مشکل اتصال به دیتابیس
- ❌ کد قدیمی OTP

#### راه‌حل‌ها:

##### الف) بررسی تنظیمات SMS.ir
```bash
# در پنل Liara، متغیرهای زیر را چک کنید:
SMSIR_API_KEY=your_api_key_from_sms.ir
SMSIR_TEMPLATE_ID=your_template_id_from_sms.ir
SMSIR_TEMPLATE_PARAM_NAME=Code
```

##### ب) تست اتصال
```
POST https://your-backend-url/api/test-sms.php
Content-Type: application/json

{
  "action": "test_config"
}
```

##### ج) تست ارسال (بدون SMS واقعی)
```
POST https://your-backend-url/api/test-otp.php
Content-Type: application/json

{
  "action": "test_send",
  "phone": "09123456789"
}
```

---

### 2. **خطا: "کد امنیتی ارسال نشد"**

#### علل احتمالی:
- ❌ API Key نامعتبر
- ❌ Template ID اشتباه
- ❌ شماره موبایل نامعتبر
- ❌ محدودیت ارسال SMS.ir

#### راه‌حل‌ها:

##### الف) بررسی API Key
1. وارد پنل SMS.ir شوید
2. به بخش API Key بروید
3. اطمینان حاصل کنید API Key فعال است

##### ب) بررسی Template
1. در پنل SMS.ir، به بخش Templates بروید
2. اطمینان حاصل کنید Template تایید شده است
3. شماره Template ID را چک کنید

##### ج) تست مستقیم API
```bash
curl -X POST "https://api.sms.ir/v1/send/verify" \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{
    "mobile": "9123456789",
    "templateId": YOUR_TEMPLATE_ID,
    "parameters": [
      {"name": "Code", "value": "123456"}
    ]
  }'
```

---

### 3. **خطا: "کد تأیید صحیح نیست"**

#### علل احتمالی:
- ❌ کد منقضی شده
- ❌ تعداد تلاش‌ها بیش از حد مجاز
- ❌ مشکل ذخیره‌سازی در دیتابیس

#### راه‌حل‌ها:

##### الف) بررسی زمان انقضا
- کدهای OTP به مدت ۵ دقیقه معتبر هستند
- پس از انقضا، کد جدید درخواست کنید

##### ب) بررسی تعداد تلاش‌ها
- حداکثر ۵ تلاش مجاز است
- پس از ۵ تلاش ناموفق، کد منقضی می‌شود

##### ج) تست بررسی کد
```
POST https://your-backend-url/api/test-otp.php
Content-Type: application/json

{
  "action": "test_verify",
  "phone": "09123456789",
  "code": "123456"
}
```

---

## 🛠️ ابزارهای عیب‌یابی

### 1. **تست تنظیمات SMS**
```
POST https://your-backend-url/api/test-sms.php
```

### 2. **تست اتصال دیتابیس**
```
POST https://your-backend-url/api/test-connection.php
```

### 3. **تست OTP (بدون SMS)**
```
POST https://your-backend-url/api/test-otp.php
```

### 4. **بررسی لاگ‌ها**
- لاگ‌های سرور را چک کنید
- لاگ‌های PHP را بررسی کنید
- لاگ‌های Liara را ببینید

---

## 📋 چک لیست عیب‌یابی

### قبل از تست:
- [ ] متغیرهای محیطی SMS.ir تنظیم شده‌اند
- [ ] API Key در پنل SMS.ir فعال است
- [ ] Template در SMS.ir تایید شده است
- [ ] اتصال دیتابیس برقرار است
- [ ] جدول `otp_codes` وجود دارد

### در هنگام تست:
- [ ] از شماره موبایل معتبر استفاده کنید (۰۹۱۲۳۴۵۶۷۸۹)
- [ ] Content-Type را `application/json` قرار دهید
- [ ] CORS headers را چک کنید
- [ ] لاگ‌های خطا را بررسی کنید

### پس از تست:
- [ ] پاسخ API را بررسی کنید
- [ ] کد وضعیت HTTP را چک کنید
- [ ] زمان پاسخگویی را اندازه‌گیری کنید

---

## 🚀 راه‌حل‌های سریع

### راه‌حل ۱: استفاده از تست محلی
```javascript
// در فایل test-otp.html
fetch('/api/test-otp.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'test_send',
    phone: '09123456789'
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### راه‌حل ۲: تست مستقیم SMS.ir
```bash
# تست API SMS.ir
curl -X POST "https://api.sms.ir/v1/send/verify" \
  -H "x-api-key: YOUR_API_KEY" \
  -d '{"mobile":"9123456789","templateId":123,"parameters":[{"name":"Code","value":"123456"}]}'
```

### راه‌حل ۳: استفاده از کد تست
```javascript
// کد تست OTP
const testOTP = async () => {
  const response = await fetch('/api/test-otp.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'test_send',
      phone: '09123456789'
    })
  });

  const result = await response.json();
  console.log('Test Result:', result);
};
```

---

## 📞 تماس با پشتیبانی

اگر مشکل حل نشد:

1. **پشتیبانی SMS.ir**: مشکلات مربوط به API
2. **پشتیبانی Liara**: مشکلات مربوط به استقرار
3. **لاگ‌های سیستم**: برای شناسایی خطا

---

## 🔄 به‌روزرسانی‌ها

- **نسخه 2.0**: استفاده از دیتابیس برای ذخیره OTP
- **نسخه 1.5**: بهبود سیستم لاگ‌گذاری
- **نسخه 1.0**: سیستم پایه OTP

---

**📝 یادداشت**: همیشه قبل از تغییرات، از تنظیمات فعلی پشتیبان‌گیری کنید!
