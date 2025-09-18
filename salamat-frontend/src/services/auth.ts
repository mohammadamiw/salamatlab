import { api } from './api'
import { LoginRequest, VerifyOTPRequest, AuthResponse, User, ApiResponse } from '../types'
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '../lib/utils'

export class AuthService {
  // Send OTP for login/register
  async sendOTP(phoneNumber: string): Promise<ApiResponse> {
    const request: LoginRequest = { phone: phoneNumber }
    return api.post<ApiResponse>('/auth/send-otp', request)
  }

  // Verify OTP and login/register
  async verifyOTP(phone: string, code: string): Promise<AuthResponse> {
    const request: VerifyOTPRequest = { phone, code }
    return api.post<AuthResponse>('/auth/verify-otp', request)
  }

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return api.get<ApiResponse<User>>('/auth/profile')
  }

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    return api.put<ApiResponse<User>>('/auth/profile', userData)
  }

  // Complete user profile (first time setup)
  async completeProfile(profileData: {
    firstName: string
    lastName: string
    nationalId?: string
    birthDate?: string
    gender?: 'male' | 'female'
    city?: string
    province?: string
    hasBasicInsurance: 'yes' | 'no'
    basicInsurance?: string
    complementaryInsurance?: string
  }): Promise<ApiResponse<User>> {
    return api.post<ApiResponse<User>>('/auth/complete-profile', profileData)
  }

  // Logout
  async logout(): Promise<ApiResponse> {
    try {
      const response = await api.post<ApiResponse>('/auth/logout')
      this.clearAuthData()
      return response
    } catch (error) {
      // Clear auth data even if logout request fails
      this.clearAuthData()
      throw error
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = getLocalStorage<string>('auth_token')
    const user = getLocalStorage<User>('user_data')
    return !!(token && user)
  }

  // Check if user profile is complete
  isProfileComplete(): boolean {
    const user = getLocalStorage<User>('user_data')
    return user?.isProfileComplete || false
  }

  // Get current user from storage
  getCurrentUserFromStorage(): User | null {
    return getLocalStorage<User>('user_data')
  }

  // Get auth token from storage
  getAuthToken(): string | null {
    return getLocalStorage<string>('auth_token')
  }

  // Save auth data to storage
  saveAuthData(token: string, user: User): void {
    setLocalStorage('auth_token', token)
    setLocalStorage('user_data', user)
  }

  // Clear auth data from storage
  clearAuthData(): void {
    removeLocalStorage('auth_token')
    removeLocalStorage('user_data')
  }

  // Check if phone number is valid for login
  validatePhoneNumber(phone: string): boolean {
    const cleanPhone = phone.replace(/\D/g, '')
    // Iranian mobile numbers: 09xxxxxxxxx or 9xxxxxxxxx
    return /^(0?9\d{9})$/.test(cleanPhone)
  }

  // Format phone number for API
  formatPhoneNumber(phone: string): string {
    let cleanPhone = phone.replace(/\D/g, '')
    
    // Remove country code if present
    if (cleanPhone.startsWith('98')) {
      cleanPhone = cleanPhone.substring(2)
    }
    
    // Add leading zero if not present
    if (cleanPhone.startsWith('9') && cleanPhone.length === 10) {
      cleanPhone = '0' + cleanPhone
    }
    
    return cleanPhone
  }

  // Refresh user data
  async refreshUserData(): Promise<User | null> {
    try {
      const response = await this.getCurrentUser()
      if (response.success && response.data) {
        setLocalStorage('user_data', response.data)
        return response.data
      }
      return null
    } catch (error) {
      console.error('Error refreshing user data:', error)
      return null
    }
  }
}

// Export singleton instance
export const authService = new AuthService()
export default authService
