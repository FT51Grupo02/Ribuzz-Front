'use client';
import { useContext } from 'react';
import Link from 'next/link';
import { FaHome, FaCalendarAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { BsTicketDetailed } from 'react-icons/bs';
import { MdOutlineCreateNewFolder } from "react-icons/md";
import Image from 'next/image';
import { AuthContext } from '../Context/AuthContext'; // Ajusta la ruta según tu estructura de carpetas

const SideBar = () => {
  const { user } = useContext(AuthContext); // Obtener la información del usuario desde el contexto

  return (
    <div className="relative flex flex-col justify-between h-full p-4 text-white">
      <Image
        src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918381/13_vkmbmp.webp"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
        quality={100}
      />
      <nav className="flex flex-col space-y-10 mt-8 z-10">
        <Link href="/user">
          <FaHome className="text-xl hover:text-pink-400 cursor-pointer" />
        </Link>
        <Link href="/user/orders">
          <BsTicketDetailed className="text-xl hover:text-pink-400 cursor-pointer" />
        </Link>
        <Link href="/user/eventsCal">
          <FaCalendarAlt className="text-xl hover:text-pink-400 cursor-pointer" />
        </Link>
        {user?.role === 'emprendedor' && (
          <Link href="/user/settings">
            <FaCog className="text-xl hover:text-pink-400 cursor-pointer" />
          </Link>
        )}
          {user?.role === 'emprendedor' && (
          <Link href="/user/myevents">
            <MdOutlineCreateNewFolder className="text-xl hover:text-pink-400 cursor-pointer" />
          </Link>
        )}
      </nav>
      <div className="flex justify-center mt-auto z-10 text-white">
        <FaSignOutAlt className="text-xl hover:text-pink-400 cursor-pointer" />
      </div>
    </div>
  );
};

export default SideBar;
