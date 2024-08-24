"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import CardProducts from '@/components/Cards/cardsproducts';
import SearchBar from '@/components/SearchBar/SearchBar';
import Paginator from '@/components/Paginator/Paginator';

const Marketplace: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3; // Ajustar este valor según la cantidad total de páginas

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Llamada a la API para cargar datos
  };

  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/14.jpg"
          alt="Background Image"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className="relative z-10 pb-10 shadow-2xl">
      <h2 className="max-sm:px-1 pt-3 text-center text-2xl md:text-3xl lg:text-4xl font-extralight text-black" style={{ fontFamily: 'Moonhouse, sans-serif', color: '#DADDE8', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3), -1px -1px 2px rgba(0, 0, 0, 0.3)' }}>
    El mejor <span style={{ color: '#00e1d4' }}>Marketplace</span> para Emprendedores
      </h2>
        <SearchBar />
        <CardProducts />
        <Paginator
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default Marketplace;
