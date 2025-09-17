import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Home, 
  Search, 
  TestTube, 
  Microscope, 
  Beaker, 
  Syringe,
  Stethoscope,
  Heart,
  Brain,
  Dna,
  Eraser,
  Activity
} from 'lucide-react';

const NotFound = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [floatingElements, setFloatingElements] = useState<Array<{id: number, x: number, y: number, delay: number, icon: React.ReactNode}>>([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Create floating laboratory elements
    const elements = [
      { id: 1, icon: <TestTube className="w-8 h-8 text-blue-500" />, delay: 0 },
      { id: 2, icon: <Microscope className="w-8 h-8 text-green-500" />, delay: 0.5 },
      { id: 3, icon: <Beaker className="w-8 h-8 text-purple-500" />, delay: 1 },
      { id: 4, icon: <Eraser className="w-8 h-8 text-red-500" />, delay: 1.5 },
      { id: 5, icon: <Syringe className="w-8 h-8 text-orange-500" />, delay: 2 },
      { id: 6, icon: <Stethoscope className="w-8 h-8 text-pink-500" />, delay: 2.5 },
      { id: 7, icon: <Heart className="w-8 h-8 text-red-400" />, delay: 3 },
      { id: 8, icon: <Brain className="w-8 h-8 text-indigo-500" />, delay: 3.5 },
      { id: 9, icon: <Dna className="w-8 h-8 text-teal-500" />, delay: 4 },
      { id: 10, icon: <Activity className="w-8 h-8 text-yellow-500" />, delay: 4.5 }
    ];

    setFloatingElements(elements);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 overflow-hidden relative">
      <Header />
      
      {/* Floating Laboratory Elements */}
      {floatingElements.map((element) => (
        <div
          key={element.id}
          className="absolute animate-float opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${element.delay}s`,
            animationDuration: `${3 + Math.random() * 2}s`
          }}
        >
          {element.icon}
        </div>
      ))}

      {/* Main Content */}
      <div className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* 404 Number with Animation */}
          <div className={`mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative inline-block">
              <h1 className="text-9xl md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 animate-pulse">
                404
              </h1>
              {/* Glowing effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 blur-3xl opacity-30 animate-pulse"></div>
            </div>
          </div>

          {/* Error Message */}
          <div className={`mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              صفحه مورد نظر یافت نشد!
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              به نظر می‌رسد این صفحه در آزمایشگاه ما گم شده! 
              نگران نباشید، ما آن را پیدا خواهیم کرد.
            </p>
          </div>

          {/* Laboratory Animation */}
          <div className={`mb-12 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            <Card className="p-8 border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl max-w-md mx-auto">
              <div className="relative">
                {/* Test Tube with bubbling liquid */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-16 h-24 bg-gradient-to-b from-blue-400 to-blue-600 rounded-t-full relative overflow-hidden">
                      {/* Bubbles */}
                      <div className="absolute top-2 left-3 w-2 h-2 bg-white/60 rounded-full animate-ping" style={{animationDelay: '0s'}}></div>
                      <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-white/60 rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                      <div className="absolute top-6 left-6 w-1 h-1 bg-white/60 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                      <div className="absolute top-8 right-6 w-2.5 h-2.5 bg-white/60 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
                    </div>
                    <div className="w-20 h-2 bg-gray-300 rounded-full mx-auto mt-2"></div>
                  </div>
                </div>
                
                {/* Microscope */}
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="w-20 h-16 bg-gradient-to-r from-gray-400 to-gray-600 rounded-t-3xl relative">
                      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-300 rounded-full border-4 border-gray-500"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-400 rounded-b-3xl"></div>
                    </div>
                    <div className="w-24 h-2 bg-gray-300 rounded-full mx-auto mt-2"></div>
                  </div>
                </div>

                {/* DNA Helix */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-16 h-20 relative">
                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-green-400 to-blue-500 rounded-full animate-pulse"></div>
                      <div className="absolute right-0 top-0 w-1 h-full bg-gradient-to-b from-blue-400 to-green-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      {/* Connecting lines */}
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-12 h-0.5 bg-gradient-to-r from-green-400 to-blue-500 transform rotate-12"
                          style={{
                            top: `${i * 10 + 5}px`,
                            left: i % 2 === 0 ? '2px' : 'auto',
                            right: i % 2 === 0 ? 'auto' : '2px'
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Link to="/">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Home className="w-5 h-5 ml-2" />
                بازگشت به صفحه اصلی
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              onClick={() => window.history.back()}
            >
              <Search className="w-5 h-5 ml-2" />
              بازگشت به صفحه قبل
            </Button>
          </div>

          {/* Additional Help */}
          <div className={`mt-12 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <Card className="p-6 border-0 shadow-lg bg-white/60 backdrop-blur-sm rounded-2xl max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-4">نیاز به کمک دارید؟</h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>صفحه اصلی: <Link to="/" className="text-blue-600 hover:underline">salamatlab.com</Link></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>خدمات: <Link to="/services" className="text-green-600 hover:underline">خدمات آزمایشگاهی</Link></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>مقالات: <Link to="/articles" className="text-purple-600 hover:underline">مقالات علمی</Link></span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>تماس: <Link to="/contact" className="text-orange-600 hover:underline">تماس با ما</Link></span>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 2px, transparent 2px),
                            radial-gradient(circle at 75% 75%, #8b5cf6 2px, transparent 2px)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
    </div>
  );
};

export default NotFound;
