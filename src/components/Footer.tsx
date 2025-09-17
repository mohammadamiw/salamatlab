import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer = () => {
  return <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <Logo size="md" className="text-white" />
              <span className="text-xl font-bold">آزمایشگاه تشخیص پزشکی سلامت</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              آزمایشگاه سلامت پیشرو در ارائه خدمات تشخیص پزشکی با بالاترین کیفیت و دقت
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">خدمات</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="http://93.114.111.53:8086/Login" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">دریافت جواب آزمایش</a></li>
              <li><a href="https://www.salamatlab.com/sample-at-home" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">نمونه گیری در منزل</a></li>
              <li><Link to="/checkups/request" className="hover:text-white transition-colors">درخواست چکاپ</Link></li>
              <li><Link to="/feedback" className="hover:text-white transition-colors">نظرسنجی</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-6">ارتباط با ما</h3>
            <div className="space-y-3 text-gray-400">
              <p>📞 021-46833010</p>
              <p>📞 021-46833011</p>
              <p>اینستاگرام: @salamatlab</p>
              <p>📍 شهرقدس، میدان مصلی</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © ۱۴۰۴ آزمایشگاه تشخیص پزشکی سلامت. تمامی حقوق محفوظ است.
            </p>
            <div className="flex space-x-6 space-x-reverse">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">حریم خصوصی</Link>
              <Link to="/" className="text-gray-400 hover:text-white transition-colors">شرایط استفاده</Link>
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors">درباره ما</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;