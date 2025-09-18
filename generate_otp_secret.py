#!/usr/bin/env python3

"""
OTP_SECRET Generator - Python Version
تولید کلید امنیتی OTP_SECRET با پایتون
"""

import secrets

def main():
    # تولید کلید 32 بایتی (64 کاراکتری hex)
    secret = secrets.token_hex(32)

    print("=" * 60)
    print("🔐 OTP_SECRET GENERATED SUCCESSFULLY (Python)")
    print("=" * 60)
    print()
    print(f"OTP_SECRET={secret}")
    print()
    print("📊 مشخصات کلید:")
    print(f"• طول: {len(secret)} کاراکتر")
    print("• فرمت: Hexadecimal (0-9, a-f)")
    print("• امنیت: AES-256 Compatible")
    print()
    print("⚙️ تنظیم در لیارا:")
    print("پنل لیارا → اپ salamatlab-backend → متغیرهای محیطی")
    print(f"OTP_SECRET={secret}")
    print()
    print("🔒 نکات امنیتی:")
    print("• این کلید را با دیگران به اشتراک نگذارید")
    print("• کلید را در متغیرهای محیطی نگه دارید")
    print("• هرگز کلید را در کد قرار ندهید")
    print("• کلید را منظماً تغییر دهید")
    print()
    print("✅ کلید شما آماده استفاده است!")
    print("=" * 60)

    # تست صحت کلید
    import re
    is_valid = bool(re.match(r'^[a-f0-9]{64}$', secret))
    print()
    print("✅ کلید معتبر است" if is_valid else "❌ کلید نامعتبر است")
    print()

    print("💡 اگر نیاز به کلید جدید دارید، دوباره اجرا کنید:")
    print("python generate_otp_secret.py")
    print("=" * 60)

if __name__ == "__main__":
    main()
