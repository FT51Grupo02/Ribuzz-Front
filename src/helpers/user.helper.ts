import { IUser, IUserSession, UserRole } from "@/interfaces/Types";

const APIURL = process.env.NEXT_PUBLIC_API_URL;

const decodeBase64Url = (str: string) => {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    return atob(str);
};

export const parseJwt = (token: string) => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) {
            throw new Error('Invalid JWT');
        }
        const payload = decodeBase64Url(parts[1]);
        console.log('Payload decodificado:', payload);
        return JSON.parse(payload);
    } catch (error) {
        console.error('Error al decodificar el token JWT:', error);
        throw new Error('Token JWT inválido');
    }
};

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
        console.log('Usuarios obtenidos en fetchUsers:', users);
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

        // Función para validar y convertir el rol
        const validateUserRole = (role: string): UserRole => {
            if (role === 'emprendedor' || role === 'cliente' || role === 'admin') {
                return role as UserRole;
            }
            throw new Error('Rol de usuario inválido');
        };

        const user: IUser = {
            id: decodedToken.id,
            email: decodedToken.correo,
            role: validateUserRole(decodedToken.rol),
            name: decodedToken.name,
            photo: decodedToken.photo
        };

        console.log('Usuario creado desde el token:', user);
        return user;
    } catch (error) {
        console.error('Error al obtener el usuario autenticado:', error);
        return null;
    }
};

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
        console.log('Perfil del usuario obtenido:', userProfile);
        return userProfile;
    } catch (error) {
        console.error('Error en la solicitud del perfil del usuario:', error);
        throw new Error('No se pudo recuperar el perfil del usuario');
    }
};