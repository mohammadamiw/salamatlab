import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => (
  <div className="text-center mb-10">
    <h2 className="text-2xl md:text-3xl font-black text-brand-purple">{title}</h2>
    {subtitle && <p className="text-gray-600 mt-2">{subtitle}</p>}
  </div>
);

export default SectionHeader;


