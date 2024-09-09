'use client';

import React from 'react';
import UserProfileForm from './UserProfile';
import UpdateProfileForm from './UpdateProfile';
import Image from 'next/image';

const UserSettings: React.FC = () => {
  const handleUserProfileSubmit = (values: { fullName: string; image: File | null }) => {
    console.log('Perfil del usuario enviado:', values);
  };

  return (
    <div className="relative min-h-screen">
      {/* Imagen de fondo */}
      <Image
        src="https://res.cloudinary.com/devnzokpy/image/upload/v1725918379/0_vh4jdp.webp"
        alt="Background Image"
        layout="fill"
        objectFit="cover"
        quality={100}
        className="absolute inset-0 z-0"
      />

      {/* Contenido principal */}
      <div className="relative z-10 bg-black bg-opacity-75 text-gray-200 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <p className="mb-6">Bienvenido a la Configuración</p>

        <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 ">
          <div className="flex-1 border-opacity-50 p-4 border border-pink-400 rounded-md bg-black bg-opacity-80">
            <h3 className="text-xl font-semibold mb-8 flex flex-col items-center">Información de Perfil</h3>
            <UserProfileForm onSubmit={handleUserProfileSubmit} />
          </div>

          <div className="flex-1 border-opacity-50 p-4 border border-pink-400 rounded-md bg-black bg-opacity-80">
            <h3 className="text-xl font-semibold flex flex-col items-center">Actualizar mi Perfil</h3>
            <UpdateProfileForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
