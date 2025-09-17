import React from 'react';
import { CalendarClock, FlaskConical, FileCheck, Home } from 'lucide-react';

const StepsStrip: React.FC = () => {
  const steps = [
    { icon: CalendarClock, title: 'رزرو آنلاین', desc: 'زمان‌بندی سریع' },
    { icon: Home, title: 'نمونه‌گیری در محل', desc: 'پوشش منتخب' },
    { icon: FlaskConical, title: 'انجام آزمایش', desc: 'تجهیزات پیشرفته' },
    { icon: FileCheck, title: 'دریافت نتایج', desc: 'آنلاین و سریع' },
  ];
  return (
    <section className="py-12 bg-brand-purple">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-6 text-white">
          {steps.map((s, i) => (
            <div key={i} className="rounded-2xl bg-white/10 p-5 flex items-center gap-3">
              <div className="bg-white text-brand-purple rounded-xl p-2">
                {React.createElement(s.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <div className="font-bold">{s.title}</div>
                <div className="text-sm text-white/80">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsStrip;


