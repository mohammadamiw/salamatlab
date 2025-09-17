import React from 'react';
import EnhancedReveal from './EnhancedReveal';

interface StaggeredRevealProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number; // ms between each child
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  duration?: number;
}

const StaggeredReveal: React.FC<StaggeredRevealProps> = ({ 
  children, 
  className,
  staggerDelay = 150,
  direction = 'up',
  duration = 800
}) => {
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childrenArray.map((child, index) => (
        <EnhancedReveal
          key={index}
          delay={index * staggerDelay}
          direction={direction}
          duration={duration}
        >
          {child}
        </EnhancedReveal>
      ))}
    </div>
  );
};

export default StaggeredReveal;
