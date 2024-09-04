'use client';
import Link from 'next/link';
import { FaHome, FaCalendarAlt, FaHeart, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import FetchOrdersButton from './OrdersButton';

const SideBar = () => {
  return (
    <div className="relative flex flex-col justify-between h-full p-4 bg-cover bg-center text-white"
      style={{ backgroundImage: 'url(/3.png)' }} 
    >
      <nav className="flex flex-col space-y-10 mt-8 z-10">
        <Link href="/user">
          <FaHome className="text-xl hover:text-pink-400 cursor-pointer" />
        </Link>
        <Link href="/user/orders">
          <FaCalendarAlt className="text-xl hover:text-pink-400 cursor-pointer" />
        </Link>
        <Link href="/user/settings">
          <FaCog className="text-xl hover:text-pink-400 cursor-pointer" />
        </Link>
      </nav>
      <div className="flex justify-center mt-auto z-10 text-white">
        <FaSignOutAlt className="text-xl hover:text-pink-400 cursor-pointer" />
      </div>
    </div>
  );
};

export default SideBar;
