
import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

const FloatingActionButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
      aria-hidden={!isVisible}
    >
      <div className="relative">
        <span className={`${isVisible ? 'animate-ping' : ''} absolute inset-0 rounded-full bg-blue-600/20" />`}></span>
        <Button
          size="lg"
          className="group relative bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 shadow-xl transition-all duration-300 hover:scale-110 focus:scale-105 focus:ring-4 focus:ring-blue-300/40"
          onClick={scrollToTop}
          title="بازگشت به بالا"
          aria-label="بازگشت به بالا"
        >
          <ChevronUp className="w-6 h-6 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </Button>
      </div>
    </div>
  );
};

export default FloatingActionButton;
