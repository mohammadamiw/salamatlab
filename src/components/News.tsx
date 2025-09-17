
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const News = () => {
  const news = [
    {
      title: "راه‌اندازی سرویس جدید نمونه‌گیری در منزل",
      excerpt: "اکنون می‌توانید بدون مراجعه حضوری، درخواست نمونه‌گیری در منزل دهید.",
      date: "۱۵ اسفند ۱۴۰۴",
      image: "🏠"
    },
    {
      title: "تخفیف ویژه چکاپ‌های سلامت",
      excerpt: "تا پایان ماه، تمام چکاپ‌های جامع با ۲۰٪ تخفیف ارائه می‌شوند.",
      date: "۱۰ اسفند ۱۴۰۲",
      image: "💰"
    },
    {
      title: "بروزرسانی سیستم آنلاین آزمایشگاه",
      excerpt: "سیستم دریافت نتایج آنلاین بهبود یافته و سریع‌تر شده است.",
      date: "۵ اسفند ۱۴۰۲",
      image: "💻"
    }
  ];

  return (
    <section id="news" className="py-20 bg-medical-gray bg-grid">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-blue-700 to-sky-500 bg-clip-text text-transparent mb-3">اخبار آزمایشگاه</h2>
          <p className="text-gray-600 text-lg">آخرین اخبار و اطلاعیه‌های آزمایشگاه سلامت</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((item, index) => (
            <Card key={index} className="overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white group rounded-2xl">
              <div className="h-48 bg-gray-100 flex items-center justify-center text-6xl">
                {item.image}
              </div>
              <div className="p-6">
                <div className="text-sm text-gray-500 font-medium mb-2">{item.date}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-700">{item.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{item.excerpt}</p>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-800 hover:text-white">
                  ادامه مطلب
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
