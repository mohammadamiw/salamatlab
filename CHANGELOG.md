# Changelog | تاریخچه تغییرات

تمام تغییرات مهم این پروژه در این فایل ثبت می‌شود.

فرمت این فایل بر اساس [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) است و این پروژه از [Semantic Versioning](https://semver.org/spec/v2.0.0.html) پیروی می‌کند.

## [Unreleased] - در حال توسعه

### Added - اضافه شده
- سیستم مدیریت نسخه با Git
- فایل‌های پیکربندی Git (.gitignore, .gitattributes)
- مستندات مشارکت (CONTRIBUTING.md)
- تاریخچه تغییرات (CHANGELOG.md)

### Changed - تغییر یافته
- به‌روزرسانی README.md با اطلاعات Git

### Fixed - رفع شده
- تنظیمات line endings برای Windows

## [1.0.0] - ۱۴۰۴-۰۱-۰۱

### Added - اضافه شده
- وب‌سایت اصلی آزمایشگاه سلامت
- سیستم رزرو نوبت
- صفحه پزشکان
- مقالات پزشکی
- فرم تماس
- پنل ادمین
- سیستم احراز هویت
- API های مختلف
- طراحی responsive
- انیمیشن‌های تعاملی
- SEO بهینه
- پشتیبانی از زبان فارسی

### Technical - فنی
- React 18 + TypeScript
- Vite برای build
- Tailwind CSS + shadcn/ui
- React Router DOM
- React Query
- Supabase برای دیتابیس
- Lucide React برای آیکون‌ها

---

## نحوه استفاده از Changelog

### انواع تغییرات

- **Added**: ویژگی‌های جدید
- **Changed**: تغییرات در عملکرد موجود
- **Deprecated**: ویژگی‌هایی که در آینده حذف خواهند شد
- **Removed**: ویژگی‌های حذف شده
- **Fixed**: رفع باگ‌ها
- **Security**: بهبودهای امنیتی

### مثال‌ها

```markdown
## [1.1.0] - ۱۴۰۴-۰۲-۱۵

### Added
- سیستم پرداخت آنلاین
- اعلان‌های push

### Changed
- بهبود عملکرد صفحه اصلی
- به‌روزرسانی UI کامپوننت‌ها

### Fixed
- رفع مشکل نمایش در مرورگر Safari
- رفع خطای validation فرم رزرو

### Security
- به‌روزرسانی dependencies برای رفع آسیب‌پذیری‌ها
```

## نکات مهم

1. **تاریخ**: از تاریخ شمسی استفاده کنید
2. **جزئیات**: تغییرات را به طور واضح توضیح دهید
3. **مرجع**: در صورت امکان، شماره issue یا PR را ذکر کنید
4. **Breaking Changes**: تغییرات مهم را مشخص کنید
