import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { getApiBase } from '@/lib/apiBase';

type PhoneOtpProps = {
  label?: string;
  phone: string;
  onChangePhone: (phone: string) => void;
  onVerified: () => void;
};

const PhoneOtp: React.FC<PhoneOtpProps> = ({ label = 'شماره تماس', phone, onChangePhone, onVerified }) => {
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    const digits = phone.replace(/\D/g, '').replace(/^0/, '');
    if (!/^\d{10}$/.test(digits)) {
      alert('شماره تماس معتبر نیست');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/api/otp.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', phone: digits })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setSent(true);
        alert('کد تایید ارسال شد.');
      } else {
        alert(result.error || 'خطا در ارسال کد');
      }
    } catch (e) {
      alert('خطا در اتصال به سرویس OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const digits = phone.replace(/\D/g, '').replace(/^0/, '');
    if (!/^\d{6}$/.test(otp)) {
      alert('کد تایید ۶ رقمی نیست');
      return;
    }
    try {
      const res = await fetch(`${getApiBase()}/api/otp.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone: digits, code: otp })
      });
      const result = await res.json();
      if (res.ok && result.success) {
        onVerified();
        alert('شماره تایید شد.');
      } else {
        alert(result.error || 'کد تایید نادرست است');
      }
    } catch (e) {
      alert('خطا در اتصال به سرویس OTP');
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">{label}</Label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Input
          id="phone"
          value={phone}
          onChange={(e) => onChangePhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
          placeholder="مثال: 09123456789"
          className="sm:col-span-2"
        />
        <Button type="button" onClick={sendOtp} disabled={loading} variant="outline">
          {loading ? 'در حال ارسال…' : 'ارسال کد'}
        </Button>
      </div>
      {sent && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <Input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="کد تایید ۶ رقمی" />
          <div />
          <Button type="button" onClick={verifyOtp}>
            تایید
          </Button>
        </div>
      )}
    </div>
  );
};

export default PhoneOtp;


