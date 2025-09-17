import React, { useRef } from 'react';
import { Card } from '@/components/ui/card';

interface TiltServiceCardProps {
  emoji: string;
  title: string;
  desc: string;
}

const TiltServiceCard: React.FC<TiltServiceCardProps> = ({ emoji, title, desc }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = (x / rect.width) * 2 - 1;
    const py = (y / rect.height) * 2 - 1;
    el.style.transform = `rotateX(${py * -6}deg) rotateY(${px * 6}deg)`;
  };
  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  return (
    <Card
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="p-6 rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-transform will-change-transform"
    >
      <div ref={ref} className="transform-gpu transition-transform duration-150">
        <div className="text-3xl mb-3">{emoji}</div>
        <div className="font-bold text-gray-800 mb-1">{title}</div>
        <div className="text-sm text-gray-600">{desc}</div>
      </div>
    </Card>
  );
};

export default TiltServiceCard;


