<?php
/**
 * اسکریپت استقرار امن - آزمایشگاه سلامت
 *
 * این اسکریپت به شما کمک می‌کند تا سایت را آپدیت کنید
 * بدون اینکه داده‌های کاربران پاک شود
 */

header('Content-Type: text/html; charset=UTF-8');
session_start();

// تنظیمات امنیتی
$deploy_password = 'salamatlab33010'; // تغییر دهید
$authenticated = false;

if (isset($_POST['password']) && $_POST['password'] === $deploy_password) {
    $authenticated = true;
    $_SESSION['deploy_authenticated'] = true;
} elseif (isset($_SESSION['deploy_authenticated']) && $_SESSION['deploy_authenticated']) {
    $authenticated = true;
}

function backupData() {
    $data_dir = dirname(__DIR__) . '/salamatlab_data/';
    $backup_dir = dirname(__DIR__) . '/salamatlab_backups/';

    if (!is_dir($data_dir)) {
        return ['success' => false, 'message' => 'پوشه داده‌ها وجود ندارد. ابتدا setup-data-directory.php را اجرا کنید.'];
    }

    // ایجاد پوشه پشتیبان
    if (!is_dir($backup_dir)) {
        mkdir($backup_dir, 0755, true);
    }

    $timestamp = date('Y-m-d_H-i-s');
    $backup_file = $backup_dir . 'pre_deploy_backup_' . $timestamp . '.zip';

    // ایجاد فایل ZIP
    $zip = new ZipArchive();
    if ($zip->open($backup_file, ZipArchive::CREATE) !== TRUE) {
        return ['success' => false, 'message' => 'نتوانست فایل پشتیبان ایجاد کند'];
    }

    // اضافه کردن فایل‌ها به ZIP
    $files = glob($data_dir . '*');
    foreach ($files as $file) {
        if (is_file($file) && basename($file) !== '.htaccess') {
            $zip->addFile($file, basename($file));
        }
    }

    $zip->close();

    return [
        'success' => true,
        'message' => 'پشتیبان قبل از استقرار ایجاد شد',
        'file' => $backup_file
    ];
}

function deployNewVersion($zip_file) {
    $public_html = __DIR__;

    if (!file_exists($zip_file)) {
        return ['success' => false, 'message' => 'فایل ZIP جدید وجود ندارد'];
    }

    // پشتیبان‌گیری از فایل‌های فعلی (به جز داده‌ها)
    $temp_backup = sys_get_temp_dir() . '/salamatlab_temp_backup_' . time() . '.zip';
    $zip_backup = new ZipArchive();

    if ($zip_backup->open($temp_backup, ZipArchive::CREATE) !== TRUE) {
        return ['success' => false, 'message' => 'نتوانست پشتیبان موقت ایجاد کند'];
    }

    // پشتیبان‌گیری از فایل‌های موجود (به جز API و داده‌ها)
    $exclude_dirs = ['salamatlab_data', 'salamatlab_backups'];
    $exclude_files = ['deploy-safe.php', 'setup-data-directory.php'];

    $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($public_html));
    foreach ($iterator as $file) {
        if ($file->isFile()) {
            $relative_path = str_replace($public_html . '/', '', $file->getPathname());

            // رد کردن فایل‌های سیستمی و داده‌ها
            $should_exclude = false;
            foreach ($exclude_dirs as $exclude_dir) {
                if (strpos($relative_path, $exclude_dir) === 0) {
                    $should_exclude = true;
                    break;
                }
            }

            if (in_array(basename($relative_path), $exclude_files)) {
                $should_exclude = true;
            }

            if (!$should_exclude) {
                $zip_backup->addFile($file->getPathname(), $relative_path);
            }
        }
    }

    $zip_backup->close();

    // استخراج فایل ZIP جدید
    $zip = new ZipArchive();
    if ($zip->open($zip_file) !== TRUE) {
        return ['success' => false, 'message' => 'نتوانست فایل ZIP جدید را باز کند'];
    }

    // پاک کردن فایل‌های قدیمی (به جز داده‌ها)
    $files_to_clean = glob($public_html . '/*');
    foreach ($files_to_clean as $file) {
        $basename = basename($file);
        if ($basename !== 'salamatlab_data' && $basename !== 'salamatlab_backups') {
            if (is_dir($file)) {
                deleteDirectory($file);
            } else {
                unlink($file);
            }
        }
    }

    // استخراج فایل‌های جدید
    $zip->extractTo($public_html);
    $zip->close();

    // پاک کردن فایل پشتیبان موقت
    if (file_exists($temp_backup)) {
        unlink($temp_backup);
    }

    return ['success' => true, 'message' => 'نسخه جدید با موفقیت استقرار یافت'];
}

function deleteDirectory($dir) {
    if (!file_exists($dir)) {
        return true;
    }

    if (!is_dir($dir)) {
        return unlink($dir);
    }

    foreach (scandir($dir) as $item) {
        if ($item == '.' || $item == '..') {
            continue;
        }

        if (!deleteDirectory($dir . DIRECTORY_SEPARATOR . $item)) {
            return false;
        }
    }

    return rmdir($dir);
}

function getSystemStatus() {
    $data_dir = dirname(__DIR__) . '/salamatlab_data/';
    $backup_dir = dirname(__DIR__) . '/salamatlab_backups/';

    return [
        'data_dir_exists' => is_dir($data_dir),
        'data_dir_writable' => is_writable($data_dir),
        'backup_dir_exists' => is_dir($backup_dir),
        'data_files' => is_dir($data_dir) ? count(glob($data_dir . '*.log') ?: []) + count(glob($data_dir . '*.json') ?: []) : 0,
        'backup_files' => is_dir($backup_dir) ? count(glob($backup_dir . '*.zip') ?: []) : 0,
        'last_backup' => is_dir($backup_dir) ? (glob($backup_dir . '*.zip') ? max(glob($backup_dir . '*.zip')) : null) : null
    ];
}

// پردازش درخواست‌ها
$message = '';
$result = null;
$status = getSystemStatus();

if (isset($_POST['action']) && $authenticated) {
    switch ($_POST['action']) {
        case 'backup':
            $result = backupData();
            $message = $result['message'];
            $status = getSystemStatus(); // بروزرسانی وضعیت
            break;

        case 'deploy':
            if (isset($_FILES['new_version']) && $_FILES['new_version']['error'] === UPLOAD_ERR_OK) {
                // پشتیبان‌گیری خودکار قبل از استقرار
                $backup_result = backupData();
                if (!$backup_result['success']) {
                    $message = 'خطا در پشتیبان‌گیری: ' . $backup_result['message'];
                    break;
                }

                $temp_file = $_FILES['new_version']['tmp_name'];
                $target_file = sys_get_temp_dir() . '/salamatlab_deploy_' . time() . '.zip';

                if (move_uploaded_file($temp_file, $target_file)) {
                    $result = deployNewVersion($target_file);
                    $message = $result['message'];

                    // پاک کردن فایل موقت
                    if (file_exists($target_file)) {
                        unlink($target_file);
                    }
                } else {
                    $message = 'نتوانست فایل نسخه جدید را آپلود کند';
                }
            } else {
                $message = 'فایل ZIP نسخه جدید انتخاب نشده یا خطایی رخ داده';
            }
            $status = getSystemStatus(); // بروزرسانی وضعیت
            break;
    }
}

?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>استقرار امن - آزمایشگاه سلامت</title>
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
            max-width: 900px;
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
        .btn-warning {
            background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
            color: #212529;
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
        .alert-warning {
            background: #fff3cd;
            color: #856404;
            border: 1px solid #ffeaa7;
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
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        .status-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #dee2e6;
            text-align: center;
        }
        .status-number {
            font-size: 24px;
            font-weight: bold;
            color: #28a745;
        }
        .status-label {
            color: #6c757d;
            font-size: 14px;
        }
        .warning-box {
            background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
            border: 2px solid #ffc107;
            padding: 20px;
            border-radius: 10px;
            margin: 20px 0;
        }
        .warning-box h3 {
            color: #856404;
            margin-top: 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 استقرار امن سایت</h1>
            <p>آزمایشگاه تشخیص پزشکی سلامت</p>
        </div>

        <div class="content">
            <?php if (!$authenticated): ?>
                <div class="section">
                    <h2>🔒 احراز هویت</h2>
                    <form method="post">
                        <div class="form-group">
                            <label for="password">رمز عبور استقرار:</label>
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

                <div class="warning-box">
                    <h3>⚠️ هشدار مهم</h3>
                    <ul>
                        <li>قبل از استقرار، پشتیبان‌گیری خودکار انجام می‌شود</li>
                        <li>داده‌های کاربران پاک نخواهد شد</li>
                        <li>در صورت مشکل، از پشتیبان برای بازیابی استفاده کنید</li>
                        <li>این عملیات غیر قابل بازگشت است</li>
                    </ul>
                </div>

                <div class="section">
                    <h2>📊 وضعیت سیستم</h2>
                    <div class="status-grid">
                        <div class="status-item">
                            <div class="status-number"><?php echo $status['data_dir_exists'] ? '✅' : '❌'; ?></div>
                            <div class="status-label">پوشه داده‌ها</div>
                        </div>
                        <div class="status-item">
                            <div class="status-number"><?php echo $status['data_files']; ?></div>
                            <div class="status-label">فایل داده</div>
                        </div>
                        <div class="status-item">
                            <div class="status-number"><?php echo $status['backup_files']; ?></div>
                            <div class="status-label">پشتیبان</div>
                        </div>
                        <div class="status-item">
                            <div class="status-number"><?php echo $status['data_dir_writable'] ? '✅' : '❌'; ?></div>
                            <div class="status-label">دسترسی نوشتن</div>
                        </div>
                    </div>

                    <?php if ($status['last_backup']): ?>
                        <p><strong>آخرین پشتیبان:</strong> <?php echo basename($status['last_backup']); ?></p>
                    <?php endif; ?>
                </div>

                <?php if (!$status['data_dir_exists']): ?>
                    <div class="alert alert-warning">
                        <strong>توجه:</strong> پوشه داده‌ها وجود ندارد. ابتدا <a href="setup-data-directory.php">setup-data-directory.php</a> را اجرا کنید.
                    </div>
                <?php endif; ?>

                <div class="section">
                    <h2>💾 پشتیبان‌گیری اضطراری</h2>
                    <p>ایجاد پشتیبان از داده‌های فعلی قبل از هر تغییری</p>
                    <form method="post">
                        <input type="hidden" name="action" value="backup">
                        <button type="submit" class="btn btn-warning">پشتیبان‌گیری اضطراری</button>
                    </form>
                </div>

                <div class="section">
                    <h2>📦 استقرار نسخه جدید</h2>
                    <p>آپلود و استقرار نسخه جدید سایت (فقط فایل ZIP)</p>
                    <form method="post" enctype="multipart/form-data">
                        <input type="hidden" name="action" value="deploy">
                        <div class="form-group">
                            <label for="new_version">انتخاب فایل ZIP نسخه جدید:</label>
                            <input type="file" id="new_version" name="new_version" accept=".zip" required>
                        </div>
                        <button type="submit" class="btn btn-danger" onclick="return confirm('آیا مطمئن هستید؟ پشتیبان خودکار گرفته خواهد شد.')">
                            🚀 استقرار نسخه جدید
                        </button>
                    </form>
                </div>

                <div class="section">
                    <h2>📝 دستورالعمل استقرار</h2>
                    <ol>
                        <li><strong>آماده‌سازی:</strong> فایل ZIP جدید را از کد source بسازید</li>
                        <li><strong>پشتیبان‌گیری:</strong> روی دکمه "پشتیبان‌گیری اضطراری" کلیک کنید</li>
                        <li><strong>استقرار:</strong> فایل ZIP را انتخاب و استقرار را شروع کنید</li>
                        <li><strong>تست:</strong> سایت را تست کنید</li>
                        <li><strong>در صورت مشکل:</strong> از setup-data-directory.php برای بازیابی استفاده کنید</li>
                    </ol>
                </div>

                <div class="section">
                    <h2>🔧 ابزارهای مفید</h2>
                    <ul>
                        <li><a href="setup-data-directory.php">راه‌اندازی سیستم داده‌ها</a></li>
                        <li><a href="../salamatlab_backups/">مشاهده پشتیبان‌ها</a></li>
                        <li><a href="../salamatlab_data/">مشاهده فایل‌های داده</a> (در صورت دسترسی)</li>
                    </ul>
                </div>

            <?php endif; ?>
        </div>
    </div>
</body>
</html>
