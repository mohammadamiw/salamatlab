
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { Search, ArrowRight, BookOpen, TrendingUp, Calendar, Clock, User, Filter, Sparkles } from 'lucide-react';
import { wordpressService, WordPressArticle } from '@/services/wordpress';

const AllArticles = () => {
  const [articles, setArticles] = useState<WordPressArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const articlesPerPage = 6;

  // Fetch articles when component mounts or search/page changes
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        let result;
        
        if (searchTerm.trim()) {
          result = await wordpressService.searchArticles(searchTerm, currentPage);
        } else {
          result = await wordpressService.getAllArticles(currentPage, articlesPerPage);
        }
        
        setArticles(result.articles);
        setTotalPages(result.totalPages);
        setTotalPosts(result.totalPosts);
      } catch (err) {
        if (err instanceof Error) {
          setError(`خطا در بارگذاری مقالات: ${err.message}`);
        } else {
          setError('یک خطای ناشناخته در بارگذاری مقالات رخ داد');
        }
        console.error('Error fetching articles:', err);
      } finally {
        setLoading(false);
      }
    };

    // Add debounce for search
    const timeoutId = setTimeout(() => {
      fetchArticles();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, currentPage]);

  // Reset to first page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && articles.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <Header />
        {/* Enhanced Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              {/* Enhanced Icon */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-3xl mb-8 backdrop-blur-sm border border-white/30">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">مقالات علمی</h1>
              <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed">
                مجموعه کاملی از مطالب آموزشی و علمی در حوزه سلامت و آزمایشگاه
              </p>
              
              {/* Enhanced Stats */}
              <div className="flex justify-center items-center space-x-8 space-x-reverse">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-sm opacity-90">به‌روزرسانی روزانه</span>
                </div>
                <div className="w-1 h-6 bg-white/30 rounded-full"></div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm opacity-90">محتوای با کیفیت</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Loading Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced Search Placeholder */}
            <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 animate-pulse">
              <div className="h-12 bg-gray-200 rounded-xl w-full"></div>
            </div>
            
            {/* Enhanced Loading Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse group hover:shadow-xl transition-all duration-500 rounded-2xl border-0 shadow-lg">
                  <div className="h-56 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded-full mb-3 w-3/4"></div>
                    <div className="h-6 bg-gray-200 rounded-full mb-3 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded-full mb-4 w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-20 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Enhanced Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-3xl mb-8 backdrop-blur-sm border border-white/30 animate-rotate-in">
              <BookOpen className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">مقالات علمی</h1>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              مجموعه کاملی از مطالب آموزشی و علمی در حوزه سلامت و آزمایشگاه
            </p>
            
            {/* Enhanced Stats */}
            <div className="flex justify-center items-center space-x-8 space-x-reverse mb-8 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="flex items-center space-x-2 space-x-reverse">
                <TrendingUp className="w-5 h-5 animate-pulse-scale" />
                <span className="text-sm opacity-90">به‌روزرسانی روزانه</span>
              </div>
              <div className="w-1 h-6 bg-white/30 rounded-full"></div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Sparkles className="w-5 h-5 animate-pulse-scale" style={{animationDelay: '1.5s'}} />
                <span className="text-sm opacity-90">محتوای با کیفیت</span>
              </div>
            </div>
            
            <div className="flex justify-center animate-fade-in-up" style={{animationDelay: '0.9s'}}>
              <Link to="/">
                <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary transition-all duration-300 transform hover:scale-105 hover-glow">
                  <ArrowRight className="ml-2 h-4 w-4" />
                  بازگشت به صفحه اصلی
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12 border border-gray-100 hover-lift">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Enhanced Search */}
              <div className="flex-1 relative">
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  placeholder="جستجو در مقالات..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pr-12 h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-300 hover-glow"
                />
              </div>
              
              {/* Enhanced Filter Button */}
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover-glow">
                <Filter className="ml-2 h-5 w-5" />
                فیلتر
              </Button>
            </div>
          </div>

          {/* Enhanced Results Count */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                  <p className="text-gray-700 text-lg font-medium">
                    {totalPosts} مقاله یافت شد
                    {searchTerm && ` برای "${searchTerm}"`}
                  </p>
                </div>
                <Badge className="bg-blue-600 text-white px-4 py-2 rounded-full">
                  صفحه {currentPage} از {totalPages}
                </Badge>
              </div>
            </div>
          </div>

          {/* Enhanced Error Display */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6 mb-8">
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-red-600 font-medium">{error}</p>
                  <p className="text-red-500 text-sm mt-1">لطفاً دوباره تلاش کنید</p>
                </div>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl transition-all duration-300"
                >
                  تلاش مجدد
                </Button>
              </div>
            </div>
          )}

          {/* Enhanced Articles Grid */}
          {!loading && articles.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {articles.map((article, index) => (
                <Card key={article.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl border-0 shadow-lg group hover-lift hover-glow">
                  {/* Enhanced Image Container */}
                  <div className="relative h-56 overflow-hidden">
                    <img 
                      src={article.image} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 rounded-t-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                    
                    {/* Enhanced Category Badge */}
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full text-sm font-medium border-0 shadow-lg hover-scale">
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
                  <div className="p-6">
                    {/* Enhanced Meta Information */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{article.readTime}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span>{article.date}</span>
                      </div>
                    </div>
                    
                    {/* Enhanced Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 hover:text-blue-600 transition-colors duration-300 line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                    
                    {/* Enhanced Excerpt */}
                    <p className="text-gray-600 mb-4 leading-relaxed line-clamp-3">
                      {article.excerpt}
                    </p>
                    
                    {/* Enhanced Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 space-x-reverse text-gray-500">
                        <User className="w-4 h-4 text-green-500" />
                        <span className="text-sm">نویسنده: {article.author}</span>
                      </div>
                      <Link to={`/article/${article.id}`}>
                        <Button
                          variant="ghost"
                          className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 p-2 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-100"
                          aria-label={`مشاهده مقاله: ${article.title}`}
                          title="مشاهده"
                        >
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Enhanced No Results */}
          {!loading && articles.length === 0 && !error && (
            <div className="text-center py-16">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-12 border border-gray-200 max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-700 mb-4">
                  {searchTerm ? `هیچ مقاله‌ای برای "${searchTerm}" یافت نشد` : 'هیچ مقاله‌ای یافت نشد'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm ? 'لطفاً کلمات کلیدی دیگری را امتحان کنید' : 'در حال حاضر مقاله‌ای در دسترس نیست'}
                </p>
                {searchTerm && (
                  <Button 
                    onClick={() => setSearchTerm('')} 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl transition-all duration-300"
                  >
                    پاک کردن جستجو
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
                <Pagination>
                  <PaginationContent className="space-x-2">
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                          currentPage === 1 
                            ? "pointer-events-none opacity-50 bg-gray-100" 
                            : "cursor-pointer hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, index) => (
                      <PaginationItem key={index + 1}>
                        <PaginationLink
                          onClick={() => handlePageChange(index + 1)}
                          isActive={currentPage === index + 1}
                          className={`px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 ${
                            currentPage === index + 1
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {index + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={`px-4 py-2 rounded-xl transition-all duration-300 ${
                          currentPage === totalPages 
                            ? "pointer-events-none opacity-50 bg-gray-100" 
                            : "cursor-pointer hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllArticles;
