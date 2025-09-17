
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { wordpressService, WordPressArticle } from '@/services/wordpress';
import StaggeredReveal from './StaggeredReveal';
import { Calendar, Clock, User, ArrowRight, BookOpen, TrendingUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Articles = () => {
  const isMobile = useIsMobile();
  const [articles, setArticles] = useState<WordPressArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedArticles = async () => {
      try {
        setLoading(true);
        const featuredArticles = await wordpressService.getFeaturedArticles(4);
        setArticles(featuredArticles);
      } catch (err) {
        if (err instanceof Error) {
            setError(`خطا در بارگذاری مقالات: ${err.message}`);
        } else {
            setError('یک خطای ناشناخته رخ داد');
        }
        console.error('Error fetching featured articles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedArticles();
  }, []);

  if (loading) {
    return (
      <section id="articles" className="py-12 md:py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-float"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-green-200 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-float" style={{animationDelay: '4s'}}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            {/* Enhanced Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 md:w-28 md:h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mb-6 md:mb-8 shadow-2xl transform hover:scale-110 transition-transform duration-500">
              <BookOpen className="w-14 h-14 text-white" />
            </div>
            
            {/* Enhanced Title */}
            <div className="mb-6">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-3 md:mb-4">
                مقالات علمی
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>
            
            <p className="text-gray-600 text-base md:text-xl max-w-2xl md:max-w-3xl mx-auto leading-relaxed">
              مطالب آموزشی و علمی در حوزه سلامت و آزمایشگاه
            </p>
            
            {/* Stats */}
            <div className="flex justify-center items-center space-x-8 space-x-reverse mt-8">
              <div className="flex items-center space-x-2 space-x-reverse">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="text-gray-600 font-medium">به‌روزرسانی روزانه</span>
              </div>
              <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <BookOpen className="w-5 h-5 text-purple-600" />
                <span className="text-gray-600 font-medium">منابع معتبر</span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Loading Cards */}
          <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
            {[...Array(4)].map((_, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-xl bg-white/90 backdrop-blur-sm animate-pulse rounded-3xl group hover:shadow-2xl transition-all duration-500">
                <div className="h-48 md:h-80 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                </div>
                <div className="p-8">
                  <div className="h-4 bg-gray-200 rounded-full mb-4 w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded-full mb-4 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded-full mb-4 w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || articles.length === 0) {
    return (
      <section id="articles" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
        {/* Enhanced Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-20">
            {/* Enhanced Icon */}
            <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mb-8 shadow-2xl">
              <BookOpen className="w-14 h-14 text-white" />
            </div>
            
            {/* Enhanced Title */}
            <div className="mb-6">
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4">
                مقالات علمی
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full"></div>
            </div>
            
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              مطالب آموزشی و علمی در حوزه سلامت و آزمایشگاه
            </p>
          </div>
          
          {/* Enhanced Error State */}
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-red-500 to-pink-500 rounded-3xl mb-6 shadow-2xl">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-gray-500 text-xl mb-8 max-w-2xl mx-auto">
              {error || 'هیچ مقاله‌ای یافت نشد'}
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
            >
              تلاش مجدد
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const displayedArticles = isMobile ? articles.slice(0, 2) : articles;

  return (
    <section id="articles" className="py-24 bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-float"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-green-200 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob-float" style={{animationDelay: '4s'}}></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          {/* Enhanced Icon */}
          <div className="inline-flex items-center justify-center w-28 h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-3xl mb-8 shadow-2xl transform hover:scale-110 transition-transform duration-500 animate-rotate-in">
            <BookOpen className="w-14 h-14 text-white" />
          </div>
          
          {/* Enhanced Title */}
          <div className="mb-6 animate-fade-in-up">
            <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent mb-4 animate-gradient-shift">
              مقالات علمی
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full animate-fade-in-up" style={{animationDelay: '0.3s'}}></div>
          </div>
          
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            مطالب آموزشی و علمی در حوزه سلامت و آزمایشگاه
          </p>
          
          {/* Stats */}
          <div className="flex justify-center items-center space-x-8 space-x-reverse mt-8 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
            <div className="flex items-center space-x-2 space-x-reverse">
              <TrendingUp className="w-5 h-5 text-blue-600 animate-pulse-scale" />
              <span className="text-gray-600 font-medium">به‌روزرسانی روزانه</span>
            </div>
            <div className="w-1 h-6 bg-gray-300 rounded-full"></div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <BookOpen className="w-5 h-5 text-purple-600 animate-pulse-scale" style={{animationDelay: '1.5s'}} />
              <span className="text-gray-600 font-medium">منابع معتبر</span>
            </div>
          </div>
        </div>

        <StaggeredReveal 
          staggerDelay={200} 
          direction="left" 
          duration={800}
          className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
        >
          {displayedArticles.map((article) => (
            <Card key={article.id} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/90 backdrop-blur-sm rounded-3xl hover-lift hover-glow">
              {/* Enhanced Background Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                {/* Enhanced Image Container */}
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 rounded-t-3xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                  
                  {/* Enhanced Category Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm border-0 hover-scale">
                      {article.category}
                    </Badge>
                  </div>
                  
                  {/* Enhanced Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end">
                    <div className="p-6 text-white">
                      <p className="text-sm opacity-90 mb-2 animate-text-reveal">برای مطالعه بیشتر کلیک کنید</p>
                      <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Content */}
                <div className="p-8">
                  {/* Enhanced Meta Information */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 space-x-reverse">
                      <div className="flex items-center space-x-2 space-x-reverse text-blue-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{article.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse text-purple-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{article.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-700 transition-colors duration-300 line-clamp-2 leading-tight">
                    {article.title}
                  </h3>
                  
                  {/* Enhanced Excerpt */}
                  <p className="text-gray-600 mb-6 leading-relaxed text-lg line-clamp-3">
                    {article.excerpt}
                  </p>
                  
                  {/* Enhanced Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
                      <User className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium">نویسنده: {article.author}</span>
                    </div>
                    <Link to={`/article/${article.id}`} aria-label={`مشاهده مقاله: ${article.title}`}>
                      <Button variant="ghost" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 p-3 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100" title="مشاهده">
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </StaggeredReveal>

        {/* Enhanced CTA Section */}
        <div className="text-center mt-20 animate-fade-in-up" style={{animationDelay: '1.2s'}}>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 max-w-4xl mx-auto border border-blue-100 hover-lift hover-glow">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">آیا می‌خواهید همه مقالات را ببینید؟</h3>
            <p className="text-gray-600 mb-6">مجموعه کاملی از مطالب آموزشی و علمی در حوزه سلامت و آزمایشگاه</p>
            <Link to="/articles">
              <Button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white px-10 py-4 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform group hover-glow">
                مشاهده همه مقالات
                <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Articles;
