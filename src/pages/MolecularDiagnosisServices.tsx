import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Reveal from '@/components/Reveal';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Dna, 
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
  Network
} from 'lucide-react';

const MolecularDiagnosisServices: React.FC = () => {
  const [query, setQuery] = useState('');

  const molecularTests = [
    {
      category: 'تکنیک‌های PCR',
      subtitle: 'PCR Techniques',
      icon: Dna,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      tests: [
        'Conventional PCR',
        'Real-time PCR (qPCR)',
        'Multiplex PCR',
        'Nested PCR',
        'Reverse Transcriptase PCR (RT-PCR)',
        'Quantitative RT-PCR (qRT-PCR)',
        'Digital PCR (dPCR)',
        'Droplet Digital PCR (ddPCR)',
        'High-Resolution Melting (HRM) PCR',
        'Allele-Specific PCR',
        'Touchdown PCR',
        'Hot Start PCR',
        'Long-Range PCR',
        'Fast PCR',
        'Isothermal PCR',
        'LAMP (Loop-Mediated Isothermal Amplification)',
        'RPA (Recombinase Polymerase Amplification)',
        'HDA (Helicase-Dependent Amplification)'
      ]
    },
    {
      category: 'توالی‌یابی DNA',
      subtitle: 'DNA Sequencing',
      icon: Cpu,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      tests: [
        'Sanger Sequencing',
        'Next Generation Sequencing (NGS)',
        'Whole Genome Sequencing (WGS)',
        'Whole Exome Sequencing (WES)',
        'Targeted Panel Sequencing',
        'RNA Sequencing (RNA-Seq)',
        'Single-Cell RNA Sequencing',
        'ChIP-Sequencing (ChIP-Seq)',
        'ATAC-Sequencing (ATAC-Seq)',
        'Methylation Sequencing',
        'Long-Read Sequencing (PacBio)',
        'Oxford Nanopore Sequencing',
        'Ion Torrent Sequencing',
        'Illumina Sequencing',
        'Metagenomic Sequencing',
        '16S rRNA Sequencing',
        'ITS Sequencing',
        'Shotgun Metagenomic Sequencing'
      ]
    },
    {
      category: 'تست‌های ژنتیکی',
      subtitle: 'Genetic Testing',
      icon: Brain,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      tests: [
        'Carrier Testing',
        'Prenatal Testing',
        'Newborn Screening',
        'Diagnostic Testing',
        'Predictive Testing',
        'Pharmacogenetic Testing',
        'HLA Typing',
        'KIR Genotyping',
        'Cytogenetic Testing',
        'FISH (Fluorescence In Situ Hybridization)',
        'Array CGH (Comparative Genomic Hybridization)',
        'Karyotyping',
        'Microarray Analysis',
        'Single Nucleotide Polymorphism (SNP) Testing',
        'Copy Number Variation (CNV) Testing',
        'Mitochondrial DNA Testing',
        'Y-Chromosome Testing',
        'X-Chromosome Testing'
      ]
    },
    {
      category: 'تشخیص مولکولی سرطان',
      subtitle: 'Molecular Cancer Diagnostics',
      icon: Bug,
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      tests: [
        'BRCA1/BRCA2 Testing',
        'Lynch Syndrome Testing',
        'APC Gene Testing',
        'TP53 Gene Testing',
        'EGFR Mutation Testing',
        'ALK Rearrangement Testing',
        'ROS1 Rearrangement Testing',
        'BRAF Mutation Testing',
        'KRAS Mutation Testing',
        'NRAS Mutation Testing',
        'PIK3CA Mutation Testing',
        'HER2 Amplification Testing',
        'Microsatellite Instability (MSI) Testing',
        'Tumor Mutational Burden (TMB) Testing',
        'Circulating Tumor DNA (ctDNA) Testing',
        'Liquid Biopsy',
        'Tumor Profiling',
        'Comprehensive Genomic Profiling'
      ]
    },
    {
      category: 'تشخیص مولکولی بیماری‌های عفونی',
      subtitle: 'Molecular Infectious Disease Diagnostics',
             icon: Bug,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'from-orange-50 to-amber-50',
      tests: [
        'HIV Viral Load Testing',
        'Hepatitis B Viral Load Testing',
        'Hepatitis C Viral Load Testing',
        'CMV Viral Load Testing',
        'EBV Viral Load Testing',
        'HSV Viral Load Testing',
        'Influenza A/B Testing',
        'SARS-CoV-2 Testing',
        'Tuberculosis Testing',
        'Chlamydia Testing',
        'Gonorrhea Testing',
        'Mycoplasma Testing',
        'Ureaplasma Testing',
        'Bacterial Resistance Testing',
        'Fungal Identification',
        'Parasite Detection',
        'Antimicrobial Resistance Genes',
        'Pathogen Identification'
      ]
    },
    {
      category: 'تشخیص مولکولی بیماری‌های قلبی-عروقی',
      subtitle: 'Molecular Cardiovascular Diagnostics',
      icon: Heart,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'from-rose-50 to-pink-50',
      tests: [
        'Familial Hypercholesterolemia Testing',
        'Long QT Syndrome Testing',
        'Brugada Syndrome Testing',
        'Hypertrophic Cardiomyopathy Testing',
        'Dilated Cardiomyopathy Testing',
        'Arrhythmogenic Right Ventricular Dysplasia Testing',
        'Marfan Syndrome Testing',
        'Ehlers-Danlos Syndrome Testing',
        'Factor V Leiden Testing',
        'Prothrombin G20210A Testing',
        'MTHFR Mutation Testing',
        'Cardiac Amyloidosis Testing',
        'Cardiac Sarcoidosis Testing',
        'Myocarditis Testing',
        'Pericarditis Testing',
        'Endocarditis Testing',
        'Atherosclerosis Testing',
        'Thrombophilia Testing'
      ]
    },
    {
      category: 'تشخیص مولکولی بیماری‌های عصبی',
      subtitle: 'Molecular Neurological Diagnostics',
      icon: Brain,
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'from-indigo-50 to-blue-50',
      tests: [
        'Huntington Disease Testing',
        'Spinocerebellar Ataxia Testing',
        'Friedreich Ataxia Testing',
        'Spinal Muscular Atrophy Testing',
        'Duchenne/Becker Muscular Dystrophy Testing',
        'Myotonic Dystrophy Testing',
        'Charcot-Marie-Tooth Disease Testing',
        'Alzheimer Disease Testing',
        'Parkinson Disease Testing',
        'Amyotrophic Lateral Sclerosis Testing',
        'Multiple Sclerosis Testing',
        'Epilepsy Testing',
        'Autism Spectrum Disorder Testing',
        'Intellectual Disability Testing',
        'Schizophrenia Testing',
        'Bipolar Disorder Testing',
        'Migraine Testing',
        'Neuropathy Testing'
      ]
    },
    {
      category: 'تشخیص مولکولی بیماری‌های متابولیک',
      subtitle: 'Molecular Metabolic Diagnostics',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      tests: [
        'Phenylketonuria (PKU) Testing',
        'Maple Syrup Urine Disease Testing',
        'Galactosemia Testing',
        'Gaucher Disease Testing',
        'Fabry Disease Testing',
        'Pompe Disease Testing',
        'Mucopolysaccharidosis Testing',
        'Tay-Sachs Disease Testing',
        'Niemann-Pick Disease Testing',
        'Krabbe Disease Testing',
        'Metachromatic Leukodystrophy Testing',
        'Adrenoleukodystrophy Testing',
        'Mitochondrial Disease Testing',
        'Glycogen Storage Disease Testing',
        'Lysosomal Storage Disease Testing',
        'Peroxisomal Disease Testing',
        'Urea Cycle Disorder Testing',
        'Organic Acidemia Testing'
      ]
    },
    {
      category: 'تشخیص مولکولی بیماری‌های اندوکرین',
      subtitle: 'Molecular Endocrine Diagnostics',
      icon: Activity,
      color: 'from-teal-500 to-green-600',
      bgColor: 'from-teal-50 to-green-50',
      tests: [
        'Multiple Endocrine Neoplasia (MEN) Testing',
        'Familial Medullary Thyroid Carcinoma Testing',
        'Congenital Adrenal Hyperplasia Testing',
        'Diabetes Mellitus Testing',
        'Insulin Resistance Testing',
        'Polycystic Ovary Syndrome Testing',
        'Precocious Puberty Testing',
        'Delayed Puberty Testing',
        'Hypogonadism Testing',
        'Hyperprolactinemia Testing',
        'Cushing Syndrome Testing',
        'Addison Disease Testing',
        'Pheochromocytoma Testing',
        'Paraganglioma Testing',
        'Thyroid Cancer Testing',
        'Adrenal Cancer Testing',
        'Pituitary Adenoma Testing',
        'Pancreatic Neuroendocrine Tumor Testing'
      ]
    },
    {
      category: 'تشخیص مولکولی بیماری‌های پوستی',
      subtitle: 'Molecular Dermatological Diagnostics',
      icon: Shield,
      color: 'from-slate-500 to-gray-600',
      bgColor: 'from-slate-50 to-gray-50',
      tests: [
        'Epidermolysis Bullosa Testing',
        'Ichthyosis Testing',
        'Albinism Testing',
        'Neurofibromatosis Testing',
        'Tuberous Sclerosis Testing',
        'Basal Cell Nevus Syndrome Testing',
        'Melanoma Testing',
        'Squamous Cell Carcinoma Testing',
        'Merkel Cell Carcinoma Testing',
        'Cutaneous T-Cell Lymphoma Testing',
        'Psoriasis Testing',
        'Atopic Dermatitis Testing',
        'Vitiligo Testing',
        'Alopecia Areata Testing',
        'Ehlers-Danlos Syndrome Testing',
        'Marfan Syndrome Testing',
        'Cutis Laxa Testing',
        'Progeria Testing'
      ]
    },
    {
      category: 'تشخیص مولکولی بیماری‌های خونی',
      subtitle: 'Molecular Hematological Diagnostics',
      icon: Droplets,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'from-violet-50 to-purple-50',
      tests: [
        'Sickle Cell Disease Testing',
        'Thalassemia Testing',
        'Hemophilia Testing',
        'Von Willebrand Disease Testing',
        'Factor Deficiencies Testing',
        'Thrombophilia Testing',
        'Myeloproliferative Neoplasms Testing',
        'Myelodysplastic Syndromes Testing',
        'Acute Myeloid Leukemia Testing',
        'Acute Lymphoblastic Leukemia Testing',
        'Chronic Myeloid Leukemia Testing',
        'Chronic Lymphocytic Leukemia Testing',
        'Multiple Myeloma Testing',
        'Lymphoma Testing',
        'Fanconi Anemia Testing',
        'Diamond-Blackfan Anemia Testing',
        'Shwachman-Diamond Syndrome Testing',
        'Dyskeratosis Congenita Testing'
      ]
    },
    {
      category: 'تکنیک‌های پیشرفته مولکولی',
      subtitle: 'Advanced Molecular Techniques',
      icon: Microscope,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50',
      tests: [
        'CRISPR-Cas9 Gene Editing',
        'TALEN Gene Editing',
        'Zinc Finger Nuclease Editing',
        'Base Editing',
        'Prime Editing',
        'Gene Therapy',
        'Stem Cell Therapy',
        'Cell Therapy',
        'Immunotherapy',
        'CAR-T Cell Therapy',
        'TCR-T Cell Therapy',
        'Vaccine Development',
        'Drug Discovery',
        'Biomarker Discovery',
        'Proteomics',
        'Metabolomics',
        'Transcriptomics',
        'Epigenomics'
      ]
    }
  ];

  const allTests = molecularTests.flatMap(cat => cat.tests);
  const filteredTests = query 
    ? allTests.filter(test => test.toLowerCase().includes(query.toLowerCase()))
    : allTests;

  const filteredCategories = query 
    ? molecularTests.filter(cat => 
        cat.category.toLowerCase().includes(query.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        cat.tests.some(test => test.toLowerCase().includes(query.toLowerCase()))
      )
    : molecularTests;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Hero Section */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white p-8 md:p-12 mb-16 shadow-2xl">
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
                تشخیص مولکولی
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-8 leading-relaxed">
                آزمایش‌های پیشرفته تشخیص مولکولی شامل تکنیک‌های PCR، توالی‌یابی، تست‌های ژنتیکی و تشخیص بیماری‌ها در سطح DNA
              </p>
              <div className="max-w-md">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در آزمایش‌های تشخیص مولکولی..."
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
                <Search className="w-6 h-6 text-emerald-600" />
                <h3 className="text-xl font-semibold text-gray-800">نتایج جستجو</h3>
              </div>
              <p className="text-gray-600">
                {filteredTests.length} آزمایش از {allTests.length} آزمایش تشخیص مولکولی یافت شد
              </p>
              {filteredTests.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filteredTests.slice(0, 10).map((test, idx) => (
                    <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm border border-emerald-200">
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
                آزمایش‌های تشخیص مولکولی در 12 دسته اصلی سازماندهی شده‌اند
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
          <div className="mt-16 p-8 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">آماده برای نوبت‌دهی؟</h3>
              <p className="text-gray-600">برای رزرو نوبت آزمایش تشخیص مولکولی با ما تماس بگیرید</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 text-lg"
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

export default MolecularDiagnosisServices;
