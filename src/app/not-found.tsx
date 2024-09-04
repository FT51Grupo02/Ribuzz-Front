import React from 'react';
import Image from 'next/image';

const NotFoundPage = () => {
  return (
    <section className="relative flex items-center justify-center h-screen p-8 w-full font-poppins">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://res.cloudinary.com/devnzokpy/image/upload/v1725481344/3_pg8yhj.png"
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="object-center"
        />
      </div>
      <div className="relative z-10 container flex flex-col items-center">
        <div className="flex flex-col gap-6 max-w-md text-center">
          <h2 className="font-extrabold text-6xl md:text-9xl text-gray-100 drop-shadow-custom-dark">
            <span className="sr-only">Error</span> 404
          </h2>
          <p className="text-xl md:text-3xl text-gray-100 drop-shadow-custom-dark">No se encontró la página</p>
          <a
            href="/"
            className="px-6 py-3 text-lg md:text-xl font-semibold rounded bg-black text-gray-50 hover:text-white hover:filter hover:invert transition duration-300"
          >
            <span className="transition duration-300 hover:scale-110 inline-block">
              Vuelve al inicio
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default NotFoundPage;
