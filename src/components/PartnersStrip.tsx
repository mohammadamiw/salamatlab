import React from 'react';

const PartnersStrip: React.FC = () => {
  const logos = [
    '/images/about-doctor1.jpg',
    '/images/about-doctor2.jpg',
    '/images/about-doctor3.jpg',
    '/images/about-space.jpg',
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
          {logos.map((src, i) => (
            <img key={i} src={src} className="h-10 w-auto rounded object-cover grayscale" alt="partner" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersStrip;


