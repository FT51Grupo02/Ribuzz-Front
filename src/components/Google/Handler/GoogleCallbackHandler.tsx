'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Context/AuthContext';
import { IUser } from '@/interfaces/Types';

const GoogleCallbackHandler = () => {
  const router = useRouter();
  const { setToken, setUser } = useAuth();

  useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (code) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?code=${code}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            const token = data.accessToken;
            const user: IUser = {
              id: data.id,
              email: data.email,
              name: data.name,
              date: data.date,
              photo: data.photo,
            };

            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(token);
            setUser(user);

            router.push('/'); // Redirige a la página principal o a la ruta deseada
          } else {
            console.error('Error al obtener el token desde el backend');
          }
        } catch (error) {
          console.error('Error en la solicitud al backend:', error);
        }
      } else {
        console.error('Código de autenticación no encontrado en la URL');
      }
    };

    fetchToken();
  }, [router, setToken, setUser]);

  return <div>Procesando autenticación...</div>;
};

export default GoogleCallbackHandler;