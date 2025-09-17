import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Beaker, 
  Search, 
  ArrowRight, 
  Home,
  TestTube,
  Droplets,
  Activity,
  Heart,
  Brain,
  Bone,
  Zap,
  Flame,
  Microscope,
  ActivitySquare,
  Stethoscope,
  Pill
} from 'lucide-react';

const BiochemistryServices: React.FC = () => {
  const [query, setQuery] = useState('');

  const biochemistryTests = [
    {
      category: 'بیوشیمی عمومی',
      subtitle: 'General Biochemistry',
      icon: Beaker,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      tests: [
        'Glucose (Fasting & Random)',
        'Urea (BUN)',
        'Creatinine',
        'Uric Acid',
        'Total Protein',
        'Albumin',
        'Globulin',
        'A/G Ratio',
        'Total Bilirubin',
        'Direct Bilirubin',
        'Indirect Bilirubin',
        'ALT (SGPT)',
        'AST (SGOT)',
        'ALP (Alkaline Phosphatase)',
        'GGT (Gamma Glutamyl Transferase)',
        'LDH (Lactate Dehydrogenase)',
        'CPK (Creatine Phosphokinase)',
        'Amylase',
        'Lipase',
        'Cholesterol (Total)',
        'HDL Cholesterol',
        'LDL Cholesterol',
        'Triglycerides',
        'VLDL Cholesterol',
        'Apo A1',
        'Apo B',
        'Lp(a)',
        'hs-CRP',
        'Homocysteine',
        'Fibrinogen',
        'D-Dimer',
        'Lipoprotein Analysis',
        'Cardiovascular Risk Markers',
        'Inflammatory Markers',
        'Oxidative Stress Markers',
        'Advanced Lipid Testing',
        'Metabolic Syndrome Markers'
      ]
    },
    {
      category: 'بیوشیمی ادرار',
      subtitle: 'Urine Biochemistry',
      icon: Droplets,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      tests: [
        'Urine pH',
        'Specific Gravity',
        'Protein (Qualitative & Quantitative)',
        'Glucose',
        'Ketones',
        'Blood',
        'Leukocytes',
        'Nitrites',
        'Bilirubin',
        'Urobilinogen',
        'Microalbumin',
        'Creatinine Clearance',
        '24h Protein Excretion',
        '24h Creatinine Excretion',
        'Osmolality',
        'Electrolytes (Na+, K+, Cl-, HCO3-)',
        'Calcium',
        'Phosphate',
        'Uric Acid',
        'Amylase'
      ]
    },
    {
      category: 'شاخص‌های قلبی',
      subtitle: 'Cardiac Markers',
      icon: Heart,
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      tests: [
        'Troponin I',
        'Troponin T',
        'CK-MB',
        'Myoglobin',
        'BNP (Brain Natriuretic Peptide)',
        'NT-proBNP',
        'hs-Troponin',
        'CRP (High Sensitivity)',
        'ESR',
        'Fibrinogen',
        'D-Dimer',
        'Homocysteine',
        'Lipoprotein(a)',
        'Apo B/Apo A1 Ratio'
      ]
    },
    {
      category: 'شاخص‌های کلیوی',
      subtitle: 'Renal Function Tests',
      icon: ActivitySquare,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      tests: [
        'Urea',
        'Creatinine',
        'eGFR (Estimated GFR)',
        'Cystatin C',
        'Uric Acid',
        'Electrolytes (Na+, K+, Cl-, HCO3-)',
        'Calcium',
        'Phosphate',
        'Magnesium',
        'Microalbumin',
        'Protein/Creatinine Ratio',
        'Albumin/Creatinine Ratio',
        'Creatinine Clearance',
        '24h Urine Collection Tests'
      ]
    },
    {
      category: 'شاخص‌های کبدی',
      subtitle: 'Liver Function Tests',
      icon: Pill,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      tests: [
        'Total Bilirubin',
        'Direct Bilirubin',
        'Indirect Bilirubin',
        'ALT (SGPT)',
        'AST (SGOT)',
        'ALP (Alkaline Phosphatase)',
        'GGT (Gamma Glutamyl Transferase)',
        'LDH (Lactate Dehydrogenase)',
        'Total Protein',
        'Albumin',
        'Globulin',
        'A/G Ratio',
        'Prothrombin Time (PT)',
        'INR',
        'Ammonia',
        'Alpha-1 Antitrypsin',
        'Ceruloplasmin',
        'Copper',
        'Zinc'
      ]
    },
    {
      category: 'شاخص‌های متابولیک',
      subtitle: 'Metabolic Markers',
      icon: Zap,
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'from-indigo-50 to-blue-50',
      tests: [
        'Glucose (Fasting & Random)',
        'HbA1c',
        'Fructosamine',
        'Insulin',
        'C-Peptide',
        'Proinsulin',
        'Glucagon',
        'Leptin',
        'Adiponectin',
        'Resistin',
        'Ghrelin',
        'GLP-1',
        'GIP',
        'Incretin Hormones',
        'Ketone Bodies',
        'Lactate',
        'Pyruvate'
      ]
    },
    {
      category: 'شاخص‌های استخوانی',
      subtitle: 'Bone Metabolism',
      icon: Bone,
      color: 'from-teal-500 to-green-600',
      bgColor: 'from-teal-50 to-green-50',
      tests: [
        'Calcium (Total & Ionized)',
        'Phosphate',
        'Magnesium',
        'Alkaline Phosphatase',
        'PTH (Parathyroid Hormone)',
        'Vitamin D (25-OH & 1,25-OH)',
        'Osteocalcin',
        'Beta-CrossLaps',
        'P1NP (Procollagen Type I N-Terminal Propeptide)',
        'NTX (N-Telopeptide)',
        'CTX (C-Telopeptide)',
        'Bone ALP',
        'Tartrate-Resistant Acid Phosphatase',
        'RANKL',
        'Osteoprotegerin'
      ]
    },
    {
      category: 'شاخص‌های تیروئیدی',
      subtitle: 'Thyroid Function',
      icon: Stethoscope,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'from-rose-50 to-pink-50',
      tests: [
        'TSH (Thyroid Stimulating Hormone)',
        'Free T4',
        'Free T3',
        'Total T4',
        'Total T3',
        'Reverse T3',
        'Thyroglobulin',
        'Anti-TPO Antibodies',
        'Anti-Thyroglobulin Antibodies',
        'TSH Receptor Antibodies',
        'Calcitonin',
        'Thyroid Binding Globulin'
      ]
    },
    {
      category: 'شاخص‌های هورمونی',
      subtitle: 'Hormonal Tests',
      icon: Brain,
      color: 'from-amber-500 to-yellow-600',
      bgColor: 'from-amber-50 to-yellow-50',
      tests: [
        'Cortisol (Morning & Evening)',
        'ACTH',
        'DHEA-S',
        'Testosterone (Total & Free)',
        'Estradiol',
        'Progesterone',
        'FSH',
        'LH',
        'Prolactin',
        'Growth Hormone',
        'IGF-1',
        'Aldosterone',
        'Renin',
        'Angiotensin II',
        'Vasopressin (ADH)',
        'Oxytocin'
      ]
    }
  ];

  const allTests = biochemistryTests.flatMap(cat => cat.tests);
  const filteredTests = query 
    ? allTests.filter(test => test.toLowerCase().includes(query.toLowerCase()))
    : allTests;

  const filteredCategories = query 
    ? biochemistryTests.filter(cat => 
        cat.category.toLowerCase().includes(query.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        cat.tests.some(test => test.toLowerCase().includes(query.toLowerCase()))
      )
    : biochemistryTests;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-cyan-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Hero Section */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 text-white p-8 md:p-12 mb-16 shadow-2xl">
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
                خدمات بیوشیمی
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-8 leading-relaxed">
                آزمایش‌های تخصصی بیوشیمی عمومی، ادرار و تخصصی با استفاده از پیشرفته‌ترین تکنولوژی‌ها
              </p>
              <div className="max-w-md">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در آزمایش‌های بیوشیمی..."
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
                {filteredTests.length} آزمایش از {allTests.length} آزمایش بیوشیمی یافت شد
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
                آزمایش‌های بیوشیمی در 9 دسته اصلی سازماندهی شده‌اند
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                          <p className="text-white/80 text-sm">{category.subtitle}</p>
                          <p className="text-white/80">{category.tests.length} آزمایش</p>
                        </div>
                      </div>
                    </div>

                    {/* Tests List */}
                    <div className="relative z-10 p-6">
                      <div 
                        className="tests-scroll-container"
                        style={{ 
                          height: '320px',
                          minHeight: '320px',
                          maxHeight: '320px',
                          overflowY: 'auto',
                          overflowX: 'hidden',
                          scrollbarWidth: 'thin',
                          scrollbarColor: '#d1d5db #f3f4f6',
                          paddingRight: '8px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          backgroundColor: '#fafafa'
                        }}
                      >
                        <div className="space-y-2 p-2">
                          {category.tests.map((test, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors bg-white">
                              <TestTube className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-gray-700 flex-1 text-sm leading-relaxed">{test}</span>
                              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors flex-shrink-0" />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect */}
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
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
          <div className="mt-16 p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">آماده برای نوبت‌دهی؟</h3>
              <p className="text-gray-600">برای رزرو نوبت آزمایش بیوشیمی با ما تماس بگیرید</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-8 py-3 text-lg"
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

export default BiochemistryServices;
