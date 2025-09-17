import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from '@/hooks/use-toast';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';

const Careers: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
	const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    nationalId: '',
    birthDate: '',
    phone: '',
    email: '',
		major: '',
    degree: 'دیپلم',
    description: '',
    hasExperience: 'no',
    experienceDetails: '',
    address: '',
  });

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // Validate resume file before upload
  const ALLOWED_RESUME_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt'];
  const MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB

  const handleResumeChange = (input: HTMLInputElement) => {
    const file = input.files?.[0] || null;
    if (!file) {
      setResumeFile(null);
      return;
    }
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_RESUME_EXTENSIONS.includes(ext)) {
      toast({
        title: 'فایل نامعتبر',
        description: `پسوندهای مجاز: ${ALLOWED_RESUME_EXTENSIONS.join(', ')}`,
        variant: 'destructive',
      });
      input.value = '';
      setResumeFile(null);
      return;
    }
    if (file.size > MAX_RESUME_SIZE) {
      toast({
        title: 'حجم فایل زیاد است',
        description: 'حداکثر حجم رزومه 5 مگابایت است',
        variant: 'destructive',
      });
      input.value = '';
      setResumeFile(null);
      return;
    }
    setResumeFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Basic client-side checks for required fields not covered by native required
    if (!form.birthDate) {
      toast({ title: 'تاریخ تولد الزامی است', description: 'لطفاً تاریخ تولد را انتخاب کنید', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (resumeFile) data.append('resume', resumeFile);

      // Use direct PHP endpoint to work both on hosting and local without proxy
      const res = await fetch('/api/careers.php', {
        method: 'POST',
        // Do NOT set Content-Type so browser sets proper multipart boundary
        body: data,
      });
      const result = await res.json().catch(() => ({} as any));
      if (!res.ok || !result?.success) {
        const message = result?.error || 'خطای ناشناخته از سرور';
        throw new Error(message);
      }
      toast({ title: 'درخواست شما ارسال شد', description: 'به‌زودی با شما تماس خواهیم گرفت' });
      setForm({
        firstName: '', lastName: '', nationalId: '', birthDate: '', phone: '', email: '',
        major: 'علوم آزمایشگاهی', degree: 'دیپلم', description: '', hasExperience: 'no', experienceDetails: '', address: ''
      });
      setResumeFile(null);
    } catch (err: any) {
      toast({ title: 'خطا در ارسال فرم', description: String(err?.message || 'لطفاً مجدداً تلاش کنید'), variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-600 text-white p-8 md:p-12 mb-10 shadow-2xl">
            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">همکاری با ما</h1>
              <p className="text-white/90">فرم درخواست همکاری را تکمیل کنید تا با شما تماس بگیریم</p>
            </div>
          </div>
        </Reveal>

        <Card className="max-w-5xl mx-auto p-6 md:p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">نام</Label>
                <Input id="firstName" value={form.firstName} onChange={e => handleChange('firstName', e.target.value)} placeholder="نام خود را وارد کنید" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">نام خانوادگی</Label>
                <Input id="lastName" value={form.lastName} onChange={e => handleChange('lastName', e.target.value)} placeholder="نام خانوادگی خود را وارد کنید" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nationalId">کد ملی</Label>
                <Input id="nationalId" value={form.nationalId} onChange={e => handleChange('nationalId', e.target.value)} placeholder="کد ملی خود را وارد کنید" required maxLength={10} />
              </div>
				<div className="space-y-2">
					<Label htmlFor="birthDate">تاریخ تولد</Label>
                <div className="space-y-2">
                  <DatePicker
                    calendar={persian}
                    locale={persian_fa}
                    value={form.birthDate || undefined}
                    onChange={(date: any) => {
                      try {
                        const formatted = Array.isArray(date)
                          ? ''
                          : date?.isValid ? date.format("YYYY/MM/DD") : '';
                        handleChange('birthDate', formatted || '');
                      } catch {
                        handleChange('birthDate', '');
                      }
                    }}
                    inputClass="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-primary bg-white"
                    placeholder="تاریخ تولد خود را انتخاب کنید"
                    calendarPosition="bottom-right"
                  />
                  {form.birthDate && (
                    <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      تاریخ انتخابی: {form.birthDate}
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">شماره تلفن</Label>
                <Input id="phone" value={form.phone} onChange={e => handleChange('phone', e.target.value)} placeholder="شماره تلفن خود را وارد کنید" required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">ایمیل</Label>
                <Input id="email" type="email" value={form.email} onChange={e => handleChange('email', e.target.value)} placeholder="ایمیل خود را وارد کنید" />
              </div>
				<div className="space-y-2">
					<Label>رشته تحصیلی</Label>
					<Select value={form.major} onValueChange={v => handleChange('major', v)}>
						<SelectTrigger className="bg-white"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
						<SelectContent>
							<SelectItem value="علوم آزمایشگاهی">علوم آزمایشگاهی</SelectItem>
							<SelectItem value="ميكروبيولوژی">ميكروبيولوژی</SelectItem>
							<SelectItem value="زيست شناسى سلولى مولكولى">زيست شناسى سلولى مولكولى</SelectItem>
							<SelectItem value="بيوشيمى">بيوشيمى</SelectItem>
							<SelectItem value="ژنتیک">ژنتیک</SelectItem>
							<SelectItem value="فوريت پزشكى">فوريت پزشكى</SelectItem>
							<SelectItem value="كامپيوتر">كامپيوتر</SelectItem>
							<SelectItem value="هيچكدام">هيچكدام</SelectItem>
						</SelectContent>
					</Select>
				</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>مقطع تحصیلی</Label>
                <Select value={form.degree} onValueChange={v => handleChange('degree', v)}>
                  <SelectTrigger className="bg-white"><SelectValue placeholder="انتخاب کنید" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="دیپلم">دیپلم</SelectItem>
                    <SelectItem value="کاردانی">کاردانی</SelectItem>
                    <SelectItem value="کارشناسی">کارشناسی</SelectItem>
                    <SelectItem value="کارشناسی ارشد">کارشناسی ارشد</SelectItem>
                    <SelectItem value="دکتر">دکتر</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume">رزومه</Label>
                <Input id="resume" type="file" onChange={e => handleResumeChange(e.target)} />
                <div className="text-xs text-gray-500">پسوندهای مجاز: pdf, doc, docx, txt • حداکثر 5MB</div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">توضیحات</Label>
              <Textarea id="description" rows={4} value={form.description} onChange={e => handleChange('description', e.target.value)} placeholder="توضیحات تکمیلی خود را بنویسید." className="resize-none" />
            </div>

            <div className="space-y-2">
              <Label>آیا سابقه کار مشابه داشته اید؟</Label>
              <RadioGroup
                value={form.hasExperience}
                onValueChange={v => handleChange('hasExperience', v)}
                className="flex items-center gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="exp-yes" value="yes" />
                  <Label htmlFor="exp-yes">بله</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem id="exp-no" value="no" />
                  <Label htmlFor="exp-no">خیر</Label>
                </div>
              </RadioGroup>
              <Textarea
                rows={3}
                value={form.experienceDetails}
                onChange={e => handleChange('experienceDetails', e.target.value)}
                placeholder="در صورتی که در مراکز درمانی و آزمایشگاهی سابقه کار داشته اید بنویسید"
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">آدرس</Label>
              <Textarea id="address" rows={3} value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder="آدرس" className="resize-none" />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                {submitting ? 'در حال ارسال...' : 'ارسال فرم'}
              </Button>
              <Button type="button" variant="outline" className="flex-1" disabled={submitting} onClick={() => { setForm({ firstName: '', lastName: '', nationalId: '', birthDate: '', phone: '', email: '', major: 'علوم آزمایشگاهی', degree: 'دیپلم', description: '', hasExperience: 'no', experienceDetails: '', address: '' }); setResumeFile(null); }}>
                پاک کردن
              </Button>
            </div>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;


