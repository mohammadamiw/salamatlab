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
      console.log('Attempting to login user with phone:', phone);
      console.log('API URL:', `${getApiBase()}/api/users.php`);
      
      // ابتدا سعی می‌کنیم اطلاعات کاربر موجود را دریافت کنیم
      const getUserResponse = await fetch(`${getApiBase()}/api/users.php?action=get_user_profile&phone=${encodeURIComponent(phone)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      console.log('Get user response status:', getUserResponse.status);
      
      if (getUserResponse.ok) {
        const userResult = await getUserResponse.json();
        console.log('Get user result:', userResult);
        
        if (userResult.success && userResult.data) {
          // کاربر موجود - ورود مستقیم
          const user = {
            id: userResult.data.id,
            phone: userResult.data.phone,
            firstName: userResult.data.first_name,
            lastName: userResult.data.last_name,
            email: userResult.data.email,
            nationalId: userResult.data.national_id,
            birthDate: userResult.data.birth_date,
            gender: userResult.data.gender,
            city: userResult.data.city,
            hasBasicInsurance: userResult.data.has_basic_insurance,
            basicInsurance: userResult.data.basic_insurance,
            complementaryInsurance: userResult.data.complementary_insurance,
            addresses: userResult.data.addresses || [],
            defaultAddressId: userResult.data.default_address_id,
            isProfileComplete: userResult.data.is_profile_complete,
            createdAt: new Date(userResult.data.created_at)
          };
          
          localStorage.setItem('salamat_user', JSON.stringify(user));
          
          if (user.isProfileComplete) {
            navigate('/profile');
          } else {
            navigate('/auth/complete-profile');
          }
          return;
        }
      }
      
      // کاربر موجود نیست - ثبت نام کاربر جدید
      console.log('User not found, registering new user...');
      const registerResponse = await fetch(`${getApiBase()}/api/users.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'register',
          phone: phone
        })
      });

      console.log('Register response status:', registerResponse.status);
      
      if (!registerResponse.ok) {
        const errorText = await registerResponse.text();
        console.error('Register HTTP Error:', registerResponse.status, errorText);
        setError(`خطای سرور: ${registerResponse.status} - ${errorText}`);
        return;
      }

      const registerResult = await registerResponse.json();
      console.log('Register result:', registerResult);
      
      if (registerResult.success && registerResult.data) {
        const newUser = {
          id: registerResult.data.id,
          phone: registerResult.data.phone,
          firstName: registerResult.data.first_name || '',
          lastName: registerResult.data.last_name || '',
          email: registerResult.data.email || '',
          nationalId: registerResult.data.national_id || '',
          birthDate: registerResult.data.birth_date || '',
          gender: registerResult.data.gender || '',
          city: registerResult.data.city || '',
          hasBasicInsurance: registerResult.data.has_basic_insurance || false,
          basicInsurance: registerResult.data.basic_insurance || '',
          complementaryInsurance: registerResult.data.complementary_insurance || '',
          addresses: registerResult.data.addresses || [],
          defaultAddressId: registerResult.data.default_address_id || null,
          isProfileComplete: registerResult.data.is_profile_complete || false,
          createdAt: new Date(registerResult.data.created_at)
        };
        
        localStorage.setItem('salamat_user', JSON.stringify(newUser));
        
          // کاربر جدید - تکمیل پروفایل
          navigate('/auth/complete-profile');
      } else {
        console.error('Register API returned error:', registerResult);
        setError(registerResult.message || 'خطا در ثبت نام کاربر');
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
            firstName: '',
            lastName: '',
            email: '',
            nationalId: '',
            birthDate: '',
            gender: '',
            city: '',
            hasBasicInsurance: false,
            basicInsurance: '',
            complementaryInsurance: '',
            addresses: [],
            defaultAddressId: null,
            isProfileComplete: false,
            createdAt: new Date()
          };
          
          existingUsers.push(newUser);
          localStorage.setItem('salamat_users', JSON.stringify(existingUsers));
          localStorage.setItem('salamat_user', JSON.stringify(newUser));
          
          navigate('/auth/complete-profile');
        }
        
        console.log('Fallback login successful');
      } catch (fallbackError) {
        console.error('Fallback error:', fallbackError);
        setError(`خطا در اتصال به سرور. لطفاً بعداً تلاش کنید: ${error instanceof Error ? error.message : 'نامشخص'}`);
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
            <div className="space-y-1 text-sm text-yellow-700">
              <p>• OTP: {getApiBase()}/api/otp.php</p>
              <p>• User Management: {getApiBase()}/api/users.php</p>
              <p>• Backend Test: {getApiBase()}/api/test-connection.php</p>
            </div>
            <p className="text-xs text-yellow-600 mt-2">
              کد OTP و API calls در Console و Network tab مرورگر قابل مشاهده است
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;