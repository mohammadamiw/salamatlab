import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth, Address } from '@/contexts/AuthContext';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  Home, 
  Building, 
  Star,
  Save,
  X
} from 'lucide-react';

const AddressManagement = () => {
  const { user, updateAddresses, setDefaultAddress } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  
  // Load addresses from user context
  useEffect(() => {
    if (user?.addresses) {
      setAddresses(user.addresses);
    } else {
      // Default sample addresses if none exist
      const defaultAddresses: Address[] = [
        {
          id: '1',
          title: 'منزل',
          type: 'home',
          address: 'تهران، شهرقدس، خیابان شهید بهشتی، پلاک ۱۲۳',
          postalCode: '1234567890',
          phone: '02146833010',
          isDefault: true
        }
      ];
      setAddresses(defaultAddresses);
      updateAddresses(defaultAddresses);
    }
  }, [user?.addresses]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newAddress, setNewAddress] = useState<Omit<Address, 'id'>>({
    title: '',
    type: 'home',
    address: '',
    postalCode: '',
    phone: '',
    isDefault: false
  });

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
  };

  const handleSaveNew = async () => {
    const id = Date.now().toString();
    const updatedAddresses = [...addresses, { ...newAddress, id }];
    setAddresses(updatedAddresses);
    await updateAddresses(updatedAddresses);
    
    setNewAddress({
      title: '',
      type: 'home',
      address: '',
      postalCode: '',
      phone: '',
      isDefault: false
    });
    setIsAddingNew(false);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsAddingNew(false);
  };

  const handleDelete = async (id: string) => {
    const updatedAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(updatedAddresses);
    await updateAddresses(updatedAddresses);
  };

  const handleSetDefault = async (id: string) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    }));
    setAddresses(updatedAddresses);
    await updateAddresses(updatedAddresses);
    await setDefaultAddress(id);
  };

  const getAddressIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="w-5 h-5 text-blue-600" />;
      case 'work':
        return <Building className="w-5 h-5 text-green-600" />;
      default:
        return <MapPin className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAddressTypeLabel = (type: string) => {
    switch (type) {
      case 'home':
        return 'منزل';
      case 'work':
        return 'محل کار';
      default:
        return 'سایر';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 border-0 shadow-xl rounded-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">مدیریت آدرس‌ها</h2>
          </div>
          <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 ml-2" />
            آدرس جدید
          </Button>
        </div>
      </Card>

      {/* Add New Address Form */}
      {isAddingNew && (
        <Card className="p-6 border-0 shadow-xl rounded-2xl border-l-4 border-l-blue-500">
          <div className="flex items-center gap-3 mb-6">
            <Plus className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">افزودن آدرس جدید</h3>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">عنوان آدرس</Label>
                <Input
                  id="title"
                  value={newAddress.title}
                  onChange={(e) => setNewAddress({...newAddress, title: e.target.value})}
                  placeholder="مثال: منزل، محل کار"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="type">نوع آدرس</Label>
                <select
                  id="type"
                  value={newAddress.type}
                  onChange={(e) => setNewAddress({...newAddress, type: e.target.value as 'home' | 'work' | 'other'})}
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="home">منزل</option>
                  <option value="work">محل کار</option>
                  <option value="other">سایر</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="address">آدرس کامل</Label>
              <Textarea
                id="address"
                value={newAddress.address}
                onChange={(e) => setNewAddress({...newAddress, address: e.target.value})}
                placeholder="آدرس کامل را وارد کنید..."
                className="mt-2"
                rows={3}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="postalCode">کد پستی</Label>
                <Input
                  id="postalCode"
                  value={newAddress.postalCode}
                  onChange={(e) => setNewAddress({...newAddress, postalCode: e.target.value})}
                  placeholder="1234567890"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="phone">شماره تماس</Label>
                <Input
                  id="phone"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({...newAddress, phone: e.target.value})}
                  placeholder="02112345678"
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress({...newAddress, isDefault: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="isDefault">تنظیم به عنوان آدرس پیش‌فرض</Label>
            </div>

            <div className="flex gap-4 pt-4">
              <Button onClick={handleSaveNew} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 ml-2" />
                ذخیره آدرس
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAddingNew(false)}
              >
                <X className="w-4 h-4 ml-2" />
                انصراف
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Address List */}
      <div className="grid gap-4">
        {addresses.map((address) => (
          <Card key={address.id} className="p-6 border-0 shadow-xl rounded-2xl hover:shadow-2xl transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  {getAddressIcon(address.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-bold text-gray-800">{address.title}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded-full">
                      {getAddressTypeLabel(address.type)}
                    </span>
                    {address.isDefault && (
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">
                        <Star className="w-3 h-3" />
                        پیش‌فرض
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{address.address}</p>
                  <div className="flex gap-4 text-sm text-gray-500">
                    <span>کد پستی: {address.postalCode}</span>
                    <span>تلفن: {address.phone}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id)}
                    className="text-yellow-600 hover:bg-yellow-50"
                  >
                    <Star className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(address.id)}
                  className="text-blue-600 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(address.id)}
                  className="text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {addresses.length === 0 && !isAddingNew && (
        <Card className="p-12 border-0 shadow-xl rounded-2xl text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">آدرسی یافت نشد</h3>
          <p className="text-gray-600 mb-6">هنوز آدرسی اضافه نکرده‌اید</p>
          <Button onClick={handleAddNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 ml-2" />
            اولین آدرس خود را اضافه کنید
          </Button>
        </Card>
      )}
    </div>
  );
};

export default AddressManagement;
