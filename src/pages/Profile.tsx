import React from 'react';
import Header from '@/components/Header';
import UserDashboard from '@/components/UserProfile/UserDashboard';

const Profile = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      <UserDashboard />
    </div>
  );
};

export default Profile;
