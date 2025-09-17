import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Clock, Eye, ArrowRight, Share2, BookOpen } from 'lucide-react';
import MetaTags from '@/components/MetaTags';
import Breadcrumbs from '@/components/Breadcrumbs';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  status: string;
  featured_image?: string;
  views: number;
  author: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
  category_name?: string;
  category_slug?: string;
  meta_title?: string;
  meta_description?: string;
  tags?: string[];
}

interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image?: string;
  created_at: string;
  category_name?: string;
}

const SingleBlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/blog.php?action=get&slug=${slug}`);
      const data = await response.json();

      if (data.post) {
        setPost(data.post);
        fetchRelatedPosts(data.post.category_slug, data.post.id);
      } else {
        setError('مقاله یافت نشد');
      }
    } catch (error) {
      console.error('خطا در دریافت مقاله:', error);
      setError('خطا در بارگذاری مقاله');
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async (categorySlug?: string, excludeId?: number) => {
    try {
      const params = new URLSearchParams({
        action: 'list',
        status: 'published',
        limit: '3'
      });

      if (categorySlug) {
        params.append('category', categorySlug);
      }

      const response = await fetch(`/api/blog.php?${params}`);
      const data = await response.json();

      if (data.posts) {
        const filtered = data.posts.filter((p: RelatedPost) => p.id !== excludeId);
        setRelatedPosts(filtered.slice(0, 3));
      }
    } catch (error) {
      console.error('خطا در دریافت مقالات مرتبط:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return `${minutes} دقیقه`;
  };

  const sharePost = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('لینک مقاله کپی شد');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-8" />
            <Skeleton className="h-64 w-full mb-6" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">مقاله یافت نشد</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link to="/blog">
            <Button>بازگشت به بلاگ</Button>
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'خانه', path: '/' },
    { label: 'بلاگ', path: '/blog' },
    { label: post.title, path: `/blog/${post.slug}` }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaTags
        title={post.meta_title || post.title}
        description={post.meta_description || post.excerpt}
        keywords={post.tags?.join(', ') || ''}
        canonical={`/blog/${post.slug}`}
        ogImage={post.featured_image}
      />
      
      <div className="container mx-auto px-4 py-8">
        <Breadcrumbs items={breadcrumbItems} />
        
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {post.category_name && (
                <Badge variant="secondary">{post.category_name}</Badge>
              )}
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(post.published_at || post.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatReadingTime(post.content)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.views} بازدید
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs">نویسنده: {post.author}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={sharePost}
                  className="flex items-center gap-1"
                >
                  <Share2 className="w-4 h-4" />
                  اشتراک‌گذاری
                </Button>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div 
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="text-gray-800 leading-relaxed"
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">برچسب‌ها:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">مقالات مرتبط</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow duration-300">
                    {relatedPost.featured_image && (
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={relatedPost.featured_image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        {relatedPost.category_name && (
                          <Badge variant="secondary" className="text-xs">
                            {relatedPost.category_name}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2">
                        <Link 
                          to={`/blog/${relatedPost.slug}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {relatedPost.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {relatedPost.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(relatedPost.created_at)}
                        </div>
                        <Link 
                          to={`/blog/${relatedPost.slug}`}
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          ادامه مطلب
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* Back to Blog */}
          <div className="mt-12 text-center">
            <Link to="/blog">
              <Button variant="outline" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                بازگشت به بلاگ
              </Button>
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
};

export default SingleBlogPost;

