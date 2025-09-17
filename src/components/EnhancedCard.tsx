
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from 'lucide-react';

interface EnhancedCardProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  className?: string;
  gradient?: string;
  hoverEffect?: boolean;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  title,
  description,
  icon: Icon,
  children,
  className = "",
  gradient = "from-blue-50 to-blue-100",
  hoverEffect = true
}) => {
  return (
    <Card className={`
      ${hoverEffect ? 'hover:shadow-xl hover:scale-105 hover:-translate-y-2' : ''} 
      transition-all duration-300 bg-gradient-to-br ${gradient} border-0 shadow-lg
      ${className}
    `}>
      <CardHeader className="text-center">
        {Icon && (
          <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4">
            <Icon className="w-8 h-8 text-blue-600" />
          </div>
        )}
        <CardTitle className="text-xl font-bold text-gray-800">{title}</CardTitle>
        {description && (
          <p className="text-gray-600 text-sm mt-2">{description}</p>
        )}
      </CardHeader>
      {children && (
        <CardContent>
          {children}
        </CardContent>
      )}
    </Card>
  );
};

export default EnhancedCard;
