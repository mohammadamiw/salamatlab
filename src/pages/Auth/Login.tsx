import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/contexts/AuthContext';
import { Phone, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import PhoneOtp from '@/components/PhoneOtp';
import { getApiBase } from '@/lib/apiBase';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePhoneVerified = async () => {
    setPhoneVerified(true);
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting to create/get user with phone:', phone);
      console.log('API URL:', `${getApiBase()}/api/users-simple.php`);
      
      // چک کردن یا ایجاد کاربر در دیتابیس (از API ساده استفاده می‌کنیم)
      const response = await fetch(`${getApiBase()}/api/users-simple.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'create',
          phone: phone
        })
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP Error:', response.status, errorText);
        setError(`خطای سرور: ${response.status} - ${errorText}`);
        return;
      }

      const result = await response.json();
      console.log('API Result:', result);
      
      if (result.success && result.user) {
        const user = {
          id: result.user.id,
          phone: result.user.phone,
          firstName: result.user.first_name,
          lastName: result.user.last_name,
          email: result.user.email,
          nationalId: result.user.national_id,
          birthDate: result.user.birth_date,
          gender: result.user.gender,
          city: result.user.city,
          hasBasicInsurance: result.user.has_basic_insurance,
          basicInsurance: result.user.basic_insurance,
          complementaryInsurance: result.user.complementary_insurance,
          addresses: result.user.addresses || [],
          defaultAddressId: result.user.default_address_id,
          isProfileComplete: result.user.is_profile_complete,
          createdAt: new Date(result.user.created_at)
        };
        
        localStorage.setItem('salamat_user', JSON.stringify(user));
        
        if (result.created) {
          // کاربر جدید - تکمیل پروفایل
          navigate('/auth/complete-profile');
        } else {
          // کاربر موجود - ورود مستقیم
          navigate('/profile');
        }
      } else {
        console.error('API returned error:', result);
        setError(result.error || 'خطا در دریافت اطلاعات کاربر');
      }
    } catch (error) {
      console.error('Login error:', error);
      console.log('Falling back to localStorage...');
      
      // Fallback به localStorage در صورت خطا در API
      try {
        const existingUsers = JSON.parse(localStorage.getItem('salamat_users') || '[]');
        const user = existingUsers.find((u: any) => u.phone === phone);
        
        if (user) {
          // کاربر موجود - ورود مستقیم
          localStorage.setItem('salamat_user', JSON.stringify(user));
          navigate('/profile');
        } else {
          // کاربر جدید - تکمیل پروفایل
          const newUser = {
            id: Date.now().toString(),
            phone,
            isProfileComplete: false,
            createdAt: new Date(),
            addresses: []
          };
          
          existingUsers.push(newUser);
          localStorage.setItem('salamat_users', JSON.stringify(existingUsers));
          localStorage.setItem('salamat_user', JSON.stringify(newUser));
          
          navigate('/auth/complete-profile');
        }
        
        console.log('Fallback login successful');
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setError(`خطا در اتصال به سرور. لطفاً بعداً تلاش کنید: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    if (!phoneVerified) {
      setError('لطفاً ابتدا شماره تلفن خود را تایید کنید');
      return;
    }

    handlePhoneVerified();
  };

  // اگر کاربر تلفن رو تایید کرده ولی دکمه ورود نزده، می‌تونه مستقیم وارد بشه
  const handleDirectLogin = () => {
    if (!phoneVerified) {
      setError('لطفاً ابتدا شماره تلفن خود را تایید کنید');
      return;
    }

    // ورود مستقیم با localStorage fallback
    try {
      const existingUsers = JSON.parse(localStorage.getItem('salamat_users') || '[]');
      const user = existingUsers.find((u: any) => u.phone === phone);
      
      if (user) {
        // کاربر موجود - ورود مستقیم
        localStorage.setItem('salamat_user', JSON.stringify(user));
        navigate('/profile');
      } else {
        // کاربر جدید - تکمیل پروفایل
        const newUser = {
          id: Date.now().toString(),
          phone,
          isProfileComplete: false,
          createdAt: new Date(),
          addresses: []
        };
        
        existingUsers.push(newUser);
        localStorage.setItem('salamat_users', JSON.stringify(existingUsers));
        localStorage.setItem('salamat_user', JSON.stringify(newUser));
        
        navigate('/auth/complete-profile');
      }
    } catch (error) {
      console.error('Direct login error:', error);
      setError('خطا در ورود');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
            <img 
              src="/images/logo.png" 
              alt="آزمایشگاه سلامت"
              className="w-12 h-12 object-contain"
              onError={(e) => {
                // Fallback if logo not found
                (e.target as HTMLElement).style.display = 'none';
                (e.target as HTMLElement).nextElementSibling!.classList.remove('hidden');
              }}
            />
            <Phone className="w-8 h-8 text-white hidden" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">ورود به پنل کاربری</h1>
          <p className="text-gray-600">آزمایشگاه تشخیص پزشکی سلامت</p>
        </div>

        {/* Login Form */}
        <Card className="p-8 border-0 shadow-2xl rounded-3xl">
          <div className="space-y-6">
            {/* Phone OTP Component - Same as SampleAtHome */}
            <PhoneOtp
              label="شماره موبایل *"
              phone={phone}
              onChangePhone={(newPhone) => {
                setPhone(newPhone);
                setPhoneVerified(false);
                setError('');
              }}
              onVerified={() => setPhoneVerified(true)}
            />

            {phoneVerified && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">شماره تلفن با موفقیت تایید شد</span>
                </div>
                <p className="text-green-600 text-sm mt-1">
                  اکنون می‌توانید وارد پنل کاربری شوید
                </p>
                <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                  <p className="text-blue-600 text-xs">
                    💡 اگر دکمه اول کار نکرد، از دکمه "ورود مستقیم" استفاده کنید
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-right">{error}</p>
              </div>
            )}

            <Button
              onClick={handleLogin}
              disabled={!phoneVerified || isLoading}
              className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed mb-3"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                  در حال ورود...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5 ml-2" />
                  ورود به پنل کاربری
                </>
              )}
            </Button>

            {/* دکمه ورود مستقیم در صورت مشکل API */}
            {phoneVerified && (
              <Button 
                onClick={handleDirectLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full h-12 text-lg border-blue-200 text-blue-600 hover:bg-blue-50 transition-all duration-300 rounded-xl"
              >
                <CheckCircle className="w-5 h-5 ml-2" />
                ورود مستقیم (آفلاین)
              </Button>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                با ورود، شما با{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  قوانین و مقررات
                </a>{' '}
                موافقت می‌کنید
              </p>
              <p className="text-xs text-gray-500">
                اطلاعات شما محفوظ و امن نگهداری می‌شود
              </p>
            </div>
          </div>
        </Card>

        {/* Development Helper */}
        {import.meta.env.DEV && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <h3 className="font-semibold text-yellow-800 mb-2">راهنمای توسعه:</h3>
            <p className="text-sm text-yellow-700">
              سیستم OTP از API واقعی {getApiBase()}/api/otp.php استفاده می‌کند
            </p>
            <p className="text-xs text-yellow-600 mt-1">
              کد OTP در Console و Network tab مرورگر قابل مشاهده است
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;