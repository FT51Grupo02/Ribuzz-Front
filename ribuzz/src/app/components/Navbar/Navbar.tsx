'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  const isActive = (href) => {
    return pathname === href;
  };

  return (
    <nav className="bg-black text-white flex items-center justify-between pl-2 pr-6 py-5 w-full font-poppins sticky top-0 z-50">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link href="/" passHref>
          <div>
            <Image src="/4.png" alt="Logo" width={200} height={60} />
          </div>
        </Link>
      </div>

      {/* Botones en el centro */}
      <div className="flex flex-grow justify-center space-x-2 hidden md:flex">
        <Link 
          href="/"
          className={`transition duration-300 ease-in-out px-4 py-2 rounded-xl ${isActive('/') ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
        >
          Home
        </Link>
        <Link 
          href="/marketplace"
          className={`transition duration-300 ease-in-out px-4 py-2 rounded-xl ${isActive('/marketplace') ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
        >
          Marketplace
        </Link>
        <Link 
          href="/products"
          className={`transition duration-300 ease-in-out px-4 py-2 rounded-xl ${isActive('/products') ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
        >
          Products
        </Link>
        <Link 
          href="/events"
          className={`transition duration-300 ease-in-out px-4 py-2 rounded-xl ${isActive('/events') ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
        >
          Events
        </Link>
        <Link 
          href="/about"
          className={`transition duration-300 ease-in-out px-4 py-2 rounded-xl ${isActive('/about') ? 'bg-white text-black' : 'hover:bg-white hover:text-black'}`}
        >
          About
        </Link>
      </div>

      {/* Iconos de perfil y carrito */}
      <div className="flex-shrink-0 flex items-center space-x-2">
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
      </div>

      {/* Menú desplegable en móviles */}
      <div className="md:hidden flex items-center space-x-4">
        <button className="text-white">Menu</button>
      </div>
    </nav>
  );
};

export default Navbar;
