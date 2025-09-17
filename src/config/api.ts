/**
 * API Configuration - Liara Optimized
 * تنظیمات API بهینه شده برای لیارا
 */

// تعیین محیط اجرا
const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

// Base URLs برای محیط‌های مختلف - Architecture جداگانه
const API_ENDPOINTS = {
  development: {
    base: 'http://localhost:5173',
    api: 'http://localhost:5173/api'
  },
  production: {
    base: 'https://salamatlab-frontend.liara.run',
    api: 'https://salamatlab-backend.liara.run/api'
  }
};

/**
 * دریافت Base URL بر اساس محیط
 */
export function getApiBase(): string {
  if (isProduction) {
    return API_ENDPOINTS.production.api;
  }
  return API_ENDPOINTS.development.api;
}

/**
 * دریافت Base URL سایت
 */
export function getSiteBase(): string {
  if (isProduction) {
    return API_ENDPOINTS.production.base;
  }
  return API_ENDPOINTS.development.base;
}

/**
 * دریافت Backend URL برای production
 */
export function getBackendBase(): string {
  if (isProduction) {
    return 'https://salamatlab-backend.liara.run';
  }
  return 'http://localhost:8000'; // Local PHP development server
}

/**
 * تنظیمات API
 */
export const API_CONFIG = {
  timeout: 30000, // 30 ثانیه
  retries: 3,
  retryDelay: 1000, // 1 ثانیه
  
  // Headers پیش‌فرض
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  
  // تنظیمات OTP
  otp: {
    codeLength: 6,
    ttlSeconds: 300, // 5 دقیقه
    resendDelay: 60 // 1 دقیقه
  }
};

/**
 * URL های API - بروزرسانی شده برای backend یکپارچه
 */
export const API_URLS = {
  // User Management - یکپارچه شده
  users: `${getApiBase()}/users.php`,
  
  // OTP - جداگانه
  sendOtp: `${getApiBase()}/otp.php`,
  verifyOtp: `${getApiBase()}/otp.php`,
  
  // Backend Test Endpoints
  testConnection: `${getApiBase()}/test-connection.php`,
  testSms: `${getApiBase()}/test-sms.php`,
  
  // Other APIs
  contact: `${getApiBase()}/contact.php`,
  booking: `${getApiBase()}/booking.php`,
  sampling: `${getApiBase()}/sampling-list.php`,
  checkup: `${getApiBase()}/checkup-list.php`,
  
  // Admin APIs
  adminAuth: `${getApiBase()}/admin/auth.php`
};

/**
 * Environment Variables
 */
export const ENV = {
  NODE_ENV: import.meta.env.MODE,
  PROD: isProduction,
  DEV: isDevelopment,
  
  // Debug mode
  DEBUG: import.meta.env.VITE_DEBUG === 'true' || isDevelopment,
  
  // API Settings
  API_TIMEOUT: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  API_RETRIES: parseInt(import.meta.env.VITE_API_RETRIES || '3'),
  
  // Feature flags
  ENABLE_OTP: import.meta.env.VITE_ENABLE_OTP !== 'false', // Default true
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING !== 'false', // Default true
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true', // Default false
};

/**
 * لاگ‌گذاری شرطی
 */
export function debugLog(message: string, data?: any) {
  if (ENV.DEBUG) {
    console.log(`[SalamatLab] ${message}`, data || '');
  }
}

/**
 * لاگ خطا
 */
export function errorLog(message: string, error?: any) {
  if (ENV.ENABLE_LOGGING) {
    console.error(`[SalamatLab Error] ${message}`, error || '');
  }
}

/**
 * درخواست HTTP با retry logic
 */
export async function apiRequest(
  url: string, 
  options: RequestInit = {},
  retries: number = API_CONFIG.retries
): Promise<Response> {
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...API_CONFIG.defaultHeaders,
      ...options.headers
    }
  };
  
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      debugLog(`API Request (attempt ${attempt}/${retries})`, { url, options: requestOptions });
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);
      
      const response = await fetch(url, {
        ...requestOptions,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      debugLog('API Response', { 
        url, 
        status: response.status, 
        statusText: response.statusText 
      });
      
      return response;
      
    } catch (error) {
      errorLog(`API Request failed (attempt ${attempt}/${retries})`, { url, error });
      
      if (attempt === retries) {
        throw error;
      }
      
      // تأخیر قبل از تلاش مجدد
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * attempt));
    }
  }
  
  throw new Error('Max retries exceeded');
}

/**
 * Helper برای درخواست‌های JSON
 */
export async function apiJsonRequest(
  url: string,
  data?: any,
  method: string = 'POST'
): Promise<any> {
  const options: RequestInit = {
    method,
    body: data ? JSON.stringify(data) : undefined
  };
  
  const response = await apiRequest(url, options);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}

export default {
  getApiBase,
  getSiteBase,
  API_CONFIG,
  API_URLS,
  ENV,
  debugLog,
  errorLog,
  apiRequest,
  apiJsonRequest
};
