import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { getApiBase } from '@/lib/apiBase';
import { getAdminAuthHeader } from '@/lib/adminAuth';
import { useNavigate } from 'react-router-dom';
import { BriefcaseBusiness, FileText, GraduationCap, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminDataTable, { ColumnDef } from '@/components/AdminDataTable';

interface CareerItem {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  nationalId: string;
  birthDate: string;
  phone: string;
  email: string;
  major: string;
  degree: string;
  description: string;
  hasExperience: string;
  experienceDetails: string;
  address: string;
  resumeUrl: string;
  createdAt: string;
}

const CareersAdmin: React.FC = () => {
  const [items, setItems] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchItems = async () => {
    setLoading(true);
    setError('');
    try {
      const auth = getAdminAuthHeader();
      if (!auth) {
        navigate('/admin/login');
        return;
      }

      const res = await fetch(`${getApiBase()}/api/careers-list.php`, {
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

  // Table columns
  const columns: ColumnDef<CareerItem>[] = [
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
      key: 'nationalId',
      title: 'کد ملی',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">{value || '-'}</span>
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
      key: 'email',
      title: 'ایمیل',
      sortable: true,
      render: (value) => (
        <span className="text-sm">{value || '-'}</span>
      ),
    },
    {
      key: 'major',
      title: 'رشته تحصیلی',
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="text-xs">
          {value || '-'}
        </Badge>
      ),
    },
    {
      key: 'degree',
      title: 'مقطع تحصیلی',
      sortable: true,
      render: (value) => (
        <Badge variant="secondary" className="text-xs">
          {value || '-'}
        </Badge>
      ),
    },
    {
      key: 'hasExperience',
      title: 'سابقه کار',
      render: (value) => (
        <Badge variant={value === 'yes' ? 'default' : 'secondary'}>
          {value === 'yes' ? 'دارد' : 'ندارد'}
        </Badge>
      ),
    },
    {
      key: 'resumeUrl',
      title: 'رزومه',
      render: (value) => (
        value ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-600 hover:text-lime-600 text-sm flex items-center gap-1 transition-all duration-200 hover:scale-105 bg-red-50 hover:bg-lime-50 px-2 py-1 rounded-md border border-red-200 hover:border-lime-300"
          >
            <FileText className="w-4 h-4" />
            دانلود رزومه
          </a>
        ) : (
          <span className="text-slate-400 text-sm">-</span>
        )
      ),
    },
  ];

  return (
    <AdminPageLayout
      title="مدیریت رزومه‌ها"
      description="بررسی و مدیریت درخواست‌های همکاری دریافتی"
      icon={<BriefcaseBusiness className="w-6 h-6 text-orange-600" />}
      badge={{ text: `${items.length} رزومه`, variant: 'secondary' }}
      onRefresh={fetchItems}
      loading={loading}
      breadcrumbs={[{ label: 'رزومه‌ها' }]}
    >
      <AdminDataTable
        data={items}
        columns={columns}
        loading={loading}
        error={error}
        title="لیست رزومه‌های دریافتی"
        description={`مجموع ${items.length} درخواست همکاری دریافت شده`}
        searchPlaceholder="جستجو در نام، کد ملی، تلفن، ایمیل یا رشته تحصیلی..."
        onRefresh={fetchItems}
        actions={{
          view: (item) => window.open(`/r/${item.id}`, '_blank'),
        }}
      />
    </AdminPageLayout>
  );
};

export default CareersAdmin;
