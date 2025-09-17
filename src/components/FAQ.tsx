import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  className?: string;
}

const FAQ: React.FC<FAQProps> = ({ 
  items, 
  title = "سوالات متداول", 
  className = '' 
}) => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  // Add FAQ Schema
  useEffect(() => {
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": items.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(faqSchema);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [items]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <Card className={`p-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm rounded-2xl ${className}`}>
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <HelpCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600">پاسخ سوالات رایج شما در اینجا</p>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <Card key={index} className="border border-gray-200 rounded-xl overflow-hidden">
            <Button
              variant="ghost"
              onClick={() => toggleItem(index)}
              className="w-full p-6 text-right justify-between hover:bg-blue-50 transition-colors duration-200"
            >
              <span className="text-lg font-medium text-gray-800 flex-1">
                {item.question}
              </span>
              {openItems.includes(index) ? (
                <ChevronUp className="w-5 h-5 text-blue-600 flex-shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}
            </Button>
            
            {openItems.includes(index) && (
              <div className="px-6 pb-6 pt-0">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </Card>
  );
};

// Pre-defined FAQ items for different pages
export const generalFAQItems: FAQItem[] = [
  {
    question: "چگونه می‌توانم نوبت پزشک بگیرم؟",
    answer: "شما می‌توانید از طریق تماس تلفنی با شماره 021-46833010 یا مراجعه حضوری به آزمایشگاه نوبت خود را رزرو کنید. همچنین امکان نوبت‌گیری آنلاین نیز فراهم است."
  },
  {
    question: "ساعات کاری آزمایشگاه چگونه است؟",
    answer: "آزمایشگاه از شنبه تا چهارشنبه از ساعت 6:30 صبح تا 20:30 شب و پنجشنبه‌ها از 6:30 صبح تا 19:30 شب فعال است. در روزهای تعطیل نیز خدمات اورژانسی ارائه می‌شود."
  },
  {
    question: "آیا امکان نمونه‌گیری در منزل وجود دارد؟",
    answer: "بله، خدمات نمونه‌گیری در منزل برای راحتی بیماران ارائه می‌شود. برای استفاده از این خدمت با شماره 021-46833010 تماس بگیرید."
  },
  {
    question: "نتایج آزمایش چه زمانی آماده می‌شود؟",
    answer: "اکثر آزمایش‌های عمومی در همان روز آماده می‌شوند. آزمایش‌های تخصصی‌تر ممکن است 2-3 روز کاری زمان نیاز داشته باشند. نتایج از طریق پیامک و تلفن اطلاع‌رسانی می‌شود."
  }
];

export const doctorsFAQItems: FAQItem[] = [
  {
    question: "چگونه بهترین پزشک متخصص را انتخاب کنم؟",
    answer: "برای انتخاب بهترین پزشک، به تخصص، تجربه، موقعیت جغرافیایی و نظرات سایر بیماران توجه کنید. همچنین می‌توانید با تیم مشاوره ما تماس بگیرید."
  },
  {
    question: "آیا پزشکان در شهرقدس قابل اعتماد هستند؟",
    answer: "تمام پزشکان معرفی شده دارای مجوز رسمی از نظام پزشکی و تجربه کافی هستند. اطلاعات شماره نظام هر پزشک نیز ارائه شده است."
  },
  {
    question: "هزینه ویزیت پزشکان چقدر است؟",
    answer: "هزینه ویزیت بسته به تخصص پزشک متفاوت است. برای اطلاع از تعرفه‌های دقیق با مطب مربوطه تماس بگیرید."
  },
  {
    question: "آیا امکان ویزیت آنلاین وجود دارد؟",
    answer: "برخی از پزشکان امکان مشاوره آنلاین ارائه می‌دهند. برای اطلاع از این خدمت با مطب مربوطه هماهنگ کنید."
  }
];

export default FAQ;