
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const QuickAccess = () => {
  return (
    <section id="quick-access" className="py-24 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid opacity-30"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-6">
            دسترسی سریع
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            خدمات آنلاین آزمایشگاه سلامت با دسترسی آسان و سریع
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Online Booking Card */}
          <Card className="group relative p-8 text-center bg-white/80 backdrop-blur-sm ring-1 ring-gray-200/50 hover:ring-blue-300/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">نوبت‌دهی آنلاین</h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">رزرو آسان و سریع نوبت آزمایش با چند کلیک ساده</p>
              <Button className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}>
                رزرو نوبت
              </Button>
            </div>
          </Card>

          {/* Results Card */}
          <Card className="group relative p-8 text-center bg-white/80 backdrop-blur-sm ring-1 ring-gray-200/50 hover:ring-green-300/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 to-emerald-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-700 transition-colors duration-300">دریافت جواب آزمایش</h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">دسترسی آنلاین و امن به نتایج آزمایشات شما</p>
              <Button className="w-full rounded-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={() => window.open('http://93.114.111.53:8086/Login', '_blank')}>
                مشاهده نتایج
              </Button>
            </div>
          </Card>

          {/* Home Sampling Card */}
          <Card className="group relative p-8 text-center bg-white/80 backdrop-blur-sm ring-1 ring-gray-200/50 hover:ring-purple-300/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-purple-700 transition-colors duration-300">نمونه‌گیری در منزل</h3>
              <p className="text-gray-600 mb-8 text-lg leading-relaxed">سرویس نمونه‌گیری آنلاین در محل شما</p>
              <Button className="w-full rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" onClick={() => window.open('https://www.salamatlab.com/sample-at-home', '_blank')}>
                درخواست نمونه‌گیری
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default QuickAccess;
