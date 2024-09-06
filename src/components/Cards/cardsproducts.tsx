"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Card from './card';
import { Product } from '@/components/Cards/types';

interface CardProductsProps {
  products?: Product[];
  loading: boolean;
  placeholder?: React.ReactNode; 
}

const CardProducts: React.FC<CardProductsProps> = ({ products = [], loading }) => {
  const router = useRouter();

  const handleCardClick = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        {/* Spinner de carga */}
        <div className="w-16 h-16 border-4 border-t-4 border-t-cyan-500 border-gray-200 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen px-4">
        <h2 className="text-white text-3xl md:text-5xl font-semibold drop-shadow-xl text-center">No hay productos disponibles</h2>
      </div>
    );
  }

  return (
    <div className="max-w-screen-lg mx-auto p-4 font-poppins">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="flex justify-center transition duration-300 transform hover:scale-105 rounded-lg overflow-hidden"
          >
            <Card
              name={product.name}
              price={product.price.toString()}
              image={product.images[0]} 
              rating={product.rating || 0} 
              description={product.description}
              onClick={() => handleCardClick(product.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardProducts;
