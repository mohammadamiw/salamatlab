import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Activity, 
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
  Microscope
} from 'lucide-react';

const CoagulationServices: React.FC = () => {
  const [query, setQuery] = useState('');

  const coagulationTests = [
    {
      category: 'آزمایش‌های اصلی انعقاد',
      subtitle: 'Basic Coagulation Tests',
      icon: Activity,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
      tests: [
        'PT (Prothrombin Time)',
        'INR (International Normalized Ratio)',
        'APTT (Activated Partial Thromboplastin Time)',
        'TT (Thrombin Time)',
        'Fibrinogen',
        'D-Dimer',
        'FDP (Fibrin Degradation Products)',
        'Euglobulin Lysis Time',
        'Reptilase Time',
        'Stuart Factor Assay',
        'Prothrombin Consumption Test',
        'Thrombin Generation Test',
        'Calibrated Automated Thrombogram',
        'Platelet Function Analysis',
        'Bleeding Time',
        'Clotting Time',
        'Whole Blood Clotting Time',
        'Capillary Fragility Test'
      ]
    },
    {
      category: 'فاکتورهای انعقادی',
      subtitle: 'Coagulation Factors',
      icon: Droplets,
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      tests: [
        'Factor I (Fibrinogen)',
        'Factor II (Prothrombin)',
        'Factor V (Labile Factor)',
        'Factor VII (Stable Factor)',
        'Factor VIII (Antihemophilic Factor A)',
        'Factor IX (Antihemophilic Factor B)',
        'Factor X (Stuart-Prower Factor)',
        'Factor XI (Plasma Thromboplastin Antecedent)',
        'Factor XII (Hageman Factor)',
        'Factor XIII (Fibrin Stabilizing Factor)',
        'von Willebrand Factor (vWF)',
        'vWF Antigen',
        'vWF Activity (Ristocetin Cofactor)',
        'vWF Multimer Analysis',
        'Factor VIII Inhibitor',
        'Factor IX Inhibitor',
        'Lupus Anticoagulant',
        'Anticardiolipin Antibodies'
      ]
    },
    {
      category: 'شاخص‌های ضد انعقاد',
      subtitle: 'Anticoagulation Markers',
      icon: Shield,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      tests: [
        'Protein C',
        'Protein S',
        'Antithrombin III',
        'Heparin Cofactor II',
        'Tissue Factor Pathway Inhibitor',
        'Plasminogen',
        'Plasminogen Activator Inhibitor-1',
        'Alpha-2 Antiplasmin',
        'Alpha-2 Macroglobulin',
        'C1 Esterase Inhibitor',
        'Heparin Level',
        'Low Molecular Weight Heparin',
        'Direct Oral Anticoagulants (DOACs)',
        'Warfarin Level',
        'Rivaroxaban Level',
        'Apixaban Level',
        'Dabigatran Level',
        'Edoxaban Level'
      ]
    },
    {
      category: 'شاخص‌های ترومبوز',
      subtitle: 'Thrombosis Markers',
      icon: Heart,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      tests: [
        'D-Dimer (Quantitative)',
        'FDP (Fibrin Degradation Products)',
        'Thrombin-Antithrombin Complex',
        'Prothrombin Fragment 1+2',
        'Fibrinopeptide A',
        'Soluble Fibrin Monomer',
        'Plasmin-Antiplasmin Complex',
        'Tissue Plasminogen Activator',
        'Urokinase Plasminogen Activator',
        'Thrombomodulin',
        'Endothelial Cell Markers',
        'Platelet Activation Markers',
        'P-Selectin',
        'CD40 Ligand',
        'Platelet Factor 4',
        'Beta-Thromboglobulin',
        'Thromboxane B2',
        'Prostacyclin Metabolites'
      ]
    },
    {
      category: 'شاخص‌های پلاکتی',
      subtitle: 'Platelet Function Tests',
      icon: Microscope,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      tests: [
        'Platelet Count',
        'MPV (Mean Platelet Volume)',
        'PDW (Platelet Distribution Width)',
        'PCT (Plateletcrit)',
        'Platelet Aggregation',
        'ADP-Induced Aggregation',
        'Collagen-Induced Aggregation',
        'Epinephrine-Induced Aggregation',
        'Ristocetin-Induced Aggregation',
        'Arachidonic Acid-Induced Aggregation',
        'Platelet Function Analyzer (PFA-100)',
        'Closure Time (CT)',
        'Platelet Adhesion',
        'Platelet Release Reaction',
        'Platelet Procoagulant Activity',
        'Platelet Microparticles',
        'Platelet-Leukocyte Aggregates',
        'Platelet Activation Markers'
      ]
    },
    {
      category: 'شاخص‌های ژنتیکی',
      subtitle: 'Genetic Markers',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      tests: [
        'Factor V Leiden Mutation',
        'Prothrombin G20210A Mutation',
        'MTHFR C677T Mutation',
        'MTHFR A1298C Mutation',
        'PAI-1 4G/5G Polymorphism',
        'Factor XIII Val34Leu',
        'GPIIIa PlA1/A2 Polymorphism',
        'GP1bα Kozak Polymorphism',
        'Factor VII R353Q',
        'Factor XII C46T',
        'HPA-1 Polymorphism',
        'ABO Blood Group Genotyping',
        'Thrombomodulin C1418T',
        'Endothelial Protein C Receptor',
        'Tissue Factor Pathway Inhibitor',
        'Plasminogen Activator Inhibitor-1',
        'Factor VIII Gene Mutations',
        'von Willebrand Factor Gene Mutations'
      ]
    }
  ];

  const allTests = coagulationTests.flatMap(cat => cat.tests);
  const filteredTests = query 
    ? allTests.filter(test => test.toLowerCase().includes(query.toLowerCase()))
    : allTests;

  const filteredCategories = query 
    ? coagulationTests.filter(cat => 
        cat.category.toLowerCase().includes(query.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        cat.tests.some(test => test.toLowerCase().includes(query.toLowerCase()))
      )
    : coagulationTests;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-red-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Hero Section */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-600 via-red-600 to-rose-600 text-white p-8 md:p-12 mb-16 shadow-2xl">
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
                خدمات انعقاد خون
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-8 leading-relaxed">
                آزمایش‌های تخصصی انعقاد خون و فاکتورهای انعقادی با استفاده از پیشرفته‌ترین تکنولوژی‌ها
              </p>
              <div className="max-w-md">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در آزمایش‌های انعقاد خون..."
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
                <Search className="w-6 h-6 text-orange-600" />
                <h3 className="text-xl font-semibold text-gray-800">نتایج جستجو</h3>
              </div>
              <p className="text-gray-600">
                {filteredTests.length} آزمایش از {allTests.length} آزمایش انعقاد خون یافت شد
              </p>
              {filteredTests.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filteredTests.slice(0, 10).map((test, idx) => (
                    <span key={idx} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm border border-orange-200">
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
                آزمایش‌های انعقاد خون در 6 دسته اصلی سازماندهی شده‌اند
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
          <div className="mt-16 p-8 bg-gradient-to-br from-orange-50 to-red-50 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">آماده برای نوبت‌دهی؟</h3>
              <p className="text-gray-600">برای رزرو نوبت آزمایش انعقاد خون با ما تماس بگیرید</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}
                className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-3 text-lg"
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

export default CoagulationServices;
