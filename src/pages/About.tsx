import React, { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dna, Microscope, TestTube, FlaskConical, ShieldCheck, Activity, ArrowLeft, ExternalLink, Star, Award, Users, Clock, Phone } from "lucide-react";
import Reveal from "@/components/Reveal";
import AnimatedCounter from "@/components/AnimatedCounter";
import CanonicalTag from "@/components/CanonicalTag";
import MetaTags from "@/components/MetaTags";

const About: React.FC = () => {
  const description = "آشنایی با آزمایشگاه تشخیص پزشکی سلامت: تیم متخصص، فناوری‌های پیشرفته و رویکرد انسان‌محور برای دقیق‌ترین نتایج تشخیصی.";

  const specialties = [
    { icon: Microscope, label: "بیوشیمی", color: "from-blue-500 to-blue-600" },
    { icon: TestTube, label: "هورمون‌شناسی", color: "from-green-500 to-green-600" },
    { icon: ShieldCheck, label: "ایمونولوژی", color: "from-purple-500 to-purple-600" },
    { icon: Activity, label: "هماتولوژی", color: "from-red-500 to-red-600" },
    { icon: Dna, label: "تشخیص مولکولی (PCR)", color: "from-indigo-500 to-indigo-600" },
    { icon: FlaskConical, label: "سیتولوژی", color: "from-orange-500 to-orange-600" },
  ];

  const stats = [
    { icon: Users, value: 15000, label: "مراجع راضی", suffix: "+", color: "text-blue-600" },
    { icon: Award, value: 98, label: "رضایت", suffix: "%", color: "text-green-600" },
    { icon: Clock, value: 24, label: "ساعت پشتیبانی", suffix: "/7", color: "text-purple-600" },
    { icon: Star, value: 15, label: "سال تجربه", suffix: "+", color: "text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <CanonicalTag path="/about" />
      <MetaTags
        title="درباره ما | آزمایشگاه تشخیص پزشکی سلامت"
        description={description}
        keywords="درباره ما, آزمایشگاه سلامت, تیم متخصص, فناوری پیشرفته, تشخیص پزشکی, شهرقدس, تهران"
        ogImage="https://www.salamatlab.com/about-preview.jpg"
        path="/about"
      />
      <Header />

      <main id="main" className="pt-36">{/* push under sticky header */}
        {/* Back to Home */}
        <div className="container mx-auto px-4 pb-4">
          <a
            href="/"
            aria-label="بازگشت به صفحه اصلی"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            بازگشت به صفحه اصلی
          </a>
        </div>
        {/* Hero */}
        <section id="hero" className="relative min-h-[80vh] md:min-h-[90vh] flex items-center justify-center overflow-hidden">
          {/* Animated background elements */}
          <div aria-hidden className="absolute inset-0 -z-10">
            <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -right-16 h-96 w-96 rounded-full bg-primary/20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-blue-500/5 blur-2xl animate-float" />
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 40}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: `${3 + i}s`
                }}
              />
            ))}
          </div>

          <div className="container mx-auto px-4 text-center space-y-6 relative z-10">
            <Reveal>
              <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-6 animate-fade-in">
                <Star className="w-4 h-4 ml-2" />
                آزمایشگاه مورد اعتماد شهرقدس
              </div>
            </Reveal>
            
            <Reveal delay={200}>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  سلامت، در نهایتِ دقت
                </span>
              </h1>
            </Reveal>
            
            <Reveal delay={400}>
              <p className="mx-auto max-w-2xl text-muted-foreground text-lg md:text-xl">
                آینده تشخیص، وقف سلامتی شما.
              </p>
            </Reveal>
            
            <Reveal delay={600}>
              <div className="flex justify-center">
                <a href="#team" className="inline-flex" aria-label="مشاهده تیم متخصص">
                  <Button size="lg" className="px-8 py-4 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white border-2 border-primary">
                    با متخصصین ما آشنا شوید
                    <ArrowLeft className="mr-2 rtl:ml-2 rtl:mr-0" />
                  </Button>
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Reveal key={index} delay={index * 100}>
                <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-muted/50 to-muted/30 hover:from-muted/70 hover:to-muted/50 transition-all duration-300 hover:scale-105 border border-muted/50">
                  <div className={`mx-auto w-12 h-12 rounded-full bg-gradient-to-br ${stat.color.replace('text-', 'from-')} to-white/20 flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold ${stat.color} mb-2`}>
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Commitment - asymmetric two-column */}
        <section className="container mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <Reveal className="order-2 md:order-1 space-y-4">
              <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Award className="w-4 h-4 ml-2" />
                میراث تخصصی
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold">
                میراثی از تخصص و نوآوری
              </h2>
              <p className="text-muted-foreground leading-8">
                آزمایشگاه سلامت به‌دست اساتید دانشگاه و تیمی مجرب بنیان گذاشته شده و با بهره‌گیری از جدیدترین فناوری‌ها، متعهد به ارائه دقیق‌ترین و سریع‌ترین نتایج برای آرامش خاطر شماست.
              </p>
            </Reveal>
            <Reveal delay={200} className="order-1 md:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <img
                  src="/images/about-doctor1.jpg"
                  alt="پرتره حرفه‌ای متخصص برجسته در محیطی مدرن"
                  loading="lazy"
                  className="relative w-full h-[420px] object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="container mx-auto px-4 py-20">
          <Reveal>
            <header className="mb-10 text-center space-y-3">
              <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Users className="w-4 h-4 ml-2" />
                تیم متخصص
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold">تیم پیشروی ما</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                جمعی از متخصصین برجسته با رویکردی انسان‌محور و مبتنی بر شواهد علمی.
              </p>
            </header>
          </Reveal>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[{
              img: "/images/about-doctor1.jpg",
              name: "دکتر محمد نیاکان",
              role: "موسس آزمایشگاه، دکتری تخصصی میکروبیولوژی",
              org: "عضو هیئت علمی دانشگاه شاهد",
              delay: 200
            }, {
              img: "/images/about-doctor2.jpg",
              name: "دکتر فاطمه شکوهی",
              role: "دکترای علوم آزمایشگاهی",
              org: "مسئول فنی آزمایشگاه",
              delay: 400
            }, {
         
            }].map((m, i) => (
              <Reveal key={i} delay={m.delay}>
                <Card className="group bg-muted/20 border-muted hover:shadow-xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img 
                      src={m.img} 
                      alt={`پرتره ${m.name}`} 
                      loading="lazy" 
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">{m.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1 text-sm">
                    <p className="text-foreground/90">{m.role}</p>
                    <p className="text-muted-foreground">{m.org}</p>
                    <a href="#" className="inline-flex items-center gap-1 text-primary text-sm hover:text-primary/80 transition-colors" aria-label={`مشاهده پروفایل کامل ${m.name}`}>
                      مشاهده پروفایل کامل
                      <ExternalLink className="size-3.5" />
                    </a>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Services & Technology */}
        <section className="container mx-auto px-4 py-20">
          <Reveal>
            <header className="mb-10 text-center space-y-3">
              <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <FlaskConical className="w-4 h-4 ml-2" />
                فناوری پیشرفته
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold">پوشش جامع تشخیصی با فناوری پیشرفته</h2>
            </header>
          </Reveal>

          {/* Specialties grid */}
          <Reveal delay={200}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mb-12">
              {specialties.map((s, idx) => (
                <div 
                  key={idx} 
                  className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/50 hover:from-muted/50 hover:to-muted/70 transition-all duration-300 hover:scale-105 cursor-pointer border border-muted/50 hover:border-primary/30"
                >
                  <div className={`p-3 rounded-full bg-gradient-to-br ${s.color} group-hover:scale-110 transition-transform duration-300`}>
                    <s.icon className="size-6 text-white" />
                  </div>
                  <span className="text-sm text-foreground/90 text-center font-medium">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Highlight tech cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <Reveal delay={400}>
              <Card className="group bg-background border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    پنل کامل بیماری‌های عفونی
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-7 relative z-10">
                  ارزیابی سریع و دقیق طیف وسیعی از عوامل عفونی با حساسیت بالا، برای تشخیص زودهنگام و درمان مؤثر.
                </CardContent>
              </Card>
            </Reveal>
            
            <Reveal delay={600}>
              <Card className="group bg-background border shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    الکتروفورز تخصصی (SDS-PAGE)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground leading-7 relative z-10">
                  تحلیل پیشرفته پروتئین‌ها با وضوح بالا به‌منظور پایش‌های دقیق تحقیقاتی و بالینی.
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="container mx-auto px-4 py-24 bg-gradient-to-br from-muted/30 to-muted/10">
          <Reveal>
            <header className="mb-16 text-center space-y-3">
              <div className="inline-flex items-center bg-primary/10 text-primary px-6 py-3 rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4 ml-2" />
                مزایای رقابتی
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold">چرا آزمایشگاه سلامت را انتخاب کنید؟</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                ما متعهد به ارائه بهترین خدمات با بالاترین کیفیت و دقت هستیم
              </p>
            </header>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: ShieldCheck,
                title: "دقت بالا",
                description: "نتایج دقیق با استفاده از پیشرفته‌ترین تجهیزات",
                color: "from-green-500 to-green-600",
                delay: 100
              },
              {
                icon: Clock,
                title: "سرعت بالا",
                description: "ارائه نتایج در کوتاه‌ترین زمان ممکن",
                color: "from-blue-500 to-blue-600",
                delay: 200
              },
              {
                icon: Users,
                title: "تیم متخصص",
                description: "کارشناسان مجرب و با تجربه در حوزه تشخیص",
                color: "from-purple-500 to-purple-600",
                delay: 300
              },
              {
                icon: Award,
                title: "کیفیت تضمینی",
                description: "تضمین کیفیت تمامی خدمات و نتایج",
                color: "from-orange-500 to-orange-600",
                delay: 400
              }
            ].map((item, index) => (
              <Reveal key={index} delay={item.delay}>
                <div className="group text-center p-6 rounded-2xl bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-500 hover:scale-105 border border-muted/50 hover:border-primary/30 hover:shadow-xl">
                  <div className={`mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-6">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Our Space */}
        <section className="container mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <Reveal className="order-2 md:order-1 space-y-4">
              <div className="inline-flex items-center bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Star className="w-4 h-4 ml-2" />
                محیط مدرن
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold">محیطی مدرن برای آرامش خاطر شما</h3>
              <p className="text-muted-foreground leading-8">
                ساختمان سه‌طبقه آزمایشگاه سلامت برای راحتی و کارایی مراجعین طراحی شده است؛ فضایی روشن، پاکیزه و کارآمد برای تجربه‌ای ممتاز.
              </p>
              <div>
                <Button size="lg" variant="default" className="px-6 py-4 text-lg font-bold bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white border-2 border-orange-500">
                  مشاهده تور مجازی ۳۶۰ درجه
                </Button>
              </div>
            </Reveal>
            <Reveal delay={200} className="order-1 md:order-2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-orange-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <img
                  src="/images/about-space.jpg"
                  alt="نمایی روشن و مدرن از فضای آزمایشگاه"
                  loading="lazy"
                  className="relative w-full h-[420px] object-cover rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-12 text-center text-white">
              {/* Background decoration */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30px_30px,rgba(255,255,255,0.1)_2px,transparent_2px)] bg-[length:60px_60px]" />
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-8 left-8 w-16 h-16 bg-white/10 rounded-full animate-float" />
              <div className="absolute bottom-8 right-8 w-20 h-20 bg-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
              
              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold">آماده خدمت‌رسانی به شما هستیم</h2>
                <p className="text-xl text-white/95 max-w-2xl mx-auto">
                  برای دریافت مشاوره، رزرو نوبت یا هرگونه سؤال، با ما در تماس باشید
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="px-8 py-4 text-lg font-bold rounded-full bg-white text-primary hover:bg-white/95 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-white/80"
                    onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}
                  >
                    <span className="text-primary font-bold tracking-wide">رزرو نوبت</span>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 py-4 text-lg font-bold rounded-full border-2 border-white text-white bg-white/10 hover:bg-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                  >
                    <span className="font-bold">تماس با ما</span>
                  </Button>
                </div>
                
                {/* Contact info */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">شنبه تا چهارشنبه: 6:30 تا 20:30</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">پنجشنبه: 6:30 تا 19:30</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-white" />
                    <span className="text-white font-medium">۰۲۱-۴۶۸۳۳۰۱۰ | ۰۲۱-۴۶۸۳۳۰۱۱</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
