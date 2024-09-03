// components/Layout.tsx
'use client';
import { ReactNode } from 'react';
import Image from 'next/image';
import { FaHome, FaCalendarAlt, FaHeart, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import FetchOrdersButton from './OrdersButton'; // Asegúrate de la ruta correcta para importar

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Side Navigation */}
      <div className="relative flex flex-col justify-between h-full p-4">
        {/* Background Image */}
        <Image
          src="/13.png"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0 z-0"
        />

        {/* Navigation Icons */}
        <nav className="flex flex-col space-y-10 mt-8 z-10 text-white p-2">
          <FaHome className="text-xl hover:text-pink-400 cursor-pointer" />
          <FaCalendarAlt className="text-xl hover:text-pink-400 cursor-pointer" />
          <FaHeart className="text-xl hover:text-pink-400 cursor-pointer" />
          <FaUser className="text-xl hover:text-pink-400 cursor-pointer" />
          <FaCog className="text-xl hover:text-pink-400 cursor-pointer" />
          {/* Agrega el botón aquí */}
          <FetchOrdersButton />
        </nav>

        {/* Sign Out Icon Centered */}
        <div className="flex justify-center mt-auto z-10 text-white">
          <FaSignOutAlt className="text-xl hover:text-pink-400 cursor-pointer" />
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

