'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Context/AuthContext'; // Importa el contexto
import { IUser } from '@/interfaces/Types';

const GoogleCallbackHandler = () => {
  const router = useRouter();
  const { setToken, setUser } = useAuth(); // Usa el contexto de autenticación

  useEffect(() => {
    const handleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('token'); // Captura el token de la URL
      const role = urlParams.get('role');         // Captura el rol de la URL

      if (accessToken && role) {
        try {
          // Almacena el token en localStorage y el contexto
          localStorage.setItem('authToken', accessToken);
          setToken(accessToken);

          // Decodifica el token para extraer la información del usuario
          const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
          const user: IUser = {
            id: decodedToken.id,
            email: decodedToken.email,
            name: decodedToken.name || '',
            date: decodedToken.date || '',
            photo: decodedToken.picture || '',
            role: role,  // Asigna el rol capturado en la URL
          };

          // Almacena el usuario en localStorage y el contexto
          localStorage.setItem('authUser', JSON.stringify(user));
          setUser(user);

          // Redirige a la página principal o donde prefieras
          router.push('/');
        } catch (error) {
          console.error('Error al procesar el token:', error);
          router.push('/login'); // Redirigir a login si hay un error
        }
      } else {
        console.error('No se encontraron token o role en la URL');
        router.push('/login'); // Redirigir a login si no hay token o role
      }
    };

    handleAuth();
  }, [router, setToken, setUser]);

  return <div>Procesando autenticación...</div>;
};

export default GoogleCallbackHandler;
