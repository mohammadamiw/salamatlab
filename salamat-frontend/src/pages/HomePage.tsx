import React from 'react'
import Layout from '../components/layout/Layout'
import { Link } from 'react-router-dom'
import { 
  Stethoscope, 
  Calendar, 
  Home, 
  Users, 
  Clock,
  Shield,
  Award,
  ArrowLeft
} from 'lucide-react'
import { Button } from '../components/ui/Button'

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: 'رزرو آنلاین',
      description: 'رزرو آسان و سریع چکاپ و آزمایش‌های پزشکی',
      link: '/checkup/request'
    },
    {
      icon: Home,
      title: 'نمونه‌گیری در منزل',
      description: 'خدمات نمونه‌گیری در راحتی منزل شما',
      link: '/home-sampling/request'
    },
    {
      icon: Stethoscope,
      title: 'پزشکان متخصص',
      description: 'دسترسی به بهترین پزشکان متخصص',
      link: '/doctors'
    },
    {
      icon: Users,
      title: 'خدمات جامع',
      description: 'طیف وسیعی از خدمات تشخیص پزشکی',
      link: '/services'
    }
  ]

  const stats = [
    { number: '+۱۰', label: 'سال تجربه' },
    { number: '+۵۰', label: 'پزشک متخصص' },
    { number: '+۱۰۰۰', label: 'بیمار راضی' },
    { number: '۲۴/۷', label: 'پشتیبانی' }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-bl from-primary/10 via-white to-primary/5 py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              آزمایشگاه تشخیص پزشکی
              <span className="block text-primary mt-2">سلامت</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              با بیش از ۱۰ سال تجربه در ارائه خدمات تشخیص پزشکی، 
              ما اینجا هستیم تا سلامت شما و خانواده‌تان را حفظ کنیم
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-reverse sm:space-x-6">
            <Link to="/checkup/request">
              <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                رزرو چکاپ
                <ArrowLeft className="mr-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                درباره ما
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-20 h-20 bg-primary/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              خدمات ما
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              مجموعه کاملی از خدمات تشخیص پزشکی برای حفظ سلامت شما
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Link
                key={index}
                to={feature.link}
                className="group bg-white p-6 rounded-xl border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              اعتماد شما، افتخار ما
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                چرا آزمایشگاه سلامت؟
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-reverse space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      کیفیت برتر
                    </h3>
                    <p className="text-gray-600">
                      استفاده از مدرن‌ترین تجهیزات و روش‌های تشخیص
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-reverse space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      سرعت در خدمات
                    </h3>
                    <p className="text-gray-600">
                      ارائه نتایج در سریع‌ترین زمان ممکن
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-reverse space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      اطمینان و دقت
                    </h3>
                    <p className="text-gray-600">
                      دقت بالا در تمامی آزمایش‌ها با ضمانت کیفیت
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-primary/5 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                ساعات کاری
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">شنبه تا چهارشنبه</span>
                  <span className="font-semibold text-gray-900">۸:۰۰ - ۱۸:۰۰</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">پنج‌شنبه</span>
                  <span className="font-semibold text-gray-900">۸:۰۰ - ۱۴:۰۰</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-700">جمعه</span>
                  <span className="font-semibold text-red-600">تعطیل</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-white rounded-lg">
                <div className="flex items-center space-x-reverse space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">اورژانس ۲۴ ساعته</div>
                    <div className="text-sm text-gray-600">تماس: ۰۹۱۲۳۴۵۶۷۸۹</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            همین حالا چکاپ خود را رزرو کنید
          </h2>
          <p className="text-xl mb-8 opacity-90">
            سلامت خود و خانواده‌تان را به ما بسپارید
          </p>
          <Link to="/checkup/request">
            <Button variant="secondary" size="lg" className="px-8 py-4 text-lg">
              رزرو چکاپ
              <ArrowLeft className="mr-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  )
}

export default HomePage
