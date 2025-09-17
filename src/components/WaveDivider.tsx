import React from 'react';

interface WaveDividerProps {
  className?: string;
}

const WaveDivider: React.FC<WaveDividerProps> = ({ className = '' }) => {
  return (
    <div className={`w-full overflow-hidden text-background dark:text-background ${className}`} aria-hidden>
      <svg
        viewBox="0 0 1440 120"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-[80px] md:h-[120px]"
        preserveAspectRatio="none"
      >
        <path
          fill="currentColor"
          d="M0,64L40,58.7C80,53,160,43,240,58.7C320,75,400,117,480,122.7C560,128,640,96,720,74.7C800,53,880,43,960,42.7C1040,43,1120,53,1200,74.7C1280,96,1360,128,1400,144L1440,160L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
          className="opacity-100"
        />
      </svg>
    </div>
  );
};

export default WaveDivider;
