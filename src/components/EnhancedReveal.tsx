import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // ms
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  duration?: number; // ms
  threshold?: number;
}

const EnhancedReveal: React.FC<EnhancedRevealProps> = ({ 
  children, 
  className, 
  delay = 0, 
  direction = 'up',
  duration = 800,
  threshold = 0.1
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translate-y-8 opacity-0';
      case 'down':
        return '-translate-y-8 opacity-0';
      case 'left':
        return 'translate-x-8 opacity-0';
      case 'right':
        return '-translate-x-8 opacity-0';
      case 'scale':
        return 'scale-95 opacity-0';
      case 'fade':
        return 'opacity-0';
      default:
        return 'translate-y-8 opacity-0';
    }
  };

  const getFinalTransform = () => {
    switch (direction) {
      case 'up':
      case 'down':
      case 'left':
      case 'right':
        return 'translate-x-0 translate-y-0 opacity-100';
      case 'scale':
        return 'scale-100 opacity-100';
      case 'fade':
        return 'opacity-100';
      default:
        return 'translate-x-0 translate-y-0 opacity-100';
    }
  };

  return (
    <div
      ref={ref}
      style={{ 
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`
      }}
      className={cn(
        'will-change-transform transition-all ease-out',
        visible ? getFinalTransform() : getInitialTransform(),
        className
      )}
    >
      {children}
    </div>
  );
};

export default EnhancedReveal;
