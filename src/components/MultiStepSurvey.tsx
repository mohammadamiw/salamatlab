import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChevronLeft, ChevronRight, CheckCircle, Users, Phone, MessageSquare, Star, Heart, FileText, UserPlus } from 'lucide-react';

type Choice = 'عالی' | 'خوب' | 'متوسط' | 'ضعیف';

interface SurveyData {
  fullName: string;
  phone: string;
  admissionNumber: string;
  recommendation: 'بلی' | 'خیر' | '';
  suggestions: string;
  answers: Record<number, Choice | ''>;
}

const questions = [
  {
    id: 1,
    title: "فرآیند پذیرش و امور مالی",
    text: "از فرآیند کلی پذیرش و امور مالی (شامل نوبت‌دهی، سرعت عمل و برخورد کارکنان) چقدر رضایت داشتید؟",
    icon: Users,
  },
  {
    id: 2,
    title: "پرسنل نمونه‌گیری",
    text: "مهارت، دقت و نحوه برخورد پرسنل نمونه‌گیری (خونگیری) را چگونه ارزیابی می‌کنید؟",
    icon: UserPlus,
  },
  {
    id: 3,
    title: "بهداشت و فضای عمومی",
    text: "از بهداشت و فضای عمومی آزمایشگاه (سالن انتظار، سرویس بهداشتی و ...) تا چه حد رضایت داشتید؟",
    icon: Star,
  },
  {
    id: 4,
    title: "دریافت نتیجه آزمایش",
    text: "میزان رضایت شما از سرعت و شیوه دریافت نتیجه آزمایش (پیامک، وب‌سایت و...) چقدر است؟",
    icon: FileText,
  },
  {
    id: 5,
    title: "دسترسی به آزمایشگاه",
    text: "دسترسی به آزمایشگاه (از نظر ساعات کاری و پاسخگویی تلفنی) را چطور ارزیابی می‌کنید؟",
    icon: MessageSquare,
  },
];


interface MultiStepSurveyProps {
  asSection?: boolean;
}

const MultiStepSurvey: React.FC<MultiStepSurveyProps> = ({ asSection = true }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<SurveyData>({
    fullName: '',
    phone: '',
    admissionNumber: '',
    recommendation: '',
    suggestions: '',
    answers: Object.fromEntries(questions.map(q => [q.id, ''])) as Record<number, Choice | ''>,
  });

  const isMobile = useIsMobile();
  
  // Total steps: questions + recommendation/suggestions + personal info + final
  const totalSteps = questions.length + 3;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const setField = (field: keyof SurveyData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const setAnswer = (index: number, value: Choice) => {
    setData(prev => ({ ...prev, answers: { ...prev.answers, [index]: value } }));
  };

  const validateCurrentStep = (): boolean => {
    if (currentStep < questions.length) {
      // Validate single question step
      if (!data.answers[questions[currentStep].id]) {
        toast({ 
          title: 'لطفاً به این سؤال پاسخ دهید', 
          variant: 'destructive' 
        });
        return false;
      }
    } else if (currentStep === questions.length) {
      // Validate recommendation step
      if (!data.recommendation) {
        toast({ title: 'لطفاً به سؤال معرفی به دیگران پاسخ دهید', variant: 'destructive' });
        return false;
      }
    } else if (currentStep === questions.length + 1) {
       // Validate personal info step
      if (!data.fullName.trim()) {
        toast({ title: 'نام و نام خانوادگی الزامی است', variant: 'destructive' });
        return false;
      }
      const phoneDigits = data.phone.replace(/\D/g, '');
      if (phoneDigits.length < 10) {
        toast({ title: 'شماره همراه الزامی و باید معتبر باشد', variant: 'destructive' });
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;
    
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('request failed');
      const out = await res.json();
      const id = out?.id as string | undefined;
      toast({ 
        title: 'با تشکر از ثبت نظر شما', 
        description: 'بازخورد شما با موفقیت دریافت شد' 
      });
      if (id) {
        console.log('Feedback ID:', id);
      }
      // Reset form
      setData({ 
        fullName: '', 
        phone: '', 
        admissionNumber: '', 
        recommendation: '', 
        suggestions: '', 
        answers: Object.fromEntries(questions.map(q => [q.id, ''])) as Record<number, Choice | ''> 
      });
      setCurrentStep(0);
    } catch {
      toast({ 
        title: 'خطا در ارسال نظر', 
        description: 'لطفاً مجدداً تلاش کنید', 
        variant: 'destructive' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestionStep = (stepIndex: number) => {
    const question = questions[stepIndex];
    const IconComponent = question.icon;
    
    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
           <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <IconComponent className="w-7 h-7 md:w-8 md:h-8 text-blue-600" />
          </div>
          <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            {question.title}
          </h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed max-w-lg mx-auto px-4 sm:px-0">
            {question.text}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-100">
          <RadioGroup
            value={(data.answers[question.id] || '') as any}
            onValueChange={(v) => setAnswer(question.id, v as Choice)}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(['عالی', 'خوب', 'متوسط', 'ضعیف'] as Choice[]).map((choice) => {
                const isChecked = data.answers[question.id] === choice;
                return (
                  <label 
                    key={choice} 
                    htmlFor={`q${question.id}-${choice}`} 
                    className={`flex items-center justify-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all duration-200 group ${
                      isChecked 
                      ? 'bg-blue-50 border-blue-400' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <RadioGroupItem 
                      id={`q${question.id}-${choice}`} 
                      value={choice} 
                      className="h-5 w-5 border-2 group-hover:border-blue-500 sr-only" 
                    />
                    <span className={`text-sm md:text-base font-medium transition-colors ${
                      isChecked ? 'text-blue-700' : 'text-gray-600 group-hover:text-blue-700'
                    }`}>
                      {choice}
                    </span>
                  </label>
                );
              })}
            </div>
          </RadioGroup>
        </div>
      </div>
    );
  };
  
  const renderRecommendationStep = () => {
    const isYesChecked = data.recommendation === 'بلی';
    const isNoChecked = data.recommendation === 'خیر';

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Heart className="w-7 h-7 md:w-8 md:h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
            معرفی به دیگران و پیشنهادات شما
          </h3>
          <p className="text-gray-600 text-sm md:text-base">
            نظر شما برای ما بسیار ارزشمند است.
          </p>
        </div>

        <div className="space-y-6">
          {/* Recommendation */}
          <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-100">
            <div className="space-y-4">
              <Label className="text-sm md:text-base font-medium">
                آیا آزمایشگاه سلامت را به سایر دوستان و بستگان خود معرفی می‌نمایید؟ *
              </Label>
              <RadioGroup
                value={data.recommendation}
                onValueChange={(v) => setField('recommendation', v)}
                className="grid grid-cols-2 gap-3"
              >
                <label htmlFor="rec-yes" className={`flex items-center justify-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all duration-200 ${
                    isYesChecked
                    ? 'bg-blue-50 border-blue-400'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}>
                  <RadioGroupItem id="rec-yes" value="بلی" className="h-5 w-5 sr-only" />
                  <span className={`text-sm md:text-base font-medium transition-colors ${
                    isYesChecked ? 'text-blue-700' : 'text-gray-600'
                  }`}>بلی</span>
                </label>
                <label htmlFor="rec-no" className={`flex items-center justify-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all duration-200 ${
                    isNoChecked
                    ? 'bg-red-50 border-red-400'
                    : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                }`}>
                  <RadioGroupItem id="rec-no" value="خیر" className="h-5 w-5 sr-only" />
                  <span className={`text-sm md:text-base font-medium transition-colors ${
                    isNoChecked ? 'text-red-700' : 'text-gray-600'
                  }`}>خیر</span>
                </label>
              </RadioGroup>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-100">
            <div className="space-y-3">
              <Label htmlFor="suggestions" className="text-sm md:text-base font-medium">
                لطفاً در صورت تمایل، پیشنهادات و انتقادات خود را یادداشت نمایید:
              </Label>
              <Textarea 
                id="suggestions" 
                rows={4} 
                value={data.suggestions} 
                onChange={(e) => setField('suggestions', e.target.value)} 
                placeholder="پیشنهادات و انتقادات شما..."
                className="resize-none" 
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-7 h-7 md:w-8 md:h-8 text-green-600" />
        </div>
        <h3 className="text-lg md:text-2xl font-bold text-gray-800 mb-2">
          جهت پیگیری و دریافت راهنمایی
        </h3>
        <p className="text-gray-600 text-sm md:text-base">
          لطفاً بخش زیر را تکمیل نمایید.
        </p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 md:p-6 border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium">نام و نام خانوادگی *</Label>
            <Input 
              id="fullName" 
              value={data.fullName} 
              onChange={e => setField('fullName', e.target.value)} 
              placeholder="نام کامل خود را وارد کنید"
              className="h-11" 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">تلفن تماس *</Label>
            <Input 
              id="phone" 
              value={data.phone} 
              onChange={e => setField('phone', e.target.value)} 
              placeholder="09xxxxxxxxx"
              className="h-11" 
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="admissionNumber" className="text-sm font-medium">شماره پذیرش</Label>
            <Input 
              id="admissionNumber" 
              value={data.admissionNumber} 
              onChange={e => setField('admissionNumber', e.target.value)} 
              placeholder="شماره پذیرش (اختیاری)"
              className="h-11" 
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinalStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          آماده برای ارسال
        </h3>
        <p className="text-gray-600 text-sm md:text-base">
          نظرسنجی شما تکمیل شد. با کلیک روی دکمه ارسال، نظرات شما ثبت خواهد شد.
        </p>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h4 className="font-bold text-blue-800 mb-4">خلاصه اطلاعات شما:</h4>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">نام:</span> {data.fullName}</p>
          <p><span className="font-medium">شماره همراه:</span> {data.phone}</p>
          {data.admissionNumber && (
            <p><span className="font-medium">شماره پذیرش:</span> {data.admissionNumber}</p>
          )}
          <p><span className="font-medium">توصیه به دیگران:</span> {data.recommendation}</p>
          <p><span className="font-medium">تعداد سؤالات پاسخ داده شده:</span> {Object.values(data.answers).filter(a => a).length} از {questions.length}</p>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          با شرکت در این نظرسنجی، شما به قید قرعه برنده جایزه خواهید شد.
        </p>
      </div>
    </div>
  );

  const renderStepContent = () => {
    if (currentStep < questions.length) {
      return renderQuestionStep(currentStep);
    } else if (currentStep === questions.length) {
      return renderRecommendationStep();
    } else if (currentStep === questions.length + 1) {
      return renderPersonalInfoStep();
    } else {
      return renderFinalStep();
    }
  };

  const formCard = (
    <Card className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm sm:shadow-xl sm:rounded-2xl md:rounded-3xl overflow-hidden flex flex-col h-full sm:h-auto sm:min-h-[70vh]">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg md:text-xl font-bold">
            مرحله {currentStep + 1} از {totalSteps}
          </h2>
          <span className="text-sm opacity-90">
            {Math.round(progress)}% تکمیل شده
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-white/20 transition-all duration-500 ease-out" />
      </div>

      {/* Step Content */}
      <div className="p-4 sm:p-6 md:p-8 flex-grow overflow-y-auto transition-all duration-300 ease-in-out">
        <div className="animate-in fade-in-0 slide-in-from-right-4 duration-300">
          {renderStepContent()}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="bg-gray-50/90 backdrop-blur-sm p-4 border-t border-gray-100 sm:p-6">
        <div className="flex justify-between items-center">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4" />
            قبلی
          </Button>

          {currentStep === totalSteps - 1 ? (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2 px-6"
            >
              {submitting ? 'در حال ارسال...' : 'ثبت نظرسنجی'}
              <CheckCircle className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={nextStep}
              className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
            >
              بعدی
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  if (!asSection) {
    return formCard;
  }

  return (
    <section className="py-16 bg-secondary/40" id="feedback">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">نظرسنجی مشتریان</h3>
          <p className="text-gray-600">نظر شما به بهبود کیفیت خدمات ما کمک می‌کند</p>
        </div>
        {formCard}
      </div>
    </section>
  );
};

export default MultiStepSurvey;
