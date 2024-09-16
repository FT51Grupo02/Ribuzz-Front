'use client';
import React, { useState } from 'react';
import { FaCalendarAlt, FaBoxOpen, FaUsers } from 'react-icons/fa';
import GestionDeEventos from './GestionDeEventos';
import GestionDeProductos from './GestionDeProductos';
import GestionDeServicios from './GestionDeServicios';

type ComponentName = 'eventos' | 'productos' | 'servicios';

const VariosComponentesAdmin: React.FC = () => {
  const [activeComponents, setActiveComponents] = useState<Record<ComponentName, boolean>>({
    eventos: false,
    productos: false,
    servicios: false,
  });

  const handleIconClick = (componentName: ComponentName) => {
    setActiveComponents((prevState) => ({
      ...prevState,
      [componentName]: !prevState[componentName],
    }));
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-4 text-white">
        <button
          className="flex items-center justify-center text-xl hover:text-pink-400 cursor-pointer w-full sm:w-auto"
          onClick={() => handleIconClick('servicios')}
        >
          <FaUsers size={35} className="mr-2 sm:mr-0 sm:mb-2" />
          <span className="sm:mt-2 xl:ml-2">Gestión de Servicios</span>
        </button>
        <button
          className="flex items-center justify-center text-xl hover:text-pink-400 cursor-pointer w-full sm:w-auto"
          onClick={() => handleIconClick('productos')}
        >
          <FaBoxOpen size={35} className="mr-2 sm:mr-0 sm:mb-2" />
          <span className="sm:mt-2 xl:ml-2">Gestión de Productos</span>
        </button>
        <button
          className="flex items-center justify-center text-xl hover:text-pink-400 cursor-pointer w-full sm:w-auto"
          onClick={() => handleIconClick('eventos')}
          >
          <FaCalendarAlt size={30} className="mr-2 sm:mr-0 sm:mb-2" />
          <span className="sm:mt-2 xl:ml-2">Gestión de Eventos</span>
        </button>
          </div>

      {activeComponents.eventos && <GestionDeEventos />}
      {activeComponents.productos && <GestionDeProductos />}
      {activeComponents.servicios && <GestionDeServicios />}
    </div>
  );
};

export default VariosComponentesAdmin;