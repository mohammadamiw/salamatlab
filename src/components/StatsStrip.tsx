import React from 'react';
import AnimatedCounter from '@/components/AnimatedCounter';

const StatsStrip: React.FC = () => {
  const stats = [
    { label: 'مراجع روزانه', value: 150, suffix: '+', gradient: 'from-blue-600 to-sky-500' },
    { label: 'دقت نتایج', value: 99, suffix: '٪', gradient: 'from-emerald-600 to-green-500' },
    { label: 'خدمات فعال', value: 40, suffix: '+', gradient: 'from-purple-600 to-fuchsia-500' },
    { label: 'سال سابقه', value: 15, suffix: '+', gradient: 'from-rose-600 to-orange-500' },
  ];

  return (
    <section className="py-10 bg-light-gradient bg-grid">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white/70 backdrop-blur-sm p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 text-center gradient-border"
            >
              <div className={`text-3xl md:text-4xl font-extrabold bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>
                <AnimatedCounter end={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-gray-600 text-sm md:text-base">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsStrip;


