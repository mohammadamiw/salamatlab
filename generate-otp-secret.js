#!/usr/bin/env node

/**
 * OTP_SECRET Generator
 * تولید کلید امنیتی OTP_SECRET
 */

import crypto from 'crypto';

// تولید کلید 32 بایتی (64 کاراکتری hex)
const secret = crypto.randomBytes(32).toString('hex');

console.log('='.repeat(60));
console.log('🔐 OTP_SECRET GENERATED SUCCESSFULLY');
console.log('='.repeat(60));
console.log('');
console.log('OTP_SECRET=' + secret);
console.log('');
console.log('📊 مشخصات کلید:');
console.log('• طول: ' + secret.length + ' کاراکتر');
console.log('• فرمت: Hexadecimal (0-9, a-f)');
console.log('• امنیت: AES-256 Compatible');
console.log('');
console.log('⚙️ تنظیم در لیارا:');
console.log('پنل لیارا → اپ salamatlab-backend → متغیرهای محیطی');
console.log('OTP_SECRET=' + secret);
console.log('');
console.log('🔒 نکات امنیتی:');
console.log('• این کلید را با دیگران به اشتراک نگذارید');
console.log('• کلید را در متغیرهای محیطی نگه دارید');
console.log('• هرگز کلید را در کد قرار ندهید');
console.log('• کلید را منظماً تغییر دهید');
console.log('');
console.log('✅ کلید شما آماده استفاده است!');
console.log('='.repeat(60));

// تست صحت کلید
const isValid = /^[a-f0-9]{64}$/.test(secret);
console.log('');
console.log(isValid ? '✅ کلید معتبر است' : '❌ کلید نامعتبر است');
console.log('');

// تولید کلید جایگزین
console.log('💡 اگر نیاز به کلید جدید دارید، دوباره اجرا کنید:');
console.log('node generate-otp-secret.js');
console.log('='.repeat(60));
