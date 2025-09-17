import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  const location = useLocation();
  
  // Auto-generate breadcrumbs if not provided
  const breadcrumbItems = items || generateBreadcrumbs(location.pathname);

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav 
      aria-label="مسیر صفحه"
      className={`flex items-center space-x-1 space-x-reverse text-sm text-gray-600 ${className}`}
    >
      {/* Structured Data for Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbItems.map((item, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": item.label,
              "item": `https://www.salamatlab.com${item.path}`
            }))
          })
        }}
      />
      
      {breadcrumbItems.map((item, index) => (
        <React.Fragment key={item.path}>
          {index > 0 && (
            <ChevronLeft className="w-4 h-4 text-gray-400 rtl:rotate-180" />
          )}
          {index === breadcrumbItems.length - 1 ? (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="hover:text-blue-600 transition-colors duration-200 flex items-center"
            >
              {index === 0 && <Home className="w-4 h-4 ml-1" />}
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

// Auto-generate breadcrumbs based on pathname
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const pathMap: { [key: string]: string } = {
    '/': 'خانه',
    '/doctors': 'پزشکان',
    '/doctors/urology': 'پزشکان اورولوژی',
    '/doctors/orthopedic': 'پزشکان ارتوپدی',
    '/doctors/gynecology': 'پزشکان زنان و زایمان',
    '/doctors/general': 'پزشکان عمومی',
    '/doctors/internal-medicine': 'پزشکان داخلی',
    '/doctors/midwife': 'ماماها',
    '/doctors/shahrqods': 'پزشکان شهرقدس',
    '/services': 'خدمات',
    '/services/hematology': 'هماتولوژی',
    '/services/biochemistry': 'بیوشیمی',
    '/services/microbiology': 'میکروبیولوژی',
    '/services/immunology': 'ایمونولوژی',
    '/services/cytology': 'سیتولوژی',
    '/services/molecular-diagnosis': 'تشخیص مولکولی',
    '/services/flow-cytometry': 'فلوسایتومتری',
    '/services/toxicology': 'سم‌شناسی',
    '/services/research': 'تحقیقات',
    '/about': 'درباره ما',
    '/contact': 'تماس با ما',
    '/articles': 'مقالات',
    '/blog': 'بلاگ',
    '/careers': 'فرصت‌های شغلی',
    '/feedback': 'نظرات',
    '/sample-at-home': 'نمونه‌گیری در منزل',
    '/checkups/request': 'درخواست چکاپ'
  };

  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'خانه', path: '/' }
  ];

  let currentPath = '';
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = pathMap[currentPath];
    if (label) {
      breadcrumbs.push({ label, path: currentPath });
    }
  }

  return breadcrumbs;
}

export default Breadcrumbs;
