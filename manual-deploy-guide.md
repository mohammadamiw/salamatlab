# راهنمای Manual Deploy برای Liara

## 🚫 مشکل: Max deployment count in day

## ✅ راه‌حل: Manual Deploy بدون Git

### مرحله 1: آماده‌سازی فایل‌ها

```bash
# 1. Build Frontend
npm run build

# 2. آماده‌سازی Backend
mkdir temp-backend
cp -r public/ temp-backend/
cp liara-backend.json temp-backend/liara.json
cp database-schema.sql temp-backend/
```

### مرحله 2: Manual Deploy Frontend

```bash
# Zip کردن build files
cd dist
zip -r frontend-build.zip *

# یا با PowerShell در Windows:
Compress-Archive -Path dist\* -DestinationPath frontend-build.zip
```

### مرحله 3: Manual Deploy Backend

```bash
# Zip کردن backend files  
cd temp-backend
zip -r backend-files.zip *

# یا با PowerShell:
Compress-Archive -Path temp-backend\* -DestinationPath backend-files.zip
```

### مرحله 4: Upload در پنل Liara

1. برو به panel.liara.ir
2. بخش Deployments
3. "Manual Deploy" را انتخاب کن
4. ZIP files آپلود کن

## 🎯 مزایای Manual Deploy:

- ✅ محدودیت Git deployment نداره  
- ✅ کنترل کامل روی فایل‌ها
- ✅ سریع‌تر (فقط فایل‌های ضروری)

## 📝 نکات مهم:

- Environment Variables را جداگانه در پنل تنظیم کن
- هر بار که تغییری دادی، دوباره build و zip کن
- Backend و Frontend جداگانه deploy کن
