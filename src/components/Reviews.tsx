
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Reviews = () => {
  const navigate = useNavigate();
  const reviews = [
    {
      name: "احمد محمدی",
      rating: 5,
      comment: "خدمات عالی و سریع. نتایج دقیق و به موقع دریافت کردم. کادر بسیار مهربان و حرفه‌ای.",
      date: "۲ هفته پیش",
      avatar: "👨‍🦱",
      service: "آزمایش خون"
    },
    {
      name: "فاطمه احمدی",
      rating: 5,
      comment: "سرویس نمونه‌گیری در منزل فوق‌العاده بود. خیلی راحت و بدون دردسر. حتماً دوباره استفاده می‌کنم.",
      date: "۱ ماه پیش",
      avatar: "👩‍🦰",
      service: "نمونه‌گیری در منزل"
    },
    {
      name: "علی رضایی",
      rating: 4,
      comment: "آزمایشگاه تمیز و مرتب. زمان انتظار کم و کیفیت خدمات بالا. پیشنهاد می‌کنم.",
      date: "۳ هفته پیش",
      avatar: "👨‍🦲",
      service: "چکاپ کامل"
    },
    {
      name: "مریم کریمی",
      rating: 5,
      comment: "چکاپ جامع انجام دادم. همه چیز عالی بود از نمونه‌گیری تا دریافت نتایج. ممنون از تیم حرفه‌ای شما.",
      date: "۱ هفته پیش",
      avatar: "👩‍🦱",
      service: "چکاپ جامع"
    }
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center space-x-1 space-x-reverse">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={`text-xl ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>
            {i < rating ? '⭐' : '☆'}
          </span>
        ))}
        <span className="text-sm text-gray-500 mr-2">({rating}/5)</span>
      </div>
    );
  };

  return (
    <section id="reviews" className="py-12 md:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-grid opacity-20"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-10 md:mb-20">
          <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full mb-6 md:mb-8 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4 md:mb-6">
            نظرات بیماران
          </h2>
          <p className="text-gray-600 text-base md:text-xl max-w-2xl md:max-w-3xl mx-auto leading-relaxed">
            تجربه مراجعان از خدمات آزمایشگاه سلامت
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto mb-12 md:mb-20">
          {reviews.map((review, index) => (
            <Card key={index} className="group relative p-6 md:p-8 border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 text-blue-200 group-hover:text-blue-300 transition-colors duration-300">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>
              
              <div className="relative z-10">
                {/* Header with Avatar and Rating */}
                <div className="flex items-start space-x-4 space-x-reverse mb-4 md:mb-6">
                  <div className="text-3xl md:text-4xl group-hover:scale-110 transition-transform duration-300">
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 text-base md:text-lg mb-1 group-hover:text-blue-700 transition-colors duration-300">
                      {review.name}
                    </h4>
                    <p className="text-blue-600 text-xs md:text-sm font-medium mb-2">{review.service}</p>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
                
                {/* Rating */}
                <div className="mb-4 md:mb-6">
                  {renderStars(review.rating)}
                </div>
                
                {/* Comment */}
                <blockquote className="text-gray-700 leading-relaxed text-base md:text-lg italic relative">
                  <div className="absolute -top-2 -right-2 text-blue-200 text-4xl">"</div>
                  {review.comment}
                  <div className="absolute -bottom-2 -left-2 text-blue-200 text-4xl">"</div>
                </blockquote>
              </div>
            </Card>
          ))}
        </div>

        {/* Satisfaction Stats */}
        <div className="text-center mb-12 md:mb-20">
          <Card className="inline-block p-6 md:p-10 border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl">
            <div className="flex items-center space-x-6 space-x-reverse">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl md:text-4xl font-bold mb-2">رضایت ۹۸٪</div>
                <div className="text-blue-100 text-base md:text-lg">مراجعان از خدمات آزمایشگاه سلامت</div>
                <div className="text-blue-200 text-xs md:text-sm mt-1">بیش از ۱۰,۰۰۰ مراجع راضی</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Survey Participation Section */}
        <div className="text-center">
          <Card className="inline-block p-6 md:p-10 border-0 shadow-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-3xl max-w-2xl">
            <div className="mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold mb-2 md:mb-3">نظرات شما مهم است!</h3>
              <p className="text-green-100 text-base md:text-lg leading-relaxed">
                با شرکت در نظرسنجی، به ما کمک کنید تا خدمات بهتری ارائه دهیم
              </p>
            </div>
            <Button 
              className="bg-white text-green-600 hover:bg-gray-100 px-8 md:px-10 py-3 md:py-4 text-base md:text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
              onClick={() => navigate('/feedback')}
            >
              شرکت در نظرسنجی
              <svg className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
