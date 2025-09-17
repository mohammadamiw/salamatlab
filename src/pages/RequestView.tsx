import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getApiBase } from '@/lib/apiBase';
import { convertToShamsi } from '../utils/date-utils';
import { 
  Calendar, 
  Phone, 
  User, 
  MapPin, 
  CreditCard, 
  FileText, 
  ExternalLink,
  Copy,
  Share,
  AlertCircle,
  Download
} from 'lucide-react';

const RequestView: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/request-view.php?id=${encodeURIComponent(id || '')}`);
        if (!res.ok) throw new Error('not found');
        const json = await res.json();
        if (mounted) setData(json);
      } catch (e: any) {
        if (mounted) setError('درخواست پیدا نشد یا حذف شده است');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    run();
    return () => { mounted = false; };
  }, [id]);

  const formatBirthDate = (birthDate: string) => {
    if (!birthDate) return '-';
    try {
      return convertToShamsi(birthDate);
    } catch {
      return birthDate; // fallback to original if conversion fails
    }
  };

  const getRequestTypeInfo = (data: any) => {
    if (data.type === 'feedback') {
      return { title: 'نظرسنجی', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    } else if (data.type === 'checkup') {
      return { title: 'درخواست چکاپ', color: 'bg-green-50 text-green-700 border-green-200' };
    } else if (data.type === 'sampling') {
      return { title: 'نمونه‌گیری در محل', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    } else if (data.type === 'career') {
      return { title: 'رزومه کاری', color: 'bg-orange-50 text-orange-700 border-orange-200' };
    } else if (data.type === 'contact') {
      return { title: 'پیام تماس', color: 'bg-red-50 text-red-700 border-red-200' };
    }
    return { title: 'درخواست', color: 'bg-gray-50 text-gray-700 border-gray-200' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50">
      <Header />
      <main className="container mx-auto px-4 pt-28 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {loading ? (
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : error ? (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          ) : data ? (
            <>
              {/* Header Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold text-slate-800 mb-2">
                        {data.title || getRequestTypeInfo(data).title}
                      </CardTitle>
                      <div className="flex items-center gap-3">
                        <Badge className={`${getRequestTypeInfo(data).color} border`}>
                          {getRequestTypeInfo(data).title}
                        </Badge>
                        <div className="text-sm text-slate-500 flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {data.createdAt}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-500">
                      شناسه: <span className="font-mono">{data.id}</span>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    اطلاعات شخصی
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-slate-600">نام و نام خانوادگی:</span>
                        <span className="font-medium">{data.fullName || '-'}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-slate-600">شماره تماس:</span>
                        <span className="font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {data.phone || '-'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-slate-600">کد ملی:</span>
                        <span className="font-mono">{data.nationalCode || '-'}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-slate-600">تاریخ تولد:</span>
                        <span className="font-medium">{formatBirthDate(data.birthDate)}</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-slate-600">جنسیت:</span>
                        <span className="font-medium">
                          {data.gender === 'male' ? 'مرد' : data.gender === 'female' ? 'زن' : '-'}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-slate-600">شهر:</span>
                        <span className="font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {data.city || '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Information */}
              {(data.hasBasicInsurance || data.complementaryInsurance) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      اطلاعات بیمه
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between border-b border-gray-100 pb-2">
                        <span className="text-slate-600">بیمه پایه:</span>
                        <Badge variant={data.hasBasicInsurance === 'yes' ? 'default' : 'secondary'}>
                          {data.hasBasicInsurance === 'yes' ? 'دارد' : 'ندارد'}
                        </Badge>
                      </div>
                      {data.hasBasicInsurance === 'yes' && data.basicInsurance && (
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-slate-600">نوع بیمه پایه:</span>
                          <span className="font-medium">{data.basicInsurance}</span>
                        </div>
                      )}
                      {data.complementaryInsurance && (
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-slate-600">بیمه تکمیلی:</span>
                          <span className="font-medium">{data.complementaryInsurance}</span>
                        </div>
                      )}
                      {data.price && (
                        <div className="flex justify-between border-b border-gray-100 pb-2">
                          <span className="text-slate-600">قیمت:</span>
                          <span className="font-medium text-green-600">{data.price}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notes */}
              {data.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      توضیحات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                        {data.notes}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Prescription Files */}
              {Array.isArray(data.prescriptionFiles) && data.prescriptionFiles.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="w-5 h-5" />
                      فایل‌های نسخه
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.prescriptionFiles.map((fileUrl: string, idx: number) => (
                        <a 
                          key={idx} 
                          href={fileUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="block rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors group"
                        >
                          {fileUrl.match(/\.(pdf)(\?|$)/i) ? (
                            <div className="p-4 text-center bg-red-50 group-hover:bg-red-100 transition-colors">
                              <Download className="w-8 h-8 text-red-600 mx-auto mb-2" />
                              <p className="text-sm text-red-700 font-medium">فایل PDF</p>
                              <p className="text-xs text-red-600">کلیک برای مشاهده</p>
                            </div>
                          ) : (
                            <img 
                              src={fileUrl} 
                              alt={`prescription-${idx+1}`} 
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform" 
                            />
                          )}
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Location Map */}
              {data.locationLat && data.locationLng && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      موقعیت مکانی
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="rounded-lg overflow-hidden border border-gray-200">
                        <iframe
                          title="map"
                          className="w-full h-80"
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${data.locationLng - 0.01}%2C${data.locationLat - 0.01}%2C${data.locationLng + 0.01}%2C${data.locationLat + 0.01}&layer=mapnik&marker=${data.locationLat}%2C${data.locationLng}`}
                        />
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={() => window.open(`https://maps.google.com/?q=${data.locationLat},${data.locationLng}`, '_blank')}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="w-4 h-4" />
                          مشاهده در گوگل مپس
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const url = `https://maps.google.com/?q=${data.locationLat},${data.locationLng}`;
                            navigator.clipboard?.writeText(url);
                          }}
                          className="flex items-center gap-2"
                        >
                          <Copy className="w-4 h-4" />
                          کپی لینک
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            const url = `https://maps.google.com/?q=${data.locationLat},${data.locationLng}`;
                            if ((navigator as any).share) {
                              (navigator as any).share({ 
                                title: 'موقعیت نمونه‌گیری', 
                                text: 'لوکیشن نمونه‌گیری', 
                                url 
                              }).catch(() => {});
                            } else {
                              navigator.clipboard?.writeText(url);
                            }
                          }}
                          className="flex items-center gap-2"
                        >
                          <Share className="w-4 h-4" />
                          اشتراک‌گذاری
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RequestView;


