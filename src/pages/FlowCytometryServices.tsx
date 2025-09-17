import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
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
  TestTube2,
  Syringe,
  Brain,
  Eye,
  Bone,
  User,
  Baby,
  Stethoscope,
  Shield,
  Target,
  Microscope,
  Cpu,
  Database,
  Network,
  TargetIcon,
  ZapIcon,
  ActivityIcon
} from 'lucide-react';

const FlowCytometryServices: React.FC = () => {
  const [query, setQuery] = useState('');

  const flowCytometryTests = [
    {
      category: 'ایمونوفنوتایپینگ سلول‌های خونی',
      subtitle: 'Blood Cell Immunophenotyping',
      icon: Droplets,
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      tests: [
        'CD3+ T Cells (Total T Lymphocytes)',
        'CD4+ T Helper Cells',
        'CD8+ Cytotoxic T Cells',
        'CD19+ B Cells',
        'CD56+ NK Cells',
        'CD14+ Monocytes',
        'CD15+ Granulocytes',
        'CD34+ Hematopoietic Stem Cells',
        'CD45+ Leukocytes',
        'CD16+ NK Cells',
        'CD57+ NK Cells',
        'CD25+ Activated T Cells',
        'CD69+ Early Activation Marker',
        'CD71+ Transferrin Receptor',
        'CD95+ Fas Receptor',
        'CD122+ IL-2 Receptor Beta',
        'CD127+ IL-7 Receptor Alpha',
        'CD152+ CTLA-4'
      ]
    },
    {
      category: 'ایمونوفنوتایپینگ لوسمی و لنفوم',
      subtitle: 'Leukemia & Lymphoma Immunophenotyping',
      icon: Bug,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      tests: [
        'Acute Myeloid Leukemia (AML) Panel',
        'Acute Lymphoblastic Leukemia (ALL) Panel',
        'Chronic Myeloid Leukemia (CML) Panel',
        'Chronic Lymphocytic Leukemia (CLL) Panel',
        'Multiple Myeloma Panel',
        'Non-Hodgkin Lymphoma Panel',
        'Hodgkin Lymphoma Panel',
        'Myelodysplastic Syndrome (MDS) Panel',
        'Myeloproliferative Neoplasms Panel',
        'B-Cell Lymphoma Panel',
        'T-Cell Lymphoma Panel',
        'NK-Cell Lymphoma Panel',
        'Hairy Cell Leukemia Panel',
        'Prolymphocytic Leukemia Panel',
        'Large Granular Lymphocyte Leukemia Panel',
        'Plasma Cell Disorders Panel',
        'Mast Cell Disorders Panel',
        'Histiocytic Disorders Panel'
      ]
    },
    {
      category: 'ایمونوفنوتایپینگ مایعات بدن',
      subtitle: 'Body Fluids Immunophenotyping',
      icon: TestTube,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      tests: [
        'Cerebrospinal Fluid (CSF) Analysis',
        'Pleural Fluid Analysis',
        'Peritoneal Fluid Analysis',
        'Pericardial Fluid Analysis',
        'Synovial Fluid Analysis',
        'Bronchoalveolar Lavage (BAL) Analysis',
        'Urine Cytology Analysis',
        'Ascitic Fluid Analysis',
        'Peritoneal Dialysis Fluid Analysis',
        'Ventricular Fluid Analysis',
        'Amniotic Fluid Analysis',
        'Seminal Fluid Analysis',
        'Vaginal Fluid Analysis',
        'Nasal Secretions Analysis',
        'Sputum Analysis',
        'Bile Analysis',
        'Pancreatic Juice Analysis',
        'Gastric Juice Analysis'
      ]
    },
    {
      category: 'آنالیز چرخه سلولی',
      subtitle: 'Cell Cycle Analysis',
      icon: Cpu,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      tests: [
        'DNA Content Analysis (Ploidy)',
        'S-Phase Fraction Analysis',
        'G0/G1 Phase Analysis',
        'G2/M Phase Analysis',
        'Sub-G1 Analysis (Apoptosis)',
        'BrdU Incorporation Assay',
        'EdU Incorporation Assay',
        'Ki-67 Proliferation Index',
        'PCNA Expression Analysis',
        'Cyclin D1 Expression',
        'Cyclin E Expression',
        'Cyclin A Expression',
        'Cyclin B1 Expression',
        'p21 Expression Analysis',
        'p27 Expression Analysis',
        'p53 Expression Analysis',
        'Mitotic Index Analysis',
        'Growth Fraction Analysis'
      ]
    },
    {
      category: 'آنالیز آپوپتوز و نکروز',
      subtitle: 'Apoptosis & Necrosis Analysis',
      icon: TargetIcon,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'from-orange-50 to-amber-50',
      tests: [
        'Annexin V-FITC Assay',
        'Propidium Iodide Staining',
        '7-AAD Staining',
        'TUNEL Assay',
        'Caspase-3 Activation',
        'Caspase-8 Activation',
        'Caspase-9 Activation',
        'PARP Cleavage Analysis',
        'Bcl-2 Expression Analysis',
        'Bax Expression Analysis',
        'Bak Expression Analysis',
        'Bad Expression Analysis',
        'Bid Expression Analysis',
        'Fas/FasL Expression',
        'TRAIL Expression',
        'p53 Expression Analysis',
        'Cytochrome C Release',
        'Mitochondrial Membrane Potential'
      ]
    },
    {
      category: 'آنالیز کلسیم و سیگنالینگ',
      subtitle: 'Calcium & Signaling Analysis',
      icon: ZapIcon,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      tests: [
        'Intracellular Calcium Measurement',
        'Calcium Flux Analysis',
        'Calcium Mobilization Assay',
        'IP3 Receptor Expression',
        'Ryanodine Receptor Expression',
        'Calmodulin Expression',
        'Calcineurin Activity',
        'PKC Activation Analysis',
        'PKA Activation Analysis',
        'MAPK Activation Analysis',
        'JAK-STAT Activation',
        'NF-κB Activation',
        'CREB Activation',
        'ATF-2 Activation',
        'c-Jun Activation',
        'c-Fos Activation',
        'ERK1/2 Phosphorylation',
        'p38 Phosphorylation'
      ]
    },
    {
      category: 'آنالیز سیتوکین‌ها',
      subtitle: 'Cytokine Analysis',
      icon: ActivityIcon,
      color: 'from-teal-500 to-green-600',
      bgColor: 'from-teal-50 to-green-50',
      tests: [
        'IL-2 Production Analysis',
        'IL-4 Production Analysis',
        'IL-6 Production Analysis',
        'IL-10 Production Analysis',
        'IL-12 Production Analysis',
        'IL-17 Production Analysis',
        'IL-21 Production Analysis',
        'IL-22 Production Analysis',
        'IFN-γ Production Analysis',
        'TNF-α Production Analysis',
        'TGF-β Production Analysis',
        'GM-CSF Production Analysis',
        'MCP-1 Production Analysis',
        'RANTES Production Analysis',
        'IP-10 Production Analysis',
        'MIG Production Analysis',
        'IL-8 Production Analysis',
        'IL-1β Production Analysis'
      ]
    },
    {
      category: 'آنالیز فاگوسیتوز',
      subtitle: 'Phagocytosis Analysis',
      icon: Microscope,
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'from-indigo-50 to-blue-50',
      tests: [
        'Phagocytic Index Measurement',
        'Phagocytic Capacity Analysis',
        'Bacterial Uptake Assay',
        'Fungal Uptake Assay',
        'Yeast Uptake Assay',
        'Latex Bead Uptake Assay',
        'Zymosan Uptake Assay',
        'E. coli Uptake Assay',
        'S. aureus Uptake Assay',
        'Candida Uptake Assay',
        'Aspergillus Uptake Assay',
        'Phagosome Formation Analysis',
        'Phagosome Maturation Analysis',
        'ROS Production Analysis',
        'Nitric Oxide Production',
        'Phagocytic Receptor Expression',
        'Complement Receptor Expression',
        'Fc Receptor Expression'
      ]
    },
    {
      category: 'آنالیز عملکرد سلول‌های NK',
      subtitle: 'NK Cell Function Analysis',
      icon: Shield,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'from-rose-50 to-pink-50',
      tests: [
        'NK Cell Cytotoxicity Assay',
        'NK Cell Degranulation',
        'CD107a Expression Analysis',
        'Perforin Expression Analysis',
        'Granzyme B Expression Analysis',
        'Granzyme A Expression Analysis',
        'FasL Expression Analysis',
        'TRAIL Expression Analysis',
        'NKG2D Expression Analysis',
        'NKG2A Expression Analysis',
        'NKG2C Expression Analysis',
        'KIR Expression Analysis',
        'NKp30 Expression Analysis',
        'NKp44 Expression Analysis',
        'NKp46 Expression Analysis',
        'NKp80 Expression Analysis',
        '2B4 Expression Analysis',
        'NTB-A Expression Analysis'
      ]
    },
    {
      category: 'آنالیز سلول‌های T تنظیمی',
      subtitle: 'Regulatory T Cell Analysis',
      icon: User,
      color: 'from-slate-500 to-gray-600',
      bgColor: 'from-slate-50 to-gray-50',
      tests: [
        'CD4+CD25+ Treg Analysis',
        'CD4+CD25+FoxP3+ Treg Analysis',
        'CD4+CD25+CD127low Treg Analysis',
        'CD4+CD25+CD45RA+ Treg Analysis',
        'CD4+CD25+CD45RO+ Treg Analysis',
        'Helios Expression Analysis',
        'Neuropilin-1 Expression',
        'CTLA-4 Expression Analysis',
        'GITR Expression Analysis',
        'LAG-3 Expression Analysis',
        'TIM-3 Expression Analysis',
        'PD-1 Expression Analysis',
        'CD39 Expression Analysis',
        'CD73 Expression Analysis',
        'IL-10 Production Analysis',
        'TGF-β Production Analysis',
        'Granzyme B Expression',
        'Perforin Expression'
      ]
    },
    {
      category: 'آنالیز سلول‌های B',
      subtitle: 'B Cell Analysis',
      icon: Beaker,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'from-violet-50 to-purple-50',
      tests: [
        'Naive B Cell Analysis',
        'Memory B Cell Analysis',
        'Plasma Cell Analysis',
        'B-1 Cell Analysis',
        'Marginal Zone B Cell Analysis',
        'Follicular B Cell Analysis',
        'Germinal Center B Cell Analysis',
        'Class-Switched B Cell Analysis',
        'IgM+ B Cell Analysis',
        'IgG+ B Cell Analysis',
        'IgA+ B Cell Analysis',
        'IgE+ B Cell Analysis',
        'IgD+ B Cell Analysis',
        'CD27+ Memory B Cell Analysis',
        'CD38+ Plasma Cell Analysis',
        'CD138+ Plasma Cell Analysis',
        'BCR Signaling Analysis',
        'B Cell Activation Analysis'
      ]
    },
    {
      category: 'آنالیز سلول‌های دندریتیک',
      subtitle: 'Dendritic Cell Analysis',
      icon: Network,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50',
      tests: [
        'Myeloid DC Analysis (mDC)',
        'Plasmacytoid DC Analysis (pDC)',
        'CD1c+ DC Analysis',
        'CD141+ DC Analysis',
        'CD303+ DC Analysis',
        'CD304+ DC Analysis',
        'Langerhans Cell Analysis',
        'Interdigitating DC Analysis',
        'Follicular DC Analysis',
        'CD83+ Mature DC Analysis',
        'CD86+ Costimulatory Molecule',
        'CD80+ Costimulatory Molecule',
        'CD40+ Costimulatory Molecule',
        'HLA-DR Expression Analysis',
        'CD11c Expression Analysis',
        'CD123 Expression Analysis',
        'DC-SIGN Expression Analysis',
        'DC Maturation Analysis'
      ]
    }
  ];

  const allTests = flowCytometryTests.flatMap(cat => cat.tests);
  const filteredTests = query 
    ? allTests.filter(test => test.toLowerCase().includes(query.toLowerCase()))
    : allTests;

  const filteredCategories = query 
    ? flowCytometryTests.filter(cat => 
        cat.category.toLowerCase().includes(query.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        cat.tests.some(test => test.toLowerCase().includes(query.toLowerCase()))
      )
    : flowCytometryTests;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-indigo-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Hero Section */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-8 md:p-12 mb-16 shadow-2xl">
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
                فلوسایتومتری
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-8 leading-relaxed">
                خدمات پیشرفته فلوسایتومتری شامل ایمونوفنوتایپینگ، آنالیز چرخه سلولی، آپوپتوز و عملکرد سلول‌های ایمنی
              </p>
              <div className="max-w-md">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در آزمایش‌های فلوسایتومتری..."
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
                {filteredTests.length} آزمایش از {allTests.length} آزمایش فلوسایتومتری یافت شد
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
                آزمایش‌های فلوسایتومتری در 12 دسته اصلی سازماندهی شده‌اند
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
          <div className="mt-16 p-8 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">آماده برای نوبت‌دهی؟</h3>
              <p className="text-gray-600">برای رزرو نوبت آزمایش فلوسایتومتری با ما تماس بگیرید</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 text-lg"
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

export default FlowCytometryServices;
