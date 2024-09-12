'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Context/AuthContext';
import { IUser, UserRole } from '@/interfaces/Types';

const GoogleCallbackHandler = () => {
  const router = useRouter();
  const { setToken, setUser } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('token');
      const roleString = urlParams.get('role');

      if (accessToken && roleString) {
        try {
          localStorage.setItem('authToken', accessToken);

          const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));

          // Función para validar si el role es válido
          const isValidUserRole = (role: string): role is UserRole => {
            return ['emprendedor', 'cliente', 'admin'].includes(role);
          };

          if (isValidUserRole(roleString)) {
            const role = roleString as UserRole;

            const user: IUser = {
              id: decodedToken.id,
              email: decodedToken.correo,
              name: decodedToken.name || '',
              date: decodedToken.date || '',
              photo: decodedToken.photo || '',
              role: role,
            };

            localStorage.setItem('user', JSON.stringify(user));
            
            setToken(accessToken);
            setUser(user);

            router.push('/');
          } else {
            console.error('Rol inválido');
            router.push('/login');
          }
        } catch (error) {
          console.error('Error al procesar el token:', error);
          router.push('/login');
        }
      } else {
        console.error('No se encontraron token o role en la URL');
        router.push('/login');
      }
    };

    handleAuth();
  }, [router, setToken, setUser]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="text-2xl font-bold text-gray-700 p-8 bg-white rounded-lg shadow-md">
        <span className="inline-block animate-spin mr-3">🔄</span>
        Procesando autenticación...
      </div>
    </div>
  );
};

export default GoogleCallbackHandler;