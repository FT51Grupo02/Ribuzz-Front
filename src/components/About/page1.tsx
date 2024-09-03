'use client'

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const Page1 = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push('/services');
  };

  return (
    <div className="relative w-full flex flex-col items-center justify-start overflow-hidden">
      <div className="relative w-full flex flex-col md:flex-row md:py-32 sm:py-10">
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            poster="/1.png"
          >
            <source src="/background.mp4" type="video/mp4" />
            <source src="/background3.webm" type="video/webm" />
            Tu navegador no soporta el video.
          </video>
        </div>

        {/* Content Section */}
        <div className="relative z-10 flex flex-col justify-center p-6 md:w-1/2 md:ml-10 space-y-6 order-2 md:order-1">
          <h1 className="text-white text-4xl md:text-6xl font-bold">Diseñamos un espacio que te encantará</h1>
          <div className="h-1 bg-pink-400 w-1/4 md:w-1/6 mt-4 opacity-80"></div>
          <p className="text-white mt-2 mb-4 text-sm md:text-base">
            Nuestra misión es transformar la manera en que los emprendedores y los profesionales de negocios conectan no solo
            la persona que son con su proyecto, sino también colaboran y crecen con otras empresas/personas.
            A través de una plataforma innovadora y humana, buscamos empoderar a cada individuo para que pueda
            compartir sus ideas y alcanzar sus sueños, promoviendo una comunidad vibrante y solidaria.
          </p>
          <button
            type="button"
            onClick={handleClick}
            className="w-full sm:w-2/3 lg:w-1/2 p-3 text-white font-semibold rounded-xl bg-gradient-to-r from-[#C87DAB] to-[#C12886] shadow-md hover:shadow-lg transition-shadow text-sm md:text-base"
          >
            <span className="inline-block transition duration-300 hover:scale-110">
              Explorar servicios
            </span>
          </button>
        </div>

        {/* Image Section */}
        <div className="relative z-10 flex items-center justify-center md:w-1/2 order-1 md:order-2">
          <Image
            src="/card.png"
            alt="Card"
            width={300}
            height={300}
            quality={100}
            className="object-contain md:w-80 md:h-80 lg:w-auto lg:h-96"
          />
        </div>
      </div>
    </div>
  );
}

export default Page1;
