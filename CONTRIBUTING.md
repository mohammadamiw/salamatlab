# راهنمای مشارکت در پروژه | Contributing Guide

## 🚀 شروع کار

برای مشارکت در پروژه آزمایشگاه سلامت، لطفاً این راهنما را مطالعه کنید.

## 📋 پیش‌نیازها

- Node.js (نسخه 18 یا بالاتر)
- Git
- npm یا yarn
- یک IDE مناسب (VS Code توصیه می‌شود)

## 🔧 راه‌اندازی محیط توسعه

```bash
# 1. Fork کردن repository
# 2. Clone کردن repository شخصی
git clone https://github.com/YOUR_USERNAME/SalamatLab.git
cd SalamatLab

# 3. اضافه کردن upstream repository
git remote add upstream https://github.com/ORIGINAL_OWNER/SalamatLab.git

# 4. نصب وابستگی‌ها
npm install

# 5. اجرای پروژه
npm run dev
```

## 🌿 کار با Branches

### نام‌گذاری Branches

```bash
# برای ویژگی‌های جدید
git checkout -b feature/نام-ویژگی

# برای رفع باگ‌ها
git checkout -b fix/نام-باگ

# برای بهبود عملکرد
git checkout -b perf/نام-بهبود

# برای مستندسازی
git checkout -b docs/نام-مستند
```

### مثال‌های نام‌گذاری

```bash
feature/booking-system
fix/login-validation
perf/image-optimization
docs/api-documentation
```

## 📝 قوانین Commit

### فرمت Commit Message

```
type(scope): description

[optional body]

[optional footer]
```

### انواع Commit

- `feat`: ویژگی جدید
- `fix`: رفع باگ
- `docs`: تغییرات مستندات
- `style`: تغییرات فرمت‌بندی
- `refactor`: بازنویسی کد
- `test`: اضافه کردن یا تغییر تست‌ها
- `chore`: تغییرات در فرآیند build یا ابزارها

### مثال‌های Commit

```bash
feat(booking): add appointment scheduling system
fix(auth): resolve login validation issue
docs(readme): update installation instructions
style(components): improve button styling
refactor(api): optimize database queries
test(booking): add unit tests for booking form
chore(deps): update dependencies to latest versions
```

## 🔍 بررسی کد (Code Review)

### قبل از ارسال Pull Request

1. **تست کردن**: اطمینان حاصل کنید که تمام تست‌ها موفق هستند
2. **Linting**: کد را با ESLint بررسی کنید
3. **TypeScript**: از عدم وجود خطاهای TypeScript اطمینان حاصل کنید
4. **Performance**: عملکرد کد را بررسی کنید

```bash
# اجرای تست‌ها
npm test

# بررسی کد
npm run lint

# بررسی TypeScript
npm run type-check

# ساخت پروژه
npm run build
```

### ارسال Pull Request

1. **عنوان واضح**: عنوان PR باید واضح و توصیفی باشد
2. **توضیحات کامل**: تغییرات را به طور کامل توضیح دهید
3. **Screenshots**: در صورت تغییرات UI، تصاویر اضافه کنید
4. **Issue Reference**: اگر مربوط به issue خاصی است، آن را ذکر کنید

## 🎨 استانداردهای کدنویسی

### TypeScript

- از TypeScript برای تمام فایل‌های جدید استفاده کنید
- Interface ها و Type ها را تعریف کنید
- از `any` استفاده نکنید

### React

- از Functional Components استفاده کنید
- از Hooks استفاده کنید
- Props را با TypeScript تعریف کنید

### CSS/Styling

- از Tailwind CSS استفاده کنید
- از shadcn/ui برای کامپوننت‌ها استفاده کنید
- از CSS Modules در صورت نیاز استفاده کنید

### نام‌گذاری

- فایل‌ها: PascalCase برای کامپوننت‌ها، camelCase برای سایر فایل‌ها
- متغیرها: camelCase
- ثابت‌ها: UPPER_SNAKE_CASE
- کامپوننت‌ها: PascalCase

## 🐛 گزارش باگ‌ها

### فرمت گزارش باگ

```markdown
## شرح باگ
توضیح کوتاه و واضح از مشکل

## مراحل بازتولید
1. به صفحه '...' بروید
2. روی '...' کلیک کنید
3. اسکرول کنید تا '...'
4. خطا را مشاهده کنید

## رفتار مورد انتظار
توضیح آنچه باید اتفاق بیفتد

## رفتار فعلی
توضیح آنچه در حال حاضر اتفاق می‌افتد

## اطلاعات اضافی
- مرورگر: Chrome 120.0
- سیستم عامل: Windows 11
- نسخه: 1.0.0
```

## 💡 پیشنهاد ویژگی‌ها

### فرمت پیشنهاد

```markdown
## مشکل
توضیح مشکل یا نیاز

## راه‌حل پیشنهادی
توضیح راه‌حل

## مزایا
- مزیت 1
- مزیت 2
- مزیت 3

## پیچیدگی
سطح پیچیدگی پیاده‌سازی (کم/متوسط/زیاد)
```

## 📞 ارتباط

- **ایمیل**: info@salamat.com
- **GitHub Issues**: برای گزارش باگ‌ها و پیشنهادات
- **Discussions**: برای بحث‌های عمومی

## 🙏 تشکر

از مشارکت شما در بهبود پروژه آزمایشگاه سلامت تشکر می‌کنیم!

---

**آخرین به‌روزرسانی**: ۱۴۰۴
