import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface PageLoadAnimationProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const PageLoadAnimation: React.FC<PageLoadAnimationProps> = ({ 
  children, 
  className,
  delay = 0 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={cn(
        'transition-all duration-1000 ease-out',
        isLoaded 
          ? 'opacity-100 translate-y-0 scale-100' 
          : 'opacity-0 translate-y-8 scale-95',
        className
      )}
    >
      {children}
    </div>
  );
};

export default PageLoadAnimation;
