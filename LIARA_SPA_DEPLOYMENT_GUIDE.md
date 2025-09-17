# راهنمای Deploy کردن SPA در Liara

## 🚨 **مشکل 404 Not Found برای routes**

اگر صفحات React مثل `/auth/login` خطای **404 nginx** می‌دهند، به این دلیل است که **nginx** نمی‌داند چطور **SPA routing** را handle کند.

## ✅ **راه‌حل کامل**

### مرحله 1: فایل‌های ضروری اضافه شده

#### **1. liara_nginx.conf** (اضافه شده ✅)
```nginx
location / {
    try_files $uri $uri/ /index.html;
}

location /api/ {
    try_files $uri $uri/ =404;
}

location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    try_files $uri =404;
}
```

#### **2. liara.json** (بروزرسانی شده ✅)
```json
{
  "app": "salamatlab",
  "platform": "static",
  "port": 80,
  "build": {
    "location": "iran"
  },
  "nginx": {
    "configFile": "liara_nginx.conf"
  },
  "disks": []
}
```

#### **3. public/_redirects** (Fallback - اضافه شده ✅)
```
# API endpoints should be handled by backend
/api/* 200
# All other routes should serve index.html for React Router
/* /index.html 200
```

#### **4. vite.config.ts** (بروزرسانی شده ✅)
```typescript
server: {
  host: "::",
  port: 8080,
  historyApiFallback: {
    index: '/index.html',
    rewrites: [
      { from: /^\/api\/.*$/, to: function(context) {
        return context.parsedUrl.pathname;
      }}
    ]
  }
}
```

### مرحله 2: Build و Deploy

#### **Build کردن:**
```bash
npm run build
```

#### **Deploy در Liara:**
```bash
# اگر Liara CLI نصب است
liara deploy

# یا از طریق Git
git add .
git commit -m "Fix SPA routing for nginx"
git push origin main
```

### مرحله 3: تست

پس از deploy، این URLها باید کار کنند:

- ✅ `https://salamatlab.liara.run/` (خانه)
- ✅ `https://salamatlab.liara.run/auth/login` (صفحه ورود)
- ✅ `https://salamatlab.liara.run/profile` (پروفایل)
- ✅ `https://salamatlab.liara.run/api/test-connection.php` (Backend API)

## 📋 **Checklist**

- [x] فایل `liara_nginx.conf` اضافه شد
- [x] فایل `liara.json` بروزرسانی شد  
- [x] فایل `public/_redirects` اضافه شد
- [x] فایل `vite.config.ts` بروزرسانی شد
- [ ] Project را build کنید: `npm run build`
- [ ] در Liara deploy کنید
- [ ] تست کنید: `/auth/login` باید کار کند

## 🐛 **عیب‌یابی**

### **همچنان 404 می‌دهد:**

1. **بررسی nginx config:**
   ```bash
   # در Liara console
   cat /etc/nginx/sites-available/default
   ```

2. **بررسی nginx restart:**
   ```bash
   # در Liara console
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. **بررسی فایل‌ها در سرور:**
   ```bash
   # در Liara console  
   ls -la /usr/src/app/
   cat /usr/src/app/liara_nginx.conf
   ```

### **API ها کار نمی‌کنند:**

1. **تست API مستقیم:**
   ```
   https://salamatlab.liara.run/api/test-connection.php
   ```

2. **بررسی PHP version:**
   ```bash
   php -v
   ```

3. **بررسی logs:**
   ```bash
   # در Liara console
   tail -f /var/log/nginx/error.log
   tail -f /var/log/nginx/access.log
   ```

## 🎯 **نکات مهم**

1. **nginx config** باید **قبل از deploy** اضافه شود
2. **Frontend routes** (مثل `/auth/login`) به **index.html** redirect می‌شوند  
3. **API routes** (مثل `/api/*`) به **PHP backend** می‌روند
4. **Static files** مستقیماً serve می‌شوند

## 📞 **پشتیبانی**

اگر همچنان مشکل دارید:

1. **Check Console:** Browser console و Network tab
2. **Check Liara Logs:** در پنل Liara بخش Logs
3. **Test APIs:** `/api/test-connection.php` و `/api/test-sms.php`
4. **Check Build:** `npm run build` بدون خطا انجام شود

---
**✅ حالا `/auth/login` و تمام React routes باید کار کنند!**
