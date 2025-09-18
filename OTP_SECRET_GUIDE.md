# 🔐 **راهنمای تولید OTP_SECRET**

## ❓ **OTP_SECRET چیست؟**

**OTP_SECRET** یک **کلید امنیتی رمزگذاری شده** است که برای تولید و بررسی کدهای امنیتی OTP (One-Time Password) استفاده می‌شود.

### **کاربردها:**
- ✅ تولید کدهای امنیتی تصادفی
- ✅ بررسی صحت کدهای وارد شده
- ✅ جلوگیری از حملات brute force
- ✅ امنیت سیستم OTP

---

## 🔧 **چگونه تولید کنیم؟**

### **روش ۱: Node.js (ساده‌ترین)**

```javascript
// فایل generate-secret.js
const crypto = require('crypto');

// تولید کلید 32 کاراکتری
const secret = crypto.randomBytes(32).toString('hex');

console.log('OTP_SECRET:', secret);
console.log('Length:', secret.length);
```

**اجرای کد:**
```bash
node generate-secret.js
```

**خروجی نمونه:**
```
OTP_SECRET: a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890ab
Length: 64
```

### **روش ۲: Python**

```python
# فایل generate_secret.py
import secrets

# تولید کلید 32 بایتی (64 کاراکتری hex)
secret = secrets.token_hex(32)

print(f"OTP_SECRET: {secret}")
print(f"Length: {len(secret)}")
```

**اجرای کد:**
```bash
python generate_secret.py
```

### **روش ۳: PHP (در سرور)**

```php
<?php
// فایل generate_secret.php
$secret = bin2hex(random_bytes(32));

echo "OTP_SECRET: " . $secret . "\n";
echo "Length: " . strlen($secret) . "\n";
?>
```

**اجرای کد:**
```bash
php generate_secret.php
```

### **روش ۴: آنلاین (سریع)**

اگر دسترسی به ترمینال ندارید، از سایت‌های آنلاین استفاده کنید:

1. برید به: [random.org](https://www.random.org/strings/)
2. تنظیمات:
   - **Length:** 64
   - **Format:** Hexadecimal
   - **Number of strings:** 1
3. روی **"Get Strings"** کلیک کنید

---

## 📋 **مثال کلید تولید شده:**

```
OTP_SECRET=a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890ab
```

### **خصوصیات کلید:**
- ✅ **طول:** ۶۴ کاراکتر (۳۲ بایت hex)
- ✅ **فرمت:** hexadecimal (0-9, a-f)
- ✅ **امنیت:** کاملاً تصادفی
- ✅ **یکتا:** برای هر پروژه منحصر به فرد

---

## ⚙️ **تنظیم در لیارا:**

### **پنل لیارا → اپ salamatlab-backend → متغیرهای محیطی:**

```bash
OTP_SECRET=a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890ab
```

### **یا در فایل .env (برای توسعه محلی):**

```env
OTP_SECRET=a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890ab
```

---

## 🔍 **چرا ۳۲ کاراکتر؟**

### **استانداردهای امنیتی:**
- **AES-256:** نیاز به ۳۲ بایت کلید دارد
- **HMAC-SHA256:** از ۳۲ بایت کلید استفاده می‌کند
- **امنیت بالا:** مقاوم در برابر حملات brute force

### **طول در فرمت‌های مختلف:**
- **Bytes:** ۳۲
- **Hexadecimal:** ۶۴ کاراکتر
- **Base64:** ۴۳ کاراکتر

---

## 🧪 **تست صحت کلید:**

### **کد تست PHP:**

```php
<?php
// فایل test_secret.php
$secret = getenv('OTP_SECRET');

if (!$secret) {
    echo "❌ OTP_SECRET تنظیم نشده\n";
    exit(1);
}

if (strlen($secret) !== 64) {
    echo "❌ طول کلید باید ۶۴ کاراکتر باشد\n";
    echo "طول فعلی: " . strlen($secret) . "\n";
    exit(1);
}

if (!preg_match('/^[a-f0-9]+$/', $secret)) {
    echo "❌ کلید باید فقط شامل حروف a-f و اعداد باشد\n";
    exit(1);
}

echo "✅ OTP_SECRET معتبر است\n";
echo "کلید: " . substr($secret, 0, 16) . "...\n";
echo "طول: " . strlen($secret) . " کاراکتر\n";
?>
```

### **اجرای تست:**
```bash
# در سرور
php test_secret.php

# یا تست آنلاین
curl https://salamatlab-backend.liara.run/test_secret.php
```

---

## 🔐 **نکات امنیتی:**

### **✅ نکات مهم:**
- 🔒 **هرگز کلید را در کد قرار ندهید**
- 🔒 **کلید را در متغیرهای محیطی نگه دارید**
- 🔒 **کلید را با دیگران به اشتراک نگذارید**
- 🔒 **کلید را منظماً تغییر دهید**
- 🔒 **کلید را در لاگ‌ها نمایش ندهید**

### **❌ اشتباهات رایج:**
- ❌ استفاده از کلیدهای ضعیف مثل "123456"
- ❌ قرار دادن کلید در فایل‌های عمومی
- ❌ استفاده از کلیدهای تکراری
- ❌ نمایش کلید در لاگ‌ها

---

## 🔄 **تغییر کلید:**

### **اگر نیاز به تغییر کلید داشتید:**

1. **کلید جدید تولید کنید**
2. **در لیارا تغییر دهید**
3. **سیستم را تست کنید**
4. **کدهای قدیمی OTP منقضی شوند**

### **تأثیر تغییر کلید:**
- ⚠️ **کدهای OTP موجود منقضی می‌شوند**
- ⚠️ **کاربران باید کد جدید درخواست کنند**
- ⚠️ **سیستم به طور موقت مختل می‌شود**

---

## 🎯 **خلاصه:**

**OTP_SECRET** یک **کلید امنیتی ۶۴ کاراکتری** است که:

- 🔐 **برای تولید کدهای امنیتی** استفاده می‌شود
- 🔐 **باید کاملاً تصادفی** باشد
- 🔐 **در متغیرهای محیطی** ذخیره شود
- 🔐 **هرگز در کد قرار نگیرد**

### **تولید سریع:**
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# یا Python
python -c "import secrets; print(secrets.token_hex(32))"
```

**حالا کلید خودتان را تولید کنید و در لیارا تنظیم کنید!** 🚀
