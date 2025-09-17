import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Calculator, 
  ClipboardList, 
  Activity, 
  Calendar,
  Eye,
  Download,
  Stethoscope,
  Beaker,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface BMIData {
  height: number;
  weight: number;
  bmi: number;
  category: string;
  color: string;
}

interface MedicalRequest {
  id: string;
  type: 'checkup' | 'sampling';
  title: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
  description: string;
}

const MedicalProfile = () => {
  const [bmiData, setBmiData] = useState<BMIData>({
    height: 170,
    weight: 70,
    bmi: 24.2,
    category: 'طبیعی',
    color: 'green'
  });

  const [checkupRequests] = useState<MedicalRequest[]>([
    {
      id: '1',
      type: 'checkup',
      title: 'چکاپ کامل',
      date: '۱۴۰۳/۰۶/۲۰',
      status: 'completed',
      description: 'چکاپ کامل شامل آزمایشات خون، ادرار و معاینات بالینی'
    },
    {
      id: '2',
      type: 'checkup',
      title: 'چکاپ قلب',
      date: '۱۴۰۳/۰۶/۱۵',
      status: 'pending',
      description: 'بررسی سلامت قلب و عروق شامل ECG و اکوکاردیوگرافی'
    }
  ]);

  const [samplingRequests] = useState<MedicalRequest[]>([
    {
      id: '3',
      type: 'sampling',
      title: 'نمونه‌گیری خون',
      date: '۱۴۰۳/۰۶/۲۵',
      status: 'completed',
      description: 'نمونه‌گیری در منزل برای آزمایشات خون'
    },
    {
      id: '4',
      type: 'sampling',
      title: 'نمونه‌گیری ادرار',
      date: '۱۴۰۳/۰۶/۱۰',
      status: 'pending',
      description: 'نمونه‌گیری در منزل برای آزمایش ادرار'
    }
  ]);

  const calculateBMI = () => {
    if (bmiData.height > 0 && bmiData.weight > 0) {
      const heightInMeters = bmiData.height / 100;
      const bmi = bmiData.weight / (heightInMeters * heightInMeters);
      
      let category = '';
      let color = '';
      
      if (bmi < 18.5) {
        category = 'کم‌وزن';
        color = 'blue';
      } else if (bmi >= 18.5 && bmi < 25) {
        category = 'طبیعی';
        color = 'green';
      } else if (bmi >= 25 && bmi < 30) {
        category = 'اضافه‌وزن';
        color = 'yellow';
      } else {
        category = 'چاق';
        color = 'red';
      }

      setBmiData(prev => ({
        ...prev,
        bmi: parseFloat(bmi.toFixed(1)),
        category,
        color
      }));
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'تکمیل شده';
      case 'pending':
        return 'در انتظار';
      case 'cancelled':
        return 'لغو شده';
      default:
        return 'نامشخص';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-600';
      case 'cancelled':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 border-0 shadow-xl rounded-2xl">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">پرونده پزشکی</h2>
        </div>
      </Card>

      <Tabs defaultValue="bmi" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="bmi">شاخص توده بدنی</TabsTrigger>
          <TabsTrigger value="checkups">لیست چکاپ‌ها</TabsTrigger>
          <TabsTrigger value="sampling">نمونه‌گیری در منزل</TabsTrigger>
        </TabsList>

        {/* BMI Calculator */}
        <TabsContent value="bmi" className="mt-6">
          <Card className="p-6 border-0 shadow-xl rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-800">محاسبه شاخص توده بدنی (BMI)</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="height">قد (سانتی‌متر)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={bmiData.height}
                    onChange={(e) => setBmiData(prev => ({...prev, height: parseFloat(e.target.value) || 0}))}
                    className="mt-2"
                    min="100"
                    max="250"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">وزن (کیلوگرم)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={bmiData.weight}
                    onChange={(e) => setBmiData(prev => ({...prev, weight: parseFloat(e.target.value) || 0}))}
                    className="mt-2"
                    min="30"
                    max="300"
                  />
                </div>
                <Button onClick={calculateBMI} className="w-full bg-purple-600 hover:bg-purple-700">
                  <Calculator className="w-4 h-4 ml-2" />
                  محاسبه BMI
                </Button>
              </div>

              {/* Result Section */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-800 mb-2">{bmiData.bmi}</div>
                  <Badge className={`text-sm px-3 py-1 ${
                    bmiData.color === 'green' ? 'bg-green-100 text-green-700' :
                    bmiData.color === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                    bmiData.color === 'red' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {bmiData.category}
                  </Badge>
                </div>

                {/* BMI Scale */}
                <div className="mt-6 space-y-2">
                  <div className="text-sm font-semibold text-gray-700 mb-3">مقیاس BMI:</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 rounded bg-blue-100">
                      <span>کم‌وزن</span>
                      <span>&lt; 18.5</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-green-100">
                      <span>طبیعی</span>
                      <span>18.5 - 24.9</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-yellow-100">
                      <span>اضافه‌وزن</span>
                      <span>25 - 29.9</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded bg-red-100">
                      <span>چاق</span>
                      <span>&gt; 30</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold text-blue-800">توصیه‌های سلامتی</h4>
              </div>
              <p className="text-blue-700 text-sm">
                {bmiData.category === 'طبیعی' ? 
                  'وزن شما در محدوده سالم قرار دارد. برای حفظ این وضعیت، تغذیه متعادل و ورزش منظم را ادامه دهید.' :
                  bmiData.category === 'اضافه‌وزن' ?
                  'وزن شما کمی بالاتر از حد طبیعی است. توصیه می‌شود با پزشک مشورت کرده و برنامه کاهش وزن داشته باشید.' :
                  bmiData.category === 'چاق' ?
                  'وزن شما بالاتر از حد طبیعی است. حتماً با پزشک متخصص مشورت کنید.' :
                  'وزن شما کمتر از حد طبیعی است. برای افزایش وزن سالم با متخصص تغذیه مشورت کنید.'
                }
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* Checkup Requests */}
        <TabsContent value="checkups" className="mt-6">
          <Card className="p-6 border-0 shadow-xl rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Stethoscope className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-800">لیست درخواست چکاپ</h3>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <ClipboardList className="w-4 h-4 ml-2" />
                درخواست چکاپ جدید
              </Button>
            </div>

            <div className="space-y-4">
              {checkupRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-green-50 rounded-lg">
                        <Stethoscope className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">{request.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{request.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{request.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                              {getStatusLabel(request.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {request.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Sampling Requests */}
        <TabsContent value="sampling" className="mt-6">
          <Card className="p-6 border-0 shadow-xl rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Beaker className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-800">لیست درخواست نمونه‌گیری در منزل</h3>
              </div>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Beaker className="w-4 h-4 ml-2" />
                درخواست نمونه‌گیری جدید
              </Button>
            </div>

            <div className="space-y-4">
              {samplingRequests.map((request) => (
                <div key={request.id} className="p-4 border rounded-xl hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-orange-50 rounded-lg">
                        <Beaker className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">{request.title}</h4>
                        <p className="text-gray-600 text-sm mb-2">{request.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{request.date}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(request.status)}`}>
                              {getStatusLabel(request.status)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {request.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalProfile;
