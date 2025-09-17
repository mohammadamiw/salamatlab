# آزمایشگاه سلامت | SalamatLab

## 🏥 درباره پروژه

**آزمایشگاه سلامت** یک وب‌سایت مدرن و تعاملی برای آزمایشگاه تشخیص پزشکی و مولکولی است که در شهرقدس واقع شده است. این پروژه با استفاده از جدیدترین تکنولوژی‌های وب توسعه یافته و تجربه کاربری برتر را ارائه می‌دهد.

## 📦 مدیریت نسخه‌ها با Git

این پروژه از Git برای مدیریت نسخه‌ها استفاده می‌کند. برای شروع کار با Git:

```bash
# بررسی وضعیت فعلی
git status

# مشاهده تاریخچه commits
git log --oneline

# ایجاد branch جدید
git checkout -b feature/new-feature

# اضافه کردن تغییرات
git add .

# ثبت تغییرات
git commit -m "توضیح تغییرات"

# ارسال به remote repository
git push origin main
```

## ✨ ویژگی‌ها

- 🎨 **طراحی مدرن و زیبا** با استفاده از Tailwind CSS و shadcn/ui
- 📱 **Responsive Design** برای تمامی دستگاه‌ها
- 🚀 **انیمیشن‌های جذاب** و تعاملی
- 🔍 **SEO بهینه** برای موتورهای جستجو
- ⚡ **عملکرد سریع** با Vite و React
- 🌐 **پشتیبانی از زبان فارسی** و RTL

## 🛠️ تکنولوژی‌های استفاده شده

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Query
- **Icons**: Lucide React
- **Database**: Supabase

## 🚀 راه‌اندازی پروژه

### پیش‌نیازها
- Node.js (نسخه 18 یا بالاتر)
- npm یا yarn

### مراحل نصب

```bash
# 1. کلون کردن پروژه
git clone <repository-url>
cd SalamatLab-Main

# 2. نصب وابستگی‌ها
npm install

# 3. اجرای پروژه در حالت توسعه
npm run dev

# 4. ساخت نسخه تولید
npm run build
```

## 📁 ساختار پروژه

```
SalamatLab-Main/
├── src/
│   ├── components/          # کامپوننت‌های قابل استفاده مجدد
│   ├── pages/              # صفحات اصلی
│   ├── hooks/              # Custom Hooks
│   ├── lib/                # توابع کمکی
│   ├── data/               # داده‌های استاتیک
│   └── integrations/       # اتصالات خارجی (Supabase)
├── public/                 # فایل‌های استاتیک
├── tailwind.config.ts      # تنظیمات Tailwind CSS
└── package.json            # وابستگی‌ها و اسکریپت‌ها
```

## 🎯 صفحات اصلی

- **صفحه اصلی**: معرفی خدمات و ویژگی‌ها
- **درباره ما**: اطلاعات تیم و آزمایشگاه
- **پزشکان**: لیست پزشکان متخصص
- **مقالات**: مقالات علمی و پزشکی
- **تماس با ما**: اطلاعات تماس و فرم ارتباطی

## 🔧 اسکریپت‌های موجود

```bash
npm run dev          # اجرای سرور توسعه
npm run build        # ساخت نسخه تولید
npm run build:dev    # ساخت نسخه توسعه
npm run preview      # پیش‌نمایش نسخه تولید
npm run lint         # بررسی کد
```

## 🌟 ویژگی‌های کلیدی

### انیمیشن‌ها
- کامپوننت `Reveal` برای نمایش تدریجی
- انیمیشن‌های hover و transition
- شمارنده‌های انیمیشنی

### SEO
- Meta tags بهینه
- Structured Data (Schema.org)
- Canonical URLs

### Performance
- Lazy loading تصاویر
- Code splitting
- Optimized builds

## 📞 ارتباط با ما

- **آدرس**: شهرقدس، میدان مصلی
- **تلفن**: ۰۲۱-۴۶۸۳۳۰۱۰
- **ایمیل**: info@salamat.com

## 📄 مجوز

این پروژه تحت مجوز MIT منتشر شده است.

---

**توسعه‌دهنده**: تیم آزمایشگاه سلامت  
**آخرین به‌روزرسانی**: ۱۴۰۴
