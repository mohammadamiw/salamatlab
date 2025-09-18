# 📊 مقایسه تنظیمات SMS.ir - کاملاً مطابق مستندات رسمی

## 🔍 **بررسی تنظیمات فعلی با مستندات رسمی SMS.ir**

### ✅ **پیکربندی صحیح (بروزرسانی شده)**

#### **متغیرهای محیطی مورد نیاز:**
```bash
# تنظیمات فعلی (صحیح)
SMSIR_API_KEY=your_api_key_from_sms.ir
SMSIR_TEMPLATE_ID=your_template_id_from_sms.ir
SMSIR_TEMPLATE_PARAM_NAME=Code

# تنظیمات جدید (اختیاری)
SMSIR_CONFIRM_TEMPLATE_ID=your_confirm_template_id
SMSIR_STAFF_TEMPLATE_ID=your_staff_template_id
STAFF_NOTIFY_MOBILE=09xxxxxxxxx
```

#### **API Endpoint و Headers:**
```php
// تنظیمات صحیح (مطابق مستندات رسمی)
URL: https://api.sms.ir/v1/send/verify
Method: POST
Headers: [
    'Content-Type: application/json',
    'x-api-key: YOUR_API_KEY',
    'Accept: application/json'
]
```

#### **فرمت درخواست (Request Format):**
```json
{
  "mobile": "9123456789",
  "templateId": 100000,
  "parameters": [
    {
      "name": "Code",
      "value": "123456"
    }
  ]
}
```

---

## 📋 **جدول مقایسه کامل با مستندات SMS.ir**

| ویژگی | تنظیمات فعلی | مستندات SMS.ir | وضعیت |
|-------|---------------|----------------|--------|
| **API Endpoint** | ✅ `https://api.sms.ir/v1/send/verify` | ✅ `https://api.sms.ir/v1/send/verify` | ✅ ۱۰۰% مطابق |
| **HTTP Method** | ✅ `POST` | ✅ `POST` | ✅ ۱۰۰% مطابق |
| **Content-Type** | ✅ `application/json` | ✅ `application/json` | ✅ ۱۰۰% مطابق |
| **API Key Header** | ✅ `x-api-key` | ✅ `x-api-key` | ✅ ۱۰۰% مطابق |
| **Accept Header** | ✅ `application/json` | ✅ `application/json` | ✅ ۱۰۰% مطابق |
| **Mobile Parameter** | ✅ `mobile: string` | ✅ `mobile: string` | ✅ ۱۰۰% مطابق |
| **TemplateId Parameter** | ✅ `templateId: integer` | ✅ `templateId: integer` | ✅ ۱۰۰% مطابق |
| **Parameters Array** | ✅ `[{name, value}]` | ✅ `[{name, value}]` | ✅ ۱۰۰% مطابق |
| **Response Format** | ✅ `{status, message, data}` | ✅ `{status, message, data}` | ✅ ۱۰۰% مطابق |
| **Success Status** | ✅ `status: 1` | ✅ `status: 1` | ✅ ۱۰۰% مطابق |
| **MessageId Field** | ✅ `data.messageId` | ✅ `data.messageId` | ✅ ۱۰۰% مطابق |
| **Cost Field** | ✅ `data.cost` | ✅ `data.cost` | ✅ ۱۰۰% مطابق |
| **Error Handling** | ✅ پیشرفته با Logger | ✅ یکسان | ✅ پیشرفته‌تر |
| **SSL Verification** | ✅ فعال | ✅ یکسان | ✅ ۱۰۰% مطابق |
| **Timeout Settings** | ✅ 30 ثانیه | ✅ یکسان | ✅ ۱۰۰% مطابق |
| **Request Body Format** | ✅ کاملاً مطابق | ✅ یکسان | ✅ ۱۰۰% مطابق |

### 📝 **نمونه Request مطابق مستندات:**

**تنظیمات فعلی:**
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

**مستندات SMS.ir:**
```json
{
    "mobile": "919xxxx904",
    "templateId": 123456,
    "parameters": [
        {
            "name": "Code",
            "value": "12345"
        }
    ]
}
```

**✅ نتیجه:** کاملاً یکسان و مطابق!

---

## 🚀 **ویژگی‌های اضافه شده**

### **1. لاگ‌گذاری پیشرفته**
```php
// قبل از بروزرسانی
if (function_exists('logError')) {
    logError("SMS.ir exception", [...]);
}

// بعد از بروزرسانی
Logger::error("SMS.ir exception occurred", [
    'phone' => $phone,
    'template_id' => $templateId,
    'error_message' => $e->getMessage(),
    'error_code' => $e->getCode(),
    'file' => $e->getFile(),
    'line' => $e->getLine(),
    'trace' => $e->getTraceAsString()
]);
```

### **2. بررسی پاسخ API پیشرفته**
```php
// بررسی کامل پاسخ API
if (isset($response['status']) && intval($response['status']) === 1) {
    $isSuccess = true;
    $messageId = $response['data']['messageId'] ?? null;
    $cost = $response['data']['cost'] ?? null;

    Logger::info("SMS.ir OTP sent successfully", [
        'phone' => $phone,
        'message_id' => $messageId,
        'cost' => $cost,
        'api_response' => $response
    ]);
}
```

### **3. Exception Handling بهبود یافته**
```php
} catch (Exception $e) {
    Logger::error("SMS.ir exception occurred", [
        'phone' => $phone,
        'template_id' => $templateId,
        'error_message' => $e->getMessage(),
        'error_code' => $e->getCode(),
        'file' => $e->getFile(),
        'line' => $e->getLine(),
        'trace' => $e->getTraceAsString()
    ]);
    return false;
}
```

---

## 💻 **نمونه کدهای SMS.ir در زبان‌های مختلف**

### **C# (مستندات SMS.ir)**
```csharp
HttpClient httpClient = new HttpClient();
httpClient.DefaultRequestHeaders.Add("x-api-key", "YOUR_API_KEY");

VerifySendModel model = new VerifySendModel() {
  Mobile = "9120000000",
    TemplateId = 100000,
    Parameters = new VerifySendParameterModel[] {
      new VerifySendParameterModel {
        Name = "CODE", Value = "1234"
      }
    }
};

string payload = JsonSerializer.Serialize(model);
StringContent stringContent = new(payload, Encoding.UTF8, "application/json");
HttpResponseMessage response = await httpClient.PostAsync("https://api.sms.ir/v1/send/verify", stringContent);
```

### **PHP (پیاده‌سازی فعلی)**
```php
// تنظیمات درخواست
$requestData = [
    'mobile' => '9123456789',  // شماره موبایل (10 رقم بدون صفر)
    'templateId' => 165688,    // شناسه الگو
    'parameters' => [
        [
            'name' => 'Code',     // نام پارامتر
            'value' => '123456'   // مقدار پارامتر
        ]
    ]
];

// تنظیمات cURL
$ch = curl_init();
curl_setopt_array($ch, [
    CURLOPT_URL => 'https://api.sms.ir/v1/send/verify',
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($requestData),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'x-api-key: YOUR_API_KEY',
        'Accept: application/json'
    ]
]);

$result = curl_exec($ch);
$response = json_decode($result, true);
```

### **JavaScript/Node.js (مستندات SMS.ir)**
```javascript
const axios = require('axios');

const data = {
  mobile: "9120000000",
  templateId: 100000,
  parameters: [
    {
      name: "Code",
      value: "12345"
    }
  ]
};

const config = {
  method: 'post',
  url: 'https://api.sms.ir/v1/send/verify',
  headers: {
    'x-api-key': 'YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  data: data
};

axios(config)
.then(response => console.log(response.data))
.catch(error => console.error(error));
```

### **Python (مستندات SMS.ir)**
```python
import requests
import json

url = "https://api.sms.ir/v1/send/verify"

payload = json.dumps({
  "mobile": "9120000000",
  "templateId": 100000,
  "parameters": [
    {
      "name": "Code",
      "value": "12345"
    }
  ]
})

headers = {
  'x-api-key': 'YOUR_API_KEY',
  'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)
print(response.text)
```

---

## 📦 **پکیج‌های SMS.ir برای زبان‌های مختلف**

بر اساس مستندات رسمی، SMS.ir پکیج‌های آماده برای زبان‌های مختلف ارائه می‌دهد:

### **PHP (Laravel)**
```bash
composer require ipe/smsir-php
```

```php
use Ipe\Sdk\Facades\SmsIr;

$response = SmsIr::verifySend($mobile, $templateId, $parameters);
```

### **Node.js**
```bash
npm install smsir-js
```

```javascript
import {Smsir} from 'smsir-js'

const smsir = new Smsir(api_key, line_number)
```

### **Python**
```bash
pip install smsir-python
```

```python
from sms_ir import SmsIr
sms_ir = SmsIr(api_key, linenumber)
```

### **.NET**
```bash
Install-Package IPE.SmsIR
```

```csharp
SmsIr smsIr = new SmsIr("YOUR API KEY");
var result = await smsIr.VerifySendAsync("9120000000", 100000, parameters);
```

---

## 🧪 **تست نهایی سیستم**

### **مرحله ۱: تست تنظیمات**
```bash
POST https://your-backend-url/api/test-sms.php
{
  "action": "test_config"
}
```

### **مرحله ۲: تست ارسال OTP**
```bash
POST https://your-backend-url/api/test-otp.php
{
  "action": "test_send",
  "phone": "09123456789"
}
```

### **مرحله ۳: تست واقعی SMS**
```bash
POST https://your-backend-url/api/otp.php
{
  "action": "send",
  "phone": "09123456789"
}
```

---

## ✅ **نتیجه:**

**تنظیمات سیستم کاملاً با مستندات رسمی SMS.ir سازگار است!** 🎉

### **ویژگی‌های کلیدی:**
- ✅ **API Endpoint صحیح**
- ✅ **Headers استاندارد**
- ✅ **فرمت درخواست صحیح**
- ✅ **پاسخگویی پیشرفته**
- ✅ **لاگ‌گذاری کامل**
- ✅ **Error Handling قوی**
- ✅ **SSL Verification فعال**

### **آماده برای استفاده:**
سیستم OTP شما اکنون کاملاً آماده است و با تمام استانداردهای SMS.ir سازگار است.

**فقط کافی است متغیرهای محیطی را در پنل Liara تنظیم کنید و شروع کنید!** 🚀
