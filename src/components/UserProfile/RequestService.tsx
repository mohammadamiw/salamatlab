import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Stethoscope, Beaker, Calendar, MapPin, User, Phone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import RequestCheckupForm from './RequestCheckupForm';
import RequestSamplingForm from './RequestSamplingForm';

interface RequestServiceProps {
  onBack?: () => void;
  defaultTab?: 'checkup' | 'sampling';
}

const RequestService: React.FC<RequestServiceProps> = ({ 
  onBack, 
  defaultTab = 'checkup' 
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { user } = useAuth();

  const services = [
    {
      id: 'checkup',
      title: 'درخواست چکاپ',
      description: 'انتخاب پنل چکاپ و رزرو نوبت',
      icon: Stethoscope,
      color: 'blue',
      features: [
        'چکاپ‌های عمومی و تخصصی',
        'رزرو آنلاین نوبت',
        'انتخاب زمان مناسب',
        'مشاوره رایگان'
      ]
    },
    {
      id: 'sampling',
      title: 'نمونه‌گیری در منزل',
      description: 'درخواست نمونه‌گیری در محل',
      icon: Beaker,
      color: 'green',
      features: [
        'نمونه‌گیری در منزل',
        'تکنسین مجرب',
        'زمان‌بندی انعطاف‌پذیر',
        'هزینه مناسب'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 border-0 shadow-xl rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">درخواست خدمات</h2>
          </div>
          {onBack && (
            <Button variant="outline" onClick={onBack} size="sm">
              <ArrowLeft className="w-4 h-4 ml-2" />
              بازگشت
            </Button>
          )}
        </div>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'checkup' | 'sampling')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="checkup" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            چکاپ
          </TabsTrigger>
          <TabsTrigger value="sampling" className="flex items-center gap-2">
            <Beaker className="w-4 h-4" />
            نمونه‌گیری
          </TabsTrigger>
        </TabsList>

        {/* Service Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {services.map((service) => {
            const Icon = service.icon;
            const isActive = activeTab === service.id;
            
            return (
              <Card 
                key={service.id}
                className={`p-6 border-2 transition-all duration-300 cursor-pointer ${
                  isActive 
                    ? `border-${service.color}-500 bg-${service.color}-50` 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setActiveTab(service.id as 'checkup' | 'sampling')}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${
                    service.color === 'blue' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      service.color === 'blue' ? 'text-blue-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* User Info Summary */}
        <Card className="p-4 bg-gray-50 border border-gray-200 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : 'کاربر'
                  }
                </h4>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    <span>{user?.phone}</span>
                  </div>
                  {user?.nationalId && (
                    <div>
                      کد ملی: {user.nationalId}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">اطلاعات از پروفایل</div>
              <div className="text-xs text-green-600">✓ تایید شده</div>
            </div>
          </div>
        </Card>

        {/* Service Forms */}
        <TabsContent value="checkup" className="mt-0">
          <RequestCheckupForm />
        </TabsContent>

        <TabsContent value="sampling" className="mt-0">
          <RequestSamplingForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestService;
