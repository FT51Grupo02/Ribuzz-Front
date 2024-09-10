'use client'
import React, { useState } from 'react';
import CreateProduct from '../Forms/Create/CreateProducts'; 
import CreateEvent from '../Forms/Create/CreateEvent';
import CreateService from '../Forms/Create/CreateService';

const CreatePSE = () => {
  const [activeForm, setActiveForm] = useState<string | null>(null);

  const handleButtonClick = (formType: string) => {
    setActiveForm((prev) => prev === formType ? null : formType);
  };

  return (
    <div className='bg-black min-h-screen p-8 flex flex-col items-center'>
      <div className='flex space-x-4 mb-8'>
        <button
          onClick={() => handleButtonClick('product')}
          className="bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full"
        >
          Crear Producto
        </button>
        <button
          onClick={() => handleButtonClick('event')}
          className="bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full"
        >
          Crear Evento
        </button>
        <button
          onClick={() => handleButtonClick('service')}
          className="bg-gradient-to-r from-[#C87DAB] to-[#C12886] hover:shadow-lg text-white font-bold py-2 px-4 rounded-full"
        >
          Crear Servicio
        </button>
      </div>

      {activeForm === 'product' && <CreateProduct />}
      {activeForm === 'event' && <CreateEvent />}
      {activeForm === 'service' && <CreateService/>}
      
    </div>
  );
};

export default CreatePSE;

