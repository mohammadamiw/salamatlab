import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { getApiBase } from '@/lib/apiBase';
import { getAdminAuthHeader } from '@/lib/adminAuth';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, MapPin, CreditCard } from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminDataTable, { ColumnDef } from '@/components/AdminDataTable';

interface CheckupItem {
  id: string;
  fullName: string;
  phone: string;
  title: string;
  city: string;
  hasBasicInsurance: string;
  createdAt: string;
}

const CheckupsAdmin: React.FC = () => {
  const [items, setItems] = useState<CheckupItem[]>([]);
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
      
      const res = await fetch(`${getApiBase()}/api/checkup-list.php`, { 
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
  const columns: ColumnDef<CheckupItem>[] = [
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
      key: 'title',
      title: 'نوع چکاپ',
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="text-xs">
          {value || '-'}
        </Badge>
      ),
    },
    {
      key: 'city',
      title: 'شهر',
      sortable: true,
      render: (value) => (
        <span className="flex items-center gap-1 text-sm">
          <MapPin className="w-3 h-3 text-slate-400" />
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'hasBasicInsurance',
      title: 'بیمه پایه',
      render: (value) => (
        <Badge variant={value === 'yes' ? 'default' : 'secondary'}>
          <CreditCard className="w-3 h-3 me-1" />
          {value === 'yes' ? 'دارد' : 'ندارد'}
        </Badge>
      ),
    },
  ];

  return (
    <AdminPageLayout
      title="درخواست‌های چکاپ"
      description="مدیریت و بررسی درخواست‌های چکاپ دریافتی"
      icon={<ClipboardList className="w-6 h-6 text-green-600" />}
      badge={{ text: `${items.length} درخواست`, variant: 'secondary' }}
      onRefresh={fetchItems}
      loading={loading}
      breadcrumbs={[{ label: 'چکاپ‌ها' }]}
    >
      <AdminDataTable
        data={items}
        columns={columns}
        loading={loading}
        error={error}
        title="لیست درخواست‌های چکاپ"
        description={`مجموع ${items.length} درخواست چکاپ دریافت شده`}
        searchPlaceholder="جستجو در نام، تلفن، نوع چکاپ یا شهر..."
        onRefresh={fetchItems}
        actions={{
          view: (item) => window.open(`/r/${item.id}`, '_blank'),
        }}
      />
    </AdminPageLayout>
  );
};

export default CheckupsAdmin;


