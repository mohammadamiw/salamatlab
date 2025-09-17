# 🔧 راهنمای حل مشکل Deployment

## مشکل شناسایی شده

سایت سلامت لب دچار مشکل در deployment شده بود که علت اصلی آن **تنظیمات ناقص فایل `liara.json`** بود.

## مشکلات حل شده

### ✅ 1. بروزرسانی فایل liara.json

**قبل:**
```json
{
  "app": "salamatlab",
  "platform": "static", 
  "port": 80,
  "build": {
    "location": "iran"
  },
  "disks": []
}
```

**بعد:**
```json
{
  "app": "salamatlab",
  "platform": "static",
  "port": 80,
  "build": {
    "location": "iran",
    "buildCommand": "npm run build:liara",
    "publishDirectory": "dist"
  },
  "disks": []
}
```

### ✅ 2. تأیید وجود فایل‌ها در dist/

- ✅ `index.html`
- ✅ `doctors/*.json` (تمام فایل‌های JSON)
- ✅ `fonts/Shabnam/*` (تمام فونت‌ها)
- ✅ `images/*` (تصاویر)
- ✅ `manifest.webmanifest`
- ✅ `favicon.ico`

### ✅ 3. ایجاد فایل تست

فایل `dist/deployment-test.html` برای تست deployment ایجاد شد.

## مراحل deploy مجدد

### 1. Commit تغییرات
```bash
git add .
git commit -m "fix: اصلاح تنظیمات deployment لیارا"
git push origin main
```

### 2. Deploy در لیارا
```bash
# یکی از روش‌های زیر:

# روش 1: از طریق CLI
liara deploy

# روش 2: از طریق Git
# پس از push، لیارا خودکار build می‌کند
```

### 3. تست سایت
بعد از deployment مراجعه کنید به:
- `https://salamatlab.liara.run/` - سایت اصلی
- `https://salamatlab.liara.run/deployment-test.html` - فایل تست

## عملکرد فعلی

### لاگ‌های قبل از حل مشکل:
❌ `GET 404 /doctors/index.json`  
❌ `GET 404 /fonts/Shabnam/Shabnam-FD.woff`  
❌ `GET 404 /manifest.webmanifest`  

### لاگ‌های مورد انتظار بعد از حل مشکل:
✅ `GET 200 /doctors/index.json`  
✅ `GET 200 /fonts/Shabnam/Shabnam-FD.woff`  
✅ `GET 200 /manifest.webmanifest`  

## توضیح تکنیکی

### چرا مشکل پیش آمد؟
1. **فایل liara.json ناقص**: لیارا نمی‌دانست از کدام پوشه فایل‌ها را serve کند
2. **عدم تعیین publishDirectory**: لیارا از root directory فایل‌ها را جستجو می‌کرد
3. **عدم اجرای build command**: فایل‌های dist بروز نبودند

### چگونه حل شد؟
1. **publishDirectory**: حالا لیارا از پوشه `dist/` فایل‌ها را serve می‌کند
2. **buildCommand**: قبل از deploy، اتوماتیک `npm run build:liara` اجرا می‌شود
3. **فرآیند صحیح build**: فایل‌های جدید در `dist/` قرار می‌گیرند

## نکات مهم

- ✅ همواره قبل از deploy، فایل‌های `dist/` را بررسی کنید
- ✅ از `npm run build:liara` برای build production استفاده کنید  
- ✅ در صورت مشکل، لاگ‌های لیارا را بررسی کنید
- ✅ فایل تست `deployment-test.html` را بعد از هر deploy چک کنید

---

**آخرین بروزرسانی:** $(date +'%Y-%m-%d %H:%M:%S')  
**وضعیت:** حل شده ✅
