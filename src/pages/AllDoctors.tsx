import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CanonicalTag from '@/components/CanonicalTag';
import MetaTags from '@/components/MetaTags';
import Breadcrumbs from '@/components/Breadcrumbs';
import FAQ, { doctorsFAQItems } from '@/components/FAQ';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, Link } from 'react-router-dom';
import { useDoctors } from '@/hooks/useDoctors';
import { mapDoctorSpecialty } from '@/lib/utils';
import type { Doctor } from '@/data/featuredDoctors';
import { ArrowLeft, Stethoscope, Users, Star, MapPin, Clock, Phone, Award, Search, Heart, Share2 } from 'lucide-react';

const AllDoctors = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch all doctors
  const { doctors: allDoctors, loading, error } = useDoctors({
    all: true
  });




  // Convert doctors with canonical specialty: prefer category if provided
  const doctors: Doctor[] = allDoctors.map(doctor => {
    const canonical = (doctor as any).category || mapDoctorSpecialty(doctor.specialty);
    return {
      ...doctor,
      specialty: canonical,
      isFeatured: doctor.isFeatured || false,
    } as Doctor;
  });

  const filteredDoctors = (() => {
    const query = searchQuery.trim().toLowerCase();
    
    // Apply search filter if query exists
    const searched = query.length === 0
      ? doctors
      : doctors.filter(doctor =>
          doctor.name.toLowerCase().includes(query) ||
          (doctor.specialty || '').toLowerCase().includes(query)
        );

    // Sort: featured first, then by rating desc
    return searched.sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.rating || 0) - (a.rating || 0);
    });
  })();

  // Add structured data for doctors
  useEffect(() => {
    if (!loading && filteredDoctors.length > 0) {
      // Remove existing structured data
      const existingScript = document.querySelector('script[type="application/ld+json"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Create structured data for doctors list
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "name": "لیست پزشکان متخصص",
        "description": "مشاوره با بهترین پزشکان متخصص در شهرقدس",
        "url": window.location.href,
        "numberOfItems": filteredDoctors.length,
        "itemListElement": filteredDoctors.slice(0, 10).map((doctor, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "MedicalDoctor",
            "name": doctor.name,
            "medicalSpecialty": doctor.specialty,
            "telephone": doctor.phones?.length > 0 ? doctor.phones[0] : undefined,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": doctor.address,
              "addressLocality": "شهرقدس",
              "addressRegion": "تهران",
              "addressCountry": "IR"
            },
            "url": `https://www.salamatlab.com/doctors#${doctor.licenseNumber}`,
            "image": doctor.image || "https://www.salamatlab.com/doctors-preview.jpg"
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
            <div className="w-32 h-32 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{animationDelay: '0.5s'}}></div>
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mt-8 mb-4">در حال بارگذاری لیست پزشکان...</h3>
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
      <CanonicalTag path="/doctors" />
      <MetaTags
        title="لیست پزشکان | آزمایشگاه تشخیص پزشکی سلامت"
        description="مشاوره با بهترین پزشکان متخصص در شهرقدس. لیست کاملی از پزشکان عمومی، متخصص زنان، قلب و عروق، ارتوپدی، اطفال و سایر تخصص‌های پزشکی"
        keywords="پزشکان, دکتر, متخصص, شهرقدس, پزشکان عمومی, متخصص زنان, قلب و عروق, ارتوپدی, اطفال, مشاوره پزشکی, آزمایشگاه سلامت"
        ogImage="https://www.salamatlab.com/doctors-preview.jpg"
        path="/doctors"
      />
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs />
        </div>
        {/* Search and Filter Section */}
        <Card className="p-8 mb-12 border-0 shadow-2xl bg-specialty-filter backdrop-blur-sm rounded-3xl">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Search */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Search className="w-5 h-5 ml-2 text-blue-600" />
                جستجوی پزشک
              </h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="جستجو بر اساس نام یا تخصص..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-lg"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>
          </div>
        </Card>



        {/* Specialty Quick Links */}
        <Card className="p-8 mb-12 border-0 shadow-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">صفحات تخصصی پزشکان</h3>
          <p className="text-gray-600 text-center mb-8">برای دسترسی سریع‌تر و جستجوی بهتر، صفحات تخصصی پزشکان را مشاهده کنید</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <Link 
              to="/doctors/general"
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-green-200"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">👨‍⚕️</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-green-600">پزشکان عمومی</h4>
                <p className="text-gray-600 text-sm">ویزیت، معاینه و تشخیص اولیه</p>
                <div className="mt-4 text-green-600 font-medium group-hover:text-green-700">مشاهده پزشکان →</div>
              </div>
            </Link>
            
            <Link 
              to="/doctors/urology"
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-blue-200"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🔬</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600">پزشکان اورولوژی</h4>
                <p className="text-gray-600 text-sm">متخصص کلیه، مثانه و دستگاه ادراری</p>
                <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-700">مشاهده پزشکان →</div>
              </div>
            </Link>
            
            <Link 
              to="/doctors/orthopedic"
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-orange-200"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🦴</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-orange-600">پزشکان ارتوپدی</h4>
                <p className="text-gray-600 text-sm">متخصص استخوان، مفاصل و شکستگی</p>
                <div className="mt-4 text-orange-600 font-medium group-hover:text-orange-700">مشاهده پزشکان →</div>
              </div>
            </Link>
            
            <Link 
              to="/doctors/gynecology"
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-pink-200"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">👶</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600">پزشکان زنان</h4>
                <p className="text-gray-600 text-sm">متخصص زنان و زایمان</p>
                <div className="mt-4 text-pink-600 font-medium group-hover:text-pink-700">مشاهده پزشکان →</div>
              </div>
            </Link>
            
            <Link 
              to="/doctors/internal-medicine"
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-purple-200"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">💊</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-purple-600">پزشکان داخلی</h4>
                <p className="text-gray-600 text-sm">تشخیص و درمان بیماری‌های داخلی</p>
                <div className="mt-4 text-purple-600 font-medium group-hover:text-purple-700">مشاهده پزشکان →</div>
              </div>
            </Link>
            
            <Link 
              to="/doctors/midwife"
              className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-rose-200"
            >
              <div className="text-center">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">🤱</div>
                <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-rose-600">ماماها</h4>
                <p className="text-gray-600 text-sm">متخصص مامایی و زایمان طبیعی</p>
                <div className="mt-4 text-rose-600 font-medium group-hover:text-rose-700">مشاهده ماماها →</div>
                </div>
            </Link>
          </div>
        </Card>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredDoctors.map((doctor, index) => (
            <Card 
              key={doctor.licenseNumber} 
              className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-doctor-card rounded-3xl doctor-card-float"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Enhanced Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex space-x-2 space-x-reverse">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-8 h-8 p-0 rounded-full bg-white/90 backdrop-blur-sm"
                    aria-label={`افزودن ${doctor.name} به علاقه‌مندی‌ها`}
                    title="علاقه‌مندی"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-8 h-8 p-0 rounded-full bg-white/90 backdrop-blur-sm"
                    aria-label={`اشتراک‌گذاری اطلاعات ${doctor.name}`}
                    title="اشتراک‌گذاری"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="relative z-10 p-8">
                {/* Doctor Header */}
                <div className="flex items-start space-x-6 space-x-reverse mb-6">
                  <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                    {doctor.image}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2">
                      {doctor.name}
                    </h3>
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium border-0 mb-2">
                      {doctor.specialty}
                    </Badge>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">{doctor.description}</p>
                  </div>
                </div>

                {/* License */}
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl border border-gray-100">
                    <div className="text-gray-600 text-sm mb-1">شماره نظام:</div>
                    <div className="text-gray-800 font-bold">{doctor.licenseNumber}</div>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-6 bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-blue-500 ml-3 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">{doctor.address}</p>
                  </div>
                </div>

                {/* Working Hours */}
                {doctor.workingHours && (
                  <div className="mb-6 bg-gradient-to-r from-gray-50 to-orange-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 text-green-500 ml-3 flex-shrink-0" />
                      <span className="text-gray-700 text-sm font-medium">{doctor.workingHours}</span>
                    </div>
                  </div>
                )}

                {/* Phone Numbers */}
                {doctor.phones.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-3">
                      {doctor.phones.map((phone, phoneIndex) => (
                        <a 
                          key={phoneIndex}
                          href={`tel:${phone}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-semibold bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 px-4 py-3 rounded-xl transition-all duration-300 flex items-center hover:scale-105 hover:shadow-md"
                        >
                          <Phone className="w-4 h-4 ml-2" />
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <FAQ items={doctorsFAQItems} title="سوالات متداول درباره پزشکان" />
        </div>
      </main>
    </div>
  );
};

export default AllDoctors;
