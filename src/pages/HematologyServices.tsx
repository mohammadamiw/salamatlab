import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Droplets, 
  Search, 
  ArrowRight, 
  Home,
  TestTube,
  Microscope,
  Activity,
  Heart,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react';

const HematologyServices: React.FC = () => {
  const [query, setQuery] = useState('');

  const hematologyTests = [
    {
      category: 'آزمایش‌های اصلی خون',
      icon: Droplets,
      color: 'from-red-500 to-pink-600',
      tests: [
        'CBC (Complete Blood Count)',
        'RBC (Red Blood Cell Count)',
        'WBC (White Blood Cell Count)',
        'Hemoglobin (Hb)',
        'Hematocrit (Hct)',
        'MCV (Mean Corpuscular Volume)',
        'MCH (Mean Corpuscular Hemoglobin)',
        'MCHC (Mean Corpuscular Hemoglobin Concentration)',
        'RDW (Red Cell Distribution Width)',
        'Platelet Count',
        'MPV (Mean Platelet Volume)',
        'PDW (Platelet Distribution Width)'
      ]
    },
    {
      category: 'دیفرانسیال WBC',
      icon: Microscope,
      color: 'from-blue-500 to-cyan-600',
      tests: [
        'Neutrophils (Segmented & Band)',
        'Lymphocytes',
        'Monocytes',
        'Eosinophils',
        'Basophils',
        'Blast Cells',
        'Promyelocytes',
        'Myelocytes',
        'Metamyelocytes'
      ]
    },
    {
      category: 'شاخص‌های آهن',
      icon: Heart,
      color: 'from-orange-500 to-red-600',
      tests: [
        'Serum Iron',
        'TIBC (Total Iron Binding Capacity)',
        'Ferritin',
        'Transferrin',
        'Transferrin Saturation',
        'Soluble Transferrin Receptor'
      ]
    },
    {
      category: 'شاخص‌های التهابی',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      tests: [
        'ESR (Erythrocyte Sedimentation Rate)',
        'CRP (C-Reactive Protein)',
        'Procalcitonin',
        'Fibrinogen'
      ]
    },
    {
      category: 'شاخص‌های ایمنی',
      icon: Shield,
      color: 'from-purple-500 to-violet-600',
      tests: [
        'Immunoglobulins (IgG, IgA, IgM, IgE)',
        'Complement Components (C3, C4)',
        'Rheumatoid Factor',
        'ANA (Antinuclear Antibody)',
        'Anti-dsDNA'
      ]
    },
    {
      category: 'شاخص‌های متابولیک',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      tests: [
        'Vitamin B12',
        'Folic Acid',
        'Homocysteine',
        'Methylmalonic Acid',
        'Haptoglobin',
        'Haptoglobin Phenotype'
      ]
    }
  ];

  const allTests = hematologyTests.flatMap(cat => cat.tests);
  const filteredTests = query 
    ? allTests.filter(test => test.toLowerCase().includes(query.toLowerCase()))
    : allTests;

  const filteredCategories = query 
    ? hematologyTests.filter(cat => 
        cat.category.toLowerCase().includes(query.toLowerCase()) ||
        cat.tests.some(test => test.toLowerCase().includes(query.toLowerCase()))
      )
    : hematologyTests;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-white to-pink-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Hero Section */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-600 via-pink-600 to-rose-600 text-white p-8 md:p-12 mb-16 shadow-2xl">
            <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <Link to="/services">
                  <Button variant="ghost" size="sm" className="text-white/80 hover:text-white hover:bg-white/20">
                    <Home className="w-4 h-4 ml-2" />
                    بازگشت به خدمات
                  </Button>
                </Link>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                خدمات هماتولوژی
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-8 leading-relaxed">
                آزمایش‌های تخصصی خون و سلول‌های خونی با استفاده از پیشرفته‌ترین تکنولوژی‌ها
              </p>
              <div className="max-w-md">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در آزمایش‌های هماتولوژی..."
                  className="bg-white/95 text-gray-800 placeholder:text-gray-500 border-0 shadow-xl focus-visible:ring-2 focus-visible:ring-white text-lg"
                />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Search Results Summary */}
        {query && (
          <Reveal>
            <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Search className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-800">نتایج جستجو</h3>
              </div>
              <p className="text-gray-600">
                {filteredTests.length} آزمایش از {allTests.length} آزمایش هماتولوژی یافت شد
              </p>
              {filteredTests.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filteredTests.slice(0, 10).map((test, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200">
                      {test}
                    </span>
                  ))}
                  {filteredTests.length > 10 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      +{filteredTests.length - 10} مورد دیگر
                    </span>
                  )}
                </div>
              )}
            </div>
          </Reveal>
        )}

        {/* Categories Grid */}
        <div className="space-y-8">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                دسته‌بندی آزمایش‌ها
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                آزمایش‌های هماتولوژی در 6 دسته اصلی سازماندهی شده‌اند
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-8">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Reveal key={category.category}>
                  <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0">
                    {/* Header */}
                    <div className={`bg-gradient-to-br ${category.color} p-6 text-white`}>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{category.category}</h3>
                          <p className="text-white/80">{category.tests.length} آزمایش</p>
                        </div>
                      </div>
                    </div>

                    {/* Tests List */}
                    <div className="p-6">
                      <div className="space-y-3">
                        {category.tests.map((test, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                            <TestTube className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-700 flex-1">{test}</span>
                            <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  </Card>
                </Reveal>
              );
            })}
          </div>

          {/* No Results */}
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

        {/* Quick Actions */}
        <Reveal>
          <div className="mt-16 p-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">آماده برای نوبت‌دهی؟</h3>
              <p className="text-gray-600">برای رزرو نوبت آزمایش هماتولوژی با ما تماس بگیرید</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
              >
                رزرو نوبت آنلاین
              </Button>
              <Button 
                onClick={() => window.open('tel:02146833010', '_self')}
                variant="outline" 
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3 text-lg"
              >
                تماس با آزمایشگاه
              </Button>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
};

export default HematologyServices;
