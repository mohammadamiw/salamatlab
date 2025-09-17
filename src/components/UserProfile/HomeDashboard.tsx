import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  TrendingUp, 
  Calendar, 
  Clock,
  Stethoscope,
  Beaker,
  Send,
  Receipt,
  Settings,
  Bell,
  User,
  MapPin,
  Star,
  ChevronRight,
  ChevronLeft,
  Activity,
  FileText,
  Heart,
  Shield
} from 'lucide-react';

interface HomeDashboardProps {
  onNavigate?: (section: string, data?: any) => void;
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample data for recent requests
  const recentRequests = [
    {
      id: '1',
      type: 'checkup',
      title: 'چکاپ کامل',
      date: '۱۴۰۳/۰۶/۲۵',
      status: 'processing',
      icon: Stethoscope,
      color: 'blue'
    },
    {
      id: '2',
      type: 'sampling',
      title: 'نمونه‌گیری در منزل',
      date: '۱۴۰۳/۰۶/۲۰',
      status: 'completed',
      icon: Beaker,
      color: 'green'
    },
    {
      id: '3',
      type: 'results',
      title: 'ارسال جواب آزمایش',
      date: '۱۴۰۳/۰۶/۱۸',
      status: 'completed',
      icon: Send,
      color: 'purple'
    }
  ];

  // Sample data for slider images
  const sliderImages = [
    {
      id: 1,
      image: '/images/about-doctor1.jpg',
      title: 'خدمات چکاپ',
      description: 'چکاپ‌های کامل و تخصصی با پیشرفته‌ترین تجهیزات'
    },
    {
      id: 2,
      image: '/images/about-doctor2.jpg',
      title: 'نمونه‌گیری در منزل',
      description: 'نمونه‌گیری راحت و ایمن در منزل شما'
    },
    {
      id: 3,
      image: '/images/about-doctor3.jpg',
      title: 'تیم متخصص',
      description: 'کادر پزشکی مجرب و با تجربه'
    }
  ];

  // Stats data
  const stats = [
    {
      label: 'کل درخواست‌ها',
      value: '۱۲',
      icon: FileText,
      color: 'blue',
      trend: '+۲'
    },
    {
      label: 'تکمیل شده',
      value: '۸',
      icon: Activity,
      color: 'green',
      trend: '+۳'
    },
    {
      label: 'در انتظار',
      value: '۴',
      icon: Clock,
      color: 'yellow',
      trend: '0'
    }
  ];

  // Quick actions
  const quickActions = [
    {
      title: 'درخواست چکاپ',
      description: 'رزرو نوبت چکاپ',
      icon: Stethoscope,
      color: 'blue',
      action: () => onNavigate?.('requests', { defaultTab: 'checkup', showForm: true })
    },
    {
      title: 'نمونه‌گیری در منزل',
      description: 'درخواست نمونه‌گیری',
      icon: Beaker,
      color: 'green',
      action: () => onNavigate?.('requests', { defaultTab: 'sampling', showForm: true })
    },
    {
      title: 'ارسال جواب',
      description: 'دریافت نتایج آزمایش',
      icon: Send,
      color: 'purple',
      action: () => onNavigate?.('requests', { defaultTab: 'results' })
    },
    {
      title: 'درخواست قبض',
      description: 'دریافت قبض آزمایشات',
      icon: Receipt,
      color: 'orange',
      action: () => onNavigate?.('requests', { defaultTab: 'invoice' })
    }
  ];

  // Quick settings
  const quickSettings = [
    {
      title: 'اعلان‌ها',
      description: 'تنظیم اعلان‌ها',
      icon: Bell,
      enabled: true
    },
    {
      title: 'حریم خصوصی',
      description: 'تنظیمات حریم خصوصی',
      icon: Shield,
      enabled: true
    },
    {
      title: 'پروفایل',
      description: 'ویرایش اطلاعات شخصی',
      icon: User,
      enabled: false
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % sliderImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'تکمیل';
      case 'processing':
        return 'در حال پردازش';
      case 'pending':
        return 'انتظار';
      default:
        return 'نامشخص';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card className="p-6 border-0 shadow-xl rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">خوش آمدید! 👋</h1>
            <p className="text-blue-100">امروز چه کاری می‌توانیم برایتان انجام دهیم؟</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-blue-100">امروز</div>
            <div className="text-lg font-semibold">۱۴۰۳/۰۶/۲۶</div>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6 border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-800">{stat.value}</span>
                    {stat.trend && (
                      <Badge className={`text-xs ${
                        stat.trend.includes('+') ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {stat.trend}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${
                  stat.color === 'blue' ? 'bg-blue-50' :
                  stat.color === 'green' ? 'bg-green-50' :
                  stat.color === 'yellow' ? 'bg-yellow-50' : 'bg-gray-50'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    stat.color === 'blue' ? 'text-blue-600' :
                    stat.color === 'green' ? 'text-green-600' :
                    stat.color === 'yellow' ? 'text-yellow-600' : 'text-gray-600'
                  }`} />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <Card className="p-6 border-0 shadow-xl rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              آخرین درخواست‌ها
            </h2>
            <Button variant="outline" size="sm">
              مشاهده همه
            </Button>
          </div>

          <div className="space-y-4">
            {recentRequests.map((request) => {
              const Icon = request.icon;
              return (
                <div key={request.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                  <div className={`p-2 rounded-lg ${
                    request.color === 'blue' ? 'bg-blue-100' :
                    request.color === 'green' ? 'bg-green-100' :
                    request.color === 'purple' ? 'bg-purple-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      request.color === 'blue' ? 'text-blue-600' :
                      request.color === 'green' ? 'text-green-600' :
                      request.color === 'purple' ? 'text-purple-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{request.title}</h3>
                    <p className="text-gray-500 text-xs">{request.date}</p>
                  </div>
                  <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                    {getStatusLabel(request.status)}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Image Slider */}
        <Card className="p-6 border-0 shadow-xl rounded-2xl">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-600" />
            خدمات ویژه
          </h2>

          <div className="relative">
            <div className="overflow-hidden rounded-xl">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {sliderImages.map((slide) => (
                  <div key={slide.id} className="w-full flex-shrink-0 relative">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-semibold mb-1">{slide.title}</h3>
                      <p className="text-white/90 text-sm">{slide.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Slider Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {sliderImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6 border-0 shadow-xl rounded-2xl">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          دسترسی سریع
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="p-4 rounded-xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 group"
              >
                <div className={`p-3 rounded-xl mb-3 mx-auto w-fit ${
                  action.color === 'blue' ? 'bg-blue-50 group-hover:bg-blue-100' :
                  action.color === 'green' ? 'bg-green-50 group-hover:bg-green-100' :
                  action.color === 'purple' ? 'bg-purple-50 group-hover:bg-purple-100' :
                  action.color === 'orange' ? 'bg-orange-50 group-hover:bg-orange-100' : 'bg-gray-50'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    action.color === 'blue' ? 'text-blue-600' :
                    action.color === 'green' ? 'text-green-600' :
                    action.color === 'purple' ? 'text-purple-600' :
                    action.color === 'orange' ? 'text-orange-600' : 'text-gray-600'
                  }`} />
                </div>
                <h3 className="font-semibold text-gray-800 text-sm mb-1">{action.title}</h3>
                <p className="text-gray-600 text-xs">{action.description}</p>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Quick Settings */}
      <Card className="p-6 border-0 shadow-xl rounded-2xl">
        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5 text-gray-600" />
          تنظیمات سریع
        </h2>

        <div className="space-y-4">
          {quickSettings.map((setting, index) => {
            const Icon = setting.icon;
            return (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-white rounded-lg">
                    <Icon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{setting.title}</h3>
                    <p className="text-gray-600 text-xs">{setting.description}</p>
                  </div>
                </div>
                <div className={`w-8 h-5 rounded-full ${setting.enabled ? 'bg-blue-500' : 'bg-gray-300'} relative transition-colors`}>
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                    setting.enabled ? 'translate-x-3.5' : 'translate-x-0.5'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default HomeDashboard;
