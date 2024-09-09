'use client'

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/Context/AuthContext';
import Swal from 'sweetalert2';
import { FaUser, FaTimes } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import CartIcon from '../Cart/CartIcon/CartIcon';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const startY = useRef<number | null>(null);
  const menuRef = useRef(null);

  const router = useRouter();
  const { user, token, setUser, setToken, logout } = useAuth();

  const isActive = (href: string) => pathname === href;

  const toggleMenu = () => setIsMenuOpen(prevState => !prevState);

  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current === null) return;

    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;

    // Abrir el menú al deslizar hacia abajo
    if (deltaY > 30 && !isMenuOpen) {
      setIsMenuOpen(true);
      e.preventDefault();
    }
    // Cerrar el menú al deslizar hacia arriba
    else if (deltaY < -30 && isMenuOpen) {
      setIsMenuOpen(false);
      e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    startY.current = null;
  };

  const handleLogout = () => {
    Swal.fire({
      title: `Hasta luego!`,
      text: 'Gracias por visitarnos. Te esperamos pronto!',
      icon: 'info',
      confirmButtonText: 'OK'
    }).then(() => {
      logout();
      router.push('/');
    });
  };

  // Extraer las iniciales del nombre del usuario
  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part[0].toUpperCase()).join('');
    return initials.slice(0, 2); // Tomar solo las primeras dos letras
  };

  return (
    <>
      <nav className="bg-black font-poppins text-white flex items-center justify-between p-5 w-full sticky top-0 z-50 overflow-x-hidden">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" passHref>
            <div>
              {/* Logo para pantallas mayores a 425px */}
              <Image 
                src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918380/4_fxsr8a.webp" 
                alt="Logo" 
                width={200} 
                height={60} 
                quality={100}
                className="hidden md:block" // Mostrar en pantallas mayores a 425px
              />
              {/* Logo para pantallas menores a 425px */}
              <Image 
                src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918380/5_yzrcts.webp" 
                alt="Logo" 
                width={50} 
                quality={100}
                height={30} 
                className="md:hidden" // Mostrar en pantallas menores a 425px
              />
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="flex-grow justify-center space-x-2 hidden lg:flex">
          <Link 
            href="/" 
            className={`transition duration-300 hover:scale-105 ease-in-out px-4 py-2 rounded-xl ${isActive('/') ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
          >
            Inicio
          </Link>
          <Link 
            href="/services" 
            className={`transition duration-300 hover:scale-105 ease-in-out px-4 py-2 rounded-xl ${isActive('/services') ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
          >
            Servicios
          </Link>
          <Link 
            href="/products" 
            className={`transition duration-300 hover:scale-105 ease-in-out px-4 py-2 rounded-xl ${isActive('/products') ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
          >
            Productos
          </Link>
          <Link 
            href="/events" 
            className={`transition duration-300 hover:scale-105 ease-in-out px-4 py-2 rounded-xl ${isActive('/events') ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
          >
            Eventos
          </Link>
          <Link 
            href="/about" 
            className={`transition duration-300 hover:scale-105 ease-in-out px-4 py-2 rounded-xl ${isActive('/about') ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
          >
            Nosotros
          </Link>
        </div>

        {/* Iconos de perfil, carrito y menú */}
        <div className="flex-shrink-0 flex items-center space-x-2 ml-auto">
          {token ? (
            <>
              <Link 
                href="/user" 
                className={`relative rounded-full hover:ring-2 hover:ring-white p-1 ${isActive('/user') ? 'bg-white text-black' : ''}`}
              >
                <Image 
                  src="/profile.png" 
                  alt="Profile" 
                  width={30} 
                  height={40} 
                  quality={100}
                  className={`transition duration-300 ${isActive('/user') ? 'filter invert' : ''}`}
                />
              </Link>
              
              <Link 
                href="/cart" 
                className={`relative rounded-full hover:ring-2 hover:ring-white p-1 ${isActive('/cart') ? 'bg-white text-black' : ''}`}
              >
                <CartIcon isActive={isActive('/cart')} />
              </Link>
              <div className="relative flex items-center justify-center border w-8 h-8 text-2xl bg-black text-white  rounded-full">
                {user ? getInitials(user.name) : ''}
              </div>
              <button 
                onClick={handleLogout} 
                className="hidden md:block text-white focus:outline-none "
              >
                <FiLogOut size={28} className='transition duration-300 transform hover:scale-110'/>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-black">
                <button className="flex items-center text-white">
                  <FaUser size={20} className='-translate-y-0.5 transition duration-300 transform hover:scale-105 mr-1 hover:text-pink-400' />
                  <span className="ml-2 transition duration-300 transform hover:scale-105 hover:text-pink-400">Ingresar</span>
                </button>
              </Link>
              <Link href="/register" className="text-gray-600 hover:text-black">
                <button className="flex items-center text-white">
                  <span className="ml-2 transition duration-300 transform hover:scale-105 hover:text-pink-400">Registro</span>
                </button>
              </Link>
            </>
          )}

          {/* Menu Desplegable */}
          <button 
            onClick={toggleMenu} 
            className="block lg:hidden relative text-white focus:outline-none"
          >
            <Image 
              src="/menu.png" 
              alt="Menu" 
              width={30} 
              quality={100}
              height={30} 
              className="w-8 h-8"
            />
          </button>
        </div>
      </nav>

      <div 
        className={`fixed top-[80px] opacity-90 right-0 w-full overflow-visible bg-black lg:hidden transition-transform duration-300 ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'} p-4 overflow-hidden z-40`}
        ref={menuRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative flex flex-col items-center">
          <Link 
            href="/" 
            className={`block px-4 py-2 text-center w-full ${isActive('/') ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'}`}
            onClick={toggleMenu}
          >
            Inicio
          </Link>
          <Link 
            href="/services" 
            className={`block px-4 py-2 text-center w-full ${isActive('/services') ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'}`}
            onClick={toggleMenu}
          >
            Servicios
          </Link>
          <Link 
            href="/products" 
            className={`block px-4 py-2 text-center w-full ${isActive('/products') ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'}`}
            onClick={toggleMenu}
          >
            Productos
          </Link>
          <Link 
            href="/events" 
            className={`block px-4 py-2 text-center w-full ${isActive('/events') ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'}`}
            onClick={toggleMenu}
          >
            Eventos
          </Link>
          <Link 
            href="/about" 
            className={`block px-4 py-2 text-center w-full ${isActive('/about') ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'}`}
            onClick={toggleMenu}
          >
            Nosotros
          </Link>
          {token && (
          <button 
            onClick={handleLogout} 
            className="block px-4 py-2 text-center w-full text-white hover:bg-red-600 hover:text-white flex items-center justify-center"
          >
              <span>Cerrar Sesión</span>
            <div className="ml-2 flex items-center space-x-2">
              <FiLogOut size={20} />
            </div>
          </button>
          )}
          <div className="w-16 h-1 bg-pink-500 opacity-80 rounded-full mb-6 mt-4 cursor-pointer" />
          <button 
            onClick={toggleMenu} 
            className={`absolute inset-0 m-auto bg-black text-white rounded-full w-12 h-12 flex items-center justify-center top-full opacity-90 ${isMenuOpen ? 'overflow-visible' : 'hidden'}`}
          >
            <FaTimes size={24} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
