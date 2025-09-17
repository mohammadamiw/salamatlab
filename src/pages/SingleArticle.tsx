import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import CanonicalTag from '@/components/CanonicalTag';
import MetaTags from '@/components/MetaTags';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Calendar, User, Clock, Tag, BookOpen, Share2, Heart, MessageCircle, Eye } from 'lucide-react';
import { wordpressService, WordPressArticle, WordPressComment } from '@/services/wordpress';

const SingleArticle = () => {
  const { id } = useParams<{ id: string }>();
  const [article, setArticle] = useState<WordPressArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState<WordPressComment[]>([]);
  const [related, setRelated] = useState<WordPressArticle[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const post = await wordpressService.fetchPost(parseInt(id));
        const convertedArticle = wordpressService.convertToArticle(post);
        setArticle(convertedArticle);

        // Load comments and related posts in parallel
        const [postComments, relatedArticles] = await Promise.all([
          wordpressService.fetchComments(post.id),
          wordpressService.getRelatedArticles(post, 3)
        ]);
        setComments(postComments || []);
        setRelated(relatedArticles || []);
        
        // Simulate view count
        setViewCount(Math.floor(Math.random() * 1000) + 100);
      } catch (err) {
        setError('خطا در بارگذاری مقاله');
        console.error('Error fetching article:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title,
        text: article?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Header />
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 animate-pulse">
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600">در حال بارگذاری مقاله...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Header />
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-red-600 mb-2">خطا</h1>
          <p className="text-gray-600 mb-4">{error || 'مقاله پیدا نشد'}</p>
          <Link to="/articles">
            <Button variant="outline">
              بازگشت به مقالات
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CanonicalTag path={`/article/${id}`} />
      <MetaTags 
        title={`${article.title} | آزمایشگاه تشخیص پزشکی سلامت`}
        description={article.excerpt || `مقاله ${article.title} در آزمایشگاه تشخیص پزشکی سلامت`}
        keywords={`${article.category}, آزمایشگاه سلامت, ${article.tags?.join(', ') || ''}`}
        ogImage={article.image}
        path={`/article/${id}`}
      />
      <Header />
      
      {/* Simple Header */}
      <div className="container mx-auto px-4 pt-28 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link to="/articles">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowRight className="ml-2 h-4 w-4" />
                بازگشت به مقالات
              </Button>
            </Link>
          </div>
          
          {/* Article Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Article Meta */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{article.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{article.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{viewCount} بازدید</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Featured Image */}
          <div className="mb-12">
            <img 
              src={article.image} 
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover rounded-lg shadow-sm"
            />
          </div>
          
          {/* Article Content */}
          <div className="bg-white">
            {/* Excerpt */}
            {article.excerpt && (
              <div className="mb-8 p-6 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-gray-700 leading-relaxed text-lg font-medium">
                  {article.excerpt}
                </p>
              </div>
            )}

            {/* Main Content */}
            <div 
              className="prose prose-lg max-w-none text-gray-800 leading-relaxed prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900 prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-600 prose-img:rounded-lg prose-img:shadow-sm"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Article Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-6">
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>نویسنده: {article.author}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>تاریخ انتشار: {article.date}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleLike}
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    className={`${
                      isLiked ? 'bg-red-500 hover:bg-red-600 text-white' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 ml-2 ${isLiked ? 'fill-current' : ''}`} />
                    {isLiked ? 'پسندیده شد' : 'پسندیدن'}
                  </Button>
                  <Button 
                    onClick={handleShare}
                    variant="outline"
                    size="sm"
                  >
                    <Share2 className="w-4 h-4 ml-2" />
                    اشتراک‌گذاری
                  </Button>
                </div>
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <div className="mb-4 text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-600" />
                  برچسب‌ها
                </div>
                <div className="flex flex-wrap gap-3">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm bg-white border border-gray-200 hover:border-blue-300 transition-colors">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div className="mt-12">
              <div className="border-t border-gray-200 pt-8">
                <div className="mb-6 flex items-center gap-3">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-2xl font-bold text-gray-800">نظرات</h3>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                    {comments.length} نظر
                  </Badge>
                </div>
                
                {comments.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageCircle className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500">هنوز نظری ثبت نشده است.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {comments.map((comment, index) => (
                      <div key={comment.id} className="p-6 border border-gray-100 rounded-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {comment.author_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">{comment.author_name}</div>
                            <div className="text-xs text-gray-500">{new Date(comment.date).toLocaleDateString('fa-IR')}</div>
                          </div>
                        </div>
                        <div className="prose max-w-none text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: comment.content.rendered }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="mt-12 border-t border-gray-200 pt-8">
                <h4 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  مقالات مرتبط
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {related.map((rel) => (
                    <Link to={`/article/${rel.id}`} key={rel.id}>
                      <div className="group border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300">
                        <img src={rel.image} alt={rel.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="p-4">
                          <div className="text-sm text-gray-500 mb-2">{rel.date}</div>
                          <h5 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">{rel.title}</h5>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleArticle;