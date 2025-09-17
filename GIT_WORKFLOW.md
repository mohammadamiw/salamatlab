# Git Workflow | گردش کار Git

## 🚀 شروع کار با Git

### تنظیمات اولیه

```bash
# تنظیم نام کاربری
git config --global user.name "نام شما"
git config --global user.email "ایمیل شما"

# تنظیم editor پیش‌فرض
git config --global core.editor "code --wait"
```

### دستورات پایه

```bash
# بررسی وضعیت
npm run git:status

# مشاهده تاریخچه
npm run git:log

# اضافه کردن فایل‌ها
npm run git:add

# ثبت تغییرات
npm run git:commit "پیام commit"

# مشاهده branches
npm run git:branch
```

## 🌿 کار با Branches

### ایجاد Branch جدید

```bash
# ایجاد و تغییر به branch جدید
git checkout -b feature/نام-ویژگی

# یا با استفاده از npm script
npm run git:checkout -b feature/نام-ویژگی
```

### نام‌گذاری Branches

```bash
feature/booking-system     # ویژگی جدید
fix/login-validation       # رفع باگ
perf/image-optimization    # بهبود عملکرد
docs/api-documentation     # مستندات
hotfix/critical-bug        # رفع فوری
```

### کار با Branch

```bash
# تغییر به branch
git checkout main
git checkout feature/booking-system

# مشاهده تمام branches
git branch -a

# حذف branch
git branch -d feature/old-feature
```

## 📝 کار با Commits

### Commit Message Format

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
git commit -m "feat(booking): add appointment scheduling system"
git commit -m "fix(auth): resolve login validation issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(components): improve button styling"
git commit -m "refactor(api): optimize database queries"
git commit -m "test(booking): add unit tests for booking form"
git commit -m "chore(deps): update dependencies to latest versions"
```

## 🔄 کار با Remote Repository

### اضافه کردن Remote

```bash
# اضافه کردن origin
git remote add origin https://github.com/username/repository.git

# مشاهده remote ها
git remote -v

# تغییر URL remote
git remote set-url origin https://github.com/new-username/repository.git
```

### Push و Pull

```bash
# ارسال تغییرات
git push origin main
npm run git:push

# دریافت تغییرات
git pull origin main
npm run git:pull

# Push branch جدید
git push -u origin feature/new-feature
```

## 🔍 بررسی تغییرات

### مشاهده تغییرات

```bash
# مشاهده تغییرات در working directory
git diff

# مشاهده تغییرات staged
git diff --staged

# مشاهده تغییرات در commit خاص
git show <commit-hash>

# مشاهده تاریخچه با جزئیات
git log --oneline --graph --decorate
```

### Stash کردن تغییرات

```bash
# ذخیره تغییرات موقت
git stash

# مشاهده stash ها
git stash list

# اعمال stash
git stash pop
git stash apply stash@{0}

# حذف stash
git stash drop stash@{0}
```

## 🔧 تنظیمات پیشرفته

### Git Aliases

```bash
# تنظیم alias های مفید
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.unstage 'reset HEAD --'
git config --global alias.last 'log -1 HEAD'
```

### Git Hooks

```bash
# مثال: pre-commit hook
# فایل: .git/hooks/pre-commit
#!/bin/sh
npm run lint
npm run test
```

## 🚨 حل مشکلات رایج

### Undo آخرین Commit

```bash
# Undo commit اما حفظ تغییرات
git reset --soft HEAD~1

# Undo commit و حذف تغییرات
git reset --hard HEAD~1

# تغییر پیام آخرین commit
git commit --amend
```

### Undo آخرین Push

```bash
# Undo push
git revert HEAD
git push origin main
```

### حل Conflict

```bash
# مشاهده فایل‌های conflict
git status

# حل conflict در فایل
# سپس:
git add .
git commit -m "resolve merge conflicts"
```

### Reset به حالت خاص

```bash
# Reset به commit خاص
git reset --hard <commit-hash>

# Reset به remote
git reset --hard origin/main
```

## 📋 Checklist قبل از Push

- [ ] تمام تست‌ها موفق هستند
- [ ] کد lint شده است
- [ ] TypeScript errors رفع شده‌اند
- [ ] Commit message مناسب است
- [ ] تغییرات در branch مناسب هستند
- [ ] فایل‌های غیرضروری اضافه نشده‌اند

## 🎯 بهترین شیوه‌ها

1. **Commit های کوچک و مکرر**: هر commit باید یک تغییر منطقی باشد
2. **پیام‌های واضح**: از پیام‌های توصیفی استفاده کنید
3. **Branch های کوتاه**: branch ها را زود merge کنید
4. **Pull Request**: از PR برای code review استفاده کنید
5. **Backup**: همیشه از کد backup داشته باشید

## 📞 کمک

در صورت بروز مشکل:

1. از `git status` برای بررسی وضعیت استفاده کنید
2. از `git log` برای مشاهده تاریخچه استفاده کنید
3. از `git help <command>` برای کمک استفاده کنید
4. مستندات رسمی Git را مطالعه کنید

---

**آخرین به‌روزرسانی**: ۱۴۰۴
