import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import MultiStepSurvey from '@/components/MultiStepSurvey';

const FeedbackPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-center">فرم نظرسنجی</h1>
          <p className="text-center mt-2 font-semibold">با شرکت در نظرسنجی به قید قرعه برنده جایزه شوید.</p>
        </div>
      </div>
      <div className="container mx-auto px-0 sm:px-4 py-10 md:py-16">
        <MultiStepSurvey asSection={false} />
      </div>
      <Footer />
    </div>
  );
};

export default FeedbackPage;


