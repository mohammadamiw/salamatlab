import React, { useMemo, useState, useCallback } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedReveal from '@/components/EnhancedReveal';
import Reveal from '@/components/Reveal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import { HeartPulse, Ribbon, Stethoscope, FlaskConical, MapPin, ShieldCheck, FileBadge2, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import MapPicker from '../components/MapPicker';
import PhoneOtp from '../components/PhoneOtp';
import { getApiBase } from '../lib/apiBase';
import { submitHomeSamplingRequest } from '../services/sampling';
import { sendSms } from '../services/sms';
import { useToast } from '@/components/ui/use-toast';

// Types
interface CheckupPackage {
  title: string;
  subtitle?: string;
  description: string;
  features: string[];
  color: string;
  popular?: boolean;
}

interface Location {
  lat: number | null;
  lng: number | null;
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
  location: Location;
}

interface PrescriptionInfo {
  hasPrescription: 'yes' | 'no' | '';
  prescriptionType: 'electronic' | 'paper' | '';
  ePrescriptionCode: string;
  prescriptionFiles: File[];
}

interface FormState {
  step: number;
  isSubmitting: boolean;
  selectedCategory: CategoryKey;
  selectedPackageIndex: number | null;
  personalInfo: PersonalInfo;
  addressInfo: AddressInfo;
  prescriptionInfo: PrescriptionInfo;
}

type CategoryKey = 'general' | 'specialized' | 'women' | 'cancer';

// Constants
const iconGradients: Record<string, string> = {
  general: 'from-blue-500 to-indigo-600',
  specialized: 'from-emerald-500 to-green-600',
  women: 'from-pink-500 to-rose-600',
  cancer: 'from-violet-500 to-purple-600'
};

const categoryIcons: Record<string, React.ComponentType<any>> = {
  general: Stethoscope,
  specialized: FlaskConical,
  women: HeartPulse,
  cancer: Ribbon
};

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

// Initial state
const initialPersonalInfo: PersonalInfo = {
  fullName: '',
  phone: '',
  phoneVerified: false,
  nationalCode: '',
  birthDate: '',
  gender: '',
  city: '',
  hasBasicInsurance: '',
  basicInsurance: '',
  complementaryInsurance: ''
};

const initialAddressInfo: AddressInfo = {
  neighborhood: '',
  street: '',
  plaque: '',
  unit: '',
  location: { lat: null, lng: null }
};

const initialPrescriptionInfo: PrescriptionInfo = {
  hasPrescription: '',
  prescriptionType: '',
  ePrescriptionCode: '',
  prescriptionFiles: []
};

// Checkup packages data
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
        color: 'from-primary/10 to-primary/20',
        popular: true
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
        features: ['LH، FSH، PRL', 'Testosterone، Estradiol', 'DHEA-S، 17OH Progesterone', 'Progesterone، Karyotype'],
        color: 'from-pink-50 to-pink-100'
      },
      {
        title: 'پنل تخمدان پلی‌کیستیک (PCOS)',
        description: 'تشخیص PCOS و بررسی آندروژن‌ها',
        features: ['LH، FSH، PRL', 'Testosterone، F.Testosterone، AMH', '17OH Progesterone، Estradiol', 'DHEA-S، Androstenedione'],
        color: 'from-purple-50 to-purple-100',
        popular: true
      },
      {
        title: 'پنل هیپرآندروژنیسم',
        subtitle: '(پر مویی)',
        description: 'برای زنان با پُر مویی، آکنه شدید',
        features: ['Androstenedione، DHEA-S', '17OH Progesterone، AMH', 'Testosterone، F.Testosterone، DHT'],
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
        features: ['CEA (آنتی‌ژن کرسینواپریونیک)', 'CA 125', 'CA 15.3', 'HER2'],
        color: 'from-rose-50 to-rose-100'
      },
      {
        title: 'پنل سرطان تخمدان',
        subtitle: '(زنان)',
        description: 'غربالگری تخصصی سرطان تخمدان',
        features: ['CEA، CA 125', 'HE4 (پروتئین اپیدیدیم انسان)', 'Roma Factor', 'B.HCG'],
        color: 'from-violet-50 to-violet-100'
      },
      {
        title: 'پنل سرطان پروستات',
        subtitle: '(مردان)',
        description: 'غربالگری سرطان پروستات',
        features: ['PSA (آنتی‌ژن اختصاصی پروستات)', 'F.PSA (PSA آزاد)', 'F.PSA / PSA (نسبت PSA آزاد)'],
        color: 'from-blue-50 to-blue-100'
      },
      {
        title: 'پنل سرطان روده',
        subtitle: '(زن و مرد)',
        description: 'غربالگری سرطان کولورکتال',
        features: ['CEA', 'CA 19.9', 'OB (Stool) - خون مخفی مدفوع'],
        color: 'from-amber-50 to-amber-100'
      }
    ]
  }
};

// Helper Components
const PersonalInfoForm: React.FC<{
  personalInfo: PersonalInfo;
  onUpdate: (updates: Partial<PersonalInfo>) => void;
  showInsurance?: boolean;
}> = ({ personalInfo, onUpdate, showInsurance = true }) => (
  <div className="grid md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <Label htmlFor="fullName">نام و نام خانوادگی *</Label>
      <Input 
        id="fullName" 
        value={personalInfo.fullName} 
        onChange={(e) => onUpdate({ fullName: e.target.value })} 
        placeholder="مثال: علی رضایی" 
        required 
      />
    </div>
    
    <PhoneOtp
      label="شماره تماس *"
      phone={personalInfo.phone}
      onChangePhone={(phone) => onUpdate({ phone, phoneVerified: false })}
      onVerified={() => onUpdate({ phoneVerified: true })}
    />
    
    <div className="space-y-2">
      <Label htmlFor="nationalCode">کد ملی *</Label>
      <Input 
        id="nationalCode" 
        value={personalInfo.nationalCode} 
        onChange={(e) => onUpdate({ nationalCode: e.target.value.replace(/\D/g, '').slice(0, 10) })} 
        placeholder="۱۰ رقم" 
        required 
      />
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="birthDate">تاریخ تولد (شمسی) *</Label>
      <DatePicker
        calendar={persian}
        locale={persian_fa}
        value={personalInfo.birthDate || undefined}
        onChange={(date: any) => {
          try {
            if (date && typeof date === 'object' && date.isValid) {
              onUpdate({ birthDate: date.format('YYYY/MM/DD') });
            } else if (Array.isArray(date) && date.length > 0 && date[0]?.isValid) {
              onUpdate({ birthDate: date[0].format('YYYY/MM/DD') });
            } else {
              onUpdate({ birthDate: '' });
            }
          } catch {
            onUpdate({ birthDate: '' });
          }
        }}
        inputClass="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-primary bg-white"
        placeholder="تاریخ تولد را انتخاب کنید"
        calendarPosition="bottom-right"
        format="YYYY/MM/DD"
      />
      {personalInfo.birthDate && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          تاریخ انتخابی: {personalInfo.birthDate}
        </div>
      )}
    </div>
    
    <div className="space-y-2">
      <Label>جنسیت *</Label>
      <Select value={personalInfo.gender} onValueChange={(gender: any) => onUpdate({ gender })}>
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
      <Select value={personalInfo.city} onValueChange={(city: any) => onUpdate({ city })}>
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
    
    {showInsurance && (
      <>
        <div className="space-y-2">
          <Label>بیمه پایه دارید؟ *</Label>
          <Select value={personalInfo.hasBasicInsurance} onValueChange={(hasBasicInsurance: any) => onUpdate({ hasBasicInsurance })}>
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
        
        {personalInfo.hasBasicInsurance === 'yes' && (
          <div className="space-y-2">
            <Label>نوع بیمه پایه *</Label>
            <Select value={personalInfo.basicInsurance} onValueChange={(basicInsurance: any) => onUpdate({ basicInsurance })}>
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
          <Select value={personalInfo.complementaryInsurance} onValueChange={(complementaryInsurance: any) => onUpdate({ complementaryInsurance })}>
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
      </>
    )}
  </div>
);

// Main Component
const SampleAtHome: React.FC = () => {
  const { toast } = useToast();
  
  const [formState, setFormState] = useState<FormState>({
    step: 1,
    isSubmitting: false,
    selectedCategory: 'general',
    selectedPackageIndex: null,
    personalInfo: initialPersonalInfo,
    addressInfo: initialAddressInfo,
    prescriptionInfo: initialPrescriptionInfo
  });

  // Backward compatibility - temporary fix
  const { step } = formState;
  const { hasPrescription, prescriptionType, ePrescriptionCode, prescriptionFiles } = formState.prescriptionInfo;
  const { fullName, phone, phoneVerified, nationalCode, birthDate, gender, city, hasBasicInsurance, basicInsurance, complementaryInsurance } = formState.personalInfo;
  const { neighborhood, street, plaque, unit, location } = formState.addressInfo;
  const selectedCategory = formState.selectedCategory;
  const selectedPackageIndex = formState.selectedPackageIndex;

  // Legacy setters for compatibility
  const setStep = (newStep: number) => setFormState(prev => ({ ...prev, step: newStep }));
  const setHasPrescription = (value: 'yes' | 'no' | '') => setFormState(prev => ({ 
    ...prev, 
    prescriptionInfo: { ...prev.prescriptionInfo, hasPrescription: value }
  }));
  const setPrescriptionType = (value: 'electronic' | 'paper' | '') => setFormState(prev => ({ 
    ...prev, 
    prescriptionInfo: { ...prev.prescriptionInfo, prescriptionType: value }
  }));
  const setEPrescriptionCode = (value: string) => setFormState(prev => ({ 
    ...prev, 
    prescriptionInfo: { ...prev.prescriptionInfo, ePrescriptionCode: value }
  }));
  const setPrescriptionFiles = (files: File[]) => setFormState(prev => ({ 
    ...prev, 
    prescriptionInfo: { ...prev.prescriptionInfo, prescriptionFiles: files }
  }));
  const setSelectedCategory = (category: CategoryKey) => setFormState(prev => ({ ...prev, selectedCategory: category, selectedPackageIndex: null }));
  const setSelectedPackageIndex = (index: number | null) => setFormState(prev => ({ ...prev, selectedPackageIndex: index }));
  const setFullName = (value: string) => setFormState(prev => ({ 
    ...prev, 
    personalInfo: { ...prev.personalInfo, fullName: value }
  }));
  const setPhone = (value: string) => setFormState(prev => ({ 
    ...prev, 
    personalInfo: { ...prev.personalInfo, phone: value }
  }));
  const setPhoneVerified = (value: boolean) => setFormState(prev => ({ 
    ...prev, 
    personalInfo: { ...prev.personalInfo, phoneVerified: value }
  }));
  const setNationalCode = (value: string) => setFormState(prev => ({ 
    ...prev, 
    personalInfo: { ...prev.personalInfo, nationalCode: value }
  }));
  const setBirthDate = (value: string) => setFormState(prev => ({ 
    ...prev, 
    personalInfo: { ...prev.personalInfo, birthDate: value }
  }));
  const setGender = (value: 'male' | 'female' | '') => setFormState(prev => ({ 
    ...prev, 
    personalInfo: { ...prev.personalInfo, gender: value }
  }));
  const setCity = (value: string) => setFormState(prev => ({ 
    ...prev, 
    personalInfo: { ...prev.personalInfo, city: value }
  }));
  const setHasBasicInsurance = (value: 'yes' | 'no' | '') => setFormState(prev => ({ 
    ...prev, 
    personalInfo: { ...prev.personalInfo, hasBasicInsurance: value }
  }));
  const setBasicInsurance = (value: string) => setFormState(prev => ({ 
    ...prev, 
    personalInfo: { ...prev.personalInfo, basicInsurance: value }
  }));
  const setComplementaryInsurance = (value: string) => setFormState(prev => ({ 
    ...prev, 
    personalInfo: { ...prev.personalInfo, complementaryInsurance: value }
  }));
  const setNeighborhood = (value: string) => setFormState(prev => ({ 
    ...prev, 
    addressInfo: { ...prev.addressInfo, neighborhood: value }
  }));
  const setStreet = (value: string) => setFormState(prev => ({ 
    ...prev, 
    addressInfo: { ...prev.addressInfo, street: value }
  }));
  const setPlaque = (value: string) => setFormState(prev => ({ 
    ...prev, 
    addressInfo: { ...prev.addressInfo, plaque: value }
  }));
  const setUnit = (value: string) => setFormState(prev => ({ 
    ...prev, 
    addressInfo: { ...prev.addressInfo, unit: value }
  }));
  const setLocation = (loc: Location) => setFormState(prev => ({ 
    ...prev, 
    addressInfo: { ...prev.addressInfo, location: loc }
  }));

  // Memoized computed values
  const selectedPackage = useMemo(() => {
    if (formState.prescriptionInfo.hasPrescription !== 'no' || formState.selectedPackageIndex === null) {
      return null;
    }
    return checkupCategories[formState.selectedCategory].packages[formState.selectedPackageIndex] || null;
  }, [formState.prescriptionInfo.hasPrescription, formState.selectedCategory, formState.selectedPackageIndex]);

  const canGoNextFromStep1 = useMemo(() => {
    if (hasPrescription === '') return false;
    if (hasPrescription === 'no') return selectedPackage !== null;
    // has prescription: require type + payload + minimal personal info (we check again on click)
    const hasPrescriptionInfo =
      (prescriptionType === 'electronic' && ePrescriptionCode.trim().length > 0) ||
      (prescriptionType === 'paper' && prescriptionFiles.length > 0);
    const hasPersonalBasics = fullName && phone && phoneVerified && nationalCode && birthDate && gender && city && hasBasicInsurance;
    if (hasBasicInsurance === 'yes') {
      return hasPrescriptionInfo && hasPersonalBasics && !!basicInsurance;
    }
    return hasPrescriptionInfo && hasPersonalBasics;
  }, [hasPrescription, selectedPackage, prescriptionType, ePrescriptionCode, prescriptionFiles, fullName, phone, phoneVerified, nationalCode, birthDate, gender, city, hasBasicInsurance, basicInsurance]);



  const handleSubmit = async () => {
    // Enhanced validation
    if (!phoneVerified) {
      toast({
        title: "خطا در اعتبارسنجی",
        description: "لطفاً شماره تلفن خود را تأیید کنید.",
        variant: "destructive",
      });
      return;
    }

    if (!neighborhood.trim() || !street.trim() || !plaque.trim()) {
      toast({
        title: "اطلاعات ناقص",
        description: "لطفاً آدرس کامل را وارد کنید.",
        variant: "destructive",
      });
      return;
    }

    if (!location.lat || !location.lng) {
      toast({
        title: "موقعیت جغرافیایی",
        description: "لطفاً موقعیت خود را روی نقشه انتخاب کنید.",
        variant: "destructive",
      });
      return;
    }

    setFormState(prev => ({ ...prev, isSubmitting: true }));

    try {
      // combine address
      const address = `شهر: ${city}\nمحله: ${neighborhood}\nخیابان و کوچه: ${street}\nپلاک: ${plaque}${unit ? `\nواحد: ${unit}` : ''}${location.lat && location.lng ? `\nلوکیشن: ${location.lat},${location.lng}` : ''}`;
      const title = hasPrescription === 'no' && selectedPackage ? `نمونه‌گیری در محل - ${selectedPackage.title}` : 'نمونه‌گیری در محل با نسخه پزشک';

      // Upload prescription files if provided
      let prescriptionFilesUrls: string[] = [];
      if (hasPrescription === 'yes' && prescriptionType === 'paper' && prescriptionFiles.length > 0) {
        try {
          const form = new FormData();
          prescriptionFiles.forEach((f) => form.append('files[]', f));
          const res = await fetch(`${getApiBase()}/api/upload.php`, { method: 'POST', body: form });
          const json = await res.json().catch(() => ({}));
          if (res.ok && Array.isArray(json.urls)) prescriptionFilesUrls = json.urls as string[];
        } catch (error) {
          console.warn('File upload failed:', error);
        }
      }

      const payload: any = {
        type: 'sampling',
        title,
        fullName,
        phone,
        nationalCode,
        birthDate,
        gender,
        city,
        hasBasicInsurance,
        basicInsurance: hasBasicInsurance === 'yes' ? basicInsurance : '',
        complementaryInsurance,
        address,
        neighborhood,
        street,
        plaque,
        unit,
        locationLat: location.lat,
        locationLng: location.lng,
        prescriptionFiles: prescriptionFilesUrls,
        notes: `نمونه‌گیری در محل\n${address}${hasPrescription === 'yes' ? (prescriptionType === 'electronic' ? `\nنسخه الکترونیک: ${ePrescriptionCode}` : `\nنسخه کاغذی: ${prescriptionFiles.map(f=>f.name).join(', ')}`) : ''}`
      };

      // Try external API first, then fallback to local
      let success = false;
      
      if (import.meta.env.VITE_SAMPLING_API_URL) {
        try {
          const response = await submitHomeSamplingRequest(payload);
          if (response.ok) {
            success = true;
          }
        } catch (error) {
          console.warn('External API failed, trying local fallback:', error);
        }
      }

      // Fallback to local API
      if (!success) {
        const response = await fetch(`${getApiBase()}/api/booking.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        const result = await response.json();
        success = response.ok && result.success;
        
        if (!success) {
          throw new Error(result.error || 'خطا در ارسال درخواست');
        }
      }

      // Send confirmation SMS
      if (success && phone) {
        try {
          const customerMessage = `آقا/ خانم ${fullName.trim()} درخواست نمونه گیری در منزل شما ثبت گردید. کارشناسان ما در اولین فرصت با شما تماس خواهند گرفت.\nآزمایشگاه سلامت`;
          await sendSms(phone, customerMessage);
          
          // Notify operations team
          const opsPhone = '09215679903';
          const opsMessage = [
            'درخواست جدید نمونه‌گیری در منزل',
            `نام: ${fullName.trim()}`,
            `تلفن: ${phone}`,
            `شهر: ${city}`,
            location.lat && location.lng && 
              `لوکیشن: https://maps.google.com/?q=${location.lat},${location.lng}`
          ].filter(Boolean).join('\n');
          
          await sendSms(opsPhone, opsMessage);
        } catch (error) {
          console.warn('SMS sending failed:', error);
        }
      }

      toast({
        title: "درخواست با موفقیت ارسال شد",
        description: "همکاران ما در اولین فرصت با شما تماس خواهند گرفت.",
        duration: 5000,
      });

      // Reset form
      setFormState({
        step: 1,
        isSubmitting: false,
        selectedCategory: 'general',
        selectedPackageIndex: null,
        personalInfo: initialPersonalInfo,
        addressInfo: initialAddressInfo,
        prescriptionInfo: initialPrescriptionInfo
      });

    } catch (error) {
      console.error('Submission failed:', error);
      toast({
        title: "خطا در ارسال درخواست",
        description: error instanceof Error ? error.message : "لطفاً دوباره تلاش کنید.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setFormState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-24">
        <EnhancedReveal direction="up" delay={120}>
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">خانه</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>نمونه‌گیری در محل</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </EnhancedReveal>

        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-600 text-white p-8 md:p-12 mb-12 shadow-2xl">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">نمونه‌گیری در محل</h1>
              <p className="text-lg md:text-xl text-white/90 max-w-3xl">در منزل یا محل کارتان، با تجهیزات استریل و کادر مجرب. کافیست درخواست دهید.</p>
            </div>
          </div>
        </Reveal>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2, 3].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300
                ${step > stepNum 
                  ? 'bg-green-600 text-white' 
                  : step === stepNum 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }
              `}>
                {step > stepNum ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span>{stepNum}</span>
                )}
              </div>
              {stepNum < 3 && (
                <div className={`
                  w-16 h-1 mx-2 transition-all duration-300
                  ${step > stepNum ? 'bg-green-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>

        {step === 1 && (
          <section>
            <div className="grid md:grid-cols-12 gap-6 items-stretch">
              <Card className="md:col-span-8 p-6 md:p-8 rounded-3xl border border-blue-100 bg-white/90 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <FileBadge2 className="text-blue-600" />
                  <h2 className="text-xl font-bold text-gray-800">نسخه پزشک دارید؟</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <button onClick={() => setHasPrescription('yes')} className={`p-4 rounded-2xl border text-right transition-all ${hasPrescription === 'yes' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                    <div className="font-bold mb-1">بله، نسخه دارم</div>
                    <div className="text-sm text-gray-600">عکس نسخه را آماده دارید؛ در تماس تلفنی ارسال می‌شود.</div>
                  </button>
                  <button onClick={() => setHasPrescription('no')} className={`p-4 rounded-2xl border text-right transition-all ${hasPrescription === 'no' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                    <div className="font-bold mb-1">خیر، نسخه ندارم</div>
                    <div className="text-sm text-gray-600">یکی از پنل‌های چکاپ ما را انتخاب کنید.</div>
                  </button>
                </div>

                {hasPrescription === 'no' && (
                  <div className="mt-8">
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                      <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-4 py-2">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="font-bold">با بیمه تکمیلی: رایگان</span>
                      </div>
                      <div className="text-sm text-slate-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">
                        قیمت خدمات بدون بیمه تکمیلی حدودی بوده و پس از تماس همکاران اعلام می‌شود
                      </div>
                    </div>

                    <Tabs value={selectedCategory} onValueChange={(v: any) => setSelectedCategory(v)} className="max-w-7xl mx-auto">
                      <TabsList className="grid w-full grid-cols-4 mb-6 bg-white/80 backdrop-blur-sm p-1 rounded-full border border-gray-200 shadow-sm">
                        <TabsTrigger value="general" className="text-sm rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white">عمومی</TabsTrigger>
                        <TabsTrigger value="specialized" className="text-sm rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white">تخصصی</TabsTrigger>
                        <TabsTrigger value="women" className="text-sm rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white">زنان</TabsTrigger>
                        <TabsTrigger value="cancer" className="text-sm rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white">غربالگری سرطان</TabsTrigger>
                      </TabsList>

                      {(Object.keys(checkupCategories) as CategoryKey[]).map((key) => {
                        const Icon = categoryIcons[key];
                        const iconGradient = iconGradients[key];
                        const cat = checkupCategories[key];
                        return (
                          <TabsContent key={key} value={key}>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {cat.packages.map((pkg, index) => (
                                <Card key={index} className={`group relative p-6 rounded-3xl border ${pkg.popular ? 'border-blue-300 bg-blue-50/60' : 'border-blue-100 bg-white/90'} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 flex flex-col`}>
                                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${pkg.color}`} />
                                  <div className="relative z-10">
                                    <div className="flex items-start justify-between mb-3">
                                      <h3 className="text-lg font-extrabold text-gray-800 leading-tight">{pkg.title}</h3>
                                    </div>
                                    <div className="mb-3">
                                      <div className={`w-12 h-12 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center shadow-md`}>
                                        <Icon className="w-6 h-6 text-white" />
                                      </div>
                                    </div>
                                    {pkg.subtitle && (
                                      <div className="mb-2">
                                        <span className="inline-block text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">{pkg.subtitle}</span>
                                      </div>
                                    )}
                                    <p className="text-gray-600 text-sm leading-relaxed mb-3">{pkg.description}</p>
                                    <ul className="space-y-2 mb-4">
                                      {pkg.features.map((f, i) => (
                                        <li key={i} className="flex items-start">
                                          <svg className="w-4 h-4 text-blue-600 mt-0.5 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                          <span className="text-gray-700 text-xs leading-relaxed">{f}</span>
                                        </li>
                                      ))}
                                    </ul>
                                    <Button onClick={() => setSelectedPackageIndex(index)} className={`w-full ${selectedPackageIndex === index ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white rounded-xl h-10`}>{selectedPackageIndex === index ? 'انتخاب شد' : 'انتخاب این پنل'}</Button>
                                  </div>
                                </Card>
                              ))}
                            </div>
                          </TabsContent>
                        );
                      })}
                    </Tabs>
                  </div>
                )}

                {hasPrescription === 'yes' && (
                  <div className="mt-8 space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <button onClick={() => setPrescriptionType('electronic')} className={`p-4 rounded-2xl border text-right transition-all ${prescriptionType === 'electronic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                        <div className="font-bold mb-1">نسخه الکترونیک دارم</div>
                        <div className="text-sm text-gray-600">کد رهگیری نسخه الکترونیک را وارد کنید.</div>
                      </button>
                      <button onClick={() => setPrescriptionType('paper')} className={`p-4 rounded-2xl border text-right transition-all ${prescriptionType === 'paper' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-200'}`}>
                        <div className="font-bold mb-1">نسخه کاغذی دارم</div>
                        <div className="text-sm text-gray-600">عکس نسخه را بارگذاری کنید.</div>
                      </button>
                    </div>

                    {prescriptionType === 'electronic' && (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="eCode">کد نسخه الکترونیک</Label>
                          <Input id="eCode" value={ePrescriptionCode} onChange={(e) => setEPrescriptionCode(e.target.value)} placeholder="مثال: 1234-5678-90" />
                        </div>
                      </div>
                    )}

                    {prescriptionType === 'paper' && (
                      <div className="space-y-3">
                        <Label>آپلود نسخه کاغذی</Label>
                        <input
                          type="file"
                          multiple
                          accept="image/*,application/pdf"
                          onChange={(e) => setPrescriptionFiles(Array.from(e.target.files || []))}
                        />
                        {prescriptionFiles.length > 0 && (
                          <div className="text-xs text-gray-600">
                            فایل‌های انتخاب‌شده: {prescriptionFiles.map(f => f.name).join(', ')}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="pt-2">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">اطلاعات ارتباطی</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="fullName2">نام و نام خانوادگی</Label>
                          <Input id="fullName2" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="مثال: علی رضایی" required />
                        </div>
                        <PhoneOtp
                          label="شماره تماس"
                          phone={phone}
                          onChangePhone={(v) => { setPhone(v); setPhoneVerified(false); }}
                          onVerified={() => setPhoneVerified(true)}
                        />
                        <div className="space-y-2">
                          <Label htmlFor="nationalCode2">کد ملی</Label>
                          <Input id="nationalCode2" value={nationalCode} onChange={(e) => setNationalCode(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="۱۰ رقم" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="birthDate2">تاریخ تولد (شمسی)</Label>
                          <DatePicker
                            calendar={persian}
                            locale={persian_fa}
                            value={birthDate || undefined}
                            onChange={(date: any) => {
                              try {
                                if (date && typeof date === 'object' && date.isValid) {
                                  const formatted = date.format('YYYY/MM/DD');
                                  setBirthDate(formatted);
                                } else if (Array.isArray(date) && date.length > 0) {
                                  const firstDate = date[0];
                                  if (firstDate && firstDate.isValid) {
                                    const formatted = firstDate.format('YYYY/MM/DD');
                                    setBirthDate(formatted);
                                  }
                                } else {
                                  setBirthDate('');
                                }
                              } catch (err) {
                                setBirthDate('');
                              }
                            }}
                            inputClass="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-primary bg-white"
                            placeholder="تاریخ تولد را انتخاب کنید"
                            calendarPosition="bottom-right"
                            format="YYYY/MM/DD"
                          />
                          {birthDate && <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">تاریخ انتخابی: {birthDate}</div>}
                        </div>
                        <div className="space-y-2">
                          <Label>جنسیت</Label>
                          <Select value={gender} onValueChange={(v: any) => setGender(v)}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="male">مرد</SelectItem>
                                <SelectItem value="female">زن</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>شهر</Label>
                          <Select value={city} onValueChange={(v: any) => setCity(v)}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="شهرقدس">شهرقدس</SelectItem>
                                <SelectItem value="شهریار">شهریار</SelectItem>
                                <SelectItem value="باغستان">باغستان</SelectItem>
                                <SelectItem value="اندیشه">اندیشه</SelectItem>
                                <SelectItem value="گرمدره">گرمدره</SelectItem>
                                <SelectItem value="وردآورد">وردآورد</SelectItem>
                                <SelectItem value="ملارد">ملارد</SelectItem>
                                <SelectItem value="کرج">کرج</SelectItem>
                                <SelectItem value="تهران">تهران</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>بیمه پایه دارید؟</Label>
                          <Select value={hasBasicInsurance} onValueChange={(v: any) => setHasBasicInsurance(v)}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="yes">بله</SelectItem>
                                <SelectItem value="no">خیر</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        {hasBasicInsurance === 'yes' && (
                          <>
                            <div className="space-y-2">
                              <Label>نوع بیمه پایه</Label>
                              <Select value={basicInsurance} onValueChange={(v: any) => setBasicInsurance(v)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="تامین اجتماعی">تامین اجتماعی</SelectItem>
                                    <SelectItem value="سلامت">سلامت</SelectItem>
                                    <SelectItem value="نیروهای مسلح">نیروهای مسلح</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>بیمه تکمیلی</Label>
                              <Select value={complementaryInsurance} onValueChange={(v: any) => setComplementaryInsurance(v)}>
                                <SelectTrigger className="w-full"><SelectValue placeholder="انتخاب کنید (اختیاری)" /></SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectItem value="بیمه آسیا">بیمه آسیا</SelectItem>
                                    <SelectItem value="بیمه البرز">بیمه البرز</SelectItem>
                                    <SelectItem value="بیمه دانا">بیمه دانا</SelectItem>
                                    <SelectItem value="بیمه پاسارگاد">بیمه پاسارگاد</SelectItem>
                                    <SelectItem value="بیمه سامان">بیمه سامان</SelectItem>
                                    <SelectItem value="بیمه پارسیان">بیمه پارسیان</SelectItem>
                                    <SelectItem value="بیمه کارآفرین">بیمه کارآفرین</SelectItem>
                                    <SelectItem value="بیمه رازی">بیمه رازی</SelectItem>
                                    <SelectItem value="بیمه تعاون">بیمه تعاون</SelectItem>
                                    <SelectItem value="بیمه کوثر">بیمه کوثر</SelectItem>
                                    <SelectItem value="بیمه معلم">بیمه معلم</SelectItem>
                                    <SelectItem value="بیمه دی">بیمه دی</SelectItem>
                                    <SelectItem value="بیمه ملت">بیمه ملت</SelectItem>
                                    <SelectItem value="بیمه نوین">بیمه نوین</SelectItem>
                                    <SelectItem value="بیمه ما">بیمه ما</SelectItem>
                                    <SelectItem value="بیمه سینا">بیمه سینا</SelectItem>
                                    <SelectItem value="بیمه آرمان">بیمه آرمان</SelectItem>
                                    <SelectItem value="بیمه امید">بیمه امید</SelectItem>
                                    <SelectItem value="بیمه حکمت صبا">بیمه حکمت صبا</SelectItem>
                                    <SelectItem value="بیمه زندگی خاورمیانه">بیمه زندگی خاورمیانه</SelectItem>
                                    <SelectItem value="بیمه سرمد">بیمه سرمد</SelectItem>
                                    <SelectItem value="بیمه تجارت نو">بیمه تجارت نو</SelectItem>
                                    <SelectItem value="بیمه حافظ">بیمه حافظ</SelectItem>
                                    <SelectItem value="بیمه آسماری">بیمه آسماری</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Card>

              <div className="md:col-span-4">
                <Card className="p-6 rounded-3xl border border-blue-100 bg-white shadow-lg h-fit sticky top-32">
                  <div className="flex items-center gap-2 text-blue-700 mb-4">
                    <MapPin className="w-5 h-5" />
                    <div className="font-bold">مراحل درخواست</div>
                  </div>
                  <ol className="text-sm text-gray-700 space-y-3">
                    <li className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                      step === 1 ? 'bg-blue-50 text-blue-700 font-medium' : ''
                    }`}>
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        step > 1 ? 'bg-green-600 text-white' : step === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                      }`}>
                        {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : 1}
                      </span>
                      انتخاب نوع درخواست (با/بدون نسخه)
                    </li>
                    <li className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                      step === 2 ? 'bg-blue-50 text-blue-700 font-medium' : ''
                    }`}>
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        step > 2 ? 'bg-green-600 text-white' : step === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                      }`}>
                        {step > 2 ? <CheckCircle2 className="w-4 h-4" /> : 2}
                      </span>
                      تکمیل اطلاعات شخصی
                    </li>
                    <li className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                      step === 3 ? 'bg-blue-50 text-blue-700 font-medium' : ''
                    }`}>
                      <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        step === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                      }`}>
                        {3}
                      </span>
                      انتخاب آدرس از روی نقشه
                    </li>
                  </ol>
                  
                  {selectedPackage && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-bold text-green-800 mb-2">پنل انتخابی:</div>
                      <div className="text-sm text-green-700">{selectedPackage.title}</div>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button disabled={!canGoNextFromStep1} onClick={() => setStep(hasPrescription === 'yes' ? 3 : 2)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">مرحله بعد</Button>
            </div>
          </section>
        )}

        {step === 2 && hasPrescription === 'no' && (
          <section>
            <Card className="p-6 md:p-8 rounded-3xl border border-blue-100 bg-white/90 shadow-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-6">اطلاعات ارتباطی</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">نام و نام خانوادگی</Label>
                  <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="مثال: علی رضایی" required />
                </div>
                <PhoneOtp
                  label="شماره تماس"
                  phone={phone}
                  onChangePhone={(v) => { setPhone(v); setPhoneVerified(false); }}
                  onVerified={() => setPhoneVerified(true)}
                />
                <div className="space-y-2">
                  <Label htmlFor="nationalCode">کد ملی</Label>
                  <Input id="nationalCode" value={nationalCode} onChange={(e) => setNationalCode(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="۱۰ رقم" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthDate">تاریخ تولد (شمسی)</Label>
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={birthDate || undefined}
                    onChange={(date: any) => {
                      try {
                        if (date && typeof date === 'object' && date.isValid) {
                          const formatted = date.format('YYYY/MM/DD');
                          setBirthDate(formatted);
                        } else if (Array.isArray(date) && date.length > 0) {
                          const firstDate = date[0];
                          if (firstDate && firstDate.isValid) {
                            const formatted = firstDate.format('YYYY/MM/DD');
                            setBirthDate(formatted);
                          }
                        } else {
                          setBirthDate('');
                        }
                      } catch (err) {
                        setBirthDate('');
                      }
                    }}
                    inputClass="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-primary bg-white"
                    placeholder="تاریخ تولد را انتخاب کنید"
                    calendarPosition="bottom-right"
                    format="YYYY/MM/DD"
                  />
                  {birthDate && <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">تاریخ انتخابی: {birthDate}</div>}
                </div>
                <div className="space-y-2">
                  <Label>جنسیت</Label>
                  <Select value={gender} onValueChange={(v: any) => setGender(v)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="male">مرد</SelectItem>
                        <SelectItem value="female">زن</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>شهر</Label>
                  <Select value={city} onValueChange={(v: any) => setCity(v)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="شهرقدس">شهرقدس</SelectItem>
                        <SelectItem value="شهریار">شهریار</SelectItem>
                        <SelectItem value="باغستان">باغستان</SelectItem>
                        <SelectItem value="اندیشه">اندیشه</SelectItem>
                        <SelectItem value="گرمدره">گرمدره</SelectItem>
                        <SelectItem value="وردآورد">وردآورد</SelectItem>
                        <SelectItem value="ملارد">ملارد</SelectItem>
                        <SelectItem value="کرج">کرج</SelectItem>
                        <SelectItem value="تهران">تهران</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>بیمه پایه دارید؟</Label>
                  <Select value={hasBasicInsurance} onValueChange={(v: any) => setHasBasicInsurance(v)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="yes">بله</SelectItem>
                        <SelectItem value="no">خیر</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                {hasBasicInsurance === 'yes' && (
                  <div className="space-y-2">
                    <Label>نوع بیمه پایه</Label>
                    <Select value={basicInsurance} onValueChange={(v: any) => setBasicInsurance(v)}>
                      <SelectTrigger className="w-full"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="تامین اجتماعی">تامین اجتماعی</SelectItem>
                          <SelectItem value="سلامت">سلامت</SelectItem>
                          <SelectItem value="نیروهای مسلح">نیروهای مسلح</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2">
                  <Label>بیمه تکمیلی (اختیاری)</Label>
                  <Select value={complementaryInsurance} onValueChange={(v: any) => setComplementaryInsurance(v)}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="انتخاب کنید (اختیاری)" /></SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="بیمه آسیا">بیمه آسیا</SelectItem>
                        <SelectItem value="بیمه البرز">بیمه البرز</SelectItem>
                        <SelectItem value="بیمه دانا">بیمه دانا</SelectItem>
                        <SelectItem value="بیمه پاسارگاد">بیمه پاسارگاد</SelectItem>
                        <SelectItem value="بیمه سامان">بیمه سامان</SelectItem>
                        <SelectItem value="بیمه پارسیان">بیمه پارسیان</SelectItem>
                        <SelectItem value="بیمه کارآفرین">بیمه کارآفرین</SelectItem>
                        <SelectItem value="بیمه رازی">بیمه رازی</SelectItem>
                        <SelectItem value="بیمه تعاون">بیمه تعاون</SelectItem>
                        <SelectItem value="بیمه کوثر">بیمه کوثر</SelectItem>
                        <SelectItem value="بیمه معلم">بیمه معلم</SelectItem>
                        <SelectItem value="بیمه دی">بیمه دی</SelectItem>
                        <SelectItem value="بیمه ملت">بیمه ملت</SelectItem>
                        <SelectItem value="بیمه نوین">بیمه نوین</SelectItem>
                        <SelectItem value="بیمه ما">بیمه ما</SelectItem>
                        <SelectItem value="بیمه سینا">بیمه سینا</SelectItem>
                        <SelectItem value="بیمه آرمان">بیمه آرمان</SelectItem>
                        <SelectItem value="بیمه امید">بیمه امید</SelectItem>
                        <SelectItem value="بیمه حکمت صبا">بیمه حکمت صبا</SelectItem>
                        <SelectItem value="بیمه زندگی خاورمیانه">بیمه زندگی خاورمیانه</SelectItem>
                        <SelectItem value="بیمه سرمد">بیمه سرمد</SelectItem>
                        <SelectItem value="بیمه تجارت نو">بیمه تجارت نو</SelectItem>
                        <SelectItem value="بیمه حافظ">بیمه حافظ</SelectItem>
                        <SelectItem value="بیمه آسماری">بیمه آسماری</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">بازگشت</Button>
              <Button disabled={!fullName || !phone || !phoneVerified || !nationalCode || !birthDate || !gender || !city || !hasBasicInsurance || (hasBasicInsurance === 'yes' && !basicInsurance)} onClick={() => setStep(3)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl">مرحله بعد</Button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <div className="grid md:grid-cols-5 gap-6 items-start">
              <Card className="md:col-span-3 p-4 rounded-3xl border border-blue-100 bg-white shadow-lg">
                <MapPicker height={420} onPick={(lat, lng) => setLocation({ lat, lng })} />
              </Card>
              <Card className="md:col-span-2 p-6 rounded-3xl border border-blue-100 bg-white shadow-lg">
                <h3 className="font-bold text-gray-800 mb-4">جزئیات آدرس</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>محله/روستا/دهستان محل سکونت</Label>
                    <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="مثال: شهرک ابریشم" />
                  </div>
                  <div className="space-y-2">
                    <Label>خیابان و کوچه</Label>
                    <Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="مثال: خیابان امام، کوچه یاس" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>پلاک</Label>
                      <Input value={plaque} onChange={(e) => setPlaque(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>واحد</Label>
                      <Input value={unit} onChange={(e) => setUnit(e.target.value)} />
                    </div>
                  </div>
                  <div className="text-xs text-gray-600 bg-amber-50 border border-amber-200 rounded-xl p-3">
                    اگر محله مورد نظرتان در لیست نبود، نزدیک‌ترین گزینه به خودتان را انتخاب کنید.
                  </div>
                  <div className="text-sm text-gray-700">
                    {location.lat && location.lng ? (
                      <div>لوکیشن انتخاب‌شده: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}</div>
                    ) : (
                      <div className="text-gray-500">برای تعیین لوکیشن روی نقشه کلیک کنید</div>
                    )}
                  </div>
                </div>
              </Card>
            </div>
            <div className="mt-6 flex justify-between">
              <Button variant="outline" onClick={() => setStep(hasPrescription === 'yes' ? 1 : 2)} className="rounded-xl px-6">
                بازگشت
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={!phoneVerified || !neighborhood.trim() || !street.trim() || !plaque.trim() || !location.lat || !location.lng || formState.isSubmitting}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 py-3"
              >
                {formState.isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                    ثبت درخواست نمونه‌گیری
                  </>
                )}
              </Button>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SampleAtHome;


