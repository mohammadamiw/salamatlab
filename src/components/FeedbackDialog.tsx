import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import FeedbackForm from '@/components/FeedbackForm';

const FeedbackDialog: React.FC = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-feedback-dialog', handler as EventListener);
    return () => window.removeEventListener('open-feedback-dialog', handler as EventListener);
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[95vw] sm:max-w-[700px] max-h-[85vh] overflow-y-auto p-0">
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b px-4 py-3 sm:px-6">
          <DialogHeader>
            <DialogTitle className="text-center text-lg sm:text-xl font-bold text-gray-800">فرم نظرسنجی</DialogTitle>
          </DialogHeader>
        </div>
        <div className="px-4 sm:px-6 py-4">
        <FeedbackForm asSection={false} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;


