import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

const items = [
  {
    title: 'راه‌اندازی سرویس گزارش‌دهی به‌روز نتایج',
    date: '۱۴۰۴/۰۶/۱۰',
    excerpt: 'اعلام نتایج آنلاین، سریع‌تر و با رابط کاربری جدید.',
  },
  {
    title: 'اضافه شدن چکاپ‌های تخصصی جدید',
    date: '۱۴۰۴/۰۵/۲۲',
    excerpt: 'پوشش گسترده‌تر خدمات برای پایش دقیق‌تر سلامت.',
  },
  {
    title: 'بهبود فرایند نمونه‌گیری در منزل',
    date: '۱۴۰۴/۰۵/۰۵',
    excerpt: 'زمان‌بندی منعطف‌تر و اطلاع‌رسانی دقیق‌تر.',
  },
];

const PressReleases: React.FC = () => {
  return (
    <section className="py-20 bg-secondary/40">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">آخرین خبرها</h2>
            <p className="text-gray-600 mt-1">به‌روزرسانی‌های مهم و اطلاعیه‌ها</p>
          </div>
          <button className="text-blue-700 hover:text-blue-800 flex items-center gap-2" aria-label="مشاهده همه خبرها">
            مشاهده همه
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((it, i) => (
            <Card key={i} className="p-5 rounded-2xl bg-white ring-1 ring-gray-200 hover:ring-blue-200 shadow-sm hover:shadow-md transition-colors">
              <div className="text-sm text-gray-500 mb-2">{it.date}</div>
              <div className="font-bold text-gray-900 mb-1">{it.title}</div>
              <p className="text-sm text-gray-600">{it.excerpt}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PressReleases;


