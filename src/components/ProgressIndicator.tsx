
import React from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  steps
}) => {
  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center relative">
                {/* Step Circle */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-blue-500 text-white ring-4 ring-blue-200' 
                      : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {isCompleted ? '✓' : stepNumber}
                </div>
                
                {/* Step Label */}
                <span className={`
                  mt-2 text-xs text-center max-w-20
                  ${isCurrent ? 'text-blue-600 font-semibold' : 'text-gray-500'}
                `}>
                  {step}
                </span>
                
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className={`
                    absolute top-5 right-10 w-full h-0.5 transition-all duration-300
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `} 
                  style={{ width: 'calc(100vw / ' + totalSteps + ' - 2.5rem)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Progress Percentage */}
      <div className="mt-4">
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          مرحله {currentStep} از {totalSteps}
        </p>
      </div>
    </div>
  );
};

export default ProgressIndicator;
