'use client';
import React, { useState } from 'react';
import { FaCalendarAlt, FaBoxOpen, FaUsers } from 'react-icons/fa';
import GestionDeEventos from './GestionDeEventos';
import GestionDeProductos from './GestionDeProductos';
import GestionDeServicios from './GestionDeServicios';

type ComponentName = 'eventos' | 'productos' | 'servicios';

const VariosComponentesAdmin: React.FC = () => {
  // Estado para mantener la visibilidad de cada componente
  const [activeComponents, setActiveComponents] = useState<Record<ComponentName, boolean>>({
    eventos: false,
    productos: false,
    servicios: false,
  });

  const handleIconClick = (componentName: ComponentName) => {
    // Toggle visibility for the clicked component
    setActiveComponents((prevState) => ({
      ...prevState,
      [componentName]: !prevState[componentName],
    }));
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Iconos alineados horizontalmente y centrados */}
      <div className="flex space-x-6 mb-4 text-white">
        <div
          className="text-xl hover:text-pink-400 cursor-pointer"
          onClick={() => handleIconClick('eventos')}
        >
          <FaCalendarAlt size={24} />
          <span className="ml-2">Gestión de Eventos</span>
        </div>
        <div
          className="text-xl hover:text-pink-400 cursor-pointer"
          onClick={() => handleIconClick('productos')}
        >
          <FaBoxOpen size={24} />
          <span className="ml-2">Gestión de Productos</span>
        </div>
        <div
          className="text-xl hover:text-pink-400 cursor-pointer"
          onClick={() => handleIconClick('servicios')}
        >
          <FaUsers size={24} />
          <span className="ml-2">Gestión de Servicios</span>
        </div>
      </div>

      {/* Contenido desplegable */}
      {activeComponents.eventos && <GestionDeEventos />}
      {activeComponents.productos && <GestionDeProductos />}
      {activeComponents.servicios && <GestionDeServicios />}
    </div>
  );
};

export default VariosComponentesAdmin;
