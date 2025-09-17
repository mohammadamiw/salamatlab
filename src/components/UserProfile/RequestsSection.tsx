import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import RequestService from './RequestService';
import { 
  ClipboardList, 
  Stethoscope, 
  Beaker, 
  Send, 
  Receipt,
  Plus,
  Calendar,
  MapPin,
  Phone,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Download,
  Edit,
  Filter,
  Search
} from 'lucide-react';

interface Request {
  id: string;
  type: 'checkup' | 'sampling' | 'results' | 'invoice';
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  details?: any;
}

const RequestsSection = () => {
  const { user } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState('all');

  // Load user requests from localStorage
  useEffect(() => {
    if (user) {
      const userRequests = JSON.parse(localStorage.getItem(`requests_${user.id}`) || '[]');
      const formattedRequests = userRequests.map((req: any) => ({
        id: req.id,
        type: req.type,
        title: req.type === 'checkup' ? req.package?.title || 'درخواست چکاپ' : req.category?.title || 'نمونه‌گیری در منزل',
        description: req.type === 'checkup' ? req.package?.description || '' : req.category?.description || '',
        date: new Date(req.createdAt).toLocaleDateString('fa-IR'),
        status: req.status,
        priority: req.priority || 'medium',
        details: req.data
      }));
      setRequests(formattedRequests);
    }
  }, [user]);

  // Add some default sample requests for demo
  const sampleRequests: Request[] = [
    {
      id: '1',
      type: 'checkup',
      title: 'درخواست چکاپ کامل',
      description: 'چکاپ سالانه شامل آزمایشات خون، ادرار و معاینات',
      date: '۱۴۰۳/۰۶/۲۵',
      status: 'processing',
      priority: 'high',
      details: {
        appointmentDate: '۱۴۰۳/۰۶/۳۰',
        doctor: 'دکتر احمدی',
        location: 'آزمایشگاه مرکزی'
      }
    },
    {
      id: '2',
      type: 'sampling',
      title: 'نمونه‌گیری در منزل',
      description: 'نمونه‌گیری خون برای آزمایش قند و چربی',
      date: '۱۴۰۳/۰۶/۲۰',
      status: 'completed',
      priority: 'medium',
      details: {
        samplingDate: '۱۴۰۳/۰۶/۲۲',
        technician: 'آقای رضایی',
        address: 'تهران، شهرقدس، خیابان شهید بهشتی'
      }
    },
    {
      id: '3',
      type: 'results',
      title: 'درخواست ارسال جواب آزمایش',
      description: 'ارسال نتایج آزمایش خون از طریق ایمیل',
      date: '۱۴۰۳/۰۶/۱۸',
      status: 'completed',
      priority: 'medium'
    },
    {
      id: '4',
      type: 'invoice',
      title: 'درخواست ارسال قبض آزمایشات',
      description: 'قبض آزمایشات انجام شده در ماه گذشته',
      date: '۱۴۰۳/۰۶/۱۵',
      status: 'pending',
      priority: 'low'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'تکمیل شده';
      case 'processing': return 'در حال پردازش';
      case 'pending': return 'در انتظار';
      case 'cancelled': return 'لغو شده';
      default: return 'نامشخص';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'بالا';
      case 'medium': return 'متوسط';
      case 'low': return 'پایین';
      default: return 'نامشخص';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'checkup':
        return <Stethoscope className="w-5 h-5 text-blue-600" />;
      case 'sampling':
        return <Beaker className="w-5 h-5 text-green-600" />;
      case 'results':
        return <Send className="w-5 h-5 text-purple-600" />;
      case 'invoice':
        return <Receipt className="w-5 h-5 text-orange-600" />;
      default:
        return <FileText className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'checkup': return 'چکاپ';
      case 'sampling': return 'نمونه‌گیری';
      case 'results': return 'ارسال جواب';
      case 'invoice': return 'ارسال قبض';
      default: return 'درخواست';
    }
  };

  const RequestCard = ({ request }: { request: Request }) => (
    <Card className="p-6 border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <div className="p-3 bg-gray-100 rounded-xl">
            {getTypeIcon(request.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-bold text-gray-800">{request.title}</h3>
              <Badge variant="outline" className={getPriorityColor(request.priority)}>
                {getPriorityText(request.priority)}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-3">{request.description}</p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{request.date}</span>
              </div>
              {request.details?.appointmentDate && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>نوبت: {request.details.appointmentDate}</span>
                </div>
              )}
              {request.details?.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{request.details.location}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-3">
          <Badge className={getStatusColor(request.status)}>
            <div className="flex items-center gap-2">
              {getStatusIcon(request.status)}
              {getStatusText(request.status)}
            </div>
          </Badge>
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              <Eye className="w-4 h-4 ml-1" />
              جزئیات
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 ml-1" />
              دانلود
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  // Show request form if needed
  if (showRequestForm) {
    return (
      <RequestService 
        onBack={() => setShowRequestForm(false)}
      />
    );
  }

  const allRequests = [...sampleRequests, ...requests];
  const filteredRequests = filter === 'all' ? allRequests : allRequests.filter(req => req.type === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 border-0 shadow-xl rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClipboardList className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">درخواست‌ها</h2>
            <Badge variant="secondary">{allRequests.length}</Badge>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setShowRequestForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 ml-2" />
              درخواست جدید
            </Button>
          </div>
        </div>
      </Card>

      {/* Filter and Search */}
      <Card className="p-4 border-0 shadow-lg rounded-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">همه درخواست‌ها</option>
              <option value="checkup">چکاپ</option>
              <option value="sampling">نمونه‌گیری</option>
              <option value="results">ارسال جواب</option>
              <option value="invoice">ارسال قبض</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {filteredRequests.length} مورد یافت شد
          </div>
        </div>
      </Card>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">همه درخواست‌ها</TabsTrigger>
          <TabsTrigger value="checkup">چکاپ</TabsTrigger>
          <TabsTrigger value="sampling">نمونه‌گیری</TabsTrigger>
          <TabsTrigger value="results">ارسال جواب</TabsTrigger>
          <TabsTrigger value="invoice">ارسال قبض</TabsTrigger>
        </TabsList>

        {/* All Requests */}
        <TabsContent value="all" className="mt-6">
          <div className="space-y-4">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))
            ) : (
              <Card className="p-12 border-0 shadow-xl rounded-2xl text-center">
                <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">هیچ درخواستی یافت نشد</h3>
                <p className="text-gray-600 mb-6">هنوز درخواستی ثبت نکرده‌اید</p>
                <Button 
                  onClick={() => setShowRequestForm(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 ml-2" />
                  اولین درخواست خود را ثبت کنید
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Checkup Requests */}
        <TabsContent value="checkup" className="mt-6">
          <Card className="p-6 border-0 shadow-xl rounded-2xl mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Stethoscope className="w-6 h-6 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-800">درخواست‌های چکاپ</h3>
              </div>
              <Button 
                onClick={() => setShowRequestForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 ml-2" />
                درخواست چکاپ جدید
              </Button>
            </div>
          </Card>
          <div className="space-y-4">
            {allRequests.filter(req => req.type === 'checkup').map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>

        {/* Sampling Requests */}
        <TabsContent value="sampling" className="mt-6">
          <Card className="p-6 border-0 shadow-xl rounded-2xl mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Beaker className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-bold text-gray-800">درخواست‌های نمونه‌گیری</h3>
              </div>
              <Button 
                onClick={() => setShowRequestForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 ml-2" />
                درخواست نمونه‌گیری جدید
              </Button>
            </div>
          </Card>
          <div className="space-y-4">
            {allRequests.filter(req => req.type === 'sampling').map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>

        {/* Results Requests */}
        <TabsContent value="results" className="mt-6">
          <Card className="p-6 border-0 shadow-xl rounded-2xl mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Send className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-bold text-gray-800">درخواست‌های ارسال جواب</h3>
              </div>
              <Button 
                onClick={() => setShowRequestForm(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 ml-2" />
                درخواست ارسال جواب
              </Button>
            </div>
          </Card>
          <div className="space-y-4">
            {allRequests.filter(req => req.type === 'results').map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>

        {/* Invoice Requests */}
        <TabsContent value="invoice" className="mt-6">
          <Card className="p-6 border-0 shadow-xl rounded-2xl mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6 text-orange-600" />
                <h3 className="text-lg font-bold text-gray-800">درخواست‌های ارسال قبض</h3>
              </div>
              <Button 
                onClick={() => setShowRequestForm(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 ml-2" />
                درخواست ارسال قبض
              </Button>
            </div>
          </Card>
          <div className="space-y-4">
            {allRequests.filter(req => req.type === 'invoice').map((request) => (
              <RequestCard key={request.id} request={request} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestsSection;