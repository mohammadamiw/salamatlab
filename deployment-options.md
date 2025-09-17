# گزینه‌های Deploy برای رفع مشکل محدودیت Liara

## ❌ مشکل فعلی:
```
Max deployment count in day
Repository: mohammadamiw/salamatlab
```

## 🎯 راه‌حل‌های موجود:

### **گزینه 1: صبر تا فردا ⏰**
- **مدت زمان**: 24 ساعت
- **هزینه**: رایگان
- **پیشنهاد**: همین حالا محلی تست کن

### **گزینه 2: Upgrade پلن Liara 💳**
- **پلن Bronze**: 50,000 تومان/ماه
- **مزیت**: Unlimited deployments
- **مناسب**: پروژه‌های production

### **گزینه 3: Manual Deploy 📤**
- **روش**: ZIP file upload در پنل
- **محدودیت**: ندارد
- **مراحل**: چک کن `manual-deploy-guide.md`

### **گزینه 4: Alternative Platforms 🌐**

#### **Vercel (Frontend)**
```bash
npm install -g vercel
npm run build
vercel --prod
```

#### **Railway (Backend)**
```bash
# نصب Railway CLI
npm install -g @railway/cli

# Deploy backend
railway login
railway init
railway up
```

#### **Netlify (Frontend)**
```bash
npm run build
# drag & drop dist folder to netlify.com
```

## 🧪 تست محلی فعلی:

در حالی که تصمیم می‌گیری، **الان** می‌تونی تست کنی:

```
Frontend: http://localhost:5173/auth/login
Backend:  http://localhost:8000/api/test-connection.php
```

## 📊 مقایسه پلتفرم‌ها:

| Platform | Frontend | Backend | Free Tier | Deploy Limit |
|----------|----------|---------|-----------|--------------|
| Liara | ✅ | ✅ | محدود | 3-5/روز |
| Vercel | ✅ | ❌ | خوب | 100/روز |
| Netlify | ✅ | ❌ | خوب | 300 دقیقه build |
| Railway | ✅ | ✅ | محدود | 1000 ساعت |

## 💡 پیشنهاد کوتاه‌مدت:

1. **همین حالا**: تست محلی
2. **فردا**: Deploy رایگان در Liara
3. **بلندمدت**: Upgrade یا platform دیگر

## 🎯 کدام گزینه را انتخاب می‌کنی؟
