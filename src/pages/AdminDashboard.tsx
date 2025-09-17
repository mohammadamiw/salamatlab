import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getApiBase } from '@/lib/apiBase';
import { getAdminAuthHeader, clearAdminCredentials } from '@/lib/adminAuth';
import { useNavigate } from 'react-router-dom';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Logo from '@/components/Logo';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import {
  BarChart3,
  MessageSquareText,
  ClipboardList,
  FlaskConical,
  BriefcaseBusiness,
  PhoneCall,
  LogOut,
  RefreshCw,
  Calendar,
  TrendingUp,
  Users,
  Activity,
  AlertCircle,
  BookOpen,
} from 'lucide-react';

// Types and interfaces
interface DashboardData {
  feedbackItems: any[];
  checkupItems: any[];
  samplingItems: any[];
  careerItems: any[];
  contactItems: any[];
}

interface DashboardStats {
  totalFeedback: number;
  totalCheckups: number;
  totalSampling: number;
  totalCareers: number;
  totalContacts: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
}

const AdminDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    feedbackItems: [],
    checkupItems: [],
    samplingItems: [],
    careerItems: [],
    contactItems: []
  });
  const [stats, setStats] = useState<DashboardStats>({
    totalFeedback: 0,
    totalCheckups: 0,
    totalSampling: 0,
    totalCareers: 0,
    totalContacts: 0,
    todayCount: 0,
    weekCount: 0,
    monthCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const navigate = useNavigate();

  // Helper functions
  const calculateStats = (data: DashboardData): DashboardStats => {
    const today = new Date().toISOString().slice(0, 10);
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const allItems = [
      ...data.feedbackItems,
      ...data.checkupItems,
      ...data.samplingItems,
      ...data.careerItems,
      ...data.contactItems
    ];

    return {
      totalFeedback: data.feedbackItems.length,
      totalCheckups: data.checkupItems.length,
      totalSampling: data.samplingItems.length,
      totalCareers: data.careerItems.length,
      totalContacts: data.contactItems.length,
      todayCount: allItems.filter(item => item.createdAt?.slice(0, 10) === today).length,
      weekCount: allItems.filter(item => item.createdAt?.slice(0, 10) >= weekAgo).length,
      monthCount: allItems.filter(item => item.createdAt?.slice(0, 10) >= monthAgo).length,
    };
  };

  const fetchAllData = async () => {
    setLoading(true);
    setError('');
    try {
      const auth = getAdminAuthHeader() || '';
      if (!auth) {
        navigate('/admin/login');
        return;
      }

      const endpoints = [
        '/api/feedback-list.php',
        '/api/checkup-list.php', 
        '/api/sampling-list.php',
        '/api/careers-list.php',
        '/api/contacts-list.php'
      ];

      const promises = endpoints.map(endpoint => 
        fetch(`${getApiBase()}${endpoint}`, { headers: { Authorization: auth } })
          .then(res => {
            if (res.status === 401) throw new Error('unauthorized');
            if (!res.ok) throw new Error(`خطا در دریافت ${endpoint}`);
            return res.json();
          })
          .then(json => json.items || [])
      );

      const [feedbackItems, checkupItems, samplingItems, careerItems, contactItems] = await Promise.all(promises);
      
      const newData: DashboardData = {
        feedbackItems,
        checkupItems,
        samplingItems,
        careerItems,
        contactItems
      };

      setDashboardData(newData);
      setStats(calculateStats(newData));
      setLastRefresh(new Date());
    } catch (e: any) {
      if (e.message === 'unauthorized') {
        setError('لطفاً مجدداً وارد شوید');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        setError(e.message || 'خطا در بارگذاری داده‌ها');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Chart data for activity over time
  const getActivityData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().slice(0, 10);
      const dayName = date.toLocaleDateString('fa-IR', { weekday: 'short' });
      
      const allItems = [
        ...dashboardData.feedbackItems,
        ...dashboardData.checkupItems,
        ...dashboardData.samplingItems,
        ...dashboardData.careerItems,
        ...dashboardData.contactItems
      ];
      
      const count = allItems.filter(item => 
        item.createdAt?.slice(0, 10) === dateStr
      ).length;
      
      return { day: dayName, count };
    });
    return last7Days;
  };

  const activityData = getActivityData();

  // Quick access menu items
  const menuItems = [
    { 
      key: 'feedback', 
      label: 'نظرسنجی‌ها', 
      icon: <MessageSquareText className="w-5 h-5" />, 
      count: stats.totalFeedback,
      path: '/admin/feedback',
      color: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    { 
      key: 'checkups', 
      label: 'چکاپ‌ها', 
      icon: <ClipboardList className="w-5 h-5" />, 
      count: stats.totalCheckups,
      path: '/admin/checkups',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
    { 
      key: 'sampling', 
      label: 'نمونه‌گیری', 
      icon: <FlaskConical className="w-5 h-5" />, 
      count: stats.totalSampling,
      path: '/admin/sampling',
      color: 'bg-purple-50 text-purple-700 border-purple-200'
    },
    { 
      key: 'careers', 
      label: 'رزومه‌ها', 
      icon: <BriefcaseBusiness className="w-5 h-5" />, 
      count: stats.totalCareers,
      path: '/admin/careers',
      color: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    { 
      key: 'contacts', 
      label: 'تماس‌ها', 
      icon: <PhoneCall className="w-5 h-5" />, 
      count: stats.totalContacts,
      path: '/admin/contacts',
      color: 'bg-red-50 text-red-700 border-red-200'
    },
    { 
      key: 'blog', 
      label: 'بلاگ', 
      icon: <BookOpen className="w-5 h-5" />, 
      count: 0,
      path: '/admin/blog',
      color: 'bg-green-50 text-green-700 border-green-200'
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar side="right" className="border-l border-red-200/20 bg-white/80 backdrop-blur-md" data-dir="rtl">
        <SidebarHeader className="p-4 border-b border-red-200/20">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <div>
              <div className="font-bold text-black">پنل مدیریت</div>
              <div className="text-xs text-black/60">آزمایشگاه سلامت</div>
            </div>
          </div>
        </SidebarHeader>
        
        <SidebarContent className="p-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-black/70 font-medium">منوی اصلی</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive={true}
                    className="bg-red-100 text-red-700 border border-red-200 hover:bg-red-200 transition-all duration-200"
                  >
                    <BarChart3 className="w-4 h-4" />
                    <span>داشبورد</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      className="hover:bg-red-50 transition-all duration-200 text-black hover:text-red-700"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge className="bg-red-100 text-red-700 border border-red-200/30">
                      {item.count}
                    </SidebarMenuBadge>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter className="p-4 border-t border-red-200/20">
          <div className="space-y-2">
            <div className="text-xs text-black/60">
              آخرین بروزرسانی: {lastRefresh.toLocaleTimeString('fa-IR')}
            </div>
            <Button
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
              onClick={() => { clearAdminCredentials(); navigate('/admin/login'); }}
            >
              <LogOut className="me-2 w-4 h-4" /> خروج
          </Button>
          </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md border-b border-red-200/20 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
            <SidebarTrigger />
              <div>
                <h1 className="text-2xl font-bold text-black">داشبورد مدیریت</h1>
                <p className="text-sm text-lime-600 font-medium">خلاصه‌ای از فعالیت‌های سیستم</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={fetchAllData}
                disabled={loading}
                variant="outline"
                size="sm"
                className="hidden sm:flex border-red-200 text-black hover:bg-lime-50 hover:border-lime-300 hover:text-lime-700 transition-all duration-200 hover:shadow-lg hover:shadow-lime-200/50"
              >
                <RefreshCw className={`w-4 h-4 me-2 ${loading ? 'animate-spin' : ''}`} />
                بروزرسانی
              </Button>
              <div className="text-xs text-black/60 hidden md:block bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full border border-red-200/20">
                <Calendar className="w-3 h-3 inline me-1" />
                {new Date().toLocaleDateString('fa-IR')}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6 bg-white/40 backdrop-blur-sm">
          {/* Error State */}
          {error && (
            <Alert className="border-red-200/50 bg-red-50/80 backdrop-blur-sm">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-24" />
            </Card>
              ))
            ) : (
              [
                { label: 'امروز', value: stats.todayCount, icon: Calendar, color: 'text-red-600', bgColor: 'from-red-100 to-red-200', borderColor: 'border-red-200/30' },
                { label: 'این هفته', value: stats.weekCount, icon: TrendingUp, color: 'text-green-600', bgColor: 'from-green-100 to-green-200', borderColor: 'border-green-200/30' },
                { label: 'این ماه', value: stats.monthCount, icon: Activity, color: 'text-lime-600', bgColor: 'from-lime-100 to-lime-200', borderColor: 'border-lime-200/30' },
                { label: 'کل کاربران', value: stats.totalFeedback + stats.totalCheckups + stats.totalSampling + stats.totalCareers + stats.totalContacts, icon: Users, color: 'text-red-600', bgColor: 'from-red-100 to-red-200', borderColor: 'border-red-200/30' },
              ].map((stat, index) => (
                <Card key={index} className={`p-6 hover:scale-105 transition-all duration-200 bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} shadow-lg backdrop-blur-sm`}>
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-black/70">{stat.label}</p>
                        <p className="text-3xl font-bold text-black">{stat.value.toLocaleString('fa-IR')}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
            </Card>
              ))
            )}
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/60 backdrop-blur-md border border-red-200/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black">
                <Activity className="w-5 h-5 text-red-600" />
                دسترسی سریع
              </CardTitle>
              <CardDescription className="text-black/70">
                مدیریت بخش‌های مختلف سیستم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => navigate(item.path)}
                    className={`p-4 rounded-xl border-2 transition-all hover:scale-105 duration-200 bg-white/80 backdrop-blur-sm shadow-lg ${item.color} hover:shadow-xl`}
                  >
                    <div className="flex flex-col items-center text-center space-y-2">
                      {item.icon}
                      <div className="font-medium text-sm text-black">{item.label}</div>
                      <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 border border-red-200/30">
                        {item.count.toLocaleString('fa-IR')}
                      </Badge>
                    </div>
              </button>
            ))}
          </div>
            </CardContent>
          </Card>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Chart */}
            <Card className="bg-white/60 backdrop-blur-md border border-red-200/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <BarChart3 className="w-5 h-5 text-red-600" />
                  فعالیت ۷ روز گذشته
                </CardTitle>
                <CardDescription className="text-black/70">
                  تعداد درخواست‌های دریافتی در روزهای اخیر
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                </div>
                ) : (
                  <ChartContainer config={{}} className="h-64">
                  <ResponsiveContainer>
                      <LineChart data={activityData}>
                        <XAxis 
                          dataKey="day" 
                          stroke="#64748b" 
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="#64748b" 
                          fontSize={12}
                          allowDecimals={false}
                        />
                      <ChartTooltip content={<ChartTooltipContent />} />
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                        />
                      </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
                )}
              </CardContent>
            </Card>

            {/* Services Distribution */}
            <Card className="bg-white/60 backdrop-blur-md border border-red-200/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Users className="w-5 h-5 text-red-600" />
                  توزیع خدمات
                </CardTitle>
                <CardDescription className="text-black/70">
                  نسبت استفاده از خدمات مختلف
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="h-64 flex items-center justify-center">
                    <Skeleton className="h-full w-full" />
                    </div>
                ) : (
                  <ChartContainer config={{}} className="h-64">
                  <ResponsiveContainer>
                    <PieChart>
                        <Pie
                          data={[
                            { name: 'نظرسنجی', value: stats.totalFeedback, fill: '#3b82f6' },
                            { name: 'چکاپ', value: stats.totalCheckups, fill: '#10b981' },
                            { name: 'نمونه‌گیری', value: stats.totalSampling, fill: '#8b5cf6' },
                            { name: 'رزومه', value: stats.totalCareers, fill: '#f59e0b' },
                            { name: 'تماس', value: stats.totalContacts, fill: '#ef4444' },
                          ]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {[0, 1, 2, 3, 4].map((_, index) => (
                            <Cell key={`cell-${index}`} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                )}
              </CardContent>
          </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminDashboard;