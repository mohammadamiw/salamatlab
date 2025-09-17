import React, { createContext, useContext, useState, useEffect } from 'react';
import { getApiBase, API_URLS, apiJsonRequest, debugLog, errorLog, ENV } from '../config/api';

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

  // Check for existing session on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const savedUser = localStorage.getItem('salamat_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        
        // چک کردن آخرین اطلاعات از سرور
        try {
          const response = await fetch(`${getApiBase()}/api/users.php?action=get_user_profile&phone=${encodeURIComponent(userData.phone)}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          const result = await response.json();
          
          if (result.success && result.data) {
            // به‌روزرسانی اطلاعات محلی با آخرین اطلاعات سرور
            const serverUser = {
              id: result.data.id,
              phone: result.data.phone,
              firstName: result.data.first_name,
              lastName: result.data.last_name,
              email: result.data.email,
              nationalId: result.data.national_id,
              birthDate: result.data.birth_date,
              gender: result.data.gender,
              city: result.data.city,
              hasBasicInsurance: result.data.has_basic_insurance,
              basicInsurance: result.data.basic_insurance,
              complementaryInsurance: result.data.complementary_insurance,
              addresses: result.data.addresses || [],
              defaultAddressId: result.data.default_address_id,
              isProfileComplete: result.data.is_profile_complete,
              createdAt: new Date(result.data.created_at)
            };
            
            localStorage.setItem('salamat_user', JSON.stringify(serverUser));
            setUser(serverUser);
          } else {
            // کاربر در سرور وجود ندارد
            setUser(userData);
          }
        } catch (serverError) {
          // اگر سرور در دسترس نباشد، از اطلاعات محلی استفاده کن
          console.warn('Server not available, using local data:', serverError);
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('salamat_user');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string): Promise<{ success: boolean; needsOTP: boolean; isNewUser: boolean }> => {
    try {
      // Note: با PhoneOtp component، این method دیگر مستقیماً استفاده نمی‌شود
      // PhoneOtp component مستقیماً با API واقعی /api/otp.php کار می‌کند
      const existingUsers = JSON.parse(localStorage.getItem('salamat_users') || '[]');
      const existingUser = existingUsers.find((u: User) => u.phone === phone);

      return {
        success: true,
        needsOTP: true,
        isNewUser: !existingUser
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        needsOTP: false,
        isNewUser: false
      };
    }
  };

  const verifyOTP = async (phone: string, code: string): Promise<{ success: boolean; user?: User; isNewUser: boolean }> => {
    try {
      // Verify OTP
      const savedOTP = localStorage.getItem(`otp_${phone}`);
      const otpTimestamp = localStorage.getItem(`otp_${phone}_timestamp`);
      
      if (!savedOTP || !otpTimestamp) {
        return { success: false, isNewUser: false };
      }
      
      // Check if OTP is expired (5 minutes)
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
      
      // OTP verified, check if user exists
      const existingUsers = JSON.parse(localStorage.getItem('salamat_users') || '[]');
      let user = existingUsers.find((u: User) => u.phone === phone);
      
      const isNewUser = !user;
      
      if (!user) {
        // Create new user
        user = {
          id: Date.now().toString(),
          phone,
          isProfileComplete: false,
          createdAt: new Date()
        };
      }
      
      // Clean up OTP
      localStorage.removeItem(`otp_${phone}`);
      localStorage.removeItem(`otp_${phone}_timestamp`);
      
      // Save user session
      localStorage.setItem('salamat_user', JSON.stringify(user));
      setUser(user);
      
      return {
        success: true,
        user,
        isNewUser
      };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, isNewUser: false };
    }
  };

  const completeProfile = async (userData: Partial<User>): Promise<{ success: boolean }> => {
    try {
      if (!user) return { success: false };

      // ارسال اطلاعات به سرور
      const response = await fetch(`${getApiBase()}/api/users.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'complete_profile',
          phone: user.phone,
          first_name: userData.firstName || '',
          last_name: userData.lastName || '',
          email: userData.email || '',
          national_id: userData.nationalId || '',
          birth_date: userData.birthDate || '',
          gender: userData.gender || '',
          city: userData.city || '',
          has_basic_insurance: userData.hasBasicInsurance || 'no',
          basic_insurance: userData.basicInsurance || '',
          complementary_insurance: userData.complementaryInsurance || ''
        })
      });

      const result = await response.json();
      
      if (result.success && result.data) {
        // به‌روزرسانی اطلاعات محلی با پاسخ سرور
        const updatedUser = {
          id: result.data.id,
          phone: result.data.phone,
          firstName: result.data.first_name,
          lastName: result.data.last_name,
          email: result.data.email,
          nationalId: result.data.national_id,
          birthDate: result.data.birth_date,
          gender: result.data.gender,
          city: result.data.city,
          hasBasicInsurance: result.data.has_basic_insurance,
          basicInsurance: result.data.basic_insurance,
          complementaryInsurance: result.data.complementary_insurance,
          addresses: result.data.addresses || [],
          defaultAddressId: result.data.default_address_id,
          isProfileComplete: result.data.is_profile_complete,
          createdAt: new Date(result.data.created_at)
        };

        localStorage.setItem('salamat_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        return { success: true };
      } else {
        console.error('Server error:', result.message || result.error);
        return { success: false };
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      
      // Fallback به localStorage در صورت خطا
      try {
        const updatedUser = {
          ...user,
          ...userData,
          isProfileComplete: true
        };
        localStorage.setItem('salamat_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        return { success: true };
      } catch (fallbackError) {
        return { success: false };
      }
    }
  };

  const resendOTP = async (phone: string): Promise<{ success: boolean }> => {
    try {
      // Generate new OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem(`otp_${phone}`, otpCode);
      localStorage.setItem(`otp_${phone}_timestamp`, Date.now().toString());
      
      // Log OTP for development
      console.log(`🔐 Resent SMS OTP for ${phone}: ${otpCode}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return { success: true };
    } catch (error) {
      console.error('Resend OTP error:', error);
      return { success: false };
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

  const logout = () => {
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
