'use client';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthContext';
import { FaHome, FaCalendarAlt, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { BsTicketDetailed } from 'react-icons/bs';
import { useAuth } from '@/components/Context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { MdOutlineCreateNewFolder } from "react-icons/md";
import Image from 'next/image';
import { TbMapSearch } from "react-icons/tb";
import FetchOrdersButton from './OrdersButton';
import Swal from 'sweetalert2'; 

const SideBar = () => {
const { user } = useContext(AuthContext);
const router = useRouter();
const { logout } = useAuth(); 

const handleLogout = () => {
  Swal.fire({
    title: '¿Estás seguro?',
    text: '¿Quieres cerrar sesión?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cerrar sesión',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {

      Swal.fire({
        title: 'Hasta luego!',
        text: 'Gracias por visitarnos. Te esperamos pronto!',
        icon: 'info',
        confirmButtonText: 'OK'
      }).then(async (result) => {
        if (result.isConfirmed) {
          logout();
          router.push('/'); 
        }
      });
    }
  });
};

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
          <FaCog className="text-xl hover:text-pink-400 cursor-pointer" />
        </Link>
        <Link href="/user/orders">
          <BsTicketDetailed className="text-xl hover:text-pink-400 cursor-pointer" />
        </Link>
        <Link href="/user/myevents">
          <FaCalendarAlt className="text-xl hover:text-pink-400 cursor-pointer" />
        </Link>  
        <Link href="/user/eventsmaps">
          <TbMapSearch  className="text-xl hover:text-pink-400 cursor-pointer" />
        </Link>
        {user?.role === 'emprendedor' && (
          <Link href="/user/create">
            <MdOutlineCreateNewFolder className="text-xl hover:text-pink-400 cursor-pointer" />
          </Link>
        )}
      </nav>
      <div className="flex justify-center mt-auto z-10 text-white">
        <FaSignOutAlt
          onClick={handleLogout}
          className="text-xl hover:text-pink-400 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default SideBar;
