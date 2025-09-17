import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { useNavigate, Link } from 'react-router-dom';
import { clearAdminCredentials } from '@/lib/adminAuth';
import { 
  ArrowRight, 
  LogOut, 
  BarChart3,
  RefreshCw,
  Calendar,
} from 'lucide-react';

interface AdminPageLayoutProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  children: React.ReactNode;
  onRefresh?: () => void;
  loading?: boolean;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
}

export const AdminPageLayout: React.FC<AdminPageLayoutProps> = ({
  title,
  description,
  icon,
  badge,
  children,
  onRefresh,
  loading = false,
  breadcrumbs = [],
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAdminCredentials();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-red-200/20 shadow-lg sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Breadcrumbs */}
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/admin" className="flex items-center gap-2 text-black hover:text-red-600 transition-colors">
                    <BarChart3 className="w-4 h-4" />
                    داشبورد
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {breadcrumbs.map((breadcrumb, index) => (
                <React.Fragment key={index}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {breadcrumb.href ? (
                      <BreadcrumbLink asChild>
                        <Link to={breadcrumb.href} className="text-black hover:text-red-600 transition-colors">{breadcrumb.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-black">{breadcrumb.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
                className="flex items-center gap-2 border-red-200 text-black hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              >
                <ArrowRight className="w-4 h-4" />
                بازگشت
              </Button>

              <div className="flex items-center gap-3">
                {icon && (
                  <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl shadow-sm border border-red-200/30">
                    {icon}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-black">{title}</h1>
                    {badge && (
                      <Badge variant={badge.variant || 'default'} className="bg-red-600 hover:bg-red-700 text-white border-red-600">
                        {badge.text}
                      </Badge>
                    )}
                  </div>
                  {description && (
                    <p className="text-black/70 mt-1">{description}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {onRefresh && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefresh}
                  disabled={loading}
                  className="flex items-center gap-2 border-red-200 text-black hover:bg-red-50 hover:border-red-300 transition-all duration-200"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  بروزرسانی
                </Button>
              )}

              <div className="text-xs text-black/60 hidden md:flex items-center gap-1 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-red-200/20">
                <Calendar className="w-3 h-3" />
                {new Date().toLocaleDateString('fa-IR')}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-red-200/20 shadow-xl p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminPageLayout;
