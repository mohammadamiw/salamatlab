import React from 'react';
import { Card } from '@/components/ui/card';

const DepartmentsCards: React.FC = () => {
  const items = [
    { t: 'بخش ژنتیک', d: 'خدمات ژنتیک، مشاوره و غربالگری', img: '/images/about-space.jpg' },
    { t: 'بیماری‌ها و آزمایش‌ها', d: 'مجموعه‌ای از تست‌ها بر اساس بیماری', img: '/images/about-doctor1.jpg' },
    { t: 'اطلاعیه و اخبار', d: 'آخرین بروزرسانی‌ها و توصیه‌ها', img: '/images/about-doctor2.jpg' },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <Card key={i} className="overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-all">
              <div className="h-40">
                <img src={it.img} alt={it.t} className="w-full h-full object-cover" />
              </div>
              <div className="p-5">
                <div className="font-bold text-gray-800 mb-1">{it.t}</div>
                <div className="text-sm text-gray-600">{it.d}</div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DepartmentsCards;


