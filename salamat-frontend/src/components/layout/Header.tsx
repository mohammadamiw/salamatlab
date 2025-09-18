import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, Settings, Phone, ChevronDown } from 'lucide-react'
import { useAuth, useIsAuthenticated } from '../../store/AuthContext'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/DropdownMenu'

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { state, logout } = useAuth()
  const isAuthenticated = useIsAuthenticated()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const navigationItems = [
    { name: 'صفحه اصلی', href: '/' },
    { name: 'خدمات', href: '/services' },
    { name: 'پزشکان', href: '/doctors' },
    { name: 'مقالات', href: '/blog' },
    { name: 'درباره ما', href: '/about' },
    { name: 'تماس با ما', href: '/contact' },
  ]

  const userMenuItems = [
    { name: 'پروفایل', href: '/profile', icon: User },
    { name: 'درخواست‌های من', href: '/my-requests', icon: Settings },
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">س</span>
              </div>
              <span className="mr-2 text-xl font-bold text-gray-900">
                آزمایشگاه سلامت
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-reverse space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-reverse space-x-4">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="w-4 h-4 ml-1" />
              ۰۲۱-۴۶۸۳۳۰۱۰
            </div>

            {isAuthenticated ? (
              <div className="flex items-center space-x-reverse space-x-4">
                <Link
                  to="/checkup/request"
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  رزرو چکاپ
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-reverse space-x-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-sm">
                        {state.user?.firstName || 'کاربر'}
                      </span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>حساب کاربری</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userMenuItems.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link
                          to={item.href}
                          className="flex items-center space-x-reverse space-x-2"
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center space-x-reverse space-x-2 text-red-600"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>خروج</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-reverse space-x-4">
                <Link
                  to="/auth/login"
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ورود
                </Link>
                <Link
                  to="/checkup/request"
                  className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  رزرو چکاپ
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-4 pb-3">
                <div className="flex items-center px-3 mb-3">
                  <Phone className="w-4 h-4 ml-2 text-gray-600" />
                  <span className="text-sm text-gray-600">۰۲۱-۴۶۸۳۳۰۱۰</span>
                </div>

                {isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 text-sm text-gray-500">
                      {state.user?.firstName || 'کاربر'} عزیز، خوش آمدید
                    </div>
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                    <button
                      onClick={handleLogout}
                      className="text-red-600 hover:text-red-700 block px-3 py-2 rounded-md text-base font-medium transition-colors w-full text-right"
                    >
                      خروج
                    </button>
                    <Link
                      to="/checkup/request"
                      className="bg-primary text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/90 transition-colors text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      رزرو چکاپ
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link
                      to="/auth/login"
                      className="text-gray-700 hover:text-primary block px-3 py-2 rounded-md text-base font-medium transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ورود / ثبت نام
                    </Link>
                    <Link
                      to="/checkup/request"
                      className="bg-primary text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-primary/90 transition-colors text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      رزرو چکاپ
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
