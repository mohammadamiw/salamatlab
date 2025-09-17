import React from 'react';
import { Card } from '@/components/ui/card';

const ServicesStrip: React.FC = () => {
  const items = [
    { t: 'پذیرش آزمایش', d: 'پذیرش آزمایش‌های تخصصی' },
    { t: 'راهنمای آزمایشگاه', d: 'ساختار و چارت آزمایشگاه' },
    { t: 'تعرفه‌ها', d: 'تعرفه و هزینه خدمات' },
    { t: 'اخبار و اطلاعیه', d: 'آخرین خبرها و اطلاعیه‌ها' },
  ];
  return (
    <section className="py-12 bg-brand-purple-dark">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-white font-bold mb-6">خدمات به آزمایشگاه‌ها</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {items.map((it, i) => (
            <Card key={i} className="p-5 rounded-xl bg-white/95">
              <div className="font-bold text-gray-800 mb-1">{it.t}</div>
              <div className="text-sm text-gray-600">{it.d}</div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesStrip;


