
import React from 'react';
import { Card } from "@/components/ui/card";

const Gallery = () => {
  const galleryItems = [
    {
      title: "آزمایشگاه مدرن",
      description: "تجهیزات پیشرفته آزمایشگاه",
      emoji: "🔬"
    },
    {
      title: "بخش نمونه‌گیری",
      description: "محیط آرام و بهداشتی",
      emoji: "💉"
    },
    {
      title: "تیم متخصص",
      description: "کادر مجرب و حرفه‌ای",
      emoji: "👥"
    },
    {
      title: "سیستم کیفیت",
      description: "کنترل کیفیت در تمام مراحل",
      emoji: "✅"
    },
    {
      title: "انبار نمونه‌ها",
      description: "نگهداری استاندارد نمونه‌ها",
      emoji: "🏪"
    },
    {
      title: "بخش گزارش‌دهی",
      description: "صدور سریع و دقیق نتایج",
      emoji: "📊"
    }
  ];

  return (
    <section id="gallery" className="py-20 bg-medical-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">گالری تصاویر</h2>
          <p className="text-gray-600 text-lg">نگاهی به امکانات و فضاهای آزمایشگاه سلامت</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, index) => (
            <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
              <div className="h-48 bg-medical-gradient flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-500">
                {item.emoji}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
