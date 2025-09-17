import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import EnhancedReveal from '@/components/EnhancedReveal';
import WaveDivider from '@/components/WaveDivider';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Link } from 'react-router-dom';
import Checkups from '@/components/Checkups';

const RequestCheckup: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-24">
        <EnhancedReveal direction="up" delay={150}>
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">خانه</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/services">خدمات</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>درخواست چکاپ</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </EnhancedReveal>

        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-600 text-white p-8 md:p-12 mb-16 shadow-2xl">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                درخواست چکاپ
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-2 leading-relaxed">
                از بین پنل‌های آماده انتخاب کنید و به‌صورت آنلاین رزرو نمایید
              </p>
              <p className="text-white/80 max-w-3xl">
                مناسب برای همه سنین و نیازها؛ همراه با امکان مشاوره و نمونه‌گیری در محل
              </p>
            </div>
          </div>
        </Reveal>

        <EnhancedReveal direction="scale" delay={250}>
          <Checkups showInfo={false} />
        </EnhancedReveal>
      </main>
      <Footer />
    </div>
  );
};

export default RequestCheckup;


