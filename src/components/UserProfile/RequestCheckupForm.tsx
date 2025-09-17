import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  MapPin, 
  CreditCard,
  FileText,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface CheckupPackage {
  id: string;
  title: string;
  subtitle?: string;
  price: string;
  description: string;
  features: string[];
  category: string;
}

interface RequestData {
  packageId: string;
  preferredDate: string;
  preferredTime: string;
  location: 'clinic' | 'home';
  address?: string;
  notes: string;
  emergencyContact: string;
  hasInsurance: boolean;
  insuranceType?: string;
}

const RequestCheckupForm = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'general' | 'specialized' | 'women' | 'cancer'>('general');
  const [selectedPackage, setSelectedPackage] = useState<CheckupPackage | null>(null);
  const [requestData, setRequestData] = useState<RequestData>({
    packageId: '',
    preferredDate: '',
    preferredTime: '',
    location: 'clinic',
    address: (() => {
      const defaultAddress = user?.addresses?.find(addr => addr.isDefault) || user?.addresses?.[0];
      return defaultAddress ? defaultAddress.address : '';
    })(),
    notes: '',
    emergencyContact: user?.phone || '',
    hasInsurance: user?.hasBasicInsurance === 'yes',
    insuranceType: user?.basicInsurance || ''
  });

  // Checkup packages - exactly matching the main Checkups component
  const checkupCategories = {
    general: {
      title: "چکاپ‌های عمومی",
      packages: [
        {
          id: "general_pre_puberty",
          title: "چکاپ عمومی - قبل از بلوغ",
          subtitle: "(دختر و پسر)",
          price: "۸۵۰,۰۰۰",
          description: "بررسی سلامت پایه کودکان و نوجوانان",
          features: [
            "CBC، ESR، CRP",
            "FBS، Urea، Cr، U.A",
            "Ca، P، AST، ALT، ALP، Bili (T&D)",
            "T3، T4، TSH، Anti TPO",
            "Vit D، TIBC، Ferritin، Folic Acid، Vit B12",
            "Serum Albumin & Protein، Cortisol (8–10 AM)",
            "HBs Ag & Ab، U/A & U/C، S/E ×3"
          ],
          popular: false,
          color: "from-blue-50 to-blue-100",
          category: "general"
        },
        {
          id: "general_post_puberty",
          title: "چکاپ عمومی - بعد از بلوغ",
          subtitle: "(زن و مرد)",
          price: "۹۵۰,۰۰۰",
          description: "چکاپ کامل برای بزرگسالان",
          features: [
            "CBC، ESR، CRP، RF",
            "FBS، Urea، Cr، U.A",
            "Ch، TG، HDL، LDL، Na، K، Ca، P",
            "AST، ALT، ALP، Bili (T&D)، Hb A1C",
            "T3، T4، TSH، Anti TPO، Vit D",
            "Fe، TIBC، Ferritin، Serum Albumin & Protein",
            "Cortisol، HBs Ag & Ab، HCV Ab، HIV Ab"
          ],
          popular: true,
          color: "from-primary/10 to-primary/20",
          category: "general"
        }
      ]
    },
    specialized: {
      title: "چکاپ‌های تخصصی",
      packages: [
        {
          id: "growth_disorder",
          title: "پنل بررسی اختلال رشد",
          subtitle: "(قبل از بلوغ)",
          price: "۶۵۰,۰۰۰",
          description: "برای کودکان با رشد کمتر از حد طبیعی",
          features: [
            "GH base (هورمون رشد پایه)",
            "GH after stimulation (تحریک با ورزش یا کلونیدین)",
            "IGF-1 (فاکتور رشد شبه انسولین)"
          ],
          popular: false,
          color: "from-green-50 to-green-100",
          category: "specialized"
        },
        {
          id: "diabetes_panel",
          title: "پنل دیابت",
          subtitle: "(بعد از بلوغ)",
          price: "۷۲۰,۰۰۰",
          description: "برای افراد مشکوک یا مبتلا به دیابت",
          features: [
            "2h.p.p، Hb A1C",
            "C-peptide، Anti GAD",
            "Insulin Ab، Serum fasting",
            "Islet Ab، Urine microalbumin"
          ],
          popular: false,
          color: "from-orange-50 to-orange-100",
          category: "specialized"
        },
        {
          id: "anemia_panel",
          title: "پنل کم‌خونی",
          subtitle: "(بعد از بلوغ)",
          price: "۴۵۰,۰۰۰",
          description: "بررسی کم‌خونی فقر آهن، B12 و فولات",
          features: [
            "Retic count (شمارش رتیکولوسیت)",
            "Fe، TIBC، Ferritin",
            "Folic acid، Vit B12"
          ],
          popular: false,
          color: "from-red-50 to-red-100",
          category: "specialized"
        }
      ]
    },
    women: {
      title: "چکاپ‌های زنان",
      packages: [
        {
          id: "amenorrhea_panel",
          title: "پنل آمنوره",
          subtitle: "(اختلال قاعدگی)",
          price: "۱,۲۵۰,۰۰۰",
          description: "بررسی علت قطع یا بی‌نظمی قاعدگی",
          features: [
            "LH، FSH، PRL",
            "Testosterone، Estradiol",
            "DHEA-S، 17OH Progesterone",
            "Progesterone، Karyotype"
          ],
          popular: false,
          color: "from-pink-50 to-pink-100",
          category: "women"
        },
        {
          id: "pcos_panel",
          title: "پنل تخمدان پلی‌کیستیک (PCOS)",
          subtitle: "",
          price: "۸۹۰,۰۰۰",
          description: "تشخیص PCOS و بررسی آندروژن‌ها",
          features: [
            "LH، FSH، PRL",
            "Testosterone، F.Testosterone، AMH",
            "17OH Progesterone، Estradiol",
            "DHEA-S، Androstenedione"
          ],
          popular: true,
          color: "from-purple-50 to-purple-100",
          category: "women"
        },
        {
          id: "hyperandrogenism_panel",
          title: "پنل هیپرآندروژنیسم",
          subtitle: "(پر مویی)",
          price: "۷۸۰,۰۰۰",
          description: "برای زنان با پُر مویی، آکنه شدید",
          features: [
            "Androstenedione، DHEA-S",
            "17OH Progesterone، AMH",
            "Testosterone، F.Testosterone، DHT"
          ],
          popular: false,
          color: "from-indigo-50 to-indigo-100",
          category: "women"
        }
      ]
    },
    cancer: {
      title: "غربالگری سرطان",
      packages: [
        {
          id: "breast_cancer",
          title: "پنل سرطان پستان",
          subtitle: "(زنان)",
          price: "۵۸۰,۰۰۰",
          description: "غربالگری زنان در معرض خطر",
          features: [
            "CEA (آنتی‌ژن کرسینواپریونیک)",
            "CA 125",
            "CA 15.3",
            "HER2"
          ],
          popular: false,
          color: "from-rose-50 to-rose-100",
          category: "cancer"
        },
        {
          id: "ovarian_cancer",
          title: "پنل سرطان تخمدان",
          subtitle: "(زنان)",
          price: "۶۲۰,۰۰۰",
          description: "غربالگری تخصصی سرطان تخمدان",
          features: [
            "CEA، CA 125",
            "HE4 (پروتئین اپیدیدیم انسان)",
            "Roma Factor",
            "B.HCG"
          ],
          popular: false,
          color: "from-violet-50 to-violet-100",
          category: "cancer"
        },
        {
          id: "prostate_cancer",
          title: "پنل سرطان پروستات",
          subtitle: "(مردان)",
          price: "۳۲۰,۰۰۰",
          description: "غربالگری سرطان پروستات",
          features: [
            "PSA (آنتی‌ژن اختصاصی پروستات)",
            "F.PSA (PSA آزاد)",
            "F.PSA / PSA (نسبت PSA آزاد)"
          ],
          popular: false,
          color: "from-blue-50 to-blue-100",
          category: "cancer"
        },
        {
          id: "colorectal_cancer",
          title: "پنل سرطان روده",
          subtitle: "(زن و مرد)",
          price: "۲۸۰,۰۰۰",
          description: "غربالگری سرطان کولورکتال",
          features: [
            "CEA",
            "CA 19.9",
            "OB (Stool) - خون مخفی مدفوع"
          ],
          popular: false,
          color: "from-amber-50 to-amber-100",
          category: "cancer"
        }
      ]
    }
  };

  // Flatten all packages for easy selection
  const allCheckupPackages = Object.values(checkupCategories).flatMap(category => category.packages);

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00', '17:30'
  ];

  const handlePackageSelect = (pkg: CheckupPackage) => {
    setSelectedPackage(pkg);
    setRequestData(prev => ({ ...prev, packageId: pkg.id }));
    setStep(2);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Save to user's requests (localStorage simulation)
      const userRequests = JSON.parse(localStorage.getItem(`requests_${user?.id}`) || '[]');
      const newRequest = {
        id: Date.now().toString(),
        type: 'checkup',
        package: selectedPackage,
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

  const formatPrice = (price: string) => {
    return price.replace(/,/g, '٬') + ' تومان';
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card className="p-4 border-0 shadow-lg rounded-xl">
        <div className="flex items-center justify-between">
          {[
            { step: 1, title: 'انتخاب پنل', icon: Stethoscope },
            { step: 2, title: 'زمان‌بندی', icon: Calendar },
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
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                } ${isCurrent ? 'ring-4 ring-blue-200' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="mr-3 text-right">
                  <div className={`text-sm font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {item.title}
                  </div>
                </div>
                {index < 3 && (
                  <div className={`w-16 h-1 mx-4 rounded ${
                    step > item.step ? 'bg-blue-600' : 'bg-gray-200'
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
          <h3 className="text-xl font-bold text-gray-800 mb-6">انتخاب پنل چکاپ</h3>
          
          {/* Category Tabs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
            {Object.entries(checkupCategories).map(([categoryKey, category]) => (
              <Button
                key={categoryKey}
                variant={selectedCategory === categoryKey ? "default" : "outline"}
                className="h-auto p-3 text-sm"
                onClick={() => setSelectedCategory(categoryKey as 'general' | 'specialized' | 'women' | 'cancer')}
              >
                {category.title}
              </Button>
            ))}
          </div>

          {/* Selected Category Packages */}
          <div className="grid gap-4">
            {checkupCategories[selectedCategory]?.packages.map((pkg) => (
              <Card 
                key={pkg.id}
                className="p-6 border-2 border-gray-200 hover:border-blue-300 cursor-pointer transition-all duration-300 hover:shadow-lg"
                onClick={() => handlePackageSelect(pkg)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="text-lg font-bold text-gray-800">{pkg.title}</h4>
                      {pkg.subtitle && (
                        <span className="text-sm text-gray-500">{pkg.subtitle}</span>
                      )}
                      {pkg.popular && (
                        <Badge className="bg-blue-100 text-blue-800">محبوب</Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{pkg.description}</p>
                    <div className="grid md:grid-cols-2 gap-2">
                      {pkg.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-left mr-6">
                    <div className="text-2xl font-bold text-blue-600">{pkg.price} تومان</div>
                    <Button className="mt-3">انتخاب پنل</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Scheduling */}
      {step === 2 && selectedPackage && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">زمان‌بندی و جزئیات</h3>
            <Button variant="outline" onClick={() => setStep(1)}>
              تغییر پنل
            </Button>
          </div>

          {/* Selected Package Summary */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-blue-800">{selectedPackage.title}</h4>
                <p className="text-blue-600 text-sm">{selectedPackage.description}</p>
              </div>
              <div className="text-blue-800 font-bold text-xl">
                {formatPrice(selectedPackage.price)}
              </div>
            </div>
          </Card>

          {/* Scheduling Form */}
          <Card className="p-6 border-0 shadow-lg rounded-xl">
            <div className="space-y-6">
              {/* Date and Time */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="date">تاریخ مراجعه</Label>
                  <Input
                    id="date"
                    type="date"
                    value={requestData.preferredDate}
                    onChange={(e) => setRequestData(prev => ({ ...prev, preferredDate: e.target.value }))}
                    className="mt-2"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="time">ساعت مراجعه</Label>
                  <Select value={requestData.preferredTime} onValueChange={(value) => 
                    setRequestData(prev => ({ ...prev, preferredTime: value }))
                  }>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="انتخاب ساعت" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time}>{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location */}
              <div>
                <Label>محل انجام چکاپ</Label>
                <div className="flex gap-4 mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="location"
                      value="clinic"
                      checked={requestData.location === 'clinic'}
                      onChange={(e) => setRequestData(prev => ({ ...prev, location: e.target.value as 'clinic' }))}
                      className="text-blue-600"
                    />
                    <MapPin className="w-4 h-4" />
                    <span>مراجعه به آزمایشگاه</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="location"
                      value="home"
                      checked={requestData.location === 'home'}
                      onChange={(e) => setRequestData(prev => ({ ...prev, location: e.target.value as 'home' }))}
                      className="text-blue-600"
                    />
                    <MapPin className="w-4 h-4" />
                    <span>در منزل (هزینه اضافی)</span>
                  </label>
                </div>
              </div>

              {/* Address if home visit */}
              {requestData.location === 'home' && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label htmlFor="address">آدرس کامل</Label>
                    {user?.addresses?.length && (
                      <div className="text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                        ✓ از پروفایل
                      </div>
                    )}
                  </div>
                  <Textarea
                    id="address"
                    value={requestData.address || ''}
                    onChange={(e) => setRequestData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="آدرس کامل خود را وارد کنید..."
                    className="mt-2"
                    rows={3}
                  />
                </div>
              )}

              {/* Emergency Contact */}
              <div>
                <Label htmlFor="emergency">شماره تماس اضطراری</Label>
                <Input
                  id="emergency"
                  value={requestData.emergencyContact}
                  onChange={(e) => setRequestData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  placeholder="09123456789"
                  className="mt-2"
                />
              </div>

              {/* Insurance */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="insurance"
                    checked={requestData.hasInsurance}
                    onCheckedChange={(checked) => setRequestData(prev => ({ ...prev, hasInsurance: !!checked }))}
                  />
                  <Label htmlFor="insurance" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    دارای بیمه درمانی هستم
                  </Label>
                </div>
                
                {requestData.hasInsurance && (
                  <div>
                    <Label htmlFor="insuranceType">نوع بیمه</Label>
                    <Select value={requestData.insuranceType} onValueChange={(value) => 
                      setRequestData(prev => ({ ...prev, insuranceType: value }))
                    }>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="انتخاب نوع بیمه" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="social">بیمه اجتماعی</SelectItem>
                        <SelectItem value="health">خدمات درمانی</SelectItem>
                        <SelectItem value="armed_forces">نیروهای مسلح</SelectItem>
                        <SelectItem value="other">سایر</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <Label htmlFor="notes">توضیحات اضافی (اختیاری)</Label>
                <Textarea
                  id="notes"
                  value={requestData.notes}
                  onChange={(e) => setRequestData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="توضیحات یا درخواست‌های خاص..."
                  className="mt-2"
                  rows={3}
                />
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
              مرحله قبل
            </Button>
            <Button 
              onClick={() => setStep(3)} 
              className="flex-1"
              disabled={!requestData.preferredDate || !requestData.preferredTime || !requestData.emergencyContact}
            >
              ادامه
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && selectedPackage && (
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-800">تایید درخواست</h3>
          
          <Card className="p-6 border-0 shadow-lg rounded-xl">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">پنل انتخابی:</span>
                <span className="font-semibold">{selectedPackage.title}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">تاریخ و ساعت:</span>
                <span className="font-semibold">{requestData.preferredDate} - {requestData.preferredTime}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">محل انجام:</span>
                <span className="font-semibold">
                  {requestData.location === 'clinic' ? 'آزمایشگاه' : 'منزل'}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b">
                <span className="text-gray-600">هزینه:</span>
                <span className="font-semibold text-blue-600 text-lg">
                  {formatPrice(selectedPackage.price)}
                </span>
              </div>
              {requestData.hasInsurance && (
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="text-gray-600">بیمه:</span>
                  <span className="font-semibold text-green-600">دارد</span>
                </div>
              )}
            </div>
          </Card>

          <div className="flex gap-4">
            <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
              مرحله قبل
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1"
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
            درخواست چکاپ شما ثبت شد و به زودی تیم ما با شما تماس خواهند گرفت.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => {
              setStep(1);
              setSelectedPackage(null);
              setRequestData({
                packageId: '',
                preferredDate: '',
                preferredTime: '',
                location: 'clinic',
                notes: '',
                emergencyContact: '',
                hasInsurance: false
              });
            }}>
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

export default RequestCheckupForm;
