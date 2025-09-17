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
  AlertTriangle,
  Skull,
  Poison,
  SyringeIcon,
  Leaf
} from 'lucide-react';

const ToxicologyServices: React.FC = () => {
  const [query, setQuery] = useState('');

  const toxicologyTests = [
    {
      category: 'پایش داروهای درمانی (TDM)',
      subtitle: 'Therapeutic Drug Monitoring',
      icon: Pill,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      tests: [
        'Digoxin',
        'Phenytoin',
        'Carbamazepine',
        'Valproic Acid',
        'Lithium',
        'Theophylline',
        'Aminoglycosides (Gentamicin, Tobramycin)',
        'Vancomycin',
        'Cyclosporine',
        'Tacrolimus',
        'Methotrexate',
        '5-Fluorouracil',
        'Imatinib',
        'Nilotinib',
        'Dasatinib',
        'Everolimus',
        'Sirolimus',
        'Mycophenolic Acid'
      ]
    },
    {
      category: 'آمفتامین‌ها و مشتقات',
      subtitle: 'Amphetamines & Derivatives',
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      tests: [
        'Amphetamine',
        'Methamphetamine',
        'MDMA (Ecstasy)',
        'MDA',
        'MDEA',
        'Phentermine',
        'Dexamphetamine',
        'Methylphenidate',
        'Ephedrine',
        'Pseudoephedrine',
        'Cathinone',
        'Mephedrone',
        'Methylone',
        'Butylone',
        'Ethylone',
        'Pentylone',
        '3-MMC',
        '4-MMC'
      ]
    },
    {
      category: 'اپیوئیدها',
      subtitle: 'Opioids',
      icon: Skull,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      tests: [
        'Morphine',
        'Codeine',
        'Heroin',
        'Methadone',
        'Buprenorphine',
        'Fentanyl',
        'Oxycodone',
        'Hydrocodone',
        'Hydromorphone',
        'Oxymorphone',
        'Tramadol',
        'Tapentadol',
        'Meperidine',
        'Propoxyphene',
        'Pentazocine',
        'Butorphanol',
        'Nalbuphine',
        'Naloxone'
      ]
    },
    {
      category: 'بنزودیازپین‌ها',
      subtitle: 'Benzodiazepines',
      icon: Pill,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      tests: [
        'Alprazolam',
        'Diazepam',
        'Lorazepam',
        'Clonazepam',
        'Midazolam',
        'Temazepam',
        'Triazolam',
        'Flurazepam',
        'Nitrazepam',
        'Bromazepam',
        'Chlordiazepoxide',
        'Oxazepam',
        'Prazepam',
        'Flunitrazepam',
        'Estazolam',
        'Quazepam',
        'Zolpidem',
        'Zopiclone'
      ]
    },
    {
      category: 'کانابیس و مشتقات',
      subtitle: 'Cannabis & Derivatives',
      icon: Leaf,
      color: 'from-green-500 to-lime-600',
      bgColor: 'from-green-50 to-lime-50',
      tests: [
        'THC (Δ9-Tetrahydrocannabinol)',
        'THC-COOH (11-nor-9-carboxy-THC)',
        'THC-OH (11-hydroxy-THC)',
        'CBD (Cannabidiol)',
        'CBN (Cannabinol)',
        'CBG (Cannabigerol)',
        'CBC (Cannabichromene)',
        'THCV (Tetrahydrocannabivarin)',
        'CBDV (Cannabidivarin)',
        'Synthetic Cannabinoids (JWH-018, JWH-073)',
        'Spice Compounds',
        'K2 Compounds',
        'Black Mamba',
        'Clockwork Orange',
        'Cloud 9',
        'Mojo',
        'Scooby Snax',
        'Yucatan Fire'
      ]
    },
    {
      category: 'کوکائین و مشتقات',
      subtitle: 'Cocaine & Derivatives',
      icon: AlertTriangle,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'from-orange-50 to-amber-50',
      tests: [
        'Cocaine',
        'Benzoylecgonine',
        'Ecgonine Methyl Ester',
        'Cocaethylene',
        'Norcocaine',
        'Crack Cocaine',
        'Free Base Cocaine',
        'Cocaine HCl',
        'Cocaine Metabolites',
        'Cocaine in Hair',
        'Cocaine in Nails',
        'Cocaine in Saliva',
        'Cocaine in Urine',
        'Cocaine in Blood',
        'Cocaine in Sweat',
        'Cocaine in Meconium',
        'Cocaine in Amniotic Fluid',
        'Cocaine in Breast Milk'
      ]
    },
    {
      category: 'باربیتورات‌ها',
      subtitle: 'Barbiturates',
      icon: Pill,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      tests: [
        'Phenobarbital',
        'Secobarbital',
        'Pentobarbital',
        'Amobarbital',
        'Butabarbital',
        'Mephobarbital',
        'Metharbital',
        'Primidone',
        'Thiopental',
        'Methohexital',
        'Thiamylal',
        'Butalbital',
        'Talbutal',
        'Vinbarbital',
        'Cyclobarbital',
        'Hexobarbital',
        'Aprobarbital',
        'Alphenal'
      ]
    },
    {
      category: 'آنتیدپرسان‌ها',
      subtitle: 'Antidepressants',
      icon: Brain,
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'from-indigo-50 to-blue-50',
      tests: [
        'Amitriptyline',
        'Nortriptyline',
        'Imipramine',
        'Desipramine',
        'Clomipramine',
        'Desmethylclomipramine',
        'Fluoxetine',
        'Norfluoxetine',
        'Sertraline',
        'Desmethylsertraline',
        'Paroxetine',
        'Citalopram',
        'Escitalopram',
        'Venlafaxine',
        'O-desmethylvenlafaxine',
        'Duloxetine',
        'Bupropion',
        'Mirtazapine'
      ]
    },
    {
      category: 'آنتی‌سایکوتیک‌ها',
      subtitle: 'Antipsychotics',
      icon: Brain,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'from-violet-50 to-purple-50',
      tests: [
        'Chlorpromazine',
        'Haloperidol',
        'Risperidone',
        '9-Hydroxyrisperidone',
        'Olanzapine',
        'Quetiapine',
        'Aripiprazole',
        'Clozapine',
        'Norclozapine',
        'Ziprasidone',
        'Paliperidone',
        'Asenapine',
        'Lurasidone',
        'Iloperidone',
        'Brexpiprazole',
        'Cariprazine',
        'Pimavanserin',
        'Lumateperone'
      ]
    },
    {
      category: 'فلزات سنگین',
      subtitle: 'Heavy Metals',
      icon: Shield,
      color: 'from-slate-500 to-gray-600',
      bgColor: 'from-slate-50 to-gray-50',
      tests: [
        'Lead (Pb)',
        'Mercury (Hg)',
        'Arsenic (As)',
        'Cadmium (Cd)',
        'Chromium (Cr)',
        'Nickel (Ni)',
        'Cobalt (Co)',
        'Manganese (Mn)',
        'Copper (Cu)',
        'Zinc (Zn)',
        'Iron (Fe)',
        'Aluminum (Al)',
        'Beryllium (Be)',
        'Uranium (U)',
        'Thorium (Th)',
        'Plutonium (Pu)',
        'Selenium (Se)',
        'Molybdenum (Mo)'
      ]
    },
    {
      category: 'سموم کشاورزی',
      subtitle: 'Agricultural Pesticides',
      icon: Bug,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'from-emerald-50 to-teal-50',
      tests: [
        'Organophosphates (Chlorpyrifos, Malathion)',
        'Carbamates (Carbaryl, Aldicarb)',
        'Organochlorines (DDT, Lindane)',
        'Pyrethroids (Permethrin, Cypermethrin)',
        'Neonicotinoids (Imidacloprid, Thiamethoxam)',
        'Glyphosate',
        'Atrazine',
        'Paraquat',
        'Diquat',
        '2,4-D',
        'Dicamba',
        'MCPA',
        'Bromoxynil',
        'Ioxynil',
        'Bentazon',
        'Propanil',
        'Amitrole',
        'Glufosinate'
      ]
    },
    {
      category: 'سموم خانگی و صنعتی',
      subtitle: 'Household & Industrial Toxins',
      icon: AlertTriangle,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'from-rose-50 to-pink-50',
      tests: [
        'Ethylene Glycol',
        'Methanol',
        'Isopropanol',
        'Acetone',
        'Toluene',
        'Xylene',
        'Benzene',
        'Formaldehyde',
        'Carbon Monoxide',
        'Cyanide',
        'Carbon Tetrachloride',
        'Trichloroethylene',
        'Tetrachloroethylene',
        'Chloroform',
        'Dichloromethane',
        'Ammonia',
        'Chlorine',
        'Sulfur Dioxide'
      ]
    }
  ];

  const allTests = toxicologyTests.flatMap(cat => cat.tests);
  const filteredTests = query 
    ? allTests.filter(test => test.toLowerCase().includes(query.toLowerCase()))
    : allTests;

  const filteredCategories = query 
    ? toxicologyTests.filter(cat => 
        cat.category.toLowerCase().includes(query.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        cat.tests.some(test => test.toLowerCase().includes(query.toLowerCase()))
      )
    : toxicologyTests;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-slate-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Hero Section */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-600 via-slate-600 to-zinc-600 text-white p-8 md:p-12 mb-16 shadow-2xl">
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
                سم شناسی و پایش دارو
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-8 leading-relaxed">
                خدمات جامع سم شناسی شامل پایش داروهای درمانی، تشخیص سموم، فلزات سنگین و مواد مخدر
              </p>
              <div className="max-w-md">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در آزمایش‌های سم شناسی..."
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
                <Search className="w-6 h-6 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-800">نتایج جستجو</h3>
              </div>
              <p className="text-gray-600">
                {filteredTests.length} آزمایش از {allTests.length} آزمایش سم شناسی یافت شد
              </p>
              {filteredTests.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filteredTests.slice(0, 10).map((test, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm border border-gray-200">
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
                آزمایش‌های سم شناسی در 12 دسته اصلی سازماندهی شده‌اند
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
          <div className="mt-16 p-8 bg-gradient-to-br from-gray-50 to-slate-50 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">آماده برای نوبت‌دهی؟</h3>
              <p className="text-gray-600">برای رزرو نوبت آزمایش سم شناسی با ما تماس بگیرید</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}
                className="bg-gradient-to-r from-gray-600 to-slate-600 hover:from-gray-700 hover:to-slate-700 text-white px-8 py-3 text-lg"
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

export default ToxicologyServices;
