import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Shield, 
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
  TestTube2,
  Syringe,
  Brain,
  Eye,
  Bone
} from 'lucide-react';

const ImmunologyServices: React.FC = () => {
  const [query, setQuery] = useState('');

  const immunologyTests = [
    {
      category: 'ایمونوگلوبولین‌ها',
      subtitle: 'Immunoglobulins',
      icon: Shield,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      tests: [
        'IgG (Total)',
        'IgG Subclasses (IgG1, IgG2, IgG3, IgG4)',
        'IgA (Total)',
        'IgA Subclasses (IgA1, IgA2)',
        'IgM (Total)',
        'IgD',
        'IgE (Total)',
        'Secretory IgA',
        'Free Kappa Light Chains',
        'Free Lambda Light Chains',
        'Kappa/Lambda Ratio',
        'IgG Index (CSF)',
        'IgA Index (CSF)',
        'IgM Index (CSF)',
        'Oligoclonal Bands (CSF)',
        'Monoclonal Gammopathy',
        'Bence Jones Protein',
        'Cryoglobulins'
      ]
    },
    {
      category: 'اتوآنتی‌بادی‌ها',
      subtitle: 'Autoantibodies',
      icon: Bug,
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      tests: [
        'ANA (Antinuclear Antibody)',
        'Anti-dsDNA',
        'Anti-Sm',
        'Anti-RNP',
        'Anti-SSA/Ro',
        'Anti-SSB/La',
        'Anti-Jo-1',
        'Anti-Scl-70',
        'Anti-Centromere',
        'Anti-Mi-2',
        'Anti-PM-Scl',
        'Anti-Ku',
        'Anti-PCNA',
        'Anti-Histone',
        'Anti-Nucleosome',
        'Anti-Chromatin',
        'Anti-Ribosomal P',
        'Anti-Mitochondrial (AMA)'
      ]
    },
    {
      category: 'اتوآنتی‌بادی‌های روماتیسمی',
      subtitle: 'Rheumatoid Autoantibodies',
      icon: Bone,
      color: 'from-orange-500 to-red-600',
      bgColor: 'from-orange-50 to-red-50',
      tests: [
        'Rheumatoid Factor (RF)',
        'Anti-CCP (Anti-Cyclic Citrullinated Peptide)',
        'Anti-MCV (Anti-Mutated Citrullinated Vimentin)',
        'Anti-Sa',
        'Anti-CarP (Anti-Carbamylated Protein)',
        'Anti-PAD4',
        'Anti-RA33',
        'Anti-BRAF',
        'Anti-CII (Anti-Collagen Type II)',
        'Anti-C1q',
        'Anti-α-enolase',
        'Anti-Fibrinogen',
        'Anti-Vimentin',
        'Anti-Perinuclear Factor',
        'Anti-Keratin Antibody',
        'Anti-SAP (Anti-Serum Amyloid P)',
        'Anti-Lactoferrin',
        'Anti-Calpastatin'
      ]
    },
    {
      category: 'اتوآنتی‌بادی‌های اندوکرین',
      subtitle: 'Endocrine Autoantibodies',
      icon: Brain,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      tests: [
        'Anti-TPO (Anti-Thyroid Peroxidase)',
        'Anti-Tg (Anti-Thyroglobulin)',
        'Anti-TSHR (Anti-TSH Receptor)',
        'Anti-Insulin',
        'Anti-GAD65 (Anti-Glutamic Acid Decarboxylase)',
        'Anti-IA-2 (Anti-Insulinoma Antigen-2)',
        'Anti-ZnT8 (Anti-Zinc Transporter 8)',
        'Anti-21-Hydroxylase',
        'Anti-17α-Hydroxylase',
        'Anti-Side Chain Cleavage Enzyme',
        'Anti-P450scc',
        'Anti-3β-HSD',
        'Anti-11β-Hydroxylase',
        'Anti-Pituitary',
        'Anti-Hypothalamus',
        'Anti-Parathyroid',
        'Anti-Adrenal Cortex',
        'Anti-Pancreatic Islets'
      ]
    },
    {
      category: 'اتوآنتی‌بادی‌های گوارشی',
      subtitle: 'Gastrointestinal Autoantibodies',
      icon: Beaker,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      tests: [
        'Anti-tTG (Anti-Tissue Transglutaminase)',
        'Anti-EMA (Anti-Endomysial)',
        'Anti-DGP (Anti-Deamidated Gliadin Peptide)',
        'Anti-AGA (Anti-Gliadin)',
        'Anti-ASCA (Anti-Saccharomyces cerevisiae)',
        'Anti-PANCA (Anti-Perinuclear ANCA)',
        'Anti-CANCA (Anti-Cytoplasmic ANCA)',
        'Anti-MPO (Anti-Myeloperoxidase)',
        'Anti-PR3 (Anti-Proteinase 3)',
        'Anti-Lactoferrin',
        'Anti-Cathepsin G',
        'Anti-Elastase',
        'Anti-Beta-Glucuronidase',
        'Anti-Lysozyme',
        'Anti-Carbonic Anhydrase',
        'Anti-Parietal Cell',
        'Anti-Intrinsic Factor',
        'Anti-Enterocyte'
      ]
    },
    {
      category: 'اتوآنتی‌بادی‌های عصبی',
      subtitle: 'Neurological Autoantibodies',
      icon: Brain,
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'from-indigo-50 to-blue-50',
      tests: [
        'Anti-NMDA Receptor',
        'Anti-AMPA Receptor',
        'Anti-GABA Receptor',
        'Anti-Glycine Receptor',
        'Anti-CASPR2 (Contactin-Associated Protein 2)',
        'Anti-LGI1 (Leucine-Rich Glioma Inactivated 1)',
        'Anti-DPPX (Dipeptidyl-Peptidase-Like Protein 6)',
        'Anti-IgLON5',
        'Anti-GAD65 (Neurological)',
        'Anti-Hu (ANNA-1)',
        'Anti-Yo (PCA-1)',
        'Anti-Ri (ANNA-2)',
        'Anti-Ma1/Ma2',
        'Anti-CV2/CRMP5',
        'Anti-Amphiphysin',
        'Anti-Recoverin',
        'Anti-SOX1',
        'Anti-Titin'
      ]
    },
    {
      category: 'تست‌های آلرژی',
      subtitle: 'Allergy Tests',
      icon: Syringe,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      tests: [
        'Total IgE',
        'Specific IgE (RAST)',
        'Skin Prick Test',
        'Patch Test',
        'Intradermal Test',
        'Food Allergy Panel',
        'Inhalant Allergy Panel',
        'Drug Allergy Testing',
        'Latex Allergy Testing',
        'Venom Allergy Testing',
        'Mold Allergy Testing',
        'Dust Mite Allergy Testing',
        'Pet Allergy Testing',
        'Pollen Allergy Testing',
        'Cross-Reactivity Testing',
        'Component-Resolved Diagnosis',
        'Basophil Activation Test',
        'Mast Cell Tryptase'
      ]
    },
    {
      category: 'سیستم کمپلمان',
      subtitle: 'Complement System',
      icon: Heart,
      color: 'from-teal-500 to-green-600',
      bgColor: 'from-teal-50 to-green-50',
      tests: [
        'C3',
        'C4',
        'C1q',
        'C1 Inhibitor',
        'C2',
        'C5',
        'C6',
        'C7',
        'C8',
        'C9',
        'Factor B',
        'Factor D',
        'Factor H',
        'Factor I',
        'Properdin',
        'C1 Esterase Inhibitor',
        'C4 Binding Protein',
        'Complement Activation Products'
      ]
    },
    {
      category: 'سیتوکین‌ها و کموکین‌ها',
      subtitle: 'Cytokines & Chemokines',
      icon: Zap,
      color: 'from-amber-500 to-yellow-600',
      bgColor: 'from-amber-50 to-yellow-50',
      tests: [
        'IL-1α',
        'IL-1β',
        'IL-2',
        'IL-4',
        'IL-5',
        'IL-6',
        'IL-8 (CXCL8)',
        'IL-10',
        'IL-12',
        'IL-13',
        'IL-15',
        'IL-17',
        'IL-18',
        'IL-21',
        'IL-22',
        'IL-23',
        'IL-27',
        'IL-35'
      ]
    },
    {
      category: 'تست‌های تخصصی ایمونولوژی',
      subtitle: 'Specialized Immunology Tests',
      icon: TestTube,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'from-rose-50 to-pink-50',
      tests: [
        'Lymphocyte Subset Analysis (CD3, CD4, CD8, CD19, CD56)',
        'T-Cell Function Tests',
        'B-Cell Function Tests',
        'NK Cell Activity',
        'Phagocytosis Assay',
        'Oxidative Burst Test',
        'Neutrophil Function Tests',
        'Monocyte Function Tests',
        'Dendritic Cell Analysis',
        'Regulatory T-Cells (Tregs)',
        'Th1/Th2/Th17 Balance',
        'Cytotoxic T-Cell Activity',
        'Memory T-Cell Analysis',
        'Naive T-Cell Analysis',
        'T-Cell Receptor Repertoire',
        'B-Cell Receptor Repertoire',
        'HLA Typing',
        'Mixed Lymphocyte Reaction (MLR)'
      ]
    },
    {
      category: 'تست‌های مولکولی ایمونولوژی',
      subtitle: 'Molecular Immunology Tests',
      icon: TestTube2,
      color: 'from-slate-500 to-gray-600',
      bgColor: 'from-slate-50 to-gray-50',
      tests: [
        'HLA Genotyping',
        'KIR Genotyping',
        'Cytokine Gene Polymorphisms',
        'TCR Gene Rearrangements',
        'BCR Gene Rearrangements',
        'Immunoglobulin Gene Rearrangements',
        'JAK-STAT Pathway Analysis',
        'NF-κB Pathway Analysis',
        'MAPK Pathway Analysis',
        'PI3K-AKT Pathway Analysis',
        'Toll-like Receptor Analysis',
        'NOD-like Receptor Analysis',
        'RIG-I-like Receptor Analysis',
        'Inflammasome Analysis',
        'Apoptosis Pathway Analysis',
        'Autophagy Pathway Analysis',
        'Epigenetic Modifications',
        'MicroRNA Expression'
      ]
    }
  ];

  const allTests = immunologyTests.flatMap(cat => cat.tests);
  const filteredTests = query 
    ? allTests.filter(test => test.toLowerCase().includes(query.toLowerCase()))
    : allTests;

  const filteredCategories = query 
    ? immunologyTests.filter(cat => 
        cat.category.toLowerCase().includes(query.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        cat.tests.some(test => test.toLowerCase().includes(query.toLowerCase()))
      )
    : immunologyTests;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-violet-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Hero Section */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-600 text-white p-8 md:p-12 mb-16 shadow-2xl">
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
                خدمات ایمونولوژی و آلرژی
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-8 leading-relaxed">
                آزمایش‌های تخصصی ایمونولوژی، اتوآنتی‌بادی‌ها، آلرژی و سیستم ایمنی با استفاده از پیشرفته‌ترین تکنولوژی‌ها
              </p>
              <div className="max-w-md">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در آزمایش‌های ایمونولوژی..."
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
                <Search className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-800">نتایج جستجو</h3>
              </div>
              <p className="text-gray-600">
                {filteredTests.length} آزمایش از {allTests.length} آزمایش ایمونولوژی یافت شد
              </p>
              {filteredTests.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filteredTests.slice(0, 10).map((test, idx) => (
                    <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm border border-purple-200">
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
                آزمایش‌های ایمونولوژی و آلرژی در 12 دسته اصلی سازماندهی شده‌اند
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
          <div className="mt-16 p-8 bg-gradient-to-br from-purple-50 to-violet-50 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">آماده برای نوبت‌دهی؟</h3>
              <p className="text-gray-600">برای رزرو نوبت آزمایش ایمونولوژی و آلرژی با ما تماس بگیرید</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white px-8 py-3 text-lg"
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

export default ImmunologyServices;
