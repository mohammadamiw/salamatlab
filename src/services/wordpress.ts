// WordPress API service for fetching articles
import { WORDPRESS_CONFIG } from '@/config/wordpress';

export interface WordPressPost {
  id: number;
  date: string;
  title: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  link: string;
  author: number;
  featured_media: number;
  categories: number[];
  _embedded?: {
    author?: Array<{
      name: string;
    }>;
    'wp:featuredmedia'?: Array<{
      source_url: string;
      alt_text: string;
    }>;
    'wp:term'?: Array<Array<{
      name: string;
      taxonomy: string;
    }>>;
  };
}

export interface WordPressArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  readTime: string;
  category: string;
  categories?: string[];
  tags?: string[];
  image: string;
  date: string;
  link: string;
}

export interface WordPressComment {
  id: number;
  post: number;
  author_name: string;
  date: string;
  content: { rendered: string };
  author_avatar_urls?: Record<string, string>;
}

class WordPressService {
  private baseURL: string;
  private perPage: number = WORDPRESS_CONFIG.DEFAULT_PER_PAGE;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
  }

  // Get the WordPress API endpoint for posts
  private getPostsEndpoint(params: Record<string, string | number> = {}): string {
    const searchParams = new URLSearchParams();
    // Add default parameters
    searchParams.append('_embed', '1');
    searchParams.append('per_page', this.perPage.toString());
    // Add custom parameters
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, value.toString());
    });
    return `${this.baseURL}/wp-json/wp/v2/posts?${searchParams.toString()}`;
  }

  // Fetch posts from WordPress API
  async fetchPosts(params: Record<string, string | number> = {}): Promise<WordPressPost[]> {
    try {
      const response = await fetch(this.getPostsEndpoint(params));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const posts: WordPressPost[] = await response.json();
      return posts;
    } catch (error) {
      console.error('Error fetching WordPress posts:', error);
      throw error;
    }
  }

  // Fetch posts and include pagination metadata from WP headers
  async fetchPostsWithMeta(params: Record<string, string | number> = {}): Promise<{
    posts: WordPressPost[];
    totalPosts: number;
    totalPages: number;
  }> {
    try {
      const response = await fetch(this.getPostsEndpoint(params));
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const totalPostsHeader = parseInt(response.headers.get('X-WP-Total') || '0', 10);
      const totalPagesHeader = parseInt(response.headers.get('X-WP-TotalPages') || '0', 10);
      const posts: WordPressPost[] = await response.json();
      // Fallbacks if headers are missing (e.g., some proxies)
      const perPage = Number(params.per_page) || this.perPage;
      const totalPosts = Number.isFinite(totalPostsHeader) && totalPostsHeader > 0 ? totalPostsHeader : posts.length;
      const totalPages = Number.isFinite(totalPagesHeader) && totalPagesHeader > 0
        ? totalPagesHeader
        : Math.max(1, Math.ceil(totalPosts / perPage));
      return { posts, totalPosts, totalPages };
    } catch (error) {
      console.error('Error fetching WordPress posts with meta:', error);
      return { posts: [], totalPosts: 0, totalPages: 0 };
    }
  }

  // Fetch a single post by ID
  async fetchPost(id: number): Promise<WordPressPost> {
    try {
      const response = await fetch(`${this.baseURL}/wp-json/wp/v2/posts/${id}?_embed=1`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const post: WordPressPost = await response.json();
      return post;
    } catch (error) {
      console.error('Error fetching WordPress post:', error);
      throw error;
    }
  }

  // Convert WordPress post to our article format
  convertToArticle(post: WordPressPost): WordPressArticle {
    const authorName = post._embedded?.author?.[0]?.name || 'نویسنده ناشناس';
    const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 
                         'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=300&fit=crop&crop=center';
    const embeddedTerms = post._embedded?.['wp:term'] || [];
    const embeddedCategories = (embeddedTerms[0] || []).filter(t => t.taxonomy === 'category');
    const embeddedTags = (embeddedTerms[1] || []).filter(t => t.taxonomy === 'post_tag');
    const categories = embeddedCategories.map((t) => t.name);
    const tags = embeddedTags.map((t) => t.name);
    const category = categories[0] || 'عمومی';
    const wordCount = post.content.rendered.replace(/<[^>]*>/g, '').split(' ').length;
    const readTimeMinutes = Math.ceil(wordCount / 200);
    const readTime = `${readTimeMinutes} دقیقه`;
    const postDate = new Date(post.date);
    const formattedDate = postDate.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    return {
      id: post.id,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
      content: post.content.rendered,
      author: authorName,
      readTime,
      category,
      categories,
      tags,
      image: featuredImage,
      date: formattedDate,
      link: post.link
    };
  }

  // Get featured articles (first few articles)
  async getFeaturedArticles(count: number = WORDPRESS_CONFIG.FEATURED_ARTICLES_COUNT): Promise<WordPressArticle[]> {
    try {
      const posts = await this.fetchPosts({ per_page: count });
      return posts.map(post => this.convertToArticle(post));
    } catch (error) {
      console.error('Error fetching featured articles:', error);
      return [];
    }
  }

  // Fetch comments for a post
  async fetchComments(postId: number, perPage: number = 100): Promise<WordPressComment[]> {
    try {
      const url = `${this.baseURL}/wp-json/wp/v2/comments?post=${postId}&per_page=${perPage}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const comments: WordPressComment[] = await response.json();
      return comments;
    } catch (error) {
      console.error('Error fetching WordPress comments:', error);
      return [];
    }
  }

  // Fetch related articles based on shared categories (fallback to recent posts)
  async getRelatedArticles(post: WordPressPost, count: number = 3): Promise<WordPressArticle[]> {
    try {
      const categoryIds = (post.categories || []).slice(0, 3);
      const params: Record<string, string | number> = {
        per_page: count,
        _embed: 1,
        exclude: post.id,
        order: 'desc',
        orderby: 'date',
      };
      if (categoryIds.length > 0) {
        params.categories = categoryIds.join(',');
      }
      const relatedUrl = `${this.baseURL}/wp-json/wp/v2/posts?${new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)])
      ).toString()}`;
      const response = await fetch(relatedUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const posts: WordPressPost[] = await response.json();
      return posts.map((p) => this.convertToArticle(p));
    } catch (error) {
      console.error('Error fetching related articles:', error);
      return [];
    }
  }

  // Get all articles with pagination
  async getAllArticles(page: number = 1, perPage: number = WORDPRESS_CONFIG.DEFAULT_PER_PAGE): Promise<{
    articles: WordPressArticle[];
    totalPages: number;
    totalPosts: number;
  }> {
    try {
      const { posts, totalPages, totalPosts } = await this.fetchPostsWithMeta({
        per_page: perPage,
        page
      });
      const articles = posts.map(post => this.convertToArticle(post));
      return { articles, totalPages, totalPosts };
    } catch (error) {
      console.error('Error fetching all articles:', error);
      return {
        articles: [],
        totalPages: 0,
        totalPosts: 0
      };
    }
  }

  // Search articles
  async searchArticles(searchTerm: string, page: number = 1): Promise<{
    articles: WordPressArticle[];
    totalPages: number;
    totalPosts: number;
  }> {
    try {
      const { posts, totalPages, totalPosts } = await this.fetchPostsWithMeta({
        search: searchTerm,
        per_page: this.perPage,
        page
      });
      const articles = posts.map(post => this.convertToArticle(post));
      return { articles, totalPages, totalPosts };
    } catch (error) {
      console.error('Error searching articles:', error);
      return {
        articles: [],
        totalPages: 0,
        totalPosts: 0
      };
    }
  }
}

// Create and export a default instance using the configuration
export const wordpressService = new WordPressService(WORDPRESS_CONFIG.SITE_URL);

export default WordPressService; 