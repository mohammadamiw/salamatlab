import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Microscope, 
  Search, 
  ArrowRight, 
  Home,
  TestTube,
  Droplets,
  Heart,
  Zap,
  Shield,
  ActivitySquare,
  Pill,
  Beaker,
  Bug,
  Flask,
  Bacteria,
  Virus,
  TestTube2
} from 'lucide-react';

const MicrobiologyServices: React.FC = () => {
  const [query, setQuery] = useState('');

  const microbiologyTests = [
    {
      category: 'کشت هوازی و بی‌هوازی - مایعات بدن',
      subtitle: 'Aerobic & Anaerobic Culture - Body Fluids',
      icon: Droplets,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      tests: [
        'Blood Culture (Aerobic & Anaerobic)',
        'Cerebrospinal Fluid (CSF) Culture',
        'Pleural Fluid Culture',
        'Peritoneal Fluid Culture',
        'Synovial Fluid Culture',
        'Pericardial Fluid Culture',
        'Amniotic Fluid Culture',
        'Bile Culture',
        'Pancreatic Fluid Culture',
        'Lymph Node Aspirate Culture',
        'Bone Marrow Culture',
        'Joint Fluid Culture',
        'Abscess Fluid Culture',
        'Empyema Fluid Culture',
        'Ascitic Fluid Culture',
        'Peritoneal Dialysate Culture',
        'Ventricular Fluid Culture',
        'Subdural Fluid Culture'
      ]
    },
    {
      category: 'کشت هوازی و بی‌هوازی - عفونت‌های تنفسی',
      subtitle: 'Aerobic & Anaerobic Culture - Respiratory Infections',
      icon: Heart,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      tests: [
        'Sputum Culture & Sensitivity',
        'Bronchoalveolar Lavage (BAL) Culture',
        'Endotracheal Aspirate Culture',
        'Throat Swab Culture',
        'Nasal Swab Culture',
        'Nasopharyngeal Swab Culture',
        'Tonsillar Swab Culture',
        'Sinus Aspirate Culture',
        'Middle Ear Fluid Culture',
        'Mastoid Culture',
        'Tracheal Aspirate Culture',
        'Pleural Fluid Culture (Respiratory)',
        'Lung Tissue Culture',
        'Lymph Node Culture (Cervical)',
        'Retropharyngeal Abscess Culture',
        'Peritonsillar Abscess Culture',
        'Epiglottitis Culture',
        'Laryngitis Culture'
      ]
    },
    {
      category: 'کشت هوازی و بی‌هوازی - سل',
      subtitle: 'Aerobic & Anaerobic Culture - Tuberculosis',
      icon: Bug,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
      tests: [
        'Mycobacterium tuberculosis Culture',
        'Acid-Fast Bacilli (AFB) Culture',
        'Mycobacterium Culture & Identification',
        'TB Sputum Culture',
        'TB Bronchoalveolar Lavage Culture',
        'TB Tissue Culture',
        'TB Lymph Node Culture',
        'TB Pleural Fluid Culture',
        'TB CSF Culture',
        'TB Urine Culture',
        'TB Gastric Aspirate Culture',
        'TB Bone Marrow Culture',
        'TB Joint Fluid Culture',
        'TB Abscess Culture',
        'TB Wound Culture',
        'TB Blood Culture',
        'TB Stool Culture',
        'TB Genital Culture'
      ]
    },
    {
      category: 'کشت هوازی و بی‌هوازی - عفونت‌های گوارشی',
      subtitle: 'Aerobic & Anaerobic Culture - Gastrointestinal Infections',
      icon: Beaker,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      tests: [
        'Stool Culture & Sensitivity',
        'Rectal Swab Culture',
        'Anal Swab Culture',
        'Gastric Aspirate Culture',
        'Duodenal Aspirate Culture',
        'Bile Culture',
        'Pancreatic Fluid Culture',
        'Peritoneal Fluid Culture',
        'Liver Abscess Culture',
        'Splenic Abscess Culture',
        'Appendiceal Culture',
        'Diverticular Abscess Culture',
        'Perianal Abscess Culture',
        'Pilonidal Cyst Culture',
        'Fistula Culture',
        'Intra-abdominal Abscess Culture',
        'Mesenteric Lymph Node Culture',
        'Omental Culture'
      ]
    },
    {
      category: 'کشت هوازی و بی‌هوازی - عفونت‌های ادراری-تناسلی',
      subtitle: 'Aerobic & Anaerobic Culture - Urogenital Infections',
      icon: TestTube2,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50',
      tests: [
        'Urine Culture & Sensitivity',
        'Catheter Urine Culture',
        'Midstream Urine Culture',
        'Suprapubic Urine Culture',
        'Urethral Swab Culture',
        'Vaginal Swab Culture',
        'Cervical Swab Culture',
        'Endocervical Swab Culture',
        'Vulvar Swab Culture',
        'Prostatic Secretion Culture',
        'Semen Culture',
        'Epididymal Aspirate Culture',
        'Testicular Tissue Culture',
        'Ovarian Abscess Culture',
        'Tubo-ovarian Abscess Culture',
        'Pelvic Abscess Culture',
        'Perineal Abscess Culture',
        'Scrotal Abscess Culture'
      ]
    },
    {
      category: 'کشت هوازی و بی‌هوازی - ترشحات زخم',
      subtitle: 'Aerobic & Anaerobic Culture - Wound Discharge',
      icon: Shield,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      tests: [
        'Wound Swab Culture',
        'Wound Tissue Culture',
        'Surgical Wound Culture',
        'Traumatic Wound Culture',
        'Burn Wound Culture',
        'Diabetic Ulcer Culture',
        'Pressure Ulcer Culture',
        'Venous Ulcer Culture',
        'Arterial Ulcer Culture',
        'Post-operative Wound Culture',
        'Infected Implant Culture',
        'Prosthetic Joint Culture',
        'Osteomyelitis Culture',
        'Cellulitis Culture',
        'Erysipelas Culture',
        'Necrotizing Fasciitis Culture',
        'Gas Gangrene Culture',
        'Chronic Wound Culture'
      ]
    },
    {
      category: 'تست‌های تخصصی میکروبیولوژی',
      subtitle: 'Specialized Microbiology Tests',
      icon: Microscope,
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'from-indigo-50 to-blue-50',
      tests: [
        'Anaerobic Culture Setup',
        'Microaerophilic Culture',
        'Capnophilic Culture',
        'Selective Media Culture',
        'Differential Media Culture',
        'Enrichment Media Culture',
        'Transport Media Culture',
        'Blood Agar Culture',
        'MacConkey Agar Culture',
        'Chocolate Agar Culture',
        'Thayer-Martin Agar Culture',
        'Sabouraud Dextrose Agar',
        'Mycoplasma Culture',
        'Ureaplasma Culture',
        'Chlamydia Culture',
        'Legionella Culture',
        'Bordetella Culture',
        'Campylobacter Culture'
      ]
    },
    {
      category: 'تست‌های حساسیت آنتی‌بیوتیکی',
      subtitle: 'Antibiotic Sensitivity Testing',
      icon: Pill,
      color: 'from-teal-500 to-green-600',
      bgColor: 'from-teal-50 to-green-50',
      tests: [
        'Disk Diffusion (Kirby-Bauer)',
        'Minimum Inhibitory Concentration (MIC)',
        'E-test (Epsilometer Test)',
        'Automated Susceptibility Testing',
        'Beta-Lactamase Testing',
        'ESBL Detection',
        'Carbapenemase Detection',
        'Methicillin Resistance Testing',
        'Vancomycin Resistance Testing',
        'Extended Spectrum Testing',
        'Multi-Drug Resistance Testing',
        'Pan-Drug Resistance Testing',
        'Synergy Testing',
        'Antibiotic Combination Testing',
        'Breakpoint Testing',
        'Zone Size Interpretation',
        'Quality Control Testing',
        'Proficiency Testing'
      ]
    },
    {
      category: 'تست‌های مولکولی و سریع',
      subtitle: 'Molecular & Rapid Tests',
      icon: Zap,
      color: 'from-amber-500 to-yellow-600',
      bgColor: 'from-amber-50 to-yellow-50',
      tests: [
        'PCR for Bacterial Detection',
        'Real-time PCR (qPCR)',
        'Multiplex PCR',
        '16S rRNA Sequencing',
        'Bacterial DNA Fingerprinting',
        'Pulse Field Gel Electrophoresis',
        'Ribotyping',
        'Rapid Antigen Testing',
        'Latex Agglutination Tests',
        'Enzyme Immunoassays (EIA)',
        'Fluorescent Antibody Tests',
        'Direct Fluorescent Antibody (DFA)',
        'Immunochromatographic Tests',
        'Bioluminescence Testing',
        'ATP Bioluminescence',
        'Flow Cytometry',
        'Mass Spectrometry (MALDI-TOF)',
        'Next Generation Sequencing (NGS)'
      ]
    }
  ];

  const allTests = microbiologyTests.flatMap(cat => cat.tests);
  const filteredTests = query 
    ? allTests.filter(test => test.toLowerCase().includes(query.toLowerCase()))
    : allTests;

  const filteredCategories = query 
    ? microbiologyTests.filter(cat => 
        cat.category.toLowerCase().includes(query.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        cat.tests.some(test => test.toLowerCase().includes(query.toLowerCase()))
      )
    : microbiologyTests;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-emerald-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Hero Section */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white p-8 md:p-12 mb-16 shadow-2xl">
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
                خدمات میکروبیولوژی
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-8 leading-relaxed">
                آزمایش‌های تخصصی میکروبیولوژی شامل کشت هوازی و بی‌هوازی، تست‌های حساسیت و تشخیص مولکولی
              </p>
              <div className="max-w-md">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در آزمایش‌های میکروبیولوژی..."
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
                <Search className="w-6 h-6 text-green-600" />
                <h3 className="text-xl font-semibold text-gray-800">نتایج جستجو</h3>
              </div>
              <p className="text-gray-600">
                {filteredTests.length} آزمایش از {allTests.length} آزمایش میکروبیولوژی یافت شد
              </p>
              {filteredTests.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filteredTests.slice(0, 10).map((test, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200">
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
                آزمایش‌های میکروبیولوژی در 9 دسته اصلی سازماندهی شده‌اند
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
          <div className="mt-16 p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">آماده برای نوبت‌دهی؟</h3>
              <p className="text-gray-600">برای رزرو نوبت آزمایش میکروبیولوژی با ما تماس بگیرید</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 text-lg"
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

export default MicrobiologyServices;
