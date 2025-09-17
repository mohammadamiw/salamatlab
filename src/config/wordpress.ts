// WordPress configuration
export const WORDPRESS_CONFIG = {
  // تغییر این آدرس به آدرس سایت وردپرس خود
  // می‌توانید از متغیر محیطی VITE_WORDPRESS_SITE_URL نیز استفاده کنید
  SITE_URL: import.meta.env.VITE_WORDPRESS_SITE_URL || 'https://cms.salamatlab.com',
  
  // API endpoints
  API_BASE: '/wp-json/wp/v2',
  
  // Default settings
  DEFAULT_PER_PAGE: parseInt(import.meta.env.VITE_WORDPRESS_PER_PAGE || '10'),
  FEATURED_ARTICLES_COUNT: parseInt(import.meta.env.VITE_WORDPRESS_FEATURED_COUNT || '4'),
  
  // Cache settings (in milliseconds)
  CACHE_DURATION: parseInt(import.meta.env.VITE_WORDPRESS_CACHE_DURATION || '300000'), // 5 minutes
  
  // Enable/disable cache
  ENABLE_CACHE: import.meta.env.VITE_WORDPRESS_ENABLE_CACHE !== 'false',
  
  // Default image URL
  DEFAULT_IMAGE: import.meta.env.VITE_WORDPRESS_DEFAULT_IMAGE || 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop&crop=center'
};

// Helper function to get full API URL
export const getWordPressApiUrl = (endpoint: string = '') => {
  return `${WORDPRESS_CONFIG.SITE_URL}${WORDPRESS_CONFIG.API_BASE}${endpoint}`;
};

// Helper function to get posts endpoint
export const getPostsEndpoint = (params: Record<string, string | number> = {}) => {
  const searchParams = new URLSearchParams();
  
  // Add default parameters
  searchParams.append('_embed', '1');
  searchParams.append('per_page', WORDPRESS_CONFIG.DEFAULT_PER_PAGE.toString());
  
  // Add custom parameters
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value.toString());
  });

  return `${getWordPressApiUrl('/posts')}?${searchParams.toString()}`;
};

// Validation function
export const validateWordPressConfig = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!WORDPRESS_CONFIG.SITE_URL || WORDPRESS_CONFIG.SITE_URL === 'https://your-wordpress-site.com') {
    errors.push('آدرس سایت وردپرس تنظیم نشده است. لطفاً در فایل config/wordpress.ts تغییر دهید.');
  }
  
  if (!WORDPRESS_CONFIG.SITE_URL.startsWith('http')) {
    errors.push('آدرس سایت وردپرس باید با http:// یا https:// شروع شود.');
  }
  
  if (WORDPRESS_CONFIG.DEFAULT_PER_PAGE < 1 || WORDPRESS_CONFIG.DEFAULT_PER_PAGE > 100) {
    errors.push('تعداد مقالات در هر صفحه باید بین 1 تا 100 باشد.');
  }
  
  if (WORDPRESS_CONFIG.FEATURED_ARTICLES_COUNT < 1 || WORDPRESS_CONFIG.FEATURED_ARTICLES_COUNT > 20) {
    errors.push('تعداد مقالات نمایشی در صفحه اصلی باید بین 1 تا 20 باشد.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Log configuration on development
if (import.meta.env.DEV) {
  console.log('🔧 WordPress Configuration:', WORDPRESS_CONFIG);
  
  const validation = validateWordPressConfig();
  if (!validation.isValid) {
    console.warn('⚠️ WordPress Configuration Issues:', validation.errors);
  }
} 