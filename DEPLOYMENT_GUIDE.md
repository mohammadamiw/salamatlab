# راهنمای استقرار امن سیستم رزرو

## ⚠️ تغییر مهم: سیستم داده‌ها جدا شده

از این پس، داده‌های کاربران در پوشه جداگانه `salamatlab_data/` ذخیره می‌شود که در هنگام آپدیت پاک نخواهد شد.

## مراحل استقرار جدید

### 1. راه‌اندازی اولیه (یک بار)

#### الف) آپلود اسکریپت‌های راه‌اندازی
```bash
upload: setup-data-directory.php
upload: deploy-safe.php
```

#### ب) اجرای راه‌اندازی
1. دسترسی به: `https://yourdomain.com/setup-data-directory.php`
2. رمز عبور را وارد کنید (پیش‌فرض: salamatlab33010)
3. روی "ایجاد پوشه داده‌ها" کلیک کنید

#### ج) انتقال داده‌های موجود (اختیاری)
اگر قبلاً داده‌ای دارید:
```bash
# انتقال فایل‌های موجود به پوشه جدید
cp bookings.log ../salamatlab_data/
cp contacts.log ../salamatlab_data/
cp requests_store.json ../salamatlab_data/
```

### 2. استقرار نسخه‌های جدید

#### روش ۱: استفاده از پنل وب (توصیه شده)
1. دسترسی به: `https://yourdomain.com/deploy-safe.php`
2. پشتیبان‌گیری اضطراری انجام دهید
3. فایل ZIP جدید را آپلود کنید
4. استقرار را شروع کنید

#### روش ۲: استفاده از اسکریپت خط فرمان
```bash
# آپلود deploy.sh به سرور
chmod +x deploy.sh
./deploy.sh production
```

#### روش ۳: آپلود دستی
```bash
# آپلود محتویات dist/ به public_html/
# اما NEVER آپلود در salamatlab_data/ یا salamatlab_backups/
```

### 3. ساختار فایل‌های نهایی

```
your-host/
├── public_html/          # فایل‌های وب (قابل overwirte)
│   ├── api/
│   ├── assets/
│   ├── index.html
│   └── ...
├── salamatlab_data/      # داده‌ها (حفظ شود!)
│   ├── bookings.log
│   ├── contacts.log
│   ├── requests_store.json
│   └── .htaccess
└── salamatlab_backups/   # پشتیبان‌ها
    ├── backup_2024-01-01.zip
    └── ...
```

## 📋 چک لیست استقرار امن

### قبل از استقرار:
- [ ] پشتیبان‌گیری از داده‌های فعلی
- [ ] تست نسخه جدید در محیط local
- [ ] اطمینان از وجود پوشه `salamatlab_data/`
- [ ] بررسی فایل‌های ضروری (config.php تغییر یافته)

### حین استقرار:
- [ ] استفاده از پنل deploy-safe.php
- [ ] یا اجرای اسکریپت deploy.sh
- [ ] NEVER آپلود مستقیم در پوشه data

### بعد از استقرار:
- [ ] تست فرم رزرو
- [ ] تست فرم تماس
- [ ] بررسی ایمیل‌ها
- [ ] پاک کردن کش مرورگر

#### الف) اطمینان از فعال بودن PHP
- PHP 7.4 یا بالاتر
- فعال بودن ماژول `mail` برای ارسال ایمیل

#### ب) تنظیمات ایمیل
در فایل `booking.php`، آدرس ایمیل مدیر را تغییر دهید:

```php
$admin_email = 'your-email@domain.com'; // ایمیل مدیر
```

#### ج) تنظیمات CORS
فایل `.htaccess` باید CORS را به درستی تنظیم کند.

### 4. تست سیستم

#### الف) تست اتصال
از فایل `test-booking-api.html` برای تست اتصال استفاده کنید.

#### ب) تست فرم اصلی
فرم رزرو را در سایت اصلی تست کنید.

## عیب‌یابی

### مشکلات رایج

#### 1. خطای 404
- بررسی مسیر فایل‌ها
- بررسی تنظیمات `.htaccess`

#### 2. خطای CORS
- بررسی تنظیمات `.htaccess`
- اطمینان از فعال بودن `mod_headers`

#### 3. عدم ارسال ایمیل
- بررسی تنظیمات PHP mail
- بررسی آدرس ایمیل مدیر

#### 4. خطای JSON
- بررسی Content-Type header
- بررسی ساختار داده‌های ارسالی

### لاگ‌ها

سیستم رزرو در فایل `bookings.log` لاگ می‌کند. این فایل را بررسی کنید:

```bash
tail -f bookings.log
```

## امنیت

### توصیه‌های امنیتی

1. **اعتبارسنجی داده‌ها**: تمام ورودی‌ها در PHP اعتبارسنجی می‌شوند
2. **Sanitization**: از `htmlspecialchars` استفاده شده
3. **CORS محدود**: در صورت نیاز، CORS را محدود کنید
4. **Rate Limiting**: در صورت نیاز، محدودیت تعداد درخواست اضافه کنید

### تنظیمات پیشرفته

#### محدود کردن CORS به دامنه خاص
```apache
Header always set Access-Control-Allow-Origin "https://yourdomain.com"
```

#### اضافه کردن Rate Limiting
```apache
# در .htaccess
RewriteCond %{HTTP:X-Forwarded-For} ^$
RewriteCond %{REMOTE_ADDR} ^$
RewriteRule .* - [E=REMOTE_ADDR:%{HTTP:X-Forwarded-For}]
```

## پشتیبانی

در صورت بروز مشکل:

1. بررسی لاگ‌های سرور
2. بررسی لاگ‌های PHP
3. تست با فایل `test-booking-api.html`
4. بررسی تنظیمات هاست

## به‌روزرسانی

برای به‌روزرسانی:

1. فایل‌های جدید را آپلود کنید
2. کش مرورگر را پاک کنید
3. تست کنید
4. در صورت نیاز، فایل‌های قدیمی را پاک کنید
