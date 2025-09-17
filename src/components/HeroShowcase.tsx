import React from 'react';
import { Button } from '@/components/ui/button';
import AnimatedCounter from '@/components/AnimatedCounter';
import { cn } from '@/lib/utils';
import EnhancedReveal from './EnhancedReveal';

interface HeroShowcaseProps {
  onScrollToServices?: () => void;
  className?: string;
}

const HeroShowcase: React.FC<HeroShowcaseProps> = ({ onScrollToServices, className }) => {
  return (
    <section id="home" className={cn("relative overflow-hidden pt-24 md:pt-36 pb-12 md:pb-24 min-h-[80vh] md:min-h-[92vh]", className)}>
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-secondary/30 dark:via-background dark:to-secondary/20" />
      <div className="pointer-events-none absolute top-16 right-20 h-56 w-56 md:h-72 md:w-72 rounded-full bg-blue-500/20 blur-3xl animate-pulse-slow hidden sm:block" />
      <div className="pointer-events-none absolute bottom-16 left-16 h-72 w-72 md:h-96 md:w-96 rounded-full bg-green-500/20 blur-3xl animate-pulse-slow hidden sm:block" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="relative z-20 text-center lg:text-right space-y-6">
              <EnhancedReveal direction="down" delay={200}>
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                  ✨ آزمایشگاه مورد اعتماد شهرقدس
                </div>
              </EnhancedReveal>

              <EnhancedReveal direction="up" delay={400}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    آزمایشگاه تشخیص پزشکی سلامت
                  </span>
                  <br />
                  <span className="text-gray-800">بهترین پزشکان شهرقدس</span>
                </h1>
              </EnhancedReveal>

              <EnhancedReveal direction="up" delay={600}>
                <p className="text-xl md:text-2xl mb-8 text-gray-600 leading-relaxed">
                  ارائه خدمات آزمایشگاهی با بالاترین کیفیت و دقت
                  <br />
                  <span className="text-blue-600 font-semibold">همراه با مشاوره تخصصی رایگان</span>
                </p>
              </EnhancedReveal>

              <EnhancedReveal direction="scale" delay={800}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}>
                    نوبت‌دهی آنلاین
                  </Button>
                  <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg rounded-xl transition-all duration-300 hover:scale-105" onClick={onScrollToServices}>
                    مشاهده خدمات
                  </Button>
                </div>
              </EnhancedReveal>

              {/* Trust Indicators */}
              <EnhancedReveal direction="up" delay={1000}>
                <div className="flex items-center justify-center lg:justify-start space-x-8 space-x-reverse mt-12">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      <AnimatedCounter end={150} prefix="+" className="text-2xl font-bold text-blue-600" />
                    </div>
                    <div className="text-sm text-gray-600">مراجع روزانه</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      <AnimatedCounter end={98} suffix="٪" className="text-2xl font-bold text-green-600" />
                    </div>
                    <div className="text-sm text-gray-600">رضایت مراجعین</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-purple-600">ساعات پاسخگویی</div>
                    <div className="text-xs md:text-sm text-gray-600 leading-relaxed">
                      شنبه تا چهارشنبه: 6:30 تا 20:30
                      <br />
                      پنجشنبه: 6:30 تا 19:30
                    </div>
                  </div>
                </div>
              </EnhancedReveal>
            </div>

            {/* Visual Element */}
            <div className="relative z-10 lg:block hidden">
              <EnhancedReveal direction="left" delay={300}>
                <div className="absolute top-4 right-4 bg-green-500 text-white p-4 rounded-xl shadow-lg animate-float pointer-events-none">
                  <div className="text-sm font-bold">نمونه‌گیری در منزل</div>
                </div>
              </EnhancedReveal>
              
              <EnhancedReveal direction="right" delay={500}>
                <div className="absolute bottom-4 left-4 bg-orange-500 text-white p-4 rounded-xl shadow-lg animate-float pointer-events-none" style={{ animationDelay: '1s' }}>
                  <div className="text-sm font-bold">مشاوره رایگان</div>
                </div>
              </EnhancedReveal>
              
              <EnhancedReveal direction="scale" delay={700}>
                <div className="w-full aspect-[4/3] rounded-2xl bg-card shadow-card overflow-hidden">
                  <img src="/images/about-space.webp" alt="آزمایشگاه تشخیص پزشکی سلامت - فضای مدرن و تجهیزات پیشرفته آزمایشگاهی در شهرقدس" className="w-full h-full object-cover scale-105" loading="eager" />
                </div>
              </EnhancedReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroShowcase;
