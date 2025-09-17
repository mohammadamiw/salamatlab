import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import StaggeredReveal from './StaggeredReveal';
import { useIsMobile } from '@/hooks/use-mobile';

const PartnerOrganizations = () => {
  const commercialInsurances = [
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

  const baseInsurances = [
    "بیمه سلامت ایرانیان",
    "بیمه تأمین اجتماعی", 
    "بیمه نیروهای مسلح"
  ];

  const [showAllCommercial, setShowAllCommercial] = React.useState(false);
  const isMobile = useIsMobile();

  const displayedCommercial = showAllCommercial
    ? commercialInsurances
    : (isMobile ? commercialInsurances.slice(0, 4) : commercialInsurances.slice(0, 8));

  return (
    <section id="partners" className="py-12 md:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid opacity-20 hidden sm:block"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob hidden sm:block"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 hidden sm:block"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 hidden sm:block"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 md:mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full mb-6 md:mb-8 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4 md:mb-6">
            سازمان‌های طرف قرارداد
          </h2>
          <p className="text-gray-600 text-base md:text-xl max-w-2xl md:max-w-3xl mx-auto leading-relaxed">
            آزمایشگاه سلامت با بیمه‌های معتبر کشور طرف قرارداد است
          </p>
        </div>

        {/* Base Insurance Section */}
        <div className="mb-12 md:mb-20">
          <div className="flex items-center justify-center mb-12">
            <div className="inline-flex items-center space-x-3 space-x-reverse bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full shadow-lg">
              <span className="text-green-600 text-2xl">✅</span>
              <h3 className="text-2xl font-bold text-green-800">بیمه‌های پایه</h3>
            </div>
          </div>
          <StaggeredReveal 
            staggerDelay={150} 
            direction="up" 
            duration={600}
            className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto"
          >
            {baseInsurances.map((insurance, index) => (
              <Card key={index} className="group relative p-4 md:p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 text-center">
                  <div className="w-14 h-14 md:w-20 md:h-20 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-2xl md:text-3xl">🏛️</span>
                  </div>
                  <h4 className="text-sm md:text-xl font-bold text-gray-800 mb-2 md:mb-4 group-hover:text-green-700 transition-colors duration-300">{insurance}</h4>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 md:px-4 md:py-2 text-xs md:text-sm font-semibold rounded-full shadow-lg">
                    بیمه پایه
                  </Badge>
                </div>
              </Card>
            ))}
          </StaggeredReveal>
        </div>

        {/* Commercial Insurance Section */}
        <div className="mb-12 md:mb-20">
          <div className="flex items-center justify-center mb-12">
            <div className="inline-flex items-center space-x-3 space-x-reverse bg-gradient-to-r from-blue-100 to-indigo-100 px-6 py-3 rounded-full shadow-lg">
              <span className="text-blue-600 text-2xl">✅</span>
              <h3 className="text-2xl font-bold text-blue-800">شرکت‌های بیمه تجاری درمانی</h3>
            </div>
          </div>
          <StaggeredReveal 
            staggerDelay={100} 
            direction="scale" 
            duration={500}
            className="grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto"
          >
            {displayedCommercial.map((insurance, index) => (
              <Card key={index} className="group relative p-4 md:p-6 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 text-center">
                   <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-xl md:text-2xl">🏢</span>
                  </div>
                   <h4 className="text-sm md:text-base font-bold text-gray-800 mb-2 md:mb-3 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">{insurance}</h4>
                  <Badge variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-medium px-3 py-1 rounded-full">
                    بیمه تجاری
                  </Badge>
                </div>
              </Card>
            ))}
          </StaggeredReveal>
          <div className="text-center mt-10">
            <Button 
              variant="outline" 
              onClick={() => setShowAllCommercial(v => !v)}
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-2xl transition-all duration-300 hover:scale-105"
            >
              {showAllCommercial ? 'نمایش کمتر' : 'مشاهده همه بیمه‌ها'}
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="text-center">
          <Card className="inline-block p-8 border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl">
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold mb-1">{commercialInsurances.length + baseInsurances.length}</div>
                <div className="text-blue-100 text-lg">سازمان بیمه‌گر طرف قرارداد</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PartnerOrganizations;