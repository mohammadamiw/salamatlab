import React from 'react';
import Header from '@/components/Header';
import { Link } from "react-router-dom";
import { Phone, Calendar, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const About = () => {
  const teamMembers = [
    {
      name: "دکتر محمد نیاکان",
      position: "موسس آزمایشگاه",
      image: "/images/about-doctor1.jpg",
      description: "استاد و عضو هیئت علمی دانشگاه شاهد",
      education: "دکترای تخصصی میکروبیولوژی"
    },
    {
      name: "دکتر فاطمه شکوهی",
      position: "مسئول فنی آزمایشگاه",
      image: "/images/about-doctor2.jpg",
      description: "دکترای تخصصی علوم آزمایشگاهی",
      education: ""
    },
    {
      name: "دکتر ابراهیم فقیه لو",
      position: "رئیس بخش تشخیص سلولی و مولکولی",
      image: "/images/about-doctor3.jpg",
      description: "عضو هیئت علمی دانشگاه شهید بهشتی",
      education: "دکترای تخصصی ویروس شناسی از دانشگاه شهید بهشتی"
    },
    {
      name: "دکتر علی صمدی",
      position: "رئیس بخش ایمونولوؤی و آلرژی",
      image: "/placeholder.svg",
      description: "",
      education: "دکترای تخصصی ایمنی شناسی "
    }
  ];

  const achievements = [
    {
      number: "۱۵+",
      title: "سال تجربه",
      description: "در زمینه تشخیص پزشکی"
    },
    {
      number: "۵۰,۰۰۰,۰۰۰,۰۰۰+",
      title: "آزمایش موفق",
      description: "با دقت ۹۹.۹٪"
    },
    {
      number: "۱۰,۰۰۰,۰۰۰+",
      title: "بیمار راضی",
      description: "از کیفیت خدمات"
    },
    {
      number: "۲۴/۷",
      title: "پشتیبانی",
      description: "در ساعات کاری"
    }
  ];

  const values = [
    {
      icon: "🎯",
      title: "دقت و کیفیت",
      description: "ما متعهد به ارائه نتایج دقیق و قابل اعتماد با استفاده از پیشرفته‌ترین تکنولوژی‌ها هستیم"
    },
    {
      icon: "🤝",
      title: "اعتماد و شفافیت",
      description: "شفافیت کامل در تمام مراحل کار و ایجاد اعتماد با بیماران و پزشکان"
    },
    {
      icon: "💡",
      title: "نوآوری و پیشرفت",
      description: "همیشه در حال به‌روزرسانی دانش و تجهیزات برای ارائه بهترین خدمات"
    },
    {
      icon: "❤️",
      title: "مراقبت از بیمار",
      description: "بیماران ما در اولویت اول قرار دارند و سلامتی آن‌ها هدف اصلی ماست"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Back to Home */}
          <div className="mb-6">
            <Link to="/">
              <Button variant="outline" className="bg-transparent border-blue-600 text-blue-700 hover:bg-blue-600 hover:text-white transition-all duration-300">
                بازگشت به صفحه اصلی
                <ArrowLeft className="mr-2 rtl:ml-2 rtl:mr-0 w-4 h-4" />
              </Button>
            </Link>
          </div>
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
              درباره آزمایشگاه سلامت
            </h1>
            <p className="text-gray-600 text-lg md:text-xl max-w-4xl mx-auto leading-relaxed">
              آزمایشگاه سلامت با بیش از ۱۵ سال تجربه در زمینه تشخیص پزشکی، 
              متعهد به ارائه بهترین خدمات با بالاترین کیفیت و دقت برای سلامت شماست.
            </p>
          </div>

          {/* Company Story */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">داستان ما</h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                آزمایشگاه سلامت در سال ۱۳۸۲ با هدف ارائه خدمات تشخیصی با کیفیت و قابل اعتماد تأسیس شد. 
                ما از همان ابتدا متعهد به استفاده از پیشرفته‌ترین تکنولوژی‌ها و بهره‌گیری از متخصصین 
                مجرب و با تجربه بوده‌ایم.
              </p>
              <p className="text-gray-600 leading-relaxed text-lg">
                امروز، پس از گذشت بیش از یک دهه، ما به یکی از معتبرترین و پیشرفته‌ترین آزمایشگاه‌های 
                تشخیصی در کشور تبدیل شده‌ایم و افتخار خدمت‌رسانی به هزاران بیمار را داریم.
              </p>
              <div className="flex space-x-4 space-x-reverse">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                  مشاهده گواهینامه‌ها
                </Button>
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3">
                  دانلود بروشور
                </Button>
              </div>
            </div>
            <div className="relative">
              <Card className="p-8 border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
                <div className="text-center">
                  <div className="text-6xl mb-6">🏥</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">آزمایشگاه سلامت</h3>
                  <p className="text-gray-600 mb-6">
                    پیشگام در تشخیص پزشکی و مولکولی با استفاده از پیشرفته‌ترین تکنولوژی‌های روز دنیا
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">۱۳۸۲</div>
                      <div className="text-sm text-gray-600">سال تأسیس</div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">ISO</div>
                      <div className="text-sm text-gray-600">گواهینامه</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">دستاوردهای ما</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <Card key={index} className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{achievement.number}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{achievement.title}</h3>
                  <p className="text-gray-600">{achievement.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">ارزش‌های ما</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <Card key={index} className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-lg font-bold text-gray-800 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">تیم متخصصین ما</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <Card key={index} className="p-6 text-center border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                  <img
                    src={member.image}
                    alt={`پرتره ${member.name}`}
                    className="w-32 h-32 object-cover rounded-full mx-auto mb-4 shadow-md"
                    loading="lazy"
                  />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600 text-sm mb-3 leading-relaxed">{member.description}</p>
                  <p className="text-gray-500 text-xs">{member.education}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Mission & Vision */}
          <div className="grid lg:grid-cols-2 gap-12 mb-20">
            <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4">ماموریت ما</h3>
              <p className="text-blue-100 leading-relaxed text-lg">
                ارائه خدمات تشخیصی با بالاترین کیفیت و دقت، با استفاده از پیشرفته‌ترین تکنولوژی‌ها 
                و متخصصین مجرب، برای کمک به تشخیص دقیق و درمان مؤثر بیماری‌ها.
              </p>
            </Card>
            
            <Card className="p-8 border-0 shadow-xl bg-gradient-to-br from-green-600 to-green-700 text-white">
              <div className="text-4xl mb-6">🔮</div>
              <h3 className="text-2xl font-bold mb-4">چشم‌انداز ما</h3>
              <p className="text-green-100 leading-relaxed text-lg">
                تبدیل شدن به پیشرفته‌ترین و معتبرترین آزمایشگاه تشخیصی در منطقه، 
                با ارائه خدمات نوآورانه و استانداردهای بین‌المللی کیفیت.
              </p>
            </Card>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="p-12 border-0 shadow-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              <h2 className="text-3xl font-bold mb-6">آماده خدمت‌رسانی به شما هستیم</h2>
              <p className="text-xl mb-8 opacity-95">
                برای دریافت مشاوره، رزرو نوبت یا هرگونه سؤال، با ما در تماس باشید
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  className="px-8 py-4 text-lg font-bold rounded-full bg-white text-purple-700 hover:bg-white/95 shadow-xl hover:shadow-2xl border-2 border-white"
                  onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}
                  aria-label="رزرو نوبت آنلاین"
                >
                  <Calendar className="w-5 h-5" />
                  رزرو نوبت
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="px-8 py-4 text-lg font-bold rounded-full border-2 border-white text-white bg-white/10 hover:bg-white/20 shadow-xl hover:shadow-2xl"
                  aria-label="تماس با ما"
                >
                  <Link to="/contact">
                    <Phone className="w-5 h-5" />
                    تماس با ما
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
