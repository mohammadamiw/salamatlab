import React from 'react';
import Header from '@/components/Header';

const PneumocystisPneumoniaArticle: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-28">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            Pneumocystis Pneumonia: Understanding the Disease
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              Pneumocystis pneumonia (PCP) is a serious infection that affects the lungs. 
              It's caused by a fungus called Pneumocystis jirovecii and is most commonly 
              seen in people with weakened immune systems.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              What is Pneumocystis Pneumonia?
            </h2>
            
            <p className="text-gray-600 mb-6">
              PCP is a type of pneumonia that can be life-threatening, especially in 
              individuals with HIV/AIDS, cancer patients undergoing chemotherapy, 
              or those taking immunosuppressive medications.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Symptoms
            </h2>
            
            <ul className="list-disc pl-6 mb-6 text-gray-600">
              <li>Shortness of breath</li>
              <li>Dry cough</li>
              <li>Fever</li>
              <li>Fatigue</li>
              <li>Weight loss</li>
              <li>Night sweats</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Treatment
            </h2>
            
            <p className="text-gray-600 mb-6">
              Treatment typically involves antibiotics and, in severe cases, 
              corticosteroids. Early diagnosis and treatment are crucial for 
              successful recovery.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Prevention
            </h2>
            
            <p className="text-gray-600 mb-6">
              For high-risk individuals, preventive medications may be prescribed. 
              Maintaining a strong immune system through proper nutrition, 
              exercise, and medical care is also important.
            </p>
            
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
              <p className="text-blue-800">
                <strong>Important:</strong> If you experience symptoms of PCP, 
                seek medical attention immediately. Early diagnosis and treatment 
                can significantly improve outcomes.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PneumocystisPneumoniaArticle;
