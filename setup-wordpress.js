const fs = require('fs');
const path = require('path');

console.log('🔧 راهنمای تنظیم WordPress API');
console.log('================================\n');

console.log('برای اتصال سایت React شما به WordPress، مراحل زیر را دنبال کنید:\n');

console.log('1️⃣ آدرس سایت WordPress خود را پیدا کنید');
console.log('   مثال: https://blog.mysite.com\n');

console.log('2️⃣ فایل src/config/wordpress.ts را باز کنید');
console.log('   خط زیر را پیدا کنید:');
console.log('   SITE_URL: \'https://your-wordpress-site.com\'\n');

console.log('3️⃣ آدرس WordPress خود را جایگزین کنید');
console.log('   مثال: SITE_URL: \'https://blog.mysite.com\'\n');

console.log('4️⃣ یا فایل .env در پوشه اصلی ایجاد کنید:');
console.log('   VITE_WORDPRESS_SITE_URL=https://blog.mysite.com\n');

console.log('5️⃣ آدرس API را تست کنید:');
console.log('   https://blog.mysite.com/wp-json/wp/v2/posts\n');

console.log('6️⃣ اگر JSON مقالات نمایش داده شد، اتصال موفق است!\n');

console.log('📁 فایل‌های موجود:');
console.log('   - src/services/wordpress.ts (سرویس WordPress)');
console.log('   - src/pages/AllArticles.tsx (صفحه همه مقالات)');
console.log('   - src/pages/SingleArticle.tsx (صفحه مقاله تکی)');
console.log('   - test-wordpress-api.html (تست API)\n');

console.log('🚀 پس از تنظیم، سایت را اجرا کنید:');
console.log('   npm run dev\n');

console.log('❓ برای راهنمای کامل، فایل WORDPRESS_SETUP.md را مطالعه کنید'); 