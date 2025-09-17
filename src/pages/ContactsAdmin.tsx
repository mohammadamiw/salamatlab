import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { getApiBase } from '@/lib/apiBase';
import { getAdminAuthHeader } from '@/lib/adminAuth';
import { useNavigate } from 'react-router-dom';
import { PhoneCall, MessageSquare, Mail, User, Calendar } from 'lucide-react';
import AdminPageLayout from '@/components/AdminPageLayout';
import AdminDataTable, { ColumnDef } from '@/components/AdminDataTable';

interface ContactItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

const ContactsAdmin: React.FC = () => {
  const [items, setItems] = useState<ContactItem[]>([]);
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

      const res = await fetch(`${getApiBase()}/api/contacts-list.php`, {
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
  const columns: ColumnDef<ContactItem>[] = [
    {
      key: 'createdAt',
      title: 'تاریخ',
      sortable: true,
      render: (value) => (
        <span className="text-sm">{value}</span>
      ),
    },
    {
      key: 'name',
      title: 'نام و نام خانوادگی',
      sortable: true,
      render: (value) => (
        <span className="font-medium">{value || '-'}</span>
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
      key: 'phone',
      title: 'شماره تماس',
      sortable: true,
      render: (value) => (
        <span className="font-mono text-sm">{value || '-'}</span>
      ),
    },
    {
      key: 'subject',
      title: 'موضوع',
      sortable: true,
      render: (value) => (
        <Badge variant="outline" className="text-xs">
          {value || '-'}
        </Badge>
      ),
    },
    {
      key: 'message',
      title: 'پیام',
      render: (value) => (
        <div className="max-w-xs truncate text-sm text-slate-600">
          {value || '-'}
        </div>
      ),
    },
  ];

  return (
    <AdminPageLayout
      title="مدیریت تماس‌ها"
      description="بررسی و مدیریت پیام‌های دریافتی از فرم تماس"
      icon={<PhoneCall className="w-6 h-6 text-red-600" />}
      badge={{ text: `${items.length} پیام`, variant: 'secondary' }}
      onRefresh={fetchItems}
      loading={loading}
      breadcrumbs={[{ label: 'تماس‌ها' }]}
    >
      <AdminDataTable
        data={items}
        columns={columns}
        loading={loading}
        error={error}
        title="لیست پیام‌های دریافتی"
        description={`مجموع ${items.length} پیام تماس دریافت شده`}
        searchPlaceholder="جستجو در نام، ایمیل، موضوع یا پیام..."
        onRefresh={fetchItems}
        actions={{
          view: (item) => window.open(`/r/${item.id}`, '_blank'),
        }}
      />
    </AdminPageLayout>
  );
};

export default ContactsAdmin;
