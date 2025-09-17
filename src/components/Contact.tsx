import React, { useState } from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import CanonicalTag from '@/components/CanonicalTag';
import MetaTags from '@/components/MetaTags';
import { ArrowLeft, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('/api/contact.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        setSubmitStatus('success');
        toast({
          title: "✅ پیام ارسال شد",
          description: "پیام شما با موفقیت ارسال شد. کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.",
          duration: 5000,
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(result.error || 'خطا در ارسال پیام');
      }
    } catch (error) {
      setSubmitStatus('error');
      toast({
        title: "❌ خطا در ارسال",
        description: error instanceof Error ? error.message : 'خطا در ارسال پیام. لطفاً دوباره تلاش کنید.',
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "آدرس",
      details: "شهرقدس، میدان مصلی",
      description: "آزمایشگاه تشخیص پزشکی سلامت در شهرقدس واقع شده است",
      url: "https://nshn.ir/87_bvX81VxB9-K"
    },
    {
      icon: "📞",
      title: "تلفن تماس",
      details: "021-46833010، 021-46833011",
      description: "پاسخگویی در ساعات کاری",
      phones: [
        { label: "021-46833010", value: "02146833010" },
        { label: "021-46833011", value: "02146833011" }
      ]
    },
    {
      icon: "📷",
      title: "اینستاگرام",
      details: "@salamatlab",
      description: "ما را در اینستاگرام دنبال کنید",
      url: "https://instagram.com/salamatlab"
    },
    {
      icon: "🕒",
      title: "ساعات کاری",
      details: "شنبه تا چهارشنبه: 6:30 - 20:30 | پنجشنبه: 6:30 - 19:30",
      description: ""
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <CanonicalTag path="/contact" />
      <MetaTags
        title="تماس با ما | آزمایشگاه تشخیص پزشکی سلامت"
        description="با آزمایشگاه تشخیص پزشکی سلامت تماس بگیرید. آدرس: شهرقدس، میدان مصلی. تلفن: 021-46833010. پشتیبانی 24 ساعته برای تمامی خدمات آزمایشگاهی"
        keywords="تماس با ما, آزمایشگاه سلامت, آدرس, تلفن, پشتیبانی, شهرقدس, تهران, آزمایشگاه تشخیص پزشکی"
        ogImage="https://www.salamatlab.com/contact-preview.jpg"
        path="/contact"
      />
      <Header />
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="mb-6">
              <Link to="/">
                <Button variant="outline" className="bg-transparent border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white transition-all duration-300">
                  بازگشت به صفحه اصلی
                  <ArrowLeft className="mr-2 rtl:ml-2 rtl:mr-0 w-4 h-4" />
                </Button>
              </Link>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              تماس با ما
            </h1>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
              ما آماده پاسخگویی به سوالات شما هستیم. برای دریافت مشاوره، رزرو نوبت یا هرگونه سوال، 
              با ما در تماس باشید.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="text-center lg:text-right">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">اطلاعات تماس</h2>
              </div>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                    <div className="flex items-start space-x-4 space-x-reverse">
                      <div className="text-3xl bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full text-white">
                        {info.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">{info.title}</h3>
                        {"phones" in info && Array.isArray((info as any).phones) ? (
                          <div className="font-medium mb-1">
                            {(info as any).phones.map((p: {label: string; value: string}, idx: number) => (
                              <a
                                key={p.value}
                                href={`tel:${p.value}`}
                                className="text-blue-600 hover:underline"
                                aria-label={`تماس با شماره ${p.label}`}
                              >
                                {p.label}
                              </a>
                            )).reduce((prev: (JSX.Element | string)[], curr: JSX.Element, idx: number) => prev.concat(idx > 0 ? [" ", "|", " "] : [], curr), [] as (JSX.Element | string)[])}
                          </div>
                        ) : ("url" in info && (info as any).url) ? (
                          <a
                            href={(info as any).url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-medium mb-1 inline-block hover:underline"
                            aria-label={`باز کردن ${info.title}`}
                          >
                            {info.details}
                          </a>
                        ) : (
                          <p className="text-gray-700 font-medium mb-1">{info.details}</p>
                        )}
                        <p className="text-gray-600 text-sm leading-relaxed">{info.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Map (Neshan) */}
              <Card className="p-6 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">موقعیت ما روی نقشه</h3>
                  <AspectRatio ratio={4 / 3}>
                    <iframe
                      title="map-iframe"
                      src="https://neshan.org/maps/iframe/places/87b4968b9c940b6deb59f64311f8dcd0#c35.724-51.112-19z-0p/35.72401695771177/51.111359706264935"
                      allowFullScreen
                      loading="lazy"
                      className="w-full h-full rounded-lg border-0"
                    />
                  </AspectRatio>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="space-y-6">
              <div className="text-center lg:text-right">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">فرم تماس</h2>
              </div>
              
              <Card className="p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
                {/* Success/Error Messages */}
                {submitStatus === 'success' && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 ml-2" />
                      <div>
                        <h3 className="text-green-800 font-medium">پیام شما با موفقیت ارسال شد!</h3>
                        <p className="text-green-600 text-sm">کارشناسان ما در اسرع وقت با شما تماس خواهند گرفت.</p>
                      </div>
                    </div>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 ml-2" />
                      <div>
                        <h3 className="text-red-800 font-medium">خطا در ارسال پیام</h3>
                        <p className="text-red-600 text-sm">لطفاً دوباره تلاش کنید یا با ما تماس بگیرید.</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        نام و نام خانوادگی *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="نام خود را وارد کنید"
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        ایمیل *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="ایمیل خود را وارد کنید"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        شماره تلفن
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="شماره تلفن خود را وارد کنید"
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                        موضوع *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="موضوع پیام خود را وارد کنید"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2 text-right">
                      پیام *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="پیام خود را اینجا بنویسید..."
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        در حال ارسال...
                      </>
                    ) : (
                      'ارسال پیام'
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </div>

          
        </div>
      </section>
    </div>
  );
};

export default Contact;