import React, { useEffect } from 'react';
import Header from '@/components/Header';
import CanonicalTag from '@/components/CanonicalTag';
import MetaTags from '@/components/MetaTags';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Clock, Phone, Star, Award, Users, Stethoscope, Activity, Heart } from 'lucide-react';

const LocalDoctorsLanding = () => {
  const navigate = useNavigate();

  // Add structured data for local doctors
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "MedicalOrganization",
      "name": "پزشکان شهرقدس | آزمایشگاه تشخیص پزشکی سلامت",
      "description": "بهترین پزشکان متخصص در شهرقدس. اورولوژی، ارتوپدی، زنان و زایمان، قلب و عروق، اطفال و سایر تخصص‌های پزشکی",
      "url": window.location.href,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "شهرقدس",
        "addressRegion": "تهران",
        "addressCountry": "IR"
      },
      "areaServed": {
        "@type": "City",
        "name": "شهرقدس"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "خدمات پزشکی شهرقدس",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "مشاوره پزشک اورولوژی"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "مشاوره پزشک ارتوپدی"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "MedicalProcedure",
              "name": "مشاوره پزشک زنان"
            }
          }
        ]
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "35.7219",
        "longitude": "51.1157"
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const specialties = [
    {
      name: 'عمومی',
      title: 'پزشک عمومی شهرقدس',
      description: 'ویزیت، معاینه و تشخیص اولیه بیماری‌های شایع',
      icon: '👨‍⚕️',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      link: '/doctors/general',
      keywords: 'ویزیت، معاینه، تشخیص اولیه'
    },
    {
      name: 'اورولوژی',
      title: 'پزشک اورولوژی شهرقدس',
      description: 'درمان بیماری‌های کلیه، مثانه و دستگاه ادراری تناسلی',
      icon: '🔬',
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      link: '/doctors/urology',
      keywords: 'سنگ کلیه، پروستات، عفونت ادراری'
    },
    {
      name: 'ارتوپدی',
      title: 'پزشک ارتوپدی شهرقدس',
      description: 'درمان شکستگی، آسیب‌های ورزشی و بیماری‌های استخوان',
      icon: '🦴',
      color: 'from-orange-500 to-amber-600',
      bgColor: 'from-orange-50 to-amber-50',
      link: '/doctors/orthopedic',
      keywords: 'شکستگی، ستون فقرات، مفاصل'
    },
    {
      name: 'زنان و زایمان',
      title: 'پزشک زنان شهرقدس',
      description: 'مراقبت‌های زنان، بارداری و زایمان',
      icon: '👶',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50',
      link: '/doctors/gynecology',
      keywords: 'بارداری، زایمان، مراقبت زنان'
    },
    {
      name: 'قلب و عروق',
      title: 'پزشک قلب شهرقدس',
      description: 'تشخیص و درمان بیماری‌های قلبی و عروقی',
      icon: '❤️',
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      link: '/doctors',
      keywords: 'فشار خون، آریتمی، انفارکتوس'
    },
    {
      name: 'اطفال',
      title: 'پزشک اطفال شهرقدس',
      description: 'مراقبت‌های تخصصی کودکان و نوجوانان',
      icon: '🧸',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      link: '/doctors',
      keywords: 'واکسیناسیون، رشد کودک، بیماری‌های کودکان'
    },
    {
      name: 'داخلی',
      title: 'پزشک داخلی شهرقدس',
      description: 'تشخیص و درمان بیماری‌های داخلی بدن',
      icon: '💊',
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'from-purple-50 to-indigo-50',
      link: '/doctors/internal-medicine',
      keywords: 'دیابت، فشار خون، بیماری‌های داخلی'
    }
  ];

  return (
    <div className="min-h-screen bg-light-gradient">
      <CanonicalTag path="/doctors/shahrqods" />
      <MetaTags
        title="پزشک شهرقدس | بهترین دکترهای متخصص قدس | نوبت آنلاین پزشکان"
        description="بهترین پزشکان متخصص در شهرقدس. پزشک اورولوژی، ارتوپدی، زنان، قلب، اطفال و داخلی. نوبت آنلاین، آدرس و تلفن پزشکان شهرقدس"
        keywords="پزشک شهرقدس, دکتر قدس, پزشک اورولوژی شهرقدس, پزشک ارتوپدی قدس, پزشک زنان شهرقدس, پزشک قلب قدس, پزشک اطفال شهرقدس, نوبت آنلاین پزشک"
        ogImage="https://www.salamatlab.com/shahrqods-doctors-preview.jpg"
        path="/doctors/shahrqods"
      />
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white rounded-3xl p-8 md:p-16 mb-16 shadow-2xl relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-white rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/20 p-6 rounded-full">
                <MapPin className="w-16 h-16 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
              بهترین پزشکان شهرقدس
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 leading-relaxed max-w-4xl mx-auto">
              دسترسی آسان به بهترین پزشکان متخصص در شهرقدس. از اورولوژی تا ارتوپدی، از زنان و زایمان تا قلب و عروق
            </p>
            
            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <Users className="w-10 h-10 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">100+</div>
                <div className="text-blue-100">پزشک متخصص</div>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <Award className="w-10 h-10 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">15+</div>
                <div className="text-blue-100">سال تجربه</div>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <Star className="w-10 h-10 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">4.8</div>
                <div className="text-blue-100">امتیاز رضایت</div>
              </div>
              <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-sm">
                <Clock className="w-10 h-10 mx-auto mb-4" />
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-blue-100">پشتیبانی</div>
              </div>
            </div>

            <Button
              onClick={() => navigate('/doctors')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 px-12 py-4 text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              مشاهده تمام پزشکان
            </Button>
          </div>
        </div>

        {/* Specialties Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              تخصص‌های پزشکی موجود در شهرقدس
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              با بهترین پزشکان متخصص در شهرقدس آشنا شوید و نوبت خود را به راحتی رزرو کنید
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {specialties.map((specialty, index) => (
              <Link
                key={specialty.name}
                to={specialty.link}
                className="group"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-4 bg-white rounded-3xl overflow-hidden specialty-card-float">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${specialty.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                  
                  <div className="relative z-10 p-8 text-center">
                    {/* Icon */}
                    <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                      {specialty.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                      {specialty.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {specialty.description}
                    </p>
                    
                    {/* Keywords */}
                    <div className="mb-6">
                      <div className="text-sm text-gray-500 font-medium mb-2">خدمات شامل:</div>
                      <div className="text-sm text-blue-600 font-medium">
                        {specialty.keywords}
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <div className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${specialty.color} text-white font-bold rounded-2xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105`}>
                      مشاهده پزشکان
                      <Stethoscope className="w-5 h-5 mr-2" />
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Location Benefits */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <Card className="p-10 border-0 shadow-xl bg-white rounded-3xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <MapPin className="w-8 h-8 ml-4 text-green-600" />
              چرا پزشک در شهرقدس؟
            </h2>
            <ul className="space-y-6 text-gray-700">
              <li className="flex items-start">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 ml-4 flex-shrink-0"></div>
                <div>
                  <strong className="text-gray-800">دسترسی آسان:</strong> از تمام نقاط تهران به راحتی قابل دسترس
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 ml-4 flex-shrink-0"></div>
                <div>
                  <strong className="text-gray-800">پارکینگ مناسب:</strong> امکانات پارکینگ رایگان و آسان
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 ml-4 flex-shrink-0"></div>
                <div>
                  <strong className="text-gray-800">هزینه مناسب:</strong> تعرفه‌های مقرون‌به‌صرفه‌تر از مرکز تهران
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 ml-4 flex-shrink-0"></div>
                <div>
                  <strong className="text-gray-800">مراکز تشخیصی:</strong> نزدیکی به آزمایشگاه‌ها و مراکز تصویربرداری
                </div>
              </li>
            </ul>
          </Card>

          <Card className="p-10 border-0 shadow-xl bg-white rounded-3xl">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <Award className="w-8 h-8 ml-4 text-blue-600" />
              مزایای انتخاب پزشکان ما
            </h2>
            <ul className="space-y-6 text-gray-700">
              <li className="flex items-start">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 ml-4 flex-shrink-0"></div>
                <div>
                  <strong className="text-gray-800">پزشکان مجرب:</strong> متخصصان با سال‌ها تجربه بالینی
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 ml-4 flex-shrink-0"></div>
                <div>
                  <strong className="text-gray-800">تجهیزات مدرن:</strong> استفاده از جدیدترین تکنولوژی‌های پزشکی
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 ml-4 flex-shrink-0"></div>
                <div>
                  <strong className="text-gray-800">نوبت‌دهی آسان:</strong> امکان رزرو آنلاین و تلفنی
                </div>
              </li>
              <li className="flex items-start">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 ml-4 flex-shrink-0"></div>
                <div>
                  <strong className="text-gray-800">پیگیری درمان:</strong> مراقبت مستمر و پیگیری وضعیت بیمار
                </div>
              </li>
            </ul>
          </Card>
        </div>

        {/* Contact CTA */}
        <Card className="p-12 border-0 shadow-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white rounded-3xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            آماده خدمت‌رسانی به شما هستیم
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            برای رزرو نوبت، مشاوره یا دریافت اطلاعات بیشتر با ما تماس بگیرید
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <a
              href="tel:02146833010"
              className="flex items-center bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              <Phone className="w-6 h-6 ml-3" />
              021-46833010
            </a>
            <Link
              to="/contact"
              className="flex items-center bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 hover:scale-105"
            >
              <MapPin className="w-6 h-6 ml-3" />
              آدرس و راه‌های ارتباطی
            </Link>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default LocalDoctorsLanding;
