import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Beaker, 
  Calendar, 
  Clock, 
  MapPin, 
  User,
  CheckCircle,
  Loader2,
  CreditCard,
  Shield,
  HeartPulse,
  Ribbon,
  Stethoscope,
  FlaskConical
} from 'lucide-react';

// Types - matching the main SampleAtHome page
interface CheckupPackage {
  title: string;
  subtitle?: string;
  description: string;
  features: string[];
  color: string;
  popular?: boolean;
}

interface PersonalInfo {
  fullName: string;
  phone: string;
  phoneVerified: boolean;
  nationalCode: string;
  birthDate: string;
  gender: 'male' | 'female' | '';
  city: string;
  hasBasicInsurance: 'yes' | 'no' | '';
  basicInsurance: string;
  complementaryInsurance: string;
}

interface AddressInfo {
  neighborhood: string;
  street: string;
  plaque: string;
  unit: string;
  location: { lat: number | null; lng: number | null };
}

interface PrescriptionInfo {
  hasPrescription: 'yes' | 'no' | '';
  prescriptionType: 'electronic' | 'paper' | '';
  ePrescriptionCode: string;
  prescriptionFiles: File[];
}

interface SamplingRequest {
  selectedCategory: CategoryKey;
  selectedPackageIndex: number | null;
  personalInfo: PersonalInfo;
  addressInfo: AddressInfo;
  prescriptionInfo: PrescriptionInfo;
  notes: string;
}

type CategoryKey = 'general' | 'specialized' | 'women' | 'cancer';

// Constants - matching the main page
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

const RequestSamplingForm = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [requestData, setRequestData] = useState<SamplingRequest>({
    selectedCategory: 'general',
    selectedPackageIndex: null,
    personalInfo: {
      fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
      phone: user?.phone || '',
      phoneVerified: !!user?.phone,
      nationalCode: user?.nationalId || '',
      birthDate: user?.birthDate || '',
      gender: user?.gender || '',
      city: user?.city || '',
      hasBasicInsurance: user?.hasBasicInsurance || '',
      basicInsurance: user?.basicInsurance || '',
      complementaryInsurance: user?.complementaryInsurance || ''
    },
    addressInfo: {
      neighborhood: (() => {
        const defaultAddress = user?.addresses?.find(addr => addr.isDefault) || user?.addresses?.[0];
        return defaultAddress ? defaultAddress.address.split('،')[1]?.trim() || '' : '';
      })(),
      street: (() => {
        const defaultAddress = user?.addresses?.find(addr => addr.isDefault) || user?.addresses?.[0];
        return defaultAddress ? defaultAddress.address.split('،')[2]?.trim() || '' : '';
      })(),
      plaque: (() => {
        const defaultAddress = user?.addresses?.find(addr => addr.isDefault) || user?.addresses?.[0];
        const addressParts = defaultAddress?.address.split('،') || [];
        const plaquePart = addressParts.find(part => part.includes('پلاک'));
        return plaquePart ? plaquePart.replace('پلاک', '').trim() : '';
      })(),
      unit: (() => {
        const defaultAddress = user?.addresses?.find(addr => addr.isDefault) || user?.addresses?.[0];
        const addressParts = defaultAddress?.address.split('،') || [];
        const unitPart = addressParts.find(part => part.includes('واحد'));
        return unitPart ? unitPart.replace('واحد', '').trim() : '';
      })(),
      location: { lat: null, lng: null }
    },
    prescriptionInfo: {
      hasPrescription: '',
      prescriptionType: '',
      ePrescriptionCode: '',
      prescriptionFiles: []
    },
    notes: ''
  });

  // Checkup categories - exactly matching the main SampleAtHome page
  const checkupCategories: Record<CategoryKey, { title: string; packages: CheckupPackage[] }> = {
    general: {
      title: 'چکاپ‌های عمومی',
      packages: [
        {
          title: 'چکاپ عمومی - قبل از بلوغ',
          subtitle: '(دختر و پسر)',
          description: 'بررسی سلامت پایه کودکان و نوجوانان',
          features: [
            'CBC، ESR، CRP',
            'FBS، Urea، Cr، U.A',
            'Ca، P، AST، ALT، ALP، Bili (T&D)',
            'T3، T4، TSH، Anti TPO',
            'Vit D، TIBC، Ferritin، Folic Acid، Vit B12',
            'Serum Albumin & Protein، Cortisol (8–10 AM)',
            'HBs Ag & Ab، U/A & U/C، S/E ×3'
          ],
          popular: false,
          color: 'from-blue-50 to-blue-100'
        },
        {
          title: 'چکاپ عمومی - بعد از بلوغ',
          subtitle: '(زن و مرد)',
          description: 'چکاپ کامل برای بزرگسالان',
          features: [
            'CBC، ESR، CRP، RF',
            'FBS، Urea، Cr، U.A',
            'Ch، TG، HDL، LDL، Na، K، Ca، P',
            'AST، ALT، ALP، Bili (T&D)، Hb A1C',
            'T3، T4، TSH، Anti TPO، Vit D',
            'Fe، TIBC، Ferritin، Serum Albumin & Protein',
            'Cortisol، HBs Ag & Ab، HCV Ab، HIV Ab'
          ],
          popular: true,
          color: 'from-primary/10 to-primary/20'
        }
      ]
    },
    specialized: {
      title: 'چکاپ‌های تخصصی',
      packages: [
        {
          title: 'پنل بررسی اختلال رشد',
          subtitle: '(قبل از بلوغ)',
          description: 'برای کودکان با رشد کمتر از حد طبیعی',
          features: [
            'GH base (هورمون رشد پایه)',
            'GH after stimulation (تحریک با ورزش یا کلونیدین)',
            'IGF-1 (فاکتور رشد شبه انسولین)'
          ],
          popular: false,
          color: 'from-green-50 to-green-100'
        },
        {
          title: 'پنل دیابت',
          subtitle: '(بعد از بلوغ)',
          description: 'برای افراد مشکوک یا مبتلا به دیابت',
          features: [
            '2h.p.p، Hb A1C',
            'C-peptide، Anti GAD',
            'Insulin Ab، Serum fasting',
            'Islet Ab، Urine microalbumin'
          ],
          popular: false,
          color: 'from-orange-50 to-orange-100'
        },
        {
          title: 'پنل کم‌خونی',
          subtitle: '(بعد از بلوغ)',
          description: 'بررسی کم‌خونی فقر آهن، B12 و فولات',
          features: [
            'Retic count (شمارش رتیکولوسیت)',
            'Fe، TIBC، Ferritin',
            'Folic acid، Vit B12'
          ],
          popular: false,
          color: 'from-red-50 to-red-100'
        }
      ]
    },
    women: {
      title: 'چکاپ‌های زنان',
      packages: [
        {
          title: 'پنل آمنوره',
          subtitle: '(اختلال قاعدگی)',
          description: 'بررسی علت قطع یا بی‌نظمی قاعدگی',
          features: [
            'LH، FSH، PRL',
            'Testosterone، Estradiol',
            'DHEA-S، 17OH Progesterone',
            'Progesterone، Karyotype'
          ],
          popular: false,
          color: 'from-pink-50 to-pink-100'
        },
        {
          title: 'پنل تخمدان پلی‌کیستیک (PCOS)',
          subtitle: '',
          description: 'تشخیص PCOS و بررسی آندروژن‌ها',
          features: [
            'LH، FSH، PRL',
            'Testosterone، F.Testosterone، AMH',
            '17OH Progesterone، Estradiol',
            'DHEA-S، Androstenedione'
          ],
          popular: true,
          color: 'from-purple-50 to-purple-100'
        },
        {
          title: 'پنل هیپرآندروژنیسم',
          subtitle: '(پر مویی)',
          description: 'برای زنان با پُر مویی، آکنه شدید',
          features: [
            'Androstenedione، DHEA-S',
            '17OH Progesterone، AMH',
            'Testosterone، F.Testosterone، DHT'
          ],
          popular: false,
          color: 'from-indigo-50 to-indigo-100'
        }
      ]
    },
    cancer: {
      title: 'غربالگری سرطان',
      packages: [
        {
          title: 'پنل سرطان پستان',
          subtitle: '(زنان)',
          description: 'غربالگری زنان در معرض خطر',
          features: [
            'CEA (آنتی‌ژن کرسینواپریونیک)',
            'CA 125',
            'CA 15.3',
            'HER2'
          ],
          popular: false,
          color: 'from-rose-50 to-rose-100'
        },
        {
          title: 'پنل سرطان تخمدان',
          subtitle: '(زنان)',
          description: 'غربالگری تخصصی سرطان تخمدان',
          features: [
            'CEA، CA 125',
            'HE4 (پروتئین اپیدیدیم انسان)',
            'Roma Factor',
            'B.HCG'
          ],
          popular: false,
          color: 'from-violet-50 to-violet-100'
        },
        {
          title: 'پنل سرطان پروستات',
          subtitle: '(مردان)',
          description: 'غربالگری سرطان پروستات',
          features: [
            'PSA (آنتی‌ژن اختصاصی پروستات)',
            'F.PSA (PSA آزاد)',
            'F.PSA / PSA (نسبت PSA آزاد)'
          ],
          popular: false,
          color: 'from-blue-50 to-blue-100'
        },
        {
          title: 'پنل سرطان روده',
          subtitle: '(زن و مرد)',
          description: 'غربالگری سرطان کولورکتال',
          features: [
            'CEA',
            'CA 19.9',
            'OB (Stool) - خون مخفی مدفوع'
          ],
          popular: false,
          color: 'from-amber-50 to-amber-100'
        }
      ]
    }
  };

  const categoryIcons: Record<string, React.ComponentType<any>> = {
    general: Stethoscope,
    specialized: FlaskConical,
    women: HeartPulse,
    cancer: Ribbon
  };

  const handleCategorySelect = (category: CategoryKey, packageIndex: number) => {
    setRequestData(prev => ({
      ...prev,
      selectedCategory: category,
      selectedPackageIndex: packageIndex
    }));
    setStep(2);
  };

  const updatePersonalInfo = (updates: Partial<PersonalInfo>) => {
    setRequestData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...updates }
    }));
  };

  const updateAddressInfo = (updates: Partial<AddressInfo>) => {
    setRequestData(prev => ({
      ...prev,
      addressInfo: { ...prev.addressInfo, ...updates }
    }));
  };

  const updatePrescriptionInfo = (updates: Partial<PrescriptionInfo>) => {
    setRequestData(prev => ({
      ...prev,
      prescriptionInfo: { ...prev.prescriptionInfo, ...updates }
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to user's requests
      const userRequests = JSON.parse(localStorage.getItem(`requests_${user?.id}`) || '[]');
      const selectedPackage = requestData.selectedPackageIndex !== null ? 
        checkupCategories[requestData.selectedCategory].packages[requestData.selectedPackageIndex] : null;
      
      const newRequest = {
        id: Date.now().toString(),
        type: 'sampling',
        category: {
          title: selectedPackage?.title || 'نمونه‌گیری در محل',
          description: selectedPackage?.description || ''
        },
        data: requestData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        userId: user?.id
      };
      
      userRequests.push(newRequest);
      localStorage.setItem(`requests_${user?.id}`, JSON.stringify(userRequests));
      
      setStep(4); // Success step
    } catch (error) {
      console.error('Error submitting request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPackage = requestData.selectedPackageIndex !== null ? 
    checkupCategories[requestData.selectedCategory].packages[requestData.selectedPackageIndex] : null;

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card className="p-4 border-0 shadow-lg rounded-xl">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: 'انتخاب آزمایش', icon: Beaker },
            { step: 2, title: 'اطلاعات شخصی', icon: User },
            { step: 3, title: 'تایید', icon: CheckCircle },
            { step: 4, title: 'تکمیل', icon: CheckCircle }
          ].map((item, index) => {
            const Icon = item.icon;
            const isActive = step >= item.step;
            const isCurrent = step === item.step;
            
            return (
              <div key={item.step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isActive 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                } ${isCurrent ? 'ring-4 ring-green-200' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mr-3 text-right">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {item.title}
                  </div>
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-4 rounded ${
                    step > item.step ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Step 1: Package Selection */}
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">انتخاب نوع آزمایش برای نمونه‌گیری در منزل</h3>
          
          {/* Category Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {Object.entries(checkupCategories).map(([categoryKey, category]) => {
              const IconComponent = categoryIcons[categoryKey] || Stethoscope;
              return (
                <Button
                  key={categoryKey}
                  variant={requestData.selectedCategory === categoryKey ? "default" : "outline"}
                  className="h-auto p-3 text-sm flex items-center gap-2"
                  onClick={() => setRequestData(prev => ({ ...prev, selectedCategory: categoryKey as CategoryKey }))}
                >
                  <IconComponent className="w-4 h-4" />
                  {category.title}
                </Button>
              );
            })}
          </div>

          {/* Selected Category Packages */}
          <div className="grid gap-4">
            {checkupCategories[requestData.selectedCategory]?.packages.map((pkg, index) => (
              <Card 
                key={index}
                className="p-6 border-2 border-gray-200 hover:border-green-300 cursor-pointer transition-all duration-300 hover:shadow-lg"
                onClick={() => handleCategorySelect(requestData.selectedCategory, index)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-bold text-gray-800">{pkg.title}</h4>
                      {pkg.subtitle && (
                        <span className="text-sm text-gray-500">{pkg.subtitle}</span>
                      )}
                      {pkg.popular && (
                        <Badge className="bg-green-100 text-green-800">محبوب</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {pkg.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-left mr-6">
                    <div className="text-sm text-gray-500 mb-2">نمونه‌گیری در منزل</div>
                    <Button className="bg-green-600 hover:bg-green-700">انتخاب</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Personal Information */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">اطلاعات شخصی و آدرس</h3>
            <Button variant="outline" onClick={() => setStep(1)}>
              تغییر آزمایش
            </Button>
          </div>

          {/* Selected Package Summary */}
          {selectedPackage && (
            <Card className="p-4 bg-green-50 border-green-200">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-green-800">{selectedPackage.title}</h4>
                  <p className="text-green-600 text-sm">{selectedPackage.description}</p>
                </div>
                <div className="text-green-800 font-bold">
                  نمونه‌گیری در منزل
                </div>
              </div>
            </Card>
          )}

          {/* Personal Info Form */}
          <Card className="p-6 border-0 shadow-lg rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800">اطلاعات شخصی</h4>
              <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                ✓ بارگذاری شده از پروفایل
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">نام و نام خانوادگی *</Label>
                <Input 
                  id="fullName" 
                  value={requestData.personalInfo.fullName} 
                  onChange={(e) => updatePersonalInfo({ fullName: e.target.value })} 
                  placeholder="مثال: علی رضایی" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">شماره تماس *</Label>
                <Input 
                  id="phone" 
                  value={requestData.personalInfo.phone} 
                  onChange={(e) => updatePersonalInfo({ phone: e.target.value })} 
                  placeholder="09123456789" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="nationalCode">کد ملی *</Label>
                <Input 
                  id="nationalCode" 
                  value={requestData.personalInfo.nationalCode} 
                  onChange={(e) => updatePersonalInfo({ nationalCode: e.target.value.replace(/\D/g, '').slice(0, 10) })} 
                  placeholder="۱۰ رقم" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label>جنسیت *</Label>
                <Select value={requestData.personalInfo.gender} onValueChange={(gender: any) => updatePersonalInfo({ gender })}>
                  <SelectTrigger className="w-full">
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
              
              <div className="space-y-2">
                <Label>شهر *</Label>
                <Select value={requestData.personalInfo.city} onValueChange={(city: any) => updatePersonalInfo({ city })}>
                  <SelectTrigger className="w-full">
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

              <div className="space-y-2">
                <Label>بیمه پایه دارید؟ *</Label>
                <Select value={requestData.personalInfo.hasBasicInsurance} onValueChange={(hasBasicInsurance: any) => updatePersonalInfo({ hasBasicInsurance })}>
                  <SelectTrigger className="w-full">
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
              
              {requestData.personalInfo.hasBasicInsurance === 'yes' && (
                <div className="space-y-2">
                  <Label>نوع بیمه پایه *</Label>
                  <Select value={requestData.personalInfo.basicInsurance} onValueChange={(basicInsurance: any) => updatePersonalInfo({ basicInsurance })}>
                    <SelectTrigger className="w-full">
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
              
              <div className="space-y-2">
                <Label>بیمه تکمیلی (اختیاری)</Label>
                <Select value={requestData.personalInfo.complementaryInsurance} onValueChange={(complementaryInsurance: any) => updatePersonalInfo({ complementaryInsurance })}>
                  <SelectTrigger className="w-full">
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

          {/* Address Form */}
          <Card className="p-6 border-0 shadow-lg rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800">آدرس نمونه‌گیری</h4>
              {user?.addresses?.length && (
                <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-lg">
                  ✓ آدرس پیش‌فرض از پروفایل
                </div>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="neighborhood">محله *</Label>
                <Input 
                  id="neighborhood" 
                  value={requestData.addressInfo.neighborhood} 
                  onChange={(e) => updateAddressInfo({ neighborhood: e.target.value })} 
                  placeholder="نام محله" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="street">خیابان و کوچه *</Label>
                <Input 
                  id="street" 
                  value={requestData.addressInfo.street} 
                  onChange={(e) => updateAddressInfo({ street: e.target.value })} 
                  placeholder="خیابان اصلی، کوچه فرعی" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="plaque">پلاک *</Label>
                <Input 
                  id="plaque" 
                  value={requestData.addressInfo.plaque} 
                  onChange={(e) => updateAddressInfo({ plaque: e.target.value })} 
                  placeholder="شماره پلاک" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unit">واحد (اختیاری)</Label>
                <Input 
                  id="unit" 
                  value={requestData.addressInfo.unit} 
                  onChange={(e) => updateAddressInfo({ unit: e.target.value })} 
                  placeholder="شماره واحد" 
                />
              </div>
            </div>
          </Card>

          {/* Prescription Info */}
          <Card className="p-6 border-0 shadow-lg rounded-xl">
            <h4 className="font-bold text-gray-800 mb-4">اطلاعات نسخه</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>نسخه پزشک دارید؟ *</Label>
                <Select value={requestData.prescriptionInfo.hasPrescription} onValueChange={(hasPrescription: any) => updatePrescriptionInfo({ hasPrescription })}>
                  <SelectTrigger className="w-full">
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

              {requestData.prescriptionInfo.hasPrescription === 'yes' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>نوع نسخه *</Label>
                    <Select value={requestData.prescriptionInfo.prescriptionType} onValueChange={(prescriptionType: any) => updatePrescriptionInfo({ prescriptionType })}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="انتخاب کنید" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="electronic">نسخه الکترونیک</SelectItem>
                          <SelectItem value="paper">نسخه کاغذی</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {requestData.prescriptionInfo.prescriptionType === 'electronic' && (
                    <div className="space-y-2">
                      <Label htmlFor="ePrescriptionCode">کد نسخه الکترونیک *</Label>
                      <Input 
                        id="ePrescriptionCode" 
                        value={requestData.prescriptionInfo.ePrescriptionCode} 
                        onChange={(e) => updatePrescriptionInfo({ ePrescriptionCode: e.target.value })} 
                        placeholder="کد نسخه الکترونیک" 
                        required 
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
              مرحله قبل
            </Button>
            <Button 
              onClick={() => setStep(3)} 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={!requestData.personalInfo.fullName || !requestData.personalInfo.phone || !requestData.personalInfo.nationalCode || !requestData.personalInfo.city || !requestData.addressInfo.neighborhood || !requestData.addressInfo.street || !requestData.addressInfo.plaque}
            >
              ادامه
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && selectedPackage && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">تایید درخواست نمونه‌گیری</h3>
          
          <Card className="p-6 border-0 shadow-lg rounded-xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">نوع آزمایش:</span>
                <span className="font-semibold">{selectedPackage.title}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">نام و نام خانوادگی:</span>
                <span className="font-semibold">{requestData.personalInfo.fullName}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">شماره تماس:</span>
                <span className="font-semibold">{requestData.personalInfo.phone}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">آدرس:</span>
                <span className="font-semibold text-left">
                  {requestData.personalInfo.city}، {requestData.addressInfo.neighborhood}، {requestData.addressInfo.street}، پلاک {requestData.addressInfo.plaque}
                  {requestData.addressInfo.unit && `، واحد ${requestData.addressInfo.unit}`}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">بیمه:</span>
                <span className="font-semibold">
                  {requestData.personalInfo.hasBasicInsurance === 'yes' ? requestData.personalInfo.basicInsurance : 'ندارد'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">نسخه پزشک:</span>
                <span className="font-semibold">
                  {requestData.prescriptionInfo.hasPrescription === 'yes' ? 
                    (requestData.prescriptionInfo.prescriptionType === 'electronic' ? 'الکترونیک' : 'کاغذی') : 
                    'ندارد'}
                </span>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
              مرحله قبل
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  در حال ثبت...
                </>
              ) : (
                'تایید و ثبت درخواست'
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Success */}
      {step === 4 && (
        <Card className="p-8 border-0 shadow-xl rounded-2xl text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-4">درخواست با موفقیت ثبت شد!</h3>
          <p className="text-gray-600 mb-6">
            درخواست نمونه‌گیری شما ثبت شد. تکنسین ما در زمان مناسب با شما تماس خواهد گرفت.
          </p>
          <div className="bg-blue-50 p-4 rounded-xl mb-6">
            <p className="text-blue-800 text-sm">
              <strong>یادآوری:</strong> لطفاً در زمان تعیین شده در محل حضور داشته باشید و اگر نسخه کاغذی دارید، آن را آماده نگه دارید.
            </p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => {
              setStep(1);
              setRequestData({
                selectedCategory: 'general',
                selectedPackageIndex: null,
                personalInfo: {
                  fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
                  phone: user?.phone || '',
                  phoneVerified: !!user?.phone,
                  nationalCode: user?.nationalCode || '',
                  birthDate: user?.birthDate || '',
                  gender: user?.gender || '',
                  city: '',
                  hasBasicInsurance: '',
                  basicInsurance: '',
                  complementaryInsurance: ''
                },
                addressInfo: {
                  neighborhood: '',
                  street: '',
                  plaque: '',
                  unit: '',
                  location: { lat: null, lng: null }
                },
                prescriptionInfo: {
                  hasPrescription: '',
                  prescriptionType: '',
                  ePrescriptionCode: '',
                  prescriptionFiles: []
                },
                notes: ''
              });
            }} className="bg-green-600 hover:bg-green-700">
              درخواست جدید
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              بازگشت به پنل
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default RequestSamplingForm;