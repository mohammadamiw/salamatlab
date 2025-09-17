import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface BookingFormProps {
  type: 'checkup' | 'doctor';
  title: string;
  subtitle?: string;
  price?: string;
  trigger: React.ReactNode;
}

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  nationalCode: string;
  birthDate: string;
  gender: string;
  city: string;
  hasBasicInsurance: string;
  basicInsurance: string;
  complementaryInsurance: string;
  notes: string;
}

const BookingForm: React.FC<BookingFormProps> = ({ type, title, subtitle, price, trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    phone: '',
    email: '',
    nationalCode: '',
    birthDate: '',
    gender: '',
    city: '',
    hasBasicInsurance: '',
    basicInsurance: '',
    complementaryInsurance: '',
    notes: ''
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // فرمت کردن شماره تماس
  const formatPhoneNumber = (value: string) => {
    // حذف همه کاراکترهای غیر عددی
    const numbers = value.replace(/\D/g, '');
    
    // محدود کردن به ۱۱ رقم
    if (numbers.length > 11) return value;
    
    // فرمت کردن شماره
    if (numbers.length >= 4) {
      return numbers.replace(/(\d{4})(\d{3})(\d{4})/, '$1-$2-$3');
    } else if (numbers.length >= 1) {
      return numbers;
    }
    
    return '';
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    handleInputChange('phone', formatted);
  };

  // فرمت کردن کد ملی (فقط اعداد)
  const formatNationalCode = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.slice(0, 10);
  };

  const handleNationalCodeChange = (value: string) => {
    const formatted = formatNationalCode(value);
    handleInputChange('nationalCode', formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // اعتبارسنجی سمت کلاینت
    if (!formData.fullName.trim()) {
      toast({
        title: "خطا در فرم",
        description: "لطفاً نام و نام خانوادگی را وارد کنید",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.phone.trim() || formData.phone.length < 10) {
      toast({
        title: "خطا در فرم",
        description: "لطفاً شماره تماس معتبر وارد کنید",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.nationalCode.trim() || formData.nationalCode.length !== 10) {
      toast({
        title: "خطا در فرم",
        description: "کد ملی باید ۱۰ رقم باشد",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.birthDate) {
      toast({
        title: "خطا در فرم",
        description: "لطفاً تاریخ تولد را انتخاب کنید",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.gender) {
      toast({
        title: "خطا در فرم",
        description: "لطفاً جنسیت را انتخاب کنید",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.city) {
      toast({
        title: "خطا در فرم",
        description: "لطفاً شهر را انتخاب کنید",
        variant: "destructive",
      });
      return;
    }
    
    if (!formData.hasBasicInsurance) {
      toast({
        title: "خطا در فرم",
        description: "لطفاً وضعیت بیمه پایه را مشخص کنید",
        variant: "destructive",
      });
      return;
    }
    
    if (formData.hasBasicInsurance === 'yes' && !formData.basicInsurance) {
      toast({
        title: "خطا در فرم",
        description: "لطفاً نوع بیمه پایه را انتخاب کنید",
        variant: "destructive",
      });
      return;
    }

    // اعتبارسنجی ایمیل (اگر وارد شده باشد)
    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "خطا در فرم",
        description: "لطفاً ایمیل معتبر وارد کنید",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // ارسال اطلاعات به سرور برای ارسال ایمیل
      const response = await fetch('/api/booking.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          type,
          title,
          price
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: "درخواست با موفقیت ارسال شد",
          description: "کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت",
        });
        setIsOpen(false);
        setFormData({
          fullName: '',
          phone: '',
          email: '',
          nationalCode: '',
          birthDate: '',
          gender: '',
          city: '',
          hasBasicInsurance: '',
          basicInsurance: '',
          complementaryInsurance: '',
          notes: ''
        });
      } else {
        throw new Error(result.error || 'خطا در ارسال درخواست');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: "خطا در ارسال درخواست",
        description: error instanceof Error ? error.message : "لطفاً دوباره تلاش کنید یا با پشتیبانی تماس بگیرید",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const cities = [
    "شهرقدس",
    "شهریار",
    "باغستان",
    "اندیشه",
    "گرمدره",
    "وردآورد",
    "ملارد",
    "کرج",
    "تهران",
  ];

  const basicInsurances = [
    "تامین اجتماعی",
    "سلامت",
    "نیروهای مسلح"
  ];

  const complementaryInsurances = [
    "بیمه آسیا",
    "بیمه البرز",
    "بیمه دانا",
    "بیمه پاسارگاد",
    "بیمه سامان",
    "بیمه پارسیان",
    "بیمه کارآفرین",
    "بیمه رازی",
    "بیمه تعاون",
    "بیمه کوثر",
    "بیمه معلم",
    "بیمه دی",
    "بیمه ملت",
    "بیمه نوین",
    "بیمه ما",
    "بیمه سینا",
    "بیمه آرمان",
    "بیمه امید",
    "بیمه حکمت صبا",
    "بیمه زندگی خاورمیانه",
    "بیمه سرمد",
    "بیمه تجارت نو",
    "بیمه حافظ",
    "بیمه آسماری"
  ];

  // تبدیل تاریخ میلادی به شمسی
  const convertToJalali = (gregorianDate: string) => {
    if (!gregorianDate) return '';
    
    const date = new Date(gregorianDate);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    // تبدیل ساده به شمسی (تقریبی)
    const jalaliYear = year - 621;
    const jalaliMonth = month > 3 ? month - 3 : month + 9;
    const jalaliDay = day;
    
    return `${jalaliYear}/${jalaliMonth.toString().padStart(2, '0')}/${jalaliDay.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold text-gray-800">
            {type === 'checkup' ? 'رزرو چکاپ' : 'رزرو ویزیت پزشک'}
          </DialogTitle>
          <div className="text-center text-gray-600">
            <p className="font-medium">{title}</p>
            {subtitle && <p className="text-sm">{subtitle}</p>}
            {price && <p className="text-primary font-bold">{price} تومان</p>}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                نام و نام خانوادگی *
              </Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="نام و نام خانوادگی خود را وارد کنید"
                required
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                شماره تماس *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="مثال: 09123456789"
                required
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                ایمیل
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="example@email.com"
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalCode" className="text-sm font-medium text-gray-700">
                کد ملی *
              </Label>
              <Input
                id="nationalCode"
                type="text"
                value={formData.nationalCode}
                onChange={(e) => handleNationalCodeChange(e.target.value)}
                placeholder="کد ملی ۱۰ رقمی"
                maxLength={10}
                required
                className="border-gray-300 focus:border-primary focus:ring-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthDate" className="text-sm font-medium text-gray-700">
                تاریخ تولد (شمسی) *
              </Label>
              <div className="space-y-2">
                <DatePicker
                  calendar={persian}
                  locale={persian_fa}
                  value={formData.birthDate || undefined}
                  onChange={(date: any) => {
                    try {
                      if (date && typeof date === 'object' && date.isValid) {
                        const formatted = date.format("YYYY/MM/DD");
                        handleInputChange('birthDate', formatted);
                      } else if (Array.isArray(date) && date.length > 0) {
                        const firstDate = date[0];
                        if (firstDate && firstDate.isValid) {
                          const formatted = firstDate.format("YYYY/MM/DD");
                          handleInputChange('birthDate', formatted);
                        }
                      } else {
                        handleInputChange('birthDate', '');
                      }
                    } catch (error) {
                      console.error('Date parsing error:', error);
                      handleInputChange('birthDate', '');
                    }
                  }}
                  inputClass="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-primary bg-white"
                  placeholder="تاریخ تولد را انتخاب کنید"
                  calendarPosition="bottom-right"
                  format="YYYY/MM/DD"
                />
                {formData.birthDate && (
                  <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                    تاریخ انتخابی: {formData.birthDate}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                جنسیت *
              </Label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                required
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-primary bg-white"
              >
                <option value="">جنسیت خود را انتخاب کنید</option>
                <option value="male">مرد</option>
                <option value="female">زن</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                شهر *
              </Label>
              <select
                id="city"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                required
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-primary bg-white"
              >
                <option value="">شهر خود را انتخاب کنید</option>
                {cities.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hasBasicInsurance" className="text-sm font-medium text-gray-700">
                بیمه پایه دارید؟ *
              </Label>
              <select
                id="hasBasicInsurance"
                value={formData.hasBasicInsurance}
                onChange={(e) => handleInputChange('hasBasicInsurance', e.target.value)}
                required
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-primary bg-white"
              >
                <option value="">انتخاب کنید</option>
                <option value="yes">بله</option>
                <option value="no">خیر</option>
              </select>
            </div>

            {formData.hasBasicInsurance === 'yes' && (
              <div className="space-y-2">
                <Label htmlFor="basicInsurance" className="text-sm font-medium text-gray-700">
                  نوع بیمه پایه *
                </Label>
                <select
                  id="basicInsurance"
                  value={formData.basicInsurance}
                  onChange={(e) => handleInputChange('basicInsurance', e.target.value)}
                  required
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-primary bg-white"
                >
                  <option value="">نوع بیمه پایه را انتخاب کنید</option>
                  {basicInsurances.map((insurance) => (
                    <option key={insurance} value={insurance}>{insurance}</option>
                  ))}
                </select>
              </div>
            )}

            {formData.hasBasicInsurance === 'yes' && (
              <div className="space-y-2">
                <Label htmlFor="complementaryInsurance" className="text-sm font-medium text-gray-700">
                  بیمه تکمیلی
                </Label>
                <select
                  id="complementaryInsurance"
                  value={formData.complementaryInsurance}
                  onChange={(e) => handleInputChange('complementaryInsurance', e.target.value)}
                  className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-primary bg-white"
                >
                  <option value="">بیمه تکمیلی را انتخاب کنید (اختیاری)</option>
                  {complementaryInsurances.map((insurance) => (
                    <option key={insurance} value={insurance}>{insurance}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              توضیحات اضافی
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="توضیحات، سوالات یا درخواست‌های خاص خود را اینجا بنویسید..."
              rows={3}
              className="border-gray-300 focus:border-primary focus:ring-primary resize-none"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              <strong>توجه:</strong> پس از ارسال درخواست، کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت 
              تا زمان دقیق و جزئیات بیشتر را هماهنگ کنند.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-medical-gradient hover:opacity-90"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'در حال ارسال...' : 'ارسال درخواست'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingForm;
