'use client'
import React, { useState } from 'react';
import Image from 'next/image'; // Asegúrate de importar correctamente el componente de Next.js
import CreateProduct from '../Forms/Create/CreateProducts'; 
import CreateEvent from '../Forms/Create/CreateEvent';
import CreateService from '../Forms/Create/CreateService';

const CreatePSE = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const handleButtonClick = (formType: string) => {
    setActiveForm((prev) => (prev === formType ? null : formType));
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center">
      {/* Imagen de fondo */}
      <Image
        src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918382/18_cfqngv.webp"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="z-0"
      />

      {/* Capa de opacidad */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
      
      {/* Botones en la parte superior */}
      <div className="relative z-10 w-full flex justify-center py-8">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={() => handleButtonClick('service')}
            className="bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full"
          >
            <span className="inline-block text-white hover:scale-110 transition duration-300">
              Crear Servicio
            </span>
          </button>
          <button
            onClick={() => handleButtonClick('product')}
            className="bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full"
          >
            <span className="inline-block text-white hover:scale-110 transition duration-300">
              Crear Producto
            </span>
          </button>
          <button
            onClick={() => handleButtonClick('event')}
            className="bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full"
          >
            <span className="inline-block text-white hover:scale-110 transition duration-300">
              Crear Evento
            </span>
          </button>
        </div>
      </div>

      {/* Formularios en el centro de la pantalla */}
      <div className="relative z-10 w-full max-w-3xl flex-grow flex items-center justify-center">
        {activeForm === 'product' && <CreateProduct />}
        {activeForm === 'event' && <CreateEvent />}
        {activeForm === 'service' && <CreateService />}
      </div>
    </div>
  );
};

export default CreatePSE;
