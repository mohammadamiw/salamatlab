import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CanonicalTag from '@/components/CanonicalTag';
import MetaTags from '@/components/MetaTags';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '@/hooks/useDoctors';
import { ArrowLeft, Baby, MapPin, Clock, Phone, Star, Search, Award, Shield, Heart } from 'lucide-react';
import type { Doctor } from '@/data/featuredDoctors';

const PediatricDoctors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch pediatric doctors specifically
  const { doctors: pediatricDoctors, loading, error } = useDoctors({
    selectedSpecialty: 'اطفال'
  });

  // Filter doctors based on search
  const filteredDoctors = (() => {
    const query = searchQuery.trim().toLowerCase();
    
    const searched = query.length === 0
      ? pediatricDoctors
      : pediatricDoctors.filter(doctor =>
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

  // Add structured data for pediatric doctors
  useEffect(() => {
    if (!loading && filteredDoctors.length > 0) {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Create structured data for pediatric doctors
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "MedicalOrganization",
        "name": "پزشکان اطفال شهرقدس | آزمایشگاه تشخیص پزشکی سلامت",
        "description": "بهترین پزشکان متخصص اطفال در شهرقدس. مراقبت‌های کودکان، نوجوانان، واکسیناسیون و درمان بیماری‌های کودکان",
        "url": window.location.href,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "شهرقدس",
          "addressRegion": "تهران",
          "addressCountry": "IR"
        },
        "medicalSpecialty": "Pediatrics",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "خدمات اطفال",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure",
                "name": "ویزیت و معاینه کودکان"
              }
            },
            {
              "@type": "Offer", 
              "itemOffered": {
                "@type": "MedicalProcedure",
                "name": "واکسیناسیون کودکان"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure", 
                "name": "پیگیری رشد و تکامل"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure", 
                "name": "درمان بیماری‌های کودکان"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure", 
                "name": "مشاوره تغذیه کودک"
              }
            }
          ]
        },
        "physician": filteredDoctors.slice(0, 5).map(doctor => ({
          "@type": "Physician",
          "name": doctor.name,
          "medicalSpecialty": "Pediatrics",
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
            <div className="w-32 h-32 border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-orange-600 rounded-full animate-spin mx-auto" style={{animationDelay: '0.5s'}}></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mt-8 mb-4">در حال بارگذاری پزشکان اطفال...</h3>
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
      <CanonicalTag path="/doctors/pediatric" />
      <MetaTags
        title="پزشک اطفال شهرقدس | بهترین متخصص کودکان | دکتر اطفال قدس"
        description="بهترین پزشکان متخصص اطفال در شهرقدس. ویزیت کودکان، واکسیناسیون، پیگیری رشد و تکامل، درمان بیماری‌های کودکان. نوبت آنلاین"
        keywords="پزشک اطفال شهرقدس, متخصص کودکان شهرقدس, دکتر اطفال قدس, واکسیناسیون کودک, ویزیت کودک شهرقدس, رشد کودک, بیماری کودکان, متخصص اطفال قدس"
        ogImage="https://www.salamatlab.com/pediatric-doctors-preview.jpg"
        path="/doctors/pediatric"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 text-white rounded-3xl p-8 md:p-12 mb-12 shadow-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Baby className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              بهترین پزشکان اطفال شهرقدس
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-yellow-100">
              مراقبت تخصصی کودکان و نوجوانان با محبت و دقت بالا
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 p-4 rounded-xl">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">متخصص مجرب</h3>
                <p className="text-sm text-yellow-100">پزشکان کودکان باتجربه</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">محیط دوستانه</h3>
                <p className="text-sm text-yellow-100">فضای شاد برای کودکان</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <Heart className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">مراقبت کامل</h3>
                <p className="text-sm text-yellow-100">از تولد تا نوجوانی</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center flex items-center justify-center">
              <Search className="w-5 h-5 ml-2 text-orange-600" />
              جستجوی پزشک اطفال
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو بر اساس نام پزشک یا آدرس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-300"
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
            className="flex items-center gap-2 hover:bg-orange-50"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            بازگشت به لیست کل پزشکان
          </Button>
        </div>

        {/* Doctors Count */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            پزشکان متخصص اطفال در شهرقدس ({filteredDoctors.length} پزشک)
          </h2>
          <p className="text-gray-600">
            لیست کاملی از بهترین پزشکان متخصص اطفال در شهرقدس برای مراقبت از کودکان و نوجوانان
          </p>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <Card className="p-12 text-center border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">پزشک اطفال یافت نشد</h3>
            <p className="text-gray-600 mb-6">
              متاسفانه در حال حاضر پزشک اطفال با این مشخصات در شهرقدس در دسترس نیست
            </p>
            <Button
              onClick={() => navigate('/doctors')}
              className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
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
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-50/50 via-orange-50/50 to-red-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 p-8">
                  {/* Doctor Header */}
                  <div className="flex items-start space-x-6 space-x-reverse mb-6">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {doctor.image || '🧸'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-700 transition-colors duration-300">
                        {doctor.name}
                      </h3>
                      <Badge className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-full text-sm font-medium border-0 mb-2">
                        متخصص اطفال
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
                    <div className="bg-gradient-to-r from-gray-50 to-orange-50 p-4 rounded-2xl border border-gray-100">
                      <div className="text-gray-600 text-sm mb-1">شماره نظام:</div>
                      <div className="text-gray-800 font-bold">{doctor.licenseNumber}</div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-6 bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-orange-500 ml-3 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 text-sm leading-relaxed">{doctor.address}</p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  {doctor.workingHours && (
                    <div className="mb-6 bg-gradient-to-r from-gray-50 to-yellow-50 p-4 rounded-2xl border border-gray-100">
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
                            className="text-orange-600 hover:text-orange-700 text-sm font-semibold bg-gradient-to-r from-orange-100 to-yellow-100 hover:from-orange-200 hover:to-yellow-200 px-4 py-3 rounded-xl transition-all duration-300 flex items-center hover:scale-105 hover:shadow-md"
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

        {/* Pediatric Services Section */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 rounded-3xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
            <Baby className="w-8 h-8 ml-4 text-orange-600" />
            خدمات تخصصی اطفال
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">👶</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">ویزیت نوزادان</h3>
              <p className="text-sm text-gray-600">معاینه و مراقبت نوزادان تازه متولد شده</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">💉</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">واکسیناسیون</h3>
              <p className="text-sm text-gray-600">تزریق واکسن‌های ضروری طبق جدول</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">📏</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">پیگیری رشد</h3>
              <p className="text-sm text-gray-600">بررسی قد، وزن و تکامل کودک</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🍼</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">مشاوره تغذیه</h3>
              <p className="text-sm text-gray-600">راهنمایی تغذیه مناسب کودک</p>
            </div>
          </div>
        </Card>

        {/* Age Groups Section */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            مراقبت در گروه‌های سنی مختلف
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
              <div className="text-4xl mb-4">🍼</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">نوزادان</h3>
              <p className="text-sm text-gray-600">0 تا 1 سال</p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• معاینات دوره‌ای</li>
                <li>• واکسیناسیون</li>
                <li>• مشاوره تغذیه</li>
              </ul>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-4xl mb-4">🚼</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">شیرخواران</h3>
              <p className="text-sm text-gray-600">1 تا 3 سال</p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• پیگیری رشد</li>
                <li>• تکامل حرکتی</li>
                <li>• بیماری‌های شایع</li>
              </ul>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="text-4xl mb-4">🧒</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">کودکان</h3>
              <p className="text-sm text-gray-600">3 تا 12 سال</p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• بیماری‌های مدرسه</li>
                <li>• مشکلات رفتاری</li>
                <li>• تغذیه سالم</li>
              </ul>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <div className="text-4xl mb-4">👦</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">نوجوانان</h3>
              <p className="text-sm text-gray-600">12 تا 18 سال</p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• تغییرات بلوغ</li>
                <li>• مشکلات روانی</li>
                <li>• مشاوره سلامت</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Common Pediatric Conditions */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            بیماری‌های شایع کودکان
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🤒 بیماری‌های تنفسی</h3>
              <p className="text-sm text-gray-600">سرماخوردگی، برونشیت، آسم، عفونت‌های ریوی</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🤢 مشکلات گوارشی</h3>
              <p className="text-gray-600 text-sm">اسهال، یبوست، درد شکم، عفونت‌های گوارشی</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🌡️ تب و عفونت</h3>
              <p className="text-gray-600 text-sm">تب‌های مختلف، عفونت‌های باکتریایی و ویروسی</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🩹 مشکلات پوستی</h3>
              <p className="text-gray-600 text-sm">اگزما، آلرژی‌های پوستی، جوش‌های نوجوانی</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">🧠 مشکلات رشدی</h3>
              <p className="text-gray-600 text-sm">تاخیر در رشد، مشکلات تکامل، اختلالات یادگیری</p>
            </div>
            <div className="p-4 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl">
              <h3 className="font-bold text-gray-800 mb-3">😴 مشکلات خواب</h3>
              <p className="text-gray-600 text-sm">بی‌خوابی، کابوس‌های شبانه، اختلالات خواب</p>
            </div>
          </div>
        </Card>

        {/* SEO Content Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="w-6 h-6 ml-3 text-orange-600" />
              چرا پزشک اطفال در شهرقدس؟
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>ویزیت تخصصی کودکان و نوجوانان</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>واکسیناسیون کامل طبق جدول وزارت بهداشت</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>پیگیری رشد و تکامل کودک</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>مشاوره تغذیه مناسب سن</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>محیط دوستانه و شاد برای کودکان</span>
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
                <span>دسترسی آسان برای خانواده‌ها</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>پارکینگ مناسب برای والدین</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>نزدیکی به آزمایشگاه‌های کودکان</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>هزینه‌های مناسب‌تر</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>فضای بازی برای کودکان</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Vaccination Schedule */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <Shield className="w-6 h-6 ml-3 text-blue-600" />
            جدول واکسیناسیون کودکان
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="font-bold text-blue-800 mb-2">تولد</h3>
              <p className="text-sm text-gray-600">BCG، هپاتیت B</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="font-bold text-blue-800 mb-2">2 ماهگی</h3>
              <p className="text-sm text-gray-600">پنتاوالان، پولیو، PCV</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="font-bold text-blue-800 mb-2">4 ماهگی</h3>
              <p className="text-sm text-gray-600">پنتاوالان، پولیو، PCV</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="font-bold text-blue-800 mb-2">6 ماهگی</h3>
              <p className="text-sm text-gray-600">پنتاوالان، پولیو، PCV</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="font-bold text-blue-800 mb-2">9 ماهگی</h3>
              <p className="text-sm text-gray-600">سرخک</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="font-bold text-blue-800 mb-2">12 ماهگی</h3>
              <p className="text-sm text-gray-600">MMR، واریسلا</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="font-bold text-blue-800 mb-2">18 ماهگی</h3>
              <p className="text-sm text-gray-600">DPT، پولیو</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <h3 className="font-bold text-blue-800 mb-2">6 سالگی</h3>
              <p className="text-sm text-gray-600">DT، MMR</p>
            </div>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
              💡 <strong>نکته:</strong> برای دریافت جدول کامل واکسیناسیون با پزشک متخصص اطفال مشورت کنید
            </p>
          </div>
        </Card>

        {/* Emergency Tips for Parents */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 border-l-4 border-red-500 rounded-2xl">
          <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
            <Shield className="w-6 h-6 ml-3 text-red-600" />
            نکات مهم برای والدین
          </h2>
          <p className="text-red-700 mb-4 font-medium">در این موارد فوراً با پزشک اطفال تماس بگیرید:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-3 text-red-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full ml-3"></div>
                <span>تب بالای 38.5 درجه</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full ml-3"></div>
                <span>تنگی نفس شدید</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full ml-3"></div>
                <span>اسهال و استفراغ مداوم</span>
              </li>
            </ul>
            <ul className="space-y-3 text-red-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full ml-3"></div>
                <span>بی‌حالی و کم‌تحرکی</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full ml-3"></div>
                <span>تشنج یا لرزش</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full ml-3"></div>
                <span>رفض تغذیه مداوم</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 text-center">
            <a
              href="tel:115"
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Phone className="w-5 h-5 ml-3" />
              اورژانس کودکان: 115
            </a>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default PediatricDoctors;
