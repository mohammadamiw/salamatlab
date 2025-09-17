import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

const ParallaxHero: React.FC<{ onScrollToServices?: () => void }> = ({ onScrollToServices }) => {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    const onMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 10;
      const y = (e.clientY / innerHeight - 0.5) * 10;
      layer.style.transform = `translate(${x}px, ${y}px)`;
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <section className="relative overflow-hidden pt-32 pb-24 bg-hero-mesh">
      <div className="absolute inset-0 -z-10">
        <svg className="absolute -top-20 right-10 w-72 opacity-30 text-blue-400 animate-float-xy" viewBox="0 0 200 200" fill="currentColor" aria-hidden>
          <circle cx="100" cy="100" r="80" />
        </svg>
        <svg className="absolute bottom-0 left-10 w-56 opacity-20 text-emerald-400 animate-orbit" viewBox="0 0 200 200" fill="currentColor" aria-hidden>
          <circle cx="100" cy="100" r="6" />
        </svg>
      </div>
      <div ref={layerRef} className="absolute inset-0 -z-10 pointer-events-none" />

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 text-center lg:text-right space-y-6">
            <span className="inline-block text-xs tracking-wider uppercase bg-white/70 backdrop-blur px-3 py-1 rounded-full ring-1 ring-black/5">نسل جدید خدمات آزمایشگاهی</span>
            <h1 className="text-4xl md:text-5xl font-black leading-tight">
              <span className="bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent">ترکیب علم و نوآوری،</span>
              <br />
              تجربه‌ای متفاوت برای شما
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
              با انیمیشن‌های نرم، طراحی مدرن و فرآیندهای دقیق، تجربه‌ای مدرن و مطمئن از خدمات آزمایشگاهی ارائه می‌کنیم.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="rounded-xl">شروع نوبت‌دهی</Button>
              <Button size="lg" variant="outline" className="rounded-xl" onClick={onScrollToServices}>مشاهده خدمات</Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative max-w-xl mx-auto">
              <div className="absolute -z-10 -top-8 -left-8 w-40 h-40 rounded-full bg-blue-500/15 blur-2xl" />
              <div className="absolute -z-10 -bottom-8 -right-8 w-52 h-52 rounded-full bg-fuchsia-500/10 blur-2xl" />
              <div className="rounded-3xl overflow-hidden soft-shadow ring-1 ring-black/5">
                <img src="/images/about-space.jpg" alt="lab" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 left-6 right-6 mx-auto bg-white rounded-2xl p-4 shadow-xl flex items-center justify-between">
                <div className="text-sm text-gray-700">کیفیت تضمین‌شده | اعلام سریع نتایج</div>
                <div className="w-24 h-2 rounded-full bg-gradient-to-r from-blue-600 via-sky-400 to-emerald-400 bg-[length:200%_100%] animate-shine" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParallaxHero;


