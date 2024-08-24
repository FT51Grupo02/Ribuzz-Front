'use client'

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const startY = useRef<number | null>(null);
  const menuRef = useRef(null);

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
      e.preventDefault(); // Prevenir el comportamiento predeterminado del desplazamiento
    }
    // Cerrar el menú al deslizar hacia arriba
    else if (deltaY < -30 && isMenuOpen) {
      setIsMenuOpen(false);
      e.preventDefault(); // Prevenir el comportamiento predeterminado del desplazamiento
    }
  };

  const handleTouchEnd = () => {
    startY.current = null;
  };

  return (
    <>
      <nav className="bg-black text-white flex items-center justify-between p-5 w-full sticky top-0 z-50 overflow-x-hidden">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" passHref>
            <div>
              {/* Logo para pantallas mayores a 425px */}
              <Image 
                src="/4.png" 
                alt="Logo" 
                width={200} 
                height={60} 
                className="hidden md:block" // Mostrar en pantallas mayores a 425px
              />
              {/* Logo para pantallas menores a 425px */}
              <Image 
                src="/5.png" 
                alt="Logo" 
                width={50} 
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
            href="/marketplace" 
            className={`transition duration-300 hover:scale-105 ease-in-out px-4 py-2 rounded-xl ${isActive('/marketplace') ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
          >
            Marketplace
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
          <Link 
            href="/profile" 
            className={`relative hover:bg-white rounded-full p-1 ${isActive('/profile') ? 'bg-white' : ''}`}
          >
            <Image 
              src="/profile.png" 
              alt="Profile" 
              width={30} 
              height={40} 
              className={`transition duration-300 ${isActive('/profile') ? 'filter invert' : 'hover:filter hover:invert'}`}
            />
          </Link>
          <Link 
            href="/cart" 
            className={`relative hover:bg-white rounded-full p-1 ${isActive('/cart') ? 'bg-white' : ''}`}
          >
            <Image 
              src="/cart.png" 
              alt="Cart" 
              width={30} 
              height={40} 
              className={`transition duration-300 ${isActive('/cart') ? 'filter invert' : 'hover:filter hover:invert'}`}
            />
          </Link>
          
          {/* Menu Desplegable */}
          <button 
            onClick={toggleMenu} 
            className="block lg:hidden relative text-white focus:outline-none translate-y-0.5"
          >
            <Image 
              src="/menu.png" 
              alt="Menu" 
              width={30} 
              height={30} 
              className="w-8 h-8"
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div 
        className={`fixed top-[68px] opacity-90 right-0 w-full bg-black lg:hidden transition-transform duration-300 ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'} p-4 overflow-x-hidden z-40`}
        ref={menuRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-col items-center relative">
          <Link 
            href="/" 
            className={`block px-4 py-2 text-center w-full ${isActive('/') ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'}`}
            onClick={toggleMenu}
          >
            Home
          </Link>
          <Link 
            href="/marketplace" 
            className={`block px-4 py-2 text-center w-full ${isActive('/marketplace') ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'}`}
            onClick={toggleMenu}
          >
            Marketplace
          </Link>
          <Link 
            href="/products" 
            className={`block px-4 py-2 text-center w-full ${isActive('/products') ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'}`}
            onClick={toggleMenu}
          >
            Products
          </Link>
          <Link 
            href="/events" 
            className={`block px-4 py-2 text-center w-full ${isActive('/events') ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'}`}
            onClick={toggleMenu}
          >
            Events
          </Link>
          <Link 
            href="/about" 
            className={`block px-4 py-2 text-center w-full ${isActive('/about') ? 'bg-white text-black' : 'text-white hover:bg-white hover:text-black'}`}
            onClick={toggleMenu}
          >
            About
          </Link>

          {/* Barrita del Desplegable */}
          <div className="w-16 h-1 bg-pink-500 opacity-80 rounded-full my-4 cursor-pointer" />
        </div>
      </div>
    </>
  );
};

export default Navbar;
