'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { IUser, IRegisterProps, IRegisterResponse, ILoginPropsUser, ILoginPropsEntrep, IProduct, IService, IEvent } from "@/interfaces/Types";
import { loginEntrepreneurH as authLoginE, loginUserH as authLoginU, register as authRegister } from "@/helpers/auth.helper";
import { getAuthenticatedUser } from "@/helpers/user.helper";
import { createProduct } from "@/helpers/products.helper";
import { createService } from "@/helpers/services.helper";
import { createEvent } from "@/helpers/events.helper";
import Cookies from 'js-cookie';

export interface AuthContextProps {
    token: string | null;
    user: IUser | null;
    setToken: (token: string | null) => void;
    setUser: (user: IUser | null) => void;
    updateUser: (user: IUser) => void;
    loginEntrepeneurE: (loginData: ILoginPropsEntrep) => Promise<{ success: boolean; message?: string }>;
    loginUserC: (loginData: ILoginPropsUser) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    register: (registerData: IRegisterProps) => Promise<IRegisterResponse | null>;
    createProduct: (productData: IProduct) => Promise<IProduct>;
    createService: (serviceData: IService) => Promise<IService>;
    createEvent: (eventData: Omit<IEvent, 'id'>) => Promise<IEvent>;
    isAuthenticated: () => boolean;
}

export const AuthContext = createContext<AuthContextProps>({
    token: null,
    user: null,
    setToken: () => { throw new Error("setToken no inicializado"); },
    setUser: () => { throw new Error("setUser no inicializado"); },
    updateUser: () => { throw new Error("updateUser no inicializado"); },
    loginEntrepeneurE: async () => { throw new Error("login no inicializado"); },
    loginUserC: async () => { throw new Error("login no inicializado"); },
    logout: () => { throw new Error("logout no inicializado"); },
    register: async () => { throw new Error("register no inicializado"); },
    createProduct: async () => { throw new Error("createProduct no inicializado"); },
    createService: async () => { throw new Error("createService no inicializado"); },
    createEvent: async () => { throw new Error("createEvent no inicializado"); },
    isAuthenticated: () => false,
});

export interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const storedToken = Cookies.get('authToken');
        const storedUser = localStorage.getItem('authUser');
        if (storedToken) {
            setToken(storedToken);
        }
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    useEffect(() => {
        if (token) {
            Cookies.set('authToken', token, { expires: 7 }); // Cookie expira en 7 días
        } else {
            Cookies.remove('authToken');
        }
    }, [token]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('authUser', JSON.stringify(user));
        } else {
            localStorage.removeItem('authUser');
        }
    }, [user]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (token) {
                try {
                    const authenticatedUser = await getAuthenticatedUser(token);
                    if (authenticatedUser) {
                        setUser(authenticatedUser);
                    } else {
                        console.error('El usuario autenticado es null');
                    }
                } catch (error) {
                    console.error('Error al obtener el usuario autenticado:', error);
                }
            }
        };
        fetchUserData();
    }, [token]);

    const loginEntrepeneurE = async (userData: ILoginPropsEntrep): Promise<{ success: boolean; message?: string }> => {
        try {
            const sessionData = await authLoginE(userData);
            setToken(sessionData.token);
            setUser(sessionData.user);
            return { success: true };
        } catch (error) {
            console.error("Error en el login", error);
            return { success: false, message: 'Error en el inicio de sesión' };
        }
    };

    const loginUserC = async (userData: ILoginPropsUser): Promise<{ success: boolean; message?: string }> => {
        try {
            const sessionData = await authLoginU(userData);
            setToken(sessionData.token);
            setUser(sessionData.user);
            return { success: true };
        } catch (error) {
            console.error("Error en el login", error);
            return { success: false, message: 'Error en el inicio de sesión' };
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        Cookies.remove('authToken');
        localStorage.removeItem('authUser');
        localStorage.removeItem('cart');
    };

    const register = async (registerData: IRegisterProps): Promise<IRegisterResponse | null> => {
        try {
            const userData = await authRegister(registerData);
            return userData;
        } catch (error) {
            console.error("Error en el registro", error);
            return null;
        }
    };

    const updateUser = (updatedUser: IUser) => {
        setUser(updatedUser);
        localStorage.setItem('authUser', JSON.stringify(updatedUser));
    };

    const createProductContext = async (productData: IProduct): Promise<IProduct> => {
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        try {
            return await createProduct(token, productData);
        } catch (error) {
            console.error("Error al crear el producto", error);
            throw error;
        }
    };

    const createServiceContext = async (serviceData: IService): Promise<IService> => {
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        try {
            return await createService(token, serviceData);
        } catch (error) {
            console.error("Error al crear el servicio", error);
            throw error;
        }
    };

    const createEventContext = async (eventData: Omit<IEvent, 'id'>): Promise<IEvent> => {
        if (!token) {
            throw new Error('No hay token de autenticación');
        }
        try {
            return await createEvent(token, eventData);
        } catch (error) {
            console.error("Error al crear el evento", error);
            throw error;
        }
    };

    const isAuthenticated = () => {
        return !!token && !!user;
    };

    return (
        <AuthContext.Provider value={{ 
            token, 
            user, 
            setToken, 
            setUser, 
            updateUser, 
            loginEntrepeneurE, 
            loginUserC, 
            logout, 
            register,
            createProduct: createProductContext,
            createService: createServiceContext,
            createEvent: createEventContext,
            isAuthenticated
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);