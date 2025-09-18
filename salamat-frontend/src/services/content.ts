import { api } from './api'
import { 
  ApiResponse, 
  PaginatedResponse,
  BlogPost,
  ContactMessage,
  ContactForm,
  FeedbackSurvey,
  FeedbackForm
} from '../types'

export class ContentService {
  // Blog Posts
  async getAllPosts(params?: {
    category?: string
    tags?: string[]
    status?: 'published' | 'draft'
    featured?: boolean
    search?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<BlogPost>> {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.tags) queryParams.append('tags', params.tags.join(','))
    if (params?.status) queryParams.append('status', params.status)
    if (params?.featured) queryParams.append('featured', 'true')
    if (params?.search) queryParams.append('search', params.search)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    return api.get<PaginatedResponse<BlogPost>>(`/blog?${queryParams}`)
  }

  async getPostById(id: string): Promise<ApiResponse<BlogPost>> {
    return api.get<ApiResponse<BlogPost>>(`/blog/${id}`)
  }

  async getPostBySlug(slug: string): Promise<ApiResponse<BlogPost>> {
    return api.get<ApiResponse<BlogPost>>(`/blog/slug/${slug}`)
  }

  async getFeaturedPosts(limit?: number): Promise<ApiResponse<BlogPost[]>> {
    const queryParams = limit ? `?limit=${limit}` : ''
    return api.get<ApiResponse<BlogPost[]>>(`/blog/featured${queryParams}`)
  }

  async getRelatedPosts(postId: string, limit?: number): Promise<ApiResponse<BlogPost[]>> {
    const queryParams = limit ? `?limit=${limit}` : ''
    return api.get<ApiResponse<BlogPost[]>>(`/blog/${postId}/related${queryParams}`)
  }

  async incrementViewCount(postId: string): Promise<ApiResponse> {
    return api.post<ApiResponse>(`/blog/${postId}/view`)
  }

  async likePost(postId: string): Promise<ApiResponse> {
    return api.post<ApiResponse>(`/blog/${postId}/like`)
  }

  async getPostCategories(): Promise<ApiResponse<{ category: string; count: number }[]>> {
    return api.get<ApiResponse<{ category: string; count: number }[]>>('/blog/categories')
  }

  async getPostTags(): Promise<ApiResponse<{ tag: string; count: number }[]>> {
    return api.get<ApiResponse<{ tag: string; count: number }[]>>('/blog/tags')
  }

  // Contact Messages
  async sendContactMessage(contactData: ContactForm): Promise<ApiResponse<ContactMessage>> {
    return api.post<ApiResponse<ContactMessage>>('/contact', contactData)
  }

  async getUserContactMessages(params?: {
    status?: string
    category?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<ContactMessage>> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.category) queryParams.append('category', params.category)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    return api.get<PaginatedResponse<ContactMessage>>(`/contact/my-messages?${queryParams}`)
  }

  async getContactMessageById(id: string): Promise<ApiResponse<ContactMessage>> {
    return api.get<ApiResponse<ContactMessage>>(`/contact/${id}`)
  }

  // Feedback Surveys
  async submitFeedback(feedbackData: FeedbackForm): Promise<ApiResponse<FeedbackSurvey>> {
    return api.post<ApiResponse<FeedbackSurvey>>('/feedback', feedbackData)
  }

  async getUserFeedback(params?: {
    serviceType?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<FeedbackSurvey>> {
    const queryParams = new URLSearchParams()
    if (params?.serviceType) queryParams.append('service_type', params.serviceType)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    return api.get<PaginatedResponse<FeedbackSurvey>>(`/feedback/my-feedback?${queryParams}`)
  }

  async getPublicFeedback(params?: {
    serviceType?: string
    minRating?: number
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<FeedbackSurvey>> {
    const queryParams = new URLSearchParams()
    if (params?.serviceType) queryParams.append('service_type', params.serviceType)
    if (params?.minRating) queryParams.append('min_rating', params.minRating.toString())
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    return api.get<PaginatedResponse<FeedbackSurvey>>(`/feedback/public?${queryParams}`)
  }

  async getFeedbackStats(): Promise<ApiResponse<{
    totalFeedback: number
    averageRating: number
    ratingDistribution: { rating: number; count: number }[]
    serviceTypeStats: { serviceType: string; averageRating: number; count: number }[]
  }>> {
    return api.get<ApiResponse<any>>('/feedback/stats')
  }

  // Search functionality
  async searchContent(query: string, filters?: {
    type?: 'blog' | 'doctors' | 'services' | 'all'
    category?: string
    page?: number
    limit?: number
  }): Promise<ApiResponse<{
    blog?: BlogPost[]
    doctors?: any[]
    services?: any[]
    total: number
  }>> {
    const queryParams = new URLSearchParams()
    queryParams.append('q', query)
    if (filters?.type) queryParams.append('type', filters.type)
    if (filters?.category) queryParams.append('category', filters.category)
    if (filters?.page) queryParams.append('page', filters.page.toString())
    if (filters?.limit) queryParams.append('limit', filters.limit.toString())
    
    return api.get<ApiResponse<any>>(`/search?${queryParams}`)
  }

  // Newsletter subscription
  async subscribeNewsletter(email: string, name?: string): Promise<ApiResponse> {
    return api.post<ApiResponse>('/newsletter/subscribe', { email, name })
  }

  async unsubscribeNewsletter(email: string): Promise<ApiResponse> {
    return api.post<ApiResponse>('/newsletter/unsubscribe', { email })
  }

  // FAQ
  async getFAQs(category?: string): Promise<ApiResponse<{
    id: string
    question: string
    answer: string
    category: string
    displayOrder: number
  }[]>> {
    const queryParams = category ? `?category=${category}` : ''
    return api.get<ApiResponse<any>>(`/faq${queryParams}`)
  }

  // Site statistics for public display
  async getSiteStats(): Promise<ApiResponse<{
    totalDoctors: number
    totalServices: number
    totalCheckups: number
    totalPatients: number
    averageRating: number
  }>> {
    return api.get<ApiResponse<any>>('/stats/public')
  }
}

// Export singleton instance
export const contentService = new ContentService()
export default contentService
