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
  Heart,
  Zap,
  Pill,
  Beaker,
  Bug,
  Brain,
  Stethoscope,
  Shield,
  Target,
  Microscope,
  Database,
  Dna
} from 'lucide-react';

const ResearchServices: React.FC = () => {
  const [query, setQuery] = useState('');

  const researchTests = [
    {
      category: 'پروژه‌های تحقیقاتی بالینی',
      subtitle: 'Clinical Research Projects',
      icon: Stethoscope,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      tests: [
        'مطالعات کارآزمایی بالینی فاز I',
        'مطالعات کارآزمایی بالینی فاز II',
        'مطالعات کارآزمایی بالینی فاز III',
        'مطالعات کارآزمایی بالینی فاز IV',
        'مطالعات کوهورت',
        'مطالعات مورد-شاهد',
        'مطالعات مقطعی',
        'مطالعات طولی',
        'مطالعات مداخله‌ای',
        'مطالعات مشاهده‌ای',
        'مطالعات پایش دارو',
        'مطالعات فارماکوکینتیک',
        'مطالعات فارماکودینامیک',
        'مطالعات بیومارکر',
        'مطالعات ژنتیک بالینی',
        'مطالعات اپیدمیولوژیک',
        'مطالعات کیفیت زندگی',
        'مطالعات اقتصادی سلامت'
      ]
    },
    {
      category: 'پروژه‌های تحقیقاتی مولکولی',
      subtitle: 'Molecular Research Projects',
      icon: Dna,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-50 to-emerald-50',
      tests: [
        'توالی‌یابی ژنوم کامل',
        'توالی‌یابی اگزوم',
        'توالی‌یابی RNA',
        'توالی‌یابی سلول منفرد',
        'توالی‌یابی متیلاسیون',
        'توالی‌یابی کروماتین',
        'توالی‌یابی میکروبیوم',
        'توالی‌یابی ویروسی',
        'توالی‌یابی باکتریایی',
        'توالی‌یابی قارچی',
        'توالی‌یابی انگل',
        'توالی‌یابی میتوکندری',
        'توالی‌یابی Y کروموزوم',
        'توالی‌یابی X کروموزوم',
        'توالی‌یابی کروموزوم‌های خاص',
        'توالی‌یابی ناحیه‌های تنظیمی',
        'توالی‌یابی ژن‌های کاندید',
        'توالی‌یابی جهش‌های ناشناخته'
      ]
    },
    {
      category: 'پروژه‌های تحقیقاتی سلولی',
      subtitle: 'Cellular Research Projects',
      icon: Microscope,
      color: 'from-purple-500 to-violet-600',
      bgColor: 'from-purple-50 to-violet-50',
      tests: [
        'کشت سلول‌های بنیادی',
        'کشت سلول‌های سرطانی',
        'کشت سلول‌های ایمنی',
        'کشت سلول‌های عصبی',
        'کشت سلول‌های قلبی',
        'کشت سلول‌های کبدی',
        'کشت سلول‌های کلیوی',
        'کشت سلول‌های پوستی',
        'کشت سلول‌های استخوانی',
        'کشت سلول‌های غضروفی',
        'کشت سلول‌های عضلانی',
        'کشت سلول‌های چربی',
        'کشت سلول‌های اندوتلیال',
        'کشت سلول‌های فیبروبلاست',
        'کشت سلول‌های اپیتلیال',
        'کشت سلول‌های مزانشیمی',
        'کشت سلول‌های خونساز',
        'کشت سلول‌های جنینی'
      ]
    },
    {
      category: 'پروژه‌های تحقیقاتی پروتئومیکس',
      subtitle: 'Proteomics Research Projects',
      icon: Database,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'from-orange-50 to-amber-50',
      tests: [
        'آنالیز پروتئوم کامل',
        'آنالیز پروتئوم سلولی',
        'آنالیز پروتئوم بافتی',
        'آنالیز پروتئوم پلاسما',
        'آنالیز پروتئوم ادرار',
        'آنالیز پروتئوم CSF',
        'آنالیز پروتئوم بزاق',
        'آنالیز پروتئوم عرق',
        'آنالیز پروتئوم مو',
        'آنالیز پروتئوم ناخن',
        'آنالیز پروتئوم مدفوع',
        'آنالیز پروتئوم شیر',
        'آنالیز پروتئوم مایع آمنیوتیک',
        'آنالیز پروتئوم مایع منی',
        'آنالیز پروتئوم ترشحات واژن',
        'آنالیز پروتئوم ترشحات بینی',
        'آنالیز پروتئوم ترشحات گوش',
        'آنالیز پروتئوم ترشحات چشم'
      ]
    },
    {
      category: 'پروژه‌های تحقیقاتی متابولومیکس',
      subtitle: 'Metabolomics Research Projects',
      icon: Beaker,
      color: 'from-red-500 to-pink-600',
      bgColor: 'from-red-50 to-pink-50',
      tests: [
        'آنالیز متابولیت‌های پلاسما',
        'آنالیز متابولیت‌های ادرار',
        'آنالیز متابولیت‌های سلولی',
        'آنالیز متابولیت‌های بافتی',
        'آنالیز متابولیت‌های CSF',
        'آنالیز متابولیت‌های بزاق',
        'آنالیز متابولیت‌های عرق',
        'آنالیز متابولیت‌های مو',
        'آنالیز متابولیت‌های ناخن',
        'آنالیز متابولیت‌های مدفوع',
        'آنالیز متابولیت‌های شیر',
        'آنالیز متابولیت‌های مایع آمنیوتیک',
        'آنالیز متابولیت‌های مایع منی',
        'آنالیز متابولیت‌های ترشحات واژن',
        'آنالیز متابولیت‌های ترشحات بینی',
        'آنالیز متابولیت‌های ترشحات گوش',
        'آنالیز متابولیت‌های ترشحات چشم',
        'آنالیز متابولیت‌های تنفسی'
      ]
    },
    {
      category: 'پروژه‌های تحقیقاتی میکروبیوم',
      subtitle: 'Microbiome Research Projects',
      icon: Bug,
      color: 'from-teal-500 to-green-600',
      bgColor: 'from-teal-50 to-green-50',
      tests: [
        'آنالیز میکروبیوم روده',
        'آنالیز میکروبیوم دهان',
        'آنالیز میکروبیوم پوست',
        'آنالیز میکروبیوم واژن',
        'آنالیز میکروبیوم بینی',
        'آنالیز میکروبیوم گوش',
        'آنالیز میکروبیوم ریه',
        'آنالیز میکروبیوم مثانه',
        'آنالیز میکروبیوم معده',
        'آنالیز میکروبیوم مری',
        'آنالیز میکروبیوم کبد',
        'آنالیز میکروبیوم پانکراس',
        'آنالیز میکروبیوم طحال',
        'آنالیز میکروبیوم مغز',
        'آنالیز میکروبیوم خون',
        'آنالیز میکروبیوم لنف',
        'آنالیز میکروبیوم استخوان',
        'آنالیز میکروبیوم مفصل'
      ]
    },
    {
      category: 'پروژه‌های تحقیقاتی ایمونولوژی',
      subtitle: 'Immunology Research Projects',
      icon: Shield,
      color: 'from-indigo-500 to-blue-600',
      bgColor: 'from-indigo-50 to-blue-50',
      tests: [
        'آنالیز سلول‌های T',
        'آنالیز سلول‌های B',
        'آنالیز سلول‌های NK',
        'آنالیز سلول‌های دندریتیک',
        'آنالیز ماکروفاژها',
        'آنالیز نوتروفیل‌ها',
        'آنالیز ائوزینوفیل‌ها',
        'آنالیز بازوفیل‌ها',
        'آنالیز ماست سل‌ها',
        'آنالیز سلول‌های T تنظیمی',
        'آنالیز سلول‌های T حافظه',
        'آنالیز سلول‌های T کشنده',
        'آنالیز سلول‌های B حافظه',
        'آنالیز سلول‌های پلاسما',
        'آنالیز سلول‌های بنیادی خونساز',
        'آنالیز سلول‌های پیش‌ساز',
        'آنالیز سلول‌های تمایز نیافته',
        'آنالیز سلول‌های تمایز یافته'
      ]
    },
    {
      category: 'پروژه‌های تحقیقاتی سرطان',
      subtitle: 'Cancer Research Projects',
      icon: Target,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'from-rose-50 to-pink-50',
      tests: [
        'آنالیز تومورهای مغزی',
        'آنالیز تومورهای سینه',
        'آنالیز تومورهای ریه',
        'آنالیز تومورهای کولورکتال',
        'آنالیز تومورهای پروستات',
        'آنالیز تومورهای تخمدان',
        'آنالیز تومورهای رحم',
        'آنالیز تومورهای معده',
        'آنالیز تومورهای کبد',
        'آنالیز تومورهای پانکراس',
        'آنالیز تومورهای کلیه',
        'آنالیز تومورهای مثانه',
        'آنالیز تومورهای پوست',
        'آنالیز تومورهای استخوان',
        'آنالیز تومورهای نرم',
        'آنالیز تومورهای خون',
        'آنالیز تومورهای لنفاوی',
        'آنالیز تومورهای عصبی'
      ]
    },
    {
      category: 'پروژه‌های تحقیقاتی بیماری‌های قلبی-عروقی',
      subtitle: 'Cardiovascular Research Projects',
      icon: Heart,
      color: 'from-red-500 to-rose-600',
      bgColor: 'from-red-50 to-rose-50',
      tests: [
        'آنالیز بیماری‌های عروق کرونر',
        'آنالیز نارسایی قلبی',
        'آنالیز آریتمی‌ها',
        'آنالیز فشار خون بالا',
        'آنالیز آترواسکلروز',
        'آنالیز ترومبوز',
        'آنالیز آمبولی',
        'آنالیز آنوریسم',
        'آنالیز بیماری‌های دریچه‌ای',
        'آنالیز کاردیومیوپاتی',
        'آنالیز پریکاردیت',
        'آنالیز اندوکاردیت',
        'آنالیز میوکاردیت',
        'آنالیز بیماری‌های عروق محیطی',
        'آنالیز بیماری‌های عروق مغزی',
        'آنالیز بیماری‌های عروق کلیوی',
        'آنالیز بیماری‌های عروق چشمی',
        'آنالیز بیماری‌های عروق گوش'
      ]
    },
    {
      category: 'پروژه‌های تحقیقاتی بیماری‌های عصبی',
      subtitle: 'Neurological Research Projects',
      icon: Brain,
      color: 'from-violet-500 to-purple-600',
      bgColor: 'from-violet-50 to-purple-50',
      tests: [
        'آنالیز بیماری آلزایمر',
        'آنالیز بیماری پارکینسون',
        'آنالیز بیماری هانتینگتون',
        'آنالیز بیماری ALS',
        'آنالیز بیماری MS',
        'آنالیز صرع',
        'آنالیز سکته مغزی',
        'آنالیز تومورهای مغزی',
        'آنالیز بیماری‌های عصبی-عضلانی',
        'آنالیز بیماری‌های عصبی-حرکتی',
        'آنالیز بیماری‌های عصبی-حسی',
        'آنالیز بیماری‌های عصبی-شناختی',
        'آنالیز بیماری‌های عصبی-رفتاری',
        'آنالیز بیماری‌های عصبی-روانی',
        'آنالیز بیماری‌های عصبی-متابولیک',
        'آنالیز بیماری‌های عصبی-ژنتیکی',
        'آنالیز بیماری‌های عصبی-ایمنی',
        'آنالیز بیماری‌های عصبی-عفونی'
      ]
    },
    {
      category: 'پروژه‌های تحقیقاتی بیماری‌های متابولیک',
      subtitle: 'Metabolic Research Projects',
      icon: Zap,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-50 to-orange-50',
      tests: [
        'آنالیز دیابت نوع 1',
        'آنالیز دیابت نوع 2',
        'آنالیز مقاومت به انسولین',
        'آنالیز سندرم متابولیک',
        'آنالیز چاقی',
        'آنالیز اختلالات چربی',
        'آنالیز بیماری‌های تیروئید',
        'آنالیز بیماری‌های آدرنال',
        'آنالیز بیماری‌های هیپوفیز',
        'آنالیز بیماری‌های پانکراس',
        'آنالیز بیماری‌های کبد',
        'آنالیز بیماری‌های کلیه',
        'آنالیز بیماری‌های استخوان',
        'آنالیز بیماری‌های عضله',
        'آنالیز بیماری‌های پوست',
        'آنالیز بیماری‌های چشم',
        'آنالیز بیماری‌های گوش',
        'آنالیز بیماری‌های بینی'
      ]
    },
    {
      category: 'پروژه‌های تحقیقاتی بیماری‌های عفونی',
      subtitle: 'Infectious Disease Research Projects',
      icon: Bug,
      color: 'from-lime-500 to-green-600',
      bgColor: 'from-lime-50 to-green-50',
      tests: [
        'آنالیز عفونت‌های ویروسی',
        'آنالیز عفونت‌های باکتریایی',
        'آنالیز عفونت‌های قارچی',
        'آنالیز عفونت‌های انگلی',
        'آنالیز عفونت‌های اکتسابی',
        'آنالیز عفونت‌های مادرزادی',
        'آنالیز عفونت‌های بیمارستانی',
        'آنالیز عفونت‌های جامعه',
        'آنالیز عفونت‌های تنفسی',
        'آنالیز عفونت‌های گوارشی',
        'آنالیز عفونت‌های ادراری',
        'آنالیز عفونت‌های تناسلی',
        'آنالیز عفونت‌های پوستی',
        'آنالیز عفونت‌های استخوانی',
        'آنالیز عفونت‌های مفصلی',
        'آنالیز عفونت‌های مغزی',
        'آنالیز عفونت‌های قلبی',
        'آنالیز عفونت‌های کبدی'
      ]
    }
  ];

  const allTests = researchTests.flatMap(cat => cat.tests);
  const filteredTests = query 
    ? allTests.filter(test => test.toLowerCase().includes(query.toLowerCase()))
    : allTests;

  const filteredCategories = query 
    ? researchTests.filter(cat => 
        cat.category.toLowerCase().includes(query.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        cat.tests.some(test => test.toLowerCase().includes(query.toLowerCase()))
      )
    : researchTests;

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-pink-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-20">
        {/* Hero Section */}
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-600 via-pink-600 to-fuchsia-600 text-white p-8 md:p-12 mb-16 shadow-2xl">
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
                پروژه‌های تحقیقاتی
              </h1>
              <p className="text-xl md:text-2xl text-white/90 max-w-4xl mb-8 leading-relaxed">
                خدمات تحقیقاتی پیشرفته شامل پروژه‌های بالینی، مولکولی، سلولی و بیوانفورماتیک برای پیشرفت علم پزشکی
              </p>
              <div className="max-w-md">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="جستجو در پروژه‌های تحقیقاتی..."
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
                <Search className="w-6 h-6 text-rose-600" />
                <h3 className="text-xl font-semibold text-gray-800">نتایج جستجو</h3>
              </div>
              <p className="text-gray-600">
                {filteredTests.length} پروژه از {allTests.length} پروژه تحقیقاتی یافت شد
              </p>
              {filteredTests.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filteredTests.slice(0, 10).map((test, idx) => (
                    <span key={idx} className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm border border-rose-200">
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
                دسته‌بندی پروژه‌ها
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                پروژه‌های تحقیقاتی در 12 دسته اصلی سازماندهی شده‌اند
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
                          <p className="text-white/80">{category.tests.length} پروژه</p>
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
          <div className="mt-16 p-8 bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">آماده برای همکاری تحقیقاتی؟</h3>
              <p className="text-gray-600">برای شروع پروژه تحقیقاتی با ما تماس بگیرید</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('http://93.114.111.53:8086/general/online-ticketing', '_blank')}
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 text-white px-8 py-3 text-lg"
              >
                درخواست پروژه تحقیقاتی
              </Button>
              <Button 
                onClick={() => window.open('tel:02146833010', '_self')}
                variant="outline" 
                className="border-2 border-gray-300 hover:border-gray-400 px-8 py-3 text-lg"
              >
                تماس با تیم تحقیقاتی
              </Button>
            </div>
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
};

export default ResearchServices;
