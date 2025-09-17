
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  rating: number;
  comment: string;
  service?: string;
  avatar?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  name,
  rating,
  comment,
  service,
  avatar
}) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg">
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 text-blue-200">
        <Quote className="w-8 h-8" />
      </div>
      
      <CardContent className="p-6">
        {/* Rating */}
        <div className="flex justify-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < rating 
                  ? 'text-yellow-400 fill-current' 
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        
        {/* Comment */}
        <p className="text-gray-700 text-center mb-6 leading-relaxed italic">
          "{comment}"
        </p>
        
        {/* User Info */}
        <div className="flex items-center justify-center space-x-3 space-x-reverse">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
            {avatar || name.charAt(0)}
          </div>
          <div className="text-center">
            <h4 className="font-semibold text-gray-800">{name}</h4>
            {service && (
              <p className="text-sm text-blue-600 font-medium">{service}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestimonialCard;
