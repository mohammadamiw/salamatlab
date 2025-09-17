
import React, { useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '@/hooks/useDoctors';
import StaggeredReveal from './StaggeredReveal';
import { User, Stethoscope, MapPin, Clock, Phone, Award, Users, BookOpen, ArrowRight, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const CityDoctors = () => {
  const navigate = useNavigate();
  const { doctors: doctorsList, loading, error } = useDoctors({ all: true });
  const isMobile = useIsMobile();
  
  // Pick exactly 4 highlighted doctors from different specialties
  const filteredDoctors = useMemo(() => {
    const desiredNames = [
      'دکتر مریم انتظارقائم', // عمومی
      'دکتر فاطمه کاظمی جهرمی', // داخلی
      'دکتر منعم رشدی', // اورولوژی
      'دکتر مریم مسلمی', // ماما
    ];

    const list = [...doctorsList];
    const selected = desiredNames
      .map((target) => list.find((d) => d.name === target))
      .filter(Boolean) as typeof doctorsList;

    return selected.slice(0, 4);
  }, [doctorsList]);

  // Loading state
  if (loading) {
    return (
      <section id="city-doctors" className="py-12 md:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-float"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-float" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mb-6 md:mb-8 shadow-2xl animate-rotate-in">
              <Stethoscope className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded-full w-48 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded-full w-64 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-full w-32"></div>
            </div>
            <p className="text-gray-600 text-base md:text-lg mt-4 md:mt-6 animate-fade-in-up">در حال بارگذاری لیست پزشکان...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="city-doctors" className="py-12 md:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl mb-8 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-red-600 mb-4">خطا در بارگذاری</h2>
            <p className="text-gray-600 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  const doctorsToRender = isMobile ? filteredDoctors.slice(0, 2) : filteredDoctors;

  return (
    <section id="city-doctors" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-float"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-green-200 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-float" style={{animationDelay: '4s'}}></div>
      </div>
      
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10 md:mb-20">
          {/* Enhanced Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-28 md:h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mb-6 md:mb-8 shadow-2xl transform hover:scale-110 transition-transform duration-500 animate-rotate-in">
              <Stethoscope className="w-10 h-10 md:w-14 md:h-14 text-white" />
          </div>
          
          {/* Enhanced Title */}
            <div className="mb-4 md:mb-6 animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3 md:mb-4 animate-gradient-shift">
              پزشکان برتر شهر
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full animate-fade-in-up" style={{animationDelay: '0.3s'}}></div>
          </div>
          
            <p className="text-gray-600 text-base md:text-xl max-w-2xl md:max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            بهترین پزشکان در شهر
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 space-x-reverse mt-8 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Users className="w-5 h-5 text-blue-600 animate-pulse-scale" />
              <span className="text-gray-600 font-medium">۴ پزشک منتخب</span>
            </div>
            <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Award className="w-5 h-5 text-purple-600 animate-pulse-scale" style={{animationDelay: '1.5s'}} />
              <span className="text-gray-600 font-medium">کیفیت برتر</span>
            </div>
          </div>
        </div>

          {/* Specialties removed per request; only general doctors are shown */}

        {/* No specialty toggle */}

        {/* Enhanced Doctors Count Display */}
          <div className="mb-6 md:mb-8 text-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
          <div className="inline-flex items-center space-x-3 space-x-reverse bg-gradient-to-r from-blue-50 to-indigo-50 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-lg border border-blue-100">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-gray-700 font-medium text-lg">
              نمایش {filteredDoctors.length} پزشک
            </span>
          </div>
        </div>
        
        {/* Enhanced Doctors Grid */}
        <StaggeredReveal 
          staggerDelay={150} 
          direction="up" 
          duration={700}
          className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16 max-w-6xl mx-auto"
        >
          {doctorsToRender.map((doctor) => (
            <Card key={doctor.licenseNumber} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/90 backdrop-blur-sm rounded-3xl hover-lift hover-glow">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
                <div className="relative z-10 p-6 md:p-8">
                {/* Enhanced Doctor Header */}
                <div className="flex items-start space-x-6 space-x-reverse mb-8">
                    <div className="text-4xl md:text-6xl group-hover:scale-110 transition-transform duration-300">
                    {doctor.image}
                  </div>
                  <div className="flex-1">
                     <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-2 md:mb-3 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                      {doctor.name}
                    </h3>
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium border-0 mb-3">{(doctor as any).category || doctor.specialty}</Badge>
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed line-clamp-3">{doctor.description}</p>
                  </div>
                </div>

                {/* Enhanced License & Rating */}
                <div className="grid grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                  <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-gray-600 font-medium">شماره نظام:</span>
                    <span className="text-gray-800 font-bold">{doctor.licenseNumber}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-purple-50 p-4 rounded-2xl border border-gray-100">
                    <span className="text-gray-600 font-medium">امتیاز:</span>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-500 fill-current mr-2" />
                      <span className="text-gray-800 font-bold text-lg">{doctor.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Enhanced Address */}
                <div className="mb-4 md:mb-6 bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-gray-700 text-base flex items-start">
                    <MapPin className="w-5 h-5 text-blue-500 ml-3 mt-0.5" />
                    <span className="leading-relaxed">{doctor.address}</span>
                  </p>
                </div>

                {/* Enhanced Working Hours */}
                <div className="mb-4 md:mb-6 bg-gradient-to-r from-gray-50 to-orange-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-gray-700 text-base flex items-center">
                    <Clock className="w-5 h-5 text-green-500 ml-3" />
                    <span className="font-semibold">{doctor.workingHours}</span>
                  </p>
                </div>

                {/* Enhanced Phone Numbers */}
                <div className="mb-4 md:mb-6">
                  <div className="flex flex-wrap gap-3">
                    {doctor.phones.map((phone, phoneIndex) => (
                      <a 
                        key={phoneIndex}
                        href={`tel:${phone}`}
                        className="text-blue-600 hover:text-blue-700 text-base font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 px-4 py-3 rounded-xl transition-all duration-300 flex items-center hover:scale-105 hover-lift"
                      >
                        <Phone className="w-4 h-4 ml-2" />
                        {phone}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </StaggeredReveal>

        {/* Enhanced View All Button */}
        <div className="text-center animate-fade-in-up" style={{animationDelay: '0.6s'}}>
          <Card className="inline-block p-6 md:p-10 border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-3xl hover-lift hover-glow">
            <div className="mb-4 md:mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">
                پزشکان برتر شهر
              </h3>
              <p className="text-blue-100 text-base md:text-lg leading-relaxed">
                ۴ پزشک منتخب از تخصص‌های مختلف + دسترسی کامل
              </p>
            </div>
            <Button 
              onClick={() => navigate('/doctors')}
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 md:px-10 py-3 md:py-4 text-base md:text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover-glow group"
            >
              مشاهده همه پزشکان
              <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CityDoctors;
