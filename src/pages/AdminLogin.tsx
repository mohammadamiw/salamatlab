import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { setAdminCredentials, getAdminAuthHeader } from '@/lib/adminAuth';
import { Eye, EyeOff, Shield, User, Lock, AlertCircle } from 'lucide-react';
import Logo from '@/components/Logo';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in
  useEffect(() => {
    const auth = getAdminAuthHeader();
    if (auth) {
      navigate('/admin');
    }
  }, [navigate]);

  const onLogin = async () => {
    if (!username || !password) { 
      setError('نام کاربری و رمز عبور لازم است'); 
      return; 
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate login check (in real app, you'd verify with backend)
      setAdminCredentials(username, password);
      
      // Add small delay for better UX
      setTimeout(() => {
        navigate('/admin');
      }, 500);
    } catch (err) {
      setError('خطا در ورود');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2 pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Logo size="sm" />
              <span className="text-sm text-slate-600">آزمایشگاه سلامت</span>
            </div>
            <CardTitle className="text-2xl font-bold text-slate-800">
              ورود به پنل مدیریت
            </CardTitle>
            <CardDescription className="text-slate-600">
              لطفاً با اطلاعات ادمین وارد شوید
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  نام کاربری
                </label>
                <Input
                  placeholder="نام کاربری ادمین"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="h-12 bg-white border-slate-200 focus:border-blue-500"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  رمز عبور
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="رمز عبور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="h-12 bg-white border-slate-200 focus:border-blue-500 pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                onClick={onLogin}
                disabled={loading || !username || !password}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال ورود...
                  </div>
                ) : (
                  'ورود به پنل'
                )}
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-slate-500">
                محفوظ و امن • پنل مدیریت آزمایشگاه سلامت
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;


