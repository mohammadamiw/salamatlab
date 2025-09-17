-- آزمایشگاه تشخیص پزشکی سلامت - Database Schema
-- SalamatLab Medical Laboratory - Complete Database Schema
-- Created for Liara MySQL 8.0

-- ====================================
-- 1. USERS & AUTHENTICATION
-- ====================================

-- جدول کاربران
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(11) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255), -- برای آینده اگر نیاز شد
    
    -- اطلاعات شخصی
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    national_id VARCHAR(10) UNIQUE,
    birth_date DATE,
    gender ENUM('male', 'female'),
    
    -- اطلاعات تماس
    city VARCHAR(50),
    province VARCHAR(50),
    
    -- اطلاعات بیمه
    has_basic_insurance ENUM('yes', 'no') DEFAULT 'no',
    basic_insurance VARCHAR(100),
    complementary_insurance VARCHAR(100),
    
    -- وضعیت حساب
    is_profile_complete BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- متادیتا
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP NULL,
    
    -- ایندکس‌ها
    INDEX idx_phone (phone),
    INDEX idx_email (email),
    INDEX idx_national_id (national_id),
    INDEX idx_created_at (created_at),
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول آدرس‌های کاربران
CREATE TABLE user_addresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    
    -- اطلاعات آدرس
    title VARCHAR(100) NOT NULL, -- خانه، محل کار، ...
    address TEXT NOT NULL,
    postal_code VARCHAR(10),
    city VARCHAR(50),
    province VARCHAR(50),
    
    -- موقعیت جغرافیایی
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    -- اطلاعات تماس
    contact_phone VARCHAR(11),
    contact_name VARCHAR(100),
    
    -- وضعیت
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- متادیتا
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- روابط و ایندکس‌ها
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_default (is_default),
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول کدهای OTP
CREATE TABLE otp_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phone VARCHAR(11) NOT NULL,
    code VARCHAR(6) NOT NULL,
    purpose ENUM('login', 'register', 'reset_password', 'verify_phone') DEFAULT 'login',
    
    -- وضعیت و زمان
    is_used BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    max_attempts INT DEFAULT 5,
    
    -- زمان‌بندی
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    used_at TIMESTAMP NULL,
    
    -- متادیتا
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    -- ایندکس‌ها
    INDEX idx_phone (phone),
    INDEX idx_expires_at (expires_at),
    INDEX idx_phone_code (phone, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================
-- 2. MEDICAL SERVICES
-- ====================================

-- جدول دکترها و تخصص‌ها
CREATE TABLE doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- اطلاعات شخصی
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    title VARCHAR(100), -- دکتر، پروفسور، ...
    
    -- تخصص
    specialty VARCHAR(100) NOT NULL,
    specialty_category VARCHAR(50), -- cardiology, general, ...
    sub_specialty VARCHAR(100),
    
    -- اطلاعات حرفه‌ای
    medical_council_number VARCHAR(20) UNIQUE,
    experience_years INT,
    education TEXT,
    
    -- اطلاعات تماس
    phone VARCHAR(11),
    email VARCHAR(100),
    
    -- بیوگرافی و توضیحات
    bio TEXT,
    services TEXT, -- خدمات ارائه شده
    
    -- تصاویر
    profile_image VARCHAR(255),
    
    -- وضعیت و تنظیمات
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    
    -- قیمت‌گذاری
    consultation_fee DECIMAL(10, 2),
    home_visit_fee DECIMAL(10, 2),
    
    -- زمان‌بندی
    available_days JSON, -- ['monday', 'tuesday', ...]
    available_hours JSON, -- [{'start': '09:00', 'end': '17:00'}]
    
    -- متادیتا
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- ایندکس‌ها
    INDEX idx_specialty (specialty),
    INDEX idx_specialty_category (specialty_category),
    INDEX idx_is_active (is_active),
    INDEX idx_is_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول سرویس‌های پزشکی
CREATE TABLE medical_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- اطلاعات سرویس
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL, -- checkup, test, imaging, ...
    sub_category VARCHAR(100),
    
    -- توضیحات
    description TEXT,
    preparation_instructions TEXT,
    
    -- قیمت‌گذاری
    base_price DECIMAL(10, 2),
    home_service_price DECIMAL(10, 2),
    urgent_service_price DECIMAL(10, 2),
    
    -- زمان و مدت
    duration_minutes INT,
    preparation_time_hours INT DEFAULT 0,
    
    -- محدودیت‌ها
    age_min INT,
    age_max INT,
    gender_restriction ENUM('male', 'female', 'both') DEFAULT 'both',
    
    -- وضعیت
    is_active BOOLEAN DEFAULT TRUE,
    requires_appointment BOOLEAN DEFAULT TRUE,
    home_service_available BOOLEAN DEFAULT FALSE,
    
    -- متادیتا
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- ایندکس‌ها
    INDEX idx_category (category),
    INDEX idx_is_active (is_active),
    INDEX idx_home_service (home_service_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================
-- 3. APPOINTMENTS & BOOKINGS
-- ====================================

-- جدول درخواست‌های چکاپ
CREATE TABLE checkup_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    
    -- اطلاعات درخواست
    service_id INT,
    doctor_id INT,
    title VARCHAR(200) NOT NULL,
    
    -- اطلاعات شخصی (کپی از پروفایل کاربر در زمان درخواست)
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(11) NOT NULL,
    patient_national_id VARCHAR(10),
    patient_birth_date DATE,
    patient_gender ENUM('male', 'female'),
    patient_city VARCHAR(50),
    
    -- اطلاعات بیمه
    has_insurance BOOLEAN DEFAULT FALSE,
    insurance_type VARCHAR(100),
    
    -- زمان‌بندی
    preferred_date DATE,
    preferred_time TIME,
    appointment_date DATETIME,
    
    -- آدرس (در صورت نیاز)
    address_id INT,
    custom_address TEXT,
    
    -- وضعیت درخواست
    status ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected') DEFAULT 'pending',
    priority ENUM('normal', 'urgent', 'emergency') DEFAULT 'normal',
    
    -- قیمت‌گذاری
    estimated_price DECIMAL(10, 2),
    final_price DECIMAL(10, 2),
    
    -- یادداشت‌ها
    patient_notes TEXT,
    admin_notes TEXT,
    doctor_notes TEXT,
    
    -- متادیتا
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    -- روابط
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES medical_services(id) ON DELETE SET NULL,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE SET NULL,
    FOREIGN KEY (address_id) REFERENCES user_addresses(id) ON DELETE SET NULL,
    
    -- ایندکس‌ها
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_appointment_date (appointment_date),
    INDEX idx_created_at (created_at),
    INDEX idx_patient_phone (patient_phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول درخواست‌های نمونه‌گیری در محل
CREATE TABLE home_sampling_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    
    -- اطلاعات درخواست
    service_ids JSON, -- آرایه‌ای از ID سرویس‌ها
    title VARCHAR(200) NOT NULL,
    
    -- اطلاعات شخصی
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(11) NOT NULL,
    patient_national_id VARCHAR(10),
    patient_birth_date DATE,
    patient_gender ENUM('male', 'female'),
    
    -- آدرس نمونه‌گیری
    address_id INT,
    custom_address TEXT,
    address_latitude DECIMAL(10, 8),
    address_longitude DECIMAL(11, 8),
    
    -- زمان‌بندی
    preferred_date DATE,
    preferred_time_start TIME,
    preferred_time_end TIME,
    scheduled_datetime DATETIME,
    
    -- وضعیت درخواست
    status ENUM('pending', 'confirmed', 'assigned', 'in_progress', 'collected', 'completed', 'cancelled') DEFAULT 'pending',
    priority ENUM('normal', 'urgent') DEFAULT 'normal',
    
    -- اطلاعات تکنسین
    technician_id INT,
    technician_name VARCHAR(100),
    technician_phone VARCHAR(11),
    
    -- قیمت‌گذاری
    service_price DECIMAL(10, 2),
    transport_price DECIMAL(10, 2),
    total_price DECIMAL(10, 2),
    
    -- یادداشت‌ها
    patient_notes TEXT,
    admin_notes TEXT,
    technician_notes TEXT,
    
    -- متادیتا
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    confirmed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    -- روابط
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (address_id) REFERENCES user_addresses(id) ON DELETE SET NULL,
    
    -- ایندکس‌ها
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_scheduled_datetime (scheduled_datetime),
    INDEX idx_created_at (created_at),
    INDEX idx_patient_phone (patient_phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================
-- 4. CONTENT MANAGEMENT
-- ====================================

-- جدول مقالات و محتوا
CREATE TABLE blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- اطلاعات محتوا
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    excerpt TEXT,
    content LONGTEXT,
    
    -- دسته‌بندی
    category VARCHAR(100),
    tags JSON,
    
    -- تصاویر
    featured_image VARCHAR(255),
    gallery_images JSON,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    
    -- وضعیت انتشار
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    
    -- آمار
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    
    -- زمان‌بندی
    published_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- ایندکس‌ها
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_published_at (published_at),
    INDEX idx_is_featured (is_featured)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================
-- 5. COMMUNICATIONS
-- ====================================

-- جدول پیام‌های تماس
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- اطلاعات فرستنده
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(11),
    
    -- محتوا
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- دسته‌بندی
    category ENUM('general', 'appointment', 'complaint', 'suggestion', 'technical') DEFAULT 'general',
    
    -- وضعیت
    status ENUM('new', 'read', 'replied', 'closed') DEFAULT 'new',
    priority ENUM('low', 'normal', 'high', 'urgent') DEFAULT 'normal',
    
    -- پاسخ
    admin_reply TEXT,
    replied_at TIMESTAMP NULL,
    replied_by INT,
    
    -- متادیتا
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- ایندکس‌ها
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_category (category),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول نظرسنجی و بازخورد
CREATE TABLE feedback_surveys (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    
    -- اطلاعات نظرسنجی
    service_type ENUM('checkup', 'home_sampling', 'general') NOT NULL,
    service_id INT, -- ID درخواست مربوطه
    
    -- امتیازات (1-5)
    overall_rating TINYINT CHECK (overall_rating BETWEEN 1 AND 5),
    service_quality TINYINT CHECK (service_quality BETWEEN 1 AND 5),
    staff_behavior TINYINT CHECK (staff_behavior BETWEEN 1 AND 5),
    timeliness TINYINT CHECK (timeliness BETWEEN 1 AND 5),
    cleanliness TINYINT CHECK (cleanliness BETWEEN 1 AND 5),
    
    -- نظرات متنی
    positive_feedback TEXT,
    negative_feedback TEXT,
    suggestions TEXT,
    
    -- اطلاعات تماس
    contact_name VARCHAR(100),
    contact_phone VARCHAR(11),
    contact_email VARCHAR(100),
    
    -- وضعیت
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    
    -- متادیتا
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- روابط
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- ایندکس‌ها
    INDEX idx_user_id (user_id),
    INDEX idx_service_type (service_type),
    INDEX idx_overall_rating (overall_rating),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================
-- 6. SYSTEM & LOGS
-- ====================================

-- جدول لاگ‌های سیستم
CREATE TABLE system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- اطلاعات لاگ
    level ENUM('debug', 'info', 'warning', 'error', 'critical') NOT NULL,
    message TEXT NOT NULL,
    context JSON,
    
    -- اطلاعات درخواست
    user_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_method VARCHAR(10),
    request_url TEXT,
    
    -- اطلاعات اضافی
    module VARCHAR(100),
    action VARCHAR(100),
    
    -- زمان
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- روابط
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- ایندکس‌ها
    INDEX idx_level (level),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    INDEX idx_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- جدول تنظیمات سیستم
CREATE TABLE system_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- کلید و مقدار
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type ENUM('string', 'integer', 'boolean', 'json') DEFAULT 'string',
    
    -- توضیحات
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    
    -- دسترسی
    is_public BOOLEAN DEFAULT FALSE,
    is_editable BOOLEAN DEFAULT TRUE,
    
    -- متادیتا
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- ایندکس‌ها
    INDEX idx_category (category),
    INDEX idx_is_public (is_public)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ====================================
-- 7. INITIAL DATA
-- ====================================

-- تنظیمات اولیه سیستم
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, category) VALUES
('site_name', 'آزمایشگاه تشخیص پزشکی سلامت', 'string', 'نام سایت', 'general'),
('site_description', 'ارائه خدمات تشخیص پزشکی با کیفیت', 'string', 'توضیحات سایت', 'general'),
('contact_phone', '021-46833010', 'string', 'شماره تماس اصلی', 'contact'),
('contact_email', 'info@salamatlab.com', 'string', 'ایمیل تماس', 'contact'),
('otp_expire_minutes', '5', 'integer', 'مدت زمان انقضای OTP (دقیقه)', 'security'),
('max_otp_attempts', '5', 'integer', 'حداکثر تلاش برای OTP', 'security'),
('home_service_radius_km', '20', 'integer', 'شعاع ارائه خدمات در محل (کیلومتر)', 'services');

-- دسته‌بندی‌های پزشکی اولیه
INSERT INTO medical_services (name, category, description, base_price, home_service_available) VALUES
('چکاپ عمومی', 'checkup', 'بررسی کلی وضعیت سلامت', 500000.00, false),
('آزمایش خون کامل', 'laboratory', 'شامل CBC, ESR, و سایر پارامترها', 150000.00, true),
('آزمایش ادرار', 'laboratory', 'تجزیه کامل ادرار', 80000.00, true),
('سونوگرافی شکم', 'imaging', 'سونوگرافی ناحیه شکم و لگن', 300000.00, false),
('نوار قلب', 'diagnostic', 'الکتروکاردیوگرام', 100000.00, true);

-- نمونه دکتر
INSERT INTO doctors (first_name, last_name, specialty, specialty_category, phone, consultation_fee, is_active) VALUES
('احمد', 'محمدی', 'پزشک عمومی', 'general', '09121234567', 200000.00, true),
('فاطمه', 'احمدی', 'متخصص قلب', 'cardiology', '09123456789', 400000.00, true);
