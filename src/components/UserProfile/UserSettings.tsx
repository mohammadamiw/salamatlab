import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff,
  Save,
  Camera,
  Trash2,
  MapPin,
  Plus
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

// Constants
const CITIES = [
  'شهرقدس', 'شهریار', 'باغستان', 'اندیشه', 'گرمدره', 
  'وردآورد', 'ملارد', 'کرج', 'تهران'
];

const BASIC_INSURANCES = [
  'تامین اجتماعی', 'سلامت', 'نیروهای مسلح'
];

const COMPLEMENTARY_INSURANCES = [
  'بیمه آسیا', 'بیمه البرز', 'بیمه دانا', 'بیمه پاسارگاد', 'بیمه سامان',
  'بیمه پارسیان', 'بیمه کارآفرین', 'بیمه رازی', 'بیمه تعاون', 'بیمه کوثر',
  'بیمه معلم', 'بیمه دی', 'بیمه ملت', 'بیمه نوین', 'بیمه ما', 'بیمه سینا',
  'بیمه آرمان', 'بیمه امید', 'بیمه حکمت صبا', 'بیمه زندگی خاورمیانه',
  'بیمه سرمد', 'بیمه تجارت نو', 'بیمه حافظ', 'بیمه آسماری'
];

interface UserSettingsProps {
  onNavigate?: (section: string) => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({ onNavigate }) => {
  const { user, completeProfile } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  
  const [settings, setSettings] = useState({
    // Personal Info - populated from user context
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationalId: '',
    birthDate: '',
    gender: '',
    city: '',
    
    // Insurance Info
    hasBasicInsurance: '',
    basicInsurance: '',
    complementaryInsurance: '',
    
    
    // Notifications
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    
    // Privacy
    profileVisibility: true,
    dataSharing: false,
    
    // Security
    twoFactorAuth: false,
  });

  // Update settings when user data changes
  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        nationalId: user.nationalId || '',
        birthDate: user.birthDate || '',
        gender: user.gender || '',
        city: user.city || '',
        hasBasicInsurance: user.hasBasicInsurance || '',
        basicInsurance: user.basicInsurance || '',
        complementaryInsurance: user.complementaryInsurance || '',
      }));
    }
  }, [user]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    // Update user profile with new settings
    const profileData = {
      firstName: settings.firstName,
      lastName: settings.lastName,
      email: settings.email,
      nationalId: settings.nationalId,
      birthDate: settings.birthDate,
      gender: settings.gender as 'male' | 'female',
      city: settings.city,
      hasBasicInsurance: settings.hasBasicInsurance as 'yes' | 'no',
      basicInsurance: settings.basicInsurance,
      complementaryInsurance: settings.complementaryInsurance
    };

    const result = await completeProfile(profileData);
    if (result.success) {
      console.log('Settings saved successfully');
      // Show success message
    } else {
      console.error('Failed to save settings');
      // Show error message
    }
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card className="p-6 border-0 shadow-xl rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <User className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">اطلاعات شخصی</h2>
        </div>

        {/* Profile Picture */}
        <div className="flex items-center gap-6 mb-6 p-4 bg-gray-50 rounded-xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">تصویر پروفایل</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Camera className="w-4 h-4 ml-2" />
                آپلود تصویر
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                <Trash2 className="w-4 h-4 ml-2" />
                حذف
              </Button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstName">نام</Label>
            <Input
              id="firstName"
              value={settings.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="lastName">نام خانوادگی</Label>
            <Input
              id="lastName"
              value={settings.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="email">ایمیل</Label>
            <Input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="phone">شماره موبایل</Label>
            <Input
              id="phone"
              value={settings.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="nationalId">کد ملی</Label>
            <Input
              id="nationalId"
              value={settings.nationalId}
              onChange={(e) => handleInputChange('nationalId', e.target.value)}
              className="mt-2"
              maxLength={10}
            />
          </div>
          
          <div>
            <Label htmlFor="birthDate">تاریخ تولد (شمسی)</Label>
            <DatePicker
              calendar={persian}
              locale={persian_fa}
              value={settings.birthDate || undefined}
              onChange={(date: any) => {
                try {
                  if (date && typeof date === 'object' && date.isValid) {
                    handleInputChange('birthDate', date.format('YYYY/MM/DD'));
                  } else if (Array.isArray(date) && date.length > 0 && date[0]?.isValid) {
                    handleInputChange('birthDate', date[0].format('YYYY/MM/DD'));
                  } else {
                    handleInputChange('birthDate', '');
                  }
                } catch {
                  handleInputChange('birthDate', '');
                }
              }}
              inputClass="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500 bg-white mt-2"
              placeholder="تاریخ تولد را انتخاب کنید"
              calendarPosition="bottom-right"
              format="YYYY/MM/DD"
            />
            {settings.birthDate && (
              <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded mt-2">
                تاریخ انتخابی: {settings.birthDate}
              </div>
            )}
          </div>
          
          <div>
            <Label>جنسیت</Label>
            <Select value={settings.gender} onValueChange={(value) => handleInputChange('gender', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="male">مرد</SelectItem>
                  <SelectItem value="female">زن</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>شهر</Label>
            <Select value={settings.city} onValueChange={(value) => handleInputChange('city', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {CITIES.map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Insurance Information */}
      <Card className="p-6 border-0 shadow-xl rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-800">اطلاعات بیمه</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label>بیمه پایه دارید؟</Label>
            <Select value={settings.hasBasicInsurance} onValueChange={(value) => handleInputChange('hasBasicInsurance', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="yes">بله</SelectItem>
                  <SelectItem value="no">خیر</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          
          {settings.hasBasicInsurance === 'yes' && (
            <div>
              <Label>نوع بیمه پایه</Label>
              <Select value={settings.basicInsurance} onValueChange={(value) => handleInputChange('basicInsurance', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {BASIC_INSURANCES.map(insurance => (
                      <SelectItem key={insurance} value={insurance}>{insurance}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="md:col-span-2">
            <Label>بیمه تکمیلی (اختیاری)</Label>
            <Select value={settings.complementaryInsurance} onValueChange={(value) => handleInputChange('complementaryInsurance', value)}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="انتخاب کنید (اختیاری)" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {COMPLEMENTARY_INSURANCES.map(insurance => (
                    <SelectItem key={insurance} value={insurance}>{insurance}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Default Address */}
      <Card className="p-6 border-0 shadow-xl rounded-2xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-800">آدرس پیش‌فرض</h2>
          </div>
          <Button 
            onClick={() => onNavigate?.('addresses')}
            variant="outline" 
            size="sm"
          >
            <MapPin className="w-4 h-4 ml-2" />
            مدیریت آدرس‌ها
          </Button>
        </div>

        {user?.addresses?.length ? (
          <div>
            {(() => {
              const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
              return defaultAddress ? (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800">{defaultAddress.title}</h3>
                    <Badge className="bg-green-100 text-green-800">پیش‌فرض</Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">{defaultAddress.address}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>کد پستی: {defaultAddress.postalCode}</span>
                    <span>تلفن: {defaultAddress.phone}</span>
                  </div>
                </div>
              ) : null;
            })()}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">هیچ آدرسی ثبت نشده</h3>
            <p className="text-gray-600 mb-4">برای استفاده در فرم‌های درخواست، حداقل یک آدرس اضافه کنید</p>
            <Button 
              onClick={() => onNavigate?.('addresses')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 ml-2" />
              افزودن آدرس
            </Button>
          </div>
        )}
      </Card>

      {/* Notifications */}
      <Card className="p-6 border-0 shadow-xl rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          <Bell className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">تنظیمات اعلان‌ها</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">اعلان‌های ایمیل</h3>
              <p className="text-sm text-gray-600">دریافت اعلان‌ها از طریق ایمیل</p>
            </div>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={(value) => handleInputChange('emailNotifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">اعلان‌های پیامکی</h3>
              <p className="text-sm text-gray-600">دریافت اعلان‌ها از طریق پیامک</p>
            </div>
            <Switch
              checked={settings.smsNotifications}
              onCheckedChange={(value) => handleInputChange('smsNotifications', value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-800">نوتیفیکیشن‌های مرورگر</h3>
              <p className="text-sm text-gray-600">دریافت نوتیفیکیشن در مرورگر</p>
            </div>
            <Switch
              checked={settings.pushNotifications}
              onCheckedChange={(value) => handleInputChange('pushNotifications', value)}
            />
          </div>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 ml-2" />
          ذخیره تغییرات
        </Button>
      </div>
    </div>
  );
};

export default UserSettings;