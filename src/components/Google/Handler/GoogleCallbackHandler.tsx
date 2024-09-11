'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/Context/AuthContext';
import { IUser } from '@/interfaces/Types';

const GoogleCallbackHandler = () => {
  const router = useRouter();
  const { setToken, setUser } = useAuth();

  useEffect(() => {
    const handleAuth = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get('token');  // Captura el token de la URL
      const role = urlParams.get('role');          // Captura el rol de la URL

      if (accessToken && role) {
        try {
          // Si es necesario, podrías realizar una solicitud adicional al backend para verificar el token, pero aquí lo omito
          // Suponiendo que ya tienes toda la información necesaria del token JWT

          // Almacena el token en localStorage
          localStorage.setItem('authToken', accessToken);

          // Decodifica el token si es necesario
          const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));

          const user: IUser = {
            id: decodedToken.id,
            email: decodedToken.correo,
            name: '',  
            date: '',  
            photo: '',  
            role: role,  
          };

          // Almacena el usuario en localStorage
          localStorage.setItem('user', JSON.stringify(user));
          
          // Actualiza el contexto de autenticación
          setToken(accessToken);
          setUser(user);

          // Redirige a la página principal
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

  return <div>Procesando autenticación...</div>; // Puedes reemplazar esto con un componente de carga o loader
};

export default GoogleCallbackHandler;