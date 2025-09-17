import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth, User } from '@/contexts/AuthContext';
import { User as UserIcon, Mail, CreditCard, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

interface LocationState {
  phone: string;
  user?: User;
}

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    nationalId: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { completeProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState;

  React.useEffect(() => {
    if (!state?.phone) {
      navigate('/auth/login');
      return;
    }

    // Pre-fill data if user exists
    if (state.user) {
      setFormData({
        firstName: state.user.firstName || '',
        lastName: state.user.lastName || '',
        email: state.user.email || '',
        nationalId: state.user.nationalId || ''
      });
    }
  }, [state, navigate]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'نام الزامی است';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'نام باید حداقل ۲ کاراکتر باشد';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'نام خانوادگی الزامی است';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'نام خانوادگی باید حداقل ۲ کاراکتر باشد';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'فرمت ایمیل صحیح نیست';
    }

    if (!formData.nationalId.trim()) {
      newErrors.nationalId = 'کد ملی الزامی است';
    } else if (!/^\d{10}$/.test(formData.nationalId)) {
      newErrors.nationalId = 'کد ملی باید ۱۰ رقم باشد';
    } else if (!validateNationalId(formData.nationalId)) {
      newErrors.nationalId = 'کد ملی معتبر نیست';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateNationalId = (nationalId: string): boolean => {
    // Iranian national ID validation algorithm
    if (!/^\d{10}$/.test(nationalId)) return false;
    
    const check = parseInt(nationalId[9]);
    const sum = nationalId
      .slice(0, 9)
      .split('')
      .reduce((acc, digit, index) => acc + parseInt(digit) * (10 - index), 0);
    
    const remainder = sum % 11;
    
    if (remainder < 2) {
      return check === remainder;
    } else {
      return check === 11 - remainder;
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await completeProfile({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim() || undefined,
        nationalId: formData.nationalId.trim()
      });

      if (result.success) {
        // Profile completed successfully
        navigate('/profile', { replace: true });
      } else {
        setErrors({ general: 'خطا در ذخیره اطلاعات. لطفاً دوباره تلاش کنید' });
      }
    } catch (error) {
      setErrors({ general: 'خطا در اتصال به سرور. لطفاً دوباره تلاش کنید' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNationalIdChange = (value: string) => {
    // Only allow digits
    const filtered = value.replace(/\D/g, '');
    if (filtered.length <= 10) {
      handleInputChange('nationalId', filtered);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
            <UserIcon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">تکمیل اطلاعات</h1>
          <p className="text-gray-600">
            لطفاً اطلاعات خود را برای ایجاد پروفایل کامل کنید
          </p>
        </div>

        {/* Profile Form */}
        <Card className="p-8 border-0 shadow-2xl rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="block mb-2 font-semibold text-gray-700">
                  نام *
                </Label>
                <div className="relative">
                  <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="نام خود را وارد کنید"
                    className={`pr-12 h-12 border-2 transition-colors ${
                      errors.firstName ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <Label htmlFor="lastName" className="block mb-2 font-semibold text-gray-700">
                  نام خانوادگی *
                </Label>
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="نام خانوادگی خود را وارد کنید"
                  className={`h-12 border-2 transition-colors ${
                    errors.lastName ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
                  }`}
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="block mb-2 font-semibold text-gray-700">
                ایمیل (اختیاری)
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@email.com"
                  className={`pr-12 h-12 border-2 transition-colors ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
                  }`}
                  disabled={isLoading}
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                برای دریافت نتایج آزمایش و اطلاعیه‌ها
              </p>
            </div>

            {/* National ID */}
            <div>
              <Label htmlFor="nationalId" className="block mb-2 font-semibold text-gray-700">
                کد ملی *
              </Label>
              <div className="relative">
                <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  id="nationalId"
                  type="text"
                  inputMode="numeric"
                  value={formData.nationalId}
                  onChange={(e) => handleNationalIdChange(e.target.value)}
                  placeholder="1234567890"
                  className={`pr-12 h-12 border-2 transition-colors ${
                    errors.nationalId ? 'border-red-500 focus:border-red-500' : 'focus:border-blue-500'
                  }`}
                  disabled={isLoading}
                  dir="ltr"
                  maxLength={10}
                />
              </div>
              {errors.nationalId && (
                <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">
                برای احراز هویت و صدور نتایج آزمایش
              </p>
            </div>

            {/* Phone Display */}
            <div>
              <Label className="block mb-2 font-semibold text-gray-700">
                شماره موبایل
              </Label>
              <div className="flex items-center h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 ml-2" />
                <span className="text-gray-700 font-mono" dir="ltr">
                  {state?.phone}
                </span>
                <span className="text-green-600 text-sm mr-2">✓ تایید شده</span>
              </div>
            </div>

            {errors.general && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-600 text-sm text-center">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all duration-300 rounded-xl"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin ml-2" />
                  در حال ذخیره...
                </>
              ) : (
                <>
                  <ArrowRight className="w-5 h-5 ml-2" />
                  تکمیل ثبت نام
                </>
              )}
            </Button>
          </form>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-600">
                اطلاعات شما با رعایت کامل حریم خصوصی محفوظ نگهداری می‌شود
              </p>
              <p className="text-xs text-gray-500">
                این اطلاعات برای ارائه بهتر خدمات و صدور نتایج آزمایش استفاده خواهد شد
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CompleteProfile;
