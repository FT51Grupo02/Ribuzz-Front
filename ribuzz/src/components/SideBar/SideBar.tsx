'use client';
import { ReactNode, useState } from 'react';
import { FaHome, FaCalendarAlt, FaHeart, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa'; 

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex h-screen">
      {/* Side Navigation */}
      <div className={`bg-gray-800 text-white ${isOpen ? 'w-64' : 'w-16'} flex flex-col justify-between items-center p-4 transition-all duration-300`}>
        {/* Hamburger Button for Mobile */}
        <button
          onClick={toggleMenu}
          className="mb-4 md:hidden text-white bg-gray-800 p-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Toggle menu"
        >
          <div className="space-y-2">
            <span className="block w-4 h-0.5 bg-white"></span>
            <span className="block w-4 h-0.5 bg-white"></span>
            <span className="block w-4 h-0.5 bg-white"></span>
          </div>
        </button>

        <nav className={`flex flex-col space-y-8 ${isOpen ? 'block' : 'hidden'} md:block`}>
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
      <div className="flex-1 p-0">
        {children}
      </div>
    </div>
  );
};

export default Layout;

