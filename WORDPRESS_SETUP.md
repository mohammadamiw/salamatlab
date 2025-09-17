# راهنمای کامل راه‌اندازی یکپارچه‌سازی وردپرس

## 🚀 مرحله ۱: پیدا کردن آدرس API وردپرس

برای هر سایت وردپرس، آدرس REST API پیش‌فرض این است:

```
https://آدرس-سایت-وردپرس/wp-json/wp/v2/posts
```

**مثال:**
- اگر وبلاگ شما روی `blog.mysite.com` است:
  ```
  https://blog.mysite.com/wp-json/wp/v2/posts
  ```

**تست API:**
این آدرس را در مرورگر باز کنید تا مطمئن شوید JSON مقالات را نمایش می‌دهد.

## 🔧 مرحله ۲: تنظیم آدرس وردپرس در کد

فایل `src/config/wordpress.ts` را باز کرده و آدرس سایت خود را تغییر دهید:

```typescript
export const WORDPRESS_CONFIG = {
  // این آدرس را با آدرس وردپرس خود تغییر دهید
  SITE_URL: 'https://your-wordpress-site.com',
  // ...
};
```

**مثال:**
```typescript
SITE_URL: 'https://blog.salamatlab.com',
```

## 📝 مرحله ۳: ایجاد فایل .env (اختیاری)

در پوشه اصلی پروژه، فایل `.env` ایجاد کنید:

```bash
# WordPress Configuration
VITE_WORDPRESS_SITE_URL=https://your-wordpress-site.com
VITE_WORDPRESS_PER_PAGE=10
VITE_WORDPRESS_FEATURED_COUNT=4
VITE_WORDPRESS_CACHE_DURATION=300000
VITE_WORDPRESS_ENABLE_CACHE=true
```

## 🧪 مرحله ۴: تست اتصال

فایل `test-wordpress-api.html` را در مرورگر باز کنید و آدرس وردپرس خود را وارد کنید.

## ✅ مرحله ۵: اطمینان از فعال بودن REST API

در وردپرس خود، مطمئن شوید که:
- REST API فعال است
- مقالات قابل دسترسی هستند
- تصاویر شاخص (Featured Images) تنظیم شده‌اند

## 🎯 ویژگی‌های پیاده‌سازی شده

### ✅ نمایش مقالات در صفحه اصلی
- ۴ مقاله برتر از وردپرس
- Loading states و error handling
- تصاویر شاخص و دسته‌بندی

### ✅ صفحه همه مقالات
- جستجو در مقالات
- صفحه‌بندی (Pagination)
- نمایش اطلاعات کامل هر مقاله

### ✅ صفحه مقاله تکی
- محتوای کامل مقاله
- اطلاعات متا (نویسنده، تاریخ، زمان مطالعه)
- لینک‌های ناوبری

### ✅ مدیریت خطاها
- نمایش پیام‌های خطا
- دکمه تلاش مجدد
- Fallback images

## 🎨 سفارشی‌سازی

### تغییر تعداد مقالات نمایشی
در `src/config/wordpress.ts`:

```typescript
export const WORDPRESS_CONFIG = {
  FEATURED_ARTICLES_COUNT: 6, // تعداد مقالات در صفحه اصلی
  DEFAULT_PER_PAGE: 12,        // تعداد مقالات در هر صفحه
};
```

### تغییر تصویر پیش‌فرض
در `src/services/wordpress.ts`، خط زیر را تغییر دهید:

```typescript
image: featuredImage || WORDPRESS_CONFIG.DEFAULT_IMAGE,
```

## 🔍 عیب‌یابی

### مشکل: مقالات نمایش داده نمی‌شوند
1. آدرس وردپرس را بررسی کنید
2. REST API را در وردپرس تست کنید
3. Console مرورگر را برای خطاها بررسی کنید

### مشکل: تصاویر نمایش داده نمی‌شوند
1. Featured Images را در وردپرس تنظیم کنید
2. آدرس تصاویر را بررسی کنید
3. CORS settings را بررسی کنید

## 📱 تست نهایی

پس از تنظیم:
1. سایت را اجرا کنید: `npm run dev`
2. به صفحه مقالات بروید
3. مقالات وردپرس را مشاهده کنید
4. روی مقالات کلیک کنید تا صفحه تکی باز شود

## 🆘 پشتیبانی

اگر مشکلی داشتید:
1. Console مرورگر را بررسی کنید
2. Network tab را برای API calls بررسی کنید
3. آدرس وردپرس را دوباره تست کنید 