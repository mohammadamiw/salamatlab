import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

type Choice = 'عالی' | 'خوب' | 'متوسط' | 'ضعیف';

interface FeedbackData {
  fullName: string;
  phone: string;
  admissionNumber: string;
  recommendation: 'بلی' | 'خیر' | '';
  suggestions: string;
  answers: Record<number, Choice | ''>;
}

const questions: string[] = [
  'میزان رضایت شما از سیستم نوبت دهی',
  'میزان رضایت شما از ارائه توضیحات جهت آمادگی قبل از آزمایش',
  'میزان رضایت شما از سرعت عمل پذیرش',
  'میزان رضایت شما از برخورد اولیه پرسنل پذیرش و جوابدهی',
  'میزان رضایت شما از نحوه تعامل مالی متصدی صندوق',
  'میزان رضایت شما از مهارت و دقت عمل خونگیری (در آزمایشگاه یا منزل)',
  'میزان رضایت شما از سطح بهداشتی سالن و سرویس بهداشتی',
  'میزان رضایت شما از حضور مسئول واحد پذیرش و نحوه برخورد آن',
  'میزان رضایت شما از سرعت جوابدهی آزمایشگاه',
  'میزان رضایت شما از نحوه ارسال جواب (پیامک، وبسایت و ...)',
  'میزان رضایت شما از ساعت شروع به کار (۷:۰۰ صبح تا ۲۰:۰۰)',
  'میزان رضایت شما از تکریم و احترام به سالمندان و معلولین',
  'میزان رضایت شما از فضای عمومی آزمایشگاه',
  'میزان رضایت شما از پاسخدهی تلفن',
];

interface FeedbackFormProps {
  asSection?: boolean; // if true renders full-width section; otherwise just the form card (for dialogs)
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ asSection = true }) => {
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<FeedbackData>({
    fullName: '',
    phone: '',
    admissionNumber: '',
    recommendation: '',
    suggestions: '',
    answers: Object.fromEntries(questions.map((_, i) => [i + 1, ''])) as Record<number, Choice | ''>,
  });

  const setField = (field: keyof FeedbackData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const setAnswer = (index: number, value: Choice) => {
    setData(prev => ({ ...prev, answers: { ...prev.answers, [index]: value } }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.fullName.trim()) {
      toast({ title: 'نام و نام خانوادگی الزامی است', variant: 'destructive' });
      return;
    }
    const phoneDigits = data.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      toast({ title: 'شماره همراه الزامی و باید معتبر باشد', variant: 'destructive' });
      return;
    }
    const unanswered = Object.entries(data.answers).filter(([, v]) => !v).map(([k]) => Number(k));
    if (unanswered.length > 0) {
      toast({ title: 'لطفاً به همه سؤالات پاسخ دهید', description: `سؤالات بی‌پاسخ: ${unanswered.join(', ')}`, variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      // Use PHP endpoint for compatibility on hosting without Next API
      const res = await fetch('/api/feedback.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error('request failed');
      const out = await res.json();
      const id = out?.id as string | undefined;
      toast({ title: 'با تشکر از ثبت نظر شما', description: 'بازخورد شما با موفقیت دریافت شد' });
      if (id) {
        console.log('Feedback ID:', id);
      }
      setData({ fullName: '', phone: '', admissionNumber: '', recommendation: '', suggestions: '', answers: Object.fromEntries(questions.map((_, i) => [i + 1, ''])) as Record<number, Choice | ''> });
    } catch {
      toast({ title: 'خطا در ارسال نظر', description: 'لطفاً مجدداً تلاش کنید', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  // CSV export removed per request

  const formCard = (
    <Card className="w-full max-w-3xl md:max-w-5xl mx-auto p-4 md:p-8 border-0 shadow-xl bg-white/95 backdrop-blur-sm rounded-2xl md:rounded-3xl">
      <form onSubmit={handleSubmit} className="space-y-6">

        {(() => {
          const isMobile = useIsMobile();
          if (isMobile) {
            return (
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div key={idx} className="rounded-xl border border-gray-100 p-3">
                    <div className="flex items-start gap-2 mb-2">
                      <div className="text-[11px] mt-0.5 font-medium text-gray-500">{idx + 1}.</div>
                      <div className="text-xs leading-5">{q}</div>
                    </div>
                    <RadioGroup
                      value={(data.answers[idx + 1] || '') as any}
                      onValueChange={(v) => setAnswer(idx + 1, v as Choice)}
                    >
                      <div className="grid grid-cols-2 gap-2">
                        {(['عالی','خوب','متوسط','ضعیف'] as Choice[]).map((c) => (
                          <label key={c} htmlFor={`mq${idx+1}-${c}`} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
                            <RadioGroupItem id={`mq${idx+1}-${c}`} value={c} className="h-4 w-4" />
                            <span className="text-xs">{c}</span>
                          </label>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                ))}
              </div>
            );
          }
          return (
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10 md:w-12 text-center text-xs md:text-sm">ردیف</TableHead>
                    <TableHead className="text-xs md:text-sm">سؤالات</TableHead>
                    {(['عالی','خوب','متوسط','ضعیف'] as Choice[]).map((c) => (
                      <TableHead key={c} className="text-center text-xs md:text-sm">{c}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questions.map((q, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="text-center font-medium text-xs md:text-sm">{idx + 1}</TableCell>
                      <TableCell className="text-xs md:text-sm leading-5">{q}</TableCell>
                      {(['عالی','خوب','متوسط','ضعیف'] as Choice[]).map((c) => (
                        <TableCell key={c} className="text-center">
                          <RadioGroup value={(data.answers[idx + 1] || '') as any} onValueChange={(v) => setAnswer(idx + 1, v as Choice)} className="flex items-center justify-center">
                            <RadioGroupItem className="h-4 w-4 md:h-5 md:w-5" value={c} id={`q${idx+1}-${c}`} />
                          </RadioGroup>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          );
        })()}

        {/* Recommendation question */}
        <div className="space-y-3">
          <Label>آیا آزمایشگاه سلامت را به سایر دوستان و بستگان خود معرفی می‌نمایید؟</Label>
          <RadioGroup
            value={data.recommendation}
            onValueChange={(v) => setField('recommendation', v)}
            className="flex flex-wrap items-center gap-4 md:gap-6"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem id="rec-yes" value="بلی" className="h-4 w-4 md:h-5 md:w-5" />
              <Label htmlFor="rec-yes">بلی</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="rec-no" value="خیر" className="h-4 w-4 md:h-5 md:w-5" />
              <Label htmlFor="rec-no">خیر</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Suggestions */}
        <div className="space-y-2">
          <Label htmlFor="suggestions">لطفاً در صورت تمایل، پیشنهادات و انتقادات خود را در قسمت ذیل و یا پشت برگه یادداشت نمایید.</Label>
          <Textarea id="suggestions" rows={4} value={data.suggestions} onChange={(e) => setField('suggestions', e.target.value)} placeholder="پیشنهادات و انتقادات..." className="resize-none text-sm md:text-base" />
        </div>

        {/* Follow-up section */}
        <div className="space-y-2">
          <div className="font-bold text-gray-800">جهت پیگیری و دریافت راهنمایی لطفاً بخش زیر را تکمیل نمایید:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">نام و نام خانوادگی</Label>
              <Input id="fullName" value={data.fullName} onChange={e => setField('fullName', e.target.value)} placeholder="..." className="h-10 md:h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admissionNumber">شماره پذیرش</Label>
              <Input id="admissionNumber" value={data.admissionNumber} onChange={e => setField('admissionNumber', e.target.value)} placeholder="..." className="h-10 md:h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">تلفن تماس</Label>
              <Input id="phone" value={data.phone} onChange={e => setField('phone', e.target.value)} placeholder="..." className="h-10 md:h-11" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-3 sticky bottom-0 bg-white/90 backdrop-blur-sm py-2">
          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 h-11 text-base" disabled={submitting}>
            {submitting ? 'در حال ارسال...' : 'ثبت نظرسنجی'}
          </Button>
        </div>
      </form>
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

export default FeedbackForm;


