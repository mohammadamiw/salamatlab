import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiBase, API_URLS, apiJsonRequest, debugLog, errorLog, ENV } from '../config/api';

export interface Address {
  id: string;
  title: string;
  type: 'home' | 'work' | 'other';
  address: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
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
  addresses?: Address[];
  defaultAddressId?: string;
  isProfileComplete: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string) => Promise<{ success: boolean; needsOTP: boolean; isNewUser: boolean }>;
  verifyOTP: (phone: string, code: string) => Promise<{ success: boolean; user?: User; isNewUser: boolean }>;
  completeProfile: (userData: Partial<User>) => Promise<{ success: boolean }>;
  updateAddresses: (addresses: Address[]) => Promise<{ success: boolean }>;
  setDefaultAddress: (addressId: string) => Promise<{ success: boolean }>;
  logout: () => void;
  resendOTP: (phone: string) => Promise<{ success: boolean }>;
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

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const savedUser = localStorage.getItem('salamat_user');
      
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        debugLog('Checking saved user', { phone: userData.phone });
        
        try {
          // چک کردن آخرین اطلاعات از سرور لیارا
          const response = await apiJsonRequest(
            `${API_URLS.users}?phone=${encodeURIComponent(userData.phone)}`,
            null,
            'GET'
          );
          
          if (response.success && response.exists && response.user) {
            const serverUser = mapServerUserToLocal(response.user);
            localStorage.setItem('salamat_user', JSON.stringify(serverUser));
            setUser(serverUser);
            debugLog('User updated from server', { userId: serverUser.id });
          } else {
            // کاربر در سرور وجود ندارد، از داده محلی استفاده کن
            setUser(userData);
            debugLog('Using local user data', { userId: userData.id });
          }
        } catch (error) {
          errorLog('Failed to sync with server, using local data', error);
          setUser(userData);
        }
      }
    } catch (error) {
      errorLog('Error checking auth status', error);
    } finally {
      setIsLoading(false);
    }
  };

  const mapServerUserToLocal = (serverUser: any): User => {
    return {
      id: serverUser.id?.toString() || Date.now().toString(),
      phone: serverUser.phone,
      firstName: serverUser.first_name,
      lastName: serverUser.last_name,
      email: serverUser.email,
      nationalId: serverUser.national_id,
      birthDate: serverUser.birth_date,
      gender: serverUser.gender,
      city: serverUser.city,
      hasBasicInsurance: serverUser.has_basic_insurance,
      basicInsurance: serverUser.basic_insurance,
      complementaryInsurance: serverUser.complementary_insurance,
      addresses: serverUser.addresses?.map((addr: any) => ({
        id: addr.id?.toString() || Date.now().toString(),
        title: addr.title,
        type: 'home' as const,
        address: addr.address,
        latitude: addr.latitude,
        longitude: addr.longitude,
        phone: addr.phone,
        isDefault: Boolean(addr.isDefault)
      })) || [],
      defaultAddressId: serverUser.default_address_id,
      isProfileComplete: Boolean(serverUser.is_profile_complete),
      createdAt: new Date(serverUser.created_at || Date.now()),
      updatedAt: serverUser.updated_at ? new Date(serverUser.updated_at) : undefined
    };
  };

  const login = async (phone: string): Promise<{ success: boolean; needsOTP: boolean; isNewUser: boolean }> => {
    try {
      debugLog('Starting login process', { phone });
      
      // ارسال درخواست OTP به سرور لیارا
      const response = await apiJsonRequest(API_URLS.sendOtp, {
        action: 'sendOtp',
        phone: phone
      });
      
      if (response.success) {
        debugLog('OTP sent successfully', { phone });
        
        // بررسی وجود کاربر
        const userCheckResponse = await apiJsonRequest(
          `${API_URLS.users}?phone=${encodeURIComponent(phone)}`,
          null,
          'GET'
        );
        
        const userExists = userCheckResponse.exists;
        debugLog('User existence check', { phone, exists: userExists });
        
        return {
          success: true,
          needsOTP: true,
          isNewUser: !userExists
        };
      } else {
        errorLog('OTP sending failed', response);
        return {
          success: false,
          needsOTP: false,
          isNewUser: false
        };
      }
      
    } catch (error) {
      errorLog('Login error', error);
      
      // Fallback to localStorage in development
      if (ENV.DEV) {
        debugLog('Using localStorage fallback for development');
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        localStorage.setItem(`otp_${phone}`, otpCode);
        localStorage.setItem(`otp_${phone}_timestamp`, Date.now().toString());
        console.log(`Development OTP for ${phone}: ${otpCode}`);
        
        const existingUsers = JSON.parse(localStorage.getItem('salamat_users') || '[]');
        const userExists = existingUsers.some((u: User) => u.phone === phone);
        
        return {
          success: true,
          needsOTP: true,
          isNewUser: !userExists
        };
      }
      
      return {
        success: false,
        needsOTP: false,
        isNewUser: false
      };
    }
  };

  const verifyOTP = async (phone: string, code: string): Promise<{ success: boolean; user?: User; isNewUser: boolean }> => {
    try {
      debugLog('Verifying OTP', { phone, code: code.slice(0, 2) + '****' });
      
      // تایید OTP با سرور لیارا
      const response = await apiJsonRequest(API_URLS.verifyOtp, {
        action: 'verifyOtp',
        phone: phone,
        code: code
      });
      
      if (response.success) {
        const serverUser = mapServerUserToLocal(response.user);
        
        // ذخیره در localStorage و state
        localStorage.setItem('salamat_user', JSON.stringify(serverUser));
        setUser(serverUser);
        
        debugLog('OTP verified successfully', { 
          userId: serverUser.id, 
          isNewUser: response.isNewUser 
        });
        
        return {
          success: true,
          user: serverUser,
          isNewUser: Boolean(response.isNewUser)
        };
      } else {
        errorLog('OTP verification failed', response);
        return {
          success: false,
          isNewUser: false
        };
      }
      
    } catch (error) {
      errorLog('OTP verification error', error);
      
      // Fallback to localStorage in development
      if (ENV.DEV) {
        debugLog('Using localStorage fallback for OTP verification');
        
        const savedOTP = localStorage.getItem(`otp_${phone}`);
        const otpTimestamp = localStorage.getItem(`otp_${phone}_timestamp`);
        
        if (!savedOTP || !otpTimestamp) {
          return { success: false, isNewUser: false };
        }
        
        const currentTime = Date.now();
        const otpTime = parseInt(otpTimestamp);
        if (currentTime - otpTime > 5 * 60 * 1000) {
          localStorage.removeItem(`otp_${phone}`);
          localStorage.removeItem(`otp_${phone}_timestamp`);
          return { success: false, isNewUser: false };
        }
        
        if (savedOTP !== code) {
          return { success: false, isNewUser: false };
        }
        
        const existingUsers = JSON.parse(localStorage.getItem('salamat_users') || '[]');
        let localUser = existingUsers.find((u: User) => u.phone === phone);
        
        const isNewUser = !localUser;
        
        if (!localUser) {
          localUser = {
            id: Date.now().toString(),
            phone,
            isProfileComplete: false,
            createdAt: new Date()
          };
        }
        
        localStorage.removeItem(`otp_${phone}`);
        localStorage.removeItem(`otp_${phone}_timestamp`);
        localStorage.setItem('salamat_user', JSON.stringify(localUser));
        setUser(localUser);
        
        return {
          success: true,
          user: localUser,
          isNewUser
        };
      }
      
      return {
        success: false,
        isNewUser: false
      };
    }
  };

  const completeProfile = async (userData: Partial<User>): Promise<{ success: boolean }> => {
    if (!user) {
      return { success: false };
    }

    try {
      debugLog('Completing user profile', { userId: user.id });
      
      // به‌روزرسانی پروفایل در سرور لیارا
      await apiJsonRequest(API_URLS.users, {
        action: 'update',
        userId: user.id,
        ...userData,
        isProfileComplete: true
      });
      
      const updatedUser = { ...user, ...userData, isProfileComplete: true };
      
      // به‌روزرسانی localStorage و state
      localStorage.setItem('salamat_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      debugLog('Profile completed successfully', { userId: user.id });
      return { success: true };
      
    } catch (error) {
      errorLog('Profile completion error', error);
      
      // Fallback to localStorage
      if (ENV.DEV) {
        const updatedUser = { ...user, ...userData, isProfileComplete: true };
        localStorage.setItem('salamat_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        const existingUsers = JSON.parse(localStorage.getItem('salamat_users') || '[]');
        const userIndex = existingUsers.findIndex((u: User) => u.id === user.id);
        if (userIndex >= 0) {
          existingUsers[userIndex] = updatedUser;
        } else {
          existingUsers.push(updatedUser);
        }
        localStorage.setItem('salamat_users', JSON.stringify(existingUsers));
        
        return { success: true };
      }
      
      return { success: false };
    }
  };

  const updateAddresses = async (addresses: Address[]): Promise<{ success: boolean }> => {
    if (!user) {
      return { success: false };
    }

    try {
      debugLog('Updating user addresses', { userId: user.id, count: addresses.length });
      
      // به‌روزرسانی آدرس‌ها در سرور لیارا
      await apiJsonRequest(API_URLS.users, {
        action: 'updateAddresses',
        userId: user.id,
        addresses: addresses
      });
      
      const updatedUser = { ...user, addresses };
      
      // به‌روزرسانی localStorage و state
      localStorage.setItem('salamat_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      debugLog('Addresses updated successfully', { userId: user.id });
      return { success: true };
      
    } catch (error) {
      errorLog('Address update error', error);
      
      // Fallback to localStorage
      const updatedUser = { ...user, addresses };
      localStorage.setItem('salamat_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      return { success: true };
    }
  };

  const setDefaultAddress = async (addressId: string): Promise<{ success: boolean }> => {
    if (!user || !user.addresses) {
      return { success: false };
    }

    try {
      const updatedAddresses = user.addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === addressId
      }));
      
      return await updateAddresses(updatedAddresses);
      
    } catch (error) {
      errorLog('Set default address error', error);
      return { success: false };
    }
  };

  const resendOTP = async (phone: string): Promise<{ success: boolean }> => {
    return login(phone).then(result => ({ success: result.success }));
  };

  const logout = () => {
    debugLog('User logging out', { userId: user?.id });
    localStorage.removeItem('salamat_user');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    verifyOTP,
    completeProfile,
    updateAddresses,
    setDefaultAddress,
    logout,
    resendOTP
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
