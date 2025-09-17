import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getApiBase } from '@/lib/apiBase';
import { getAdminAuthHeader } from '@/lib/adminAuth';
import { useNavigate } from 'react-router-dom';
import { FlaskConical, MapPin, ExternalLink } from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminDataTable, { ColumnDef } from '@/components/AdminDataTable';

interface SamplingItem {
  id: string;
  fullName: string;
  phone: string;
  city: string;
  address: string;
  locationLat?: number;
  locationLng?: number;
  createdAt: string;
}

const SamplingAdmin: React.FC = () => {
  const [items, setItems] = useState<SamplingItem[]>([]);
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
      
      const res = await fetch(`${getApiBase()}/api/sampling-list.php`, { 
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
  const columns: ColumnDef<SamplingItem>[] = [
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
      key: 'address',
      title: 'آدرس',
      render: (value) => (
        <span className="text-sm max-w-xs truncate block" title={value}>
          {value || '-'}
        </span>
      ),
    },
    {
      key: 'locationLat',
      title: 'موقعیت مکانی',
      render: (value, row) => {
        if (row.locationLat && row.locationLng) {
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`https://maps.google.com/?q=${row.locationLat},${row.locationLng}`, '_blank')}
              className="flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              نقشه
            </Button>
          );
        }
        return <span className="text-slate-400 text-sm">-</span>;
      },
    },
  ];

  return (
    <AdminPageLayout
      title="نمونه‌گیری در محل"
      description="مدیریت و بررسی درخواست‌های نمونه‌گیری در محل"
      icon={<FlaskConical className="w-6 h-6 text-purple-600" />}
      badge={{ text: `${items.length} درخواست`, variant: 'secondary' }}
      onRefresh={fetchItems}
      loading={loading}
      breadcrumbs={[{ label: 'نمونه‌گیری در محل' }]}
    >
      <AdminDataTable
        data={items}
        columns={columns}
        loading={loading}
        error={error}
        title="لیست درخواست‌های نمونه‌گیری در محل"
        description={`مجموع ${items.length} درخواست نمونه‌گیری دریافت شده`}
        searchPlaceholder="جستجو در نام، تلفن، شهر یا آدرس..."
        onRefresh={fetchItems}
        actions={{
          view: (item) => window.open(`/r/${item.id}`, '_blank'),
        }}
      />
    </AdminPageLayout>
  );
};

export default SamplingAdmin;


