import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Edit, Trash2, Eye, Calendar, Search, Filter, Upload, Save, X } from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';

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

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  post_count: number;
}

const BlogAdmin: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    status: 'draft',
    category_id: '',
    featured_image: '',
    meta_title: '',
    meta_description: '',
    tags: '',
    author: 'مدیر سایت'
  });

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [searchTerm, statusFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        action: 'list',
        status: statusFilter,
        page: '1',
        limit: '50'
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/blog.php?${params}`);
      const data = await response.json();

      if (data.posts) {
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('خطا در دریافت مقالات:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/blog.php?action=categories');
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('خطا در دریافت دسته‌بندی‌ها:', error);
    }
  };

  const handleCreatePost = async () => {
    try {
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
      
      const response = await fetch('/api/blog.php?action=create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          category_id: formData.category_id ? parseInt(formData.category_id) : null,
          tags: tags
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsCreateDialogOpen(false);
        resetForm();
        fetchPosts();
        alert('مقاله با موفقیت ایجاد شد');
      } else {
        alert('خطا در ایجاد مقاله: ' + data.error);
      }
    } catch (error) {
      console.error('خطا در ایجاد مقاله:', error);
      alert('خطا در ایجاد مقاله');
    }
  };

  const handleUpdatePost = async () => {
    if (!editingPost) return;

    try {
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
      
      const response = await fetch(`/api/blog.php?action=update&id=${editingPost.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          category_id: formData.category_id ? parseInt(formData.category_id) : null,
          tags: tags
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsEditDialogOpen(false);
        setEditingPost(null);
        resetForm();
        fetchPosts();
        alert('مقاله با موفقیت بروزرسانی شد');
      } else {
        alert('خطا در بروزرسانی مقاله: ' + data.error);
      }
    } catch (error) {
      console.error('خطا در بروزرسانی مقاله:', error);
      alert('خطا در بروزرسانی مقاله');
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('آیا مطمئن هستید که می‌خواهید این مقاله را حذف کنید؟')) {
      return;
    }

    try {
      const response = await fetch(`/api/blog.php?action=delete&id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        fetchPosts();
        alert('مقاله با موفقیت حذف شد');
      } else {
        alert('خطا در حذف مقاله: ' + data.error);
      }
    } catch (error) {
      console.error('خطا در حذف مقاله:', error);
      alert('خطا در حذف مقاله');
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      status: post.status,
      category_id: post.category_slug || '',
      featured_image: post.featured_image || '',
      meta_title: post.meta_title || '',
      meta_description: post.meta_description || '',
      tags: post.tags ? post.tags.join(', ') : '',
      author: post.author
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      status: 'draft',
      category_id: '',
      featured_image: '',
      meta_title: '',
      meta_description: '',
      tags: '',
      author: 'مدیر سایت'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR');
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      draft: { label: 'پیش‌نویس', variant: 'secondary' as const },
      published: { label: 'منتشر شده', variant: 'default' as const },
      archived: { label: 'آرشیو', variant: 'outline' as const }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.draft;
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  return (
    <AdminPageLayout title="مدیریت بلاگ">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">مدیریت بلاگ</h1>
            <p className="text-gray-600">مدیریت مقالات و محتوای بلاگ</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                مقاله جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>ایجاد مقاله جدید</DialogTitle>
                <DialogDescription>
                  اطلاعات مقاله جدید را وارد کنید
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">عنوان مقاله *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="عنوان مقاله را وارد کنید"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">وضعیت</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">پیش‌نویس</SelectItem>
                        <SelectItem value="published">منتشر شده</SelectItem>
                        <SelectItem value="archived">آرشیو</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="excerpt">خلاصه مقاله</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="خلاصه کوتاه از مقاله"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">محتوای مقاله *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="محتوای کامل مقاله را وارد کنید"
                    rows={10}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">دسته‌بندی</Label>
                    <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.slug}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="author">نویسنده</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="نام نویسنده"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="featured_image">تصویر شاخص</Label>
                  <Input
                    id="featured_image"
                    value={formData.featured_image}
                    onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                    placeholder="URL تصویر شاخص"
                  />
                </div>
                
                <div>
                  <Label htmlFor="tags">برچسب‌ها</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="برچسب‌ها را با کاما جدا کنید"
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_title">عنوان SEO</Label>
                  <Input
                    id="meta_title"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                    placeholder="عنوان برای موتورهای جستجو"
                  />
                </div>
                
                <div>
                  <Label htmlFor="meta_description">توضیحات SEO</Label>
                  <Textarea
                    id="meta_description"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                    placeholder="توضیحات برای موتورهای جستجو"
                    rows={2}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  انصراف
                </Button>
                <Button onClick={handleCreatePost} disabled={!formData.title || !formData.content}>
                  <Save className="w-4 h-4 mr-2" />
                  ایجاد مقاله
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="جستجو در مقالات..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه وضعیت‌ها</SelectItem>
              <SelectItem value="draft">پیش‌نویس</SelectItem>
              <SelectItem value="published">منتشر شده</SelectItem>
              <SelectItem value="archived">آرشیو</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                      <CardDescription className="line-clamp-2 mb-3">
                        {post.excerpt}
                      </CardDescription>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {post.views} بازدید
                        </div>
                        {post.category_name && (
                          <Badge variant="outline">{post.category_name}</Badge>
                        )}
                        {getStatusBadge(post.status)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditDialog(post)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      ویرایش
                    </Button>
                    
                    {post.status === 'published' && (
                      <Link to={`/blog/${post.slug}`} target="_blank">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          مشاهده
                        </Button>
                      </Link>
                    )}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      حذف
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {searchTerm || statusFilter !== 'all' ? 'مقاله‌ای یافت نشد' : 'هنوز مقاله‌ای ایجاد نشده است'}
            </div>
            {(searchTerm || statusFilter !== 'all') && (
              <Button onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}>
                پاک کردن فیلترها
              </Button>
            )}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>ویرایش مقاله</DialogTitle>
              <DialogDescription>
                اطلاعات مقاله را ویرایش کنید
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-title">عنوان مقاله *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="عنوان مقاله را وارد کنید"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-status">وضعیت</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">پیش‌نویس</SelectItem>
                      <SelectItem value="published">منتشر شده</SelectItem>
                      <SelectItem value="archived">آرشیو</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-excerpt">خلاصه مقاله</Label>
                <Textarea
                  id="edit-excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="خلاصه کوتاه از مقاله"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="edit-content">محتوای مقاله *</Label>
                <Textarea
                  id="edit-content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="محتوای کامل مقاله را وارد کنید"
                  rows={10}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">دسته‌بندی</Label>
                  <Select value={formData.category_id} onValueChange={(value) => setFormData({ ...formData, category_id: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب دسته‌بندی" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.slug}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="edit-author">نویسنده</Label>
                  <Input
                    id="edit-author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="نام نویسنده"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="edit-featured_image">تصویر شاخص</Label>
                <Input
                  id="edit-featured_image"
                  value={formData.featured_image}
                  onChange={(e) => setFormData({ ...formData, featured_image: e.target.value })}
                  placeholder="URL تصویر شاخص"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-tags">برچسب‌ها</Label>
                <Input
                  id="edit-tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="برچسب‌ها را با کاما جدا کنید"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-meta_title">عنوان SEO</Label>
                <Input
                  id="edit-meta_title"
                  value={formData.meta_title}
                  onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                  placeholder="عنوان برای موتورهای جستجو"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-meta_description">توضیحات SEO</Label>
                <Textarea
                  id="edit-meta_description"
                  value={formData.meta_description}
                  onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                  placeholder="توضیحات برای موتورهای جستجو"
                  rows={2}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                انصراف
              </Button>
              <Button onClick={handleUpdatePost} disabled={!formData.title || !formData.content}>
                <Save className="w-4 h-4 mr-2" />
                بروزرسانی مقاله
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageLayout>
  );
};

export default BlogAdmin;

