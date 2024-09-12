'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { IUser, IRegisterProps, IRegisterResponse, ILoginPropsUSer, ILoginPropsEntrep, IProduct } from "@/interfaces/Types";
import { loginEntrepreneurH as authLoginE, loginUserH as authLoginU, register as authRegister } from "@/helpers/auth.helper";
import { getAuthenticatedUser } from "@/helpers/user.helper";
import { createProduct } from "@/helpers/products.helper";

export interface AuthContextProps {
    token: string | null;
    user: IUser | null;
    setToken: (token: string | null) => void;
    setUser: (user: IUser | null) => void;
    updateUser: (user: IUser) => void;
    loginEntrepeneurE: (loginData: ILoginPropsEntrep) => Promise<boolean>;
    loginUserC: (loginData: ILoginPropsUSer) => Promise<boolean>;
    logout: () => void;
    register: (registerData: IRegisterProps) => Promise<IRegisterResponse | null>;
    createProduct: (productData: IProduct) => Promise<IProduct>;
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
});

export interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [user, setUser] = useState<IUser | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
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
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
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

    const loginEntrepeneurE = async (userData: ILoginPropsEntrep): Promise<boolean> => {
        try {
            const sessionData = await authLoginE(userData);
            setToken(sessionData.token);
            setUser(sessionData.user);
            return true;
        } catch (error) {
            console.error("Error en el login", error);
            return false;
        }
    };

    const loginUserC = async (userData: ILoginPropsUSer): Promise<boolean> => {
        try {
            const sessionData = await authLoginU(userData);
            setToken(sessionData.token);
            setUser(sessionData.user);
            console.log(sessionData)
            return true;
        } catch (error) {
            console.error("Error en el login", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('authToken');
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
            createProduct: createProductContext 
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);