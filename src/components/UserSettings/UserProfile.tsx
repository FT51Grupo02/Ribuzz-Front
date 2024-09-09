'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/Context/AuthContext';
import Image from 'next/image';

interface UserProfileFormProps {
  onSubmit: (values: { fullName: string; image: File | null }) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string>(user?.photo || 'https://res.cloudinary.com/devnzokpy/image/upload/v1725918379/0_vh4jdp.webp');

  useEffect(() => {
    if (user) {
      setImagePreview(user.photo || 'https://res.cloudinary.com/devnzokpy/image/upload/v1725918379/0_vh4jdp.webp');
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center">
      <div className="">
        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48">
            <Image
              src={imagePreview}
              alt="Perfil"
              layout="fill"
              objectFit="cover"
              className="rounded-full border-4 border-pink-600"
            />
          </div>
          <div className="mt-8 text-center">
            <label className="block text-xl font-semibold text-pink-500">
              Nombre:
            </label>
            <p className="mt-2 text-lg text-gray-300">{user?.name || 'Nombre de Usuario'}</p>
            <label className="block text-xl font-semibold text-pink-500 mt-4">
              Email:
            </label>
            <p className="mt-2 text-lg text-gray-300">{user?.email || 'Email de Usuario'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
