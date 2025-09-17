import React from 'react';
import { BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroOverlay: React.FC<{ onPrimary?: () => void }> = ({ onPrimary }) => {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/about-space.jpg" alt="hero" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/70 via-brand-purple-dark/70 to-brand-purple-dark/80" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-24 pb-24">
        <div className="max-w-3xl mx-auto text-center text-white space-y-5">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full text-sm">
            <span className="inline-flex w-2 h-2 rounded-full bg-brand-orange" />
            حتی جمعه‌ها تعطیل نیست!
          </div>
          <h1 className="text-3xl md:text-5xl font-black leading-tight">آزمایشگاه پاتوبیولوژی سلامت</h1>
          <p className="text-white/90 text-lg">ارائه خدمات تخصصی آزمایشگاهی، سریع، دقیق و قابل اتکا</p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={onPrimary} size="lg" className="rounded-xl bg-brand-orange hover:bg-brand-orange/90 text-white">راهنمای مراجعین</Button>
            <Button variant="outline" size="lg" className="rounded-xl border-white text-white hover:bg-white/10" onClick={onPrimary}>رزرو نوبت</Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/80 text-sm">
            <BadgeCheck className="w-4 h-4" /> نتایج معتبر و قابل پیگیری
          </div>
        </div>

        {/* Side dots */}
        <div className="hidden md:flex flex-col gap-3 absolute top-1/2 -translate-y-1/2 right-6">
          {[0,1,2].map((i)=> (
            <span key={i} className={`w-3 h-3 rounded-full ${i===0 ? 'bg-white' : 'bg-white/50'}`} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroOverlay;


