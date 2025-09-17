#!/bin/bash

# اسکریپت استقرار امن - آزمایشگاه سلامت
# استفاده: ./deploy.sh [environment]

set -e

ENVIRONMENT=${1:-"production"}
BACKUP_DIR="../salamatlab_backups"
DATA_DIR="../salamatlab_data"

echo "🚀 شروع استقرار برای محیط: $ENVIRONMENT"
echo "📅 زمان: $(date)"

# بررسی وجود پوشه داده‌ها
if [ ! -d "$DATA_DIR" ]; then
    echo "❌ خطا: پوشه داده‌ها وجود ندارد: $DATA_DIR"
    echo "💡 ابتدا setup-data-directory.php را اجرا کنید"
    exit 1
fi

# ایجاد پشتیبان خودکار
echo "💾 ایجاد پشتیبان خودکار..."
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_FILE="$BACKUP_DIR/auto_backup_$TIMESTAMP.zip"

if [ ! -d "$BACKUP_DIR" ]; then
    mkdir -p "$BACKUP_DIR"
fi

cd "$DATA_DIR"
zip -r "$BACKUP_FILE" . -x ".htaccess" "*.tmp" 2>/dev/null || true
cd - > /dev/null

if [ -f "$BACKUP_FILE" ]; then
    echo "✅ پشتیبان ایجاد شد: $(basename $BACKUP_FILE)"
else
    echo "⚠️  هشدار: پشتیبان ایجاد نشد"
fi

# بیلد پروژه (اگر node_modules وجود داشته باشد)
if [ -f "package.json" ]; then
    echo "🔨 بیلد پروژه..."
    npm run build
fi

# استقرار فایل‌ها (به جز داده‌ها)
echo "📦 کپی فایل‌ها..."
EXCLUDE_PATTERNS=(
    --exclude="salamatlab_data/"
    --exclude="salamatlab_backups/"
    --exclude=".git/"
    --exclude="node_modules/"
    --exclude="*.log"
    --exclude=".DS_Store"
    --exclude="deploy.sh"
)

# اگر rsync موجود باشد از آن استفاده کن
if command -v rsync &> /dev/null; then
    echo "استفاده از rsync برای استقرار..."
    rsync -av --delete "${EXCLUDE_PATTERNS[@]}" ./dist/ ../public_html/
else
    echo "استفاده از cp برای استقرار..."
    # پاک کردن فایل‌های قدیمی (به جز داده‌ها)
    find ../public_html -mindepth 1 -maxdepth 1 ! -name "salamatlab_data" ! -name "salamatlab_backups" -exec rm -rf {} +
    # کپی فایل‌های جدید
    cp -r dist/* ../public_html/
fi

# تنظیم دسترسی‌ها
echo "🔒 تنظیم دسترسی‌های امنیتی..."
chmod -R 755 ../public_html/
chmod -R 755 "$DATA_DIR"
find "$DATA_DIR" -name "*.log" -o -name "*.json" | xargs chmod 644 2>/dev/null || true

echo "✅ استقرار تکمیل شد!"
echo "📊 آمار:"
echo "   - فایل‌های پشتیبان: $(ls -1 "$BACKUP_DIR"/*.zip 2>/dev/null | wc -l)"
echo "   - فایل‌های داده: $(find "$DATA_DIR" -name "*.log" -o -name "*.json" | wc -l)"
echo ""
echo "🌐 سایت شما آماده است!"
echo "🔧 ابزارهای مدیریت:"
echo "   - پنل استقرار: https://yourdomain.com/deploy-safe.php"
echo "   - راه‌اندازی داده‌ها: https://yourdomain.com/setup-data-directory.php"
