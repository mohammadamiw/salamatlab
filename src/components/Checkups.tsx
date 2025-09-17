
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingForm from './BookingForm';
import StaggeredReveal from '@/components/StaggeredReveal';
import { Stethoscope, FlaskConical, HeartPulse, Ribbon } from 'lucide-react';

interface CheckupsProps {
  showInfo?: boolean;
}

const Checkups: React.FC<CheckupsProps> = ({ showInfo = true }) => {
  const [selectedCategory, setSelectedCategory] = useState("general");

  const categoryIcons: Record<string, React.ComponentType<any>> = {
    general: Stethoscope,
    specialized: FlaskConical,
    women: HeartPulse,
    cancer: Ribbon
  };

  const iconGradients: Record<string, string> = {
    general: 'from-blue-500 to-indigo-600',
    specialized: 'from-emerald-500 to-green-600',
    women: 'from-pink-500 to-rose-600',
    cancer: 'from-violet-500 to-purple-600'
  };

  const checkupCategories = {
    general: {
      title: "چکاپ‌های عمومی",
      packages: [
        {
          title: "چکاپ عمومی - قبل از بلوغ",
          subtitle: "(دختر و پسر)",
          price: "۸۵۰,۰۰۰",
          description: "بررسی سلامت پایه کودکان و نوجوانان",
          features: [
            "CBC، ESR، CRP",
            "FBS، Urea، Cr، U.A",
            "Ca، P، AST، ALT، ALP، Bili (T&D)",
            "T3، T4، TSH، Anti TPO",
            "Vit D، TIBC، Ferritin، Folic Acid، Vit B12",
            "Serum Albumin & Protein، Cortisol (8–10 AM)",
            "HBs Ag & Ab، U/A & U/C، S/E ×3"
          ],
          popular: false,
          color: "from-blue-50 to-blue-100"
        },
        {
          title: "چکاپ عمومی - بعد از بلوغ",
          subtitle: "(زن و مرد)",
          price: "۹۵۰,۰۰۰",
          description: "چکاپ کامل برای بزرگسالان",
          features: [
            "CBC، ESR، CRP، RF",
            "FBS، Urea، Cr، U.A",
            "Ch، TG، HDL، LDL، Na، K، Ca، P",
            "AST، ALT، ALP، Bili (T&D)، Hb A1C",
            "T3، T4، TSH، Anti TPO، Vit D",
            "Fe، TIBC، Ferritin، Serum Albumin & Protein",
            "Cortisol، HBs Ag & Ab، HCV Ab، HIV Ab"
          ],
          popular: true,
          color: "from-primary/10 to-primary/20"
        }
      ]
    },
    specialized: {
      title: "چکاپ‌های تخصصی",
      packages: [
        {
          title: "پنل بررسی اختلال رشد",
          subtitle: "(قبل از بلوغ)",
          price: "۶۵۰,۰۰۰",
          description: "برای کودکان با رشد کمتر از حد طبیعی",
          features: [
            "GH base (هورمون رشد پایه)",
            "GH after stimulation (تحریک با ورزش یا کلونیدین)",
            "IGF-1 (فاکتور رشد شبه انسولین)"
          ],
          popular: false,
          color: "from-green-50 to-green-100"
        },
        {
          title: "پنل دیابت",
          subtitle: "(بعد از بلوغ)",
          price: "۷۲۰,۰۰۰",
          description: "برای افراد مشکوک یا مبتلا به دیابت",
          features: [
            "2h.p.p، Hb A1C",
            "C-peptide، Anti GAD",
            "Insulin Ab، Serum fasting",
            "Islet Ab، Urine microalbumin"
          ],
          popular: false,
          color: "from-orange-50 to-orange-100"
        },
        {
          title: "پنل کم‌خونی",
          subtitle: "(بعد از بلوغ)",
          price: "۴۵۰,۰۰۰",
          description: "بررسی کم‌خونی فقر آهن، B12 و فولات",
          features: [
            "Retic count (شمارش رتیکولوسیت)",
            "Fe، TIBC، Ferritin",
            "Folic acid، Vit B12"
          ],
          popular: false,
          color: "from-red-50 to-red-100"
        }
      ]
    },
    women: {
      title: "چکاپ‌های زنان",
      packages: [
        {
          title: "پنل آمنوره",
          subtitle: "(اختلال قاعدگی)",
          price: "۱,۲۵۰,۰۰۰",
          description: "بررسی علت قطع یا بی‌نظمی قاعدگی",
          features: [
            "LH، FSH، PRL",
            "Testosterone، Estradiol",
            "DHEA-S، 17OH Progesterone",
            "Progesterone، Karyotype"
          ],
          popular: false,
          color: "from-pink-50 to-pink-100"
        },
        {
          title: "پنل تخمدان پلی‌کیستیک (PCOS)",
          subtitle: "",
          price: "۸۹۰,۰۰۰",
          description: "تشخیص PCOS و بررسی آندروژن‌ها",
          features: [
            "LH، FSH، PRL",
            "Testosterone، F.Testosterone، AMH",
            "17OH Progesterone، Estradiol",
            "DHEA-S، Androstenedione"
          ],
          popular: true,
          color: "from-purple-50 to-purple-100"
        },
        {
          title: "پنل هیپرآندروژنیسم",
          subtitle: "(پر مویی)",
          price: "۷۸۰,۰۰۰",
          description: "برای زنان با پُر مویی، آکنه شدید",
          features: [
            "Androstenedione، DHEA-S",
            "17OH Progesterone، AMH",
            "Testosterone، F.Testosterone، DHT"
          ],
          popular: false,
          color: "from-indigo-50 to-indigo-100"
        }
      ]
    },
    cancer: {
      title: "غربالگری سرطان",
      packages: [
        {
          title: "پنل سرطان پستان",
          subtitle: "(زنان)",
          price: "۵۸۰,۰۰۰",
          description: "غربالگری زنان در معرض خطر",
          features: [
            "CEA (آنتی‌ژن کرسینواپریونیک)",
            "CA 125",
            "CA 15.3",
            "HER2"
          ],
          popular: false,
          color: "from-rose-50 to-rose-100"
        },
        {
          title: "پنل سرطان تخمدان",
          subtitle: "(زنان)",
          price: "۶۲۰,۰۰۰",
          description: "غربالگری تخصصی سرطان تخمدان",
          features: [
            "CEA، CA 125",
            "HE4 (پروتئین اپیدیدیم انسان)",
            "Roma Factor",
            "B.HCG"
          ],
          popular: false,
          color: "from-violet-50 to-violet-100"
        },
        {
          title: "پنل سرطان پروستات",
          subtitle: "(مردان)",
          price: "۳۲۰,۰۰۰",
          description: "غربالگری سرطان پروستات",
          features: [
            "PSA (آنتی‌ژن اختصاصی پروستات)",
            "F.PSA (PSA آزاد)",
            "F.PSA / PSA (نسبت PSA آزاد)"
          ],
          popular: false,
          color: "from-blue-50 to-blue-100"
        },
        {
          title: "پنل سرطان روده",
          subtitle: "(زن و مرد)",
          price: "۲۸۰,۰۰۰",
          description: "غربالگری سرطان کولورکتال",
          features: [
            "CEA",
            "CA 19.9",
            "OB (Stool) - خون مخفی مدفوع"
          ],
          popular: false,
          color: "from-amber-50 to-amber-100"
        }
      ]
    }
  };

  return (
    <section id="checkups" className="py-20 bg-medical-gray relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            پنل‌های چکاپ تخصصی آزمایشگاه سلامت
          </h2>
          <p className="text-gray-600 text-lg">
            بسته‌های جامع و تخصصی چکاپ برای تمام گروه‌های سنی
          </p>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="max-w-7xl mx-auto">
          <TabsList className="grid w-full grid-cols-4 mb-10 bg-white/80 backdrop-blur-sm p-1 rounded-full border border-gray-200 shadow-sm">
            <TabsTrigger value="general" className="text-sm rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white">عمومی</TabsTrigger>
            <TabsTrigger value="specialized" className="text-sm rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white">تخصصی</TabsTrigger>
            <TabsTrigger value="women" className="text-sm rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white">زنان</TabsTrigger>
            <TabsTrigger value="cancer" className="text-sm rounded-full data-[state=active]:bg-blue-600 data-[state=active]:text-white">غربالگری سرطان</TabsTrigger>
          </TabsList>

          {Object.entries(checkupCategories).map(([categoryKey, category]) => {
            const IconComponent = categoryIcons[categoryKey] || Stethoscope;
            const iconGradient = iconGradients[categoryKey] || 'from-blue-500 to-indigo-600';
            return (
            <TabsContent key={categoryKey} value={categoryKey}>
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{category.title}</h3>
              </div>
              <StaggeredReveal staggerDelay={100} direction="scale" duration={600} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.packages.map((pkg, index) => (
                  <Card
                    key={index}
                    className={`group relative p-6 md:p-8 rounded-3xl border ${pkg.popular ? 'border-blue-300 bg-blue-50/60' : 'border-blue-100 bg-white/90'} shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col overflow-hidden`}
                  >
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${pkg.color}`} />
                    <div className="relative z-10">
                    {/* Header: Title */}
                    <div className="mb-4">
                      <h3 className="text-xl md:text-2xl font-extrabold text-gray-800 leading-tight">
                        {pkg.title}
                      </h3>
                    </div>

                    {/* Icon */}
                    <div className="mb-4">
                      <div className={`w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br ${iconGradient} rounded-2xl flex items-center justify-center shadow-md mx-auto`}>
                        {React.createElement(IconComponent, { className: 'w-6 h-6 text-white' })}
                      </div>
                    </div>

                    {/* Subtitle */}
                    {pkg.subtitle && (
                      <div className="mb-3">
                        <span className="inline-block text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                          {pkg.subtitle}
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-5">
                      {pkg.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <svg className="w-4 h-4 text-blue-600 mt-0.5 ml-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 text-xs md:text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-auto">
                      <BookingForm
                        type="checkup"
                        title={pkg.title}
                        subtitle={pkg.subtitle}
                        trigger={
                          <Button className={`w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11`}>رزرو چکاپ</Button>
                        }
                      />
                    </div>
                    </div>
                    {/* محبوب‌ترین badge removed as requested */}
                  </Card>
                ))}
              </StaggeredReveal>
            </TabsContent>
          );})}
        </Tabs>

        {showInfo && (
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">اطلاعات مهم</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">مشاوره رایگان</h4>
                <p className="text-gray-600 text-sm">پس از دریافت نتایج، مشاوره با پزشک متخصص</p>
              </div>
              <div className="p-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">نمونه‌گیری در منزل</h4>
                <p className="text-gray-600 text-sm">امکان نمونه‌گیری در محل زندگی شما</p>
              </div>
              <div className="p-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold text-gray-800 mb-2">نتایج سریع</h4>
                <p className="text-gray-600 text-sm">دریافت نتایج در کمترین زمان ممکن</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Checkups;
