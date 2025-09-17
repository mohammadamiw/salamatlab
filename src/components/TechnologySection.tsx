import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const TechnologySection: React.FC = () => {
  const points = [
    'فرآیندهای استاندارد و کنترل کیفیت مستمر',
    'تجهیزات مدرن و کالیبراسیون دوره‌ای',
    'اعلام نتایج سریع همراه با گزارش شفاف',
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-black mb-4">
              فناوری و فرآیندهای ما
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              ما با تکیه بر تجهیزات پیشرفته و پروتکل‌های دقیق آزمایشگاهی، تلاش می‌کنیم نتایج قابل اتکا و
              به‌موقع ارائه دهیم و تجربه‌ای شفاف و حرفه‌ای برای بیماران و پزشکان فراهم کنیم.
            </p>
            <ul className="space-y-3">
              {points.map((t, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl overflow-hidden soft-shadow ring-1 ring-black/5">
            <img src="/images/about-doctor1.jpg" alt="technology" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnologySection;


