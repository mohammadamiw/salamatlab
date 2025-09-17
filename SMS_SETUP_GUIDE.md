# راهنمای تنظیم SMS.ir برای پروژه SalamatLab

## 📱 تنظیمات SMS.ir مطابق مستندات رسمی

### مرحله 1: دریافت API Key

1. وارد پنل SMS.ir خود شوید
2. به بخش **"برنامه‌نویسان"** > **"لیست کلیدهای API"** بروید
3. API Key خود را کپی کنید

### مرحله 2: ایجاد Templates در پنل SMS.ir

در بخش **"ارسال سریع"** پنل خود، templates زیر را ایجاد کنید:

#### 🔐 Template کد OTP (اجباری):
```
کد تایید شما: #Code#
آزمایشگاه سلامت
```
- **پارامتر**: `Code`
- **استفاده**: ورود کاربران و تایید شماره تلفن

#### ✅ Template تایید چکاپ:
```
سلام #NAME# عزیز
درخواست #CHECKUP# شما با موفقیت ثبت شد.
آزمایشگاه سلامت
```
- **پارامترها**: `NAME`, `CHECKUP`

#### ✅ Template تایید عمومی:
```
سلام #NAME# عزیز
درخواست شما با موفقیت ثبت شد. به زودی تماس می‌گیریم.
آزمایشگاه سلامت
```
- **پارامتر**: `NAME`

#### 📋 Template اطلاع‌رسانی همکار:
```
درخواست جدید ثبت شد.
مشاهده: #LINK#
آزمایشگاه سلامت
```
- **پارامتر**: `LINK`

### مرحله 3: تنظیم Environment Variables

در پنل هاست خود، این متغیرها را تنظیم کنید:

```bash
# اطلاعات اصلی SMS.ir
SMSIR_API_KEY=your_api_key_from_sms_ir_panel
SMSIR_TEMPLATE_ID=your_otp_template_id
SMSIR_TEMPLATE_PARAM_NAME=Code

# Templates تایید (Template IDs را از پنل SMS.ir بگیرید)
CHECKUP_CONFIRM_TEMPLATE_ID=123456
CHECKUP_CONFIRM_NAME_PARAM=NAME
CHECKUP_CONFIRM_TITLE_PARAM=CHECKUP

SMSIR_CONFIRM_TEMPLATE_ID=123457
SMSIR_CONFIRM_PARAM_NAME=NAME

# Template اطلاع‌رسانی همکار
SMSIR_STAFF_TEMPLATE_ID=123458
SMSIR_STAFF_PARAM_NAME=LINK
STAFF_NOTIFY_MOBILE=09123456789

# Templates اضافی (اختیاری)
FEEDBACK_CONFIRM_TEMPLATE_ID=123459
CAREERS_CONFIRM_TEMPLATE_ID=123460
CONTACT_CONFIRM_TEMPLATE_ID=123461
```

### مرحله 4: تست سیستم

#### تست کانفیگ:
```
https://yourdomain.com/api/test-sms.php
```

#### تست Live ارسال:
```
https://yourdomain.com/api/test-sms.php?live_test=1&test_phone=09123456789
```

## 🔧 مشخصات فنی API

### Endpoint:
```
POST https://api.sms.ir/v1/send/verify
```

### Headers:
```
Content-Type: application/json
x-api-key: YOUR_API_KEY
Accept: application/json
```

### Request Body:
```json
{
    "mobile": "09123456789",
    "templateId": 123456,
    "parameters": [
        {
            "name": "Code",
            "value": "123456"
        }
    ]
}
```

### Response:
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

## 📊 نحوه استفاده در کد

### ارسال OTP:
```php
// در فایل‌های PHP موجود
$result = sendOtpSms('09123456789', '123456');
```

### ارسال تایید چکاپ:
```php
$result = sendTemplateSMS('09123456789', CHECKUP_CONFIRM_TEMPLATE_ID, [
    'NAME' => 'احمد محمدی',
    'CHECKUP' => 'چکاپ عمومی'
]);
```

### ارسال تایید عمومی:
```php
$result = sendTemplateSMS('09123456789', SMSIR_CONFIRM_TEMPLATE_ID, [
    'NAME' => 'احمد محمدی'
]);
```

## 🐛 عیب‌یابی

### مشکلات رایج:

#### 1. **API Key Invalid**
- ✅ بررسی کنید API Key از پنل SMS.ir کپی شده
- ✅ فضای خالی اضافی نباشد
- ✅ متغیر `SMSIR_API_KEY` در environment تنظیم شده

#### 2. **Template Not Found**
- ✅ Template ID صحیح است؟
- ✅ Template در پنل SMS.ir فعال است؟
- ✅ نام پارامترها دقیقاً مطابق Template است؟

#### 3. **SMS Not Delivered**
- ✅ شماره موبایل صحیح است؟
- ✅ اعتبار SMS.ir کافی است؟
- ✅ خط ارسال مسدود نشده؟

#### 4. **HTTP 401 Error**
- ✅ API Key اشتباه است
- ✅ Header `x-api-key` صحیح ارسال نمی‌شود

#### 5. **HTTP 400 Error**
- ✅ فرمت JSON اشتباه است
- ✅ Template ID یا پارامترها نادرست

### بررسی Logs:

Logs در فایل‌های زیر ذخیره می‌شوند:
- `/tmp/salamat-app.log` (لاگ‌های عمومی)
- Console log در browser (خطاهای JavaScript)

### نمونه Response های رایج:

#### موفق:
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

#### خطا - API Key اشتباه:
```json
{
    "status": 0,
    "message": "کلید API نامعتبر است"
}
```

#### خطا - Template نامعتبر:
```json
{
    "status": 0,
    "message": "قالب یافت نشد"
}
```

## 💡 نکات مهم

1. **Rate Limiting**: SMS.ir محدودیت ارسال دارد - از ارسال پیاپی جلوگیری کنید
2. **Cost Management**: هر SMS هزینه دارد - غیرضروری ارسال نکنید  
3. **Template Approval**: Templates ممکن است نیاز به تایید داشته باشند
4. **Parameter Length**: پارامترها حداکثر 25 کاراکتر
5. **SSL/TLS**: اتصال HTTPS اجباری است

## 📞 پشتیبانی

### خطاهای فنی:
1. فایل `test-sms.php` را چک کنید
2. Logs را بررسی کنید
3. Template IDs را تایید کنید
4. API Key را دوباره بررسی کنید

### تماس با SMS.ir:
- **پنل پشتیبانی**: در سایت SMS.ir
- **مستندات**: https://api.sms.ir/
- **تیکت**: از پنل کاربری

---

**نکته**: این راهنما بر اساس مستندات رسمی SMS.ir نوشته شده و کاملاً سازگار است.
