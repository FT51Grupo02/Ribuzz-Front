'use client';
import { ReactNode } from 'react';
import { FaHome, FaCalendarAlt, FaHeart, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Side Navigation */}
      <div
        className="bg-gray-800 text-white flex flex-col justify-between h-full p-4"
        style={{ backgroundImage: "url('/3.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <nav className="flex flex-col space-y-8 mt-8">
          <FaHome className="text-xl hover:text-gray-400 cursor-pointer" />
          <FaCalendarAlt className="text-xl hover:text-gray-400 cursor-pointer" />
          <FaHeart className="text-xl hover:text-gray-400 cursor-pointer" />
          <FaUser className="text-xl hover:text-gray-400 cursor-pointer" />
          <FaCog className="text-xl hover:text-gray-400 cursor-pointer" />
        </nav>

        <div className="mt-auto">
          <FaSignOutAlt className="text-xl hover:text-gray-400 cursor-pointer" />
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-0 overflow-y-auto h-full">
        {children}
      </div>
    </div>
  );
};

export default Layout;