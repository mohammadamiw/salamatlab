# خلاصه راه‌اندازی Git | Git Setup Summary

## ✅ کارهای انجام شده

### 1. راه‌اندازی Git Repository
- ✅ Git repository ایجاد شد
- ✅ فایل `.gitignore` برای نادیده گرفتن فایل‌های غیرضروری
- ✅ فایل `.gitattributes` برای تنظیمات line endings
- ✅ اولین commit با تمام فایل‌های پروژه

### 2. مستندات Git
- ✅ `README.md` به‌روزرسانی شد با اطلاعات Git
- ✅ `CONTRIBUTING.md` برای دستورالعمل‌های مشارکت
- ✅ `CHANGELOG.md` برای ثبت تغییرات
- ✅ `GIT_WORKFLOW.md` برای گردش کار Git

### 3. اسکریپت‌های کمکی
- ✅ اسکریپت‌های Git در `package.json` اضافه شدند:
  - `npm run git:status` - بررسی وضعیت
  - `npm run git:log` - مشاهده تاریخچه
  - `npm run git:add` - اضافه کردن فایل‌ها
  - `npm run git:commit` - ثبت تغییرات
  - `npm run git:push` - ارسال به remote
  - `npm run git:pull` - دریافت از remote
  - `npm run git:branch` - مشاهده branches
  - `npm run git:checkout` - تغییر branch

## 📊 وضعیت فعلی

### Commits ایجاد شده
```
d55313e (HEAD -> master) docs: add comprehensive Git workflow guide
4253fd8 feat: add Git helper scripts to package.json
01297fe docs: add contributing guide and changelog
862c27a Add Git configuration and documentation
61f78c9 Initial commit: SalamatLab project setup
```

### فایل‌های پیکربندی
- `.gitignore` - فایل‌های نادیده گرفته شده
- `.gitattributes` - تنظیمات line endings
- `package.json` - اسکریپت‌های Git

### مستندات
- `README.md` - راهنمای اصلی پروژه
- `CONTRIBUTING.md` - دستورالعمل‌های مشارکت
- `CHANGELOG.md` - تاریخچه تغییرات
- `GIT_WORKFLOW.md` - گردش کار Git

## 🚀 مراحل بعدی

### 1. تنظیم Remote Repository
```bash
# اضافه کردن remote (GitHub/GitLab)
git remote add origin https://github.com/username/SalamatLab.git

# ارسال به remote
git push -u origin master
```

### 2. تنظیم Git User
```bash
# تنظیم نام کاربری
git config --global user.name "نام شما"
git config --global user.email "ایمیل شما"
```

### 3. شروع کار با Git
```bash
# بررسی وضعیت
npm run git:status

# ایجاد branch جدید برای ویژگی
git checkout -b feature/new-feature

# اضافه کردن تغییرات
npm run git:add

# ثبت تغییرات
npm run git:commit "feat: add new feature"

# ارسال تغییرات
npm run git:push
```

## 📋 دستورات مفید

### بررسی وضعیت
```bash
npm run git:status    # وضعیت فعلی
npm run git:log       # تاریخچه commits
npm run git:branch    # مشاهده branches
```

### کار با فایل‌ها
```bash
npm run git:add       # اضافه کردن تمام فایل‌ها
git add <file>        # اضافه کردن فایل خاص
git reset <file>      # حذف فایل از staging
```

### کار با Commits
```bash
npm run git:commit "پیام"  # ثبت تغییرات
git commit --amend         # تغییر آخرین commit
git reset --soft HEAD~1    # undo آخرین commit
```

### کار با Branches
```bash
git checkout -b feature/new    # ایجاد branch جدید
git checkout main              # تغییر به main
git merge feature/new          # merge branch
git branch -d feature/old      # حذف branch
```

## 🎯 بهترین شیوه‌ها

1. **Commit های کوچک و مکرر**: هر commit باید یک تغییر منطقی باشد
2. **پیام‌های واضح**: از فرمت `type(scope): description` استفاده کنید
3. **Branch های کوتاه**: branch ها را زود merge کنید
4. **Pull Request**: از PR برای code review استفاده کنید
5. **Backup**: همیشه از کد backup داشته باشید

## 📞 کمک

- فایل `GIT_WORKFLOW.md` برای دستورالعمل‌های کامل
- فایل `CONTRIBUTING.md` برای استانداردهای مشارکت
- `git help <command>` برای کمک به دستورات خاص

---

**تاریخ راه‌اندازی**: ۱۴۰۴  
**وضعیت**: ✅ کامل شده
