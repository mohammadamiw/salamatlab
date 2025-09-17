import React, { useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Card } from '@/components/ui/card';

const TestimonialsCarousel: React.FC = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });
  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const items = [
    {
      name: 'الهام رستمی',
      text: 'کادر حرفه‌ای و محترم، نتیجه آزمایش دقیق و سریع آماده شد. تجربه بسیار خوب بود.',
    },
    {
      name: 'سینا پاکدل',
      text: 'چکاپ کامل انجام دادم، فرآیند بسیار منظم بود. از تیم نمونه‌گیری تشکر می‌کنم.',
    },
    {
      name: 'نگین سعیدی',
      text: 'پشتیبانی آنلاین خیلی کمکم کرد. نوبت‌گیری هم راحت و سریع بود.',
    },
  ];

  return (
    <section className="py-20 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">تجربه بیماران</h2>
          <p className="text-gray-600">بازخورد واقعی از مراجعان آزمایشگاه سلامت</p>
        </div>

        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -mr-4">
              {items.map((it, idx) => (
                <div key={idx} className="min-w-0 flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_33%] pr-4">
                  <Card className="p-6 h-full bg-white/90 backdrop-blur shadow-card hover:shadow-card-hover transition-all">
                    <p className="text-gray-700 leading-relaxed mb-4">{it.text}</p>
                    <div className="text-sm text-gray-500">{it.name}</div>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          <button
            aria-label="قبلی"
            onClick={scrollPrev}
            className="absolute -left-2 top-1/2 -translate-y-1/2 rounded-full bg-white shadow p-2 hidden md:block"
          >
            ‹
          </button>
          <button
            aria-label="بعدی"
            onClick={scrollNext}
            className="absolute -right-2 top-1/2 -translate-y-1/2 rounded-full bg-white shadow p-2 hidden md:block"
          >
            ›
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsCarousel;


