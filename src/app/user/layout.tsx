'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Context/AuthContext';
import SideBar from '@/components/SideBar/SideBar';

const UserLayout = ({ children }: { children: ReactNode }) => {
  const { user, token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      router.push('/login');
    }
  }, [user, token, router]);

  if (!user || !token) {
    return null; // Or a loading component
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SideBar />
      <div className="flex-1 p-0 overflow-y-auto h-full">
        {children} 
      </div>
    </div>
  );
};

export default UserLayout;