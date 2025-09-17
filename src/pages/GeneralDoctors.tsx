import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CanonicalTag from '@/components/CanonicalTag';
import MetaTags from '@/components/MetaTags';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '@/hooks/useDoctors';
import { ArrowLeft, Stethoscope, MapPin, Clock, Phone, Star, Search, Award, Shield, Activity } from 'lucide-react';
import type { Doctor } from '@/data/featuredDoctors';

const GeneralDoctors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch general doctors specifically
  const { doctors: generalDoctors, loading, error } = useDoctors({
    selectedSpecialty: 'عمومی'
  });

  // Filter doctors based on search
  const filteredDoctors = (() => {
    const query = searchQuery.trim().toLowerCase();
    
    const searched = query.length === 0
      ? generalDoctors
      : generalDoctors.filter(doctor =>
          doctor.name.toLowerCase().includes(query) ||
          (doctor.specialty || '').toLowerCase().includes(query) ||
          (doctor.address || '').toLowerCase().includes(query)
        );

    // Sort: featured first, then by rating desc
    return searched.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });
  })();

  // Add structured data for general doctors
  useEffect(() => {
    if (!loading && filteredDoctors.length > 0) {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Create structured data for general doctors
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "MedicalOrganization",
        "name": "پزشکان عمومی شهرقدس | آزمایشگاه تشخیص پزشکی سلامت",
        "description": "بهترین پزشکان عمومی در شهرقدس. ویزیت، معاینه، تشخیص اولیه بیماری‌ها و ارجاع به متخصصان مربوطه",
        "url": window.location.href,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "شهرقدس",
          "addressRegion": "تهران",
          "addressCountry": "IR"
        },
        "medicalSpecialty": "General Practice",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "خدمات پزشکی عمومی",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure",
                "name": "ویزیت و معاینه عمومی"
              }
            },
            {
              "@type": "Offer", 
              "itemOffered": {
                "@type": "MedicalProcedure",
                "name": "تشخیص اولیه بیماری‌ها"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure", 
                "name": "درمان بیماری‌های شایع"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure", 
                "name": "واکسیناسیون و پیشگیری"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure", 
                "name": "مشاوره سلامت"
              }
            }
          ]
        },
        "physician": filteredDoctors.slice(0, 5).map(doctor => ({
          "@type": "Physician",
          "name": doctor.name,
          "medicalSpecialty": "General Practice",
          "telephone": doctor.phones?.length > 0 ? doctor.phones[0] : undefined,
          "address": {
            "@type": "PostalAddress",
            "streetAddress": doctor.address,
            "addressLocality": "شهرقدس",
            "addressRegion": "تهران",
            "addressCountry": "IR"
          }
        }))
      };

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);

      // Cleanup function
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }
  }, [filteredDoctors, loading]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-light-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-emerald-600 rounded-full animate-spin mx-auto" style={{animationDelay: '0.5s'}}></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mt-8 mb-4">در حال بارگذاری پزشکان عمومی...</h3>
          <p className="text-gray-500">لطفاً صبر کنید</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-light-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="w-32 h-32 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-red-500 text-6xl">⚠️</div>
          </div>
          <h2 className="text-3xl font-bold text-red-600 mb-4">خطا در بارگذاری</h2>
          <p className="text-gray-600 text-lg mb-6">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
          >
            تلاش مجدد
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light-gradient">
      <CanonicalTag path="/doctors/general" />
      <MetaTags
        title="پزشک عمومی شهرقدس | بهترین دکتر عمومی قدس | ویزیت آنلاین"
        description="بهترین پزشکان عمومی در شهرقدس. ویزیت، معاینه، تشخیص اولیه بیماری‌ها، واکسیناسیون و مشاوره سلامت. نوبت آنلاین و تلفنی"
        keywords="پزشک عمومی شهرقدس, دکتر عمومی قدس, ویزیت پزشک شهرقدس, معاینه عمومی, تشخیص بیماری, واکسیناسیون, مشاوره سلامت شهرقدس, پزشک خانوادگی قدس"
        ogImage="https://www.salamatlab.com/general-doctors-preview.jpg"
        path="/doctors/general"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white rounded-3xl p-8 md:p-12 mb-12 shadow-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Stethoscope className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              بهترین پزشکان عمومی شهرقدس
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              ویزیت، معاینه و تشخیص اولیه بیماری‌ها با بهترین پزشکان عمومی
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 p-4 rounded-xl">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">پزشک مجرب</h3>
                <p className="text-sm text-green-100">سال‌ها تجربه بالینی</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">دسترسی آسان</h3>
                <p className="text-sm text-green-100">در سراسر شهرقدس</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">مراقبت جامع</h3>
                <p className="text-sm text-green-100">از پیشگیری تا درمان</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center flex items-center justify-center">
              <Search className="w-5 h-5 ml-2 text-green-600" />
              جستجوی پزشک عمومی
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو بر اساس نام پزشک یا آدرس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-300"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </div>
            </div>
          </div>
        </Card>

        {/* Back Button */}
        <div className="mb-6">
          <Button
            onClick={() => navigate('/doctors')}
            variant="outline"
            className="flex items-center gap-2 hover:bg-green-50"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            بازگشت به لیست کل پزشکان
          </Button>
        </div>

        {/* Doctors Count */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            پزشکان عمومی در شهرقدس ({filteredDoctors.length} پزشک)
          </h2>
          <p className="text-gray-600">
            لیست کاملی از بهترین پزشکان عمومی در شهرقدس برای ویزیت، معاینه و تشخیص اولیه بیماری‌ها
          </p>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <Card className="p-12 text-center border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">پزشک عمومی یافت نشد</h3>
            <p className="text-gray-600 mb-6">
              متاسفانه در حال حاضر پزشک عمومی با این مشخصات در شهرقدس در دسترس نیست
            </p>
            <Button
              onClick={() => navigate('/doctors')}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              مشاهده سایر پزشکان
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {filteredDoctors.map((doctor, index) => (
              <Card 
                key={doctor.licenseNumber} 
                className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white rounded-3xl"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                {/* Enhanced Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-50/50 via-emerald-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 p-8">
                  {/* Doctor Header */}
                  <div className="flex items-start space-x-6 space-x-reverse mb-6">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {doctor.image || '👨‍⚕️'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-700 transition-colors duration-300">
                        {doctor.name}
                      </h3>
                      <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium border-0 mb-2">
                        پزشک عمومی
                      </Badge>
                      {doctor.isFeatured && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium border-0">
                          <Star className="w-3 h-3 ml-1" />
                          پزشک ممتاز
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* License */}
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-2xl border border-gray-100">
                      <div className="text-gray-600 text-sm mb-1">شماره نظام:</div>
                      <div className="text-gray-800 font-bold">{doctor.licenseNumber}</div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-6 bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-green-500 ml-3 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 text-sm leading-relaxed">{doctor.address}</p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  {doctor.workingHours && (
                    <div className="mb-6 bg-gradient-to-r from-gray-50 to-emerald-50 p-4 rounded-2xl border border-gray-100">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-blue-500 ml-3 flex-shrink-0" />
                        <span className="text-gray-700 text-sm font-medium">{doctor.workingHours}</span>
                      </div>
                    </div>
                  )}

                  {/* Phone Numbers */}
                  {doctor.phones && doctor.phones.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-3">
                        {doctor.phones.map((phone, phoneIndex) => (
                          <a 
                            key={phoneIndex}
                            href={`tel:${phone}`}
                            className="text-green-600 hover:text-green-700 text-sm font-semibold bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 px-4 py-3 rounded-xl transition-all duration-300 flex items-center hover:scale-105 hover:shadow-md"
                          >
                            <Phone className="w-4 h-4 ml-2" />
                            {phone}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Rating */}
                  {doctor.rating && (
                    <div className="flex items-center justify-center pt-4 border-t border-gray-100">
                      <div className="flex items-center">
                        <Star className="w-5 h-5 text-yellow-500 fill-current ml-1" />
                        <span className="text-gray-700 font-medium">{doctor.rating}</span>
                        <span className="text-gray-500 text-sm mr-1">از 5</span>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Services Section */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
            <Activity className="w-8 h-8 ml-4 text-green-600" />
            خدمات پزشکان عمومی
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🩺</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">ویزیت و معاینه</h3>
              <p className="text-sm text-gray-600">معاینه کامل و تشخیص اولیه بیماری‌ها</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">💊</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">درمان بیماری‌ها</h3>
              <p className="text-sm text-gray-600">درمان بیماری‌های شایع و مزمن</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">💉</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">واکسیناسیون</h3>
              <p className="text-sm text-gray-600">تزریق واکسن‌های مختلف و پیشگیری</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">مشاوره سلامت</h3>
              <p className="text-sm text-gray-600">راهنمایی و مشاوره در زمینه سلامت</p>
            </div>
          </div>
        </Card>

        {/* SEO Content Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="w-6 h-6 ml-3 text-green-600" />
              چرا پزشک عمومی در شهرقدس؟
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>تشخیص سریع و دقیق بیماری‌های شایع</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>ارجاع مناسب به متخصصان در صورت نیاز</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>مراقبت‌های پیشگیرانه و واکسیناسیون</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>مشاوره سلامت برای تمام خانواده</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>پیگیری درمان بیماری‌های مزمن</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <MapPin className="w-6 h-6 ml-3 text-blue-600" />
              مزایای انتخاب پزشک در شهرقدس
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>دسترسی آسان از تمام نقاط تهران</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>امکانات پارکینگ مناسب</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>نزدیکی به داروخانه‌ها و آزمایشگاه‌ها</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>هزینه‌های مقرون‌به‌صرفه</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>محیط آرام و دوستانه</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Common Conditions */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            بیماری‌های شایع قابل درمان توسط پزشک عمومی
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🤒 بیماری‌های تنفسی</h3>
              <p className="text-sm text-gray-600">سرماخوردگی، آنفولانزا، برونشیت، عفونت‌های ریوی</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🩸 بیماری‌های قلبی عروقی</h3>
              <p className="text-sm text-gray-600">فشار خون، کلسترول بالا، بیماری‌های قلبی ساده</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🍯 بیماری‌های متابولیک</h3>
              <p className="text-sm text-gray-600">دیابت، اختلالات تیروئید، چاقی</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🦠 عفونت‌ها</h3>
              <p className="text-sm text-gray-600">عفونت‌های ادراری، پوستی، گوارشی</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🧠 مشکلات روانی</h3>
              <p className="text-sm text-gray-600">اضطراب، افسردگی خفیف، استرس</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">💊 بیماری‌های مزمن</h3>
              <p className="text-sm text-gray-600">آرتریت، میگرن، آلرژی‌ها</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default GeneralDoctors;
