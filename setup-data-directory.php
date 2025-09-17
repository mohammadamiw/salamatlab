<?php
/**
 * اسکریپت راه‌اندازی پوشه داده‌های آزمایشگاه سلامت
 *
 * این اسکریپت برای راه‌اندازی امن پوشه داده‌ها استفاده می‌شود
 * تا اطلاعات کاربران در هنگام آپدیت سایت پاک نشود
 */

// تنظیمات امنیتی
header('Content-Type: text/html; charset=UTF-8');
session_start();

// بررسی دسترسی (اختیاری - می‌توانید با رمز عبور محافظت کنید)
$setup_password = 'salamatlab33010'; // تغییر دهید
$authenticated = false;

if (isset($_POST['password']) && $_POST['password'] === $setup_password) {
    $authenticated = true;
    $_SESSION['setup_authenticated'] = true;
} elseif (isset($_SESSION['setup_authenticated']) && $_SESSION['setup_authenticated']) {
    $authenticated = true;
}

if (!$authenticated && isset($_POST['action'])) {
    die('دسترسی غیرمجاز');
}

function createDataDirectory() {
    // مسیر داده‌ها (یک سطح بالاتر از public_html)
    $data_dir = dirname(__DIR__) . '/salamatlab_data/';

    $result = [
        'success' => false,
        'message' => '',
        'path' => $data_dir
    ];

    // بررسی دسترسی نوشتن به دایرکتوری والد
    $parent_dir = dirname($data_dir);
    if (!is_writable($parent_dir)) {
        $result['message'] = "دایرکتوری والد قابل نوشتن نیست: $parent_dir";
        return $result;
    }

    // ایجاد پوشه داده‌ها
    if (!is_dir($data_dir)) {
        if (!mkdir($data_dir, 0755, true)) {
            $result['message'] = "نتوانست پوشه داده‌ها را ایجاد کند: $data_dir";
            return $result;
        }
    }

    // ایجاد فایل .htaccess برای امنیت
    $htaccess_content = "<Files ~ \"\\.(log|json)$\">\n    Order allow,deny\n    Deny from all\n</Files>\n\n# جلوگیری از دسترسی مستقیم\nDeny from all\n\n# اجازه دسترسی به PHP files\n<Files *.php>\n    Allow from all\n</Files>";
    if (!file_put_contents($data_dir . '.htaccess', $htaccess_content)) {
        $result['message'] = "نتوانست فایل امنیتی ایجاد کند";
        return $result;
    }

    // ایجاد فایل‌های اولیه خالی برای تمام انواع داده‌ها
    $files_to_create = [
        'bookings.log',           // رزروهای پزشک و چکاپ
        'contacts.log',           // پیام‌های تماس
        'requests_store.json',    // ذخیره درخواست‌ها با ID
        'feedbacks.log',          // نظرسنجی‌ها
        'careers.log',            // رزومه‌ها و همکاری در کار
        'wp-proxy.log',           // لاگ‌های پروکسی وردپرس
        'rate_limit_backup.json', // پشتیبان محدودیت نرخ
        'contacts_store.json'     // ذخیره پیام‌های تماس پیشرفته
    ];

    foreach ($files_to_create as $file) {
        $file_path = $data_dir . $file;
        if (!file_exists($file_path)) {
            if ($file === 'requests_store.json') {
                file_put_contents($file_path, json_encode([], JSON_UNESCAPED_UNICODE));
            } else {
                file_put_contents($file_path, '');
            }
        }
    }

    // ایجاد فایل تنظیمات
    $config_content = "<?php\n// فایل تنظیمات داده‌ها\nreturn [\n    'data_dir' => '$data_dir',\n    'created_at' => '" . date('Y-m-d H:i:s') . "',\n    'version' => '1.0'\n];";
    file_put_contents($data_dir . 'config.php', $config_content);

    $result['success'] = true;
    $result['message'] = "پوشه داده‌ها با موفقیت ایجاد شد";

    return $result;
}

function backupData() {
    $data_dir = dirname(__DIR__) . '/salamatlab_data/';
    $backup_dir = dirname(__DIR__) . '/salamatlab_backups/';

    if (!is_dir($data_dir)) {
        return ['success' => false, 'message' => 'پوشه داده‌ها وجود ندارد'];
    }

    // ایجاد پوشه پشتیبان
    if (!is_dir($backup_dir)) {
        mkdir($backup_dir, 0755, true);
    }

    $timestamp = date('Y-m-d_H-i-s');
    $backup_file = $backup_dir . 'backup_' . $timestamp . '.zip';

    // ایجاد فایل ZIP
    $zip = new ZipArchive();
    if ($zip->open($backup_file, ZipArchive::CREATE) !== TRUE) {
        return ['success' => false, 'message' => 'نتوانست فایل پشتیبان ایجاد کند'];
    }

    // اضافه کردن تمام فایل‌های داده به ZIP
    $data_files = [
        'bookings.log',           // رزروهای پزشک و چکاپ
        'contacts.log',           // پیام‌های تماس
        'requests_store.json',    // ذخیره درخواست‌ها با ID
        'feedbacks.log',          // نظرسنجی‌ها
        'careers.log',            // رزومه‌ها و همکاری در کار
        'wp-proxy.log',           // لاگ‌های پروکسی وردپرس
        'rate_limit_backup.json', // پشتیبان محدودیت نرخ
        'contacts_store.json',    // ذخیره پیام‌های تماس پیشرفته
        'config.php'              // تنظیمات سیستم
    ];

    foreach ($data_files as $filename) {
        $file_path = $data_dir . $filename;
        if (file_exists($file_path)) {
            $zip->addFile($file_path, $filename);
        }
    }

    // اضافه کردن فایل‌های دیگر در دایرکتوری داده‌ها (اگر وجود داشته باشند)
    $files = glob($data_dir . '*');
    foreach ($files as $file) {
        if (is_file($file) && basename($file) !== '.htaccess' && !in_array(basename($file), $data_files)) {
            $zip->addFile($file, basename($file));
        }
    }

    $zip->close();

    return [
        'success' => true,
        'message' => 'پشتیبان با موفقیت ایجاد شد',
        'file' => $backup_file
    ];
}

function restoreData($backup_file) {
    $data_dir = dirname(__DIR__) . '/salamatlab_data/';

    // بررسی وجود فایل پشتیبان
    if (!file_exists($backup_file)) {
        return ['success' => false, 'message' => 'فایل پشتیبان وجود ندارد: ' . $backup_file];
    }

    // بررسی اندازه فایل
    $file_size = filesize($backup_file);
    if ($file_size === 0) {
        return ['success' => false, 'message' => 'فایل پشتیبان خالی است'];
    }

    // اطمینان از وجود پوشه داده‌ها
    if (!is_dir($data_dir)) {
        if (!mkdir($data_dir, 0755, true)) {
            return ['success' => false, 'message' => 'نتوانست پوشه داده‌ها را ایجاد کند: ' . $data_dir];
        }
    }

    // بررسی دسترسی نوشتن به پوشه داده‌ها
    if (!is_writable($data_dir)) {
        return ['success' => false, 'message' => 'پوشه داده‌ها قابل نوشتن نیست: ' . $data_dir];
    }

    $zip = new ZipArchive();

    // بررسی باز کردن فایل ZIP
    $zip_result = $zip->open($backup_file);
    if ($zip_result !== TRUE) {
        $error_messages = [
            ZipArchive::ER_EXISTS => 'فایل ZIP از قبل وجود دارد',
            ZipArchive::ER_INCONS => 'فایل ZIP ناسازگار است',
            ZipArchive::ER_INVAL => 'فایل ZIP نامعتبر است',
            ZipArchive::ER_MEMORY => 'خطای حافظه',
            ZipArchive::ER_NOENT => 'فایل ZIP یافت نشد',
            ZipArchive::ER_NOZIP => 'این فایل ZIP نیست',
            ZipArchive::ER_OPEN => 'نتوانست فایل را باز کند',
            ZipArchive::ER_READ => 'خطای خواندن',
            ZipArchive::ER_SEEK => 'خطای جستجو'
        ];
        $error_msg = isset($error_messages[$zip_result]) ? $error_messages[$zip_result] : 'خطای ناشناخته ZIP';
        return ['success' => false, 'message' => 'خطا در باز کردن فایل ZIP: ' . $error_msg];
    }

    // بررسی تعداد فایل‌ها در ZIP
    $file_count = $zip->numFiles;
    if ($file_count === 0) {
        $zip->close();
        return ['success' => false, 'message' => 'فایل ZIP خالی است (هیچ فایلی برای استخراج وجود ندارد)'];
    }

    // استخراج فایل‌ها با مدیریت خطا
    $extracted_count = 0;
    $errors = [];

    for ($i = 0; $i < $file_count; $i++) {
        $file_info = $zip->statIndex($i);
        if ($file_info === FALSE) {
            $errors[] = "نتوانست اطلاعات فایل $i را دریافت کند";
            continue;
        }

        $file_name = $file_info['name'];

        // استخراج فایل
        $extract_result = $zip->extractTo($data_dir, $file_name);
        if ($extract_result === TRUE) {
            $extracted_count++;
        } else {
            $errors[] = "خطا در استخراج فایل: $file_name";
        }
    }

    $zip->close();

    // گزارش نتیجه
    $message = "داده‌ها بازیابی شدند - فایل‌های استخراج شده: $extracted_count از $file_count";

    if (!empty($errors)) {
        $message .= " | خطاها: " . implode(', ', $errors);
    }

    // بررسی فایل‌های استخراج شده
    $extracted_files = [];
    $data_files = [
        'bookings.log', 'contacts.log', 'requests_store.json',
        'feedbacks.log', 'careers.log', 'wp-proxy.log',
        'contacts_store.json', 'config.php'
    ];

    foreach ($data_files as $file) {
        $file_path = $data_dir . $file;
        if (file_exists($file_path)) {
            $file_size = filesize($file_path);
            $extracted_files[] = "$file ($file_size bytes)";
        }
    }

    if (!empty($extracted_files)) {
        $message .= " | فایل‌های بازیابی شده: " . implode(', ', $extracted_files);
    }

    return [
        'success' => ($extracted_count > 0),
        'message' => $message,
        'extracted_count' => $extracted_count,
        'total_files' => $file_count,
        'extracted_files' => $extracted_files
    ];
}

// پردازش درخواست‌ها
$message = '';
$result = null;

if (isset($_POST['action'])) {
    switch ($_POST['action']) {
        case 'create_data_dir':
            $result = createDataDirectory();
            $message = $result['message'];
            break;

        case 'backup':
            $result = backupData();
            $message = $result['message'];
            break;

        case 'restore':
            if (isset($_FILES['backup_file']) && $_FILES['backup_file']['error'] === UPLOAD_ERR_OK) {
                $temp_file = $_FILES['backup_file']['tmp_name'];
                $backup_dir = dirname(__DIR__) . '/salamatlab_backups/';
                if (!is_dir($backup_dir)) {
                    mkdir($backup_dir, 0755, true);
                }
                $target_file = $backup_dir . basename($_FILES['backup_file']['name']);
                if (move_uploaded_file($temp_file, $target_file)) {
                    $result = restoreData($target_file);
                    $message = $result['message'];
                } else {
                    $message = 'نتوانست فایل پشتیبان را آپلود کند';
                }
            } else {
                $message = 'فایل پشتیبان انتخاب نشده یا خطایی رخ داده';
            }
            break;
    }
}

?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>راه‌اندازی سیستم داده‌ها - آزمایشگاه سلامت</title>
    <style>
        body {
            font-family: Tahoma, Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 25px 50px rgba(0,0,0,0.15);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
        }
        .content {
            padding: 30px;
        }
        .section {
            margin-bottom: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 10px;
            border-right: 5px solid #28a745;
        }
        .btn {
            background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
            color: white;
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 16px;
            margin: 5px;
            transition: transform 0.2s;
        }
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(40,167,69,0.3);
        }
        .btn-danger {
            background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }
        .btn-secondary {
            background: linear-gradient(135deg, #6c757d 0%, #545b62 100%);
        }
        .alert {
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .alert-danger {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .form-group input[type="text"],
        .form-group input[type="password"] {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
        }
        .form-group input[type="file"] {
            padding: 8px;
        }
        .status {
            padding: 10px;
            background: #e9ecef;
            border-radius: 5px;
            margin: 10px 0;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔧 راه‌اندازی سیستم داده‌ها</h1>
            <p>آزمایشگاه تشخیص پزشکی سلامت</p>
        </div>

        <div class="content">
            <?php if (!$authenticated): ?>
                <div class="section">
                    <h2>🔒 احراز هویت</h2>
                    <form method="post">
                        <div class="form-group">
                            <label for="password">رمز عبور راه‌اندازی:</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <button type="submit" class="btn">ورود</button>
                    </form>
                </div>
            <?php else: ?>

                <?php if ($message): ?>
                    <div class="alert <?php echo $result && $result['success'] ? 'alert-success' : 'alert-danger'; ?>">
                        <?php echo htmlspecialchars($message); ?>
                    </div>
                <?php endif; ?>

                <div class="section">
                    <h2>📁 ایجاد پوشه داده‌ها</h2>
                    <p>این عملیات پوشه امن داده‌ها را خارج از public_html ایجاد می‌کند تا اطلاعات شما در هنگام آپدیت پاک نشود.</p>
                    <form method="post">
                        <input type="hidden" name="action" value="create_data_dir">
                        <button type="submit" class="btn">ایجاد پوشه داده‌ها</button>
                    </form>
                </div>

                <div class="section">
                    <h2>💾 پشتیبان‌گیری</h2>
                    <p>پشتیبان‌گیری از تمام داده‌های موجود</p>
                    <form method="post">
                        <input type="hidden" name="action" value="backup">
                        <button type="submit" class="btn">ایجاد پشتیبان</button>
                    </form>
                </div>

                <div class="section">
                    <h2>🔄 بازیابی داده‌ها</h2>
                    <p>بازیابی داده‌ها از فایل پشتیبان</p>
                    <form method="post" enctype="multipart/form-data">
                        <input type="hidden" name="action" value="restore">
                        <div class="form-group">
                            <label for="backup_file">انتخاب فایل پشتیبان (ZIP):</label>
                            <input type="file" id="backup_file" name="backup_file" accept=".zip" required>
                        </div>
                        <button type="submit" class="btn btn-danger">بازیابی داده‌ها</button>
                    </form>
                </div>

                <div class="section">
                    <h2>📊 وضعیت سیستم</h2>
                    <div class="status">
                        <strong>پوشه داده‌ها:</strong> <?php echo dirname(__DIR__) . '/salamatlab_data/'; ?><br>
                        <strong>پوشه پشتیبان:</strong> <?php echo dirname(__DIR__) . '/salamatlab_backups/'; ?><br>
                        <strong>وضعیت پوشه داده‌ها:</strong> <?php echo is_dir(dirname(__DIR__) . '/salamatlab_data/') ? '✅ وجود دارد' : '❌ وجود ندارد'; ?><br>
                        <strong>دسترسی نوشتن:</strong> <?php echo is_writable(dirname(__DIR__)) ? '✅ قابل نوشتن' : '❌ غیر قابل نوشتن'; ?>
                    </div>
                </div>

                <div class="section">
                    <h2>📝 راهنمایی</h2>
                    <ul>
                        <li><strong>قبل از آپدیت سایت:</strong> همیشه پشتیبان‌گیری کنید</li>
                        <li><strong>بعد از آپدیت:</strong> پوشه داده‌ها باید دست نخورده بماند</li>
                        <li><strong>در صورت مشکل:</strong> از پشتیبان برای بازیابی استفاده کنید</li>
                        <li><strong>امنیت:</strong> فایل‌های داده خارج از دسترسی وب قرار دارند</li>
                    </ul>
                </div>

            <?php endif; ?>
        </div>
    </div>
</body>
</html>
