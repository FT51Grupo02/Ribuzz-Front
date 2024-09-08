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
      const accessToken = urlParams.get('accessToken');
      const role = urlParams.get('rol'); // rol que manda el backend

    /*   if (accessToken && role) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/callback?accessToken=${accessToken}&rol=${role}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }); */

          if (accessToken && role) {
            try {
              const response = await fetch(`http://localhost:3000/auth/google/callback?accessToken=${accessToken}&rol=${role}`, {
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
              role: data.rol,  // almacenamos el rol si es necesario
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
        console.error('No se encontraron accessToken o rol en la URL');
      }
    };

    fetchToken();
  }, [router, setToken, setUser]);

  return <div>Procesando autenticación...</div>; //modificar por el loader
};

export default GoogleCallbackHandler;
