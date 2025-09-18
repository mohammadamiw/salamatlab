import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { User, AuthResponse } from '../types'
import { authService } from '../services/auth'

// Auth State Interface
interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  isProfileComplete: boolean
}

// Auth Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_PROFILE_COMPLETE'; payload: boolean }

// Auth Context Interface
interface AuthContextType {
  state: AuthState
  login: (phone: string, code: string) => Promise<AuthResponse>
  logout: () => Promise<void>
  updateUser: (userData: Partial<User>) => Promise<void>
  completeProfile: (profileData: any) => Promise<void>
  refreshUser: () => Promise<void>
  sendOTP: (phone: string) => Promise<any>
}

// Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  isProfileComplete: false,
}

// Auth Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        isProfileComplete: action.payload.user.isProfileComplete,
      }
    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
      }
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        isProfileComplete: action.payload.isProfileComplete,
      }
    case 'SET_PROFILE_COMPLETE':
      return {
        ...state,
        isProfileComplete: action.payload,
      }
    default:
      return state
  }
}

// Create Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth Provider Component
interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getAuthToken()
        const user = authService.getCurrentUserFromStorage()

        if (token && user) {
          // Verify token is still valid by fetching user data
          try {
            const updatedUser = await authService.refreshUserData()
            if (updatedUser) {
              dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { user: updatedUser, token },
              })
            } else {
              // Token is invalid, clear auth data
              authService.clearAuthData()
              dispatch({ type: 'LOGOUT' })
            }
          } catch (error) {
            // Token is invalid, clear auth data
            authService.clearAuthData()
            dispatch({ type: 'LOGOUT' })
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    initializeAuth()
  }, [])

  // Send OTP
  const sendOTP = async (phone: string) => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await authService.sendOTP(phone)
      return response
    } catch (error) {
      throw error
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  // Login with OTP
  const login = async (phone: string, code: string): Promise<AuthResponse> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      const response = await authService.verifyOTP(phone, code)
      
      if (response.success && response.token && response.user) {
        authService.saveAuthData(response.token, response.user)
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: { user: response.user, token: response.token },
        })
      }
      
      return response
    } catch (error) {
      dispatch({ type: 'SET_LOADING', payload: false })
      throw error
    }
  }

  // Logout
  const logout = async (): Promise<void> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      dispatch({ type: 'LOGOUT' })
    }
  }

  // Update user profile
  const updateUser = async (userData: Partial<User>): Promise<void> => {
    if (!state.user) return

    try {
      const response = await authService.updateProfile(userData)
      if (response.success && response.data) {
        authService.saveAuthData(state.token!, response.data)
        dispatch({ type: 'UPDATE_USER', payload: response.data })
      }
    } catch (error) {
      throw error
    }
  }

  // Complete profile
  const completeProfile = async (profileData: any): Promise<void> => {
    try {
      const response = await authService.completeProfile(profileData)
      if (response.success && response.data) {
        authService.saveAuthData(state.token!, response.data)
        dispatch({ type: 'UPDATE_USER', payload: response.data })
      }
    } catch (error) {
      throw error
    }
  }

  // Refresh user data
  const refreshUser = async (): Promise<void> => {
    if (!state.isAuthenticated) return

    try {
      const updatedUser = await authService.refreshUserData()
      if (updatedUser) {
        dispatch({ type: 'UPDATE_USER', payload: updatedUser })
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
      // If refresh fails, might need to re-authenticate
      if (error && typeof error === 'object' && 'error' in error && error.error === 'unauthorized') {
        dispatch({ type: 'LOGOUT' })
      }
    }
  }

  const contextValue: AuthContextType = {
    state,
    login,
    logout,
    updateUser,
    completeProfile,
    refreshUser,
    sendOTP,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook to get current user
export const useCurrentUser = (): User | null => {
  const { state } = useAuth()
  return state.user
}

// Hook to check authentication status
export const useIsAuthenticated = (): boolean => {
  const { state } = useAuth()
  return state.isAuthenticated
}

// Hook to check if profile is complete
export const useIsProfileComplete = (): boolean => {
  const { state } = useAuth()
  return state.isProfileComplete
}

export default AuthContext
