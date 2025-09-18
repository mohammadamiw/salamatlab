import { api } from './api'
import { 
  ApiResponse, 
  PaginatedResponse,
  Doctor, 
  MedicalService,
  CheckupRequest,
  CheckupRequestForm,
  HomeSamplingRequest,
  HomeSamplingRequestForm,
  UserAddress
} from '../types'

export class MedicalService {
  // Doctors
  async getAllDoctors(params?: {
    specialty?: string
    city?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<Doctor>> {
    const queryParams = new URLSearchParams()
    if (params?.specialty) queryParams.append('specialty', params.specialty)
    if (params?.city) queryParams.append('city', params.city)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    return api.get<PaginatedResponse<Doctor>>(`/doctors?${queryParams}`)
  }

  async getDoctorById(id: string): Promise<ApiResponse<Doctor>> {
    return api.get<ApiResponse<Doctor>>(`/doctors/${id}`)
  }

  async getDoctorsBySpecialty(specialty: string): Promise<ApiResponse<Doctor[]>> {
    return api.get<ApiResponse<Doctor[]>>(`/doctors/specialty/${specialty}`)
  }

  async getFeaturedDoctors(): Promise<ApiResponse<Doctor[]>> {
    return api.get<ApiResponse<Doctor[]>>('/doctors/featured')
  }

  // Medical Services
  async getAllServices(params?: {
    category?: string
    homeServiceAvailable?: boolean
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<MedicalService>> {
    const queryParams = new URLSearchParams()
    if (params?.category) queryParams.append('category', params.category)
    if (params?.homeServiceAvailable) queryParams.append('home_service', 'true')
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    return api.get<PaginatedResponse<MedicalService>>(`/services?${queryParams}`)
  }

  async getServiceById(id: string): Promise<ApiResponse<MedicalService>> {
    return api.get<ApiResponse<MedicalService>>(`/services/${id}`)
  }

  async getServicesByCategory(category: string): Promise<ApiResponse<MedicalService[]>> {
    return api.get<ApiResponse<MedicalService[]>>(`/services/category/${category}`)
  }

  // Checkup Requests
  async createCheckupRequest(requestData: CheckupRequestForm): Promise<ApiResponse<CheckupRequest>> {
    return api.post<ApiResponse<CheckupRequest>>('/checkups', requestData)
  }

  async getUserCheckupRequests(params?: {
    status?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<CheckupRequest>> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    return api.get<PaginatedResponse<CheckupRequest>>(`/checkups?${queryParams}`)
  }

  async getCheckupRequestById(id: string): Promise<ApiResponse<CheckupRequest>> {
    return api.get<ApiResponse<CheckupRequest>>(`/checkups/${id}`)
  }

  async updateCheckupRequest(id: string, updateData: Partial<CheckupRequestForm>): Promise<ApiResponse<CheckupRequest>> {
    return api.put<ApiResponse<CheckupRequest>>(`/checkups/${id}`, updateData)
  }

  async cancelCheckupRequest(id: string, reason?: string): Promise<ApiResponse> {
    return api.patch<ApiResponse>(`/checkups/${id}/cancel`, { reason })
  }

  // Home Sampling Requests
  async createHomeSamplingRequest(requestData: HomeSamplingRequestForm): Promise<ApiResponse<HomeSamplingRequest>> {
    return api.post<ApiResponse<HomeSamplingRequest>>('/home-sampling', requestData)
  }

  async getUserHomeSamplingRequests(params?: {
    status?: string
    page?: number
    limit?: number
  }): Promise<PaginatedResponse<HomeSamplingRequest>> {
    const queryParams = new URLSearchParams()
    if (params?.status) queryParams.append('status', params.status)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.limit) queryParams.append('limit', params.limit.toString())
    
    return api.get<PaginatedResponse<HomeSamplingRequest>>(`/home-sampling?${queryParams}`)
  }

  async getHomeSamplingRequestById(id: string): Promise<ApiResponse<HomeSamplingRequest>> {
    return api.get<ApiResponse<HomeSamplingRequest>>(`/home-sampling/${id}`)
  }

  async updateHomeSamplingRequest(id: string, updateData: Partial<HomeSamplingRequestForm>): Promise<ApiResponse<HomeSamplingRequest>> {
    return api.put<ApiResponse<HomeSamplingRequest>>(`/home-sampling/${id}`, updateData)
  }

  async cancelHomeSamplingRequest(id: string, reason?: string): Promise<ApiResponse> {
    return api.patch<ApiResponse>(`/home-sampling/${id}/cancel`, { reason })
  }

  // User Addresses
  async getUserAddresses(): Promise<ApiResponse<UserAddress[]>> {
    return api.get<ApiResponse<UserAddress[]>>('/addresses')
  }

  async createUserAddress(addressData: {
    title: string
    address: string
    postalCode?: string
    city: string
    province: string
    latitude?: number
    longitude?: number
    contactPhone?: string
    contactName?: string
    isDefault?: boolean
  }): Promise<ApiResponse<UserAddress>> {
    return api.post<ApiResponse<UserAddress>>('/addresses', addressData)
  }

  async updateUserAddress(id: string, addressData: Partial<UserAddress>): Promise<ApiResponse<UserAddress>> {
    return api.put<ApiResponse<UserAddress>>(`/addresses/${id}`, addressData)
  }

  async deleteUserAddress(id: string): Promise<ApiResponse> {
    return api.delete<ApiResponse>(`/addresses/${id}`)
  }

  async setDefaultAddress(id: string): Promise<ApiResponse> {
    return api.patch<ApiResponse>(`/addresses/${id}/set-default`)
  }

  // Service Categories
  async getServiceCategories(): Promise<ApiResponse<{ category: string; count: number }[]>> {
    return api.get<ApiResponse<{ category: string; count: number }[]>>('/services/categories')
  }

  // Doctor Specialties
  async getDoctorSpecialties(): Promise<ApiResponse<{ specialty: string; count: number }[]>> {
    return api.get<ApiResponse<{ specialty: string; count: number }[]>>('/doctors/specialties')
  }

  // Price Estimation
  async estimateServicePrice(serviceIds: string[], location?: { latitude: number; longitude: number }): Promise<ApiResponse<{
    servicePrice: number
    transportPrice: number
    totalPrice: number
    breakdown: { serviceId: string; name: string; price: number }[]
  }>> {
    return api.post<ApiResponse<any>>('/services/estimate-price', {
      serviceIds,
      location
    })
  }

  // Available Time Slots
  async getAvailableTimeSlots(doctorId: string, date: string): Promise<ApiResponse<{
    date: string
    slots: { time: string; available: boolean }[]
  }>> {
    return api.get<ApiResponse<any>>(`/doctors/${doctorId}/availability?date=${date}`)
  }
}

// Export singleton instance
export const medicalService = new MedicalService()
export default medicalService
