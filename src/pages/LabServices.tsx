import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import CanonicalTag from '@/components/CanonicalTag';
import MetaTags from '@/components/MetaTags';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { 
  Droplets, 
  Microscope, 
  FlaskConical, 
  TestTube, 
  Syringe, 
  Activity, 
  Dna, 
  Zap, 
  Pill, 
  Search,
  ArrowLeft,
  Beaker
} from 'lucide-react';

const LabServices: React.FC = () => {
  const [query, setQuery] = useState('');

  const serviceCategories = [
    {
      id: 'hematology',
      title: 'هماتولوژی',
      subtitle: 'Hematology',
      description: 'آزمایش‌های خون و سلول‌های خونی',
      icon: Droplets,
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      itemCount: 18,
      path: '/services/hematology'
    },
    {
      id: 'coagulation',
      title: 'انعقاد خون',
      subtitle: 'Coagulation',
      description: 'آزمایش‌های انعقاد و فاکتورهای خونی',
      icon: Activity,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
      itemCount: 18,
      path: '/services/coagulation'
    },
    {
      id: 'biochemistry',
      title: 'بیوشیمی',
      subtitle: 'Biochemistry',
      description: 'آزمایش‌های بیوشیمیایی عمومی و تخصصی',
      icon: Beaker,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      itemCount: 67,
      path: '/services/biochemistry'
    },
    {
      id: 'microbiology',
      title: 'میکروبیولوژی',
      subtitle: 'Microbiology',
      description: 'کشت و شناسایی میکروارگانیسم‌ها',
      icon: Microscope,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      itemCount: 6,
      path: '/services/microbiology'
    },
    {
      id: 'immunology',
      title: 'ایمونولوژی و آلرژی',
      subtitle: 'Immunology & Allergy',
      description: 'آزمایش‌های ایمنی و حساسیت',
      icon: Syringe,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      itemCount: 120,
      path: '/services/immunology'
    },
    {
      id: 'cytology',
      title: 'سیتولوژی',
      subtitle: 'Cytology',
      description: 'بررسی سلول‌ها و بافت‌ها',
      icon: TestTube,
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'from-indigo-50 to-blue-50',
      itemCount: 16,
      path: '/services/cytology'
    },
    {
      id: 'molecular',
      title: 'تشخیص مولکولی',
      subtitle: 'Molecular Diagnosis',
      description: 'آزمایش‌های PCR و ژنتیک',
      icon: Dna,
      color: 'from-teal-500 to-green-600',
      bgColor: 'from-teal-50 to-green-50',
      itemCount: 12,
      path: '/services/molecular-diagnosis'
    },
    {
      id: 'flow-cytometry',
      title: 'فلوسایتومتری',
      subtitle: 'Flow Cytometry',
      description: 'ایمونوفنوتایپینگ سلول‌ها',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      itemCount: 216,
      path: '/services/flow-cytometry'
    },
    {
      id: 'toxicology',
      title: 'سم شناسی',
      subtitle: 'Toxicology & TDM',
      description: 'پایش داروها و سموم',
      icon: Pill,
      color: 'from-gray-500 to-slate-600',
      bgColor: 'from-gray-50 to-slate-50',
      itemCount: 216,
      path: '/services/toxicology'
    },
    {
      id: 'research',
      title: 'پروژه‌های تحقیقاتی',
      subtitle: 'Research Projects',
      description: 'آزمایش‌های درخواستی و تحقیقاتی',
      icon: Search,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'from-rose-50 to-pink-50',
      itemCount: 22,
      path: '/services/research'
    }
  ];

  const filteredCategories = query 
    ? serviceCategories.filter(cat => 
        cat.title.toLowerCase().includes(query.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        cat.description.toLowerCase().includes(query.toLowerCase())
      )
    : serviceCategories;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <CanonicalTag path="/services" />
      <MetaTags
        title="خدمات آزمایشگاهی | آزمایشگاه تشخیص پزشکی سلامت"
        description="خدمات کامل آزمایشگاهی شامل هماتولوژی، بیوشیمی، میکروبیولوژی، ایمونولوژی، سیتولوژی، تشخیص مولکولی و سایر آزمایش‌های تخصصی پزشکی"
        keywords="خدمات آزمایشگاهی, هماتولوژی, بیوشیمی, میکروبیولوژی, ایمونولوژی, سیتولوژی, تشخیص مولکولی, آزمایش خون, آزمایشگاه سلامت"
        ogImage="https://www.salamatlab.com/services-preview.jpg"
        path="/services"
      />
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Hero Section */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-sky-600 to-cyan-600 text-white p-8 md:p-12 mb-16 shadow-2xl">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                خدمات آزمایشگاه سلامت
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-8 leading-relaxed">
                مجموعه‌ای کامل از خدمات تشخیصی پیشرفته در زمینه‌های مختلف پزشکی و آزمایشگاهی
              </p>
              <div className="max-w-md">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در بخش‌های خدمات..."
                  className="bg-white/95 text-gray-800 placeholder:text-gray-500 border-0 shadow-xl focus-visible:ring-2 focus-visible:ring-white text-lg"
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Services Grid */}
        <div className="space-y-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                بخش‌های خدمات
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                هر بخش شامل مجموعه‌ای از آزمایش‌های تخصصی با استانداردهای بین‌المللی
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Reveal key={category.id}>
                  <Link to={category.path}>
                    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer border-0">
                      {/* Background Pattern */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.bgColor} opacity-50`} />
                      
                      {/* Icon */}
                      <div className={`absolute top-6 right-6 w-16 h-16 bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Content */}
                      <div className="relative p-8 pt-20">
                        <div className="mb-4">
                          <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                            {category.title}
                          </h3>
                          <p className="text-lg font-medium text-gray-600 mb-3">
                            {category.subtitle}
                          </p>
                          <p className="text-gray-600 leading-relaxed">
                            {category.description}
                          </p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <span className="text-sm text-gray-500">
                            {category.itemCount} آزمایش
                          </span>
                          <div className={`w-8 h-8 bg-gradient-to-br ${category.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                            <ArrowLeft className="w-4 h-4 text-white rotate-180" />
                          </div>
                        </div>
                      </div>

                      {/* Hover Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    </Card>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <Reveal>
              <div className="text-center py-16">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600 mb-2">نتیجه‌ای یافت نشد</h3>
                <p className="text-gray-500">لطفاً عبارت جستجوی دیگری را امتحان کنید</p>
              </div>
            </Reveal>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LabServices;


