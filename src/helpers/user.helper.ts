import { IUser, IUserSession } from "@/interfaces/Types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

// Función para decodificar el token JWT manualmente
const decodeBase64Url = (str: string) => {
    // Convert Base64Url to Base64
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    // Decode Base64
    return atob(str);
};

export const parseJwt = (token: string) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT');
        }

        // Decode the payload (part 1 of the JWT)
        const payload = decodeBase64Url(parts[1]);
        console.log('Payload decodificado:', payload); 
        return JSON.parse(payload);
    } catch (error) {
        console.error('Error al decodificar el token JWT:', error);
        throw new Error('Token JWT inválido');
    }
};

// Función para obtener todos los usuarios
export const fetchUsers = async (token: string, page: number = 1, limit: number = 100): Promise<IUser[]> => {
  try {
      const response = await fetch(`${APIURL}/users?page=${page}&limit=${limit}`, {
          headers: {
              'Authorization': `Bearer ${token}`,
          },
      });
      if (!response.ok) {
          throw new Error('Error al recuperar los usuarios');
      }
      const users = await response.json();
      console.log('Usuarios obtenidos en fetchUsers:', users); // Verifica la lista de usuarios
      return users;
  } catch (error) {
      console.error('Error en la solicitud de usuarios:', error);
      throw new Error('No se pudieron recuperar los usuarios');
  }
};

export const fetchUsersId = async (id: string): Promise<IUser> => {
  try {
    const response = await fetch(`${APIURL}/users/${id}`);
    if (!response.ok) {
      throw new Error('Error al recuperar el usuario');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en la solicitud de usuario:', error);
    throw new Error('No se pudo recuperar el usuario');
  }
};

export const getAuthenticatedUser = (token: string): IUser | null => {
  try {
      const decodedToken: { id: string, correo: string, rol: string, name: string, photo: string } = parseJwt(token);

      // Aquí podrías construir el objeto de usuario basado en el token si ya tienes los datos del usuario
      const user: IUser = {
          id: decodedToken.id,
          email: decodedToken.correo,
          role: decodedToken.rol,
          name: decodedToken.name,
          photo: decodedToken.photo // Asegúrate de incluir la propiedad photo
          // Otros campos necesarios
      };

      console.log('Usuario creado desde el token:', user); // Verifica el usuario creado
      return user || null;
  } catch (error) {
      console.error('Error al obtener el usuario autenticado:', error);
      return null;
  }
};

// Helper para actualizar información
export const updateUserProfile = async (
  id: string, 
  data: { name: string; email: string; password: string; photo?: string }, 
  token: string
) => {
  try {
    const response = await fetch(`${APIURL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el perfil. Por favor, intenta de nuevo.');
    }

    const updatedUser = await response.json();
    return updatedUser;
  } catch (error) {
    console.error('Error en la solicitud de actualización:', error);
    throw error;
  }
};

// Función para obtener el perfil del usuario
export const getUserProfile = async (token: string): Promise<IUser> => {
  try {
    const response = await fetch(`${APIURL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Error al recuperar el perfil del usuario');
    }
    const userProfile = await response.json();
    console.log('Perfil del usuario obtenido:', userProfile); // Verifica el perfil del usuario
    return userProfile;
  } catch (error) {
    console.error('Error en la solicitud del perfil del usuario:', error);
    throw new Error('No se pudo recuperar el perfil del usuario');
  }
};