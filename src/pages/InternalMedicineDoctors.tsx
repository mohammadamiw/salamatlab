import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CanonicalTag from '@/components/CanonicalTag';
import MetaTags from '@/components/MetaTags';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '@/hooks/useDoctors';
import { ArrowLeft, Stethoscope, MapPin, Clock, Phone, Star, Search, Award, Activity, Shield } from 'lucide-react';
import type { Doctor } from '@/data/featuredDoctors';

const InternalMedicineDoctors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch internal medicine doctors specifically
  const { doctors: internalDoctors, loading, error } = useDoctors({
    selectedSpecialty: 'داخلی'
  });

  // Filter doctors based on search
  const filteredDoctors = (() => {
    const query = searchQuery.trim().toLowerCase();
    
    const searched = query.length === 0
      ? internalDoctors
      : internalDoctors.filter(doctor =>
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

  // Add structured data for internal medicine doctors
  useEffect(() => {
    if (!loading && filteredDoctors.length > 0) {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Create structured data for internal medicine doctors
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "MedicalOrganization",
        "name": "پزشکان داخلی شهرقدس | آزمایشگاه تشخیص پزشکی سلامت",
        "description": "بهترین پزشکان متخصص داخلی در شهرقدس. تشخیص و درمان بیماری‌های داخلی، دیابت، فشار خون، بیماری‌های مزمن و اختلالات متابولیک",
        "url": window.location.href,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "شهرقدس",
          "addressRegion": "تهران",
          "addressCountry": "IR"
        },
        "medicalSpecialty": "Internal Medicine",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "خدمات طب داخلی",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure",
                "name": "تشخیص و درمان دیابت"
              }
            },
            {
              "@type": "Offer", 
              "itemOffered": {
                "@type": "MedicalProcedure",
                "name": "درمان فشار خون"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure", 
                "name": "درمان بیماری‌های کلیوی"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure", 
                "name": "درمان بیماری‌های گوارشی"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure", 
                "name": "پیگیری بیماری‌های مزمن"
              }
            }
          ]
        },
        "physician": filteredDoctors.slice(0, 5).map(doctor => ({
          "@type": "Physician",
          "name": doctor.name,
          "medicalSpecialty": "Internal Medicine",
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
            <div className="w-32 h-32 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-indigo-600 rounded-full animate-spin mx-auto" style={{animationDelay: '0.5s'}}></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mt-8 mb-4">در حال بارگذاری پزشکان داخلی...</h3>
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
      <CanonicalTag path="/doctors/internal-medicine" />
      <MetaTags
        title="پزشک داخلی شهرقدس | بهترین متخصص طب داخلی | دکتر داخلی قدس"
        description="بهترین پزشکان متخصص داخلی در شهرقدس. تشخیص و درمان دیابت، فشار خون، بیماری‌های کلیوی، گوارشی و اختلالات متابولیک. نوبت آنلاین"
        keywords="پزشک داخلی شهرقدس, متخصص طب داخلی شهرقدس, دکتر داخلی قدس, دیابت, فشار خون, بیماری کلیه, گوارش, متابولیسم, طب داخلی قدس"
        ogImage="https://www.salamatlab.com/internal-medicine-doctors-preview.jpg"
        path="/doctors/internal-medicine"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 text-white rounded-3xl p-8 md:p-12 mb-12 shadow-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Stethoscope className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              بهترین پزشکان داخلی شهرقدس
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100">
              تشخیص و درمان تخصصی بیماری‌های داخلی با بالاترین استانداردهای پزشکی
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 p-4 rounded-xl">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">متخصص مجرب</h3>
                <p className="text-sm text-purple-100">سال‌ها تجربه بالینی</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <Activity className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">تشخیص دقیق</h3>
                <p className="text-sm text-purple-100">با جدیدترین روش‌ها</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">درمان جامع</h3>
                <p className="text-sm text-purple-100">بیماری‌های مزمن</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center flex items-center justify-center">
              <Search className="w-5 h-5 ml-2 text-purple-600" />
              جستجوی پزشک داخلی
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو بر اساس نام پزشک یا آدرس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300"
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
            className="flex items-center gap-2 hover:bg-purple-50"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            بازگشت به لیست کل پزشکان
          </Button>
        </div>

        {/* Doctors Count */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            پزشکان متخصص داخلی در شهرقدس ({filteredDoctors.length} پزشک)
          </h2>
          <p className="text-gray-600">
            لیست کاملی از بهترین پزشکان متخصص داخلی در شهرقدس برای تشخیص و درمان بیماری‌های داخلی
          </p>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <Card className="p-12 text-center border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">پزشک داخلی یافت نشد</h3>
            <p className="text-gray-600 mb-6">
              متاسفانه در حال حاضر پزشک داخلی با این مشخصات در شهرقدس در دسترس نیست
            </p>
            <Button
              onClick={() => navigate('/doctors')}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
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
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-indigo-50/50 to-blue-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 p-8">
                  {/* Doctor Header */}
                  <div className="flex items-start space-x-6 space-x-reverse mb-6">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {doctor.image || '💊'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors duration-300">
                        {doctor.name}
                      </h3>
                      <Badge className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium border-0 mb-2">
                        متخصص داخلی
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
                    <div className="bg-gradient-to-r from-gray-50 to-purple-50 p-4 rounded-2xl border border-gray-100">
                      <div className="text-gray-600 text-sm mb-1">شماره نظام:</div>
                      <div className="text-gray-800 font-bold">{doctor.licenseNumber}</div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-6 bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-purple-500 ml-3 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 text-sm leading-relaxed">{doctor.address}</p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  {doctor.workingHours && (
                    <div className="mb-6 bg-gradient-to-r from-gray-50 to-indigo-50 p-4 rounded-2xl border border-gray-100">
                      <div className="flex items-center">
                        <Clock className="w-5 h-5 text-green-500 ml-3 flex-shrink-0" />
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
                            className="text-purple-600 hover:text-purple-700 text-sm font-semibold bg-gradient-to-r from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 px-4 py-3 rounded-xl transition-all duration-300 flex items-center hover:scale-105 hover:shadow-md"
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

        {/* Internal Medicine Services Section */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-3xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
            <Activity className="w-8 h-8 ml-4 text-purple-600" />
            خدمات تخصصی طب داخلی
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🩸</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">درمان دیابت</h3>
              <p className="text-sm text-gray-600">کنترل قند خون و پیشگیری از عوارض</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">💓</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">فشار خون</h3>
              <p className="text-sm text-gray-600">تشخیص و درمان اختلالات فشار خون</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🫘</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">بیماری‌های کلیوی</h3>
              <p className="text-sm text-gray-600">درمان نارسایی کلیه و سنگ کلیه</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🦴</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">بیماری‌های متابولیک</h3>
              <p className="text-sm text-gray-600">اختلالات تیروئید و متابولیسم</p>
            </div>
          </div>
        </Card>

        {/* Common Internal Medicine Conditions */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            بیماری‌های شایع قابل درمان در طب داخلی
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🩸 بیماری‌های خونی</h3>
              <p className="text-sm text-gray-600">دیابت، کم‌خونی، اختلالات انعقاد خون</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🫁 بیماری‌های ریوی</h3>
              <p className="text-gray-600 text-sm">آسم، برونشیت، عفونت‌های ریوی</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🫘 بیماری‌های کلیوی</h3>
              <p className="text-gray-600 text-sm">نارسایی کلیه، سنگ کلیه، عفونت ادراری</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🍽️ بیماری‌های گوارشی</h3>
              <p className="text-gray-600 text-sm">گاستریت، زخم معده، سندرم روده تحریک‌پذیر</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">⚡ بیماری‌های متابولیک</h3>
              <p className="text-gray-600 text-sm">اختلالات تیروئید، چاقی، سندرم متابولیک</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🦴 بیماری‌های مفاصل</h3>
              <p className="text-gray-600 text-sm">آرتریت روماتوئید، اختلالات التهابی</p>
            </div>
          </div>
        </Card>

        {/* Chronic Disease Management */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <Shield className="w-6 h-6 ml-3 text-indigo-600" />
            مدیریت بیماری‌های مزمن
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">📊 پیگیری منظم</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                  <span>کنترل دوره‌ای آزمایشات</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                  <span>تنظیم دوز داروها</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                  <span>پیشگیری از عوارض</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 درمان هدفمند</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                  <span>برنامه درمانی شخصی</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                  <span>مشاوره تغذیه و ورزش</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                  <span>آموزش خودمراقبتی</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* SEO Content Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="w-6 h-6 ml-3 text-purple-600" />
              چرا پزشک داخلی در شهرقدس؟
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>تشخیص دقیق بیماری‌های پیچیده</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>مدیریت جامع بیماری‌های مزمن</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>درمان چندین بیماری همزمان</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>پیگیری طولانی مدت بیماران</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>هماهنگی با سایر متخصصان</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <MapPin className="w-6 h-6 ml-3 text-green-600" />
              مزایای انتخاب پزشک در شهرقدس
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>دسترسی آسان برای ویزیت‌های مکرر</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>امکانات پارکینگ مناسب</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>نزدیکی به آزمایشگاه‌ها</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>هزینه‌های مناسب‌تر</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>محیط آرام برای بیماران مزمن</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Diabetes Management Guide */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            راهنمای مدیریت دیابت
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-blue-800 mb-4 flex items-center">
                <div className="text-2xl ml-3">🍎</div>
                تغذیه مناسب
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• کنترل کربوهیدرات‌ها</li>
                <li>• مصرف فیبر بالا</li>
                <li>• اجتناب از شیرینی</li>
                <li>• وعده‌های منظم غذایی</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-blue-800 mb-4 flex items-center">
                <div className="text-2xl ml-3">🏃‍♂️</div>
                ورزش منظم
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• پیاده‌روی روزانه</li>
                <li>• ورزش‌های هوازی</li>
                <li>• تقویت عضلات</li>
                <li>• کنترل قند بعد از ورزش</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-blue-800 mb-4 flex items-center">
                <div className="text-2xl ml-3">💊</div>
                مصرف دارو
              </h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• مصرف منظم داروها</li>
                <li>• کنترل قند خون</li>
                <li>• پیگیری با پزشک</li>
                <li>• تنظیم دوز در صورت نیاز</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* When to See Internal Medicine Doctor */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-gradient-to-r from-orange-100 via-yellow-100 to-red-100 border-l-4 border-orange-500 rounded-2xl">
          <h2 className="text-2xl font-bold text-orange-800 mb-4 flex items-center">
            <Activity className="w-6 h-6 ml-3 text-orange-600" />
            چه زمانی به پزشک داخلی مراجعه کنیم؟
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-orange-700 mb-3">🚨 علائم هشدار دهنده</h3>
              <ul className="space-y-2 text-orange-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full ml-3"></div>
                  <span>تشنگی و ادرار زیاد</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full ml-3"></div>
                  <span>خستگی مداوم</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full ml-3"></div>
                  <span>کاهش وزن ناگهانی</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full ml-3"></div>
                  <span>سردرد مداوم</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-orange-700 mb-3">🔄 پیگیری‌های دوره‌ای</h3>
              <ul className="space-y-2 text-orange-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full ml-3"></div>
                  <span>کنترل دیابت و فشار خون</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full ml-3"></div>
                  <span>بررسی عملکرد کلیه</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full ml-3"></div>
                  <span>آزمایش‌های دوره‌ای</span>
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full ml-3"></div>
                  <span>تنظیم داروهای مزمن</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default InternalMedicineDoctors;
