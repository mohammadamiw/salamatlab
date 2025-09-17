import React from 'react';
import { ShieldCheck, Microscope, Clock, Truck } from 'lucide-react';

const perks = [
  { icon: ShieldCheck, title: 'نتایج معتبر', desc: 'کیفیت و دقت استاندارد' },
  { icon: Microscope, title: 'تجهیزات پیشرفته', desc: 'پروتکل‌های به‌روز' },
  { icon: Clock, title: 'تحویل سریع', desc: 'اعلام نتیجه به‌موقع' },
  { icon: Truck, title: 'نمونه‌گیری در محل', desc: 'منطقه تحت پوشش' },
];

const HeroPerks: React.FC = () => {
  return (
    <div className="-mt-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {perks.map((p, idx) => (
            <div key={idx} className="rounded-2xl glass-card shadow-card p-4 flex items-center gap-3">
              <div className="rounded-xl bg-medical-gradient text-white p-2">
                <p.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-gray-800">{p.title}</div>
                <div className="text-xs text-gray-500">{p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroPerks;


