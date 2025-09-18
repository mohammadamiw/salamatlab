# راهنمای تنظیم چت‌بات با سرویس هوش مصنوعی لیارا

## مقدمه

این راهنما نحوه تنظیم چت‌بات آزمایشگاه سلامت با استفاده از سرویس هوش مصنوعی لیارا را توضیح می‌دهد. چت‌بات با مدل GPT-4o-mini لیارا کار می‌کند و قابلیت‌های پیشرفته‌ای برای پاسخ‌دهی به سوالات کاربران دارد.

## مزایای استفاده از لیارا AI

✅ **سرورهای داخلی**: بدون نیاز به VPN  
✅ **قیمت مناسب**: اعتبار رایگان و تعرفه‌های مقرون‌به‌صرفه  
✅ **سازگار با OpenAI SDK**: بدون نیاز به تغییر کد اصلی  
✅ **مدل‌های قدرتمند**: دسترسی به GPT-4o-mini و سایر مدل‌ها  
✅ **پشتیبانی زبان فارسی**: بهینه برای پاسخ‌دهی به فارسی  

## قدم‌های راه‌اندازی

### 1. ایجاد حساب در لیارا

1. به [پنل لیارا](https://console.liara.ir) بروید
2. ثبت‌نام کنید یا وارد حساب خود شوید
3. به بخش **AI** بروید
4. سرویس **OpenAI: GPT-4o-mini** را انتخاب کنید

### 2. دریافت API Key

1. در پنل AI لیارا، **API Key** خود را کپی کنید
2. **Base URL** شما: `https://ai.liara.ir/api/v1/68caae6a50d5b2a15f00deff`
3. **Model ID**: `openai/gpt-4o-mini`

### 3. تنظیم متغیرهای محیطی

فایل `.env` در root پروژه ایجاد کنید:

```env
# Liara AI Configuration
VITE_LIARA_API_KEY=your_actual_liara_api_key_here
LIARA_API_KEY=your_actual_liara_api_key_here
```

⚠️ **نکته امنیتی**: هرگز API Key را در کد source commit نکنید!

### 4. نصب وابستگی‌ها

```bash
npm install openai
```

### 5. تست چت‌بات

1. سرور development را اجرا کنید:
```bash
npm run dev
```

2. سایت را در مرورگر باز کنید
3. روی آیکون چت‌بات کلیک کنید
4. پیام تستی ارسال کنید

## ساختار فایل‌ها

```
src/
├── components/
│   └── Chatbot.tsx              # کامپوننت اصلی چت‌بات
├── services/
│   └── openai.ts               # سرویس ارتباط با لیارا AI
├── data/
│   └── chatbotKnowledge.ts     # دانش و اطلاعات آزمایشگاه
public/api/
└── chatbot.php                 # API endpoint برای سرور (اختیاری)
```

## تنظیمات پیشرفته

### تغییر Model

در فایل `src/services/openai.ts`:

```typescript
const LIARA_MODEL = 'openai/gpt-4o-mini'; // یا مدل دیگری که دسترسی دارید
```

### تنظیم پارامترهای AI

```typescript
const completion = await openai.chat.completions.create({
  model: LIARA_MODEL,
  messages: this.conversationHistory.map(msg => ({
    role: msg.role,
    content: msg.content
  })),
  max_tokens: 300,        // حداکثر طول پاسخ
  temperature: 0.7        // خلاقیت پاسخ (0.0 تا 1.0)
});
```

### تنظیم System Prompt

در فایل `src/data/chatbotKnowledge.ts` system prompt را ویرایش کنید:

```typescript
export const CHATBOT_SYSTEM_PROMPT = `
شما دستیار هوشمند آزمایشگاه تشخیص پزشکی سلامت هستید.
// اطلاعات آزمایشگاه...
`;
```

## عیب‌یابی

### مشکل: چت‌بات پاسخ نمی‌دهد

1. ✅ بررسی کنید API Key صحیح وارد شده باشد
2. ✅ اتصال اینترنت را چک کنید
3. ✅ console مرورگر را برای خطاها بررسی کنید
4. ✅ اعتبار حساب لیارا را چک کنید

### مشکل: خطای CORS

اگر از backend PHP استفاده می‌کنید، فایل `public/api/chatbot.php` را بررسی کنید.

### مشکل: پاسخ‌های نادرست

1. System prompt را بررسی کنید
2. Temperature را کاهش دهید (0.3 - 0.5)
3. Max tokens را افزایش دهید

## مونیتورینگ و آمار

### مصرف API

در پنل لیارا می‌توانید:
- مصرف توکن‌ها را مشاهده کنید
- تعداد درخواست‌ها را ببینید
- تاریخچه استفاده را بررسی کنید

### لاگ‌های مرورگر

برای debug کردن:

```javascript
console.log('Liara AI Response:', response);
```

## بهینه‌سازی عملکرد

### کاهش هزینه

1. **محدود کردن max_tokens**: تنها tokens مورد نیاز را درخواست کنید
2. **تنظیم تاریخچه**: تعداد پیام‌های نگه‌داشته شده را محدود کنید
3. **استفاده از fallback**: برای سوالات ساده از پاسخ‌های از پیش تعریف شده استفاده کنید

### بهبود سرعت

1. **Caching**: پاسخ‌های مشابه را cache کنید
2. **Debouncing**: از ارسال مکرر جلوگیری کنید
3. **Loading states**: حالت loading مناسب نمایش دهید

## نکات امنیتی

⚠️ **هشدارهای مهم**:

1. **API Key را محرمانه نگه دارید**
2. **برای production از backend استفاده کنید**
3. **Rate limiting اعمال کنید**
4. **ورودی‌های کاربر را validate کنید**

## پشتیبانی

### لیارا

- **سایت**: [liara.ir](https://liara.ir)
- **مستندات**: [docs.liara.ir](https://docs.liara.ir)
- **پشتیبانی**: از طریق پنل لیارا

### آزمایشگاه سلامت

- **تلفن**: 021-46833010
- **ایمیل**: info@salamatlab.com
- **اینستاگرام**: @salamatlab

## مجوز

این پروژه تحت مجوز MIT منتشر شده است.
