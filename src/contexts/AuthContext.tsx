import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiBase, apiJsonRequest, debugLog, errorLog, ENV } from '../config/api';

export interface Address {
  id: string;
  title: string;
  type: 'home' | 'work' | 'other';
  address: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  nationalId?: string;
  birthDate?: string;
  gender?: 'male' | 'female';
  city?: string;
  hasBasicInsurance?: 'yes' | 'no';
  basicInsurance?: string;
  complementaryInsurance?: string;
  // Address info
  addresses?: Address[];
  defaultAddressId?: string;
  isProfileComplete: boolean;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initiateLogin: (phone: string) => Promise<{ success: boolean; needsOTP: boolean; isNewUser: boolean; expiresIn?: number }>;
  verifyOTP: (phone: string, code: string) => Promise<{ success: boolean; user?: User; isNewUser: boolean }>;
  completeProfile: (userData: Partial<User>) => Promise<{ success: boolean; user?: User; validationErrors?: string[] }>;
  updateAddresses: (addresses: Address[]) => Promise<{ success: boolean }>;
  setDefaultAddress: (addressId: string) => Promise<{ success: boolean }>;
  logout: () => Promise<{ success: boolean }>;
  logoutAllDevices: () => Promise<{ success: boolean }>;
  resendOTP: (phone: string) => Promise<{ success: boolean; expiresIn?: number }>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      debugLog('Checking authentication status...');
      
      const response = await apiJsonRequest(
        `${getApiBase()}/auth.php`,
        { action: 'check_status' },
        'POST'
      );
      
      if (response.success && response.data.authenticated) {
        const userData = response.data.user;
        setUser({
          id: userData.id,
          phone: userData.phone,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          nationalId: userData.nationalId,
          birthDate: userData.birthDate,
          gender: userData.gender,
          city: userData.city,
          hasBasicInsurance: userData.hasBasicInsurance,
          basicInsurance: userData.basicInsurance,
          complementaryInsurance: userData.complementaryInsurance,
          addresses: userData.addresses || [],
          defaultAddressId: userData.defaultAddressId,
          isProfileComplete: userData.isProfileComplete,
          createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date()
        });
        
        debugLog('User authenticated successfully', userData);
      } else {
        // کاربر احراز هویت نشده
        setUser(null);
        debugLog('User not authenticated');
      }
      
    } catch (error) {
      errorLog('Error checking auth status', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const initiateLogin = async (phone: string): Promise<{ success: boolean; needsOTP: boolean; isNewUser: boolean; expiresIn?: number }> => {
    try {
      debugLog('Initiating login for phone:', phone);
      
      const response = await apiJsonRequest(
        `${getApiBase()}/auth.php`,
        { 
          action: 'initiate_login', 
          phone: phone 
        },
        'POST'
      );
      
      if (response.success) {
        debugLog('Login initiated successfully', response.data);
        return {
          success: true,
          needsOTP: response.data.needs_otp,
          isNewUser: response.data.is_new_user,
          expiresIn: response.data.expires_in
        };
      } else {
        errorLog('Login initiation failed', response.error);
        return {
          success: false,
          needsOTP: false,
          isNewUser: false
        };
      }
    } catch (error) {
      errorLog('Login initiation error', error);
      return {
        success: false,
        needsOTP: false,
        isNewUser: false
      };
    }
  };

  const verifyOTP = async (phone: string, code: string): Promise<{ success: boolean; user?: User; isNewUser: boolean }> => {
    try {
      debugLog('Verifying OTP for phone:', phone);
      
      const response = await apiJsonRequest(
        `${getApiBase()}/auth.php`,
        { 
          action: 'verify_otp', 
          phone: phone,
          code: code
        },
        'POST'
      );
      
      if (response.success) {
        const userData = response.data.user;
        const user: User = {
          id: userData.id,
          phone: userData.phone,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          nationalId: userData.nationalId,
          birthDate: userData.birthDate,
          gender: userData.gender,
          city: userData.city,
          hasBasicInsurance: userData.hasBasicInsurance,
          basicInsurance: userData.basicInsurance,
          complementaryInsurance: userData.complementaryInsurance,
          addresses: userData.addresses || [],
          defaultAddressId: userData.defaultAddressId,
          isProfileComplete: userData.isProfileComplete,
          createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date()
        };
        
        setUser(user);
        debugLog('OTP verified successfully', user);
        
        return {
          success: true,
          user,
          isNewUser: response.data.is_new_user
        };
      } else {
        errorLog('OTP verification failed', response.error);
        return { 
          success: false, 
          isNewUser: false 
        };
      }
    } catch (error) {
      errorLog('OTP verification error', error);
      return { 
        success: false, 
        isNewUser: false 
      };
    }
  };

  const completeProfile = async (userData: Partial<User>): Promise<{ success: boolean; user?: User; validationErrors?: string[] }> => {
    try {
      if (!user) {
        return { 
          success: false,
          validationErrors: ['کاربر احراز هویت نشده'] 
        };
      }

      debugLog('Completing profile for user:', user.id);
      
      const response = await apiJsonRequest(
        `${getApiBase()}/auth.php`,
        { 
          action: 'complete_profile',
          profile_data: userData
        },
        'POST'
      );
      
      if (response.success) {
        const updatedUserData = response.data.user;
        const updatedUser: User = {
          id: updatedUserData.id,
          phone: updatedUserData.phone,
          firstName: updatedUserData.firstName,
          lastName: updatedUserData.lastName,
          email: updatedUserData.email,
          nationalId: updatedUserData.nationalId,
          birthDate: updatedUserData.birthDate,
          gender: updatedUserData.gender,
          city: updatedUserData.city,
          hasBasicInsurance: updatedUserData.hasBasicInsurance,
          basicInsurance: updatedUserData.basicInsurance,
          complementaryInsurance: updatedUserData.complementaryInsurance,
          addresses: updatedUserData.addresses || [],
          defaultAddressId: updatedUserData.defaultAddressId,
          isProfileComplete: updatedUserData.isProfileComplete,
          createdAt: updatedUserData.createdAt ? new Date(updatedUserData.createdAt) : new Date()
        };

        setUser(updatedUser);
        debugLog('Profile completed successfully', updatedUser);
        
        return { 
          success: true,
          user: updatedUser
        };
      } else {
        errorLog('Profile completion failed', response.error);
        return { 
          success: false,
          validationErrors: response.details?.validation_errors || [response.error]
        };
      }
    } catch (error) {
      errorLog('Profile completion error', error);
      return { 
        success: false,
        validationErrors: ['خطا در ارسال اطلاعات'] 
      };
    }
  };

  const resendOTP = async (phone: string): Promise<{ success: boolean; expiresIn?: number }> => {
    try {
      debugLog('Resending OTP for phone:', phone);
      
      const response = await apiJsonRequest(
        `${getApiBase()}/auth.php`,
        { 
          action: 'resend_otp',
          phone: phone
        },
        'POST'
      );
      
      if (response.success) {
        debugLog('OTP resent successfully');
        return { 
          success: true,
          expiresIn: response.data.expires_in
        };
      } else {
        errorLog('OTP resend failed', response.error);
        return { success: false };
      }
    } catch (error) {
      errorLog('Resend OTP error', error);
      return { success: false };
    }
  };

  const logout = async (): Promise<{ success: boolean }> => {
    try {
      debugLog('Logging out user');
      
      const response = await apiJsonRequest(
        `${getApiBase()}/auth.php`,
        { action: 'logout' },
        'POST'
      );
      
      setUser(null);
      debugLog('User logged out successfully');
      
      return { success: true };
    } catch (error) {
      errorLog('Logout error', error);
      // حتی در صورت خطا، کاربر را از frontend logout کن
      setUser(null);
      return { success: false };
    }
  };

  const logoutAllDevices = async (): Promise<{ success: boolean }> => {
    try {
      debugLog('Logging out from all devices');
      
      const response = await apiJsonRequest(
        `${getApiBase()}/auth.php`,
        { action: 'logout_all' },
        'POST'
      );
      
      setUser(null);
      debugLog('Logged out from all devices successfully');
      
      return { success: true };
    } catch (error) {
      errorLog('Logout all devices error', error);
      setUser(null);
      return { success: false };
    }
  };

  const refreshUserData = async (): Promise<void> => {
    if (!user) return;
    
    try {
      await checkAuthStatus();
    } catch (error) {
      errorLog('Failed to refresh user data', error);
    }
  };

  const updateAddresses = async (addresses: Address[]): Promise<{ success: boolean }> => {
    try {
      if (!user) return { success: false };
      
      // ارسال آدرس‌ها به سرور - از add_address action استفاده می‌کنیم
      // برای حالا از localStorage استفاده می‌کنیم چون backend API برای update addresses آماده نیست
      const updatedUser = {
        ...user,
        addresses
      };
      
      localStorage.setItem('salamat_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      // TODO: Implement backend API for address management
      console.log('Address update - using localStorage for now');
      
      return { success: true };
      
      /* 
      // برای آینده: وقتی API آدرس آماده شد
      const response = await fetch(`${getApiBase()}/api/users.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_addresses',
          phone: user.phone,
          addresses: addresses
        })
      });

      const result = await response.json();
      
      if (result.success) {
        const updatedUser = {
          ...user,
          addresses: result.data.addresses
        };
        
        localStorage.setItem('salamat_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        return { success: true };
      } else {
        console.error('Server error:', result.error);
        return { success: false };
      }
      */
    } catch (error) {
      console.error('Update addresses error:', error);
      
      // Fallback به localStorage در صورت خطا
      try {
        const updatedUser = {
          ...user,
          addresses
        };
        localStorage.setItem('salamat_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      } catch (fallbackError) {
        return { success: false };
      }
    }
  };

  const setDefaultAddress = async (addressId: string): Promise<{ success: boolean }> => {
    try {
      if (!user) return { success: false };
      
      const updatedUser = {
        ...user,
        defaultAddressId: addressId
      };
      
      // Update in users list
      const existingUsers = JSON.parse(localStorage.getItem('salamat_users') || '[]');
      const userIndex = existingUsers.findIndex((u: User) => u.id === user.id);
      
      if (userIndex >= 0) {
        existingUsers[userIndex] = updatedUser;
      } else {
        existingUsers.push(updatedUser);
      }
      
      localStorage.setItem('salamat_users', JSON.stringify(existingUsers));
      localStorage.setItem('salamat_user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      
      return { success: true };
    } catch (error) {
      console.error('Set default address error:', error);
      return { success: false };
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    initiateLogin,
    verifyOTP,
    completeProfile,
    updateAddresses,
    setDefaultAddress,
    logout,
    logoutAllDevices,
    resendOTP,
    refreshUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
