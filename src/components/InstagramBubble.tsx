import React, { useMemo, useState } from 'react';
import { Instagram } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface InstagramBubbleProps {
  handle?: string;
  profileUrl?: string;
}

const InstagramBubble: React.FC<InstagramBubbleProps> = ({
  handle = 'salamatlab',
  profileUrl = 'https://www.instagram.com/salamatlab',
}) => {
  const [open, setOpen] = useState(false);

  const qrSrc = useMemo(() => {
    const encoded = encodeURIComponent(profileUrl);
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encoded}`;
  }, [profileUrl]);

  return (
    <>
      {/* Floating Story Bubble */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Instagram"
        title="اینستاگرام سلامت"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] opacity-30"></span>
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full shadow-xl transition-all duration-300 group-hover:scale-110 group-active:scale-95"
             style={{ background: 'conic-gradient(from 180deg at 50% 50%, #f58529, #dd2a7b, #8134af, #515BD4, #f58529)' }}>
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-white/95 backdrop-blur">
            <Instagram className="w-7 h-7 text-[#dd2a7b]" />
          </div>
        </div>
      </button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-right">صفحه اینستاگرام سلامت</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-right">
              <div className="text-base font-semibold">{`@${handle}`}</div>
              <div className="text-sm text-muted-foreground">برای مشاهده پیج رسمی اینستاگرام اسکن کنید یا دکمه زیر را بزنید.</div>
            </div>
            <Button
              onClick={() => window.open(profileUrl, '_blank')}
              className="bg-gradient-to-r from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white hover:opacity-90"
            >
              دنبال کردن در اینستاگرام
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4 mt-4">
            <div className="text-sm text-muted-foreground text-right">
              <div className="font-semibold mb-1">با موبایل اسکن کنید</div>
              <div>{profileUrl}</div>
            </div>
            <div className="rounded-xl border p-2 bg-white">
              <img src={qrSrc} alt="Instagram QR" width={130} height={130} className="rounded-lg" />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstagramBubble;


