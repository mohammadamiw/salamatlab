import React from 'react'
import { Link } from 'react-router-dom'
import { Home, ArrowRight } from 'lucide-react'
import Layout from '../components/layout/Layout'
import { Button } from '../components/ui/Button'

const NotFoundPage: React.FC = () => {
  return (
    <Layout showFooter={false}>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        <div className="max-w-lg w-full text-center">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-8xl font-bold text-primary/20 mb-4">۴۰۴</div>
            <div className="w-24 h-24 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
              <div className="text-4xl">🔍</div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              صفحه پیدا نشد
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              متأسفانه صفحه‌ای که دنبال آن می‌گردید وجود ندارد یا حذف شده است.
            </p>
          </div>

          <div className="space-y-4 sm:space-y-0 sm:space-x-reverse sm:space-x-4 sm:flex sm:justify-center">
            <Link to="/">
              <Button size="lg" className="w-full sm:w-auto">
                <Home className="w-5 h-5 ml-2" />
                بازگشت به خانه
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                تماس با پشتیبانی
                <ArrowRight className="w-5 h-5 mr-2" />
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">یا به این بخش‌ها سر بزنید:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { name: 'خدمات', href: '/services' },
                { name: 'پزشکان', href: '/doctors' },
                { name: 'مقالات', href: '/blog' },
                { name: 'درباره ما', href: '/about' }
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-sm text-primary hover:text-primary/80 transition-colors py-2"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default NotFoundPage
