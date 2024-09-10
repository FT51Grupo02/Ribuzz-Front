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
      const accessToken = urlParams.get('token');  // Ajustar nombre del parámetro
      const role = urlParams.get('role');          // Ajustar nombre del parámetro
      
      if (accessToken && role) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?token=${accessToken}&role=${role}`, {
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
              role: data.rol,
            };
  
            localStorage.setItem('authToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            setToken(token);
            setUser(user);
  
            router.push('/');
          } else {
            console.error('Error al obtener la respuesta del backend');
          }
        } catch (error) {
          console.error('Error en la solicitud al backend:', error);
        }
      } else {
        console.error('No se encontraron token o role en la URL');
      }
    };
  
    fetchToken();
  }, [router, setToken, setUser]);

  return <div>Procesando autenticación...</div>; //modificar por el loader
};

export default GoogleCallbackHandler;
