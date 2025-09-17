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
  Activity,
  ActivitySquare,
  Pill,
  Beaker,
  Bug,
  Flask,
  Bacteria,
  Virus,
  TestTube2,
  Syringe,
  Brain,
  Eye,
  Bone,
  User,
  Baby,
  Stethoscope,
  Shield,
  Target
} from 'lucide-react';

const CytologyServices: React.FC = () => {
  const [query, setQuery] = useState('');

  const cytologyTests = [
    {
      category: 'سیتولوژی ژنیکولوژیک',
      subtitle: 'Gynecological Cytology',
      icon: User,
      color: 'from-pink-500 to-rose-600',
      bgColor: 'from-pink-50 to-rose-50',
      tests: [
        'Pap Smear (Conventional)',
        'Liquid-Based Cytology (LBC)',
        'ThinPrep Pap Test',
        'SurePath Pap Test',
        'Endocervical Brush Cytology',
        'Vaginal Cytology',
        'Vulvar Cytology',
        'Endometrial Cytology',
        'Fallopian Tube Cytology',
        'Ovarian Cyst Fluid Cytology',
        'Cervical Biopsy Cytology',
        'Endometrial Biopsy Cytology',
        'Vaginal Biopsy Cytology',
        'Vulvar Biopsy Cytology',
        'Cervical Ectopy Cytology',
        'Cervical Polyp Cytology',
        'Endometrial Polyp Cytology',
        'Cervical Stenosis Cytology'
      ]
    },
    {
      category: 'سیتولوژی غیر ژنیکولوژیک',
      subtitle: 'Non-Gynecological Cytology',
      icon: Stethoscope,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      tests: [
        'Urinary Cytology',
        'Respiratory Cytology',
        'Gastrointestinal Cytology',
        'Breast Cytology',
        'Thyroid Cytology',
        'Lymph Node Cytology',
        'Salivary Gland Cytology',
        'Pancreatic Cytology',
        'Liver Cytology',
        'Kidney Cytology',
        'Adrenal Cytology',
        'Prostate Cytology',
        'Testicular Cytology',
        'Ovarian Cytology',
        'Uterine Cytology',
        'Cervical Cytology (Non-Gyn)',
        'Vaginal Cytology (Non-Gyn)',
        'Vulvar Cytology (Non-Gyn)'
      ]
    },
    {
      category: 'آسپیراسیون با سوزن ظریف',
      subtitle: 'Fine Needle Aspiration (FNA)',
      icon: Syringe,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      tests: [
        'Thyroid FNA',
        'Breast FNA',
        'Lymph Node FNA',
        'Salivary Gland FNA',
        'Pancreatic FNA',
        'Liver FNA',
        'Kidney FNA',
        'Adrenal FNA',
        'Prostate FNA',
        'Testicular FNA',
        'Ovarian FNA',
        'Uterine FNA',
        'Cervical FNA',
        'Vaginal FNA',
        'Vulvar FNA',
        'Lung FNA',
        'Bone FNA',
        'Soft Tissue FNA'
      ]
    },
    {
      category: 'سیتولوژی مایعات بدن',
      subtitle: 'Body Fluids Cytology',
      icon: Droplets,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      tests: [
        'Pleural Fluid Cytology',
        'Peritoneal Fluid Cytology',
        'Pericardial Fluid Cytology',
        'Cerebrospinal Fluid (CSF) Cytology',
        'Synovial Fluid Cytology',
        'Amniotic Fluid Cytology',
        'Bile Cytology',
        'Pancreatic Fluid Cytology',
        'Urine Cytology (Voided)',
        'Urine Cytology (Catheterized)',
        'Urine Cytology (Cystoscopy)',
        'Sputum Cytology',
        'Bronchoalveolar Lavage (BAL) Cytology',
        'Gastric Aspirate Cytology',
        'Duodenal Aspirate Cytology',
        'Jejunal Aspirate Cytology',
        'Ileal Aspirate Cytology',
        'Colonic Aspirate Cytology'
      ]
    },
    {
      category: 'سیتولوژی تخصصی',
      subtitle: 'Specialized Cytology',
      icon: Microscope,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
      tests: [
        'Immunocytochemistry (ICC)',
        'Flow Cytometry',
        'Fluorescence In Situ Hybridization (FISH)',
        'Polymerase Chain Reaction (PCR)',
        'Real-time PCR (qPCR)',
        'Multiplex PCR',
        'Digital PCR',
        'Next Generation Sequencing (NGS)',
        'Mass Spectrometry',
        'Electron Microscopy',
        'Confocal Microscopy',
        'Phase Contrast Microscopy',
        'Differential Interference Contrast (DIC)',
        'Polarized Light Microscopy',
        'Fluorescence Microscopy',
        'Bright Field Microscopy',
        'Dark Field Microscopy',
        'Ultraviolet Microscopy'
      ]
    },
    {
      category: 'سیتولوژی غدد درون‌ریز',
      subtitle: 'Endocrine Cytology',
      icon: Brain,
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'from-indigo-50 to-blue-50',
      tests: [
        'Thyroid Nodule Cytology',
        'Thyroid Cyst Cytology',
        'Thyroid Adenoma Cytology',
        'Thyroid Carcinoma Cytology',
        'Parathyroid Cytology',
        'Pituitary Cytology',
        'Adrenal Cytology',
        'Pancreatic Islet Cytology',
        'Ovarian Follicle Cytology',
        'Corpus Luteum Cytology',
        'Testicular Seminiferous Tubule Cytology',
        'Leydig Cell Cytology',
        'Sertoli Cell Cytology',
        'Endometrial Gland Cytology',
        'Cervical Gland Cytology',
        'Vaginal Gland Cytology',
        'Vulvar Gland Cytology',
        'Mammary Gland Cytology'
      ]
    },
    {
      category: 'سیتولوژی دستگاه تنفسی',
      subtitle: 'Respiratory Cytology',
      icon: Heart,
      color: 'from-teal-500 to-green-600',
      bgColor: 'from-teal-50 to-green-50',
      tests: [
        'Sputum Cytology',
        'Bronchial Brush Cytology',
        'Bronchoalveolar Lavage (BAL) Cytology',
        'Endotracheal Aspirate Cytology',
        'Tracheal Aspirate Cytology',
        'Laryngeal Cytology',
        'Pharyngeal Cytology',
        'Nasal Cytology',
        'Sinus Cytology',
        'Middle Ear Cytology',
        'Mastoid Cytology',
        'Pleural Fluid Cytology',
        'Lung Tissue Cytology',
        'Lymph Node Cytology (Cervical)',
        'Lymph Node Cytology (Mediastinal)',
        'Lymph Node Cytology (Hilar)',
        'Lymph Node Cytology (Axillary)',
        'Lymph Node Cytology (Supraclavicular)'
      ]
    },
    {
      category: 'سیتولوژی دستگاه گوارش',
      subtitle: 'Gastrointestinal Cytology',
      icon: Beaker,
      color: 'from-yellow-500 to-amber-600',
      bgColor: 'from-yellow-50 to-amber-50',
      tests: [
        'Esophageal Cytology',
        'Gastric Cytology',
        'Duodenal Cytology',
        'Jejunal Cytology',
        'Ileal Cytology',
        'Colonic Cytology',
        'Rectal Cytology',
        'Anal Cytology',
        'Bile Cytology',
        'Pancreatic Cytology',
        'Liver Cytology',
        'Gallbladder Cytology',
        'Splenic Cytology',
        'Mesenteric Cytology',
        'Omental Cytology',
        'Peritoneal Cytology',
        'Retroperitoneal Cytology',
        'Pelvic Cytology'
      ]
    },
    {
      category: 'سیتولوژی دستگاه ادراری-تناسلی',
      subtitle: 'Urogenital Cytology',
      icon: TestTube2,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'from-rose-50 to-pink-50',
      tests: [
        'Voided Urine Cytology',
        'Catheterized Urine Cytology',
        'Cystoscopy Urine Cytology',
        'Urethral Cytology',
        'Prostatic Secretion Cytology',
        'Semen Cytology',
        'Epididymal Cytology',
        'Testicular Cytology',
        'Scrotal Cytology',
        'Vaginal Cytology',
        'Cervical Cytology',
        'Endocervical Cytology',
        'Endometrial Cytology',
        'Fallopian Tube Cytology',
        'Ovarian Cytology',
        'Vulvar Cytology',
        'Perineal Cytology',
        'Pelvic Cytology'
      ]
    },
    {
      category: 'سیتولوژی پوست و بافت نرم',
      subtitle: 'Skin & Soft Tissue Cytology',
      icon: Shield,
      color: 'from-slate-500 to-gray-600',
      bgColor: 'from-slate-50 to-gray-50',
      tests: [
        'Skin Lesion Cytology',
        'Subcutaneous Nodule Cytology',
        'Muscle Cytology',
        'Tendon Cytology',
        'Ligament Cytology',
        'Fascia Cytology',
        'Adipose Tissue Cytology',
        'Connective Tissue Cytology',
        'Cartilage Cytology',
        'Bone Marrow Cytology',
        'Bone Cytology',
        'Joint Cytology',
        'Synovial Cytology',
        'Bursa Cytology',
        'Nerve Cytology',
        'Blood Vessel Cytology',
        'Lymphatic Vessel Cytology',
        'Lymph Node Cytology'
      ]
    },
    {
      category: 'سیتولوژی عصبی',
      subtitle: 'Neurological Cytology',
      icon: Brain,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'from-violet-50 to-purple-50',
      tests: [
        'Cerebrospinal Fluid (CSF) Cytology',
        'Brain Tissue Cytology',
        'Spinal Cord Cytology',
        'Peripheral Nerve Cytology',
        'Autonomic Nerve Cytology',
        'Cranial Nerve Cytology',
        'Spinal Nerve Cytology',
        'Ganglion Cytology',
        'Plexus Cytology',
        'Meningeal Cytology',
        'Choroid Plexus Cytology',
        'Pineal Gland Cytology',
        'Pituitary Cytology',
        'Hypothalamus Cytology',
        'Thalamus Cytology',
        'Basal Ganglia Cytology',
        'Cerebellum Cytology',
        'Brainstem Cytology'
      ]
    },
    {
      category: 'تکنیک‌های رنگ‌آمیزی سیتولوژی',
      subtitle: 'Cytology Staining Techniques',
      icon: Target,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50',
      tests: [
        'Papanicolaou Stain (Pap)',
        'Hematoxylin & Eosin (H&E)',
        'Giemsa Stain',
        'Wright-Giemsa Stain',
        'May-Grünwald-Giemsa Stain',
        'Diff-Quik Stain',
        'Romanowsky Stain',
        'Leishman Stain',
        'Field Stain',
        'Toluidine Blue Stain',
        'Methylene Blue Stain',
        'Crystal Violet Stain',
        'Safranin O Stain',
        'Alcian Blue Stain',
        'Periodic Acid-Schiff (PAS)',
        'Mucicarmine Stain',
        'Oil Red O Stain',
        'Sudan Black B Stain'
      ]
    }
  ];

  const allTests = cytologyTests.flatMap(cat => cat.tests);
  const filteredTests = query 
    ? allTests.filter(test => test.toLowerCase().includes(query.toLowerCase()))
    : allTests;

  const filteredCategories = query 
    ? cytologyTests.filter(cat => 
        cat.category.toLowerCase().includes(query.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        cat.tests.some(test => test.toLowerCase().includes(query.toLowerCase()))
      )
    : cytologyTests;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-blue-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Hero Section */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-blue-600 to-cyan-600 text-white p-8 md:p-12 mb-16 shadow-2xl">
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
                خدمات سیتولوژی
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-8 leading-relaxed">
                آزمایش‌های تخصصی سیتولوژی شامل بررسی سلول‌ها، آسپیراسیون با سوزن ظریف و تکنیک‌های پیشرفته تشخیصی
              </p>
              <div className="max-w-md">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در آزمایش‌های سیتولوژی..."
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
                <Search className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-semibold text-gray-800">نتایج جستجو</h3>
              </div>
              <p className="text-gray-600">
                {filteredTests.length} آزمایش از {allTests.length} آزمایش سیتولوژی یافت شد
              </p>
              {filteredTests.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filteredTests.slice(0, 10).map((test, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm border border-indigo-200">
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
                آزمایش‌های سیتولوژی در 12 دسته اصلی سازماندهی شده‌اند
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
          <div className="mt-16 p-8 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">آماده برای نوبت‌دهی؟</h3>
              <p className="text-gray-600">برای رزرو نوبت آزمایش سیتولوژی با ما تماس بگیرید</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}
                className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-8 py-3 text-lg"
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

export default CytologyServices;
