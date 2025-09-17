import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroBannerClassicProps {
  onCTA?: () => void;
}

const DotNav = () => (
  <div className="hidden md:flex flex-col items-center gap-3 absolute top-1/2 -translate-y-1/2 left-6 z-10">
    {[0,1,2,3].map((i) => (
      <span key={i} className={`w-3 h-3 rounded-full bg-white/70 hover:bg-white transition-colors`}></span>
    ))}
  </div>
);

const HeroBannerClassic: React.FC<HeroBannerClassicProps> = ({ onCTA }) => {
  return (
    <section className="relative overflow-hidden">
      <img src="/images/about-doctor2.jpg" alt="hero" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-brand-purple/80 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      <DotNav />
      <div className="container mx-auto px-4 pt-28 pb-24 relative z-10">
        <div className="max-w-2xl ml-auto text-center md:text-right text-white">
          <div className="inline-block bg-white/20 text-white rounded-full px-4 py-1 mb-4 text-sm">آزمایشگاه پاتوبیولوژی و ژنتیک</div>
          <h1 className="text-3xl md:text-5xl font-black mb-4">حتی جمعه ها تعطیل نیست!</h1>
          <p className="text-white/90 mb-8 leading-relaxed">ارائه خدمات آزمایشگاهی دقیق و سریع با امکان نمونه‌گیری در محل و مشاهده آنلاین نتایج.</p>
          <Button size="lg" className="bg-white text-brand-purple hover:bg-white/90" onClick={onCTA}>نوبت‌دهی</Button>
        </div>
      </div>
    </section>
  );
};

export default HeroBannerClassic;


