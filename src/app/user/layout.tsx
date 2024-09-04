import { ReactNode } from 'react';
import SideBar from '@/components/SideBar/SideBar';

const UserLayout = ({ children }: { children: ReactNode }) => {
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