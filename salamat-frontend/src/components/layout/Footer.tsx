import React from 'react'
import { Link } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react'

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'خدمات',
      links: [
        { name: 'چکاپ کامل', href: '/services/checkup' },
        { name: 'آزمایش‌های خون', href: '/services/laboratory' },
        { name: 'نمونه‌گیری در منزل', href: '/home-sampling/request' },
        { name: 'مشاوره پزشکی', href: '/services/consultation' },
      ]
    },
    {
      title: 'دسترسی سریع',
      links: [
        { name: 'رزرو آنلاین', href: '/checkup/request' },
        { name: 'پزشکان', href: '/doctors' },
        { name: 'نتایج آزمایش', href: '/profile' },
        { name: 'پشتیبانی', href: '/contact' },
      ]
    },
    {
      title: 'اطلاعات',
      links: [
        { name: 'درباره ما', href: '/about' },
        { name: 'مقالات پزشکی', href: '/blog' },
        { name: 'سوالات متداول', href: '/faq' },
        { name: 'قوانین و مقررات', href: '/terms' },
      ]
    },
  ]

  const socialLinks = [
    { name: 'اینستاگرام', href: '#', icon: Instagram },
    { name: 'لینکدین', href: '#', icon: Linkedin },
    { name: 'توییتر', href: '#', icon: Twitter },
    { name: 'فیسبوک', href: '#', icon: Facebook },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">س</span>
              </div>
              <span className="mr-3 text-xl font-bold">آزمایشگاه سلامت</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              آزمایشگاه تشخیص پزشکی و مولکولی سلامت با بیش از ۱۰ سال تجربه در ارائه خدمات تشخیص پزشکی با کیفیت و دقت بالا.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <MapPin className="w-5 h-5 ml-3 text-primary flex-shrink-0" />
                <span className="text-sm">شهرقدس، میدان مصلی، خیابان شهید بهشتی</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Phone className="w-5 h-5 ml-3 text-primary flex-shrink-0" />
                <span className="text-sm">۰۲۱-۴۶۸۳۳۰۱۰</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Mail className="w-5 h-5 ml-3 text-primary flex-shrink-0" />
                <span className="text-sm">info@salamatlab.com</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Clock className="w-5 h-5 ml-3 text-primary flex-shrink-0" />
                <span className="text-sm">شنبه تا پنج‌شنبه: ۸:۰۰ تا ۱۸:۰۰</span>
              </div>
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold mb-4 text-white">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-primary transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold mb-2">عضویت در خبرنامه</h3>
              <p className="text-gray-300 text-sm">
                آخرین اخبار و مقالات پزشکی را دریافت کنید
              </p>
            </div>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="flex-1 md:w-80 px-4 py-2 rounded-r-md border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-2 bg-primary text-white rounded-l-md hover:bg-primary/90 transition-colors">
                عضویت
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-300 text-sm mb-4 md:mb-0">
              © {currentYear} آزمایشگاه تشخیص پزشکی سلامت. تمامی حقوق محفوظ است.
            </div>
            <div className="flex items-center space-x-reverse space-x-4">
              <span className="text-gray-300 text-sm ml-4">ما را دنبال کنید:</span>
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-primary transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Contact Button */}
      <Link
        to="/contact"
        className="fixed bottom-6 left-6 bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-110 z-40"
        aria-label="تماس با ما"
      >
        <Phone className="w-6 h-6" />
      </Link>
    </footer>
  )
}

export default Footer
