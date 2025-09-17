
import React from 'react';
import { Card } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import StaggeredReveal from './StaggeredReveal';
import { useIsMobile } from '@/hooks/use-mobile';

const Services = () => {
  const services = [
    {
      title: "هماتولوژی",
      description: "تشخیص دقیق بیماری‌های خونی و ارزیابی فاکتورهای حیاتی خون با پیشرفته‌ترین آنالایزرهای روز دنیا.",
      icon: "🩸",
      path: "/services/hematology",
      color: "from-red-500 via-red-600 to-pink-600",
      bgColor: "from-red-50/50 to-pink-50/50",
      ringColor: "hover:ring-red-300/50"
    },
    {
      title: "بیوشیمی",
      description: "ارزیابی جامع عملکرد اندام‌ها، هورمون‌ها و متابولیت‌های بدن برای پایش دقیق و کامل سلامت شما.",
      icon: "⚗️",
      path: "/services/biochemistry",
      color: "from-blue-500 via-blue-600 to-indigo-600",
      bgColor: "from-blue-50/50 to-indigo-50/50",
      ringColor: "hover:ring-blue-300/50"
    },
    {
      title: "میکروبیولوژی",
      description: "شناسایی تخصصی میکروارگانیسم‌های بیماری‌زا جهت تشخیص عفونت‌ها و انتخاب مؤثرترین روش درمانی.",
      icon: "🦠",
      path: "/services/microbiology",
      color: "from-green-500 via-green-600 to-emerald-600",
      bgColor: "from-green-50/50 to-emerald-50/50",
      ringColor: "hover:ring-green-300/50"
    },
    {
      title: "ایمونولوژی و آلرژی",
      description: "ارزیابی دقیق سیستم ایمنی و شناسایی آلرژن‌ها برای مدیریت ریشه‌ای حساسیت‌ها و بیماری‌های خودایمنی.",
      icon: "🛡️",
      path: "/services/immunology",
      color: "from-purple-500 via-purple-600 to-violet-600",
      bgColor: "from-purple-50/50 to-violet-50/50",
      ringColor: "hover:ring-purple-300/50"
    },
    {
      title: "سیتولوژی",
      description: "بررسی میکروسکوپی سلول‌ها برای تشخیص زودهنگام تغییرات پیش‌سرطانی و بدخیمی‌ها.",
      icon: "🔬",
      path: "/services/cytology",
      color: "from-cyan-500 via-cyan-600 to-blue-600",
      bgColor: "from-cyan-50/50 to-blue-50/50",
      ringColor: "hover:ring-cyan-300/50"
    },
    {
      title: "قارچ و انگل شناسی",
      description: "شناسایی دقیق عوامل قارچی و انگلی با روش‌های پیشرفته جهت درمان سریع و مؤثر عفونت‌ها.",
      icon: "🧪",
      path: "/services/microbiology",
      color: "from-orange-500 via-orange-600 to-red-600",
      bgColor: "from-orange-50/50 to-red-50/50",
      ringColor: "hover:ring-orange-300/50"
    },
    {
      title: "الکتروفورز",
      description: "جداسازی و آنالیز پروتئین‌ها برای تشخیص اختلالات خونی (مانند تالاسمی) و بیماری‌های متابولیک.",
      icon: "⚡",
      path: "/services/toxicology",
      color: "from-yellow-500 via-yellow-600 to-orange-600",
      bgColor: "from-yellow-50/50 to-orange-50/50",
      ringColor: "hover:ring-yellow-300/50"
    }
  ];

  const isMobile = useIsMobile();
  const displayedServices = isMobile ? services.slice(0, 4) : services;

  return (
    <section className="py-12 md:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 md:mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full mb-6 md:mb-8 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4 md:mb-6">
            خدمات تخصصی ما
          </h2>
          <p className="text-gray-600 text-base md:text-xl max-w-2xl md:max-w-3xl mx-auto leading-relaxed">
            با بهره‌گیری از آخرین تکنولوژی‌ها و متخصصین مجرب، بهترین خدمات را ارائه می‌دهیم
          </p>
        </div>

        <StaggeredReveal 
          staggerDelay={100} 
          direction="scale" 
          duration={600}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
        >
          {displayedServices.map((service, index) => (
            <Link key={index} to={service.path}>
              <Card className={`group relative p-6 md:p-8 text-center bg-white/80 backdrop-blur-sm ring-1 ring-gray-200/50 ${service.ringColor} shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 rounded-3xl overflow-hidden`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${service.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                    <span className="text-2xl md:text-3xl">{service.icon}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 md:mb-4 group-hover:text-gray-800 transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-base md:text-lg mb-4 md:mb-6">
                    {service.description}
                  </p>
                  <div className="inline-flex items-center text-blue-600 font-semibold group-hover:text-blue-700 transition-colors duration-300">
                    <span>مشاهده جزئیات</span>
                    <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </StaggeredReveal>
      </div>
    </section>
  );
};

export default Services;
