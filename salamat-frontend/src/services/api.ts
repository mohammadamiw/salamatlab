import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios'
import { ApiResponse } from '../types'
import { getLocalStorage, removeLocalStorage } from '../lib/utils'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = getLocalStorage<string>('auth_token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response: AxiosResponse) => {
        return response
      },
      (error: AxiosError) => {
        // Handle 401 unauthorized
        if (error.response?.status === 401) {
          removeLocalStorage('auth_token')
          removeLocalStorage('user_data')
          window.location.href = '/auth/login'
        }

        // Handle network errors
        if (!error.response) {
          console.error('خطای شبکه:', error.message)
          return Promise.reject({
            success: false,
            message: 'خطا در برقراری ارتباط با سرور',
            error: 'network_error'
          })
        }

        // Handle server errors
        const apiError: ApiResponse = {
          success: false,
          message: error.response.data?.message || 'خطای سرور',
          error: error.response.data?.error || 'server_error',
          errors: error.response.data?.errors
        }

        return Promise.reject(apiError)
      }
    )
  }

  // Generic request method
  private async request<T>(method: string, url: string, data?: any): Promise<T> {
    try {
      const response = await this.api.request({
        method,
        url,
        data,
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  // GET request
  async get<T>(url: string): Promise<T> {
    return this.request<T>('GET', url)
  }

  // POST request
  async post<T>(url: string, data?: any): Promise<T> {
    return this.request<T>('POST', url, data)
  }

  // PUT request
  async put<T>(url: string, data?: any): Promise<T> {
    return this.request<T>('PUT', url, data)
  }

  // DELETE request
  async delete<T>(url: string): Promise<T> {
    return this.request<T>('DELETE', url)
  }

  // PATCH request
  async patch<T>(url: string, data?: any): Promise<T> {
    return this.request<T>('PATCH', url, data)
  }

  // File upload
  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await this.api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            onProgress(progress)
          }
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

// Create and export API instance
export const api = new ApiService()
export default api
