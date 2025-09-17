import React from 'react';
import { Button } from '@/components/ui/button';

const StickyCTA: React.FC = () => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40">
      <div className="mx-auto max-w-5xl">
        <div className="m-4 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl p-4 md:p-5 flex items-center justify-between">
          <div className="text-sm md:text-base font-medium">
            نیاز به راهنمایی دارید؟ همین حالا با ما در واتساپ یا تلفن در ارتباط باشید.
          </div>
          <div className="flex gap-2 md:gap-3">
            <Button size="sm" className="bg-white text-blue-700 hover:bg-white/90">
              چت واتساپ
            </Button>
            <Button size="sm" variant="secondary" className="bg-transparent border-2 border-white text-white hover:bg-white/10">
              تماس سریع
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StickyCTA;


