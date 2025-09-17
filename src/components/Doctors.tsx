
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BookingForm from './BookingForm';

const Doctors = () => {
  const doctors = [
    {
      name: "دکتر علی احمدی",
      specialty: "متخصص پاتولوژی",
      experience: "۱۵ سال سابقه",
      image: "👨‍⚕️",
      rating: 4.9,
      location: "تهران - میدان ونک"
    },
    {
      name: "دکتر مریم کریمی",
      specialty: "متخصص آزمایشگاه",
      experience: "۱۲ سال سابقه",
      image: "👩‍⚕️",
      rating: 4.8,
      location: "تهران - سعادت‌آباد"
    },
    {
      name: "دکتر حسن رضایی",
      specialty: "متخصص میکروبیولوژی",
      experience: "۱۸ سال سابقه",
      image: "👨‍⚕️",
      rating: 4.9,
      location: "کرج - گوهردشت"
    },
    {
      name: "دکتر فاطمه مرادی",
      specialty: "متخصص بیوشیمی",
      experience: "۱۰ سال سابقه",
      image: "👩‍⚕️",
      rating: 4.7,
      location: "تهران - تجریش"
    },
    {
      name: "دکتر محمد صادقی",
      specialty: "متخصص ژنتیک",
      experience: "۸ سال سابقه",
      image: "👨‍⚕️",
      rating: 4.8,
      location: "اصفهان - خیابان هزار جریب"
    },
    {
      name: "دکتر زهرا نوری",
      specialty: "متخصص ایمونولوژی",
      experience: "۱۴ سال سابقه",
      image: "👩‍⚕️",
      rating: 4.9,
      location: "شیراز - بلوار زند"
    }
  ];

  return (
    <section id="doctors" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">پزشکان و متخصصان</h2>
          <p className="text-gray-600 text-lg">تیم مجرب پزشکان و متخصصان آزمایشگاه سلامت</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor, index) => (
            <Card key={index} className="p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white to-medical-blue-light group">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {doctor.image}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{doctor.name}</h3>
                <p className="text-primary font-medium mb-1">{doctor.specialty}</p>
                <p className="text-gray-600 text-sm">{doctor.experience}</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">امتیاز:</span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 text-lg">⭐</span>
                    <span className="text-gray-800 font-medium mr-1">{doctor.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">مکان:</span>
                  <span className="text-gray-800 text-sm">{doctor.location}</span>
                </div>
              </div>

              <div className="flex space-x-2 space-x-reverse">
                <Button variant="outline" className="flex-1 border-primary text-primary hover:bg-primary hover:text-white">
                  مشاهده پروفایل
                </Button>
                <BookingForm
                  type="doctor"
                  title={doctor.name}
                  subtitle={doctor.specialty}
                  trigger={
                    <Button className="flex-1 bg-medical-gradient hover:opacity-90">
                      رزرو ویزیت
                    </Button>
                  }
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
