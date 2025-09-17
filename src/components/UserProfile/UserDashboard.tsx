import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Settings, 
  MapPin, 
  FileText, 
  Calculator, 
  ClipboardList,
  Stethoscope,
  FileSpreadsheet,
  Send,
  Receipt,
  User,
  Bell,
  Shield,
  Camera,
  LogOut
} from 'lucide-react';
import UserSettings from './UserSettings';
import AddressManagement from './AddressManagement';
import MedicalProfile from './MedicalProfile';
import RequestsSection from './RequestsSection';
import HomeDashboard from './HomeDashboard';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [navigationData, setNavigationData] = useState<any>(null);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleNavigation = (section: string, data?: any) => {
    setActiveTab(section);
    setNavigationData(data);
  };

  const menuItems = [
    { id: 'home', label: 'خانه', icon: Home },
    { id: 'requests', label: 'درخواست‌ها', icon: ClipboardList },
    { id: 'medical', label: 'پرونده پزشکی', icon: FileText },
    { id: 'addresses', label: 'مدیریت آدرس‌ها', icon: MapPin },
    { id: 'settings', label: 'تنظیمات', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">پنل کاربری</h1>
                <p className="text-blue-100">
                  خوش آمدید {user?.firstName ? `${user.firstName} ${user.lastName}` : 'کاربر عزیز'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/30"
              >
                <LogOut className="w-4 h-4 ml-2" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-0 shadow-xl rounded-2xl">
              <div className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                        activeTab === item.id
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Profile Summary */}
            <Card className="p-6 border-0 shadow-xl rounded-2xl mt-6">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">
                  {user?.firstName ? `${user.firstName} ${user.lastName}` : 'کاربر عزیز'}
                </h3>
                <p className="text-sm text-gray-600 mb-4">عضو از: ۱۴۰۳/۰۶/۲۶</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <div className="font-bold text-green-600">۵</div>
                    <div className="text-gray-600">درخواست</div>
                  </div>
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <div className="font-bold text-blue-600">۳</div>
                    <div className="text-gray-600">آدرس</div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsContent value="home" className="mt-0">
                <HomeDashboard onNavigate={handleNavigation} />
              </TabsContent>
              
              <TabsContent value="requests" className="mt-0">
                <RequestsSection key={navigationData ? JSON.stringify(navigationData) : 'requests'} />
              </TabsContent>
              
              <TabsContent value="medical" className="mt-0">
                <MedicalProfile />
              </TabsContent>
              
              <TabsContent value="addresses" className="mt-0">
                <AddressManagement />
              </TabsContent>
              
              <TabsContent value="settings" className="mt-0">
                <UserSettings onNavigate={handleNavigation} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
