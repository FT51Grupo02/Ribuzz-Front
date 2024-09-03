'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/Context/AuthContext';

interface UserProfileFormProps {
  onSubmit: (values: { fullName: string; image: File | null }) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ onSubmit }) => {
  const { user } = useAuth();
  const [imagePreview, setImagePreview] = useState<string>(user?.photo || '/0.png');

  useEffect(() => {
    if (user) {
      setImagePreview(user.photo || '/0.png');
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center">
      <div className="">
        <div className="flex flex-col items-center">
          <img
            src={imagePreview}
            alt="Perfil"
            className="w-50 h-48 object-cover rounded-full border-4 border-pink-600"
          />
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
