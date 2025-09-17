import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Menu, X, ChevronDown, ExternalLink, User, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';
import { EXTERNAL_URLS } from '@/config/urls';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const { user, isAuthenticated, logout } = useAuth();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu and dropdowns on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as Element).closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      window.location.href = `/#${sectionId}`;
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="container mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 rtl:space-x-reverse">
              <div className="flex items-center">
                <Phone className="w-4 h-4 ml-2" />
                <div className="flex items-center gap-2 text-sm md:text-base">
                  <a
                    href={`tel:${EXTERNAL_URLS.PHONE_1}`}
                    className="hover:text-blue-200 transition-colors"
                  >
                    {EXTERNAL_URLS.PHONE_1}
                  </a>
                  <span className="text-blue-200 hidden md:inline">|</span>
                  <a
                    href={`tel:${EXTERNAL_URLS.PHONE_2}`}
                    className="hover:text-blue-200 transition-colors hidden md:inline"
                  >
                    {EXTERNAL_URLS.PHONE_2}
                  </a>
                </div>
              </div>
              <div className="hidden md:flex items-center">
                <Mail className="w-4 h-4 ml-2" />
                <a
                  href={`mailto:${EXTERNAL_URLS.EMAIL}`}
                  className="hover:text-blue-200 transition-colors"
                >
                  <span className="hidden lg:inline">{EXTERNAL_URLS.EMAIL}</span>
                  <span className="lg:hidden">ایمیل</span>
                </a>
              </div>
              <div className="hidden xl:flex items-center">
                <MapPin className="w-4 h-4 ml-2" />
                <a
                  href={EXTERNAL_URLS.MAP_LOCATION}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-200 transition-colors"
                >
                  {EXTERNAL_URLS.ADDRESS}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm px-2 sm:px-3"
                onClick={() => openExternalLink(EXTERNAL_URLS.ONLINE_TICKETING)}
              >
                <span className="hidden sm:inline">نوبت‌دهی آنلاین</span>
                <span className="sm:hidden">نوبت آنلاین</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-2 md:py-3">
        <div className="flex justify-between items-center">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4 rtl:space-x-reverse">
            <Link
              to="/"
              className={`px-2 py-1.5 lg:px-3 lg:py-2 text-sm lg:text-base rounded-lg font-medium transition-colors ${
                isActivePath('/')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              خانه
            </Link>

            {/* Visitors Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => toggleDropdown('visitors')}
                className={`flex items-center gap-2 px-2 py-1.5 lg:px-3 lg:py-2 text-sm lg:text-base rounded-lg font-medium transition-colors ${
                  isActivePath('/services') || isActivePath('/checkups') || isActivePath('/sample-at-home')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>مراجعین</span>
                <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform ${openDropdown === 'visitors' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'visitors' && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => openExternalLink(EXTERNAL_URLS.LAB_LOGIN)}
                    className="w-full text-right px-4 py-2 text-sm lg:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
                  >
                    <span>دریافت جواب آزمایش</span>
                    <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4" />
                  </button>
                  <Link
                    to="/sample-at-home"
                    className="block px-4 py-2 text-sm lg:text-base text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    نمونه گیری در محل
                  </Link>
                  <Link
                    to="/checkups/request"
                    className="block px-4 py-2 text-sm lg:text-base text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    درخواست چکاپ
                  </Link>
                  <button
                    onClick={() => openExternalLink(EXTERNAL_URLS.ONLINE_TICKETING)}
                    className="w-full text-right px-4 py-2 text-sm lg:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
                  >
                    <span>نوبتدهی آنلاین</span>
                    <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4" />
                  </button>
                  <Link
                    to="/services"
                    className="block px-4 py-2 text-sm lg:text-base text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    خدمات ما
                  </Link>
                  <Link
                    to="/feedback"
                    className="block px-4 py-2 text-sm lg:text-base text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    نظرسنجی
                  </Link>
                </div>
              )}
            </div>

            {/* Doctors Dropdown */}
            <div className="relative dropdown-container">
              <button
                onClick={() => toggleDropdown('doctors')}
                className={`flex items-center gap-2 px-2 py-1.5 lg:px-3 lg:py-2 text-sm lg:text-base rounded-lg font-medium transition-colors ${
                  isActivePath('/doctors')
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>پزشکان</span>
                <ChevronDown className={`w-3 h-3 lg:w-4 lg:h-4 transition-transform ${openDropdown === 'doctors' ? 'rotate-180' : ''}`} />
              </button>

              {openDropdown === 'doctors' && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => openExternalLink(EXTERNAL_URLS.LAB_LOGIN)}
                    className="w-full text-right px-4 py-2 text-sm lg:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-between"
                  >
                    <span>دریافت جواب آزمایش بیماران</span>
                    <ExternalLink className="w-3 h-3 lg:w-4 lg:h-4" />
                  </button>
                  <Link
                    to="/services"
                    className="block px-4 py-2 text-sm lg:text-base text-right text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    خدمات ما
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/about"
              className={`px-2 py-1.5 lg:px-3 lg:py-2 text-sm lg:text-base rounded-lg font-medium transition-colors ${
                isActivePath('/about')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              درباره ما
            </Link>
            <Link
              to="/articles"
              className={`px-2 py-1.5 lg:px-3 lg:py-2 text-sm lg:text-base rounded-lg font-medium transition-colors ${
                isActivePath('/articles')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              مقالات
            </Link>
            <Link
              to="/careers"
              className={`px-2 py-1.5 lg:px-3 lg:py-2 text-sm lg:text-base rounded-lg font-medium transition-colors ${
                isActivePath('/careers')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              همکاری با ما
            </Link>
            <Link
              to="/contact"
              className={`px-2 py-1.5 lg:px-3 lg:py-2 text-sm lg:text-base rounded-lg font-medium transition-colors ${
                isActivePath('/contact')
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              تماس با ما
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 mr-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>
                    {user?.firstName ? `${user.firstName}` : 'پروفایل'}
                  </span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    logout();
                    window.location.href = '/';
                  }}
                  className="text-gray-600 hover:text-red-600"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/auth/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
                >
                  <User className="w-4 h-4" />
                  ورود / ثبت نام
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 rtl:space-x-reverse">
            <Logo size="md" className="text-blue-600 h-10 w-auto md:h-12" />
            <div className="text-right">
              <div className="font-bold text-gray-800 text-lg md:text-xl">
                آزمایشگاه سلامت
              </div>
              <p className="text-sm text-gray-600 hidden sm:block">
                آزمایشگاه تشخیص پزشکی و مولکولی
              </p>
            </div>
          </Link>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <nav className="flex flex-col gap-2 pt-4">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg text-right font-medium"
              >
                خانه
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg text-right font-medium"
              >
                درباره ما
              </Link>

              {/* Mobile Visitors Menu */}
              <div>
                <button
                  onClick={() => toggleDropdown('mobile-visitors')}
                  className="w-full flex items-center justify-between text-gray-700 hover:text-blue-600 px-4 py-3 rounded-lg text-right font-medium"
                >
                  <span>مراجعین</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'mobile-visitors' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'mobile-visitors' && (
                  <div className="mr-4 mt-2 space-y-2">
                    <button
                      onClick={() => {
                        openExternalLink(EXTERNAL_URLS.LAB_LOGIN);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-right px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-between"
                    >
                      <span>دریافت جواب آزمایش</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <Link
                      to="/sample-at-home"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-right text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      نمونه گیری در محل
                    </Link>
                    <Link
                      to="/checkups/request"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-right text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      درخواست چکاپ
                    </Link>
                    <button
                      onClick={() => {
                        openExternalLink(EXTERNAL_URLS.ONLINE_TICKETING);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-right px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-between"
                    >
                      <span>نوبتدهی آنلاین</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <Link
                      to="/services"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-right text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      خدمات ما
                    </Link>
                    <Link
                      to="/feedback"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-right text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      نظرسنجی
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Doctors Menu */}
              <div>
                <button
                  onClick={() => toggleDropdown('mobile-doctors')}
                  className="w-full flex items-center justify-between text-gray-700 hover:text-blue-600 px-4 py-3 rounded-lg text-right font-medium"
                >
                  <span>پزشکان</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${openDropdown === 'mobile-doctors' ? 'rotate-180' : ''}`} />
                </button>
                {openDropdown === 'mobile-doctors' && (
                  <div className="mr-4 mt-2 space-y-2">
                    <button
                      onClick={() => {
                        openExternalLink(EXTERNAL_URLS.LAB_LOGIN);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-right px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg flex items-center justify-between"
                    >
                      <span>دریافت جواب آزمایش بیماران</span>
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    <Link
                      to="/services"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-2 text-right text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      خدمات ما
                    </Link>
                  </div>
                )}
              </div>

              <Link
                to="/articles"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg text-right font-medium"
              >
                مقالات
              </Link>
              <Link
                to="/careers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg text-right font-medium"
              >
                همکاری با ما
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg text-right font-medium"
              >
                تماس با ما
              </Link>

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-4 mt-4">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-3 text-blue-600 bg-blue-50 px-4 py-3 rounded-lg text-right font-medium"
                    >
                      <User className="w-5 h-5" />
                      <span>
                        {user?.firstName ? `پروفایل ${user.firstName}` : 'پروفایل کاربری'}
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                        window.location.href = '/';
                      }}
                      className="w-full flex items-center gap-3 text-red-600 hover:bg-red-50 px-4 py-3 rounded-lg text-right font-medium"
                    >
                      <LogOut className="w-5 h-5" />
                      خروج از حساب
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/auth/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-white bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg text-right font-medium transition-colors"
                  >
                    <User className="w-5 h-5" />
                    ورود / ثبت نام
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
    </>
  );
};

export default Header;
