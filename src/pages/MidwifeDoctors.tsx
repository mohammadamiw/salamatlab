import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CanonicalTag from '@/components/CanonicalTag';
import MetaTags from '@/components/MetaTags';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { useDoctors } from '@/hooks/useDoctors';
import { ArrowLeft, Baby, MapPin, Clock, Phone, Star, Search, Award, Heart, Shield } from 'lucide-react';
import type { Doctor } from '@/data/featuredDoctors';

const MidwifeDoctors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch midwife doctors specifically
  const { doctors: midwifeDoctors, loading, error } = useDoctors({
    selectedSpecialty: 'ماما'
  });

  // Filter doctors based on search
  const filteredDoctors = (() => {
    const query = searchQuery.trim().toLowerCase();
    
    const searched = query.length === 0
      ? midwifeDoctors
      : midwifeDoctors.filter(doctor =>
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

  // Add structured data for midwife doctors
  useEffect(() => {
    if (!loading && filteredDoctors.length > 0) {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Create structured data for midwife doctors
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "MedicalOrganization",
        "name": "ماماها و متخصصان مامایی شهرقدس | آزمایشگاه تشخیص پزشکی سلامت",
        "description": "بهترین ماماها و متخصصان مامایی در شهرقدس. مراقبت‌های بارداری، زایمان طبیعی، آموزش والدین و مشاوره تغذیه مادر و کودک",
        "url": window.location.href,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "شهرقدس",
          "addressRegion": "تهران",
          "addressCountry": "IR"
        },
        "medicalSpecialty": "Midwifery",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "خدمات مامایی",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure",
                "name": "مراقبت‌های دوران بارداری"
              }
            },
            {
              "@type": "Offer", 
              "itemOffered": {
                "@type": "MedicalProcedure",
                "name": "کمک در زایمان طبیعی"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure", 
                "name": "آموزش شیردهی"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure", 
                "name": "مراقبت‌های بعد از زایمان"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "MedicalProcedure", 
                "name": "مشاوره تغذیه مادر"
              }
            }
          ]
        },
        "physician": filteredDoctors.slice(0, 5).map(doctor => ({
          "@type": "Physician",
          "name": doctor.name,
          "medicalSpecialty": "Midwifery",
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
            <div className="w-32 h-32 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-rose-600 rounded-full animate-spin mx-auto" style={{animationDelay: '0.5s'}}></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mt-8 mb-4">در حال بارگذاری ماماها...</h3>
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
      <CanonicalTag path="/doctors/midwife" />
      <MetaTags
        title="ماما شهرقدس | بهترین متخصص مامایی | ماما قدس | زایمان طبیعی"
        description="بهترین ماماها و متخصصان مامایی در شهرقدس. کمک در زایمان طبیعی، مراقبت‌های بارداری، آموزش شیردهی و مشاوره تغذیه مادر و کودک"
        keywords="ماما شهرقدس, متخصص مامایی شهرقدس, ماما قدس, زایمان طبیعی, مراقبت بارداری, شیردهی, مشاوره تغذیه مادر, ماما در منزل شهرقدس"
        ogImage="https://www.salamatlab.com/midwife-doctors-preview.jpg"
        path="/doctors/midwife"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-purple-600 text-white rounded-3xl p-8 md:p-12 mb-12 shadow-2xl">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/20 p-4 rounded-full">
                <Baby className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              بهترین ماماها و متخصصان مامایی شهرقدس
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-pink-100">
              همراهی در زایمان طبیعی و مراقبت‌های تخصصی مادر و کودک
            </p>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="bg-white/10 p-4 rounded-xl">
                <Award className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">ماما مجرب</h3>
                <p className="text-sm text-pink-100">سال‌ها تجربه زایمان</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <Heart className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">مراقبت محبت‌آمیز</h3>
                <p className="text-sm text-pink-100">با دلسوزی و مهربانی</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <h3 className="font-bold">زایمان ایمن</h3>
                <p className="text-sm text-pink-100">با بالاترین ایمنی</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-4 text-center flex items-center justify-center">
              <Search className="w-5 h-5 ml-2 text-pink-600" />
              جستجوی ماما
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder="جستجو بر اساس نام ماما یا آدرس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 border-2 border-gray-200 rounded-xl focus:border-pink-500 focus:ring-4 focus:ring-pink-100 transition-all duration-300"
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
            className="flex items-center gap-2 hover:bg-pink-50"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            بازگشت به لیست کل پزشکان
          </Button>
        </div>

        {/* Doctors Count */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ماماها و متخصصان مامایی در شهرقدس ({filteredDoctors.length} ماما)
          </h2>
          <p className="text-gray-600">
            لیست کاملی از بهترین ماماها و متخصصان مامایی در شهرقدس برای همراهی در زایمان و مراقبت از مادر و کودک
          </p>
        </div>

        {/* Doctors Grid */}
        {filteredDoctors.length === 0 ? (
          <Card className="p-12 text-center border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">ماما یافت نشد</h3>
            <p className="text-gray-600 mb-6">
              متاسفانه در حال حاضر ماما با این مشخصات در شهرقدس در دسترس نیست
            </p>
            <Button
              onClick={() => navigate('/doctors')}
              className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
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
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 via-rose-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10 p-8">
                  {/* Doctor Header */}
                  <div className="flex items-start space-x-6 space-x-reverse mb-6">
                    <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                      {doctor.image || '🤱'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-700 transition-colors duration-300">
                        {doctor.name}
                      </h3>
                      <Badge className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium border-0 mb-2">
                        ماما
                      </Badge>
                      {doctor.isFeatured && (
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-medium border-0">
                          <Star className="w-3 h-3 ml-1" />
                          ماما ممتاز
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* License */}
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-gray-50 to-pink-50 p-4 rounded-2xl border border-gray-100">
                      <div className="text-gray-600 text-sm mb-1">شماره نظام:</div>
                      <div className="text-gray-800 font-bold">{doctor.licenseNumber}</div>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-6 bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-start">
                      <MapPin className="w-5 h-5 text-pink-500 ml-3 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700 text-sm leading-relaxed">{doctor.address}</p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  {doctor.workingHours && (
                    <div className="mb-6 bg-gradient-to-r from-gray-50 to-rose-50 p-4 rounded-2xl border border-gray-100">
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
                            className="text-pink-600 hover:text-pink-700 text-sm font-semibold bg-gradient-to-r from-pink-100 to-rose-100 hover:from-pink-200 hover:to-rose-200 px-4 py-3 rounded-xl transition-all duration-300 flex items-center hover:scale-105 hover:shadow-md"
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

        {/* Midwifery Services Section */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 rounded-3xl">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center">
            <Baby className="w-8 h-8 ml-4 text-pink-600" />
            خدمات تخصصی مامایی
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🤰</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">مراقبت بارداری</h3>
              <p className="text-sm text-gray-600">پیگیری دوران بارداری و آماده‌سازی</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">👶</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">کمک در زایمان</h3>
              <p className="text-sm text-gray-600">همراهی در زایمان طبیعی</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🍼</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">آموزش شیردهی</h3>
              <p className="text-sm text-gray-600">آموزش روش‌های صحیح شیردهی</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">مراقبت در منزل</h3>
              <p className="text-sm text-gray-600">خدمات مامایی در منزل</p>
            </div>
          </div>
        </Card>

        {/* Birth Process Guide */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            مراحل زایمان طبیعی
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
              <div className="text-4xl mb-4">🌅</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">مرحله اول</h3>
              <p className="text-sm text-gray-600 mb-3"><strong>شروع درد زایمان</strong></p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• انقباضات منظم</li>
                <li>• باز شدن دهانه رحم</li>
                <li>• پشتیبانی روحی مادر</li>
              </ul>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl">
              <div className="text-4xl mb-4">👶</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">مرحله دوم</h3>
              <p className="text-sm text-gray-600 mb-3"><strong>خروج نوزاد</strong></p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• هدایت فشار دادن</li>
                <li>• کمک به خروج نوزاد</li>
                <li>• بررسی سلامت نوزاد</li>
              </ul>
            </div>
            <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl">
              <div className="text-4xl mb-4">🌸</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">مرحله سوم</h3>
              <p className="text-sm text-gray-600 mb-3"><strong>خروج جفت</strong></p>
              <ul className="text-xs text-gray-500 space-y-1">
                <li>• خروج کامل جفت</li>
                <li>• کنترل خونریزی</li>
                <li>• مراقبت اولیه مادر</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* SEO Content Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Award className="w-6 h-6 ml-3 text-pink-600" />
              چرا ماما در شهرقدس؟
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>همراهی در زایمان طبیعی و ایمن</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>آموزش کامل شیردهی و مراقبت نوزاد</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>پشتیبانی روحی و عاطفی مادر</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>مراقبت‌های بعد از زایمان</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>مشاوره تغذیه مادر شیرده</span>
              </li>
            </ul>
          </Card>

          <Card className="p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <MapPin className="w-6 h-6 ml-3 text-green-600" />
              مزایای انتخاب ماما در شهرقدس
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>دسترسی آسان در زمان زایمان</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>امکان خدمات در منزل</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>نزدیکی به بیمارستان‌ها</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>هزینه‌های مناسب‌تر</span>
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                <span>محیط آرام و صمیمی</span>
              </li>
            </ul>
          </Card>
        </div>

        {/* Breastfeeding Guide */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center flex items-center justify-center">
            <Heart className="w-6 h-6 ml-3 text-blue-600" />
            راهنمای شیردهی موثر
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">🍼 تکنیک‌های شیردهی</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                  <span>موقعیت صحیح نوزاد</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                  <span>چسبیدن مناسب به سینه</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                  <span>تشخیص گرسنگی نوزاد</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">🌟 مزایای شیر مادر</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                  <span>تقویت سیستم ایمنی</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                  <span>تغذیه کامل و متعادل</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 ml-3 flex-shrink-0"></div>
                  <span>ایجاد رابطه عاطفی</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Emergency Contact */}
        <Card className="p-8 mb-12 border-0 shadow-xl bg-gradient-to-r from-red-100 via-pink-100 to-rose-100 border-l-4 border-red-500 rounded-2xl">
          <h2 className="text-2xl font-bold text-red-800 mb-4 flex items-center">
            <Shield className="w-6 h-6 ml-3 text-red-600" />
            علائم شروع زایمان
          </h2>
          <p className="text-red-700 mb-4 font-medium">در صورت مشاهده این علائم فوراً با ماما تماس بگیرید:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-3 text-red-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full ml-3"></div>
                <span>انقباضات منظم و دردناک</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full ml-3"></div>
                <span>ترکیدن کیسه آب</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full ml-3"></div>
                <span>خونریزی واژینال</span>
              </li>
            </ul>
            <ul className="space-y-3 text-red-700">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full ml-3"></div>
                <span>کاهش حرکات جنین</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full ml-3"></div>
                <span>درد شدید کمر</span>
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full ml-3"></div>
                <span>فشار شدید در لگن</span>
              </li>
            </ul>
          </div>
          <div className="mt-6 text-center">
            <a
              href="tel:115"
              className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Phone className="w-5 h-5 ml-3" />
              اورژانس زایمان: 115
            </a>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default MidwifeDoctors;
