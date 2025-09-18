import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Phone, Lock, ArrowRight, Loader2 } from 'lucide-react'

import Layout from '../../components/layout/Layout'
import { Button } from '../../components/ui/Button'
import { useAuth } from '../../store/AuthContext'
import { validatePhoneNumber, formatPhoneNumber } from '../../lib/utils'

// Validation schema
const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, 'شماره موبایل الزامی است')
    .refine((phone) => validatePhoneNumber(phone), {
      message: 'شماره موبایل معتبر نیست'
    })
})

const otpSchema = z.object({
  code: z
    .string()
    .min(6, 'کد تأیید باید ۶ رقم باشد')
    .max(6, 'کد تأیید باید ۶ رقم باشد')
    .regex(/^\d{6}$/, 'کد تأیید باید فقط شامل عدد باشد')
})

type PhoneFormData = z.infer<typeof phoneSchema>
type OTPFormData = z.infer<typeof otpSchema>

const LoginPage: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const { sendOTP, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const from = location.state?.from?.pathname || '/'

  // Phone form
  const {
    register: registerPhone,
    handleSubmit: handlePhoneSubmit,
    formState: { errors: phoneErrors },
    setError: setPhoneError
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema)
  })

  // OTP form
  const {
    register: registerOTP,
    handleSubmit: handleOTPSubmit,
    formState: { errors: otpErrors },
    setError: setOTPError,
    reset: resetOTP
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema)
  })

  // Start countdown timer
  const startCountdown = () => {
    setCountdown(120) // 2 minutes
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  // Handle phone submission
  const onPhoneSubmit = async (data: PhoneFormData) => {
    setIsLoading(true)
    try {
      const formattedPhone = formatPhoneNumber(data.phone)
      const response = await sendOTP(formattedPhone)
      
      if (response.success) {
        setPhoneNumber(formattedPhone)
        setStep('otp')
        startCountdown()
        toast.success('کد تأیید برای شما ارسال شد')
      } else {
        setPhoneError('phone', { message: response.message })
      }
    } catch (error: any) {
      setPhoneError('phone', { message: error.message || 'خطا در ارسال کد تأیید' })
      toast.error('خطا در ارسال کد تأیید')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle OTP submission
  const onOTPSubmit = async (data: OTPFormData) => {
    setIsLoading(true)
    try {
      const response = await login(phoneNumber, data.code)
      
      if (response.success) {
        toast.success('ورود موفقیت‌آمیز بود')
        navigate(from, { replace: true })
      } else {
        setOTPError('code', { message: response.message })
      }
    } catch (error: any) {
      setOTPError('code', { message: error.message || 'کد تأیید نامعتبر است' })
      toast.error('کد تأیید نامعتبر است')
    } finally {
      setIsLoading(false)
    }
  }

  // Resend OTP
  const handleResendOTP = async () => {
    if (countdown > 0) return
    
    setIsLoading(true)
    try {
      const response = await sendOTP(phoneNumber)
      
      if (response.success) {
        startCountdown()
        resetOTP()
        toast.success('کد تأیید مجدداً ارسال شد')
      } else {
        toast.error('خطا در ارسال مجدد کد تأیید')
      }
    } catch (error) {
      toast.error('خطا در ارسال مجدد کد تأیید')
    } finally {
      setIsLoading(false)
    }
  }

  // Go back to phone step
  const goBackToPhone = () => {
    setStep('phone')
    setCountdown(0)
    resetOTP()
  }

  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">س</span>
              </div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
              {step === 'phone' ? 'ورود به حساب کاربری' : 'تأیید شماره موبایل'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {step === 'phone' 
                ? 'شماره موبایل خود را وارد کنید'
                : `کد تأیید ارسال شده به ${phoneNumber} را وارد کنید`
              }
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-sm rounded-lg border">
            {step === 'phone' ? (
              <form onSubmit={handlePhoneSubmit(onPhoneSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="phone" className="sr-only">
                    شماره موبایل
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      {...registerPhone('phone')}
                      className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center text-lg tracking-widest"
                      placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                      dir="ltr"
                    />
                  </div>
                  {phoneErrors.phone && (
                    <p className="mt-2 text-sm text-red-600">{phoneErrors.phone.message}</p>
                  )}
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        در حال ارسال...
                      </>
                    ) : (
                      'ارسال کد تأیید'
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleOTPSubmit(onOTPSubmit)} className="space-y-6">
                <div>
                  <label htmlFor="code" className="sr-only">
                    کد تأیید
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="code"
                      type="text"
                      {...registerOTP('code')}
                      className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-center text-2xl tracking-widest"
                      placeholder="۱۲۳۴۵۶"
                      maxLength={6}
                      dir="ltr"
                    />
                  </div>
                  {otpErrors.code && (
                    <p className="mt-2 text-sm text-red-600">{otpErrors.code.message}</p>
                  )}
                </div>

                <div>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 text-lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5" />
                        در حال تأیید...
                      </>
                    ) : (
                      'تأیید و ورود'
                    )}
                  </Button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={goBackToPhone}
                    className="flex items-center text-primary hover:text-primary/80 transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 ml-1" />
                    تغییر شماره
                  </button>

                  {countdown > 0 ? (
                    <span className="text-gray-500">
                      ارسال مجدد در {countdown} ثانیه
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={isLoading}
                      className="text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                    >
                      ارسال مجدد کد
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              با ورود به سیستم،{' '}
              <Link to="/terms" className="font-medium text-primary hover:text-primary/80">
                قوانین و مقررات
              </Link>{' '}
              را می‌پذیرید
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default LoginPage
