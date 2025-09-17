import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getApiBase } from '@/lib/apiBase';
import { getAdminAuthHeader } from '@/lib/adminAuth';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { MessageSquareText, TrendingUp } from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminDataTable, { ColumnDef } from '@/components/AdminDataTable';

interface FeedbackItem {
  id: string;
  fullName: string;
  phone: string;
  createdAt: string;
  answers?: Record<string, string>;
}

const FeedbackAdmin: React.FC = () => {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedQ, setSelectedQ] = useState<number>(1);
  const navigate = useNavigate();

  const questions: string[] = [
    'میزان رضایت شما از سیستم نوبت دهی',
    'میزان رضایت شما از ارائه توضیحات جهت آمادگی قبل از آزمایش',
    'میزان رضایت شما از سرعت عمل پذیرش',
    'میزان رضایت شما از برخورد اولیه پرسنل پذیرش و جوابدهی',
    'میزان رضایت شما از نحوه تعامل مالی متصدی صندوق',
    'میزان رضایت شما از مهارت و دقت عمل خونگیری (در آزمایشگاه یا منزل)',
    'میزان رضایت شما از سطح بهداشتی سالن و سرویس بهداشتی',
    'میزان رضایت شما از حضور مسئول واحد پذیرش و نحوه برخورد آن',
    'میزان رضایت شما از سرعت جوابدهی آزمایشگاه',
    'میزان رضایت شما از نحوه ارسال جواب (پیامک، وبسایت و ...)',
    'میزان رضایت شما از ساعت شروع به کار (۷:۰۰ صبح تا ۲۰:۰۰)',
    'میزان رضایت شما از تکریم و احترام به سالمندان و معلولین',
    'میزان رضایت شما از فضای عمومی آزمایشگاه',
    'میزان رضایت شما از پاسخدهی تلفن',
  ];

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const auth = getAdminAuthHeader();
      if (!auth) {
        navigate('/admin/login');
        return;
      }
      
      const res = await fetch(`${getApiBase()}/api/feedback-list.php`, { 
        headers: { Authorization: auth } 
      });
      
      if (res.status === 401) { 
        setError('نام کاربری یا رمز عبور نادرست است'); 
        navigate('/admin/login');
        return; 
      }
      
      if (!res.ok) throw new Error('خطا در دریافت داده');
      
      const json = await res.json();
      setItems(json.items || []);
    } catch (e: any) {
      setError(e.message || 'خطا در بارگذاری داده‌ها');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [navigate]);

  // Chart data for selected question
  const labels = ['عالی','خوب','متوسط','ضعیف'];
  const dist = labels.map((label) => ({ 
    label, 
    value: items.reduce((acc, it) => 
      acc + (it.answers?.[String(selectedQ)] === label ? 1 : 0), 0
    ) 
  }));
  const answeredCount = items.reduce((acc, it) => 
    acc + (it.answers?.[String(selectedQ)] ? 1 : 0), 0
  );
  const withPercent = dist.map(d => ({ 
    ...d, 
    percent: answeredCount ? Math.round((d.value * 1000) / answeredCount) / 10 : 0 
  }));
  const donutColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  // Table columns
  const columns: ColumnDef<FeedbackItem>[] = [
    {
      key: 'id',
      title: 'شناسه',
      sortable: true,
      width: 'w-20',
      render: (value) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
    {
      key: 'createdAt',
      title: 'تاریخ',
      sortable: true,
      render: (value) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      key: 'fullName',
      title: 'نام و نام خانوادگی',
      sortable: true,
      render: (value) => (
        <span className="font-medium">{value || '-'}</span>
      ),
    },
    {
      key: 'phone',
      title: 'شماره تماس',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">{value || '-'}</span>
      ),
    },
    {
      key: 'answers',
      title: 'تعداد پاسخ‌ها',
      render: (value) => {
        const answerCount = value ? Object.keys(value).length : 0;
        return (
          <Badge variant={answerCount > 0 ? 'default' : 'secondary'}>
            {answerCount} پاسخ
          </Badge>
        );
      },
    },
  ];

  return (
    <AdminPageLayout
      title="نظرسنجی‌ها"
      description="مدیریت و بررسی نتایج نظرسنجی‌های دریافتی"
      icon={<MessageSquareText className="w-6 h-6 text-blue-600" />}
      badge={{ text: `${items.length} نظرسنجی`, variant: 'secondary' }}
      onRefresh={fetchItems}
      loading={loading}
      breadcrumbs={[{ label: 'نظرسنجی‌ها' }]}
    >
      <div className="space-y-6">
        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  توزیع پاسخ سؤالات
                </span>
                <select 
                  value={selectedQ} 
                  onChange={(e) => setSelectedQ(Number(e.target.value))} 
                  className="bg-white rounded px-3 py-1 text-sm border border-gray-300 focus:border-blue-500 focus:outline-none"
                >
                  {questions.map((q, idx) => (
                    <option key={idx} value={idx+1}>
                      {idx+1}. {q.slice(0, 35)}{q.length > 35 ? '…' : ''}
                    </option>
                  ))}
                </select>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-64">
                <ResponsiveContainer>
                  <BarChart data={withPercent}>
                    <XAxis dataKey="label" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" allowDecimals={false} fontSize={12} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
                {withPercent.map((d) => (
                  <div key={d.label} className="bg-slate-50 border border-gray-200 rounded p-2 text-center">
                    <div className="text-slate-700 font-medium">{d.label}</div>
                    <div className="font-mono text-lg text-slate-900">{d.percent}%</div>
                    <div className="text-slate-500">{d.value} مورد</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>نمودار دایره‌ای پاسخ‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={{}} className="h-64">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={withPercent}
                      dataKey="value"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {withPercent.map((_, idx) => (
                        <Cell key={`cell-${idx}`} fill={donutColors[idx % donutColors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                {withPercent.map((d, idx) => (
                  <div key={d.label} className="flex items-center gap-2">
                    <span 
                      className="inline-block w-3 h-3 rounded" 
                      style={{ backgroundColor: donutColors[idx % donutColors.length] }} 
                    />
                    <span className="text-slate-700">{d.label}</span>
                    <span className="ms-auto text-slate-500 font-mono">{d.percent}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <AdminDataTable
          data={items}
          columns={columns}
          loading={loading}
          error={error}
          title="لیست نظرسنجی‌ها"
          description={`مجموع ${items.length} نظرسنجی دریافت شده`}
          searchPlaceholder="جستجو در نام، تلفن یا شناسه..."
          onRefresh={fetchItems}
          actions={{
            view: (item) => window.open(`/r/${item.id}`, '_blank'),
          }}
        />
      </div>
    </AdminPageLayout>
  );
};

export default FeedbackAdmin;


